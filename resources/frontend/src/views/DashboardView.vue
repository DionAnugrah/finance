<template>
  <div class="dashboard">
    <DashboardHeader />
    <div class="container">
      <TransactionForm />
      <TransactionList />
      <StockTracker />
      <ExchangeRate />
    </div>
  </div>
</template>

<script setup>
import DashboardHeader from '@/components/DashboardHeader.vue'
import TransactionForm from '@/components/TransactionForm.vue'
import TransactionList from '@/components/TransactionList.vue'
import StockTracker from '@/components/StockTracker.vue'
import ExchangeRate from '@/components/ExchangeRate.vue'
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
}

.container {
  width: 90%;
  max-width: 1200px;
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
</style>
