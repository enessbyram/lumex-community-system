"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { CalendarDays, MapPin, Users, X, Clock, Share2, Bell, CheckCircle2 } from "lucide-react";

// API'den gelecek veri tipi
interface EventItem {
    event_id: number;
    event_name: string;
    community_name: string;
    event_date: string;
    location: string;
    description: string;
    image_url: string;
    participant_count: number;
    is_joined: boolean;
}

const UpcomingEvents = () => {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    const userId = parsedUser.id || parsedUser.user_id;

                    if (userId) {
                        const res = await fetch(`/api/student/events/upcoming?userId=${userId}`);
                        const data = await res.json();
                        
                        if (data.success) {
                            setEvents(data.data);
                        }
                    }
                } catch (error) {
                    console.error("Etkinlik verileri alınamadı:", error);
                }
            }
            setLoading(false);
        };

        fetchEvents();
    }, []);

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const formatTime = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        alert("Bağlantı kopyalandı!");
    };

    // Etkinliğe katılma işlemi
    const handleJoin = async () => {
        if (!selectedEvent) return;

        const storedUser = localStorage.getItem('user');
        if (!storedUser) return;
        
        const parsedUser = JSON.parse(storedUser);
        const userId = parsedUser.id || parsedUser.user_id;

        try {
            // NOT: Bu API'yi henüz yazmadık, /api/student/events/join gibi bir şey olacak
            /* const res = await fetch('/api/student/events/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, eventId: selectedEvent.event_id })
            });
            const data = await res.json();
            if(!data.success) return alert("Katılım sağlanamadı.");
            */

            // Başarılı sayıp UI'ı anında güncelliyoruz (Optimistic UI)
            setSelectedEvent({ ...selectedEvent, is_joined: true, participant_count: selectedEvent.participant_count + 1 });
            
            // Ana listeyi de güncelle
            setEvents(prev => prev.map(e => 
                e.event_id === selectedEvent.event_id 
                ? { ...e, is_joined: true, participant_count: e.participant_count + 1 } 
                : e
            ));

        } catch (error) {
            console.error("Katılım hatası:", error);
        }
    };

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full mt-6">
            <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-(--color-lumex-dark)">Takip Ettiğim Toplulukların Yaklaşan Etkinlikleri</h2>
            </div>

            <div className="p-4 flex flex-col gap-3 max-h-125 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                {loading ? (
                    <div className="flex items-center justify-center py-10">
                        <div className="w-8 h-8 border-4 border-(--color-lumex-purple-main) border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : events.length > 0 ? (
                    events.map((evt) => (
                        <div key={evt.event_id} className="bg-gray-50/50 border border-gray-100 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 hover:bg-gray-50 transition-colors gap-4">
                            <div className="flex flex-col gap-1">
                                <h3 className="font-bold text-(--color-lumex-dark) text-base">{evt.event_name}</h3>
                                <p className="text-sm text-(--color-lumex-dark-muted) mb-2">{evt.community_name}</p>
                                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500">
                                    <div className="flex items-center gap-1.5">
                                        <CalendarDays size={14} className="text-(--color-lumex-purple-main)" />
                                        {formatDate(evt.event_date)} • {formatTime(evt.event_date)}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <MapPin size={14} className="text-orange-500" />
                                        {evt.location}
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => setSelectedEvent(evt)}
                                className="w-full sm:w-auto px-6 py-2 bg-white border border-gray-200 text-(--color-lumex-dark) font-semibold rounded-lg hover:border-(--color-lumex-purple-main) hover:text-(--color-lumex-purple-main) transition-colors text-sm shadow-sm cursor-pointer shrink-0"
                            >
                                Detay
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 opacity-50">
                        <CalendarDays size={48} className="text-gray-300 mb-4" />
                        <p className="text-gray-500 text-sm">Yaklaşan bir etkinlik bulunmuyor.</p>
                    </div>
                )}
            </div>

            {/* DETAY POPUP'I */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setSelectedEvent(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative animate-in zoom-in-95 duration-200 overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                        
                        <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 text-white bg-black/20 hover:bg-black/40 p-2 rounded-full z-10 cursor-pointer transition-colors backdrop-blur-md">
                            <X size={20} />
                        </button>

                        {/* Etkinlik Görseli */}
                        <div className="w-full h-48 bg-linear-to-r from-(--color-lumex-purple-deep) to-(--color-lumex-purple-main) relative shrink-0">
                            {selectedEvent.image_url && (
                                <Image 
                                    src={`/uploads/events/${selectedEvent.image_url}`} 
                                    alt={selectedEvent.event_name}
                                    fill
                                    className="object-cover"
                                />
                            )}
                        </div>

                        <div className="flex flex-col overflow-y-auto p-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                            
                            <div className="mb-6">
                                <h1 className="text-2xl font-bold text-(--color-lumex-dark)">{selectedEvent.event_name}</h1>
                                <p className="text-sm font-medium text-(--color-lumex-purple-main) mt-1">{selectedEvent.community_name}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex items-center gap-4">
                                    <div className="bg-blue-100 w-12 h-12 flex items-center justify-center rounded-lg shrink-0">
                                        <CalendarDays className="text-blue-600" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Tarih & Saat</p>
                                        <p className="text-sm font-bold text-(--color-lumex-dark)">{formatDate(selectedEvent.event_date)} | {formatTime(selectedEvent.event_date)}</p>
                                    </div>
                                </div>
                                <div className="bg-orange-50/50 border border-orange-100 p-4 rounded-xl flex items-center gap-4">
                                    <div className="bg-orange-100 w-12 h-12 flex items-center justify-center rounded-lg shrink-0">
                                        <MapPin className="text-orange-500" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Konum</p>
                                        <p className="text-sm font-bold text-(--color-lumex-dark)">{selectedEvent.location}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl flex items-center gap-4 mb-6">
                                <div className="bg-emerald-100 w-12 h-12 flex items-center justify-center rounded-lg shrink-0">
                                    <Users className="text-emerald-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Katılımcılar</p>
                                    <p className="text-sm font-bold text-(--color-lumex-dark)">{selectedEvent.participant_count} Kişi Katılıyor</p>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="flex items-center gap-2 font-bold text-(--color-lumex-dark) mb-3 text-lg">
                                    <Clock className="text-(--color-lumex-purple-main)" size={20} /> Etkinlik Hakkında
                                </h3>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <p className="text-sm leading-relaxed text-(--color-lumex-dark-muted)">
                                        {selectedEvent.description || "Bu etkinlik için açıklama girilmemiş."}
                                    </p>
                                </div>
                            </div>

                            {/* AKSİYON BUTONLARI */}
                            <div className="flex flex-wrap md:flex-nowrap gap-3 pt-4 border-t border-gray-100">
                                {selectedEvent.is_joined ? (
                                    <button disabled className="flex-1 cursor-not-allowed flex items-center justify-center gap-2 font-semibold rounded-xl bg-emerald-500 text-white text-sm py-3.5 shadow-sm opacity-90">
                                        <CheckCircle2 size={18} /> Katıldınız
                                    </button>
                                ) : (
                                    <button onClick={handleJoin} className="flex-1 cursor-pointer flex items-center justify-center gap-2 font-semibold rounded-xl bg-(--color-lumex-dark) hover:bg-black text-white text-sm py-3.5 shadow-md transition-colors">
                                        <Users size={18} /> Etkinliğe Katıl
                                    </button>
                                )}
                                
                                <button className="flex-1 md:flex-none cursor-pointer flex items-center justify-center gap-2 font-semibold rounded-xl bg-white border border-gray-200 text-(--color-lumex-dark) text-sm py-3.5 px-6 hover:bg-gray-50 transition-colors shadow-sm">
                                    <Bell size={18} /> Hatırlat
                                </button>
                                <button onClick={handleShare} className="flex-1 md:flex-none cursor-pointer flex items-center justify-center gap-2 font-semibold rounded-xl bg-white border border-gray-200 text-(--color-lumex-dark) text-sm py-3.5 px-6 hover:bg-gray-50 transition-colors shadow-sm">
                                    <Share2 size={18} /> Paylaş
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpcomingEvents;