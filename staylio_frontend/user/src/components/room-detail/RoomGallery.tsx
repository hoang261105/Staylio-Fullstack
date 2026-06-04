import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface RoomImageResponse {
  id?: number;
  imageUrl: string;
  isPrimary: boolean;
}

interface RoomGalleryProps {
  primaryImage: string;
  otherImages: RoomImageResponse[];
  allImageUrls: string[];
}

export default function RoomGallery({ primaryImage, otherImages, allImageUrls }: RoomGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-2xl overflow-hidden mb-10 h-[50vh] min-h-[400px] relative group">
        <div className="w-full h-full">
          <img
            src={primaryImage}
            alt="Primary"
            onClick={() =>
              setSelectedImageIndex(Math.max(0, allImageUrls.indexOf(primaryImage)))
            }
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
          />
        </div>
        <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-2 h-full">
          {otherImages.map((img, idx) => (
            <img
              key={idx}
              src={img.imageUrl}
              alt={`Gallery ${idx}`}
              onClick={() =>
                setSelectedImageIndex(Math.max(0, allImageUrls.indexOf(img.imageUrl)))
              }
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
            />
          ))}
          {Array.from({ length: Math.max(0, 4 - otherImages.length) }).map((_, idx) => (
            <img
              key={`fill-${idx}`}
              src={primaryImage}
              alt={`Fill ${idx}`}
              onClick={() =>
                setSelectedImageIndex(Math.max(0, allImageUrls.indexOf(primaryImage)))
              }
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer opacity-80"
            />
          ))}
        </div>
        <button
          onClick={() => setSelectedImageIndex(0)}
          className="absolute bottom-4 right-4 bg-white dark:bg-gray-800/90 backdrop-blur-md text-gray-900 dark:text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:bg-white dark:bg-gray-800 transition-colors text-sm z-10"
        >
          Xem tất cả ảnh
        </button>
      </div>

      {/* Lightbox */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm">
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-black/50 p-2 rounded-full transition-colors"
            onClick={() => setSelectedImageIndex(null)}
          >
            <X className="w-8 h-8" />
          </button>

          {allImageUrls.length > 1 && (
            <>
              <button
                className="absolute left-6 text-white/70 hover:text-white bg-black/50 p-2 rounded-full transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex(
                    (selectedImageIndex - 1 + allImageUrls.length) % allImageUrls.length
                  );
                }}
              >
                <ChevronLeft className="w-8 h-8" />
              </button>

              <button
                className="absolute right-6 text-white/70 hover:text-white bg-black/50 p-2 rounded-full transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex((selectedImageIndex + 1) % allImageUrls.length);
                }}
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          <img
            src={allImageUrls[selectedImageIndex]}
            alt="Room detail view"
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
          />

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 px-4 py-2 rounded-full text-white text-sm font-medium">
            {selectedImageIndex + 1} / {allImageUrls.length}
          </div>
        </div>
      )}
    </>
  );
}
