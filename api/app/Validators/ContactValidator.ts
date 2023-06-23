import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ContactValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    id: this.ctx.params?.id ?? null,
  })

  public schema = schema.create({
    firstName: schema.string([rules.trim(), rules.maxLength(30)]),
    surname: schema.string([rules.trim(), rules.maxLength(30)]),
    company: schema.string.nullableAndOptional([rules.trim()]),
    jobTitle: schema.string.nullableAndOptional([rules.trim()]),
    email1: schema.string({ trim: true }, [
      rules.email(),
      rules.unique({
        table: 'contacts',
        column: 'email1',
        caseInsensitive: true,
        whereNot: this.refs?.id ? { id: this.refs.id } : {},
      }),
    ]),
    email2: schema.string.nullableAndOptional([rules.trim(), rules.email()]),
    phoneNumber1: schema.string([rules.trim(), rules.maxLength(20)]),
    phoneNumber2: schema.string.nullableAndOptional([
      rules.escape(),
      rules.trim(),
      rules.maxLength(20),
    ]),
    country: schema.string.nullableAndOptional([rules.trim(), rules.maxLength(25)]),
    streetAddressLine1: schema.string.nullableAndOptional([rules.trim()]),
    streetAddressLine2: schema.string.nullableAndOptional([rules.trim()]),
    city: schema.string.nullableAndOptional([rules.trim()]),
    postCode: schema.string.nullableAndOptional([rules.trim()]),
    state: schema.string.nullableAndOptional([rules.trim()]),
    /**
     * This receives the birthday as a string and parses it into a Luxon `DateTime` object.
     * Because of this, we must ensure that we decorate the `birthday` property
     * in the Contact model with `@column.date` decorator so that Lucid can automatically
     * fetch the `Date` object from the Luxon `DateTime` object before saving.
     */
    birthday: schema.date.nullableAndOptional(undefined, [rules.before('today')]),
    website: schema.string.nullableAndOptional({ trim: true }, [
      rules.url({
        protocols: ['http', 'https'],
        requireHost: true,
      }),
    ]),
    notes: schema.string.nullableAndOptional([rules.trim()]),
    profilePicture: schema.file.nullableAndOptional({
      size: '500kb',
      extnames: ['jpg', 'png', 'webp', 'gif'],
    }),
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
    'birthday.date.format': 'Please provide a valid birthday',
    'website.url': 'Website is not valid',
    'profilePicture.size': 'Maximum profile picture size is 500kb',
    'profilePicture.extnames': 'The uploaded file type is not allowed',
  }
}
