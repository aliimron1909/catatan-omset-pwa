<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Warung Suramadu - Omset Mandiri</title>
  
  <link rel="manifest" href="manifest.json">
  <meta name="theme-color" content="#2563eb">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <link id="app-icon" rel="apple-touch-icon" href="https://cdn-icons-png.flaticon.com/512/3135/3135715.png">

  <!-- CDN Dependencies -->
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js"></script>

  <style>
    body { -webkit-tap-highlight-color: transparent; }
  </style>
</head>
<body class="bg-slate-900 text-slate-100 font-sans min-h-screen pb-24">

  <!-- Header App -->
  <header class="bg-slate-800/90 backdrop-blur sticky top-0 z-50 border-b border-slate-700 px-4 py-3 flex items-center justify-between">
    <div class="flex items-center space-x-3">
      <img id="header-logo" src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" class="w-9 h-9 rounded-lg shadow" alt="Logo" onerror="this.src='https://cdn-icons-png.flaticon.com/512/3135/3135715.png'">
      <div>
        <h1 class="font-bold text-lg leading-tight text-white">Warung Suramadu</h1>
        <p class="text-xs text-blue-400">Pencatatan Omset Mandiri</p>
      </div>
    </div>
    <button type="button" onclick="syncToGoogleSheets()" class="bg-blue-600 hover:bg-blue-500 active:scale-95 text-xs px-3 py-1.5 rounded-lg font-medium flex items-center space-x-1 shadow transition cursor-pointer">
      <i class="fa-solid fa-rotate text-xs"></i>
      <span>Sync Sheets</span>
    </button>
  </header>

  <!-- Content Container -->
  <main class="p-4 max-w-lg mx-auto">

    <!-- TAB 1: FORM INPUT / EDIT OMSET -->
    <section id="tab-input" class="tab-section space-y-4" style="display: block;">
      <div class="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-xl space-y-4">
        
        <input type="hidden" id="editing-id" value="">

        <div class="flex justify-between items-center">
          <h2 id="form-title" class="text-base font-semibold text-blue-400 flex items-center gap-2">
            <i class="fa-solid fa-pen-to-square"></i> Input Omset Harian
          </h2>
          <div class="flex items-center gap-2">
            <button type="button" id="btn-cancel-edit" onclick="batalEdit()" class="hidden bg-slate-700 hover:bg-slate-600 text-slate-300 text-[11px] px-2.5 py-1 rounded-lg transition cursor-pointer">
              Batal Edit
            </button>
            <button type="button" onclick="mulaiSiklusBaru()" class="bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/50 text-[11px] px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition cursor-pointer">
              <i class="fa-solid fa-plus text-[10px]"></i> Siklus Baru
            </button>
          </div>
        </div>

        <div>
          <label class="block text-xs font-medium text-slate-400 mb-1">Tanggal Operasional (Max 1x Input/Hari)</label>
          <input type="date" id="input-tanggal" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:border-blue-500 outline-none">
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-slate-400 mb-1">Siklus Ke-</label>
            <input type="number" id="input-siklus" min="1" value="1" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:border-blue-500 outline-none">
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-400 mb-1">Hari Ke- (Dalam Siklus)</label>
            <input type="number" id="input-hari" min="1" max="30" value="1" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:border-blue-500 outline-none">
          </div>
        </div>

        <div>
          <label class="block text-xs font-medium text-slate-400 mb-1">Nominal Omset Kotor (Rp)</label>
          <input type="text" id="input-omset" placeholder="Rp 0" oninput="formatAndCalculate(this)" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-lg font-bold text-green-400 focus:border-blue-500 outline-none">
        </div>

        <!-- Section Input Pengeluaran (Hanya Info / Tidak Memotong Nominal) -->
        <div class="pt-2 border-t border-slate-700/60 space-y-3">
          <div class="flex items-center justify-between">
            <label class="block text-xs font-semibold text-purple-400">Catatan Pengeluaran (Token, WiFi, dll)</label>
            <span class="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">*Tidak memotong nominal</span>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <input type="text" id="input-pengeluaran" placeholder="Nominal (Rp)" oninput="formatRupiahInput(this)" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-purple-300 focus:border-purple-500 outline-none">
            </div>
            <div>
              <input type="text" id="input-catatan-pengeluaran" placeholder="Ket: Listrik / WiFi" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:border-purple-500 outline-none">
            </div>
          </div>
        </div>

        <!-- Realtime Auto Calculation -->
        <div class="bg-slate-900/60 p-3 rounded-xl space-y-2 border border-slate-800 text-xs">
          <div class="flex justify-between">
            <span class="text-slate-400">Diputar ke Stok Barang (90%):</span>
            <span id="preview-stok" class="font-semibold text-blue-400">Rp 0</span>
          </div>
          <div class="flex justify-between pt-1 border-t border-slate-800">
            <span class="text-slate-400">Tabungan Masuk Bagi Hasil (10%):</span>
            <span id="preview-tabungan" class="font-bold text-yellow-400">Rp 0</span>
          </div>
        </div>

        <button type="button" id="btn-submit" onclick="simpanCatatan()" class="w-full bg-green-600 hover:bg-green-500 active:scale-95 text-white font-semibold py-3 rounded-xl shadow-lg transition flex justify-center items-center gap-2 cursor-pointer">
          <i class="fa-solid fa-floppy-disk"></i> <span id="btn-submit-text">Simpan Catatan Harian</span>
        </button>
      </div>

      <div id="status-sync" class="text-xs text-center text-slate-400">
        Penyimpanan internal aktif (Offline Ready)
      </div>
    </section>

    <!-- TAB 2: REKAPITULASI & PDF -->
    <section id="tab-rekap" class="tab-section space-y-4" style="display: none;">
      
      <!-- Filter Siklus & Tombol Siklus Baru -->
      <div class="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-3">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-slate-300">Pilih Siklus Operasional:</label>
          <select id="filter-siklus" onchange="renderRekap()" class="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-blue-400 font-semibold outline-none">
            <option value="1">Siklus 1</option>
          </select>
        </div>
        <button type="button" onclick="mulaiSiklusBaru()" class="w-full bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-500/40 text-xs py-2 rounded-xl font-medium flex justify-center items-center gap-2 transition cursor-pointer">
          <i class="fa-solid fa-calendar-plus"></i> Buat Siklus Baru (Default 30 Hari)
        </button>
      </div>

      <!-- Ringkasan Perhitungan -->
      <div class="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-3">
        <h3 class="text-xs uppercase tracking-wider font-semibold text-slate-400">Ringkasan & Bagi Hasil Siklus</h3>
        
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="bg-slate-900 p-3 rounded-xl">
            <p class="text-slate-400">Total Omset Kotor</p>
            <p id="rekap-omset" class="text-sm font-bold text-white mt-1">Rp 0</p>
          </div>
          <div class="bg-slate-900 p-3 rounded-xl">
            <p class="text-slate-400">Stok Barang (90%)</p>
            <p id="rekap-stok" class="text-sm font-bold text-blue-400 mt-1">Rp 0</p>
          </div>
        </div>

        <div class="bg-slate-900 p-3 rounded-xl space-y-2 text-xs">
          <div class="flex justify-between">
            <span class="text-slate-400">Total Tabungan (10% Omset):</span>
            <span id="rekap-tabungan" class="font-bold text-yellow-400">Rp 0</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Biaya Kontrak / Operasional:</span>
            <span id="rekap-kontrak-operasional" class="font-semibold text-red-400">Rp 0</span>
          </div>
          <div class="flex justify-between pt-2 border-t border-slate-800">
            <span class="font-semibold text-slate-300">Sisa Dana Bagi Hasil:</span>
            <span id="rekap-sisa-bagihasil" class="font-bold text-green-400">Rp 0</span>
          </div>
          
          <!-- Pembagian Bagi Hasil 50% Boss / 50% Karyawan -->
          <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px]">
            <div class="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
              <span class="text-slate-400 block">Bagi Hasil Boss (50%):</span>
              <span id="rekap-boss-share" class="font-bold text-blue-400 text-xs">Rp 0</span>
            </div>
            <div class="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
              <span class="text-slate-400 block">Bagi Hasil Karyawan (50%):</span>
              <span id="rekap-karyawan-share" class="font-bold text-emerald-400 text-xs">Rp 0</span>
            </div>
          </div>

          <!-- Total Info Pengeluaran (Catatan Sahaja) -->
          <div class="pt-2 border-t border-slate-800 flex justify-between text-[11px]">
            <span class="text-purple-400">Total Catatan Pengeluaran (Info):</span>
            <span id="rekap-total-pengeluaran" class="font-semibold text-purple-300">Rp 0</span>
          </div>
        </div>

        <button type="button" onclick="downloadPDF()" class="w-full bg-red-600 hover:bg-red-500 active:scale-95 text-white font-semibold py-2.5 rounded-xl shadow transition flex items-center justify-center gap-2 text-sm cursor-pointer">
          <i class="fa-solid fa-file-pdf"></i> Download Laporan PDF
        </button>
      </div>

      <!-- Riwayat Tabel Harian -->
      <div class="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-3">
        <h3 class="text-xs uppercase tracking-wider font-semibold text-slate-400">Riwayat Catatan Harian</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-300">
            <thead class="bg-slate-900 text-slate-400 uppercase text-[10px]">
              <tr>
                <th class="p-2">Hari</th>
                <th class="p-2">Tanggal</th>
                <th class="p-2 text-right">Omset</th>
                <th class="p-2 text-right">Pengeluaran</th>
                <th class="p-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody id="tabel-catatan" class="divide-y divide-slate-700">
            </tbody>
          </table>
        </div>
      </div>

    </section>

    <!-- TAB 3: PENGATURAN & BACKUP/RESTORE -->
    <section id="tab-settings" class="tab-section space-y-4" style="display: none;">
      
      <!-- Fitur Backup & Restore CSV -->
      <div class="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-xl space-y-3">
        <h2 class="text-base font-semibold text-emerald-400 flex items-center gap-2">
          <i class="fa-solid fa-database"></i> Backup & Restore Data CSV
        </h2>
        <p class="text-xs text-slate-400">Cadangkan seluruh catatan ke file CSV atau pulihkan data dari file CSV yang pernah di-download.</p>
        
        <div class="grid grid-cols-2 gap-3 pt-2">
          <button type="button" onclick="exportCSV()" class="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-semibold py-2.5 px-3 rounded-xl shadow transition text-xs flex justify-center items-center gap-1.5 cursor-pointer">
            <i class="fa-solid fa-file-csv text-sm"></i> Download CSV
          </button>
          
          <label class="bg-slate-700 hover:bg-slate-600 active:scale-95 text-slate-200 font-semibold py-2.5 px-3 rounded-xl shadow transition text-xs flex justify-center items-center gap-1.5 cursor-pointer text-center">
            <i class="fa-solid fa-file-import text-sm"></i> Restore CSV
            <input type="file" id="import-csv-file" accept=".csv" onchange="importCSV(event)" class="hidden">
          </label>
        </div>
      </div>

      <!-- Settings Kontrak -->
      <div class="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-xl space-y-4">
        <h2 class="text-base font-semibold text-blue-400 flex items-center gap-2">
          <i class="fa-solid fa-gear"></i> Pengaturan Kontrak & API
        </h2>

        <div>
          <label class="block text-xs font-medium text-slate-400 mb-1">Biaya Kontrak / Operasional (Rp / Siklus)</label>
          <input type="text" id="setting-gaji" oninput="formatRupiahInput(this)" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-blue-500 outline-none">
        </div>

        <div>
          <label class="block text-xs font-medium text-slate-400 mb-1">Jumlah Karyawan Aktif</label>
          <input type="number" id="setting-karyawan" min="1" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-blue-500 outline-none">
        </div>

        <div>
          <label class="block text-xs font-medium text-slate-400 mb-1">URL Web App Google Apps Script (Opsional)</label>
          <input type="text" id="setting-script-url" placeholder="https://script.google.com/macros/s/.../exec" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:border-blue-500 outline-none">
        </div>

        <div>
          <label class="block text-xs font-medium text-slate-400 mb-1">URL Logo / Icon Aplikasi</label>
          <input type="text" id="setting-logo-url" placeholder="https://..." class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:border-blue-500 outline-none">
        </div>

        <button type="button" onclick="simpanPengaturan()" class="w-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold py-2.5 rounded-xl shadow transition text-sm cursor-pointer">
          Simpan Pengaturan
        </button>
      </div>

      <!-- Testing Tools Internal -->
      <div class="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-2">
        <p class="text-xs text-slate-400 font-semibold uppercase">Alat Uji Coba (Testing)</p>
        <button type="button" onclick="generateDummyData()" class="w-full bg-slate-700 hover:bg-slate-600 text-yellow-400 text-xs py-2 rounded-xl font-medium cursor-pointer">
          ⚡ Isi 5 Data Uji Coba (Siklus 1)
        </button>
        <button type="button" onclick="clearInternalData()" class="w-full bg-red-950/60 hover:bg-red-900 text-red-400 text-xs py-2 rounded-xl font-medium border border-red-800/50 cursor-pointer">
          🗑️ Hapus Semua Data Internal
        </button>
      </div>
    </section>

  </main>

  <!-- Navigation Bar Bottom -->
  <nav class="fixed bottom-0 left-0 right-0 bg-slate-800/95 backdrop-blur border-t border-slate-700 flex justify-around py-2 z-50">
    <button type="button" onclick="window.switchTab('tab-input')" id="nav-tab-input" class="flex flex-col items-center text-blue-400 text-xs font-medium py-1 px-4 cursor-pointer">
      <i class="fa-solid fa-plus-circle text-lg mb-0.5"></i>
      <span>Input</span>
    </button>
    <button type="button" onclick="window.switchTab('tab-rekap')" id="nav-tab-rekap" class="flex flex-col items-center text-slate-400 text-xs font-medium py-1 px-4 cursor-pointer">
      <i class="fa-solid fa-chart-pie text-lg mb-0.5"></i>
      <span>Rekap & PDF</span>
    </button>
    <button type="button" onclick="window.switchTab('tab-settings')" id="nav-tab-settings" class="flex flex-col items-center text-slate-400 text-xs font-medium py-1 px-4 cursor-pointer">
      <i class="fa-solid fa-sliders text-lg mb-0.5"></i>
      <span>Pengaturan</span>
    </button>
  </nav>

  <!-- Global Script Engine -->
  <script>
    window.switchTab = function(tabId) {
      const sections = document.querySelectorAll('.tab-section');
      sections.forEach(sec => sec.style.display = 'none');

      const target = document.getElementById(tabId);
      if (target) target.style.display = 'block';

      const navs = {
        'tab-input': document.getElementById('nav-tab-input'),
        'tab-rekap': document.getElementById('nav-tab-rekap'),
        'tab-settings': document.getElementById('nav-tab-settings')
      };

      Object.keys(navs).forEach(id => {
        const btn = navs[id];
        if (btn) {
          if (id === tabId) {
            btn.classList.add('text-blue-400');
            btn.classList.remove('text-slate-400');
          } else {
            btn.classList.remove('text-blue-400');
            btn.classList.add('text-slate-400');
          }
        }
      });

      if (tabId === 'tab-rekap') renderRekap();
    };

    const DEFAULT_SETTINGS = {
      gajiPerKaryawan: 1500000,
      jumlahKaryawan: 2,
      scriptUrl: '',
      logoUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
    };

    let records = [];
    let settings = { ...DEFAULT_SETTINGS };

    function loadInitialState() {
      try {
        const savedRecords = localStorage.getItem('suramadu_records');
        if (savedRecords) records = JSON.parse(savedRecords) || [];
      } catch (e) {
        records = [];
      }

      try {
        const savedSettings = localStorage.getItem('suramadu_settings');
        if (savedSettings) {
          settings = Object.assign({}, DEFAULT_SETTINGS, JSON.parse(savedSettings));
        }
      } catch (e) {
        settings = { ...DEFAULT_SETTINGS };
      }
    }

    window.addEventListener('load', () => {
      loadInitialState();

      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').then(reg => reg.update()).catch(err => console.log('SW skipped', err));
      }

      const inputTanggal = document.getElementById('input-tanggal');
      if (inputTanggal) {
        inputTanggal.value = new Date().toISOString().split('T')[0];
      }

      loadSettingsUI();
      renderRekap();
    });

    // Formatting Helpers
    function formatRupiahInput(el) {
      if (!el) return;
      let val = el.value.replace(/[^0-9]/g, '');
      el.value = val ? 'Rp ' + parseInt(val, 10).toLocaleString('id-ID') : '';
    }

    function parseRupiah(str) {
      if (!str) return 0;
      return parseInt(str.toString().replace(/[^0-9]/g, ''), 10) || 0;
    }

    function formatAndCalculate(el) {
      formatRupiahInput(el);
      const omset = parseRupiah(el.value);
      const stok = Math.round(omset * 0.90);
      const tabungan = Math.round(omset * 0.10);

      document.getElementById('preview-stok').innerText = 'Rp ' + stok.toLocaleString('id-ID');
      document.getElementById('preview-tabungan').innerText = 'Rp ' + tabungan.toLocaleString('id-ID');
    }

    // Fitur Membuat Siklus Baru
    function mulaiSiklusBaru() {
      batalEdit();
      const maxSiklus = records.length > 0 ? Math.max(...records.map(r => r.siklus || 1)) : 0;
      const siklusBaru = maxSiklus + 1;
      
      document.getElementById('input-siklus').value = siklusBaru;
      document.getElementById('input-hari').value = 1;
      document.getElementById('input-tanggal').value = new Date().toISOString().split('T')[0];

      alert(`Siklus Baru (Siklus ${siklusBaru}) berhasil dibuat!`);
      window.switchTab('tab-input');
    }

    // Input & Edit Save Record (Dengan Batasan 1x Input/Hari)
    function simpanCatatan() {
      const editingId = document.getElementById('editing-id').value;
      const tanggal = document.getElementById('input-tanggal').value;
      const siklus = parseInt(document.getElementById('input-siklus').value, 10) || 1;
      const hariKe = parseInt(document.getElementById('input-hari').value, 10) || 1;
      const omsetKotor = parseRupiah(document.getElementById('input-omset').value);
      const pengeluaran = parseRupiah(document.getElementById('input-pengeluaran').value);
      const catatanPengeluaran = document.getElementById('input-catatan-pengeluaran').value.trim();

      if (!tanggal || omsetKotor <= 0) {
        alert('Mohon masukkan tanggal dan nominal omset kotor!');
        return;
      }

      // Validasi 1 Kali Input Per Hari
      const duplicateRecord = records.find(r => r.tanggal === tanggal);
      if (duplicateRecord && duplicateRecord.id !== editingId) {
        alert(`Omset untuk tanggal ${tanggal} sudah pernah dicatat!\nHanya diizinkan 1 kali input per hari.\n\nSilakan gunakan tombol EDIT pada tabel riwayat jika ingin mengubah data tanggal ini.`);
        return;
      }

      const stokModal = Math.round(omsetKotor * 0.90);
      const tabungan = Math.round(omsetKotor * 0.10);

      if (editingId) {
        // Mode Update / Edit Data Existing
        const index = records.findIndex(r => r.id === editingId);
        if (index !== -1) {
          records[index] = {
            ...records[index],
            tanggal,
            siklus,
            hariKe,
            omsetKotor,
            stokModal,
            tabungan,
            pengeluaran,
            catatanPengeluaran
          };
          alert('Catatan omset berhasil diperbarui!');
        }
      } else {
        // Mode Simpan Baru
        const newRecord = {
          id: Date.now().toString(),
          tanggal,
          siklus,
          hariKe,
          omsetKotor,
          stokModal,
          tabungan,
          pengeluaran,
          catatanPengeluaran
        };
        records.push(newRecord);
        alert('Catatan omset berhasil disimpan!');
        
        if (settings.scriptUrl) {
          sendRecordToSheets(newRecord);
        }
      }

      localStorage.setItem('suramadu_records', JSON.stringify(records));
      batalEdit();
      renderRekap();
    }

    // Fungsi Edit Record
    function editCatatan(id) {
      const record = records.find(r => r.id === id);
      if (!record) return;

      document.getElementById('editing-id').value = record.id;
      document.getElementById('input-tanggal').value = record.tanggal;
      document.getElementById('input-siklus').value = record.siklus;
      document.getElementById('input-hari').value = record.hariKe;
      
      const omsetEl = document.getElementById('input-omset');
      omsetEl.value = 'Rp ' + record.omsetKotor.toLocaleString('id-ID');
      formatAndCalculate(omsetEl);

      const pengeluaranEl = document.getElementById('input-pengeluaran');
      pengeluaranEl.value = record.pengeluaran ? 'Rp ' + record.pengeluaran.toLocaleString('id-ID') : '';
      document.getElementById('input-catatan-pengeluaran').value = record.catatanPengeluaran || '';

      // Ubah UI Form ke Mode Edit
      document.getElementById('form-title').innerHTML = '<i class="fa-solid fa-pen-to-square text-amber-400"></i> Edit Catatan Omset';
      document.getElementById('btn-submit-text').innerText = 'Update Catatan Harian';
      document.getElementById('btn-submit').className = 'w-full bg-amber-600 hover:bg-amber-500 active:scale-95 text-white font-semibold py-3 rounded-xl shadow-lg transition flex justify-center items-center gap-2 cursor-pointer';
      document.getElementById('btn-cancel-edit').classList.remove('hidden');

      window.switchTab('tab-input');
    }

    function batalEdit() {
      document.getElementById('editing-id').value = '';
      document.getElementById('input-omset').value = '';
      document.getElementById('input-pengeluaran').value = '';
      document.getElementById('input-catatan-pengeluaran').value = '';
      document.getElementById('preview-stok').innerText = 'Rp 0';
      document.getElementById('preview-tabungan').innerText = 'Rp 0';

      document.getElementById('form-title').innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Input Omset Harian';
      document.getElementById('btn-submit-text').innerText = 'Simpan Catatan Harian';
      document.getElementById('btn-submit').className = 'w-full bg-green-600 hover:bg-green-500 active:scale-95 text-white font-semibold py-3 rounded-xl shadow-lg transition flex justify-center items-center gap-2 cursor-pointer';
      document.getElementById('btn-cancel-edit').classList.add('hidden');
    }

    function hapusCatatan(id) {
      if (confirm('Hapus catatan ini?')) {
        records = records.filter(item => item.id !== id);
        localStorage.setItem('suramadu_records', JSON.stringify(records));
        renderRekap();
      }
    }

    // Render Tab Rekapitulasi
    function renderRekap() {
      const selectSiklus = document.getElementById('filter-siklus');
      if (!selectSiklus) return;

      const allSiklus = [...new Set(records.map(r => r.siklus))].sort((a, b) => b - a);
      const currentSelected = selectSiklus.value ? parseInt(selectSiklus.value, 10) : (allSiklus[0] || 1);
      
      selectSiklus.innerHTML = '';
      if (allSiklus.length === 0) {
        selectSiklus.innerHTML = '<option value="1">Siklus 1</option>';
      } else {
        allSiklus.forEach(s => {
          selectSiklus.innerHTML += `<option value="${s}" ${s === currentSelected ? 'selected' : ''}>Siklus ${s}</option>`;
        });
      }

      const activeSiklus = parseInt(selectSiklus.value, 10) || 1;
      const filteredRecords = records.filter(r => r.siklus === activeSiklus).sort((a, b) => a.hariKe - b.hariKe);

      let totalOmset = 0;
      let totalStok = 0;
      let totalTabungan = 0;
      let totalPengeluaran = 0;

      filteredRecords.forEach(r => {
        totalOmset += (r.omsetKotor || 0);
        totalStok += (r.stokModal || Math.round((r.omsetKotor || 0) * 0.90));
        totalTabungan += (r.tabungan || Math.round((r.omsetKotor || 0) * 0.10));
        totalPengeluaran += (r.pengeluaran || 0);
      });

      const biayaKontrak = settings.gajiPerKaryawan || 0;
      const sisaDanaBagiHasil = totalTabungan - biayaKontrak;

      const bossShare = Math.max(0, Math.round(sisaDanaBagiHasil * 0.50));
      const karyawanShare = Math.max(0, Math.round(sisaDanaBagiHasil * 0.50));

      document.getElementById('rekap-omset').innerText = 'Rp ' + totalOmset.toLocaleString('id-ID');
      document.getElementById('rekap-stok').innerText = 'Rp ' + totalStok.toLocaleString('id-ID');
      document.getElementById('rekap-tabungan').innerText = 'Rp ' + totalTabungan.toLocaleString('id-ID');
      document.getElementById('rekap-kontrak-operasional').innerText = 'Rp ' + biayaKontrak.toLocaleString('id-ID');
      document.getElementById('rekap-total-pengeluaran').innerText = 'Rp ' + totalPengeluaran.toLocaleString('id-ID');
      
      const sisaEl = document.getElementById('rekap-sisa-bagihasil');
      sisaEl.innerText = 'Rp ' + sisaDanaBagiHasil.toLocaleString('id-ID');
      sisaEl.className = sisaDanaBagiHasil >= 0 ? 'font-bold text-green-400' : 'font-bold text-red-400';

      document.getElementById('rekap-boss-share').innerText = 'Rp ' + bossShare.toLocaleString('id-ID');
      document.getElementById('rekap-karyawan-share').innerText = 'Rp ' + karyawanShare.toLocaleString('id-ID');

      const tbody = document.getElementById('tabel-catatan');
      tbody.innerHTML = '';

      if (filteredRecords.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="p-3 text-center text-slate-500">Belum ada catatan untuk siklus ini.</td></tr>';
        return;
      }

      filteredRecords.forEach(r => {
        const expNominal = r.pengeluaran ? `Rp ${r.pengeluaran.toLocaleString('id-ID')}` : '-';
        const expLabel = r.catatanPengeluaran ? `<br><span class="text-[9px] text-purple-300">(${r.catatanPengeluaran})</span>` : '';
        
        tbody.innerHTML += `
          <tr>
            <td class="p-2 font-medium">Hari ${r.hariKe}</td>
            <td class="p-2 text-slate-400">${r.tanggal}</td>
            <td class="p-2 text-right font-semibold text-green-400">Rp ${(r.omsetKotor || 0).toLocaleString('id-ID')}</td>
            <td class="p-2 text-right text-purple-400">${expNominal}${expLabel}</td>
            <td class="p-2 text-center space-x-1">
              <button type="button" onclick="editCatatan('${r.id}')" class="text-amber-400 hover:text-amber-300 p-1 cursor-pointer" title="Edit">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button type="button" onclick="hapusCatatan('${r.id}')" class="text-red-400 hover:text-red-300 p-1 cursor-pointer" title="Hapus">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </td>
          </tr>
        `;
      });
    }

    // Fitur Export CSV
    function exportCSV() {
      if (records.length === 0) {
        alert('Belum ada data untuk diekspor!');
        return;
      }

      const headers = ['ID', 'Tanggal', 'Siklus', 'HariKe', 'OmsetKotor', 'StokModal', 'Tabungan', 'Pengeluaran', 'CatatanPengeluaran'];
      const rows = records.map(r => [
        r.id,
        r.tanggal,
        r.siklus,
        r.hariKe,
        r.omsetKotor,
        r.stokModal || Math.round(r.omsetKotor * 0.9),
        r.tabungan || Math.round(r.omsetKotor * 0.1),
        r.pengeluaran || 0,
        `"${(r.catatanPengeluaran || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Backup_Omset_Suramadu_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    // Fitur Import / Restore CSV
    function importCSV(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const text = e.target.result;
          const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
          
          if (lines.length <= 1) {
            alert('File CSV kosong atau tidak valid.');
            return;
          }

          const importedRecords = [];
          for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',').map(c => c.replace(/^"|"$/g, '').trim());
            if (cols.length >= 5) {
              const omsetKotor = parseInt(cols[4], 10) || 0;
              importedRecords.push({
                id: cols[0] || (Date.now() + i).toString(),
                tanggal: cols[1],
                siklus: parseInt(cols[2], 10) || 1,
                hariKe: parseInt(cols[3], 10) || 1,
                omsetKotor: omsetKotor,
                stokModal: cols[5] ? parseInt(cols[5], 10) : Math.round(omsetKotor * 0.9),
                tabungan: cols[6] ? parseInt(cols[6], 10) : Math.round(omsetKotor * 0.1),
                pengeluaran: cols[7] ? parseInt(cols[7], 10) : 0,
                catatanPengeluaran: cols[8] || ''
              });
            }
          }

          if (importedRecords.length > 0) {
            if (confirm(`Ditemukan ${importedRecords.length} data omset pada file. Impor dan gabungkan dengan data saat ini?`)) {
              // Merge by ID or Append
              const recordMap = new Map(records.map(r => [r.id, r]));
              importedRecords.forEach(r => recordMap.set(r.id, r));
              records = Array.from(recordMap.values());

              localStorage.setItem('suramadu_records', JSON.stringify(records));
              renderRekap();
              alert('Data berhasil dipulihkan dari file CSV!');
            }
          } else {
            alert('Format CSV tidak sesuai.');
          }
        } catch (err) {
          console.error(err);
          alert('Gagal membaca file CSV.');
        }
      };
      reader.readAsText(file);
      event.target.value = '';
    }

    // Settings UI
    function loadSettingsUI() {
      const gajiRate = settings.gajiPerKaryawan || 0;
      document.getElementById('setting-gaji').value = 'Rp ' + gajiRate.toLocaleString('id-ID');
      document.getElementById('setting-karyawan').value = settings.jumlahKaryawan || 1;
      document.getElementById('setting-script-url').value = settings.scriptUrl || '';
      document.getElementById('setting-logo-url').value = settings.logoUrl || '';

      if (settings.logoUrl) {
        const logoImg = document.getElementById('header-logo');
        if (logoImg) logoImg.src = settings.logoUrl;
      }
    }

    function simpanPengaturan() {
      settings.gajiPerKaryawan = parseRupiah(document.getElementById('setting-gaji').value);
      settings.jumlahKaryawan = parseInt(document.getElementById('setting-karyawan').value, 10) || 1;
      settings.scriptUrl = document.getElementById('setting-script-url').value.trim();
      settings.logoUrl = document.getElementById('setting-logo-url').value.trim();

      localStorage.setItem('suramadu_settings', JSON.stringify(settings));
      loadSettingsUI();
      renderRekap();
      alert('Pengaturan Kontrak / Operasional berhasil disimpan!');
    }

    // Sync & Testing Utilities
    async function syncToGoogleSheets() {
      if (!settings.scriptUrl) {
        alert('URL Google Apps Script belum diisi di Pengaturan!');
        return;
      }

      const statusEl = document.getElementById('status-sync');
      if (statusEl) statusEl.innerText = 'Mengirim data ke Google Sheets...';

      try {
        await fetch(settings.scriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'syncAll', records })
        });

        if (statusEl) statusEl.innerText = 'Sinkronisasi berhasil dikirim.';
        alert('Data dikirim ke Google Sheets!');
      } catch (err) {
        if (statusEl) statusEl.innerText = 'Gagal sync ke Google Sheets.';
        alert('Gagal menyinkronkan data.');
      }
    }

    async function sendRecordToSheets(record) {
      if (!settings.scriptUrl) return;
      try {
        await fetch(settings.scriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'addRecord', record })
        });
      } catch (e) {}
    }

    function generateDummyData() {
      records = [
        { id: '101', tanggal: '2026-11-01', siklus: 1, hariKe: 1, omsetKotor: 1200000, stokModal: 1080000, tabungan: 120000, pengeluaran: 50000, catatanPengeluaran: 'Token Listrik' },
        { id: '102', tanggal: '2026-11-02', siklus: 1, hariKe: 2, omsetKotor: 1500000, stokModal: 1350000, tabungan: 150000, pengeluaran: 0, catatanPengeluaran: '' },
        { id: '103', tanggal: '2026-11-03', siklus: 1, hariKe: 3, omsetKotor: 950000,  stokModal: 855000,  tabungan: 95000, pengeluaran: 100000, catatanPengeluaran: 'WiFi Indihome' },
        { id: '104', tanggal: '2026-11-04', siklus: 1, hariKe: 4, omsetKotor: 1800000, stokModal: 1620000, tabungan: 180000, pengeluaran: 0, catatanPengeluaran: '' },
        { id: '105', tanggal: '2026-11-05', siklus: 1, hariKe: 5, omsetKotor: 2100000, stokModal: 1890000, tabungan: 210000, pengeluaran: 0, catatanPengeluaran: '' }
      ];
      localStorage.setItem('suramadu_records', JSON.stringify(records));
      alert('5 Data uji coba berhasil dimasukkan!');
      renderRekap();
    }

    function clearInternalData() {
      if (confirm('Hapus seluruh catatan lokal?')) {
        records = [];
        localStorage.removeItem('suramadu_records');
        alert('Penyimpanan internal telah dibersihkan.');
        renderRekap();
      }
    }

    // Download PDF
    function downloadPDF() {
      if (typeof window.jspdf === 'undefined') {
        alert('Library PDF sedang dimuat, coba beberapa detik lagi.');
        return;
      }

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      const activeSiklus = parseInt(document.getElementById('filter-siklus').value, 10) || 1;
      const filteredRecords = records.filter(r => r.siklus === activeSiklus).sort((a, b) => a.hariKe - b.hariKe);

      let totalOmset = 0;
      let totalStok = 0;
      let totalTabungan = 0;
      let totalPengeluaran = 0;

      filteredRecords.forEach(r => {
        totalOmset += (r.omsetKotor || 0);
        totalStok += (r.stokModal || Math.round((r.omsetKotor || 0) * 0.90));
        totalTabungan += (r.tabungan || Math.round((r.omsetKotor || 0) * 0.10));
        totalPengeluaran += (r.pengeluaran || 0);
      });

      const biayaKontrak = settings.gajiPerKaryawan || 0;
      const sisaDanaBagiHasil = totalTabungan - biayaKontrak;
      const bossShare = Math.max(0, Math.round(sisaDanaBagiHasil * 0.50));
      const karyawanShare = Math.max(0, Math.round(sisaDanaBagiHasil * 0.50));

      doc.setFontSize(16);
      doc.setTextColor(37, 99, 235);
      doc.text("LAPORAN KEUANGAN WARUNG SURAMADU", 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Siklus Ke: ${activeSiklus} | Dicetak: ${new Date().toLocaleDateString('id-ID')}`, 14, 27);
      doc.line(14, 30, 196, 30);

      const tableBody = filteredRecords.map(r => [
        `Hari ke-${r.hariKe}`,
        r.tanggal,
        `Rp ${(r.omsetKotor || 0).toLocaleString('id-ID')}`,
        `Rp ${(r.stokModal || Math.round(r.omsetKotor * 0.9)).toLocaleString('id-ID')}`,
        `Rp ${(r.tabungan || Math.round(r.omsetKotor * 0.1)).toLocaleString('id-ID')}`,
        r.pengeluaran ? `Rp ${r.pengeluaran.toLocaleString('id-ID')}` : '-'
      ]);

      doc.autoTable({
        startY: 35,
        head: [['Hari', 'Tanggal', 'Omset Kotor', 'Stok (90%)', 'Tabungan (10%)', 'Pengeluaran']],
        body: tableBody,
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235] }
      });

      const finalY = (doc.lastAutoTable ? doc.lastAutoTable.finalY : 40) + 10;
      
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("Ringkasan Bagi Hasil & Pembagian Kontrak", 14, finalY);

      const summaryRows = [
        ["Total Omset Kotor", `Rp ${totalOmset.toLocaleString('id-ID')}`],
        ["Alokasi Stok Barang Diputar (90%)", `Rp ${totalStok.toLocaleString('id-ID')}`],
        ["Total Tabungan Masuk Bagi Hasil (10%)", `Rp ${totalTabungan.toLocaleString('id-ID')}`],
        ["Biaya Kontrak / Operasional Siklus", `Rp ${biayaKontrak.toLocaleString('id-ID')}`],
        ["Sisa Dana Bagi Hasil (Tabungan - Kontrak)", `Rp ${sisaDanaBagiHasil.toLocaleString('id-ID')}`],
        ["  -> Bagi Hasil Boss (50%)", `Rp ${bossShare.toLocaleString('id-ID')}`],
        ["  -> Bagi Hasil Karyawan (50%)", `Rp ${karyawanShare.toLocaleString('id-ID')}`],
        ["Total Catatan Pengeluaran (Token/WiFi)", `Rp ${totalPengeluaran.toLocaleString('id-ID')}`]
      ];

      doc.autoTable({
        startY: finalY + 4,
        body: summaryRows,
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 2 },
        columnStyles: { 0: { fontStyle: 'bold' }, 1: { halign: 'right', fontStyle: 'bold' } }
      });

      doc.save(`Laporan_Warung_Suramadu_Siklus_${activeSiklus}.pdf`);
    }
  </script>
</body>
</html>
