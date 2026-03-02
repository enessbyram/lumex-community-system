import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ success: false, message: "Kullanıcı ID gerekli." }, { status: 400 });
        }

        // Kullanıcının üye olduğu toplulukları, rollerini ve katılım tarihlerini birleştirip çekiyoruz
        const [rows]: any = await pool.query(`
            SELECT 
                c.id, 
                c.community_name as name, 
                mr.role_name as role, 
                cm.joined_at as joinedAt
            FROM community_members cm
            JOIN communities c ON cm.community_id = c.id
            JOIN member_roles mr ON cm.role_id = mr.id
            WHERE cm.user_id = ?
            ORDER BY cm.joined_at DESC
        `, [userId]);

        return NextResponse.json({ success: true, data: rows });
        
    } catch (error: any) {
        console.error("Öğrenci Toplulukları API Hata:", error.message);
        return NextResponse.json({ success: false, message: "Veriler çekilemedi." }, { status: 500 });
    }
}