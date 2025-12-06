# Quick Setup - Alpha Vantage Stock Tracker

## 🚀 Langkah Setup Cepat

### 1. Dapatkan API Key (GRATIS)

Kunjungi: https://www.alphavantage.co/support/#api-key

- Isi form sederhana (nama & email)
- API key langsung dikirim ke email
- **Free tier: 25 requests/day**

### 2. Update File .env

Buka file `.env` dan pastikan ada:

```env
ALPHA_VANTAGE_API_KEY=your_api_key_here
ALPHA_VANTAGE_API_URL=https://www.alphavantage.co/query
```

Ganti `your_api_key_here` dengan API key yang Anda dapat dari email.

**Untuk Testing:** Gunakan `demo` sebagai API key (terbatas untuk symbol tertentu)

### 3. Jalankan Aplikasi

```bash
npm run dev
```

### 4. Test di Browser

1. Buka http://localhost:3333
2. Login dengan akun Anda
3. Scroll ke section **"📈 Stock Market Tracker"**
4. Coba fitur:
   - Klik chip "🍎 Apple" untuk quick quote
   - Atau search "Microsoft" di search box
   - Atau input "GOOGL" di Quick Quote

## 🎯 Fitur yang Tersedia

✅ **Stock Search** - Cari saham berdasarkan nama/symbol  
✅ **Quick Quote** - Input symbol langsung  
✅ **Popular Stocks** - Quick access ke saham populer  
✅ **Real-time Price** - Harga, change, volume, dll  
✅ **Beautiful UI** - Gradient cards dengan animasi  

## 📊 Popular Symbols untuk Testing

- **AAPL** - Apple
- **MSFT** - Microsoft  
- **GOOGL** - Google
- **AMZN** - Amazon
- **TSLA** - Tesla
- **META** - Meta (Facebook)

## ⚠️ Catatan Penting

- Free tier: **25 requests per day**
- Rate limit: **5 requests per minute**
- Jika error "rate limit", tunggu beberapa menit
- Untuk production, pertimbangkan upgrade ke premium plan

## 🔗 Resources

- [Dokumentasi Lengkap](./ALPHA_VANTAGE_API.md)
- [Alpha Vantage Docs](https://www.alphavantage.co/documentation/)

---

**Selamat mencoba! 🚀**
