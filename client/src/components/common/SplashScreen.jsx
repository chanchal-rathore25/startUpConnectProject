import React, { useEffect, useState } from "react";
import { Rocket } from "lucide-react";

/**
 * SplashScreen — website open hote hi ye dikhta hai
 * -------------------------------------------------
 * Logo pulse + float karta hai, niche ek loader bar slide karta hai,
 * ~1.5s baad smoothly fade-out ho jaata hai aur asli website reveal hoti hai.
 * -------------------------------------------------
 */
export default function SplashScreen({ onFinish }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const startFade = setTimeout(() => setFadeOut(true), 1400);
    const finish = setTimeout(() => onFinish?.(), 1800);
    return () => {
      clearTimeout(startFade);
      clearTimeout(finish);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-white transition-opacity duration-500 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <style>{`
        @keyframes sc-pulse-ring {
          0% { transform: scale(0.85); opacity: 0.55; }
          80% { transform: scale(1.7); opacity: 0; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        @keyframes sc-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes sc-fade-up {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes sc-bar-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(340%); }
        }
        .sc-ring { animation: sc-pulse-ring 1.6s ease-out infinite; }
        .sc-logo { animation: sc-float 1.8s ease-in-out infinite; }
        .sc-text { animation: sc-fade-up 0.6s ease-out 0.2s both; }
        .sc-bar { animation: sc-bar-slide 1.1s ease-in-out infinite; }
      `}</style>

      <div className="flex flex-col items-center">
        <div className="relative flex items-center justify-center w-20 h-20">
          <span className="sc-ring absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600" />
          <span className="sc-logo relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200">
            <Rocket size={30} />
          </span>
        </div>

        <p className="sc-text mt-5 text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          StartupConnect
        </p>

        <div className="sc-text mt-4 w-32 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div className="sc-bar h-full w-1/3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full" />
        </div>
      </div>
    </div>
  );
}