import vine from '@vinejs/vine'

export const getStockQuoteValidator = vine.compile(
  vine.object({
    symbol: vine.string().toUpperCase().trim(),
  })
)

export const searchStockValidator = vine.compile(
  vine.object({
    keywords: vine.string().trim().minLength(1),
  })
)

export const getMultipleQuotesValidator = vine.compile(
  vine.object({
    symbols: vine.array(vine.string().toUpperCase().trim()).minLength(1).maxLength(10),
  })
)
