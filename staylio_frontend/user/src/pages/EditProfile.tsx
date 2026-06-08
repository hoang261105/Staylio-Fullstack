/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Camera,
  Save,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Loader2,
} from "lucide-react";
import Header from "../layout/Header";
import type { ProfileRequest } from "../../../common/interfaces";
import { useProfile, useUpdateProfile } from "../../../common/hooks/useProfile";
import { useApiErrors } from "../../../common/hooks/useApiErrors";
import { uploadToCloudinary } from "../../../common/utils/cloudinary";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export function EditProfile() {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const {
    fieldErrors: errors,
    handleApiErrors,
    clearAllErrors,
    clearFieldError,
  } = useApiErrors();

  const { data: user } = useProfile();    
  const { t } = useTranslation();

  const [formData, setFormData] = useState<ProfileRequest>({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "0123456789",
    address: user?.address || t('editProfile.notSet'),
    dateOfBirth: user?.dateOfBirth || "",
    avatarUrl: user?.avatarUrl || "",
    gender: user?.gender || null,
  });

  const { mutateAsync, isPending } = useUpdateProfile(() => {
    navigate("/profile/me");
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const preview = URL.createObjectURL(selected);
    setFormData((prev) => ({ ...prev, avatarUrl: preview }));
    setIsUploading(true);

    try {
      const url = await uploadToCloudinary(selected);
      setFormData((prev) => ({ ...prev, avatarUrl: url }));
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
      toast.error(t('editProfile.uploadError'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    clearFieldError(key);
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    clearAllErrors();

    try {
      await mutateAsync(formData);
      toast.success(t('editProfile.updateSuccess'));
    } catch (error: any) {
      const apiErrors = error?.response?.data?.errors;

      if (apiErrors) {
        handleApiErrors(apiErrors);
      } else {
        toast.error(t('editProfile.updateError'));
      }
    }
  };

  const handleCancel = () => navigate("/profile/me");

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:text-black mb-4"
          >
            <ArrowLeft size={18} />
            {t('editProfile.backToProfile')}
          </button>

          <h1 className="text-3xl font-bold">{t('editProfile.title')}</h1>
          <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1">
            {t('editProfile.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar */}
          <Section title={t('editProfile.avatar')}>
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src={formData?.avatarUrl}
                  className="w-20 h-20 rounded-full object-cover"
                />
                {isUploading && (
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-[#0066FF] text-white rounded-full flex items-center justify-center shadow hover:bg-[#0052CC] cursor-pointer">
                  <Camera size={14} />
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              <div>
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:bg-gray-700"
                >
                  {t('editProfile.uploadImage')}
                </button>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  {t('editProfile.imageFormat')}
                </p>
              </div>
            </div>
          </Section>

          {/* Personal */}
          <Section title={t('editProfile.personalInfo')}>
            <div className="grid md:grid-cols-2 gap-5">
              <Input
                label={t('editProfile.fullName')}
                icon={User}
                value={formData?.fullName}
                onChange={(v: string) => handleChange("fullName", v)}
                error={errors?.fullName}
              />

              <Input
                label={t('editProfile.email')}
                icon={Mail}
                value={formData?.email}
                onChange={(v: string) => handleChange("email", v)}
                error={errors.email}
              />
              <Input
                label={t('editProfile.phone')}
                icon={Phone}
                value={formData?.phone}
                onChange={(v: string) => handleChange("phone", v)}
                error={errors.phone}
              />

              <Input
                label={t('editProfile.dob')}
                type="date"
                icon={Calendar}
                value={formData?.dateOfBirth}
                onChange={(v: string) => handleChange("dateOfBirth", v)}
                error={errors.dateOfBirth}
              />
            </div>
          </Section>

          {/* Address */}
          <Section title={t('editProfile.address')}>
            <div className="grid md:grid-cols-2 gap-5">
              <Input
                label={t('editProfile.address')}
                icon={MapPin}
                value={formData?.address}
                onChange={(v: string) => handleChange("address", v)}
                full
                error={errors.address}
              />
            </div>
          </Section>

          <div className="flex gap-4 sticky bottom-4 bg-white dark:bg-gray-800/80 backdrop-blur p-4 rounded-xl shadow border border-gray-200 dark:border-gray-600">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:bg-gray-700 flex items-center justify-center gap-2"
            >
              <X size={18} /> {t('editProfile.cancel')}
            </button>

            <button
              type="submit"
              disabled={isPending || isUploading}
              className="flex-1 py-3 bg-[#0066FF] text-white rounded-lg hover:bg-[#0052CC] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending || isUploading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {isPending ? t('editProfile.saving') : isUploading ? t('editProfile.uploading') : t('editProfile.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Section({ title, children }: any) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-5">{title}</h2>
      {children}
    </div>
  );
}

function Input({
  label,
  icon: Icon,
  value,
  onChange,
  type = "text",
  full,
  error,
}: any) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="text-sm font-medium">{label}</label>
      <div className="relative mt-2">
        {Icon && (
          <Icon
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            size={18}
          />
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-4 py-3 ${Icon ? "pl-10" : ""} border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0066FF]/30 outline-none ${error ? "border-red-500" : ""}`}
        />
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
