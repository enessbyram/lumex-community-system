import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM announcements WHERE event_date >= CURDATE() AND is_active = 1 ORDER BY event_date ASC LIMIT 4'
        );
        return NextResponse.json({ success: true, data: rows });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}