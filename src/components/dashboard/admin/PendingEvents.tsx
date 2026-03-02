"use client";

import { useState, useEffect } from "react";
import { Eye, CheckCircle2, XCircle, X, CalendarClock, Users, MapPin, MessageSquareWarning, Info } from "lucide-react";

const PendingEvents = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<number | null>(null);

    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [rejectingId, setRejectingId] = useState<number | null>(null);
    const [rejectReason, setRejectReason] = useState("");

    const fetchEvents = async () => {
        setLoading(true);
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            const uid = parsedUser.id || parsedUser.user_id;
            setUserId(uid);
        }

        try {
            const res = await fetch('/api/admin/applications');
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
                        sender: evt.sender_name,
                        date: evt.event_date ? new Date(evt.event_date).toLocaleDateString('tr-TR') : "",
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
                            boothLoc: evt.stand_location,
                            hasBanner: evt.has_poster ? "Evet" : "Hayır",
                            bannerInfo: evt.poster_details,
                            otherNeeds: cleanMaterials,
                            students: parsedStudents
                        }
                    };
                });
                setEvents(formattedEvents);
            }
        } catch (error) { console.error("Admin etkinlikleri çekerken hata:", error); }
        setLoading(false);
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleAction = async (id: number, action: 'approve' | 'reject', reason: string = "") => {
        if (!userId) return alert("Kullanıcı kimliği bulunamadı.");
        
        try {
            const res = await fetch('/api/admin/applications', {
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
        if(confirm("Bu etkinliği onaylamak istediğinize emin misiniz? Sistemde aktif hale gelecek ve duyurulara eklenecektir.")) {
            handleAction(id, 'approve');
        }
    };

    const submitReject = () => {
        if (!rejectReason.trim()) { alert("Lütfen red sebebi girin!"); return; }
        handleAction(rejectingId!, 'reject', rejectReason);
        setRejectingId(null);
        setRejectReason("");
        setSelectedEvent(null);
    };

    if (loading) {
        return <div className="flex justify-center p-10"><div className="w-8 h-8 border-4 border-(--color-lumex-purple-light) border-t-(--color-lumex-purple-main) rounded-full animate-spin"></div></div>;
    }

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
            
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-(--color-lumex-dark)">Bekleyen Etkinlik Onayları</h2>
                <span className="bg-orange-400 text-white text-xs font-bold px-2.5 py-1 rounded-full">{events.length}</span>
            </div>

            <div className="p-4 overflow-y-auto max-h-150 flex-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200">
                {events.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {events.map((evt) => (
                            <div key={evt.id} className="bg-gray-50/50 border border-gray-100 rounded-xl p-5 hover:shadow-md transition-all">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-(--color-lumex-dark) text-base">{evt.title}</h3>
                                    <span className="bg-white border border-gray-200 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-md">{evt.type}</span>
                                </div>
                                <p className="text-sm font-medium text-(--color-lumex-purple-main) mb-1">{evt.community}</p>
                                <p className="text-xs text-gray-400 mb-3">Danışman Onayı Tamamlandı • Gönderen: {evt.sender}</p>
                                <p className="text-sm text-(--color-lumex-dark-muted) line-clamp-2 mb-4">{evt.description}</p>
                                
                                <div className="flex flex-wrap sm:flex-nowrap gap-2">
                                    <button onClick={() => setSelectedEvent(evt)} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-semibold transition-colors shadow-sm cursor-pointer">
                                        <Eye size={16}/> İncele
                                    </button>
                                    <button onClick={() => handleApprove(evt.id)} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm cursor-pointer">
                                        <CheckCircle2 size={16}/> Onayla ve Yayınla
                                    </button>
                                    <button onClick={() => setRejectingId(evt.id)} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm cursor-pointer">
                                        <XCircle size={16}/> Reddet
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 opacity-50">
                        <CheckCircle2 size={48} className="text-gray-300 mb-4" />
                        <p className="text-gray-500 text-sm font-medium">SKS onayı bekleyen etkinlik bulunmuyor.</p>
                    </div>
                )}
            </div>

            {/* DETAY MODALI (TÜM BİLGİLER) */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedEvent(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl relative animate-in zoom-in-95 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                        
                        <div className="bg-[#0a192f] p-6 border-b border-gray-100 flex justify-between items-start shrink-0 rounded-t-2xl text-white">
                            <div>
                                <h2 className="text-xl font-bold">{selectedEvent.title}</h2>
                                <p className="text-sm text-gray-300 mt-1">{selectedEvent.community}</p>
                            </div>
                            <button onClick={() => setSelectedEvent(null)} className="text-white/50 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full cursor-pointer"><X size={20}/></button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-200">
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex flex-col gap-1">
                                    <div className="flex items-center gap-2 text-blue-500 mb-1"><CalendarClock size={16}/><span className="text-xs font-semibold uppercase">Tarih & Saat</span></div>
                                    <p className="text-sm font-bold text-(--color-lumex-dark)">{selectedEvent.date} • {selectedEvent.time}</p>
                                </div>
                                <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 flex flex-col gap-1">
                                    <div className="flex items-center gap-2 text-orange-500 mb-1"><MapPin size={16}/><span className="text-xs font-semibold uppercase">Konum</span></div>
                                    <p className="text-sm font-bold text-(--color-lumex-dark)">{selectedEvent.location}</p>
                                </div>
                                <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 flex flex-col gap-1">
                                    <div className="flex items-center gap-2 text-emerald-500 mb-1"><Users size={16}/><span className="text-xs font-semibold uppercase">Katılımcılar</span></div>
                                    <p className="text-sm font-bold text-(--color-lumex-dark)">{selectedEvent.participantCount} Kişi</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-(--color-lumex-dark) mb-2">Etkinlik Hakkında</h4>
                                <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">{selectedEvent.description}</p>
                            </div>

                            {/* SKS TALEPLERİ GÖRÜNÜMÜ */}
                            <div className="space-y-4">
                                <h4 className="font-bold text-(--color-lumex-dark) border-b border-gray-100 pb-2">Ek Talepler ve İhtiyaçlar</h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white border border-gray-200 p-4 rounded-xl">
                                        <p className="text-xs font-bold text-gray-500 mb-1">Konuşmacı</p>
                                        <p className="text-sm font-semibold text-(--color-lumex-dark)">{selectedEvent.details.hasSpeaker}</p>
                                        {selectedEvent.details.hasSpeaker === "Evet" && <p className="text-xs text-gray-500 mt-2">{selectedEvent.details.speakerInfo}</p>}
                                    </div>
                                    <div className="bg-white border border-gray-200 p-4 rounded-xl">
                                        <p className="text-xs font-bold text-gray-500 mb-1">Stant Talebi</p>
                                        <p className="text-sm font-semibold text-(--color-lumex-dark)">{selectedEvent.details.hasBooth}</p>
                                        {selectedEvent.details.hasBooth === "Evet" && (
                                            <div className="mt-2 text-xs text-gray-500">
                                                <p><strong>Yer:</strong> {selectedEvent.details.boothLoc}</p>
                                                <p><strong>Detay:</strong> {selectedEvent.details.boothInfo}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="bg-white border border-gray-200 p-4 rounded-xl">
                                        <p className="text-xs font-bold text-gray-500 mb-1">Afiş/Flama</p>
                                        <p className="text-sm font-semibold text-(--color-lumex-dark)">{selectedEvent.details.hasBanner}</p>
                                        {selectedEvent.details.hasBanner === "Evet" && <p className="text-xs text-gray-500 mt-2">{selectedEvent.details.bannerInfo}</p>}
                                    </div>
                                    <div className="bg-white border border-gray-200 p-4 rounded-xl">
                                        <p className="text-xs font-bold text-gray-500 mb-1">Diğer İhtiyaçlar</p>
                                        <p className="text-xs text-(--color-lumex-dark) mt-1">{selectedEvent.details.otherNeeds || "Yok"}</p>
                                    </div>
                                </div>
                            </div>

                            {selectedEvent.details.students && selectedEvent.details.students.length > 0 && (
                                <div>
                                    <h4 className="font-bold text-(--color-lumex-dark) border-b border-gray-100 pb-2 mb-4">Katılacak Öğrenciler ({selectedEvent.details.students.length})</h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                                                    <th className="p-3 font-semibold rounded-tl-lg">Ad Soyad</th>
                                                    <th className="p-3 font-semibold">Öğrenci No</th>
                                                    <th className="p-3 font-semibold">Yolluk/Yevmiye</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm text-(--color-lumex-dark)">
                                                {selectedEvent.details.students.map((stu: any, idx: number) => (
                                                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                                                        <td className="p-3 font-medium">{stu.name}</td>
                                                        <td className="p-3">{stu.no}</td>
                                                        <td className="p-3 text-xs text-gray-500">
                                                            {stu.travel !== "Yok" ? `Yol: ${stu.travel}` : ''} 
                                                            {stu.allowance !== "Yok" ? ` | Yev: ${stu.allowance}` : ''}
                                                            {stu.travel === "Yok" && stu.allowance === "Yok" ? 'Yok' : ''}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex gap-3 text-yellow-800">
                                <Info size={20} className="shrink-0 mt-0.5" />
                                <p className="text-sm leading-relaxed">
                                    <strong>Sistem Uyarısı:</strong> Etkinliği onaylamanız halinde otomatik olarak <strong>Duyurular</strong> ve <strong>Etkinlikler</strong> panosuna eklenecektir.
                                </p>
                            </div>

                        </div>

                        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 shrink-0 rounded-b-2xl">
                            <button onClick={() => setSelectedEvent(null)} className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-100 cursor-pointer">Kapat</button>
                            <button onClick={() => setRejectingId(selectedEvent.id)} className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl text-sm flex gap-2 cursor-pointer"><XCircle size={18}/> Reddet</button>
                            <button onClick={() => handleApprove(selectedEvent.id)} className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl text-sm flex gap-2 cursor-pointer"><CheckCircle2 size={18}/> Onayla ve Yayınla</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ZORUNLU RED SEBEBİ MODALI */}
            {rejectingId && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60 flex items-center justify-center p-4" onClick={() => setRejectingId(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-red-700 flex items-center gap-2 mb-4"><MessageSquareWarning/> Reddetme Sebebi</h3>
                        <p className="text-xs text-gray-500 mb-2">Lütfen topluluğa ve danışmana iletilecek red sebebini girin.</p>
                        <textarea rows={4} value={rejectReason} onChange={e => setRejectReason(e.target.value)} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-red-500 resize-none mb-4"></textarea>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => {setRejectingId(null); setRejectReason("");}} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold cursor-pointer hover:bg-gray-200">İptal</button>
                            <button onClick={submitReject} disabled={!rejectReason.trim()} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold cursor-pointer disabled:opacity-50">Reddet</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PendingEvents;