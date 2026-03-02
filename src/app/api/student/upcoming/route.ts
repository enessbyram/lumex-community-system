import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ success: false, message: "Kullanıcı ID gerekli." }, { status: 400 });
        }

        // 1. Üye olunan toplulukların yaklaşan etkinliklerini çek
        // 2. 'event_participants' (veya benzeri) tablosundan kullanıcının katılıp katılmadığını ('is_joined') kontrol et
        // 3. Yine aynı tablodan o etkinliğe katılan toplam kişi sayısını ('participant_count') bul
        const [rows]: any = await pool.query(`
            SELECT 
                e.id as event_id, 
                e.event_name, 
                e.event_date, 
                e.location, 
                e.description, 
                e.image_url,
                c.community_name,
                (SELECT COUNT(*) FROM event_participants ep WHERE ep.event_id = e.id) as participant_count,
                (SELECT COUNT(*) FROM event_participants ep WHERE ep.event_id = e.id AND ep.user_id = ?) as is_joined
            FROM events e
            JOIN community_members cm ON e.community_id = cm.community_id
            JOIN communities c ON e.community_id = c.id
            WHERE cm.user_id = ? AND e.event_date >= NOW()
            ORDER BY e.event_date ASC
        `, [userId, userId]);

        // is_joined değerini boolean'a (0 ise false, 1 ise true) çevirelim
        const formattedRows = rows.map((row: any) => ({
            ...row,
            is_joined: row.is_joined > 0
        }));

        return NextResponse.json({ success: true, data: formattedRows });
        
    } catch (error: any) {
        console.error("Öğrenci Yaklaşan Etkinlikler API Hata:", error.message);
        return NextResponse.json({ success: false, message: "Veriler çekilemedi." }, { status: 500 });
    }
}