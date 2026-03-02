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
                        // Veriyi frontend'e uygun hale getiriyoruz
                        const formattedEvents = data.data.map((evt: any) => {
                            let parsedStudents = [];
                            let cleanMaterials = evt.materials_needed || "";
                            
                            // Öğrencileri ayıkla
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

    // --- AKSİYON FONKSİYONLARI ---

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
                fetchEvents(); // Listeyi yenile
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
        return <div className="flex justify-center p-10"><div className="w-8 h-8 border-4 border-(--color-lumex-purple-light) border-t-(--color-lumex-purple-main) rounded-full animate-spin"></div></div>;
    }

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col mt-6">
            
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-(--color-lumex-dark)">Bekleyen Etkinlik Talepleri</h2>
                <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    {events.length} Talep
                </span>
            </div>

            <div className="p-6 flex flex-col gap-4 max-h-150 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                {events.length > 0 ? (
                    events.map((evt) => (
                        <div key={evt.id} className="bg-white border border-gray-100 shadow-sm rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:shadow-md transition-shadow">
                            
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-bold text-(--color-lumex-dark) text-base">{evt.title}</h3>
                                    <span className="border border-gray-200 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-md bg-gray-50">
                                        {evt.type}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 font-medium">{evt.community}</p>
                                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mt-1">
                                    <span className="flex items-center gap-1"><CalendarClock size={14}/> {evt.date} • {evt.time}</span>
                                    {evt.participantCount > 0 && <span className="flex items-center gap-1"><Users size={14}/> {evt.participantCount} öğrenci katılımcı</span>}
                                    <span>Gönderildi: {evt.sentDate}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full lg:w-auto mt-2 lg:mt-0 shrink-0">
                                <button onClick={() => setSelectedEvent(evt)} className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 rounded-lg text-sm font-semibold transition-colors shadow-sm cursor-pointer">
                                    <Eye size={16} /> İncele
                                </button>
                                <button onClick={() => handleApprove(evt.id)} className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm cursor-pointer">
                                    <CheckCircle2 size={16} /> Onayla
                                </button>
                                <button onClick={() => handleRejectClick(evt.id)} className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm cursor-pointer">
                                    <XCircle size={16} /> Reddet
                                </button>
                            </div>

                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 opacity-50">
                        <CheckCircle2 size={48} className="text-gray-300 mb-4" />
                        <p className="text-gray-500 text-sm font-medium">Bekleyen etkinlik talebi bulunmuyor.</p>
                    </div>
                )}
            </div>

            {/* --- ETKİNLİK DETAYLARI MODALI --- */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setSelectedEvent(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl relative animate-in zoom-in-95 duration-200 flex flex-col overflow-hidden max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                        
                        <div className="bg-white p-6 border-b border-gray-100 flex justify-between items-start shrink-0">
                            <div>
                                <h2 className="text-xl font-bold text-(--color-lumex-dark)">Etkinlik Detayları</h2>
                                <p className="text-sm text-gray-500 mt-1">Etkinlik bilgilerini detaylıca inceleyip karar verin.</p>
                            </div>
                            <button onClick={() => setSelectedEvent(null)} className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors cursor-pointer">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-8 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                            <div>
                                <h3 className="text-2xl font-bold text-(--color-lumex-dark) mb-3">{selectedEvent.title}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="bg-[#0a192f] text-white text-xs font-bold px-3 py-1 rounded-md">{selectedEvent.type}</span>
                                    <span className="border border-gray-200 text-gray-600 bg-white text-xs font-bold px-3 py-1 rounded-md">{selectedEvent.community}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-gray-50 p-5 rounded-xl border border-gray-100">
                                <div className="flex flex-col gap-1"><span className="text-xs font-semibold text-gray-500 uppercase">Tarih</span><span className="text-sm font-bold text-(--color-lumex-dark)">{selectedEvent.date}</span></div>
                                <div className="flex flex-col gap-1"><span className="text-xs font-semibold text-gray-500 uppercase">Saat</span><span className="text-sm font-bold text-(--color-lumex-dark)">{selectedEvent.time}</span></div>
                                <div className="flex flex-col gap-1"><span className="text-xs font-semibold text-gray-500 uppercase">Konum</span><span className="text-sm font-bold text-(--color-lumex-dark)">{selectedEvent.location || '-'}</span></div>
                                <div className="flex flex-col gap-1"><span className="text-xs font-semibold text-gray-500 uppercase">Katılımcı</span><span className="text-sm font-bold text-(--color-lumex-dark)">{selectedEvent.participantCount} Öğrenci</span></div>
                            </div>

                            {selectedEvent.description && (
                                <div>
                                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Etkinlik Açıklaması</h4>
                                    <p className="text-sm text-(--color-lumex-dark) leading-relaxed">{selectedEvent.description}</p>
                                </div>
                            )}

                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">Ek Talepler ve Detaylar</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white border border-gray-200 p-4 rounded-xl">
                                        <p className="text-xs font-bold text-gray-500 mb-1">Konuşmacı / Dış Katılımcı</p>
                                        <p className="text-sm font-semibold text-(--color-lumex-dark)">{selectedEvent.details.hasSpeaker}</p>
                                        {selectedEvent.details.hasSpeaker === "Evet" && <p className="text-xs text-gray-500 mt-2">{selectedEvent.details.speakerInfo}</p>}
                                    </div>
                                    <div className="bg-white border border-gray-200 p-4 rounded-xl">
                                        <p className="text-xs font-bold text-gray-500 mb-1">Stant Talebi</p>
                                        <p className="text-sm font-semibold text-(--color-lumex-dark)">{selectedEvent.details.hasBooth}</p>
                                        {selectedEvent.details.hasBooth === "Evet" && <p className="text-xs text-gray-500 mt-2">{selectedEvent.details.boothInfo}</p>}
                                    </div>
                                    <div className="bg-white border border-gray-200 p-4 rounded-xl">
                                        <p className="text-xs font-bold text-gray-500 mb-1">Afiş / Flama Talebi</p>
                                        <p className="text-sm font-semibold text-(--color-lumex-dark)">{selectedEvent.details.hasBanner}</p>
                                        {selectedEvent.details.hasBanner === "Evet" && <p className="text-xs text-gray-500 mt-2">{selectedEvent.details.bannerInfo}</p>}
                                    </div>
                                    <div className="bg-white border border-gray-200 p-4 rounded-xl">
                                        <p className="text-xs font-bold text-gray-500 mb-1">Diğer İhtiyaçlar</p>
                                        <p className="text-xs text-(--color-lumex-dark) mt-1">{selectedEvent.details.otherNeeds || "Belirtilmemiş"}</p>
                                    </div>
                                </div>
                            </div>

                            {selectedEvent.details.students && selectedEvent.details.students.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2 mb-4">Katılacak Öğrenci Listesi ({selectedEvent.details.students.length})</h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                                                    <th className="p-3 font-semibold rounded-tl-lg">Ad Soyad</th>
                                                    <th className="p-3 font-semibold">Öğrenci No</th>
                                                    <th className="p-3 font-semibold">Bölüm/Yol/Yevmiye</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm text-(--color-lumex-dark)">
                                                {selectedEvent.details.students.map((stu: any, idx: number) => (
                                                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                                                        <td className="p-3 font-medium">{stu.name}</td>
                                                        <td className="p-3">{stu.no}</td>
                                                        <td className="p-3 text-xs text-gray-500">{stu.dept} {stu.travel ? ` | ${stu.travel}` : ''}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-blue-800">
                                <Info size={20} className="shrink-0 mt-0.5" />
                                <p className="text-sm leading-relaxed">
                                    <strong>Not:</strong> Bu etkinliği onaylamanız halinde doğrudan yöneticiye (SKS) iletilecektir.
                                </p>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-wrap sm:flex-nowrap items-center justify-end gap-3 shrink-0 rounded-b-2xl">
                            <button onClick={() => setSelectedEvent(null)} className="w-full sm:w-auto px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors text-sm cursor-pointer">Kapat</button>
                            <button onClick={() => handleRejectClick(selectedEvent.id)} className="w-full sm:w-auto px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer"><XCircle size={18} /> Reddet</button>
                            <button onClick={() => handleApprove(selectedEvent.id)} className="w-full sm:w-auto px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer"><CheckCircle2 size={18} /> Onayla ve Yönetime İlet</button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- ZORUNLU RED SEBEBİ MODALI --- */}
            {rejectingEventId && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setRejectingEventId(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative flex flex-col overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-100 flex items-center gap-3 bg-red-50/50">
                            <div className="bg-red-100 p-2 rounded-full text-red-600 shrink-0"><MessageSquareWarning size={24} /></div>
                            <div><h3 className="text-lg font-bold text-red-700">Etkinliği Reddet</h3><p className="text-xs text-red-500/80 font-medium">Bu işlem geri alınamaz.</p></div>
                        </div>
                        <div className="p-6 space-y-4">
                            <label className="block text-sm font-semibold text-(--color-lumex-dark)">Reddetme Sebebi <span className="text-red-500">*</span></label>
                            <p className="text-xs text-gray-500 -mt-2 mb-2">Lütfen topluluk başkanına iletilecek red sebebini giriniz.</p>
                            <textarea 
                                rows={4} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Örn: Belirtilen tarihte amfi tiyatroda başka bir etkinlik bulunmaktadır..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all resize-none"
                            ></textarea>
                        </div>
                        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 rounded-b-2xl">
                            <button onClick={() => {setRejectingEventId(null); setRejectReason("");}} className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors text-sm cursor-pointer">İptal</button>
                            <button onClick={submitReject} disabled={!rejectReason.trim()} className="px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold rounded-xl transition-colors text-sm flex items-center gap-2 shadow-sm cursor-pointer disabled:cursor-not-allowed"><XCircle size={18} /> Etkinliği Reddet</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PendingEvents;