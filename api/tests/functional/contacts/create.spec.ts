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

  test('should throw 422 error if duplicate "email1" to be created', async ({ client, route }) => {
    const contact = await ContactFactory.merge({ email1: 'ndianabasi@me.com' }).create()

    const response = await client.post(route('ContactsController.store')).json(contact)

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [{ message: 'Email 1 is already registered in your contacts' }],
    })
  })

  test('should throw 422 error if duplicate "email1" to be created')
    .with(['ndianabasi@me.com', 'NDIANABASI@ME.COM'])
    .run(async ({ client, route }, email) => {
      const contact = await ContactFactory.merge({ email1: email }).create()

      const response = await client.post(route('ContactsController.store')).json(contact)

      response.assertStatus(422)
      response.assertBodyContains({
        errors: [{ message: 'Email 1 is already registered in your contacts' }],
      })
    })
})
