"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LogIn, LogOut, LayoutDashboard } from 'lucide-react'; 
import logo from '../images/logo.png'; // Yolun projene uygun olduğundan emin ol
import LoginPopup from '@/components/auth/LoginPopup';

const Header = () => {
    const pathname = usePathname(); 
    const router = useRouter();

    const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Kullanıcı verisi okunamadı", error);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        router.push("/"); 
    };

    // KULLANICI ROLÜNE GÖRE DOĞRU DASHBOARD LİNKİNİ BULAN FONKSİYON
    const getDashboardLink = () => {
        if (!user) return "/";
        
        // Login API'den dönen loginType veya veritabanındaki role göre karar veriyoruz
        if (user.loginType === 'management') return '/dashboard/cm_student';
        if (user.loginType === 'consultant' || user.role === 'advisor') return '/dashboard/advisor';
        if (user.loginType === 'admin' || user.role === 'admin') return '/dashboard/admin';
        
        // Standart öğrenci (default)
        return '/dashboard/student';
    };

    return (
        <>
            <header className="w-full bg-linear-to-r from-(--color-lumex-purple-deep) to-(--color-lumex-purple-main) h-28 shadow-lg flex items-center justify-center">
                <div className="container flex justify-between items-center px-4">

                    {/* Logo ve Başlık */}
                    <div className='flex flex-row items-center gap-4'>
                        <Link href="/" className='h-20 w-20 bg-(--color-lumex-light) flex justify-center items-center rounded-full cursor-pointer shadow-md transition-transform hover:scale-105 overflow-hidden border-2 border-(--color-lumex-purple-light)'>
                            <Image 
                                src={logo} 
                                alt="Lumex Logo" 
                                className='h-full w-full object-contain p-2' 
                            />
                        </Link>
                        <div className='flex flex-col'>
                            <h1 className='font-bold text-xl text-(--color-lumex-light) tracking-wide'>
                                Lumex Üniversitesi
                            </h1>
                            <h3 className='text-sm md:text-lg text-(--color-lumex-light)/80 font-medium'>
                                Öğrenci Toplulukları Bilgi Sistemi
                            </h3>
                        </div>
                    </div>

                    {/* Navigasyon ve Butonlar */}
                    <div className='flex flex-row text-(--color-lumex-light) gap-6 text-md items-center'>
                        <Link
                            href="/"
                            className={`cursor-pointer transition-colors pb-1 ${
                                pathname === "/" 
                                ? "text-(--color-lumex-accent) border-b-2 border-(--color-lumex-accent) font-semibold" 
                                : "hover:text-(--color-lumex-accent) font-normal"
                            }`}
                        >
                            Anasayfa
                        </Link>

                        <Link
                            href="/societies"
                            className={`cursor-pointer transition-colors pb-1 ${
                                pathname === "/societies" 
                                ? "text-(--color-lumex-accent) border-b-2 border-(--color-lumex-accent) font-semibold" 
                                : "hover:text-(--color-lumex-accent) font-normal"
                            }`}
                        >
                            Topluluklar
                        </Link>

                        {/* Kullanıcı Giriş Yapmışsa */}
                        {user ? (
                            <>
                                {/* DİNAMİK LİNK BURADA DEVREYE GİRİYOR */}
                                <Link href={getDashboardLink()}>
                                    <button className='flex cursor-pointer items-center gap-2 bg-(--color-lumex-light)/10 hover:bg-(--color-lumex-light)/20 border border-(--color-lumex-light)/30 rounded-lg py-2 px-4 transition-all'>
                                        <LayoutDashboard size={18} /> Panelim
                                    </button>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className='flex cursor-pointer items-center gap-2 bg-red-500/20 hover:bg-red-500/40 text-red-100 border border-red-500/30 rounded-lg py-2 px-4 transition-all'
                                >
                                    <LogOut size={18} /> Çıkış Yap
                                </button>
                            </>
                        ) : (
                            /* Misafir Kullanıcıysa */
                            <button
                                onClick={() => setIsLoginPopupOpen(true)}
                                className='flex cursor-pointer items-center gap-2 bg-(--color-lumex-accent) hover:bg-(--color-lumex-accent-hover) text-(--color-lumex-dark) font-semibold rounded-lg py-2 px-5 shadow-md transition-all transform hover:scale-105'
                            >
                                <LogIn size={18} /> Giriş Yap
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Giriş Popup'ı Şarta Bağlı Olarak Ekranın Üstüne Çizilir */}
            {isLoginPopupOpen && (
                <LoginPopup 
                    onClose={() => setIsLoginPopupOpen(false)} 
                    setUser={setUser} 
                />
            )}
        </>
    );
};

export default Header;