/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import { X, Building2, AlignLeft, Image as ImageIcon, Loader2, Camera } from "lucide-react";
import { useUpdateHotelMutation } from "@common/hooks/useHotels";
import type { HotelRequest } from "@common/interfaces/request/HotelRequest";
import type { HotelResponse } from "@common/interfaces/response/HotelResponse";
import { uploadToCloudinary } from "@common/utils/cloudinary";
import toast from "react-hot-toast";

interface EditHotelModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: HotelResponse;
}

const EditHotelModal: React.FC<EditHotelModalProps> = ({
  isOpen,
  onClose,
  hotel,
}) => {
  const [formData, setFormData] = useState<HotelRequest>({
    name: hotel.name,
    description: hotel.description,
    imageUrl: hotel.imageUrl,
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: hotel.name,
        description: hotel.description,
        imageUrl: hotel.imageUrl,
      });
    }
  }, [hotel, isOpen]);

  const { mutate: updateHotel, isPending } = useUpdateHotelMutation(hotel.id);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    try {
      setIsUploading(true);

      const preview = URL.createObjectURL(selected);
      setFormData((prev) => ({ ...prev, imageUrl: preview }));

      const url = await uploadToCloudinary(selected);
      setFormData((prev) => ({ ...prev, imageUrl: url }));
      toast.success("Tải ảnh lên thành công!");
    } catch (error) {
      console.error(error);
      toast.error("Tải ảnh thất bại, vui lòng thử lại!");
      setFormData((prev) => ({ ...prev, imageUrl: hotel.imageUrl }));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateHotel(formData, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isPending) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Chỉnh sửa thông tin
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Cập nhật thông tin nhận diện thương hiệu của bạn
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isPending}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="editHotelForm" onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-400" />
                Tên thương hiệu <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] outline-none transition-all placeholder:text-gray-400"
                placeholder="VD: Vinpearl Resort & Spa"
                disabled={isPending}
              />
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <AlignLeft className="w-4 h-4 text-gray-400" />
                Mô tả chi tiết <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] outline-none transition-all placeholder:text-gray-400 resize-none"
                placeholder="Giới thiệu về khách sạn của bạn..."
                disabled={isPending}
              />
            </div>

            {/* Image Upload Input */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-gray-400" />
                Ảnh đại diện thương hiệu <span className="text-red-500">*</span>
              </label>

              <div className="flex items-center gap-4">
                <label className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border-2 border-dashed border-gray-300 hover:border-[#0066FF] hover:bg-blue-50/50 rounded-xl cursor-pointer transition-all text-sm font-medium text-gray-700 group">
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#0066FF]" />
                  ) : (
                    <Camera className="w-4 h-4 text-gray-400 group-hover:text-[#0066FF]" />
                  )}
                  <span className="group-hover:text-[#0066FF]">
                    {isUploading ? "Đang tải ảnh..." : "Đổi ảnh khác"}
                  </span>
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isPending || isUploading}
                  />
                </label>
                <span className="text-xs text-gray-400">JPG, PNG. Tối đa 5MB</span>
              </div>

              {!formData.imageUrl && (
                <input type="text" required value={formData.imageUrl} className="hidden" readOnly />
              )}

              {formData.imageUrl && (
                <div className="mt-3 relative w-full h-48 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center group shadow-sm">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/f3f4f6/a1a1aa?text=Invalid+Image+URL';
                    }}
                  />
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-5 py-2.5 text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            form="editHotelForm"
            disabled={isPending || isUploading}
            className="px-5 py-2.5 bg-[#0066FF] text-white rounded-xl hover:bg-[#0052CC] font-medium transition-all shadow-md shadow-[#0066FF]/20 disabled:opacity-70 flex items-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <span>Lưu thay đổi</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditHotelModal;
