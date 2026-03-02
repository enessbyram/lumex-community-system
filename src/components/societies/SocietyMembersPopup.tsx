"use client";

import { useState, useEffect } from "react";
import { X, Search } from "lucide-react";

interface Member {
    member_id: number;
    full_name: string;
    student_number: string;
    email: string;
    role_name: string;
}

interface SocietyMembersPopupProps {
    isVisible: boolean;
    onClose: () => void;
    communityId: number;
    communityName: string;
}

const SocietyMembersPopup = ({ isVisible, onClose, communityId, communityName }: SocietyMembersPopupProps) => {
    const [members, setMembers] = useState<Member[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isVisible && communityId) {
            setLoading(true);
            fetch(`/api/community-members?community_id=${communityId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) setMembers(data.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [isVisible, communityId]);

    const getInitials = (name?: string) => {
        if (!name) return "UK";
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const filteredMembers = members.filter(m => 
        m.full_name.toLowerCase().includes(search.toLowerCase()) || 
        m.email.toLowerCase().includes(search.toLowerCase()) ||
        (m.student_number && m.student_number.includes(search))
    );

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-4xl relative max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-(--color-lumex-dark) transition-colors cursor-pointer bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
                >
                    <X size={20} />
                </button>

                <div className="mb-6 border-b border-gray-100 pb-4 pr-8">
                    <h2 className="text-2xl font-bold text-(--color-lumex-purple-main)">{communityName}</h2>
                    <p className="text-(--color-lumex-dark-muted) text-sm mt-1">Üye Listesi • Toplam {members.length} üye</p>
                </div>

                <div className="relative mb-6">
                    <input 
                        type="text" 
                        placeholder="İsim, e-posta veya numara ile ara..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-11 focus:outline-none focus:ring-2 focus:ring-(--color-lumex-purple-main) focus:border-transparent transition-all"
                    />
                    <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
                </div>

                <div className="flex-1 overflow-y-auto pr-2 gap-3 flex flex-col [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                    {loading ? (
                        <div className="text-center py-10 text-(--color-lumex-dark-muted) flex flex-col items-center gap-2">
                            <div className="w-8 h-8 border-4 border-(--color-lumex-purple-light) border-t-(--color-lumex-purple-main) rounded-full animate-spin"></div>
                            Yükleniyor...
                        </div>
                    ) : filteredMembers.length > 0 ? (
                        filteredMembers.map((member) => (
                            <div key={member.member_id} className="bg-(--color-lumex-light) border border-gray-100 rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-(--color-lumex-purple-deep) text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                                    {getInitials(member.full_name)}
                                </div>
                                <div className="flex flex-col flex-1 min-w-0">
                                    <span className="font-semibold text-(--color-lumex-dark) truncate">{member.full_name}</span>
                                    <span className="text-sm text-(--color-lumex-dark-muted) truncate">{member.student_number || 'Numara Yok'}</span>
                                    <span className="text-xs text-gray-400 truncate">{member.email}</span>
                                </div>
                                <div className="bg-white border border-gray-200 px-3 py-1.5 rounded-md text-xs font-semibold text-(--color-lumex-purple-main) whitespace-nowrap">
                                    {member.role_name}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-500">
                            Arama kriterlerine uygun üye bulunamadı.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SocietyMembersPopup;