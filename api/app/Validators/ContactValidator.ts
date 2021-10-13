import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ContactValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    firstName: schema.string({ escape: true, trim: true }, [rules.maxLength(30)]),
    surname: schema.string({ escape: true, trim: true }, [rules.maxLength(30)]),
    company: schema.string.optional({ escape: true, trim: true }),
    jobTitle: schema.string.optional({ escape: true, trim: true }),
    email1: schema.string({ escape: true, trim: true }, [
      rules.email(),
      rules.unique({ table: 'contacts', column: 'email1', caseInsensitive: false }),
    ]),
    email2: schema.string.optional({ escape: true, trim: true }, [rules.email()]),
    phoneNumber1: schema.string({ escape: true, trim: true }, [rules.maxLength(20)]),
    phoneNumber2: schema.string.optional({ escape: true, trim: true }, [rules.maxLength(20)]),
    country: schema.string.optional({ escape: true, trim: true }, [rules.maxLength(20)]),
    streetAddressLine1: schema.string.optional({ escape: true, trim: true }),
    streetAddressLine2: schema.string.optional({ escape: true, trim: true }),
    city: schema.string.optional({ escape: true, trim: true }),
    postCode: schema.string.optional({ escape: true, trim: true }),
    state: schema.string.optional({ escape: true, trim: true }),
    /**
     * This receives the birthday as a string and parses it into a Luxon `DateTime` object.
     * Because of this, we must ensure that we decorate the `birthday` property
     * in the Contact model with `@column.date` decorator so that Lucid can automatically
     * fetch the `Date` object from the Luxon `DateTime` object before saving.
     */
    birthday: schema.date.optional({ format: 'yyyy-MM-dd' }, [rules.before('today')]),
    website: schema.string.optional({ trim: true }, [
      rules.url({
        protocols: ['http', 'https'],
        requireHost: true,
      }),
    ]),
    notes: schema.string.optional({ escape: true, trim: true }),
  })

  public messages = {
    'firstName.required': 'First Name is required',
    'firstName.maxLength': 'First Name should be maximum of {{options.maxLength}} characters.',
    'surname.required': 'Surname is required',
    'surname.maxLength': 'Surname should be maximum of {{options.maxLength}} characters.',
    'email1.required': 'Email 1 is required',
    'email1.email': 'Email 1 should be a valid email address',
    'email1.unique': 'Email 1 is already registered in your contacts',
    'email2.email': 'Email 1 should be a valid email address',
    'phoneNumber1.maxLength':
      'Phone Number 1 should be maximum of {{options.maxLength}} characters.',
    'phoneNumber2.maxLength':
      'Phone Number 2 should be maximum of {{options.maxLength}} characters.',
    'country.maxLength': 'Country should be maximum of {{options.maxLength}} characters.',
    'birthday.before': "Birthday must be before 'today'",
    'website.url': 'Website is not valid',
  }
}
