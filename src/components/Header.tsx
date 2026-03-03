"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LogIn, LogOut, LayoutDashboard, Menu, X } from 'lucide-react'; 
import logo from '../images/logo.png'; 
import LoginPopup from '@/components/auth/LoginPopup';

const Header = () => {
    const pathname = usePathname(); 
    const router = useRouter();

    const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        setIsMobileMenuOpen(false);
        router.push("/"); 
    };

    const getDashboardLink = () => {
        if (!user) return "/";
        
        if (user.loginType === 'management') return '/dashboard/cm_student';
        if (user.loginType === 'consultant' || user.role === 'advisor') return '/dashboard/advisor';
        if (user.loginType === 'admin' || user.role === 'admin') return '/dashboard/admin';
        
        return '/dashboard/student';
    };

    return (
        <>
            <header className="w-full bg-linear-to-r from-(--color-lumex-purple-deep) to-(--color-lumex-purple-main) min-h-28 shadow-lg flex items-center justify-center relative z-50">
                <div className="container flex justify-between items-center px-4 py-4 md:py-0">

                    <div className='flex flex-row items-center gap-3 md:gap-4'>
                        <Link href="/" className='h-14 w-14 md:h-20 md:w-20 shrink-0 bg-(--color-lumex-light) flex justify-center items-center rounded-full cursor-pointer shadow-md transition-transform hover:scale-105 overflow-hidden border-2 border-(--color-lumex-purple-light)'>
                            <Image 
                                src={logo} 
                                alt="Lumex Logo" 
                                className='h-full w-full object-contain p-1.5 md:p-2' 
                            />
                        </Link>
                        <div className='flex flex-col'>
                            <h1 className='font-bold text-lg md:text-xl text-(--color-lumex-light) tracking-wide leading-tight md:leading-normal'>
                                Lumex Üniversitesi
                            </h1>
                            <h3 className='hidden sm:block text-xs md:text-lg text-(--color-lumex-light)/80 font-medium'>
                                Öğrenci Toplulukları Bilgi Sistemi
                            </h3>
                        </div>
                    </div>

                    <button 
                        className="md:hidden text-(--color-lumex-light) p-2 cursor-pointer transition-transform hover:scale-105"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>

                    <div className='hidden md:flex flex-row text-(--color-lumex-light) gap-6 text-md items-center'>
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

                        {user ? (
                            <>
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
                            <button
                                onClick={() => setIsLoginPopupOpen(true)}
                                className='flex cursor-pointer items-center gap-2 bg-(--color-lumex-accent) hover:bg-(--color-lumex-accent-hover) text-(--color-lumex-dark) font-semibold rounded-lg py-2 px-5 shadow-md transition-all transform hover:scale-105'
                            >
                                <LogIn size={18} /> Giriş Yap
                            </button>
                        )}
                    </div>
                </div>

                {isMobileMenuOpen && (
                    <div className="absolute top-full left-0 w-full bg-(--color-lumex-purple-main) border-t border-(--color-lumex-purple-light)/20 shadow-xl flex flex-col md:hidden py-5 px-6 gap-4 z-50 animate-in slide-in-from-top-2">
                        <Link
                            href="/"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`cursor-pointer transition-colors text-lg ${
                                pathname === "/" 
                                ? "text-(--color-lumex-accent) font-semibold" 
                                : "text-(--color-lumex-light) hover:text-(--color-lumex-accent) font-normal"
                            }`}
                        >
                            Anasayfa
                        </Link>

                        <Link
                            href="/societies"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`cursor-pointer transition-colors text-lg ${
                                pathname === "/societies" 
                                ? "text-(--color-lumex-accent) font-semibold" 
                                : "text-(--color-lumex-light) hover:text-(--color-lumex-accent) font-normal"
                            }`}
                        >
                            Topluluklar
                        </Link>

                        {user ? (
                            <div className="flex flex-col gap-3 mt-2 border-t border-(--color-lumex-light)/10 pt-5">
                                <Link href={getDashboardLink()} onClick={() => setIsMobileMenuOpen(false)}>
                                    <button className='w-full flex justify-center cursor-pointer items-center gap-2 bg-(--color-lumex-light)/10 hover:bg-(--color-lumex-light)/20 border border-(--color-lumex-light)/30 text-(--color-lumex-light) rounded-lg py-3 px-4 transition-all'>
                                        <LayoutDashboard size={18} /> Panelim
                                    </button>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className='w-full flex justify-center cursor-pointer items-center gap-2 bg-red-500/20 hover:bg-red-500/40 text-red-100 border border-red-500/30 rounded-lg py-3 px-4 transition-all'
                                >
                                    <LogOut size={18} /> Çıkış Yap
                                </button>
                            </div>
                        ) : (
                            <div className="mt-2 border-t border-(--color-lumex-light)/10 pt-5">
                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        setIsLoginPopupOpen(true);
                                    }}
                                    className='w-full flex justify-center cursor-pointer items-center gap-2 bg-(--color-lumex-accent) hover:bg-(--color-lumex-accent-hover) text-(--color-lumex-dark) font-semibold rounded-lg py-3 px-5 shadow-md transition-all'
                                >
                                    <LogIn size={18} /> Giriş Yap
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </header>

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