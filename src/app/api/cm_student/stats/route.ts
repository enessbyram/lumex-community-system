import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ success: false, message: "Kullanıcı ID gerekli." }, { status: 400 });
        }

        // 1. DÜZELTME: role_id'si 11 (Normal Üye) OLMAYAN, yani yönetim kurulundan biri olduğu topluluğu buluyoruz.
        const [communityRes]: any = await pool.query(`
            SELECT community_id 
            FROM community_members 
            WHERE user_id = ? AND role_id != 11
            LIMIT 1
        `, [userId]);

        // Eğer bu kişi hiçbir topluluğun yönetiminde (1-10 arası rolde) değilse 0 döndür
        if (communityRes.length === 0) {
            return NextResponse.json({ 
                success: true, 
                data: { total_members: 0, pending_members: 0, pending_events: 0, total_events: 0 } 
            });
        }

        const communityId = communityRes[0].community_id;

        // 2. Bulunan topluluğun verilerini çek
        // TOPLAM ÜYE: role_id fark etmeksizin (başkan, yk, normal üye) o topluluktaki herkesi sayar.
        const [memberRes]: any = await pool.query('SELECT COUNT(*) as count FROM community_members WHERE community_id = ?', [communityId]);
        
        // BEKLEYEN ÜYE: community_requests tablosunda bu topluluk için onay bekleyenler
        const [pendingMembersRes]: any = await pool.query("SELECT COUNT(*) as count FROM community_requests WHERE community_id = ? AND status = 'pending'", [communityId]);
        
        // BEKLEYEN ETKİNLİK: applications tablosunda bu topluluk için onay bekleyen etkinlikler
        const [pendingEventsRes]: any = await pool.query("SELECT COUNT(*) as count FROM applications WHERE community_id = ? AND current_status = 'pending'", [communityId]);
        
        // ONAYLANMIŞ/TOPLAM ETKİNLİK: events tablosunda bu topluluğa ait etkinlikler
        const [totalEventsRes]: any = await pool.query("SELECT COUNT(*) as count FROM events WHERE community_id = ?", [communityId]);

        return NextResponse.json({
            success: true,
            data: {
                total_members: memberRes[0].count,
                pending_members: pendingMembersRes[0].count,
                pending_events: pendingEventsRes[0].count,
                total_events: totalEventsRes[0].count
            }
        });

    } catch (error: any) {
        console.error("CM Stats API Hata:", error.message);
        return NextResponse.json({ success: false, message: "Veriler çekilemedi." }, { status: 500 });
    }
}