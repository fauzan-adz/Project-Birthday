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
          aria-label="Toggle Stack"
        >
            <img src="/btn-kecil.png" alt="tombol" />
        </button>
      </div>
    </section>
  );
}