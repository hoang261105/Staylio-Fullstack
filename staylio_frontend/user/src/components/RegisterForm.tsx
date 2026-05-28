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
      <div className="lg:hidden mb-8 flex justify-center">
        <img src="/slogan.png" alt="Staylio" className="h-10 w-auto" />
      </div>

      <div className="mb-10 text-center lg:text-left">
        <h2 className="text-3xl font-bold mb-3 text-gray-900">Tạo tài khoản</h2>
        <p className="text-gray-500">
          Đã có tài khoản?{" "}
          <a
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer font-semibold transition-colors"
          >
            Đăng nhập ngay
          </a>
        </p>
      </div>

      {/* Social Register */}
      <div className="space-y-4 mb-8">
        <button className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm font-medium text-gray-700 active:scale-[0.98]">
          <FaGoogle className="w-5 h-5 text-red-500" />
          <span>Tiếp tục với Google</span>
        </button>
      </div>

      <div className="flex items-center mb-8">
        <div className="flex-1 h-px bg-gray-200"></div>
        <span className="px-4 text-sm text-gray-400 font-medium whitespace-nowrap">
          Hoặc đăng ký với email
        </span>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
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

        {/* Giới tính & Ngày sinh */}
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Giới tính <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              className={`w-full px-4 py-3 border bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors ${
                errors.gender ? "border-red-500" : "border-gray-200"
              } rounded-xl shadow-sm text-gray-900`}
            >
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
              <option value="OTHER">Khác</option>
            </select>
            {errors.gender && (
              <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.gender}</p>
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

        {/* Mật khẩu */}
        <div>
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
            <div className="mt-2.5">
              <div className="flex gap-1.5 mb-1.5">
                {[1, 2, 3].map((level) => (
                  <div
                    key={level}
                    className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                      level <= passwordStrength.strength
                        ? passwordStrength.color
                        : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 font-medium">
                Độ mạnh: <span className={passwordStrength.color.replace('bg-', 'text-')}>{passwordStrength.label}</span>
              </p>
            </div>
          )}
        </div>

        {/* Nút Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed font-semibold text-lg shadow-lg shadow-blue-500/30 active:scale-[0.98] mt-4"
        >
          {isLoading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
        </button>
      </form>
    </>
  );
};
