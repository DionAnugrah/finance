import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

// API Routes - Authentication
router.post('/api/register', '#controllers/auth_controller.register')
router.post('/api/login', '#controllers/auth_controller.login')

const auth = middleware.auth({ guards: ['api'] })

// API Routes - Protected
router
  .group(() => {
    // Categories
    router.get('/categories', '#controllers/category_controller.store')
    router.put('/categories/:id', '#controllers/category_controller.update')
    router.delete('/categories/:id', '#controllers/category_controller.destroy')

    // Transactions
    router.get('/transactions', '#controllers/transaction_controller.index')
    router.post('/transactions', '#controllers/transaction_controller.store')
    router.put('/transactions/:id', '#controllers/transaction_controller.update')
    router.delete('/transactions/:id', '#controllers/transaction_controller.destroy')

    // Exchange Rate API
    router.get('/exchange-rates/latest', '#controllers/exchange_rate_controller.latest')
    router.post('/exchange-rates/convert', '#controllers/exchange_rate_controller.convert')
    router.get('/exchange-rates/pair', '#controllers/exchange_rate_controller.pair')
    router.get('/exchange-rates/codes', '#controllers/exchange_rate_controller.codes')

    // Stock API
    router.get('/stocks/quote', '#controllers/stock_controller.quote')
    router.get('/stocks/search', '#controllers/stock_controller.search')
    router.post('/stocks/quotes', '#controllers/stock_controller.multipleQuotes')
  })
  .prefix('/api')
  .use(auth)

// // Serve Vue.js app for all other routes (SPA)
// router.get('*', async ({ response }) => {
//   return response.download('resources/views/spa.html')
// })
