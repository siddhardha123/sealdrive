import { NextRequest, NextResponse } from 'next/server';
import {Pool} from "pg";

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
                `select * from file_uploads where wallet_address = '${wallet_address}'`,
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

