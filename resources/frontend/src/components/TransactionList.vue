<template>
  <div class="card">
    <h2>📋 Daftar Transaksi</h2>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="transactions.length === 0" class="empty-state">
      <p>Belum ada transaksi</p>
    </div>
    <table v-else class="transactions-table">
      <thead>
        <tr>
          <th>📝 Deskripsi</th>
          <th>📊 Tipe</th>
          <th>💵 Jumlah</th>
          <th>⚙️ Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="transaction in transactions" :key="transaction.id">
          <td>{{ transaction.description }}</td>
          <td>{{ transaction.type === 'income' ? '💰 Pemasukan' : '💸 Pengeluaran' }}</td>
          <td>{{ formatCurrency(transaction.amount) }}</td>
          <td class="actions">
            <button class="btn warning" @click="editTransaction(transaction)">Edit</button>
            <button class="btn danger" @click="deleteTransaction(transaction.id)">Hapus</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Edit Modal -->
    <Teleport to="body">
      <div v-if="showEditModal" class="modal" @click.self="closeEditModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Edit Transaksi</h2>
            <button class="btn-close" @click="closeEditModal">×</button>
          </div>
          <form @submit.prevent="updateTransaction">
            <div class="form-group">
              <label>Deskripsi</label>
              <input v-model="editForm.description" required />
            </div>
            <div class="form-group">
              <label>Tipe</label>
              <select v-model="editForm.type" required>
                <option value="income">Pemasukan</option>
                <option value="expense">Pengeluaran</option>
              </select>
            </div>
            <div class="form-group">
              <label>Jumlah</label>
              <input v-model.number="editForm.amount" type="number" step="0.01" required />
            </div>
            <div class="form-buttons">
              <button type="submit" class="btn primary">Update</button>
              <button type="button" class="btn secondary" @click="closeEditModal">Batal</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import transactionService from '@/services/transactionService'

const transactions = ref([])
const loading = ref(false)
const showEditModal = ref(false)
const editForm = ref({
  id: null,
  description: '',
  type: 'income',
  amount: 0,
})

onMounted(() => {
  loadTransactions()
})

async function loadTransactions() {
  loading.value = true
  try {
    transactions.value = await transactionService.getAll()
  } catch (error) {
    console.error('Error loading transactions:', error)
  } finally {
    loading.value = false
  }
}

function editTransaction(transaction) {
  editForm.value = { ...transaction }
  showEditModal.value = true
}

async function updateTransaction() {
  try {
    await transactionService.update(editForm.value.id, editForm.value)
    closeEditModal()
    loadTransactions()
  } catch (error) {
    console.error('Error updating transaction:', error)
    alert('Gagal mengupdate transaksi')
  }
}

async function deleteTransaction(id) {
  if (!confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) return

  try {
    await transactionService.delete(id)
    loadTransactions()
  } catch (error) {
    console.error('Error deleting transaction:', error)
    alert('Gagal menghapus transaksi')
  }
}

function closeEditModal() {
  showEditModal.value = false
  editForm.value = { id: null, description: '', type: 'income', amount: 0 }
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(amount)
}

defineExpose({ loadTransactions })
</script>

<style scoped src="@/assets/styles/components/transaction-list.css"></style>
