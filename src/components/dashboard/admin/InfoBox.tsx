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
            <div className="w-full flex flex-col md:flex-row gap-4 mb-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex-1 h-22.5 bg-white/50 border border-gray-100 rounded-xl shadow-sm animate-pulse w-full"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col md:flex-row gap-4 mb-8">
            
            {/* 1. Toplam Topluluk */}
            <div className="flex-1 flex items-center gap-4 bg-white border border-gray-100 px-6 py-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-blue-50 flex items-center justify-center w-14 h-14 rounded-xl shrink-0">
                    <Users size={24} className="text-blue-600" />
                </div>
                <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-500">Toplam Topluluk</p>
                    <h1 className="font-bold text-2xl text-(--color-lumex-dark)">
                        {stats.total_communities}
                    </h1>
                </div>
            </div>

            {/* 2. Toplam Üye */}
            <div className="flex-1 flex items-center gap-4 bg-white border border-gray-100 px-6 py-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-emerald-50 flex items-center justify-center w-14 h-14 rounded-xl shrink-0">
                    <TrendingUp size={24} className="text-emerald-600" />
                </div>
                <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-500">Toplam Üye</p>
                    <h1 className="font-bold text-2xl text-(--color-lumex-dark)">
                        {/* 1000'den büyük sayıları noktayla ayırır (Örn: 1.434) */}
                        {stats.total_members.toLocaleString('tr-TR')}
                    </h1>
                </div>
            </div>

            {/* 3. Bekleyen Etkinlik */}
            <div className="flex-1 flex items-center gap-4 bg-white border border-gray-100 px-6 py-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-orange-50 flex items-center justify-center w-14 h-14 rounded-xl shrink-0">
                    <CalendarClock size={24} className="text-orange-500" />
                </div>
                <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-500">Bekleyen Etkinlik</p>
                    <h1 className="font-bold text-2xl text-(--color-lumex-dark)">
                        {stats.pending_events}
                    </h1>
                </div>
            </div>

            {/* 4. Bekleyen Belge (Şimdilik Sabit) */}
            <div className="flex-1 flex items-center gap-4 bg-white border border-gray-100 px-6 py-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-purple-50 flex items-center justify-center w-14 h-14 rounded-xl shrink-0">
                    <FileText size={24} className="text-purple-600" />
                </div>
                <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-500">Bekleyen Belge</p>
                    <h1 className="font-bold text-2xl text-(--color-lumex-dark)">
                        {stats.pending_documents}
                    </h1>
                </div>
            </div>

        </div>
    );
};

export default InfoBox;