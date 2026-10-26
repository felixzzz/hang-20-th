# 20 Tahun Guang Hang Fo Thang (廣航佛堂 廿週年堂慶)

Web undangan resmi peringatan 20 tahun peresmian gedung Kuang Hang Fo Thang (12 November 2006 – 14 November 2026). Dirancang dengan nuansa Fo Thang yang sakral, hangat, agung, elegan modern, serta dilengkapi **Portal Backend Panitia (CMS)** penuh berbasis **Supabase Database & Storage**.

---

## ✨ Fitur Unggulan & CMS Kustomisasi

1. **Backend Panitia sebagai CMS Penuh (`/panitia`):**
   - **PIN Akses:** `guanghang2026`
   - **Tab 1: RSVP & Buku Doa Umat (CRUD Penuh):**
     - Menampilkan rekapitulasi data kehadiran dan untaian doa langsung dari Supabase.
     - **Create:** Tambah doa/ucapan manual oleh panitia.
     - **Read:** Filter status kehadiran (*Pasti Hadir*, *Masih Ragu*, *Tidak Hadir*), pencarian cepat nama/pesan, dan summary live counter.
     - **Update:** Edit nama pengucap, status kehadiran, jumlah keluarga, dan isi pesan doa.
     - **Delete:** Hapus ucapan spam / kekeliruan dengan dialog konfirmasi.
     - **Ekspor CSV:** Unduh seluruh rekapitulasi RSVP ke format Excel / CSV 1-klik.
   - **Tab 2: Manajemen Tamu Undangan Personal:**
     - Tambah tamu satu per satu atau impor massal (*bulk paste*).
     - Pantau status apakah tamu sudah membuka tautan undangan digital (`has_opened`).
     - Tautan WhatsApp generator 1-klik untuk setiap tamu undangan.
     - Ekspor CSV daftar tamu.
   - **Tab 3: CMS Teks & Konten (Bilingual Indonesia & Traditional Chinese):**
     - Kustomisasi teks sampul, tema acara, judul mandarin, subjudul indonesia, dan countdown.
     - Kustomisasi Untaian Wejangan Suci Maotian Shixiong (*茂田師兄慈悲勉勵*).
     - Kustomisasi detail acara (Hari & tanggal, jam mulai, catatan registrasi, nama tempat, dress code).
     - Kustomisasi rekening Dana Kebajikan / Tali Kasih (*bank name*, *nomor rekening*, *atas nama*, catatan transfer, serta sakelar aktifkan/nonaktifkan rekening).
     - Kustomisasi alamat lengkap, tautan Google Maps resmi, dan embed peta.
   - **Tab 4: CMS Foto & Galeri Media:**
     - Pengunggah berkas terintegrasi langsung ke **Supabase Storage** (`cms-media` bucket).
     - Ubah foto latar Sampul Amplop, Logo Guang Ji, dan foto barcode QRIS.
     - **Kelola Galeri Dokumentasi:** Tambah foto baru, ubah kategori (*sejarah*, *kegiatan*, *kebersamaan*), ubah judul ID/ZH, dan hapus foto.
     - **Kelola Kilas Sejarah (Milestones Timeline):** Tambah tahapan sejarah baru, ubah narasi perjalanan, tahun, foto arsip, dan hapus tahapan.
   - **Tab 5: Kustomisasi Pesan WhatsApp / Share:**
     - Editor template pesan undangan WhatsApp dinamis.
     - Mendukung variabel otomatis: `{nama}`, `{url}`, `{tanggal}`, `{waktu}`, `{tempat}`.
     - Pilihan preset pesan (*Resmi/Formal*, *Keluarga/Santai*).
     - Live pratinjau pesan WhatsApp interaktif dan tombol uji kirim langsung.

2. **Arsitektur Supabase Cloud:**
   - **Database Postgres:** Tabel `rsvps` dan `guests` dengan Row Level Security (RLS) dan sinkronisasi status kehadiran.
   - **Storage Bucket:** Bucket `cms-media` untuk penyimpanan konfigurasi JSON dinamis dan semua unggahan gambar/foto.
   - **File Migrasi:** Tersedia di [`supabase/schema.sql`](./supabase/schema.sql) untuk dokumentasi dan deployment mandiri.

3. **Nuansa Khidmat & Sakral Fo Thang:**
   - Palet warna *Temple Cinnabar Red* (`#7C1818`), *Sacred Gold* (`#B38638` / `#DFBA6D`), dan *Warm Ivory Linen* (`#FAF8F5`).
   - Tipografi klasik: *Noto Serif SC (Aksara Han)*, *Cormorant Garamond*, dan *Plus Jakarta Sans*.
   - Musik latar khidmat dengan kontrol pemutar melayang (*floating player*).
   - Dukungan dwi-bahasa penuh (Indonesia & Traditional Chinese) dengan toggle pemilih bahasa instan.

---

## 🚀 Menjalankan Secara Lokal

```bash
# 1. Pastikan Node.js v18+ terpasang
npm install

# 2. Konfigurasi kredensial Supabase di .env.local
NEXT_PUBLIC_SUPABASE_URL=https://nuknakbgyefxlpedyiot.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_URL=https://nuknakbgyefxlpedyiot.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...

# 3. Jalankan server pengembangan
npm run dev
```

- Halaman Undangan Tamu: `http://localhost:3000?to=Lim+TC+Felix+Salim`
- Portal Backend Panitia (CMS): `http://localhost:3000/panitia` (PIN: `guanghang2026`)

---

## 🗄️ Skema Database Supabase

Seluruh skema DDL, indeks, dan kebijakan keamanan RLS tersedia di [`supabase/schema.sql`](./supabase/schema.sql).
Tabel utama:
- `public.rsvps`: Menyimpan konfirmasi kehadiran dan ucapan doa.
- `public.guests`: Menyimpan daftar tamu undangan personal dan status buka undangan.
- `storage.buckets ('cms-media')`: Menyimpan berkas media foto dan `cms-settings.json`.
