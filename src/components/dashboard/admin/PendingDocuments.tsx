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
            
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-(--color-lumex-dark)">Bekleyen Belge Onayları</h2>
                <span className="bg-purple-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">{documents.length}</span>
            </div>

            <div className="p-4 overflow-y-auto max-h-150 flex-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200">
                {documents.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {documents.map((doc) => (
                            <div key={doc.id} className="bg-gray-50/50 border border-gray-100 rounded-xl p-5 hover:shadow-md transition-all">
                                <h3 className="font-bold text-(--color-lumex-dark) text-base">{doc.title}</h3>
                                <p className="text-sm font-medium text-gray-500 mb-2">{doc.community}</p>
                                <p className="text-xs text-gray-400 mb-4">Gönderen: {doc.sender} • {doc.date}</p>
                                
                                <div className="flex gap-2">
                                    <button onClick={() => setSelectedDoc(doc)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-(--color-lumex-dark) rounded-lg text-sm font-semibold shadow-sm cursor-pointer transition-colors">
                                        <Eye size={16}/> Görüntüle
                                    </button>
                                    <button onClick={() => handleApprove(doc.id)} className="w-10 h-10 shrink-0 flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg shadow-sm cursor-pointer transition-colors">
                                        <CheckCircle2 size={18}/>
                                    </button>
                                    <button onClick={() => setRejectingId(doc.id)} className="w-10 h-10 shrink-0 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm cursor-pointer transition-colors">
                                        <XCircle size={18}/>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-40 text-gray-400 text-sm">Onay bekleyen belge bulunmuyor.</div>
                )}
            </div>

            {/* BELGE GÖRÜNTÜLEME MODALI */}
            {selectedDoc && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedDoc(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl relative animate-in zoom-in-95 flex flex-col" onClick={e => e.stopPropagation()}>
                        
                        <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold text-(--color-lumex-dark)">{selectedDoc.title}</h2>
                                <p className="text-sm text-gray-500 mt-1">Belge önizlemesi ve detayları</p>
                            </div>
                            <button onClick={() => setSelectedDoc(null)} className="text-gray-400 hover:text-gray-600 bg-gray-50 p-2 rounded-full"><X size={20}/></button>
                        </div>

                        <div className="p-6 space-y-6">
                            
                            {/* Üst Bilgi Kartları */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl">
                                    <p className="text-xs text-gray-500 font-semibold mb-1">Gönderen</p>
                                    <p className="font-bold text-(--color-lumex-dark)">{selectedDoc.sender}</p>
                                </div>
                                <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl">
                                    <p className="text-xs text-gray-500 font-semibold mb-1">Topluluk</p>
                                    <p className="font-bold text-(--color-lumex-dark)">{selectedDoc.community}</p>
                                </div>
                                <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl">
                                    <p className="text-xs text-gray-500 font-semibold mb-1">Tarih</p>
                                    <p className="font-bold text-(--color-lumex-dark)">{selectedDoc.date}</p>
                                </div>
                            </div>

                            {/* İndirme Satırı */}
                            <div className="flex items-center justify-between bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                                <div className="flex items-center gap-3">
                                    <FileText size={24} className="text-(--color-lumex-purple-main)"/>
                                    <div>
                                        <p className="font-semibold text-sm text-(--color-lumex-dark)">{selectedDoc.fileName}</p>
                                        <p className="text-xs text-gray-500">PDF • {selectedDoc.fileSize}</p>
                                    </div>
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer">
                                    <Download size={16}/> İndir
                                </button>
                            </div>

                            {/* PDF Önizleme Alanı */}
                            <div className="w-full h-64 bg-gray-50 border border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-center p-6">
                                <FileSearch size={48} className="text-[#0a192f] mb-4"/>
                                <h3 className="font-bold text-lg text-[#0a192f] mb-2">Belge Önizlemesi</h3>
                                <p className="text-sm text-gray-500 max-w-md">Gerçek bir uygulamada burada PDF önizlemesi gösterilecektir. Topluluklar PDF, Word veya Excel formatında belgelerini yükleyebilir.</p>
                            </div>

                        </div>

                        <div className="p-6 border-t border-gray-100 flex gap-4">
                            <button onClick={() => handleApprove(selectedDoc.id)} className="flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors">
                                <CheckCircle2 size={18}/> Belgeyi Onayla
                            </button>
                            <button onClick={() => setRejectingId(selectedDoc.id)} className="flex-1 py-3.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors">
                                <XCircle size={18}/> Belgeyi Reddet
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {/* ZORUNLU RED SEBEBİ MODALI (Aynı yapı) */}
            {rejectingId && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60 flex items-center justify-center p-4" onClick={() => setRejectingId(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-red-700 flex items-center gap-2 mb-4"><MessageSquareWarning/> Reddetme Sebebi</h3>
                        <p className="text-xs text-gray-500 mb-2">Belge reddedilecektir. Lütfen sebep girin.</p>
                        <textarea rows={4} value={rejectReason} onChange={e => setRejectReason(e.target.value)} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-red-500 resize-none mb-4"></textarea>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => {setRejectingId(null); setRejectReason("");}} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold cursor-pointer">İptal</button>
                            <button onClick={submitReject} disabled={!rejectReason.trim()} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold cursor-pointer disabled:opacity-50">Reddet</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PendingDocuments;