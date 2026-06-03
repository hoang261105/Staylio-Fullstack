/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { InputField } from "../../../common/components/InputField";
import { Search } from "lucide-react";
import { BookingStatus } from "../../../common/enums/BookingStatus";
import { bookingStatusLabels } from "../../../common/utils/booking.util";
import BookingHistoryListView from "../components/bookings/BookingHistoryListView";
import Pagination from "../../../common/components/Pagination";
import { useHistoryBookings, useUpdateStatusBookingMutation } from "../../../common/hooks/useBookings";
import { useDebounce } from "../../../common/hooks/useDebounce";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const STATUS_OPTIONS = [
    { value: "", label: "Tất cả" },
    { value: BookingStatus.PENDING_PAYMENT, label: bookingStatusLabels[BookingStatus.PENDING_PAYMENT] },
    { value: BookingStatus.PAID, label: bookingStatusLabels[BookingStatus.PAID] },
    { value: BookingStatus.CONFIRMED, label: bookingStatusLabels[BookingStatus.CONFIRMED] },
    { value: BookingStatus.CHECKED_IN, label: bookingStatusLabels[BookingStatus.CHECKED_IN] },
    { value: BookingStatus.CHECKED_OUT, label: bookingStatusLabels[BookingStatus.CHECKED_OUT] },
    { value: BookingStatus.CANCELLED, label: bookingStatusLabels[BookingStatus.CANCELLED] },
    { value: BookingStatus.REFUNDED, label: bookingStatusLabels[BookingStatus.REFUNDED] },
];

export default function BookingHistory() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<string>("");
    const [page, setPage] = useState(0);

    const debouncedSearch = useDebounce(search, 500);

    const { data: response, isLoading } = useHistoryBookings({
        search: debouncedSearch,
        status: status || undefined,
        page,
        size: 5,
        sortBy: "createdAt",
        direction: "desc"
    });

    const [selectedBookingId, setSelectedBookingId] = useState<number>(0);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState("");

    const updateStatusMutate = useUpdateStatusBookingMutation(selectedBookingId);
    const queryClient = useQueryClient();

    const handleCancelClick = (bookingId: number) => {
        setSelectedBookingId(bookingId);
        setCancelReason("");
        setIsCancelModalOpen(true);
    };

    const submitCancel = () => {
        if (!cancelReason.trim()) {
            toast.error("Lý do hủy không được để trống!");
            return;
        }

        updateStatusMutate.mutate(
            { status: BookingStatus.CANCELLED, cancellationReason: cancelReason.trim() },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["historyBookings"] });
                    setIsCancelModalOpen(false);
                    setCancelReason("");
                    setSelectedBookingId(0);
                }
            }
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <Header />

            <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Lịch sử đặt phòng</h1>

                {/* Filters */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 space-y-4">
                    <div className="max-w-md">
                        <InputField
                            label=""
                            icon={Search}
                            placeholder="Tìm theo mã đơn, tên phòng, chi nhánh..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(0);
                            }}
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {STATUS_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => {
                                    setStatus(opt.value);
                                    setPage(0);
                                }}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${status === opt.value
                                        ? "bg-[#0066FF] text-white border-[#0066FF]"
                                        : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List View */}
                <BookingHistoryListView
                    bookings={response?.items || []}
                    isLoading={isLoading}
                    onCancel={handleCancelClick}
                />

                {/* Pagination */}
                {response?.pagination && (
                    <div className="mt-6 flex justify-end">
                        <Pagination
                            page={page}
                            totalPages={response.pagination.totalPages}
                            onChange={setPage}
                        />
                    </div>
                )}
            </main>

            {/* Cancel Modal */}
            {isCancelModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-md mx-4 shadow-xl">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Hủy đơn đặt phòng</h3>
                        <p className="text-sm text-gray-500 mb-4">Bạn chắc chắn muốn hủy đơn đặt phòng này? Vui lòng cung cấp lý do hủy để chúng tôi hỗ trợ tốt hơn.</p>
                        
                        <InputField
                            label="Lý do hủy"
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="Nhập lý do hủy của bạn..."
                            required
                        />

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setIsCancelModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Đóng
                            </button>
                            <button
                                onClick={submitCancel}
                                disabled={updateStatusMutate.isPending}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {updateStatusMutate.isPending ? "Đang xử lý..." : "Xác nhận hủy"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
