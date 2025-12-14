// Section3.tsx
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registrasi Plugin GSAP
gsap.registerPlugin(ScrollTrigger);

const items = [
    { id: "1", img: "/fotoGrid/1.jpg", height: 800, width: 600 }, // Rasio 1.5
    { id: "2", img: "/fotoGrid/2.jpg", height: 900, width: 600 }, // Rasio 1.5
    { id: "3", img: "/fotoGrid/3.jpg", height: 700, width: 600 }, // Rasio 1.5
    { id: "4", img: "/fotoGrid/4.jpg", height: 650, width: 600 }, // Rasio 1.5
    { id: "5", img: "/fotoGrid/5.jpg", height: 1000, width: 600 }, // Rasio 1.5
    { id: "6", img: "/fotoGrid/6.jpg", height: 800, width: 600 }, // Rasio 1.5
    { id: "7", img: "/fotoGrid/7.jpg", height: 750, width: 600 }, // Rasio 1.25
    { id: "8", img: "/fotoGrid/8.jpg", height: 1000, width: 600 }, // Rasio 1.66
    { id: "9", img: "/fotoGrid/9.jpg", height: 800, width: 600 }, // Rasio 1.33
    { id: "10", img: "/fotoGrid/10.jpg", height: 700, width: 600 }, // Rasio 1.16
    { id: "11", img: "/fotoGrid/11.jpg", height: 700, width: 600 }, // Rasio 1.16
    { id: "12", img: "/fotoGrid/12.jpg", height: 700, width: 600 }, // Rasio 1.16
];

interface Item { id: string; img: string; height: number; width: number; }
interface GridItem extends Item { x: number; y: number; w: number; h: number; }

// --- HOOKS & UTILITIES (Untuk Responsive & Pengukuran) ---

const useMedia = (queries: string[], values: number[], defaultValue: number): number => {
    const get = () => {
        if (typeof window === 'undefined') return defaultValue;
        return values[queries.findIndex(q => matchMedia(q).matches)] ?? defaultValue;
    };
    const [value, setValue] = useState<number>(get);
    useEffect(() => {
        const handler = () => setValue(get);
        queries.forEach(q => matchMedia(q).addEventListener('change', handler));
        return () => queries.forEach(q => matchMedia(q).removeEventListener('change', handler));
    }, [queries]);
    return value;
};

const useMeasure = <T extends HTMLElement>() => {
    const ref = useRef<T | null>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });
    useLayoutEffect(() => {
        if (!ref.current) return;
        const ro = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            setSize({ width, height });
        });
        ro.observe(ref.current);
        return () => ro.disconnect();
    }, []);
    return [ref, size] as const;
};

export default function Section3() {
    
    // Konfigurasi Grid
    const isMobile = useMedia(['(max-width: 600px)'], [1], 0) === 1;
    const columns = useMedia(
        ['(min-width:1200px)', '(min-width:768px)', '(min-width:400px)'],
        [4, 3, 2], 
        2
    );
    const gap = isMobile ? 10 : 24; 
    
    // State dan Refs
    const [containerRef, { width }] = useMeasure<HTMLDivElement>();
    const [isReady, setIsReady] = useState(false);
    const sectionRef = useRef<HTMLElement>(null); 

    // Preload & State Ready
    useEffect(() => {
        // Logika preload disederhanakan karena menggunakan path lokal
        setIsReady(true);
    }, []);

    // Logika Masonry Grid (Menghitung posisi X, Y, W, H)
    const grid = useMemo<GridItem[]>(() => {
        if (!width) return [];
        
        const colHeights = new Array(columns).fill(0);
        const totalGaps = (columns - 1) * gap;
        const columnWidth = (width - totalGaps) / columns;
        
        return items.map(child => {
            const col = colHeights.indexOf(Math.min(...colHeights));
            const x = col * (columnWidth + gap);
            const y = colHeights[col];
            
            // Hitung tinggi berdasarkan Aspect Ratio
            const aspectRatio = child.height / child.width;
            const height = columnWidth * aspectRatio;

            colHeights[col] += height + gap;
            
            return { 
                ...child, 
                x, 
                y, 
                w: columnWidth, 
                h: height 
            };
        });
    }, [columns, width, gap]);

    // --- LOGIKA ANIMASI SCROLL SCRUBBING STAGGERED ---
    useLayoutEffect(() => {
        if (!isReady || grid.length === 0) return;

        ScrollTrigger.getAll().forEach(t => t.kill());

        const ctx = gsap.context(() => {
            
            // 1. Timeline utama yang dikontrol oleh ScrollTrigger
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current, // Kontainer grid adalah pemicu
                    start: "top bottom",          
                    end: "bottom center",         
                    scrub: true,                  // Scrubbing: Mengikat animasi ke progres scroll
                }
            });

            // 2. Loop dan Tambahkan animasi Fade-in ke Timeline
            grid.forEach((item, index) => { 
                const selector = `[data-key="${item.id}"]`;
                
                // Set posisi Grid (target) dan opacity awal 0
                gsap.set(selector, { 
                    x: item.x, 
                    y: item.y,
                    width: item.w, 
                    height: item.h,
                    opacity: 0,
                    scale: 0.95, // Sedikit zoom-in saat muncul
                });

                // Tambahkan animasi Fade-in ke Timeline
                tl.to(selector, 
                    {
                        opacity: 1, 
                        scale: 1, 
                        ease: "none",
                    },
                    index * 0.1 // Kunci Stagger: Jeda 0.1 detik antar item di Timeline
                );
            });

            // Update tinggi container (Penting agar scroll berfungsi)
            const maxContainerHeight = Math.max(...grid.map(i => i.y + i.h), 0);
            gsap.set(containerRef.current, { height: maxContainerHeight });
            
        }, sectionRef); 

        return () => ctx.revert(); 

    }, [grid, isReady]);

    // --- RENDER SECTION 3 ---
    return (
        <section 
            ref={sectionRef} 
            id="section3" 
            className="py-10 px-4 md:px-8 flex justify-center relative overflow-hidden" 
            style={{ 
                // Menggunakan Gradient dari FFFFE ke FFFFE (efek putih bersih)
                backgroundImage: 'linear-gradient(to bottom, #FFFFFE, #FFFFFE)', 
                backgroundColor: '#FFFFFE', // Fallback warna solid
            }}
        >
            {/* Halaman tidak memerlukan overlay karena background sudah putih/gradient */}

            <div className="w-full max-w-[1400px] relative z-10"> 
                <div 
                    ref={containerRef} 
                    className="relative w-full"
                    style={{ willChange: 'height' }} 
                >
                    {grid.map(item => (
                        <div
                            key={item.id}
                            data-key={item.id}
                            className="absolute overflow-hidden rounded-xl shadow-xl cursor-pointer"
                        >
                            <img 
                                src={item.img} // Menggunakan path lokal /fotoGrid/
                                alt={`Gallery Item ${item.id}`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}