# Usulan nama dan lingkup Figma

Status: arsip usulan awal. Stillway telah dipilih (D-017); fase ini hanya Home/landing page (D-018). Usulan tiga halaman dan prototype sampai Cart di bawah tidak berlaku untuk fase ini. Nama tetap ilustratif; ketersediaan merek dagang, domain, dan konflik belum diperiksa. Dasar konsep yang disetujui ada di `decisions.md`.

## Kandidat nama

- **Stillway** — kesan tenang dan perjalanan sehari-hari; rekomendasi utama karena menghubungkan keseimbangan dengan kebiasaan, tanpa mengunci brand pada satu metrik.
- **Rythma** — terinspirasi ritme tubuh; lebih dekat dengan cerita produk, namun asosiasi wellness bisa terasa lebih langsung.
- **Inward** — memberi kesan perhatian pada diri; kata yang familiar, sehingga diferensiasi nama perlu diperiksa.

## Usulan halaman dan flow

1. **Home / landing** — pengantar brand dan produk, cerita tidur–aktivitas–istirahat, penjelasan pengalaman ring dan aplikasi, informasi paket utama, CTA ke halaman produk, FAQ ringkas.
2. **Product / shop** — galeri produk, pilihan tiga finish, harga USD 299, isi paket, penjelasan sizing kit, dan CTA tambah ke cart. Detail yang belum disetujui tetap placeholder.
3. **Cart** — produk dan finish terpilih, jumlah, subtotal dan langkah selanjutnya; ongkir/pajak ditandai belum dihitung. Tidak mengasumsikan kebijakan pengiriman atau retur.
4. **Sizing guide** — overlay atau bagian halaman produk yang menjelaskan bahwa sizing kit termasuk; proses dan waktu pengiriman spesifik masih perlu diputuskan.

Alur prototype: Home → Product → pilih finish → buka/tutup sizing guide → tambah ke cart → lihat cart. Berakhir di cart; tidak mensimulasikan pembayaran atau pesanan berhasil.

## Usulan deliverable

- Figma: tiga halaman desktop penuh (Home, Product, Cart), satu sizing guide sebagai overlay/state; versi mobile untuk ketiga halaman dan overlay yang sama.
- Prototype: satu alur utama di desktop dan mobile, dengan tiga pilihan finish, sizing guide, CTA ke product dan cart. State tambahan disiapkan hanya untuk interaksi tersebut; jumlah frame persis mengikuti kebutuhan prototype, bukan jumlah halaman.
- Komponen dasar yang diperlukan untuk konsistensi: navigasi, tombol, pilihan finish, produk/cart dan FAQ; tidak mencakup design system lengkap.
- Hasil pendukung: pilihan visual utama untuk studi kasus serta catatan keputusan dan asal aset. Render produk, foto lifestyle, dan UI aplikasi simulasi harus konsisten dan memiliki sumber atau status pembuatan yang tercatat.
- Kriteria selesai usulan: setiap halaman dan state disetujui pengguna, alur prototype dapat dilalui pada desktop dan mobile, copy dan harga sesuai brief, status fiktif jelas dalam konteks portofolio, serta sumber aset terdokumentasi.
- Website demo, pembayaran, backend, checkout penuh, aplikasi penuh, dan hasil pengujian pengguna belum termasuk. Jadwal dan batas revisi masih terbuka.

## Handoff worktree

Worktree Visual-Director terdeteksi di `/Users/zaimmaulana/orca/workspaces/Smart Ring/Visual-Director`. Worktree Git memiliki working tree dan branch terpisah; file konteks yang belum dibawa ke branch tersebut tidak otomatis tersedia di sana. Setelah lingkup disepakati, tentukan cara menyerahkan konteks: membaca file dari path Strategic-Content, atau memindahkan perubahan melalui mekanisme Git yang sesuai. Belum ada pemindahan atau perubahan di worktree visual.
