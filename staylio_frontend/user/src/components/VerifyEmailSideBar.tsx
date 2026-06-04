import { CheckCircle, Mail } from 'lucide-react'

export default function VerifyEmailSideBar() {
  return (
    <>
        <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-[#0066FF] to-[#00C896] relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1561501900-3701fa6a0864?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
            alt="Travel"
            className="w-full h-full object-cover opacity-30"
          />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className=" rounded-xl w-52 inline-flex items-center justify-center mb-6">
            <img src="/slogan.png" alt="Staylio" />
          </div>

          <div className="max-w-md">
            <h1 className="text-4xl lg:text-5xl mb-6 leading-tight">
              Chỉ còn một bước nữa!
            </h1>
            <p className="text-lg text-white/90 mb-8">
              Xác thực email để hoàn tất đăng ký và bắt đầu trải nghiệm những ưu
              đãi tuyệt vời từ STAYLIO.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white dark:bg-gray-800/20 backdrop-blur-sm rounded-lg flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium">Bảo mật tài khoản</div>
                  <div className="text-sm text-white/80">
                    Xác thực giúp bảo vệ thông tin của bạn
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white dark:bg-gray-800/20 backdrop-blur-sm rounded-lg flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium">Nhận thông báo quan trọng</div>
                  <div className="text-sm text-white/80">
                    Cập nhật đơn hàng và ưu đãi qua email
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm text-white/60">
            © 2026 STAYLIO. All rights reserved.
          </div>
        </div>
      </div>
    </>
  )
}
