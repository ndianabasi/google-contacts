import Contact from 'App/Models/Contact'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class FindRequestedCustomer {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const { response, params } = ctx
    const { id } = params

    if (!id) {
      return response.badRequest({ message: 'Contact ID not provided' })
    }

    const contact = await Contact.findOrFail(id)
    if (!contact) {
      return response.notFound({ message: 'Unknown contact was requested' })
    }

    ctx.requestedContact = contact

    await next()
  }
}
