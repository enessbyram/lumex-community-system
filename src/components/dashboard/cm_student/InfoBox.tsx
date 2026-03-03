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
                    console.error(error);
                }
            }
            setLoading(false);
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="py-2 md:py-4 w-full flex flex-col md:flex-row gap-3 md:gap-4 mb-2 md:mb-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex-1 h-20 md:h-24 bg-white/50 border border-gray-100 rounded-xl shadow-sm animate-pulse w-full md:w-1/4"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="py-2 md:py-4 w-full flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-row gap-3 md:gap-4 mb-2 md:mb-4">
            
            <div className="flex-1 flex flex-row items-center gap-3 md:gap-4 bg-white border border-gray-100 px-4 md:px-6 py-4 md:py-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-blue-50 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg shrink-0">
                    <Users size={20} className="text-blue-600 md:w-6 md:h-6" />
                </div>
                <div className="flex flex-col items-start justify-start min-w-0">
                    <p className="text-xs md:text-sm font-medium text-gray-500 truncate w-full">Toplam Üye</p>
                    <h1 className="font-bold text-xl md:text-2xl text-(--color-lumex-dark) truncate w-full">
                        {stats.total_members}
                    </h1>
                </div>
            </div>

            <div className="flex-1 flex flex-row items-center gap-3 md:gap-4 bg-white border border-gray-100 px-4 md:px-6 py-4 md:py-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-orange-50 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg shrink-0">
                    <UserPlus size={20} className="text-orange-500 md:w-6 md:h-6" />
                </div>
                <div className="flex flex-col items-start justify-start min-w-0">
                    <p className="text-xs md:text-sm font-medium text-gray-500 truncate w-full">Bekleyen Üye</p>
                    <h1 className="font-bold text-xl md:text-2xl text-(--color-lumex-dark) truncate w-full">
                        {stats.pending_members}
                    </h1>
                </div>
            </div>

            <div className="flex-1 flex flex-row items-center gap-3 md:gap-4 bg-white border border-gray-100 px-4 md:px-6 py-4 md:py-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-yellow-50 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg shrink-0">
                    <CalendarClock size={20} className="text-yellow-600 md:w-6 md:h-6" />
                </div>
                <div className="flex flex-col items-start justify-start min-w-0">
                    <p className="text-xs md:text-sm font-medium text-gray-500 truncate w-full">Bekleyen Etkinlik</p>
                    <h1 className="font-bold text-xl md:text-2xl text-(--color-lumex-dark) truncate w-full">
                        {stats.pending_events}
                    </h1>
                </div>
            </div>

            <div className="flex-1 flex flex-row items-center gap-3 md:gap-4 bg-white border border-gray-100 px-4 md:px-6 py-4 md:py-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-emerald-50 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg shrink-0">
                    <CalendarCheck size={20} className="text-emerald-600 md:w-6 md:h-6" />
                </div>
                <div className="flex flex-col items-start justify-start min-w-0">
                    <p className="text-xs md:text-sm font-medium text-gray-500 truncate w-full">Toplam Etkinlik</p>
                    <h1 className="font-bold text-xl md:text-2xl text-(--color-lumex-dark) truncate w-full">
                        {stats.total_events}
                    </h1>
                </div>
            </div>

        </div>
    );
};

export default InfoBox;