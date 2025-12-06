# 📖 Cara Kerja Aplikasi Finance App

Panduan lengkap memahami logika dan cara kerja aplikasi dari A sampai Z.

---

## 📑 Daftar Isi

1. [Arsitektur Aplikasi](#1-arsitektur-aplikasi)
2. [Alur Kerja Aplikasi](#2-alur-kerja-aplikasi)
3. [Cara Membaca Kode](#3-cara-membaca-kode)
4. [Sistem Keamanan](#4-sistem-keamanan)
5. [Prinsip API](#5-prinsip-api)
6. [Database & Models](#6-database--models)
7. [Frontend Architecture](#7-frontend-architecture)
8. [External APIs](#8-external-apis)

---

## 1. Arsitektur Aplikasi

### 🏗️ Gambaran Umum

```
┌─────────────┐
│   Browser   │
│ (Frontend)  │
└──────┬──────┘
       │ HTTP Request
       ↓
┌─────────────┐
│   Nginx     │ (Production)
│  (Reverse   │
│   Proxy)    │
└──────┬──────┘
       │
       ↓
┌─────────────────────────────────────┐
│         AdonisJS Backend            │
│  ┌──────────────────────────────┐  │
│  │  Routes (start/routes.ts)    │  │
│  └────────────┬─────────────────┘  │
│               ↓                     │
│  ┌──────────────────────────────┐  │
│  │  Middleware (Auth, CORS)     │  │
│  └────────────┬─────────────────┘  │
│               ↓                     │
│  ┌──────────────────────────────┐  │
│  │  Controllers                 │  │
│  └────────────┬─────────────────┘  │
│               ↓                     │
│  ┌──────────────────────────────┐  │
│  │  Validators                  │  │
│  └────────────┬─────────────────┘  │
│               ↓                     │
│  ┌──────────────────────────────┐  │
│  │  Services / Models           │  │
│  └────────────┬─────────────────┘  │
└───────────────┼─────────────────────┘
                ↓
       ┌────────┴────────┐
       ↓                 ↓
┌─────────────┐   ┌─────────────┐
│   MySQL     │   │ External    │
│  Database   │   │   APIs      │
└─────────────┘   └─────────────┘
```

### 🔄 Teknologi Stack

**Backend:**
- **AdonisJS v6** - Framework Node.js (seperti Laravel untuk PHP)
- **TypeScript** - JavaScript dengan type safety
- **MySQL** - Database relational
- **JWT** - Token untuk authentication

**Frontend:**
- **Vue.js 3** - Framework JavaScript reactive
- **Vite** - Build tool yang cepat
- **Pinia** - State management (seperti Vuex)
- **Vue Router** - Routing client-side
- **Axios** - HTTP client

---

## 2. Alur Kerja Aplikasi

### 🔐 Alur Authentication (Login)

```
1. User input email & password di LoginView.vue
   ↓
2. authService.login() dipanggil
   ↓
3. Axios kirim POST /api/login ke backend
   ↓
4. Backend: routes.ts terima request
   ↓
5. AuthController.login() dijalankan
   ↓
6. Validator cek email & password format
   ↓
7. User.verifyCredentials() cek ke database
   ↓
8. Jika benar, generate JWT token
   ↓
9. Return { user, token } ke frontend
   ↓
10. Frontend simpan token di localStorage
    ↓
11. Pinia store update state isAuthenticated = true
    ↓
12. Vue Router redirect ke Dashboard
```

**Kode yang Terlibat:**

```
Frontend:
- resources/frontend/src/views/LoginView.vue
- resources/frontend/src/services/authService.js
- resources/frontend/src/stores/auth.js

Backend:
- start/routes.ts (route definition)
- app/controllers/auth_controller.ts
- app/validators/auth_validator.ts
- app/models/user.ts
```

### 💰 Alur Transaction (Create)

```
1. User isi form di TransactionForm.vue
   ↓
2. transactionService.create() dipanggil
   ↓
3. Axios kirim POST /api/transactions dengan token
   ↓
4. Backend: Middleware auth cek token
   ↓
5. Jika token valid, lanjut ke controller
   ↓
6. TransactionController.store() dijalankan
   ↓
7. Validator cek data (amount, description, dll)
   ↓
8. Transaction.create() simpan ke database
   ↓
9. Return transaction baru ke frontend
   ↓
10. Frontend update list di TransactionList.vue
```

### 💱 Alur Currency Conversion

```
1. User input amount & currencies di ExchangeRate.vue
   ↓
2. exchangeRateService.convert() dipanggil
   ↓
3. Axios kirim POST /api/exchange-rates/convert
   ↓
4. Backend: Middleware auth cek token
   ↓
5. ExchangeRateController.convert() dijalankan
   ↓
6. Validator cek from, to, amount
   ↓
7. ExchangeRateService.convertCurrency() dipanggil
   ↓
8. Service fetch ke ExchangeRate API eksternal
   ↓
9. API eksternal return hasil konversi
   ↓
10. Backend return hasil ke frontend
    ↓
11. Frontend tampilkan hasil di UI
```

**Penting:** API key disimpan di backend, tidak exposed ke frontend!

---

## 3. Cara Membaca Kode

### 📂 Mulai dari Mana?

**Untuk memahami flow aplikasi, baca dengan urutan ini:**

#### A. Backend Flow

**1. Routes (start/routes.ts)**
```typescript
// Ini adalah "peta" aplikasi
// Semua endpoint API didefinisikan di sini

router.post('/api/login', '#controllers/auth_controller.login')
// Artinya: POST ke /api/login akan dihandle oleh AuthController.login()
```

**2. Controllers (app/controllers/)**
```typescript
// Controller = traffic controller
// Terima request, proses, return response

export default class AuthController {
  async login({ request, response }: HttpContext) {
    // 1. Ambil data dari request
    const { email, password } = request.all()
    
    // 2. Validasi
    const payload = await request.validateUsing(loginValidator)
    
    // 3. Proses bisnis logic
    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)
    
    // 4. Return response
    return response.ok({ user, token })
  }
}
```

**3. Validators (app/validators/)**
```typescript
// Validator = security guard
// Cek apakah data yang masuk valid

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),      // Harus email valid
    password: vine.string().minLength(8) // Min 8 karakter
  })
)
```

**4. Models (app/models/)**
```typescript
// Model = representasi tabel database
// Interaksi dengan database

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare email: string

  @column({ serializeAs: null }) // Tidak di-return ke client
  declare password: string
}
```

**5. Services (app/services/)**
```typescript
// Service = business logic yang kompleks
// Biasanya untuk integrasi eksternal

export default class ExchangeRateService {
  async convertCurrency(from: string, to: string, amount: number) {
    // Panggil API eksternal
    const url = `${this.baseUrl}/${this.apiKey}/pair/${from}/${to}/${amount}`
    const response = await fetch(url)
    return response.json()
  }
}
```

#### B. Frontend Flow

**1. Router (resources/frontend/src/router/index.js)**
```javascript
// Router = peta halaman frontend

const routes = [
  {
    path: '/login',
    component: LoginView,
    meta: { requiresGuest: true } // Hanya untuk yang belum login
  },
  {
    path: '/',
    component: DashboardView,
    meta: { requiresAuth: true } // Harus login dulu
  }
]
```

**2. Views (resources/frontend/src/views/)**
```vue
<!-- View = halaman utama -->
<template>
  <div>
    <DashboardHeader />
    <TransactionForm @created="loadTransactions" />
    <TransactionList :transactions="transactions" />
  </div>
</template>

<script setup>
// Logic halaman
const transactions = ref([])

const loadTransactions = async () => {
  transactions.value = await transactionService.getAll()
}
</script>
```

**3. Components (resources/frontend/src/components/)**
```vue
<!-- Component = bagian UI yang reusable -->
<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="form.amount" type="number" />
    <button type="submit">Save</button>
  </form>
</template>

<script setup>
// Logic component
const form = reactive({
  amount: 0,
  description: ''
})

const handleSubmit = async () => {
  await transactionService.create(form)
  emit('created') // Beritahu parent component
}
</script>
```

**4. Services (resources/frontend/src/services/)**
```javascript
// Service = komunikasi dengan backend API

export default {
  async getAll() {
    const response = await api.get('/transactions')
    return response.data
  },
  
  async create(data) {
    const response = await api.post('/transactions', data)
    return response.data
  }
}
```

**5. Stores (resources/frontend/src/stores/)**
```javascript
// Store = state management global

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token')
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token
  },
  
  actions: {
    async login(email, password) {
      const { user, token } = await authService.login(email, password)
      this.user = user
      this.token = token
      localStorage.setItem('token', token)
    }
  }
})
```

### 🔍 Tips Membaca Kode

**1. Ikuti Request Flow:**
```
User Action → Service → API Call → Backend Route → 
Controller → Validator → Model/Service → Database/External API → 
Response → Frontend → Update UI
```

**2. Cari Keyword:**
- `router.post()` - Endpoint API
- `@column()` - Field database
- `vine.object()` - Validation rules
- `async/await` - Operasi asynchronous
- `ref()` / `reactive()` - Vue reactive data

**3. Gunakan IDE Features:**
- Ctrl+Click pada function untuk jump ke definisi
- Ctrl+F untuk search keyword
- F12 untuk go to definition

---

## 4. Sistem Keamanan

### 🔐 Authentication (JWT)

**Cara Kerja JWT:**

```
1. User login dengan email & password
   ↓
2. Backend verify credentials
   ↓
3. Jika benar, generate JWT token
   ↓
4. Token berisi: { userId, email, expiry }
   ↓
5. Token di-sign dengan APP_KEY (secret)
   ↓
6. Frontend simpan token di localStorage
   ↓
7. Setiap request, kirim token di header:
   Authorization: Bearer {token}
   ↓
8. Backend verify token signature
   ↓
9. Jika valid, extract userId dari token
   ↓
10. Request diproses dengan context user
```

**Kode Implementation:**

```typescript
// Backend: Generate token
const token = await User.accessTokens.create(user)

// Frontend: Simpan token
localStorage.setItem('token', token)

// Frontend: Kirim token di setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Backend: Verify token (middleware)
const auth = middleware.auth({ guards: ['api'] })
router.get('/transactions', '#controllers/transaction_controller.index').use(auth)
```

### 🛡️ Security Layers

**1. Password Hashing:**
```typescript
// Password TIDAK disimpan plain text
// Menggunakan bcrypt untuk hashing

@column({ serializeAs: null })
@column.hash()
declare password: string

// Saat register:
user.password = 'password123'
// Disimpan di DB: $2b$10$abcd...xyz (hash)
```

**2. Input Validation:**
```typescript
// Semua input divalidasi sebelum diproses

export const createTransactionValidator = vine.compile(
  vine.object({
    amount: vine.number().positive(),        // Harus angka positif
    description: vine.string().minLength(3), // Min 3 karakter
    type: vine.enum(['income', 'expense']),  // Hanya 2 nilai ini
    date: vine.date()                        // Harus format date
  })
)
```

**3. CORS Protection:**
```typescript
// Hanya domain tertentu yang bisa akses API

// config/cors.ts
origin: (origin) => {
  const allowedOrigins = [
    'http://localhost:5173',  // Development
    'https://yourdomain.com'  // Production
  ]
  return allowedOrigins.includes(origin)
}
```

**4. SQL Injection Protection:**
```typescript
// Lucid ORM otomatis escape query

// ❌ BAHAYA (raw query):
await db.rawQuery(`SELECT * FROM users WHERE email = '${email}'`)

// ✅ AMAN (ORM):
await User.findBy('email', email)
// Query: SELECT * FROM users WHERE email = ? [email]
```

**5. XSS Protection:**
```vue
<!-- Vue otomatis escape HTML -->

<!-- ❌ BAHAYA: -->
<div v-html="userInput"></div>

<!-- ✅ AMAN: -->
<div>{{ userInput }}</div>
<!-- <script>alert('xss')</script> → &lt;script&gt;alert('xss')&lt;/script&gt; -->
```

### 🔑 API Key Security

**Prinsip: API Key TIDAK boleh di frontend!**

```
❌ SALAH:
Frontend → External API (dengan API key di code)
// API key bisa dilihat di browser!

✅ BENAR:
Frontend → Backend → External API
// API key aman di server
```

**Implementation:**

```typescript
// Backend: app/services/exchange_rate_service.ts
export default class ExchangeRateService {
  private apiKey: string

  constructor() {
    // API key dari environment variable
    this.apiKey = env.get('EXCHANGE_RATE_API_KEY')
  }

  async getLatestRates(base: string) {
    // API key digunakan di backend
    const url = `${this.baseUrl}/${this.apiKey}/latest/${base}`
    const response = await fetch(url)
    return response.json()
  }
}

// Frontend hanya panggil backend:
const rates = await exchangeRateService.getLatest('USD')
// Frontend TIDAK tahu API key!
```

---

## 5. Prinsip API

### 🎯 RESTful API Design

**Prinsip REST:**

```
Resource-based URLs:
✅ /api/transactions
✅ /api/transactions/123
❌ /api/getTransactions
❌ /api/deleteTransaction

HTTP Methods:
GET    - Read data
POST   - Create data
PUT    - Update data (full)
PATCH  - Update data (partial)
DELETE - Delete data

Status Codes:
200 - OK
201 - Created
400 - Bad Request
401 - Unauthorized
404 - Not Found
500 - Server Error
```

**Contoh Implementation:**

```typescript
// CRUD Transactions

// GET /api/transactions - List all
router.get('/transactions', '#controllers/transaction_controller.index')

// POST /api/transactions - Create new
router.post('/transactions', '#controllers/transaction_controller.store')

// PUT /api/transactions/:id - Update
router.put('/transactions/:id', '#controllers/transaction_controller.update')

// DELETE /api/transactions/:id - Delete
router.delete('/transactions/:id', '#controllers/transaction_controller.destroy')
```

### 📦 Request/Response Format

**Request:**
```json
POST /api/transactions
Headers:
  Content-Type: application/json
  Authorization: Bearer eyJhbGc...

Body:
{
  "amount": 50000,
  "description": "Lunch",
  "type": "expense",
  "date": "2024-01-15",
  "category_id": 1
}
```

**Response Success:**
```json
HTTP 201 Created
{
  "id": 123,
  "amount": 50000,
  "description": "Lunch",
  "type": "expense",
  "date": "2024-01-15",
  "category_id": 1,
  "user_id": 1,
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

**Response Error:**
```json
HTTP 400 Bad Request
{
  "errors": [
    {
      "field": "amount",
      "message": "The amount field must be a positive number"
    }
  ]
}
```

### 🔄 API Versioning

```typescript
// Saat ini: /api/...
// Jika ada breaking changes di masa depan:

router.group(() => {
  // v1 routes
}).prefix('/api/v1')

router.group(() => {
  // v2 routes (new features)
}).prefix('/api/v2')
```

---

## 6. Database & Models

### 🗄️ Database Schema

**Users Table:**
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Categories Table:**
```sql
CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  type ENUM('income', 'expense') NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

**Transactions Table:**
```sql
CREATE TABLE transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  amount DECIMAL(15,2) NOT NULL,
  description TEXT,
  type ENUM('income', 'expense') NOT NULL,
  date DATE NOT NULL,
  category_id INT,
  user_id INT NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 🔗 Relationships

```typescript
// User has many Transactions
export default class User extends BaseModel {
  @hasMany(() => Transaction)
  declare transactions: HasMany<typeof Transaction>
}

// Transaction belongs to User
export default class Transaction extends BaseModel {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
  
  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>
}

// Query dengan relationship:
const user = await User.query()
  .where('id', 1)
  .preload('transactions', (query) => {
    query.preload('category')
  })

// Result:
{
  id: 1,
  email: "user@example.com",
  transactions: [
    {
      id: 1,
      amount: 50000,
      category: {
        id: 1,
        name: "Food"
      }
    }
  ]
}
```

### 📝 Migrations

**Cara Kerja:**

```
1. Buat migration file:
   node ace make:migration create_users_table

2. Edit migration:
   database/migrations/xxx_create_users_table.ts

3. Run migration:
   node ace migration:run

4. Database table dibuat otomatis
```

**Contoh Migration:**

```typescript
export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.decimal('amount', 15, 2).notNullable()
      table.text('description')
      table.enum('type', ['income', 'expense']).notNullable()
      table.date('date').notNullable()
      table.integer('category_id').unsigned().references('categories.id')
      table.integer('user_id').unsigned().references('users.id').notNullable()
      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
```

---

## 7. Frontend Architecture

### 🎨 Component Structure

**Hierarchy:**

```
App.vue (Root)
  ├── LoginView.vue (Page)
  │   └── Form components
  │
  └── DashboardView.vue (Page)
      ├── DashboardHeader.vue (Component)
      ├── TransactionForm.vue (Component)
      ├── TransactionList.vue (Component)
      ├── ExchangeRate.vue (Component)
      └── StockTracker.vue (Component)
```

### 🔄 State Management (Pinia)

**Kenapa Perlu State Management?**

```
Tanpa Pinia:
- Data user disimpan di setiap component
- Susah sync data antar component
- Banyak prop drilling

Dengan Pinia:
- Data user di satu tempat (store)
- Semua component akses store yang sama
- Data selalu sync
```

**Contoh:**

```javascript
// stores/auth.js
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    userName: (state) => state.user?.email
  },
  
  actions: {
    async login(email, password) {
      const data = await authService.login(email, password)
      this.user = data.user
      this.token = data.token
    },
    
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
    }
  }
})

// Digunakan di component:
const authStore = useAuthStore()
console.log(authStore.isAuthenticated) // true/false
authStore.logout()
```

### 🚦 Routing & Navigation Guards

```javascript
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Halaman butuh login?
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login') // Redirect ke login
  }
  // Halaman untuk guest only?
  else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/') // Redirect ke dashboard
  }
  else {
    next() // Lanjutkan
  }
})
```

### 📡 API Communication

**Axios Interceptors:**

```javascript
// Request interceptor: Tambah token otomatis
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: Handle error global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, logout
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

---

## 8. External APIs

### 💱 ExchangeRate API

**Flow:**

```
Frontend Request
  ↓
Backend Controller
  ↓
ExchangeRateService
  ↓
fetch('https://v6.exchangerate-api.com/v6/{API_KEY}/latest/USD')
  ↓
External API Response
  ↓
Backend Process & Return
  ↓
Frontend Display
```

**Kenapa Lewat Backend?**

1. **Security:** API key tidak exposed
2. **Rate Limiting:** Backend bisa cache response
3. **Error Handling:** Centralized error handling
4. **Logging:** Track API usage

**Implementation:**

```typescript
// app/services/exchange_rate_service.ts
export default class ExchangeRateService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = env.get('EXCHANGE_RATE_API_KEY')
    this.baseUrl = env.get('EXCHANGE_RATE_API_URL')
  }

  async convertCurrency(from: string, to: string, amount: number) {
    // Build URL dengan API key
    const url = `${this.baseUrl}/${this.apiKey}/pair/${from}/${to}/${amount}`
    
    // Fetch dari external API
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error('Failed to convert currency')
    }

    const data = await response.json() as ConversionResponse
    
    // Check error dari API
    if (data.result === 'error') {
      throw new Error(data['error-type'] || 'Unknown error')
    }

    return data
  }
}
```

### 📈 Alpha Vantage API

**Rate Limiting:**

```typescript
// app/services/alpha_vantage_service.ts
export default class AlphaVantageService {
  private lastRequestTime: number = 0
  private minDelay: number = 500 // 500ms between requests

  async getStockQuote(symbol: string) {
    // Implement rate limiting
    await this.waitForRateLimit()
    
    const url = `${this.baseUrl}/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKey}`
    const response = await fetch(url)
    
    return response.json()
  }

  private async waitForRateLimit() {
    const now = Date.now()
    const timeSinceLastRequest = now - this.lastRequestTime
    
    if (timeSinceLastRequest < this.minDelay) {
      const waitTime = this.minDelay - timeSinceLastRequest
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
    
    this.lastRequestTime = Date.now()
  }
}
```

**Error Handling:**

```typescript
async getStockQuote(symbol: string) {
  const data = await this.fetchFromAPI(symbol)
  
  // Check berbagai jenis error
  if (data['Error Message']) {
    throw new Error('Invalid stock symbol')
  }
  
  if (data['Note']) {
    throw new Error('API rate limit exceeded. Please wait.')
  }
  
  if (!data['Global Quote']) {
    throw new Error('No data available')
  }
  
  return this.formatStockData(data['Global Quote'])
}
```

---

## 🎓 Kesimpulan

### Prinsip Utama Aplikasi:

1. **Separation of Concerns**
   - Backend: Business logic, database, security
   - Frontend: UI, user interaction
   - External APIs: Data source

2. **Security First**
   - JWT authentication
   - Password hashing
   - Input validation
   - API key protection
   - CORS configuration

3. **RESTful API**
   - Resource-based URLs
   - HTTP methods semantic
   - Proper status codes
   - JSON format

4. **Clean Architecture**
   - Routes → Controllers → Validators → Services/Models
   - Components → Services → API → Backend
   - Clear separation of layers

5. **Error Handling**
   - Validation errors
   - Authentication errors
   - External API errors
   - Database errors

### Tips Belajar Lebih Lanjut:

1. **Trace Request Flow**
   - Pilih satu fitur (misal: create transaction)
   - Ikuti dari klik button sampai data masuk database
   - Catat setiap file yang terlibat

2. **Eksperimen**
   - Ubah kode sedikit-sedikit
   - Lihat efeknya
   - Pelajari error message

3. **Baca Documentation**
   - AdonisJS: https://docs.adonisjs.com/
   - Vue.js: https://vuejs.org/
   - Pinia: https://pinia.vuejs.org/

4. **Debug dengan Console.log**
   ```typescript
   console.log('Data received:', data)
   console.log('User:', user)
   ```

5. **Gunakan Browser DevTools**
   - Network tab: Lihat API calls
   - Console tab: Lihat errors
   - Vue DevTools: Inspect components

---

**Selamat belajar! 🚀**
