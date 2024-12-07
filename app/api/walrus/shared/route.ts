import { NextRequest, NextResponse } from 'next/server';
import {Pool} from "pg";
import {v4 as uuidv4} from "uuid";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Ensure this environment variable is set
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false, // Use SSL in production
});
export async function GET(request: NextRequest) {
    const wallet_address = request.nextUrl.searchParams.get('wallet_address');

    try {

        const client = await pool.connect();
        try {
            const result = await client.query(
                `select * from shared where wallet_address = '${wallet_address}'`,
            );

            return NextResponse.json({ message: 'File uploaded successfully and blobId stored.', result });
        } catch (dbError) {
            console.error('Error inserting into database:', dbError);
            return NextResponse.json({ error: 'Database insertion failed.' }, { status: 500 });
        } finally {
            client.release();
        }



    } catch (error) {
        console.error('Error fetching from blob API:', error);
        return NextResponse.json({ error: 'Failed to fetch data from Walrus API' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { blob_id, wallet_address , file_name} = await request.json();

        // Check if blob_id and wallet_address are provided
        if (!blob_id || !wallet_address) {
            console.error('Missing required fields:', { blob_id, wallet_address });
            return NextResponse.json({ error: 'blob_id and wallet_address are required.' }, { status: 400 });
        }

        // Generate a new UUID for the upload
        const uid = uuidv4();

        // Insert the blobId into PostgreSQL database
        const client = await pool.connect();
        try {
            const result = await client.query(
                'INSERT INTO shared (id,blob_id, wallet_address, file_name ,created_at) VALUES ($1, $2, $3,$4,$5) RETURNING id',
                [uid,blob_id, wallet_address, file_name,new Date()]
            );

            const insertedId = result.rows[0].id;

            return NextResponse.json({ message: 'Blob ID stored successfully.', blobId: blob_id });
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
