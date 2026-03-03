"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
    id: number;
    image_url: string;
    title: string;
    subtitle: string;
    button_link?: string;
}

const Slider = () => {
    const [slides, setSlides] = useState<Slide[]>([]);
    const [current, setCurrent] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const fetchSliders = async () => {
            try {
                const res = await fetch('/api/sliders');
                const result = await res.json();
                
                if (result.success && result.data.length > 0) {
                    setSlides(result.data);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchSliders();
    }, []);

    const resetTimer = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (slides.length > 0) {
            intervalRef.current = setInterval(() => {
                setCurrent((prev) => (prev + 1) % slides.length);
            }, 15000);
        }
    };

    const next = () => {
        setCurrent((prev) => (prev + 1) % slides.length);
        resetTimer();
    };

    const prev = () => {
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
        resetTimer();
    };

    const goTo = (index: number) => {
        setCurrent(index);
        resetTimer();
    };

    useEffect(() => {
        if (slides.length > 0) {
            resetTimer();
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [slides]);

    if (!slides || slides.length === 0) return null;

    return (
        <div className="w-full bg-(--color-lumex-light) flex items-center justify-center py-4 md:py-8 px-4 md:px-6 lg:px-0">
            <div className="container relative w-full h-75 sm:h-100 md:h-112.5 lg:h-112.5 rounded-xl md:rounded-2xl overflow-hidden shadow-xl md:shadow-2xl group">
                
                <Image 
                    src={slides[current].image_url} 
                    alt={slides[current].title || "Slider Image"} 
                    fill
                    priority 
                    className="object-cover transition-opacity duration-700 ease-in-out z-0" 
                />
                
                <div className="absolute inset-0 bg-linear-to-t from-(--color-lumex-dark)/90 via-(--color-lumex-dark)/30 to-transparent z-10 transition-all duration-500"></div>
                
                <div className="absolute flex flex-col text-(--color-lumex-light) bottom-6 md:bottom-12 left-4 right-4 sm:left-8 md:left-16 sm:right-8 md:right-16 z-20">
                    <h1 className="font-bold text-2xl sm:text-3xl md:text-5xl mb-1.5 md:mb-2 drop-shadow-lg line-clamp-2 md:line-clamp-none">
                        {slides[current].title}
                    </h1>
                    <h3 className="font-medium text-sm sm:text-base md:text-xl text-(--color-lumex-light)/90 drop-shadow-md line-clamp-2 md:line-clamp-none">
                        {slides[current].subtitle}
                    </h3>
                </div>

                {slides.length > 1 && (
                    <>
                        <button 
                            onClick={prev} 
                            className="absolute top-1/2 -translate-y-1/2 left-2 md:left-4 text-(--color-lumex-light) z-30 bg-(--color-lumex-dark)/40 p-2 md:p-3 rounded-full md:opacity-0 group-hover:opacity-100 hover:bg-(--color-lumex-accent) hover:text-(--color-lumex-dark) transition-all cursor-pointer shadow-lg backdrop-blur-sm" 
                        >
                            <ChevronLeft size={20} className="md:w-6 md:h-6" />
                        </button>

                        <button 
                            onClick={next} 
                            className="absolute top-1/2 -translate-y-1/2 right-2 md:right-4 text-(--color-lumex-light) z-30 bg-(--color-lumex-dark)/40 p-2 md:p-3 rounded-full md:opacity-0 group-hover:opacity-100 hover:bg-(--color-lumex-accent) hover:text-(--color-lumex-dark) transition-all cursor-pointer shadow-lg backdrop-blur-sm" 
                        >
                            <ChevronRight size={20} className="md:w-6 md:h-6" />
                        </button>

                        <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 z-30">
                            {slides.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => goTo(i)}
                                    className={`h-1.5 md:h-2 rounded-full transition-all duration-300 cursor-pointer shadow-sm ${
                                        i === current 
                                        ? "bg-(--color-lumex-accent) w-6 md:w-8" 
                                        : "bg-(--color-lumex-light)/50 w-1.5 md:w-2 hover:bg-(--color-lumex-light)/80"
                                    }`}
                                    aria-label={`Go to slide ${i + 1}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Slider;