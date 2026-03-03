"use client";

import { useState, useEffect } from "react";
import { Eye, X, Users } from "lucide-react";

const CommunityList = () => {
    const [communities, setCommunities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedCommunity, setSelectedCommunity] = useState<any>(null);
    const [communityMembers, setCommunityMembers] = useState<any[]>([]);
    const [membersLoading, setMembersLoading] = useState(false);
    const [showAllMembers, setShowAllMembers] = useState(false);

    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                const res = await fetch('/api/admin/communities');
                const data = await res.json();
                if (data.success) {
                    setCommunities(data.data);
                }
            } catch (error) {
                console.error("Topluluklar çekilirken hata:", error);
            }
            setLoading(false);
        };
        fetchCommunities();
    }, []);

    const sosyalTopluluklar = communities.filter(c => c.type_id === 1);
    const meslekiTopluluklar = communities.filter(c => c.type_id === 2);

    const boardMembers = communityMembers.filter(m => m.role_name !== 'Üye' && m.role_name !== 'Normal Üye');

    const openDetails = async (community: any) => {
        setSelectedCommunity(community);
        setShowAllMembers(false);
        setMembersLoading(true);
        setCommunityMembers([]);

        try {
            const res = await fetch(`/api/community-members?community_id=${community.id}`);
            const data = await res.json();
            if (data.success) {
                setCommunityMembers(data.data);
            }
        } catch (error) {
            console.error("Üyeler çekilirken hata:", error);
        }
        setMembersLoading(false);
    };

    const closePopups = () => {
        setSelectedCommunity(null);
        setShowAllMembers(false);
    };

    if (loading) {
        return <div className="flex justify-center p-6 md:p-10 mt-4 md:mt-6"><div className="w-6 h-6 md:w-8 md:h-8 border-3 md:border-4 border-(--color-lumex-purple-light) border-t-(--color-lumex-purple-main) rounded-full animate-spin"></div></div>;
    }

    return (
        <div className="w-full mt-4 md:mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 flex flex-col">
                <h2 className="text-base md:text-lg font-bold text-(--color-lumex-dark)">Mesleki Topluluklar</h2>
                <p className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1 mb-3 md:mb-6">Toplam {meslekiTopluluklar.length} topluluk</p>
                
                <div className="flex flex-col gap-2 md:gap-3 max-h-96 md:max-h-150 overflow-y-auto pr-1 md:pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200">
                    {meslekiTopluluklar.map(comm => (
                        <div key={comm.id} className="bg-gray-50/50 border border-gray-100 rounded-lg md:rounded-2xl p-3 md:p-4 flex items-center justify-between hover:shadow-sm transition-all group shrink-0 gap-2">
                            <div className="flex flex-col gap-0.5 md:gap-1 min-w-0 pr-2">
                                <h3 className="font-semibold text-(--color-lumex-dark) text-sm md:text-[15px] truncate">{comm.name}</h3>
                                <p className="text-[10px] md:text-xs text-gray-500 truncate">{comm.memberCount} üye • {comm.eventCount} etkinlik</p>
                            </div>
                            <button 
                                onClick={() => openDetails(comm)}
                                className="w-8 h-8 md:w-10 md:h-10 border border-gray-200 bg-white text-gray-500 rounded-md md:rounded-xl flex items-center justify-center hover:bg-gray-50 hover:text-(--color-lumex-dark) transition-colors shadow-sm shrink-0 cursor-pointer"
                            >
                                <Eye size={16} className="md:w-4.5 md:h-4.5" />
                            </button>
                        </div>
                    ))}
                    {meslekiTopluluklar.length === 0 && <p className="text-xs md:text-sm text-gray-400 text-center py-4">Kayıtlı mesleki topluluk bulunmuyor.</p>}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 flex flex-col">
                <h2 className="text-base md:text-lg font-bold text-(--color-lumex-dark)">Sosyal Topluluklar</h2>
                <p className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1 mb-3 md:mb-6">Toplam {sosyalTopluluklar.length} topluluk</p>
                
                <div className="flex flex-col gap-2 md:gap-3 max-h-96 md:max-h-150 overflow-y-auto pr-1 md:pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200">
                    {sosyalTopluluklar.map(comm => (
                        <div key={comm.id} className="bg-gray-50/50 border border-gray-100 rounded-lg md:rounded-2xl p-3 md:p-4 flex items-center justify-between hover:shadow-sm transition-all group shrink-0 gap-2">
                            <div className="flex flex-col gap-0.5 md:gap-1 min-w-0 pr-2">
                                <h3 className="font-semibold text-(--color-lumex-dark) text-sm md:text-[15px] truncate">{comm.name}</h3>
                                <p className="text-[10px] md:text-xs text-gray-500 truncate">{comm.memberCount} üye • {comm.eventCount} etkinlik</p>
                            </div>
                            <button 
                                onClick={() => openDetails(comm)}
                                className="w-8 h-8 md:w-10 md:h-10 border border-gray-200 bg-white text-gray-500 rounded-md md:rounded-xl flex items-center justify-center hover:bg-gray-50 hover:text-(--color-lumex-dark) transition-colors shadow-sm shrink-0 cursor-pointer"
                            >
                                <Eye size={16} className="md:w-4.5:h-[18px]" />
                            </button>
                        </div>
                    ))}
                    {sosyalTopluluklar.length === 0 && <p className="text-xs md:text-sm text-gray-400 text-center py-4">Kayıtlı sosyal topluluk bulunmuyor.</p>}
                </div>
            </div>

            {selectedCommunity && !showAllMembers && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 md:p-4 animate-in fade-in" onClick={closePopups}>
                    <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-xl flex flex-col overflow-hidden animate-in zoom-in-95 max-h-[90vh]" onClick={e => e.stopPropagation()}>
                        
                        <div className="p-4 md:p-6 pb-3 md:pb-4 flex justify-between items-start shrink-0">
                            <div>
                                <h2 className="text-lg md:text-xl font-bold text-(--color-lumex-dark) truncate max-w-62.5 sm:max-w-md">{selectedCommunity.name}</h2>
                                <p className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">Topluluk üyeleri ve yönetim kurulu bilgileri</p>
                            </div>
                            <button onClick={closePopups} className="text-gray-400 hover:text-gray-700 p-1 md:p-1.5 cursor-pointer bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"><X size={18} className="md:w-5 md:h-5"/></button>
                        </div>

                        <div className="p-4 md:p-6 pt-1 md:pt-2 space-y-3 md:space-y-4 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200">
                            <h3 className="text-xs md:text-sm font-semibold text-(--color-lumex-dark)">Yönetim Kurulu</h3>
                            <div className="flex flex-col gap-2 md:gap-3 max-h-48 md:max-h-60 overflow-y-auto pr-1 md:pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200">
                                {membersLoading ? (
                                    <p className="text-xs md:text-sm text-gray-400 italic">Yükleniyor...</p>
                                ) : boardMembers.length > 0 ? (
                                    boardMembers.map((member: any, idx: number) => (
                                        <div key={idx} className="bg-[#f8faff] border border-blue-50/50 p-3 md:p-4 rounded-xl md:rounded-2xl flex flex-col gap-0.5 md:gap-1 shrink-0">
                                            <p className="font-semibold text-(--color-lumex-dark) text-xs md:text-sm wrap-break-word">{member.full_name} - {member.role_name}</p>
                                            <p className="text-[10px] md:text-xs text-gray-500 wrap-break-word">{member.email}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs md:text-sm text-gray-400 italic">Yönetim kurulu bilgisi bulunmuyor.</p>
                                )}
                            </div>
                        </div>

                        <div className="p-4 md:p-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4 shrink-0 bg-gray-50/50">
                            <span className="text-xs md:text-sm text-gray-500 font-medium">Toplam {selectedCommunity.memberCount} üye bulunmaktadır.</span>
                            <button 
                                onClick={() => setShowAllMembers(true)}
                                className="w-full sm:w-auto px-4 md:px-5 py-2.5 md:py-2.5 bg-white border border-gray-200 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold text-(--color-lumex-dark) hover:bg-gray-50 flex items-center justify-center gap-1.5 md:gap-2 transition-colors cursor-pointer shadow-sm"
                            >
                                <Users size={14} className="md:w-4 md:h-4" /> Tüm Üyeleri Görüntüle
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {selectedCommunity && showAllMembers && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-3 md:p-4 animate-in fade-in" onClick={closePopups}>
                    <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden max-h-[90vh] animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                        
                        <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-start shrink-0">
                            <div>
                                <h2 className="text-lg md:text-xl font-bold text-(--color-lumex-dark) truncate max-w-62.5:max-w-md">{selectedCommunity.name}</h2>
                                <p className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">Topluluğa kayıtlı tüm üyelerin listesi ({communityMembers.length} Kişi)</p>
                            </div>
                            <button onClick={() => setShowAllMembers(false)} className="text-gray-400 border border-gray-200 rounded-md md:rounded-lg p-1.5 hover:bg-gray-50 cursor-pointer transition-colors"><X size={16} className="md:w-4.5 md:h-4.5"/></button>
                        </div>

                        <div className="p-4 md:p-6 overflow-y-auto space-y-3 md:space-y-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200">
                            {communityMembers.length > 0 ? (
                                communityMembers.map((member: any) => (
                                    <div key={member.member_id} className="bg-white border border-gray-200 p-3 md:p-5 rounded-xl md:rounded-2xl flex flex-col gap-1 md:gap-2 relative shadow-sm shrink-0">
                                        <div className="absolute top-3 right-3 md:top-5 md:right-5 bg-gray-100 text-gray-600 text-[9px] md:text-[11px] font-bold px-2 md:px-3 py-0.5 md:py-1 rounded-md md:rounded-lg">
                                            {member.role_name}
                                        </div>
                                        <h3 className="font-bold text-(--color-lumex-dark) text-sm md:text-base pr-16 md:pr-20 truncate">{member.full_name}</h3>
                                        <p className="text-xs md:text-sm text-gray-600 truncate">Öğrenci No: {member.student_number || '-'}</p>
                                        <p className="text-[10px] md:text-sm text-gray-600 truncate">E-posta: {member.email}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-gray-400 text-xs md:text-sm">Bu topluluğa ait üye detayı bulunamadı.</div>
                            )}
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
};

export default CommunityList;