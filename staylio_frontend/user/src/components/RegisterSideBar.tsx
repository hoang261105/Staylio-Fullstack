import { Gem, PartyPopper, Smartphone } from 'lucide-react'

export default function RegisterSideBar() {
  return (
    <>
        <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-[#0066FF] to-[#00C896] relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1772127822607-2343696cf82e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
            alt="Travel"
            className="w-full h-full object-cover opacity-30"
          />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className=" rounded-xl w-52 inline-flex items-center justify-center mb-6">
            <img
              src="/slogan.png"
              alt="Staylio"
              // className="h-6 w-auto object-contain"
            />
          </div>

          <div className="max-w-md">
            <h1 className="text-4xl lg:text-5xl mb-6 leading-tight">
              Bắt đầu hành trình của bạn
            </h1>
            <p className="text-lg text-white/90 mb-8">
              Tham gia cộng đồng hơn 2.5 triệu người dùng đang khám phá thế giới
              cùng Staylio.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shrink-0">
                  <PartyPopper className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium">Giảm 10% đơn đầu</div>
                  <div className="text-sm text-white/80">
                    Cho thành viên mới
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shrink-0">
                  <Gem className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium">Tích điểm thưởng</div>
                  <div className="text-sm text-white/80">
                    Đổi ưu đãi hấp dẫn
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium">Hỗ trợ 24/7</div>
                  <div className="text-sm text-white/80">
                    Luôn sẵn sàng giúp đỡ
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
