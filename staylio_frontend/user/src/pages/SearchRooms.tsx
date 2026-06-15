/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { RoomSearchCard } from "../components/RoomSearchCard";
import { useSearchRooms } from "../../../common/hooks/useRooms";
import { useProvinces, useWardsByProvinceId } from "../../../common/hooks/useProvinces";
import Pagination from "../../../common/components/Pagination";
import { RoomStatus } from "../../../common/enums/RoomStatus";
import type { RoomSearchResponse } from "../../../common/interfaces/response/RoomSearchResponse";
import { useDebounce } from "../../../common/hooks/useDebounce";
import { useTranslation } from "react-i18next";
import { Button } from "../../../common/components/ui/button";
import Select from "react-select";

type SelectOption = { value: number; label: string };

import { rsStyles } from "../../../common/styles/reactSelectStyles";

export default function SearchRooms() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialKeyword = searchParams.get("keyword") || "";
  const initialCheckIn = searchParams.get("checkInDate") || "";
  const initialCheckOut = searchParams.get("checkOutDate") || "";
  const initialAdults = searchParams.get("adults") ? Number(searchParams.get("adults")) : undefined;

  const [searchInput, setSearchInput] = useState(initialKeyword);
  const debouncedSearch = useDebounce(searchInput, 500);

  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [minRating, setMinRating] = useState<number | "">("");
  const [status, setStatus] = useState<RoomStatus | "">("");
  const [capacity, setCapacity] = useState<number | "">("");
  const [provinceId, setProvinceId] = useState<number | "">("");
  const [wardId, setWardId] = useState<number | "">("");

  const [sortBy, setSortBy] = useState<string>("roomName");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");

  const [page, setPage] = useState(1);

  const [provinceSearch, setProvinceSearch] = useState("");
  const [wardSearch, setWardSearch] = useState("");
  const debouncedProvinceSearch = useDebounce(provinceSearch, 400);
  const debouncedWardSearch = useDebounce(wardSearch, 400);

  const { data: provincesData, isLoading: loadingProvinces } = useProvinces({ search: debouncedProvinceSearch || undefined, page: 0, size: 100 });
  const { data: wardsData, isLoading: loadingWards } = useWardsByProvinceId(Number(provinceId), { search: debouncedWardSearch || undefined, page: 0, size: 100 });

  const provinceOptions: SelectOption[] =
    provincesData?.map((p: any) => ({ value: p.id, label: p.provinceName })) ?? [];
  const wardOptions: SelectOption[] =
    wardsData?.map((w: any) => ({ value: w.id, label: w.wardName })) ?? [];

  const selectedProvince = provinceOptions.find(o => o.value === provinceId) || null;
  const selectedWard = wardOptions.find(o => o.value === wardId) || null;

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    if (debouncedSearch) newParams.set("keyword", debouncedSearch);
    else newParams.delete("keyword");
    setSearchParams(newParams);
  }, [debouncedSearch]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, minPrice, maxPrice, minRating, status, sortBy, direction, capacity, provinceId, wardId]);

  const { data: searchResults, isLoading } = useSearchRooms({
    keyword: debouncedSearch,
    checkInDate: initialCheckIn || undefined,
    checkOutDate: initialCheckOut || undefined,
    adults: initialAdults,
    children: undefined,
    capacity: capacity !== "" ? Number(capacity) : undefined,
    page: page,
    size: 4,
    minPrice: minPrice !== "" ? Number(minPrice) : undefined,
    maxPrice: maxPrice !== "" ? Number(maxPrice) : undefined,
    minRating: minRating !== "" ? Number(minRating) : undefined,
    provinceId: provinceId !== "" ? Number(provinceId) : undefined,
    wardId: wardId !== "" ? Number(wardId) : undefined,
    status: status || undefined,
    sortBy,
    direction
  });

  const rooms = searchResults?.items || [];
  const pagination = searchResults?.pagination;

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <Header />

      <div className="bg-primary pt-28 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4 mt-6">{t('searchRooms.title')}</h1>
          <p className="text-primary-foreground/80">
            {t('searchRooms.foundRooms', {
              count: pagination?.totalItems || 0,
              keyword: debouncedSearch || t('searchRooms.allKeyword')
            })}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grow w-full flex flex-col md:flex-row gap-8">

        <div className="w-full md:w-72 shrink-0">
          <div className="bg-card rounded-2xl shadow-sm border border-border p-6 sticky top-28">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
              <Filter className="w-5 h-5 text-card-foreground" />
              <h2 className="text-lg font-bold text-card-foreground">{t('searchRooms.filterTitle')}</h2>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-card-foreground mb-3">{t('searchRooms.roomStatusLabel')}</label>
              <select
                className="w-full bg-background border border-input text-foreground rounded-xl focus:ring-primary focus:border-primary block p-3 text-sm font-medium outline-none transition-all"
                value={status}
                onChange={(e) => setStatus(e.target.value as RoomStatus | "")}
              >
                <option value="">{t('searchRooms.allStatus')}</option>
                <option value={RoomStatus.AVAILABLE}>{t('searchRooms.statusAvailable')}</option>
                <option value={RoomStatus.OCCUPIED}>{t('searchRooms.statusOccupied')}</option>
                <option value={RoomStatus.RESERVED}>{t('searchRooms.statusReserved')}</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-card-foreground mb-3">{t('searchRooms.priceRangeLabel')}</label>
              <div className="flex flex-col gap-3">
                <input
                  type="number"
                  min={0}
                  placeholder={t('searchRooms.priceMinPlaceholder')}
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : "")}
                  className="w-full bg-background border border-input text-foreground rounded-xl focus:ring-primary focus:border-primary block p-3 text-sm font-medium outline-none transition-all"
                />
                <input
                  type="number"
                  min={0}
                  placeholder={t('searchRooms.priceMaxPlaceholder')}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : "")}
                  className="w-full bg-background border border-input text-foreground rounded-xl focus:ring-primary focus:border-primary block p-3 text-sm font-medium outline-none transition-all"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-card-foreground mb-3">{t('searchRooms.minRatingLabel')}</label>
              <input
                type="number"
                placeholder={t('searchRooms.minRatingPlaceholder')}
                min="0" max="5" step="0.5"
                value={minRating}
                onChange={(e) => setMinRating(e.target.value ? Number(e.target.value) : "")}
                className="w-full bg-background border border-input text-foreground rounded-xl focus:ring-primary focus:border-primary block p-3 text-sm font-medium outline-none transition-all"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-card-foreground mb-3">{t('searchRooms.minCapacityLabel')}</label>
              <input
                type="number"
                placeholder={t('searchRooms.minCapacityPlaceholder')}
                min="1"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value ? Number(e.target.value) : "")}
                className="w-full bg-background border border-input text-foreground rounded-xl focus:ring-primary focus:border-primary block p-3 text-sm font-medium outline-none transition-all"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-card-foreground mb-3">{t('searchRooms.provinceLabel')}</label>
              <Select<SelectOption>
                options={provinceOptions}
                value={selectedProvince}
                onChange={(option) => {
                  setProvinceId(option?.value || "");
                  setWardId("");
                  setWardSearch("");
                }}
                onInputChange={setProvinceSearch}
                inputValue={provinceSearch}
                isLoading={loadingProvinces}
                placeholder={t('searchRooms.provinceSearchPlaceholder')}
                noOptionsMessage={() => t('searchRooms.noOptions')}
                loadingMessage={() => t('searchRooms.loading')}
                styles={rsStyles}
                menuPortalTarget={document.body}
                menuPosition="fixed"
                isClearable
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-card-foreground mb-3">{t('searchRooms.wardLabel')}</label>
              <Select<SelectOption>
                options={wardOptions}
                value={selectedWard}
                onChange={(option) => setWardId(option?.value || "")}
                onInputChange={setWardSearch}
                inputValue={wardSearch}
                isLoading={loadingWards && !!provinceId}
                isDisabled={!provinceId}
                placeholder={provinceId ? t('searchRooms.wardSearchPlaceholder') : t('searchRooms.wardSelectProvinceFirst')}
                noOptionsMessage={() => t('searchRooms.noOptions')}
                loadingMessage={() => t('searchRooms.loading')}
                styles={rsStyles}
                menuPortalTarget={document.body}
                menuPosition="fixed"
                isClearable
              />
            </div>

            <Button
              variant="outline"
              onClick={() => {
                setMinPrice(""); setMaxPrice("");
                setMinRating(""); setStatus("");
                setCapacity("");
                setProvinceId("");
                setWardId("");
              }}
              className="w-full mt-2 py-6 font-semibold rounded-xl text-sm"
            >
              {t('searchRooms.clearFilter')}
            </Button>
          </div>
        </div>

        <div className="flex-1">

          <div className="bg-card rounded-2xl shadow-sm border border-border p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">

            <form onSubmit={(e) => e.preventDefault()} className="relative w-full md:w-96 flex">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-input rounded-xl leading-5 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm font-medium transition-all"
                placeholder={t('searchRooms.searchPlaceholder')}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </form>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 bg-background px-4 py-2.5 rounded-xl border border-input w-full md:w-auto">
                <SlidersHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />
                <select
                  className="bg-transparent text-sm font-semibold text-foreground outline-none cursor-pointer w-full"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="roomName">{t('searchRooms.sortRoomName')}</option>
                  <option value="price">{t('searchRooms.sortPrice')}</option>
                  <option value="averageRating">{t('searchRooms.sortRating')}</option>
                </select>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setDirection(d => d === "asc" ? "desc" : "asc")}
                className="shrink-0 p-3 h-auto rounded-xl"
                title={direction === "asc" ? t('searchRooms.sortAsc') : t('searchRooms.sortDesc')}
              >
                <ArrowUpDown className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : rooms.length === 0 ? (
            <div className="bg-card rounded-2xl shadow-sm border border-border p-16 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-card-foreground mb-2">{t('searchRooms.noResults')}</h3>
              <p className="text-muted-foreground">{t('searchRooms.noResultsDesc')}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {rooms.map((room: RoomSearchResponse) => (
                  <RoomSearchCard key={room.roomId} room={room} />
                ))}
              </div>

              {pagination && pagination.totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    page={page - 1}
                    totalPages={pagination.totalPages}
                    onChange={(p) => setPage(p + 1)}
                  />
                </div>
              )}
            </>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
}
