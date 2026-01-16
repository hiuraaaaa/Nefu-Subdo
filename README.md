# Nefu Subdomain Creator

Platform profesional untuk membuat dan mengelola DNS records subdomain melalui Cloudflare API dengan antarmuka dark mode yang elegan dan minimalis.

## Fitur Utama

- **Dark Mode Elegan**: Desain modern dengan background slate-950 dan gradient effects
- **Multi-Domain Support**: Kelola multiple domain dari satu dashboard
- **Auto-Detection**: Sistem otomatis mendeteksi record type (A untuk IP, CNAME untuk hostname)
- **Cloudflare Integration**: Integrasi langsung dengan Cloudflare API untuk DNS management
- **Maintenance Mode**: Aktifkan/nonaktifkan service melalui environment variable
- **Real-time Feedback**: Toast notifications untuk sukses dan error messages
- **Responsive Design**: Bekerja sempurna di desktop, tablet, dan mobile

## Tech Stack

- **Frontend**: React 19 + TypeScript + Tailwind CSS 4
- **Backend**: Express.js + Node.js
- **API**: Cloudflare DNS API v4
- **Styling**: Tailwind CSS dengan custom utilities untuk dark mode
- **UI Components**: Lucide React icons + Sonner toast notifications

## Quick Start

### Prerequisites

- Node.js 18+ dan npm/pnpm
- Cloudflare account dengan API token
- Zone ID dari domain Anda

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/Nefu-Subdo.git
cd Nefu-Subdo

# Install dependencies
pnpm install

# Setup environment variables
cp .env.local.example .env.local

# Edit .env.local dengan credentials Anda
# CF_API_TOKEN=your_token
# CF_ZONE_ID=your_zone_id
```

### Development

```bash
# Start development server
pnpm dev

# Server akan running di http://localhost:3000
```

### Build & Production

```bash
# Build untuk production
pnpm build

# Start production server
pnpm start
```

## Konfigurasi

### Environment Variables

```env
# Cloudflare API Configuration
CF_API_TOKEN=your_cloudflare_api_token
CF_ZONE_ID=your_zone_id_for_primary_domain

# Multi-domain support (optional)
CF_ZONE_ID_1=zone_id_domain_1
CF_ZONE_ID_2=zone_id_domain_2

# Maintenance Mode
MAINTENANCE_MODE=false

# Application
NODE_ENV=development
PORT=3000
```

### Multi-Domain Setup

Edit `server/config.ts` untuk menambah/menghapus domain:

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

### Maintenance Mode

Untuk mengaktifkan maintenance mode tanpa edit kode:

```bash
# Di Vercel Environment Variables atau .env.local
MAINTENANCE_MODE=true
```

Ketika aktif:
- Halaman akan menampilkan "Under Maintenance"
- Semua API calls akan diblokir dengan status 503
- User tidak bisa membuat DNS records

## API Endpoints

### GET /api/domains

Mendapatkan list domain yang tersedia.

**Response:**
```json
{
  "success": true,
  "domains": [
    {
      "name": "nepuh.web.id",
      "description": "Primary domain"
    }
  ]
}
```

### POST /api/create-dns

Membuat DNS record baru.

**Request Body:**
```json
{
  "domain": "nepuh.web.id",
  "subdomain": "api",
  "recordType": "A",
  "target": "192.168.1.1"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "record": {
      "id": "record_id",
      "type": "A",
      "name": "api.nepuh.web.id",
      "content": "192.168.1.1",
      "ttl": 1,
      "proxied": false
    },
    "message": "DNS record created successfully: api.nepuh.web.id"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Error message",
  "details": {}
}
```

## Record Types

| Type | Usage | Example |
|------|-------|---------|
| **A** | IPv4 address | `192.168.1.1` |
| **CNAME** | Domain alias | `example.com` |
| **TXT** | Text record | `v=spf1 include:...` |
| **MX** | Mail exchange | `mail.example.com` |
| **NS** | Nameserver | `ns1.example.com` |

## Auto-Detection

Sistem otomatis mendeteksi record type:
- **Input IPv4** → Record type A
- **Input hostname** → Record type CNAME

Contoh:
- `192.168.1.1` → Detected as A record
- `example.com` → Detected as CNAME record

## Deployment

### Deploy ke Vercel

```bash
# Push ke GitHub
git push origin main

# Di Vercel Dashboard:
# 1. Import repository
# 2. Add environment variables
# 3. Deploy

# Atau gunakan Vercel CLI:
vercel deploy
```

Lihat [DEPLOYMENT.md](./DEPLOYMENT.md) untuk panduan lengkap.

## File Structure

```
Nefu-Subdo/
├── client/                    # Frontend React app
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx      # Main page
│   │   │   └── Maintenance.tsx # Maintenance page
│   │   ├── App.tsx           # App routing
│   │   └── index.css         # Global styles
│   └── index.html
├── server/                    # Backend Express app
│   ├── config.ts             # Configuration & domain list
│   ├── dns-utils.ts          # DNS utilities & validation
│   ├── routes/
│   │   └── dns.ts            # DNS API routes
│   └── _core/
│       └── index.ts          # Server entry point
├── .env.local.example        # Environment variables template
├── DEPLOYMENT.md             # Deployment guide
└── README.md                 # This file
```

## Development Guide

### Adding New Domain

1. Get Zone ID dari Cloudflare Dashboard
2. Edit `server/config.ts`:
   ```typescript
   {
     name: "yourdomain.com",
     zoneId: process.env.CF_ZONE_ID_NEW || "",
     description: "Your domain description",
   }
   ```
3. Add environment variable: `CF_ZONE_ID_NEW=your_zone_id`
4. Restart server atau redeploy

### Customizing UI

- Edit `client/src/index.css` untuk mengubah colors dan styling
- Edit `client/src/pages/Home.tsx` untuk mengubah layout
- Gunakan Tailwind CSS classes untuk styling

### Adding New Record Types

1. Update `SUPPORTED_RECORD_TYPES` di `server/config.ts`
2. Update UI di `client/src/pages/Home.tsx`
3. Validation otomatis akan bekerja

## Troubleshooting

### "Cloudflare API token not configured"
- Pastikan `CF_API_TOKEN` sudah diset di environment variables
- Verifikasi token masih valid di Cloudflare

### "Domain not found"
- Pastikan domain ada di `LIST_DOMAIN` di `server/config.ts`
- Verifikasi Zone ID sudah benar

### "Invalid subdomain name"
- Subdomain hanya boleh: huruf, angka, hyphen
- Tidak boleh dimulai/diakhiri dengan hyphen

### "Service is under maintenance"
- Maintenance mode sedang aktif
- Check `MAINTENANCE_MODE` environment variable

## Performance

- TTL diset ke 1 (automatic) untuk DNS propagation yang cepat
- DNS records tidak di-proxy melalui Cloudflare (DNS only)
- Frontend loading state untuk better UX
- Optimized bundle size dengan tree-shaking

## Security

- API token disimpan di environment variables (tidak di-commit)
- Input validation untuk semua fields
- CORS protection melalui Express middleware
- HTTPS enforced di production (Vercel)

## License

MIT License - feel free to use for personal or commercial projects

## Support

- **Issues**: Report bugs di GitHub Issues
- **Discussions**: Tanya pertanyaan di GitHub Discussions
- **Email**: your-email@example.com

## Changelog

### v1.0.0 (Initial Release)
- Dark mode UI dengan Tailwind CSS
- Multi-domain support
- Auto-detection untuk record type
- Cloudflare API integration
- Maintenance mode
- Toast notifications
- Responsive design

## Credits

Built with ❤️ using React, Express, Tailwind CSS, dan Cloudflare API.

---

**Ready to deploy?** See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.
