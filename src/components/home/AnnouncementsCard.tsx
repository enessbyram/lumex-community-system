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
            className="flex flex-row w-full min-h-28 md:min-h-32 border border-gray-200 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 items-center gap-3 md:gap-4 p-3 md:p-4 cursor-pointer transform hover:-translate-y-1"
        >
            <div className="flex flex-col bg-(--color-lumex-accent) text-(--color-lumex-dark) rounded-lg items-center justify-center w-20 h-20 md:h-24 md:w-24 shrink-0 shadow-sm">
                <p className="text-[10px] md:text-sm font-bold opacity-90">{monthName}</p>
                <p className="text-2xl md:text-3xl font-extrabold leading-none my-0.5 md:my-1">{dayNumber}</p>
                <p className="text-[9px] md:text-xs font-medium opacity-90 truncate w-full text-center px-1">{dayName}</p>
            </div>
            
            <div className="text-(--color-lumex-dark) flex flex-col justify-between h-full py-0.5 md:py-1 w-full min-w-0">
                <div className="mb-2">
                    <h3 className="font-bold text-sm md:text-lg leading-snug md:leading-tight line-clamp-2 md:truncate" title={title}>
                        {title}
                    </h3>
                </div>
                
                <div className="flex flex-col gap-1 text-xs md:text-sm text-(--color-lumex-dark-muted) mt-auto">
                    <div className="flex items-center gap-1.5 md:gap-2">
                        <Clock size={14} className="text-(--color-lumex-accent) md:w-4 md:h-4 shrink-0" />
                        <span className="truncate">{formattedTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5 md:gap-2">
                        <MapPin size={14} className="text-(--color-lumex-accent) md:w-4 md:h-4 shrink-0" />
                        <span className="truncate w-full pr-2">{location}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementsCard;