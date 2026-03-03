"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Users, CalendarDays, Settings, FileText, X, ChevronLeft, ChevronRight, Plus, Trash2, Search, Download, Image as ImageIcon, Megaphone } from "lucide-react";

const mockReports = [
    { id: 1, title: "Yıllık Faaliyet Raporu", community: "Spor Topluluğu", date: "24.10.2025", size: "2.4 MB" },
    { id: 2, title: "2025 Bütçe Planlaması", community: "Müzik Topluluğu", date: "23.10.2025", size: "1.1 MB" }
];

const SystemManagementActions = () => {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isReportsOpen, setIsReportsOpen] = useState(false);
    const [settingsTab, setSettingsTab] = useState("slider");

    const [events, setEvents] = useState<any[]>([]);
    const [sliders, setSliders] = useState<any[]>([]);
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [currentDate, setCurrentDate] = useState(new Date());
    
    const [showAddSlider, setShowAddSlider] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [newSlider, setNewSlider] = useState({ title: "", subtitle: "", button_link: "", file: null as File | null });

    useEffect(() => {
        if (isCalendarOpen && events.length === 0) fetchEvents();
    }, [isCalendarOpen]);

    useEffect(() => {
        if (isSettingsOpen) {
            fetchSliders();
            fetchAnnouncements();
        }
    }, [isSettingsOpen]);

    const fetchEvents = async () => {
        const res = await fetch('/api/admin/events');
        const data = await res.json();
        if (data.success) setEvents(data.data);
    };

    const fetchSliders = async () => {
        const res = await fetch('/api/admin/sliders');
        const data = await res.json();
        if (data.success) setSliders(data.data);
    };

    const fetchAnnouncements = async () => {
        const res = await fetch('/api/admin/announcements');
        const data = await res.json();
        if (data.success) setAnnouncements(data.data);
    };

    const handleDeleteSlider = async (id: number) => {
        if(!confirm("Bu görseli silmek istediğinize emin misiniz?")) return;
        const res = await fetch('/api/admin/sliders', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
        if((await res.json()).success) fetchSliders();
    };

    const handleDeleteAnnouncement = async (id: number) => {
        if(!confirm("Bu duyuruyu kaldırmak istediğinize emin misiniz?")) return;
        const res = await fetch('/api/admin/announcements', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
        if((await res.json()).success) fetchAnnouncements();
    };

    const handleAddSlider = async () => {
        if (!newSlider.file) return alert("Lütfen bir görsel seçin.");
        setLoading(true);
        const formData = new FormData();
        formData.append("title", newSlider.title);
        formData.append("subtitle", newSlider.subtitle);
        formData.append("button_link", newSlider.button_link);
        formData.append("image", newSlider.file);

        const res = await fetch('/api/admin/sliders', { method: 'POST', body: formData });
        const data = await res.json();
        
        if (data.success) {
            setShowAddSlider(false);
            setNewSlider({ title: "", subtitle: "", button_link: "", file: null });
            fetchSliders();
        } else {
            alert(data.message);
        }
        setLoading(false);
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthName = currentDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const colors = ["bg-purple-100 text-purple-700 border-purple-200", "bg-blue-100 text-blue-700 border-blue-200", "bg-emerald-100 text-emerald-700 border-emerald-200", "bg-orange-100 text-orange-700 border-orange-200"];

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col mt-4 md:mt-6 overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-100 shrink-0">
                <h2 className="text-base md:text-lg font-bold text-(--color-lumex-dark)">Sistem Yönetimi</h2>
                <p className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">Genel sistem ayarları, takvim ve raporlara buradan ulaşabilirsiniz.</p>
            </div>
            
            <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-nowrap gap-3 md:gap-4 overflow-y-auto max-h-96 sm:max-h-full">
                <Link href="/societies" className="w-full sm:col-span-2 lg:flex-1 lg:col-span-1">
                    <button className="w-full bg-[#0a192f] text-white hover:bg-[#112240] py-3 md:py-4 rounded-lg md:rounded-xl flex items-center justify-center gap-1.5 md:gap-2 font-bold shadow-md transition-colors text-xs md:text-sm cursor-pointer">
                        <Users size={16} className="md:w-4.5 md:h-4.5" /> Tüm Toplulukları Görüntüle
                    </button>
                </Link>
                <button onClick={() => setIsCalendarOpen(true)} className="w-full lg:flex-1 bg-white border border-gray-200 text-(--color-lumex-dark) hover:bg-gray-50 py-3 md:py-4 rounded-lg md:rounded-xl flex items-center justify-center gap-1.5 md:gap-2 font-bold shadow-sm transition-colors text-xs md:text-sm cursor-pointer">
                    <CalendarDays size={16} className="md:w-4.5 md:h-4.5" /> Etkinlik Takvimi
                </button>
                <button onClick={() => setIsSettingsOpen(true)} className="w-full lg:flex-1 bg-white border border-gray-200 text-(--color-lumex-dark) hover:bg-gray-50 py-3 md:py-4 rounded-lg md:rounded-xl flex items-center justify-center gap-1.5 md:gap-2 font-bold shadow-sm transition-colors text-xs md:text-sm cursor-pointer">
                    <Settings size={16} className="md:w-4.5 md:h-4.5" /> Sistem Ayarları
                </button>
                <button onClick={() => setIsReportsOpen(true)} className="w-full lg:flex-1 sm:col-span-2 lg:col-span-1 bg-white border border-gray-200 text-(--color-lumex-dark) hover:bg-gray-50 py-3 md:py-4 rounded-lg md:rounded-xl flex items-center justify-center gap-1.5 md:gap-2 font-bold shadow-sm transition-colors text-xs md:text-sm cursor-pointer">
                    <FileText size={16} className="md:w-4.5 md:h-4.5" /> Raporlar
                </button>
            </div>

            {isCalendarOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4 animate-in fade-in" onClick={() => setIsCalendarOpen(false)}>
                    <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-5xl flex flex-col overflow-hidden animate-in zoom-in-95 max-h-[95vh] md:max-h-[90vh]" onClick={e => e.stopPropagation()}>
                        
                        <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center bg-gray-50/50 shrink-0 gap-3 md:gap-0">
                            <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-4 w-full sm:w-auto">
                                <h2 className="text-lg md:text-xl font-bold text-(--color-lumex-dark) self-start sm:self-auto">Etkinlik Takvimi</h2>
                                <div className="flex items-center justify-between sm:justify-center gap-2 bg-white border border-gray-200 rounded-lg px-2 md:px-3 py-1.5 shadow-sm w-full sm:w-auto">
                                    <button onClick={prevMonth} className="text-gray-400 hover:text-(--color-lumex-dark) cursor-pointer p-1"><ChevronLeft size={16} className="md:w-4.5 md:h-4.5"/></button>
                                    <span className="font-semibold text-xs md:text-sm text-(--color-lumex-dark) capitalize w-20 md:w-24 text-center truncate">{monthName}</span>
                                    <button onClick={nextMonth} className="text-gray-400 hover:text-(--color-lumex-dark) cursor-pointer p-1"><ChevronRight size={16} className="md:w-4.5 md:h-4.5"/></button>
                                </div>
                            </div>
                            <button onClick={() => setIsCalendarOpen(false)} className="absolute sm:static top-3 right-3 text-gray-400 hover:text-(--color-lumex-dark) bg-white border border-gray-200 hover:bg-gray-50 p-1.5 md:p-2 rounded-full cursor-pointer shadow-sm sm:shadow-none"><X size={16} className="md:w-5 md:h-5"/></button>
                        </div>

                        <div className="p-3 md:p-6 bg-gray-50/30 overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-1.5 md:[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300">
                            <div className="min-w-125 md:min-w-175">
                                <div className="grid grid-cols-7 gap-2 md:gap-4 mb-2 text-center text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    <div>Pzt</div><div>Sal</div><div>Çar</div><div>Per</div><div>Cum</div><div>Cmt</div><div>Paz</div>
                                </div>
                                <div className="grid grid-cols-7 gap-2 md:gap-4">
                                    {Array.from({ length: daysInMonth }).map((_, i) => {
                                        const day = i + 1;
                                        const dayEvents = events.filter(e => {
                                            if (!e.event_date) return false;
                                            const eDate = new Date(e.event_date);
                                            return eDate.getFullYear() === year && eDate.getMonth() === month && eDate.getDate() === day;
                                        });

                                        return (
                                            <div key={day} className="h-20 md:h-28 bg-white border border-gray-200 rounded-lg md:rounded-xl p-1.5 md:p-2 flex flex-col gap-1 hover:border-(--color-lumex-purple-main) transition-colors overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-200">
                                                <span className={`text-[10px] md:text-xs font-bold ${dayEvents.length > 0 ? "text-(--color-lumex-dark)" : "text-gray-400"}`}>{day}</span>
                                                {dayEvents.map((evt, idx) => (
                                                    <div key={evt.id} className={`p-1 md:p-1.5 rounded-md border flex flex-col gap-0.5 md:gap-0.5 leading-tight ${colors[(evt.community_id || idx) % colors.length]}`}>
                                                        <span className="text-[8px] md:text-[10px] font-bold truncate">{evt.title}</span>
                                                        <span className="text-[7px] md:text-[9px] font-medium opacity-80 truncate hidden sm:block">{evt.community_name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isSettingsOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4 animate-in fade-in" onClick={() => setIsSettingsOpen(false)}>
                    <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden max-h-[95vh] md:max-h-[85vh] animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                        
                        <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-center bg-[#5e3a8c] text-white shrink-0">
                            <div>
                                <h2 className="text-lg md:text-xl font-bold">Sistem Ayarları</h2>
                                <p className="text-[10px] md:text-sm text-gray-300 mt-0.5 md:mt-1">Ana sayfa görselleri ve duyuruları yönetin.</p>
                            </div>
                            <button onClick={() => setIsSettingsOpen(false)} className="text-white/50 hover:text-white bg-white/10 p-1.5 md:p-2 rounded-full cursor-pointer transition-colors"><X size={18} className="md:w-5 md:h-5"/></button>
                        </div>

                        <div className="flex flex-col sm:flex-row border-b border-gray-100 bg-gray-50/50 shrink-0">
                            <button onClick={() => setSettingsTab("slider")} className={`flex-1 py-3 md:py-4 text-xs md:text-sm font-bold flex items-center justify-center gap-1.5 md:gap-2 transition-colors ${settingsTab === "slider" ? "text-(--color-lumex-purple-main) border-b-2 sm:border-b-2 sm:border-r-0 border-r-2 sm:border-r-transparent border-(--color-lumex-purple-main) bg-white" : "text-gray-500 hover:bg-gray-100"}`}>
                                <ImageIcon size={16} className="md:w-4.5 md:h-4.5"/> Slider Yönetimi
                            </button>
                            <button onClick={() => setSettingsTab("announcements")} className={`flex-1 py-3 md:py-4 text-xs md:text-sm font-bold flex items-center justify-center gap-1.5 md:gap-2 transition-colors ${settingsTab === "announcements" ? "text-(--color-lumex-purple-main) border-b-2 border-(--color-lumex-purple-main) bg-white" : "text-gray-500 hover:bg-gray-100"}`}>
                                <Megaphone size={16} className="md:w-4.5 md:h-4.5"/> Duyuru Yönetimi
                            </button>
                        </div>

                        <div className="p-4 md:p-6 overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-1.5 md:[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300">
                            {settingsTab === "slider" ? (
                                <div className="space-y-3 md:space-y-4">
                                    <div className="flex justify-end mb-3 md:mb-4">
                                        <button onClick={() => setShowAddSlider(!showAddSlider)} className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-semibold flex items-center justify-center gap-1.5 md:gap-2 cursor-pointer shadow-sm transition-colors">
                                            {showAddSlider ? <X size={14} className="md:w-4 md:h-4"/> : <Plus size={14} className="md:w-4 md:h-4"/>} {showAddSlider ? "İptal Et" : "Yeni Görsel Ekle"}
                                        </button>
                                    </div>

                                    {showAddSlider && (
                                        <div className="bg-gray-50 border border-gray-200 rounded-lg md:rounded-xl p-4 md:p-5 mb-4 md:mb-6 space-y-3 md:space-y-4">
                                            <h3 className="font-bold text-(--color-lumex-dark) text-xs md:text-sm border-b pb-1.5 md:pb-2">Yeni Slider Ekle</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                                <div><label className="block text-[10px] md:text-xs font-semibold text-gray-500 mb-0.5 md:mb-1">Başlık</label><input type="text" value={newSlider.title} onChange={e => setNewSlider({...newSlider, title: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-(--color-lumex-purple-main) bg-white" /></div>
                                                <div><label className="block text-[10px] md:text-xs font-semibold text-gray-500 mb-0.5 md:mb-1">Alt Açıklama</label><input type="text" value={newSlider.subtitle} onChange={e => setNewSlider({...newSlider, subtitle: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-(--color-lumex-purple-main) bg-white" /></div>
                                                <div><label className="block text-[10px] md:text-xs font-semibold text-gray-500 mb-0.5 md:mb-1">Buton Linki (Opsiyonel)</label><input type="text" value={newSlider.button_link} onChange={e => setNewSlider({...newSlider, button_link: e.target.value})} placeholder="Örn: /societies" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-(--color-lumex-purple-main) bg-white" /></div>
                                                <div>
                                                    <label className="block text-[10px] md:text-xs font-semibold text-gray-500 mb-0.5 md:mb-1">Görsel Seç *</label>
                                                    <input type="file" accept="image/*" onChange={e => setNewSlider({...newSlider, file: e.target.files?.[0] || null})} className="w-full border border-gray-300 bg-white rounded-lg px-2 md:px-3 py-1.5 text-xs md:text-sm file:mr-2 md:file:mr-4 file:py-1 file:px-2 md:file:px-3 file:rounded-md file:border-0 file:text-[10px] md:file:text-xs file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer" />
                                                </div>
                                            </div>
                                            <div className="flex justify-end pt-1 md:pt-2">
                                                <button onClick={handleAddSlider} disabled={loading} className="w-full sm:w-auto bg-[#0a192f] hover:bg-[#112240] text-white px-4 md:px-5 py-2 rounded-lg text-xs md:text-sm font-semibold shadow-md disabled:opacity-50 cursor-pointer transition-colors">
                                                    {loading ? "Yükleniyor..." : "Kaydet ve Yayınla"}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-3">
                                        {sliders.map(slider => (
                                            <div key={slider.id} className="bg-white border border-gray-200 rounded-lg md:rounded-xl p-3 md:p-4 flex items-center justify-between shadow-sm gap-3">
                                                <div className="flex items-center gap-3 md:gap-4 min-w-0">
                                                    <div className="w-16 h-12 md:w-24 md:h-16 bg-gray-100 rounded-md md:rounded-lg overflow-hidden shrink-0 border border-gray-200">
                                                        <img src={`/uploads/sliders/${slider.image_url}`} alt={slider.title} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <p className="font-bold text-(--color-lumex-dark) text-xs md:text-sm truncate">{slider.title || "Başlıksız Görsel"}</p>
                                                        <p className="text-[10px] md:text-xs text-gray-500 truncate">{slider.subtitle}</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => handleDeleteSlider(slider.id)} className="w-8 h-8 md:w-10 md:h-10 bg-red-50 hover:bg-red-100 text-red-600 rounded-md md:rounded-lg flex items-center justify-center cursor-pointer transition-colors shrink-0"><Trash2 size={16} className="md:w-4.5 md:h-4.5"/></button>
                                            </div>
                                        ))}
                                    </div>
                                    {sliders.length === 0 && !showAddSlider && <p className="text-center text-gray-400 py-6 md:py-10 text-xs md:text-sm">Yayında olan slider görseli bulunmuyor.</p>}
                                </div>
                            ) : (
                                <div className="space-y-3 md:space-y-4">
                                    <div className="flex flex-col gap-3">
                                        {announcements.map(ann => (
                                            <div key={ann.id} className="bg-white border border-gray-200 rounded-lg md:rounded-xl p-3 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between shadow-sm gap-3">
                                                <div className="flex flex-col gap-0.5 md:gap-1 min-w-0">
                                                    <p className="font-bold text-(--color-lumex-dark) text-xs md:text-sm truncate">{ann.title}</p>
                                                    <p className="text-[10px] md:text-xs text-gray-500 line-clamp-1 md:line-clamp-2">{ann.content}</p>
                                                    <p className="text-[9px] md:text-[11px] text-gray-400 mt-0.5 md:mt-1">Oluşturulma: {new Date(ann.created_at).toLocaleDateString('tr-TR')}</p>
                                                </div>
                                                <button onClick={() => handleDeleteAnnouncement(ann.id)} className="w-full sm:w-auto shrink-0 flex justify-center items-center px-3 md:px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs md:text-sm font-semibold rounded-md md:rounded-lg gap-1.5 md:gap-2 cursor-pointer transition-colors"><Trash2 size={14} className="md:w-4 md:h-4"/> Kaldır</button>
                                            </div>
                                        ))}
                                    </div>
                                    {announcements.length === 0 && <p className="text-center text-gray-400 py-6 md:py-10 text-xs md:text-sm">Yayında olan duyuru bulunmuyor.</p>}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {isReportsOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 md:p-4 animate-in fade-in" onClick={() => setIsReportsOpen(false)}>
                    <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden max-h-[85vh] animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                        <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50 shrink-0">
                            <div><h2 className="text-lg md:text-xl font-bold text-(--color-lumex-dark)">Rapor ve Belge Arşivi</h2></div>
                            <button onClick={() => setIsReportsOpen(false)} className="text-gray-400 hover:text-gray-700 bg-white border border-gray-200 p-1.5 md:p-2 rounded-full cursor-pointer shadow-sm transition-colors"><X size={18} className="md:w-5 md:h-5"/></button>
                        </div>
                        <div className="p-6 md:p-10 flex flex-col items-center justify-center text-gray-400 opacity-60 flex-1 min-h-50 md:min-h-75">
                            <FileText size={40} className="mb-3 md:w-12 md:h-12 md:mb-4" />
                            <p className="font-semibold text-base md:text-lg text-(--color-lumex-dark) text-center">Belge Arşivi Yapım Aşamasında</p>
                            <p className="text-xs md:text-sm mt-1 text-center max-w-xs md:max-w-none">Bu modül ilerleyen fazlarda aktif edilecektir.</p>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default SystemManagementActions;