import type { HttpContext } from '@adonisjs/core/http'
import AlphaVantageService from '#services/alpha_vantage_service'
import {
  getStockQuoteValidator,
  searchStockValidator,
  getMultipleQuotesValidator,
} from '#validators/stock_validator'

export default class StockController {
  /**
   * GET /api/stocks/quote
   * Get real-time stock quote
   */
  async quote({ request, response }: HttpContext) {
    try {
      const { symbol } = await request.validateUsing(getStockQuoteValidator)
      const service = new AlphaVantageService()
      const data = await service.getStockQuote(symbol)

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
   * GET /api/stocks/search
   * Search for stock symbols
   */
  async search({ request, response }: HttpContext) {
    try {
      const { keywords } = await request.validateUsing(searchStockValidator)
      const service = new AlphaVantageService()
      const data = await service.searchSymbol(keywords)

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
   * POST /api/stocks/quotes
   * Get multiple stock quotes
   */
  async multipleQuotes({ request, response }: HttpContext) {
    try {
      const { symbols } = await request.validateUsing(getMultipleQuotesValidator)
      const service = new AlphaVantageService()
      const data = await service.getMultipleQuotes(symbols)

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
}
