import { Maximize, Users, BedDouble } from "lucide-react";
import { getUtilityIcon } from "../../../../common/utils/iconUtils";
import type { RoomResponse } from "../../../../common/interfaces/response/RoomResponse";
import type { UtilityResponse } from "../../../../common/interfaces/response/UtilityResponse";

interface RoomOverviewProps {
  room: RoomResponse;
  policy?: string;
}

export default function RoomOverview({ room, policy }: RoomOverviewProps) {
  return (
    <>
      {/* Về phòng này */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tổng quan phòng</h2>
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2 bg-gray-100/80 px-4 py-2.5 rounded-xl">
            <Maximize className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Diện tích: {room.area} m²
            </span>
          </div>
          <div className="flex items-center gap-2 bg-gray-100/80 px-4 py-2.5 rounded-xl">
            <Users className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Tối đa: {room.maxAdults} Lớn, {room.maxChildren} Trẻ em
            </span>
          </div>
          <div className="flex items-center gap-2 bg-gray-100/80 px-4 py-2.5 rounded-xl">
            <BedDouble className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {room.bedInfo}
            </span>
          </div>
        </div>
        <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm md:text-base">
          {room.description || "Chưa có mô tả cho phòng này."}
        </p>
      </section>

      <hr className="border-gray-200" />

      {/* Tiện ích */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Tiện ích phòng</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2">
          {room.utilities?.map((u: UtilityResponse) => {
            const Icon = getUtilityIcon(u.iconName);
            return (
              <div key={u.id} className="flex items-center gap-3 text-gray-700">
                <div className="text-blue-600">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">{u.title}</span>
              </div>
            );
          })}
          {(!room.utilities || room.utilities.length === 0) && (
            <div className="text-gray-500 italic">Chưa có thông tin tiện ích.</div>
          )}
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* Chính sách */}
      {policy && (
        <>
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Chính sách thương hiệu
            </h2>
            <div className="bg-gray-50/80 rounded-2xl p-6 border border-gray-100">
              <ul className="space-y-3">
                {policy
                  .split("\n")
                  .filter(Boolean)
                  .map((line: string, idx: number) => {
                    const isBullet =
                      line.trim().startsWith("-") ||
                      line.trim().startsWith("•") ||
                      line.trim().startsWith("*");
                    const text = isBullet ? line.trim().substring(1).trim() : line;
                    return (
                      <li key={idx} className="flex items-start gap-3">
                        {isBullet ? (
                          <div className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>
                        ) : null}
                        <span className="text-gray-700 text-sm md:text-base leading-relaxed">
                          {text}
                        </span>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </section>

          <hr className="border-gray-200" />
        </>
      )}
    </>
  );
}
