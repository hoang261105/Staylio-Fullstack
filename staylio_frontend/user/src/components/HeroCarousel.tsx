import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SearchBar } from "./SearchBar";

const images = [
  "https://bdnd.1cdn.vn/2022/11/07/2022-11-04-09-14-02-543-min.jpg",
  "https://statics.vinpearl.com/Nha-Trang-thuoc-tinh-nao-1_1684760673.jpeg",
  "https://bcp.cdnchinhphu.vn/334894974524682240/2025/6/30/tphcm-1-1751245519173693919081.jpg"
];

export function HeroCarousel() {
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
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <section className="relative h-[650px] w-full overflow-hidden bg-slate-900">
      {/* 1. Phần hình ảnh nền */}
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={img}
            alt={`Slide ${index}`}
            className="w-full h-full object-cover scale-105"
          />
          {/* Lớp phủ để chữ và SearchBar nổi bật */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      ))}

      {/* 2. Nội dung Text và SearchBar */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 flex flex-col justify-center items-center">
        <div className="text-center mb-10 space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-xl">
            Tìm chỗ nghỉ <span className="text-blue-400">hoàn hảo</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-medium">
            Khám phá hàng nghìn khách sạn, resort và homestay tuyệt vời.
          </p>
        </div>

        {/* Đưa SearchBar vào đây */}
        <div className="w-full max-w-6xl">
          <SearchBar />
        </div>
      </div>

      {/* 3. Nút điều hướng Trái/Phải */}
      <button
        onClick={prevSlide}
        className="absolute left-5 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm"
      >
        <ChevronLeft size={30} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-5 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm"
      >
        <ChevronRight size={30} />
      </button>

      {/* 4. Chỉ số Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex ? "w-8 h-2 bg-blue-500" : "w-2 h-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}