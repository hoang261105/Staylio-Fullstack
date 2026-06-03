export interface RoomImageDetailProps {
  imageId?: number;
  onClose?: () => void;
  role?: "admin" | "manager";
}
