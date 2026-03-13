import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { user_id, community_id } = await request.json();

        if (!user_id || !community_id) {
            return NextResponse.json({ success: false, message: 'Eksik bilgi gönderildi.' }, { status: 400 });
        }

        // 1. Önce kullanıcının bu topluluktaki rolünü bulalım
        const [userCheck]: any = await pool.query(
            'SELECT role_id FROM community_members WHERE user_id = ? AND community_id = ?',
            [user_id, community_id]
        );

        if (userCheck.length === 0) {
            return NextResponse.json({ success: false, message: 'Üyelik kaydı bulunamadı.' });
        }

        const roleId = userCheck[0].role_id;

        // 2. Eğer rol 11 (Normal Üye) DEĞİLSE silme işlemini reddet!
        if (roleId !== 11) {
            return NextResponse.json({ 
                success: false, 
                message: 'Yönetim kurulu üyeleri topluluktan direkt olarak ayrılamaz. Lütfen danışmanınızla iletişime geçin.' 
            });
        }

        // 3. Rol 11 ise güvenle kaydı sil
        const [result]: any = await pool.query(
            'DELETE FROM community_members WHERE user_id = ? AND community_id = ? AND role_id = 11',
            [user_id, community_id]
        );

        if (result.affectedRows > 0) {
            return NextResponse.json({ success: true, message: 'Topluluktan başarıyla ayrıldınız.' });
        } else {
            return NextResponse.json({ success: false, message: 'İşlem başarısız oldu.' });
        }

    } catch (error) {
        console.error("Topluluktan ayrılma hatası:", error);
        return NextResponse.json({ success: false, message: 'Sunucu hatası oluştu.' }, { status: 500 });
    }
}