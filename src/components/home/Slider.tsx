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
                console.error("Slider fetch error:", error);
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
        <div className="w-full bg-(--color-lumex-light) flex items-center justify-center py-8">
            <div className="container relative w-full h-87.5 md:h-112.5 rounded-2xl overflow-hidden shadow-2xl group">
                
                <Image 
                    src={slides[current].image_url} 
                    alt={slides[current].title || "Slider Image"} 
                    fill
                    priority 
                    className="object-cover transition-opacity duration-700 ease-in-out z-0" 
                />
                
                <div className="absolute inset-0 bg-linear-to-t from-(--color-lumex-dark)/90 via-(--color-lumex-dark)/30 to-transparent z-10 transition-all duration-500"></div>
                
                <div className="absolute flex flex-col text-(--color-lumex-light) bottom-8 md:bottom-12 left-8 md:left-16 z-20">
                    <h1 className="font-bold text-3xl md:text-5xl mb-2 drop-shadow-lg">
                        {slides[current].title}
                    </h1>
                    <h3 className="font-medium text-base md:text-xl text-(--color-lumex-light)/90 drop-shadow-md">
                        {slides[current].subtitle}
                    </h3>
                </div>

                {slides.length > 1 && (
                    <>
                        <button 
                            onClick={prev} 
                            className="absolute top-1/2 -translate-y-1/2 left-4 text-(--color-lumex-light) z-30 bg-(--color-lumex-dark)/40 p-3 rounded-full opacity-0 group-hover:opacity-100 hover:bg-(--color-lumex-accent) hover:text-(--color-lumex-dark) transition-all cursor-pointer shadow-lg backdrop-blur-sm" 
                        >
                            <ChevronLeft size={24} />
                        </button>

                        <button 
                            onClick={next} 
                            className="absolute top-1/2 -translate-y-1/2 right-4 text-(--color-lumex-light) z-30 bg-(--color-lumex-dark)/40 p-3 rounded-full opacity-0 group-hover:opacity-100 hover:bg-(--color-lumex-accent) hover:text-(--color-lumex-dark) transition-all cursor-pointer shadow-lg backdrop-blur-sm" 
                        >
                            <ChevronRight size={24} />
                        </button>

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-30">
                            {slides.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => goTo(i)}
                                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer shadow-sm ${
                                        i === current 
                                        ? "bg-(--color-lumex-accent) w-8" 
                                        : "bg-(--color-lumex-light)/50 w-2 hover:bg-(--color-lumex-light)/80"
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