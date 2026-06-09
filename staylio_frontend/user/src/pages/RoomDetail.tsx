import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { ChevronRight, MapPin, Star } from "lucide-react";

import { useRoomById, useRooms } from "../../../common/hooks/useRooms";
import { useHotelById } from "../../../common/hooks/useHotels";
import { useHotelBranchById } from "../../../common/hooks/useHotelBranch";
import { useReviews } from "../../../common/hooks/useReviews";
import { useNearbyPlaces } from "../../../common/hooks/useNearbyPlaces";

import RoomCard from "../components/RoomCard";
import BranchMap from "../components/BranchMap";
import NearbyPlacesList from "../components/NearbyPlacesList";

import RoomGallery from "../components/room-detail/RoomGallery";
import RoomOverview from "../components/room-detail/RoomOverview";
import RoomReviewsPreview from "../components/room-detail/RoomReviewsPreview";
import RoomBookingCard from "../components/room-detail/RoomBookingCard";
import RoomReviewForm from "../components/room-detail/RoomReviewForm";

import type { RoomResponse } from "../../../common/interfaces/response/RoomResponse";
import type { RoomImageResponse } from "../../../common/interfaces/response/RoomImageResponse";

export default function RoomDetail() {
  const { hotelId, branchId, roomId } = useParams();
  const navigate = useNavigate();

  const { data: room, isLoading: isLoadingRoom } = useRoomById(Number(roomId));
  const { data: branch } = useHotelBranchById(Number(branchId));
  const { data: hotel } = useHotelById(Number(branch?.hotelId || 0));
  const { data: reviewsData } = useReviews({
    roomId: Number(roomId),
    page: 0,
    size: 2,
    sortBy: "createdAt",
    direction: "desc",
  });
  const { data: branchRoomsData } = useRooms({
    hotelBranchId: Number(branchId),
    page: 0,
    size: 10,
  });

  const { data: nearbyPlaces, isLoading: isLoadingNearby } = useNearbyPlaces(
    branch?.latitude || null,
    branch?.longitude || null
  );

  if (isLoadingRoom) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 font-sans flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center pt-28">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-b dark:border-gray-700lue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 font-sans flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center pt-28 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Không tìm thấy phòng</h2>
          <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 mb-4">Phòng bạn yêu cầu không tồn tại hoặc đã bị xóa.</p>
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
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 font-sans flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 w-full">
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mb-6">
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
          <span className="text-gray-900 dark:text-white font-medium">{room.roomName}</span>
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
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
              {room.roomName}
            </h1>
            <div className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
              <MapPin className="w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0 mt-0.5" />
              <span className="text-sm">
                <strong className="text-gray-800 dark:text-gray-100">
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

        <RoomGallery
          primaryImage={primaryImage}
          otherImages={otherImages}
          allImageUrls={allImageUrls}
        />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-[70%] flex flex-col gap-10">
            <RoomOverview room={room} policy={hotel?.policy} />
            {branch?.latitude && branch?.longitude && (
              <>
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Vị trí chi nhánh</h2>
                  <BranchMap
                    latitude={branch.latitude}
                    longitude={branch.longitude}
                    branchName={branch.hotelBranchName}
                    address={branch.address}
                    nearbyPlaces={nearbyPlaces}
                  />
                  <NearbyPlacesList places={nearbyPlaces || []} isLoading={isLoadingNearby} />
                </section>
                <hr className="border-gray-200 dark:border-gray-600" />
              </>
            )}

            <RoomReviewForm roomId={Number(roomId)} />
            <RoomReviewsPreview
              reviews={reviews}
              totalItems={room.countReview || 0}
              room={room}
              hotelId={hotelId || ""}
              branchId={branchId || ""}
              roomId={roomId || ""}
            />
          </div>

          <div className="w-full lg:w-[30%]">
            <RoomBookingCard room={room} roomId={Number(roomId)} />
          </div>
        </div>

        {similarRooms.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-600">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
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
    </div>
  );
}
