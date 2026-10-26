export interface Milestone {
  year: string;
  title: string;
  chineseTitle: string;
  location?: string;
  chineseLocation?: string;
  description: string;
  chineseDescription: string;
  highlight: string;
  chineseHighlight: string;
  image?: string;
}

export const historyMilestones: Milestone[] = [
  {
    year: "1997",
    title: "Awal Perintisan Wadah",
    chineseTitle: "開荒啟航 • 播撒善種",
    location: "Palmerah Barat, Jakarta Barat",
    chineseLocation: "雅加達西區巴美拉西路",
    description:
      "Atas utusan Tien Chuan She, para pendahulu (Lim Pao Fu Ciang She, Cen Kuo Fa Ciang She, dan Ye Mei Mei Ciang She) dengan penuh ketulusan mulai membuka wadah keTuhanan Kuang Hang Fo Thang di daerah Palmerah Barat.",
    chineseDescription:
      "奉點傳師慈命，前賢大德（林寶福講師、曾國法講師、葉美妹講師）以至誠之心，於雅加達巴美拉西區開荒播種，正式啟航廣航道務。",
    highlight: "Benih kebajikan pertama ditaburkan dengan semangat pengorbanan tanpa pamrih.",
    chineseHighlight: "第一顆菩提善種在無私奉獻中生根發芽。",
    image: "/images/guang-hang-8.jpg",
  },
  {
    year: "1997",
    title: "Lokasi Pertama Ibadah",
    chineseTitle: "初心之地 • 簡樸溫馨",
    location: "Jalan Palmerah Utara II",
    chineseLocation: "巴美拉北二路初期佛堂",
    description:
      "Kegiatan kebaktian dan pembinaan umat awal mula bertempat di sebuah bangunan sederhana di Jalan Palmerah Utara II, menjadi saksi keteguhan hati para perintis awal.",
    chineseDescription:
      "早期道親共修與班程設於巴美拉北二路一處簡樸處所，見證了草創初期前賢們堅定不移的堅毅道心。",
    highlight: "Meskipun tempat bersahaja, kehangatan persaudaraan se-dharma begitu mendalam.",
    chineseHighlight: "雖處簡樸陋室，同修法喜與骨肉至情深植人心。",
    image: "/images/guang-hang-11.jpg",
  },
  {
    year: "1999",
    title: "Pindahan ke Kebun Jeruk",
    chineseTitle: "法舟擴展 • 遷址西區",
    location: "Jalan Kelapa Dua Raya, Kebun Jeruk",
    chineseLocation: "Kebun Jeruk 柯拉巴杜亞路",
    description:
      "Seiring bertambahnya umat yang berjodoh dan kegiatan yang kian berkembang, Kuang Hang Fo Thang berpindah lokasi ke Kebun Jeruk dan sempat diresmikan pada 29 Desember 1999.",
    chineseDescription:
      "隨著求道道親日增、班程活動蓬勃發展，廣航佛堂遷往 Kebun Jeruk，並於1999年12月29日舉行莊嚴落成典禮。",
    highlight: "Diresmikan pada 29 Desember 1999 sebagai langkah perluasan wadah ketuhanan.",
    chineseHighlight: "1999年12月29日落成開光，標誌著弘道法舟拓展新程。",
    image: "/images/guang-hang-9.jpg",
  },
  {
    year: "2000",
    title: "Masa Ujian & Wadah Sementara",
    chineseTitle: "同舟共濟 • 借址護道",
    location: "Kediaman Than Cu Palmerah",
    chineseLocation: "巴美拉壇主寓所臨時佛堂",
    description:
      "Karena kendala kapasitas lingkungan, kegiatan sementara dipindahkan ke kediaman para pendahulu yang tulus bersedia membantu, yaitu Tay Than Cu (Jalan Palmerah Utara III) dan Wang Ce Ce Than Cu.",
    chineseDescription:
      "因場地環境調整，道務活動暫時借設於熱心壇主之寓所——戴壇主（巴美拉北三路）及王姊姊壇主家中，共度考驗。",
    highlight: "Kekeluargaan dan ketulusan hati para Than Cu menjaga pelita kebajikan tetap menyala.",
    chineseHighlight: "壇主菩薩赤誠護持，使廣航慧命之火歷久不熄。",
    image: "/images/guang-hang-10.jpg",
  },
  {
    year: "2001",
    title: "Pembelian Lahan Permanen",
    chineseTitle: "奠定宏基 • 購置聖地",
    location: "Jl. Palmerah Utara III No. 186A",
    chineseLocation: "巴美拉北三路186A號永久基地",
    description:
      "Melalui tekad bulat, hasil penjualan tempat di Kebun Jeruk digunakan untuk membeli sebidang tanah seluas 538 meter persegi di Jalan Palmerah Utara III No. 186A sebagai fondasi tempat ibadah permanen.",
    chineseDescription:
      "眾人發大愿心，將 Kebun Jeruk 房舍轉售之資金全數投入，於巴美拉北三路186A號購置538平方米土地，作為永久道場基石。",
    highlight: "Lahan seluas 538 m² diikhtiarkan sebagai rumah rohani bagi generasi ke depan.",
    chineseHighlight: "購置538平方米土地，為世代子孫立下千秋聖業家園。",
    image: "/images/guang-hang-7.jpg",
  },
  {
    year: "2005",
    title: "Proses Pembangunan Penuh Perjuangan",
    chineseTitle: "篳路藍縷 • 齊心同築",
    location: "Jl. Palmerah Utara III No. 186A",
    chineseLocation: "巴美拉北三路建堂工地",
    description:
      "Pembangunan fisik dimulai. Selama prosesnya, panitia menghadapi berbagai ujian nyata: keterbatasan dana mingguan, kendala perizinan legalitas, hingga peristiwa tembok samping yang sempat roboh. Semua dilalui dengan doa, keikhlasan, dan gotong royong.",
    chineseDescription:
      "大樓破土動工。建堂期間歷經艱難險阻：經費短缺、執照公文繁雜、側牆偶有坍塌等嚴峻考驗。眾人以祈禱、汗水與至誠共同克服。",
    highlight: "Setiap butir bata dan keringat dilandasi ketulusan hati para umat.",
    chineseHighlight: "一磚一瓦凝聚萬千道親之願力，汗水化作無上功德金蓮。",
    image: "/images/guang-hang-6.jpg",
  },
  {
    year: "2006",
    title: "Peresmian Gedung Kuang Hang Fo Thang",
    chineseTitle: "廣航落成 • 佛光普照",
    location: "12 November 2006",
    chineseLocation: "2006年11月12日 落成大典",
    description:
      "Berkat karunia Tian En Shi De (天恩師德), kerja keras, kesabaran, serta dukungan tulus seluruh umat dan donatur, Kuang Hang Fo Thang resmi diresmikan sebagai Fo Thang Umum yang megah dan penuh kedamaian.",
    chineseDescription:
      "蒙受天恩師德加被，在全體同修及善信大德傾力相助下，巍峨莊嚴之廣航公共佛堂於2006年11月12日隆重落成安座。",
    highlight: "Menjadi mercusuar kebajikan dan pelabuhan jiwa bagi seluruh umat.",
    chineseHighlight: "正式矗立於巴美拉，成為接引十方有緣善信之光明燈塔。",
    image: "/images/guang-hang-15.jpg",
  },
  {
    year: "2026",
    title: "20 Tahun Mengarungi Samudra Kebajikan",
    chineseTitle: "廿載同舟 • 續航萬里",
    location: "14 November 2026",
    chineseLocation: "2026年11月14日 廿週年堂慶大典",
    description:
      "Tepat dua dasawarsa (20 Tahun) perjalanan gedung Kuang Hang Fo Thang. Mengenang jejak langkah para pendahulu, memupuk ikrar kebajikan, dan melanjutkan tongkat estafet pembinaan rohani untuk generasi mendatang.",
    chineseDescription:
      "廣航大樓落成整整廿載光陰。追思前賢創堂之艱辛，凝聚道親宏願，薪火相傳，攜手共創下一個輝煌甲子。",
    highlight: "Sabtu, 14 November 2026 — Perayaan Peringatan 20 Tahun Kuang Hang Fo Thang.",
    chineseHighlight: "2026年11月14日（星期六）—— 隆重舉行廣航佛堂廿週年堂慶紀念大典。",
    image: "/images/guang-hang-1.jpg",
  },
];
