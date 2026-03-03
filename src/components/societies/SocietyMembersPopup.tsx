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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 md:p-4">
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-2xl w-full max-w-4xl relative max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
                <button 
                    onClick={onClose} 
                    className="absolute top-3 right-3 md:top-4 md:right-4 text-gray-400 hover:text-(--color-lumex-dark) transition-colors cursor-pointer bg-gray-100 hover:bg-gray-200 p-1.5 md:p-2 rounded-full"
                >
                    <X size={18} className="md:w-5 md:h-5" />
                </button>

                <div className="mb-4 md:mb-6 border-b border-gray-100 pb-3 md:pb-4 pr-6 md:pr-8">
                    <h2 className="text-lg md:text-2xl font-bold text-(--color-lumex-purple-main) truncate">{communityName}</h2>
                    <p className="text-(--color-lumex-dark-muted) text-xs md:text-sm mt-0.5 md:mt-1">Üye Listesi • Toplam {members.length} üye</p>
                </div>

                <div className="relative mb-4 md:mb-6 shrink-0">
                    <input 
                        type="text" 
                        placeholder="İsim, e-posta veya numara..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2 md:py-3 pl-9 md:pl-11 text-sm focus:outline-none focus:ring-2 focus:ring-(--color-lumex-purple-main) focus:border-transparent transition-all"
                    />
                    <Search size={16} className="absolute left-3 top-2.5 md:top-3.5 text-gray-400 md:w-4.5 md:h-4.5" />
                </div>

                <div className="flex-1 overflow-y-auto pr-1 md:pr-2 gap-2 md:gap-3 flex flex-col [&::-webkit-scrollbar]:w-1.5 md:[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                    {loading ? (
                        <div className="text-center py-6 md:py-10 text-(--color-lumex-dark-muted) flex flex-col items-center gap-2 text-sm">
                            <div className="w-6 h-6 md:w-8 md:h-8 border-3 md:border-4 border-(--color-lumex-purple-light) border-t-(--color-lumex-purple-main) rounded-full animate-spin"></div>
                            Yükleniyor...
                        </div>
                    ) : filteredMembers.length > 0 ? (
                        filteredMembers.map((member) => (
                            <div key={member.member_id} className="bg-(--color-lumex-light) border border-gray-100 rounded-xl p-3 md:p-4 flex flex-wrap sm:flex-nowrap items-center gap-3 md:gap-4 hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-(--color-lumex-purple-deep) text-white rounded-full flex items-center justify-center font-bold text-sm md:text-lg shrink-0">
                                    {getInitials(member.full_name)}
                                </div>
                                <div className="flex flex-col flex-1 min-w-0 w-full sm:w-auto order-last sm:order-0 mt-1 sm:mt-0">
                                    <span className="font-semibold text-(--color-lumex-dark) text-sm md:text-base truncate">{member.full_name}</span>
                                    <span className="text-xs md:text-sm text-(--color-lumex-dark-muted) truncate">{member.student_number || 'Numara Yok'}</span>
                                    <span className="text-[10px] md:text-xs text-gray-400 truncate">{member.email}</span>
                                </div>
                                <div className="bg-white border border-gray-200 px-2.5 md:px-3 py-1 md:py-1.5 rounded-md text-[10px] md:text-xs font-semibold text-(--color-lumex-purple-main) whitespace-nowrap ml-auto sm:ml-0">
                                    {member.role_name}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-6 md:py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-500 text-sm">
                            Arama kriterlerine uygun üye bulunamadı.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SocietyMembersPopup;