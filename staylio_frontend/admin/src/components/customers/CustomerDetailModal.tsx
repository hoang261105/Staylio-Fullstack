import { X } from "lucide-react";
import type { UserResponse } from "../../../../common/interfaces/response/UserResponse";

interface Props {
  customer: UserResponse;
  onClose: () => void;
}

const statusMap = {
  ACTIVE: {
    label: "Hoạt động",
    className: "bg-green-100 text-green-700",
  },
  INACTIVE: {
    label: "Không hoạt động",
    className: "bg-yellow-100 text-yellow-700",
  },
  LOCKED: {
    label: "Đã khóa",
    className: "bg-red-100 text-red-700",
  },
};

export default function CustomerDetailModal({ onClose, customer }: Props) {
  const status = statusMap[customer?.status as keyof typeof statusMap];
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl max-w-2xl w-full shadow-xl">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white rounded-t-xl">
          <h2 className="text-2xl font-semibold text-gray-900">
            Chi tiết khách hàng
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <img
              src={customer?.avatarUrl}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {customer?.fullName}
              </h3>
              <p className="text-gray-500">ID: {customer?.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">Email</div>
              <div className="font-medium text-gray-900">{customer?.email}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Số điện thoại</div>
              <div className="font-medium text-gray-900">
                {customer?.phone || "Chưa có"}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Ngày sinh</div>
              <div className="font-medium text-gray-900">
                {customer?.dateOfBirth}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Trạng thái</div>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status?.className}`}
              >
                {status?.label}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h4 className="font-medium text-gray-900 mb-4">
              Thống kê hoạt động
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                <div className="text-2xl font-semibold text-[#0066FF] mb-1">
                  0
                </div>
                <div className="text-sm text-gray-500">Đặt phòng</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                <div className="text-2xl font-semibold text-green-600 mb-1">
                  $0
                </div>
                <div className="text-sm text-gray-500">Tổng chi tiêu</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3 bg-gray-50 rounded-b-xl">
          <button className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-white hover:text-gray-900 transition-colors shadow-sm">
            Chỉnh sửa
          </button>
          <button className="flex-1 px-4 py-2.5 bg-[#0066FF] text-white font-medium rounded-lg hover:bg-[#0052CC] transition-colors shadow-sm">
            Gửi email
          </button>
        </div>
      </div>
    </div>
  );
}
