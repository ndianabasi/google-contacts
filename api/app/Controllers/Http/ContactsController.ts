import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Contact from 'App/Models/Contact'
import Logger from '@ioc:Adonis/Core/Logger'
import ContactValidator from 'App/Validators/ContactValidator'
import { ResponsiveAttachment } from '@ioc:Adonis/Addons/ResponsiveAttachment'

export default class ContactsController {
  public async index({ request, response }: HttpContextContract) {
    /* try { */
    const { page, perPage } = request.qs()

    const contacts = await Contact.query()
      .select([
        'id',
        'first_name',
        'surname',
        'email1',
        'phone_number1',
        'company',
        'job_title',
        'profile_picture',
      ])
      .orderBy('first_name', 'asc')
      .paginate(page, perPage)

    return response.ok({ data: contacts })
    /* } catch (error) {
      Logger.error('Error at ContactsController.list:\n%o', error)

      return response.status(error?.status ?? 500).json({
        message: 'An error occurred while deleting the contact.',
        error: process.env.NODE_ENV !== 'production' ? error : null,
      })
    } */
  }

  public async store({ request, response }: HttpContextContract) {
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
      profilePicture,
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
      // @ts-ignore
      birthday,
      website,
      notes,
      profilePicture: profilePicture ? await ResponsiveAttachment.fromFile(profilePicture) : null,
    })

    /**
     * Refreshing the `contact` model before returning it as the
     * payload of the response is important.
     * If not refreshed, only the actual/few properties which were inserted will be returned
     */
    await contact.refresh()

    return response.created({ message: 'Contact was created', data: contact })
  }

  public async show({ response, requestedContact }: HttpContextContract) {
    try {
      return response.ok({ data: requestedContact })
    } catch (error) {
      Logger.error('Error at ContactsController.show:\n%o', error)

      return response.status(error?.status ?? 500).json({
        message: 'An error occurred while deleting the contact.',
        error: process.env.NODE_ENV !== 'production' ? error : null,
      })
    }
  }

  public async update({ request, response, requestedContact }: HttpContextContract) {
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
      profilePicture,
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
      // @ts-ignore
      birthday,
      website,
      notes,
      profilePicture: profilePicture ? await ResponsiveAttachment.fromFile(profilePicture) : null,
    })

    await requestedContact?.save()
    await requestedContact?.refresh()

    return response.created({ message: 'Contact was edited', data: requestedContact?.id })
  }

  public async destroy({ response, requestedContact }: HttpContextContract) {
    await requestedContact?.delete()

    return response.created({ message: 'Contact was deleted', data: requestedContact?.id })
  }
}
