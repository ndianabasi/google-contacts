import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

test.group('Creative-Group Creative | Mass-Format Creatives | Update', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should create contact', async ({ client }) => {
    const response = await client.get('/')

    response.assertStatus(200)
    response.assertBody({ hello: 'world' })
  })
})
