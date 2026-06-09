import { Flower2, Moon, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

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
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-amber-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">{t("bookingConfirmation.personalizationTitle")}</h3>
          <p className="text-sm text-gray-500">
            {t("bookingConfirmation.personalizationDesc")}
          </p>
        </div>
      </div>

      <div className="space-y-6 mt-6">
        {/* Scent */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Flower2 className="w-4 h-4 text-pink-500" />
            {t("bookingConfirmation.scentLabel")}
          </label>
          <div className="flex flex-wrap gap-2">
            {scents.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setPreferences({ ...preferences, scent: s })}
                className={`px-4 py-2 rounded-xl text-sm transition-all border ${
                  preferences.scent === s
                    ? "bg-pink-50 border-pink-300 text-pink-700 font-medium shadow-sm"
                    : "bg-white border-gray-200 text-gray-600 hover:border-pink-200 hover:bg-pink-50/50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Pillow */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Moon className="w-4 h-4 text-indigo-500" />
            {t("bookingConfirmation.pillowLabel")}
          </label>
          <div className="flex flex-wrap gap-2">
            {pillows.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPreferences({ ...preferences, pillow: p })}
                className={`px-4 py-2 rounded-xl text-sm transition-all border ${
                  preferences.pillow === p
                    ? "bg-indigo-50 border-indigo-300 text-indigo-700 font-medium shadow-sm"
                    : "bg-white border-gray-200 text-gray-600 hover:border-indigo-200 hover:bg-indigo-50/50"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Setup */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Sparkles className="w-4 h-4 text-amber-500" />
            {t("bookingConfirmation.setupLabel")}
          </label>
          <div className="flex flex-wrap gap-2">
            {setups.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setPreferences({ ...preferences, setup: s })}
                className={`px-4 py-2 rounded-xl text-sm transition-all border ${
                  preferences.setup === s
                    ? "bg-amber-50 border-amber-300 text-amber-700 font-medium shadow-sm"
                    : "bg-white border-gray-200 text-gray-600 hover:border-amber-200 hover:bg-amber-50/50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
