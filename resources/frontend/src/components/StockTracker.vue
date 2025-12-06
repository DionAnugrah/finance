<template>
  <div class="card">
    <h2>📈 Stock Market Tracker</h2>

    <!-- Quick Quote -->
    <form @submit.prevent="getQuote" class="quick-quote-form">
      <input
        v-model="symbol"
        type="text"
        placeholder="Symbol (e.g., AAPL, MSFT)"
        required
      />
      <button type="submit" class="btn primary" :disabled="loading">
        {{ loading ? 'Loading...' : 'Get Quote' }}
      </button>
    </form>

    <!-- Popular Stocks -->
    <div class="popular-stocks">
      <h3>Popular Stocks</h3>
      <div class="stock-chips">
        <button
          v-for="stock in popularStocks"
          :key="stock.symbol"
          class="stock-chip"
          @click="getQuote(stock.symbol)"
        >
          {{ stock.emoji }} {{ stock.name }}
        </button>
      </div>
    </div>

    <!-- Stock Quote Result -->
    <div v-if="quote" class="stock-quote-result">
      <div class="stock-card">
        <div class="stock-header">
          <div>
            <div class="stock-symbol">{{ quote.symbol }}</div>
            <div class="stock-change" :class="quote.change >= 0 ? 'positive' : 'negative'">
              {{ quote.change >= 0 ? '▲' : '▼' }} {{ quote.change.toFixed(2) }} ({{
                quote.changePercent
              }})
            </div>
          </div>
          <div class="stock-price">${{ quote.price.toFixed(2) }}</div>
        </div>

        <div class="stock-details">
          <div class="stock-detail-item">
            <div class="stock-detail-label">Open</div>
            <div class="stock-detail-value">${{ quote.open.toFixed(2) }}</div>
          </div>
          <div class="stock-detail-item">
            <div class="stock-detail-label">High</div>
            <div class="stock-detail-value">${{ quote.high.toFixed(2) }}</div>
          </div>
          <div class="stock-detail-item">
            <div class="stock-detail-label">Low</div>
            <div class="stock-detail-value">${{ quote.low.toFixed(2) }}</div>
          </div>
          <div class="stock-detail-item">
            <div class="stock-detail-label">Volume</div>
            <div class="stock-detail-value">{{ formatNumber(quote.volume) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import stockService from '@/services/stockService'

const symbol = ref('AAPL')
const quote = ref(null)
const loading = ref(false)

const popularStocks = [
  { symbol: 'AAPL', name: 'Apple', emoji: '🍎' },
  { symbol: 'MSFT', name: 'Microsoft', emoji: '💻' },
  { symbol: 'GOOGL', name: 'Google', emoji: '🔍' },
  { symbol: 'AMZN', name: 'Amazon', emoji: '📦' },
  { symbol: 'TSLA', name: 'Tesla', emoji: '🚗' },
  { symbol: 'META', name: 'Meta', emoji: '📘' },
]

async function getQuote(sym) {
  const targetSymbol = typeof sym === 'string' ? sym : symbol.value
  loading.value = true

  try {
    const response = await stockService.getQuote(targetSymbol)
    if (response.success) {
      quote.value = response.data
    }
  } catch (error) {
    console.error('Error fetching stock quote:', error)
    alert('Gagal mengambil data saham')
  } finally {
    loading.value = false
  }
}

function formatNumber(num) {
  return new Intl.NumberFormat('id-ID').format(num)
}
</script>

<style scoped src="@/assets/styles/components/stock-tracker.css"></style>
