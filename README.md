# 🏪 Warung Suramadu - Pencatatan Omset Mandiri & Bagi Hasil (PWA)

Aplikasi Web Progressive (PWA) Offline-First untuk mencatat omset harian warung, memantau grafik keuangan, mengelola pembagian hasil usaha (Boss & Karyawan), serta mengunduh laporan keuangan resmi berformat PDF ukuran F4 (1 Lembar).

---

## 🌟 Fitur Utama Terbaru

- 📈 **Dashboard Interaktif**:
  - Grafik tren omset harian (Skala hingga Rp 15 Juta+).
  - Grafik perbandingan omset antar-siklus operasional.
  - Ringkasan realtime total pendapatan Boss dan pembagian 2 Karyawan.

- ⚙️ **Pengaturan Fleksibel**:
  - **Persentase Tabungan Dinamis**: Bebas menentukan besar persen tabungan bagi hasil (misal: 5%, 10%, 15%, 20%).
  - Profil Usaha lengkap (Nama Warung, Alamat, No. HP, Nama Pemilik, Nama Karyawan, Biaya Kontrak Operasional).
  - Unggah foto profil / logo dari galeri HP secara lokal.

- 📊 **Rekapitulasi & 3 Opsi Pemotongan Kontrak**:
  - **Opsi 1**: Rp 0 (0%).
  - **Opsi 2**: Prorata (Diperhitungkan sesuai jumlah hari berjalan / 30).
  - **Opsi 3**: Full 1 Bulan (Dipotong utuh sesuai nilai kontrak di Pengaturan).
  - Pembagian hasil otomatis:
    - **Boss**: 50% Dana Bagi Hasil + Biaya Kontrak Operasional.
    - **Karyawan 1 (25%)** & **Karyawan 2 (25%)**.
  - Tabel riwayat transaksi diurutkan **Terbaru di Atas** dengan nama hari murni (*Senin, Selasa, dst.*).

- 🔄 **Sinkronisasi 2-Arah Otomatis (Cloud Sync)**:
  - Input di HP A langsung terkirim (*Auto-Push*) ke Google Sheets.
  - Saat HP B membuka aplikasi, otomatis menarik (*Auto-Pull*) data terbaru dari Google Sheets tanpa resiko data hilang.

- 📄 **Cetak Laporan PDF Resmi (F4 - 1 Lembar)**:
  - Layout profesional *Executive Navy Blue*, Kop Warung, Ringkasan Box, Tabel Harian, Formulasi Bagi Hasil, & Kolom Tanda Tangan.

---

## 📐 Rumus & Formulasi Keuangan

1. **Tabungan Bagi Hasil (Dinamis %)**:
   $$\text{Total Tabungan} = \sum \left(\text{Omset Kotor Harian} \times \frac{\text{Persentase Tabungan}}{100}\right)$$

2. **Perhitungan Biaya Kontrak**:
   - **Opsi Rp 0**: $\text{Biaya Kontrak} = 0$
   - **Opsi Prorata**: $\text{Biaya Kontrak} = \frac{\text{Biaya Kontrak 30 Hari}}{30} \times \text{Jumlah Hari Berjalan}$
   - **Opsi Full 1 Bulan**: $\text{Biaya Kontrak} = \text{Biaya Kontrak 30 Hari}$

3. **Sisa Dana Bagi Hasil**:
   $$\text{Sisa Dana} = \text{Total Tabungan} - \text{Biaya Kontrak}$$

4. **Alokasi Pembagian Hasil**:
   - $\text{Pendapatan Boss} = (50\% \times \text{Sisa Dana}) + \text{Biaya Kontrak}$
   - $\text{Bagi Hasil Karyawan 1} = 25\% \times \text{Sisa Dana}$
   - $\text{Bagi Hasil Karyawan 2} = 25\% \times \text{Sisa Dana}$

---

## 🛠️ Tutorial Integrasi Google Sheets

1. Buka [Google Sheets](https://sheets.google.com) dan buat dokumen baru.
2. Klik menu **Ekstensi** > **Apps Script**.
3. Hapus semua kode default, lalu tempelkan kode dari file `Code.gs`.
4. Klik tombol **Deploy** (Terapkan) > pilih **Deployment Baru** (*New Deployment*).
5. Pilih tipe **Web App** (Aplikasi Web):
   - **Execute as**: *Me (Email Anda)*
   - **Who has access**: *Anyone (Siapa Saja)*
6. Klik **Deploy**, berikan izin akses, lalu salin **URL Web App**.
7. Tempelkan URL tersebut pada tab **Pengaturan** di dalam aplikasi Warung Suramadu.

---

## 🚀 Cara Instalasi PWA di HP

1. Buka URL GitHub Pages aplikasi di browser Google Chrome / Safari HP.
2. Klik titik tiga (atau tombol bagikan di Safari) > pilih **"Tambahkan ke Layar Utama"** (*Add to Home Screen*).
3. Aplikasi akan terinstal di HP lengkap dengan **Icon Toko Bawaan** dan dapat digunakan secara offline.

---

## 📄 Lisensi & Hak Cipta

© 2026 Warung Suramadu • **by: aliimron1909**