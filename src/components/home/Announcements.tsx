"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, Clock, MapPin, Calendar } from "lucide-react";
import AnnouncementsCard from "./AnnouncementsCard";

interface Announcement {
    id: number;
    title: string;
    event_date: string;
    event_time: string;
    location: string;
    content: string;
    image_url: string;
}

const Announcements = () => {
    const [events, setEvents] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedEvent, setSelectedEvent] = useState<Announcement | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const res = await fetch("/api/announcements/recent");
                const data = await res.json();
                
                if (data.success) {
                    setEvents(data.data);
                }
            } catch (err) {
                setEvents([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, []);

    const handleSeeAll = () => {
        router.push("/announcements");
    };

    const closeModal = () => setSelectedEvent(null);

    return (
        <div className="w-full flex items-center justify-center py-8 md:py-10 bg-(--color-lumex-light) relative">
            <div className="container w-full flex flex-col px-4 md:px-6 lg:px-0">
                <h1 className="text-2xl md:text-3xl font-bold text-(--color-lumex-dark) mb-6 border-l-4 border-(--color-lumex-accent) pl-3 md:pl-4">
                    Duyurular & Etkinlikler
                </h1>
                
                {loading ? (
                    <div className="w-full text-center py-10 text-(--color-lumex-dark-muted) text-sm md:text-base">
                        Yükleniyor...
                    </div>
                ) : (
                    <>
                        {events.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
                                {events.map((evt) => (
                                    <AnnouncementsCard 
                                        key={evt.id}
                                        title={evt.title}
                                        date={evt.event_date}
                                        time={evt.event_time}
                                        location={evt.location}
                                        onClick={() => setSelectedEvent(evt)} 
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="w-full text-center py-10 bg-white rounded-xl border border-dashed border-(--color-lumex-purple-light) text-(--color-lumex-dark-muted) text-sm md:text-base px-4">
                                Şu an planlanmış güncel bir duyuru veya etkinlik bulunmamaktadır.
                            </div>
                        )}
                    </>
                )}

                {events.length >= 4 && (
                    <div className="w-full flex items-center justify-center mt-6 md:mt-8">
                        <button 
                            onClick={handleSeeAll}
                            className="w-full sm:w-auto bg-(--color-lumex-accent) text-(--color-lumex-dark) rounded-lg px-6 py-3 cursor-pointer hover:bg-(--color-lumex-accent-hover) transition duration-200 font-semibold shadow-md text-sm md:text-base"
                        >
                            Tüm Duyuruları Gör
                        </button>
                    </div>
                )}
            </div>

            {selectedEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm transition-opacity">
                    <div className="absolute inset-0 cursor-pointer" onClick={closeModal}></div>
                    <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                        <button 
                            onClick={closeModal}
                            className="absolute top-3 right-3 md:top-4 md:right-4 z-20 p-1.5 md:p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors cursor-pointer backdrop-blur-md"
                        >
                            <X size={20} className="w-5 h-5 md:w-6 md:h-6" />
                        </button>

                        <div className="w-full h-40 sm:h-48 md:h-64 relative shrink-0 bg-linear-to-r from-(--color-lumex-purple-deep) to-(--color-lumex-purple-main)">
                            {selectedEvent.image_url && (
                                <Image 
                                    src={selectedEvent.image_url} 
                                    alt={selectedEvent.title} 
                                    fill 
                                    className="object-cover"
                                />
                            )}
                        </div>

                        <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-3 md:gap-4 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 md:[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-200">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-(--color-lumex-dark) leading-tight">
                                {selectedEvent.title}
                            </h2>
                            
                            <div className="flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm font-medium text-(--color-lumex-dark-muted)">
                                <div className="flex items-center gap-1.5 md:gap-2 bg-(--color-lumex-light) px-2.5 md:px-3 py-1 md:py-1.5 rounded-lg">
                                    <Calendar size={16} className="text-(--color-lumex-purple-main) w-4 h-4 md:w-5 md:h-5" />
                                    {new Date(selectedEvent.event_date).toLocaleDateString('tr-TR')}
                                </div>
                                <div className="flex items-center gap-1.5 md:gap-2 bg-(--color-lumex-light) px-2.5 md:px-3 py-1 md:py-1.5 rounded-lg">
                                    <Clock size={16} className="text-(--color-lumex-purple-main) w-4 h-4 md:w-5 md:h-5" />
                                    {selectedEvent.event_time ? selectedEvent.event_time.substring(0, 5) : "Belirtilmedi"}
                                </div>
                                <div className="flex items-center gap-1.5 md:gap-2 bg-(--color-lumex-light) px-2.5 md:px-3 py-1 md:py-1.5 rounded-lg break-all sm:break-normal">
                                    <MapPin size={16} className="text-(--color-lumex-purple-main) w-4 h-4 md:w-5 md:h-5 shrink-0" />
                                    {selectedEvent.location}
                                </div>
                            </div>

                            <div className="w-full h-px bg-gray-200 my-1 md:my-2 shrink-0"></div>

                            <div className="text-(--color-lumex-dark) text-sm md:text-base leading-relaxed">
                                {selectedEvent.content ? (
                                    <p className="whitespace-pre-wrap">{selectedEvent.content}</p>
                                ) : (
                                    <p className="italic text-(--color-lumex-dark-muted)">
                                        Bu etkinlik için henüz bir detay açıklaması girilmemiştir.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Announcements;