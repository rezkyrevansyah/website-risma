import { NavItem, EventItem, ArticleItem, GalleryItem, DonationInfo } from "@/types";

export const navItems: NavItem[] = [
  { label: "Beranda", href: "/" },
  { label: "Agenda", href: "/#agenda" },
  { label: "Artikel", href: "/#artikel" },
  { label: "Galeri", href: "/#galeri" },
  { label: "Tentang", href: "/tentang" },
];

export const dummyEvents: EventItem[] = [
  {
    id: "1",
    title: "Kajian Sabtu Sore",
    date: "2025-01-25",
    time: "16:00 WIB",
    location: "Masjid Al Arqam",
    category: "kajian",
    description: `
      <p>Kajian rutin ba'da maghrib membahas kitab <strong>Riyadhus Shalihin</strong> bersama <em>Ustadz Hanan Attaki</em>.</p>
      <p>Mari bergabung bersama kami dalam kegiatan positif ini. Ajak keluarga, sahabat, dan rekan-rekan untuk memakmurkan masjid dan mempererat tali silaturahmi.</p>
      <h3>Agenda acara:</h3>
      <ul>
        <li>Pembukaan dan Tilawah</li>
        <li>Materi Inti</li>
        <li>Sesi Tanya Jawab (Diskusi Terbuka)</li>
        <li>Sholat Isya Berjamaah</li>
      </ul>
      <p>Jangan lupa membawa alat tulis untuk mencatat ilmu yang disampaikan.</p>
    `,
  },
  {
    id: "2",
    title: "Futsal Cup 2026",
    date: "2025-02-02",
    time: "08:00 WIB",
    location: "GOR Sejahtera",
    category: "olahraga",
    description: `
      <p>Match persahabatan mingguan untuk mempererat ukhuwah antar pemuda remas.</p>
      <p><strong>Sportivitas</strong> dan kesehatan fisik adalah kunci utama. Muslim yang kuat lebih dicintai Allah daripada muslim yang lemah.</p>
      <h3>Persyaratan:</h3>
      <ul>
        <li>Membawa sepatu futsal (bukan sepatu bola).</li>
        <li>Membayar iuran lapangan Rp 20.000/orang.</li>
        <li>Hadir tepat waktu di GOR.</li>
      </ul>
    `,
  },
  {
    id: "3",
    title: "Charity Run",
    date: "2025-02-15",
    time: "06:00 WIB",
    location: "Alun-alun Kota",
    category: "sosial",
    description: `
      <p>Gerak jalan santai sambil berbagi sembako dan cek kesehatan gratis untuk masyarakat sekitar.</p>
      <p>Wujud nyata bakti sosial <strong>Masjid Jami' Al Arqam</strong> untuk lingkungan.</p>
      <h3>Rute Perjalanan:</h3>
      <ol>
        <li>Start: Halaman Masjid Al Arqam</li>
        <li>Checkpoint 1: Posyandu Melati</li>
        <li>Checkpoint 2: Pasar Lama</li>
        <li>Finish: Alun-alun Kota</li>
      </ol>
    `,
  },
  {
    id: "4",
    title: "Mabit Youth Camp",
    date: "2025-03-01",
    time: "17:00 WIB",
    location: "Bumi Perkemahan",
    category: "lainnya",
    description: `
      <p>Malam bina iman dan taqwa (Mabit) di alam terbuka. Kegiatan ini bertujuan untuk menguatkan ukhuwah dan mental spiritual anggota Risma.</p>
      <h3>Perlengkapan Wajib:</h3>
      <ul>
        <li>Alat Sholat & Al-Qur'an</li>
        <li>Pakaian ganti secukupnya</li>
        <li>Obat-obatan pribadi</li>
        <li>Jaket tebal</li>
      </ul>
    `,
  },
];

export const articles: ArticleItem[] = [
  {
    id: "1",
    title: "Membangun Generasi Rabbani di Era Digital",
    excerpt: "Tantangan dan peluang dakwah bagi pemuda muslim di tengah arus informasi global.",
    content: `
      <p>Di era digital yang serba cepat ini, pemuda muslim dihadapkan pada arus informasi yang begitu deras. Generasi Rabbani bukan hanya tentang menghafal Al-Qur'an, tetapi juga bagaimana mengimplementasikan nilai-nilai Qur'ani dalam setiap interaksi digital kita.</p>
      <h3>Tantangan Utama</h3>
      <p>Fitnah syubhat dan syahwat menjadi ujian terberat. Algoritma media sosial seringkali menjebak kita dalam ruang gema yang sempit. Oleh karena itu, literasi digital yang dipadukan dengan adab islami menjadi perisai utama.</p>
      <h3>Langkah Konkret</h3>
      <ul>
        <li>Selektif dalam memilih akun yang diikuti (follow).</li>
        <li>Tabayyun sebelum menyebarkan informasi.</li>
        <li>Menggunakan teknologi untuk dakwah kreatif.</li>
      </ul>
      <blockquote>"Sampaikanlah dariku walau hanya satu ayat." (HR. Bukhari)</blockquote>
      <p>Mari kita jadikan gawai kita sebagai ladang pahala, bukan sumber dosa jariyah.</p>
    `,
    category: "Dakwah",
    date: "12 Jan 2026",
    readingTime: "5 menit baca",
    imageUrl: "/images/article-1.jpg",
    author: {
      name: "Ustadz Hanan",
      role: "Pembina Risma",
      avatarUrl: "/avatars/ustadz-hanan.jpg"
    }
  },
  {
    id: "2",
    title: "Tips Manajemen Waktu ala Mahasiswa Muslim",
    excerpt: "Bagaimana menyeimbangkan kuliah, organisasi, dan ibadah tanpa merasa burnout.",
    content: `
      <p>Menjadi mahasiswa aktivis dakwah memang menantang. Kuliah padat, amanah organisasi menumpuk, belum lagi target hafalan. Bagaimana agar semuanya seimbang?</p>
      <h3>1. Prioritas Waktu Sholat</h3>
      <p>Jadikan waktu sholat sebagai jangkar kehidupan. Atur jadwal kuliah dan rapat mengelilingi waktu sholat, bukan sebaliknya.</p>
      <h3>2. The Power of 'Ba'da'</h3>
      <p>Manfaatkan waktu ba'da shubuh untuk menghafal atau membaca buku, dan waktu ba'da isya untuk istirahat agar bisa bangun qiyamul lail.</p>
      <h3>3. Jangan Lupa Healing Syar'i</h3>
      <p>Olahraga sunnah seperti memanah atau berenang, serta tadabbur alam bisa menjadi sarana recharging energi yang efektif.</p>
    `,
    category: "Lifestyle",
    date: "10 Jan 2026",
    readingTime: "3 menit baca",
    imageUrl: "/images/article-2.jpg",
    author: {
      name: "Fajar Siddiq",
      role: "Ketua Risma",
      avatarUrl: "/avatars/fajar.jpg"
    }
  },
  {
    id: "3",
    title: "Recap: Bakti Sosial Ramadhan 1447H",
    excerpt: "Dokumentasi kegiatan berbagi takjil dan santunan anak yatim minggu lalu.",
    content: `
      <p>Alhamdulillah, kegiatan Bakti Sosial Ramadhan tahun ini berjalan lancar. Berkat donasi dari para jamaah, kita berhasil menyalurkan 500 paket takjil dan santunan untuk 50 anak yatim.</p>
      <p>Kegiatan dimulai pukul 16.00 WIB dengan pembukaan dan tilawah bersama adik-adik panti, dilanjutkan dengan games seru, dan ditutup dengan buka puasa bersama.</p>
      <p>Terima kasih kepada seluruh panitia dan donatur. Semoga menjadi amal jariyah yang tak terputus pahalanya.</p>
    `,
    category: "Laporan",
    date: "05 Jan 2026",
    readingTime: "4 menit baca",
    imageUrl: "/images/article-3.jpg",
    author: {
      name: "Rina Aulia",
      role: "Sekretaris",
      avatarUrl: "/avatars/rina.jpg"
    }
  },
  {
    id: "4",
    title: "Keutamaan Sholat Berjamaah di Masjid",
    excerpt: "Mengapa sholat berjamaah 27 derajat lebih tinggi dan bagaimana menjaga istiqomah.",
    content: `
      <p>Sholat berjamaah adalah syiar Islam yang paling nampak. Rasulullah SAW bersabda bahwa sholat berjamaah lebih utama 27 derajat daripada sholat sendirian.</p>
      <h3>Manfaat Sosial</h3>
      <p>Selain pahala berlipat, sholat berjamaah mempererat ukhuwah islamiyah. Kita bisa saling mengetahui kondisi saudara seiman, saling mendoakan, dan saling membantu.</p>
      <p>Yuk, ramaikan masjid kita di setiap waktu sholat!</p>
    `,
    category: "Ibadah",
    date: "01 Jan 2026",
    readingTime: "6 menit baca",
    imageUrl: "/images/article-4.jpg",
    author: {
      name: "Ahmad Zaky",
      role: "Divisi Dakwah",
      avatarUrl: "/avatars/zaky.jpg"
    }
  }
];

export const galleryItems: GalleryItem[] = [];

export const defaultDonation: DonationInfo = {
  bankName: "Bank Syariah Indonesia",
  accountNumber: "1234567890",
  holderName: "Masjid Jami' Al Arqam",
  goalAmount: 25000000,
  currentAmount: 15000000,
};
