"use client";

import { useState, useEffect } from "react";
import { CalendarDays, Send, XCircle, CheckCircle2, Info } from "lucide-react";

interface ReviewedEvent {
    id: number;
    title: string;
    type: string;
    community: string;
    eventDate: string;
    reviewDate: string;
    status: "approved" | "rejected";
    rejectReason: string | null;
    originalStatus: string;
}

const ReviewedEvents = () => {
    const [events, setEvents] = useState<ReviewedEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviewedEvents = async () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    const userId = parsedUser.id || parsedUser.user_id;

                    if (userId) {
                        const res = await fetch(`/api/advisor/applications/reviewed?userId=${userId}`);
                        const data = await res.json();
                        
                        if (data.success) {
                            const formattedEvents = data.data.map((evt: any) => {
                                // Tarih formatlama
                                const eDate = evt.event_date ? new Date(evt.event_date).toLocaleDateString('tr-TR') : "";
                                const eTime = evt.event_time ? evt.event_time.slice(0, 5) : "";
                                const rDate = evt.updated_at ? new Date(evt.updated_at).toLocaleDateString('tr-TR') : "";
                                
                                // Hoca reddettiyse status "rejected", hoca onaylayıp (SKS'ye geçtiyse) status "approved"
                                const isRejected = evt.current_status === 'rejected_by_advisor';

                                return {
                                    id: evt.id,
                                    title: evt.title,
                                    type: evt.event_type,
                                    community: evt.community_name,
                                    eventDate: `${eDate} ${eTime ? `• ${eTime}` : ''}`,
                                    reviewDate: rDate,
                                    status: isRejected ? "rejected" : "approved",
                                    rejectReason: evt.rejectReason,
                                    originalStatus: evt.current_status // Ekstra bilgi (SKS onayladı mı vb. için ileride kullanılabilir)
                                };
                            });
                            setEvents(formattedEvents);
                        }
                    }
                } catch (error) {
                    console.error("Geçmiş etkinlikler çekilirken hata oluştu:", error);
                }
            }
            setLoading(false);
        };

        fetchReviewedEvents();
    }, []);

    if (loading) {
        return <div className="flex justify-center p-10 mt-6"><div className="w-8 h-8 border-4 border-(--color-lumex-purple-light) border-t-(--color-lumex-purple-main) rounded-full animate-spin"></div></div>;
    }

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col mt-6">
            
            {/* BAŞLIK */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-(--color-lumex-dark)">Değerlendirilmiş Etkinlik Talepleri</h2>
                    <p className="text-sm text-gray-500 mt-1">Geçmişte onayladığınız veya reddettiğiniz etkinlikler (Kurumsal Hafıza).</p>
                </div>
                <div className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1.5 rounded-full shadow-inner">
                    Toplam {events.length} Kayıt
                </div>
            </div>

            {/* LİSTE */}
            <div className="p-6 flex flex-col gap-4 max-h-150 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                {events.length > 0 ? (
                    events.map((evt) => (
                        <div 
                            key={evt.id} 
                            className={`p-5 rounded-xl border flex flex-col gap-3 transition-shadow hover:shadow-sm ${
                                evt.status === "approved" 
                                ? "bg-emerald-50/40 border-emerald-100/60" 
                                : "bg-red-50/40 border-red-100/60"
                            }`}
                        >
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                
                                {/* Etkinlik Bilgileri */}
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-(--color-lumex-dark) text-base">{evt.title}</h3>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md text-white ${
                                            evt.status === "approved" ? "bg-emerald-500" : "bg-red-500"
                                        }`}>
                                            {evt.type}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 font-medium">{evt.community}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                                        <span className="flex items-center gap-1.5"><CalendarDays size={14}/> {evt.eventDate}</span>
                                        <span>Değerlendirme: {evt.reviewDate}</span>
                                    </div>
                                </div>

                                {/* Durum Rozeti */}
                                <div className="shrink-0">
                                    {evt.status === "approved" ? (
                                        <div className="bg-white text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm border border-emerald-200">
                                            <Send size={14} className="text-emerald-500" /> Yönetime İletildi
                                        </div>
                                    ) : (
                                        <div className="bg-white text-red-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm border border-red-200">
                                            <XCircle size={14} className="text-red-500" /> Reddedildi
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* RED SEBEBİ (Eğer reddedildiyse görünür) */}
                            {evt.status === "rejected" && evt.rejectReason && (
                                <div className="mt-2 bg-white/80 border border-red-100 p-3 rounded-lg flex gap-2.5 items-start">
                                    <Info size={16} className="text-red-500 mt-0.5 shrink-0" />
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-xs font-bold text-red-700 uppercase tracking-wide">Red Sebebi</span>
                                        <p className="text-sm text-gray-700 leading-relaxed">{evt.rejectReason}</p>
                                    </div>
                                </div>
                            )}

                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 opacity-50">
                        <CheckCircle2 size={40} className="text-gray-300 mb-3" />
                        <p className="text-gray-500 text-sm font-medium">Henüz değerlendirilmiş bir etkinlik bulunmuyor.</p>
                    </div>
                )}
            </div>
            
        </div>
    );
};

export default ReviewedEvents;