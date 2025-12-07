# 📁 Struktur Project Finance App

Dokumentasi lengkap struktur project dan fungsi setiap file.

---

## 🌳 Gambaran Umum

```
finance-app/
├── 📂 app/                      # Backend Application Code
├── 📂 config/                   # Configuration Files
├── 📂 database/                 # Database Files
├── 📂 resources/                # Frontend Resources
├── 📂 start/                    # Application Bootstrap
├── 📂 public/                   # Public Assets
├── 📂 tests/                    # Test Files
├── 📄 package.json              # Backend Dependencies
├── 📄 .env                      # Environment Variables
└── 📄 README.md                 # Main Documentation
```

---

## 📂 Struktur Detail

### 1️⃣ `/app` - Backend Application

```
app/
├── controllers/          # HTTP Request Handlers
│   ├── auth_controller.ts
│   ├── category_controller.ts
│   ├── transaction_controller.ts
│   ├── exchange_rate_controller.ts
│   └── stock_controller.ts
│
├── models/              # Database Models (ORM)
│   ├── user.ts
│   ├── category.ts
│   └── transaction.ts
│
├── services/            # Business Logic & External APIs
│   ├── exchange_rate_service.ts
│   └── alpha_vantage_service.ts
│
├── validators/          # Input Validation Rules
│   ├── auth_validator.ts
│   ├── transaction_validator.ts
│   ├── exchange_rate_validator.ts
│   └── stock_validator.ts
│
├── middleware/          # Custom Middleware
│   └── auth_middleware.ts
│
└── exceptions/          # Error Handlers
    └── handler.ts
```

#### 📄 Controllers (app/controllers/)

**auth_controller.ts**
```typescript
// Fungsi: Handle authentication (register, login, logout)
// Endpoints:
// - POST /api/register - Daftar user baru
// - POST /api/login - Login user
// - POST /api/logout - Logout user
```

**category_controller.ts**
```typescript
// Fungsi: CRUD categories (income/expense)
// Endpoints:
// - GET /api/categories - List semua categories
// - POST /api/categories - Buat category baru
// - PUT /api/categories/:id - Update category
// - DELETE /api/categories/:id - Hapus category
```

**transaction_controller.ts**
```typescript
// Fungsi: CRUD transactions (income/expense)
// Endpoints:
// - GET /api/transactions - List semua transactions
// - POST /api/transactions - Buat transaction baru
// - GET /api/transactions/:id - Detail transaction
// - PUT /api/transactions/:id - Update transaction
// - DELETE /api/transactions/:id - Hapus transaction
```

**exchange_rate_controller.ts**
```typescript
// Fungsi: Handle currency conversion
// Endpoints:
// - GET /api/exchange-rates/latest - Get latest rates
// - POST /api/exchange-rates/convert - Convert currency
// - GET /api/exchange-rates/pair - Get pair rate
// - GET /api/exchange-rates/codes - Get supported currencies
```

**stock_controller.ts**
```typescript
// Fungsi: Handle stock market data
// Endpoints:
// - GET /api/stocks/quote - Get stock quote
// - GET /api/stocks/search - Search stock symbol
// - POST /api/stocks/quotes - Get multiple quotes
```

#### 📄 Models (app/models/)

**user.ts**
```typescript
// Fungsi: User model (representasi tabel users)
// Fields:
// - id: number (primary key)
// - name: string | null
// - email: string (unique)
// - password: string (hashed)
// - createdAt: DateTime
// - updatedAt: DateTime
// Relations:
// - hasMany: categories, transactions
```

**category.ts**
```typescript
// Fungsi: Category model (representasi tabel categories)
// Fields:
// - id: number (primary key)
// - name: string
// - type: 'income' | 'expense'
// - userId: number (foreign key)
// - createdAt: DateTime
// Relations:
// - belongsTo: user
// - hasMany: transactions
```

**transaction.ts**
```typescript
// Fungsi: Transaction model (representasi tabel transactions)
// Fields:
// - id: number (primary key)
// - userId: number (foreign key)
// - categoryId: number | null (foreign key)
// - type: 'income' | 'expense'
// - amount: number
// - description: string | null
// - date: DateTime
// - createdAt: DateTime
// Relations:
// - belongsTo: user, category
```

#### 📄 Services (app/services/)

**exchange_rate_service.ts**
```typescript
// Fungsi: Integrasi dengan ExchangeRate API
// Methods:
// - getLatestRates(base) - Get exchange rates
// - convertCurrency(from, to, amount) - Convert currency
// - getPairRate(from, to) - Get rate between 2 currencies
// - getSupportedCodes() - Get all currency codes
// 
// API: https://www.exchangerate-api.com/
// Rate Limit: 1,500 requests/month (free)
```

**alpha_vantage_service.ts**
```typescript
// Fungsi: Integrasi dengan Alpha Vantage API
// Methods:
// - getStockQuote(symbol) - Get stock price
// - searchSymbol(keywords) - Search stock symbol
// - getMultipleQuotes(symbols) - Get multiple quotes
//
// API: https://www.alphavantage.co/
// Rate Limit: 5 requests/minute, 500/day (free)
// Note: Implements 500ms delay between requests
```

#### 📄 Validators (app/validators/)

**auth_validator.ts**
```typescript
// Fungsi: Validasi input untuk authentication
// Rules:
// - registerValidator: email (valid email), password (min 8 chars)
// - loginValidator: email (valid email), password (required)
```

**transaction_validator.ts**
```typescript
// Fungsi: Validasi input untuk transactions
// Rules:
// - createTransactionValidator:
//   - type: 'income' | 'expense'
//   - amount: positive number
//   - description: string (optional)
//   - date: valid date
//   - categoryId: number (optional)
```

**exchange_rate_validator.ts**
```typescript
// Fungsi: Validasi input untuk currency conversion
// Rules:
// - getLatestRatesValidator: base (optional, uppercase)
// - convertCurrencyValidator: from, to (uppercase), amount (positive)
// - getPairRateValidator: from, to (uppercase)
```

**stock_validator.ts**
```typescript
// Fungsi: Validasi input untuk stock data
// Rules:
// - getStockQuoteValidator: symbol (required, uppercase)
// - searchSymbolValidator: keywords (required)
// - getMultipleQuotesValidator: symbols (array of strings)
```

---

### 2️⃣ `/config` - Configuration Files

```
config/
├── app.ts              # App configuration (name, URL, etc)
├── auth.ts             # Authentication config (JWT settings)
├── database.ts         # Database connection config
├── cors.ts             # CORS policy config
├── bodyparser.ts       # Request body parser config
├── hash.ts             # Password hashing config
├── logger.ts           # Logging config
└── static.ts           # Static files serving config
```

**app.ts**
```typescript
// Fungsi: Konfigurasi aplikasi umum
// Settings:
// - appKey: Secret key untuk encryption
// - http: Host, port, cookie settings
```

**auth.ts**
```typescript
// Fungsi: Konfigurasi authentication
// Settings:
// - guards: API guard dengan JWT
// - tokenProvider: Access tokens provider
```

**database.ts**
```typescript
// Fungsi: Konfigurasi database connection
// Settings:
// - connection: mysql
// - host, port, user, password, database
```

**cors.ts**
```typescript
// Fungsi: Konfigurasi CORS (Cross-Origin Resource Sharing)
// Settings:
// - origin: Allowed domains (localhost:5173, production domain)
// - methods: GET, POST, PUT, DELETE, PATCH
// - credentials: true (allow cookies)
```

---

### 3️⃣ `/database` - Database Files

```
database/
├── migrations/              # Database Schema Changes
│   ├── create_users_table.ts
│   ├── create_access_tokens_table.ts
│   ├── create_categories_table.ts
│   └── create_transactions_table.ts
│
└── seeders/                # Sample Data
    ├── main_seeder.ts
    ├── user_seeder.ts
    ├── category_seeder.ts
    ├── transaction_seeder.ts
    └── README.md
```

#### 📄 Migrations (database/migrations/)

**create_users_table.ts**
```typescript
// Fungsi: Buat tabel users
// Columns:
// - id (primary key)
// - name (nullable)
// - email (unique)
// - password (hashed)
// - created_at, updated_at
```

**create_access_tokens_table.ts**
```typescript
// Fungsi: Buat tabel access_tokens (untuk JWT)
// Columns:
// - id (primary key)
// - tokenable_id (user_id)
// - type (bearer)
// - name, hash, abilities
// - created_at, updated_at, expires_at
```

**create_categories_table.ts**
```typescript
// Fungsi: Buat tabel categories
// Columns:
// - id (primary key)
// - user_id (foreign key)
// - name
// - type (income/expense)
// - created_at, updated_at
```

**create_transactions_table.ts**
```typescript
// Fungsi: Buat tabel transactions
// Columns:
// - id (primary key)
// - user_id (foreign key)
// - category_id (foreign key, nullable)
// - type (income/expense)
// - amount (decimal)
// - description (nullable)
// - date
// - created_at, updated_at
```

#### 📄 Seeders (database/seeders/)

**main_seeder.ts**
```typescript
// Fungsi: Jalankan semua seeders dengan urutan yang benar
// Order:
// 1. UserSeeder
// 2. CategorySeeder
// 3. TransactionSeeder
```

**user_seeder.ts**
```typescript
// Fungsi: Buat sample users
// Data:
// - syahrul@finance.com / 12345678
// - dimas@finance.com / 12345678
// - alfin@finance.com / 12345678
```

**category_seeder.ts**
```typescript
// Fungsi: Buat sample categories
// Data:
// - 6 income categories (Salary, Freelance, etc)
// - 10 expense categories (Food, Transport, etc)
```

**transaction_seeder.ts**
```typescript
// Fungsi: Buat sample transactions
// Data:
// - 3 income transactions (Rp 7,000,000)
// - 10 expense transactions (Rp 4,100,000)
// - Balance: Rp 2,900,000
```

---

### 4️⃣ `/resources` - Frontend Resources

```
resources/
├── views/
│   └── spa.html            # SPA Entry Point
│
└── frontend/               # Vue.js Application
    ├── src/
    │   ├── components/     # Vue Components
    │   ├── views/          # Page Components
    │   ├── services/       # API Services
    │   ├── stores/         # Pinia Stores
    │   ├── router/         # Vue Router
    │   ├── assets/         # Static Assets
    │   ├── App.vue         # Root Component
    │   └── main.js         # Entry Point
    │
    ├── public/             # Public Assets
    ├── index.html          # HTML Template
    ├── vite.config.js      # Vite Config
    ├── package.json        # Frontend Dependencies
    └── .env                # Frontend Environment
```

#### 📄 Views (resources/views/)

**spa.html**
```html
<!-- Fungsi: HTML entry point untuk Vue.js SPA -->
<!-- Development: Load dari Vite dev server (localhost:5173) -->
<!-- Production: Load dari built files (/dist/) -->
```

#### 📄 Components (resources/frontend/src/components/)

**DashboardHeader.vue**
```vue
<!-- Fungsi: Header dashboard dengan user info & logout -->
<!-- Props: user (object) -->
<!-- Events: @logout -->
```

**TransactionForm.vue**
```vue
<!-- Fungsi: Form untuk create/edit transaction -->
<!-- Props: transaction (optional, untuk edit) -->
<!-- Events: @created, @updated -->
<!-- Fields: type, amount, description, date, category -->
```

**TransactionList.vue**
```vue
<!-- Fungsi: List semua transactions dengan filter -->
<!-- Props: transactions (array) -->
<!-- Events: @edit, @delete -->
<!-- Features: Filter by type, sort by date -->
```

**ExchangeRate.vue**
```vue
<!-- Fungsi: Currency converter widget -->
<!-- Features:
  - Select from/to currency
  - Input amount
  - Show conversion result
  - View all rates modal
-->
```

**StockTracker.vue**
```vue
<!-- Fungsi: Stock market tracker widget -->
<!-- Features:
  - Search stock symbol
  - Quick quote chips (AAPL, GOOGL, etc)
  - Display stock price & change
  - Multiple stocks support
-->
```

#### 📄 Views (resources/frontend/src/views/)

**LoginView.vue**
```vue
<!-- Fungsi: Halaman login -->
<!-- Features:
  - Email & password form
  - Login button
  - Error handling
  - Redirect to dashboard after login
-->
```

**DashboardView.vue**
```vue
<!-- Fungsi: Halaman dashboard utama -->
<!-- Components:
  - DashboardHeader
  - TransactionForm
  - TransactionList
  - ExchangeRate
  - StockTracker
-->
```

#### 📄 Services (resources/frontend/src/services/)

**api.js**
```javascript
// Fungsi: Axios instance dengan interceptors
// Base URL: /api
// Features:
// - Auto add Authorization header
// - Auto redirect to login on 401
// - Error handling
```

**authService.js**
```javascript
// Fungsi: Authentication API calls
// Methods:
// - login(email, password)
// - register(email, password)
// - logout()
```

**transactionService.js**
```javascript
// Fungsi: Transaction API calls
// Methods:
// - getAll()
// - create(data)
// - update(id, data)
// - delete(id)
```

**exchangeRateService.js**
```javascript
// Fungsi: Currency conversion API calls
// Methods:
// - getLatest(base)
// - convert(from, to, amount)
// - getPair(from, to)
// - getCodes()
```

**stockService.js**
```javascript
// Fungsi: Stock market API calls
// Methods:
// - getQuote(symbol)
// - search(keywords)
// - getMultipleQuotes(symbols)
```

#### 📄 Stores (resources/frontend/src/stores/)

**auth.js**
```javascript
// Fungsi: Global state untuk authentication
// State:
// - user: User object
// - token: JWT token
// Getters:
// - isAuthenticated: boolean
// Actions:
// - login(email, password)
// - logout()
// - checkAuth()
```

#### 📄 Router (resources/frontend/src/router/)

**index.js**
```javascript
// Fungsi: Vue Router configuration
// Routes:
// - /login (guest only)
// - / (authenticated only)
// Guards:
// - beforeEach: Check authentication
```

---

### 5️⃣ `/start` - Application Bootstrap

```
start/
├── routes.ts           # Route Definitions
├── kernel.ts           # Middleware Registration
└── env.ts              # Environment Validation
```

**routes.ts**
```typescript
// Fungsi: Definisi semua API routes
// Structure:
// - Public routes: /api/register, /api/login
// - Protected routes: /api/* (dengan auth middleware)
// - SPA fallback: /* (serve Vue.js app)
```

**kernel.ts**
```typescript
// Fungsi: Register middleware
// Middleware:
// - bodyParser: Parse request body
// - cors: Handle CORS
// - auth: JWT authentication
```

**env.ts**
```typescript
// Fungsi: Validasi environment variables
// Required:
// - TZ, PORT, HOST, APP_KEY, NODE_ENV
// - DB_* (database credentials)
// - EXCHANGE_RATE_API_KEY, ALPHA_VANTAGE_API_KEY
```

---

### 6️⃣ `/public` - Public Assets

```
public/
└── dist/               # Built Frontend (after npm run build)
    ├── index.html
    ├── assets/
    │   ├── index-[hash].js
    │   └── index-[hash].css
    └── favicon.ico
```

---

### 7️⃣ Root Files

**package.json**
```json
// Fungsi: Backend dependencies & scripts
// Scripts:
// - dev: Run development server
// - build: Build for production
// - start: Run production server
// - test: Run tests
```

**.env**
```env
# Fungsi: Environment variables (TIDAK di-commit ke Git)
# Contains:
# - App settings (PORT, HOST, APP_KEY)
# - Database credentials
# - API keys (ExchangeRate, Alpha Vantage)
```

**.env.example**
```env
# Fungsi: Template untuk .env
# Purpose: Show required environment variables
```

**adonisrc.ts**
```typescript
// Fungsi: AdonisJS configuration
// Settings:
// - Providers (auth, lucid, cors, etc)
// - Commands
// - Aliases (#controllers, #models, etc)
```

**tsconfig.json**
```json
// Fungsi: TypeScript compiler configuration
// Settings:
// - Target: ES2022
// - Module: ESNext
// - Strict mode: enabled
```

**nixpacks.toml**
```toml
# Fungsi: Railway deployment configuration
# Phases:
# - setup: Install Node.js
# - install: npm ci
# - build: Build frontend & backend
# - start: Run production server
```

---

## 📊 Data Flow Diagram

### Authentication Flow

```
User Input (LoginView.vue)
    ↓
authService.login(email, password)
    ↓
POST /api/login
    ↓
routes.ts → AuthController.login()
    ↓
Validator: Check email & password format
    ↓
User.verifyCredentials() → Database
    ↓
Generate JWT Token
    ↓
Return { user, token }
    ↓
Frontend: Save token to localStorage
    ↓
Pinia Store: Update auth state
    ↓
Vue Router: Redirect to dashboard
```

### Transaction CRUD Flow

```
User Action (TransactionForm.vue)
    ↓
transactionService.create(data)
    ↓
POST /api/transactions
    ↓
routes.ts → Middleware Auth → TransactionController.store()
    ↓
Validator: Check type, amount, date, etc
    ↓
Transaction.create() → Database
    ↓
Return transaction object
    ↓
Frontend: Update TransactionList.vue
```

### External API Flow

```
User Action (ExchangeRate.vue)
    ↓
exchangeRateService.convert(from, to, amount)
    ↓
POST /api/exchange-rates/convert
    ↓
routes.ts → Middleware Auth → ExchangeRateController.convert()
    ↓
Validator: Check from, to, amount
    ↓
ExchangeRateService.convertCurrency()
    ↓
fetch() → ExchangeRate API (external)
    ↓
Return conversion result
    ↓
Frontend: Display result
```

---

## 🔍 Cara Membaca Project

### 1. Mulai dari Routes

```typescript
// start/routes.ts
router.post('/api/login', '#controllers/auth_controller.login')
```
Artinya: POST ke `/api/login` akan dihandle oleh `AuthController.login()`

### 2. Lihat Controller

```typescript
// app/controllers/auth_controller.ts
async login({ request, response }: HttpContext) {
  // Handle login logic
}
```

### 3. Cek Validator (jika ada)

```typescript
// app/validators/auth_validator.ts
export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string()
  })
)
```

### 4. Lihat Model (jika akses database)

```typescript
// app/models/user.ts
export default class User extends BaseModel {
  @column()
  declare email: string
}
```

### 5. Cek Service (jika ada business logic)

```typescript
// app/services/exchange_rate_service.ts
async convertCurrency(from, to, amount) {
  // Call external API
}
```

---

## 📚 File Penting untuk Dipelajari

### Backend (Urutan Belajar)

1. **start/routes.ts** - Lihat semua endpoint
2. **app/controllers/** - Lihat logic setiap endpoint
3. **app/models/** - Lihat struktur database
4. **app/validators/** - Lihat validation rules
5. **app/services/** - Lihat external API integration

### Frontend (Urutan Belajar)

1. **src/router/index.js** - Lihat semua halaman
2. **src/views/** - Lihat halaman utama
3. **src/components/** - Lihat komponen UI
4. **src/services/** - Lihat API calls
5. **src/stores/** - Lihat global state

---

## 🎯 Tips Navigasi

### Gunakan IDE Features

**VS Code:**
- `Ctrl+P` - Quick file search
- `Ctrl+Click` - Go to definition
- `F12` - Go to definition
- `Shift+F12` - Find all references
- `Ctrl+F` - Search in file
- `Ctrl+Shift+F` - Search in all files

### Cari Berdasarkan Feature

**Authentication:**
- Routes: `start/routes.ts` (line: /api/login)
- Controller: `app/controllers/auth_controller.ts`
- Model: `app/models/user.ts`
- Frontend: `src/views/LoginView.vue`

**Transactions:**
- Routes: `start/routes.ts` (line: /api/transactions)
- Controller: `app/controllers/transaction_controller.ts`
- Model: `app/models/transaction.ts`
- Frontend: `src/components/TransactionForm.vue`

**Currency Conversion:**
- Routes: `start/routes.ts` (line: /api/exchange-rates)
- Controller: `app/controllers/exchange_rate_controller.ts`
- Service: `app/services/exchange_rate_service.ts`
- Frontend: `src/components/ExchangeRate.vue`

---

**Selamat Belajar! 📚**
