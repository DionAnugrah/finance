import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator, loginValidator } from '#validators/auth'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    const { name, email, password } = await request.validateUsing(registerValidator)
    const user = await User.create({ name, email, password })
    const token = await User.accessTokens.create(user, ['*'], { name: 'default' })
    return response.created({ user: user.toJSON(), token: token.value!.release() })
  }

  async login({ request }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user, ['*'], { name: 'default' })
    return { user: user.toJSON(), token: token.value!.release() }
  }
}
