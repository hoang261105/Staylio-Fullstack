/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { X } from "lucide-react";
import { InputField } from "../../../../common/components/InputField";
import type { UserRegisterRequest } from "../../../../common/interfaces/request/UserRegisterRequest";
import { useApiErrors } from "../../../../common/hooks/useApiErrors";
import { useCreateCustomerMutation } from "../../../../common/hooks/useCustomers";

interface CustomerFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomerForm({ isOpen, onClose }: CustomerFormProps) {
  const [formData, setFormData] = useState<UserRegisterRequest>({
    userName: "",
    fullName: "",
    email: "",
    gender: "MALE",
    dateOfBirth: new Date().toISOString().split("T")[0],
    password: ""
  });

  const { fieldErrors, handleApiErrors, clearFieldError, clearAllErrors } = useApiErrors();

  const { mutateAsync } = useCreateCustomerMutation(formData);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearAllErrors();
    
    try {
      await mutateAsync();
      setFormData({
        userName: "",
        fullName: "",
        email: "",
        gender: "",
        dateOfBirth: new Date().toISOString().split("T")[0],
        password: ""
      })
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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50/50">
          <h2 className="text-xl font-semibold text-gray-900">Thêm khách hàng mới</h2>
          <button 
            type="button"
            onClick={handleClose} 
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            <InputField
              label="Tên đăng nhập"
              value={formData.userName}
              onChange={(e) => {
                setFormData({ ...formData, userName: e.target.value });
                clearFieldError("userName");
              }}
              error={fieldErrors.userName}
              required
              placeholder="Nhập tên đăng nhập"
            />
            
            <InputField
              label="Họ và tên"
              value={formData.fullName}
              onChange={(e) => {
                setFormData({ ...formData, fullName: e.target.value });
                clearFieldError("fullName");
              }}
              error={fieldErrors.fullName}
              required
              placeholder="Nhập họ và tên"
            />
            
            <InputField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                clearFieldError("email");
              }}
              error={fieldErrors.email}
              required
              placeholder="Nhập địa chỉ email"
            />
            
            <InputField
              label="Mật khẩu"
              type="password"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                clearFieldError("password");
              }}
              error={fieldErrors.password}
              required
              placeholder="Nhập mật khẩu"
            />

            <InputField
              label="Ngày sinh"
              type="date"
              value={formData.dateOfBirth || ""}
              onChange={(e) => {
                setFormData({ ...formData, dateOfBirth: e.target.value });
                clearFieldError("dateOfBirth");
              }}
              error={fieldErrors.dateOfBirth}
              required
            />
            
            <div className="mb-4">
              <label className="block text-sm mb-2">Giới tính <span className="text-red-500">*</span></label>
              <div className="relative">
                <select
                  value={formData.gender}
                  onChange={(e) => {
                    setFormData({ ...formData, gender: e.target.value });
                    clearFieldError("gender");
                  }}
                  className={`w-full box-border px-4 py-3 border ${fieldErrors.gender ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#0066FF] transition-colors bg-white appearance-none`}
                  required
                >
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              {fieldErrors.gender && <p className="text-xs text-red-500 mt-1">{fieldErrors.gender}</p>}
            </div>
          </div>
          
          <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-100">
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
              Lưu khách hàng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
