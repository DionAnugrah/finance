import vine from '@vinejs/vine'

export const storeCategoryValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2),
    type: vine.enum(['income', 'expense']),
  })
)

export const updateCategoryValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).optional(),
    type: vine.enum(['income', 'expense']).optional(),
  })
)
