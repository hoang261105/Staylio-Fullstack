import { Heart, Star, MapPin, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";
import Header from "../layout/Header";
import { Button } from "../../../common/components/ui/button";

export default function Favorites() {
  const navigate = useNavigate();

  const savedHotels = [
    { id: 1, name: "Cliff View Hotel", location: "Santorini, Greece", price: 520, rating: 4.9 },
    { id: 2, name: "Modern City Resort", location: "Dubai, UAE", price: 380, rating: 4.5 },
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* BACK BUTTON */}
        <Button
          variant="ghost"
          onClick={() => navigate("/profile/me")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 -ml-4 transition"
        >
          <ChevronLeft size={20} />
          Quay lại Hồ sơ
        </Button>

        {/* TITLE */}
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 text-foreground">
          <Heart className="fill-red-500 text-red-500" />
          Khách sạn yêu thích
        </h1>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedHotels.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-card rounded-2xl border border-border shadow-sm hover:shadow-lg transition group overflow-hidden"
            >

              {/* IMAGE */}
              <div className="aspect-[4/3] bg-muted relative overflow-hidden">

                {/* overlay hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />

                {/* favorite btn */}
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-4 right-4 rounded-full text-red-500 shadow-sm hover:scale-110 transition bg-background/80 backdrop-blur-md border-0"
                >
                  <Heart size={18} className="fill-current" />
                </Button>
              </div>

              {/* CONTENT */}
              <div className="p-5">

                {/* NAME + RATING */}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition">
                    {hotel.name}
                  </h3>

                  <div className="flex items-center gap-1 text-sm">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-card-foreground">{hotel.rating}</span>
                  </div>
                </div>

                {/* LOCATION */}
                <div className="flex items-center gap-1 text-muted-foreground text-sm mb-4">
                  <MapPin size={14} />
                  {hotel.location}
                </div>

                {/* FOOTER */}
                <div className="flex justify-between items-end border-t border-border pt-4">

                  {/* PRICE */}
                  <div>
                    <span className="text-2xl font-bold text-primary">
                      ${hotel.price}
                    </span>
                    <span className="text-muted-foreground text-sm">/đêm</span>
                  </div>

                  {/* ACTION */}
                  <Button variant="outline" className="rounded-lg">
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* EMPTY STATE (optional) */}
        {savedHotels.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <Heart size={40} className="mx-auto mb-4" />
            <p>Bạn chưa lưu khách sạn nào</p>
          </div>
        )}
      </div>
    </div>
  );
}