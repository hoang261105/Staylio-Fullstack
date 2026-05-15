/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { InputField } from "../../../../common/components/InputField";
import type { UtilityRequest } from "../../../../common/interfaces/request/UtitlityRequest";
import type { UtilityResponse } from "../../../../common/interfaces/response/UtilityResponse";
import { useApiErrors } from "../../../../common/hooks/useApiErrors";
import { useUpdateUtilityMutation } from "../../../../common/hooks/useUtilities";

interface UtilityFormEditProps {
  utility: UtilityResponse | null;
  onClose: () => void;
}

export default function UtilityFormEdit({ utility, onClose }: UtilityFormEditProps) {
  const [formData, setFormData] = useState<UtilityRequest>({
    title: "",
    iconName: "",
    description: "",
  });

  const { fieldErrors, handleApiErrors, clearFieldError, clearAllErrors } = useApiErrors();

  const { mutateAsync } = useUpdateUtilityMutation(utility?.id || 0);

  useEffect(() => {
    if (utility) {
      setFormData({
        title: utility.title || "",
        iconName: utility.iconName || "",
        description: utility.description || "",
      });
      clearAllErrors();
    }
  }, [utility]);

  if (!utility) return null;

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearAllErrors();

    try {
      await mutateAsync(formData);
      onClose();
    } catch (error: any) {
      const serverResponse = error?.response?.data?.errors;
      if (serverResponse) {
        handleApiErrors(serverResponse);
      }
    }
  };

  const handleClose = () => {
    clearAllErrors();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50/50">
          <h2 className="text-xl font-semibold text-gray-900">Cập nhật tiện ích</h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-y-2">
            <InputField
              label="Tên tiện ích"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                clearFieldError("title");
              }}
              error={fieldErrors.title}
              required
              placeholder="Nhập tên tiện ích"
            />

            <InputField
              label="Tên icon (Lucide)"
              value={formData.iconName}
              onChange={(e) => {
                setFormData({ ...formData, iconName: e.target.value });
                clearFieldError("iconName");
              }}
              error={fieldErrors.iconName}
              required
              placeholder="Nhập tên icon (VD: Wifi, Car, vv.)"
            />

            <div className="mb-4">
              <label className="block text-sm mb-2">Mô tả</label>
              <textarea
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  clearFieldError("description");
                }}
                className={`w-full box-border px-4 py-3 border ${fieldErrors.description ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:border-[#0066FF] transition-colors`}
                rows={4}
                placeholder="Nhập mô tả chi tiết tiện ích"
              />
              {fieldErrors.description && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.description}</p>
              )}
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#0066FF] text-white font-medium rounded-lg hover:bg-[#0052CC] shadow-sm shadow-blue-500/20 transition-all"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
