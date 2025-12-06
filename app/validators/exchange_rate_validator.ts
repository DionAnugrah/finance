import vine from '@vinejs/vine'

export const getLatestRatesValidator = vine.compile(
  vine.object({
    base: vine
      .string()
      .optional()
      .transform((value) => value?.toUpperCase()),
  })
)

export const convertCurrencyValidator = vine.compile(
  vine.object({
    from: vine.string().toUpperCase(),
    to: vine.string().toUpperCase(),
    amount: vine.number().positive(),
  })
)

export const getPairRateValidator = vine.compile(
  vine.object({
    from: vine.string().toUpperCase(),
    to: vine.string().toUpperCase(),
  })
)
