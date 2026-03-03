"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, UserCog, CalendarRange } from "lucide-react";
import ProfileEditPopup from "./ProfileEditPopup";

const QuickActions = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <>
            <div className="w-full flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
                
                <Link href="/societies" className="w-full sm:flex-1">
                    <button className="w-full bg-(--color-lumex-dark) text-white flex items-center justify-center rounded-lg md:rounded-xl px-4 py-2.5 md:py-3 cursor-pointer hover:bg-black transition duration-200 shadow-md font-semibold text-xs md:text-sm gap-2">
                        <Users size={16} className="text-(--color-lumex-accent) md:w-4.5 md:h-4.5" /> 
                        Toplulukları Keşfet
                    </button>
                </Link>

                <button 
                    onClick={() => setIsProfileOpen(true)}
                    className="w-full sm:flex-1 bg-white text-(--color-lumex-dark) border border-gray-200 flex items-center justify-center rounded-lg md:rounded-xl px-4 py-2.5 md:py-3 cursor-pointer hover:bg-gray-50 transition duration-200 shadow-sm font-semibold text-xs md:text-sm gap-2"
                >
                    <UserCog size={16} className="text-(--color-lumex-purple-main) md:w-4.5 md:h-4.5" /> 
                    Profilimi Düzenle
                </button>

                <Link href="/announcements" className="w-full sm:flex-1">
                    <button className="w-full bg-white text-(--color-lumex-dark) border border-gray-200 flex items-center justify-center rounded-lg md:rounded-xl px-4 py-2.5 md:py-3 cursor-pointer hover:bg-gray-50 transition duration-200 shadow-sm font-semibold text-xs md:text-sm gap-2">
                        <CalendarRange size={16} className="text-emerald-600 md:w-4.5 md:h-4.5" /> 
                        Tüm Etkinlikler
                    </button>
                </Link>

            </div>

            {isProfileOpen && <ProfileEditPopup onClose={() => setIsProfileOpen(false)} />}
        </>
    );
};

export default QuickActions;