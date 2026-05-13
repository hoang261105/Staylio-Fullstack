
export default function Footer() {
  return (
    <>
      {/* Footer */}
      <footer className="bg-blue-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
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

            <div>
              <h4 className="text-white font-semibold mb-6 text-lg">
                Theo dõi chúng tôi
              </h4>
              <div className="flex gap-4">
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
    </>
  );
}
