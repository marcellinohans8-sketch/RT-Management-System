export const monthNames = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export const shortMonthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

export const formatCurrency = (value) =>
  `Rp ${Number(value || 0).toLocaleString("id-ID")}`;

export const residentStatusLabel = {
  permanent: "Tetap",
  contract: "Kontrak",
};

export const houseStatusLabel = {
  occupied: "Dihuni",
  vacant: "Tidak dihuni",
};

export const paymentStatusLabel = {
  paid: "Lunas",
  unpaid: "Belum lunas",
};

export const categoryLabel = {
  security: "Satpam",
  cleaning: "Kebersihan",
  road: "Perbaikan jalan",
  drainage: "Perbaikan selokan",
  maintenance: "Pemeliharaan",
  other: "Lainnya",
};
