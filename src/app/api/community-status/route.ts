import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('user_id');
        const communityId = searchParams.get('community_id');

        if (!userId || !communityId) {
            return NextResponse.json({ success: false, message: "Eksik parametre" }, { status: 400 });
        }

        // 1. KONTROL: Bu adam zaten bu topluluğun üyesi mi? (Başkan vs. de bu tabloda yer alıyor)
        // DİKKAT: Sadece id'yi değil, role_id'yi de çekiyoruz!
        const [memberCheck]: any = await pool.query(
            `SELECT id, role_id FROM community_members WHERE user_id = ? AND community_id = ?`,
            [userId, communityId]
        );

        if (memberCheck.length > 0) {
            // Üyeyse status: 'member' ve ayrılma butonu kontrolü için role_id dönüyoruz
            return NextResponse.json({ 
                success: true, 
                status: "member", 
                role_id: memberCheck[0].role_id 
            });
        }

        // 2. KONTROL: Üye değilse, bekleyen başvurusu var mı?
        const [requestCheck]: any = await pool.query(
            `SELECT id FROM community_requests WHERE user_id = ? AND community_id = ? AND status = 'pending'`,
            [userId, communityId]
        );

        if (requestCheck.length > 0) {
            // Başvurusu varsa status: 'pending' dönüyoruz
            return NextResponse.json({ success: true, status: "pending", role_id: null });
        }

        // 3. Hiçbiri yoksa demek ki henüz başvurmamış
        return NextResponse.json({ success: true, status: "none", role_id: null });

    } catch (error: any) {
        console.error("Community Status API Hata:", error.message);
        return NextResponse.json({ success: false, message: "Sunucu hatası" }, { status: 500 });
    }
}