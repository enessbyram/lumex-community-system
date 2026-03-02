"use client";

import { Image as ImageIcon } from "lucide-react";
import InfoBox from "@/components/dashboard/cm_student/InfoBox";
import PendingMembers from "@/components/dashboard/cm_student/PendingMembers";
import SubmittedEvents from "@/components/dashboard/cm_student/SubmittedEvents";
import PastEvents from "@/components/dashboard/cm_student/PastEvents";
import CommunityManagementActions from "@/components/dashboard/cm_student/CommunityManagementActions";

export default function CmStudentDashboard() {
  return (
    <div className="w-full min-h-screen bg-(--color-lumex-light) py-10">
      <div className="container mx-auto px-4 md:px-0">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-(--color-lumex-dark) border-l-4 border-(--color-lumex-accent) pl-4">
            Topluluk Yönetim Paneli
          </h1>
        </div>
        {/* İÇERİK ALANI */}
        <div className="container mx-auto px-4 md:px-0 max-w-6xl py-8">
          {/* 1. Özet İstatistik Kartları */}
          <InfoBox />

          {/* 2. Listeler */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <PendingMembers />
            <SubmittedEvents />
          </div>

          <PastEvents />

          <CommunityManagementActions />
        </div>
      </div>
    </div>
  );
}
