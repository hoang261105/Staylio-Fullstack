/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from "react";
import Select from "react-select";
import { X, Loader2, ImagePlus, Trash2 } from "lucide-react";
import { InputField } from "@common/components/InputField";
import { useUpdateHotelBranch } from "@common/hooks/useHotelBranch";
import { useProvinces, useWardsByProvinceId } from "@common/hooks/useProvinces";
import { useHotelByManager } from "@common/hooks/useHotels";
import { useDebounce } from "@common/hooks/useDebounce";
import { useApiErrors } from "@common/hooks/useApiErrors";
import type { HotelBranchRequest } from "@common/interfaces/request/HotelBranchRequest";
import type { HotelBranchResponse } from "@common/interfaces/response/HotelBranchResponse";
import { uploadToCloudinary } from "@common/utils/cloudinary";
import LocationPickerMap from "./LocationPickerMap";

type SelectOption = { value: number; label: string };

const rsStyles = {
  control: (base: object, s: { isFocused: boolean; isDisabled: boolean }) => ({
    ...base,
    borderColor: s.isFocused ? "#0066FF" : "#D1D5DB",
    boxShadow: s.isFocused ? "0 0 0 1px #0066FF" : "none",
    borderRadius: "0.5rem",
    padding: "2px 0",
    opacity: s.isDisabled ? 0.5 : 1,
    "&:hover": { borderColor: "#0066FF" },
  }),
  placeholder: (base: object) => ({ ...base, color: "#9CA3AF", fontSize: "0.875rem" }),
  singleValue: (base: object) => ({ ...base, fontSize: "0.875rem" }),
  option: (base: object, s: { isSelected: boolean; isFocused: boolean }) => ({
    ...base,
    fontSize: "0.875rem",
    backgroundColor: s.isSelected ? "#0066FF" : s.isFocused ? "#EFF6FF" : "white",
    color: s.isSelected ? "white" : "#111827",
  }),
  menuPortal: (base: object) => ({ ...base, zIndex: 9999 }),
};

export default function HotelBranchFormUpdate({
  branch,
  onClose,
}: {
  branch: HotelBranchResponse;
  onClose: () => void;
}) {
  const { data: hotel } = useHotelByManager();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<HotelBranchRequest>({
    branchName: branch.hotelBranchName,
    address: branch.address,
    wardId: branch.wardId,
    phone: branch.phone,
    description: branch.description,
    capacity: branch.capacity,
    imageUrl: branch.imageUrl || "",
    hotelId: null,
    latitude: branch.latitude,
    longitude: branch.longitude,
  });

  const [selectedProvince, setSelectedProvince] = useState<SelectOption | null>({
    value: branch.provinceId,
    label: branch.provinceName,
  });
  const [selectedWard, setSelectedWard] = useState<SelectOption | null>({
    value: branch.wardId,
    label: branch.wardName,
  });
  
  const [provinceSearch, setProvinceSearch] = useState("");
  const [wardSearch, setWardSearch] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(branch.imageUrl || null);
  const [isUploading, setIsUploading] = useState(false);

  const debouncedProvinceSearch = useDebounce(provinceSearch, 400);
  const debouncedWardSearch = useDebounce(wardSearch, 400);

  const { mutateAsync: updateHotelBranch, isPending } = useUpdateHotelBranch(branch.id, {
    ...formData,
    hotelId: hotel?.id ?? null,
  });
  const { fieldErrors, handleApiErrors, clearFieldError, clearAllErrors } = useApiErrors();

  const { data: provinces, isLoading: loadingProvinces } = useProvinces({
    search: debouncedProvinceSearch || undefined,
  });
  const { data: wards, isLoading: loadingWards } = useWardsByProvinceId(
    selectedProvince?.value ?? 0,
    { search: debouncedWardSearch || undefined },
  );

  const provinceOptions: SelectOption[] =
    provinces?.map((p: { id: number; provinceName: string }) => ({ value: p.id, label: p.provinceName })) ?? [];
  const wardOptions: SelectOption[] =
    wards?.map((w: { id: number; wardName: string }) => ({ value: w.id, label: w.wardName })) ?? [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    clearFieldError(e.target.name);
  };

  const handleProvinceChange = (option: SelectOption | null) => {
    setSelectedProvince(option);
    setSelectedWard(null);
    setWardSearch("");
    setFormData((prev) => ({ ...prev, wardId: null }));
  };

  const handleWardChange = (option: SelectOption | null) => {
    setSelectedWard(option);
    setFormData((prev) => ({ ...prev, wardId: option?.value ?? null }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setIsUploading(true);

    try {
      const url = await uploadToCloudinary(file);
      setFormData((prev) => ({ ...prev, imageUrl: url }));
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
      setImagePreview(branch.imageUrl || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearAllErrors();
    try {
      await updateHotelBranch();
      onClose();
    } catch (error: any) {
      const serverResponse = error?.response?.data?.errors;
      if (serverResponse) handleApiErrors(serverResponse);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50/50 shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">Cập nhật chi nhánh</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
            <InputField label="Tên chi nhánh" name="branchName" value={formData.branchName}
              onChange={handleChange} error={fieldErrors.branchName} placeholder="VD: Staylio Hà Nội - Hoàn Kiếm" required />

            <InputField label="Số điện thoại" name="phone" type="tel" value={formData.phone}
              onChange={handleChange} error={fieldErrors.phone} placeholder="VD: 0912345678" />

            <InputField label="Địa chỉ" name="address" value={formData.address}
              onChange={handleChange} error={fieldErrors.address} placeholder="Số nhà, tên đường..." required />

            <InputField label="Sức chứa (người)" name="capacity" type="number"
              value={formData.capacity?.toString() ?? ""} error={fieldErrors.capacity} placeholder="VD: 100" min={1}
              onChange={(e) => { setFormData((p) => ({ ...p, capacity: e.target.value ? Number(e.target.value) : null })); clearFieldError("capacity"); }} />

            <div className="mb-4">
              <label className="block text-sm mb-2">Tỉnh / Thành phố <span className="text-red-500">*</span></label>
              <Select<SelectOption>
                options={provinceOptions} value={selectedProvince} onChange={handleProvinceChange}
                onInputChange={setProvinceSearch} inputValue={provinceSearch}
                isLoading={loadingProvinces} placeholder="Tìm tỉnh/thành phố..."
                noOptionsMessage={() => "Không tìm thấy"} loadingMessage={() => "Đang tải..."}
                styles={rsStyles} menuPortalTarget={document.body} required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-2">Xã / Phường <span className="text-red-500">*</span></label>
              <Select<SelectOption>
                options={wardOptions} value={selectedWard} onChange={handleWardChange}
                onInputChange={setWardSearch} inputValue={wardSearch}
                isLoading={loadingWards && !!selectedProvince} isDisabled={!selectedProvince}
                placeholder={selectedProvince ? "Tìm xã/phường..." : "Chọn tỉnh/thành trước"}
                noOptionsMessage={() => "Không tìm thấy"} loadingMessage={() => "Đang tải..."}
                styles={rsStyles} menuPortalTarget={document.body} required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2">Hình ảnh chi nhánh</label>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="branch-image-upload-update" />
            {imagePreview ? (
              <div className="relative w-full rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                <img src={imagePreview} alt="preview" className="w-full max-h-75 object-contain" />
                {isUploading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
                <button type="button" onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label htmlFor="branch-image-upload-update"
                className="flex flex-col items-center justify-center gap-2 w-full h-44 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#0066FF] hover:bg-blue-50/30 transition-colors">
                <ImagePlus className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-500">Nhấn để chọn ảnh</span>
                <span className="text-xs text-gray-400">PNG, JPG, WEBP tối đa 5MB</span>
              </label>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2">Mô tả</label>
            <textarea name="description" value={formData.description} onChange={handleChange}
              placeholder="Mô tả ngắn về chi nhánh..." rows={3}
              className="w-full box-border px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0066FF] transition-colors resize-none text-sm" />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Vị trí trên bản đồ <span className="text-red-500">*</span></label>
            <p className="text-xs text-gray-500 mb-3">Nhấp vào bản đồ để cập nhật vị trí ghim của chi nhánh.</p>
            <LocationPickerMap
              latitude={formData.latitude}
              longitude={formData.longitude}
              onLocationSelect={(lat, lng) => setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }))}
            />
            {(!formData.latitude || !formData.longitude) && <p className="text-xs text-red-500 mt-1">Vui lòng chọn vị trí trên bản đồ</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Hủy
            </button>
            <button type="submit" disabled={isPending || isUploading || !formData.latitude}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#0066FF] text-white font-medium rounded-lg hover:bg-[#0052CC] shadow-sm shadow-blue-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
              {(isPending || isUploading) && <Loader2 className="w-4 h-4 animate-spin" />}
              {isPending ? "Đang lưu..." : isUploading ? "Đang tải ảnh..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
