/* eslint-disable react-hooks/static-components */
import { X, Info, FileText } from "lucide-react";
import type { UtilityResponse } from "../../../../common/interfaces/response/UtilityResponse";
import { getUtilityIcon } from "../../../../common/utils/iconUtils";

interface UtilityDetailModalProps {
  utility: UtilityResponse;
  onClose: () => void;
}

export default function UtilityDetailModal({ utility, onClose }: UtilityDetailModalProps) {
  const Icon = getUtilityIcon(utility?.iconName);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Info className="w-5 h-5 text-[#0066FF]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Chi tiết tiện ích</h2>
              <p className="text-sm text-gray-500">Thông tin đầy đủ của tiện ích</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex items-start gap-5">
              <div className="w-20 h-20 bg-blue-50 text-[#0066FF] rounded-xl flex items-center justify-center shrink-0 border border-blue-100 shadow-sm">
                <Icon className="w-10 h-10" />
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="text-xl font-bold text-gray-900">{utility?.title}</h3>
                <div className="text-sm text-gray-500 font-medium">Tên icon: {utility?.iconName}</div>
                <div className="flex gap-2 mt-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${!utility?.isDeleted
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-red-50 text-red-700 border-red-200"
                      }`}
                  >
                    {!utility?.isDeleted ? "Đang hoạt động" : "Ngừng hoạt động"}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3 pb-3 border-b border-gray-50 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500" />
                Mô tả chi tiết
              </h4>
              {utility?.description ? (
                <div className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed bg-gray-50/50 p-4 rounded-lg border border-gray-50">
                  {utility?.description}
                </div>
              ) : (
                <div className="text-sm text-gray-400 italic text-center py-6 bg-gray-50/50 rounded-lg border border-gray-50">
                  Tiện ích này chưa có mô tả chi tiết
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium border border-gray-200 text-gray-700 bg-white rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
