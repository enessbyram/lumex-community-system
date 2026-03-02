import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const community_id = searchParams.get('community_id');

        if (!community_id) {
            return NextResponse.json({ success: false, message: "Topluluk ID gerekli." }, { status: 400 });
        }

        // community_members tablosunu users (isim/mail) ve member_roles (rol adı) tablolarıyla birleştiriyoruz
        const [members]: any = await pool.query(`
            SELECT 
                cm.id as member_id, 
                u.full_name, 
                u.email, 
                u.department as student_number, 
                mr.role_name 
            FROM community_members cm
            JOIN users u ON cm.user_id = u.id
            JOIN member_roles mr ON cm.role_id = mr.id
            WHERE cm.community_id = ?
            ORDER BY mr.id ASC, u.full_name ASC
        `, [community_id]);

        return NextResponse.json({ success: true, data: members });
    } catch (error: any) {
        console.error("Community members API error:", error.message);
        return NextResponse.json({ success: false, message: "Veriler çekilemedi." }, { status: 500 });
    }
}