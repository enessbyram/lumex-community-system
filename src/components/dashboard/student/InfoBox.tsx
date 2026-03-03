"use client";

import { useState, useEffect } from "react";
import { Users, Clock, CalendarDays } from "lucide-react";

const InfoBox = () => {
    const [stats, setStats] = useState({
        member_count: 0,
        pending_count: 0,
        event_count: 0
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
                        const res = await fetch(`/api/student/stats?userId=${userId}`);
                        const data = await res.json();
                        
                        if (data.success) {
                            setStats({
                                member_count: data.data.member_count,
                                pending_count: data.data.pending_count,
                                event_count: data.data.event_count
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
            <div className="w-full flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex-1 h-20 md:h-24 bg-white/50 border border-gray-100 rounded-xl shadow-sm animate-pulse"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="flex-1 flex items-center gap-3 md:gap-4 bg-white border border-gray-100 px-4 md:px-6 py-4 md:py-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-(--color-lumex-purple-light)/20 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl shrink-0">
                    <Users size={20} className="text-(--color-lumex-purple-main) md:w-6 md:h-6" />
                </div>
                <div className="flex flex-col">
                    <p className="text-xs md:text-sm font-medium text-(--color-lumex-dark-muted)">Üye Olduğum</p>
                    <h1 className="font-bold text-xl md:text-2xl text-(--color-lumex-dark)">
                        {stats.member_count} <span className="text-xs md:text-sm font-medium text-gray-400">Topluluk</span>
                    </h1>
                </div>
            </div>

            <div className="flex-1 flex items-center gap-3 md:gap-4 bg-white border border-gray-100 px-4 md:px-6 py-4 md:py-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-orange-50 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl shrink-0">
                    <Clock size={20} className="text-orange-500 md:w-6 md:h-6" />
                </div>
                <div className="flex flex-col">
                    <p className="text-xs md:text-sm font-medium text-(--color-lumex-dark-muted)">Bekleyen Başvuru</p>
                    <h1 className="font-bold text-xl md:text-2xl text-(--color-lumex-dark)">
                        {stats.pending_count} <span className="text-xs md:text-sm font-medium text-gray-400">Adet</span>
                    </h1>
                </div>
            </div>

            <div className="flex-1 flex items-center gap-3 md:gap-4 bg-white border border-gray-100 px-4 md:px-6 py-4 md:py-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-emerald-50 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl shrink-0">
                    <CalendarDays size={20} className="text-emerald-600 md:w-6 md:h-6" />
                </div>
                <div className="flex flex-col">
                    <p className="text-xs md:text-sm font-medium text-(--color-lumex-dark-muted)">Yaklaşan Etkinlik</p>
                    <h1 className="font-bold text-xl md:text-2xl text-(--color-lumex-dark)">
                        {stats.event_count} <span className="text-xs md:text-sm font-medium text-gray-400">Adet</span>
                    </h1>
                </div>
            </div>
        </div>
    );
};

export default InfoBox;