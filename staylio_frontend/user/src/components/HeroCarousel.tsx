/* eslint-disable react-hooks/exhaustive-deps */
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { SearchBar } from "./SearchBar";
import { useTranslation } from "react-i18next";

const images = [
  "https://bdnd.1cdn.vn/2022/11/07/2022-11-04-09-14-02-543-min.jpg",
  "https://statics.vinpearl.com/Nha-Trang-thuoc-tinh-nao-1_1684760673.jpeg",
  "https://bcp.cdnchinhphu.vn/334894974524682240/2025/6/30/tphcm-1-1751245519173693919081.jpg"
];

export default function HeroCarousel() {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

   useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <section className="relative h-187.5 w-full overflow-hidden bg-slate-900">
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100 z-0" : "opacity-0 -z-10"
          }`}
        >
          <img
            src={img}
            alt={`Slide ${index}`}
            className={`w-full h-full object-cover transition-transform duration-10000 ease-out ${
              index === currentIndex ? "scale-110" : "scale-100"
            }`}
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/30 to-black/60"></div>
        </div>
      ))}

      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 flex flex-col justify-start pt-20 md:pt-0 md:justify-center items-center md:-mt-10">
        <div className="text-center mb-10 md:mb-12 space-y-4 md:space-y-6 mt-6 md:mt-0">
          <h1 className="text-4xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-white to-white/90 drop-shadow-2xl leading-tight">
            {t('homeScreen.hero.titlePrefix')} <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-400">{t('homeScreen.hero.titleHighlight')}</span>
          </h1>
          <p className="text-base md:text-2xl text-white/90 max-w-2xl mx-auto font-medium drop-shadow-lg px-4">
            {t('homeScreen.hero.subtitle')}
          </p>
        </div>

        {/* Đưa SearchBar vào đây */}
        <div className="w-full max-w-6xl relative z-30">
          <SearchBar />
        </div>
      </div>

      {/* 3. Nút điều hướng Trái/Phải */}
      <button
        onClick={prevSlide}
        className="absolute left-2 md:left-8 top-[15%] md:top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-all border border-white/10 hover:scale-110"
      >
        <ChevronLeft size={24} className="md:w-7.5 md:h-7.5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 md:right-8 top-[15%] md:top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-all border border-white/10 hover:scale-110"
        >
          <ChevronRight size={24} className="md:w-7.5 md:h-7.5" />
      </button>

      {/* 4. Chỉ số Dots */}
      <div className="absolute bottom-8 md:bottom-24 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-500 rounded-full ${
              index === currentIndex ? "w-8 md:w-10 h-2 md:h-2.5 bg-blue-500 shadow-lg shadow-blue-500/50" : "w-2 md:w-2.5 h-2 md:h-2.5 bg-white hover:bg-gray-200"
            }`}
          />
        ))}
      </div>
    </section>
  );
}