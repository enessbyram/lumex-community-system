"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, UserCog, CalendarRange } from "lucide-react";
import ProfileEditPopup from "./ProfileEditPopup";

const QuickActions = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <>
            <div className="w-full flex flex-wrap md:flex-nowrap gap-4 mb-8">
                
                {/* TOPLULUKLARI KEŞFET */}
                <Link href="/societies" className="flex-1">
                    <button className="w-full bg-(--color-lumex-dark) text-white flex items-center justify-center rounded-xl px-4 py-3 cursor-pointer hover:bg-black transition duration-200 shadow-md font-semibold text-sm gap-2">
                        <Users size={18} className="text-(--color-lumex-accent)" /> 
                        Toplulukları Keşfet
                    </button>
                </Link>

                {/* PROFİLİMİ DÜZENLE */}
                <button 
                    onClick={() => setIsProfileOpen(true)}
                    className="flex-1 bg-white text-(--color-lumex-dark) border border-gray-200 flex items-center justify-center rounded-xl px-4 py-3 cursor-pointer hover:bg-gray-50 transition duration-200 shadow-sm font-semibold text-sm gap-2"
                >
                    <UserCog size={18} className="text-(--color-lumex-purple-main)" /> 
                    Profilimi Düzenle
                </button>

                {/* TÜM ETKİNLİKLER */}
                {/* Not: Etkinlikler (duyurular) sayfasının yolu /announcements ise href'i ona göre güncelle */}
                <Link href="/announcements" className="flex-1">
                    <button className="w-full bg-white text-(--color-lumex-dark) border border-gray-200 flex items-center justify-center rounded-xl px-4 py-3 cursor-pointer hover:bg-gray-50 transition duration-200 shadow-sm font-semibold text-sm gap-2">
                        <CalendarRange size={18} className="text-emerald-600" /> 
                        Tüm Etkinlikler
                    </button>
                </Link>

            </div>

            {/* POPUP RENDER EDİLİR */}
            {isProfileOpen && <ProfileEditPopup onClose={() => setIsProfileOpen(false)} />}
        </>
    );
};

export default QuickActions;