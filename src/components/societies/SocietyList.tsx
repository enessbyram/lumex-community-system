"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import SocietyListCard from "./SocietyListCard";

interface Community {
  community_id: number;
  community_name: string;
  type_id: number;
  description: string;
  logo?: string;
  status: string;
  member_count: number;
  president_name: string;
  advisor_name: string;
}

export default function SocietyList() {
  const [activeTab, setActiveTab] = useState<"mesleki" | "sosyal">("mesleki");
  const [communities, setCommunities] = useState<Community[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/communities")
      .then((res) => res.json())
      .then((data) => {
        const actualData = data.success ? data.data : data;
        if (Array.isArray(actualData)) {
          setCommunities(actualData);
        }
      })
      .catch((err) => console.error("Fetch Hatası:", err));
  }, []);

  const filtered = communities.filter((c) => {
    const matchesTab =
      activeTab === "mesleki" ? c.type_id === 1 : c.type_id === 2;

    const matchesSearch = (c.community_name || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="bg-(--color-lumex-light) w-full min-h-screen py-6 md:py-10">
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 border-l-4 border-(--color-lumex-accent) pl-3 md:pl-4">
          Topluluklar
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6">
          <button
            onClick={() => setActiveTab("mesleki")}
            className={`px-4 md:px-6 py-2.5 md:py-2 rounded-lg font-semibold transition shadow-sm cursor-pointer text-sm md:text-base w-full sm:w-auto ${activeTab === "mesleki" ? "bg-(--color-lumex-purple-main) text-white" : "bg-white text-gray-600 border"}`}
          >
            Mesleki Topluluklar
          </button>
          <button
            onClick={() => setActiveTab("sosyal")}
            className={`px-4 md:px-6 py-2.5 md:py-2 rounded-lg font-semibold transition shadow-sm cursor-pointer text-sm md:text-base w-full sm:w-auto ${activeTab === "sosyal" ? "bg-(--color-lumex-purple-main) text-white" : "bg-white text-gray-600 border"}`}
          >
            Sosyal Topluluklar
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-4 md:p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4 mb-4">
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Topluluk ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border rounded-lg px-4 py-2.5 md:py-2 pl-10 focus:ring-2 focus:ring-(--color-lumex-purple-main) outline-none text-sm md:text-base"
              />
              <Search
                size={18}
                className="absolute left-3 top-3 md:top-2.5 text-gray-400"
              />
            </div>
            <p className="text-xs md:text-sm font-medium text-gray-500 w-full md:w-auto text-left md:text-right">
              Toplam{" "}
              <span className="text-(--color-lumex-purple-main) font-bold text-sm md:text-base">
                {filtered.length}
              </span>{" "}
              topluluk listeleniyor.
            </p>
          </div>

          <div className="flex flex-col gap-4 max-h-[60vh] md:max-h-150 overflow-y-auto pr-1 md:pr-2 [&::-webkit-scrollbar]:w-1.5 md:[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-200">
            {filtered.map((item) => (
              <SocietyListCard
                key={item.community_id}
                id={item.community_id}
                name={item.community_name}
                description={item.description}
                memberCount={item.member_count ?? 0}
                president={item.president_name}
                advisor={item.advisor_name}
                logo={item.logo}
              />
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-10 md:py-20 text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed text-sm md:text-base">
                Aranan kriterlerde topluluk bulunamadı.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}