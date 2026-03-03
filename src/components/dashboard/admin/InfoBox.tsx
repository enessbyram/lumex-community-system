"use client";

import { useState, useEffect } from "react";
import { Users, TrendingUp, CalendarClock, FileText } from "lucide-react";

const InfoBox = () => {
    const [stats, setStats] = useState({
        total_communities: 0,
        total_members: 0,
        pending_events: 0,
        pending_documents: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminStats = async () => {
            try {
                const res = await fetch('/api/admin/stats');
                const data = await res.json();
                
                if (data.success) {
                    setStats(data.data);
                }
            } catch (error) {
                console.error("Admin istatistikleri çekilirken hata oluştu:", error);
            }
            setLoading(false);
        };

        fetchAdminStats();
    }, []);

    if (loading) {
        return (
            <div className="w-full flex flex-col md:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex-1 h-20 md:h-22.5 bg-white/50 border border-gray-100 rounded-xl shadow-sm animate-pulse w-full"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
            
            <div className="flex-1 flex items-center gap-3 md:gap-4 bg-white border border-gray-100 px-4 md:px-6 py-4 md:py-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-blue-50 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl shrink-0">
                    <Users size={20} className="text-blue-600 md:w-6 md:h-6" />
                </div>
                <div className="flex flex-col min-w-0">
                    <p className="text-xs md:text-sm font-medium text-gray-500 truncate">Toplam Topluluk</p>
                    <h1 className="font-bold text-xl md:text-2xl text-(--color-lumex-dark) truncate">
                        {stats.total_communities}
                    </h1>
                </div>
            </div>

            <div className="flex-1 flex items-center gap-3 md:gap-4 bg-white border border-gray-100 px-4 md:px-6 py-4 md:py-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-emerald-50 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl shrink-0">
                    <TrendingUp size={20} className="text-emerald-600 md:w-6 md:h-6" />
                </div>
                <div className="flex flex-col min-w-0">
                    <p className="text-xs md:text-sm font-medium text-gray-500 truncate">Toplam Üye</p>
                    <h1 className="font-bold text-xl md:text-2xl text-(--color-lumex-dark) truncate">
                        {stats.total_members.toLocaleString('tr-TR')}
                    </h1>
                </div>
            </div>

            <div className="flex-1 flex items-center gap-3 md:gap-4 bg-white border border-gray-100 px-4 md:px-6 py-4 md:py-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-orange-50 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl shrink-0">
                    <CalendarClock size={20} className="text-orange-500 md:w-6 md:h-6" />
                </div>
                <div className="flex flex-col min-w-0">
                    <p className="text-xs md:text-sm font-medium text-gray-500 truncate">Bekleyen Etkinlik</p>
                    <h1 className="font-bold text-xl md:text-2xl text-(--color-lumex-dark) truncate">
                        {stats.pending_events}
                    </h1>
                </div>
            </div>

            <div className="flex-1 flex items-center gap-3 md:gap-4 bg-white border border-gray-100 px-4 md:px-6 py-4 md:py-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-purple-50 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl shrink-0">
                    <FileText size={20} className="text-purple-600 md:w-6 md:h-6" />
                </div>
                <div className="flex flex-col min-w-0">
                    <p className="text-xs md:text-sm font-medium text-gray-500 truncate">Bekleyen Belge</p>
                    <h1 className="font-bold text-xl md:text-2xl text-(--color-lumex-dark) truncate">
                        {stats.pending_documents}
                    </h1>
                </div>
            </div>

        </div>
    );
};

export default InfoBox;