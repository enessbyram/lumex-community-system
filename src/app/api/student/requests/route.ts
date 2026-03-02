import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ success: false, message: "Kullanıcı ID gerekli." }, { status: 400 });
        }

        // DÜZELTME: created_at yerine senin tablodaki request_date kolonunu yazdık!
        const [rows]: any = await pool.query(`
            SELECT 
                cr.id, 
                c.community_name as name, 
                cr.status, 
                cr.request_date as date
            FROM community_requests cr
            JOIN communities c ON cr.community_id = c.id
            WHERE cr.user_id = ?
            ORDER BY cr.request_date DESC
        `, [userId]);

        return NextResponse.json({ success: true, data: rows });
        
    } catch (error: any) {
        console.error("Öğrenci Başvuruları API Hata:", error.message);
        return NextResponse.json({ success: false, message: "Veriler çekilemedi." }, { status: 500 });
    }
}