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