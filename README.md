# 20 Tahun Guang Hang Fo Thang (廣航佛堂 廿週年堂慶)

Web undangan resmi peringatan 20 tahun peresmian gedung Kuang Hang Fo Thang (12 November 2006 – 14 November 2026). Dirancang dengan nuansa Fo Thang yang sakral, hangat, agung, dan elegan modern.

---

## ✨ Fitur Unggulan

1. **Nuansa Khidmat & Sakral Fo Thang (Anti AI-Slop):**
   - Mengusung palet warna *Temple Cinnabar Red* (`#831F1F`), *Sacred Gold* (`#D49B28`), dan *Warm Ivory Linen* (`#FAF7F2`).
   - Tipografi klasik berwibawa: *Cormorant Garamond*, *Noto Serif SC (Aksara Mandarin)*, dan *Plus Jakarta Sans*.
   - Wejangan suci Maotian Shixiong (*茂田師兄慈悲勉勵*).
   - Menghapus seluruh teks dan elemen template pernikahan lama yang tidak relevan.

2. **Sampul Amplop Interaktif (Buka Undangan):**
   - Menampilkan salam personal sesuai nama tamu dari parameter URL: `?to=Nama+Tamu`.
   - Animasi buka undangan yang halus disertai transisi pemutaran musik latar.

3. **Musik Latar (Background Music):**
   - Pemutar audio terintegrasi (*Happy Birthday Song – Elegant Waltz Birthday Version*) dengan floating disc control (Play / Pause / Mute).

4. **Kilas Sejarah 20 Tahun (1997 – 2026):**
   - Napak tilas lengkap dari awal perintisan Palmerah Barat (1997), tempat sementara, pembelian tanah 538 m² (2001), perjuangan fisik pembangunan (2005), peresmian gedung (2006), hingga 20 tahun perayaan (2026).
   - Disertai 15 foto arsip dokumentasi beresolusi tinggi.

5. **Galeri Dokumentasi & Lightbox:**
   - Filter kategori: *Semua*, *Sejarah & Pembangunan*, *Kegiatan Pembinaan*, dan *Kebersamaan Umat*.
   - Modal tampilan ukuran penuh (*lightbox*) responsif.

6. **Sistem RSVP & Buku Doa Umat (Live):**
   - Konfirmasi kehadiran: *Hadir*, *Masih Ragu*, atau *Belum Bisa Hadir*.
   - Pilihan jumlah orang yang hadir.
   - Kolom doa restu dan harapan untuk Kuang Hang Fo Thang.
   - Efek selebrasi konfeti saat submit.
   - Terintegrasi dengan endpoint `/api/rsvp` yang otomatis meneruskan data ke **Google Sheets** panitia via Webhook Apps Script (`GOOGLE_SHEET_WEBHOOK_URL`).
   - Panduan lengkap & kode Apps Script siap pakai tersedia di file [`google-sheets-script.js`](./google-sheets-script.js).
   - Live summary statistik: Jumlah tanggapan, keluarga hadir, dan estimasi total umat.

7. **Tali Kasih & Dana Paramita (随喜功德):**
   - Bagian khusus tanda kasih / dana kebajikan dengan desain sakral dan bersahaja.
   - Nomor rekening dapat diubah kapan saja hanya dengan mengedit file [`src/data/donation.ts`](./src/data/donation.ts).

8. **Petunjuk Denah & Navigasi Lokasi:**
   - Terhubung langsung ke titik Google Maps resmi Kuang Hang Fo Thang & Waze.
   - Salin alamat cepat 1-klik.
   - Petunjuk akses KRL (Stasiun Palmerah) dan kendaraan pribadi.

9. **Alat Bantu Panitia (WhatsApp Link Generator):**
   - Panitia cukup mengetik nama tamu untuk langsung membuat URL personal `?to=...` dan menyalin pesan WhatsApp resmi yang sopan.

---

## 📊 Cara Menghubungkan RSVP ke Google Sheets

1. Buat Google Sheet baru di Google Drive Anda.
2. Buka menu **Extensions (Ekstensi)** > **Apps Script**.
3. Buka file [`google-sheets-script.js`](./google-sheets-script.js) di repositori ini, salin seluruh kodenya, dan paste ke editor Apps Script.
4. Klik **Deploy (Terapkan)** > **New deployment (Penerapan baru)** > pilih **Web app**.
5. Atur **Who has access** ke **Anyone (Siapa saja)**.
6. Salin Web App URL (berakhiran `/exec`).
7. Masukkan URL tersebut ke:
   - Lokal: tambahkan di `.env.local`:
     ```env
     GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
     ```
   - Di Vercel: masukkan ke **Project Settings > Environment Variables > GOOGLE_SHEET_WEBHOOK_URL**.

---

## 💳 Cara Memperbarui Nomor Rekening (Jika Sudah Ada)

Buka file [`src/data/donation.ts`](./src/data/donation.ts):
```typescript
export const donationConfig: DonationAccount = {
  bankName: "BCA",
  accountNumber: "1234567890",
  accountHolder: "Kuang Hang Fo Thang",
  isReady: true, // Ubah ke true jika sudah aktif
  notes: "Mohon cantumkan keterangan: 20th Kuang Hang",
};
```
Nomor rekening otomatis akan tampil lengkap dengan tombol salin 1-klik!

---

## 🚀 Menjalankan Secara Lokal

```bash
# Pastikan Node.js v18+ terpasang
npm install

# Jalankan server pengembangan
npm run dev
```

Buka peramban di: `http://localhost:3000?to=Lim+TC+Felix+Salim`

---

## 🌐 Panduan Deployment ke Vercel

Proyek ini telah dioptimalkan khusus untuk Vercel:

### Opsi 1: Melalui Git (Rekomendasi)
1. Push repositori ini ke GitHub / GitLab.
2. Buka dashboard [Vercel](https://vercel.com) -> **Add New Project**.
3. Import repositori ini. Framework Preset otomatis mendeteksi **Next.js**.
4. Klik **Deploy**!

### Opsi 2: Menggunakan Vercel CLI
```bash
npm i -g vercel
vercel
```

---

## 🏮 Struktur Direktori

```
20thHang/
├── public/
│   └── images/              # 15 foto arsip resolusi tinggi Kuang Hang
├── src/
│   ├── app/
│   │   ├── api/rsvp/        # Serverless API penampung RSVP & Doa
│   │   ├── globals.css      # Desain tema warna & styling
│   │   ├── layout.tsx       # Metadata Open Graph WhatsApp & Google Fonts
│   │   └── page.tsx         # Halaman utama undangan
│   ├── components/          # Komponen UI modular
│   │   ├── AudioPlayer.tsx
│   │   ├── EventDetails.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroCover.tsx
│   │   ├── HeroSection.tsx
│   │   ├── HistoryTimeline.tsx
│   │   ├── LocationMap.tsx
│   │   ├── Navbar.tsx
│   │   ├── PhotoGallery.tsx
│   │   ├── RsvpSection.tsx
│   │   ├── ShareGenerator.tsx
│   │   └── WisdomQuote.tsx
│   └── data/                # Data sejarah, galeri, dan doa awal
```

Tian En Shi De (天恩師德) 🙏
