"use client";

import { useState, useEffect } from "react";
import { Eye, MapPin, CalendarClock, Users, X, Info } from "lucide-react";

interface PastEventItem {
    id: number;
    name: string;
    participants: number;
    event_date: string;
    location: string;
    description: string;
}

const PastEvents = () => {
    const [events, setEvents] = useState<PastEventItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<PastEventItem | null>(null);

    useEffect(() => {
        const fetchPastEvents = async () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    const userId = parsedUser.id || parsedUser.user_id;

                    if (userId) {
                        const res = await fetch(`/api/cm_student/events/past?userId=${userId}`);
                        const data = await res.json();
                        
                        if (data.success) {
                            setEvents(data.data);
                        }
                    }
                } catch (error) {
                    console.error("Geçmiş etkinlikler çekilirken hata oluştu:", error);
                }
            }
            setLoading(false);
        };

        fetchPastEvents();
    }, []);

    // Tarihi formatla (Örn: 20 Ekim 2025)
    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    // Saati formatla (Örn: 14:00)
    const formatTime = (dateString: string) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col mt-6 h-100">
            <div className="p-6 border-b border-gray-100 shrink-0">
                <h2 className="text-lg font-bold text-(--color-lumex-dark)">Son Düzenlenen Etkinlikler</h2>
            </div>

            <div className="p-4 flex flex-col gap-3 flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="w-6 h-6 border-2 border-(--color-lumex-purple-main) border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : events.length > 0 ? (
                    events.map((evt) => (
                        <div key={evt.id} className="bg-gray-50/50 border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50 hover:shadow-sm transition-all shrink-0">
                            <div className="flex flex-col gap-1">
                                <h3 className="font-bold text-(--color-lumex-dark) text-sm">{evt.name}</h3>
                                <p className="text-xs font-medium text-gray-500">
                                    {evt.participants} katılımcı - {formatDate(evt.event_date)}
                                </p>
                            </div>
                            
                            <button 
                                onClick={() => setSelectedEvent(evt)}
                                className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-200 text-(--color-lumex-dark) font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer shrink-0"
                            >
                                <Eye size={16} className="text-gray-500" /> Detay
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        Henüz tamamlanmış bir etkinlik bulunmuyor.
                    </div>
                )}
            </div>

            {/* DETAY POPUP'I (GELİŞTİRİLMİŞ TASARIM) */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setSelectedEvent(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative animate-in zoom-in-95 duration-200 flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        
                        {/* HEADER */}
                        <div className="bg-gray-50/50 p-6 border-b border-gray-100 flex justify-between items-start shrink-0">
                            <div>
                                <h2 className="text-xl font-bold text-(--color-lumex-dark)">Etkinlik Detayları</h2>
                                <p className="text-sm text-gray-500 mt-1">Seçilen etkinliğin detaylarını inceleyebilirsiniz.</p>
                            </div>
                            <button onClick={() => setSelectedEvent(null)} className="text-gray-400 hover:text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 p-2 rounded-full transition-colors cursor-pointer shadow-sm">
                                <X size={18} />
                            </button>
                        </div>

                        {/* CONTENT */}
                        <div className="p-6 space-y-5">
                            
                            <h3 className="text-lg font-bold text-(--color-lumex-purple-main)">{selectedEvent.name}</h3>

                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-orange-50 w-10 h-10 flex items-center justify-center rounded-lg border border-orange-100 shrink-0">
                                        <MapPin className="text-orange-500" size={20} />
                                    </div>
                                    <p className="text-sm font-medium text-(--color-lumex-dark)">{selectedEvent.location || 'Belirtilmedi'}</p>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-50 w-10 h-10 flex items-center justify-center rounded-lg border border-blue-100 shrink-0">
                                        <CalendarClock className="text-blue-600" size={20} />
                                    </div>
                                    <p className="text-sm font-medium text-(--color-lumex-dark)">{formatDate(selectedEvent.event_date)} - {formatTime(selectedEvent.event_date)}</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="bg-emerald-50 w-10 h-10 flex items-center justify-center rounded-lg border border-emerald-100 shrink-0">
                                        <Users className="text-emerald-600" size={20} />
                                    </div>
                                    <p className="text-sm font-medium text-(--color-lumex-dark)">{selectedEvent.participants} Katılımcı</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                                    <Info size={16} className="text-gray-400" /> Açıklama:
                                </p>
                                <p className="text-sm text-(--color-lumex-dark-muted) bg-gray-50 border border-gray-100 p-4 rounded-xl leading-relaxed max-h-40 overflow-y-auto">
                                    {selectedEvent.description || 'Bu etkinlik için bir açıklama girilmemiş.'}
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PastEvents;