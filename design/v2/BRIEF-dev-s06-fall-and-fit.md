# Brief Developer — S06 ring jatuh dan masuk ke jari

Acuan D-173, catatan pengguna 26 November 2026. Kerjakan di `web-v2/` pada branch `Developer`, baseline `11d993c`. Perubahan dimulai saat cincin meninggalkan tepi meja dan berakhir saat heading serta body muncul.

## Scene 1 — Kamera mengikuti cincin jatuh

- Saat cincin lepas dari tepi meja, reframing memberi kesan kamera mengikuti cincin. Jadikan cincin fokus frame. Pertahankan arah turun yang terbaca dan beri waktu untuk melihat cincin berputar di udara sebelum tangan terlihat.
- Gunakan bagian objek berputar di [Oryzo](https://oryzo.ai/) sebagai referensi framing dan gerak. Gunakan ring dan gaya Stillway. Hindari putus gerak yang sekarang terjadi ketika ring ikut fade bersama meja lalu muncul kembali.
- Pertahankan satu ring yang terlihat konsisten dari gelinding sampai masuk ke jari. Gunakan kembali stage 3D dan aset yang ada. Biarkan meja keluar dari komposisi sebelum mengganggu adegan tangan.

## Scene 2 — Tangan naik ketika cincin masih jatuh

- Setelah fokus awal pada ring, tangan muncul dari bawah ketika ring masih turun. Gerak keduanya bertemu secara kontinu. Cincin melambat dan menyesuaikan orientasi terhadap telunjuk, lalu melewati ujung jari dan meluncur sampai posisi akhir di pangkalnya.
- Sinkronkan posisi tangan, ring, dan occlusion jari. Cek agar ring terlihat benar-benar mengelilingi jari tanpa menembus kulit, melompat posisi, atau memperlihatkan tepi potong foto tangan.
- Setelah cincin duduk di posisi akhir, tampilkan heading Inggris **“Then, it just fit.”** sesuai kata yang diminta pengguna, dengan body copy S06 yang sudah ada. Selama jatuh dan pemasangan, keduanya masih tersembunyi.
- Gunakan foto tangan A-1, pose/proxy jari, dan still fallback yang sudah ada (D-133). Pertahankan gelinding tegak di meja sebelum titik jatuh, ketentuan satu ring tanpa jejak (D-145), dan sambungan keluar S06→S07 yang mengikuti scroll 1:1 (D-147). Jika aset yang ada menghambat hasil yang meyakinkan, laporkan kebutuhan aset spesifik dan sertakan bukti.

## Referensi pengguna

1. Tampilan staging saat ini: `/Users/zaimmaulana/Library/Application Support/orca/agent-session-attachments/49d7a60c-fedd-45ff-8fa9-413a0fd79add/orca-paste-1795661057018-b43b67c3-2a26-4479-8602-60391174fe19.png`
2. Fokus objek jatuh dan berputar: `/Users/zaimmaulana/Library/Application Support/orca/agent-session-attachments/d24fef99-a306-4237-bb54-275077a0489d/orca-paste-1795661172130-ff1712a9-1894-4216-a83c-4540d51b0c22.png`
3. Tangan muncul dari bawah mendekati objek: `/Users/zaimmaulana/Library/Application Support/orca/agent-session-attachments/ae10dcfc-0f9a-4cd2-af12-4fb3aa1e9212/orca-paste-1795661265491-0b897b36-c646-463a-80c1-672a2e05fad7.png`

## Bukti dan staging

Jalankan `npm run build`. Periksa desktop 1440 × 900 dan mobile 375 × 812, termasuk scroll maju/mundur dan reduced motion/no WebGL. Sertakan rekaman singkat bila bisa atau urutan frame rapat yang mencakup: tepi meja → ring jatuh sendiri → tangan masuk saat ring masih jatuh → ring sejajar dengan telunjuk → ring sudah terpasang → heading dan body muncul → sambungan ke S07. Push ke `origin/Developer` dan laporkan commit serta bukti untuk review PM. Production menunggu instruksi pengguna.

## D-174 — Timing revisi setelah review staging

Pengguna menilai jatuhnya terlalu cepat dan putaran hingga cincin masuk ke jari kurang mulus dan natural. Tambah jarak scroll pada bagian jatuh dan pemasangan agar keduanya lebih terbaca pada kecepatan scroll yang sama. Sambungkan pose dan laju gerak dari lepas meja, putaran di udara, penyesuaian sumbu di ujung telunjuk, hingga duduk di pangkal jari. Putaran mereda progresif saat mendekati jari tanpa perubahan arah atau pose mendadak. Tangan tetap menyambut saat cincin turun, lalu teks muncul setelah terpasang. Bandingkan desktop dan mobile dengan staging sebelumnya pada input scroll setara, idealnya dengan rekaman singkat. Uji scroll mundur, reduced motion dan sambungan S07. Preview melalui branch Developer.
