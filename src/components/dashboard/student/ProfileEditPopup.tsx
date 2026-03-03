"use client";

import { useState, useEffect } from "react";
import { X, User, Mail, Lock, KeyRound, Save } from "lucide-react";

interface ProfileEditPopupProps {
    onClose: () => void;
}

const ProfileEditPopup = ({ onClose }: ProfileEditPopupProps) => {
    const [profileData, setProfileData] = useState({
        full_name: "",
        department: "",
        email: ""
    });
    const [userId, setUserId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    const [passData, setPassData] = useState({
        currentPass: "",
        newPass: "",
        confirmPass: ""
    });
    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    const id = parsedUser.id || parsedUser.user_id;
                    setUserId(id);

                    if (id) {
                        const res = await fetch(`/api/student/profile?userId=${id}`);
                        const data = await res.json();
                        
                        if (data.success) {
                            setProfileData({
                                full_name: data.data.full_name || "Belirtilmemiş",
                                department: data.data.department || "Belirtilmemiş",
                                email: data.data.email || "Belirtilmemiş"
                            });
                        }
                    }
                } catch (error) {
                    console.error(error);
                }
            }
            setLoading(false);
        };

        fetchProfile();
    }, []);

    const handlePassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassData({ ...passData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!userId) return;

        if (!passData.currentPass || !passData.newPass || !passData.confirmPass) {
            alert("Lütfen tüm şifre alanlarını doldurun.");
            return;
        }
        if (passData.newPass !== passData.confirmPass) {
            alert("Yeni şifreler uyuşmuyor!");
            return;
        }
        if (passData.newPass.length < 6) {
            alert("Yeni şifreniz en az 6 karakter olmalıdır.");
            return;
        }

        setSubmitLoading(true);

        try {
            const res = await fetch('/api/student/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: userId,
                    currentPassword: passData.currentPass,
                    newPassword: passData.newPass
                })
            });

            const data = await res.json();

            if (data.success) {
                alert(data.message);
                onClose();
            } else {
                alert("Hata: " + data.message);
            }
        } catch (error) {
            console.error(error);
            alert("Bir hata oluştu, lütfen tekrar deneyin.");
        } finally {
            setSubmitLoading(false);
        }
    };

    const getInitials = (name: string) => {
        if (!name || name === "Belirtilmemiş") return "UK";
        return name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 md:p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden max-h-[90vh]">
                
                <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
                    <div>
                        <h3 className="text-lg md:text-xl font-bold text-(--color-lumex-dark)">Profilimi Düzenle</h3>
                        <p className="text-xs md:text-sm text-(--color-lumex-dark-muted) mt-0.5 md:mt-1">Kişisel bilgilerinizi ve şifrenizi yönetin.</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-(--color-lumex-dark) transition-colors bg-white hover:bg-gray-100 p-1.5 md:p-2 rounded-full cursor-pointer shadow-sm">
                        <X size={18} className="md:w-5 md:h-5" />
                    </button>
                </div>

                <div className="p-4 md:p-6 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                    
                    {loading ? (
                        <div className="flex items-center justify-center py-10">
                            <div className="w-8 h-8 border-4 border-(--color-lumex-purple-main) border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col items-center justify-center mb-5 md:mb-6">
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-(--color-lumex-purple-main) text-white flex items-center justify-center rounded-full font-bold text-xl md:text-2xl mb-2 md:mb-3 shadow-md border-3 md:border-4 border-(--color-lumex-purple-light)/20">
                                    {getInitials(profileData.full_name)}
                                </div>
                            </div>

                            <div className="mb-6 md:mb-8 space-y-3 md:space-y-4">
                                <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                                    <User size={14} className="text-(--color-lumex-purple-main) md:w-4 md:h-4" />
                                    <h4 className="font-semibold text-(--color-lumex-dark) text-xs md:text-sm">Kişisel Bilgiler (Salt Okunur)</h4>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                    <div>
                                        <label className="text-[10px] md:text-xs font-semibold text-gray-500 mb-1 ml-1">Ad Soyad</label>
                                        <input type="text" value={profileData.full_name} readOnly className="w-full bg-gray-50 border border-gray-200 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-2.5 text-gray-600 cursor-not-allowed focus:outline-none text-xs md:text-sm font-medium" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] md:text-xs font-semibold text-gray-500 mb-1 ml-1">Bölüm</label>
                                        <input type="text" value={profileData.department} readOnly className="w-full bg-gray-50 border border-gray-200 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-2.5 text-gray-600 cursor-not-allowed focus:outline-none text-xs md:text-sm font-medium truncate" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] md:text-xs font-semibold text-gray-500 mb-1 ml-1 flex items-center gap-1">
                                        <Mail size={10} className="md:w-3 md:h-3" /> E-Posta
                                    </label>
                                    <input type="text" value={profileData.email} readOnly className="w-full bg-gray-50 border border-gray-200 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-2.5 text-gray-600 cursor-not-allowed focus:outline-none text-xs md:text-sm font-medium" />
                                </div>
                            </div>

                            <hr className="border-gray-100 mb-5 md:mb-6" />

                            <div className="space-y-3 md:space-y-4">
                                <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                                    <Lock size={14} className="text-(--color-lumex-accent) md:w-4 md:h-4" />
                                    <h4 className="font-semibold text-(--color-lumex-dark) text-xs md:text-sm">Şifre Değiştir</h4>
                                </div>

                                <div>
                                    <label className="text-[10px] md:text-xs font-semibold text-gray-500 mb-1 ml-1 flex items-center gap-1">
                                        <KeyRound size={10} className="md:w-3 md:h-3" /> Mevcut Şifre
                                    </label>
                                    <input type="password" name="currentPass" value={passData.currentPass} onChange={handlePassChange} placeholder="••••••••" className="w-full bg-white border border-gray-200 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-2.5 text-(--color-lumex-dark) focus:outline-none focus:ring-2 focus:ring-(--color-lumex-purple-main) transition-all text-xs md:text-sm" />
                                </div>
                                <div>
                                    <label className="text-[10px] md:text-xs font-semibold text-gray-500 mb-1 ml-1 flex items-center gap-1">
                                        <KeyRound size={10} className="md:w-3 md:h-3" /> Yeni Şifre
                                    </label>
                                    <input type="password" name="newPass" value={passData.newPass} onChange={handlePassChange} placeholder="••••••••" className="w-full bg-white border border-gray-200 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-2.5 text-(--color-lumex-dark) focus:outline-none focus:ring-2 focus:ring-(--color-lumex-purple-main) transition-all text-xs md:text-sm" />
                                </div>
                                <div>
                                    <label className="text-[10px] md:text-xs font-semibold text-gray-500 mb-1 ml-1 flex items-center gap-1">
                                        <KeyRound size={10} className="md:w-3 md:h-3" /> Yeni Şifre (Tekrar)
                                    </label>
                                    <input type="password" name="confirmPass" value={passData.confirmPass} onChange={handlePassChange} placeholder="••••••••" className="w-full bg-white border border-gray-200 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-2.5 text-(--color-lumex-dark) focus:outline-none focus:ring-2 focus:ring-(--color-lumex-purple-main) transition-all text-xs md:text-sm" />
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="p-4 md:p-6 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-2 md:gap-3 shrink-0">
                    <button onClick={onClose} disabled={submitLoading} className="w-full sm:w-auto px-4 md:px-5 py-2 md:py-2.5 bg-white border border-gray-200 text-gray-600 font-semibold rounded-lg md:rounded-xl hover:bg-gray-50 transition-colors text-xs md:text-sm cursor-pointer disabled:opacity-50 order-last sm:order-first">
                        İptal
                    </button>
                    <button onClick={handleSubmit} disabled={submitLoading || loading} className="w-full sm:w-auto flex justify-center px-4 md:px-5 py-2 md:py-2.5 bg-(--color-lumex-purple-main) text-white font-semibold rounded-lg md:rounded-xl hover:bg-(--color-lumex-purple-deep) transition-colors items-center gap-2 text-xs md:text-sm shadow-md cursor-pointer disabled:opacity-50">
                        {submitLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <Save size={16} className="md:w-4 md:h-4" />
                        )}
                        Şifreyi Güncelle
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ProfileEditPopup;