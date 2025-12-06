import api from './api'

export default {
  async getLatestRates(baseCurrency = 'USD') {
    const response = await api.get(`/exchange-rates/latest?base=${baseCurrency}`)
    return response.data
  },

  async convertCurrency(from, to, amount) {
    const response = await api.post('/exchange-rates/convert', { from, to, amount })
    return response.data
  },

  async getPairRate(from, to) {
    const response = await api.get(`/exchange-rates/pair?from=${from}&to=${to}`)
    return response.data
  },

  async getSupportedCodes() {
    const response = await api.get('/exchange-rates/codes')
    return response.data
  },
}
