/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Select from "react-select";
import { X, Loader2 } from "lucide-react";
import { InputField } from "@common/components/InputField";
import { useHotelByManager } from "@common/hooks/useHotels";
import { useMyHotelBranchs } from "@common/hooks/useHotelBranch";
import { useApiErrors } from "@common/hooks/useApiErrors";
import { DiscountType } from "@common/enums/DiscountType";
import type { VoucherRequest } from "@common/interfaces/request/VoucherRequest";
import { useCreateVoucherMutation } from "@common/hooks/useVouchers";
import { BranchStatus } from "@common/enums/BranchStatus";
import { Button } from "@common/components/ui/button";

type SelectOption = { value: number; label: string };

const rsStyles = {
  control: (base: object, s: { isFocused: boolean; isDisabled: boolean }) => ({
    ...base,
    borderColor: s.isFocused ? "var(--primary)" : "var(--input)",
    backgroundColor: "var(--background)",
    boxShadow: s.isFocused ? "0 0 0 1px var(--primary)" : "none",
    borderRadius: "0.5rem",
    padding: "2px 0",
    opacity: s.isDisabled ? 0.5 : 1,
    "&:hover": { borderColor: "var(--primary)" },
  }),
  placeholder: (base: object) => ({
    ...base,
    color: "var(--muted-foreground)",
    fontSize: "0.875rem",
  }),
  singleValue: (base: object) => ({ ...base, fontSize: "0.875rem", color: "var(--foreground)" }),
  option: (base: object, s: { isSelected: boolean; isFocused: boolean }) => ({
    ...base,
    fontSize: "0.875rem",
    backgroundColor: s.isSelected
      ? "var(--primary)"
      : s.isFocused
        ? "var(--muted)"
        : "var(--background)",
    color: s.isSelected ? "var(--primary-foreground)" : "var(--foreground)",
  }),
  menu: (base: object) => ({
    ...base,
    backgroundColor: "var(--background)",
    border: "1px solid var(--border)",
  }),
  menuPortal: (base: object) => ({ ...base, zIndex: 9999 }),
};

const initForm: VoucherRequest = {
  code: "",
  title: "",
  description: "",
  discountType: DiscountType.PERCENTAGE,
  discountValue: 0,
  minOrderValue: 0,
  maxDiscountAmount: 0,
  hotelBranchId: 0,
  totalUsageLimit: 1,
  usageLimitPerUser: 1,
  startDate: "",
  expiryDate: "",
  isWelcomeVoucher: false,
};

export default function VoucherFormAdd({
  onClose,
  isOpen,
}: {
  onClose: () => void;
  isOpen: boolean;
}) {
  const { data: hotel } = useHotelByManager();
  const { data: branches, isLoading: loadingBranches } = useMyHotelBranchs(
    hotel?.id ?? 0,
    BranchStatus.CONFIRMED
  );

  const [formData, setFormData] = useState<VoucherRequest>(initForm);
  const [selectedBranch, setSelectedBranch] = useState<SelectOption | null>(null);

  const { mutateAsync: addVoucher, isPending } = useCreateVoucherMutation(formData);
  const { fieldErrors, handleApiErrors, clearFieldError, clearAllErrors } = useApiErrors();

  if (!isOpen) return null;

  const branchOptions: SelectOption[] =
    branches?.map((b) => ({ value: b.id, label: b.hotelBranchName })) ?? [];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    if (
      [
        "discountValue",
        "minOrderValue",
        "maxDiscountAmount",
        "totalUsageLimit",
        "usageLimitPerUser",
      ].includes(name)
    ) {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    clearFieldError(name);
  };

  const handleBranchChange = (option: SelectOption | null) => {
    setSelectedBranch(option);
    setFormData((prev) => ({ ...prev, hotelBranchId: option?.value ?? 0 }));
    clearFieldError("hotelBranchId");
  };

  const handleClose = () => {
    clearAllErrors();
    onClose();
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearAllErrors();
    try {
      await addVoucher();
      setFormData(initForm);
      setSelectedBranch(null);
      onClose();
    } catch (error: any) {
      const serverResponse = error?.response?.data?.errors;
      if (serverResponse) handleApiErrors(serverResponse);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="bg-card text-foreground rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/50 shrink-0">
          <h2 className="text-xl font-semibold text-foreground">
            Thêm Voucher mới
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground hover:bg-muted p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
            <InputField
              label="Mã Voucher (Code)"
              name="code"
              value={formData.code}
              onChange={handleChange}
              error={fieldErrors.code}
              placeholder="VD: SUMMER2026"
              required
            />

            <InputField
              label="Tên Voucher"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={fieldErrors.title}
              placeholder="VD: Khuyến mãi hè 2026"
              required
            />

            <div className="mb-4">
              <label className="block text-sm mb-2">
                Loại giảm giá <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleChange}
                  className={`w-full box-border px-4 py-3 border ${fieldErrors.discountType ? "border-red-500" : "border-input"} rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-background text-foreground appearance-none`}
                  required
                >
                  <option value={DiscountType.PERCENTAGE}>Giảm theo %</option>
                  <option value={DiscountType.FIXED}>Giảm tiền trực tiếp (VNĐ)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              {fieldErrors.discountType && (
                <p className="text-xs text-red-500 mt-1">
                  {fieldErrors.discountType}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-2">
                Chi nhánh <span className="text-red-500">*</span>
              </label>
              <Select<SelectOption>
                options={branchOptions}
                value={selectedBranch}
                onChange={handleBranchChange}
                isLoading={loadingBranches}
                placeholder="Chọn chi nhánh..."
                noOptionsMessage={() => "Không tìm thấy"}
                loadingMessage={() => "Đang tải..."}
                styles={rsStyles}
                menuPortalTarget={document.body}
                required
              />
              {fieldErrors.hotelBranchId && (
                <p className="text-xs text-red-500 mt-1">
                  {fieldErrors.hotelBranchId}
                </p>
              )}
            </div>

            <InputField
              label="Mức giảm"
              name="discountValue"
              type="number"
              value={formData.discountValue.toString()}
              error={fieldErrors.discountValue}
              placeholder="VD: 10 (%) hoặc 50000 (VNĐ)"
              min={0}
              onChange={handleChange}
              required
            />

            <InputField
              label="Đơn hàng tối thiểu (VNĐ)"
              name="minOrderValue"
              type="number"
              value={formData.minOrderValue.toString()}
              error={fieldErrors.minOrderValue}
              placeholder="VD: 500000"
              min={0}
              onChange={handleChange}
              required
            />

            {formData.discountType === DiscountType.PERCENTAGE && (
              <InputField
                label="Giảm tối đa (VNĐ)"
                name="maxDiscountAmount"
                type="number"
                value={formData.maxDiscountAmount?.toString() || "0"}
                error={fieldErrors.maxDiscountAmount}
                placeholder="VD: 100000"
                min={0}
                onChange={handleChange}
              />
            )}

            <InputField
              label="Tổng lượt sử dụng"
              name="totalUsageLimit"
              type="number"
              value={formData.totalUsageLimit.toString()}
              error={fieldErrors.totalUsageLimit}
              placeholder="VD: 100"
              min={1}
              onChange={handleChange}
              required
            />

            <InputField
              label="Lượt dùng mỗi người"
              name="usageLimitPerUser"
              type="number"
              value={formData.usageLimitPerUser.toString()}
              error={fieldErrors.usageLimitPerUser}
              placeholder="VD: 1"
              min={1}
              onChange={handleChange}
              required
            />

            <InputField
              label="Ngày bắt đầu"
              name="startDate"
              type="datetime-local"
              value={formData.startDate}
              error={fieldErrors.startDate}
              onChange={handleChange}
              required
            />

            <InputField
              label="Ngày hết hạn"
              name="expiryDate"
              type="datetime-local"
              value={formData.expiryDate}
              error={fieldErrors.expiryDate}
              onChange={handleChange}
              required
            />
            
            <div className="mb-4 flex items-center col-span-1 md:col-span-2 mt-4">
              <input
                type="checkbox"
                id="isWelcomeVoucher"
                name="isWelcomeVoucher"
                checked={formData.isWelcomeVoucher}
                onChange={(e) => setFormData(prev => ({ ...prev, isWelcomeVoucher: e.target.checked }))}
                className="w-4 h-4 text-primary bg-background border-input rounded focus:ring-primary focus:ring-2"
              />
              <label htmlFor="isWelcomeVoucher" className="ml-2 text-sm font-medium text-foreground">
                Là voucher chào mừng (Tự động tặng cho người dùng mới đăng ký, chỉ sử dụng cho đơn đặt phòng đầu tiên)
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2">Mô tả Voucher</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Mô tả các điều kiện, hướng dẫn sử dụng voucher..."
              rows={4}
              className={`w-full box-border px-4 py-3 border ${fieldErrors.description ? "border-red-500" : "border-input"} rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none text-sm bg-background text-foreground`}
            />
            {fieldErrors.description && (
              <p className="text-xs text-red-500 mt-1">
                {fieldErrors.description}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              type="button"
              onClick={handleClose}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isPending ? "Đang tạo..." : "Thêm Voucher mới"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
