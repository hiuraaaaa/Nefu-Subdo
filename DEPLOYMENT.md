# Nefu Subdomain Creator - Deployment Guide

Panduan lengkap untuk mendeploy aplikasi Nefu Subdomain Creator ke Vercel.

## Persiapan

### 1. Dapatkan Cloudflare API Token

1. Buka [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Pergi ke **My Profile** → **API Tokens**
3. Klik **Create Token**
4. Gunakan template **Edit zone DNS** atau buat custom token dengan permissions:
   - Zone → DNS → Edit
5. Copy token yang sudah dibuat

### 2. Dapatkan Zone ID Domain

1. Di Cloudflare Dashboard, pilih domain Anda
2. Di sidebar kanan, lihat **Zone ID**
3. Copy Zone ID tersebut

## Setup di Vercel

### 1. Deploy Repository

```bash
# Clone repository
git clone https://github.com/yourusername/Nefu-Subdo.git
cd Nefu-Subdo

# Push ke GitHub (jika belum)
git push origin main
```

### 2. Connect ke Vercel

1. Buka [Vercel Dashboard](https://vercel.com/dashboard)
2. Klik **Add New** → **Project**
3. Import repository GitHub `Nefu-Subdo`
4. Klik **Import**

### 3. Setup Environment Variables

Di halaman **Configure Project**, tambahkan environment variables:

| Variable | Value | Keterangan |
|----------|-------|-----------|
| `CF_API_TOKEN` | `your_cloudflare_api_token` | API token dari Cloudflare |
| `CF_ZONE_ID` | `your_zone_id` | Zone ID domain utama |
| `CF_ZONE_ID_1` | `zone_id_domain_1` | (Opsional) Zone ID domain tambahan |
| `CF_ZONE_ID_2` | `zone_id_domain_2` | (Opsional) Zone ID domain tambahan |
| `MAINTENANCE_MODE` | `false` | Set ke `true` untuk maintenance |

### 4. Deploy

1. Klik **Deploy**
2. Tunggu proses build selesai
3. Aplikasi akan live di URL yang diberikan Vercel

## Konfigurasi Multi-Domain

### Menambah Domain Baru

1. Buka file `server/config.ts` di repository lokal
2. Tambahkan domain baru di array `LIST_DOMAIN`:

```typescript
export const LIST_DOMAIN: DomainConfig[] = [
  {
    name: "nepuh.web.id",
    zoneId: process.env.CF_ZONE_ID_1 || "",
    description: "Primary domain",
  },
  {
    name: "example.com",
    zoneId: process.env.CF_ZONE_ID_2 || "",
    description: "Secondary domain",
  },
];
```

3. Tambahkan environment variable baru di Vercel:
   - Buka **Settings** → **Environment Variables**
   - Tambahkan `CF_ZONE_ID_2` dengan Zone ID domain baru
4. Commit dan push perubahan
5. Vercel akan otomatis redeploy

## Maintenance Mode

### Mengaktifkan Maintenance Mode

1. Buka Vercel Dashboard → **Settings** → **Environment Variables**
2. Ubah `MAINTENANCE_MODE` dari `false` menjadi `true`
3. Klik **Save**
4. Aplikasi akan menampilkan halaman "Under Maintenance"

### Menonaktifkan Maintenance Mode

1. Ubah `MAINTENANCE_MODE` kembali menjadi `false`
2. Klik **Save**
3. Aplikasi kembali normal

## Troubleshooting

### Error: "Cloudflare API token not configured"

**Solusi:**
- Pastikan `CF_API_TOKEN` sudah diset di Vercel Environment Variables
- Verifikasi token masih valid di Cloudflare Dashboard
- Redeploy aplikasi setelah menambah/mengubah token

### Error: "Domain not found or not configured"

**Solusi:**
- Pastikan domain ada di array `LIST_DOMAIN` di `server/config.ts`
- Verifikasi Zone ID sudah benar di environment variables
- Pastikan Zone ID sesuai dengan domain yang dipilih

### Error: "Invalid subdomain name"

**Solusi:**
- Subdomain hanya boleh berisi huruf, angka, dan hyphen
- Tidak boleh dimulai atau diakhiri dengan hyphen
- Contoh valid: `api`, `www`, `mail`, `api-v2`

### Error: "Invalid target (IP or hostname)"

**Solusi:**
- Untuk record A: masukkan IPv4 address yang valid (contoh: `192.168.1.1`)
- Untuk record CNAME: masukkan hostname yang valid (contoh: `example.com`)
- Sistem akan otomatis mendeteksi tipe record

## Monitoring

### Logs

1. Buka Vercel Dashboard → **Deployments**
2. Pilih deployment terbaru
3. Klik **Logs** untuk melihat real-time logs

### Analytics

1. Buka Vercel Dashboard → **Analytics**
2. Lihat traffic dan performance metrics

## Custom Domain

### Menambah Custom Domain

1. Buka Vercel Dashboard → **Settings** → **Domains**
2. Klik **Add**
3. Masukkan domain custom Anda
4. Follow instruksi DNS configuration
5. Tunggu propagasi DNS (biasanya 24 jam)

## Backup & Recovery

### Backup Configuration

1. Simpan file `.env.local` di tempat aman
2. Simpan list Zone ID Anda
3. Simpan Cloudflare API token di password manager

### Recovery

Jika ada masalah:
1. Buka Vercel Dashboard → **Deployments**
2. Pilih deployment sebelumnya yang stabil
3. Klik **Redeploy**

## Security Best Practices

1. **Jangan share API token** - Simpan di Vercel Environment Variables saja
2. **Rotate token secara berkala** - Update token di Vercel setiap 3-6 bulan
3. **Monitor DNS records** - Cek DNS records di Cloudflare Dashboard secara berkala
4. **Use HTTPS** - Vercel otomatis menyediakan SSL certificate
5. **Enable 2FA** - Aktifkan 2-factor authentication di Cloudflare dan Vercel

## Support

Untuk bantuan lebih lanjut:
- Cloudflare Support: https://support.cloudflare.com
- Vercel Support: https://vercel.com/support
- GitHub Issues: https://github.com/yourusername/Nefu-Subdo/issues
