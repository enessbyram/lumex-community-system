import InfoBox from "@/components/dashboard/student/InfoBox";
import QuickActions from "@/components/dashboard/student/QuickActions";
import MyCommunities from "@/components/dashboard/student/MyCommunities";
import MyRequests from "@/components/dashboard/student/MyRequests";
import UpcomingEvents from "@/components/dashboard/student/UpcomingEvents";

export default function StudentDashboard() {
    return (
        <div className="w-full min-h-screen bg-(--color-lumex-light) py-10">
            <div className="container mx-auto px-4 md:px-0">
                
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-(--color-lumex-dark) border-l-4 border-(--color-lumex-accent) pl-4">
                        Öğrenci Paneli
                    </h1>
                </div>
                
                <InfoBox />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start mb-8">
                    <MyCommunities />
                    <MyRequests />
                </div>
                <div className="mb-8">
                    <UpcomingEvents />
                </div>

                <QuickActions />

            </div>
        </div>
    );
}