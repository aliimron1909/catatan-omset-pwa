# 🏪 Warung Suramadu - Pencatatan Omset Mandiri & Bagi Hasil (PWA)

Aplikasi Web Progressive (PWA) Offline-First untuk mencatat omset harian warung, memantau grafik keuangan, mengelola pembagian hasil usaha (Boss & Karyawan), serta mengunduh laporan keuangan resmi berformat PDF ukuran F4 (1 Lembar).

---

## 🌟 Fitur Utama

- 📈 **Dashboard Interaktif**:
  - Grafik tren omset harian (Skala hingga $\text{Rp } 15.000.000+$).
  - Grafik perbandingan omset antar-siklus operasional.
  - Ringkasan *realtime* total pendapatan Boss dan pembagian 2 Karyawan.
  - Otomatis membuka **Siklus Berjalan (Siklus Terbaru)** saat aplikasi dibuka.

- 📝 **Input Omset Harian**:
  - Validasi ketat **maksimal 1 kali input per hari**.
  - Penentuan Siklus dan Hari ke- ($1 \dots 30$) secara otomatis.
  - Form pencatatan pengeluaran operasional tambahan (Token Listrik, WiFi, dll).

- 📊 **Rekapitulasi & Formulasi Bagi Hasil**:
  - Perhitungan **$10\%$ Tabungan Bagi Hasil** dari Total Omset Kotor.
  - **Penanganan Siklus Belum 30 Hari**: Opsi Kontrak $\text{Rp } 0$ atau Prorata (Bagi 30 Hari).
  - Pembagian hasil otomatis:
    - **Boss**: $50\%$ Dana Bagi Hasil + Biaya Kontrak Operasional.
    - **Karyawan 1**: $25\%$ Dana Bagi Hasil.
    - **Karyawan 2**: $25\%$ Dana Bagi Hasil.
  - Tabel riwayat transaksi diurutkan **Terbaru di Atas** dengan tampilan nama hari murni (*Senin, Selasa, dst.*).

- 📄 **Cetak Laporan PDF Resmi (Kertas F4 - 1 Lembar)**:
  - Format laporan keuangan profesional dengan skema warna *Executive Navy Blue*.
  - Dilengkapi Kop Resmi Warung, Ringkasan Box, Tabel Harian, 2 Kolom Formulasi Bagi Hasil, dan Kolom Tanda Tangan.

- 💾 **Offline Ready & Backup Data CSV**:
  - Memanfaatkan *Service Worker* agar aplikasi tetap berjalan tanpa koneksi internet.
  - Fitur **Download Backup CSV** dan **Restore Data CSV** untuk keamanan data.
  - Sinkronisasi otomatis/manual ke **Google Sheets** via Google Apps Script.

---

## 📐 Rumus & Formulasi Keuangan

1. **Tabungan Bagi Hasil ($10\%$)**:
   $$\text{Total Tabungan} = \sum (\text{Omset Kotor Harian} \times 10\%)$$

2. **Biaya Kontrak Prorata (Jika Siklus $< 30$ Hari)**:
   $$\text{Biaya Kontrak} = \frac{\text{Gaji Kontrak 30 Hari}}{30} \times \text{Jumlah Hari Berjalan}$$

3. **Sisa Dana Bagi Hasil**:
   $$\text{Sisa Dana} = \text{Total Tabungan} - \text{Biaya Kontrak}$$

4. **Alokasi Pembagian Hasil**:
   - $\text{Pendapatan Boss} = (50\% \times \text{Sisa Dana}) + \text{Biaya Kontrak}$
   - $\text{Bagi Hasil Karyawan 1} = 25\% \times \text{Sisa Dana}$
   - $\text{Bagi Hasil Karyawan 2} = 25\% \times \text{Sisa Dana}$

---

## 🛠️ Struktur Proyek

```text
├── index.html       # Aplikasi utama (Single Page Application)
├── sw.js            # Service Worker untuk caching offline (v16)
├── manifest.json    # Konfigurasi PWA & Icon Toko
├── icon.svg         # Icon Vector Resmi Toko Warung
└── README.md        # Dokumentasi resmi & Tutorial Google Sheets
```

---

## 📊 Tutorial Integrasi Google Sheets

Aplikasi ini dapat menyimpan data omset secara otomatis atau manual ke Google Sheets menggunakan **Google Apps Script**.

### Langkah 1: Buat Spreadsheet Baru
1. Buka [Google Sheets](https://sheets.google.com) dan buat dokumen baru.
2. Beri nama spreadsheet Anda, contoh: `Database Omset Warung Suramadu`.

### Langkah 2: Buka Google Apps Script
1. Di menu atas Google Sheets, klik **Ekstensi** (Extensions) $\rightarrow$ **Apps Script**.
2. Hapus semua kode default yang ada di dalam editor `Kode.gs`.

### Langkah 3: Tempelkan Kode Apps Script (`Code.gs`)
Salin dan tempelkan seluruh kode JavaScript di bawah ini ke editor Apps Script:

```javascript
function doPost(e) {
  try {
    var contents = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();
    
    // Buat Header Otomatis jika sheet masih kosong
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "ID Transaksi", 
        "Tanggal", 
        "Siklus", 
        "Hari Ke", 
        "Omset Kotor (Rp)", 
        "Tabungan 10% (Rp)", 
        "Pengeluaran (Rp)", 
        "Catatan Pengeluaran", 
        "Waktu Sync"
      ]);
      sheet.getRange(1, 1, 1, 9)
           .setFontWeight("bold")
           .setBackground("#1e3a8a")
           .setFontColor("#ffffff");
    }
    
    var action = contents.action;
    var now = Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd HH:mm:ss");
    
    // 1. Simpan 1 Record Baru (Realtime saat tombol simpan diklik)
    if (action === "addRecord" && contents.record) {
      var r = contents.record;
      sheet.appendRow([
        r.id,
        r.tanggal,
        r.siklus,
        r.hariKe,
        r.omsetKotor,
        r.tabungan || Math.round(r.omsetKotor * 0.1),
        r.pengeluaran || 0,
        r.catatanPengeluaran || "",
        now
      ]);
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Record added" }))
                           .setMimeType(ContentService.MimeType.JSON);
    }
    
    // 2. Sync Seluruh Data (Saat tombol Sync diklik)
    if (action === "syncAll" && contents.records) {
      var records = contents.records;
      
      // Bersihkan data lama (kecuali baris header)
      if (sheet.getLastRow() > 1) {
        sheet.getRange(2, 1, sheet.getLastRow() - 1, 9).clearContent();
      }
      
      var rows = [];
      for (var i = 0; i < records.length; i++) {
        var rec = records[i];
        rows.push([
          rec.id,
          rec.tanggal,
          rec.siklus,
          rec.hariKe,
          rec.omsetKotor,
          rec.tabungan || Math.round(rec.omsetKotor * 0.1),
          rec.pengeluaran || 0,
          rec.catatanPengeluaran || "",
          now
        ]);
      }
      
      if (rows.length > 0) {
        sheet.getRange(2, 1, rows.length, 9).setValues(rows);
      }
      
      return ContentService.createTextOutput(JSON.stringify({ status: "success", count: rows.length }))
                           .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Unknown action" }))
                         .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", error: err.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Langkah 4: Deploy Web App
1. Klik tombol **Deploy** (Terapkan) di pojok kanan atas $\rightarrow$ pilih **New deployment** (Terapkan baru).
2. Di bagian jenis eksekusi (ikon roda gigi), pilih **Web app**.
3. Isi konfigurasi sebagai berikut:
   - **Description**: `API Omset Suramadu`
   - **Execute as**: `Me` (Email Anda)
   - **Who has access**: `Anyone` (Siapa saja) — *Penting agar aplikasi web dapat mengirim data.*
4. Klik **Deploy**.
5. Izinkan akses (*Authorize access*) saat diminta oleh Google.
6. **Salin URL Web App** yang dihasilkan (contoh format: `https://script.google.com/macros/s/AKfycbx.../exec`).

### Langkah 5: Hubungkan ke Aplikasi Warung Suramadu
1. Buka aplikasi **Warung Suramadu** di HP/Browser.
2. Masuk ke tab **Pengaturan** (ikon roda gigi di navigasi bawah).
3. Tempelkan (*paste*) URL Web App ke kolom **URL Web App Google Apps Script**.
4. Klik **Simpan Pengaturan**.
5. Sekarang, setiap kali Anda menyimpan omset harian atau menekan tombol **Sync** di header atas, data otomatis tersimpan di Google Sheets Anda!

---

## 📱 Cara Instalasi PWA (Mobile/HP)

1. Buka link web di browser **Chrome Android** atau **Safari iOS**.
2. Klik tombol **Titik Tiga** di browser $\rightarrow$ pilih **"Tambahkan ke Layar Utama"** (*Add to Home Screen*).
3. Aplikasi akan terinstal di HP Anda lengkap dengan Icon Toko bawaan dan dapat digunakan secara offline.

---

## 📄 Lisensi & Hak Cipta

© 2026 Warung Suramadu • **by: aliimron1909**