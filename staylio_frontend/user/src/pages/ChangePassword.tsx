/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Save,
  ShieldCheck,
  X,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../common/components/ui/button";

import Header from "../layout/Header";

import type { ChangePasswordRequest } from "../../../common/interfaces/request/ChangePasswordRequest";
import { useChangePasswordMutation } from "../../../common/hooks/useChangePassword";

const inputClassName = `
w-full pl-11 pr-12 py-3.5
border border-input
rounded-2xl
bg-background text-foreground shadow-sm
focus:outline-none
focus:ring-2
focus:ring-ring
focus:border-primary
transition-all duration-200
`;

export default function ChangePassword() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [formData, setFormData] = useState<ChangePasswordRequest>({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [errors, setErrors] = useState<{
    form?: string;
  }>({});

  const { mutateAsync, isPending } = useChangePasswordMutation(
    () => {
      navigate("/profile/me");
    }
  );

  const handleCancel = () => navigate("/profile/me");

  const handleSubmit = async (
    e: React.SyntheticEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setErrors({});

    if (formData.newPassword !== formData.confirmNewPassword) {
      setErrors({
        form: "Mật khẩu xác nhận không khớp",
      });

      return;
    }

    try {
      await mutateAsync(formData);
    } catch (error: any) {
      const response = error?.response?.data;

      if (response?.errors?.length > 0) {
        setErrors({
          form: response.errors[0].message,
        });
      } else {
        setErrors({
          form: response?.message || "Đã xảy ra lỗi",
        });
      }
    }
  };

  const handleChange = (
    key: keyof ChangePasswordRequest,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (errors.form) {
      setErrors({});
    }
  };

  const togglePassword = (
    key: "current" | "new" | "confirm"
  ) => {
    setShowPassword((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-4 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />

            <span className="font-medium">
              Quay lại hồ sơ
            </span>
          </button>

          <h1 className="text-3xl font-bold text-foreground">
            Bảo mật tài khoản
          </h1>

          <p className="text-muted-foreground mt-2">
            Thay đổi mật khẩu để tăng cường bảo mật cho tài khoản của bạn.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-card rounded-3xl border border-border shadow-sm p-8 md:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-card-foreground">
                  Đổi mật khẩu
                </h2>

                <p className="text-sm text-muted-foreground mt-1">
                  Mật khẩu mạnh giúp tài khoản an toàn hơn.
                </p>
              </div>
            </div>

            <div className="space-y-7">
              <PasswordInput
                label="Mật khẩu hiện tại"
                value={formData.oldPassword}
                visible={showPassword.current}
                onToggle={() =>
                  togglePassword("current")
                }
                onChange={(value) =>
                  handleChange("oldPassword", value)
                }
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PasswordInput
                  label="Mật khẩu mới"
                  value={formData.newPassword}
                  visible={showPassword.new}
                  onToggle={() => togglePassword("new")}
                  onChange={(value) =>
                    handleChange("newPassword", value)
                  }
                />

                <PasswordInput
                  label="Xác nhận mật khẩu"
                  value={formData.confirmNewPassword}
                  visible={showPassword.confirm}
                  onToggle={() =>
                    togglePassword("confirm")
                  }
                  onChange={(value) =>
                    handleChange(
                      "confirmNewPassword",
                      value
                    )
                  }
                />
              </div>
            </div>

            {errors.form && (
              <div className="mt-6 flex items-center gap-2 p-4 rounded-2xl bg-red-50 border border-red-100">
                <div className="w-2 h-2 rounded-full bg-red-500" />

                <p className="text-sm text-red-600 font-medium">
                  {errors.form}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1 py-6 rounded-2xl font-semibold flex items-center justify-center gap-2"
              >
                <X size={18} />
                Hủy bỏ
              </Button>

              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 py-6 rounded-2xl font-semibold flex items-center justify-center gap-2"
              >
                <Save size={18} />
                {isPending
                  ? "Đang cập nhật..."
                  : "Lưu mật khẩu"}
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

type PasswordInputProps = {
  label: string;
  value: string;
  visible: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
};

function PasswordInput({
  label,
  value,
  visible,
  onToggle,
  onChange,
}: PasswordInputProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-foreground mb-2">
        {label}
      </label>

      <div className="relative">
        <Lock
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={18}
        />

        <input
          type={visible ? "text" : "password"}
          placeholder="••••••••"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClassName}
          required
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {visible ? (
            <EyeOff size={20} />
          ) : (
            <Eye size={20} />
          )}
        </button>
      </div>
    </div>
  );
}