/* ==========================================================================
   Books Library - Modular Data & Catalog Builder
   The Reading Chamber Perpustakaan
   ========================================================================== */

import { episodeData } from '../core/data.js';
import { FALLBACK_EPISODES } from '../features/youtube.js';

export const BOOK_CATEGORIES = [
    { id: 'all', label: 'Semua Koleksi' },
    { id: 'filsafat', label: 'Filsafat & Pemikiran' },
    { id: 'hukum', label: 'Hukum & Bisnis' },
    { id: 'politik', label: 'Politik & Tata Kelola' },
    { id: 'sastra', label: 'Sastra & Mitologi' },
    { id: 'psikologi', label: 'Psikologi & Refleksi' }
];

export const BOOK_DESCRIPTIONS = {
    "Yang Tak Terkatakan tentang Menuju Dewasa": {
        category: "psikologi",
        description: "Esai reflektif yang membongkar ilusi fase kedewasaan (adulting). Okki Sutanto mengajak pembaca membedah kegelisahan, ekspektasi sosial, dan seni berdamai dengan kenyataan hidup yang tak pernah punya buku panduan pasti."
    },
    "Why We Are Restless: On the Modern Quest for Contentment": {
        category: "filsafat",
        description: "Menelusuri akar filosofis kegelisahan manusia modern dari pemikiran Montaigne, Pascal, Rousseau, hingga Tocqueville. Mengapa hidup yang secara materi semakin nyaman justru melahirkan kehampaan eksistensial?"
    },
    "The Birth of Hedonism: The Cyrenaic Philosophers and Pleasure as a Way of Life": {
        category: "filsafat",
        description: "Kajian mendalam tentang mazhab Kirene, para filsuf Yunani kuno pengusung kenikmatan saat ini (present pleasure) sebagai strategi menghadapi kerapuhan hidup dan ketidakpastian masa depan."
    },
    "The Hedonism Handbook: Mastering the Lost Arts of Leisure and Pleasure": {
        category: "filsafat",
        description: "Panduan bernas dan penuh humor untuk merebut kembali waktu luang di tengah obsesi produktivitas modern, mengulas seni menikmati hidup dan apresiasi estetika sehari-hari."
    },
    "Winning: The Unforgiving Race to Greatness": {
        category: "psikologi",
        description: "Ditulis oleh pelatih legendaris Michael Jordan dan Kobe Bryant. Mengupas mentalitas ekstrem, pengorbanan tanpa kompromi, dan standar brutal yang dibutuhkan untuk mencapai performa kelas dunia."
    },
    "On Giving Up": {
        category: "psikologi",
        description: "Psikoanalis Adam Phillips mengeksplorasi paradoks menyerah. Kapan menyerah bukanlah tanda kegagalan, melainkan keputusan berani untuk melepaskan fantasi yang merusak."
    },
    "Catatan Pinggir": {
        category: "sastra",
        description: "Kumpulan esai mingguan Goenawan Mohamad di Majalah Tempo. Tulisan-tulisan puitis dan kritis yang membedah kebudayaan, politik, filsafat, dan kemanusiaan dengan ketajaman bahasa luar biasa."
    },
    "Mr. Clean Mar'ie Muhammad: Sang Pejuang Antikorupsi dan Aktivis Kemanusiaan": {
        category: "politik",
        description: "Biografi Menkeu legendaris Mar'ie Muhammad. Menampilkan potret pejabat publik yang memegang teguh integritas, kesederhanaan ekstrem, dan perlawanan terhadap korupsi di era Orde Baru."
    },
    "How to Stand Up to a Dictator": {
        category: "politik",
        description: "Memoar penerima Nobel Perdamaian Maria Ressa. Garis depan pertarungan jurnalisme investigatif melawan disinformasi digital terorganisir dan otoritarianisme modern di Filipina."
    },
    "The Dictator's Handbook": {
        category: "politik",
        description: "Analisis teori politik selectorate tentang bagaimana kekuasaan benar-benar bekerja. Menjelaskan mengapa diktator maupun politisi demokrasi mengambil keputusan yang sama demi kekuasaan."
    },
    "Public Choice: Concepts and Applications in Law": {
        category: "hukum",
        description: "Buku teks fundamental yang menerapkan analisis ekonomi ke dalam proses pembuatan hukum dan kebijakan publik, membongkar bagaimana insentif kelompok kepentingan membentuk hukum kita."
    },
    "The Arrow Impossibility Theorem": {
        category: "politik",
        description: "Eksplorasi teorema matematis Kenneth Arrow oleh peraih Nobel Eric Maskin dan Amartya Sen. Membuktikan secara matematis batas keadilan sistem voting preferensi publik."
    },
    "Collective Action": {
        category: "politik",
        description: "Russell Hardin menganalisis dilema tindakan kolektif dan fenomena free riding. Mengapa individu rasional sering gagal bekerja sama untuk menghasilkan kebaikan bersama."
    },
    "Voting, Interest Groups, and Parties": {
        category: "politik",
        description: "Kajian klasik mengenai dinamika perilaku pemilih, peran lobi kelompok kepentingan, dan polarisasi partai politik dalam menentukan arah demokrasi perwakilan."
    },
    "Odyssey": {
        category: "sastra",
        description: "Epos abadi karya Homer tentang kepulangan Odysseus ke Ithaka setelah Perang Troya. Penyelidikan mendalam tentang ketahanan batin, tipu muslihat, nostalgia, dan harga dari bertahan hidup."
    },
    "Iliad": {
        category: "sastra",
        description: "Kisah kemarahan Akhilles di medan laga Perang Troya. Homer membedah tragedi kehormatan perang, kepahlawanan fana, kepedihan keluarga, dan ego manusia di hadapan takdir."
    },
    "Mitologi Yunani": {
        category: "sastra",
        description: "Kompilasi naratif kisah dewa-dewi Olympus, pahlawan legendaris, dan monster mitologi Yunani kuno yang disajikan dengan penuturan sastra klasik memikat."
    },
    "The Aeneid": {
        category: "sastra",
        description: "Mahakarya Virgil yang mengisahkan pelarian Aeneas dari abu Troya menuju daratan Italia untuk mendirikan peradaban Romawi, sarat pertentangan takdir kolektif dan hasrat pribadi."
    },
    "Kitab Jihad (The Book of Jihad)": {
        category: "hukum",
        description: "Karya monumentalis Imam Ath-Thabari yang mendokumentasikan komparasi fikih dan hukum perang klasik lintas mazhab, mencerminkan perdebatan etika dan pembatasan kekerasan."
    },
    "Tafsir & Tarikh Ath-Thabari": {
        category: "filsafat",
        description: "Magnum opus sejarah dan penafsiran klasik Islam yang merekam transmisi riwayat sejarah dunia kuno dan metodologi kritik sanad yang ketat."
    },
    "The Greeks and the Irrational": {
        category: "filsafat",
        description: "Karya sarjana klasik E.R. Dodds yang membantah anggapan bahwa peradaban Yunani kuno sepenuhnya rasional. Membedah peran mimpi, trans, orakel, dan alam bawah sadar Yunani."
    },
    "Berserk": {
        category: "sastra",
        description: "Manga fantasi gelap karya Kentaro Miura. Membedah perjuangan eksistensial Guts melawan takdir, trauma pengkhianatan, dan batas kemanusiaan di hadapan kejahatan kosmik."
    },
    "Life of Pi": {
        category: "sastra",
        description: "Novel filosofis Yann Martel tentang seorang pemuda yang terombang-ambing di sekoci Samudra Pasifik bersama seekor harimau Bengal. Menjelajahi batas fakta ilmiah dan iman naratif."
    },
    "Jason and the Argonauts": {
        category: "sastra",
        description: "Epos petualangan Yunani kuno pencarian Bulu Domba Emas di Colchis, memuat intrik sihir Medea dan dilema moral kepahlawanan."
    },
    "A Guidebook to Learning": {
        category: "filsafat",
        description: "Filsuf Mortimer J. Adler menyusun peta navigasi ilmu pengetahuan dan kurikulum belajar mandiri sepanjang hayat (lifelong learning) di era kebanjiran informasi."
    },
    "Makanya Mikir": {
        category: "filsafat",
        description: "Buku Cania Citta yang mengajak generasi muda melatih berpikir kritis, membedah sesat pikir (fallacy), dan membangun argumen berbasis logika yang sehat di ruang publik."
    },
    "Tombstones: A Lawyer's Tales from the Takeover Decades": {
        category: "hukum",
        description: "Catatan langsung meja perundingan merger dan akuisisi Wall Street era 1980-an oleh pengacara senior Wachtell Lipton, mengungkap evolusi taktik hukum korporasi modern."
    },
    "Bloodsport: When Ruthless Dealmakers, Shrewd Ideologues, and Brawling Lawyers Toppled the Corporate Establishment": {
        category: "hukum",
        description: "Sejarah investigatif bagaimana sekelompok pengacara luar dan bankir investasi mendobrak lembaga bisnis mapan Amerika dan mengubah tata kelola modal dunia."
    },
    "M&A Titans: The Pioneers Who Shaped Wall Street's Mergers and Acquisitions Industry": {
        category: "hukum",
        description: "Profil para maestro di balik transaksi raksasa Wall Street yang melahirkan inovasi finansial seperti poison pill, junk bond, dan kesepakatan miliaran dolar."
    },
    "Managing the Professional Service Firm": {
        category: "hukum",
        description: "Kitab manajemen David Maister tentang cara mengelola firma profesional (kantor hukum, konsultan) dengan menyeimbangkan kepuasan klien dan pembinaan talenta terbaik."
    },
    "First Among Equals: How to Manage a Group of Professionals": {
        category: "hukum",
        description: "Strategi kepemimpinan praktis untuk memimpin para profesional berpengalaman melalui pembinaan kolegialitas, coaching personal, dan penetapan visi bersama."
    },
    "Art's Principles: 50 Years of Hard-Learned Lessons in Building a World-Class Professional Services Firm": {
        category: "hukum",
        description: "Kisah pendiri Gensler membangun biro arsitektur terbesar dunia, memuat pelajaran tentang budaya kolaborasi satu tim dan suksesi kepemimpinan."
    },
    "Growth Is Dead: Now What?": {
        category: "hukum",
        description: "Bruce MacEwen menganalisis tantangan struktural pasca-krisis global yang memaksa kantor hukum merombak model bisnis tradisional di tengah melambatnya ekonomi."
    },
    "A New Taxonomy: The Seven Law Firm Business Models": {
        category: "hukum",
        description: "Klasifikasi tajam mengenai 7 model bisnis firma hukum masa depan, mulai dari boutique elit spesialis hingga penyedia jasa korporat terdisrupsi teknologi."
    },
    "Tomorrowland: Scenarios for Law Firms Beyond the Horizon": {
        category: "hukum",
        description: "Skenario futuristik mengenai masa depan profesi hukum global, dampak kecerdasan buatan, dan disrupsi lisensi eksklusif pengacara."
    },
    "Poor Economics: A Radical Rethinking of the Way to Fight Global Poverty": {
        category: "politik",
        description: "Dua peraih Nobel Ekonomi membongkar mitos bantuan kemiskinan dengan eksperimen acak (RCT), menjelaskan cara orang miskin membuat keputusan rasional sehari-hari."
    },
    "Gambling on Development: Why Some Countries Win and Others Lose": {
        category: "politik",
        description: "Stefan Dercon mengungkap penentu utama negara berkembang maju: bukan sekadar resep teknis donor, melainkan komitmen konsensus elite (elite bargain) untuk pertumbuhan."
    },
    "How China Escaped the Poverty Trap": {
        category: "politik",
        description: "Yuen Yuen Ang menjelaskan keberhasilan Tiongkok keluar dari kemiskinan melalui directed improvisation memanfaatkan institusi lokal yang ada untuk memacu pasar."
    },
    "The Power of Creative Destruction: Economic Upheavals and the Wealth of Nations": {
        category: "politik",
        description: "Pengembangan teori Schumpeter tentang inovasi destruktif, memacu pertumbuhan ekonomi seraya menuntut jaring pengaman sosial dan regulasi persaingan sehat."
    },
    "Government versus Markets: The Changing Economic Role of the State": {
        category: "politik",
        description: "Analisis historis tentang pasang surut peran negara dalam perekonomian abad ke-20 hingga kini, dari negara penjaga malam hingga regulator modern."
    },
    "In the Service of the Republic: The Art and Science of Economic Policy": {
        category: "politik",
        description: "Panduan penyusunan kebijakan ekonomi publik yang realistis bagi negara berkembang, menekankan pentingnya kapasitas negara dan perlindungan kebebasan warga."
    },
    "The Entrepreneurial State: Debunking Public vs. Private Sector Myths": {
        category: "politik",
        description: "Mariana Mazzucato mematahkan anggapan bahwa negara hanyalah birokrasi lamban, membuktikan inovasi transformatif (Internet, GPS) lahir dari investasi riset publik."
    },
    "Power and Progress: Our Thousand-Year Struggle Over Technology and Prosperity": {
        category: "politik",
        description: "Daron Acemoglu dan Simon Johnson menelusuri sejarah seribu tahun inovasi teknologi, menegaskan kemajuan tidak otomatis menyejahterakan semua orang tanpa regulasi sosial."
    },
    "Shared Prosperity in a Fractured World": {
        category: "politik",
        description: "Laporan strategis mengenai tantangan ketimpangan global, fragmentasi geopolitik, dan strategi menciptakan kemakmuran bersama yang inklusif."
    },
    "Pengalaman Pembangunan Indonesia": {
        category: "politik",
        description: "Catatan tangan pertama Begawan Ekonomi Widjojo Nitisastro tentang arsitektur ekonomi pembangunan Indonesia, stabilisasi makroekonomi, dan utang luar negeri Orde Baru."
    },
    "Kesan Para Sahabat tentang Widjojo Nitisastro": {
        category: "politik",
        description: "Kumpulan testimoni kolegial mengenai kepemimpinan tenang, integritas pribadi, dan dedikasi teknokratis Widjojo Nitisastro dalam kebijakan nasional."
    },
    "Berenang di Segara: Kuntoro Mangkusubroto dalam Tuturan Sahabat": {
        category: "politik",
        description: "Kisah dedikasi Kuntoro Mangkusubroto dalam memimpin reformasi BUMN, penanganan bencana Tsunami Aceh-Nias (BRR), dan penegakan akuntabilitas di UKP4."
    },
    "White Shoes: How a New Breed of Wall Street Lawyers Changed Big Business and the American Economy": {
        category: "hukum",
        description: "Sejarah pembentukan firma hukum elite White Shoe New York yang meletakkan dasar bagi korporasi modern, perbankan investasi, dan pengaruh hukum di panggung bisnis dunia."
    },
    "Skadden: Power, Money, and the Rise of a Legal Empire": {
        category: "hukum",
        description: "Investigasi jurnalis Lincoln Caplan tentang kebangkitan firma hukum Skadden Arps dari kantor kecil menjadi imperium legal global bernilai miliaran dolar."
    },
    "Turks and Brahmins: Upheaval at Milbank, Tweed": {
        category: "hukum",
        description: "Kisah intrik dan transformasi kultural salah satu firma hukum tertua Wall Street saat generasi muda mendobrak tradisi aristokrat demi bersaing di era modern."
    },
    "A Law Unto Itself: The Untold Story of the Law Firm Sullivan & Cromwell": {
        category: "hukum",
        description: "Kisah tersembunyi firma hukum Sullivan & Cromwell yang berperan penting di balik diplomasi internasional, transaksi raksasa, dan kebijakan luar negeri Amerika Serikat."
    },
    "The Anointed": {
        category: "hukum",
        description: "Studi mendalam mengenai jaringan alumni dan dinamika eksklusif kaum elite Wall Street yang menguasai sentra pengambilan keputusan hukum dan ekonomi global."
    },
    "The Skadden Story": {
        category: "hukum",
        description: "Kisah pendirian dan ekspansi kultural Skadden Arps dalam merajai ranah merger, akuisisi, dan litigasi korporasi berisiko tinggi."
    },
    "The Republic": {
        category: "filsafat",
        description: "Karya dialog filosofis teragung Plato yang menyelidiki hakikat keadilan, bentuk negara ideal, alegori gua, dan konsep raja filsuf (philosopher-king)."
    }
};

export function buildBooksCatalog() {
    const epMap = {};
    FALLBACK_EPISODES.forEach((ep, idx) => {
        const videoId = ep.link.split('v=')[1] || ep.link.split('/').pop();
        const match = ep.title.match(/Ep\.?\s*(\d+)/i);
        const epNum = match ? parseInt(match[1], 10) : (50 - idx);
        epMap[videoId] = {
            id: videoId,
            epNum,
            title: ep.title,
            link: ep.link,
            thumbnail: ep.thumbnail,
            guest: episodeData[videoId] && episodeData[videoId].guest ? episodeData[videoId].guest.name : null
        };
    });

    const books = [];
    let counter = 1;

    for (const [epId, epData] of Object.entries(episodeData)) {
        if (!epData.books) continue;

        epData.books.forEach(b => {
            const cleanTitle = b.title.replace(/^Odyssey karya Homer.*$/, 'Odyssey')
                .replace(/^Kitab Jihad.*$/, 'Kitab Jihad (The Book of Jihad)')
                .replace(/^Tafsir Ath-Thabari.*$/, 'Tafsir & Tarikh Ath-Thabari')
                .replace(/^The Greeks and the Irrational.*$/, 'The Greeks and the Irrational')
                .replace(/^Berserk.*$/, 'Berserk')
                .replace(/^Life of Pi.*$/, 'Life of Pi')
                .replace(/^Jason and the Argonauts.*$/, 'Jason and the Argonauts')
                .trim();

            let author = b.author;
            if (!author || author.includes('koleksi') || author.includes('perbandingan') || author.includes('sebagai') || author.includes('mitologi')) {
                if (cleanTitle.includes('Ath-Thabari') || cleanTitle.includes('Jihad')) author = 'Imam Ath-Thabari';
                else if (cleanTitle === 'Odyssey' || cleanTitle === 'Iliad') author = 'Homer';
                else if (cleanTitle === 'The Greeks and the Irrational') author = 'E.R. Dodds';
                else if (cleanTitle === 'Berserk') author = 'Kentaro Miura';
                else if (cleanTitle === 'Life of Pi') author = 'Yann Martel';
                else if (cleanTitle === 'Jason and the Argonauts') author = 'Mitologi Yunani';
                else if (cleanTitle.includes('Widjojo Nitisastro')) author = 'Widjojo Nitisastro dkk.';
                else if (cleanTitle.includes('Kuntoro Mangkusubroto')) author = 'Tuturan Sahabat';
                else if (cleanTitle.includes('Skadden') || cleanTitle.includes('Anointed')) author = 'Wall Street Legal Archive';
                else if (cleanTitle === 'The Republic') author = 'Plato';
                else author = 'The Reading Chamber Archive';
            }

            const epInfo = epMap[epId] || {
                id: epId,
                epNum: 50,
                title: 'Episode ' + epId,
                link: 'https://www.youtube.com/watch?v=' + epId,
                thumbnail: 'https://i.ytimg.com/vi/' + epId + '/hq720.jpg',
                guest: epData.guest ? epData.guest.name : null
            };

            const details = BOOK_DESCRIPTIONS[cleanTitle] || {
                category: 'filsafat',
                description: 'Buku penting yang dibedah dalam percakapan The Reading Chamber, mengupas perspektif mendalam mengenai gagasan, literatur, dan konteks sosialnya.'
            };

            const normKey = cleanTitle.toLowerCase();
            const existing = books.find(item => item.title.toLowerCase() === normKey);

            if (existing) {
                if (!existing.episodes.some(e => e.id === epInfo.id)) {
                    existing.episodes.push(epInfo);
                }
            } else {
                books.push({
                    id: 'book-' + counter++,
                    title: cleanTitle,
                    author: author,
                    coverColor: b.coverColor || '#121211',
                    coverImage: b.coverImage || 'assets/books/odyssey.jpg',
                    category: details.category || 'filsafat',
                    description: details.description,
                    episodes: [epInfo]
                });
            }
        });
    }

    return books;
}

export const BOOKS_DATABASE = buildBooksCatalog();
