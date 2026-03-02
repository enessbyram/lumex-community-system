import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM announcements WHERE is_active = 1 ORDER BY event_date DESC'
        );
        return NextResponse.json({ success: true, data: rows });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}