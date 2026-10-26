/**
 * =========================================================================
 * GOOGLE APPS SCRIPT - BACKEND FULL DATABASE KUANG HANG FO THANG
 * Spreadsheet Target: "Daftar Tamu Ultah Khang"
 * URL: https://docs.google.com/spreadsheets/d/1RMauJya937WQZfyrSRCifhOw8AZj4Zr20elRSAW409k/edit
 * =========================================================================
 * 
 * CARA MEMASANG (HANYA 1 MENIT):
 * 1. Buka spreadsheet Google Anda:
 *    https://docs.google.com/spreadsheets/d/1RMauJya937WQZfyrSRCifhOw8AZj4Zr20elRSAW409k/edit
 * 2. Di menu atas, klik: Ekstensi (Extensions) > Apps Script.
 * 3. Hapus semua isi yang ada, lalu COPY & PASTE seluruh kode di bawah ini.
 * 4. Klik tombol "Simpan" (ikon disket).
 * 5. Klik tombol biru "Terapkan" (Deploy) di pojok kanan atas > "Penerapan baru" (New deployment).
 * 6. Pada roda gigi (ikon gear) jenis penerapan, pilih "Aplikasi web" (Web app).
 * 7. Isi konfigurasi:
 *    - Deskripsi: Backend RSVP Kuang Hang 20th
 *    - Jalankan sebagai (Execute as): "Saya" (Me - email akun Google Anda)
 *    - Yang memiliki akses (Who has access): "Siapa saja" (Anyone) -> WAJIB agar web bisa mengirim data
 * 8. Klik "Terapkan" (Deploy) lalu izinkan akses Google Account Anda (Review permissions > Advanced > Go to ...).
 * 9. Salin "URL Aplikasi Web" (URL yang berakhiran /exec).
 * 10. Masukkan URL tersebut ke Vercel Environment Variables:
 *     Nama: GOOGLE_SHEET_WEBHOOK_URL
 *     Value: [URL /exec yang Anda dapatkan tadi]
 */

// 1. MENERIMA RSVP BARU DARI WEBSITE (WRITE)
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Jika spreadsheet masih kosong, buat baris header otomatis
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Waktu Submit",
        "Nama Umat / Tamu",
        "Status Kehadiran",
        "Jumlah Hadir",
        "Untaian Doa & Harapan"
      ]);
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
      .createTextOutput(JSON.stringify({ result: "success", message: "Data berhasil dicatat ke Google Sheets" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 2. MEMBACA SEMUA DATA TAMU KE WEBSITE & PANEL PANITIA (READ)
function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var values = sheet.getDataRange().getValues();
    var rows = [];

    // Lewati baris header (index 0)
    for (var i = 1; i < values.length; i++) {
      var row = values[i];
      if (row[1]) { // jika kolom nama ada isinya
        var rawStatus = String(row[2]).toLowerCase();
        var status = "hadir";
        if (rawStatus.indexOf("tidak") !== -1 || rawStatus.indexOf("absen") !== -1) {
          status = "tidak_hadir";
        } else if (rawStatus.indexOf("ragu") !== -1 || rawStatus.indexOf("mungkin") !== -1) {
          status = "ragu";
        }

        rows.push({
          id: "sheet-" + i,
          timestamp: row[0] ? String(row[0]) : "-",
          name: String(row[1]),
          status: status,
          guests: parseInt(row[3]) || 1,
          message: row[4] ? String(row[4]) : ""
        });
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, data: rows }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
