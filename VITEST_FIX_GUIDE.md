# Perbaikan Error Vitest (undici/jsdom conflict)

## Masalah
Error: `TypeError: webidl.util.markAsUncloneable is not a function`
Konflik versi antara `undici` dan `jsdom` pada Node.js 20.x di GitHub Actions.

## Solusi yang Diterapkan

### 1. Perbaikan via package.json (overrides)
**File:** `package.json`

Menambahkan `overrides` untuk memaksa versi undici yang kompatibel:

```json
{
  "overrides": {
    "undici": "^5.28.4"
  }
}
```

### 2. Perbaikan via vitest.config.js (pool configuration)
**File:** `vitest.config.js`

Menambahkan konfigurasi pool untuk menghindari worker issues:

```javascript
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
    testTimeout: 10000,
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
});
```

## Langkah-Langkah Konkret

### 1. Di Lokal (sebelum commit)

```bash
# Masuk ke direktori proyek
cd forum-discussion-app

# Hapus node_modules dan package-lock.json
rm -rf node_modules
rm package-lock.json

# Install ulang dengan overrides yang baru
npm install --legacy-peer-deps

# Test lokal untuk memastikan perbaikan berhasil
npm test:run
```

### 2. Commit dan Push

```bash
# Add semua perubahan
git add package.json package-lock.json vitest.config.js

# Commit dengan pesan yang jelas
git commit -m "Fix vitest undici/jsdom conflict for GitHub Actions CI"

# Push ke GitHub
git push origin main
```

### 3. Verifikasi di GitHub Actions

1. Buka repository GitHub
2. Tab **Actions**
3. Lihat workflow yang sedang berjalan
4. Pastikan test vitest berhasil tanpa error `webidl.util.markAsUncloneable`

## Alternatif Solusi (jika solusi di atas masih gagal)

### Opsi 1: Downgrade jsdom
Jika masih error, coba downgrade jsdom ke versi yang lebih stabil:

```bash
npm install --save-dev jsdom@29.3.1 --legacy-peer-deps
```

Kemudian update package.json:
```json
"devDependencies": {
  "jsdom": "29.3.1",
  // ... dependencies lainnya
}
```

### Opsi 2: Use happy-dom sebagai alternatif jsdom
Happy-dom lebih ringan dan jarang mengalami konflik versi:

```bash
npm install --save-dev happy-dom --legacy-peer-deps
```

Update vitest.config.js:
```javascript
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',  // Ganti dari jsdom
    setupFiles: './src/test/setup.js',
    css: true,
    testTimeout: 10000,
  },
});
```

### Opsi 3: Disable worker pool sepenuhnya
Jika pool configuration masih menyebabkan masalah:

```javascript
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
    testTimeout: 10000,
    pool: 'threads',  // Atau hapus bagian pool sama sekali
  },
});
```

## Penjelasan Teknis

### Mengapa overrides diperlukan?
- Node.js 20.x membawa built-in undici
- jsdom versi terbaru menggunakan undici internal yang berbeda
- Overrides memaksa npm menggunakan versi undici yang kompatibel dengan jsdom

### Mengapa singleFork?
- Worker pools di Vitest dapat menyebabkan konflik dengan jsdom
- `singleFork: true` menjalankan semua test dalam satu proses
- Mengurangi kompleksitas dan potensi konflik versi

## Troubleshooting Tambahan

### Jika masih error setelah overrides:
1. Cek versi Node.js di GitHub Actions (pastikan 20.x)
2. Clear cache npm: `npm cache clean --force`
3. Install ulang dari awal: `rm -rf node_modules package-lock.json && npm install --legacy-peer-deps`

### Jika error berbeda muncul:
1. Catat error message yang baru
2. Coba solusi alternatif (downgrade jsdom atau happy-dom)
3. Periksa apakah ada dependency lain yang menyebabkan konflik

## Status Perbaikan

✅ **package.json** - Menambahkan overrides untuk undici
✅ **vitest.config.js** - Menambahkan pool configuration
📋 **Perlu:** Update package-lock.json dan test lokal
