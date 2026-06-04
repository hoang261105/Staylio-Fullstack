import { Heart, Star, MapPin, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";
import Header from "../layout/Header";

export default function Favorites() {
  const navigate = useNavigate();

  const savedHotels = [
    { id: 1, name: "Cliff View Hotel", location: "Santorini, Greece", price: 520, rating: 4.9 },
    { id: 2, name: "Modern City Resort", location: "Dubai, UAE", price: 380, rating: 4.5 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-700">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-10">
        
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/profile/me")}
          className="flex items-center gap-2 text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:text-gray-100 mb-6 transition"
        >
          <ChevronLeft size={20} />
          Quay lại Hồ sơ
        </button>

        {/* TITLE */}
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 text-gray-800 dark:text-gray-100">
          <Heart className="fill-red-500 text-red-500" />
          Khách sạn yêu thích
        </h1>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedHotels.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition group overflow-hidden"
            >
              
              {/* IMAGE */}
              <div className="aspect-4/3 bg-gray-200 dark:bg-gray-600 relative overflow-hidden">
                
                {/* overlay hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />

                {/* favorite btn */}
                <button className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-800/80 backdrop-blur-md rounded-full text-red-500 shadow-sm hover:scale-110 transition">
                  <Heart size={18} className="fill-current" />
                </button>
              </div>

              {/* CONTENT */}
              <div className="p-5">
                
                {/* NAME + RATING */}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 group-hover:text-blue-600 transition">
                    {hotel.name}
                  </h3>

                  <div className="flex items-center gap-1 text-sm">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-gray-700 dark:text-gray-200">{hotel.rating}</span>
                  </div>
                </div>

                {/* LOCATION */}
                <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500 text-sm mb-4">
                  <MapPin size={14} />
                  {hotel.location}
                </div>

                {/* FOOTER */}
                <div className="flex justify-between items-end border-t border-gray-100 dark:border-gray-700 pt-4">
                  
                  {/* PRICE */}
                  <div>
                    <span className="text-2xl font-bold text-blue-600">
                      ${hotel.price}
                    </span>
                    <span className="text-gray-400 dark:text-gray-500 text-sm">/đêm</span>
                  </div>

                  {/* ACTION */}
                  <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium hover:bg-blue-600 hover:text-white transition">
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* EMPTY STATE (optional) */}
        {savedHotels.length === 0 && (
          <div className="text-center py-20 text-gray-400 dark:text-gray-500">
            <Heart size={40} className="mx-auto mb-4" />
            <p>Bạn chưa lưu khách sạn nào</p>
          </div>
        )}
      </div>
    </div>
  );
}