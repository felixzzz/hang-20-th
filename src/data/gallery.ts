export interface GalleryItem {
  id: number;
  src: string;
  title: string;
  category: "sejarah" | "kegiatan" | "kebersamaan";
  aspect?: "landscape" | "portrait" | "wide";
}

export const galleryItems: GalleryItem[] = [
  {
    id: 1,
    src: "/images/guang-hang-1.jpg",
    title: "Kebersamaan Umat Kuang Hang Fo Thang",
    category: "kebersamaan",
  },
  {
    id: 2,
    src: "/images/guang-hang-2.jpg",
    title: "Pembinaan & Kelas Dharma Umat",
    category: "kegiatan",
  },
  {
    id: 3,
    src: "/images/guang-hang-3.jpg",
    title: "Harmonisasi Barisan Kebajikan",
    category: "kebersamaan",
  },
  {
    id: 4,
    src: "/images/guang-hang-4.jpg",
    title: "Semangat Pelayanan Umat & Muda-Mudi",
    category: "kegiatan",
  },
  {
    id: 5,
    src: "/images/guang-hang-5.jpg",
    title: "Perayaan Hari Besar & Doa Bersama",
    category: "kegiatan",
  },
  {
    id: 6,
    src: "/images/guang-hang-6.jpg",
    title: "Momen Pembangunan Fisik Gedung (2005)",
    category: "sejarah",
  },
  {
    id: 7,
    src: "/images/guang-hang-7.jpg",
    title: "Peletakan Fondasi Tanah Palmerah",
    category: "sejarah",
  },
  {
    id: 8,
    src: "/images/guang-hang-8.jpg",
    title: "Masa-Masa Awal Perintisan Wadah",
    category: "sejarah",
  },
  {
    id: 9,
    src: "/images/guang-hang-9.jpg",
    title: "Perjalanan di Kebun Jeruk (1999)",
    category: "sejarah",
  },
  {
    id: 10,
    src: "/images/guang-hang-10.jpg",
    title: "Penuh Syukur & Dukungan Para Than Cu",
    category: "sejarah",
  },
  {
    id: 11,
    src: "/images/guang-hang-11.jpg",
    title: "Kenangan Tempat Sementara Palmerah Utara",
    category: "sejarah",
  },
  {
    id: 12,
    src: "/images/guang-hang-12.jpg",
    title: "Gotong Royong & Pelayanan Tanpa Lelah",
    category: "kegiatan",
  },
  {
    id: 13,
    src: "/images/guang-hang-13.jpg",
    title: "Keluarga Besar Kuang Hang Fo Thang",
    category: "kebersamaan",
  },
  {
    id: 14,
    src: "/images/guang-hang-14.jpg",
    title: "Senyum Sukacita Umat Lintas Generasi",
    category: "kebersamaan",
  },
  {
    id: 15,
    src: "/images/guang-hang-15.jpg",
    title: "Keagungan Altar & Gedung Kuang Hang Fo Thang",
    category: "kebersamaan",
  },
];
