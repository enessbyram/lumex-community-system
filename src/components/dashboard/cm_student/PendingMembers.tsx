"use client";

import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";

interface RequestItem {
    id: number;
    name: string;
    email: string;
    date: string;
    user_id: number;
    community_id: number;
}

const PendingMembers = () => {
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
                        const res = await fetch(`/api/cm_student/pending_members?userId=${userId}`);
                        const data = await res.json();
                        
                        if (data.success) {
                            setRequests(data.data);
                        }
                    }
                } catch (error) {
                    console.error("Başvurular çekilirken hata oluştu:", error);
                }
            }
            setLoading(false);
        };

        fetchRequests();
    }, []);

    const handleAction = async (requestId: number, userId: number, communityId: number, action: 'approve' | 'reject') => {
        try {
            const res = await fetch('/api/cm_student/pending_members', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestId, userId, communityId, action })
            });

            const data = await res.json();
            
            if (data.success) {
                // İşlem başarılıysa bu kaydı ekrandan anında sil
                setRequests(prev => prev.filter(req => req.id !== requestId));
                // Opsiyonel: alert(action === 'approve' ? "Üye onaylandı" : "Başvuru reddedildi");
            } else {
                alert("İşlem başarısız: " + data.message);
            }
        } catch (error) {
            console.error("İşlem hatası:", error);
            alert("Bir hata oluştu.");
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-100">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
                <h2 className="text-lg font-bold text-(--color-lumex-dark)">Bekleyen Üyelik Başvuruları</h2>
                <span className="bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                    {requests.length}
                </span>
            </div>

            <div className="p-4 overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : requests.length > 0 ? (
                    <div className="flex flex-col gap-3">
                        {requests.map((req) => (
                            <div key={req.id} className="bg-gray-50/50 border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-sm transition-shadow">
                                <div className="flex flex-col">
                                    <p className="font-bold text-(--color-lumex-dark) text-sm">{req.name}</p>
                                    <p className="text-xs text-gray-500 mb-1">{req.email}</p>
                                    <p className="text-[11px] text-gray-400">Başvuru: {formatDate(req.date)}</p>
                                </div>
                                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                                    <button 
                                        onClick={() => handleAction(req.id, req.user_id, req.community_id, 'approve')}
                                        className="flex-1 sm:flex-none cursor-pointer flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors"
                                    >
                                        Onayla
                                    </button>
                                    <button 
                                        onClick={() => handleAction(req.id, req.user_id, req.community_id, 'reject')}
                                        className="flex-1 sm:flex-none cursor-pointer flex items-center justify-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors"
                                    >
                                        Reddet
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        Bekleyen başvuru bulunmuyor.
                    </div>
                )}
            </div>
        </div>
    );
};

export default PendingMembers;