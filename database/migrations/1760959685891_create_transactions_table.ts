import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table
        .integer('category_id')
        .unsigned()
        .references('id')
        .inTable('categories')
        .onDelete('SET NULL')
        .nullable()
      table.enum('type', ['income', 'expense']).notNullable()
      table.decimal('amount', 10, 2).notNullable()
      table.string('description').nullable()
      table.timestamp('date').notNullable()
      table.timestamp('created_at').defaultTo(this.now())
    })
  }
  async down() {
    this.schema.dropTable(this.tableName)
  }
}
