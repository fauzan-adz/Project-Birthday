// Section3.tsx
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registrasi Plugin GSAP
gsap.registerPlugin(ScrollTrigger);

// --- DATA IKON MELAYANG KHUSUS SECTION 3 ---
const floatingObjects = [

    { x: 10, y: 200, speed: 0.2, img: "/icon-1.png", size: 150, selector: ".floating-icon-1" },
    { x: 80, y: 400, speed: 0.35, img: "/particle2.png", size: 120, selector: ".floating-icon-2" },
    { x: -15, y: 900, speed: 0.25, img: "/particle3.png", size: 180, selector: ".floating-icon-3" },
    { x: 50, y: 1400, speed: 0.4, img: "/particle1.png", size: 160, selector: ".floating-icon-4" },
];

const items = [
    { id: "1", img: "/fotoGrid/1.jpg", height: 800, width: 600 }, 
    { id: "2", img: "/fotoGrid/2.jpg", height: 900, width: 600 }, 
    { id: "3", img: "/fotoGrid/3.jpg", height: 700, width: 600 }, 
    { id: "4", img: "/fotoGrid/4.jpg", height: 650, width: 600 }, 
    { id: "5", img: "/fotoGrid/5.jpg", height: 1000, width: 600 }, 
    { id: "6", img: "/fotoGrid/6.jpg", height: 800, width: 600 }, 
    { id: "7", img: "/fotoGrid/7.jpg", height: 750, width: 600 }, 
    { id: "8", img: "/fotoGrid/8.jpg", height: 1000, width: 600 }, 
    { id: "9", img: "/fotoGrid/9.jpg", height: 800, width: 600 }, 
    { id: "10", img: "/fotoGrid/10.jpg", height: 700, width: 600 }, 
    { id: "11", img: "/fotoGrid/11.jpg", height: 700, width: 600 }, 
    { id: "12", img: "/fotoGrid/12.jpg", height: 700, width: 600 }, 
];

interface Item { id: string; img: string; height: number; width: number; }
interface GridItem extends Item { x: number; y: number; w: number; h: number; }

// --- HOOKS & UTILITIES (useMedia & useMeasure tetap sama) ---
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
// --- END HOOKS & UTILITIES ---


export default function Section3() {
    // ... (Konfigurasi Grid dan useMemo Grid tetap sama) ...
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
    const floatingWrapperRef = useRef<HTMLDivElement>(null); // Ref untuk wrapper ikon melayang

    useEffect(() => { setIsReady(true); }, []);

    const grid = useMemo<GridItem[]>(() => {
        if (!width) return [];
        
        const colHeights = new Array(columns).fill(0);
        const totalGaps = (columns - 1) * gap;
        const columnWidth = (width - totalGaps) / columns;
        
        return items.map(child => {
            const col = colHeights.indexOf(Math.min(...colHeights));
            const x = col * (columnWidth + gap);
            const y = colHeights[col];
            
            const aspectRatio = child.height / child.width;
            const height = columnWidth * aspectRatio;

            colHeights[col] += height + gap;
            
            return { ...child, x, y, w: columnWidth, h: height };
        });
    }, [columns, width, gap]);

    // --- LOGIKA ANIMASI GSAP DENGAN PARALLAX IKON ---
    useLayoutEffect(() => {
        if (!isReady || grid.length === 0) return;

        ScrollTrigger.getAll().forEach(t => t.kill());

        const ctx = gsap.context(() => {
            
            // 1. Timeline untuk Grid (Fade-in staggered) - (Logika tetap sama)
            const tlGrid = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top bottom", 
                    end: "bottom center",
                    scrub: true,
                }
            });

            grid.forEach((item, index) => { 
                const selector = `[data-key="${item.id}"]`;
                gsap.set(selector, { x: item.x, y: item.y, width: item.w, height: item.h, opacity: 0, scale: 0.95 });
                tlGrid.to(selector, { opacity: 1, scale: 1, ease: "none",}, index * 0.1);
            });

            // 2. Timeline Parallax Ikon (Baru/Diperbaiki)
            floatingObjects.forEach((obj) => {
                // Selektor target ikon
                const targetIcon = sectionRef.current?.querySelector(obj.selector);
                
                if (targetIcon) {
                    // Set posisi awal (menggunakan 'top' dan 'left' CSS)
                    gsap.set(targetIcon, { 
                        position: "absolute",
                        top: obj.y, 
                        left: `${obj.x}vw`,
                        zIndex: 1,
                    });

                    // Animasikan pergerakan vertikal (Parallax) saat Section 3 di-scroll
                    gsap.to(targetIcon, {
                        y: -obj.speed * 1000, // Misal, geser 1000px ke atas dengan speed yang ditentukan
                        ease: "none",
                        scrollTrigger: {
                            trigger: sectionRef.current, // Parallax terikat pada Section 3
                            start: "top bottom",        // Mulai saat section masuk dari bawah
                            end: "bottom top",          // Berakhir saat section keluar ke atas
                            scrub: obj.speed,           // Gerakan diikat ke scroll
                        }
                    });
                }
            });

            // Update tinggi container
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
            // Pastikan overflow-x-hidden untuk mencegah scroll horizontal
            className="py-10 px-4 md:px-8 flex justify-center relative overflow-x-hidden" 
            style={{ 
                backgroundImage: 'linear-gradient(to bottom, #FFFFFE, #FFFFFE)', 
                backgroundColor: '#FFFFFE', 
            }}
        >
            
            {/* WRAPPER IKON MELAYANG */}
            <div 
                ref={floatingWrapperRef}
                className="absolute inset-0 pointer-events-none z-30"
            >
                {floatingObjects.map((obj, i) => (
                    <img
                        key={i}
                        src={obj.img}
                        alt={`Floating Icon ${i + 1}`}
                        className={`floating-icon-${i+1}`} // Tambahkan class selector untuk GSAP
                        style={{
                            // Dikelola oleh GSAP: position: "absolute", top/left/transform
                            // Kita set ukuran dan zIndex di sini
                            width: obj.size,
                            height: obj.size,
                            zIndex: 1, 
                            position: "absolute", // Penting: Tetapkan position absolute sebagai fallback/dasar
                            opacity: 0.8, // Sedikit transparan
                        }}
                    />
                ))}
            </div>

            <div className="w-full max-w-[1400px] relative z-20"> 
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
                                src={item.img} 
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