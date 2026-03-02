import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) return NextResponse.json({ success: false, message: "Kullanıcı ID gerekli." }, { status: 400 });

        // 1. Kullanıcının yönettiği topluluğu bul
        const [communityRes]: any = await pool.query(`
            SELECT community_id 
            FROM community_members 
            WHERE user_id = ? AND role_id != 11
            LIMIT 1
        `, [userId]);

        if (communityRes.length === 0) return NextResponse.json({ success: true, data: [] });

        const communityId = communityRes[0].community_id;

        // 2. Geçmiş etkinlikleri ve katılımcı sayısını çek (Tarihi bugünden küçük olanlar)
        const [events]: any = await pool.query(`
            SELECT 
                e.id, 
                e.event_name as name, 
                e.event_date, 
                e.location, 
                e.description,
                (SELECT COUNT(*) FROM event_participants ep WHERE ep.event_id = e.id) as participants
            FROM events e
            WHERE e.community_id = ? AND e.event_date < NOW()
            ORDER BY e.event_date DESC
        `, [communityId]);

        return NextResponse.json({ success: true, data: events });

    } catch (error: any) {
        console.error("Geçmiş Etkinlikler API Hata:", error.message);
        return NextResponse.json({ success: false, message: "Veriler çekilemedi." }, { status: 500 });
    }
}