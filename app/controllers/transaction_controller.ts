import { HttpContext } from '@adonisjs/core/http'
import Transaction from '#models/transaction'
import { DateTime } from 'luxon'

export default class TransactionController {
  async index({ auth }: HttpContext) {
    return await Transaction.query().where('user_id', auth.user!.id).orderBy('date', 'desc')
  }

  async store({ request, auth }: HttpContext) {
    const { type, amount, description, date, categoryId } = request.only([
      'type',
      'amount',
      'description',
      'date',
      'categoryId',
    ])

    if (!type || !['income', 'expense'].includes(type)) {
      return { error: 'type must be "income" or "expense"' }
    }
    if (!amount || amount <= 0) {
      return { error: 'amount must be a positive number' }
    }

    let transactionDate: DateTime
    if (date) {
      // Parse date string to DateTime
      transactionDate = DateTime.fromISO(date)
      if (!transactionDate.isValid) {
        return { error: 'Invalid date format. Use ISO format (YYYY-MM-DD)' }
      }
    } else {
      transactionDate = DateTime.now()
    }

    const transaction = await Transaction.create({
      userId: auth.user!.id,
      type,
      amount: Number(amount),
      description: description || null,
      categoryId: categoryId ? Number(categoryId) : null,
      date: transactionDate,
    })

    return transaction
  }

  async show({ params, auth }: HttpContext) {
    const transaction = await Transaction.query()
      .where('id', params.id)
      .where('user_id', auth.user!.id)
      .firstOrFail()
    return transaction
  }

  async update({ request, params, auth }: HttpContext) {
    const transaction = await Transaction.query()
      .where('id', params.id)
      .where('user_id', auth.user!.id)
      .firstOrFail()

    const { type, amount, description, categoryId } = request.only([
      'type',
      'amount',
      'description',
      'categoryId',
    ])

    if (type && ['income', 'expense'].includes(type)) {
      transaction.type = type
    }
    if (amount && amount > 0) {
      transaction.amount = Number(amount)
    }
    if (description !== undefined) {
      transaction.description = description || null
    }
    if (categoryId !== undefined) {
      transaction.categoryId = categoryId ? Number(categoryId) : null
    }

    await transaction.save()
    return transaction
  }

  async destroy({ params, auth }: HttpContext) {
    const transaction = await Transaction.query()
      .where('id', params.id)
      .where('user_id', auth.user!.id)
      .firstOrFail()

    await transaction.delete()
    return { message: 'Transaction deleted' }
  }
}
