import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
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
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <section className="relative h-[750px] w-full overflow-hidden bg-slate-900">
      {/* 1. Phần hình ảnh nền */}
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
            className={`w-full h-full object-cover transition-transform duration-[10000ms] ease-out ${
              index === currentIndex ? "scale-110" : "scale-100"
            }`}
          />
          {/* Lớp phủ gradient để chữ và SearchBar nổi bật hơn */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60"></div>
        </div>
      ))}

      {/* 2. Nội dung Text và SearchBar */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 flex flex-col justify-center items-center -mt-10">
        <div className="text-center mb-12 space-y-6">
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/90 drop-shadow-2xl">
            Tìm chỗ nghỉ <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">hoàn hảo</span>
          </h1>
          <p className="text-lg md:text-2xl text-white/90 max-w-2xl mx-auto font-medium drop-shadow-lg">
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
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-all border border-white/10 hover:scale-110"
      >
        <ChevronLeft size={30} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-all border border-white/10 hover:scale-110"
      >
        <ChevronRight size={30} />
      </button>

      {/* 4. Chỉ số Dots */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-500 rounded-full ${
              index === currentIndex ? "w-10 h-2.5 bg-blue-500 shadow-lg shadow-blue-500/50" : "w-2.5 h-2.5 bg-white dark:bg-gray-800/50 hover:bg-white dark:bg-gray-800/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}