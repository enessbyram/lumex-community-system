import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        // 1. Giriş yapanın topluluğunu ve KENDİ ROLÜNÜ bul
        const [communityRes]: any = await pool.query(`
            SELECT cm.community_id, mr.role_name 
            FROM community_members cm
            JOIN member_roles mr ON cm.role_id = mr.id
            WHERE cm.user_id = ? AND cm.role_id != 11 
            LIMIT 1
        `, [userId]);

        if (communityRes.length === 0) return NextResponse.json({ success: true, data: [] });
        
        const communityId = communityRes[0].community_id;
        const currentUserRole = communityRes[0].role_name; // Örn: 'Başkan', 'Sekreter' vs.

        // 2. Üyeleri Çek
        const [members]: any = await pool.query(`
            SELECT 
                cm.id as cm_id, u.id as user_id, u.full_name as name, u.email, 
                u.department, mr.role_name as role, cm.joined_at as date
            FROM community_members cm
            JOIN users u ON cm.user_id = u.id
            JOIN member_roles mr ON cm.role_id = mr.id
            WHERE cm.community_id = ?
            ORDER BY mr.id ASC, u.full_name ASC
        `, [communityId]);

        // 3. Dinamik Rolleri Çek (Veritabanındaki member_roles tablosundan)
        const [roles]: any = await pool.query(`SELECT id, role_name FROM member_roles ORDER BY id ASC`);

        return NextResponse.json({ 
            success: true, 
            data: members, 
            communityId, 
            roles, 
            currentUserRole 
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: "Hata oluştu." }, { status: 500 });
    }
}

export async function POST(req: Request) {
    // YENİ ÜYE EKLEME
    try {
        const body = await req.json();
        const { email, role, communityId } = body;

        const [userRes]: any = await pool.query(`SELECT id FROM users WHERE email = ?`, [email]);
        if (userRes.length === 0) return NextResponse.json({ success: false, message: "Bu e-posta adresine sahip bir öğrenci bulunamadı." }, { status: 404 });
        const targetUserId = userRes[0].id;

        const [memberCheck]: any = await pool.query(`SELECT id FROM community_members WHERE user_id = ? AND community_id = ?`, [targetUserId, communityId]);
        if (memberCheck.length > 0) return NextResponse.json({ success: false, message: "Bu öğrenci zaten topluluğa üye." }, { status: 400 });

        // Gönderilen rol_name üzerinden id'sini bul
        const [roleRes]: any = await pool.query(`SELECT id FROM member_roles WHERE role_name = ?`, [role]);
        const roleId = roleRes.length > 0 ? roleRes[0].id : 11; // Bulamazsa 11 (Normal Üye) yap

        await pool.query(`INSERT INTO community_members (user_id, community_id, role_id, joined_at) VALUES (?, ?, ?, NOW())`, [targetUserId, communityId, roleId]);

        return NextResponse.json({ success: true, message: "Üye başarıyla eklendi." });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Hata oluştu." }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    // ROL GÜNCELLEME
    try {
        const body = await req.json();
        const { cm_id, role } = body;

        const [roleRes]: any = await pool.query(`SELECT id FROM member_roles WHERE role_name = ?`, [role]);
        if (roleRes.length === 0) return NextResponse.json({ success: false, message: "Geçersiz rol." }, { status: 400 });

        await pool.query(`UPDATE community_members SET role_id = ? WHERE id = ?`, [roleRes[0].id, cm_id]);

        return NextResponse.json({ success: true, message: "Rol güncellendi." });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Hata oluştu." }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    // ÜYE SİLME
    try {
        const body = await req.json();
        const { cm_id } = body;
        await pool.query(`DELETE FROM community_members WHERE id = ?`, [cm_id]);
        return NextResponse.json({ success: true, message: "Üye topluluktan çıkarıldı." });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Hata oluştu." }, { status: 500 });
    }
}