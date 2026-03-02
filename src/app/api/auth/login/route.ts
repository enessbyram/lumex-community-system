import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: Request) {
    try {
        const { type, email, password } = await req.json();

        // 1. Adım: E-posta ve şifreye göre users tablosunda kullanıcıyı bul
        const [users]: any = await pool.query(
            'SELECT * FROM users WHERE email = ? AND password = ?',
            [email, password]
        );

        if (users.length === 0) {
            return NextResponse.json({ success: false, message: "E-posta veya şifre hatalı." });
        }

        const user = users[0];
        let redirectUrl = '/dashboard/student'; // Varsayılan yönlendirme

        // 2. Adım: Seçilen Sekmeye (type) Göre Rol Kontrolleri
        if (type === 'admin') {
            if (user.role !== 'admin') {
                return NextResponse.json({ success: false, message: "Bu alana sadece idari personeller giriş yapabilir." });
            }
            redirectUrl = '/dashboard/admin';
        } 
        else if (type === 'consultant') {
            if (user.role !== 'advisor') {
                return NextResponse.json({ success: false, message: "Bu alana sadece akademik danışmanlar giriş yapabilir." });
            }
            redirectUrl = '/dashboard/advisor';
        } 
        else if (type === 'student' || type === 'management') {
            if (user.role !== 'student') {
                return NextResponse.json({ success: false, message: "Bu alana sadece öğrenciler giriş yapabilir." });
            }

            // 3. Adım: Eğer 'Yönetim' (management) sekmesinden giriyorsa, kurul üyesi mi diye kontrol et!
            if (type === 'management') {
                // community_members tablosunda bu kullanıcının rolü 'Üye'den FARKLI bir rol mü diye bakıyoruz.
                // NOT: Eğer member_roles tablosundaki normal üye adın 'Üye' değilse (örn: 'Uye', 'Member'), aşağıdaki 'Üye' yazısını ona göre değiştir.
                const [managementCheck]: any = await pool.query(`
                    SELECT cm.id 
                    FROM community_members cm
                    JOIN member_roles mr ON cm.role_id = mr.id
                    WHERE cm.user_id = ? AND mr.role_name != 'Üye'
                    LIMIT 1
                `, [user.id]);

                if (managementCheck.length === 0) {
                    return NextResponse.json({ 
                        success: false, 
                        message: "Sadece topluluk yönetim kurulu üyeleri bu paneli kullanabilir." 
                    });
                }
                redirectUrl = '/dashboard/cm_student';
            } else {
                // Normal öğrenci girişi
                redirectUrl = '/dashboard/student';
            }
        }

        // 4. Adım: Her şey başarılıysa kullanıcı bilgilerini ve gideceği adresi gönder
        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role, // Veritabanındaki gerçek rolü
                loginType: type, // Hangi sekmeden girdiği
            },
            redirectUrl: redirectUrl
        });

    } catch (error: any) {
        console.error("Login API Hata:", error.message);
        return NextResponse.json({ success: false, message: "Sunucu hatası oluştu." }, { status: 500 });
    }
}