"use client";

import InfoBox from "@/components/dashboard/admin/InfoBox";
import PendingEvents from "@/components/dashboard/admin/PendingEvents"; // YENİ EKLENDİ
import PendingDocuments from "@/components/dashboard/admin/PendingDocuments"; // YENİ EKLENDİ
import CommunityList from "@/components/dashboard/admin/CommunityList";
import SystemManagementActions from "@/components/dashboard/admin/SystemManagementActions";

export default function AdminDashboard() {
    return (
        <div className="w-full min-h-screen bg-(--color-lumex-light) py-10">
            <div className="container mx-auto px-4 md:px-0 max-w-7xl">
                
                {/* Sayfa Başlığı */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-red-700 border-l-4 border-red-700 pl-4">
                        SKS / Yönetim Paneli
                    </h1>
                </div>
                
                {/* 1. Özet İstatistik Kartları */}
                <InfoBox />
                
                {/* 2. Onay Listeleri (İki Kolon) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-10">
                    <PendingEvents />
                    <PendingDocuments />
                </div>

                <CommunityList />

                <SystemManagementActions />
            </div>
        </div>
    );
}