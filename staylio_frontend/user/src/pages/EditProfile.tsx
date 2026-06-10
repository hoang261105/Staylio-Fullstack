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
import { Button } from "../../../common/components/ui/button";

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
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft size={18} />
            {t('editProfile.backToProfile')}
          </button>

          <h1 className="text-3xl font-bold">{t('editProfile.title')}</h1>
          <p className="text-muted-foreground mt-1">
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
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow hover:bg-primary/90 cursor-pointer">
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
                <Button
                  variant="outline"
                  type="button"
                >
                  {t('editProfile.uploadImage')}
                </Button>
                <p className="text-sm text-muted-foreground mt-1">
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

          <div className="flex gap-4 sticky bottom-4 bg-background/80 backdrop-blur p-4 rounded-xl shadow border border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1 py-6 flex items-center justify-center gap-2 rounded-lg"
            >
              <X size={18} /> {t('editProfile.cancel')}
            </Button>

            <Button
              type="submit"
              disabled={isPending || isUploading}
              className="flex-1 py-6 flex items-center justify-center gap-2 rounded-lg"
            >
              {isPending || isUploading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {isPending ? t('editProfile.saving') : isUploading ? t('editProfile.uploading') : t('editProfile.save')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Section({ title, children }: any) {
  return (
    <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
      <h2 className="text-lg font-semibold mb-5 text-card-foreground">{title}</h2>
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
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-4 py-3 bg-background text-foreground ${Icon ? "pl-10" : ""} border border-input rounded-lg focus:ring-2 focus:ring-primary/30 outline-none ${error ? "border-destructive" : ""}`}
        />
      </div>
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  );
}
