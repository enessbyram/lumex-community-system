import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        // Toplulukları, üye sayılarını ve etkinlik sayılarını alt sorgularla (Subquery) çekiyoruz
        const [communities]: any = await pool.query(`
            SELECT 
                c.id, 
                c.community_name as name, 
                c.type_id,
                (SELECT COUNT(*) FROM community_members cm WHERE cm.community_id = c.id) as memberCount,
                (SELECT COUNT(*) FROM events e WHERE e.community_id = c.id) as eventCount
            FROM communities c
            ORDER BY c.community_name ASC
        `);

        return NextResponse.json({ success: true, data: communities });
    } catch (error: any) {
        console.error("Admin Communities API Hata:", error.message);
        return NextResponse.json({ success: false, message: "Veriler çekilemedi." }, { status: 500 });
    }
}