"use client";

import { useState, useEffect } from "react";
import { X, UserPlus, CalendarPlus, Save } from "lucide-react";

interface AddEventPopupProps {
    initialData?: any; 
    onClose: () => void;
    onSuccess: () => void;
}

const eventTypes = ["Konferans", "Panel", "Eğitim", "Tiyatro", "Stant Çalışması", "Sempozyum", "Sergi", "Festival/Şenlik", "Gösteri/Film Gösterimi", "Gezi"];

const AddEventPopup = ({ initialData, onClose, onSuccess }: AddEventPopupProps) => {
    const [userId, setUserId] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: initialData?.title || "", 
        event_type: initialData?.event_type || "", 
        event_date: initialData?.event_date ? new Date(initialData.event_date).toISOString().split('T')[0] : "", 
        event_time: initialData?.event_time ? initialData.event_time.slice(0, 5) : "", 
        location: initialData?.location || "", 
        description: initialData?.description || "", 
        materials_needed: "", 
        has_speaker: initialData?.has_speaker ? "Evet" : "Hayır", 
        speaker_info: initialData?.speaker_info || "",
        has_stand: initialData?.has_stand ? "Evet" : "Hayır", 
        stand_details: initialData?.stand_details || "", 
        stand_location: initialData?.stand_location || "",
        has_poster: initialData?.has_poster ? "Evet" : "Hayır", 
        poster_details: initialData?.poster_details || ""
    });

    const [students, setStudents] = useState<any[]>([]);
    const [newStudent, setNewStudent] = useState({ name: "", no: "", dept: "", travel: "", allowance: "", accommodation: "" });

    useEffect(() => {
        const fetchInfo = async () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                const uid = parsedUser.id || parsedUser.user_id;
                setUserId(uid);
            }
        };
        fetchInfo();

        if (initialData?.materials_needed) {
            let materials = initialData.materials_needed;
            let parsedStudents = [];
            if (materials.includes('[KATILACAK ÖĞRENCİLER]:')) {
                const parts = materials.split('[KATILACAK ÖĞRENCİLER]:');
                materials = parts[0].trim();
                try { parsedStudents = JSON.parse(parts[1].trim()); } catch(e) {}
            }
            setFormData(prev => ({ ...prev, materials_needed: materials }));
            setStudents(parsedStudents);
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddStudent = () => {
        if (!newStudent.name || !newStudent.no) return alert("En az Ad Soyad ve Öğrenci Numarası giriniz.");
        setStudents([...students, { ...newStudent, id: Date.now() }]);
        setNewStudent({ name: "", no: "", dept: "", travel: "", allowance: "", accommodation: "" });
    };

    const handleRemoveStudent = (id: number) => setStudents(students.filter(s => s.id !== id));

    const handleSubmit = async (status: 'draft' | 'pending_advisor') => {
        setIsSubmitting(true);
        try {
            const method = initialData?.id ? 'PUT' : 'POST';
            
            const payload = {
                userId, ...formData, students, status,
                applicationId: initialData?.id 
            };

            const res = await fetch('/api/cm_student/applications', {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (data.success) {
                onSuccess(); 
                onClose(); 
            } else {
                alert("Hata: " + data.message);
            }
        } catch (error) {
            console.error(error);
            alert("Sunucu hatası.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-4xl relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] overflow-hidden">
                <div className="bg-white p-6 border-b border-gray-100 flex justify-between items-start shrink-0 rounded-t-2xl">
                    <div>
                        <h2 className="text-xl font-bold text-(--color-lumex-dark)">
                            {initialData ? "Etkinlik Başvurusuna Devam Et" : "Yeni Etkinlik Ekle"}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">İstediğiniz zaman taslak olarak kaydedip daha sonra devam edebilirsiniz.</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors cursor-pointer">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-(--color-lumex-dark) mb-4">Temel Bilgiler</h3>
                        <div className="space-y-4">
                            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Etkinlik Başlığı *</label><input name="title" value={formData.title} onChange={handleChange} type="text" placeholder="Örn: Bahar Şenliği" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-(--color-lumex-purple-main)" /></div>
                            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Etkinlik Türü *</label><select name="event_type" value={formData.event_type} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-(--color-lumex-purple-main) text-gray-600"><option value="">Etkinlik türünü seçin</option>{eventTypes.map((type, idx) => (<option key={idx} value={type}>{type}</option>))}</select></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Tarih *</label><input name="event_date" value={formData.event_date} onChange={handleChange} type="date" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-(--color-lumex-purple-main) text-gray-600" /></div>
                                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Saat *</label><input name="event_time" value={formData.event_time} onChange={handleChange} type="time" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-(--color-lumex-purple-main) text-gray-600" /></div>
                            </div>
                            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Konum *</label><input name="location" value={formData.location} onChange={handleChange} type="text" placeholder="Örn: Amfi Tiyatro" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-(--color-lumex-purple-main)" /></div>
                            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Açıklama</label><textarea name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="Detaylı bilgi..." className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-(--color-lumex-purple-main) resize-none"></textarea></div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-(--color-lumex-dark) mb-4">Konuşmacı/Katılımcı Bilgileri</h3>
                        <div className="flex gap-4 mb-4">
                            <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="has_speaker" value="Evet" checked={formData.has_speaker === "Evet"} onChange={handleChange} className="w-4 h-4 text-(--color-lumex-purple-main)" /> Evet</label>
                            <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="has_speaker" value="Hayır" checked={formData.has_speaker === "Hayır"} onChange={handleChange} className="w-4 h-4 text-(--color-lumex-purple-main)" /> Hayır</label>
                        </div>
                        {formData.has_speaker === "Evet" && (<textarea name="speaker_info" value={formData.speaker_info} onChange={handleChange} rows={2} placeholder="Ad Soyad, Ünvan vb." className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-(--color-lumex-purple-main) resize-none"></textarea>)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-(--color-lumex-dark) mb-4">Stant Açma Talebi</h3>
                            <div className="flex gap-4 mb-4">
                                <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="has_stand" value="Evet" checked={formData.has_stand === "Evet"} onChange={handleChange} /> Evet</label>
                                <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="has_stand" value="Hayır" checked={formData.has_stand === "Hayır"} onChange={handleChange} /> Hayır</label>
                            </div>
                            {formData.has_stand === "Evet" && (
                                <div className="space-y-3">
                                    <input type="text" name="stand_location" value={formData.stand_location} onChange={handleChange} placeholder="Stant Yeri ve Tarihi" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" />
                                    <textarea rows={2} name="stand_details" value={formData.stand_details} onChange={handleChange} placeholder="Stant İçeriği" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none resize-none"></textarea>
                                </div>
                            )}
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-(--color-lumex-dark) mb-4">Afiş/Flama Asma Talebi</h3>
                            <div className="flex gap-4 mb-4">
                                <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="has_poster" value="Evet" checked={formData.has_poster === "Evet"} onChange={handleChange} /> Evet</label>
                                <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="has_poster" value="Hayır" checked={formData.has_poster === "Hayır"} onChange={handleChange} /> Hayır</label>
                            </div>
                            {formData.has_poster === "Evet" && (<input type="text" name="poster_details" value={formData.poster_details} onChange={handleChange} placeholder="Yer/Tarih Detayları" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" />)}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-(--color-lumex-dark) mb-4">Diğer Bilgiler ve Talepler</h3>
                        <textarea name="materials_needed" value={formData.materials_needed} onChange={handleChange} rows={3} placeholder="İhtiyaç duyulan ekipman vb..." className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-(--color-lumex-purple-main) resize-none"></textarea>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="flex items-center gap-2 font-bold text-(--color-lumex-dark) mb-4"><UserPlus size={18} /> Etkinliğe Katılacak Öğrenciler</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><input type="text" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} placeholder="Ad Soyad" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" /></div>
                                <div><input type="text" value={newStudent.no} onChange={e => setNewStudent({...newStudent, no: e.target.value})} placeholder="Öğrenci Numarası" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" /></div>
                            </div>
                            <button onClick={handleAddStudent} className="w-full bg-[#0a192f] hover:bg-[#112240] text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-md">Öğrenci Ekle</button>
                        </div>
                        {students.length > 0 && (
                            <div className="mt-6">
                                <h4 className="font-semibold text-(--color-lumex-dark) mb-3 text-sm">Eklenen Öğrenciler ({students.length})</h4>
                                <div className="space-y-3">
                                    {students.map((student, idx) => (
                                        <div key={student.id} className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-start shadow-sm">
                                            <div className="text-sm text-gray-600"><b>#{idx + 1} {student.name}</b> - {student.no}</div>
                                            <button onClick={() => handleRemoveStudent(student.id)} className="text-gray-400 hover:text-red-500 cursor-pointer p-1"><X size={18} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0 rounded-b-2xl">
                    <button onClick={onClose} disabled={isSubmitting} className="w-full sm:w-auto px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 cursor-pointer disabled:opacity-50 text-sm">İptal</button>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <button onClick={() => handleSubmit('draft')} disabled={isSubmitting} className="w-full sm:w-auto px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 transition-colors text-sm">
                            <Save size={18} /> Taslak Olarak Kaydet
                        </button>
                        <button onClick={() => handleSubmit('pending_advisor')} disabled={isSubmitting} className="w-full sm:w-auto px-6 py-2.5 bg-[#0a192f] hover:bg-[#112240] text-white font-semibold rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 transition-colors text-sm">
                            {isSubmitting ? "Gönderiliyor..." : <><CalendarPlus size={18} /> Akademik Danışmana Gönder</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEventPopup;