import env from '#start/env'

interface ExchangeRateResponse {
  result: string
  documentation: string
  terms_of_use: string
  time_last_update_unix: number
  time_last_update_utc: string
  time_next_update_unix: number
  time_next_update_utc: string
  base_code: string
  conversion_rates: Record<string, number>
}

interface ConversionResponse {
  result: string
  documentation: string
  terms_of_use: string
  time_last_update_unix: number
  time_last_update_utc: string
  time_next_update_unix: number
  time_next_update_utc: string
  base_code: string
  target_code: string
  conversion_rate: number
  conversion_result: number
}

interface PairConversionResponse {
  result: string
  documentation: string
  terms_of_use: string
  time_last_update_unix: number
  time_last_update_utc: string
  time_next_update_unix: number
  time_next_update_utc: string
  base_code: string
  target_code: string
  conversion_rate: number
}

export default class ExchangeRateService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = env.get('EXCHANGE_RATE_API_KEY')
    this.baseUrl = env.get('EXCHANGE_RATE_API_URL')
  }

  /**
   * Get latest exchange rates for a base currency
   */
  async getLatestRates(baseCurrency: string = 'USD'): Promise<ExchangeRateResponse> {
    const url = `${this.baseUrl}/${this.apiKey}/latest/${baseCurrency.toUpperCase()}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch exchange rates: ${response.statusText}`)
    }

    const data = (await response.json()) as ExchangeRateResponse & {
      'result': string
      'error-type'?: string
    }

    if (data.result === 'error') {
      throw new Error(data['error-type'] || 'Unknown error from ExchangeRate API')
    }

    return data
  }

  /**
   * Convert amount from one currency to another
   */
  async convertCurrency(from: string, to: string, amount: number): Promise<ConversionResponse> {
    const url = `${this.baseUrl}/${this.apiKey}/pair/${from.toUpperCase()}/${to.toUpperCase()}/${amount}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to convert currency: ${response.statusText}`)
    }

    const data = (await response.json()) as ConversionResponse & {
      'result': string
      'error-type'?: string
    }

    if (data.result === 'error') {
      throw new Error(data['error-type'] || 'Unknown error from ExchangeRate API')
    }

    return data
  }

  /**
   * Get conversion rate between two currencies
   */
  async getPairRate(from: string, to: string): Promise<PairConversionResponse> {
    const url = `${this.baseUrl}/${this.apiKey}/pair/${from.toUpperCase()}/${to.toUpperCase()}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to get pair rate: ${response.statusText}`)
    }

    const data = (await response.json()) as PairConversionResponse & {
      'result': string
      'error-type'?: string
    }

    if (data.result === 'error') {
      throw new Error(data['error-type'] || 'Unknown error from ExchangeRate API')
    }

    return data
  }

  /**
   * Get supported currency codes
   */
  async getSupportedCodes(): Promise<{ result: string; supported_codes: [string, string][] }> {
    const url = `${this.baseUrl}/${this.apiKey}/codes`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch supported codes: ${response.statusText}`)
    }

    const data = (await response.json()) as {
      'result': string
      'supported_codes': [string, string][]
      'error-type'?: string
    }

    if (data.result === 'error') {
      throw new Error(data['error-type'] || 'Unknown error from ExchangeRate API')
    }

    return data
  }
}
