// Section2.tsx (VERSI PERBAIKAN UNTUK MENGHAPUS ERROR TS6133)
import { useState, useEffect } from "react";

export default function Section2() {
  // State untuk menangani logika buka/tutup (default: true)
  const [isOpened, setIsOpened] = useState(true);
  // State BARU untuk Music Player
  const [music, setMusic] = useState<HTMLAudioElement | null>(null);
  // State isMusicInitialized telah dihapus karena tidak digunakan

  // 1. Inisialisasi Audio saat komponen mounting
  useEffect(() => {
    const audio = new Audio("/backsound.mp3");
    audio.loop = true;
    audio.volume = 0.7;
    setMusic(audio);
    // setIsMusicInitialized(true); <-- HAPUS BARIS INI

    return () => {
      // Cleanup: hentikan musik saat komponen di-unmount
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);


  // Class dasar untuk setiap kartu
  const cardBaseClass =
    "absolute flex items-center justify-center w-full h-full rounded-[20px] shadow-[0_7px_29px_0_rgba(100,100,111,0.2)] origin-bottom transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]";

  
  // 2. Fungsi Toggle yang MEMUTAR / PAUSE MUSIK
  const handleToggle = () => {
    // Ubah state buka/tutup kartu
    setIsOpened(!isOpened);
    
    // Logika Play / Pause Musik
    if (music) {
        // Cek status paused dari elemen audio
        if (music.paused) {
            // Jika musik sedang PAUSE, maka PLAY
            music.play().catch(error => {
                console.warn("Play failed:", error);
            });
        } else {
            // Jika musik sedang PLAY, maka PAUSE
            music.pause();
        }
    }
  };


  return (
    <section
      className="relative w-full h-[130vh] overflow-hidden bg-[#FFFFFE]"
      id="section2"
    >
      {/* Main Container: Centering Cards & Nav */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center pointer-events-none">
        
        {/* Card Stack Wrapper (Responsif) */}
        <div 
            className={`relative w-[70vw] h-[90vw] sm:w-[300px] sm:h-[400px] pointer-events-auto group ${isOpened ? "opened" : ""}`}
        >
          
          {/* CARD 1: Paling Belakang (Kiri saat dibuka) */}
          <div
            className={`${cardBaseClass} bg-[#F6B1CE]/70 z-10
              ${isOpened ? "rotate-[-10deg] hover:rotate-[-10deg] hover:-translate-y-5" : "rotate-0"}
            `}
          >
          </div>

          {/* CARD 2: Paling Depan (Tengah saat dibuka) 
              z-30 agar muncul paling depan saat ditumpuk.
          */}
          <div
            className={`${cardBaseClass} bg-[#fffffe]/50 z-30 p-4 object-contain overflow-hidden 
              ${isOpened ? "rotate-0 hover:-translate-y-5 cursor-pointer" : "rotate-0"}
            `}
          >
            <img className="w-full h-full rounded-2xl object-cover" src="/kecil.jpg" alt="kecil" />
          </div>

          {/* CARD 3: Tengah Belakang (Kanan saat dibuka) */}
          <div
            className={`${cardBaseClass} bg-[#1581BF]/70 z-20
              ${isOpened ? "rotate-10 hover:rotate-10 hover:-translate-y-5" : "rotate-0"}
            `}
          >
          </div>
        </div>

        {/* Navigation Circle Button */}
        <button
          onClick={handleToggle} 
          className={`
            pointer-events-auto
            mt-12 sm:mt-16
            w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] 
            flex justify-center items-center
            transition-transform duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]
            hover:scale-105 active:scale-95
            ${isOpened ? "rotate-180" : "rotate-0"}
          `}
          aria-label="Toggle Stack and Music"
        >
            <img src="/btn-kecil.png" alt="tombol" />
        </button>
        
      </div>
    </section>
  );
}