/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { InputField } from "../../../common/components/InputField";
import { useApiErrors } from "../../../common/hooks/useApiErrors";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import {
  MapPin,
  Star,
  Maximize,
  Users,
  BedDouble,
  ChevronRight,
  ChevronLeft,
  X,
  UserCircle,
} from "lucide-react";
import { useRoomById, useRooms } from "../../../common/hooks/useRooms";
import { useBookedDates } from "../../../common/hooks/useBookings";
import { useHotelBranchById } from "../../../common/hooks/useHotelBranch";
import { useReviews } from "../../../common/hooks/useReviews";
import { getUtilityIcon } from "../../../common/utils/iconUtils";
import { useProfile } from "../../../common/hooks/useProfile";
import RoomCard from "../components/RoomCard";
import type { Key } from "react";
import type { RoomResponse } from "../../../common/interfaces/response/RoomResponse";
import type { RoomImageResponse } from "../../../common/interfaces/response/RoomImageResponse";
import type { UtilityResponse } from "../../../common/interfaces/response/UtilityResponse";
import type { ReviewResponse } from "../../../common/interfaces/response/ReviewResponse";

export default function RoomDetail() {
  const { hotelId, branchId, roomId } = useParams();
  const navigate = useNavigate();

  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [adults, setAdults] = useState<number | "">(1);
  const [children, setChildren] = useState<number | "">(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );

  const { data: user } = useProfile();
  const { fieldErrors, clearFieldError } = useApiErrors();

  const today = new Date();

  const minCheckOutDate = checkInDate
    ? new Date(checkInDate.getTime() + 86400000)
    : new Date(today.getTime() + 86400000);

  const handleCheckInChange = (date: Date | null) => {
    setCheckInDate(date);
    if (date && checkOutDate && date >= checkOutDate) {
      setCheckOutDate(new Date(date.getTime() + 86400000));
    }
  };

  const { data: room, isLoading: isLoadingRoom } = useRoomById(Number(roomId));
  const { data: bookedDatesData } = useBookedDates(Number(roomId));

  const excludeCheckInIntervals = useMemo(() => {
    if (!bookedDatesData) return [];
    return bookedDatesData.map((d: any) => {
      const end = new Date(d.checkOutDate);
      end.setDate(end.getDate() - 1);
      return {
        start: new Date(d.checkInDate),
        end,
      };
    });
  }, [bookedDatesData]);

  const excludeCheckOutIntervals = useMemo(() => {
    if (!bookedDatesData) return [];
    return bookedDatesData.map((d: any) => {
      const start = new Date(d.checkInDate);
      start.setDate(start.getDate() + 1);
      return {
        start,
        end: new Date(d.checkOutDate),
      };
    });
  }, [bookedDatesData]);

  const handleAdultsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val: number | "" = e.target.value ? Number(e.target.value) : "";

    if (val !== "") {
      const maxVal = room?.maxAdults || 1;
      if (val > maxVal) {
        val = maxVal;
      }
    }

    setAdults(val);
    clearFieldError("adults");
  };

  const handleChildrenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val: number | "" = e.target.value ? Number(e.target.value) : "";

    if (val !== "") {
      const maxVal = room?.maxChildren || 0;
      if (val > maxVal) {
        val = maxVal;
      }
    }

    setChildren(val);
    clearFieldError("children");
  };

  const handleBookNow = () => {
    if (!checkInDate || !checkOutDate) {
      toast.error("Vui lòng chọn ngày nhận và trả phòng");
      return;
    }
    if (!adults || adults <= 0) {
      toast.error("Vui lòng nhập số lượng người lớn");
      return;
    }

    const formatDate = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    navigate("/booking/confirmation", {
      state: {
        roomId: Number(roomId),
        checkInDate: formatDate(checkInDate),
        checkOutDate: formatDate(checkOutDate),
        adults: Number(adults),
        children: Number(children) || 0
      }
    });
  };

  const { data: branch } = useHotelBranchById(Number(branchId));
  const { data: reviewsData } = useReviews({
    roomId: Number(roomId),
    page: 0,
    size: 5,
    sortBy: "createdAt",
    direction: "desc",
  });
  const { data: branchRoomsData } = useRooms({
    hotelBranchId: Number(branchId),
    page: 0,
    size: 10,
  });

  if (isLoadingRoom) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center pt-28">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center pt-28 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Không tìm thấy phòng
          </h2>
          <p className="text-gray-500 mb-4">
            Phòng bạn yêu cầu không tồn tại hoặc đã bị xóa.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const reviews = reviewsData?.items || [];
  const similarRooms = (branchRoomsData?.items || [])
    .filter((r: RoomResponse) => r.id !== Number(roomId))
    .slice(0, 3);
  const primaryImage =
    room.images?.find((img: RoomImageResponse) => img.isPrimary)?.imageUrl ||
    room.images?.[0]?.imageUrl ||
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304";
  const otherImages =
    room.images
      ?.filter((img: RoomImageResponse) => img.imageUrl !== primaryImage)
      .slice(0, 4) || [];

  const allImageUrls = room.images?.length
    ? room.images.map((img: RoomImageResponse) => img.imageUrl)
    : [primaryImage];

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 w-full">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-blue-600 transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link
            to={`/hotel/${hotelId}/branch/${branchId}`}
            className="hover:text-blue-600 transition-colors"
          >
            {branch?.branchName || "Chi nhánh"}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{room.roomName}</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wide shadow-sm">
                {room.roomType}
              </span>
              <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-md border border-yellow-100">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-500" />
                <span className="text-sm font-bold">
                  {room.averageRating?.toFixed(1) || "0.0"}
                </span>
                <span className="text-xs ml-1 opacity-80">
                  ({room.countReview || 0} đánh giá)
                </span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
              {room.roomName}
            </h1>
            <div className="flex items-start gap-2 text-gray-600">
              <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
              <span className="text-sm">
                <strong className="text-gray-800">
                  {branch?.hotelName} - {branch?.hotelBranchName}
                </strong>{" "}
                <br />
                {branch?.address
                  ? `${branch.address}, ${branch?.wardName}, ${branch?.provinceName}`
                  : "Đang tải địa chỉ..."}
              </span>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-2xl overflow-hidden mb-10 h-[50vh] min-h-100 relative group">
          <div className="w-full h-full">
            <img
              src={primaryImage}
              alt="Primary"
              onClick={() =>
                setSelectedImageIndex(
                  Math.max(0, allImageUrls.indexOf(primaryImage)),
                )
              }
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
            />
          </div>
          <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-2 h-full">
            {otherImages.map(
              (img: RoomImageResponse, idx: Key | null | undefined) => (
                <img
                  key={idx}
                  src={img.imageUrl}
                  alt={`Gallery ${idx}`}
                  onClick={() =>
                    setSelectedImageIndex(
                      Math.max(0, allImageUrls.indexOf(img.imageUrl)),
                    )
                  }
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                />
              ),
            )}
            {Array.from({ length: Math.max(0, 4 - otherImages.length) }).map(
              (_, idx) => (
                <img
                  key={`fill-${idx}`}
                  src={primaryImage}
                  alt={`Fill ${idx}`}
                  onClick={() =>
                    setSelectedImageIndex(
                      Math.max(0, allImageUrls.indexOf(primaryImage)),
                    )
                  }
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer opacity-80"
                />
              ),
            )}
          </div>
          <button
            onClick={() => setSelectedImageIndex(0)}
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md text-gray-900 font-semibold px-4 py-2 rounded-lg shadow-lg hover:bg-white transition-colors text-sm"
          >
            Xem tất cả ảnh
          </button>
        </div>

        {/* Layout 2 cột */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cột trái (Nội dung) */}
          <div className="w-full lg:w-[70%] flex flex-col gap-10">
            {/* Về phòng này */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Tổng quan phòng
              </h2>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Tiện ích phòng
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2">
                {room.utilities?.map((u: UtilityResponse) => {
                  const Icon = getUtilityIcon(u.iconName);
                  return (
                    <div
                      key={u.id}
                      className="flex items-center gap-3 text-gray-700"
                    >
                      <div className="text-blue-600">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium">{u.title}</span>
                    </div>
                  );
                })}
                {(!room.utilities || room.utilities.length === 0) && (
                  <div className="text-gray-500 italic">
                    Chưa có thông tin tiện ích.
                  </div>
                )}
              </div>
            </section>

            <hr className="border-gray-200" />

            {/* Đánh giá */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Đánh giá khách hàng
                </h2>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-lg">
                    <Star className="w-4 h-4 fill-yellow-900" />
                    <span className="font-bold text-lg">
                      {room.averageRating?.toFixed(1) || "0.0"}
                    </span>
                  </div>
                  <span className="text-gray-500 font-medium text-sm">
                    / 5 ({room.countReview || 0} đánh giá)
                  </span>
                </div>
              </div>

              {reviews.length === 0 ? (
                <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100">
                  <p className="text-gray-500">
                    Phòng này chưa có đánh giá nào.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {reviews.map((review: ReviewResponse) => (
                    <div
                      key={review.id}
                      className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {review.avatarUrl ? (
                            <img
                              src={review.avatarUrl}
                              alt={review.fullName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <UserCircle className="w-10 h-10 text-gray-300" />
                          )}
                          <div>
                            <h4 className="font-bold text-gray-900">
                              {review.fullName}
                            </h4>
                            <p className="text-xs text-gray-400">
                              {new Date(review.createdAt).toLocaleDateString(
                                "vi-VN",
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-500 bg-yellow-50 px-2 py-1 rounded-md">
                          <Star className="w-3.5 h-3.5 fill-yellow-500" />
                          <span className="text-xs font-bold">
                            {review.rating}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {review.comment}
                      </p>

                      {review.replyComment && (
                        <div className="mt-4 bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                              S
                            </div>
                            <span className="font-bold text-sm text-gray-900">
                              Phản hồi từ Staylio
                            </span>
                            <span className="text-xs text-gray-400 ml-auto">
                              {new Date(review.replyAt).toLocaleDateString(
                                "vi-VN",
                              )}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">
                            {review.replyComment}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                  {reviewsData && reviewsData.pagination.totalPages > 1 && (
                    <button className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                      Xem tất cả đánh giá
                    </button>
                  )}
                </div>
              )}
            </section>
          </div>

          {/* Cột phải (Sticky Booking Card) */}
          <div className="w-full lg:w-[30%]">
            <div className="sticky top-28 bg-white border border-gray-200 rounded-2xl shadow-xl p-6">
              <div className="flex items-end gap-1 mb-6 pb-6 border-b border-gray-100">
                <span className="text-3xl font-bold text-blue-600">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(room.price)}
                </span>
                <span className="text-gray-500 font-medium">/ đêm</span>
              </div>

              <div className="flex flex-col gap-4 mb-6">
                <div className="grid grid-cols-2 gap-2 border border-gray-300 rounded-xl overflow-hidden p-1 bg-gray-50/50">
                  <div className="p-2 text-left border-r border-gray-200">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                      Nhận phòng
                    </label>
                    <DatePicker
                      selected={checkInDate}
                      onChange={handleCheckInChange}
                      minDate={today}
                      excludeDateIntervals={excludeCheckInIntervals}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Chọn ngày"
                      className="text-sm font-semibold text-gray-900 bg-transparent outline-none w-full cursor-pointer placeholder:font-normal placeholder:text-gray-400"
                    />
                  </div>
                  <div className="p-2 text-left">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                      Trả phòng
                    </label>
                    <DatePicker
                      selected={checkOutDate}
                      onChange={(date: any) => setCheckOutDate(date)}
                      minDate={minCheckOutDate}
                      excludeDateIntervals={excludeCheckOutIntervals}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Chọn ngày"
                      className="text-sm font-semibold text-gray-900 bg-transparent outline-none w-full cursor-pointer placeholder:font-normal placeholder:text-gray-400"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <InputField
                    label="Người lớn"
                    type="number"
                    min={1}
                    max={room.maxAdults}
                    value={adults}
                    onChange={handleAdultsChange}
                    error={fieldErrors.adults}
                    placeholder={`Tối đa: ${room.maxAdults}`}
                  />
                  <InputField
                    label="Trẻ em"
                    type="number"
                    min={0}
                    max={room.maxChildren}
                    value={children}
                    onChange={handleChildrenChange}
                    error={fieldErrors.children}
                    placeholder={`Tối đa: ${room.maxChildren}`}
                  />
                </div>
              </div>

              {user ? (
                <>
                  <button
                    onClick={handleBookNow}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Đặt phòng ngay
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-4">
                    Bạn chưa bị trừ tiền lúc này
                  </p>
                </>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  Bạn cần đăng nhập để đặt phòng
                </button>
              )}
            </div>
          </div>
        </div>

        {similarRooms.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Các phòng khác tại chi nhánh này
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarRooms.map((room: RoomResponse) => (
                <RoomCard key={room.id} room={room} branchInfo={branch} />
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />

      {/* Lightbox */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 z-100 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm">
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-black/50 p-2 rounded-full transition-colors"
            onClick={() => setSelectedImageIndex(null)}
          >
            <X className="w-8 h-8" />
          </button>

          {allImageUrls.length > 1 && (
            <>
              <button
                className="absolute left-6 text-white/70 hover:text-white bg-black/50 p-2 rounded-full transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex(
                    (selectedImageIndex - 1 + allImageUrls.length) %
                    allImageUrls.length,
                  );
                }}
              >
                <ChevronLeft className="w-8 h-8" />
              </button>

              <button
                className="absolute right-6 text-white/70 hover:text-white bg-black/50 p-2 rounded-full transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex(
                    (selectedImageIndex + 1) % allImageUrls.length,
                  );
                }}
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          <img
            src={allImageUrls[selectedImageIndex]}
            alt="Room detail view"
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
          />

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 px-4 py-2 rounded-full text-white text-sm font-medium">
            {selectedImageIndex + 1} / {allImageUrls.length}
          </div>
        </div>
      )}
    </div>
  );
}
