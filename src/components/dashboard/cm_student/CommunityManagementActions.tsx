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
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col mt-6 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-(--color-lumex-dark)">
            Topluluk Yönetimi
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Topluluğunuzla ilgili hızlı işlemlere buradan ulaşabilirsiniz.
          </p>
        </div>

        <div className="p-6 flex flex-wrap md:flex-nowrap gap-4">
          <button
            onClick={() => setIsMembersOpen(true)}
            className="flex-1 bg-[#0a192f] text-white hover:bg-[#112240] py-4 rounded-xl flex items-center justify-center gap-2 font-bold shadow-md transition-colors cursor-pointer text-sm"
          >
            <UsersRound size={18} /> Üyeleri Yönet
          </button>

          <button
            onClick={() => setIsAddEventOpen(true)}
            className="flex-1 bg-white border border-gray-200 text-(--color-lumex-dark) hover:bg-gray-50 py-4 rounded-xl flex items-center justify-center gap-2 font-bold shadow-sm transition-colors cursor-pointer text-sm"
          >
            <CalendarPlus size={18} /> Etkinlik Ekle
          </button>

          <button
            onClick={() => setIsInfoOpen(true)}
            className="flex-1 bg-white border border-gray-200 text-(--color-lumex-dark) hover:bg-gray-50 py-4 rounded-xl flex items-center justify-center gap-2 font-bold shadow-sm transition-colors cursor-pointer text-sm"
          >
            <Settings size={18} /> Topluluk Bilgileri
          </button>
        </div>
      </div>
      {isAddEventOpen && (
        <AddEventPopup
          onClose={() => setIsAddEventOpen(false)}
          onSuccess={() => setIsAddEventOpen(false)}
        />
      )}{" "}
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
