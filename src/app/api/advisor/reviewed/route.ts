import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) return NextResponse.json({ success: false, message: "Kullanıcı ID gerekli." }, { status: 400 });

        // 1. Hocanın danışmanı olduğu toplulukları bul
        const [communities]: any = await pool.query(`
            SELECT c.id 
            FROM communities c 
            JOIN advisors a ON c.advisor_id = a.id 
            WHERE a.user_id = ?
        `, [userId]);

        if (communities.length === 0) return NextResponse.json({ success: true, data: [] });
        const communityIds = communities.map((c: any) => c.id);

        // 2. Taslak (draft) ve Danışman Onayı Bekleyen (pending_advisor) HARİÇ her şeyi çek
        // Reddedilmişse sebebini application_status_log tablosundan (en son kaydı) getir.
        const [reviewedEvents]: any = await pool.query(`
            SELECT 
                a.id, 
                a.title, 
                a.event_type, 
                c.community_name, 
                a.event_date, 
                a.event_time, 
                a.current_status, 
                a.updated_at,
                (
                    SELECT reason 
                    FROM application_status_log 
                    WHERE application_id = a.id AND status = 'rejected_by_advisor' 
                    ORDER BY created_at DESC LIMIT 1
                ) as rejectReason
            FROM applications a
            JOIN communities c ON a.community_id = c.id
            WHERE a.community_id IN (?) 
              AND a.current_status NOT IN ('draft', 'pending_advisor')
            ORDER BY a.updated_at DESC
        `, [communityIds]);

        return NextResponse.json({ success: true, data: reviewedEvents });
    } catch (error: any) {
        console.error("Advisor Reviewed Applications GET Hata:", error.message);
        return NextResponse.json({ success: false, message: "Veriler çekilemedi." }, { status: 500 });
    }
}