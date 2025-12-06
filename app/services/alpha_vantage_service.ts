import env from '#start/env'

interface StockQuote {
  symbol: string
  price: number
  change: number
  changePercent: string
  volume: number
  latestTradingDay: string
  previousClose: number
  open: number
  high: number
  low: number
}

interface SearchResult {
  symbol: string
  name: string
  type: string
  region: string
  currency: string
}

export default class AlphaVantageService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = env.get('ALPHA_VANTAGE_API_KEY')
    this.baseUrl = env.get('ALPHA_VANTAGE_API_URL')
  }

  /**
   * Get real-time stock quote
   */
  async getStockQuote(symbol: string): Promise<StockQuote> {
    const url = `${this.baseUrl}?function=GLOBAL_QUOTE&symbol=${symbol.toUpperCase()}&apikey=${this.apiKey}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch stock quote: ${response.statusText}`)
    }

    const data = (await response.json()) as {
      'Global Quote': {
        '01. symbol': string
        '05. price': string
        '09. change': string
        '10. change percent': string
        '06. volume': string
        '07. latest trading day': string
        '08. previous close': string
        '02. open': string
        '03. high': string
        '04. low': string
      }
      'Note'?: string
      'Error Message'?: string
    }

    if (data['Error Message']) {
      throw new Error('Invalid stock symbol or API error')
    }

    if (data.Note) {
      throw new Error('API call frequency limit reached. Please try again later.')
    }

    const quote = data['Global Quote']

    if (!quote || !quote['01. symbol']) {
      throw new Error('Stock data not available')
    }

    return {
      symbol: quote['01. symbol'],
      price: Number.parseFloat(quote['05. price']),
      change: Number.parseFloat(quote['09. change']),
      changePercent: quote['10. change percent'],
      volume: Number.parseInt(quote['06. volume']),
      latestTradingDay: quote['07. latest trading day'],
      previousClose: Number.parseFloat(quote['08. previous close']),
      open: Number.parseFloat(quote['02. open']),
      high: Number.parseFloat(quote['03. high']),
      low: Number.parseFloat(quote['04. low']),
    }
  }

  /**
   * Search for stock symbols
   */
  async searchSymbol(keywords: string): Promise<SearchResult[]> {
    const url = `${this.baseUrl}?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(keywords)}&apikey=${this.apiKey}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to search symbols: ${response.statusText}`)
    }

    const data = (await response.json()) as {
      bestMatches: Array<{
        '1. symbol': string
        '2. name': string
        '3. type': string
        '4. region': string
        '8. currency': string
      }>
      Note?: string
    }

    if (data.Note) {
      throw new Error('API call frequency limit reached. Please try again later.')
    }

    if (!data.bestMatches || data.bestMatches.length === 0) {
      return []
    }

    return data.bestMatches.slice(0, 10).map((match) => ({
      symbol: match['1. symbol'],
      name: match['2. name'],
      type: match['3. type'],
      region: match['4. region'],
      currency: match['8. currency'],
    }))
  }

  /**
   * Get multiple stock quotes at once
   */
  async getMultipleQuotes(symbols: string[]): Promise<StockQuote[]> {
    const quotes: StockQuote[] = []

    for (const symbol of symbols) {
      try {
        const quote = await this.getStockQuote(symbol)
        quotes.push(quote)
        // Add small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 500))
      } catch (error) {
        console.error(`Failed to fetch quote for ${symbol}:`, error)
      }
    }

    return quotes
  }
}
