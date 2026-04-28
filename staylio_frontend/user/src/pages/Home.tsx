import { Shield, Star, Users } from "lucide-react";
import { hotels, popularDestinations } from "../apis/hotel";
import { HeroCarousel } from "../components/HeroCarousel";
import { HotelCard } from "../components/HotelCard";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const featuredHotels = hotels.filter((h) => h.featured);
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 w-32 h-10">
              <img src="/slogan.png" alt="Staylio" />
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="hover:text-[#0066FF] transition-colors">
                Khách sạn
              </a>
              <a href="#" className="hover:text-[#0066FF] transition-colors">
                Điểm đến
              </a>
              <a href="#" className="hover:text-[#0066FF] transition-colors">
                Ưu đãi
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 hover:bg-accent rounded-lg transition-colors" onClick={() => navigate("/login")}>
                Đăng nhập
              </button>
              <button className="px-4 py-2 bg-[#0066FF] text-white rounded-lg hover:bg-[#0052CC] transition-colors">
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </header>

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

      {/* Footer */}
      <footer className="bg-blue-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Cột 1: Brand & Intro */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 w-32 h-10">
                  <img src="/slogan.png" alt="Staylio" />
                </div>
              </div>
              <p className="text-sm leading-relaxed text-white">
                Nền tảng đặt phòng khách sạn hàng đầu với hàng nghìn lựa chọn
                tuyệt vời khắp thế giới. Trải nghiệm kỳ nghỉ hoàn hảo của bạn
                bắt đầu từ đây.
              </p>
            </div>

            {/* Cột 2: Về chúng tôi */}
            <div>
              <h4 className="text-white font-semibold mb-6 text-lg">
                Về chúng tôi
              </h4>
              <ul className="space-y-4 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-400 hover:translate-x-1 inline-block transition-all"
                  >
                    Giới thiệu
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-400 hover:translate-x-1 inline-block transition-all"
                  >
                    Tuyển dụng
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-400 hover:translate-x-1 inline-block transition-all"
                  >
                    Đối tác
                  </a>
                </li>
              </ul>
            </div>

            {/* Cột 3: Hỗ trợ */}
            <div>
              <h4 className="text-white font-semibold mb-6 text-lg">Hỗ trợ</h4>
              <ul className="space-y-4 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-400 hover:translate-x-1 inline-block transition-all"
                  >
                    Trung tâm trợ giúp
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-400 hover:translate-x-1 inline-block transition-all"
                  >
                    Liên hệ & Khiếu nại
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-400 hover:translate-x-1 inline-block transition-all"
                  >
                    Chính sách bảo mật
                  </a>
                </li>
              </ul>
            </div>

            {/* Cột 4: Theo dõi */}
            <div>
              <h4 className="text-white font-semibold mb-6 text-lg">
                Theo dõi chúng tôi
              </h4>
              <div className="flex gap-4">
                {/* Giả lập các nút Social Icon */}
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
                >
                  <span className="text-xs">FB</span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors"
                >
                  <span className="text-xs">IG</span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-sky-400 hover:text-white transition-colors"
                >
                  <span className="text-xs">TW</span>
                </a>
              </div>
              <div className="mt-6">
                <p className="text-xs text-white mb-2 font-medium uppercase">
                  Đăng ký bản tin
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Email của bạn"
                    className="bg-slate-800 border-none rounded-lg px-3 py-2 text-sm w-full focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                    Gửi
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white">
            <p>© 2026 StayFinder. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-gray-300">
                Điều khoản sử dụng
              </a>
              <a href="#" className="hover:text-gray-300">
                Quyền riêng tư
              </a>
              <a href="#" className="hover:text-gray-300">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
