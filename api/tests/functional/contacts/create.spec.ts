import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { ContactFactory } from 'Database/factories'
import omit from 'lodash.omit'

test.group('Contacts | create contact', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should create contact', async ({ client, route }) => {
    const contactAttributes = await ContactFactory.make()

    const response = await client.post(route('ContactsController.store')).json(contactAttributes)

    response.assertStatus(201)
    response.assertBodyContains({
      data: omit(contactAttributes.serialize(), 'id', 'created_at', 'updated_at'),
    })
  })
})
