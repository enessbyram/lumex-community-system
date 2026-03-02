import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        const [rows]: any = await pool.query(`
            SELECT 
                c.id AS community_id, 
                c.community_name, 
                c.description, 
                c.logo_url AS logo,
                c.type_id,
                
                -- BAŞKAN: users tablosundan doğrudan ad-soyad çekiyoruz
                IFNULL((
                    SELECT u.full_name 
                    FROM users u 
                    WHERE u.id = c.president_member_id
                ), 'Belirlenmedi') AS president_name,
                
                -- DANIŞMAN: Çift unvan sorununu çözmek için sadece full_name'i çekiyoruz 
                -- (Çünkü users tablosuna zaten unvanıyla kaydedilmiş)
                IFNULL((
                    SELECT u.full_name 
                    FROM advisors a 
                    JOIN users u ON a.user_id = u.id 
                    WHERE a.id = c.advisor_id
                ), 'Belirlenmedi') AS advisor_name,
                
                -- ÜYE SAYISI: Sadece community_members tablosundaki kayıtları sayıyoruz
                (SELECT COUNT(*) FROM community_members cm WHERE cm.community_id = c.id) AS member_count
                
            FROM communities c
            WHERE c.status = 'active'
        `);

        return NextResponse.json({
            success: true,
            data: rows
        });
        
    } catch (error: any) {
        console.error("SQL HATA:", error.message);
        return NextResponse.json(
            { success: false, error: "Veritabanından bilgiler çekilemedi." }, 
            { status: 500 }
        );
    }
}