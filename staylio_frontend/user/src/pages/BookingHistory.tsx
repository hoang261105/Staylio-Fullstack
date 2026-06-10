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
import { Button } from "../../../common/components/ui/button";

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
        <div className="min-h-screen bg-background font-sans flex flex-col">
            <Header />

            <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-foreground mb-6">{t('bookingHistory.title')}</h1>

                {/* Filters */}
                <div className="bg-card p-4 rounded-2xl shadow-sm border border-border mb-6 space-y-4">
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
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-muted text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground"
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
                    <div className="bg-card p-6 rounded-2xl w-full max-w-md mx-4 shadow-xl border border-border">
                        <h3 className="text-xl font-bold text-card-foreground mb-4">{t('bookingHistory.cancelBookingTitle')}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{t('bookingHistory.cancelBookingDesc')}</p>

                        <InputField
                            label={t('bookingHistory.cancelReasonLabel')}
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder={t('bookingHistory.cancelReasonPlaceholder')}
                            required
                        />

                        <div className="flex justify-end gap-3 mt-6">
                            <Button
                                variant="outline"
                                onClick={() => setIsCancelModalOpen(false)}
                            >
                                {t('bookingHistory.close')}
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={submitCancel}
                                disabled={updateStatusMutate.isPending}
                            >
                                {updateStatusMutate.isPending ? t('bookingHistory.processing') : t('bookingHistory.confirmCancel')}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
