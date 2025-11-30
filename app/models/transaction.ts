import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare categoryId: number | null

  @column()
  declare type: 'income' | 'expense'

  @column()
  declare amount: number

  @column()
  declare description: string | null

  @column.dateTime()
  declare date: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
