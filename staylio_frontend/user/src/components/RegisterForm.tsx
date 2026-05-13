import { User, Mail, Lock } from "lucide-react";
import React, { type Dispatch, type SetStateAction } from "react";
import { FaGoogle } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { InputField } from "../../../common/components/InputField";
import type { UserRegisterRequest } from "../../../common/interfaces/request/UserRegisterRequest";

interface RegisterFormErrors {
  userName?: string;
  fullName?: string;
  gender?: string;
  dateOfBirth?: string;
  email?: string;
  password?: string;
}

interface PasswordStrength {
  strength: number;
  color: string;
  label: string;
}

interface RegisterFormProps {
  formData: UserRegisterRequest;
  setFormData: Dispatch<SetStateAction<UserRegisterRequest>>;
  errors: RegisterFormErrors;
  isLoading: boolean;
  onSubmit: (event: React.SyntheticEvent<HTMLFormElement>) => void;
  passwordStrength: PasswordStrength;
}

export const RegisterForm = ({
  formData,
  setFormData,
  errors,
  isLoading,
  onSubmit,
  passwordStrength,
}: RegisterFormProps) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="lg:hidden mb-8">
        <img src="/slogan.png" alt="Staylio" />
      </div>

      <div className="mb-8">
        <h2 className="text-3xl mb-2">Tạo tài khoản</h2>

        <p className="text-muted-foreground">
          Đã có tài khoản?{" "}
          <a
            onClick={() => navigate("/login")}
            className="text-[#0066FF] hover:underline cursor-pointer font-medium"
          >
            Đăng nhập ngay
          </a>
        </p>
      </div>

      {/* Social Register */}

      <div className="space-y-3 mb-6">
        <button
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-accent transition-colors"
        >
          <FaGoogle className="w-5 h-5" />

          <span>Tiếp tục với Google</span>
        </button>
      </div>

      <div className="flex items-center mb-6">
        <div className="flex-1 h-px bg-gray-300"></div>

        <span className="px-4 text-sm text-gray-500 whitespace-nowrap">
          Hoặc đăng ký với email
        </span>

        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Tên đăng nhập */}
        <InputField
          label="Tên đăng nhập"
          required
          icon={User}
          placeholder="username123"
          value={formData.userName}
          error={errors.userName}
          onChange={(e) =>
            setFormData({ ...formData, userName: e.target.value })
          }
        />

        {/* Họ và tên */}
        <InputField
          label="Họ và tên"
          required
          icon={User}
          placeholder="Nguyễn Văn A"
          value={formData.fullName}
          error={errors.fullName}
          onChange={(e) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
        />

        {/* Giới tính & Ngày sinh (Có thể bọc trong div flex để tiết kiệm diện tích) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-2">
              Giới tính <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              className={`w-full px-4 py-3 border ${errors.gender ? "border-red-500" : "border-gray-300"} rounded-lg`}
            >
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
              <option value="OTHER">Khác</option>
            </select>
            {errors.gender && (
              <p className="text-xs text-red-500 mt-1">{errors.gender}</p>
            )}
          </div>
          <InputField
            label="Ngày sinh"
            type="date"
            required
            value={formData.dateOfBirth || ""}
            error={errors.dateOfBirth}
            onChange={(e) =>
              setFormData({ ...formData, dateOfBirth: e.target.value })
            }
          />
        </div>

        {/* Email */}
        <InputField
          label="Email"
          type="email"
          required
          icon={Mail}
          placeholder="email@example.com"
          value={formData.email}
          error={errors.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        {/* Mật khẩu - Có logic Toggle ẩn/hiện riêng */}
          <InputField
            label="Mật khẩu"
            type="password"
            required
            icon={Lock}
            placeholder="••••••••"
            value={formData.password}
            error={errors.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          {/* Password Strength Meter */}
          {formData.password && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full ${level <= passwordStrength.strength ? passwordStrength.color : "bg-gray-200"}`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500">
                Độ mạnh: {passwordStrength.label}
              </p>
            </div>
          )}

        {/* Nút Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-[#0066FF] text-white rounded-lg hover:bg-[#0052CC] font-medium transition-all disabled:opacity-50"
        >
          {isLoading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
        </button>
      </form>
    </>
  );
};
