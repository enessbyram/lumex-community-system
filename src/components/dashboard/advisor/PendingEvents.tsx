"use client";

import { useState, useEffect } from "react";
import { Eye, CheckCircle2, XCircle, X, CalendarClock, Users, Info, MessageSquareWarning } from "lucide-react";

const PendingEvents = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<number | null>(null);

    const [selectedEvent, setSelectedEvent] = useState<any>(null); 
    const [rejectingEventId, setRejectingEventId] = useState<number | null>(null);
    const [rejectReason, setRejectReason] = useState("");

    const fetchEvents = async () => {
        setLoading(true);
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            const uid = parsedUser.id || parsedUser.user_id;
            setUserId(uid);

            if (uid) {
                try {
                    const res = await fetch(`/api/advisor/applications?userId=${uid}`);
                    const data = await res.json();
                    if (data.success) {
                        const formattedEvents = data.data.map((evt: any) => {
                            let parsedStudents = [];
                            let cleanMaterials = evt.materials_needed || "";
                            
                            if (cleanMaterials.includes('[KATILACAK ÖĞRENCİLER]:')) {
                                const parts = cleanMaterials.split('[KATILACAK ÖĞRENCİLER]:');
                                cleanMaterials = parts[0].trim();
                                try { parsedStudents = JSON.parse(parts[1].trim()); } catch(e) {}
                            }

                            return {
                                id: evt.id,
                                title: evt.title,
                                type: evt.event_type,
                                community: evt.community_name,
                                date: new Date(evt.event_date).toLocaleDateString('tr-TR'),
                                time: evt.event_time?.slice(0, 5) || "",
                                location: evt.location,
                                participantCount: parsedStudents.length || 0,
                                sentDate: new Date(evt.created_at).toLocaleDateString('tr-TR'),
                                description: evt.description,
                                details: {
                                    hasSpeaker: evt.has_speaker ? "Evet" : "Hayır",
                                    speakerInfo: evt.speaker_info,
                                    hasBooth: evt.has_stand ? "Evet" : "Hayır",
                                    boothInfo: evt.stand_details,
                                    hasBanner: evt.has_poster ? "Evet" : "Hayır",
                                    bannerInfo: evt.poster_details,
                                    otherNeeds: cleanMaterials,
                                    students: parsedStudents
                                }
                            };
                        });
                        setEvents(formattedEvents);
                    }
                } catch (error) { console.error(error); }
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleAction = async (id: number, action: 'approve' | 'reject', reason: string = "") => {
        if (!userId) return;
        
        try {
            const res = await fetch('/api/advisor/applications', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ applicationId: id, action, userId, rejectReason: reason })
            });
            const data = await res.json();
            
            if (data.success) {
                alert(data.message);
                fetchEvents();
                if (action === 'approve') setSelectedEvent(null);
            } else {
                alert("Hata: " + data.message);
            }
        } catch (error) {
            alert("İşlem sırasında sunucu hatası oluştu.");
        }
    };

    const handleApprove = (id: number) => {
        if(confirm("Bu etkinliği onaylamak ve üst yönetime (SKS) iletmek istediğinize emin misiniz?")) {
            handleAction(id, 'approve');
        }
    };

    const handleRejectClick = (id: number) => setRejectingEventId(id);

    const submitReject = () => {
        if (!rejectReason.trim()) {
            alert("Lütfen reddetme sebebini giriniz!");
            return;
        }
        handleAction(rejectingEventId!, 'reject', rejectReason);
        setRejectingEventId(null);
        setRejectReason("");
        setSelectedEvent(null); 
    };

    if (loading) {
        return <div className="flex justify-center p-6 md:p-10"><div className="w-6 h-6 md:w-8 md:h-8 border-3 md:border-4 border-(--color-lumex-purple-light) border-t-(--color-lumex-purple-main) rounded-full animate-spin"></div></div>;
    }

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col mt-4 md:mt-6">
            
            <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-base md:text-lg font-bold text-(--color-lumex-dark)">Bekleyen Etkinlik Talepleri</h2>
                <span className="bg-yellow-500 text-white text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 rounded-full shadow-sm">
                    {events.length} Talep
                </span>
            </div>

            <div className="p-3 md:p-6 flex flex-col gap-3 md:gap-4 max-h-96 md:max-h-150 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 md:[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                {events.length > 0 ? (
                    events.map((evt) => (
                        <div key={evt.id} className="bg-white border border-gray-100 shadow-sm rounded-lg md:rounded-xl p-3 md:p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-3 md:gap-5 hover:shadow-md transition-shadow">
                            
                            <div className="flex flex-col gap-1.5 md:gap-2 w-full">
                                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                                    <h3 className="font-bold text-(--color-lumex-dark) text-sm md:text-base wrap-break-word w-full sm:w-auto">{evt.title}</h3>
                                    <span className="border border-gray-200 text-gray-600 text-[10px] md:text-xs font-semibold px-2 py-0.5 md:px-2.5 md:py-1 rounded-md bg-gray-50 shrink-0">
                                        {evt.type}
                                    </span>
                                </div>
                                <p className="text-xs md:text-sm text-gray-500 font-medium">{evt.community}</p>
                                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] md:text-xs text-gray-400 mt-0.5 md:mt-1">
                                    <span className="flex items-center gap-1 shrink-0"><CalendarClock size={12} className="md:w-3.5 md:h-3.5"/> {evt.date} • {evt.time}</span>
                                    {evt.participantCount > 0 && <span className="flex items-center gap-1 shrink-0"><Users size={12} className="md:w-3.5 md:h-3.5"/> {evt.participantCount} öğrenci katılımcı</span>}
                                    <span className="shrink-0 w-full sm:w-auto">Gönderildi: {evt.sentDate}</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full xl:w-auto mt-1 md:mt-2 xl:mt-0 shrink-0">
                                <button onClick={() => setSelectedEvent(evt)} className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 md:px-4 py-2 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 rounded-lg text-xs md:text-sm font-semibold transition-colors shadow-sm cursor-pointer">
                                    <Eye size={14} className="md:w-4 md:h-4" /> İncele
                                </button>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <button onClick={() => handleApprove(evt.id)} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 md:px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs md:text-sm font-semibold transition-colors shadow-sm cursor-pointer">
                                        <CheckCircle2 size={14} className="md:w-4 md:h-4" /> Onayla
                                    </button>
                                    <button onClick={() => handleRejectClick(evt.id)} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 md:px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs md:text-sm font-semibold transition-colors shadow-sm cursor-pointer">
                                        <XCircle size={14} className="md:w-4 md:h-4" /> Reddet
                                    </button>
                                </div>
                            </div>

                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-6 md:py-10 opacity-50">
                        <CheckCircle2 size={36} className="text-gray-300 mb-3 md:w-12 md:h-12 md:mb-4" />
                        <p className="text-gray-500 text-xs md:text-sm font-medium">Bekleyen etkinlik talebi bulunmuyor.</p>
                    </div>
                )}
            </div>

            {selectedEvent && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4 animate-in fade-in duration-200" onClick={() => setSelectedEvent(null)}>
                    <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl w-full max-w-3xl relative animate-in zoom-in-95 duration-200 flex flex-col overflow-hidden max-h-[95vh] md:max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                        
                        <div className="bg-white p-4 md:p-6 border-b border-gray-100 flex justify-between items-start shrink-0">
                            <div>
                                <h2 className="text-lg md:text-xl font-bold text-(--color-lumex-dark)">Etkinlik Detayları</h2>
                                <p className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">Etkinlik bilgilerini detaylıca inceleyip karar verin.</p>
                            </div>
                            <button onClick={() => setSelectedEvent(null)} className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-1.5 md:p-2 rounded-full transition-colors cursor-pointer">
                                <X size={18} className="md:w-5 md:h-5" />
                            </button>
                        </div>

                        <div className="p-4 md:p-6 overflow-y-auto space-y-5 md:space-y-8 [&::-webkit-scrollbar]:w-1.5 md:[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                            <div>
                                <h3 className="text-lg md:text-2xl font-bold text-(--color-lumex-dark) mb-2 md:mb-3">{selectedEvent.title}</h3>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="bg-[#0a192f] text-white text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-md">{selectedEvent.type}</span>
                                    <span className="border border-gray-200 text-gray-600 bg-white text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-md">{selectedEvent.community}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 bg-gray-50 p-3 md:p-5 rounded-lg md:rounded-xl border border-gray-100">
                                <div className="flex flex-col gap-0.5 md:gap-1"><span className="text-[10px] md:text-xs font-semibold text-gray-500 uppercase">Tarih</span><span className="text-xs md:text-sm font-bold text-(--color-lumex-dark)">{selectedEvent.date}</span></div>
                                <div className="flex flex-col gap-0.5 md:gap-1"><span className="text-[10px] md:text-xs font-semibold text-gray-500 uppercase">Saat</span><span className="text-xs md:text-sm font-bold text-(--color-lumex-dark)">{selectedEvent.time}</span></div>
                                <div className="flex flex-col gap-0.5 md:gap-1"><span className="text-[10px] md:text-xs font-semibold text-gray-500 uppercase">Konum</span><span className="text-xs md:text-sm font-bold text-(--color-lumex-dark) wrap-break-word">{selectedEvent.location || '-'}</span></div>
                                <div className="flex flex-col gap-0.5 md:gap-1"><span className="text-[10px] md:text-xs font-semibold text-gray-500 uppercase">Katılımcı</span><span className="text-xs md:text-sm font-bold text-(--color-lumex-dark)">{selectedEvent.participantCount} Öğrenci</span></div>
                            </div>

                            {selectedEvent.description && (
                                <div>
                                    <h4 className="text-[10px] md:text-sm font-bold text-gray-400 uppercase tracking-wider mb-1.5 md:mb-2">Etkinlik Açıklaması</h4>
                                    <p className="text-xs md:text-sm text-(--color-lumex-dark) leading-relaxed whitespace-pre-wrap">{selectedEvent.description}</p>
                                </div>
                            )}

                            <div className="space-y-3 md:space-y-4">
                                <h4 className="text-[10px] md:text-sm font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-1.5 md:pb-2">Ek Talepler ve Detaylar</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                    <div className="bg-white border border-gray-200 p-3 md:p-4 rounded-lg md:rounded-xl">
                                        <p className="text-[10px] md:text-xs font-bold text-gray-500 mb-1">Konuşmacı / Dış Katılımcı</p>
                                        <p className="text-xs md:text-sm font-semibold text-(--color-lumex-dark)">{selectedEvent.details.hasSpeaker}</p>
                                        {selectedEvent.details.hasSpeaker === "Evet" && <p className="text-[10px] md:text-xs text-gray-500 mt-1 md:mt-2">{selectedEvent.details.speakerInfo}</p>}
                                    </div>
                                    <div className="bg-white border border-gray-200 p-3 md:p-4 rounded-lg md:rounded-xl">
                                        <p className="text-[10px] md:text-xs font-bold text-gray-500 mb-1">Stant Talebi</p>
                                        <p className="text-xs md:text-sm font-semibold text-(--color-lumex-dark)">{selectedEvent.details.hasBooth}</p>
                                        {selectedEvent.details.hasBooth === "Evet" && <p className="text-[10px] md:text-xs text-gray-500 mt-1 md:mt-2">{selectedEvent.details.boothInfo}</p>}
                                    </div>
                                    <div className="bg-white border border-gray-200 p-3 md:p-4 rounded-lg md:rounded-xl">
                                        <p className="text-[10px] md:text-xs font-bold text-gray-500 mb-1">Afiş / Flama Talebi</p>
                                        <p className="text-xs md:text-sm font-semibold text-(--color-lumex-dark)">{selectedEvent.details.hasBanner}</p>
                                        {selectedEvent.details.hasBanner === "Evet" && <p className="text-[10px] md:text-xs text-gray-500 mt-1 md:mt-2">{selectedEvent.details.bannerInfo}</p>}
                                    </div>
                                    <div className="bg-white border border-gray-200 p-3 md:p-4 rounded-lg md:rounded-xl">
                                        <p className="text-[10px] md:text-xs font-bold text-gray-500 mb-1">Diğer İhtiyaçlar</p>
                                        <p className="text-[10px] md:text-xs text-(--color-lumex-dark) mt-1">{selectedEvent.details.otherNeeds || "Belirtilmemiş"}</p>
                                    </div>
                                </div>
                            </div>

                            {selectedEvent.details.students && selectedEvent.details.students.length > 0 && (
                                <div>
                                    <h4 className="text-[10px] md:text-sm font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-1.5 md:pb-2 mb-2 md:mb-4">Katılacak Öğrenci Listesi ({selectedEvent.details.students.length})</h4>
                                    <div className="overflow-x-auto rounded-lg border border-gray-100">
                                        <table className="w-full text-left border-collapse min-w-100">
                                            <thead>
                                                <tr className="bg-gray-50 text-gray-500 text-[10px] md:text-xs uppercase">
                                                    <th className="p-2 md:p-3 font-semibold rounded-tl-lg w-[40%]">Ad Soyad</th>
                                                    <th className="p-2 md:p-3 font-semibold w-[25%]">Öğrenci No</th>
                                                    <th className="p-2 md:p-3 font-semibold rounded-tr-lg w-[35%]">Bölüm/Yol/Yevmiye</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-xs md:text-sm text-(--color-lumex-dark)">
                                                {selectedEvent.details.students.map((stu: any, idx: number) => (
                                                    <tr key={idx} className="border-t border-gray-100 hover:bg-gray-50">
                                                        <td className="p-2 md:p-3 font-medium truncate max-w-37.5">{stu.name}</td>
                                                        <td className="p-2 md:p-3 truncate">{stu.no}</td>
                                                        <td className="p-2 md:p-3 text-[10px] md:text-xs text-gray-500 truncate max-w-37.5">{stu.dept} {stu.travel ? ` | ${stu.travel}` : ''}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            <div className="bg-blue-50 border border-blue-100 rounded-lg md:rounded-xl p-3 md:p-4 flex items-start gap-2 md:gap-3 text-blue-800">
                                <Info size={16} className="shrink-0 mt-0.5 md:w-5 md:h-5" />
                                <p className="text-xs md:text-sm leading-relaxed">
                                    <strong>Not:</strong> Bu etkinliği onaylamanız halinde doğrudan yöneticiye (SKS) iletilecektir.
                                </p>
                            </div>
                        </div>

                        <div className="p-4 md:p-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-end gap-2 md:gap-3 shrink-0 rounded-b-xl md:rounded-b-2xl">
                            <button onClick={() => setSelectedEvent(null)} className="w-full sm:w-auto px-4 md:px-6 py-2.5 md:py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg md:rounded-xl hover:bg-gray-100 transition-colors text-xs md:text-sm cursor-pointer order-last sm:order-first">Kapat</button>
                            <div className="flex w-full sm:w-auto gap-2 md:gap-3">
                                <button onClick={() => handleRejectClick(selectedEvent.id)} className="flex-1 sm:flex-none px-3 md:px-6 py-2.5 md:py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg md:rounded-xl transition-colors text-xs md:text-sm flex items-center justify-center gap-1.5 md:gap-2 shadow-sm cursor-pointer"><XCircle size={14} className="md:w-4.5 md:h-4.5" /> Reddet</button>
                                <button onClick={() => handleApprove(selectedEvent.id)} className="flex-1 sm:flex-none px-3 md:px-6 py-2.5 md:py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg md:rounded-xl transition-colors text-xs md:text-sm flex items-center justify-center gap-1.5 md:gap-2 shadow-sm cursor-pointer"><CheckCircle2 size={14} className="md:w-4.5 md:h-4.5" /> Onayla</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {rejectingEventId && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60 flex items-center justify-center p-3 md:p-4 animate-in fade-in duration-200" onClick={() => setRejectingEventId(null)}>
                    <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl w-full max-w-md relative flex flex-col overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                        <div className="p-4 md:p-6 border-b border-gray-100 flex items-center gap-2 md:gap-3 bg-red-50/50">
                            <div className="bg-red-100 p-1.5 md:p-2 rounded-full text-red-600 shrink-0"><MessageSquareWarning size={20} className="md:w-6 md:h-6" /></div>
                            <div><h3 className="text-base md:text-lg font-bold text-red-700">Etkinliği Reddet</h3><p className="text-[10px] md:text-xs text-red-500/80 font-medium mt-0.5">Bu işlem geri alınamaz.</p></div>
                        </div>
                        <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                            <div>
                                <label className="block text-xs md:text-sm font-semibold text-(--color-lumex-dark) mb-0.5 md:mb-1">Reddetme Sebebi <span className="text-red-500">*</span></label>
                                <p className="text-[10px] md:text-xs text-gray-500 mb-2">Lütfen topluluk başkanına iletilecek red sebebini giriniz.</p>
                            </div>
                            <textarea 
                                rows={4} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Örn: Belirtilen tarihte amfi tiyatroda başka bir etkinlik bulunmaktadır..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg md:rounded-xl p-3 md:p-4 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all resize-none"
                            ></textarea>
                        </div>
                        <div className="p-4 md:p-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-2 md:gap-3 rounded-b-xl md:rounded-b-2xl">
                            <button onClick={() => {setRejectingEventId(null); setRejectReason("");}} className="w-full sm:w-auto px-4 md:px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg md:rounded-xl hover:bg-gray-100 transition-colors text-xs md:text-sm cursor-pointer order-last sm:order-first">İptal</button>
                            <button onClick={submitReject} disabled={!rejectReason.trim()} className="w-full sm:w-auto px-4 md:px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold rounded-lg md:rounded-xl transition-colors text-xs md:text-sm flex items-center justify-center gap-1.5 md:gap-2 shadow-sm cursor-pointer disabled:cursor-not-allowed"><XCircle size={14} className="md:w-4.5 md:h-4.5" /> Etkinliği Reddet</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PendingEvents;