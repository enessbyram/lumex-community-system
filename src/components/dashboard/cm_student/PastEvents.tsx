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
                    console.error(error);
                }
            }
            setLoading(false);
        };

        fetchPastEvents();
    }, []);

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const formatTime = (dateString: string) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col mt-4 md:mt-6 h-96 md:h-100">
            <div className="p-4 md:p-6 border-b border-gray-100 shrink-0">
                <h2 className="text-base md:text-lg font-bold text-(--color-lumex-dark)">Son Düzenlenen Etkinlikler</h2>
            </div>

            <div className="p-3 md:p-4 flex flex-col gap-2 md:gap-3 flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="w-6 h-6 border-2 border-(--color-lumex-purple-main) border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : events.length > 0 ? (
                    events.map((evt) => (
                        <div key={evt.id} className="bg-gray-50/50 border border-gray-100 rounded-lg md:rounded-xl p-3 md:p-4 flex flex-row items-center justify-between gap-3 hover:bg-gray-50 hover:shadow-sm transition-all shrink-0">
                            <div className="flex flex-col gap-0.5 md:gap-1 min-w-0 pr-2">
                                <h3 className="font-bold text-(--color-lumex-dark) text-xs md:text-sm truncate">{evt.name}</h3>
                                <p className="text-[10px] md:text-xs font-medium text-gray-500 truncate">
                                    {evt.participants} katılımcı - {formatDate(evt.event_date)}
                                </p>
                            </div>
                            
                            <button 
                                onClick={() => setSelectedEvent(evt)}
                                className="px-3 md:px-4 py-1.5 md:py-2 bg-white border border-gray-200 text-(--color-lumex-dark) font-semibold rounded-md md:rounded-lg hover:bg-gray-50 transition-colors text-[10px] md:text-sm shadow-sm flex items-center justify-center gap-1.5 md:gap-2 cursor-pointer shrink-0"
                            >
                                <Eye size={14} className="text-gray-500 md:w-4 md:h-4" /> Detay
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-xs md:text-sm">
                        Henüz tamamlanmış bir etkinlik bulunmuyor.
                    </div>
                )}
            </div>

            {selectedEvent && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 md:p-4 animate-in fade-in duration-200" onClick={() => setSelectedEvent(null)}>
                    <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl w-full max-w-lg relative animate-in zoom-in-95 duration-200 flex flex-col overflow-hidden max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                        
                        <div className="bg-gray-50/50 p-4 md:p-6 border-b border-gray-100 flex justify-between items-start shrink-0">
                            <div>
                                <h2 className="text-lg md:text-xl font-bold text-(--color-lumex-dark)">Etkinlik Detayları</h2>
                                <p className="text-[10px] md:text-sm text-gray-500 mt-0.5 md:mt-1">Seçilen etkinliğin detaylarını inceleyebilirsiniz.</p>
                            </div>
                            <button onClick={() => setSelectedEvent(null)} className="text-gray-400 hover:text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 p-1.5 md:p-2 rounded-full transition-colors cursor-pointer shadow-sm">
                                <X size={16} className="md:w-4.5 md:h-4.5" />
                            </button>
                        </div>

                        <div className="p-4 md:p-6 space-y-4 md:space-y-5 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200">
                            
                            <h3 className="text-base md:text-lg font-bold text-(--color-lumex-purple-main)">{selectedEvent.name}</h3>

                            <div className="flex flex-col gap-3 md:gap-4">
                                <div className="flex items-center gap-2.5 md:gap-3">
                                    <div className="bg-orange-50 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-md md:rounded-lg border border-orange-100 shrink-0">
                                        <MapPin className="text-orange-500 md:w-5 md:h-5" size={16} />
                                    </div>
                                    <p className="text-xs md:text-sm font-medium text-(--color-lumex-dark)">{selectedEvent.location || 'Belirtilmedi'}</p>
                                </div>
                                
                                <div className="flex items-center gap-2.5 md:gap-3">
                                    <div className="bg-blue-50 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-md md:rounded-lg border border-blue-100 shrink-0">
                                        <CalendarClock className="text-blue-600 md:w-5 md:h-5" size={16} />
                                    </div>
                                    <p className="text-xs md:text-sm font-medium text-(--color-lumex-dark)">{formatDate(selectedEvent.event_date)} - {formatTime(selectedEvent.event_date)}</p>
                                </div>

                                <div className="flex items-center gap-2.5 md:gap-3">
                                    <div className="bg-emerald-50 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-md md:rounded-lg border border-emerald-100 shrink-0">
                                        <Users className="text-emerald-600 md:w-5 md:h-5" size={16} />
                                    </div>
                                    <p className="text-xs md:text-sm font-medium text-(--color-lumex-dark)">{selectedEvent.participants} Katılımcı</p>
                                </div>
                            </div>

                            <div className="pt-3 md:pt-4 border-t border-gray-100">
                                <p className="text-[10px] md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2 flex items-center gap-1.5">
                                    <Info size={14} className="text-gray-400 md:w-4 md:h-4" /> Açıklama:
                                </p>
                                <p className="text-[10px] md:text-sm text-(--color-lumex-dark-muted) bg-gray-50 border border-gray-100 p-3 md:p-4 rounded-lg md:rounded-xl leading-relaxed whitespace-pre-wrap">
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