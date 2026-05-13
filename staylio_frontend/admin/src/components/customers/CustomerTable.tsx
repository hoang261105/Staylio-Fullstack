import { useState } from "react";
import { Mail, Phone, Eye, Unlock, Lock } from "lucide-react";
import type { UserResponse } from "../../../../common/interfaces/response/UserResponse";
import CustomerDetailModal from "./CustomerDetailModal";
import {
  useBulkUpdateCustomerStatusMutation,
  useDetailCustomer,
  useUpdateCustomerStatusMutation,
} from "../../../../common/hooks/useCustomers";
import { UserStatus } from "../../../../common/enums/UserStatus";

interface Props {
  customers: UserResponse[];
  sortBy: string;
  direction: "asc" | "desc";
  onSort: (field: string) => void;
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

export default function CustomerTable({ customers }: Props) {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number>(0);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    userId: number | null;
    currentStatus: UserStatus | null;
  }>({
    open: false,
    userId: null,
    currentStatus: null,
  });
  const { data: customer } = useDetailCustomer(selectedId);
  const { mutate: updateCustomerStatus } = useUpdateCustomerStatusMutation();
  const { mutate: bulkUpdateStatus } = useBulkUpdateCustomerStatusMutation();

  const handleDetail = (id: number) => {
    setSelectedId(id);
    setShowDetailModal(true);
  };

  const handleToggleStatus = (id: number, status: UserStatus) => {
    setConfirmModal({
      open: true,
      userId: id,
      currentStatus: status,
    });
  };

  const handleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === customers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(customers.map((c) => c.id));
    }
  };

  const handleBulkAction = (status: UserStatus) => {
    if (selectedIds.length === 0) return;

    bulkUpdateStatus({
      ids: selectedIds,
      status,
    });

    setSelectedIds([]);
  };

  const handleConfirm = () => {
    if (confirmModal.userId) {
      updateCustomerStatus(confirmModal.userId);
    }

    setConfirmModal({
      open: false,
      userId: null,
      currentStatus: null,
    });
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {selectedIds.length > 0 && (
            <div className="flex items-center justify-between mb-4 px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg">
              <span className="text-sm text-gray-700 font-medium">
                Đã chọn{" "}
                <span className="text-blue-600">{selectedIds.length}</span>{" "}
                khách hàng
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction(UserStatus.LOCKED)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-sm transition-all"
                >
                  <Lock size={14} />
                  Khóa
                </button>

                <button
                  onClick={() => handleBulkAction(UserStatus.ACTIVE)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg shadow-sm transition-all"
                >
                  <Unlock size={14} />
                  Mở khóa
                </button>
              </div>
            </div>
          )}

          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
              <tr>
                <th className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={
                      customers.length > 0 &&
                      selectedIds.length === customers.length
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-4 font-medium">Khách hàng</th>
                <th className="px-6 py-4 font-medium">Liên hệ</th>
                <th className="px-6 py-4 font-medium">Ngày sinh</th>
                <th className="px-6 py-4 font-medium">Trạng thái</th>
                <th className="px-6 py-4 font-medium text-center">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 text-gray-700">
              {customers?.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(customer.id)}
                      onChange={() => handleSelect(customer.id)}
                    />
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={customer.avatarUrl}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {customer.fullName}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {customer.id}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <Mail size={14} /> {customer.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={14} /> {customer.phone || "Chưa có"}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">{customer.dateOfBirth}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusMap[customer.status as keyof typeof statusMap]?.className}`}
                    >
                      {
                        statusMap[customer.status as keyof typeof statusMap]
                          ?.label
                      }
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-1">
                      <button
                        onClick={() => handleDetail(customer.id)}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        onClick={() =>
                          handleToggleStatus(customer.id, customer.status)
                        }
                        className={`p-2 rounded-lg transition-colors ${
                          customer.status === "LOCKED"
                            ? "hover:bg-green-50 text-green-600"
                            : "hover:bg-red-50 text-red-600"
                        }`}
                      >
                        {customer.status === "LOCKED" ? (
                          <Unlock size={16} />
                        ) : (
                          <Lock size={16} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && (
        <CustomerDetailModal
          customer={customer}
          onClose={() => setShowDetailModal(false)}
        />
      )}

      {/* Confirm Modal */}
      {confirmModal.open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Xác nhận
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              {confirmModal.currentStatus === "LOCKED"
                ? "Bạn có chắc muốn mở khóa khách hàng này?"
                : "Bạn có chắc muốn khóa khách hàng này?"}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() =>
                  setConfirmModal({
                    open: false,
                    userId: null,
                    currentStatus: null,
                  })
                }
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>

              <button
                onClick={handleConfirm}
                className={`px-4 py-2 text-sm text-white rounded-lg ${
                  confirmModal.currentStatus === "LOCKED"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {confirmModal.currentStatus === "LOCKED" ? "Mở khóa" : "Khóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
