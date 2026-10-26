export interface GalleryItem {
  id: number;
  src: string;
  title: string;
  chineseTitle: string;
  category: "sejarah" | "kegiatan" | "kebersamaan";
  aspect?: "landscape" | "portrait" | "wide";
}

export const galleryItems: GalleryItem[] = [
  {
    id: 1,
    src: "/images/guang-hang-1.jpg",
    title: "Kebersamaan Umat Kuang Hang Fo Thang",
    chineseTitle: "同心同德 • 全體道親大合影",
    category: "kebersamaan",
  },
  {
    id: 2,
    src: "/images/guang-hang-2.jpg",
    title: "Pembinaan & Kelas Dharma Umat",
    chineseTitle: "明理精進 • 道育修持班程",
    category: "kegiatan",
  },
  {
    id: 3,
    src: "/images/guang-hang-3.jpg",
    title: "Harmonisasi Barisan Kebajikan",
    chineseTitle: "道氣和諧 • 善行同舟共勉",
    category: "kebersamaan",
  },
  {
    id: 4,
    src: "/images/guang-hang-4.jpg",
    title: "Semangat Pelayanan Umat & Muda-Mudi",
    chineseTitle: "朝氣蓬勃 • 青年後起之秀",
    category: "kegiatan",
  },
  {
    id: 5,
    src: "/images/guang-hang-5.jpg",
    title: "Perayaan Hari Besar & Doa Bersama",
    chineseTitle: "仙佛聖誕 • 祈福團拜盛會",
    category: "kegiatan",
  },
  {
    id: 6,
    src: "/images/guang-hang-6.jpg",
    title: "Momen Pembangunan Fisik Gedung (2005)",
    chineseTitle: "篳路藍縷 • 2005年大樓動土興建",
    category: "sejarah",
  },
  {
    id: 7,
    src: "/images/guang-hang-7.jpg",
    title: "Peletakan Fondasi Tanah Palmerah",
    chineseTitle: "開拓根基 • 奠定巴美拉聖基",
    category: "sejarah",
  },
  {
    id: 8,
    src: "/images/guang-hang-8.jpg",
    title: "Masa-Masa Awal Perintisan Wadah",
    chineseTitle: "開荒歲月 • 前賢篳路之初",
    category: "sejarah",
  },
  {
    id: 9,
    src: "/images/guang-hang-9.jpg",
    title: "Perjalanan di Kebun Jeruk (1999)",
    chineseTitle: "弘法西區 • Kebun Jeruk 時期安座",
    category: "sejarah",
  },
  {
    id: 10,
    src: "/images/guang-hang-10.jpg",
    title: "Penuh Syukur & Dukungan Para Than Cu",
    chineseTitle: "同舟共濟 • 壇主菩薩無私借處",
    category: "sejarah",
  },
  {
    id: 11,
    src: "/images/guang-hang-11.jpg",
    title: "Kenangan Tempat Sementara Palmerah Utara",
    chineseTitle: "歲月芳華 • 巴美拉北二路留影",
    category: "sejarah",
  },
  {
    id: 12,
    src: "/images/guang-hang-12.jpg",
    title: "Gotong Royong & Pelayanan Tanpa Lelah",
    chineseTitle: "默默耕耘 • 廚房辦道了愿之美",
    category: "kegiatan",
  },
  {
    id: 13,
    src: "/images/guang-hang-13.jpg",
    title: "Keluarga Besar Kuang Hang Fo Thang",
    chineseTitle: "廣航一家 • 聖凡兼顧法喜充滿",
    category: "kebersamaan",
  },
  {
    id: 14,
    src: "/images/guang-hang-14.jpg",
    title: "Senyum Sukacita Umat Lintas Generasi",
    chineseTitle: "老幼同歡 • 世代傳承菩提心",
    category: "kebersamaan",
  },
  {
    id: 15,
    src: "/images/guang-hang-15.jpg",
    title: "Keagungan Altar & Gedung Kuang Hang Fo Thang",
    chineseTitle: "聖殿莊嚴 • 廣航佛堂落成聖像",
    category: "kebersamaan",
  },
];
