import { test } from '@japa/runner'

test('display hello', async ({ client }) => {
  const response = await client.get('/')

  response.assertStatus(200)
  response.assertBody({ hello: 'world' })
})
