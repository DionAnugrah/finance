<template>
  <div class="card">
    <h2>💱 Konversi Mata Uang</h2>
    <form @submit.prevent="handleConvert" class="converter-form">
      <div class="converter-grid">
        <div class="form-group">
          <label>Dari:</label>
          <select v-model="form.from" required>
            <option v-for="currency in currencies" :key="currency" :value="currency">
              {{ currency }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>Ke:</label>
          <select v-model="form.to" required>
            <option v-for="currency in currencies" :key="currency" :value="currency">
              {{ currency }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>Jumlah:</label>
          <input v-model.number="form.amount" type="number" step="0.01" min="0" required />
        </div>
        <div class="form-group">
          <button type="submit" class="btn primary" :disabled="loading">
            {{ loading ? 'Converting...' : 'Konversi' }}
          </button>
        </div>
      </div>
    </form>

    <div v-if="result" class="conversion-result">
      <div class="result-card">
        <div class="result-header">
          <span class="result-label">Hasil Konversi</span>
        </div>
        <div class="result-body">
          <div class="result-amount">
            <span>{{ result.amount }} {{ result.from }}</span>
            <span class="arrow">→</span>
            <span class="highlight">{{ formatNumber(result.converted_amount) }} {{ result.to }}</span>
          </div>
          <div class="result-rate">
            Rate: 1 {{ result.from }} = {{ formatNumber(result.conversion_rate) }} {{ result.to }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import exchangeRateService from '@/services/exchangeRateService'

const currencies = ['USD', 'IDR', 'EUR', 'GBP', 'JPY', 'SGD', 'MYR', 'AUD', 'CNY']

const form = ref({
  from: 'USD',
  to: 'IDR',
  amount: 100,
})

const result = ref(null)
const loading = ref(false)

async function handleConvert() {
  loading.value = true
  try {
    const response = await exchangeRateService.convertCurrency(
      form.value.from,
      form.value.to,
      form.value.amount
    )
    if (response.success) {
      result.value = response.data
    }
  } catch (error) {
    console.error('Error converting currency:', error)
    alert('Gagal melakukan konversi')
  } finally {
    loading.value = false
  }
}

function formatNumber(num) {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}
</script>

<style scoped src="@/assets/styles/components/exchange-rate.css"></style>
