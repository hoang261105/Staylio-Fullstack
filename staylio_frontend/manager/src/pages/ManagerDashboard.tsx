import ManagerLayout from "../layout/ManagerLayout";
import DashboardStats from "../components/dashboard/DashboardStats";
import { Building2, Plus, Loader2, CheckCircle2, XCircle, Clock, User, Image as ImageIcon, Trash2, Info } from "lucide-react";
import { useHotelByManager } from "@common/hooks/useHotels";
import { HotelStatus } from "@common/enums/HotelStatus";
import { useState } from "react";
import CreateHotelModal from "../components/CreateHotelModal";
import EditHotelModal from "../components/EditHotelModal";
import RecentActivities from "../components/dashboard/RecentActivities";
import UpcomingBookings from "../components/dashboard/UpcomingBookings";
import { Button } from "@common/components/ui/button";

const getStatusConfig = (status: HotelStatus) => {
  switch (status) {
    case HotelStatus.CONFIRMED:
      return { label: "Đã duyệt", color: "text-green-600 bg-green-50 border-green-200", icon: CheckCircle2 };
    case HotelStatus.PENDING:
      return { label: "Chờ duyệt", color: "text-yellow-600 bg-yellow-50 border-yellow-200", icon: Clock };
    case HotelStatus.REJECTED:
      return { label: "Từ chối", color: "text-red-600 bg-red-50 border-red-200", icon: XCircle };
    case HotelStatus.DELETED:
      return { label: "Đã xóa", color: "text-gray-600 bg-gray-50 border-gray-200", icon: Trash2 };
    default:
      return { label: status, color: "text-gray-600 bg-gray-50 border-gray-200", icon: Info };
  }
};

export default function ManagerDashboard() {
  const { data: hotel, isLoading, isError } = useHotelByManager();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const hasHotelBranch = !!hotel && !isError;

  return (
    <ManagerLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Tổng quan
            </h1>
            <p className="text-muted-foreground">
              Xin chào, đây là tình hình kinh doanh hôm nay.
            </p>
          </div>
          {hasHotelBranch && (
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => setIsEditModalOpen(true)}
              >
                Chỉnh sửa thông tin
              </Button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !hasHotelBranch ? (
          <div className="bg-card rounded-2xl p-12 border border-border shadow-sm flex flex-col items-center justify-center text-center mt-8">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Building2 className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Chưa có thương hiệu khách sạn
            </h2>
            <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
              Tài khoản của bạn hiện chưa được liên kết với bất kỳ thương hiệu
              khách sạn nào. Vui lòng tạo mới để bắt đầu quản lý kinh doanh.
            </p>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-6 py-6 rounded-xl font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>Tạo mới thương hiệu</span>
            </Button>
          </div>
        ) : (
          <>
            {/* Hotel Info Banner */}
            <div className="bg-card rounded-2xl overflow-hidden shadow-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="w-full md:w-1/3 h-56 md:h-auto bg-muted relative">
                  {hotel.imageUrl ? (
                    <img
                      src={hotel.imageUrl}
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
                      <ImageIcon className="w-12 h-12 mb-3 opacity-30" />
                      <span className="text-sm font-medium">Chưa có hình ảnh thương hiệu</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm backdrop-blur-md flex items-center gap-1.5 ${hotel.active ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'
                      }`}>
                      {hotel.active ? (
                        <><CheckCircle2 className="w-3.5 h-3.5" /> Đang hoạt động</>
                      ) : (
                        <><XCircle className="w-3.5 h-3.5" /> Ngừng hoạt động</>
                      )}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-2">{hotel.name}</h2>
                      <div className="flex flex-wrap items-center text-muted-foreground text-sm gap-4">
                        <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-lg">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span>Chủ quản lý: <strong className="text-foreground">{hotel.hostHotelName}</strong></span>
                        </div>
                      </div>
                    </div>
                    {(() => {
                      const StatusIcon = getStatusConfig(hotel.status).icon;
                      return (
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap ${getStatusConfig(hotel.status).color}`}>
                          <StatusIcon className="w-4 h-4" />
                          {getStatusConfig(hotel.status).label}
                        </div>
                      );
                    })()}
                  </div>

                  <div className="mt-4 pt-4 border-t border-border/50">
                    <h4 className="text-sm font-semibold text-foreground mb-2">Mô tả thương hiệu</h4>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {hotel.description || "Chưa có mô tả chi tiết cho thương hiệu này."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <DashboardStats />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card rounded-2xl p-6 shadow-sm flex flex-col h-full">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Hoạt động gần đây
                </h3>
                <div className="flex-1 overflow-y-auto min-h-[300px] pr-2 custom-scrollbar">
                  <RecentActivities hotelBranchId={hotel.id} />
                </div>
              </div>
              <div className="bg-card rounded-2xl p-6 shadow-sm flex flex-col h-full">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Phòng sắp Check-in/Check-out
                </h3>
                <div className="flex-1 overflow-y-auto min-h-[300px] pr-2 custom-scrollbar">
                  <UpcomingBookings hotelBranchId={hotel.id} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <CreateHotelModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {hotel && (
        <EditHotelModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          hotel={hotel}
        />
      )}
    </ManagerLayout>
  );
}
