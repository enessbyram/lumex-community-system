"use client";

import { useState, useEffect } from "react";
import { FileText, CheckCircle, CalendarDays } from "lucide-react";

const InfoBox = () => {
    const [stats, setStats] = useState({
        pending_requests: 0,
        approved_requests: 0,
        this_month_events: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    const userId = parsedUser.id || parsedUser.user_id;

                    if (userId) {
                        const res = await fetch(`/api/advisor/stats?userId=${userId}`);
                        const data = await res.json();
                        
                        if (data.success) {
                            setStats(data.data);
                        }
                    }
                } catch (error) {
                    console.error("Danışman istatistikleri çekilirken hata oluştu:", error);
                }
            }
            setLoading(false);
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="w-full flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex-1 h-20 md:h-22.5 bg-white/50 border border-gray-100 rounded-xl shadow-sm animate-pulse w-full"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
            
            {/* 1. Bekleyen Talepler */}
            <div className="flex-1 flex items-center gap-3 md:gap-4 bg-white border border-gray-100 px-4 md:px-6 py-4 md:py-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-yellow-50 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl shrink-0">
                    <FileText size={20} className="text-yellow-600 md:w-6 md:h-6" />
                </div>
                <div className="flex flex-col">
                    <p className="text-xs md:text-sm font-medium text-(--color-lumex-dark-muted)">Bekleyen Talepler</p>
                    <h1 className="font-bold text-xl md:text-2xl text-(--color-lumex-dark)">
                        {stats.pending_requests}
                    </h1>
                </div>
            </div>

            {/* 2. Onaylanan */}
            <div className="flex-1 flex items-center gap-3 md:gap-4 bg-white border border-gray-100 px-4 md:px-6 py-4 md:py-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-emerald-50 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl shrink-0">
                    <CheckCircle size={20} className="text-emerald-600 md:w-6 md:h-6" />
                </div>
                <div className="flex flex-col">
                    <p className="text-xs md:text-sm font-medium text-(--color-lumex-dark-muted)">Onaylanan</p>
                    <h1 className="font-bold text-xl md:text-2xl text-(--color-lumex-dark)">
                        {stats.approved_requests}
                    </h1>
                </div>
            </div>

            {/* 3. Bu Ay (Gerçekleşecek Etkinlikler) */}
            <div className="flex-1 flex items-center gap-3 md:gap-4 bg-white border border-gray-100 px-4 md:px-6 py-4 md:py-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-blue-50 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl shrink-0">
                    <CalendarDays size={20} className="text-blue-600 md:w-6 md:h-6" />
                </div>
                <div className="flex flex-col">
                    <p className="text-xs md:text-sm font-medium text-(--color-lumex-dark-muted)">Bu Ay</p>
                    <h1 className="font-bold text-xl md:text-2xl text-(--color-lumex-dark)">
                        {stats.this_month_events}
                    </h1>
                </div>
            </div>

        </div>
    );
};

export default InfoBox;