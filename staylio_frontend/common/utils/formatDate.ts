export const formatDate = (dateString: string) => {
    if (!dateString) return "Chưa có";

    const [year, month, day] = dateString.split("-");

    return `${day}/${month}/${year}`;
}