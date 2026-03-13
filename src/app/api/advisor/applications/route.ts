import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// VERCEL'İN VERİYİ HAFIZADA TUTMASINI (CACHE) ENGELLER. HER ZAMAN GÜNCEL VERİ ÇEKER!
export const dynamic = 'force-dynamic';

// 1. BEKLEYEN TALEPLERİ ÇEK (GET)
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) return NextResponse.json({ success: false, message: "Kullanıcı ID gerekli." }, { status: 400 });

        // DOĞRU SORGUSU: Stats API'deki gibi advisors tablosu ile köprü kuruyoruz
        const [communities]: any = await pool.query(`
            SELECT c.id 
            FROM communities c
            JOIN advisors a ON c.advisor_id = a.id
            WHERE a.user_id = ?
        `, [userId]);

        if (communities.length === 0) return NextResponse.json({ success: true, data: [] });

        const communityIds = communities.map((c: any) => c.id);

        // O toplulukların 'pending_advisor' olan başvurularını çek
        const [applications]: any = await pool.query(`
            SELECT a.*, c.community_name 
            FROM applications a
            JOIN communities c ON a.community_id = c.id
            WHERE a.community_id IN (?) AND a.current_status = 'pending_advisor'
            ORDER BY a.created_at DESC
        `, [communityIds]);

        return NextResponse.json({ success: true, data: applications });
    } catch (error: any) {
        console.error("Advisor Applications GET Hata:", error.message);
        return NextResponse.json({ success: false, message: "Veriler çekilemedi." }, { status: 500 });
    }
}

// 2. ONAYLAMA VE REDDETME (PUT)
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        // action: 'approve' veya 'reject'
        const { applicationId, action, userId, rejectReason } = body;

        if (!applicationId || !action || !userId) {
            return NextResponse.json({ success: false, message: "Eksik parametre." }, { status: 400 });
        }

        let newStatus = '';
        let logReason = '';

        if (action === 'approve') {
            newStatus = 'pending_admin'; // Danışman onayladı, sıra SKS'de
            logReason = 'Danışman tarafından onaylandı ve SKS onayına iletildi.';
        } else if (action === 'reject') {
            newStatus = 'rejected_by_advisor'; // Danışman reddetti
            logReason = rejectReason || 'Danışman tarafından reddedildi.';
        } else {
            return NextResponse.json({ success: false, message: "Geçersiz işlem." }, { status: 400 });
        }

        // 1. Başvurunun ana durumunu güncelle
        await pool.query(`
            UPDATE applications 
            SET current_status = ?, updated_at = NOW() 
            WHERE id = ?
        `, [newStatus, applicationId]);

        // 2. Log tablosuna kayıt at
        await pool.query(`
            INSERT INTO application_status_log (application_id, status, changed_by, reason, created_at) 
            VALUES (?, ?, ?, ?, NOW())
        `, [applicationId, newStatus, userId, logReason]);

        return NextResponse.json({ success: true, message: action === 'approve' ? 'Başarı ile onaylandı.' : 'Başvuru reddedildi.' });
    } catch (error: any) {
        console.error("Advisor Applications PUT Hata:", error.message);
        return NextResponse.json({ success: false, message: "İşlem sırasında hata oluştu." }, { status: 500 });
    }
}