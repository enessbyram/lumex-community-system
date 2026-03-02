"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Users,
  ChevronDown,
  Check,
  Clock,
  List,
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
              if (data.success) setStatus(data.status);
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

  // DÜZELTME BURADA: Logo'nun doğru bir Next.js Image yolu olmasını garantiliyoruz
  const getValidLogoSrc = (logoString?: string) => {
    if (!logoString || logoString === "NULL") return null;
    if (logoString.startsWith('http') || logoString.startsWith('/')) {
        return logoString;
    }
    return `/uploads/logos/${logoString}`;
  };

  const validLogoSrc = getValidLogoSrc(logo);

  return (
    <div className="w-full mb-4">
      <div
        className={`bg-white rounded-xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md ${open ? "ring-2 ring-(--color-lumex-purple-light)/30" : ""}`}
      >
        {/* KART ÜST KISIM (CLICKABLE) */}
        <div
          className="flex items-center justify-between p-4 md:p-5 cursor-pointer select-none"
          onClick={() => setOpen(!open)}
        >
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="relative w-12 h-12 rounded-full bg-(--color-lumex-purple-light)/10 border border-(--color-lumex-purple-light)/20 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
              {validLogoSrc ? (
                <Image
                  src={validLogoSrc}
                  alt={name}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              ) : (
                <span className="font-bold text-(--color-lumex-purple-main) text-lg">
                  {getCommunityInitials(name)}
                </span>
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <h3 className="font-bold text-(--color-lumex-dark) text-base md:text-lg truncate group-hover:text-(--color-lumex-purple-main) transition-colors">
                {name}
              </h3>
              <div className="flex items-center gap-2 md:hidden text-xs text-(--color-lumex-dark-muted)">
                <Users size={14} className="text-(--color-lumex-purple-main)" />{" "}
                {memberCount} Üye
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 bg-(--color-lumex-light) px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
              <Users size={16} className="text-(--color-lumex-purple-main)" />
              <span className="text-sm font-semibold text-(--color-lumex-dark)">
                {memberCount}
              </span>
            </div>
            <div
              className={`p-1.5 rounded-full transition-all duration-300 ${open ? "bg-(--color-lumex-purple-main) text-white rotate-180" : "bg-gray-50 text-gray-400"}`}
            >
              <ChevronDown size={20} />
            </div>
          </div>
        </div>

        {/* AÇILIR DETAY KISMI */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${open ? "max-h-250 opacity-100" : "max-h-0 opacity-0"}`}
        >
          <div className="p-5 md:p-6 bg-gray-50/50 border-t border-gray-100 rounded-b-xl">
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Hakkında
              </h4>
              <p className="text-(--color-lumex-dark-muted) text-sm leading-relaxed whitespace-pre-wrap">
                {description ||
                  "Bu topluluk için henüz bir açıklama girilmemiştir."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-(--color-lumex-purple-main) text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md">
                  {getInitials(president)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 font-medium">
                    Topluluk Başkanı
                  </p>
                  <p className="text-sm font-bold text-(--color-lumex-dark) truncate">
                    {president || "Henüz Belirlenmedi"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-(--color-lumex-purple-deep) text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md">
                  {getInitials(advisor)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 font-medium">
                    Akademik Danışman
                  </p>
                  <p className="text-sm font-bold text-(--color-lumex-dark) truncate">
                    {advisor || "Henüz Belirlenmedi"}
                  </p>
                </div>
              </div>
            </div>

            {/* BUTONLAR */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-200/60">
              <div className="flex gap-2">
                {showManagementView && (
                  <button
                    onClick={() => setShowMembersPopup(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-(--color-lumex-purple-main) text-white text-sm font-bold rounded-lg hover:bg-(--color-lumex-purple-deep) transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <List size={16} /> Üyeler
                  </button>
                )}
              </div>

              <div className="flex-1 md:flex-none flex justify-end">
                {showJoinButton && (
                  <>
                    {status === "none" && (
                      <button
                        onClick={handleJoin}
                        className="w-full md:w-auto px-8 py-2.5 bg-(--color-lumex-accent) text-(--color-lumex-dark) text-sm font-bold rounded-lg hover:bg-(--color-lumex-accent-hover) transition-all shadow-md active:scale-95 cursor-pointer"
                      >
                        Topluluğa Başvur
                      </button>
                    )}
                    {status === "pending" && (
                      <div className="flex items-center gap-2 px-4 py-2.5 bg-yellow-50 text-yellow-700 text-sm font-bold rounded-lg border border-yellow-200/50">
                        <Clock size={16} /> Başvuru Bekliyor
                      </div>
                    )}
                    {status === "member" && (
                      <div className="flex items-center gap-2 px-4 py-2.5 bg-green-50 text-green-700 text-sm font-bold rounded-lg border border-green-200/50">
                        <Check size={16} /> Üyesiniz
                      </div>
                    )}
                  </>
                )}
              </div>
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