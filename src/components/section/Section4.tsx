// Section4.tsx
import { useState, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registrasi Plugin GSAP
gsap.registerPlugin(ScrollTrigger);


export default function Section4() {
    
    const [showUcapanCard, setShowUcapanCard] = useState(false);
    
    // Refs untuk Tombol "TIDAK"
    const noButtonRef = useRef<HTMLImageElement>(null); 
    const buttonContainerRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLElement>(null); 

    // Ref BARU untuk Kartu Ucapan
    const ucapanCardRef = useRef<HTMLDivElement>(null);


    const handleNoClick = () => {
        // ... (Logika tombol TIDAK tetap sama) ...
        const buttonElement = noButtonRef.current;
        const containerElement = buttonContainerRef.current;
        
        if (!buttonElement || !containerElement) return;

        const containerRect = containerElement.getBoundingClientRect();
        const buttonRect = buttonElement.getBoundingClientRect();
        
        // Menghitung batas pergerakan
        const maxLeft = containerRect.width - buttonRect.width;
        const maxTop = containerRect.height - buttonRect.height;
        const minVal = 0;

        const randomLeft = minVal + Math.random() * (maxLeft - minVal);
        const randomTop = minVal + Math.random() * (maxTop - minVal);

        gsap.to(buttonElement, {
            left: randomLeft,
            top: randomTop,
            duration: 0.25, 
            ease: "power1.out"
        });
    };
    
    const handleYesClick = () => {
        // Hanya ubah state. Animasi akan ditangani di useLayoutEffect.
        setShowUcapanCard(true);
    };


    // --- LOGIKA ANIMASI KARTU UCAPAN MENGGUNAKAN GSAP ---
    useLayoutEffect(() => {
        if (showUcapanCard && ucapanCardRef.current) {
            // GSAP Context untuk mengisolasi animasi ini
            const ctx = gsap.context(() => {
                // 1. Set state awal (opacity 0 dan scale kecil)
                gsap.set(ucapanCardRef.current, {
                    opacity: 0,
                    scale: 0.8,
                    y: 20 // Sedikit geser dari bawah
                });

                // 2. Animasikan ke state akhir (opacity 1 dan scale normal)
                gsap.to(ucapanCardRef.current, {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 1.0, // Durasi animasi
                    ease: "power3.out", // Efek yang bagus
                    delay: 0.1 // Sedikit jeda setelah state berubah
                });
            }, ucapanCardRef);

            return () => ctx.revert();
        }
    }, [showUcapanCard]); // Efek dijalankan hanya saat showUcapanCard menjadi true


    return (
        <section 
            ref={sectionRef} 
            id="section4" 
            className="w-full h-screen relative flex flex-col items-center justify-center p-8 bg-[#FFFFFE] " 
            style={{ backgroundColor: '#FFFFFE' }}
        >

            {/* Konten Utama (z-index tinggi) */}
            <div className="w-full max-w-2xl relative z-30 flex flex-col items-center justify-center ">

                {!showUcapanCard ? (
                    // --- TAMPILAN PERTANYAAN & GAMBAR TOMBOL (Saat showUcapanCard = false) ---
                    <>
                        <div className="mb-10 text-center">
                            <img 
                                src="/pertanyaan.png" 
                                alt="Ada ucapan dari aku nih, mau baca gak?"
                                className="w-full max-w-sm mx-auto"
                            />
                        </div>

                        <div 
                            ref={buttonContainerRef}
                            className="relative w-full h-20 rounded-xl" 
                        >
                            
                            {/* Tombol "IYA!" (/ya.png) */}
                            <img
                                src="/ya.png" 
                                alt="Tombol IYA"
                                onClick={handleYesClick}
                                className="max-w-20 cursor-pointer transition duration-100 hover:scale-[1.02] active:scale-[0.98] z-50 w-[180px]"
                                style={{ 
                                    position: 'absolute', 
                                    top: '50%', 
                                    left: '30%', 
                                    transform: 'translate(-50%, -50%)',
                                }}
                            />

                            {/* Tombol "TIDAK" (/tidak.png) */}
                            <img
                                ref={noButtonRef}
                                src="/tidak.png" 
                                alt="Tombol TIDAK"
                                onClick={handleNoClick}
                                className="cursor-pointer transition duration-100 hover:scale-[1.02] active:scale-[0.98] z-50 w-[180px]"
                                style={{ 
                                    position: 'absolute', 
                                    top: '58%', 
                                    left: '65%', 
                                    transform: 'translate(-50%, -50%)',
                                }}
                            />
                        </div>
                    </>
                ) : (
                    // --- TAMPILAN KARTU UCAPAN (Saat showUcapanCard = true) ---
                    <div 
                        ref={ucapanCardRef} // <-- Tambahkan ref di sini
                        className="text-center max-w-lg mx-auto" 
                        // Hapus class transisi CSS karena kita akan menggunakan GSAP
                    >
                        <img 
                            src="/ucapan.png" 
                            alt="Kartu Ucapan"
                            className="w-full max-w-lg mx-auto rounded-xl"
                        />
                    </div>
                )}
            </div>
        </section>
    );
}