import dayjs from "dayjs";

export const formatDateTime = (dateString?: string) => {
  if (!dateString) return "---";
  return dayjs(dateString).format("DD/MM/YYYY HH:mm");
};

export const formatDate = (dateString?: string) => {
  if (!dateString) return "---";
  return dayjs(dateString).format("DD/MM/YYYY");
};
