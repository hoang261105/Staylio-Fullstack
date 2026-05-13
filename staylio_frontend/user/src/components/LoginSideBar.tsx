import { Gift, ShieldCheck, Sparkles } from "lucide-react";

export default function LoginSideBar() {
  return (
    <>
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-[#0066FF] to-[#00C896] relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1568727174680-7ae330b15345?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
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
              Chào mừng trở lại!
            </h1>
            <p className="text-lg text-white/90 mb-8">
              Tiếp tục khám phá và đặt phòng tại những khách sạn tuyệt vời trên
              khắp thế giới.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium">Giá tốt nhất</div>
                  <div className="text-sm text-white/80">
                    Đảm bảo giá thấp nhất
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shrink-0">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium">Ưu đãi độc quyền</div>
                  <div className="text-sm text-white/80">
                    Giảm giá đến 30% cho thành viên
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium">Thanh toán an toàn</div>
                  <div className="text-sm text-white/80">
                    Bảo mật SSL 256-bit
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
  );
}
