import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        // 1. Toplam Topluluk Sayısı
        const [communitiesRes]: any = await pool.query(`
            SELECT COUNT(*) as count FROM communities
        `);

        // 2. Toplam Üye Sayısı (DÜZELTME: Sadece benzersiz user_id'leri sayar)
        const [membersRes]: any = await pool.query(`
            SELECT COUNT(DISTINCT user_id) as count FROM community_members
        `);

        // 3. SKS (Admin) Onayı Bekleyen Etkinlikler
        const [eventsRes]: any = await pool.query(`
            SELECT COUNT(*) as count FROM applications 
            WHERE current_status = 'pending_admin'
        `);

        return NextResponse.json({
            success: true,
            data: {
                total_communities: communitiesRes[0].count,
                total_members: membersRes[0].count,
                pending_events: eventsRes[0].count,
                pending_documents: 0 // TODO: İleride belge tablosu kurulunca burası dinamik olacak
            }
        });

    } catch (error: any) {
        console.error("Admin Stats API Hata:", error.message);
        return NextResponse.json({ success: false, message: "Veriler çekilemedi." }, { status: 500 });
    }
}