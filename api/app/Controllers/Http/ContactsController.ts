import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Contact from 'App/Models/Contact'
import Logger from '@ioc:Adonis/Core/Logger'
import ContactValidator from 'App/Validators/ContactValidator'

export default class ContactsController {
  public async index({}: HttpContextContract) {}

  public async store({ request, response }: HttpContextContract) {
    try {
      const payload = await request.validate(ContactValidator)

      /**
       * It is important to destructure and obtain the individual properties
       * which we want to insert into our the table.
       * You do not want malicious actors to try to overwrite the `id` or `created_at`
       * or `updated_at` by including those in the payload
       *
       * So, the statement below is discouraged as it is dangerous
       * `await Contact.create(payload)`
       *
       * Again, destructure the `payload` as done below, no matter how many properties
       * are there in the payload
       */
      const {
        firstName,
        surname,
        company,
        jobTitle,
        email1,
        email2,
        phoneNumber1,
        phoneNumber2,
        country,
        streetAddressLine1,
        streetAddressLine2,
        city,
        postCode,
        state,
        birthday,
        website,
        notes,
      } = payload

      const contact = await Contact.create({
        firstName,
        surname,
        company,
        jobTitle,
        email1,
        email2,
        phoneNumber1,
        phoneNumber2,
        country,
        streetAddressLine1,
        streetAddressLine2,
        city,
        postCode,
        state,
        birthday,
        website,
        notes,
      })

      /**
       * Refreshing the `contact` model before returning it as the
       * payload of the response is important.
       * If not refreshed, only the actual/few properties which were inserted will be returned
       */
      await contact.refresh()

      return response.created({ message: 'Contact was created', data: contact })
    } catch (error) {
      Logger.error('Error at ContactsController.store:\n%o', error)

      return response.status(error?.status ?? 500).json({
        message: 'An error occurred while creating the contact.',
        error: process.env.NODE_ENV !== 'production' ? error : null,
      })
    }
  }

  public async show({}: HttpContextContract) {}

  public async update({ request, response, requestedContact }: HttpContextContract) {
    try {
      const payload = await request.validate(ContactValidator)

      const {
        firstName,
        surname,
        company,
        jobTitle,
        email1,
        email2,
        phoneNumber1,
        phoneNumber2,
        country,
        streetAddressLine1,
        streetAddressLine2,
        city,
        postCode,
        state,
        birthday,
        website,
        notes,
      } = payload!

      requestedContact?.merge({
        firstName,
        surname,
        company,
        jobTitle,
        email1,
        email2,
        phoneNumber1,
        phoneNumber2,
        country,
        streetAddressLine1,
        streetAddressLine2,
        city,
        postCode,
        state,
        birthday,
        website,
        notes,
      })

      await requestedContact?.save()
      await requestedContact?.refresh()

      return response.created({ message: 'Contact was edited', data: requestedContact })
    } catch (error) {
      Logger.error('Error at ContactsController.update:\n%o', error)

      return response.status(error?.status ?? 500).json({
        message: 'An error occurred while updating the contact.',
        error: process.env.NODE_ENV !== 'production' ? error : null,
      })
    }
  }

  public async destroy({}: HttpContextContract) {}
}
