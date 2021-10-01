import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Contacts extends BaseSchema {
  protected tableName = 'contacts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary().index().unique().notNullable()
      table.string('first_name').notNullable().index()
      table.string('surname').notNullable().index()
      table.string('company')
      table.string('job_title')
      table.string('email1').index()
      table.string('email2').index()
      table.string('phone_number1').index()
      table.string('phone_number2').index()
      table.string('country').index()
      table.string('street_address_line1')
      table.string('street_address_line2')
      table.string('city').index()
      table.string('post_code')
      table.string('state').index()
      table.string('birthday')
      table.string('website')
      table.text('notes')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
