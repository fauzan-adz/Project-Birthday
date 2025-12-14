// Section1.tsx (SETELAH DIMODIFIKASI)
import { useEffect, useState } from "react";

export default function Section1() {

    const [scrollY, setScrollY] = useState(0);

    const floatingObjects = [
        // Nilai x negatif inilah yang menyebabkan scroll-x
        { x: -10, y: 120, speed: 0.4, img: "/icon-1.png", size: 220 },
        { x: 70, y: 250, speed: 0.3, img: "/icon-2.png", size: 190 },
        { x: 60, y: 600, speed: 0.3, img: "/icon-3.png", size: 200 },
        { x: -5, y: 600, speed: 0.3, img: "/omg.png", size: 175},
    ];

    useEffect(() => {
        
        const handleScroll = () => setScrollY(window.scrollY);

        window.addEventListener("scroll", handleScroll);

        // Cleanup listener saat komponen di-unmount
        return () => window.removeEventListener("scroll", handleScroll);

    }, []);

    const translateY = scrollY * 0.4;
    const opacity = Math.max(1 - scrollY / 300, 0);

    return (
        <>
            <section
                className="relative max-w-screen h-screen overflow-hidden"
            >
                {/* Background */}
                <img
                    src="/Awan3.png"
                    className="absolute inset-0 w-full h-full object-cover z-0 overflow-x-hidden"
                />
                <div
                    className="absolute inset-0 z-40 overflow-x-hidden"
                    style={{
                        transform: `translateY(${translateY}px)`,
                        opacity,
                    }}
                >
                    <div
                        className="
                            relative w-full h-dvh
                            flex flex-col justify-center items-center
                            text-white
                            overflow-x-hidden 
                        "
                    >
                        <h1 className="text-4xl font-bold mb-6">
                            <img
                                src="/photo1.png"
                                alt="photo"
                                className="w-[345px]"
                            />
                        </h1>

                        <a
                            href="#section3"
                            className="mt-20"
                        >
                            <img src="/btn.png" alt="" className="w-42 h-18" />
                        </a>
                    </div>
                </div>
                <div className="absolute inset-0 z-10 overflow-x-hidden">
                    {floatingObjects.map((obj, i) => (
                        <img
                            key={i}
                            src={obj.img}
                            style={{
                                position: "absolute",
                                top: obj.y + scrollY * obj.speed,
                                left: `${obj.x}vw`,
                                width: obj.size,
                                height: obj.size,
                                zIndex: 20,
                                pointerEvents: "none",
                                opacity,
                            }}
                        />
                    ))}
                </div>
            </section>
        </>
    );
}