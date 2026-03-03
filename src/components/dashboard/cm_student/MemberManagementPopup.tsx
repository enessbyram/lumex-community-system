"use client";

import { useState, useEffect } from "react";
import { X, Search, Mail, Edit2, Trash2, UserPlus, Save, Shield } from "lucide-react";

interface MemberManagementPopupProps {
    onClose: () => void;
}

const MemberManagementPopup = ({ onClose }: MemberManagementPopupProps) => {
    const [members, setMembers] = useState<any[]>([]);
    const [roles, setRoles] = useState<string[]>([]);
    const [currentUserRole, setCurrentUserRole] = useState("");
    
    const [communityId, setCommunityId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    const [editingMember, setEditingMember] = useState<any>(null);
    const [isAddingMember, setIsAddingMember] = useState(false);
    const [newMemberEmail, setNewMemberEmail] = useState("");
    const [newMemberRole, setNewMemberRole] = useState("Normal Üye");

    const fetchMembers = async () => {
        setLoading(true);
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userId = JSON.parse(storedUser).id || JSON.parse(storedUser).user_id;
            const res = await fetch(`/api/cm_student/members?userId=${userId}`);
            const data = await res.json();
            if (data.success) {
                setMembers(data.data);
                setCommunityId(data.communityId);
                setRoles(data.roles ? data.roles.map((r: any) => r.role_name) : []);
                setCurrentUserRole(data.currentUserRole);
                
                if(data.roles && data.roles.length > 0) {
                    setNewMemberRole(data.roles[data.roles.length - 1].role_name);
                }
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const canManageRoles = currentUserRole === 'Başkan' || currentUserRole === 'Başkan Yardımcısı';

    const filteredMembers = members.filter(m => 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        m.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async (cm_id: number) => {
        if(confirm("Bu üyeyi topluluktan çıkarmak istediğinize emin misiniz?")) {
            const res = await fetch('/api/cm_student/members', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cm_id })
            });
            const data = await res.json();
            if(data.success) fetchMembers();
            else alert(data.message);
        }
    };

    const handleUpdateRole = async () => {
        const res = await fetch('/api/cm_student/members', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cm_id: editingMember.cm_id, role: editingMember.role })
        });
        const data = await res.json();
        if(data.success) {
            setEditingMember(null);
            fetchMembers();
        } else alert(data.message);
    };

    const handleAddMember = async () => {
        if(!newMemberEmail) return alert("E-posta adresi gerekli!");
        const res = await fetch('/api/cm_student/members', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: newMemberEmail, role: newMemberRole, communityId })
        });
        const data = await res.json();
        if(data.success) {
            setIsAddingMember(false);
            setNewMemberEmail("");
            fetchMembers();
        } else {
            alert(data.message);
        }
    };

    const formatDate = (dateStr: string) => {
        if(!dateStr) return "";
        return new Date(dateStr).toLocaleDateString('tr-TR');
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 md:p-4">
            
            <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl w-full max-w-3xl relative flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden max-h-[95vh] md:max-h-[90vh]">
                <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50 shrink-0">
                    <div>
                        <h2 className="text-lg md:text-xl font-bold text-(--color-lumex-dark)">Üye Yönetimi</h2>
                        <p className="text-[10px] md:text-sm text-gray-500 mt-0.5 md:mt-1">Topluluk üyelerini görüntüleyin, yeni üye ekleyin{canManageRoles ? " veya rollerini düzenleyin" : ""}.</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-(--color-lumex-dark) bg-white border border-gray-200 hover:bg-gray-100 p-1.5 md:p-2 rounded-full cursor-pointer shadow-sm transition-colors shrink-0 ml-2">
                        <X size={18} className="md:w-5 md:h-5" />
                    </button>
                </div>

                <div className="p-4 md:p-6 flex flex-col flex-1 overflow-hidden">
                    <div className="relative w-full mb-4 md:mb-6 shrink-0">
                        <input 
                            type="text" 
                            placeholder="Üye ara (isim, e-posta)..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg md:rounded-xl pl-9 md:pl-11 pr-3 md:pr-4 py-2.5 md:py-3 text-xs md:text-sm focus:outline-none focus:ring-1 md:focus:ring-2 focus:ring-(--color-lumex-purple-main) transition-all"
                        />
                        <Search size={16} className="absolute left-3 md:left-4 top-3 md:top-3.5 text-gray-400 md:w-4.5 md:h-4.5" />
                    </div>

                    <div className="flex-1 overflow-y-auto pr-1 md:pr-2 space-y-2 md:space-y-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                        {loading ? (
                             <div className="flex justify-center py-10"><div className="w-6 h-6 md:w-8 md:h-8 border-3 md:border-4 border-(--color-lumex-purple-main) border-t-transparent rounded-full animate-spin"></div></div>
                        ) : filteredMembers.map(member => (
                            <div key={member.cm_id} className="border border-gray-100 rounded-lg md:rounded-xl p-3 md:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4 bg-white hover:shadow-sm hover:border-gray-200 transition-all">
                                <div className="flex flex-col gap-0.5 md:gap-1 min-w-0 w-full sm:w-auto">
                                    <div className="flex flex-wrap items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1">
                                        <h3 className="font-bold text-(--color-lumex-dark) text-sm md:text-base truncate">{member.name}</h3>
                                        <span className={`text-[9px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 rounded-md shrink-0 ${member.role === 'Normal Üye' || member.role === 'Üye' ? 'bg-gray-100 text-gray-600' : 'bg-(--color-lumex-purple-light)/20 text-(--color-lumex-purple-main)'}`}>
                                            {member.role}
                                        </span>
                                    </div>
                                    <p className="text-[10px] md:text-xs text-gray-500 flex items-center gap-1 md:gap-1.5 truncate"><Mail size={10} className="md:w-3 md:h-3 shrink-0"/> {member.email}</p>
                                    <p className="text-[10px] md:text-xs text-gray-500 truncate">Bölüm: {member.department || 'Belirtilmedi'} • ID: {member.user_id}</p>
                                    <p className="text-[9px] md:text-[11px] text-gray-400 mt-0.5 md:mt-1">Katılım: {formatDate(member.date)}</p>
                                </div>
                                <div className="flex items-center gap-1.5 md:gap-2 w-full sm:w-auto mt-1 sm:mt-0 shrink-0 justify-end">
                                    {canManageRoles && (
                                        <button onClick={() => setEditingMember(member)} className="flex-1 sm:flex-none p-2 md:p-2.5 bg-gray-50 text-gray-600 rounded-md md:rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors border border-gray-100 shadow-sm cursor-pointer flex items-center justify-center">
                                            <Edit2 size={14} className="md:w-4 md:h-4" />
                                        </button>
                                    )}
                                    <button onClick={() => handleDelete(member.cm_id)} className="flex-1 sm:flex-none p-2 md:p-2.5 bg-gray-50 text-gray-600 rounded-md md:rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors border border-gray-100 shadow-sm cursor-pointer flex items-center justify-center">
                                        <Trash2 size={14} className="md:w-4 md:h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-3 md:p-4 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-0 shrink-0 rounded-b-xl md:rounded-b-2xl">
                    <span className="text-xs md:text-sm font-medium text-gray-500 w-full sm:w-auto text-center sm:text-left sm:ml-2">Toplam {filteredMembers.length} üye</span>
                    <button onClick={() => setIsAddingMember(true)} className="w-full sm:w-auto px-4 md:px-5 py-2.5 md:py-2.5 bg-[#0a192f] hover:bg-[#112240] text-white font-semibold rounded-lg md:rounded-xl flex items-center justify-center gap-1.5 md:gap-2 text-xs md:text-sm shadow-md transition-colors cursor-pointer">
                        <UserPlus size={16} className="md:w-4.5:h-[18px]" /> Yeni Üye Ekle
                    </button>
                </div>
            </div>

            {editingMember && canManageRoles && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-60 p-3 md:p-4" onClick={() => setEditingMember(null)}>
                    <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl w-full max-w-sm flex flex-col overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="p-4 md:p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
                            <h3 className="font-bold text-sm md:text-base text-(--color-lumex-dark) flex items-center gap-1.5 md:gap-2"><Shield size={16} className="text-(--color-lumex-purple-main) md:w-4.5 md:h-4.5"/> Üye Düzenle</h3>
                            <button onClick={() => setEditingMember(null)} className="text-gray-400 hover:text-gray-600 p-1"><X size={16} className="md:w-4.5 md:h-4.5" /></button>
                        </div>
                        <div className="p-4 md:p-5 space-y-3 md:space-y-4">
                            <div><label className="block text-[10px] md:text-xs font-semibold text-gray-500 mb-0.5 md:mb-1 ml-1">İsim</label><input type="text" value={editingMember.name} readOnly className="w-full bg-gray-100 border border-gray-200 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-2.5 text-gray-500 text-xs md:text-sm cursor-not-allowed outline-none" /></div>
                            <div><label className="block text-[10px] md:text-xs font-semibold text-gray-500 mb-0.5 md:mb-1 ml-1">E-posta</label><input type="text" value={editingMember.email} readOnly className="w-full bg-gray-100 border border-gray-200 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-2.5 text-gray-500 text-xs md:text-sm cursor-not-allowed outline-none" /></div>
                            <div>
                                <label className="block text-[10px] md:text-xs font-semibold text-(--color-lumex-dark) mb-0.5 md:mb-1 ml-1">Rol Seçimi *</label>
                                <select value={editingMember.role} onChange={e => setEditingMember({...editingMember, role: e.target.value})} className="w-full bg-white border border-gray-300 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-2.5 text-(--color-lumex-dark) text-xs md:text-sm focus:outline-none focus:ring-1 md:focus:ring-2 focus:ring-(--color-lumex-purple-main)">
                                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="p-3 md:p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2 shrink-0">
                            <button onClick={() => setEditingMember(null)} className="px-3 md:px-4 py-2 bg-white border border-gray-200 text-gray-600 font-semibold rounded-lg text-xs md:text-sm cursor-pointer hover:bg-gray-50">İptal</button>
                            <button onClick={handleUpdateRole} className="px-3 md:px-4 py-2 bg-[#0a192f] text-white font-semibold rounded-lg text-xs md:text-sm cursor-pointer hover:bg-[#112240] flex items-center gap-1.5"><Save size={14} className="md:w-4 md:h-4"/> Kaydet</button>
                        </div>
                    </div>
                </div>
            )}

            {isAddingMember && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-60 p-3 md:p-4" onClick={() => setIsAddingMember(false)}>
                    <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl w-full max-w-sm flex flex-col overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="p-4 md:p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
                            <h3 className="font-bold text-sm md:text-base text-(--color-lumex-dark) flex items-center gap-1.5 md:gap-2"><UserPlus size={16} className="text-(--color-lumex-purple-main) md:w-4.5 md:h-4.5"/> Yeni Üye Ekle</h3>
                            <button onClick={() => setIsAddingMember(false)} className="text-gray-400 hover:text-gray-600 p-1"><X size={16} className="md:w-4.5 md:h-4.5" /></button>
                        </div>
                        <div className="p-4 md:p-5 space-y-3 md:space-y-4">
                            <p className="text-[10px] md:text-xs text-gray-500 mb-1.5 md:mb-2">Öğrenciyi topluluğa eklemek için sisteme kayıtlı e-posta adresini giriniz.</p>
                            <div><label className="block text-[10px] md:text-xs font-semibold text-gray-600 mb-0.5 md:mb-1 ml-1">E-posta Adresi *</label><input type="email" value={newMemberEmail} onChange={e => setNewMemberEmail(e.target.value)} placeholder="ornek@std.lumex.edu.tr" className="w-full bg-white border border-gray-200 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm focus:outline-none focus:ring-1 md:focus:ring-2 focus:ring-(--color-lumex-purple-main)" /></div>
                            
                            <div>
                                <label className="block text-[10px] md:text-xs font-semibold text-gray-600 mb-0.5 md:mb-1 ml-1">Rol</label>
                                <select 
                                    value={newMemberRole} 
                                    onChange={e => setNewMemberRole(e.target.value)} 
                                    disabled={!canManageRoles}
                                    className={`w-full border border-gray-200 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm focus:outline-none focus:ring-1 md:focus:ring-2 focus:ring-(--color-lumex-purple-main) ${!canManageRoles ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'}`}
                                >
                                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                                {!canManageRoles && <p className="text-[9px] md:text-[10px] text-orange-500 mt-1 ml-1">* Yalnızca Başkan üye rollerini belirleyebilir.</p>}
                            </div>
                        </div>
                        <div className="p-3 md:p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2 shrink-0">
                            <button onClick={() => setIsAddingMember(false)} className="px-3 md:px-4 py-2 bg-white border border-gray-200 text-gray-600 font-semibold rounded-lg text-xs md:text-sm cursor-pointer hover:bg-gray-50">İptal</button>
                            <button onClick={handleAddMember} className="px-4 md:px-5 py-2 bg-[#0a192f] text-white font-semibold rounded-lg text-xs md:text-sm cursor-pointer hover:bg-[#112240]">Ekle</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MemberManagementPopup;