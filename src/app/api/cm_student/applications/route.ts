import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) return NextResponse.json({ success: false, message: "Kullanıcı ID gerekli." }, { status: 400 });

        const [communityRes]: any = await pool.query(`SELECT community_id FROM community_members WHERE user_id = ? AND role_id != 11 LIMIT 1`, [userId]);
        if (communityRes.length === 0) return NextResponse.json({ success: true, data: [] });

        const communityId = communityRes[0].community_id;

        const [applications]: any = await pool.query(`
            SELECT * FROM applications 
            WHERE community_id = ? 
            ORDER BY created_at DESC
        `, [communityId]);

        return NextResponse.json({ success: true, data: applications });
    } catch (error: any) {
        console.error("Etkinlik Başvuru GET Hata:", error.message);
        return NextResponse.json({ success: false, message: "Veriler çekilemedi." }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { 
            userId, title, event_type, event_date, event_time, 
            location, description, materials_needed, has_speaker, speaker_info, 
            has_stand, stand_details, stand_location, has_poster, poster_details, students, status 
        } = body;

        const [communityRes]: any = await pool.query(`
            SELECT community_id FROM community_members WHERE user_id = ? AND role_id != 11 LIMIT 1
        `, [userId]);

        if (communityRes.length === 0) {
            return NextResponse.json({ success: false, message: "Yönettiğiniz bir topluluk bulunamadı." }, { status: 403 });
        }
        const communityId = communityRes[0].community_id;

        if (status === 'pending_advisor' && (!title || !event_type || !event_date || !event_time || !location)) {
            return NextResponse.json({ success: false, message: "Onaya göndermek için yıldızlı (*) alanları doldurmalısınız." }, { status: 400 });
        }
        if (status === 'draft' && !title) {
            return NextResponse.json({ success: false, message: "Taslak kaydetmek için en azından Etkinlik Başlığı girmelisiniz." }, { status: 400 });
        }

        const finalMaterials = students && students.length > 0 
            ? `${materials_needed || ''}\n\n[KATILACAK ÖĞRENCİLER]: ${JSON.stringify(students)}`
            : materials_needed || '';

        await pool.query(`
            INSERT INTO applications (
                community_id, sent_by, title, event_type, event_date, event_time, 
                location, description, materials_needed, has_speaker, speaker_info, 
                has_stand, stand_details, stand_location, has_poster, poster_details, 
                current_status, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `, [
            communityId, userId, title || '', event_type || '', event_date || null, event_time || null,
            location || '', description || '', finalMaterials, 
            has_speaker === "Evet" ? 1 : 0, speaker_info || '',
            has_stand === "Evet" ? 1 : 0, stand_details || '', stand_location || '',
            has_poster === "Evet" ? 1 : 0, poster_details || '', status
        ]);

        const message = status === 'draft' ? "Etkinlik taslak olarak kaydedildi." : "Etkinlik onaya gönderildi.";
        return NextResponse.json({ success: true, message });
    } catch (error: any) {
        console.error("Etkinlik Başvuru POST Hata:", error.message);
        return NextResponse.json({ success: false, message: "İşlem sırasında hata oluştu." }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { 
            applicationId, title, event_type, event_date, event_time, 
            location, description, materials_needed, has_speaker, speaker_info, 
            has_stand, stand_details, stand_location, has_poster, poster_details, students, status 
        } = body;

        if (!applicationId) return NextResponse.json({ success: false, message: "Etkinlik ID bulunamadı." }, { status: 400 });

        if (status === 'pending_advisor' && (!title || !event_type || !event_date || !event_time || !location)) {
            return NextResponse.json({ success: false, message: "Onaya göndermek için yıldızlı (*) alanları doldurmalısınız." }, { status: 400 });
        }

        const finalMaterials = students && students.length > 0 
            ? `${materials_needed || ''}\n\n[KATILACAK ÖĞRENCİLER]: ${JSON.stringify(students)}`
            : materials_needed || '';

        await pool.query(`
            UPDATE applications SET 
                title = ?, event_type = ?, event_date = ?, event_time = ?, 
                location = ?, description = ?, materials_needed = ?, has_speaker = ?, speaker_info = ?, 
                has_stand = ?, stand_details = ?, stand_location = ?, has_poster = ?, poster_details = ?, 
                current_status = ?, updated_at = NOW()
            WHERE id = ?
        `, [
            title || '', event_type || '', event_date || null, event_time || null,
            location || '', description || '', finalMaterials, 
            has_speaker === "Evet" ? 1 : 0, speaker_info || '',
            has_stand === "Evet" ? 1 : 0, stand_details || '', stand_location || '',
            has_poster === "Evet" ? 1 : 0, poster_details || '', status, applicationId
        ]);

        const message = status === 'draft' ? "Taslak güncellendi." : "Etkinlik başarıyla onaya gönderildi.";
        return NextResponse.json({ success: true, message });
    } catch (error: any) {
        console.error("Etkinlik Başvuru PUT Hata:", error.message);
        return NextResponse.json({ success: false, message: "Güncellenirken hata oluştu." }, { status: 500 });
    }
}