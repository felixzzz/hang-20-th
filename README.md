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
   - Terintegrasi dengan API route `/api/rsvp` + fallback lokal yang otomatis tersimpan.
   - Live summary statistik: Jumlah tanggapan, keluarga hadir, dan estimasi total umat.

7. **Petunjuk Denah & Navigasi Lokasi:**
   - Terhubung langsung ke titik Google Maps resmi Kuang Hang Fo Thang & Waze.
   - Salin alamat cepat 1-klik.
   - Petunjuk akses KRL (Stasiun Palmerah) dan kendaraan pribadi.

8. **Alat Bantu Panitia (WhatsApp Link Generator):**
   - Panitia cukup mengetik nama tamu untuk langsung membuat URL personal `?to=...` dan menyalin pesan WhatsApp resmi yang sopan.

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
