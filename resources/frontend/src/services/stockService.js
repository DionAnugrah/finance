import api from './api'

export default {
  async getQuote(symbol) {
    const response = await api.get(`/stocks/quote?symbol=${symbol}`)
    return response.data
  },

  async searchSymbol(keywords) {
    const response = await api.get(`/stocks/search?keywords=${encodeURIComponent(keywords)}`)
    return response.data
  },

  async getMultipleQuotes(symbols) {
    const response = await api.post('/stocks/quotes', { symbols })
    return response.data
  },
}
