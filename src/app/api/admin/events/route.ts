import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        const [events]: any = await pool.query(`
            SELECT e.id, e.event_name as title, e.event_date, e.location, c.community_name, e.community_id
            FROM events e
            JOIN communities c ON e.community_id = c.id
            ORDER BY e.event_date ASC
        `);
        return NextResponse.json({ success: true, data: events });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: "Takvim verisi çekilemedi." }, { status: 500 });
    }
}