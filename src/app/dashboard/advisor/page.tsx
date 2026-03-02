import InfoBox from "@/components/dashboard/advisor/InfoBox";
import PendingEvents from "@/components/dashboard/advisor/PendingEvents";
import ReviewedEvents from "@/components/dashboard/advisor/ReviewedEvents";

export default function AdvisorDashboard() {
    return (
        <div className="w-full min-h-screen bg-(--color-lumex-light) py-10">
            <div className="container mx-auto px-4 md:px-0 max-w-6xl">
                
                {/* Sayfa Başlığı */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-(--color-lumex-dark) border-l-4 border-(--color-lumex-accent) pl-4">
                        Akademik Danışman Paneli
                    </h1>
                </div>
                
                {/* Özet Kartları (Yeni Eklediğimiz Bileşen) */}
                <InfoBox />
                
                <PendingEvents />

                <ReviewedEvents />

            </div>
        </div>
    );
}