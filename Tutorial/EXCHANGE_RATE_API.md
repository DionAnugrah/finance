# ExchangeRate API Integration

Dokumentasi lengkap untuk menggunakan ExchangeRate API di aplikasi AdonisJS v6 ini.

## Setup

### 1. Dapatkan API Key
Daftar di [ExchangeRate-API.com](https://www.exchangerate-api.com/) untuk mendapatkan API key gratis.

### 2. Konfigurasi Environment
Tambahkan API key ke file `.env`:

```env
EXCHANGE_RATE_API_KEY=your_actual_api_key_here
EXCHANGE_RATE_API_URL=https://v6.exchangerate-api.com/v6
```

### 3. Jalankan Server
```bash
npm run dev
```

## API Endpoints

Semua endpoint memerlukan autentikasi (Bearer token).

### 1. Get Latest Exchange Rates

**Endpoint:** `GET /api/exchange-rates/latest`

**Query Parameters:**
- `base` (optional): Kode mata uang dasar (default: USD)

**Contoh Request:**
```bash
curl -X GET "http://localhost:3333/api/exchange-rates/latest?base=USD" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "result": "success",
    "base_code": "USD",
    "conversion_rates": {
      "IDR": 15750.50,
      "EUR": 0.92,
      "GBP": 0.79,
      "JPY": 149.50,
      ...
    },
    "time_last_update_utc": "Sat, 06 Dec 2025 00:00:01 +0000"
  }
}
```

### 2. Convert Currency

**Endpoint:** `POST /api/exchange-rates/convert`

**Body Parameters:**
- `from` (required): Kode mata uang asal
- `to` (required): Kode mata uang tujuan
- `amount` (required): Jumlah yang akan dikonversi

**Contoh Request:**
```bash
curl -X POST "http://localhost:3333/api/exchange-rates/convert" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "USD",
    "to": "IDR",
    "amount": 100
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "from": "USD",
    "to": "IDR",
    "amount": 100,
    "conversion_rate": 15750.50,
    "converted_amount": 1575050,
    "last_update": "Sat, 06 Dec 2025 00:00:01 +0000"
  }
}
```

### 3. Get Pair Rate

**Endpoint:** `GET /api/exchange-rates/pair`

**Query Parameters:**
- `from` (required): Kode mata uang asal
- `to` (required): Kode mata uang tujuan

**Contoh Request:**
```bash
curl -X GET "http://localhost:3333/api/exchange-rates/pair?from=USD&to=IDR" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "from": "USD",
    "to": "IDR",
    "rate": 15750.50,
    "last_update": "Sat, 06 Dec 2025 00:00:01 +0000"
  }
}
```

### 4. Get Supported Currency Codes

**Endpoint:** `GET /api/exchange-rates/codes`

**Contoh Request:**
```bash
curl -X GET "http://localhost:3333/api/exchange-rates/codes" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "codes": [
      { "code": "USD", "name": "United States Dollar" },
      { "code": "IDR", "name": "Indonesian Rupiah" },
      { "code": "EUR", "name": "Euro" },
      ...
    ]
  }
}
```

## Struktur File

```
app/
├── controllers/
│   └── exchange_rate_controller.ts    # Controller untuk handle requests
├── services/
│   └── exchange_rate_service.ts       # Service untuk API calls
└── validators/
    └── exchange_rate_validator.ts     # Validasi input requests

start/
├── env.ts                             # Environment schema
└── routes.ts                          # Route definitions
```

## Cara Menggunakan di Kode

### Menggunakan Service Langsung

```typescript
import ExchangeRateService from '#services/exchange_rate_service'

// Di dalam controller atau service lain
const exchangeService = new ExchangeRateService()

// Get latest rates
const rates = await exchangeService.getLatestRates('USD')

// Convert currency
const conversion = await exchangeService.convertCurrency('USD', 'IDR', 100)

// Get pair rate
const pairRate = await exchangeService.getPairRate('USD', 'IDR')

// Get supported codes
const codes = await exchangeService.getSupportedCodes()
```

## Error Handling

Semua endpoint mengembalikan error dalam format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

## Catatan Penting

1. **Rate Limits**: Free tier ExchangeRate API memiliki limit 1,500 requests per bulan
2. **Update Frequency**: Rates diupdate setiap 24 jam
3. **Authentication**: Semua endpoint memerlukan Bearer token yang valid
4. **Currency Codes**: Gunakan kode ISO 4217 (USD, IDR, EUR, dll)

## Testing dengan Postman/Thunder Client

1. Login terlebih dahulu untuk mendapatkan token
2. Gunakan token di header: `Authorization: Bearer YOUR_TOKEN`
3. Test semua endpoint sesuai dokumentasi di atas
