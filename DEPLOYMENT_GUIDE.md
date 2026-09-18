# Panduan Deployment & Screenshot untuk Submission

## 1. Menonaktifkan Deployment Protection di Vercel

### Langkah-langkah:
1. Login ke [Vercel Dashboard](https://vercel.com/dashboard)
2. Pilih proyek forum-discussion-app Anda
3. Klik tab **Settings**
4. Scroll ke bagian **Git**
5. Cari bagian **Deployment Protection**
6. Matikan opsi **"Require login to view this deployment"**
7. Klik **Save**

### Tujuan:
Dengan menonaktifkan Deployment Protection, URL aplikasi dapat diakses publik tanpa perlu login Vercel, sehingga reviewer Dicoding dapat langsung mengakses aplikasi Anda.

---

## 2. Mengambil Screenshot `2_ci_check_pass.png`

### Langkah-langkah:
1. Pastikan semua file sudah di-push ke GitHub
2. Pastikan workflow CI/CD sudah dikonfigurasi di `.github/workflows/ci.yml`
3. Buat commit baru atau push ke branch yang terhubung dengan GitHub Actions
4. Buka repository GitHub Anda
5. Klik tab **Actions**
6. Pilih workflow yang sedang berjalan (atau yang sudah selesai)
7. Tunggu sampai semua jobs selesai dengan status ✅ **Success** (centang hijau)
8. Ambil screenshot dari halaman Actions yang menunjukkan:
   - Semua jobs berhasil (green checkmarks)
   - Tidak ada error atau failure
   - Status "All checks have passed"

### Contoh tampilan yang diharapkan:
```
✅ Build and Test (4s)
✅ Lint (2s)  
✅ Unit Tests (8s)
✅ E2E Tests (15s)
✅ Deploy to Vercel (10s)

All checks have passed
```

---

## 3. Mengambil Screenshot `3_branch_protection.png`

### Langkah-langkah:
1. Buka repository GitHub Anda
2. Klik tab **Settings**
3. Di sidebar kiri, klik **Branches**
4. Di bagian "Branch protection rules", klik rule untuk branch `main` (atau `master`)
5. Ambil screenshot dari halaman Branch Protection yang menunjukkan:
   - Branch name pattern (main/master)
   - **Require status checks to pass before merging** ✅
   - **Require branches to be up to date before merging** ✅
   - Daftar status checks yang diperlukan
   - Aturan lain yang Anda konfigurasi

### Tampilan pada Pull Request:
Untuk bukti tambahan, Anda juga bisa screenshot dari halaman Pull Request yang menunjukkan:
- Status **"Merging is blocked"**
- Tombol **Merge pull request** tidak aktif (grayed out)
- Status checks yang required namun belum fulfilled

### Cara menampilkan status "Merging is blocked":
1. Buat branch baru dari main: `git checkout -b test-branch`
2. Buat perubahan kecil (misalnya ubah file README)
3. Commit dan push branch tersebut
4. Buat Pull Request dari branch tersebut ke main
5. Jika branch protection aktif, Anda akan melihat:
   - Badge "Merging is blocked"
   - Tombol merge tidak aktif
   - Daftar required checks yang belum passed

---

## 4. Checklist Submission

Sebelum submit, pastikan Anda memiliki:

### File Code:
- [x] `src/test/__tests__/ThreadFilter.test.jsx` - Perbaikan query label
- [x] `src/test/__tests__/threadsReducer.test.js` - Perbaikan state chaining
- [x] `cypress.config.js` - Penambahan timeout configuration
- [x] `cypress/e2e/login.cy.js` - Perbaikan E2E test dengan registration
- [x] `.npmrc` - Konfigurasi legacy-peer-deps

### Screenshot:
- [ ] `1_ci_check_error.png` - CI/CD gagal (opsional, jika diminta)
- [ ] `2_ci_check_pass.png` - CI/CD sukses (wajib)
- [ ] `3_branch_protection.png` - Branch protection settings (wajib)

### Deployment:
- [ ] Aplikasi berhasil deploy ke Vercel
- [ ] URL deployment dapat diakses publik
- [ ] Aplikasi berjalan dengan baik di production

### Testing:
- [ ] Semua unit tests pass locally
- [ ] Semua E2E tests pass locally
- [ ] ESLint pass tanpa error/warning
- [ ] Build production berhasil

---

## 5. Troubleshooting Umum

### Jika CI/CD gagal:
- Pastikan Node.js version yang digunakan di GitHub Actions sesuai dengan lokal
- Cek package.json dan .npmrc sudah ada
- Pastikan semua dependencies sudah terinstall dengan benar

### Jika Vercel deployment gagal:
- Pastikan build command di Vercel settings: `npm run build`
- Pastikan output directory: `dist`
- Cek environment variables jika diperlukan

### Jika E2E tests gagal:
- Pastikan dev server berjalan di port 5173 saat menjalankan Cypress
- Tingkatkan timeout di cypress.config.js jika masih timeout
- Pastikan data-testid sudah ada di semua elemen yang dites

---

## 6. Informasi Penting untuk Reviewer

**URL Vercel Deployment:**
```
[URL deployment Vercel Anda setelah berhasil deploy]
```

**Repository GitHub:**
```
[Link repository GitHub Anda]
```

**Branch yang dilindungi:** main (atau master sesuai konfigurasi Anda)

**CI/CD Workflow:** GitHub Actions dengan build, test, lint, dan deployment
