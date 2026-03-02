import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) return NextResponse.json({ success: false, message: "Kullanıcı ID gerekli." }, { status: 400 });

        const [communityRes]: any = await pool.query(`
            SELECT c.id, c.community_name, c.description, c.logo_url 
            FROM community_members cm
            JOIN communities c ON cm.community_id = c.id
            WHERE cm.user_id = ? AND cm.role_id != 11
            LIMIT 1
        `, [userId]);

        if (communityRes.length === 0) return NextResponse.json({ success: false, message: "Topluluk bulunamadı." });

        return NextResponse.json({ success: true, data: communityRes[0] });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: "Hata oluştu." }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        // Artık JSON değil, FormData alıyoruz
        const formData = await req.formData();
        const communityId = formData.get('communityId') as string;
        const description = formData.get('description') as string;
        const logoFile = formData.get('logo') as File | null;

        if (!communityId) return NextResponse.json({ success: false, message: "Topluluk ID gerekli." }, { status: 400 });

        let logoFileName = null;

        // 1. EĞER YENİ BİR LOGO YÜKLENDİYSE
        if (logoFile && logoFile.size > 0) {
            const bytes = await logoFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Benzersiz bir dosya adı oluşturuyoruz (Örn: community_5_163831231.jpg)
            const ext = logoFile.name.split('.').pop();
            logoFileName = `community_${communityId}_${Date.now()}.${ext}`;
            
            // public/uploads/logos klasörünün yolunu belirliyoruz
            const uploadDir = path.join(process.cwd(), 'public/uploads/logos');
            
            // Klasör yoksa oluştur (Hata vermemesi için)
            try {
                await mkdir(uploadDir, { recursive: true });
            } catch (err) {
                // Klasör zaten varsa buraya düşer, sorun yok
            }

            // Dosyayı diske kaydediyoruz
            const filePath = path.join(uploadDir, logoFileName);
            await writeFile(filePath, buffer);
        }

        // 2. VERİTABANINI GÜNCELLE
        if (logoFileName) {
            // Hem logoyu hem açıklamayı güncelle
            await pool.query(`UPDATE communities SET description = ?, logo_url = ? WHERE id = ?`, [description, logoFileName, communityId]);
        } else {
            // Sadece açıklamayı güncelle
            await pool.query(`UPDATE communities SET description = ? WHERE id = ?`, [description, communityId]);
        }

        return NextResponse.json({ success: true, message: "Topluluk bilgileri güncellendi." });
    } catch (error: any) {
        console.error("Topluluk PUT Hata:", error.message);
        return NextResponse.json({ success: false, message: "Güncellenirken hata oluştu." }, { status: 500 });
    }
}