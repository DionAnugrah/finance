import type { HttpContext } from '@adonisjs/core/http'
import ExchangeRateService from '#services/exchange_rate_service'
import {
  getLatestRatesValidator,
  convertCurrencyValidator,
  getPairRateValidator,
} from '#validators/exchange_rate_validator'

export default class ExchangeRateController {
  /**
   * GET /api/exchange-rates/latest
   * Get latest exchange rates for a base currency
   */
  async latest({ request, response }: HttpContext) {
    try {
      const { base } = await request.validateUsing(getLatestRatesValidator)
      const service = new ExchangeRateService()
      const data = await service.getLatestRates(base || 'USD')

      return response.ok({
        success: true,
        data,
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: error.message,
      })
    }
  }

  /**
   * POST /api/exchange-rates/convert
   * Convert amount from one currency to another
   */
  async convert({ request, response }: HttpContext) {
    try {
      const { from, to, amount } = await request.validateUsing(convertCurrencyValidator)
      const service = new ExchangeRateService()
      const data = await service.convertCurrency(from, to, amount)

      return response.ok({
        success: true,
        data: {
          from: data.base_code,
          to: data.target_code,
          amount,
          conversion_rate: data.conversion_rate,
          converted_amount: data.conversion_result,
          last_update: data.time_last_update_utc,
        },
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: error.message,
      })
    }
  }

  /**
   * GET /api/exchange-rates/pair
   * Get conversion rate between two currencies
   */
  async pair({ request, response }: HttpContext) {
    try {
      const { from, to } = await request.validateUsing(getPairRateValidator)
      const service = new ExchangeRateService()
      const data = await service.getPairRate(from, to)

      return response.ok({
        success: true,
        data: {
          from: data.base_code,
          to: data.target_code,
          rate: data.conversion_rate,
          last_update: data.time_last_update_utc,
        },
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: error.message,
      })
    }
  }

  /**
   * GET /api/exchange-rates/codes
   * Get all supported currency codes
   */
  async codes({ response }: HttpContext) {
    try {
      const service = new ExchangeRateService()
      const data = await service.getSupportedCodes()

      return response.ok({
        success: true,
        data: {
          codes: data.supported_codes.map(([code, name]) => ({
            code,
            name,
          })),
        },
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: error.message,
      })
    }
  }
}
