import { useState } from "react";
import { Eye, Edit, MoreVertical } from "lucide-react";

export default function ManagerBranchListView() {
  // Mock data for manager's branches
  const [branches] = useState([
    {
      id: 1,
      name: "Staylio Premium Hà Nội",
      address: "123 Quận Hoàn Kiếm, Hà Nội",
      status: "active",
      rooms: 45,
      revenue: "150M",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Staylio Boutique Đà Nẵng",
      address: "456 Quận Hải Châu, Đà Nẵng",
      status: "active",
      rooms: 32,
      revenue: "90M",
      rating: 4.5,
    },
  ]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-50/80 text-xs uppercase text-gray-700 font-semibold border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Chi nhánh</th>
              <th className="px-6 py-4">Địa chỉ</th>
              <th className="px-6 py-4">Số phòng</th>
              <th className="px-6 py-4">Doanh thu (Tháng)</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {branches.map((branch) => (
              <tr
                key={branch.id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-900">
                    {branch.name}
                  </div>
                  <div className="text-xs flex items-center gap-1 text-amber-500 mt-1">
                    ★ {branch.rating}
                  </div>
                </td>
                <td className="px-6 py-4 truncate max-w-xs">{branch.address}</td>
                <td className="px-6 py-4">{branch.rooms} phòng</td>
                <td className="px-6 py-4 font-medium text-emerald-600">
                  {branch.revenue}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    Hoạt động
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      className="p-1.5 text-gray-400 hover:text-[#0066FF] hover:bg-blue-50 rounded-lg transition-colors"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {branches.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <p className="text-gray-500">Không tìm thấy chi nhánh nào</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
        <div>
          Hiển thị 1 đến {branches.length} của {branches.length} kết quả
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50">
            Trước
          </button>
          <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50">
            Sau
          </button>
        </div>
      </div>
    </div>
  );
}
