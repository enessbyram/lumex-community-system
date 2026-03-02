import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function GET() {
    try {
        const [sliders]: any = await pool.query(`SELECT * FROM sliders WHERE is_active = 1 ORDER BY display_order ASC`);
        return NextResponse.json({ success: true, data: sliders });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: "Slider verisi çekilemedi." }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const title = formData.get('title') as string;
        const subtitle = formData.get('subtitle') as string;
        const button_link = formData.get('button_link') as string;
        const imageFile = formData.get('image') as File;

        if (!imageFile) return NextResponse.json({ success: false, message: "Görsel zorunludur." }, { status: 400 });

        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const ext = imageFile.name.split('.').pop();
        const fileName = `slider_${Date.now()}.${ext}`;
        
        const uploadDir = path.join(process.cwd(), 'public/uploads/sliders');
        try { await mkdir(uploadDir, { recursive: true }); } catch (err) {}
        
        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, buffer);

        await pool.query(`
            INSERT INTO sliders (image_url, title, subtitle, button_link, display_order, is_active, created_at) 
            VALUES (?, ?, ?, ?, 1, 1, NOW())
        `, [fileName, title || '', subtitle || '', button_link || '']);

        return NextResponse.json({ success: true, message: "Görsel eklendi." });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Görsel yüklenirken hata oluştu." }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const { id } = body;
        await pool.query(`UPDATE sliders SET is_active = 0 WHERE id = ?`, [id]);
        return NextResponse.json({ success: true, message: "Görsel silindi." });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Hata oluştu." }, { status: 500 });
    }
}