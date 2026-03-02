"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Users, CalendarDays, Settings, FileText, X, ChevronLeft, ChevronRight, Plus, Trash2, Search, Download, Image as ImageIcon, Megaphone } from "lucide-react";

const mockReports = [
    { id: 1, title: "Yıllık Faaliyet Raporu", community: "Spor Topluluğu", date: "24.10.2025", size: "2.4 MB" },
    { id: 2, title: "2025 Bütçe Planlaması", community: "Müzik Topluluğu", date: "23.10.2025", size: "1.1 MB" }
];

const SystemManagementActions = () => {
    // Modal State'leri
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isReportsOpen, setIsReportsOpen] = useState(false);
    const [settingsTab, setSettingsTab] = useState("slider");

    // Veri State'leri
    const [events, setEvents] = useState<any[]>([]);
    const [sliders, setSliders] = useState<any[]>([]);
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Takvim State'leri
    const [currentDate, setCurrentDate] = useState(new Date());
    
    // Slider Ekleme State'leri
    const [showAddSlider, setShowAddSlider] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [newSlider, setNewSlider] = useState({ title: "", subtitle: "", button_link: "", file: null as File | null });

    // Modallar Açıldığında Verileri Çek
    useEffect(() => {
        if (isCalendarOpen && events.length === 0) fetchEvents();
    }, [isCalendarOpen]);

    useEffect(() => {
        if (isSettingsOpen) {
            fetchSliders();
            fetchAnnouncements();
        }
    }, [isSettingsOpen]);

    // --- FETCH İŞLEMLERİ ---
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

    // --- SİLME İŞLEMLERİ ---
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

    // --- YENİ SLIDER EKLEME (FOTOĞRAF YÜKLEME) ---
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

    // --- TAKVİM HESAPLAMALARI ---
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthName = currentDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    // Etkinliklere otomatik renk atama
    const colors = ["bg-purple-100 text-purple-700 border-purple-200", "bg-blue-100 text-blue-700 border-blue-200", "bg-emerald-100 text-emerald-700 border-emerald-200", "bg-orange-100 text-orange-700 border-orange-200"];

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col mt-6 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-(--color-lumex-dark)">Sistem Yönetimi</h2>
                <p className="text-sm text-gray-500 mt-1">Genel sistem ayarları, takvim ve raporlara buradan ulaşabilirsiniz.</p>
            </div>
            
            <div className="p-6 flex flex-wrap md:flex-nowrap gap-4">
                <Link href="/societies" className="flex-1">
                    <button className="w-full bg-[#0a192f] text-white hover:bg-[#112240] py-4 rounded-xl flex items-center justify-center gap-2 font-bold shadow-md transition-colors text-sm">
                        <Users size={18} /> Tüm Toplulukları Görüntüle
                    </button>
                </Link>
                <button onClick={() => setIsCalendarOpen(true)} className="flex-1 bg-white border border-gray-200 text-(--color-lumex-dark) hover:bg-gray-50 py-4 rounded-xl flex items-center justify-center gap-2 font-bold shadow-sm transition-colors text-sm cursor-pointer">
                    <CalendarDays size={18} /> Etkinlik Takvimi
                </button>
                <button onClick={() => setIsSettingsOpen(true)} className="flex-1 bg-white border border-gray-200 text-(--color-lumex-dark) hover:bg-gray-50 py-4 rounded-xl flex items-center justify-center gap-2 font-bold shadow-sm transition-colors text-sm cursor-pointer">
                    <Settings size={18} /> Sistem Ayarları
                </button>
                <button onClick={() => setIsReportsOpen(true)} className="flex-1 bg-white border border-gray-200 text-(--color-lumex-dark) hover:bg-gray-50 py-4 rounded-xl flex items-center justify-center gap-2 font-bold shadow-sm transition-colors text-sm cursor-pointer">
                    <FileText size={18} /> Raporlar
                </button>
            </div>

            {/* --- MODAL 1: ETKİNLİK TAKVİMİ --- */}
            {isCalendarOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in" onClick={() => setIsCalendarOpen(false)}>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl flex flex-col overflow-hidden animate-in zoom-in-95 max-h-[90vh]" onClick={e => e.stopPropagation()}>
                        
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
                            <div className="flex items-center gap-4">
                                <h2 className="text-xl font-bold text-(--color-lumex-dark)">Etkinlik Takvimi</h2>
                                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 shadow-sm">
                                    <button onClick={prevMonth} className="text-gray-400 hover:text-(--color-lumex-dark) cursor-pointer"><ChevronLeft size={18}/></button>
                                    <span className="font-semibold text-sm text-(--color-lumex-dark) capitalize w-24 text-center">{monthName}</span>
                                    <button onClick={nextMonth} className="text-gray-400 hover:text-(--color-lumex-dark) cursor-pointer"><ChevronRight size={18}/></button>
                                </div>
                            </div>
                            <button onClick={() => setIsCalendarOpen(false)} className="text-gray-400 hover:text-(--color-lumex-dark) bg-white border border-gray-200 hover:bg-gray-50 p-2 rounded-full cursor-pointer"><X size={20}/></button>
                        </div>

                        <div className="p-6 bg-gray-50/30 overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300">
                            <div className="min-w-175">
                                <div className="grid grid-cols-7 gap-4 mb-2 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    <div>Pzt</div><div>Sal</div><div>Çar</div><div>Per</div><div>Cum</div><div>Cmt</div><div>Paz</div>
                                </div>
                                <div className="grid grid-cols-7 gap-4">
                                    {Array.from({ length: daysInMonth }).map((_, i) => {
                                        const day = i + 1;
                                        // O güne ait etkinlikleri bul (Veritabanından gelen UTC tarihlerini düzeltmek için yerel tarihe bakıyoruz)
                                        const dayEvents = events.filter(e => {
                                            if (!e.event_date) return false;
                                            const eDate = new Date(e.event_date);
                                            return eDate.getFullYear() === year && eDate.getMonth() === month && eDate.getDate() === day;
                                        });

                                        return (
                                            <div key={day} className="h-28 bg-white border border-gray-200 rounded-xl p-2 flex flex-col gap-1 hover:border-(--color-lumex-purple-main) transition-colors overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-200">
                                                <span className={`text-xs font-bold ${dayEvents.length > 0 ? "text-(--color-lumex-dark)" : "text-gray-400"}`}>{day}</span>
                                                {dayEvents.map((evt, idx) => (
                                                    <div key={evt.id} className={`p-1.5 rounded-md border flex flex-col gap-0.5 leading-tight ${colors[(evt.community_id || idx) % colors.length]}`}>
                                                        <span className="text-[10px] font-bold truncate">{evt.title}</span>
                                                        <span className="text-[9px] font-medium opacity-80 truncate">{evt.community_name}</span>
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

            {/* --- MODAL 2: SİSTEM AYARLARI --- */}
            {isSettingsOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in" onClick={() => setIsSettingsOpen(false)}>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden max-h-[85vh] animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                        
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#5e3a8c] text-white shrink-0">
                            <div>
                                <h2 className="text-xl font-bold">Sistem Ayarları</h2>
                                <p className="text-sm text-gray-300 mt-1">Ana sayfa görselleri ve duyuruları yönetin.</p>
                            </div>
                            <button onClick={() => setIsSettingsOpen(false)} className="text-white/50 hover:text-white bg-white/10 p-2 rounded-full cursor-pointer"><X size={20}/></button>
                        </div>

                        <div className="flex border-b border-gray-100 bg-gray-50/50 shrink-0">
                            <button onClick={() => setSettingsTab("slider")} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 ${settingsTab === "slider" ? "text-(--color-lumex-purple-main) border-b-2 border-(--color-lumex-purple-main) bg-white" : "text-gray-500 hover:bg-gray-100"}`}>
                                <ImageIcon size={18}/> Slider Yönetimi
                            </button>
                            <button onClick={() => setSettingsTab("announcements")} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 ${settingsTab === "announcements" ? "text-(--color-lumex-purple-main) border-b-2 border-(--color-lumex-purple-main) bg-white" : "text-gray-500 hover:bg-gray-100"}`}>
                                <Megaphone size={18}/> Duyuru Yönetimi
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300">
                            {settingsTab === "slider" ? (
                                <div className="space-y-4">
                                    <div className="flex justify-end mb-4">
                                        <button onClick={() => setShowAddSlider(!showAddSlider)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-sm">
                                            {showAddSlider ? <X size={16}/> : <Plus size={16}/>} {showAddSlider ? "İptal Et" : "Yeni Görsel Ekle"}
                                        </button>
                                    </div>

                                    {/* SLIDER EKLEME FORMU */}
                                    {showAddSlider && (
                                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6 space-y-4">
                                            <h3 className="font-bold text-(--color-lumex-dark) text-sm border-b pb-2">Yeni Slider Ekle</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div><label className="block text-xs font-semibold text-gray-500 mb-1">Başlık</label><input type="text" value={newSlider.title} onChange={e => setNewSlider({...newSlider, title: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-(--color-lumex-purple-main)" /></div>
                                                <div><label className="block text-xs font-semibold text-gray-500 mb-1">Alt Açıklama</label><input type="text" value={newSlider.subtitle} onChange={e => setNewSlider({...newSlider, subtitle: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-(--color-lumex-purple-main)" /></div>
                                                <div><label className="block text-xs font-semibold text-gray-500 mb-1">Buton Linki (Opsiyonel)</label><input type="text" value={newSlider.button_link} onChange={e => setNewSlider({...newSlider, button_link: e.target.value})} placeholder="Örn: /societies" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-(--color-lumex-purple-main)" /></div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Görsel Seç *</label>
                                                    <input type="file" accept="image/*" onChange={e => setNewSlider({...newSlider, file: e.target.files?.[0] || null})} className="w-full border border-gray-300 bg-white rounded-lg px-3 py-1.5 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
                                                </div>
                                            </div>
                                            <div className="flex justify-end pt-2">
                                                <button onClick={handleAddSlider} disabled={loading} className="bg-[#0a192f] hover:bg-[#112240] text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-md disabled:opacity-50 cursor-pointer">
                                                    {loading ? "Yükleniyor..." : "Kaydet ve Yayınla"}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* SLIDER LİSTESİ */}
                                    {sliders.map(slider => (
                                        <div key={slider.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                                            <div className="flex items-center gap-4">
                                                <div className="w-24 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                                                    <img src={`/uploads/sliders/${slider.image_url}`} alt={slider.title} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="hidden sm:block">
                                                    <p className="font-bold text-(--color-lumex-dark)">{slider.title || "Başlıksız Görsel"}</p>
                                                    <p className="text-xs text-gray-500">{slider.subtitle}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => handleDeleteSlider(slider.id)} className="w-10 h-10 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg flex items-center justify-center cursor-pointer transition-colors"><Trash2 size={18}/></button>
                                        </div>
                                    ))}
                                    {sliders.length === 0 && !showAddSlider && <p className="text-center text-gray-400 py-10 text-sm">Yayında olan slider görseli bulunmuyor.</p>}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {announcements.map(ann => (
                                        <div key={ann.id} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between shadow-sm">
                                            <div className="flex flex-col gap-1 pr-4">
                                                <p className="font-bold text-(--color-lumex-dark)">{ann.title}</p>
                                                <p className="text-xs text-gray-500 line-clamp-1">{ann.content}</p>
                                                <p className="text-[11px] text-gray-400 mt-1">Oluşturulma: {new Date(ann.created_at).toLocaleDateString('tr-TR')}</p>
                                            </div>
                                            <button onClick={() => handleDeleteAnnouncement(ann.id)} className="shrink-0 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold rounded-lg flex items-center gap-2 cursor-pointer transition-colors"><Trash2 size={16}/> Kaldır</button>
                                        </div>
                                    ))}
                                    {announcements.length === 0 && <p className="text-center text-gray-400 py-10 text-sm">Yayında olan duyuru bulunmuyor.</p>}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL 3: RAPORLAR (ŞİMDİLİK MOCK) --- */}
            {isReportsOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in" onClick={() => setIsReportsOpen(false)}>
                    {/* Tasarımı bozmadan olduğu gibi bırakıldı... */}
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden max-h-[85vh] animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50 shrink-0">
                            <div><h2 className="text-xl font-bold text-(--color-lumex-dark)">Rapor ve Belge Arşivi</h2></div>
                            <button onClick={() => setIsReportsOpen(false)} className="text-gray-400 hover:text-gray-700 bg-white border border-gray-200 p-2 rounded-full cursor-pointer shadow-sm"><X size={20}/></button>
                        </div>
                        <div className="p-10 flex flex-col items-center justify-center text-gray-400 opacity-60">
                            <FileText size={48} className="mb-4" />
                            <p className="font-semibold text-lg text-(--color-lumex-dark)">Belge Arşivi Yapım Aşamasında</p>
                            <p className="text-sm mt-1">Bu modül ilerleyen fazlarda aktif edilecektir.</p>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default SystemManagementActions;