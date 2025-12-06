# 💰 Finance App

Modern finance management application dengan Vue.js 3 + AdonisJS v6

---

## � Taible of Contents

- [Quick Start](#-quick-start)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [External APIs](#-external-apis)
- [Troubleshooting](#-troubleshooting)
- [Deployment](#-deployment)
- [Environment Variables](#-environment-variables)

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Backend
npm install

# Frontend
cd resources/frontend
npm install
cd ../..
```

### 2. Setup Database

```sql
CREATE DATABASE finance_app;
```

Edit `.env`:
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_DATABASE=finance_app
```

Generate APP_KEY:
```bash
node ace generate:key
```

Run migrations:
```bash
node ace migration:run
```

### 3. Jalankan Aplikasi

**Terminal 1 - Backend:**
```bash
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd resources/frontend
npm run dev
```

**Browser:**
```
http://localhost:5173
```

### 4. First Login

Create user via API:
```bash
curl -X POST http://localhost:3333/api/register -H "Content-Type: application/json" -d "{\"email\":\"admin@test.com\",\"password\":\"password123\"}"
```

Login:
- Email: `admin@test.com`
- Password: `password123`

---

## ✨ Features

- ✅ Authentication (JWT)
- ✅ Transaction Management (CRUD)
- ✅ Currency Converter (ExchangeRate API)
- ✅ Stock Tracker (Alpha Vantage API)
- ✅ Modern UI (Glassmorphism)
- ✅ Responsive Design

---

## 🛠️ Tech Stack

**Backend:**
- AdonisJS v6
- MySQL
- JWT Authentication
- TypeScript

**Frontend:**
- Vue.js 3 (Composition API)
- Vite
- Pinia (State Management)
- Vue Router
- Axios

---

## 📁 Project Structure

```
finance-app/
├── app/                          # Backend
│   ├── controllers/             # API controllers
│   ├── services/                # Business logic
│   ├── models/                  # Database models
│   └── validators/              # Input validation
│
├── resources/frontend/          # Vue.js Frontend
│   ├── src/
│   │   ├── components/          # Vue components (5)
│   │   ├── views/               # Pages (2)
│   │   ├── services/            # API services (4)
│   │   ├── stores/              # Pinia stores
│   │   └── router/              # Vue Router
│   └── package.json
│
├── start/
│   └── routes.ts                # API routes
│
├── config/                      # Configuration
├── database/                    # Migrations
└── .env                         # Environment variables
```

---

## 📡 API Documentation

Base URL: `http://localhost:3333/api`

### Authentication

**Register:**
```bash
POST /api/register
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Login:**
```bash
POST /api/login
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

### Transactions (Protected)

**Headers Required:**
```
Authorization: Bearer {token}
```

**Endpoints:**
```bash
GET    /api/transactions
POST   /api/transactions
PUT    /api/transactions/:id
DELETE /api/transactions/:id
```

**Create Transaction:**
```json
{
  "amount": 50000,
  "description": "Lunch",
  "type": "expense",
  "date": "2024-01-15",
  "category_id": 1
}
```

### Exchange Rates (Protected)

**Get Latest Rates:**
```bash
GET /api/exchange-rates/latest?base=USD
```

**Convert Currency:**
```bash
POST /api/exchange-rates/convert
{
  "from": "USD",
  "to": "IDR",
  "amount": 100
}
```

**Get Pair Rate:**
```bash
GET /api/exchange-rates/pair?from=USD&to=IDR
```

**Get Supported Codes:**
```bash
GET /api/exchange-rates/codes
```

### Stocks (Protected)

**Get Stock Quote:**
```bash
GET /api/stocks/quote?symbol=AAPL
```

**Search Symbol:**
```bash
GET /api/stocks/search?keywords=Apple
```

**Get Multiple Quotes:**
```bash
POST /api/stocks/quotes
{
  "symbols": ["AAPL", "GOOGL", "MSFT"]
}
```

### Error Responses

**400 Bad Request:**
```json
{
  "errors": [
    {
      "field": "email",
      "message": "The email field must be a valid email address"
    }
  ]
}
```

**401 Unauthorized:**
```json
{
  "message": "Unauthorized access"
}
```

---

## 🌐 External APIs

### ExchangeRate API

**Setup:**
1. Sign up: https://www.exchangerate-api.com/
2. Get free API key
3. Add to `.env`:
   ```env
   EXCHANGE_RATE_API_KEY=your_key_here
   EXCHANGE_RATE_API_URL=https://v6.exchangerate-api.com/v6
   ```

**Features:**
- Latest exchange rates for all currencies
- Currency conversion
- Pair rate lookup
- 170+ supported currencies

**Free Tier:** 1,500 requests/month

### Alpha Vantage API

**Setup:**
1. Sign up: https://www.alphavantage.co/
2. Get free API key
3. Add to `.env`:
   ```env
   ALPHA_VANTAGE_API_KEY=your_key_here
   ALPHA_VANTAGE_API_URL=https://www.alphavantage.co
   ```

**Features:**
- Real-time stock quotes
- Symbol search
- Multiple stock quotes

**Free Tier:** 500 requests/day, 5 requests/minute

**Rate Limiting:**
- App implements 500ms delay between requests
- Automatic queue management

**Popular Symbols:**
- AAPL (Apple), GOOGL (Google), MSFT (Microsoft)
- AMZN (Amazon), TSLA (Tesla), META (Facebook)

---

## 🐛 Troubleshooting

### Tampilan Putih Kosong

**Cause:** Frontend dependencies not installed or dev server not running

**Solution:**
```bash
cd resources/frontend
npm install
npm run dev
```

### Port Already in Use

**Backend (.env):**
```env
PORT=3334
```

**Frontend (vite.config.js):**
```javascript
server: { port: 5174 }
```

### Database Connection Error

**Check MySQL is running:**
```bash
net start MySQL80
```

**Verify credentials in `.env`:**
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_DATABASE=finance_app
```

**Create database:**
```sql
CREATE DATABASE finance_app;
```

### Missing APP_KEY

```bash
node ace generate:key
```

Copy output to `.env`:
```env
APP_KEY=generated_key_here
```

### Migration Errors

**Reset migrations:**
```bash
node ace migration:rollback
node ace migration:run
```

**Fresh migration (deletes all data):**
```bash
node ace migration:fresh
```

### CORS Error

**Verify both servers running:**
- Backend: http://localhost:3333
- Frontend: http://localhost:5173

**Check CORS config** in `config/cors.ts`:
```typescript
origin: (origin) => {
  if (
    origin === 'http://localhost:5173' ||
    origin === 'http://localhost:3333' ||
    !origin
  ) {
    return true
  }
  return false
}
```

### Authentication Errors

**Clear localStorage:**
```javascript
localStorage.clear()
```

Then login again.

### API Key Errors

**ExchangeRate API:**
1. Get key: https://www.exchangerate-api.com/
2. Add to `.env`
3. Restart backend

**Alpha Vantage API:**
1. Get key: https://www.alphavantage.co/
2. Add to `.env`
3. Wait 1 minute if rate limit exceeded
4. Restart backend

### Complete Reset

```bash
# Stop all servers (Ctrl+C)

# Backend
rmdir /s /q node_modules
del package-lock.json
npm install

# Frontend
cd resources\frontend
rmdir /s /q node_modules
del package-lock.json
npm install
cd ..\..

# Database
node ace migration:fresh

# Restart both servers
```

---

## 🚀 Deployment

### Build Process

**1. Build Frontend:**
```bash
cd resources/frontend
npm run build
```

Output: `public/dist/`

**2. Build Backend:**
```bash
node ace build
```

Output: `build/`

**3. Install Production Dependencies:**
```bash
cd build
npm ci --omit=dev
```

### VPS Deployment (Ubuntu)

**1. Setup Server:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL
sudo apt install -y mysql-server

# Install Nginx
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2
```

**2. Upload Files:**
```bash
scp -r build/ user@server:/var/www/finance-app/
scp -r public/ user@server:/var/www/finance-app/
```

**3. Configure Environment:**
```bash
cd /var/www/finance-app/build
nano .env
```

**4. Setup Database:**
```sql
CREATE DATABASE finance_app;
CREATE USER 'finance_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON finance_app.* TO 'finance_user'@'localhost';
FLUSH PRIVILEGES;
```

```bash
node ace migration:run --force
```

**5. Start with PM2:**
```bash
pm2 start bin/server.js --name finance-app
pm2 save
pm2 startup
```

**6. Configure Nginx:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/finance-app/public/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3333;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**7. Setup SSL:**
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Docker Deployment

**Dockerfile:**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY resources/frontend/package*.json ./resources/frontend/
RUN npm ci --omit=dev
RUN cd resources/frontend && npm ci
COPY . .
RUN cd resources/frontend && npm run build
RUN node ace build
EXPOSE 3333
CMD ["node", "build/bin/server.js"]
```

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3333:3333"
    environment:
      - NODE_ENV=production
      - DB_HOST=db
    depends_on:
      - db
  db:
    image: mysql:8
    environment:
      - MYSQL_DATABASE=finance_app
      - MYSQL_USER=finance_user
      - MYSQL_PASSWORD=secure_password
    volumes:
      - mysql_data:/var/lib/mysql
volumes:
  mysql_data:
```

**Deploy:**
```bash
docker-compose up -d
docker-compose exec app node ace migration:run --force
```

### Security Checklist

- [ ] Use strong passwords
- [ ] Never commit `.env` to Git
- [ ] Use HTTPS in production
- [ ] Configure CORS for production domain
- [ ] Rotate API keys regularly
- [ ] Setup database backups
- [ ] Enable rate limiting
- [ ] Monitor logs

---

## 🔐 Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# App
TZ=UTC
PORT=3333
HOST=0.0.0.0
APP_KEY=generate_with_node_ace_generate_key
NODE_ENV=development

# Database
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_DATABASE=finance_app

# ExchangeRate API
EXCHANGE_RATE_API_KEY=your_api_key
EXCHANGE_RATE_API_URL=https://v6.exchangerate-api.com/v6

# Alpha Vantage API
ALPHA_VANTAGE_API_KEY=your_api_key
ALPHA_VANTAGE_API_URL=https://www.alphavantage.co
```

---

## 📝 Development

### Run Tests

```bash
npm test
```

### Lint

```bash
npm run lint
```

### Format

```bash
npm run format
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## 📄 License

MIT License

---

**Built with ❤️ using AdonisJS & Vue.js**
