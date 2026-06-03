import { CreditCard, Wallet, Landmark, Banknote, ShieldCheck } from "lucide-react";
import { PaymentMethod } from "../../../../common/enums/PaymentMethod";

interface PaymentMethodSelectorProps {
    selectedMethod: PaymentMethod | "";
    onChange: (method: PaymentMethod) => void;
    error?: string;
}

const PAYMENT_OPTIONS = [
    {
        id: PaymentMethod.VNPAY,
        name: "VNPAY",
        description: "Thanh toán qua ví VNPAY hoặc thẻ nội địa/quốc tế",
        icon: <ShieldCheck className="w-6 h-6 text-blue-600" />
    },
    {
        id: PaymentMethod.MOMO,
        name: "Ví MoMo",
        description: "Quét mã QR qua ứng dụng MoMo",
        icon: <Wallet className="w-6 h-6 text-pink-600" />
    },
    {
        id: PaymentMethod.ZALOPAY,
        name: "ZaloPay",
        description: "Thanh toán tiện lợi bằng ZaloPay",
        icon: <Wallet className="w-6 h-6 text-blue-500" />
    },
    {
        id: PaymentMethod.BANK_TRANSFER,
        name: "Chuyển khoản ngân hàng",
        description: "Chuyển khoản trực tiếp tới tài khoản khách sạn",
        icon: <Landmark className="w-6 h-6 text-green-600" />
    },
    {
        id: PaymentMethod.CASH,
        name: "Thanh toán tại khách sạn",
        description: "Thanh toán bằng tiền mặt khi nhận phòng",
        icon: <Banknote className="w-6 h-6 text-yellow-600" />
    }
];

export const PaymentMethodSelector = ({ selectedMethod, onChange, error }: PaymentMethodSelectorProps) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-blue-600" />
                Phương thức thanh toán
            </h2>

            <div className="space-y-3">
                {PAYMENT_OPTIONS.map((option) => (
                    <label
                        key={option.id}
                        className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedMethod === option.id
                                ? "border-blue-600 bg-blue-50/50"
                                : "border-gray-100 hover:border-gray-200"
                            }`}
                    >
                        <div className="pt-0.5">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value={option.id}
                                checked={selectedMethod === option.id}
                                onChange={() => onChange(option.id)}
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-600"
                            />
                        </div>
                        <div className="shrink-0">
                            {option.icon}
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-gray-900">{option.name}</div>
                            <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                        </div>
                    </label>
                ))}
            </div>

            {error && <p className="text-red-500 text-sm mt-3 font-medium">{error}</p>}
        </div>
    );
};
