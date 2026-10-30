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

/**
 * Extract 4-digit or numeric year for robust chronological sorting
 */
export function extractYearNumber(yearStr: string | number | undefined | null): number {
  if (!yearStr) return 0;
  const str = String(yearStr).trim();
  const match4 = str.match(/\d{4}/);
  if (match4) return parseInt(match4[0], 10);
  const matchAny = str.match(/\d+/);
  if (matchAny) return parseInt(matchAny[0], 10);
  return 0;
}

/**
 * Sorts milestone items by year in ascending chronological order (e.g. 1997 -> 2026).
 * Preserves relative insertion order for milestones sharing the same year.
 */
export function sortMilestonesByYear<T extends { year?: string; title?: string }>(
  milestones: T[]
): T[] {
  if (!Array.isArray(milestones)) return [];
  return [...milestones]
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const parsedA = extractYearNumber(a.item.year);
      const parsedB = extractYearNumber(b.item.year);
      // Place items without a parseable year at the end
      const yearA = parsedA === 0 ? 999999 : parsedA;
      const yearB = parsedB === 0 ? 999999 : parsedB;
      if (yearA !== yearB) {
        return yearA - yearB;
      }
      const rawCompare = (a.item.year || "").localeCompare(a.item.year || "");
      if (rawCompare !== 0) return rawCompare;
      return a.index - b.index;
    })
    .map((w) => w.item);
}

export const historyMilestones: Milestone[] = [
  {
    year: "1997",
    title: "Awal Perintisan Wadah",
    chineseTitle: "開荒啟航 • 播撒善種",
    location: "Palmerah Barat, Jakarta Barat",
    chineseLocation: "雅加達西區巴美拉西路",
    description:
      "Atas utusan Tien Chuan She, para pendahulu, yaitu Lim Pao Fu Ciang She, Cen Kuo Fa Ciang She, dan Ye Mei Mei Ciang She, dengan penuh ketulusan mulai merintis wadah Ketuhanan Kuang Hang Fo Thang di daerah Palmerah Barat. Dengan keyakinan dan tekad yang teguh, langkah sederhana ini menjadi awal perjalanan panjang dalam menebarkan Dharma, membina umat, serta menanamkan benih kebajikan.\n\nPada tahun yang sama, kegiatan kebaktian dan pembinaan umat mulai berlangsung di sebuah bangunan sederhana di Jalan Palmerah Utara II. Tempat ini menjadi saksi keteguhan hati para perintis dalam menjaga kelangsungan kegiatan rohani di tengah keterbatasan.",
    chineseDescription:
      "奉點傳師慈命，前賢大德（林寶福講師、曾國法講師、葉美妹講師）以至誠之心，於雅加達巴美拉西區開荒播種，正式啟航廣航道務。\n\n同年，道親共修與班程活動設於巴美拉北二路一處簡樸處所，見證了草創初期前賢們在有限條件下堅定不移的修辦道心。",
    highlight: "Benih kebajikan pertama ditaburkan dengan semangat pengorbanan tanpa pamrih.",
    chineseHighlight: "第一顆菩提善種在無私奉獻中生根發芽。",
    image: "https://nuknakbgyefxlpedyiot.supabase.co/storage/v1/object/public/cms-media/uploads/1793249173572-8.jpg",
  },
  {
    year: "1999",
    title: "Pindahan Ke Kebun Jeruk",
    chineseTitle: "法舟擴展 • 遷址西區",
    location: "Jalan Kelapa Dua Raya, Kebun Jeruk, Jakarta Barat",
    chineseLocation: "雅加達西區 Kebun Jeruk 柯拉巴杜亞路",
    description:
      "Seiring bertambahnya umat yang berjodoh dan berkembangnya kegiatan pembinaan, Kuang Hang Fo Thang berpindah ke Jalan Kelapa Dua Raya, Kebun Jeruk. Perpindahan ini menjadi langkah penting untuk memperluas ruang pembinaan dan pelayanan kepada umat.\n\nPada 29 Desember 1999, tempat tersebut diresmikan sebagai bagian dari perjalanan perkembangan wadah Ketuhanan Kuang Hang Fo Thang.",
    chineseDescription:
      "隨著求道道親日增、班程活動蓬勃發展，廣航佛堂遷往西區 Kebun Jeruk 柯拉巴杜亞路，為道親提供更寬廣的學修與行功空間。\n\n1999年12月29日，該處所正式舉行莊嚴啟用典禮，成為廣航道務發展歷程中的重要里程碑。",
    highlight: "Ketika jodoh kebajikan semakin luas, tanggung jawab untuk membina dan melayani pun semakin besar.",
    chineseHighlight: "道緣日廣，修辦與服務眾生之使命更加宏大。",
    image: "https://nuknakbgyefxlpedyiot.supabase.co/storage/v1/object/public/cms-media/uploads/1793249150425-2.jpg",
  },
  {
    year: "2000",
    title: "Masa Ujian dan Wadah Sementara",
    chineseTitle: "同舟共濟 • 借址護道",
    location: "Kediaman Than Cu Palmerah",
    chineseLocation: "巴美拉壇主寓所臨時佛堂",
    description:
      "Dalam perjalanan mengembangkan wadah Ketuhanan, berbagai tantangan harus dihadapi, termasuk keterbatasan kapasitas lingkungan. Kegiatan untuk sementara waktu dipindahkan ke kediaman para pendahulu yang dengan tulus bersedia membantu, yaitu kediaman Tay Than Cu di Jalan Palmerah Utara III serta Wang Ce Ce Than Cu.\n\nDi tengah keterbatasan, para pendahulu dan umat tetap bergandengan tangan menjaga kelangsungan kebaktian dan pembinaan. Kesediaan untuk menyediakan tempat dan membantu sesama menjadi bukti nyata semangat kebersamaan dalam mengemban tugas suci.",
    chineseDescription:
      "在拓展道務歷程中面臨環境條件等諸多考驗。道務活動暫時借設於熱心護道之前賢寓所——巴美拉北三路之戴壇主家及王姊姊壇主家中。\n\n在考驗與困境中，前賢與道親手牽手心連心，堅持延續共修與班程。壇主們捨宅護道、互助共濟，展現了共同承擔聖業的堅貞道心。",
    highlight: "Ketika keadaan menguji, ketulusan menjadi kekuatan. Dengan saling menopang dan mengutamakan kebersamaan, pelita kebajikan tetap menyala.",
    chineseHighlight: "逆境考驗之際，真誠化為無窮力量；同舟共濟，廣航慧燈恆久常明。",
    image: "https://nuknakbgyefxlpedyiot.supabase.co/storage/v1/object/public/cms-media/uploads/1793078994003-4.jpg",
  },
  {
    year: "2001",
    title: "Pembelian Lahan Permanen",
    chineseTitle: "奠定宏基 • 購置聖地",
    location: "Jalan Palmerah Utara III No. 186A, Jakarta Barat",
    chineseLocation: "巴美拉北三路186A號永久基地",
    description:
      "Dengan tekad yang bulat, hasil penjualan tempat di Kebun Jeruk digunakan untuk membeli sebidang tanah seluas 538 m² di Jalan Palmerah Utara III No. 186A. Langkah ini menjadi tonggak penting dalam mewujudkan tempat ibadah permanen bagi Kuang Hang Fo Thang.\n\nLahan tersebut bukan sekadar sebidang tanah, melainkan fondasi bagi perjalanan pembinaan rohani, tempat umat mempererat jodoh kebajikan, mempelajari Dharma, dan meneruskan nilai-nilai luhur kepada generasi mendatang.",
    chineseDescription:
      "眾人發大愿心，將 Kebun Jeruk 房舍轉售之資金全數投入，於巴美拉北三路186A號購置538平方米土地，作為廣航佛堂永久道場之宏基。\n\n這片土地不僅是實體基石，更是無數道親修心養性、廣結善緣、研習聖理與代代傳承薪火的心靈家園。",
    highlight: "Membangun tempat ibadah berarti menanam harapan untuk masa depan.",
    chineseHighlight: "購置永久道場基地，為世代道親立下千秋聖業與希望。",
    image: "https://nuknakbgyefxlpedyiot.supabase.co/storage/v1/object/public/cms-media/uploads/1793079494426-IMG_0094.jpg",
  },
  {
    year: "2003",
    title: "Perjalanan Pembinaan Huo She Thuan - Merangkul Generasi Muda",
    chineseTitle: "青年培育 • 廣結善緣",
    location: "Grogol, Kemanggisan dan Semanggi",
    chineseLocation: "雅加達格羅戈爾、克芒吉桑與塞芒吉大專學區",
    description:
      "Dalam perjalanan pembinaan, Huo She Thuan menjadi salah satu wadah untuk merangkul generasi muda, mempererat persaudaraan, dan menumbuhkan semangat belajar serta pengabdian.\n\nBermula pada tahun 1998, ketika Sie Yi Ce Ciang She dan beberapa orang Chien Sien memulai untuk melintasi umat berjodoh di kawasan strategis Grogol, Jakarta Barat yang berdekatan dengan Universitas Trisakti, Universitas Tarumanegara, dan Universitas Kristen Krida Wacana. Ju Te Huo She Thuan diresmikan oleh Yang Tien Chuan She pada tanggal 12 September 2003 (berlokasi pada rumah kontrakan di Jalan Gelong Baru).\n\nPada tahun 2001, Sie Yi Ce Ciang She memulai untuk menggarap ladang baru di daerah Kemanggisan sekitar Universitas Bina Nusantara. Diawali dari melintasi dan menyempurnakan mahasiswa-mahasiswi yang tinggal di kost-kostan, terbentuklah jodoh awal dari Jen Ci Huo She Thuan. Dengan menggunakan kontrakan dari Chai Se Niu Ciang She dan Su Ching An Ciang She sebagai basisnya. Setelah penantian panjang, akhirnya pada tanggal 20 Juni 2004 Jen Ci Huo She Thuan diresmikan oleh Huang Tien Chuan She.\n\nSekitar pertengahan tahun 2005, Huo She Thuan Atma Jaya mulai dirintis oleh beberapa Chien Sien yang berkuliah di Universitas Atma Jaya. Pada masa awal, kegiatan belum memiliki tempat khusus maupun struktur organisasi yang memadai. Kegiatan bermula dari sebuah kamar peristirahatan yang disewa oleh Chien Sien di sekitar kampus.",
    chineseDescription:
      "在大專青年培育的歷程中，伙食團成為接引青年學子、凝聚道情同修、啟發修道與奉獻精神之溫馨搖籃。\n\n緣起於1998年，謝億子講師與數位前賢於鄰近特里薩克蒂大學（Trisakti）、達魯瑪納卡拉大學（Tarumanagara）及克里達瓦卡納基督教大學（UKRIDA）之格羅戈爾（Grogol）學區開荒度眾。2003年9月12日，由楊點傳師親臨主持，崇德伙食團（Ju Te Huo She Thuan）於 Gelong Baru 租賃屋舍正式開堂。\n\n2001年，謝億子講師於建國大學（Bina Nusantara）所在的 Kemanggisan 區開拓新道場，從關懷租屋學生開始，締結仁慈伙食團（Jen Ci Huo She Thuan）之佛緣，並以蔡師牛講師及蘇慶安講師租屋處為據點。歷經不懈深耕，仁慈伙食團於2004年6月20日由黃點傳師慈悲主持落成開光。\n\n2005年中旬，於阿瑪加雅大學（Atma Jaya）就讀的幾位前賢著手籌設阿瑪加雅伙食團，初期雖無專屬場地與完善組織，前賢們於校園旁租賃之小寢室共修，開啟了接引學子的光明大道。",
    highlight: "Membina generasi muda berarti menanam harapan bagi masa depan.",
    chineseHighlight: "培育大專青年，播撒智慧種子，為聖道傳承播下希望之苗。",
    image: "https://nuknakbgyefxlpedyiot.supabase.co/storage/v1/object/public/cms-media/uploads/1793080061517-5.jpg",
  },
  {
    year: "2005",
    title: "Perjuangan Pembangunan Gedung Guang Hang Fo Thang",
    chineseTitle: "篳路藍縷 • 齊心同築",
    location: "Jalan Palmerah Utara III No. 186A, Jakarta Barat",
    chineseLocation: "巴美拉北三路186A號建堂工地",
    description:
      "Pembangunan fisik gedung Guang Hang Fo Thang mulai dilaksanakan. Perjalanan ini penuh dengan tantangan, mulai dari keterbatasan dana yang harus diupayakan dari minggu ke minggu, kendala perizinan dan legalitas, hingga peristiwa robohnya tembok di bagian samping bangunan. Namun, berbagai ujian tersebut tidak memadamkan semangat para pendahulu, umat, dan donatur. Dengan doa, ketekunan, pengorbanan, serta gotong royong, pembangunan terus diperjuangkan demi terwujudnya tempat ibadah yang dapat digunakan bersama.",
    chineseDescription:
      "廣航佛堂大樓正式破土動工。建堂歷程充滿嚴峻挑戰：每週籌措建設經費之艱辛、各項建築許可與公文之審批考驗，乃至施工期間側牆不幸倒塌之意外。然而種種考驗絲毫未曾動搖前賢、同修與廣大善信大德之堅毅初心。眾人以至誠祈願、無私奉獻與齊心同力，克服一切艱難，共同築起弘法利生的莊嚴道場。",
    highlight: "Setiap batu bata menyimpan kisah perjuangan. Gedung yang dibangun dengan ketulusan dan pengorbanan menjadi saksi nyata kekuatan kebersamaan dalam mewujudkan cita-cita luhur.",
    chineseHighlight: "一磚一瓦凝聚無私奉獻之汗水，見證同舟共濟圓滿聖業的堅定力量。",
    image: "https://nuknakbgyefxlpedyiot.supabase.co/storage/v1/object/public/cms-media/uploads/1793080829873-10.jpg",
  },
  {
    year: "2006",
    title: "Peresmian Gedung Kuang Hang Fo Thang",
    chineseTitle: "廣航落成 • 佛光普照",
    location: "12 November 2006",
    chineseLocation: "2006年11月12日 落成大典",
    description:
      "Berkat karunia Tian En Shi De (天恩師德), perjuangan panjang para pendahulu, serta dukungan tulus dari umat dan para donatur, gedung Guang Hang Fo Thang akhirnya diresmikan sebagai Fo Thang umum pada 12 November 2006.\n\nSejak saat itu, gedung Guang Hang Fo Thang menjadi bagian penting dari perjalanan pembinaan dan pengabdian, sekaligus menjadi tempat bagi umat untuk mempererat persaudaraan dan meneruskan nilai-nilai luhur kepada generasi mendatang.",
    chineseDescription:
      "蒙受天恩師德加被，前賢大德之苦心開創，以及全體同修道親與善信之傾力護持，廣航佛堂大樓終於在2006年11月12日隆重舉行公共佛堂落成安座大典。\n\n自此，巍峨莊嚴的廣航佛堂成為道務推動與眾生修辦之心靈港灣，接引十方有緣善信共結善緣，並將聖賢大道與至善美德薪火代代相傳。",
    highlight: "Menjadi mercusuar kebajikan dan pelabuhan jiwa bagi seluruh umat.",
    chineseHighlight: "矗立於巴美拉，成為接引十方有緣善信之光明燈塔與心靈港灣。",
    image: "https://nuknakbgyefxlpedyiot.supabase.co/storage/v1/object/public/cms-media/uploads/1793081577717-12.jpg",
  },
  {
    year: "2006",
    title: "Pembukaan Sekolah Guang Ming",
    chineseTitle: "廣明啟學 • 育才傳道",
    location: "Tanjung Duren, Jakarta Barat",
    chineseLocation: "雅加達西區丹絨杜連（Tanjung Duren）",
    description:
      "Pada tahun 2006, Sekolah Guang Ming dibuka di Tanjung Duren, Jakarta Barat, sebagai bagian dari perkembangan upaya pendidikan dan pembinaan generasi.\n\nKehadiran Sekolah Guang Ming mencerminkan pentingnya pendidikan dalam mempersiapkan generasi penerus. Pendidikan bukan hanya tentang pengetahuan, tetapi juga tentang pembentukan karakter, penanaman nilai-nilai kebajikan, dan pengembangan tanggung jawab terhadap sesama",
    chineseDescription:
      "2006年，光明三語學校（Sekolah Guang Ming）於雅加達西區丹絨杜連正式創辦，為聖道教育與幼苗培育翻開新的一頁。\n\n光明學校之創立，體現了培育下一代棟樑之長遠眼光。教育不僅是知識的傳授，更是品格的陶冶、美德善種的深植，以及對社會關懷責任感的全面啟發。",
    highlight: "Generasi yang dibina dengan ilmu, karakter, dan kebajikan akan menjadi penerus yang mampu membawa manfaat bagi banyak insan.",
    chineseHighlight: "以品德、智識與仁愛培育下一代，造就造福社會之棟樑英才。",
    image: "https://nuknakbgyefxlpedyiot.supabase.co/storage/v1/object/public/cms-media/uploads/1793085855179-gmec-schools-01.jpg",
  },
  {
    year: "2016",
    title: "Pembukaan Kuang Shu Fo Thang",
    chineseTitle: "廣書佛堂 • 廣結善緣",
    location: "Jelambar, Jakarta Barat",
    chineseLocation: "雅加達西區日藍芭（Jelambar）",
    description:
      "Dalam semangat memperluas jangkauan pembinaan, Guang Hang Fo Thang membuka Kuang Shu Fo Thang (廣書佛堂) di Jelambar, Jakarta Barat. Kehadiran wadah ini menjadi salah satu langkah pengembangan ladang pembinaan agar semakin banyak umat memperoleh kesempatan untuk mengenal Dharma, mempererat jodoh kebajikan, dan berpartisipasi dalam kegiatan rohani.",
    chineseDescription:
      "秉持擴展弘道法舟、廣濟有緣之宏願，廣航佛堂於雅加達西區日藍芭（Jelambar）開設「廣書佛堂」。這座新法舟的啟航，開拓了修辦福田，讓更多民眾與有緣同修能就近親近聖道、深植善根，並積極參與道場修辦與心靈涵養活動。",
    highlight: "Memperluas wadah berarti memperluas kesempatan untuk menanam benih kebajikan. Semakin luas ladang pembinaan, semakin besar pula harapan agar semakin banyak insan memperoleh manfaat.",
    chineseHighlight: "法舟拓展即是福田之廣開；修辦園地愈寬廣，沐浴天恩大道之眾生亦愈深廣。",
    image: "https://nuknakbgyefxlpedyiot.supabase.co/storage/v1/object/public/cms-media/uploads/1793087003076-WhatsApp_Image_2026-10-27_at_1.jpeg",
  },
  {
    year: "2026",
    title: "Dua Dasawarsa Gedung Guang Hang Fo Thang",
    chineseTitle: "廿載同舟 • 續航萬里",
    location: "Sabtu, 14 November 2026",
    chineseLocation: "2026年11月14日（星期六）",
    description:
      "Dua puluh tahun sejak peresmian gedung Guang Hang Fo Thang pada 12 November 2006, perjalanan ini menjadi kesempatan untuk mengenang perjuangan para pendahulu, menghargai pengorbanan seluruh pihak yang telah berkontribusi, serta mensyukuri setiap jodoh kebajikan yang telah terjalin.\n\nSetiap tahapan menyimpan kisah tentang ketulusan, pengorbanan, keteguhan, dan kebersamaan. Apa yang berdiri dan berkembang hari ini merupakan hasil dari jodoh kebajikan yang terjalin selama bertahun-tahun.\n\nPeringatan dua dasawarsa gedung ini bukan sekadar mengenang masa lalu, melainkan juga memperbarui tekad untuk melanjutkan perjalanan. Dengan mewarisi semangat para pendahulu, seluruh umat diharapkan terus menjaga keharmonisan, memperdalam pembinaan rohani, mengembangkan pendidikan, serta memperluas ladang kebajikan bagi generasi mendatang.",
    chineseDescription:
      "自2006年11月12日廣航大樓落成至今，整整走過廿載光輝歲月。值此廿週年堂慶之際，正是緬懷前賢拓荒艱辛、感恩同修大德無私奉獻，並由衷感念一切善因善緣的重要時刻。\n\n回首廿年每一階段，無不銘刻著至誠、奉獻、堅忍與同心的印記。今日巍峨壯麗之佛堂道場，皆是歲月長河中無數善願所凝聚之結晶。\n\n廿週年堂慶不僅是追昔撫今，更是續往開來的全新起點。承繼前賢創道之初心與精神，期勉全體同修同心同德、深化道學涵養、拓展文教志業，為代代子孫開拓更浩瀚的行道福田。",
    highlight: "Guang Hang Fo Thang (廣航佛堂), Jalan Palmerah Utara III No. 186A, Jakarta Barat",
    chineseHighlight: "廣航佛堂（Jl. Palmerah Utara III No. 186A, Jakarta Barat）—— 廿載同舟，續航萬里。",
    image: "https://nuknakbgyefxlpedyiot.supabase.co/storage/v1/object/public/cms-media/uploads/1793254337696-tempat_2.jpg",
  },
  {
    year: "Saat Ini",
    title: "Sepanjang Perjalanan - Pengembangan Kelas dan Pembinaan Dharma",
    chineseTitle: "弘揚聖道 • 培育後學",
    location: "Kuang Hang Fo Thang",
    chineseLocation: "廣航佛堂",
    description:
      "Seiring berjalannya waktu, Kuang Hang Fo Thang terus mengembangkan Kelas Pembinaan melalui berbagai kelas dan pembelajaran Dharma. Setiap program menjadi sarana bagi umat untuk memperdalam pemahaman, meningkatkan kualitas diri, mempererat persaudaraan, serta menumbuhkan semangat pengabdian. Berbagai kegiatan pembinaan yang tercatat dalam dokumentasi meliputi: 1. Seminar Dharma Pemula — pembinaan dasar yang dalam perkembangannya disesuaikan dari tiga hari menjadi dua hari; 2.  Ming Te Pan — kelas untuk pemula; 3. Phei Te Pan — kelas menengah; 4. Cing Cin Pan — kelas lanjutan. 5.Tu Cing Pan — merupakan kelas khusus membaca syair untuk anak-anak usia Play Group sampai dengan usia 6 SD; 6. Sie Sen Pan - Kelas khusus untuk Remaja SMA dan Mahasiswa.",
    chineseDescription:
      "歲月荏苒，廣航佛堂持續開展健全的道務研究班程與聖理研修。每一道班程皆是同修明理修心、提升心性、敦睦道誼與激發普度奉獻精神之良機。歷年完善推動之培育體系包括：1. 新道親法會（進德班）——基礎班程由早期三天調整為兩天；2. 明德班——初階道義班；3. 培德班——中階修道班；4. 精進班——高階行道班；5. 讀經班——專為幼兒園至小學六年級兒童設立之經典誦讀班；6. 協進班（學生班）——專為高中生與大專青年設立之青年研究班。",
    highlight: "Dharma merupakan perjalanan seumur hidup. Setiap kelas menjadi kesempatan untuk memperbaiki diri, memperkuat tekad, dan mempersiapkan generasi yang mampu meneruskan pelita kebajikan.",
    chineseHighlight: "聖道修持乃終身之志。每一堂班程皆是自我昇華、鞏固愿力，培育續燃善火後繼人才的寶貴階梯。",
    image: "https://nuknakbgyefxlpedyiot.supabase.co/storage/v1/object/public/cms-media/uploads/1793086724912-DSCF4668.jpg",
  },
  {
    year: "Saat Ini",
    title: "Sepanjang Perjalanan - Bakti Sosial dan Pengabdian Kepada Masyarakat",
    chineseTitle: "慈悲濟世 • 廣行善業",
    location: "Guang Hang Fo Thang",
    chineseLocation: "廣航佛堂",
    description:
      "Semangat kebajikan Kuang Hang Fo Thang tidak hanya diwujudkan melalui kebaktian dan pembinaan rohani, tetapi juga melalui berbagai kegiatan sosial. Kegiatan ini menjadi sarana untuk menumbuhkan kepedulian, mempererat persaudaraan, serta memberikan manfaat nyata kepada sesama. berbagai bentuk pengabdian tersebut meliputi: doa dan pelimpahan pahala sebagai wujud kepedulian terhadap masyarakat yang tertimpa musibah,Pelepasan Makhluk Hidup , Donor Darah, Bulan Kasih, Kerja Bakti, Kunjungan ke Panti .",
    chineseDescription:
      "廣航佛堂慈悲濟世之情操，不僅體現在日常禮拜與修持中，更落實於關懷社會的廣泛公益行動中。這些善行凝聚了無私愛心，深化了人與人之間的真情，為社會帶來切實的溫暖與希望。歷年舉辦的社會服務包括：為受災民眾祈福迴向、護生放生、愛心捐血、關懷愛心月、社區環保大掃除、以及探訪育幼院與養老院等慈善活動。",
    highlight: "Kebajikan menjadi bermakna ketika diwujudkan. Satu tindakan penuh cinta kasih mungkin terlihat sederhana, tetapi dapat membawa harapan dan kehangatan bagi kehidupan orang lain.",
    chineseHighlight: "善念化為行動，大愛更顯光輝。一句問候、一份援手，皆能為世間帶來無盡的溫暖與希望。",
    image: "https://nuknakbgyefxlpedyiot.supabase.co/storage/v1/object/public/cms-media/uploads/1793087961942-IMG_0707__2_.jpg",
  },
];
