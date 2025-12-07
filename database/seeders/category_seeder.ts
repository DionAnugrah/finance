import Category from '#models/category'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Ambil user pertama
    const user = await User.firstOrFail()

    // Categories untuk Income
    const incomeCategories = [
      { name: 'Salary', type: 'income' as const },
      { name: 'Freelance', type: 'income' as const },
      { name: 'Investment', type: 'income' as const },
      { name: 'Business', type: 'income' as const },
      { name: 'Gift', type: 'income' as const },
      { name: 'Other Income', type: 'income' as const },
    ]

    // Categories untuk Expense
    const expenseCategories = [
      { name: 'Food & Drinks', type: 'expense' as const },
      { name: 'Transportation', type: 'expense' as const },
      { name: 'Shopping', type: 'expense' as const },
      { name: 'Entertainment', type: 'expense' as const },
      { name: 'Bills & Utilities', type: 'expense' as const },
      { name: 'Healthcare', type: 'expense' as const },
      { name: 'Education', type: 'expense' as const },
      { name: 'Housing', type: 'expense' as const },
      { name: 'Insurance', type: 'expense' as const },
      { name: 'Other Expense', type: 'expense' as const },
    ]

    // Seed income categories
    for (const category of incomeCategories) {
      await Category.updateOrCreate(
        { name: category.name, userId: user.id },
        {
          name: category.name,
          type: category.type,
          userId: user.id,
        }
      )
    }

    // Seed expense categories
    for (const category of expenseCategories) {
      await Category.updateOrCreate(
        { name: category.name, userId: user.id },
        {
          name: category.name,
          type: category.type,
          userId: user.id,
        }
      )
    }

    console.log('✅ Categories seeded successfully')
    console.log(`   - ${incomeCategories.length} income categories`)
    console.log(`   - ${expenseCategories.length} expense categories`)
  }
}
