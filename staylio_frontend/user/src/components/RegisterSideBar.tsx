import { Gem, PartyPopper, Smartphone } from 'lucide-react'
import { useTranslation } from 'react-i18next';

export default function RegisterSideBar() {
  const { t } = useTranslation();
  return (
    <>
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden group bg-slate-900">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1772127822607-2343696cf82e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
            alt="Travel"
            className="w-full h-full object-cover opacity-50 scale-100 group-hover:scale-105 transition-transform duration-10000 ease-out"
          />
          <div className="absolute inset-0 bg-linear-to-br from-blue-900/80 via-blue-900/60 to-emerald-900/80 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-between p-16 text-white h-full w-full">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl w-48 p-4 inline-flex items-center justify-center mb-6 shadow-xl border border-white/20">
            <img
              src="/slogan.png"
              alt="Staylio"
              className="brightness-0 invert"
            />
          </div>

          <div className="max-w-md mt-auto mb-20">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight drop-shadow-md">
              {t('registerScreen.sidebar.startJourney')} <br/><span className="text-emerald-300">{t('registerScreen.sidebar.your')}</span>
            </h1>
            <p className="text-lg text-white/90 mb-10 font-medium leading-relaxed drop-shadow-sm">
              {t('registerScreen.sidebar.communityDescription')}
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4 group/item">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center shrink-0 border border-white/20 group-hover/item:bg-white/20 transition-colors shadow-lg">
                  <PartyPopper className="w-6 h-6 text-yellow-200" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-white">{t('registerScreen.sidebar.discountTitle')}</div>
                  <div className="text-yellow-100/80">{t('registerScreen.sidebar.discountDesc')}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 group/item">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center shrink-0 border border-white/20 group-hover/item:bg-white/20 transition-colors shadow-lg">
                  <Gem className="w-6 h-6 text-purple-200" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-white">{t('registerScreen.sidebar.rewardTitle')}</div>
                  <div className="text-purple-100/80">{t('registerScreen.sidebar.rewardDesc')}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 group/item">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center shrink-0 border border-white/20 group-hover/item:bg-white/20 transition-colors shadow-lg">
                  <Smartphone className="w-6 h-6 text-blue-200" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-white">{t('registerScreen.sidebar.supportTitle')}</div>
                  <div className="text-blue-100/80">{t('registerScreen.sidebar.supportDesc')}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm text-white/50 font-medium">
            © 2026 STAYLIO. All rights reserved.
          </div>
        </div>
      </div>
    </>
  );
}
