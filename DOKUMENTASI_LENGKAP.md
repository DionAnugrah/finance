# 📚 Dokumentasi Lengkap - Finance App

## Daftar Isi
1. [Arsitektur Aplikasi](#arsitektur-aplikasi)
2. [Mekanisme Keamanan](#mekanisme-keamanan)
3. [API Endpoints](#api-endpoints)
4. [Penjelasan Kode Backend](#penjelasan-kode-backend)
5. [Penjelasan Kode Frontend](#penjelasan-kode-frontend)
6. [FAQ - Pertanyaan & Jawaban](#faq)

---

## Arsitektur Aplikasi

### Tech Stack
- **Backend**: AdonisJS v6 (Node.js Framework)
- **Database**: MySQL
- **Authentication**: JWT Token (API Guard)
- **Frontend**: Vanilla JavaScript + Edge.js Template
- **External APIs**: 
  - ExchangeRate API (Currency conversion)
  - Alpha Vantage API (Stock market data)

### Struktur Folder
```
app/
├── controllers/          # Request handlers
│   ├── auth_controller.ts
│   ├── category_controller.ts
│   ├── transaction_controller.ts
│   ├── exchange_rate_controller.ts
│   └── stock_controller.ts
├── services/            # Business logic & API calls
│   ├── exchange_rate_service.ts
│   └── alpha_vantage_service.ts
├── validators/          # Input validation
│   ├── exchange_rate_validator.ts
│   └── stock_validator.ts
├── models/             # Database models
└── middleware/         # Request middleware
```

---

## Mekanisme Keamanan

### 1. Authentication (JWT Token)


**Cara Kerja:**
```typescript
// 1. User login dengan email & password
POST /login
Body: { email, password }

// 2. Server validasi credentials
// 3. Generate JWT token
const token = await User.accessTokens.create(user)

// 4. Return token ke client
Response: { token: "eyJhbGc..." }

// 5. Client simpan token di localStorage
localStorage.setItem('token', token)

// 6. Setiap request, kirim token di header
Authorization: Bearer eyJhbGc...
```

**Keamanan:**
- Password di-hash menggunakan bcrypt
- Token expire setelah waktu tertentu
- Token disimpan di localStorage (client-side)
- Middleware `auth` memvalidasi token setiap request

### 2. Input Validation

**Menggunakan VineJS:**
```typescript
// Contoh validator
export const convertCurrencyValidator = vine.compile(
  vine.object({
    from: vine.string().toUpperCase(),
    to: vine.string().toUpperCase(),
    amount: vine.number().positive(),
  })
)
```

**Keamanan:**
- Validasi tipe data (string, number, dll)
- Validasi format (uppercase, positive, dll)
- Prevent SQL injection
- Prevent XSS attacks

### 3. API Rate Limiting

**ExchangeRate API:**
- Free tier: 1,500 requests/month
- Automatic rate limiting dari provider

**Alpha Vantage API:**
- Free tier: 25 requests/day, 5 requests/minute
- Delay 500ms antar request untuk multiple quotes

### 4. Environment Variables

**Sensitive data disimpan di `.env`:**
```env
APP_KEY=secret_key_here
DB_PASSWORD=database_password
EXCHANGE_RATE_API_KEY=api_key
ALPHA_VANTAGE_API_KEY=api_key
```

**Keamanan:**
- `.env` tidak di-commit ke Git
- Validasi env variables di `start/env.ts`
- Type-safe environment access

---

## API Endpoints

### Authentication Endpoints

#### 1. Register
```http
POST /register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": { "id": 1, "email": "user@example.com" },
  "token": "eyJhbGc..."
}
```

#### 2. Login
```http
POST /login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGc..."
}
```

### Transaction Endpoints (Protected)

**Semua endpoint memerlukan header:**
```http
Authorization: Bearer {token}
```

#### 1. Get All Transactions
```http
GET /transactions
```

#### 2. Create Transaction
```http
POST /transactions
Content-Type: application/json

{
  "description": "Gaji bulanan",
  "type": "income",
  "amount": 5000000
}
```

#### 3. Update Transaction
```http
PUT /transactions/:id
Content-Type: application/json

{
  "description": "Gaji bulanan (updated)",
  "type": "income",
  "amount": 5500000
}
```

#### 4. Delete Transaction
```http
DELETE /transactions/:id
```

### Exchange Rate Endpoints (Protected)

#### 1. Get Latest Rates
```http
GET /exchange-rates/latest?base=USD
```

**Response:**
```json
{
  "success": true,
  "data": {
    "base_code": "USD",
    "conversion_rates": {
      "IDR": 15750.50,
      "EUR": 0.92,
      ...
    }
  }
}
```

#### 2. Convert Currency
```http
POST /exchange-rates/convert
Content-Type: application/json

{
  "from": "USD",
  "to": "IDR",
  "amount": 100
}
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
    "converted_amount": 1575050
  }
}
```

#### 3. Get Pair Rate
```http
GET /exchange-rates/pair?from=USD&to=IDR
```

#### 4. Get Supported Codes
```http
GET /exchange-rates/codes
```

### Stock Market Endpoints (Protected)

#### 1. Get Stock Quote
```http
GET /stocks/quote?symbol=AAPL
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
    "open": 177.20,
    "high": 179.80,
    "low": 176.90
  }
}
```

#### 2. Search Stock Symbol
```http
GET /stocks/search?keywords=Apple
```

#### 3. Get Multiple Quotes
```http
POST /stocks/quotes
Content-Type: application/json

{
  "symbols": ["AAPL", "MSFT", "GOOGL"]
}
```

---

## Penjelasan Kode Backend

### 1. Controllers

**Fungsi:** Handle HTTP requests dan responses

**Contoh: `exchange_rate_controller.ts`**
```typescript
export default class ExchangeRateController {
  async convert({ request, response }: HttpContext) {
    try {
      // 1. Validasi input
      const { from, to, amount } = await request.validateUsing(
        convertCurrencyValidator
      )
      
      // 2. Panggil service
      const service = new ExchangeRateService()
      const data = await service.convertCurrency(from, to, amount)
      
      // 3. Return response
      return response.ok({
        success: true,
        data: {
          from: data.base_code,
          to: data.target_code,
          amount,
          conversion_rate: data.conversion_rate,
          converted_amount: data.conversion_result,
        },
      })
    } catch (error) {
      // 4. Handle error
      return response.badRequest({
        success: false,
        message: error.message,
      })
    }
  }
}
```

**Penjelasan:**
1. Validasi input menggunakan validator
2. Delegate business logic ke service
3. Format response yang konsisten
4. Error handling yang proper

### 2. Services

**Fungsi:** Business logic & external API calls

**Contoh: `exchange_rate_service.ts`**
```typescript
export default class ExchangeRateService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    // Load dari environment variables
    this.apiKey = env.get('EXCHANGE_RATE_API_KEY')
    this.baseUrl = env.get('EXCHANGE_RATE_API_URL')
  }

  async convertCurrency(from: string, to: string, amount: number) {
    // 1. Build URL
    const url = `${this.baseUrl}/${this.apiKey}/pair/${from}/${to}/${amount}`
    
    // 2. Fetch data
    const response = await fetch(url)
    
    // 3. Check response
    if (!response.ok) {
      throw new Error('Failed to convert currency')
    }

    // 4. Parse & validate
    const data = await response.json()
    
    if (data.result === 'error') {
      throw new Error(data['error-type'])
    }

    // 5. Return data
    return data
  }
}
```

**Penjelasan:**
1. Encapsulate API logic
2. Handle API authentication
3. Error handling
4. Type-safe responses

### 3. Validators

**Fungsi:** Validate & sanitize input

**Contoh: `stock_validator.ts`**
```typescript
export const getStockQuoteValidator = vine.compile(
  vine.object({
    symbol: vine.string().toUpperCase().trim(),
  })
)
```

**Penjelasan:**
- `vine.string()` - Harus string
- `.toUpperCase()` - Transform ke uppercase
- `.trim()` - Remove whitespace
- Automatic validation sebelum masuk controller

### 4. Middleware

**Fungsi:** Intercept requests

**Auth Middleware:**
```typescript
// Di routes.ts
router
  .group(() => {
    router.get('/transactions', '#controllers/transaction_controller.index')
    // ... other routes
  })
  .use(auth) // Semua routes di group ini protected
```

**Penjelasan:**
- Validasi JWT token
- Attach user ke request
- Reject unauthorized requests

### 5. Environment Configuration

**File: `start/env.ts`**
```typescript
export default await Env.create(new URL('../', import.meta.url), {
  EXCHANGE_RATE_API_KEY: Env.schema.string(),
  ALPHA_VANTAGE_API_KEY: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
})
```

**Penjelasan:**
- Type-safe environment variables
- Validation saat startup
- Auto-complete di IDE

---

## Penjelasan Kode Frontend

### 1. Authentication Flow

**File: `public/script.js`**
```javascript
// Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  
  // 1. Get form data
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value
  
  // 2. Send request
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  
  // 3. Handle response
  const data = await res.json()
  if (res.ok && data.token) {
    // 4. Save token
    localStorage.setItem('token', data.token)
    // 5. Show dashboard
    showDashboard()
  }
})
```

### 2. API Calls dengan Authentication

```javascript
async function getTransactions() {
  // 1. Get token dari localStorage
  const token = localStorage.getItem('token')
  
  // 2. Send request dengan token
  const res = await fetch(`${API_URL}/transactions`, {
    headers: { 
      Authorization: `Bearer ${token}` 
    },
  })
  
  // 3. Handle response
  const data = await res.json()
  // 4. Update UI
  displayTransactions(data)
}
```

### 3. Currency Converter

```javascript
currencyConverterForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  
  const token = localStorage.getItem('token')
  const from = document.getElementById('from-currency').value
  const to = document.getElementById('to-currency').value
  const amount = parseFloat(document.getElementById('convert-amount').value)
  
  const res = await fetch(`${API_URL}/exchange-rates/convert`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ from, to, amount }),
  })
  
  const data = await res.json()
  if (data.success) {
    displayConversionResult(data.data)
  }
})
```

### 4. Stock Tracker

```javascript
async function getStockQuote(symbol) {
  const token = localStorage.getItem('token')
  
  const res = await fetch(`${API_URL}/stocks/quote?symbol=${symbol}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  
  const data = await res.json()
  if (data.success) {
    displayStockQuote(data.data)
  }
}
```

### 5. Dynamic UI Updates

```javascript
function displayStockQuote(quote) {
  const isPositive = quote.change >= 0
  const changeClass = isPositive ? 'positive' : 'negative'
  
  stockQuoteResult.innerHTML = `
    <div class="stock-card">
      <div class="stock-symbol">${quote.symbol}</div>
      <div class="stock-price">$${quote.price.toFixed(2)}</div>
      <div class="stock-change ${changeClass}">
        ${quote.change.toFixed(2)} (${quote.changePercent})
      </div>
    </div>
  `
}
```

---

## FAQ - Pertanyaan & Jawaban

### Keamanan & Authentication


#### Q1: Bagaimana cara kerja JWT authentication di aplikasi ini?

**Jawaban:**
1. User login dengan email & password
2. Server validasi credentials dengan database
3. Jika valid, server generate JWT token menggunakan `User.accessTokens.create()`
4. Token dikirim ke client dan disimpan di `localStorage`
5. Setiap request ke protected endpoint, client kirim token di header `Authorization: Bearer {token}`
6. Middleware `auth` di server validasi token
7. Jika valid, request dilanjutkan; jika tidak, return 401 Unauthorized

**Keuntungan JWT:**
- Stateless (server tidak perlu simpan session)
- Scalable (bisa digunakan di multiple servers)
- Secure (signed dengan secret key)

#### Q2: Apakah token bisa expired? Bagaimana cara handle-nya?

**Jawaban:**
Ya, token bisa expired. Di AdonisJS, konfigurasi ada di `config/auth.ts`:

```typescript
tokenProvider: {
  type: 'api',
  driver: 'database',
  table: 'auth_access_tokens',
  expiresIn: '30 days', // Token expire setelah 30 hari
}
```

**Handle expired token:**
1. Server return 401 Unauthorized
2. Frontend detect error 401
3. Redirect user ke login page
4. User login ulang untuk dapat token baru

#### Q3: Apakah password disimpan dalam bentuk plain text?

**Jawaban:**
Tidak! Password di-hash menggunakan bcrypt sebelum disimpan ke database.

```typescript
// Di User model
import hash from '@adonisjs/core/services/hash'

class User extends BaseModel {
  @column({ serializeAs: null })
  declare password: string

  @beforeSave()
  static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await hash.make(user.password)
    }
  }
}
```

**Keamanan:**
- Bcrypt adalah one-way hashing (tidak bisa di-decrypt)
- Setiap password punya unique salt
- Resistant terhadap rainbow table attacks

#### Q4: Bagaimana mencegah SQL Injection?

**Jawaban:**
AdonisJS Lucid ORM otomatis prevent SQL injection dengan:

1. **Parameterized queries:**
```typescript
// AMAN - menggunakan ORM
await User.findBy('email', email)

// BAHAYA - raw query tanpa sanitization
await Database.rawQuery(`SELECT * FROM users WHERE email = '${email}'`)
```

2. **Input validation:**
```typescript
// Validator otomatis sanitize input
const { email } = await request.validateUsing(loginValidator)
```

3. **Type checking:**
```typescript
// TypeScript ensure tipe data benar
amount: vine.number().positive()
```

### API Integration

#### Q5: Bagaimana cara kerja ExchangeRate API?

**Jawaban:**
1. **Registrasi:** Daftar di exchangerate-api.com, dapat API key
2. **Request:** Kirim HTTP request ke endpoint dengan API key
3. **Response:** Terima data dalam format JSON
4. **Parse:** Extract data yang dibutuhkan

**Contoh flow:**
```
Client → Controller → Service → External API
                                    ↓
Client ← Controller ← Service ← Response
```

**Service layer:**
```typescript
async getLatestRates(baseCurrency: string) {
  // 1. Build URL dengan API key
  const url = `${this.baseUrl}/${this.apiKey}/latest/${baseCurrency}`
  
  // 2. Fetch data
  const response = await fetch(url)
  
  // 3. Parse JSON
  const data = await response.json()
  
  // 4. Validate & return
  if (data.result === 'error') {
    throw new Error(data['error-type'])
  }
  return data
}
```

#### Q6: Kenapa perlu Service layer? Kenapa tidak langsung di Controller?

**Jawaban:**
**Separation of Concerns:**

1. **Controller:** Handle HTTP (request/response)
2. **Service:** Handle business logic & external APIs
3. **Model:** Handle database operations

**Keuntungan:**
- **Reusability:** Service bisa dipanggil dari multiple controllers
- **Testability:** Mudah di-test secara terpisah
- **Maintainability:** Perubahan logic tidak affect controller
- **Clean Code:** Setiap layer punya tanggung jawab jelas

**Contoh:**
```typescript
// BAD - Logic di controller
class ExchangeRateController {
  async convert({ request, response }) {
    const url = `https://api.com/convert?from=${from}&to=${to}`
    const res = await fetch(url)
    const data = await res.json()
    return response.ok(data)
  }
}

// GOOD - Logic di service
class ExchangeRateController {
  async convert({ request, response }) {
    const service = new ExchangeRateService()
    const data = await service.convertCurrency(from, to, amount)
    return response.ok(data)
  }
}
```

#### Q7: Bagaimana handle rate limiting dari external API?

**Jawaban:**
**Alpha Vantage (25 requests/day, 5 requests/minute):**

1. **Delay antar request:**
```typescript
async getMultipleQuotes(symbols: string[]) {
  const quotes = []
  for (const symbol of symbols) {
    const quote = await this.getStockQuote(symbol)
    quotes.push(quote)
    // Delay 500ms untuk avoid rate limit
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  return quotes
}
```

2. **Error handling:**
```typescript
if (data.Note) {
  throw new Error('API call frequency limit reached. Please try again later.')
}
```

3. **Caching (future enhancement):**
```typescript
// Cache hasil selama 5 menit
const cachedData = cache.get(`stock:${symbol}`)
if (cachedData) return cachedData

const data = await fetchFromAPI(symbol)
cache.set(`stock:${symbol}`, data, 300) // 5 minutes
return data
```

#### Q8: Apakah API key aman disimpan di environment variables?

**Jawaban:**
Ya, ini adalah best practice:

**Keamanan:**
1. `.env` file tidak di-commit ke Git (ada di `.gitignore`)
2. Hanya accessible di server-side
3. Tidak exposed ke client/browser
4. Setiap environment (dev/staging/prod) punya `.env` sendiri

**JANGAN:**
```javascript
// BAHAYA - API key di frontend
const API_KEY = 'abc123'
fetch(`https://api.com?key=${API_KEY}`)
```

**LAKUKAN:**
```typescript
// AMAN - API key di backend
const apiKey = env.get('API_KEY')
fetch(`https://api.com?key=${apiKey}`)
```

### Database & Models

#### Q9: Bagaimana cara kerja Lucid ORM?

**Jawaban:**
Lucid adalah ORM (Object-Relational Mapping) yang map database tables ke JavaScript objects.

**Contoh:**
```typescript
// Model
class Transaction extends BaseModel {
  @column()
  declare description: string
  
  @column()
  declare amount: number
}

// Query
const transactions = await Transaction.all()
// SQL: SELECT * FROM transactions

const transaction = await Transaction.find(1)
// SQL: SELECT * FROM transactions WHERE id = 1

await Transaction.create({ description: 'Gaji', amount: 5000000 })
// SQL: INSERT INTO transactions (description, amount) VALUES ('Gaji', 5000000)
```

**Keuntungan:**
- Type-safe queries
- Auto SQL generation
- Relationship handling
- Migration support

#### Q10: Bagaimana cara kerja migrations?

**Jawaban:**
Migrations adalah version control untuk database schema.

**Create migration:**
```bash
node ace make:migration create_transactions_table
```

**Migration file:**
```typescript
export default class extends BaseSchema {
  async up() {
    this.schema.createTable('transactions', (table) => {
      table.increments('id')
      table.string('description')
      table.decimal('amount', 15, 2)
      table.timestamp('created_at')
    })
  }

  async down() {
    this.schema.dropTable('transactions')
  }
}
```

**Run migration:**
```bash
node ace migration:run
```

**Keuntungan:**
- Track database changes
- Rollback jika ada error
- Consistent schema across environments
- Team collaboration

### Frontend

#### Q11: Kenapa menggunakan localStorage untuk simpan token?

**Jawaban:**
**Keuntungan localStorage:**
- Persistent (tidak hilang saat refresh)
- Simple API
- Accessible dari JavaScript
- No server-side storage needed

**Alternatif:**
1. **sessionStorage:** Hilang saat tab ditutup
2. **Cookies:** Bisa di-set httpOnly untuk security
3. **IndexedDB:** Untuk data lebih kompleks

**Security consideration:**
- Vulnerable terhadap XSS attacks
- Jangan simpan sensitive data selain token
- Implement Content Security Policy (CSP)

#### Q12: Bagaimana cara kerja form validation di frontend?

**Jawaban:**
**HTML5 validation:**
```html
<input type="email" required />
<input type="number" min="0" step="0.01" required />
```

**JavaScript validation:**
```javascript
const amount = parseFloat(document.getElementById('amount').value)
if (!amount || amount <= 0) {
  alert('Amount must be positive')
  return
}
```

**Backend validation (primary):**
```typescript
// Validator di backend adalah primary defense
const { amount } = await request.validateUsing(validator)
```

**Best practice:**
- Frontend validation untuk UX
- Backend validation untuk security
- Never trust client-side validation

#### Q13: Bagaimana handle error dari API di frontend?

**Jawaban:**
```javascript
try {
  const res = await fetch(`${API_URL}/endpoint`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  
  if (!res.ok) {
    // HTTP error (4xx, 5xx)
    throw new Error(`HTTP error: ${res.status}`)
  }
  
  const data = await res.json()
  
  if (!data.success) {
    // API error
    throw new Error(data.message)
  }
  
  // Success
  displayData(data.data)
  
} catch (error) {
  // Handle error
  console.error('Error:', error)
  alert('Terjadi kesalahan: ' + error.message)
}
```

**Error types:**
1. **Network error:** Tidak bisa connect ke server
2. **HTTP error:** Server return 4xx/5xx
3. **API error:** Server return error response
4. **Parse error:** Invalid JSON response

### Performance & Optimization

#### Q14: Bagaimana optimize API calls?

**Jawaban:**
**1. Caching:**
```javascript
// Cache hasil di memory
const cache = new Map()

async function getStockQuote(symbol) {
  // Check cache
  if (cache.has(symbol)) {
    const cached = cache.get(symbol)
    // Return jika masih fresh (< 5 menit)
    if (Date.now() - cached.timestamp < 300000) {
      return cached.data
    }
  }
  
  // Fetch dari API
  const data = await fetchFromAPI(symbol)
  
  // Save to cache
  cache.set(symbol, {
    data,
    timestamp: Date.now()
  })
  
  return data
}
```

**2. Debouncing:**
```javascript
// Delay search sampai user berhenti typing
let searchTimeout
searchInput.addEventListener('input', (e) => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    searchStocks(e.target.value)
  }, 500) // Wait 500ms
})
```

**3. Lazy loading:**
```javascript
// Load data hanya saat dibutuhkan
viewRatesBtn.addEventListener('click', async () => {
  if (!ratesLoaded) {
    await loadRates()
    ratesLoaded = true
  }
  showRatesModal()
})
```

#### Q15: Bagaimana improve loading experience?

**Jawaban:**
**1. Loading indicators:**
```javascript
function showLoading() {
  element.innerHTML = '<p class="loading-spinner"></p>'
}

function hideLoading() {
  element.classList.remove('loading')
}
```

**2. Skeleton screens:**
```html
<div class="skeleton">
  <div class="skeleton-line"></div>
  <div class="skeleton-line"></div>
</div>
```

**3. Optimistic updates:**
```javascript
// Update UI immediately
addTransactionToUI(transaction)

// Then sync with server
try {
  await saveToServer(transaction)
} catch (error) {
  // Rollback jika gagal
  removeTransactionFromUI(transaction)
}
```

### Deployment & Production

#### Q16: Apa yang perlu diperhatikan saat deploy ke production?

**Jawaban:**
**1. Environment variables:**
```env
NODE_ENV=production
APP_KEY=generate_new_secure_key
DB_PASSWORD=strong_password
```

**2. Database:**
- Run migrations
- Backup database regularly
- Use connection pooling

**3. Security:**
- Enable HTTPS
- Set secure headers (CORS, CSP)
- Rate limiting
- Input sanitization

**4. Performance:**
- Enable caching
- Compress responses (gzip)
- CDN untuk static files
- Database indexing

**5. Monitoring:**
- Error logging (Sentry)
- Performance monitoring
- Uptime monitoring
- API usage tracking

#### Q17: Bagaimana cara backup database?

**Jawaban:**
**MySQL backup:**
```bash
# Backup
mysqldump -u root -p database_name > backup.sql

# Restore
mysql -u root -p database_name < backup.sql
```

**Automated backup:**
```bash
# Cron job (daily backup)
0 2 * * * mysqldump -u root -p database_name > /backups/db_$(date +\%Y\%m\%d).sql
```

**Best practices:**
- Daily automated backups
- Store backups di separate server
- Test restore process regularly
- Keep multiple backup versions

### Testing

#### Q18: Bagaimana cara test API endpoints?

**Jawaban:**
**1. Manual testing (Postman/Thunder Client):**
```http
POST http://localhost:3333/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

**2. Automated testing (Japa):**
```typescript
test('login with valid credentials', async ({ client }) => {
  const response = await client.post('/login').json({
    email: 'test@example.com',
    password: 'password123'
  })
  
  response.assertStatus(200)
  response.assertBodyContains({ token: String })
})
```

**3. Integration testing:**
```typescript
test('create transaction', async ({ client }) => {
  // Login first
  const loginRes = await client.post('/login').json({
    email: 'test@example.com',
    password: 'password123'
  })
  
  const token = loginRes.body().token
  
  // Create transaction
  const response = await client
    .post('/transactions')
    .bearerToken(token)
    .json({
      description: 'Test',
      type: 'income',
      amount: 1000
    })
  
  response.assertStatus(200)
})
```

#### Q19: Bagaimana test frontend?

**Jawaban:**
**1. Manual testing:**
- Test di berbagai browser (Chrome, Firefox, Safari)
- Test di berbagai device (desktop, tablet, mobile)
- Test semua user flows

**2. Automated testing (Jest/Vitest):**
```javascript
test('display conversion result', () => {
  const data = {
    from: 'USD',
    to: 'IDR',
    amount: 100,
    converted_amount: 1575050
  }
  
  displayConversionResult(data)
  
  expect(document.getElementById('result-to-amount').textContent)
    .toContain('1,575,050.00 IDR')
})
```

**3. E2E testing (Playwright/Cypress):**
```javascript
test('user can login and create transaction', async ({ page }) => {
  await page.goto('http://localhost:3333')
  await page.fill('#email', 'test@example.com')
  await page.fill('#password', 'password123')
  await page.click('button[type="submit"]')
  
  await page.waitForSelector('#dashboard')
  await page.fill('#description', 'Test transaction')
  await page.selectOption('#type', 'income')
  await page.fill('#amount', '1000')
  await page.click('#add-transaction-form button')
  
  await expect(page.locator('table tbody tr')).toContainText('Test transaction')
})
```

---

## Best Practices Summary

### Backend
✅ Use environment variables untuk sensitive data
✅ Validate semua input dengan VineJS
✅ Implement proper error handling
✅ Use service layer untuk business logic
✅ Follow RESTful API conventions
✅ Implement authentication & authorization
✅ Use TypeScript untuk type safety
✅ Write migrations untuk database changes

### Frontend
✅ Validate input di client & server
✅ Handle loading & error states
✅ Store token securely
✅ Implement responsive design
✅ Use semantic HTML
✅ Optimize performance (debounce, cache)
✅ Provide user feedback (loading, success, error)
✅ Follow accessibility guidelines

### Security
✅ Hash passwords dengan bcrypt
✅ Use JWT untuk authentication
✅ Validate & sanitize all inputs
✅ Implement rate limiting
✅ Use HTTPS in production
✅ Set secure headers (CORS, CSP)
✅ Never expose API keys to client
✅ Regular security audits

---

## Resources

### Documentation
- [AdonisJS Docs](https://docs.adonisjs.com/)
- [ExchangeRate API](https://www.exchangerate-api.com/docs)
- [Alpha Vantage API](https://www.alphavantage.co/documentation/)

### Tools
- [Postman](https://www.postman.com/) - API testing
- [TablePlus](https://tableplus.com/) - Database management
- [VS Code](https://code.visualstudio.com/) - Code editor

### Learning
- [MDN Web Docs](https://developer.mozilla.org/) - Web development
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - TypeScript
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**Dibuat dengan ❤️ untuk Finance App**
