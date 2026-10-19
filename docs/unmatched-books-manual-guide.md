# Panduan Kurasi Cover Buku Manual

Dokumen ini memuat daftar buku yang belum memiliki cover definisi tinggi resmi di situs **The Reading Chamber** (seperti komik Indonesia klasik, manuskrip keagamaan abad pertengahan, antologi independen, atau laporan publikasi khusus).

> Total buku tersisa yang butuh kurasi cover: **67 buku** (dari total 173 buku).
> 106 buku lainnya sudah otomatis di-download dalam resolusi tinggi retina, dengan warna ambient glow 3D yang sudah disesuaikan.

## Langkah Singkat Mengisi / Memperbarui Cover

1. **Cari gambar cover** berorientasi tegak (portrait rasio 2:3, rekomendasi ukuran: `600x900px` atau `800x1200px`).
2. **Simpan file gambar** ke folder `assets/books/` dengan path file yang sudah disiapkan di bawah.
3. **Update datanya**: jalankan helper script otomatis:
   ```bash
   python3 scripts/fetch_book_cover.py "Judul Buku" "Nama Penulis" assets/books/nama-file.jpg
   ```
   Script tersebut otomatis menghitung `coverColor` rata-rata yang cocok untuk rotasi 3D dan ambient aura.
4. Buka file chunk `js/data/episodes_chunkX.js` pada episode dan index yang tertera, lalu isi `coverImage` dan `coverColor`.

---

### Ep. 49 - Kenapa Demokrasi Tidak Akan Pernah Sempurna? | Tentang Pilihan Publik (Public Choice)
*YouTube ID: `HbUO9Are2Hw`*

- **Collective Action**
  - **Penulis**: Russell Hardin
  - **Status**: Gambar resolusi rendah (128x190px)
  - **Target File**: `assets/books/ep-HbUO9Are2Hw-02-collective-action.jpg`
  - **File Data**: `js/data/episodes_chunk1.js` (Index #2)

---

### Ep. 48 - Christopher Nolan vs. Homer: Mengkaji Odyssey dari Perspektif Zaman Modern
*YouTube ID: `0ytdhPJoWRA`*

- **Tafsir Ath-Thabari dan Tarikh Ath-Thabari karya Imam Ath-Thabari**
  - **Penulis**: koleksi perpustakaan
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-0ytdhPJoWRA-02-tafsir-ath-thabari-dan-tarikh-ath-t.jpg`
  - **File Data**: `js/data/episodes_chunk1.js` (Index #2)

---

### Ep. 47 - Sudah Nonton Odyssey dan Bingung? Nonton Video Ini | Respon Zaman Modern Mitologi Yunani
*YouTube ID: `OUGfYiSk8oo`*

- **Mitologi Yunani**
  - **Penulis**: Koleksi Klasik) (Menelaos Yannis Stephanides
  - **Status**: Gambar resolusi rendah (128x184px)
  - **Target File**: `assets/books/ep-OUGfYiSk8oo-02-mitologi-yunani.jpg`
  - **File Data**: `js/data/episodes_chunk1.js` (Index #2)

- **The Aeneid**
  - **Penulis**: Virgil
  - **Status**: Gambar resolusi rendah (128x203px)
  - **Target File**: `assets/books/ep-OUGfYiSk8oo-03-the-aeneid.jpg`
  - **File Data**: `js/data/episodes_chunk1.js` (Index #3)

- **Al-Tabari's Book of Jihad: A Translation from the Original Arabic (Al-Tabari) (Penerjemah & Pengantar: Dr. Yasir S. Ibrahim).**
  - **Penulis**: The Reading Chamber Archive
  - **Status**: Gambar resolusi rendah (128x188px)
  - **Target File**: `assets/books/ep-OUGfYiSk8oo-04-al-tabari-s-book-of-jihad-a-transla.jpg`
  - **File Data**: `js/data/episodes_chunk1.js` (Index #4)

---

### Ep. 43 - Pengambilan Keputusan dalam Pemerintahan | Leadership Blueprint
*YouTube ID: `710oKYFv5Ic`*

- **The Power of Creative Destruction: Economic Upheavals and the Wealth of Nations**
  - **Penulis**: Philippe Aghion, Céline Antonin, & Simon Bunel
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-710oKYFv5Ic-03-the-power-of-creative-destruction-e.jpg`
  - **File Data**: `js/data/episodes_chunk1.js` (Index #3)

- **Shared Prosperity in a Fractured World**
  - **Penulis**: World Bank
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-710oKYFv5Ic-08-shared-prosperity-in-a-fractured-wo.jpg`
  - **File Data**: `js/data/episodes_chunk1.js` (Index #8)

- **Kesan Para Sahabat tentang Widjojo Nitisastro**
  - **Penulis**: The Reading Chamber Archive
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-710oKYFv5Ic-10-kesan-para-sahabat-tentang-widjojo-.jpg`
  - **File Data**: `js/data/episodes_chunk1.js` (Index #10)

- **Berenang di Segara: Kuntoro Mangkusubroto dalam Tuturan Sahabat**
  - **Penulis**: The Reading Chamber Archive
  - **Status**: Gambar resolusi rendah (128x126px)
  - **Target File**: `assets/books/ep-710oKYFv5Ic-11-berenang-di-segara-kuntoro-mangkusu.jpg`
  - **File Data**: `js/data/episodes_chunk1.js` (Index #11)

---

### Ep. 42 - Menjadi Lawyer Legendaris | Masterclass dari Tuti Hadiputranto
*YouTube ID: `o80aUzcKTxo`*

- **A Law Unto Itself: The Untold Story of the Law Firm Sullivan & Cromwell**
  - **Penulis**: Nancy Lisagor & Frank Lipsius
  - **Status**: Gambar resolusi rendah (128x205px)
  - **Target File**: `assets/books/ep-o80aUzcKTxo-03-a-law-unto-itself-the-untold-story-.jpg`
  - **File Data**: `js/data/episodes_chunk2.js` (Index #3)

- **The Skadden Story**
  - **Penulis**: The Institutional Rise of Skadden, Arps
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-o80aUzcKTxo-05-the-skadden-story.jpg`
  - **File Data**: `js/data/episodes_chunk2.js` (Index #5)

---

### Ep. 40 - Membangun Negara yang Tangguh Energi | bersama Rachmat Kaimuddin
*YouTube ID: `r8zrrn_61iI`*

- **Chokepoints**
  - **Penulis**: Edward Fishman
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-r8zrrn_61iI-01-chokepoints.jpg`
  - **File Data**: `js/data/episodes_chunk2.js` (Index #1)

- **More and More and More**
  - **Penulis**: Jean-Baptiste Fressoz
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-r8zrrn_61iI-03-more-and-more-and-more.jpg`
  - **File Data**: `js/data/episodes_chunk2.js` (Index #3)

- **Project Finance Securitisation**
  - **Penulis**: Philip R. Wood
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-r8zrrn_61iI-05-project-finance-securitisation.jpg`
  - **File Data**: `js/data/episodes_chunk2.js` (Index #5)

- **Advanced Introduction to Law and Renewable Energy**
  - **Penulis**: The Reading Chamber Archive
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-r8zrrn_61iI-08-advanced-introduction-to-law-and-re.jpg`
  - **File Data**: `js/data/episodes_chunk2.js` (Index #8)

---

### Ep. 39 - Konspirasi dan Kediktatoran | Siapa Sebenarnya yang Mengatur Dunia?
*YouTube ID: `lqMedBcDGQ8`*

- **How to Feed a Dictator**
  - **Penulis**: Witold Szablowski
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-lqMedBcDGQ8-04-how-to-feed-a-dictator.jpg`
  - **File Data**: `js/data/episodes_chunk2.js` (Index #4)

---

### Ep. 38 - Konspirasi atau Permainan Kekuasaan? | Benarkah Kita Dikendalikan Organisasi Rahasia?
*YouTube ID: `ez4EitV9TvU`*

- **Conspiracy Theories and Other Dangerous Ideas**
  - **Penulis**: Cass R. Sunstein
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-ez4EitV9TvU-00-conspiracy-theories-and-other-dange.jpg`
  - **File Data**: `js/data/episodes_chunk2.js` (Index #0)

---

### Ep. 37 - Tragedi Iblis: Kebencian atau Kesetiaan? | Devil's Advocate Spesial Idulfitri
*YouTube ID: `apklQflp3Hs`*

- **The Devil Series: The Devil, Satan: The Early Christian Tradition, Lucifer: The Devil in Middle Ages, Mephistopheles: The Devil in Modern World, The Prince of Darkness**
  - **Penulis**: Jeffrey Burton Russell
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-apklQflp3Hs-00-the-devil-series-the-devil-satan-th.jpg`
  - **File Data**: `js/data/episodes_chunk2.js` (Index #0)

- **Tragedi Setan**
  - **Penulis**: Peter J. Awn
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-apklQflp3Hs-01-tragedi-setan.jpg`
  - **File Data**: `js/data/episodes_chunk2.js` (Index #1)

- **Satan’s Tragedy and Redemption**
  - **Penulis**: Annemarie Schimmel
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-apklQflp3Hs-02-satan-s-tragedy-and-redemption.jpg`
  - **File Data**: `js/data/episodes_chunk2.js` (Index #2)

- **Kesombongan Iblis**
  - **Penulis**: Ibnu Qayyim Al-Jauziyah
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-apklQflp3Hs-04-kesombongan-iblis.jpg`
  - **File Data**: `js/data/episodes_chunk2.js` (Index #4)

- **Karung Mutiara Al-Ghazali**
  - **Penulis**: K.H.A. Mustofa Bisri (Gus Mus)
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-apklQflp3Hs-05-karung-mutiara-al-ghazali.jpg`
  - **File Data**: `js/data/episodes_chunk2.js` (Index #5)

---

### Ep. 36 - Hukum dan Psikologi untuk Memahami Hakikat Kesepian | Berdasarkan Kumpulan Kasus Hukum
*YouTube ID: `1b0Sdj7fpBQ`*

- **Four Seasons of Loneliness: A Lawyer's Casebook**
  - **Penulis**: J.W. Freiberg
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-1b0Sdj7fpBQ-00-four-seasons-of-loneliness-a-lawyer.jpg`
  - **File Data**: `js/data/episodes_chunk2.js` (Index #0)

- **Critical Sociology from a European Perspective**
  - **Penulis**: J.W. Freiberg
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-1b0Sdj7fpBQ-01-critical-sociology-from-a-european-.jpg`
  - **File Data**: `js/data/episodes_chunk2.js` (Index #1)

- **Surrounded by Others and yet So Alone**
  - **Penulis**: J.W. Freiberg
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-1b0Sdj7fpBQ-02-surrounded-by-others-and-yet-so-alo.jpg`
  - **File Data**: `js/data/episodes_chunk2.js` (Index #2)

- **Growing Up Lonely**
  - **Penulis**: J.W. Freiberg
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-1b0Sdj7fpBQ-03-growing-up-lonely.jpg`
  - **File Data**: `js/data/episodes_chunk2.js` (Index #3)

---

### Ep. 35 - Mengasah Selera Lewat Manga | bersama Eno Bening
*YouTube ID: `nIa57ezhAG0`*

- **Cooking Master Boy (Chūka Ichiban!)**
  - **Penulis**: Etsushi Ogawa
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-nIa57ezhAG0-00-cooking-master-boy-ch-ka-ichiban.jpg`
  - **File Data**: `js/data/episodes_chunk2.js` (Index #0)

- **Sushi Chef Tsukasa (Mitsuboshi no Sushi)**
  - **Penulis**: Mitsuru Sugaya
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-nIa57ezhAG0-01-sushi-chef-tsukasa-mitsuboshi-no-su.jpg`
  - **File Data**: `js/data/episodes_chunk2.js` (Index #1)

- **Bambino!**
  - **Penulis**: Tetsuji Sekiya
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-nIa57ezhAG0-04-bambino.jpg`
  - **File Data**: `js/data/episodes_chunk2.js` (Index #4)

---

### Ep. 34 - Menyelami Sastra Wuxia | Kehormatan, Kekuasaan, dan Dunia Bela Diri
*YouTube ID: `WSrRIzKo2q8`*

- **Tapak Sakti**
  - **Penulis**: The Reading Chamber Archive
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-WSrRIzKo2q8-00-tapak-sakti.jpg`
  - **File Data**: `js/data/episodes_chunk2.js` (Index #0)

- **Pukulan Gledek**
  - **Penulis**: The Reading Chamber Archive
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-WSrRIzKo2q8-01-pukulan-gledek.jpg`
  - **File Data**: `js/data/episodes_chunk2.js` (Index #1)

- **Pedang Maha Dewa**
  - **Penulis**: The Reading Chamber Archive
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-WSrRIzKo2q8-02-pedang-maha-dewa.jpg`
  - **File Data**: `js/data/episodes_chunk2.js` (Index #2)

- **Long Hu Men**
  - **Penulis**: The Reading Chamber Archive
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-WSrRIzKo2q8-03-long-hu-men.jpg`
  - **File Data**: `js/data/episodes_chunk2.js` (Index #3)

- **Tiger Wong**
  - **Penulis**: The Reading Chamber Archive
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-WSrRIzKo2q8-05-tiger-wong.jpg`
  - **File Data**: `js/data/episodes_chunk2.js` (Index #5)

---

### Ep. 31 - Memikirkan Cara Berpikir | dengan Abigail Limuria (What is Up, Indonesia? | Malaka Books)
*YouTube ID: `VJWAQbMrMK8`*

- **Intuition Pumps and Other Tools for Thinking**
  - **Penulis**: Daniel Dennett
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-VJWAQbMrMK8-02-intuition-pumps-and-other-tools-for.jpg`
  - **File Data**: `js/data/episodes_chunk3.js` (Index #2)

- **Four Ways of Thinking**
  - **Penulis**: David Sumpter
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-VJWAQbMrMK8-03-four-ways-of-thinking.jpg`
  - **File Data**: `js/data/episodes_chunk3.js` (Index #3)

- **The 6 Disciplines of Strategic Thinking**
  - **Penulis**: Michael D. Watkins
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-VJWAQbMrMK8-04-the-6-disciplines-of-strategic-thin.jpg`
  - **File Data**: `js/data/episodes_chunk3.js` (Index #4)

---

### Ep. 28 - Komik & IP Lokal: Dari Bharatayuda hingga Kyokarta | bersama Faza Meonk (@siJukiHoki )
*YouTube ID: `qMOlNeEGGkc`*

- **Si Juki x BlackJack**
  - **Penulis**: Faza Meonk
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-qMOlNeEGGkc-00-si-juki-x-blackjack.jpg`
  - **File Data**: `js/data/episodes_chunk3.js` (Index #0)

- **Kung Fu Komang**
  - **Penulis**: The Reading Chamber Archive
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-qMOlNeEGGkc-01-kung-fu-komang.jpg`
  - **File Data**: `js/data/episodes_chunk3.js` (Index #1)

- **Pandawa Seda**
  - **Penulis**: R.A. Kosasih
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-qMOlNeEGGkc-02-pandawa-seda.jpg`
  - **File Data**: `js/data/episodes_chunk3.js` (Index #2)

- **Bharatayudha**
  - **Penulis**: R.A. Kosasih
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-qMOlNeEGGkc-03-bharatayudha.jpg`
  - **File Data**: `js/data/episodes_chunk3.js` (Index #3)

- **Malin Kundang**
  - **Penulis**: Aris Ardianto & Misurind
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-qMOlNeEGGkc-04-malin-kundang.jpg`
  - **File Data**: `js/data/episodes_chunk3.js` (Index #4)

- **Paksi Jaladara**
  - **Penulis**: Asep Sunandar Sunarya & Harry Mintareja
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-qMOlNeEGGkc-05-paksi-jaladara.jpg`
  - **File Data**: `js/data/episodes_chunk3.js` (Index #5)

- **Sang Naga Sasra, Pendekar Pilihan Dewa, Perebutan Mustika Amaranjali**
  - **Penulis**: Teguh Santosa
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-qMOlNeEGGkc-06-sang-naga-sasra-pendekar-pilihan-de.jpg`
  - **File Data**: `js/data/episodes_chunk3.js` (Index #6)

- **Tira Dalam Pasungan**
  - **Penulis**: The Reading Chamber Archive
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-qMOlNeEGGkc-07-tira-dalam-pasungan.jpg`
  - **File Data**: `js/data/episodes_chunk3.js` (Index #7)

---

### Ep. 27 - Melihat Dunia Lewat Kacamata Ekonomi | bersama Masyita Crystallin
*YouTube ID: `8fnseRh8FOc`*

- **Tanda-tanda kemajuan negara berkembang,**
  - **Penulis**: The Reading Chamber Archive
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-8fnseRh8FOc-00-tanda-tanda-kemajuan-negara-berkemb.jpg`
  - **File Data**: `js/data/episodes_chunk3.js` (Index #0)

- **Mengejar Fajar**
  - **Penulis**: Metta Dharmasaputra
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-8fnseRh8FOc-01-mengejar-fajar.jpg`
  - **File Data**: `js/data/episodes_chunk3.js` (Index #1)

- **Will Singapore Exist in 100 Years?**
  - **Penulis**: Seng Han Thong
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-8fnseRh8FOc-03-will-singapore-exist-in-100-years.jpg`
  - **File Data**: `js/data/episodes_chunk3.js` (Index #3)

---

### Ep. 26 - Episode Halloween: The Special Kind of Horror
*YouTube ID: `_7AyrDpYFUo`*

- **Misteri Hantu Terbesar di Dunia**
  - **Penulis**: The Reading Chamber Archive
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-_7AyrDpYFUo-01-misteri-hantu-terbesar-di-dunia.jpg`
  - **File Data**: `js/data/episodes_chunk3.js` (Index #1)

- **My Death**
  - **Penulis**: Lisa Tuttle
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-_7AyrDpYFUo-02-my-death.jpg`
  - **File Data**: `js/data/episodes_chunk3.js` (Index #2)

- **Nube Series**
  - **Penulis**: The Reading Chamber Archive
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-_7AyrDpYFUo-06-nube-series.jpg`
  - **File Data**: `js/data/episodes_chunk3.js` (Index #6)

- **Ushio and Tora**
  - **Penulis**: The Reading Chamber Archive
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-_7AyrDpYFUo-07-ushio-and-tora.jpg`
  - **File Data**: `js/data/episodes_chunk3.js` (Index #7)

- **Jigoku**
  - **Penulis**: The Reading Chamber Archive
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-_7AyrDpYFUo-10-jigoku.jpg`
  - **File Data**: `js/data/episodes_chunk3.js` (Index #10)

- **Gerbang Malam**
  - **Penulis**: The Reading Chamber Archive
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-_7AyrDpYFUo-13-gerbang-malam.jpg`
  - **File Data**: `js/data/episodes_chunk3.js` (Index #13)

- **100 Ghost Stories to Die For**
  - **Penulis**: The Reading Chamber Archive
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-_7AyrDpYFUo-14-100-ghost-stories-to-die-for.jpg`
  - **File Data**: `js/data/episodes_chunk3.js` (Index #14)

- **Koleksi Chie Watari**
  - **Penulis**: The Reading Chamber Archive
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-_7AyrDpYFUo-17-koleksi-chie-watari.jpg`
  - **File Data**: `js/data/episodes_chunk3.js` (Index #17)

- **Pengantin Demos**
  - **Penulis**: The Reading Chamber Archive
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-_7AyrDpYFUo-19-pengantin-demos.jpg`
  - **File Data**: `js/data/episodes_chunk3.js` (Index #19)

- **Hantu Yoko**
  - **Penulis**: Komik Fantasteen
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-_7AyrDpYFUo-21-hantu-yoko.jpg`
  - **File Data**: `js/data/episodes_chunk3.js` (Index #21)

---

### Ep 23 - Bisakah Filsafat Menjelaskan Eren Yeager? | bersama Eno Bening
*YouTube ID: `WNPEGuRC7ak`*

- **Record of Ragnarok (Shūmatsu no Valkyrie)**
  - **Penulis**: Shinya Umemura, Takumi Fukui & Ajichika
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-WNPEGuRC7ak-04-record-of-ragnarok-sh-matsu-no-valk.jpg`
  - **File Data**: `js/data/episodes_chunk3.js` (Index #4)

- **Pengantin Demos**
  - **Penulis**: Yuuho Ashibe
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-WNPEGuRC7ak-05-pengantin-demos.jpg`
  - **File Data**: `js/data/episodes_chunk3.js` (Index #5)

---

### Ep. 22 - Memahami Budaya Wibu di Indonesia | bersama Eno Bening
*YouTube ID: `e2_1IEcO1eo`*

- **Bagaimana Media Sosial Menghancurkanmu**
  - **Penulis**: Eno Bening
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-e2_1IEcO1eo-00-bagaimana-media-sosial-menghancurka.jpg`
  - **File Data**: `js/data/episodes_chunk4.js` (Index #0)

- **World Without Sleep**
  - **Penulis**: Yamada Futaba
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-e2_1IEcO1eo-01-world-without-sleep.jpg`
  - **File Data**: `js/data/episodes_chunk4.js` (Index #1)

- **Family Compo**
  - **Penulis**: Tsukasa Hojo
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-e2_1IEcO1eo-02-family-compo.jpg`
  - **File Data**: `js/data/episodes_chunk4.js` (Index #2)

- **One Piece**
  - **Penulis**: Eiichiro Oda
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-e2_1IEcO1eo-04-one-piece.jpg`
  - **File Data**: `js/data/episodes_chunk4.js` (Index #4)

---

### Ep. 5 - What if God is an Economist? | Exploring The Wonders of Islamic Law Through Law & Economics
*YouTube ID: `NT5s5Fuz1LQ`*

- **The Epistle on Legal Theory by Al-Syafi’i**
  - **Penulis**: The Reading Chamber Archive
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-NT5s5Fuz1LQ-00-the-epistle-on-legal-theory-by-al-s.jpg`
  - **File Data**: `js/data/episodes_chunk5.js` (Index #0)

---

### Ep. 4 - Final Fantasy and JRPGs | Having Fun Through Pain and Tribulations
*YouTube ID: `IgmCofFeEjk`*

- **The Sky**
  - **Penulis**: The Art of Final Fantasy by Yoshitaka Amano
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-IgmCofFeEjk-00-the-sky.jpg`
  - **File Data**: `js/data/episodes_chunk5.js` (Index #0)

---

### Ep. 1 - Pilot Episode | A Prelude to The Joy of Reading
*YouTube ID: `2sNs9AcvsSM`*

- **The Sky**
  - **Penulis**: The Art of Final Fantasy by Yoshitaka Amano
  - **Status**: Belum ada gambar
  - **Target File**: `assets/books/ep-2sNs9AcvsSM-00-the-sky.jpg`
  - **File Data**: `js/data/episodes_chunk5.js` (Index #0)

---
