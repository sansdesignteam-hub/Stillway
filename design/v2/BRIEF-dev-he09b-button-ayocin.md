# Brief Developer — HE-09b: tombol pill mengikuti ayocin.com

Keputusan: D-190 di `context/decisions.md` (worktree PM). Revisi HE-09 (`5ed0597`). Referensi pengguna: tombol "Order Now" di https://ayocin.com/ (screenshot `design/v2/references/he09b-ayocin-default.png` dan `he09b-ayocin-hover.png`).

## Pola ayocin (dibaca PM dari CSS mereka)

```css
.btn { border-radius: 2rem; height: 4rem; padding: 1rem 6rem 1rem 2rem; position: relative;
       transition-duration: .8s; transition-timing-function: cubic-bezier(.77,0,.18,1); }
.btn:hover { transition-delay: .2s; }
.btn__icon { position: absolute; inset: 2px; border-radius: inherit; overflow: hidden;
             display: flex; justify-content: flex-end; padding: 1.2rem; }
.btn__icon::before { content: ""; position: absolute; inset: 0; border-radius: 2rem; z-index: -1;
             transform: translateX(100%) translateX(-3.8rem);   /* diam: hanya lingkaran di kanan */
             transition: transform .9s cubic-bezier(.77,0,.18,1); }
.btn:hover .btn__icon::before { transform: none; }               /* hover: isian penuh, tetap inset 2px */
.btn--primary   { background: #2E2521; color: #FCF6EC; }  .btn--primary .btn__icon::before   { background: #FCF6EC; }  .btn--primary .btn__icon { color: #2E2521; }  .btn--primary:hover { color: #2E2521; }
.btn--secondary { background: #FCF6EC; color: #2E2521; }  .btn--secondary .btn__icon::before { background: #2E2521; }  .btn--secondary .btn__icon { color: #FCF6EC; }  .btn--secondary:hover { color: #FCF6EC; }
```

Intinya: lingkaran ikon adalah **isian yang sama** dengan hover; saat hover isian bergeser dari kanan sampai memenuhi pill, tetapi tetap **inset 2 px**, sehingga warna dasar pill tampil sebagai rim tipis di sekelilingnya. Teks berganti warna, panah tetap satu.

## Yang diminta pengguna (pakai warna token Stillway, bukan hex ayocin)

1. **Latar gelap** (navbar Night, Closing, section gelap): diam = pill **terang** (Paper) dengan teks gelap dan lingkaran **gelap** di kanan berisi panah terang. Hover = isian gelap (Ink/hitam token) memenuhi pill dengan rim terang 2 px tetap terlihat; teks jadi terang.
2. **Latar terang** (navbar Paper, CTA Finishes "Choose …"): diam = pill **gelap** dengan teks terang dan lingkaran **terang** di kanan berisi panah gelap. Hover = isian terang memenuhi pill dengan rim gelap 2 px tetap terlihat; teks jadi gelap. (Pengguna menulis "jadi hitam", tetapi screenshot referensinya untuk kasus ini menunjukkan isian terang dengan rim gelap; ikuti screenshot dan pola ayocin. PM akan konfirmasi ke pengguna di review.)
3. Timing: pill .8 s, isian .9 s, `cubic-bezier(.77,0,.18,1)`, delay .2 s saat masuk hover. Reduced motion: tanpa transisi. Tetap satu panah, label tidak pernah tertutup atau samar di tengah animasi (perbaiki catatan HE-09: huruf pertama sempat samar).
4. Berlaku untuk semua tombol pill + panah: navbar CTA "Find your size", CTA Finishes, CTA Closing, juga di mobile (tap/fokus keyboard menampilkan state hover lewat `:focus-visible`).

## Bukti

Urutan frame diam → tengah → hover penuh untuk keempat konteks (navbar Night, navbar Paper, CTA Finishes, CTA Closing), dibandingkan dengan crop ayocin. Zoom ≥3× pada rim 2 px untuk membuktikan rim terlihat. `npm run build` lulus. Commit `fix(web-v2): QA27 HE-09b …`, push ke `origin/Developer` (D-130).
