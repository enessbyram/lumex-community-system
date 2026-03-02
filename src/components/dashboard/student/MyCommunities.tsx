"use client";

import { useState, useEffect } from "react";
import { Users, ChevronRight, ShieldCheck } from "lucide-react";

// Gelen veri tipi
interface Community {
    id: number;
    name: string;
    role: string;
    joinedAt: string;
}

const MyCommunities = () => {
    const [communities, setCommunities] = useState<Community[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCommunities = async () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    const userId = parsedUser.id || parsedUser.user_id;

                    if (userId) {
                        const res = await fetch(`/api/student/communities?userId=${userId}`);
                        const data = await res.json();
                        
                        if (data.success) {
                            setCommunities(data.data);
                        }
                    }
                } catch (error) {
                    console.error("Topluluk verileri alınamadı:", error);
                }
            }
            setLoading(false);
        };

        fetchCommunities();
    }, []);

    // Veritabanından gelen tarihi (Örn: 2025-10-12) Türkçe okunabilir hale çevirir
    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-105">
            {/* Üst Kısım (Sabit) */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <Users size={20} className="text-(--color-lumex-purple-main)" />
                    <h2 className="text-lg font-bold text-(--color-lumex-dark)">Üyesi Olduğum Topluluklar</h2>
                </div>
                <span className="bg-(--color-lumex-purple-light)/20 text-(--color-lumex-purple-main) text-xs font-bold px-3 py-1 rounded-full">
                    {communities.length} Topluluk
                </span>
            </div>

            {/* Liste Kısmı (İçi Scroll Olur) */}
            <div className="p-2 flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="w-6 h-6 border-2 border-(--color-lumex-purple-main) border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : communities.length > 0 ? (
                    <div className="flex flex-col gap-1">
                        {communities.map((community) => (
                            <div key={community.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors group cursor-pointer border border-transparent hover:border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-(--color-lumex-purple-light)/10 text-(--color-lumex-purple-main) flex items-center justify-center font-bold text-sm shrink-0">
                                        {community.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="font-semibold text-sm text-(--color-lumex-dark)">{community.name}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            {/* Eğer rol "Üye" veya "Normal Üye" değilse (Yani yönetim kurulundaysa) yeşil rozet/ikon gösterir */}
                                            {community.role !== "Üye" && community.role !== "Normal Üye" && (
                                                <ShieldCheck size={12} className="text-emerald-500" />
                                            )}
                                            <p className={`text-xs font-medium ${(community.role !== "Üye" && community.role !== "Normal Üye") ? "text-emerald-600" : "text-(--color-lumex-dark-muted)"}`}>
                                                {community.role}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <p className="text-xs text-gray-400 hidden sm:block">{formatDate(community.joinedAt)}</p>
                                    <ChevronRight size={16} className="text-gray-300 group-hover:text-(--color-lumex-purple-main) transition-colors" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center px-4">
                        <p className="text-(--color-lumex-dark-muted) text-sm">Henüz hiçbir topluluğa üye değilsiniz.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyCommunities;