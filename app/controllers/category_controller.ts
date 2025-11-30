import { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Category from '#models/category'
import { updateCategoryValidator } from '#validators/category'
import Transaction from '#models/transaction'
import { storeTransactionValidator } from '#validators/transaction'

export default class CategoryController {
  async index({ auth }: HttpContext) {
    const categories = await Category.query().where('user_id', auth.user!.id)
    return categories
  }

  async store({ request, auth }: HttpContext) {
    const payload = await request.validateUsing(storeTransactionValidator)
    const data = {
      userId: auth.user!.id,
      type: payload.type,
      amount: payload.amount,
      description: payload.description || null,
      date: DateTime.fromJSDate(payload.date),
      categoryId: payload.categoryId || null,
    }

    const transaction = await Transaction.create(data)
    return transaction
  }
  async update({ request, params, auth }: HttpContext) {
    const category = await Category.findByOrFail('id', params.id)
    if (category.userId !== auth.user!.id) {
      throw new Error('Unauthorized')
    }
    const payload = await request.validateUsing(updateCategoryValidator)
    category.merge(payload)
    await category.save()
    return category
  }

  async destroy({ params, auth }: HttpContext) {
    const category = await Category.findByOrFail('id', params.id)
    if (category.userId !== auth.user!.id) {
      throw new Error('Unauthorized')
    }
    await category.delete()
    return { message: 'Deleted' }
  }
}
