"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Users, Shield, GraduationCap, Info, X } from "lucide-react";

const accountTypes = [
    { id: "student", label: "Öğrenci", icon: User },
    { id: "management", label: "Yönetim", icon: Users },
    { id: "consultant", label: "Danışman", icon: GraduationCap },
    { id: "admin", label: "İdare", icon: Shield },
];

interface LoginPopupProps {
    onClose: () => void;
    setUser: (user: any) => void;
}

const LoginPopup = ({ onClose, setUser }: LoginPopupProps) => {
    const [active, setActive] = useState("student");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Lütfen e-posta ve şifrenizi girin.");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: active, email, password })
            });
            const data = await res.json();
            
            if (data.success) {
                const loggedInUser = { 
                    isLoggedIn: true, 
                    ...data.user
                };

                localStorage.setItem('user', JSON.stringify(loggedInUser));
                setUser(loggedInUser); 
                onClose();
                
                router.push(data.redirectUrl);
            } else {
                setError(data.message || "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
            }
        } catch (err) {
            setError("Sunucuya ulaşılamadı. Lütfen daha sonra tekrar deneyin.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white text-(--color-lumex-dark) w-full max-w-lg rounded-2xl shadow-2xl p-5 sm:p-6 md:p-8 relative flex flex-col animate-in zoom-in-95 duration-200">
                
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 sm:top-5 sm:right-5 text-gray-400 hover:text-(--color-lumex-dark) transition-colors bg-gray-100 hover:bg-gray-200 p-1.5 sm:p-2 rounded-full cursor-pointer"
                >
                    <X size={20} className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <div className="mb-4 sm:mb-6 pr-8">
                    <h1 className="text-xl sm:text-2xl font-bold text-(--color-lumex-purple-main)">Lumex Sistemine Giriş</h1>
                    <p className="text-xs sm:text-sm text-(--color-lumex-dark-muted) mt-1">Hesap türünüzü seçin ve bilgilerinizi girin.</p>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap bg-(--color-lumex-light) p-1.5 rounded-xl items-center justify-between gap-1 mb-5 sm:mb-6 border border-gray-200">
                    {accountTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                            <div
                                key={type.id}
                                onClick={() => {
                                    setActive(type.id);
                                    setError(""); 
                                    setEmail(""); 
                                    setPassword(""); 
                                }}
                                className={`flex-1 flex flex-col sm:flex-row items-center justify-center py-2 px-1 sm:px-2 rounded-lg gap-1 sm:gap-2 cursor-pointer transition-all duration-200 ${
                                    active === type.id 
                                    ? "bg-white text-(--color-lumex-purple-main) font-bold shadow-sm" 
                                    : "text-(--color-lumex-dark-muted) hover:text-(--color-lumex-dark) hover:bg-gray-100"
                                }`}
                            >
                                <Icon size={16} className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                                <span className="text-[10px] sm:text-xs md:text-sm text-center">{type.label}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="w-full flex-1">
                    {active === "student" && (
                        <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <form onSubmit={handleLogin} className="flex flex-col gap-3 sm:gap-4">
                                <div className="flex flex-col gap-1 sm:gap-1.5">
                                    <label className="font-semibold text-(--color-lumex-dark) text-xs sm:text-sm ml-1">Okul E-Posta Adresi</label>
                                    <input 
                                        type="email" 
                                        placeholder="ogrencino@std.lumex.edu.tr" 
                                        className="text-xs sm:text-sm px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-(--color-lumex-light) border border-gray-200 focus:outline-none focus:ring-2 focus:ring-(--color-lumex-purple-main) transition-all" 
                                        value={email} 
                                        onChange={e => setEmail(e.target.value)} 
                                    />
                                </div>
                                <div className="flex flex-col gap-1 sm:gap-1.5">
                                    <label className="font-semibold text-(--color-lumex-dark) text-xs sm:text-sm ml-1">Şifre</label>
                                    <input 
                                        type="password" 
                                        placeholder="••••••••" 
                                        className="text-xs sm:text-sm px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-(--color-lumex-light) border border-gray-200 focus:outline-none focus:ring-2 focus:ring-(--color-lumex-purple-main) transition-all" 
                                        value={password} 
                                        onChange={e => setPassword(e.target.value)} 
                                    />
                                </div>
                                {error && <p className="text-red-500 text-xs sm:text-sm font-medium mt-1">{error}</p>}
                                <button disabled={isLoading} type="submit" className="mt-2 cursor-pointer bg-(--color-lumex-accent) hover:bg-(--color-lumex-accent-hover) rounded-lg sm:rounded-xl w-full text-(--color-lumex-dark) font-bold py-3 sm:py-3.5 transition-colors shadow-md disabled:opacity-70 flex justify-center items-center text-sm sm:text-base">
                                    {isLoading ? <div className="w-5 h-5 border-2 border-(--color-lumex-dark) border-t-transparent rounded-full animate-spin"></div> : "Öğrenci Olarak Giriş Yap"}
                                </button>
                            </form>
                        </div>
                    )}

                    {active === "management" && (
                        <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="flex flex-col gap-2 border border-(--color-lumex-purple-light)/30 bg-(--color-lumex-purple-light)/10 px-3 sm:px-4 py-3 sm:py-4 rounded-lg sm:rounded-xl mb-4 sm:mb-6">
                                <div className="flex items-start sm:items-center gap-2">
                                    <Info size={16} className="text-(--color-lumex-purple-main) shrink-0 mt-0.5 sm:mt-0" />
                                    <p className="text-xs sm:text-sm text-(--color-lumex-dark-muted)">Sadece yönetim kurulu üyeleri standart öğrenci e-posta ve şifreleriyle girebilir.</p>
                                </div>
                            </div>
                            
                            <form onSubmit={handleLogin} className="flex flex-col gap-3 sm:gap-4">
                                <div className="flex flex-col gap-1 sm:gap-1.5">
                                    <label className="font-semibold text-(--color-lumex-dark) text-xs sm:text-sm ml-1">Okul E-Posta Adresi</label>
                                    <input 
                                        type="email" 
                                        placeholder="ogrencino@std.lumex.edu.tr" 
                                        className="text-xs sm:text-sm px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-(--color-lumex-light) border border-gray-200 focus:outline-none focus:ring-2 focus:ring-(--color-lumex-purple-main) transition-all" 
                                        value={email} 
                                        onChange={e => setEmail(e.target.value)} 
                                    />
                                </div>
                                <div className="flex flex-col gap-1 sm:gap-1.5">
                                    <label className="font-semibold text-(--color-lumex-dark) text-xs sm:text-sm ml-1">Şifre</label>
                                    <input 
                                        type="password" 
                                        placeholder="••••••••" 
                                        className="text-xs sm:text-sm px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-(--color-lumex-light) border border-gray-200 focus:outline-none focus:ring-2 focus:ring-(--color-lumex-purple-main) transition-all" 
                                        value={password} 
                                        onChange={e => setPassword(e.target.value)} 
                                    />
                                </div>
                                {error && <p className="text-red-500 text-xs sm:text-sm font-medium mt-1">{error}</p>}
                                <button disabled={isLoading} type="submit" className="mt-2 cursor-pointer bg-(--color-lumex-purple-main) hover:bg-(--color-lumex-purple-deep) rounded-lg sm:rounded-xl w-full text-white font-bold py-3 sm:py-3.5 transition-colors shadow-md disabled:opacity-70 flex justify-center items-center text-sm sm:text-base">
                                    {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Yönetim Olarak Giriş Yap"}
                                </button>
                            </form>
                        </div>
                    )}

                    {active === "consultant" && (
                        <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <form onSubmit={handleLogin} className="flex flex-col gap-3 sm:gap-4">
                                <div className="flex flex-col gap-1 sm:gap-1.5">
                                    <label className="font-semibold text-(--color-lumex-dark) text-xs sm:text-sm ml-1">Danışman E-Posta</label>
                                    <input 
                                        type="email" 
                                        placeholder="isim.soyisim@lumex.edu.tr" 
                                        className="text-xs sm:text-sm px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-(--color-lumex-light) border border-gray-200 focus:outline-none focus:ring-2 focus:ring-(--color-lumex-purple-main) transition-all" 
                                        value={email} 
                                        onChange={e => setEmail(e.target.value)} 
                                    />
                                </div>
                                <div className="flex flex-col gap-1 sm:gap-1.5">
                                    <label className="font-semibold text-(--color-lumex-dark) text-xs sm:text-sm ml-1">Şifre</label>
                                    <input 
                                        type="password" 
                                        placeholder="••••••••" 
                                        className="text-xs sm:text-sm px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-(--color-lumex-light) border border-gray-200 focus:outline-none focus:ring-2 focus:ring-(--color-lumex-purple-main) transition-all" 
                                        value={password} 
                                        onChange={e => setPassword(e.target.value)} 
                                    />
                                </div>
                                {error && <p className="text-red-500 text-xs sm:text-sm font-medium mt-1">{error}</p>}
                                <button disabled={isLoading} type="submit" className="mt-2 cursor-pointer bg-(--color-lumex-purple-main) hover:bg-(--color-lumex-purple-deep) rounded-lg sm:rounded-xl w-full text-white font-bold py-3 sm:py-3.5 transition-colors shadow-md disabled:opacity-70 flex justify-center items-center text-sm sm:text-base">
                                    {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Danışman Olarak Giriş Yap"}
                                </button>
                            </form>
                        </div>
                    )}

                    {active === "admin" && (
                        <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <form onSubmit={handleLogin} className="flex flex-col gap-3 sm:gap-4">
                                <div className="flex flex-col gap-1 sm:gap-1.5">
                                    <label className="font-semibold text-(--color-lumex-dark) text-xs sm:text-sm ml-1">Yönetici E-Posta</label>
                                    <input 
                                        type="email" 
                                        placeholder="idare@lumex.edu.tr" 
                                        className="text-xs sm:text-sm px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-(--color-lumex-light) border border-gray-200 focus:outline-none focus:ring-2 focus:ring-(--color-lumex-purple-main) transition-all" 
                                        value={email} 
                                        onChange={e => setEmail(e.target.value)} 
                                    />
                                </div>
                                <div className="flex flex-col gap-1 sm:gap-1.5">
                                    <label className="font-semibold text-(--color-lumex-dark) text-xs sm:text-sm ml-1">Şifre</label>
                                    <input 
                                        type="password" 
                                        placeholder="••••••••" 
                                        className="text-xs sm:text-sm px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-(--color-lumex-light) border border-gray-200 focus:outline-none focus:ring-2 focus:ring-(--color-lumex-purple-main) transition-all" 
                                        value={password} 
                                        onChange={e => setPassword(e.target.value)} 
                                    />
                                </div>
                                {error && <p className="text-red-500 text-xs sm:text-sm font-medium mt-1">{error}</p>}
                                <button disabled={isLoading} type="submit" className="mt-2 cursor-pointer bg-(--color-lumex-dark) hover:bg-black rounded-lg sm:rounded-xl w-full text-white font-bold py-3 sm:py-3.5 transition-colors shadow-md disabled:opacity-70 flex justify-center items-center text-sm sm:text-base">
                                    {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "İdare Olarak Giriş Yap"}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPopup;