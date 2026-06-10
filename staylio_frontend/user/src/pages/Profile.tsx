import { useNavigate } from "react-router";
import {
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Settings,
  LogOut,
  ChevronRight,
  Heart,
  Lock,
} from "lucide-react";
import Header from "../layout/Header";
import { formatDate } from "../../../common/utils/formatDate";
import { useProfile } from "../../../common/hooks/useProfile";
import { useTranslation } from "react-i18next";
import { Button } from "../../../common/components/ui/button";

export default function Profile() {
  const navigate = useNavigate();
  const { data: user } = useProfile();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8 text-foreground">
          {t('profile.title')}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="bg-card rounded-2xl border border-border shadow-sm p-2">
              <button
                onClick={() => navigate("/profile")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-medium shadow-sm"
              >
                <Settings size={20} />
                {t('profile.personalInfo')}
              </button>

              <button
                onClick={() => navigate("/history-bookings")}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-accent transition group"
              >
                <div className="flex items-center gap-3 text-muted-foreground group-hover:text-foreground">
                  <Calendar size={20} />
                  <span>{t('profile.myTrips')}</span>
                </div>
                <ChevronRight size={16} className="text-muted-foreground" />
              </button>

              <button
                onClick={() => navigate("/favorites")}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-accent transition group"
              >
                <div className="flex items-center gap-3 text-muted-foreground group-hover:text-foreground">
                  <Heart size={20} />
                  <span>{t('profile.savedHotels')}</span>
                </div>
                <ChevronRight size={16} className="text-muted-foreground" />
              </button>

              <button
                onClick={() => navigate("/change-password")}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-accent transition group"
              >
                <div className="flex items-center gap-3 text-muted-foreground group-hover:text-foreground">
                  <Lock size={20} />
                  <span>{t('profile.changePassword')}</span>
                </div>

                <ChevronRight size={16} className="text-muted-foreground" />
              </button>
            </div>

            <button className="w-full flex items-center gap-3 px-6 py-4 bg-destructive/10 text-destructive rounded-2xl font-medium hover:bg-destructive/20 transition">
              <LogOut size={20} />
              {t('profile.logout')}
            </button>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-2xl border border-border shadow-md p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <img
                    src={user?.avatarUrl}
                    className="w-20 h-20 rounded-full object-cover"
                  />

                  <div>
                    <h2 className="text-xl font-semibold text-card-foreground">
                      {user?.fullName || "Nguyễn Văn A"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {t('profile.memberSince')} 01/2026
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => navigate("/profile/edit")}
                  className="flex items-center gap-2"
                >
                  <Edit size={16} />
                  {t('profile.edit')}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <InfoItem
                    icon={<Mail />}
                    label={t('profile.email')}
                    value={user?.email || "nguyenvana@email.com"}
                  />
                  <InfoItem
                    icon={<Phone />}
                    label={t('profile.phone')}
                    value={user?.phone || t('profile.notSet')}
                  />
                </div>

                <div className="space-y-6">
                  <InfoItem
                    icon={<Calendar />}
                    label={t('profile.dob')}
                    value={formatDate(user?.dateOfBirth || "1990-01-01")}
                  />
                  <InfoItem
                    icon={<MapPin />}
                    label={t('profile.address')}
                    value={user?.address || t('profile.notSet')}
                  />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border shadow-md p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-card-foreground">
                  {t('profile.payment')}
                </h3>
                <button className="text-sm text-primary font-medium hover:underline">
                  {t('profile.addNew')}
                </button>
              </div>

              <div className="p-4 rounded-xl border border-border bg-muted flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground text-xs font-bold">
                    VISA
                  </div>

                  <div>
                    <p className="font-medium text-card-foreground">
                      •••• •••• •••• 4242
                    </p>
                    <p className="text-xs text-muted-foreground">{t('profile.expires')} 12/28</p>
                  </div>
                </div>

                <span className="text-xs font-semibold text-primary bg-background px-2 py-1 rounded border border-border shadow-sm">
                  {t('profile.default')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-primary mt-1">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className="font-medium text-card-foreground">{value}</p>
      </div>
    </div>
  );
}
