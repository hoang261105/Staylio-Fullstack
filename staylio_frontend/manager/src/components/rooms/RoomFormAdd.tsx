/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef } from "react";
import Select from "react-select";
import { X, Loader2, ImagePlus, Trash2, Star } from "lucide-react";
import { InputField } from "@common/components/InputField";
import { useHotelByManager } from "@common/hooks/useHotels";
import { useMyHotelBranchs } from "@common/hooks/useHotelBranch";
import { useCreateRoomMutation } from "@common/hooks/useRooms";
import { useAllUtilities } from "@common/hooks/useUtilities";
import { useApiErrors } from "@common/hooks/useApiErrors";
import { RoomType } from "@common/enums/RoomType";
import type { RoomRequest } from "@common/interfaces/request/RoomRequest";
import { uploadToCloudinary } from "@common/utils/cloudinary";
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

const initForm: RoomRequest = {
  roomName: "",
  roomType: RoomType.SINGLE,
  description: "",
  hotelBranchId: 0,
  price: 0,
  maxAdults: 2,
  maxChildren: 1,
  capacity: 2,
  adultPrice: 0,
  childPrice: 0,
  bedInfo: "",
  area: 0,
  roomNumber: "",
  floor: 1,
  utilityIds: [],
  imageUrls: [],
};

export default function RoomFormAdd({
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
  const { data: utilities, isLoading: loadingUtilities } = useAllUtilities();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<RoomRequest>(initForm);
  const [selectedBranch, setSelectedBranch] = useState<SelectOption | null>(
    null,
  );

  type ImageState = { id: string; url: string; preview: string; isUploading: boolean; isError?: boolean };
  const [images, setImages] = useState<ImageState[]>([]);

  const { mutateAsync: addRoom, isPending } = useCreateRoomMutation();
  const { fieldErrors, handleApiErrors, clearFieldError, clearAllErrors } =
    useApiErrors();

  if (!isOpen) return null;

  const branchOptions: SelectOption[] =
    branches?.map((b) => ({ value: b.id, label: b.hotelBranchName })) ?? [];

  const utilityOptions: SelectOption[] =
    utilities?.map((u: any) => ({ value: u.id, label: u.title })) ?? [];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    if (
      [
        "price",
        "maxAdults",
        "maxChildren",
        "capacity",
        "adultPrice",
        "childPrice",
        "area",
        "floor",
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

  const handleUtilitiesChange = (options: readonly SelectOption[]) => {
    setFormData((prev) => ({ ...prev, utilityIds: options.map((o) => o.value) }));
    clearFieldError("utilityIds");
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages: ImageState[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substring(7),
      url: "",
      preview: URL.createObjectURL(file),
      isUploading: true,
    }));

    setImages((prev) => [...prev, ...newImages]);

    Array.from(files).forEach(async (file, index) => {
      const imgId = newImages[index].id;
      try {
        const url = await uploadToCloudinary(file);
        setImages((prev) =>
          prev.map((img) => (img.id === imgId ? { ...img, url, isUploading: false } : img))
        );
      } catch (error) {
        console.error("Lỗi upload ảnh:", error);
        setImages((prev) =>
          prev.map((img) => (img.id === imgId ? { ...img, isUploading: false, isError: true } : img))
        );
      }
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveImage = (idToRemove: string) => {
    setImages((prev) => prev.filter((img) => img.id !== idToRemove));
  };

  const handleClose = () => {
    clearAllErrors();
    onClose();
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearAllErrors();
    try {
      const imageUrls = images.map(img => img.url).filter(url => url !== "");
      const payload: RoomRequest = { ...formData, imageUrls };
      
      await addRoom(payload);

      setFormData(initForm);
      setSelectedBranch(null);
      setImages([]);
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
            Thêm phòng mới
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
              label="Tên phòng"
              name="roomName"
              value={formData.roomName}
              onChange={handleChange}
              error={fieldErrors.roomName}
              placeholder="VD: Phòng Superior Giường Đôi"
              required
            />

            <InputField
              label="Số phòng"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              error={fieldErrors.roomNumber}
              placeholder="VD: 101"
              required
            />

            <div className="mb-4">
              <label className="block text-sm mb-2">
                Loại phòng <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  className={`w-full box-border px-4 py-3 border ${fieldErrors.roomType ? "border-red-500" : "border-input"} rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-background text-foreground appearance-none`}
                  required
                >
                  <option value={RoomType.SINGLE}>Phòng đơn (Single)</option>
                  <option value={RoomType.DOUBLE}>Phòng đôi (Double)</option>
                  <option value={RoomType.SUITE}>Phòng Suite</option>
                  <option value={RoomType.VIP}>Phòng VIP</option>
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
              {fieldErrors.roomType && (
                <p className="text-xs text-red-500 mt-1">
                  {fieldErrors.roomType}
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
              label="Số người lớn tối đa"
              name="maxAdults"
              type="number"
              value={formData.maxAdults.toString()}
              error={fieldErrors.maxAdults}
              placeholder="VD: 2"
              min={1}
              onChange={handleChange}
              required
            />

            <InputField
              label="Số trẻ em tối đa"
              name="maxChildren"
              type="number"
              value={formData.maxChildren.toString()}
              error={fieldErrors.maxChildren}
              placeholder="VD: 1"
              min={0}
              onChange={handleChange}
              required
            />

            <InputField
              label="Phụ phí người lớn (VNĐ)"
              name="adultPrice"
              type="number"
              value={formData.adultPrice.toString()}
              error={fieldErrors.adultPrice}
              placeholder="VD: 100000"
              min={0}
              onChange={handleChange}
            />

            <InputField
              label="Phụ phí trẻ em (VNĐ)"
              name="childPrice"
              type="number"
              value={formData.childPrice.toString()}
              error={fieldErrors.childPrice}
              placeholder="VD: 50000"
              min={0}
              onChange={handleChange}
            />

            <InputField
              label="Sức chứa tiêu chuẩn"
              name="capacity"
              type="number"
              value={formData.capacity.toString()}
              error={fieldErrors.capacity}
              placeholder="VD: 2"
              min={1}
              onChange={handleChange}
              required
            />

            <InputField
              label="Diện tích (m²)"
              name="area"
              type="number"
              value={formData.area.toString()}
              error={fieldErrors.area}
              placeholder="VD: 30"
              min={1}
              onChange={handleChange}
              required
            />

            <InputField
              label="Tầng"
              name="floor"
              type="number"
              value={formData.floor.toString()}
              error={fieldErrors.floor}
              placeholder="VD: 1"
              min={1}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <InputField
              label="Thông tin giường"
              name="bedInfo"
              value={formData.bedInfo}
              onChange={handleChange}
              error={fieldErrors.bedInfo}
              placeholder="VD: 1 giường đôi lớn"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2">Tiện ích phòng</label>
            <Select<SelectOption, true>
              isMulti
              options={utilityOptions}
              value={utilityOptions.filter((opt) => formData.utilityIds?.includes(opt.value))}
              onChange={handleUtilitiesChange}
              isLoading={loadingUtilities}
              placeholder="Chọn tiện ích..."
              noOptionsMessage={() => "Không tìm thấy tiện ích"}
              loadingMessage={() => "Đang tải..."}
              styles={rsStyles}
              menuPortalTarget={document.body}
            />
            {fieldErrors.utilityIds && (
              <p className="text-xs text-red-500 mt-1">
                {fieldErrors.utilityIds}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2">Hình ảnh phòng</label>
            <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" id="room-image-upload" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((img, index) => (
                <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center group">
                  <img src={img.preview} alt="preview" className="w-full h-full object-cover" />

                  {index === 0 && (
                    <div className="absolute top-2 left-2 bg-yellow-400 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 fill-current" />
                      Ưu tiên
                    </div>
                  )}

                  {img.isUploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}
                  {img.isError && (
                    <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                      <span className="text-xs text-red-600 bg-card px-2 py-1 rounded shadow">Lỗi tải lên</span>
                    </div>
                  )}
                  <button type="button" onClick={() => handleRemoveImage(img.id)}
                    className="absolute top-2 right-2 p-1.5 bg-card rounded-full shadow text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <label htmlFor="room-image-upload"
                className="flex flex-col items-center justify-center gap-2 aspect-square border-2 border-dashed border-input rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                <ImagePlus className="w-8 h-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Thêm ảnh</span>
              </label>
            </div>
            {fieldErrors.imageUrls && (
              <p className="text-xs text-red-500 mt-1">{fieldErrors.imageUrls}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2">Mô tả chi tiết</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Mô tả các tiện nghi, hướng nhìn của phòng..."
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
              disabled={isPending || images.some(img => img.isUploading)}
              className="flex items-center gap-2"
            >
              {(isPending || images.some(img => img.isUploading)) && <Loader2 className="w-4 h-4 animate-spin" />}
              {isPending ? "Đang tạo..." : images.some(img => img.isUploading) ? "Đang tải ảnh..." : "Thêm phòng mới"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
