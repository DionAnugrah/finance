# Alpha Vantage Stock API Integration

Dokumentasi lengkap untuk menggunakan Alpha Vantage API di aplikasi AdonisJS v6 ini.

## Setup

### 1. Dapatkan API Key
Daftar di [Alpha Vantage](https://www.alphavantage.co/support/#api-key) untuk mendapatkan API key gratis.

**Free Tier:**
- 25 API requests per day
- 5 API requests per minute

### 2. Konfigurasi Environment
Tambahkan API key ke file `.env`:

```env
ALPHA_VANTAGE_API_KEY=your_actual_api_key_here
ALPHA_VANTAGE_API_URL=https://www.alphavantage.co/query
```

**Note:** Untuk testing, Anda bisa menggunakan API key `demo` yang sudah disediakan, tapi hanya bisa untuk symbol tertentu (IBM, AAPL, dll).

### 3. Jalankan Server
```bash
npm run dev
```

## API Endpoints

Semua endpoint memerlukan autentikasi (Bearer token).

### 1. Get Stock Quote

**Endpoint:** `GET /api/stocks/quote`

**Query Parameters:**
- `symbol` (required): Stock symbol (e.g., AAPL, MSFT, GOOGL)

**Contoh Request:**
```bash
curl -X GET "http://localhost:3333/api/stocks/quote?symbol=AAPL" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "symbol": "AAPL",
    "price": 178.50,
    "change": 2.35,
    "changePercent": "1.33%",
    "volume": 52847392,
    "latestTradingDay": "2025-12-06",
    "previousClose": 176.15,
    "open": 177.20,
    "high": 179.80,
    "low": 176.90
  }
}
```

### 2. Search Stock Symbol

**Endpoint:** `GET /api/stocks/search`

**Query Parameters:**
- `keywords` (required): Search keywords (company name or symbol)

**Contoh Request:**
```bash
curl -X GET "http://localhost:3333/api/stocks/search?keywords=Apple" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "type": "Equity",
      "region": "United States",
      "currency": "USD"
    },
    {
      "symbol": "APLE",
      "name": "Apple Hospitality REIT Inc.",
      "type": "Equity",
      "region": "United States",
      "currency": "USD"
    }
  ]
}
```

### 3. Get Multiple Quotes

**Endpoint:** `POST /api/stocks/quotes`

**Body Parameters:**
- `symbols` (required): Array of stock symbols (max 10)

**Contoh Request:**
```bash
curl -X POST "http://localhost:3333/api/stocks/quotes" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "symbols": ["AAPL", "MSFT", "GOOGL"]
  }'
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "symbol": "AAPL",
      "price": 178.50,
      "change": 2.35,
      "changePercent": "1.33%",
      ...
    },
    {
      "symbol": "MSFT",
      "price": 385.20,
      "change": -1.50,
      "changePercent": "-0.39%",
      ...
    }
  ]
}
```

## Frontend Features

### 1. Stock Search
- Cari saham berdasarkan nama perusahaan atau symbol
- Klik hasil pencarian untuk melihat quote

### 2. Quick Quote
- Input symbol langsung untuk mendapatkan quote cepat
- Support untuk semua stock symbols

### 3. Popular Stocks
- Quick access ke saham populer:
  - 🍎 Apple (AAPL)
  - 💻 Microsoft (MSFT)
  - 🔍 Google (GOOGL)
  - 📦 Amazon (AMZN)
  - 🚗 Tesla (TSLA)
  - 📘 Meta (META)

### 4. Stock Quote Display
- Real-time price
- Change amount dan percentage
- Open, High, Low, Previous Close
- Volume
- Latest trading day
- Color-coded untuk positive/negative changes

## Struktur File

```
app/
├── controllers/
│   └── stock_controller.ts           # Controller untuk stock endpoints
├── services/
│   └── alpha_vantage_service.ts      # Service untuk Alpha Vantage API
└── validators/
    └── stock_validator.ts            # Validasi input requests

start/
├── env.ts                            # Environment schema
└── routes.ts                         # Route definitions

public/
├── script.js                         # Frontend JavaScript (stock features)
└── style.css                         # Styling untuk stock tracker

resources/views/
└── home.edge                         # HTML template dengan stock UI
```

## Cara Menggunakan di Frontend

1. **Login** ke aplikasi
2. **Scroll** ke section "📈 Stock Market Tracker"
3. **Pilih salah satu cara:**
   - Cari saham dengan nama/symbol
   - Input symbol di Quick Quote
   - Klik salah satu popular stock chips

## Popular Stock Symbols

### Tech Giants
- **AAPL** - Apple Inc.
- **MSFT** - Microsoft Corporation
- **GOOGL** - Alphabet Inc. (Google)
- **AMZN** - Amazon.com Inc.
- **META** - Meta Platforms Inc. (Facebook)
- **TSLA** - Tesla Inc.

### Other Popular
- **NVDA** - NVIDIA Corporation
- **NFLX** - Netflix Inc.
- **DIS** - The Walt Disney Company
- **BA** - Boeing Company
- **JPM** - JPMorgan Chase & Co.

## Error Handling

### Common Errors:

1. **Invalid Symbol**
```json
{
  "success": false,
  "message": "Invalid stock symbol or API error"
}
```

2. **Rate Limit Exceeded**
```json
{
  "success": false,
  "message": "API call frequency limit reached. Please try again later."
}
```

3. **Stock Data Not Available**
```json
{
  "success": false,
  "message": "Stock data not available"
}
```

## Rate Limiting

**Free Tier Limits:**
- 25 requests per day
- 5 requests per minute

**Tips:**
- Cache hasil quote untuk mengurangi API calls
- Gunakan multiple quotes endpoint untuk batch requests
- Upgrade ke premium jika butuh lebih banyak requests

## Future Enhancements

Fitur yang bisa ditambahkan:

1. **Investment Portfolio Tracker**
   - Simpan holdings di database
   - Track profit/loss real-time
   - Portfolio value chart

2. **Price Alerts**
   - Set alert ketika harga mencapai target
   - Email/push notification

3. **Historical Data**
   - Chart harga historis
   - Technical indicators (SMA, EMA, RSI)

4. **Watchlist**
   - Simpan favorite stocks
   - Quick access ke stocks yang dimonitor

## Testing

Untuk testing dengan API key `demo`, gunakan symbols:
- IBM
- AAPL (terbatas)
- MSFT (terbatas)

Untuk production, daftar dan gunakan API key Anda sendiri.

## Resources

- [Alpha Vantage Documentation](https://www.alphavantage.co/documentation/)
- [Get Free API Key](https://www.alphavantage.co/support/#api-key)
- [Premium Plans](https://www.alphavantage.co/premium/)
