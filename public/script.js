const API_URL = 'http://localhost:3333'

// Element references
const loginSection = document.getElementById('login-section')
const dashboard = document.getElementById('dashboard')
const loginForm = document.getElementById('login-form')
const addForm = document.getElementById('add-transaction-form')
const tableBody = document.querySelector('#transactions-table tbody')
const logoutBtn = document.getElementById('logout-btn')
const loginError = document.getElementById('login-error')

// Modal elements untuk update
const updateModal = document.getElementById('update-modal')
const updateForm = document.getElementById('update-transaction-form')
const cancelUpdateBtn = document.getElementById('cancel-update')

// Check if elements exist
if (
  !loginSection ||
  !dashboard ||
  !loginForm ||
  !addForm ||
  !tableBody ||
  !logoutBtn ||
  !loginError
) {
  console.error('Beberapa elemen utama tidak ditemukan!')
}

if (!updateModal || !updateForm || !cancelUpdateBtn) {
  console.error('Elemen modal update tidak ditemukan! Pastikan HTML modal sudah ditambahkan.')
}

// Initialize event listeners hanya jika elemen ada
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token')
  if (token) {
    showDashboard()
  }
})

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const email = document.getElementById('email').value.trim()
    const password = document.getElementById('password').value.trim()
    if (loginError) loginError.textContent = ''

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token)
        showDashboard()
      } else {
        if (loginError) loginError.textContent = 'Login gagal! Periksa email atau password.'
      }
    } catch (err) {
      if (loginError) loginError.textContent = 'Terjadi kesalahan koneksi ke server.'
    }
  })
}

function showDashboard() {
  if (loginSection) loginSection.classList.add('hidden')
  if (dashboard) dashboard.classList.remove('hidden')
  getTransactions()
}

async function getTransactions() {
  const token = localStorage.getItem('token')
  if (!token) {
    console.error('Token tidak ditemukan')
    return
  }

  try {
    const res = await fetch(`${API_URL}/transactions`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) throw new Error('Gagal mengambil data')

    const data = await res.json()

    if (tableBody) {
      tableBody.innerHTML = ''
      data.forEach((t, i) => {
        const row = document.createElement('tr')
        row.style.animation = `fadeIn 0.4s ease ${i * 0.05}s forwards`
        row.innerHTML = `
                    <td>${t.description}</td>
                    <td>${t.type}</td>
                    <td>${t.amount}</td>
                    <td>
                        <button class="btn warning" onclick="showUpdateModal(${t.id}, '${t.description.replace(/'/g, "\\'")}', '${t.type}', ${t.amount})">Edit</button>
                        <button class="btn danger" onclick="deleteTransaction(${t.id})">Hapus</button>
                    </td>
                `
        tableBody.appendChild(row)
      })
    }
  } catch (err) {
    console.error('Error:', err)
  }
}

if (addForm) {
  addForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    const description = document.getElementById('description').value.trim()
    const type = document.getElementById('type').value
    const amount = parseFloat(document.getElementById('amount').value)

    if (!description || !amount) return

    try {
      const res = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ description, type, amount }),
      })

      if (res.ok) {
        addForm.reset()
        getTransactions()
      }
    } catch (err) {
      console.error('Error:', err)
    }
  })
}

// Fungsi untuk menampilkan modal update
function showUpdateModal(id, description, type, amount) {
  const updateId = document.getElementById('update-id')
  const updateDescription = document.getElementById('update-description')
  const updateType = document.getElementById('update-type')
  const updateAmount = document.getElementById('update-amount')

  if (updateId && updateDescription && updateType && updateAmount && updateModal) {
    updateId.value = id
    updateDescription.value = description
    updateType.value = type
    updateAmount.value = amount

    updateModal.classList.remove('hidden')
  } else {
    console.error('Elemen modal update tidak ditemukan!')
  }
}

// Fungsi untuk menyembunyikan modal update
function hideUpdateModal() {
  if (updateModal) {
    updateModal.classList.add('hidden')
    if (updateForm) updateForm.reset()
  }
}

// Event listener untuk form update
if (updateForm) {
  updateForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const token = localStorage.getItem('token')
    const id = document.getElementById('update-id').value
    const description = document.getElementById('update-description').value.trim()
    const type = document.getElementById('update-type').value
    const amount = parseFloat(document.getElementById('update-amount').value)

    if (!description || !amount) return

    try {
      const res = await fetch(`${API_URL}/transactions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ description, type, amount }),
      })

      if (res.ok) {
        hideUpdateModal()
        getTransactions()
      }
    } catch (err) {
      console.error('Error:', err)
    }
  })
}

// Event listener untuk tombol cancel update
if (cancelUpdateBtn) {
  cancelUpdateBtn.addEventListener('click', hideUpdateModal)
}

async function deleteTransaction(id) {
  if (!confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) return

  const token = localStorage.getItem('token')
  try {
    const res = await fetch(`${API_URL}/transactions/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })

    if (res.ok) {
      getTransactions()
    }
  } catch (err) {
    console.error('Error:', err)
  }
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token')
    if (dashboard) dashboard.classList.add('hidden')
    if (loginSection) loginSection.classList.remove('hidden')
  })
}
document.querySelectorAll('.btn.warning')


// Exchange Rate Elements
const currencyConverterForm = document.getElementById('currency-converter-form')
const conversionResult = document.getElementById('conversion-result')
const viewRatesBtn = document.getElementById('view-rates-btn')
const ratesModal = document.getElementById('rates-modal')
const closeRatesModal = document.getElementById('close-rates-modal')
const loadRatesBtn = document.getElementById('load-rates-btn')
const baseCurrencySelect = document.getElementById('base-currency-select')
const ratesContent = document.getElementById('rates-content')

// Currency Converter
if (currencyConverterForm) {
  currencyConverterForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const token = localStorage.getItem('token')
    const from = document.getElementById('from-currency').value
    const to = document.getElementById('to-currency').value
    const amount = parseFloat(document.getElementById('convert-amount').value)

    if (!from || !to || !amount) return

    try {
      const res = await fetch(`${API_URL}/exchange-rates/convert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ from, to, amount }),
      })

      if (!res.ok) throw new Error('Gagal konversi mata uang')

      const data = await res.json()

      if (data.success) {
        displayConversionResult(data.data)
      }
    } catch (err) {
      console.error('Error:', err)
      alert('Gagal melakukan konversi mata uang')
    }
  })
}

function displayConversionResult(data) {
  if (!conversionResult) return

  document.getElementById('result-from-amount').textContent = `${data.amount} ${data.from}`
  document.getElementById('result-to-amount').textContent = `${data.converted_amount.toLocaleString('id-ID', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${data.to}`
  document.getElementById('result-rate').textContent = `1 ${data.from} = ${data.conversion_rate.toLocaleString('id-ID', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  })} ${data.to}`
  document.getElementById('result-last-update').textContent = `Last update: ${data.last_update}`

  conversionResult.classList.remove('hidden')
}

// View All Rates
if (viewRatesBtn) {
  viewRatesBtn.addEventListener('click', () => {
    if (ratesModal) {
      ratesModal.classList.remove('hidden')
    }
  })
}

if (closeRatesModal) {
  closeRatesModal.addEventListener('click', () => {
    if (ratesModal) {
      ratesModal.classList.add('hidden')
    }
  })
}

// Load Rates
if (loadRatesBtn) {
  loadRatesBtn.addEventListener('click', async () => {
    const token = localStorage.getItem('token')
    const baseCurrency = baseCurrencySelect.value

    if (!ratesContent) return

    ratesContent.innerHTML = '<p class="loading">Loading rates...</p>'

    try {
      const res = await fetch(`${API_URL}/exchange-rates/latest?base=${baseCurrency}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error('Gagal mengambil rates')

      const data = await res.json()

      if (data.success) {
        displayRates(data.data.conversion_rates, baseCurrency)
      }
    } catch (err) {
      console.error('Error:', err)
      ratesContent.innerHTML = '<p class="text-center">Gagal memuat rates</p>'
    }
  })
}

function displayRates(rates, baseCurrency) {
  if (!ratesContent) return

  const popularCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'IDR', 'SGD', 'MYR', 'AUD', 'CNY', 'THB', 'KRW', 'INR']

  const filteredRates = Object.entries(rates)
    .filter(([currency]) => popularCurrencies.includes(currency))
    .sort((a, b) => popularCurrencies.indexOf(a[0]) - popularCurrencies.indexOf(b[0]))

  ratesContent.innerHTML = ''

  filteredRates.forEach(([currency, rate]) => {
    const rateCard = document.createElement('div')
    rateCard.className = 'rate-card'
    rateCard.innerHTML = `
      <div class="rate-currency">${currency}</div>
      <div class="rate-value">${rate.toLocaleString('id-ID', {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
      })}</div>
    `
    ratesContent.appendChild(rateCard)
  })

  if (filteredRates.length === 0) {
    ratesContent.innerHTML = '<p class="text-center">Tidak ada rates tersedia</p>'
  }
}

// Close modal when clicking outside
if (ratesModal) {
  ratesModal.addEventListener('click', (e) => {
    if (e.target === ratesModal) {
      ratesModal.classList.add('hidden')
    }
  })
}


// Stock Tracker Elements
const stockSearchForm = document.getElementById('stock-search-form')
const stockSearchInput = document.getElementById('stock-search-input')
const searchResults = document.getElementById('search-results')
const quickQuoteForm = document.getElementById('quick-quote-form')
const quickSymbolInput = document.getElementById('quick-symbol-input')
const stockQuoteResult = document.getElementById('stock-quote-result')
const stockDetailModal = document.getElementById('stock-detail-modal')
const closeStockModal = document.getElementById('close-stock-modal')
const stockDetailContent = document.getElementById('stock-detail-content')

// Stock Search
if (stockSearchForm) {
  stockSearchForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const token = localStorage.getItem('token')
    const keywords = stockSearchInput.value.trim()

    if (!keywords) return

    if (searchResults) {
      searchResults.innerHTML = '<p class="loading-spinner"></p>'
      searchResults.classList.remove('hidden')
    }

    try {
      const res = await fetch(`${API_URL}/stocks/search?keywords=${encodeURIComponent(keywords)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error('Gagal mencari saham')

      const data = await res.json()

      if (data.success && data.data.length > 0) {
        displaySearchResults(data.data)
      } else {
        if (searchResults) {
          searchResults.innerHTML = '<p class="text-center">Tidak ada hasil ditemukan</p>'
        }
      }
    } catch (err) {
      console.error('Error:', err)
      if (searchResults) {
        searchResults.innerHTML = '<p class="text-center">Gagal mencari saham</p>'
      }
    }
  })
}

function displaySearchResults(results) {
  if (!searchResults) return

  searchResults.innerHTML = ''

  results.forEach((result) => {
    const item = document.createElement('div')
    item.className = 'search-result-item'
    item.innerHTML = `
      <div class="search-result-symbol">${result.symbol}</div>
      <div class="search-result-name">${result.name}</div>
      <div class="search-result-meta">${result.type} • ${result.region} • ${result.currency}</div>
    `
    item.addEventListener('click', () => {
      getStockQuote(result.symbol)
    })
    searchResults.appendChild(item)
  })
}

// Quick Quote
if (quickQuoteForm) {
  quickQuoteForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const symbol = quickSymbolInput.value.trim().toUpperCase()
    if (!symbol) return

    await getStockQuote(symbol)
  })
}

// Get Stock Quote
async function getStockQuote(symbol) {
  const token = localStorage.getItem('token')

  if (stockQuoteResult) {
    stockQuoteResult.innerHTML = '<p class="loading-spinner"></p>'
    stockQuoteResult.classList.remove('hidden')
  }

  try {
    const res = await fetch(`${API_URL}/stocks/quote?symbol=${symbol}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) throw new Error('Gagal mengambil quote')

    const data = await res.json()

    if (data.success) {
      displayStockQuote(data.data)
    }
  } catch (err) {
    console.error('Error:', err)
    if (stockQuoteResult) {
      stockQuoteResult.innerHTML =
        '<p class="text-center">Gagal mengambil data saham. Pastikan symbol benar atau coba lagi nanti.</p>'
    }
  }
}

function displayStockQuote(quote) {
  if (!stockQuoteResult) return

  const isPositive = quote.change >= 0
  const changeClass = isPositive ? 'positive' : 'negative'
  const changeSymbol = isPositive ? '▲' : '▼'

  stockQuoteResult.innerHTML = `
    <div class="stock-card">
      <div class="stock-header">
        <div>
          <div class="stock-symbol">${quote.symbol}</div>
          <div class="stock-change ${changeClass}">
            ${changeSymbol} ${quote.change.toFixed(2)} (${quote.changePercent})
          </div>
        </div>
        <div class="stock-price">$${quote.price.toFixed(2)}</div>
      </div>
      
      <div class="stock-details">
        <div class="stock-detail-item">
          <div class="stock-detail-label">Open</div>
          <div class="stock-detail-value">$${quote.open.toFixed(2)}</div>
        </div>
        <div class="stock-detail-item">
          <div class="stock-detail-label">High</div>
          <div class="stock-detail-value">$${quote.high.toFixed(2)}</div>
        </div>
        <div class="stock-detail-item">
          <div class="stock-detail-label">Low</div>
          <div class="stock-detail-value">$${quote.low.toFixed(2)}</div>
        </div>
        <div class="stock-detail-item">
          <div class="stock-detail-label">Previous Close</div>
          <div class="stock-detail-value">$${quote.previousClose.toFixed(2)}</div>
        </div>
        <div class="stock-detail-item">
          <div class="stock-detail-label">Volume</div>
          <div class="stock-detail-value">${quote.volume.toLocaleString()}</div>
        </div>
        <div class="stock-detail-item">
          <div class="stock-detail-label">Trading Day</div>
          <div class="stock-detail-value">${quote.latestTradingDay}</div>
        </div>
      </div>
    </div>
  `

  stockQuoteResult.classList.remove('hidden')
}

// Popular Stocks Chips
document.querySelectorAll('.stock-chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    const symbol = chip.getAttribute('data-symbol')
    if (symbol) {
      getStockQuote(symbol)
      // Scroll to result
      if (stockQuoteResult) {
        stockQuoteResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }
  })
})

// Close Stock Modal
if (closeStockModal) {
  closeStockModal.addEventListener('click', () => {
    if (stockDetailModal) {
      stockDetailModal.classList.add('hidden')
    }
  })
}

// Close modal when clicking outside
if (stockDetailModal) {
  stockDetailModal.addEventListener('click', (e) => {
    if (e.target === stockDetailModal) {
      stockDetailModal.classList.add('hidden')
    }
  })
}
