import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// 1. SKS ONAYI BEKLEYENLERİ ÇEK (GET)
export async function GET() {
    try {
        const [applications]: any = await pool.query(`
            SELECT 
                a.*, 
                c.community_name, 
                u.full_name as sender_name 
            FROM applications a
            JOIN communities c ON a.community_id = c.id
            JOIN users u ON a.sent_by = u.id
            WHERE a.current_status = 'pending_admin'
            ORDER BY a.updated_at ASC
        `);

        return NextResponse.json({ success: true, data: applications });
    } catch (error: any) {
        console.error("Admin Applications GET Hata:", error.message);
        return NextResponse.json({ success: false, message: "Veriler çekilemedi." }, { status: 500 });
    }
}

// 2. ONAYLAMA VE REDDETME (PUT)
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { applicationId, action, userId, rejectReason } = body;

        if (!applicationId || !action || !userId) {
            return NextResponse.json({ success: false, message: "Eksik parametre." }, { status: 400 });
        }

        // Önce başvurunun detaylarını alıyoruz (events ve announcements tablolarına kopyalamak için)
        const [appRes]: any = await pool.query(`SELECT * FROM applications WHERE id = ?`, [applicationId]);
        if (appRes.length === 0) return NextResponse.json({ success: false, message: "Başvuru bulunamadı." }, { status: 404 });
        const app = appRes[0];

        let newStatus = '';
        let logReason = '';

        if (action === 'approve') {
            newStatus = 'approved';
            logReason = 'SKS tarafından onaylandı ve yayına alındı.';

            // --- 1. OTOMASYON: ONAYLANAN ETKİNLİĞİ "events" TABLOSUNA EKLE ---
            await pool.query(`
                INSERT INTO events (community_id, event_name, event_date, location, description, image_url, created_at) 
                VALUES (?, ?, ?, ?, ?, NULL, NOW())
            `, [app.community_id, app.title, app.event_date, app.location, app.description]);

            // --- 2. OTOMASYON: "announcements" (DUYURULAR) TABLOSUNA EKLE ---
            await pool.query(`
                INSERT INTO announcements (community_id, application_id, title, content, image_url, event_date, event_time, location, is_active, created_at) 
                VALUES (?, ?, ?, ?, NULL, ?, ?, ?, 1, NOW())
            `, [app.community_id, app.id, app.title, app.description, app.event_date, app.event_time, app.location]);

        } else if (action === 'reject') {
            newStatus = 'rejected_by_admin';
            logReason = rejectReason || 'SKS tarafından reddedildi.';
        } else {
            return NextResponse.json({ success: false, message: "Geçersiz işlem." }, { status: 400 });
        }

        // 3. Başvurunun durumunu güncelle
        await pool.query(`
            UPDATE applications SET current_status = ?, updated_at = NOW() WHERE id = ?
        `, [newStatus, applicationId]);

        // 4. application_status_log tablosuna işlem kaydı at
        await pool.query(`
            INSERT INTO application_status_log (application_id, status, changed_by, reason, created_at) 
            VALUES (?, ?, ?, ?, NOW())
        `, [applicationId, newStatus, userId, logReason]);

        return NextResponse.json({ success: true, message: action === 'approve' ? 'Etkinlik başarıyla onaylandı ve yayına alındı.' : 'Etkinlik reddedildi.' });
    } catch (error: any) {
        console.error("Admin Applications PUT Hata:", error.message);
        return NextResponse.json({ success: false, message: "İşlem sırasında hata oluştu." }, { status: 500 });
    }
}