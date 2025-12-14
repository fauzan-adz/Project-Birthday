// Section2.tsx
import { useState } from "react";

export default function Section2() {
  // State untuk menangani logika buka/tutup (default: true)
  const [isOpened, setIsOpened] = useState(true);

  // Class dasar untuk setiap kartu
  // Transisi menggunakan Arbitrary Value untuk kurva kubik (efek membal)
  const cardBaseClass =
    "absolute flex items-center justify-center w-full h-full rounded-[20px] shadow-[0_7px_29px_0_rgba(100,100,111,0.2)] origin-bottom transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]";

  const handleToggle = () => setIsOpened(!isOpened);

  return (
    <section
      className="relative w-full h-[130vh] overflow-hidden"
      id="section2"
    >
      {/* Background Image */}
      <img
        src="/Awan4.png"
        alt="Background Cloud"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Main Container: Centering Cards & Nav */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center pointer-events-none">
        
        {/* Card Stack Wrapper (Responsif) */}
        <div 
            className={`relative w-[70vw] h-[90vw] sm:w-[300px] sm:h-[400px] pointer-events-auto group ${isOpened ? "opened" : ""}`}
        >
          
          {/* CARD 1: Paling Belakang (Kiri saat dibuka) */}
          <div
            className={`${cardBaseClass} bg-[#897085] z-10
              ${isOpened ? "rotate-[-10deg] hover:rotate-[-10deg] hover:-translate-y-5" : "rotate-0"}
            `}
          >
          </div>

          {/* CARD 2: Paling Depan (Tengah saat dibuka) 
              z-30 agar muncul paling depan saat ditumpuk.
          */}
          <div
            className={`${cardBaseClass} bg-[#d18e9f] z-30
              ${isOpened ? "rotate-0 hover:-translate-y-5 cursor-pointer" : "rotate-0"}
            `}
          >
            <p className="font-bold text-white text-xl font-sans">Hover me</p>
          </div>

          {/* CARD 3: Tengah Belakang (Kanan saat dibuka) */}
          <div
            className={`${cardBaseClass} bg-white z-20
              ${isOpened ? "rotate-[10deg] hover:rotate-[10deg] hover:-translate-y-5" : "rotate-0"}
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
            bg-[#897085] rounded-full 
            shadow-[0_0_29px_0_rgba(100,100,111,0.288)]
            flex justify-center items-center
            text-white text-3xl
            transition-transform duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]
            hover:scale-105 active:scale-95
            ${isOpened ? "rotate-180" : "rotate-0"}
          `}
          aria-label="Toggle Stack"
        >
            {/* Ikon Font Awesome: Pastikan CDN dimuat di index.html */}
            {isOpened ? (
                <i className="fa-regular fa-square transform rotate-180"></i>
            ) : (
                <i className="fa-regular fa-clone"></i>
            )}
        </button>
      </div>
    </section>
  );
}