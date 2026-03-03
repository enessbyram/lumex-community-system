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
                                const eDate = evt.event_date ? new Date(evt.event_date).toLocaleDateString('tr-TR') : "";
                                const eTime = evt.event_time ? evt.event_time.slice(0, 5) : "";
                                const rDate = evt.updated_at ? new Date(evt.updated_at).toLocaleDateString('tr-TR') : "";
                                
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
                                    originalStatus: evt.current_status
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
        return <div className="flex justify-center p-6 md:p-10 mt-4 md:mt-6"><div className="w-6 h-6 md:w-8 md:h-8 border-3 md:border-4 border-(--color-lumex-purple-light) border-t-(--color-lumex-purple-main) rounded-full animate-spin"></div></div>;
    }

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col mt-4 md:mt-6">
            
            <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-0">
                <div>
                    <h2 className="text-base md:text-lg font-bold text-(--color-lumex-dark)">Değerlendirilmiş Etkinlik Talepleri</h2>
                    <p className="text-[10px] md:text-sm text-gray-500 mt-0.5 md:mt-1">Geçmişte onayladığınız veya reddettiğiniz etkinlikler.</p>
                </div>
                <div className="bg-gray-100 text-gray-600 text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full shadow-inner w-fit sm:w-auto self-start sm:self-auto shrink-0">
                    Toplam {events.length} Kayıt
                </div>
            </div>

            <div className="p-3 md:p-6 flex flex-col gap-3 md:gap-4 max-h-96 md:max-h-150 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 md:[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                {events.length > 0 ? (
                    events.map((evt) => (
                        <div 
                            key={evt.id} 
                            className={`p-4 md:p-5 rounded-lg md:rounded-xl border flex flex-col gap-2.5 md:gap-3 transition-shadow hover:shadow-sm ${
                                evt.status === "approved" 
                                ? "bg-emerald-50/40 border-emerald-100/60" 
                                : "bg-red-50/40 border-red-100/60"
                            }`}
                        >
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 md:gap-4">
                                
                                <div className="flex flex-col gap-1 md:gap-1.5 min-w-0 w-full">
                                    <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
                                        <h3 className="font-bold text-(--color-lumex-dark) text-sm md:text-base wrap-break-word w-full sm:w-auto">{evt.title}</h3>
                                        <span className={`text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-md text-white shrink-0 ${
                                            evt.status === "approved" ? "bg-emerald-500" : "bg-red-500"
                                        }`}>
                                            {evt.type}
                                        </span>
                                    </div>
                                    <p className="text-xs md:text-sm text-gray-500 font-medium truncate">{evt.community}</p>
                                    <div className="flex flex-wrap items-center gap-2 md:gap-4 text-[10px] md:text-xs text-gray-400 mt-0.5 md:mt-1">
                                        <span className="flex items-center gap-1 md:gap-1.5 shrink-0"><CalendarDays size={12} className="md:w-3.5 md:h-3.5" /> {evt.eventDate}</span>
                                        <span className="shrink-0 w-full sm:w-auto mt-0.5 sm:mt-0">Değerlendirme: {evt.reviewDate}</span>
                                    </div>
                                </div>

                                <div className="shrink-0 self-start md:self-auto mt-1 md:mt-0">
                                    {evt.status === "approved" ? (
                                        <div className="bg-white text-emerald-700 text-[10px] md:text-xs font-bold px-2.5 md:px-3 py-1 md:py-1.5 rounded-md md:rounded-lg flex items-center gap-1 md:gap-1.5 shadow-sm border border-emerald-200 w-fit">
                                            <Send size={12} className="text-emerald-500 md:w-3.5 md:h-3.5" /> Yönetime İletildi
                                        </div>
                                    ) : (
                                        <div className="bg-white text-red-700 text-[10px] md:text-xs font-bold px-2.5 md:px-3 py-1 md:py-1.5 rounded-md md:rounded-lg flex items-center gap-1 md:gap-1.5 shadow-sm border border-red-200 w-fit">
                                            <XCircle size={12} className="text-red-500 md:w-3.5 md:h-3.5" /> Reddedildi
                                        </div>
                                    )}
                                </div>
                            </div>

                            {evt.status === "rejected" && evt.rejectReason && (
                                <div className="mt-1 md:mt-2 bg-white/80 border border-red-100 p-2.5 md:p-3 rounded-lg flex gap-2 md:gap-2.5 items-start">
                                    <Info size={14} className="text-red-500 mt-0.5 shrink-0 md:w-4 md:h-4" />
                                    <div className="flex flex-col gap-0.5 md:gap-1">
                                        <span className="text-[10px] md:text-xs font-bold text-red-700 uppercase tracking-wide">Red Sebebi</span>
                                        <p className="text-xs md:text-sm text-gray-700 leading-relaxed whitespace-pre-wrap wrap-break-word max-w-full">{evt.rejectReason}</p>
                                    </div>
                                </div>
                            )}

                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-6 md:py-10 opacity-50">
                        <CheckCircle2 size={36} className="text-gray-300 mb-2 md:w-10 md:h-10 md:mb-3" />
                        <p className="text-gray-500 text-xs md:text-sm font-medium">Henüz değerlendirilmiş bir etkinlik bulunmuyor.</p>
                    </div>
                )}
            </div>
            
        </div>
    );
};

export default ReviewedEvents;