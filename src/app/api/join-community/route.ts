import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { user_id, community_id } = body;

        if (!user_id || !community_id) {
            return NextResponse.json({ success: false, message: "Eksik bilgi gönderildi." }, { status: 400 });
        }

        // 1. KONTROL: Bu kullanıcı zaten bu topluluğun üyesi mi?
        const [memberCheck]: any = await pool.query(
            `SELECT id FROM community_members WHERE user_id = ? AND community_id = ?`,
            [user_id, community_id]
        );

        if (memberCheck.length > 0) {
            return NextResponse.json({ success: false, message: "Zaten bu topluluğun üyesisiniz." }, { status: 400 });
        }

        // 2. KONTROL: Bu kullanıcının zaten bekleyen bir başvurusu var mı?
        const [requestCheck]: any = await pool.query(
            `SELECT id FROM community_requests WHERE user_id = ? AND community_id = ? AND status = 'pending'`,
            [user_id, community_id]
        );

        if (requestCheck.length > 0) {
            return NextResponse.json({ success: false, message: "Zaten bekleyen bir başvurunuz bulunuyor." }, { status: 400 });
        }

        // 3. İŞLEM: Yeni başvuru kaydını oluştur
        // DÜZELTME: created_at yerine senin tablonuzdaki request_date kolonunu kullanıyoruz
        await pool.query(
            `INSERT INTO community_requests (user_id, community_id, status, request_date) VALUES (?, ?, 'pending', NOW())`,
            [user_id, community_id]
        );

        return NextResponse.json({ success: true, message: "Başvurunuz başarıyla alındı!" });

    } catch (error: any) {
        console.error("Topluluk Başvuru API Hata:", error.message);
        return NextResponse.json({ success: false, message: "Sunucu hatası oluştu." }, { status: 500 });
    }
}