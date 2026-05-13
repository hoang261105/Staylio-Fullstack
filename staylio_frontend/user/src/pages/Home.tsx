import { Shield, Star, Users } from "lucide-react";
import { hotels, popularDestinations } from "../apis/hotel";
import { HeroCarousel } from "../components/HeroCarousel";
import { HotelCard } from "../components/HotelCard";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

export default function Home() {
  const featuredHotels = hotels.filter((h) => h.featured);
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <HeroCarousel />

      <section className="py-12 bg-white border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#0066FF]/10 rounded-lg flex items-center justify-center shrink-0">
                <Users className="w-6 h-6 text-[#0066FF]" />
              </div>
              <div>
                <div className="text-2xl font-semibold">2.5M+</div>
                <div className="text-sm text-muted-foreground">
                  Người dùng hài lòng
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#10B981]/10 rounded-lg flex items-center justify-center shrink-0">
                <Star className="w-6 h-6 text-[#10B981]" />
              </div>
              <div>
                <div className="text-2xl font-semibold">4.8/5</div>
                <div className="text-sm text-muted-foreground">
                  Đánh giá trung bình
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-lg flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-[#F59E0B]" />
              </div>
              <div>
                <div className="text-2xl font-semibold">100%</div>
                <div className="text-sm text-muted-foreground">
                  Thanh toán bảo mật
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl mb-2">Điểm đến phổ biến</h2>
            <p className="text-muted-foreground">
              Khám phá những địa điểm du lịch được yêu thích nhất
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((dest, idx) => (
              <div
                key={idx}
                className="relative h-64 rounded-xl overflow-hidden group cursor-pointer"
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl mb-1">{dest.name}</h3>
                  <p className="text-sm text-white/80">
                    {dest.hotels} khách sạn
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-accent/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl mb-2">Khách sạn được đề xuất</h2>
            <p className="text-muted-foreground">
              Những lựa chọn hàng đầu dành cho bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
