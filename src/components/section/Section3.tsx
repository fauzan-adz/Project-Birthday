// Section3.tsx
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';

// --- DATA ITEM (MODIFIED: Menghapus ?grayscale) ---
const items = [
    { id: "1", img: "https://picsum.photos/id/1015/600/900", url: "https://example.com/one", height: 900 },
    { id: "2", img: "https://picsum.photos/id/1011/600/750", url: "https://example.com/two", height: 750 },
    { id: "3", img: "https://picsum.photos/id/1020/600/800", url: "https://example.com/three", height: 800 },
    { id: "4", img: "https://picsum.photos/id/1023/600/1000", url: "https://example.com/four", height: 1000 },
    { id: "5", img: "https://picsum.photos/id/1025/600/700", url: "https://example.com/five", height: 700 },
    { id: "6", img: "https://picsum.photos/id/1031/600/1100", url: "https://example.com/six", height: 1100 },
    { id: "7", img: "https://picsum.photos/id/1039/600/700", url: "https://example.com/seven", height: 700 },
    { id: "8", img: "https://picsum.photos/id/1041/600/850", url: "https://example.com/eight", height: 850 },
    { id: "9", img: "https://picsum.photos/id/1050/600/950", url: "https://example.com/nine", height: 950 },
    { id: "10", img: "https://picsum.photos/id/1058/600/700", url: "https://example.com/ten", height: 700 },
];

// --- INTERFACES & TIPE ---

interface Item { id: string; img: string; height: number; url: string; }
interface GridItem extends Item { x: number; y: number; w: number; h: number; }

// --- HOOKS & UTILITIES ---

const useMedia = (queries: string[], values: number[], defaultValue: number): number => {
    const get = () => values[queries.findIndex(q => matchMedia(q).matches)] ?? defaultValue;
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

const preloadImages = async (urls: string[]): Promise<void> => {
    await Promise.all(
        urls.map(
            src =>
                new Promise<void>(resolve => {
                    const img = new Image();
                    img.src = src;
                    img.onload = img.onerror = () => resolve();
                })
        )
    );
};

export default function Section3() {
    
    // --- KONFIGURASI MASONRY ---
    const ease = 'power3.out';
    const duration = 0.6;
    const stagger = 0.05;
    const scaleOnHover = true;
    const hoverScale = 0.95;
    const blurToFocus = true;
    const colorShiftOnHover = false;
    
    // --- HOOKS & STATE ---
    const columns = useMedia(
        ['(min-width:1500px)', '(min-width:1000px)', '(min-width:600px)', '(min-width:400px)'],
        [5, 4, 3, 2],
        1
    );

    const [containerRef, { width }] = useMeasure<HTMLDivElement>();
    const [imagesReady, setImagesReady] = useState(false);
    const hasMounted = useRef(false);
    
    useEffect(() => {
        // Memuat URL gambar yang sudah berwarna
        preloadImages(items.map(i => i.img)).then(() => setImagesReady(true));
    }, [items]);

    // Logika Utama Masonry Grid
    const grid = useMemo<GridItem[]>(() => {
        if (!width) return [];
        const colHeights = new Array(columns).fill(0);
        const gap = 16;
        const totalGaps = (columns - 1) * gap;
        const columnWidth = (width - totalGaps) / columns;
        
        const heightDivider = columns <= 2 ? 2.5 : 2; 

        return items.map(child => {
            const col = colHeights.indexOf(Math.min(...colHeights));
            const x = col * (columnWidth + gap);
            const height = child.height / heightDivider; 
            const y = colHeights[col];

            colHeights[col] += height + gap;
            
            return { ...child, x, y, w: columnWidth, h: height };
        });
    }, [columns, items, width]);

    useLayoutEffect(() => {
        if (!imagesReady) return;

        grid.forEach((item, index) => {
            const selector = `[data-key="${item.id}"]`;
            const animProps = { x: item.x, y: item.y, width: item.w, height: item.h };

            if (!hasMounted.current) {
                // Animasi Awal: Fade-in
                gsap.fromTo(
                    selector,
                    { opacity: 0, ...animProps, ...(blurToFocus && { filter: 'blur(10px)' }) },
                    { opacity: 1, ...animProps, ...(blurToFocus && { filter: 'blur(0px)' }), duration: 0.8, ease: 'power3.out', delay: index * stagger }
                );
            } else {
                // Animasi Update/Resize
                gsap.to(selector, { ...animProps, duration, ease, overwrite: 'auto' });
            }
        });

        // Mengatur tinggi container
        const maxContainerHeight = Math.max(...grid.map(i => i.y + i.h), 0);
        gsap.to(containerRef.current, { height: maxContainerHeight, duration, ease, overwrite: 'auto' });
        gsap.set(containerRef.current, { width: '100%' }); 

        hasMounted.current = true;
    }, [grid, imagesReady, stagger, blurToFocus, duration, ease]);

    // --- INTERAKSI HOVER ---
    const handleMouseEnter = (id: string, element: HTMLElement) => {
        if (scaleOnHover) { gsap.to(`[data-key="${id}"]`, { scale: hoverScale, duration: 0.3, ease: 'power2.out' }); }
        if (colorShiftOnHover) { const overlay = element.querySelector('.color-overlay') as HTMLElement; if (overlay) gsap.to(overlay, { opacity: 0.3, duration: 0.3 }); }
    };
    const handleMouseLeave = (id: string, element: HTMLElement) => {
        if (scaleOnHover) { gsap.to(`[data-key="${id}"]`, { scale: 1, duration: 0.3, ease: 'power2.out' }); }
        if (colorShiftOnHover) { const overlay = element.querySelector('.color-overlay') as HTMLElement; if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.3 }); }
    };


    // --- RENDER SECTION 3 ---
    return (
        <section 
            id="section3" 
            className="p-4 sm:p-8 bg-gray-50 min-h-[100vh] flex flex-col items-center bg-white"
        >   
            <div className="w-full max-w-[1500px] px-2 sm:px-0">
                <div 
                    ref={containerRef} 
                    className="relative w-full transition-all duration-300"
                    style={{ willChange: 'height, transform' }} 
                >
                    {grid.map(item => (
                        <div
                            key={item.id} data-key={item.id}
                            className="absolute cursor-pointer transform-gpu"
                            style={{ willChange: 'transform, width, height, opacity' }}
                            onMouseEnter={e => handleMouseEnter(item.id, e.currentTarget)}
                            onMouseLeave={e => handleMouseLeave(item.id, e.currentTarget)}
                        >
                            <div
                                className="relative w-full h-full bg-cover bg-center rounded-[10px] shadow-[0px_10px_50px_-10px_rgba(0,0,0,0.2)]"
                                style={{ backgroundImage: `url(${item.img})` }}
                            >
                                {colorShiftOnHover && (
                                    <div className="color-overlay absolute inset-0 rounded-[10px] bg-gradient-to-tr from-pink-500/50 to-sky-500/50 opacity-0 pointer-events-none" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="h-20" /> 
        </section>
    );
}