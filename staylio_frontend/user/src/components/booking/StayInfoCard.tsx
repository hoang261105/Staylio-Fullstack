import { Calendar, Users } from "lucide-react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

interface StayInfoCardProps {
    checkInDate: string;
    checkOutDate: string;
    adults: number;
    children: number;
    note: string;
    setNote: (note: string) => void;
}

export const StayInfoCard = ({
    checkInDate,
    checkOutDate,
    adults,
    children,
    note,
    setNote
}: StayInfoCardProps) => {
    
    const checkIn = dayjs(checkInDate);
    const checkOut = dayjs(checkOutDate);
    const nights = checkOut.diff(checkIn, "day");
    const { t } = useTranslation();

    return (
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6 mb-6">
            <h2 className="text-xl font-bold text-card-foreground mb-6">{t("bookingConfirmation.stayInfoTitle")}</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl border border-border bg-muted/50 relative">
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{t("bookingConfirmation.checkIn")}</div>
                    <div className="font-bold text-card-foreground">{checkIn.format("DD/MM/YYYY")}</div>
                    <div className="text-xs text-muted-foreground mt-1">{t("bookingConfirmation.fromTime")}</div>
                </div>
                <div className="p-4 rounded-xl border border-border bg-muted/50 relative">
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{t("bookingConfirmation.checkOut")}</div>
                    <div className="font-bold text-card-foreground">{checkOut.format("DD/MM/YYYY")}</div>
                    <div className="text-xs text-muted-foreground mt-1">{t("bookingConfirmation.beforeTime")}</div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <div className="font-semibold text-card-foreground">{t("bookingConfirmation.totalStay")}</div>
                        <div className="text-sm text-muted-foreground">{t("bookingConfirmation.nights", { count: nights })}</div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <div className="font-semibold text-card-foreground">{t("bookingConfirmation.guestsTitle")}</div>
                        <div className="text-sm text-muted-foreground">
                            {t("bookingConfirmation.guests", { 
                                adults, 
                                childrenText: children > 0 ? t("bookingConfirmation.childrenText", { count: children }) : '' 
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
                <label className="block text-sm font-semibold text-card-foreground mb-2">
                    {t("bookingConfirmation.noteLabel")}
                </label>
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={t("bookingConfirmation.notePlaceholder")}
                    className="w-full bg-background border border-input text-foreground rounded-xl focus:ring-primary focus:border-primary block p-3 text-sm font-medium outline-none transition-all resize-none h-24"
                />
            </div>
        </div>
    );
};
