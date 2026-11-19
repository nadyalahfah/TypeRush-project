# TypeRush — Typing Speed Test

TypeRush adalah website interaktif untuk mengukur kecepatan dan ketepatan mengetik secara real-time. Website ini dikembangkan menggunakan HTML, CSS, dan JavaScript dengan tampilan modern, responsif, serta mendukung dark mode dan light mode.

Project ini dibuat sebagai latihan pengembangan frontend, khususnya dalam penerapan manipulasi DOM, event handling, timer, perhitungan statistik, dan penyimpanan data menggunakan LocalStorage.

## Fitur Utama

- **Typing Test** — Menguji kecepatan mengetik menggunakan teks acak.
- **Timer** — Menyediakan pilihan durasi 15, 30, dan 60 detik.
- **Live WPM** — Menghitung kecepatan mengetik secara real-time.
- **Accuracy** — Menampilkan persentase ketepatan mengetik.
- **Character Highlight** — Memberikan indikator warna pada karakter benar dan salah.
- **Restart Test** — Mengulang pengujian dengan teks baru.
- **Result Summary** — Menampilkan hasil akhir pengujian.
- **Test History** — Menyimpan riwayat hasil pengujian.
- **Personal Best** — Menampilkan kecepatan mengetik tertinggi.
- **Dark/Light Mode** — Mengubah tema sesuai preferensi pengguna.
- **Responsive Design** — Menyesuaikan tampilan pada desktop, tablet, dan mobile.

## Teknologi yang Digunakan

| Teknologi | Kegunaan |
|---|---|
| HTML5 | Struktur halaman website |
| CSS3 | Desain antarmuka dan responsivitas |
| JavaScript | Logika typing test dan interaksi |
| LocalStorage | Penyimpanan riwayat dan preferensi tema |
| Google Fonts | Tipografi website |
| Lucide Icons | Ikon antarmuka |

## Struktur Project

```text
typerush/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── script.js
│   └── words.js
├── assets/
│   └── favicon.svg
└── .gitignore
```

## Cara Menjalankan

1. Clone repository:

   ```bash
   git clone https://github.com/nadyalahfah/typerush.git
   ```

2. Masuk ke folder project:

   ```bash
   cd typerush
   ```

3. Buka folder menggunakan Visual Studio Code:

   ```bash
   code .
   ```

4. Install ekstensi **Live Server** di VS Code jika belum tersedia.
5. Klik kanan file `index.html`, kemudian pilih **Open with Live Server**.
6. Website TypeRush akan terbuka melalui browser.

## Cara Menggunakan

1. Buka halaman utama TypeRush.
2. Pilih durasi pengujian (15, 30, atau 60 detik).
3. Klik area pengetikan dan mulai mengetik teks yang ditampilkan.
4. Timer akan berjalan otomatis setelah karakter pertama diketik.
5. Perhatikan WPM, accuracy, dan jumlah kesalahan selama pengujian.
6. Setelah waktu habis, hasil pengujian akan ditampilkan.
7. Klik **Try Again** untuk mengulang tes atau buka **History** untuk melihat hasil sebelumnya.

## Perhitungan Statistik

**Words Per Minute (WPM)**

Kecepatan mengetik dihitung berdasarkan jumlah karakter benar, dengan asumsi lima karakter setara dengan satu kata.

```text
WPM = (Karakter Benar / 5) / Waktu (menit)
```

**Accuracy**

Ketepatan mengetik dihitung berdasarkan perbandingan jumlah karakter benar dengan total karakter yang diketik.

```text
Accuracy = (Karakter Benar / Total Karakter) × 100%
```

## Penyimpanan Data

TypeRush menggunakan LocalStorage untuk menyimpan riwayat pengujian dan preferensi tema secara lokal di browser.

Riwayat dibatasi hingga 20 hasil terbaru. Data tetap tersedia setelah halaman dimuat ulang selama penyimpanan browser tidak dihapus.

---

© 2026 TypeRush. All Rights Reserved.
