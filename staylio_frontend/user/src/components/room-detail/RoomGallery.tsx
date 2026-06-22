import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Cuboid as Cube } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../common/components/ui/button";
import Room360Viewer from "../../../../common/components/Room360Viewer";

interface RoomImageResponse {
  id?: number;
  imageUrl: string;
  isPrimary: boolean;
  is360?: boolean;
}

interface RoomGalleryProps {
  primaryImage: string;
  otherImages: RoomImageResponse[];
  allImageUrls: string[];
  vr360ImageUrls?: string[];
}

export default function RoomGallery({ primaryImage, otherImages, allImageUrls, vr360ImageUrls = [] }: RoomGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const { t } = useTranslation();

  const isCurrent360 = selectedImageIndex !== null && vr360ImageUrls.includes(allImageUrls[selectedImageIndex]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-2xl overflow-hidden mb-10 h-[50vh] min-h-100 relative group">
        <div className="w-full h-full relative">
          <img
            src={primaryImage}
            alt="Primary"
            onClick={() =>
              setSelectedImageIndex(Math.max(0, allImageUrls.indexOf(primaryImage)))
            }
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
          />
          {vr360ImageUrls.length > 0 && (
            <Button
              variant="default"
              onClick={() => {
                const first360Idx = allImageUrls.findIndex(url => vr360ImageUrls.includes(url));
                if (first360Idx !== -1) setSelectedImageIndex(first360Idx);
              }}
              className="absolute top-4 left-4 bg-primary/90 hover:bg-primary text-white font-bold rounded-lg shadow-lg z-10 flex items-center gap-2"
            >
              <Cube className="w-5 h-5 animate-pulse" />
              Khám phá 360°
            </Button>
          )}
        </div>
        <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-2 h-full">
          {otherImages.map((img, idx) => (
            <div key={idx} className="relative w-full h-full">
              <img
                src={img.imageUrl}
                alt={`Gallery ${idx}`}
                onClick={() =>
                  setSelectedImageIndex(Math.max(0, allImageUrls.indexOf(img.imageUrl)))
                }
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
              />
              {img.is360 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/50 rounded-full p-2 backdrop-blur-sm">
                    <Cube className="w-6 h-6 text-white" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          onClick={() => setSelectedImageIndex(0)}
          className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-md text-foreground font-semibold rounded-lg shadow-lg z-10"
        >
          {t("roomDetail.viewAllImages")}
        </Button>
      </div>

      {/* Lightbox */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 z-100 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm">
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-black/50 p-2 rounded-full transition-colors z-110"
            onClick={() => setSelectedImageIndex(null)}
          >
            <X className="w-8 h-8" />
          </button>

          {allImageUrls.length > 1 && (
            <>
              <button
                className="absolute left-6 text-white/70 hover:text-white bg-black/50 p-2 rounded-full transition-colors z-110"
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
                className="absolute right-6 text-white/70 hover:text-white bg-black/50 p-2 rounded-full transition-colors z-110"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex((selectedImageIndex + 1) % allImageUrls.length);
                }}
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          <div className="w-full max-w-5xl h-[80vh] flex items-center justify-center relative">
            {isCurrent360 ? (
              <Room360Viewer imageUrl={allImageUrls[selectedImageIndex]} />
            ) : (
              <img
                src={allImageUrls[selectedImageIndex]}
                alt="Room detail view"
                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
              />
            )}
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 px-4 py-2 rounded-full text-white text-sm font-medium z-110">
            {selectedImageIndex + 1} / {allImageUrls.length} {isCurrent360 && " - 360° View"}
          </div>
        </div>
      )}
    </>
  );
}
