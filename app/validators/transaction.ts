import vine from '@vinejs/vine'

export const storeTransactionValidator = vine.compile(
  vine.object({
    type: vine.enum(['income', 'expense']),
    amount: vine.number().min(0.01).max(999999999.99),
    description: vine.string().trim().maxLength(255).optional(),
    date: vine.date(),
    categoryId: vine.number().optional(),
  })
)

export const updateTransactionValidator = vine.compile(
  vine.object({
    type: vine.enum(['income', 'expense']).optional(),
    amount: vine.number().min(0.01).max(999999999.99).optional(),
    description: vine.string().trim().maxLength(255).optional(),
    date: vine.date().optional(),
    categoryId: vine.number().optional(),
  })
)
