<template>
  <div class="card">
    <h2>➕ Tambah Transaksi Baru</h2>
    <form @submit.prevent="handleSubmit" class="transaction-form">
      <div class="form-group">
        <label for="description">📝 Deskripsi</label>
        <input
          id="description"
          v-model="form.description"
          type="text"
          placeholder="Contoh: Gaji bulanan"
          required
        />
      </div>
      <div class="form-group">
        <label for="type">📊 Tipe</label>
        <select id="type" v-model="form.type" required>
          <option value="income">💰 Pemasukan</option>
          <option value="expense">💸 Pengeluaran</option>
        </select>
      </div>
      <div class="form-group">
        <label for="amount">💵 Jumlah</label>
        <input
          id="amount"
          v-model.number="form.amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          required
        />
      </div>
      <button type="submit" class="btn primary" :disabled="loading">
        {{ loading ? 'Menyimpan...' : '✨ Tambah Transaksi' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import transactionService from '@/services/transactionService'

const emit = defineEmits(['transaction-added'])

const form = ref({
  description: '',
  type: 'income',
  amount: 0,
})

const loading = ref(false)

async function handleSubmit() {
  loading.value = true

  try {
    await transactionService.create(form.value)
    form.value = { description: '', type: 'income', amount: 0 }
    emit('transaction-added')
  } catch (error) {
    console.error('Error creating transaction:', error)
    alert('Gagal menambah transaksi')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.card {
  background: rgba(30, 30, 40, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

h2 {
  margin-bottom: 1.5rem;
  color: #fff;
  font-weight: 600;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

h2::before {
  content: '';
  width: 4px;
  height: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

.transaction-form {
  display: grid;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  font-size: 0.9rem;
}

input,
select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: rgba(40, 40, 50, 0.6);
  color: #fff;
  outline: none;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

input:focus,
select:focus {
  border-color: #667eea;
  background: rgba(40, 40, 50, 0.8);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
  transform: translateY(-2px);
}

input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 0.95rem;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  margin-top: 0.5rem;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
