import { User, Mail, Lock } from "lucide-react";
import React, { type Dispatch, type SetStateAction } from "react";
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { InputField } from "../../../common/components/InputField";
import type { UserRegisterRequest } from "../../../common/interfaces/request/UserRegisterRequest";
import toast from "react-hot-toast";
import { Button } from "../../../common/components/ui/button";

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
        <h2 className="text-3xl font-bold mb-3 text-foreground">{t('registerScreen.form.createAccount')}</h2>
        <p className="text-muted-foreground">
          {t('registerScreen.form.alreadyHaveAccount')}{" "}
          <a
            onClick={() => navigate("/login")}
            className="text-primary hover:text-primary/80 hover:underline cursor-pointer font-semibold transition-colors"
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
        <div className="flex-1 h-px bg-border"></div>
        <span className="px-4 text-sm text-muted-foreground font-medium whitespace-nowrap">
          {t('registerScreen.form.orRegisterWithEmail')}
        </span>
        <div className="flex-1 h-px bg-border"></div>
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
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t('registerScreen.form.gender')} <span className="text-destructive">*</span>
            </label>
            <select
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              className={`w-full px-4 py-3 border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                errors.gender ? "border-destructive" : "border-input"
              } rounded-xl shadow-sm text-foreground`}
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
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                {t('registerScreen.form.passwordStrengthLabel')}: <span className={passwordStrength.color.replace('bg-', 'text-')}>{passwordStrength.label}</span>
              </p>
            </div>
          )}
        </div>

        {/* Nút Submit */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full py-6 mt-4 text-lg font-semibold rounded-xl"
        >
          {isLoading ? t('registerScreen.form.creatingAccount') : t('registerScreen.form.createAccountButton')}
        </Button>
      </form>
    </>
  );
};
