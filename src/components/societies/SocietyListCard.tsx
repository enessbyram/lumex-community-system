"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Users,
  ChevronDown,
  Check,
  Clock,
  List,
  LogOut // LogOut ikonu eklendi
} from "lucide-react";
import SocietyMembersPopup from "./SocietyMembersPopup";

interface SocietyListCardProps {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  president?: string;
  advisor?: string;
  logo?: string;
}

const SocietyListCard = ({
  id,
  name,
  description,
  memberCount,
  president,
  advisor,
  logo,
}: SocietyListCardProps) => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [status, setStatus] = useState("none");
  const [memberRoleId, setMemberRoleId] = useState<number | null>(null); // Rol state'i eklendi
  const [showMembersPopup, setShowMembersPopup] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        const userId = parsedUser.user_id || parsedUser.id;
        if (
          (parsedUser.role === "student" || parsedUser.role === "admin") &&
          id &&
          userId
        ) {
          fetch(`/api/community-status?user_id=${userId}&community_id=${id}`)
            .then((res) => res.json())
            .then((data) => {
              if (data.success) {
                setStatus(data.status);
                setMemberRoleId(data.role_id); // Gelen rolü kaydet
              }
            })
            .catch((err) => console.error("Durum çekme hatası:", err));
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [id]);

  const handleJoin = async () => {
    if (!user) return;
    const userId = user.user_id || user.id;
    try {
      const res = await fetch("/api/join-community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, community_id: id }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("pending");
        alert(data.message || "Başvurunuz başarıyla alındı.");
      } else {
        alert(data.message || "Başvuru sırasında bir hata oluştu.");
      }
    } catch (err) {
      alert("Sunucuya bağlanırken bir hata oluştu.");
    }
  };

  const handleLeave = async () => {
    if (!confirm("Bu topluluktan ayrılmak istediğinize emin misiniz?")) return;
    if (!user) return;
    
    const userId = user.user_id || user.id;
    try {
      const res = await fetch("/api/leave-community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, community_id: id }),
      });
      const data = await res.json();
      
      if (data.success) {
        setStatus("none");
        setMemberRoleId(null);
        alert(data.message || "Topluluktan başarıyla ayrıldınız.");
      } else {
        alert(data.message || "Ayrılma işlemi başarısız oldu.");
      }
    } catch (err) {
      alert("Sunucuya bağlanırken bir hata oluştu.");
    }
  };

  const showJoinButton =
    user && (user.loginType === "student" || user.role === "student");
  const showManagementView =
    user && (user.role === "admin" || user.role === "advisor");

  const getInitials = (fullName?: string) => {
    if (!fullName || fullName.trim() === "") return "?";
    return fullName
      .trim()
      .split(" ")
      .map((w) => w[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const getCommunityInitials = (commName?: string) => {
    if (!commName || commName.trim() === "") return "LT";
    return commName
      .trim()
      .split(" ")
      .map((w) => w[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const getValidLogoSrc = (logoString?: string) => {
    if (!logoString || logoString === "NULL") return null;
    if (logoString.startsWith('http') || logoString.startsWith('/')) {
        return logoString;
    }
    return `/uploads/logos/${logoString}`;
  };

  const validLogoSrc = getValidLogoSrc(logo);

  return (
    <div className="w-full mb-3 md:mb-4">
      <div
        className={`bg-white rounded-xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md ${open ? "ring-2 ring-(--color-lumex-purple-light)/30" : ""}`}
      >
        <div
          className="flex items-center justify-between p-3 md:p-5 cursor-pointer select-none"
          onClick={() => setOpen(!open)}
        >
          <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0 pr-2">
            <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full bg-(--color-lumex-purple-light)/10 border border-(--color-lumex-purple-light)/20 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
              {validLogoSrc ? (
                <Image
                  src={validLogoSrc}
                  alt={name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 40px, 48px"
                />
              ) : (
                <span className="font-bold text-(--color-lumex-purple-main) text-sm md:text-lg">
                  {getCommunityInitials(name)}
                </span>
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <h3 className="font-bold text-(--color-lumex-dark) text-sm md:text-lg truncate group-hover:text-(--color-lumex-purple-main) transition-colors">
                {name}
              </h3>
              <div className="flex items-center gap-1.5 md:hidden text-[10px] md:text-xs text-(--color-lumex-dark-muted) mt-0.5">
                <Users size={12} className="text-(--color-lumex-purple-main)" />{" "}
                {memberCount} Üye
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6 shrink-0">
            <div className="hidden md:flex items-center gap-2 bg-(--color-lumex-light) px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
              <Users size={16} className="text-(--color-lumex-purple-main)" />
              <span className="text-sm font-semibold text-(--color-lumex-dark)">
                {memberCount}
              </span>
            </div>
            <div
              className={`p-1 md:p-1.5 rounded-full transition-all duration-300 ${open ? "bg-(--color-lumex-purple-main) text-white rotate-180" : "bg-gray-50 text-gray-400"}`}
            >
              <ChevronDown size={16} className="md:w-5 md:h-5" />
            </div>
          </div>
        </div>

        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${open ? "max-h-200 opacity-100" : "max-h-0 opacity-0"}`}
        >
          <div className="p-4 md:p-6 bg-gray-50/50 border-t border-gray-100 rounded-b-xl flex flex-col gap-4 md:gap-6">
            <div>
              <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5 md:mb-2">
                Hakkında
              </h4>
              <p className="text-(--color-lumex-dark-muted) text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
                {description ||
                  "Bu topluluk için henüz bir açıklama girilmemiştir."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div className="flex items-center gap-3 p-2.5 md:p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-(--color-lumex-purple-main) text-white flex items-center justify-center font-bold text-xs md:text-sm shrink-0 shadow-md">
                  {getInitials(president)}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] md:text-xs text-gray-400 font-medium truncate">
                    Topluluk Başkanı
                  </p>
                  <p className="text-xs md:text-sm font-bold text-(--color-lumex-dark) truncate">
                    {president || "Henüz Belirlenmedi"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2.5 md:p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-(--color-lumex-purple-deep) text-white flex items-center justify-center font-bold text-xs md:text-sm shrink-0 shadow-md">
                  {getInitials(advisor)}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] md:text-xs text-gray-400 font-medium truncate">
                    Akademik Danışman
                  </p>
                  <p className="text-xs md:text-sm font-bold text-(--color-lumex-dark) truncate">
                    {advisor || "Henüz Belirlenmedi"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 md:pt-4 border-t border-gray-200/60">
              {showManagementView && (
                <button
                  onClick={() => setShowMembersPopup(true)}
                  className="w-full sm:w-auto flex justify-center items-center gap-2 px-4 py-2.5 md:py-2 bg-(--color-lumex-purple-main) text-white text-xs md:text-sm font-bold rounded-lg hover:bg-(--color-lumex-purple-deep) transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <List size={16} className="md:w-4 md:h-4" /> Üyeler
                </button>
              )}

              {showJoinButton && (
                <div className="w-full sm:w-auto sm:ml-auto">
                  {status === "none" && (
                    <button
                      onClick={handleJoin}
                      className="w-full px-6 py-2.5 md:py-2 bg-(--color-lumex-accent) text-(--color-lumex-dark) text-xs md:text-sm font-bold rounded-lg hover:bg-(--color-lumex-accent-hover) transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      Topluluğa Başvur
                    </button>
                  )}
                  {status === "pending" && (
                    <div className="w-full flex justify-center items-center gap-2 px-4 py-2.5 md:py-2 bg-yellow-50 text-yellow-700 text-xs md:text-sm font-bold rounded-lg border border-yellow-200/50">
                      <Clock size={16} className="md:w-4 md:h-4" /> Başvuru Bekliyor
                    </div>
                  )}
                  {status === "member" && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 flex justify-center items-center gap-1.5 px-4 py-2.5 md:py-2 bg-green-50 text-green-700 text-xs md:text-sm font-bold rounded-lg border border-green-200/50">
                        <Check size={16} className="md:w-4 md:h-4" /> Üyesiniz
                      </div>
                      
                      {/* SADECE ROL 11 İSE GÖSTERİLİR */}
                      {memberRoleId === 11 && (
                        <button
                          onClick={handleLeave}
                          title="Topluluktan Ayrıl"
                          className="flex-none flex justify-center items-center gap-1.5 px-4 py-2.5 md:py-2 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white transition-colors text-xs md:text-sm font-bold rounded-lg border border-red-200/50 shadow-sm cursor-pointer"
                        >
                          <LogOut size={16} className="md:w-4 md:h-4" /> Ayrıl
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <SocietyMembersPopup
        isVisible={showMembersPopup}
        onClose={() => setShowMembersPopup(false)}
        communityId={id}
        communityName={name}
      />
    </div>
  );
};

export default SocietyListCard;