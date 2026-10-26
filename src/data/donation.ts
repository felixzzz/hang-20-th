export interface DonationAccount {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  isReady: boolean;
  notes?: string;
  qrisImage?: string;
}

export const donationConfig: DonationAccount = {
  bankName: "BCA / Bank Transfer",
  accountNumber: "Akan Diumumkan Segera",
  accountHolder: "Kuang Hang Fo Thang",
  isReady: false, // Ubah ke true jika nomor rekening sudah tersedia
  notes: "Informasi nomor rekening resmi akan segera diperbarui oleh panitia.",
};
