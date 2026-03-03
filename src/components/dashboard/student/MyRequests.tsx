"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle2, XCircle, Timer } from "lucide-react";

interface RequestItem {
    id: number;
    name: string;
    date: string;
    status: string;
}

const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
        case "pending": return { color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", icon: Timer, text: "Beklemede" };
        case "approved": return { color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", icon: CheckCircle2, text: "Onaylandı" };
        case "rejected": return { color: "text-red-600", bg: "bg-red-50", border: "border-red-200", icon: XCircle, text: "Reddedildi" };
        default: return { color: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200", icon: Clock, text: "Bilinmiyor" };
    }
};

const MyRequests = () => {
    const [requests, setRequests] = useState<RequestItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    const userId = parsedUser.id || parsedUser.user_id;

                    if (userId) {
                        const res = await fetch(`/api/student/requests?userId=${userId}`);
                        const data = await res.json();
                        
                        if (data.success) {
                            setRequests(data.data);
                        }
                    }
                } catch (error) {
                    console.error(error);
                }
            }
            setLoading(false);
        };

        fetchRequests();
    }, []);

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-96 md:h-105">
            <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <Clock size={18} className="text-orange-500 md:w-5 md:h-5" />
                    <h2 className="text-base md:text-lg font-bold text-(--color-lumex-dark)">Başvuru Geçmişim</h2>
                </div>
            </div>

            <div className="p-3 md:p-4 flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : requests.length > 0 ? (
                    <div className="flex flex-col gap-2 md:gap-3">
                        {requests.map((request) => {
                            const config = getStatusConfig(request.status);
                            const Icon = config.icon;
                            return (
                                <div key={request.id} className="flex flex-wrap sm:flex-nowrap items-center justify-between p-3 md:p-4 border border-gray-100 rounded-xl hover:shadow-sm transition-shadow bg-gray-50/30 gap-2">
                                    <div className="flex flex-col gap-0.5 md:gap-1 min-w-0 flex-1">
                                        <p className="font-semibold text-xs md:text-sm text-(--color-lumex-dark) truncate">{request.name}</p>
                                        <p className="text-[10px] md:text-xs text-gray-400">Başvuru: {formatDate(request.date)}</p>
                                    </div>
                                    <div className={`flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded-lg border ${config.bg} ${config.border} ${config.color} shrink-0`}>
                                        <Icon size={12} className="md:w-3.5 md:h-3.5" />
                                        <span className="text-[10px] md:text-xs font-bold">{config.text}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center px-4">
                        <p className="text-(--color-lumex-dark-muted) text-xs md:text-sm">Bekleyen veya sonuçlanmış bir başvurunuz bulunmuyor.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyRequests;