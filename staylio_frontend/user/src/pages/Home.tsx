import { Shield, Star, Users, Globe2, Headset, CreditCard, ArrowRight, Mail } from "lucide-react";
import { HeroCarousel } from "../components/HeroCarousel";
import { HotelBranchCard } from "../components/HotelBranchCard";
import { FeaturedLocations } from "../components/FeaturedLocations";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import ChatBotWidget from "../components/ChatBotWidget";
import { Button } from "../../../common/components/ui/button";
import { Input } from "../../../common/components/ui/input";
import { useAllHotels } from "../../../common/hooks/useHotels";
import { useHotelBranchs } from "../../../common/hooks/useHotelBranch";
import { useMemo } from "react";
import type { HotelResponse } from "../../../common/interfaces/response/HotelResponse";
import type { HotelBranchResponse } from "../../../common/interfaces/response/HotelBranchResponse";
import { BranchStatus } from "../../../common/enums/BranchStatus";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();
  const { data: hotelsData } = useAllHotels();

  const { data: branchesData } = useHotelBranchs({ page: 0, size: 1000, search: "", status: BranchStatus.CONFIRMED });

  const topBrands = useMemo(() => {
    if (!hotelsData) return [];

    return [...hotelsData]
      .sort((a: HotelResponse, b: HotelResponse) => (b.branchCount || 0) - (a.branchCount || 0))
      .slice(0, 4);
  }, [hotelsData]);

  const featuredBranches = useMemo(() => {
    if (!branchesData?.items) return [];

    return [...branchesData.items]
      .sort((a: HotelBranchResponse, b: HotelBranchResponse) => (b.averageRating || 0) - (a.averageRating || 0))
      .slice(0, 6);
  }, [branchesData]);


  return (
    <div className="min-h-screen bg-background font-sans transition-colors duration-200">
      <Header />

      <HeroCarousel />

      <section className="relative z-20 -mt-6 md:-mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card backdrop-blur-xl rounded-2xl border border-border p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="flex flex-col items-center justify-center text-center px-4">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">2.5M+</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{t('homeScreen.stats.happyUsers')}</div>
            </div>

            <div className="flex flex-col items-center justify-center text-center px-4 pt-6 md:pt-0">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-4">
                <Star className="w-7 h-7 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">4.8/5</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{t('homeScreen.stats.averageRating')}</div>
            </div>

            <div className="flex flex-col items-center justify-center text-center px-4 pt-6 md:pt-0">
              <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-amber-600" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">100%</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{t('homeScreen.stats.securePayment')}</div>
            </div>
          </div>
        </div>
      </section>

      <FeaturedLocations />

      {/* Popular Brands */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{t('homeScreen.popularBrands.title')}</h2>
              <p className="text-lg text-muted-foreground">
                {t('homeScreen.popularBrands.desc')}
              </p>
            </div>
            <Button variant="link" className="group text-primary font-semibold flex items-center gap-2">
              {t('homeScreen.popularBrands.viewAll')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topBrands.map((brand: HotelResponse) => (
              <div
                key={brand.id}
                className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300"
              >
                <img
                  src={brand.imageUrl || "https://images.unsplash.com/photo-1562790351-d273a961e0e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"}
                  alt={brand.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-2xl font-bold mb-2">{brand.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-foreground">
                      {brand.branchCount} {t('homeScreen.popularBrands.branches')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-card border-y border-border transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-card-foreground mb-4">{t('homeScreen.whyChooseUs.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('homeScreen.whyChooseUs.desc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-muted transition-colors">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-primary rounded-full flex items-center justify-center mb-6">
                <Globe2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-card-foreground mb-3">{t('homeScreen.whyChooseUs.globalNetwork')}</h3>
              <p className="text-muted-foreground">
                {t('homeScreen.whyChooseUs.globalNetworkDesc')}
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-muted transition-colors">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-6">
                <CreditCard className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-card-foreground mb-3">{t('homeScreen.whyChooseUs.transparentPricing')}</h3>
              <p className="text-muted-foreground">
                {t('homeScreen.whyChooseUs.transparentPricingDesc')}
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-muted transition-colors">
              <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mb-6">
                <Headset className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-card-foreground mb-3">{t('homeScreen.whyChooseUs.support247')}</h3>
              <p className="text-muted-foreground">
                {t('homeScreen.whyChooseUs.support247Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Branches */}
      <section className="py-24 bg-background transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{t('homeScreen.featuredBranches.title')}</h2>
              <p className="text-lg text-muted-foreground">
                {t('homeScreen.featuredBranches.desc')}
              </p>
            </div>
            <Button variant="link" className="group text-primary font-semibold flex items-center gap-2">
              {t('homeScreen.featuredBranches.viewAll')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBranches.map((branch) => (
              <HotelBranchCard key={branch.id} branch={branch} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-12">
        <div className="bg-primary rounded-3xl p-10 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-primary-foreground/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-primary-foreground/20 blur-3xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="text-primary-foreground max-w-xl text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('homeScreen.newsletter.title')}</h2>
              <p className="text-primary-foreground/80 text-lg">
                {t('homeScreen.newsletter.desc')}
              </p>
            </div>

            <div className="w-full md:w-auto">
              <form className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                <div className="relative flex-1 text-foreground">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    type="email"
                    placeholder={t('homeScreen.newsletter.emailPlaceholder')}
                    className="w-full pl-12 pr-4 h-12 md:h-14 rounded-xl font-medium bg-background border-border"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  variant="secondary"
                  className="h-12 md:h-14 px-8 rounded-xl font-semibold"
                >
                  {t('homeScreen.newsletter.subscribeButton')}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <ChatBotWidget />
    </div>
  );
}
