"use client";

import { useState, useEffect } from "react";
import { CalendarPlus, Edit2 } from "lucide-react";
import AddEventPopup from "./AddEventPopup";

const getStatusConfig = (status: string) => {
    switch(status) {
        case 'draft': return { text: 'Taslak', classes: 'bg-gray-200 text-gray-700' };
        case 'pending_advisor': return { text: 'Danışman Bekliyor', classes: 'bg-yellow-100 text-yellow-700' };
        case 'pending_admin': return { text: 'SKS Bekliyor', classes: 'bg-blue-100 text-blue-700' };
        case 'approved': return { text: 'Onaylandı', classes: 'bg-emerald-100 text-emerald-700' };
        case 'rejected_by_advisor': return { text: 'Danışman Reddetti', classes: 'bg-red-100 text-red-700' };
        case 'rejected_by_admin': return { text: 'SKS Reddetti', classes: 'bg-red-100 text-red-700' };
        default: return { text: 'Bilinmiyor', classes: 'bg-gray-100 text-gray-600' };
    }
};

const SubmittedEvents = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedDraft, setSelectedDraft] = useState<any>(null);
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchEvents = async () => {
        setLoading(true);
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                const userId = parsedUser.id || parsedUser.user_id;
                if (userId) {
                    const res = await fetch(`/api/cm_student/applications?userId=${userId}`);
                    const data = await res.json();
                    if (data.success) setEvents(data.data);
                }
            } catch (error) { console.error(error); }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleOpenNew = () => {
        setSelectedDraft(null); 
        setIsPopupOpen(true);
    };

    const handleEditDraft = (draft: any) => {
        setSelectedDraft(draft); 
        setIsPopupOpen(true);
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-96 md:h-100">
            <div className="p-4 md:p-6 border-b border-gray-100 shrink-0">
                <h2 className="text-base md:text-lg font-bold text-(--color-lumex-dark)">Gönderilen Etkinlikler</h2>
            </div>

            <div className="p-3 md:p-4 flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 md:[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="w-6 h-6 md:w-8 md:h-8 border-3 md:border-4 border-(--color-lumex-purple-main) border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : events.length > 0 ? (
                    <div className="flex flex-col gap-2 md:gap-3">
                        {events.map((evt) => (
                            <div key={evt.id} className="bg-gray-50/50 border border-gray-100 rounded-lg md:rounded-xl p-3 md:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4 hover:shadow-sm transition-shadow">
                                <div className="flex flex-col gap-0.5 md:gap-1 min-w-0 w-full sm:w-auto pr-2">
                                    <p className="font-bold text-(--color-lumex-dark) text-xs md:text-sm truncate">{evt.title || "İsimsiz Taslak"}</p>
                                    <p className="text-[10px] md:text-xs text-gray-500 truncate">
                                        {evt.current_status === 'draft' ? 'Oluşturuldu:' : 'Gönderildi:'} {formatDate(evt.created_at)}
                                    </p>
                                    {evt.current_status === 'approved' && evt.updated_at && (
                                        <p className="text-[9px] md:text-[11px] text-emerald-600 font-medium mt-0.5 truncate">Onaylandı: {formatDate(evt.updated_at)}</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 md:gap-3 shrink-0 self-start sm:self-auto">
                                    {(() => {
                                        const config = getStatusConfig(evt.current_status);
                                        return (
                                            <span className={`text-[9px] md:text-xs font-bold px-2 md:px-3 py-1 md:py-1.5 rounded-md md:rounded-lg ${config.classes} text-center whitespace-nowrap`}>
                                                {config.text}
                                            </span>
                                        );
                                    })()}
                                    
                                    {evt.current_status === 'draft' && (
                                        <button 
                                            onClick={() => handleEditDraft(evt)}
                                            className="p-1 md:p-1.5 bg-white border border-gray-200 rounded-md md:rounded-lg text-gray-500 hover:text-(--color-lumex-purple-main) hover:border-(--color-lumex-purple-main) transition-colors cursor-pointer"
                                            title="Başvuruya Devam Et"
                                        >
                                            <Edit2 size={14} className="md:w-4 md:h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-xs md:text-sm">
                        Henüz bir etkinlik göndermediniz.
                    </div>
                )}
            </div>

            <div className="p-3 md:p-4 border-t border-gray-100 bg-gray-50/50 shrink-0 rounded-b-xl mt-auto">
                <button 
                    onClick={handleOpenNew}
                    className="w-full bg-[#0a192f] hover:bg-[#112240] text-white font-bold py-2.5 md:py-3.5 rounded-lg md:rounded-xl flex items-center justify-center gap-1.5 md:gap-2 transition-colors shadow-md cursor-pointer text-xs md:text-sm"
                >
                    <CalendarPlus size={16} className="md:w-4.5 md:h-4.5" /> Yeni Etkinlik Ekle
                </button>
            </div>

            {isPopupOpen && <AddEventPopup initialData={selectedDraft} onClose={() => setIsPopupOpen(false)} onSuccess={fetchEvents} />}
        </div>
    );
};

export default SubmittedEvents;