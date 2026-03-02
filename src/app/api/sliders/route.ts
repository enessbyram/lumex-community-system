import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM sliders WHERE is_active = 1 ORDER BY display_order ASC'
        );

        return NextResponse.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error("Slider Çekme Hatası:", error);
        return NextResponse.json(
            { success: false, message: "Veritabanı hatası oluştu." },
            { status: 500 }
        );
    }
}