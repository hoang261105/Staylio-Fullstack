import { Flower2, Moon, Sparkles } from "lucide-react";

export interface PersonalizationData {
  scent: string;
  pillow: string;
  setup: string;
}

interface PersonalizationFormProps {
  preferences: PersonalizationData;
  setPreferences: React.Dispatch<React.SetStateAction<PersonalizationData>>;
}

const scents = ["Không mùi", "Hoa Oải hương (Lavender)", "Sả chanh", "Bạc hà"];
const pillows = ["Tiêu chuẩn", "Gối mềm (Lông vũ)", "Gối cứng (Cao su non)", "Gối chống mỏi cổ"];
const setups = ["Không cần", "Sinh nhật", "Kỷ niệm / Trăng mật", "Công tác"];

export function PersonalizationForm({ preferences, setPreferences }: PersonalizationFormProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-amber-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Cá nhân hóa trải nghiệm</h3>
          <p className="text-sm text-gray-500">
            Thiết lập phòng theo sở thích của bạn hoàn toàn miễn phí
          </p>
        </div>
      </div>

      <div className="space-y-6 mt-6">
        {/* Scent */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Flower2 className="w-4 h-4 text-pink-500" />
            Mùi hương phòng
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
            Loại gối ngủ
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
            Yêu cầu Set-up đặc biệt
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
