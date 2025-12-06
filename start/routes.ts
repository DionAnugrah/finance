import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import { Edge } from 'edge.js'
import path from 'node:path'

router.get('/', async () => {
  const edge = new Edge({ cache: false })
  edge.mount(path.join(process.cwd(), 'resources/views'))
  return edge.render('home')
})
router.post('/register', '#controllers/auth_controller.register')
router.post('/login', '#controllers/auth_controller.login')

const auth = middleware.auth({ guards: ['api'] })

router
  .group(() => {
    router.get('/categories', '#controllers/category_controller.index')
    router.post('/categories', '#controllers/category_controller.store')
    router.put('/categories/:id', '#controllers/category_controller.update')
    router.delete('/categories/:id', '#controllers/category_controller.destroy')

    router.get('/transactions', '#controllers/transaction_controller.index')
    router.post('/transactions', '#controllers/transaction_controller.store')
    router.put('/transactions/:id', '#controllers/transaction_controller.update')
    router.delete('/transactions/:id', '#controllers/transaction_controller.destroy')

    // Exchange Rate API routes
    router.get('/exchange-rates/latest', '#controllers/exchange_rate_controller.latest')
    router.post('/exchange-rates/convert', '#controllers/exchange_rate_controller.convert')
    router.get('/exchange-rates/pair', '#controllers/exchange_rate_controller.pair')
    router.get('/exchange-rates/codes', '#controllers/exchange_rate_controller.codes')

    // Stock API routes
    router.get('/stocks/quote', '#controllers/stock_controller.quote')
    router.get('/stocks/search', '#controllers/stock_controller.search')
    router.post('/stocks/quotes', '#controllers/stock_controller.multipleQuotes')
  })
  .use(auth)
