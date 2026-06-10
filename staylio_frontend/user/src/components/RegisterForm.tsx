import { User, Mail, Lock } from "lucide-react";
import React, { type Dispatch, type SetStateAction } from "react";
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { InputField } from "../../../common/components/InputField";
import type { UserRegisterRequest } from "../../../common/interfaces/request/UserRegisterRequest";
import toast from "react-hot-toast";

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
  onGoogleLogin?: (credential: string) => void;
}

export const RegisterForm = ({
  formData,
  setFormData,
  errors,
  isLoading,
  onSubmit,
  passwordStrength,
  onGoogleLogin,
}: RegisterFormProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <div className="lg:hidden mb-8 flex justify-center">
        <img src="/slogan.png" alt="Staylio" className="h-10 w-auto" />
      </div>

      <div className="mb-10 text-center lg:text-left">
        <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">{t('registerScreen.form.createAccount')}</h2>
        <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500">
          {t('registerScreen.form.alreadyHaveAccount')}{" "}
          <a
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer font-semibold transition-colors"
          >
            {t('registerScreen.form.loginNow')}
          </a>
        </p>
      </div>

      {/* Social Register */}
      <div className="flex justify-center w-full mb-8">
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            if (credentialResponse.credential && onGoogleLogin) {
              onGoogleLogin(credentialResponse.credential);
            }
          }}
          onError={() => {
            toast.error("Đăng nhập Google thất bại");
          }}
          useOneTap
        />
      </div>

      <div className="flex items-center mb-8">
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600"></div>
        <span className="px-4 text-sm text-gray-400 dark:text-gray-500 font-medium whitespace-nowrap">
          {t('registerScreen.form.orRegisterWithEmail')}
        </span>
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600"></div>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        {/* Tên đăng nhập */}
        <InputField
          label={t('registerScreen.form.username')}
          required
          icon={User}
          placeholder={t('registerScreen.form.usernamePlaceholder')}
          value={formData.userName}
          error={errors.userName}
          onChange={(e) =>
            setFormData({ ...formData, userName: e.target.value })
          }
        />

        {/* Họ và tên */}
        <InputField
          label={t('registerScreen.form.fullName')}
          required
          icon={User}
          placeholder={t('registerScreen.form.fullNamePlaceholder')}
          value={formData.fullName}
          error={errors.fullName}
          onChange={(e) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
        />

        {/* Giới tính & Ngày sinh */}
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
              {t('registerScreen.form.gender')} <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              className={`w-full px-4 py-3 border bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-b dark:border-gray-700lue-500 transition-colors ${
                errors.gender ? "border-red-500" : "border-gray-200 dark:border-gray-600"
              } rounded-xl shadow-sm text-gray-900 dark:text-white`}
            >
              <option value="MALE">{t('registerScreen.form.male')}</option>
              <option value="FEMALE">{t('registerScreen.form.female')}</option>
              <option value="OTHER">{t('registerScreen.form.other')}</option>
            </select>
            {errors.gender && (
              <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.gender}</p>
            )}
          </div>
          <InputField
            label={t('registerScreen.form.dob')}
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
          label={t('registerScreen.form.email')}
          type="email"
          required
          icon={Mail}
          placeholder={t('registerScreen.form.emailPlaceholder')}
          value={formData.email}
          error={errors.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        {/* Mật khẩu */}
        <div>
          <InputField
            label={t('registerScreen.form.password')}
            type="password"
            required
            icon={Lock}
            placeholder={t('registerScreen.form.passwordPlaceholder')}
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
                        : "bg-gray-200 dark:bg-gray-600"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 font-medium">
                {t('registerScreen.form.passwordStrengthLabel')}: <span className={passwordStrength.color.replace('bg-', 'text-')}>{passwordStrength.label}</span>
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
          {isLoading ? t('registerScreen.form.creatingAccount') : t('registerScreen.form.createAccountButton')}
        </button>
      </form>
    </>
  );
};
