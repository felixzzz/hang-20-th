import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans, Noto_Serif_SC } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-noto-serif-sc",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#831f1f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://guanghang20th.vercel.app"),
  title: "20 Tahun Guang Hang Fo Thang | 廣航佛堂 20 週年堂慶",
  description:
    "Undangan Resmi Peringatan 20 Tahun Kuang Hang Fo Thang. Sabtu, 14 November 2026 Pukul 19.00 WIB. Mengundang seluruh saudara se-dharma yang turut mewarnai perjalanan Kuang Hang.",
  keywords: [
    "Guang Hang",
    "Kuang Hang Fo Thang",
    "廣航佛堂",
    "20 Tahun Guang Hang",
    "Anniversary Fo Thang",
    "Undangan Fothang",
    "Palmerah",
  ],
  authors: [{ name: "Panitia 20 Tahun Guang Hang Fo Thang" }],
  openGraph: {
    title: "Undangan Resmi: 20 Tahun Guang Hang Fo Thang (廣航佛堂)",
    description:
      "Sabtu, 14 November 2026 • Pukul 19.00 WIB di Kuang Hang Fo Thang, Palmerah, Jakarta Barat. Mohon konfirmasi kehadiran (RSVP).",
    url: "https://guanghang20th.vercel.app",
    siteName: "20th Anniversary Guang Hang Fo Thang",
    images: [
      {
        url: "/images/guang-hang-10.jpg",
        width: 1200,
        height: 630,
        alt: "20 Tahun Guang Hang Fo Thang",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  icons: {
    icon: "/images/logo-guang-ji.png",
    apple: "/images/logo-guang-ji.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${cormorant.variable} ${jakarta.variable} ${notoSerifSC.variable} scroll-smooth`}
    >
      <body className="font-sans bg-[#fdfdfd] text-fothang-dark antialiased selection:bg-fothang-gold-200 selection:text-fothang-red-900">
        {children}
      </body>
    </html>
  );
}
