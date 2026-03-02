import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// PROFİL BİLGİLERİNİ GETİR
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ success: false, message: "Kullanıcı ID gerekli." }, { status: 400 });
        }

        // 'student_number' yerine var olan 'department' kolonunu çekiyoruz.
        const [rows]: any = await pool.query(`
            SELECT full_name, department, email 
            FROM users 
            WHERE id = ?
        `, [userId]);

        if (rows.length === 0) {
            return NextResponse.json({ success: false, message: "Kullanıcı bulunamadı." }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: rows[0] });
        
    } catch (error: any) {
        console.error("Profil API GET Hata:", error.message);
        return NextResponse.json({ success: false, message: "Veriler çekilemedi." }, { status: 500 });
    }
}

// ŞİFRE GÜNCELLE
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, currentPassword, newPassword } = body;

        if (!userId || !currentPassword || !newPassword) {
            return NextResponse.json({ success: false, message: "Lütfen tüm alanları doldurun." }, { status: 400 });
        }

        // 1. Önce mevcut şifrenin doğru olup olmadığını kontrol et
        const [users]: any = await pool.query(`SELECT password FROM users WHERE id = ?`, [userId]);
        
        if (users.length === 0) {
            return NextResponse.json({ success: false, message: "Kullanıcı bulunamadı." }, { status: 404 });
        }

        // Not: Gerçek projelerde burada bcrypt.compare() kullanılır. Şimdilik düz metin eşleşmesi yapıyoruz.
        if (users[0].password !== currentPassword) {
            return NextResponse.json({ success: false, message: "Mevcut şifreniz yanlış." }, { status: 400 });
        }

        // 2. Şifre doğruysa yeni şifreyi güncelle (Gerçekte bcrypt.hash() kullanılmalı)
        await pool.query(`UPDATE users SET password = ? WHERE id = ?`, [newPassword, userId]);

        return NextResponse.json({ success: true, message: "Şifreniz başarıyla güncellendi!" });

    } catch (error: any) {
        console.error("Profil API POST Hata:", error.message);
        return NextResponse.json({ success: false, message: "Şifre güncellenirken hata oluştu." }, { status: 500 });
    }
}