"use client";

import { Clock, MapPin } from "lucide-react";

interface AnnouncementsCardProps {
    title: string;
    date: string;
    time: string;
    location: string;
    onClick: () => void;
}

const AnnouncementsCard = ({ title, date, time, location, onClick }: AnnouncementsCardProps) => {
    const eventDate = new Date(date);
    
    const monthName = eventDate.toLocaleDateString('tr-TR', { month: 'short' }).toUpperCase().replace('.', '');
    const dayNumber = eventDate.getDate();
    const dayName = eventDate.toLocaleDateString('tr-TR', { weekday: 'long' });

    const formattedTime = time ? time.substring(0, 5) : "";

    return (
        <div 
            onClick={onClick}
            className="flex flex-row w-full h-32 border border-gray-200 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 items-center gap-4 p-4 cursor-pointer transform hover:-translate-y-1"
        >
            <div className="text-xl flex flex-col bg-(--color-lumex-accent) text-(--color-lumex-dark) rounded-lg items-center justify-center h-24 w-24 min-w-24 shadow-sm">
                <p className="text-sm font-bold opacity-90">{monthName}</p>
                <p className="text-3xl font-extrabold leading-none my-1">{dayNumber}</p>
                <p className="text-xs font-medium opacity-90">{dayName}</p>
            </div>
            
            <div className="text-(--color-lumex-dark) flex flex-col justify-between h-24 py-1 w-full overflow-hidden">
                <div>
                    <h3 className="font-bold text-lg leading-tight truncate" title={title}>
                        {title}
                    </h3>
                </div>
                
                <div className="flex flex-col gap-1 text-sm text-(--color-lumex-dark-muted) mt-auto">
                    <div className="flex items-center gap-2">
                        <Clock size={16} className="text-(--color-lumex-accent)" />
                        <span>{formattedTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-(--color-lumex-accent)" />
                        <span className="truncate max-w-60">{location}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementsCard;