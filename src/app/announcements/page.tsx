"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Clock, MapPin, Calendar, Search } from "lucide-react";
import AnnouncementsCard from "@/components/home/AnnouncementsCard";

interface Announcement {
    id: number;
    title: string;
    event_date: string;
    event_time: string;
    location: string;
    content: string;
    image_url: string;
}

export default function AnnouncementsPage() {
    const [events, setEvents] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedEvent, setSelectedEvent] = useState<Announcement | null>(null);

    useEffect(() => {
        const fetchAllAnnouncements = async () => {
            try {
                const res = await fetch("/api/announcements");
                const data = await res.json();
                
                if (data.success) setEvents(data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllAnnouncements();
    }, []);

    const filteredEvents = events.filter(evt => 
        (evt.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (evt.location?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );

    const upcomingEvents = filteredEvents.filter(evt => new Date(evt.event_date) >= new Date(new Date().setHours(0,0,0,0)));
    const pastEvents = filteredEvents.filter(evt => new Date(evt.event_date) < new Date(new Date().setHours(0,0,0,0)));

    const closeModal = () => setSelectedEvent(null);

    return (
        <div className="w-full min-h-screen bg-(--color-lumex-light) py-10">
            <div className="container mx-auto px-4 md:px-0">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-(--color-lumex-dark) border-l-4 border-(--color-lumex-accent) pl-4">
                        Tüm Duyurular & Etkinlikler
                    </h1>
                    <div className="relative w-full md:w-80">
                        <input 
                            type="text" 
                            placeholder="Etkinlik veya konum ara..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-(--color-lumex-purple-main) transition-all"
                        />
                        <Search size={18} className="absolute left-3 top-3.5 text-gray-400" />
                    </div>
                </div>

                {loading ? (
                    <div className="w-full text-center py-20 text-(--color-lumex-dark-muted) flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-(--color-lumex-purple-light) border-t-(--color-lumex-purple-main) rounded-full animate-spin"></div>
                        Etkinlikler yükleniyor...
                    </div>
                ) : (
                    <div className="flex flex-col gap-12">
                        
                        <section>
                            <h2 className="text-xl font-bold text-(--color-lumex-purple-main) mb-6 flex items-center gap-2">
                                <Calendar size={20} /> Yaklaşan Etkinlikler
                            </h2>
                            {upcomingEvents.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {upcomingEvents.map((evt) => (
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
                                <div className="w-full py-10 bg-white rounded-xl border border-dashed border-gray-300 text-center text-(--color-lumex-dark-muted)">
                                    Yaklaşan bir etkinlik bulunamadı.
                                </div>
                            )}
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-(--color-lumex-dark-muted) mb-6 flex items-center gap-2">
                                <Clock size={20} /> Geçmiş Etkinlikler
                            </h2>
                            {pastEvents.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-80 hover:opacity-100 transition-opacity">
                                    {pastEvents.map((evt) => (
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
                                <div className="w-full py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center text-gray-400">
                                    Geçmiş etkinlik bulunamadı.
                                </div>
                            )}
                        </section>

                    </div>
                )}
            </div>

            {selectedEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
                    <div className="absolute inset-0 cursor-pointer" onClick={closeModal}></div>
                    <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200">
                        <button 
                            onClick={closeModal}
                            className="absolute top-4 right-4 z-20 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors cursor-pointer backdrop-blur-md"
                        >
                            <X size={20} />
                        </button>
                        <div className="w-full h-48 md:h-64 relative bg-linear-to-r from-(--color-lumex-purple-deep) to-(--color-lumex-purple-main)">
                            {selectedEvent.image_url && (
                                <Image 
                                    src={selectedEvent.image_url} 
                                    alt={selectedEvent.title} 
                                    fill 
                                    className="object-cover"
                                />
                            )}
                        </div>
                        <div className="p-6 md:p-8 flex flex-col gap-4">
                            <h2 className="text-2xl font-bold text-(--color-lumex-dark)">{selectedEvent.title}</h2>
                            <div className="flex flex-wrap gap-4 text-sm font-medium text-(--color-lumex-dark-muted)">
                                <div className="flex items-center gap-2 bg-(--color-lumex-light) px-3 py-1.5 rounded-lg">
                                    <Calendar size={18} className="text-(--color-lumex-purple-main)" />
                                    {new Date(selectedEvent.event_date).toLocaleDateString('tr-TR')}
                                </div>
                                <div className="flex items-center gap-2 bg-(--color-lumex-light) px-3 py-1.5 rounded-lg">
                                    <Clock size={18} className="text-(--color-lumex-purple-main)" />
                                    {selectedEvent.event_time ? selectedEvent.event_time.substring(0, 5) : "Belirtilmedi"}
                                </div>
                                <div className="flex items-center gap-2 bg-(--color-lumex-light) px-3 py-1.5 rounded-lg">
                                    <MapPin size={18} className="text-(--color-lumex-purple-main)" />
                                    {selectedEvent.location}
                                </div>
                            </div>
                            <div className="w-full h-px bg-gray-200 my-2"></div>
                            <div className="text-(--color-lumex-dark) leading-relaxed">
                                {selectedEvent.content ? (
                                    <p>{selectedEvent.content}</p>
                                ) : (
                                    <p className="italic text-(--color-lumex-dark-muted)">Bu etkinlik için henüz bir detay açıklaması girilmemiştir.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}