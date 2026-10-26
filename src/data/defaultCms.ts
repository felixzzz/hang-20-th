import { SiteCmsConfig } from "@/types/cms";
import { historyMilestones } from "@/data/history";
import { galleryItems } from "@/data/gallery";
import { donationConfig } from "@/data/donation";

export const defaultCms: SiteCmsConfig = {
  cover: {
    badgeId: "Peringatan 20 Tahun Gedung",
    badgeZh: "廿週年堂慶紀念",
    titleZh: "廣航佛堂",
    titleId: "Kuang Hang Fo Thang • 2006 — 2026",
    subtitleId: "Mengarungi Samudra Kebajikan, Menyalakan Pelita Kebijaksanaan",
    subtitleZh: "同舟共濟度眾生 • 薪火相傳護慧命",
    bgImage: "/images/guang-hang-15.jpg",
    logoImage: "/images/logo-guang-ji.png",
    buttonTextId: "Buka Undangan Resmi",
    buttonTextZh: "恭啟尊榮邀請函",
  },
  hero: {
    topBannerId: "Memorabilia Dua Dasawarsa (2006 — 2026)",
    topBannerZh: "廿週年誌慶",
    cityId: "Palmerah, Jakarta Barat",
    cityZh: "雅加達巴美拉",
    eventDateBadge: "14 November 2026",
    mainTitleZh: "廣航佛堂",
    mainTitleId: "Peringatan 20 Tahun Gedung",
    themeZh: "成立廿週年堂慶紀念 (2006 — 2026)",
    quoteId: "Mengarungi samudra kebajikan selama dua dasawarsa, merajut persaudaraan se-dharma, menyalakan pelita suci Shizun dan Shimu.",
    quoteZh: "廿載白陽開聖境，同舟共濟渡群生。願以至誠之心，薪火相傳，護持白陽慧命於永恆。",
    countdownDate: "2026-11-14T19:00:00+07:00",
  },
  wisdom: {
    sealZh: "茂田師兄慈悲勉勵",
    headingId: "Untaian Wejangan Kebijaksanaan",
    headingZh: "茂田師兄聖訓",
    subheadingId: "Suluh Jiwa Perjalanan 20 Tahun Kuang Hang Fo Thang",
    subheadingZh: "廿載慧命指路明燈",
    quoteId: "Semoga di dalam hati setiap orang terdapat kekuatan ikrar, tekad yang bulat, semangat untuk mengorbankan kepentingan diri demi kepentingan yang lebih besar, serta memiliki sebuah tekad penuh welas asih untuk tidak meninggalkan semua makhluk.",
    quoteZh: "願每個人心中有一股願力、一個志向，有大公無私的犧牲精神，有不忍眾生沉淪的大慈悲愿。",
    closingId: "Marilah kita bersama-sama menjaga dan mendukung kehidupan kebijaksanaan Shizun dan Shimu.",
    closingZh: "讓我們共同護持師尊師母的慧命，齊心協力，航向光明。",
  },
  event: {
    headingId: "Waktu & Tempat Pelaksanaan",
    headingZh: "慶典日程 • 會場導引",
    subheadingId: "Detail Pelaksanaan Malam Syukur Peringatan 20 Tahun Gedung Kuang Hang Fo Thang",
    subheadingZh: "慶典時間與會場導引",
    descriptionId: "Detail Pelaksanaan Malam Syukur Peringatan 20 Tahun Gedung Kuang Hang Fo Thang",
    descriptionZh: "廣航佛堂成立廿週年感恩大典會場導引",
    dateTextId: "Sabtu, 14 November 2026",
    dateTextZh: "2026年11月14日（星期六）",
    timeTextId: "19.00 WIB s/d Selesai",
    timeTextZh: "晚間七時正 (19:00 WIB)",
    timeNotesId: "Registrasi dibuka 18.30 WIB (18:30 入席)",
    timeNotesZh: "18:30 入席接待",
    venueNameId: "Kuang Hang Fo Thang (廣航佛堂)",
    venueNameZh: "雅加達廣航佛堂",
    address: "Jl. Palmerah Utara III No. 186A, Palmerah, Jakarta Barat 11480",
    dresscodeId: "Batik / Pakaian Rapi Bernuansa Putih atau Cerah",
    dresscodeZh: "莊重得體 • 素雅端莊",
    dresscodeNotesId: "Disarankan berbusana sopan & rapi (Batik / Atasan Putih / Kemeja)",
    dresscodeNotesZh: "建議著長袖襯衫、Batik 或素雅正裝出席大典",
    googleMapsUrl: "https://maps.app.goo.gl/H2sa6pPhX2pn1KdJA",
  },
  donation: {
    headingId: "Tali Kasih & Dana Kebajikan",
    headingZh: "隨喜功德 • 廣種福田",
    subheadingId: "Tali Kasih & Dana Kebajikan",
    subheadingZh: "隨喜功德 · 廣種福田",
    descriptionId: "Doa restu serta kehadiran Bapak/Ibu/Saudara/i adalah karunia terindah bagi kami. Bagi yang hendak menyalurkan tali kasih sukarela demi kelancaran kegiatan wadah keTuhanan Kuang Hang:",
    descriptionZh: "十方大德之道情法喜與蒞臨祈福，乃廣航最大恩典。若欲隨喜發心護持廣航道務聖業者，可隨喜行功：",
    bankName: donationConfig.bankName || "BCA / Bank Transfer",
    accountNumber: donationConfig.accountNumber || "Akan Diumumkan Segera",
    accountHolder: donationConfig.accountHolder || "Kuang Hang Fo Thang",
    isReady: donationConfig.isReady ?? false,
    notes: donationConfig.notes || "Informasi nomor rekening resmi akan segera diperbarui oleh panitia.",
    qrisImage: donationConfig.qrisImage || "",
  },
  location: {
    headingId: "Petunjuk Lokasi & Arah Menuju Gedung",
    headingZh: "道場座標 • 交通導引",
    subheadingId: "Petunjuk Lokasi & Arah Menuju Gedung",
    subheadingZh: "道場座標與交通指引",
    descriptionId: "Gedung Kuang Hang Fo Thang berlokasi strategis di Palmerah Utara, mudah dijangkau dari segala penjuru Jakarta.",
    descriptionZh: "廣航佛堂位處雅加達西區巴美拉核心樞紐，交通四通八達，便捷通暢。",
    fullAddress: "Kuang Hang Fo Thang, Jl. Palmerah Utara III No. 186A, RT.002/RW.06, Palmerah, Jakarta Barat 11480",
    googleMapsUrl: "https://maps.app.goo.gl/H2sa6pPhX2pn1KdJA",
    embedMapUrl: "https://maps.google.com/maps?q=Kuang+Hang+Fo+Thang+Palmerah+Jakarta+Barat&t=&z=16&ie=UTF8&iwloc=&output=embed",
  },
  shareMessage: {
    template: `*Undangan Resmi: Peringatan 20 Tahun Kuang Hang Fo Thang (廣航佛堂)*

Kepada Yth. Bapak / Ibu / Saudara/i:
*{nama}*

Dengan penuh rasa syukur atas Tian En Shi De (天恩師德), kami mengundang Anda untuk hadir bersama merayakan:
*20 Tahun Gedung Kuang Hang Fo Thang*
Mengarungi Samudra Kebajikan Menabur Kasih Semesta (2006 — 2026)

📅 *Waktu:* {tanggal} • {waktu}
📍 *Tempat:* {tempat}

Mohon berkenan membuka tautan undangan digital & konfirmasi kehadiran (RSVP) melalui:
{url}

Merupakan suatu kehormatan dan kebahagiaan bagi kami atas kehadiran dan doa restu Bapak/Ibu/Saudara/i.
Terima kasih.`,
  },
  milestones: historyMilestones,
  gallery: galleryItems,
};
