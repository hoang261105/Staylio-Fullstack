import { CreditCard, Wallet, Landmark, Banknote, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PaymentMethod } from "../../../../common/enums/PaymentMethod";

interface PaymentMethodSelectorProps {
    selectedMethod: PaymentMethod | "";
    onChange: (method: PaymentMethod) => void;
    error?: string;
}

export const PaymentMethodSelector = ({ selectedMethod, onChange, error }: PaymentMethodSelectorProps) => {
    const { t } = useTranslation();
    
    const PAYMENT_OPTIONS = [
        {
            id: PaymentMethod.VNPAY,
            name: t("bookingConfirmation.paymentMethods.vnpay"),
            description: t("bookingConfirmation.paymentMethods.vnpayDesc"),
            icon: <ShieldCheck className="w-6 h-6 text-primary" />
        },
        {
            id: PaymentMethod.MOMO,
            name: t("bookingConfirmation.paymentMethods.momo"),
            description: t("bookingConfirmation.paymentMethods.momoDesc"),
            icon: <Wallet className="w-6 h-6 text-pink-600" />
        },
        {
            id: PaymentMethod.ZALOPAY,
            name: t("bookingConfirmation.paymentMethods.zalopay"),
            description: t("bookingConfirmation.paymentMethods.zalopayDesc"),
            icon: <Wallet className="w-6 h-6 text-primary" />
        },
        {
            id: PaymentMethod.BANK_TRANSFER,
            name: t("bookingConfirmation.paymentMethods.bank"),
            description: t("bookingConfirmation.paymentMethods.bankDesc"),
            icon: <Landmark className="w-6 h-6 text-green-600" />
        },
        {
            id: PaymentMethod.PAYPAL,
            name: t("bookingConfirmation.paymentMethods.paypal", "PayPal"),
            description: t("bookingConfirmation.paymentMethods.paypalDesc", "Pay via PayPal account or Credit Card"),
            icon: <CreditCard className="w-6 h-6 text-blue-600" />
        },
        {
            id: PaymentMethod.CASH,
            name: t("bookingConfirmation.paymentMethods.cash"),
            description: t("bookingConfirmation.paymentMethods.cashDesc"),
            icon: <Banknote className="w-6 h-6 text-yellow-600" />
        }
    ];

    return (
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6 mb-6">
            <h2 className="text-xl font-bold text-card-foreground mb-6 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-primary" />
                {t("bookingConfirmation.paymentMethodTitle")}
            </h2>

            <div className="space-y-3">
                {PAYMENT_OPTIONS.map((option) => (
                    <label
                        key={option.id}
                        className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedMethod === option.id
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                    >
                        <div className="pt-0.5">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value={option.id}
                                checked={selectedMethod === option.id}
                                onChange={() => onChange(option.id)}
                                className="w-4 h-4 text-primary border-input focus:ring-primary"
                            />
                        </div>
                        <div className="shrink-0">
                            {option.icon}
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-foreground">{option.name}</div>
                            <div className="text-xs text-muted-foreground mt-1">{option.description}</div>
                        </div>
                    </label>
                ))}
            </div>

            {error && <p className="text-red-500 text-sm mt-3 font-medium">{error}</p>}
        </div>
    );
};
