export interface ManagerDashboardStatsResponse {
    totalRooms: number;
    stayingGuests: number;
    newBookings: number;
    estimatedRevenue: number;
    roomGrowth: number; 
    guestGrowthPercent: number;
    bookingGrowthPercent: number;
    revenueGrowthPercent: number;
}