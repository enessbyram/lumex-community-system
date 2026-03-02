"use client";

import { useState, useEffect } from "react";
import { Users, UserPlus, CalendarClock, CalendarCheck } from "lucide-react";

const InfoBox = () => {
    const [stats, setStats] = useState({
        total_members: 0,
        pending_members: 0,
        pending_events: 0,
        total_events: 0
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
                        const res = await fetch(`/api/cm_student/stats?userId=${userId}`);
                        const data = await res.json();
                        
                        if (data.success) {
                            setStats({
                                total_members: data.data.total_members,
                                pending_members: data.data.pending_members,
                                pending_events: data.data.pending_events,
                                total_events: data.data.total_events
                            });
                        }
                    }
                } catch (error) {
                    console.error("İstatistikler çekilirken hata oluştu:", error);
                }
            }
            setLoading(false);
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="py-4 w-full flex flex-col md:flex-row gap-4 mb-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex-1 h-24 bg-white/50 border border-gray-100 rounded-xl shadow-sm animate-pulse w-full md:w-1/4"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="py-4 w-full flex flex-col md:flex-row gap-4 mb-4">
            
            {/* 1. Toplam Üye */}
            <div className="flex flex-row items-center gap-4 bg-white border border-gray-100 px-6 py-5 rounded-xl shadow-sm w-full md:w-1/4 transition hover:shadow-md">
                <div className="bg-blue-50 flex items-center justify-center w-12 h-12 rounded-lg shrink-0">
                    <Users size={24} className="text-blue-600" />
                </div>
                <div className="flex flex-col items-start justify-start">
                    <p className="text-sm font-medium text-gray-500">Toplam Üye</p>
                    <h1 className="font-bold text-2xl text-(--color-lumex-dark)">
                        {stats.total_members}
                    </h1>
                </div>
            </div>

            {/* 2. Bekleyen Üye Başvuruları */}
            <div className="flex flex-row items-center gap-4 bg-white border border-gray-100 px-6 py-5 rounded-xl shadow-sm w-full md:w-1/4 transition hover:shadow-md">
                <div className="bg-orange-50 flex items-center justify-center w-12 h-12 rounded-lg shrink-0">
                    <UserPlus size={24} className="text-orange-500" />
                </div>
                <div className="flex flex-col items-start justify-start">
                    <p className="text-sm font-medium text-gray-500">Bekleyen Üye</p>
                    <h1 className="font-bold text-2xl text-(--color-lumex-dark)">
                        {stats.pending_members}
                    </h1>
                </div>
            </div>

            {/* 3. Bekleyen Etkinlik Başvuruları */}
            <div className="flex flex-row items-center gap-4 bg-white border border-gray-100 px-6 py-5 rounded-xl shadow-sm w-full md:w-1/4 transition hover:shadow-md">
                <div className="bg-yellow-50 flex items-center justify-center w-12 h-12 rounded-lg shrink-0">
                    <CalendarClock size={24} className="text-yellow-600" />
                </div>
                <div className="flex flex-col items-start justify-start">
                    <p className="text-sm font-medium text-gray-500">Bekleyen Etkinlik</p>
                    <h1 className="font-bold text-2xl text-(--color-lumex-dark)">
                        {stats.pending_events}
                    </h1>
                </div>
            </div>

            {/* 4. Toplam Etkinlikler */}
            <div className="flex flex-row items-center gap-4 bg-white border border-gray-100 px-6 py-5 rounded-xl shadow-sm w-full md:w-1/4 transition hover:shadow-md">
                <div className="bg-emerald-50 flex items-center justify-center w-12 h-12 rounded-lg shrink-0">
                    <CalendarCheck size={24} className="text-emerald-600" />
                </div>
                <div className="flex flex-col items-start justify-start">
                    <p className="text-sm font-medium text-gray-500">Toplam Etkinlik</p>
                    <h1 className="font-bold text-2xl text-(--color-lumex-dark)">
                        {stats.total_events}
                    </h1>
                </div>
            </div>

        </div>
    );
};

export default InfoBox;