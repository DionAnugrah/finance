import { BaseSeeder } from '@adonisjs/lucid/seeders'
import app from '@adonisjs/core/services/app'

export default class extends BaseSeeder {
  private async seed(Seeder: { default: typeof BaseSeeder }) {
    /**
     * Do not run when not in a environment specified in Seeder
     */
    if (
      (!Seeder.default.environment ||
        !Seeder.default.environment.includes('development')) &&
      app.inProduction
    ) {
      return
    }

    await new Seeder.default(this.client).run()
  }

  async run() {
    console.log('🌱 Starting database seeding...\n')

    // Run seeders in order
    await this.seed(await import('#database/seeders/user_seeder'))
    await this.seed(await import('#database/seeders/category_seeder'))
    await this.seed(await import('#database/seeders/transaction_seeder'))

    console.log('\n🎉 Database seeding completed!')
  }
}
