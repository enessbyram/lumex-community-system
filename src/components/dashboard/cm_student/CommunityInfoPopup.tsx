"use client";

import { useState, useEffect, useRef } from "react";
import { X, Image as ImageIcon, Save } from "lucide-react";

interface CommunityInfoPopupProps {
  onClose: () => void;
}

const CommunityInfoPopup = ({ onClose }: CommunityInfoPopupProps) => {
  const [community, setCommunity] = useState<{
    id: number | null;
    name: string;
    description: string;
    logo: string;
  }>({ id: null, name: "Yükleniyor...", description: "", logo: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommunity = async () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userId =
          JSON.parse(storedUser).id || JSON.parse(storedUser).user_id;
        const res = await fetch(`/api/cm_student/community?userId=${userId}`);
        const data = await res.json();
        if (data.success) {
          setCommunity({
            id: data.data.id,
            name: data.data.community_name,
            description: data.data.description || "",
            logo: data.data.logo_url,
          });
        }
      }
      setLoading(false);
    };
    fetchCommunity();
  }, []);

  const handleLogoClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!community.id) return;
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("communityId", community.id.toString());
      formData.append("description", community.description);
      if (selectedFile) {
        formData.append("logo", selectedFile);
      }

      const res = await fetch("/api/cm_student/community", {
        method: "PUT",
        body: formData,
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
      alert("Sunucu hatası.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 md:p-4">
      <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl w-full max-w-lg relative flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden max-h-[95vh] md:max-h-[90vh]">
        
        <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-(--color-lumex-dark)">
              Topluluk Bilgileri
            </h3>
            <p className="text-[10px] md:text-sm text-(--color-lumex-dark-muted) mt-0.5 md:mt-1">
              Topluluğunuzun temel bilgilerini görüntüleyin ve güncelleyin.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-(--color-lumex-dark) transition-colors bg-white hover:bg-gray-100 p-1.5 md:p-2 rounded-full cursor-pointer shadow-sm shrink-0 ml-2"
          >
            <X size={18} className="md:w-5 md:h-5" />
          </button>
        </div>

        <div className="p-4 md:p-6 space-y-4 md:space-y-6 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 md:[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-200">
          <div className="flex flex-col items-center justify-center">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-(--color-lumex-purple-light)/10 text-(--color-lumex-purple-main) flex items-center justify-center rounded-xl md:rounded-2xl mb-2 md:mb-3 shadow-inner border-2 border-dashed border-(--color-lumex-purple-light)/30 overflow-hidden relative">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Yeni Logo Önizleme"
                  className="w-full h-full object-cover"
                />
              ) : community.logo ? (
                <img
                  src={`/uploads/logos/${community.logo}`}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon size={24} className="md:w-8 md:h-8" />
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <button
              onClick={handleLogoClick}
              className="text-xs md:text-sm font-semibold text-(--color-lumex-purple-main) hover:text-(--color-lumex-purple-deep) transition-colors cursor-pointer p-1"
            >
              Logoyu Değiştir
            </button>
          </div>

          <div className="space-y-3 md:space-y-4">
            <div>
              <label className="block text-[10px] md:text-xs font-semibold text-gray-500 mb-0.5 md:mb-1 ml-1">
                Topluluk Adı
              </label>
              <input
                type="text"
                value={community.name}
                readOnly
                className="w-full bg-gray-50 border border-gray-200 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-2.5 text-gray-600 cursor-not-allowed focus:outline-none text-xs md:text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] md:text-xs font-semibold text-gray-500 mb-0.5 md:mb-1 ml-1">
                Topluluk Açıklaması
              </label>
              <textarea
                rows={5}
                value={community.description}
                onChange={(e) =>
                  setCommunity({ ...community, description: e.target.value })
                }
                disabled={loading}
                className="w-full bg-white border border-gray-200 rounded-lg md:rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-(--color-lumex-dark) focus:outline-none focus:ring-1 md:focus:ring-2 focus:ring-(--color-lumex-purple-main) transition-all text-xs md:text-sm resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-2 md:gap-3 shrink-0 rounded-b-xl md:rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 md:px-5 py-2 md:py-2.5 bg-white border border-gray-200 text-gray-600 font-semibold rounded-lg md:rounded-xl hover:bg-gray-50 transition-colors text-xs md:text-sm cursor-pointer order-last sm:order-first"
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="w-full sm:w-auto px-4 md:px-5 py-2 md:py-2.5 bg-[#0a192f] text-white font-semibold rounded-lg md:rounded-xl hover:bg-[#112240] transition-colors flex items-center justify-center gap-1.5 md:gap-2 text-xs md:text-sm shadow-md cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              "Kaydediliyor..."
            ) : (
              <>
                <Save size={14} className="md:w-4 md:h-4" /> Değişiklikleri Kaydet
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityInfoPopup;