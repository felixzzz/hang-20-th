import type { Metadata } from "next";
import InviteClient from "./InviteClient";

export const metadata: Metadata = {
  title: "Buat Undangan Personal • 20 Tahun Kuang Hang Fo Thang",
  description:
    "Buat dan salin tautan undangan resmi 20 Tahun Kuang Hang Fo Thang (廣航佛堂) dengan nama kustom tamu dan pilihan berbagai template ucapan yang tersimpan.",
  openGraph: {
    title: "Buat Undangan Personal • 20 Tahun Kuang Hang Fo Thang (廣航佛堂)",
    description:
      "Pilih template ucapan resmi atau santai, ketikkan nama tamu undangan, dan bagikan tautan langsung ke WhatsApp.",
    url: "https://guanghang20th.vercel.app/invite",
  },
};

export default function InvitePage() {
  return <InviteClient />;
}
