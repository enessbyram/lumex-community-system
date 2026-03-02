import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        // Sadece aktif (is_active = 1) duyuruları çek
        const [announcements]: any = await pool.query(`SELECT * FROM announcements WHERE is_active = 1 ORDER BY created_at DESC`);
        return NextResponse.json({ success: true, data: announcements });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: "Duyurular çekilemedi." }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const { id } = body;
        // Soft delete (Tamamen silmek yerine gizliyoruz ki veri kaybı olmasın)
        await pool.query(`UPDATE announcements SET is_active = 0 WHERE id = ?`, [id]);
        return NextResponse.json({ success: true, message: "Duyuru yayından kaldırıldı." });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Hata oluştu." }, { status: 500 });
    }
}