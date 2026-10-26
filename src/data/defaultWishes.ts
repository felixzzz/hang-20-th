export interface WishItem {
  id: string;
  name: string;
  status: "hadir" | "tidak_hadir" | "ragu";
  guests: number;
  message: string;
  timestamp: string;
}

export const initialWishes: WishItem[] = [
  {
    id: "wish-1",
    name: "Keluarga Besar Lim",
    status: "hadir",
    guests: 4,
    message:
      "Selamat Ulang Tahun ke-20 untuk Kuang Hang Fo Thang. Terima kasih atas bimbingan para pendahulu dan Tien Chuan She. Semoga perahu kebijaksanaan terus berlayar menyelamatkan lebih banyak umat manusia.",
    timestamp: "2026-10-26 10:15",
  },
  {
    id: "wish-2",
    name: "Cen Shixiong & Shijie",
    status: "hadir",
    guests: 2,
    message:
      "Syukur atas Tian En Shi De. Dua puluh tahun penuh kenangan dan perjuangan gotong royong. Semoga Kuang Hang senantiasa damai, harmonis, dan penerus dharma terus bertambah.",
    timestamp: "2026-10-26 11:30",
  },
  {
    id: "wish-3",
    name: "Muda-Mudi Kuang Hang",
    status: "hadir",
    guests: 6,
    message:
      "Happy 20th Anniversary Guang Hang Fo Thang! Kami bangga bisa tumbuh dan berbakti bersama di wadah yang penuh kehangatan ini. Semangat melayani bersama!",
    timestamp: "2026-10-26 13:00",
  },
  {
    id: "wish-4",
    name: "Than Cu Wang & Keluarga",
    status: "hadir",
    guests: 3,
    message:
      "Semoga semangat ikrar Maotian Shixiong selalu terpatri di dalam hati kita semua. Selamat merayakan 20 tahun dedikasi dan cinta kasih.",
    timestamp: "2026-10-26 14:20",
  },
];
