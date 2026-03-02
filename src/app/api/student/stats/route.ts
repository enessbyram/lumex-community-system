import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ success: false, message: "Kullanıcı ID bulunamadı." }, { status: 400 });
        }

        // 1. Üyesi Olduğu Topluluk Sayısı
        const [memberRes]: any = await pool.query(
            'SELECT COUNT(*) as count FROM community_members WHERE user_id = ?', 
            [userId]
        );

        // 2. Bekleyen Başvurular (status alanının adının 'pending' olduğunu varsayıyoruz)
        const [pendingRes]: any = await pool.query(
            "SELECT COUNT(*) as count FROM community_requests WHERE user_id = ? AND status = 'pending'", 
            [userId]
        );

        // 3. Yaklaşan Etkinlikler (Üye olduğu toplulukların, bugünden ileri tarihli etkinlikleri)
        // Not: SKS onayladığında 'events' tablosuna eklendiği için doğrudan o tabloya bakıyoruz.
        const [eventRes]: any = await pool.query(`
            SELECT COUNT(e.id) as count 
            FROM events e
            JOIN community_members cm ON e.community_id = cm.community_id
            WHERE cm.user_id = ? AND e.event_date >= CURDATE()
        `, [userId]);

        return NextResponse.json({
            success: true,
            data: {
                member_count: memberRes[0].count,
                pending_count: pendingRes[0].count,
                event_count: eventRes[0].count
            }
        });

    } catch (error: any) {
        console.error("Öğrenci Stats API Hata:", error.message);
        return NextResponse.json({ success: false, message: "Veriler çekilirken sunucu hatası oluştu." }, { status: 500 });
    }
}