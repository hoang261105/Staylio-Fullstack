import { Flower2, Moon, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../common/components/ui/button";

export interface PersonalizationData {
  scent: string;
  pillow: string;
  setup: string;
}

interface PersonalizationFormProps {
  preferences: PersonalizationData;
  setPreferences: React.Dispatch<React.SetStateAction<PersonalizationData>>;
}

export function PersonalizationForm({ preferences, setPreferences }: PersonalizationFormProps) {
  const { t } = useTranslation();

  const scents = [
    t("bookingConfirmation.scents.none"),
    t("bookingConfirmation.scents.lavender"),
    t("bookingConfirmation.scents.lemongrass"),
    t("bookingConfirmation.scents.mint"),
  ];

  const pillows = [
    t("bookingConfirmation.pillows.standard"),
    t("bookingConfirmation.pillows.soft"),
    t("bookingConfirmation.pillows.hard"),
    t("bookingConfirmation.pillows.neck"),
  ];

  const setups = [
    t("bookingConfirmation.setups.none"),
    t("bookingConfirmation.setups.birthday"),
    t("bookingConfirmation.setups.anniversary"),
    t("bookingConfirmation.setups.business"),
  ];

  return (
    <div className="bg-card rounded-2xl p-6 border border-border shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-card-foreground">{t("bookingConfirmation.personalizationTitle")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("bookingConfirmation.personalizationDesc")}
          </p>
        </div>
      </div>

      <div className="space-y-6 mt-6">
        {/* Scent */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
            <Flower2 className="w-4 h-4 text-primary" />
            {t("bookingConfirmation.scentLabel")}
          </label>
          <div className="flex flex-wrap gap-2">
            {scents.map((s) => (
              <Button
                key={s}
                type="button"
                variant={preferences.scent === s ? "default" : "outline"}
                onClick={() => setPreferences({ ...preferences, scent: s })}
                className="rounded-xl px-4 py-2 text-sm font-medium transition-all"
              >
                {s}
              </Button>
            ))}
          </div>
        </div>

        {/* Pillow */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
            <Moon className="w-4 h-4 text-primary" />
            {t("bookingConfirmation.pillowLabel")}
          </label>
          <div className="flex flex-wrap gap-2">
            {pillows.map((p) => (
              <Button
                key={p}
                type="button"
                variant={preferences.pillow === p ? "default" : "outline"}
                onClick={() => setPreferences({ ...preferences, pillow: p })}
                className="rounded-xl px-4 py-2 text-sm font-medium transition-all"
              >
                {p}
              </Button>
            ))}
          </div>
        </div>

        {/* Setup */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            {t("bookingConfirmation.setupLabel")}
          </label>
          <div className="flex flex-wrap gap-2">
            {setups.map((s) => (
              <Button
                key={s}
                type="button"
                variant={preferences.setup === s ? "default" : "outline"}
                onClick={() => setPreferences({ ...preferences, setup: s })}
                className="rounded-xl px-4 py-2 text-sm font-medium transition-all"
              >
                {s}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
