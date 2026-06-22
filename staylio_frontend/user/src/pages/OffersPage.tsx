import { useTranslation } from "react-i18next";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { useVouchers } from "../../../common/hooks/useVouchers";
import { VoucherStatus } from "../../../common/enums/VoucherStatus";
import type { QueryParams } from "../../../common/interfaces";
import { formatCurrency } from "../../../common/utils/currency.util";
import { Gift, Ticket } from "lucide-react";
import type { VoucherResponse } from "../../../common/interfaces/response/VoucherResponse";

export default function OffersPage() {
  const { t } = useTranslation();

  const { data: vouchersData } = useVouchers({
    page: 0,
    size: 100,
    status: VoucherStatus.ACTIVE,
  } as QueryParams);

  const vouchers = vouchersData?.items || [];

  return (
    <div className="min-h-screen bg-background font-sans transition-colors duration-200 flex flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">{t("offersPage.title")}</h1>
            <p className="text-lg text-muted-foreground">{t("offersPage.subtitle")}</p>
          </div>

          {vouchers.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-2xl border border-border shadow-sm">
              <Gift className="w-16 h-16 mx-auto text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-xl font-medium text-foreground mb-2">{t("offersPage.noOffersTitle")}</h3>
              <p className="text-muted-foreground">{t("offersPage.noOffersDesc")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vouchers.map((voucher: VoucherResponse) => (
                <div
                  key={voucher.id}
                  className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="p-6 flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-primary/10 text-primary p-3 rounded-xl">
                        <Ticket className="w-6 h-6" />
                      </div>
                      <span className="text-lg font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                        {voucher.discountType === 'PERCENTAGE'
                          ? t("offersPage.discountPercentage", { value: voucher.discountValue })
                          : t("offersPage.discountFixed", { value: formatCurrency(voucher.discountValue) })
                        }
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-foreground mb-2">{voucher.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2" title={voucher.description}>
                      {voucher.description || t("offersPage.noDescription")}
                    </p>

                    <div className="space-y-2 mt-auto">
                      <div className="flex items-center text-sm">
                        <span className="text-muted-foreground w-28">{t("offersPage.scope")}</span>
                        <span className="font-medium text-foreground truncate">
                          {voucher.hotelBranchId ? voucher.hotelBranchName : t("offersPage.allBranches")}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-muted-foreground w-28">{t("offersPage.minOrder")}</span>
                        <span className="font-medium text-foreground">
                          {formatCurrency(voucher.minOrderValue || 0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-dashed border-border p-4 bg-muted/30 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">{t("offersPage.code")}</div>
                      <div className="font-mono font-bold tracking-wider text-foreground uppercase">{voucher.code}</div>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(voucher.code);
                        alert(t("offersPage.copied", { code: voucher.code }));
                      }}
                      className="text-sm font-semibold text-primary hover:text-primary/80 bg-primary/10 px-4 py-2 rounded-lg transition-colors"
                    >
                      {t("offersPage.copy")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
