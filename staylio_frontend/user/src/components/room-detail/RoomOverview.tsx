import { Maximize, Users, BedDouble } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getUtilityIcon } from "../../../../common/utils/iconUtils";
import type { RoomResponse } from "../../../../common/interfaces/response/RoomResponse";
import type { UtilityResponse } from "../../../../common/interfaces/response/UtilityResponse";

interface RoomOverviewProps {
  room: RoomResponse;
  policy?: string;
}

export default function RoomOverview({ room, policy }: RoomOverviewProps) {
  const { t } = useTranslation();
  return (
    <>
      {/* Về phòng này */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">{t("roomDetail.overviewTitle")}</h2>
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2 bg-muted px-4 py-2.5 rounded-xl">
            <Maximize className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              {t("roomDetail.area", { area: room.area })}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-muted px-4 py-2.5 rounded-xl">
            <Users className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              {t("roomDetail.capacity", { adults: room.maxAdults, children: room.maxChildren })}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-muted px-4 py-2.5 rounded-xl">
            <BedDouble className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              {room.bedInfo}
            </span>
          </div>
        </div>
        <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm md:text-base">
          {room.description || t("roomDetail.noDescription")}
        </p>
      </section>

      <hr className="border-border" />

      {/* Tiện ích */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">{t("roomDetail.utilitiesTitle")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2">
          {room.utilities?.map((u: UtilityResponse) => {
            const Icon = getUtilityIcon(u.iconName);
            return (
              <div key={u.id} className="flex items-center gap-3 text-foreground">
                <div className="text-primary">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">{u.title}</span>
              </div>
            );
          })}
          {(!room.utilities || room.utilities.length === 0) && (
            <div className="text-muted-foreground italic">{t("roomDetail.noUtilities")}</div>
          )}
        </div>
      </section>

      <hr className="border-border" />

      {/* Chính sách */}
      {policy && (
        <>
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {t("roomDetail.policyTitle")}
            </h2>
            <div className="bg-card rounded-2xl p-6 border border-border">
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
                          <div className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0"></div>
                        ) : null}
                        <span className="text-card-foreground text-sm md:text-base leading-relaxed">
                          {text}
                        </span>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </section>

          <hr className="border-border" />
        </>
      )}
    </>
  );
}
