"use client";

import { useState } from "react";
import { Eye, CheckCircle2, XCircle, X, Download, FileText, FileSearch, MessageSquareWarning } from "lucide-react";

const mockDocuments = [
    {
        id: 1,
        title: "Yıllık Faaliyet Raporu",
        community: "Spor Topluluğu",
        sender: "Kerem Aksoy",
        date: "24.10.2025",
        fileName: "Yillik_Faaliyet_Raporu_Spor.pdf",
        fileSize: "2.4 MB"
    },
    {
        id: 2,
        title: "Bütçe Talebi",
        community: "Müzik Topluluğu",
        sender: "Can Yılmaz",
        date: "23.10.2025",
        fileName: "2025_Butce_Talebi.pdf",
        fileSize: "1.1 MB"
    }
];

const PendingDocuments = () => {
    const [documents, setDocuments] = useState(mockDocuments);
    const [selectedDoc, setSelectedDoc] = useState<any>(null);
    const [rejectingId, setRejectingId] = useState<number | null>(null);
    const [rejectReason, setRejectReason] = useState("");

    const handleApprove = (id: number) => {
        if(confirm("Bu belgeyi onaylıyor musunuz?")) {
            setDocuments(documents.filter(d => d.id !== id));
            setSelectedDoc(null);
            alert("Belge onaylandı!");
        }
    };

    const submitReject = () => {
        if (!rejectReason.trim()) { alert("Lütfen red sebebi girin!"); return; }
        setDocuments(documents.filter(d => d.id !== rejectingId));
        setRejectingId(null);
        setRejectReason("");
        setSelectedDoc(null);
        alert("Belge reddedildi.");
    };

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
            
            <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
                <h2 className="text-base md:text-lg font-bold text-(--color-lumex-dark)">Bekleyen Belge Onayları</h2>
                <span className="bg-purple-500 text-white text-[10px] md:text-xs font-bold px-2 md:px-2.5 py-0.5 md:py-1 rounded-full">{documents.length}</span>
            </div>

            <div className="p-3 md:p-4 overflow-y-auto max-h-96 md:max-h-150 flex-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200">
                {documents.length > 0 ? (
                    <div className="flex flex-col gap-3 md:gap-4">
                        {documents.map((doc) => (
                            <div key={doc.id} className="bg-gray-50/50 border border-gray-100 rounded-lg md:rounded-xl p-4 md:p-5 hover:shadow-md transition-all">
                                <h3 className="font-bold text-(--color-lumex-dark) text-sm md:text-base wrap-break-word">{doc.title}</h3>
                                <p className="text-xs md:text-sm font-medium text-gray-500 mb-1.5 md:mb-2 truncate">{doc.community}</p>
                                <p className="text-[10px] md:text-xs text-gray-400 mb-3 md:mb-4 truncate">Gönderen: {doc.sender} • {doc.date}</p>
                                
                                <div className="flex gap-2">
                                    <button onClick={() => setSelectedDoc(doc)} className="flex-1 flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-(--color-lumex-dark) rounded-lg text-xs md:text-sm font-semibold shadow-sm cursor-pointer transition-colors">
                                        <Eye size={14} className="md:w-4 md:h-4"/> Görüntüle
                                    </button>
                                    <button onClick={() => handleApprove(doc.id)} className="w-9 h-9 md:w-10 md:h-10 shrink-0 flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg shadow-sm cursor-pointer transition-colors">
                                        <CheckCircle2 size={16} className="md:w-4.5 md:h-4.5"/>
                                    </button>
                                    <button onClick={() => setRejectingId(doc.id)} className="w-9 h-9 md:w-10 md:h-10 shrink-0 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm cursor-pointer transition-colors">
                                        <XCircle size={16} className="md:w-4.5 md:h-4.5"/>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-32 md:h-40 text-gray-400 text-xs md:text-sm">Onay bekleyen belge bulunmuyor.</div>
                )}
            </div>

            {selectedDoc && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 md:p-4" onClick={() => setSelectedDoc(null)}>
                    <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl w-full max-w-4xl relative animate-in zoom-in-95 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                        
                        <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-start shrink-0">
                            <div>
                                <h2 className="text-lg md:text-xl font-bold text-(--color-lumex-dark) pr-8">{selectedDoc.title}</h2>
                                <p className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">Belge önizlemesi ve detayları</p>
                            </div>
                            <button onClick={() => setSelectedDoc(null)} className="text-gray-400 hover:text-gray-600 bg-gray-50 p-1.5 md:p-2 rounded-full cursor-pointer transition-colors"><X size={18} className="md:w-5 md:h-5"/></button>
                        </div>

                        <div className="p-4 md:p-6 space-y-4 md:space-y-6 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200">
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                                <div className="bg-gray-50 border border-gray-100 p-3 md:p-4 rounded-lg md:rounded-xl">
                                    <p className="text-[10px] md:text-xs text-gray-500 font-semibold mb-0.5 md:mb-1">Gönderen</p>
                                    <p className="font-bold text-(--color-lumex-dark) text-xs md:text-sm truncate">{selectedDoc.sender}</p>
                                </div>
                                <div className="bg-gray-50 border border-gray-100 p-3 md:p-4 rounded-lg md:rounded-xl">
                                    <p className="text-[10px] md:text-xs text-gray-500 font-semibold mb-0.5 md:mb-1">Topluluk</p>
                                    <p className="font-bold text-(--color-lumex-dark) text-xs md:text-sm truncate">{selectedDoc.community}</p>
                                </div>
                                <div className="bg-gray-50 border border-gray-100 p-3 md:p-4 rounded-lg md:rounded-xl">
                                    <p className="text-[10px] md:text-xs text-gray-500 font-semibold mb-0.5 md:mb-1">Tarih</p>
                                    <p className="font-bold text-(--color-lumex-dark) text-xs md:text-sm truncate">{selectedDoc.date}</p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-white border border-gray-200 p-3 md:p-4 rounded-lg md:rounded-xl shadow-sm gap-3">
                                <div className="flex items-center gap-2 md:gap-3 min-w-0">
                                    <FileText size={20} className="text-(--color-lumex-purple-main) shrink-0 md:w-6 md:h-6"/>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-xs md:text-sm text-(--color-lumex-dark) truncate">{selectedDoc.fileName}</p>
                                        <p className="text-[10px] md:text-xs text-gray-500">PDF • {selectedDoc.fileSize}</p>
                                    </div>
                                </div>
                                <button className="flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 border border-gray-200 rounded-lg text-xs md:text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer shrink-0">
                                    <Download size={14} className="md:w-4 md:h-4"/> İndir
                                </button>
                            </div>

                            <div className="w-full h-48 md:h-64 bg-gray-50 border border-dashed border-gray-300 rounded-lg md:rounded-xl flex flex-col items-center justify-center text-center p-4 md:p-6 shrink-0">
                                <FileSearch size={36} className="text-[#0a192f] mb-3 md:w-12 md:h-12 md:mb-4"/>
                                <h3 className="font-bold text-base md:text-lg text-[#0a192f] mb-1.5 md:mb-2">Belge Önizlemesi</h3>
                                <p className="text-xs md:text-sm text-gray-500 max-w-md">Gerçek bir uygulamada burada PDF önizlemesi gösterilecektir. Topluluklar PDF, Word veya Excel formatında belgelerini yükleyebilir.</p>
                            </div>

                        </div>

                        <div className="p-4 md:p-6 border-t border-gray-100 flex flex-col sm:flex-row gap-2 md:gap-4 shrink-0 bg-gray-50/50 rounded-b-xl md:rounded-b-2xl">
                            <button onClick={() => setRejectingId(selectedDoc.id)} className="flex-1 py-2.5 md:py-3.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg md:rounded-xl flex items-center justify-center gap-1.5 md:gap-2 shadow-sm md:shadow-md cursor-pointer transition-colors text-xs md:text-sm order-last sm:order-first">
                                <XCircle size={16} className="md:w-4.5 md:h-4.5"/> Belgeyi Reddet
                            </button>
                            <button onClick={() => handleApprove(selectedDoc.id)} className="flex-1 py-2.5 md:py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg md:rounded-xl flex items-center justify-center gap-1.5 md:gap-2 shadow-sm md:shadow-md cursor-pointer transition-colors text-xs md:text-sm">
                                <CheckCircle2 size={16} className="md:w-4.5 md:h-4.5"/> Belgeyi Onayla
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {rejectingId && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60 flex items-center justify-center p-3 md:p-4" onClick={() => setRejectingId(null)}>
                    <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl w-full max-w-md p-4 md:p-6 relative animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                        <h3 className="text-base md:text-lg font-bold text-red-700 flex items-center gap-1.5 md:gap-2 mb-3 md:mb-4"><MessageSquareWarning size={18} className="md:w-5 md:h-5"/> Reddetme Sebebi</h3>
                        <p className="text-[10px] md:text-xs text-gray-500 mb-1.5 md:mb-2">Belge reddedilecektir. Lütfen sebep girin.</p>
                        <textarea rows={4} value={rejectReason} onChange={e => setRejectReason(e.target.value)} className="w-full border border-gray-300 rounded-lg md:rounded-xl p-3 text-xs md:text-sm focus:outline-none focus:border-red-500 resize-none mb-3 md:mb-4"></textarea>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => {setRejectingId(null); setRejectReason("");}} className="px-3 md:px-4 py-2 bg-gray-100 text-gray-700 rounded-md md:rounded-lg text-xs md:text-sm font-semibold cursor-pointer hover:bg-gray-200 transition-colors">İptal</button>
                            <button onClick={submitReject} disabled={!rejectReason.trim()} className="px-3 md:px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md md:rounded-lg text-xs md:text-sm font-semibold cursor-pointer disabled:opacity-50 transition-colors">Reddet</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PendingDocuments;