import { MapPin, Star } from "lucide-react";
import type { HotelBranchResponse } from "../../../../common/interfaces/response/HotelBranchResponse";
import { useTranslation } from "react-i18next";
import type { RoomResponse } from "../../../../common/interfaces/response/RoomResponse";

interface RoomInfoCardProps {
    room?: RoomResponse;
    branch?: HotelBranchResponse;
}

export const RoomInfoCard = ({ room, branch }: RoomInfoCardProps) => {
    const { t } = useTranslation();
    if (!room || !branch) return <div className="animate-pulse bg-gray-200 dark:bg-gray-600 h-48 rounded-2xl"></div>;

    const primaryImage = room.images?.find(img => img.isPrimary)?.imageUrl || room.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1631049307264-da0ec9d70304";

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t("bookingConfirmation.roomDetailsTitle")}</h2>
            <div className="flex gap-4">
                <img
                    src={primaryImage}
                    alt={room.roomName}
                    className="w-24 h-24 object-cover rounded-xl shrink-0"
                />
                <div className="flex flex-col flex-1 min-w-0">
                    <div className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md w-fit mb-1">
                        {room.roomType}
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white truncate" title={room.roomName}>
                        {room.roomName}
                    </h3>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mt-1 truncate" title={branch.hotelBranchName}>
                        {branch.hotelBranchName}
                    </p>

                    <div className="flex items-center gap-1 mt-1 text-gray-500 dark:text-gray-400 dark:text-gray-500 text-xs">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{branch.address}</span>
                    </div>

                    <div className="flex items-center gap-1 mt-2">
                        <div className="flex items-center text-xs font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded">
                            <Star className="w-3 h-3 fill-current mr-0.5" />
                            {branch.averageRating || 5.0}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 ml-1">{t("bookingConfirmation.excellent")}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
