import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

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
  })
  .use(auth)
