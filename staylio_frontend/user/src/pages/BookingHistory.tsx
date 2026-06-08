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
import { useTranslation } from "react-i18next";

export default function BookingHistory() {
    const { t } = useTranslation();
    const STATUS_OPTIONS = [
        { value: "", label: t('bookingHistory.allStatuses') },
        { value: BookingStatus.PENDING_PAYMENT, label: t(`bookingStatus.${BookingStatus.PENDING_PAYMENT}`, bookingStatusLabels[BookingStatus.PENDING_PAYMENT]) },
        { value: BookingStatus.PAID, label: t(`bookingStatus.${BookingStatus.PAID}`, bookingStatusLabels[BookingStatus.PAID]) },
        { value: BookingStatus.CONFIRMED, label: t(`bookingStatus.${BookingStatus.CONFIRMED}`, bookingStatusLabels[BookingStatus.CONFIRMED]) },
        { value: BookingStatus.CHECKED_IN, label: t(`bookingStatus.${BookingStatus.CHECKED_IN}`, bookingStatusLabels[BookingStatus.CHECKED_IN]) },
        { value: BookingStatus.CHECKED_OUT, label: t(`bookingStatus.${BookingStatus.CHECKED_OUT}`, bookingStatusLabels[BookingStatus.CHECKED_OUT]) },
        { value: BookingStatus.CANCELLED, label: t(`bookingStatus.${BookingStatus.CANCELLED}`, bookingStatusLabels[BookingStatus.CANCELLED]) },
        { value: BookingStatus.REFUNDED, label: t(`bookingStatus.${BookingStatus.REFUNDED}`, bookingStatusLabels[BookingStatus.REFUNDED]) },
    ];

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
            toast.error(t('bookingHistory.cancelReasonEmpty'));
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
        <div className="min-h-screen bg-slate-50 dark:bg-gray-900 font-sans flex flex-col">
            <Header />

            <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('bookingHistory.title')}</h1>

                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 space-y-4">
                    <div className="max-w-md">
                        <InputField
                            label=""
                            icon={Search}
                            placeholder={t('bookingHistory.searchPlaceholder')}
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
                                        : "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:bg-gray-700"
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
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-md mx-4 shadow-xl">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('bookingHistory.cancelBookingTitle')}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mb-4">{t('bookingHistory.cancelBookingDesc')}</p>
                        
                        <InputField
                            label={t('bookingHistory.cancelReasonLabel')}
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder={t('bookingHistory.cancelReasonPlaceholder')}
                            required
                        />

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setIsCancelModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:bg-gray-700 rounded-lg transition-colors"
                            >
                                {t('bookingHistory.close')}
                            </button>
                            <button
                                onClick={submitCancel}
                                disabled={updateStatusMutate.isPending}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {updateStatusMutate.isPending ? t('bookingHistory.processing') : t('bookingHistory.confirmCancel')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
