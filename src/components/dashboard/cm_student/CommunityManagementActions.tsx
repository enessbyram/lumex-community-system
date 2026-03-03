"use client";

import { useState } from "react";
import { UsersRound, CalendarPlus, Settings } from "lucide-react";
import AddEventPopup from "./AddEventPopup";
import CommunityInfoPopup from "./CommunityInfoPopup";
import MemberManagementPopup from "./MemberManagementPopup";

const CommunityManagementActions = () => {
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);

  return (
    <>
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col mt-4 md:mt-6 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-100">
          <h2 className="text-base md:text-lg font-bold text-(--color-lumex-dark)">
            Topluluk Yönetimi
          </h2>
          <p className="text-[10px] md:text-sm text-gray-500 mt-0.5 md:mt-1">
            Topluluğunuzla ilgili hızlı işlemlere buradan ulaşabilirsiniz.
          </p>
        </div>

        <div className="p-4 md:p-6 flex flex-col sm:flex-row gap-3 md:gap-4">
          <button
            onClick={() => setIsMembersOpen(true)}
            className="w-full sm:flex-1 bg-[#0a192f] text-white hover:bg-[#112240] py-3 md:py-4 rounded-lg md:rounded-xl flex items-center justify-center gap-1.5 md:gap-2 font-bold shadow-md transition-colors cursor-pointer text-xs md:text-sm"
          >
            <UsersRound size={16} className="md:w-4.5 md:h-4.5" /> Üyeleri Yönet
          </button>

          <button
            onClick={() => setIsAddEventOpen(true)}
            className="w-full sm:flex-1 bg-white border border-gray-200 text-(--color-lumex-dark) hover:bg-gray-50 py-3 md:py-4 rounded-lg md:rounded-xl flex items-center justify-center gap-1.5 md:gap-2 font-bold shadow-sm transition-colors cursor-pointer text-xs md:text-sm"
          >
            <CalendarPlus size={16} className="md:w-4.5 md:h-4.5" /> Etkinlik Ekle
          </button>

          <button
            onClick={() => setIsInfoOpen(true)}
            className="w-full sm:flex-1 bg-white border border-gray-200 text-(--color-lumex-dark) hover:bg-gray-50 py-3 md:py-4 rounded-lg md:rounded-xl flex items-center justify-center gap-1.5 md:gap-2 font-bold shadow-sm transition-colors cursor-pointer text-xs md:text-sm"
          >
            <Settings size={16} className="md:w-4.5 md:h-4.5" /> Topluluk Bilgileri
          </button>
        </div>
      </div>
      {isAddEventOpen && (
        <AddEventPopup
          onClose={() => setIsAddEventOpen(false)}
          onSuccess={() => setIsAddEventOpen(false)}
        />
      )}
      {isInfoOpen && (
        <CommunityInfoPopup onClose={() => setIsInfoOpen(false)} />
      )}
      {isMembersOpen && (
        <MemberManagementPopup onClose={() => setIsMembersOpen(false)} />
      )}
    </>
  );
};

export default CommunityManagementActions;