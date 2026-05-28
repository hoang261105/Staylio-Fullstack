import { useState, useEffect } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { RoomInfoCard } from "../components/booking/RoomInfoCard";
import { StayInfoCard } from "../components/booking/StayInfoCard";
import { VoucherSelector } from "../components/booking/VoucherSelector";
import { PaymentMethodSelector } from "../components/booking/PaymentMethodSelector";
import { PriceBreakdownCard } from "../components/booking/PriceBreakdownCard";
import { useRoomById } from "../../../common/hooks/useRooms";
import { useHotelBranchById } from "../../../common/hooks/useHotelBranch";
import { usePreviewBookingMutation, useCreateBookingMutation } from "../../../common/hooks/useBookings";
import toast from "react-hot-toast";
import { PaymentMethod } from "../../../common/enums/PaymentMethod";

interface BookingState {
    roomId: number;
    checkInDate: string;
    checkOutDate: string;
    adults: number;
    children: number;
}

export default function BookingConfirmation() {
    const location = useLocation();
    const navigate = useNavigate();
    const bookingState = location.state as BookingState | null;

    if (!bookingState) {
        return <Navigate to="/" replace />;
    }

    const { roomId, checkInDate, checkOutDate, adults, children } = bookingState;

    const [note, setNote] = useState("");
    const [userVoucherId, setUserVoucherId] = useState<number | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");
    const [paymentError, setPaymentError] = useState("");

    const { data: room } = useRoomById(roomId);
    const { data: branch } = useHotelBranchById(room?.hotelBranchId || 0);

    const { mutate: previewBooking, data: previewResponse, isPending: isLoadingPreview } = usePreviewBookingMutation();
    const { mutate: createBooking, isPending: isSubmitting } = useCreateBookingMutation();

    const previewData = previewResponse?.data;

    useEffect(() => {
        previewBooking({
            roomId,
            checkInDate,
            checkOutDate,
            adults,
            children,
            userVoucherId,
            note: "",
            paymentMethod: PaymentMethod.CASH // dummy for preview
        });
    }, [roomId, checkInDate, checkOutDate, adults, children, userVoucherId, previewBooking]);

    const handleSubmit = () => {
        if (!paymentMethod) {
            setPaymentError("Vui lòng chọn phương thức thanh toán");
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            return;
        }

        setPaymentError("");

        createBooking({
            roomId,
            checkInDate,
            checkOutDate,
            adults,
            children,
            userVoucherId,
            note,
            paymentMethod
        }, {
            onSuccess: (response) => {
                // If the response contains a payment URL, redirect to it
                // We might need to check if the response data has paymentUrl
                const data = response.data as any;
                if (data?.paymentUrl) {
                    window.location.href = data.paymentUrl;
                } else {
                    // Navigate to booking success or history page
                    navigate("/bookings", { replace: true });
                }
            },
            onError: (error: any) => {
                toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi đặt phòng");
            }
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <Header />

            <div className="bg-blue-600 pt-28 pb-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center text-blue-100 hover:text-white mb-4 transition-colors font-medium text-sm gap-1"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Quay lại
                    </button>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 mt-2">Xác nhận đặt phòng</h1>
                    <p className="text-blue-100">
                        Vui lòng kiểm tra lại thông tin và chọn phương thức thanh toán.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column */}
                    <div className="flex-1 max-w-3xl">
                        <RoomInfoCard room={room} branch={branch} />

                        <StayInfoCard
                            checkInDate={checkInDate}
                            checkOutDate={checkOutDate}
                            adults={adults}
                            children={children}
                            note={note}
                            setNote={setNote}
                        />

                        {room && branch && (
                            <VoucherSelector
                                selectedVoucherId={userVoucherId}
                                onSelectVoucher={setUserVoucherId}
                                roomId={roomId}
                                checkInDate={checkInDate}
                                checkOutDate={checkOutDate}
                            />
                        )}

                        <PaymentMethodSelector
                            selectedMethod={paymentMethod}
                            onChange={(m) => {
                                setPaymentMethod(m);
                                setPaymentError("");
                            }}
                            error={paymentError}
                        />
                    </div>

                    {/* Right Column - Sticky */}
                    <div className="w-full lg:w-[400px] shrink-0">
                        <PriceBreakdownCard
                            previewData={previewData}
                            isLoadingPreview={isLoadingPreview}
                            isSubmitting={isSubmitting}
                            onSubmit={handleSubmit}
                        />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
