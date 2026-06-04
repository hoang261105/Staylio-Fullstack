import dayjs from "dayjs";

export const formatDateTime = (dateString?: string) => {
  if (!dateString) return "---";
  const normalizedDate = dateString.includes("T") && !dateString.endsWith("Z") ? `${dateString}Z` : dateString;
  return dayjs(normalizedDate).format("DD/MM/YYYY HH:mm");
};

export const formatDate = (dateString?: string) => {
  if (!dateString) return "---";
  const normalizedDate = dateString.includes("T") && !dateString.endsWith("Z") ? `${dateString}Z` : dateString;
  return dayjs(normalizedDate).format("DD/MM/YYYY");
};
