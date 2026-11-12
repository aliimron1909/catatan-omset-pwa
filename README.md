# Catatan Omset PWA

Aplikasi web progresif (Progressive Web App) untuk pencatatan omset harian warung Madura, manajemen siklus operasional 30 hari, dan perhitungan alokasi keuangan usaha **Warung Suramadu**. Dirancang ringan, mandiri tanpa sistem login, dan mendukung sinkronisasi cloud dua arah ke Google Sheets.

🌐 **Live Demo:** [https://aliimron1909.github.io/catatan-omset-pwa/](https://aliimron1909.github.io/catatan-omset-pwa/)

---

## ✨ Fitur Utama

- **Pencatatan Omset & Keuangan Harian:** Input pendapatan harian secara cepat dengan penyimpanan lokal otomatis (`localStorage`) tanpa perlu login akun.
- **Manajemen Siklus 30 Hari:** Pengaturan periode operasional berbasis siklus 30 hari yang dapat dikustomisasi sesuai jadwal tutup buku.
- **Alokasi Keuangan & Penjaga Warung:** Perhitungan otomatis pembagian hasil dan kontrak untuk maksimal 2 staf (**Karyawan 1** sebagai admin laporan dan **Karyawan 2** sebagai anggota tim tambahan), lengkap dengan pengaturan penjaga warung per siklus.
- **Sinkronisasi Dua Arah Google Sheets:** Kirim cadangan data (`syncAll`) ke Google Sheets dan tarik kembali data ke perangkat baru melalui API Google Apps Script.
- **Ekspor Laporan PDF (Ukuran F4):** Cetak atau simpan laporan keuangan dalam format PDF **1 halaman penuh ukuran F4** dengan tabel berbasis kolom dan format tanggal `dd-mm-yyyy`.
- **Backup & Restore CSV:** Ekspor seluruh riwayat transaksi ke file `.csv` dan pulihkan data kapan saja secara manual.
- **Progressive Web App (PWA) & Mobile-Friendly:**
  - Dapat diinstal langsung ke layar utama (*Add to Home Screen*) di Android/iOS.
  - Dukungan akses offline melalui custom Service Worker (`sw.js`) dan `manifest.json`.
  - Input nominal dioptimalkan dengan keyboard numerik khusus perangkat seluler.

---

## 🛠️ Struktur File

```text
catatan-omset-pwa/
├── index.html        # Antarmuka utama aplikasi & modal pengaturan
├── style.css         # Styling responsif & layout cetak PDF ukuran F4
├── app.js            # Logika perhitungan siklus, alokasi staf, CSV, & sync API
├── manifest.json     # Konfigurasi identitas & ikon PWA
├── sw.js             # Service Worker untuk caching & mode offline
└── README.md         # Dokumentasi proyek & panduan integrasi
```

---

## 🚀 Cara Deploy ke GitHub Pages

1. Upload atau `push` seluruh file proyek ke branch `main` repositori GitHub Anda.
2. Buka tab **Settings** > **Pages** di repositori GitHub.
3. Pada bagian **Build and deployment**, pilih source **Deploy from a branch**.
4. Pilih branch `main` dan folder `/ (root)`, lalu klik **Save**.
5. Tunggu 1–2 menit hingga aplikasi aktif di URL GitHub Pages Anda.

---

## 📊 Tutorial Integrasi Google Sheets (Database Cloud)

Aplikasi ini menggunakan **Google Sheets** dan **Google Apps Script** sebagai database cloud gratis untuk sinkronisasi data antarperangkat.

### Langkah 1: Siapkan Google Sheets
1. Buka [Google Sheets](https://sheets.google.com) dan buat spreadsheet baru (beri nama misalnya: `Database Warung Suramadu`).
2. Di bagian tab bawah, buat **2 sheet (tab)** dengan nama persis seperti berikut (perhatikan huruf besar dan kecilnya):
   - `OmsetHarian`
   - `Pengaturan`

### Langkah 2: Pasang Kode Google Apps Script
1. Di halaman Google Sheets tersebut, klik menu **Ekstensi (Extensions)** > **Apps Script**.
2. Hapus seluruh kode bawaan (`function myFunction() {}`) di editor `Code.gs`.
3. Salin dan tempel kode berikut:

```javascript
const SHEET_OMSET = "OmsetHarian";
const SHEET_PENGATURAN = "Pengaturan";

/**
 * Helper untuk memastikan format tanggal seragam (yyyy-MM-dd)
 */
function formatDateYMD(dateInput) {
  if (!dateInput) return "";
  if (typeof dateInput === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateInput.trim())) {
    return dateInput.trim();
  }
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);
  return Utilities.formatDate(d, "Asia/Jakarta", "yyyy-MM-dd");
}

/**
 * Menangani request GET (Tarik data dari Google Sheets ke PWA)
 */
function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetOmset = ss.getSheetByName(SHEET_OMSET);
    const sheetPengaturan = ss.getSheetByName(SHEET_PENGATURAN);

    // 1. Ambil data OmsetHarian
    const omsetData = [];
    if (sheetOmset && sheetOmset.getLastRow() > 1) {
      const rows = sheetOmset.getDataRange().getValues();
      const headers = rows[0];
      for (let i = 1; i < rows.length; i++) {
        const obj = {};
        headers.forEach((header, idx) => {
          let val = rows[i][idx];
          if (header.toLowerCase().includes("tanggal") || header.toLowerCase() === "date") {
            val = formatDateYMD(val);
          }
          obj[header] = val;
        });
        omsetData.push(obj);
      }
    }

    // 2. Ambil data Pengaturan (Profil, Kontrak Karyawan, Penjaga per Siklus)
    const pengaturanData = {};
    if (sheetPengaturan && sheetPengaturan.getLastRow() > 1) {
      const pRows = sheetPengaturan.getDataRange().getValues();
      for (let i = 1; i < pRows.length; i++) {
        const key = pRows[i][0];
        const rawVal = pRows[i][1];
        if (key) {
          try {
            pengaturanData[key] = JSON.parse(rawVal);
          } catch (_) {
            pengaturanData[key] = rawVal;
          }
        }
      }
    }

    return ContentService.createTextOutput(
      JSON.stringify({
        status: "success",
        omset: omsetData,
        pengaturan: pengaturanData
      })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Menangani request POST (Simpan / SyncAll dari PWA ke Google Sheets)
 */
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (!payload.action || payload.action === "syncAll") {
      // 1. Simpan OmsetHarian
      const sheetOmset = ss.getSheetByName(SHEET_OMSET) || ss.insertSheet(SHEET_OMSET);
      const listOmset = payload.omset || payload.data || [];

      sheetOmset.clearContents();
      if (listOmset.length > 0) {
        const headers = Object.keys(listOmset[0]);
        const rows = [headers];

        listOmset.forEach(item => {
          const row = headers.map(h => {
            if (h.toLowerCase().includes("tanggal") || h.toLowerCase() === "date") {
              return formatDateYMD(item[h]);
            }
            return item[h] !== undefined ? item[h] : "";
          });
          rows.push(row);
        });

        sheetOmset.getRange(1, 1, rows.length, headers.length).setValues(rows);
      }

      // 2. Simpan Pengaturan (Profil, Kontrak, Konfigurasi Siklus)
      const sheetPengaturan = ss.getSheetByName(SHEET_PENGATURAN) || ss.insertSheet(SHEET_PENGATURAN);
      const pengaturan = payload.pengaturan || payload.settings || {};

      sheetPengaturan.clearContents();
      const pRows = [["Key", "Value", "LastUpdated"]];
      const timestamp = Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd HH:mm:ss");

      Object.keys(pengaturan).forEach(key => {
        const val = typeof pengaturan[key] === "object"
          ? JSON.stringify(pengaturan[key])
          : pengaturan[key];
        pRows.push([key, val, timestamp]);
      });

      sheetPengaturan.getRange(1, 1, pRows.length, 3).setValues(pRows);
    }

    return ContentService.createTextOutput(
      JSON.stringify({ status: "success", message: "Sinkronisasi berhasil" })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Tekan **Ctrl + S** (atau klik ikon simpan) dan beri nama proyek script, misalnya `API Warung Suramadu`.

### Langkah 3: Deploy Script sebagai Web App
1. Klik tombol **Terapkan (Deploy)** di kanan atas > pilih **Deployment baru (New deployment)**.
2. Klik ikon gerigi di samping tulisan *Pilih jenis (Select type)* > pilih **Aplikasi web (Web app)**.
3. Isi konfigurasi berikut:
   - **Deskripsi:** `API Warung Suramadu v1`
   - **Jalankan sebagai (Execute as):** `Saya (Me)`
   - **Yang memiliki akses (Who has access):** **`Siapa saja (Anyone)`** *(wajib dipilih agar PWA dapat mengakses API tanpa terhalang login Google)*.
4. Klik **Terapkan (Deploy)**.
5. Jika muncul jendela *Otorisasi diperlukan (Authorize access)*:
   - Klik **Izinkan akses** > pilih akun Google Anda.
   - Klik **Lanjutan (Advanced)** > klik **Buka API Warung Suramadu (tidak aman)** > klik **Izinkan (Allow)**.
6. Salin **URL Aplikasi Web (Web app URL)** yang berakhiran `/exec`.

### Langkah 4: Hubungkan ke Aplikasi PWA
1. Buka aplikasi **Warung Suramadu PWA** di browser perangkat Anda.
2. Masuk ke menu **Pengaturan**.
3. Tempel URL `/exec` ke kolom URL Google Apps Script, lalu simpan.
4. Gunakan tombol **Sync / Kirim Data** untuk mengunggah data lokal ke Google Sheets, atau **Tarik Data** untuk memulihkan data saat membuka aplikasi di perangkat baru.

> **Catatan Pembaruan Script:** Jika suatu saat Anda mengubah kode di `Code.gs`, klik **Terapkan > Kelola deployment > ikon pensil (Edit) > Versi: Versi baru > Terapkan** agar perubahan aktif tanpa mengganti URL `/exec` yang sudah terpasang di aplikasi.
