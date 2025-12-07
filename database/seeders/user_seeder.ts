import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Buat user demo
    await User.updateOrCreate(
      { email: 'syahrul@finance.com' },
      {
        name: 'Syahrul',
        email: 'syahrul@finance.com',
        password: '12345678',
      }
    )

    await User.updateOrCreate(
      { email: 'dimas@finance.com' },
      {
        name: 'Dimas',
        email: 'dimas@finance.com',
        password: '12345678',
      }
    )

    await User.updateOrCreate(
      { email: 'alfin@finance.com' },
      {
        name: 'Alfin',
        email: 'alfin@finance.com',
        password: '12345678',
      }
    )

    console.log('✅ Users seeded successfully')
    console.log('📧 Login credentials:')
    console.log('   - syahrul@finance.com / 12345678')
    console.log('   - dimas@finance.com / 12345678')
    console.log('   - alfin@finance.com / 12345678')
  }
}
