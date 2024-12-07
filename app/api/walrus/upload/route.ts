import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';  // Import uuidv4 to generate UUIDs

// Set up the PostgreSQL connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Ensure this environment variable is set
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false, // Use SSL in production
});

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const walletAddress = formData.get('wallet_address') as string;
        const accountId = formData.get('accountId') as string;
        const file_name = formData.get('file_name') as string;

        if (!file || !walletAddress || !accountId) {
            console.error('Missing required fields:', { file: !!file, ownerId, accountId });
            return NextResponse.json({ error: 'File, ownerId, and accountId are required.' }, { status: 400 });
        }

        const publisherUrl = process.env.PUBLISHER || 'https://publisher.walrus-testnet.walrus.space';

        console.log('Uploading file to publisher:', publisherUrl);
        const uploadResponse = await fetch(`${publisherUrl}/v1/store?epochs=5`, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': 'application/octet-stream',
            },
        });

        if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            console.error('Publisher upload failed:', uploadResponse.status, errorText);
            return NextResponse.json({ error: 'Failed to upload the file to the publisher.' }, { status: uploadResponse.status });
        }

        const data = await uploadResponse.json();
        const blobId = data?.newlyCreated?.blobObject?.blobId ?? data?.alreadyCertified?.blobId;

        if (!blobId) {
            console.error('Missing blobId in publisher response:', data);
            return NextResponse.json({ error: 'Failed to retrieve blob ID from the publisher response.' }, { status: 500 });
        }

        // Generate a new UUID for the upload
        const uid = uuidv4();

        // Insert the blobId into PostgreSQL database
        const client = await pool.connect();
        try {
            const result = await client.query(
                'INSERT INTO file_uploads (id, blob_id, wallet_address,file_name,created_at) VALUES ($1, $2, $3, $4,$5) RETURNING id',
                [uid, blobId, walletAddress,file_name, new Date()]
            );

            const insertedId = result.rows[0].id;
            console.log('BlobId inserted into the database with id:', insertedId);

            return NextResponse.json({ message: 'File uploaded successfully and blobId stored.', blobId });
        } catch (dbError) {
            console.error('Error inserting into database:', dbError);
            return NextResponse.json({ error: 'Database insertion failed.' }, { status: 500 });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Unexpected error in upload route:', error);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}
