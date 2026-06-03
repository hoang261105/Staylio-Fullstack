/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from "react";
import { Search, Filter, Plus } from "lucide-react";
import ManagerLayout from "../layout/ManagerLayout";
import { useHotelByManager } from "@common/hooks/useHotels";
import { useMyHotelBranchs } from "@common/hooks/useHotelBranch";
import VoucherListView from "../components/vouchers/VoucherListView";
import { VoucherStatus } from "../../../common/enums/VoucherStatus";
import { useDebounce } from "@common/hooks/useDebounce";
import type { VoucherResponse } from "@common/interfaces/response/VoucherResponse";
import { useVouchers, useVoucherById } from "@common/hooks/useVouchers";
import VoucherDetailModal from "../components/vouchers/VoucherDetailModal";
import VoucherFormAdd from "../components/vouchers/VoucherFormAdd";
import VoucherFormUpdate from "../components/vouchers/VoucherFormUpdate";
import VoucherToggleStatusModal from "../components/vouchers/VoucherToggleStatusModal";
import VoucherDeleteModal from "../components/vouchers/VoucherDeleteModal";
import { BranchStatus } from "@common/enums/BranchStatus";

const SORT_OPTIONS = [
    { value: "id", label: "Mặc định" },
    { value: "title", label: "Tên Voucher (Title)" },
    { value: "code", label: "Mã (Code)" },
];

export default function ManagerVoucher() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [selectedBranchFilter, setSelectedBranchFilter] =
        useState<string>("all");
    const [page, setPage] = useState(0);

    const { data: hotel } = useHotelByManager();
    const { data: hotelBranches } = useMyHotelBranchs(hotel?.id || 0, BranchStatus.CONFIRMED);

    const [sortBy, setSortBy] = useState("id");
    const [direction, setDirection] = useState<"asc" | "desc">("asc");

    const [selectedVoucher, setSelectedVoucher] =
        useState<VoucherResponse | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [voucherToToggle, setVoucherToToggle] =
        useState<VoucherResponse | null>(null);
    const [voucherToDelete, setVoucherToDelete] =
        useState<VoucherResponse | null>(null);
    const [voucherToEdit, setVoucherToEdit] =
        useState<VoucherResponse | null>(null);

    const debouncedSearch = useDebounce(searchQuery, 500);

    const { data: vouchers, isLoading } = useVouchers({
        search: debouncedSearch || undefined,
        status:
            selectedFilter === "all" ? undefined : (selectedFilter as VoucherStatus),
        hotelBranchId: !selectedBranchFilter || selectedBranchFilter === "all" ? undefined : Number(selectedBranchFilter),
        page,
        size: 5,
        sortBy: sortBy === "id" ? undefined : sortBy,
        direction: sortBy === "id" ? undefined : direction,
    });

    const { data: voucherDetails } = useVoucherById(selectedVoucher?.id || 0);

    const filters = [
        { value: "all", label: "Tất cả trạng thái" },
        { value: VoucherStatus.ACTIVE, label: "Đang hoạt động" },
        { value: VoucherStatus.EXPIRED, label: "Đã hết hạn" },
        { value: VoucherStatus.DISABLED, label: "Đã vô hiệu hóa" },
    ];

    const handleView = (voucher: VoucherResponse) => {
        setSelectedVoucher(voucher);
    };

    const handleEdit = (voucher: VoucherResponse) => {
        setIsUpdateModalOpen(true);
        setVoucherToEdit(voucher);
    };

    const handleToggleActive = (voucher: VoucherResponse) => {
        setVoucherToToggle(voucher);
    };

    const handleDelete = (voucher: VoucherResponse) => {
        setVoucherToDelete(voucher);
    };

    return (
        <ManagerLayout>
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Quản lý Voucher
                        </h1>
                        <p className="text-gray-500">
                            Danh sách tất cả các voucher khuyến mãi của bạn
                        </p>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#0066FF] text-white rounded-xl hover:bg-[#0052CC] shadow-sm shadow-[#0066FF]/20 font-medium transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Thêm voucher mới</span>
                    </button>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col gap-4">
                    <div className="w-full relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên voucher, mã code..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setPage(0);
                            }}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 focus:bg-white transition-all"
                        />
                    </div>

                    <div className="flex flex-col lg:flex-row flex-wrap gap-4">
                        <div className="relative min-w-48 lg:flex-1 xl:flex-none">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select
                                value={selectedBranchFilter}
                                onChange={(e) => {
                                    setSelectedBranchFilter(e.target.value);
                                    setPage(0);
                                }}
                                className="w-full pl-12 pr-8 py-3 bg-gray-50 border border-transparent rounded-xl appearance-none focus:outline-none focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 focus:bg-white transition-all cursor-pointer font-medium text-gray-700 truncate"
                            >
                                <option value="all">Tất cả chi nhánh</option>
                                {hotelBranches?.map((branch) => (
                                    <option key={branch.id} value={branch.id}>
                                        {branch.hotelBranchName}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                <svg
                                    className="fill-current h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                            </div>
                        </div>

                        <div className="relative min-w-48 lg:flex-1 xl:flex-none">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select
                                value={selectedFilter}
                                onChange={(e) => {
                                    setSelectedFilter(e.target.value);
                                    setPage(0);
                                }}
                                className="w-full pl-12 pr-8 py-3 bg-gray-50 border border-transparent rounded-xl appearance-none focus:outline-none focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 focus:bg-white transition-all cursor-pointer font-medium text-gray-700 truncate"
                            >
                                {filters.map((filter) => (
                                    <option key={filter.value} value={filter.value}>
                                        {filter.label}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                <svg
                                    className="fill-current h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                            </div>
                        </div>

                        <div className="flex gap-2 w-full lg:w-auto xl:ml-auto">
                            <div className="relative flex-1 lg:flex-none min-w-48">
                                <select
                                    value={sortBy}
                                    onChange={(e) => {
                                        setSortBy(e.target.value);
                                        setPage(0);
                                    }}
                                    className="w-full pl-4 pr-8 py-3 bg-gray-50 border border-transparent rounded-xl appearance-none focus:outline-none focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 focus:bg-white transition-all cursor-pointer font-medium text-gray-700 truncate"
                                >
                                    {SORT_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            Sắp xếp theo {opt.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                    <svg
                                        className="fill-current h-4 w-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setDirection(direction === "asc" ? "desc" : "asc");
                                    setPage(0);
                                }}
                                className="px-4 py-3 bg-gray-50 border border-transparent rounded-xl hover:bg-gray-100 text-gray-700 font-medium transition-colors whitespace-nowrap"
                            >
                                {direction === "asc" ? "↑ Tăng dần" : "↓ Giảm dần"}
                            </button>
                        </div>
                    </div>
                </div>

                <VoucherListView
                    vouchers={vouchers?.items || []}
                    isLoading={isLoading}
                    totalElements={vouchers?.pagination?.totalItems || 0}
                    totalPages={vouchers?.pagination?.totalPages || 0}
                    currentPage={page}
                    onPageChange={setPage}
                    onView={handleView}
                    onEdit={handleEdit}
                    onToggleActive={handleToggleActive}
                    onDelete={handleDelete}
                />
            </div>

            {selectedVoucher && (
                <VoucherDetailModal
                    voucher={voucherDetails || null}
                    onClose={() => setSelectedVoucher(null)}
                />
            )}

            <VoucherFormAdd
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />

            <VoucherFormUpdate
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                voucher={voucherToEdit}
            />

            {voucherToToggle && (
                <VoucherToggleStatusModal
                    voucher={voucherToToggle}
                    onClose={() => setVoucherToToggle(null)}
                />
            )}

            {voucherToDelete && (
                <VoucherDeleteModal
                    voucher={voucherToDelete}
                    onClose={() => setVoucherToDelete(null)}
                />
            )}
        </ManagerLayout>
    );
}
