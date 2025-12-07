import Transaction from '#models/transaction'
import Category from '#models/category'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    // Ambil user pertama
    const user = await User.firstOrFail()

    // Ambil categories
    const incomeCategories = await Category.query()
      .where('user_id', user.id)
      .where('type', 'income')

    const expenseCategories = await Category.query()
      .where('user_id', user.id)
      .where('type', 'expense')

    if (incomeCategories.length === 0 || expenseCategories.length === 0) {
      console.log('⚠️  Please run CategorySeeder first!')
      return
    }

    // Sample transactions untuk bulan ini
    const now = DateTime.now()

    // Income transactions
    const incomeTransactions = [
      {
        amount: 5000000,
        description: 'Monthly Salary',
        type: 'income' as const,
        date: now.startOf('month'),
        categoryId: incomeCategories[0].id, // Salary
        userId: user.id,
      },
      {
        amount: 1500000,
        description: 'Freelance Project - Website Development',
        type: 'income' as const,
        date: now.minus({ days: 5 }),
        categoryId: incomeCategories[1].id, // Freelance
        userId: user.id,
      },
      {
        amount: 500000,
        description: 'Stock Dividend',
        type: 'income' as const,
        date: now.minus({ days: 10 }),
        categoryId: incomeCategories[2].id, // Investment
        userId: user.id,
      },
    ]

    // Expense transactions
    const expenseTransactions = [
      {
        amount: 150000,
        description: 'Groceries at Supermarket',
        type: 'expense' as const,
        date: now.minus({ days: 1 }),
        categoryId: expenseCategories[0].id, // Food & Drinks
        userId: user.id,
      },
      {
        amount: 50000,
        description: 'Lunch with colleagues',
        type: 'expense' as const,
        date: now.minus({ days: 2 }),
        categoryId: expenseCategories[0].id, // Food & Drinks
        userId: user.id,
      },
      {
        amount: 100000,
        description: 'Grab/Gojek rides',
        type: 'expense' as const,
        date: now.minus({ days: 3 }),
        categoryId: expenseCategories[1].id, // Transportation
        userId: user.id,
      },
      {
        amount: 300000,
        description: 'New shoes',
        type: 'expense' as const,
        date: now.minus({ days: 4 }),
        categoryId: expenseCategories[2].id, // Shopping
        userId: user.id,
      },
      {
        amount: 200000,
        description: 'Movie tickets and dinner',
        type: 'expense' as const,
        date: now.minus({ days: 6 }),
        categoryId: expenseCategories[3].id, // Entertainment
        userId: user.id,
      },
      {
        amount: 500000,
        description: 'Electricity bill',
        type: 'expense' as const,
        date: now.minus({ days: 7 }),
        categoryId: expenseCategories[4].id, // Bills & Utilities
        userId: user.id,
      },
      {
        amount: 250000,
        description: 'Internet bill',
        type: 'expense' as const,
        date: now.minus({ days: 8 }),
        categoryId: expenseCategories[4].id, // Bills & Utilities
        userId: user.id,
      },
      {
        amount: 150000,
        description: 'Doctor consultation',
        type: 'expense' as const,
        date: now.minus({ days: 9 }),
        categoryId: expenseCategories[5].id, // Healthcare
        userId: user.id,
      },
      {
        amount: 400000,
        description: 'Online course subscription',
        type: 'expense' as const,
        date: now.minus({ days: 11 }),
        categoryId: expenseCategories[6].id, // Education
        userId: user.id,
      },
      {
        amount: 2000000,
        description: 'Monthly rent',
        type: 'expense' as const,
        date: now.startOf('month'),
        categoryId: expenseCategories[7].id, // Housing
        userId: user.id,
      },
    ]

    // Seed income transactions
    for (const transaction of incomeTransactions) {
      // Check if transaction already exists
      const existing = await Transaction.query()
        .where('description', transaction.description)
        .where('user_id', transaction.userId)
        .where('amount', transaction.amount)
        .where('date', transaction.date.toSQL()!)
        .first()

      if (!existing) {
        await Transaction.create(transaction)
      }
    }

    // Seed expense transactions
    for (const transaction of expenseTransactions) {
      // Check if transaction already exists
      const existing = await Transaction.query()
        .where('description', transaction.description)
        .where('user_id', transaction.userId)
        .where('amount', transaction.amount)
        .where('date', transaction.date.toSQL()!)
        .first()

      if (!existing) {
        await Transaction.create(transaction)
      }
    }

    // Calculate totals
    const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0)
    const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0)
    const balance = totalIncome - totalExpense

    console.log('✅ Transactions seeded successfully')
    console.log(`   - ${incomeTransactions.length} income transactions`)
    console.log(`   - ${expenseTransactions.length} expense transactions`)
    console.log(`   - Total Income: Rp ${totalIncome.toLocaleString('id-ID')}`)
    console.log(`   - Total Expense: Rp ${totalExpense.toLocaleString('id-ID')}`)
    console.log(`   - Balance: Rp ${balance.toLocaleString('id-ID')}`)
  }
}
