/**
 * ============================================================
 * PANDUAN INTEGRASI RSVP GOOGLE SHEETS - KUANG HANG FO THANG
 * ============================================================
 * 
 * 1. Buka Google Sheets baru di browser (misal: "RSVP 20 Tahun Kuang Hang").
 * 2. Klik menu: Ekstensi (Extensions) > Apps Script.
 * 3. Hapus semua teks yang ada, lalu salin dan tempel (copy-paste) kode di bawah ini.
 * 4. Klik tombol "Simpan" (ikon disket).
 * 5. Klik tombol biru "Terapkan" (Deploy) di kanan atas > "Penerapan baru" (New deployment).
 * 6. Pilih jenis: "Aplikasi web" (Web app).
 * 7. Pada bagian:
 *    - Jalankan sebagai (Execute as): "Saya" (Me)
 *    - Yang memiliki akses (Who has access): "Siapa saja" (Anyone)
 * 8. Klik "Terapkan" (Deploy) dan berikan izin akses ke akun Google Anda.
 * 9. Salin "URL Aplikasi Web" (URL berakhiran /exec).
 * 10. Masukkan URL tersebut ke:
 *     - Lokal: buat file .env.local dengan isi:
 *       GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
 *     - Vercel: Masuk ke Settings > Environment Variables > Tambahkan GOOGLE_SHEET_WEBHOOK_URL.
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Jika spreadsheet masih kosong baru pertama kali dibuat, buatkan baris judul kolom otomatis
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Waktu Submit",
        "Nama Umat / Tamu",
        "Status Kehadiran",
        "Jumlah Hadir",
        "Untaian Doa & Harapan"
      ]);
      // Format header agar rapi dan tebal
      var headerRange = sheet.getRange(1, 1, 1, 5);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#F4EEE4");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }

    var statusText = "Hadir";
    if (data.status === "tidak_hadir") {
      statusText = "Tidak Hadir";
    } else if (data.status === "ragu") {
      statusText = "Masih Ragu";
    }

    // Tambahkan data baris baru
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }),
      data.name || "-",
      statusText,
      data.guests || 1,
      data.message || "-"
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
