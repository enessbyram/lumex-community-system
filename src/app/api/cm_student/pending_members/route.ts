import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// LİSTELEME İŞLEMİ
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ success: false, message: "Kullanıcı ID gerekli." }, { status: 400 });
        }

        // 1. Giriş yapan kişinin yönettiği topluluğu bul
        const [communityRes]: any = await pool.query(`
            SELECT community_id 
            FROM community_members 
            WHERE user_id = ? AND role_id != 11
            LIMIT 1
        `, [userId]);

        if (communityRes.length === 0) {
            return NextResponse.json({ success: true, data: [] }); // Yönettiği topluluk yoksa boş liste
        }

        const communityId = communityRes[0].community_id;

        // 2. O topluluğa ait bekleyen başvuruları users tablosuyla birleştirip çek
        const [requests]: any = await pool.query(`
            SELECT 
                cr.id, 
                u.full_name as name, 
                u.email, 
                cr.request_date as date,
                cr.user_id,
                cr.community_id
            FROM community_requests cr
            JOIN users u ON cr.user_id = u.id
            WHERE cr.community_id = ? AND cr.status = 'pending'
            ORDER BY cr.request_date ASC
        `, [communityId]);

        return NextResponse.json({ success: true, data: requests });
        
    } catch (error: any) {
        console.error("Bekleyen Üyeler API GET Hata:", error.message);
        return NextResponse.json({ success: false, message: "Veriler çekilemedi." }, { status: 500 });
    }
}

// ONAY / RED İŞLEMİ
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { requestId, action, userId, communityId } = body; 
        // action: 'approve' veya 'reject'

        if (!requestId || !action) {
            return NextResponse.json({ success: false, message: "Eksik parametre." }, { status: 400 });
        }

        if (action === 'approve') {
            // 1. Başvuru durumunu onayla
            await pool.query(`UPDATE community_requests SET status = 'approved', updated_at = NOW() WHERE id = ?`, [requestId]);
            
            // 2. Kullanıcıyı topluluğa "Normal Üye" (role_id = 11) olarak ekle
            // Sende joined_at mi, created_at mi kullanılıyor tablo yapına göre düzelt (Ben NOW() koydum)
            await pool.query(`
                INSERT INTO community_members (user_id, community_id, role_id) 
                VALUES (?, ?, 11)
            `, [userId, communityId]);

        } else if (action === 'reject') {
            // Başvuruyu reddet
            await pool.query(`UPDATE community_requests SET status = 'rejected', updated_at = NOW() WHERE id = ?`, [requestId]);
        }

        return NextResponse.json({ success: true, message: `İşlem başarılı (${action})` });

    } catch (error: any) {
        console.error("Bekleyen Üyeler API POST Hata:", error.message);
        return NextResponse.json({ success: false, message: "İşlem sırasında hata oluştu." }, { status: 500 });
    }
}