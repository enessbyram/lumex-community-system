import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ success: false, message: "Kullanıcı ID gerekli." }, { status: 400 });
        }

        // DÜZELTME BURADA: advisors tablosu ile köprü kurduk (a.user_id = 1024 -> a.id = 3 -> c.advisor_id = 3)
        const [communities]: any = await pool.query(`
            SELECT c.id 
            FROM communities c
            JOIN advisors a ON c.advisor_id = a.id
            WHERE a.user_id = ?
        `, [userId]);

        if (communities.length === 0) {
            return NextResponse.json({ 
                success: true, 
                data: { pending_requests: 0, approved_requests: 0, this_month_events: 0 } 
            });
        }

        const communityIds = communities.map((c: any) => c.id);

        const [pendingRes]: any = await pool.query(`
            SELECT COUNT(*) as count FROM applications 
            WHERE community_id IN (?) AND current_status = 'pending_advisor'
        `, [communityIds]);

        const [approvedRes]: any = await pool.query(`
            SELECT COUNT(*) as count FROM events 
            WHERE community_id IN (?)
        `, [communityIds]);

        const [thisMonthRes]: any = await pool.query(`
            SELECT COUNT(*) as count FROM events 
            WHERE community_id IN (?) 
            AND MONTH(event_date) = MONTH(CURRENT_DATE()) 
            AND YEAR(event_date) = YEAR(CURRENT_DATE())
        `, [communityIds]);

        return NextResponse.json({
            success: true,
            data: {
                pending_requests: pendingRes[0].count,
                approved_requests: approvedRes[0].count,
                this_month_events: thisMonthRes[0].count
            }
        });

    } catch (error: any) {
        console.error("Advisor Stats API Hata:", error.message);
        return NextResponse.json({ success: false, message: "Veriler çekilemedi." }, { status: 500 });
    }
}