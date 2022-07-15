import Contact from 'App/Models/Contact'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { DateTime } from 'luxon'

const ContactFactory = Factory.define(Contact, ({ faker }) => {
  const firstName = faker.name.firstName(faker.helpers.arrayElement(['male', 'female']))
  const surname = faker.name.lastName()
  const omitAddresses = faker.datatype.boolean()

  return {
    firstName,
    surname,
    company: faker.company.companyName(),
    jobTitle: (() => {
      const omit = faker.datatype.boolean()
      return omit ? null : faker.name.jobTitle()
    })(),
    email1: faker.internet.email(firstName, surname),
    email2: (() => {
      const omit = faker.datatype.boolean()
      return omit ? null : `${firstName}.${surname}@${faker.internet.domainName()}`
    })(),
    phoneNumber1: faker.phone.number(),
    phoneNumber2: (() => {
      const omit = faker.datatype.boolean()
      return omit ? null : faker.phone.number()
    })(),
    country: faker.address.country(),
    state: omitAddresses ? null : faker.address.state(),
    streetAddressLine1: omitAddresses ? null : faker.address.streetAddress(),
    streetAddressLine2: omitAddresses ? null : faker.address.streetAddress(),
    postCode: omitAddresses ? null : faker.address.zipCode(),
    birthday: (() => {
      const omit = faker.datatype.boolean()
      return omit ? null : DateTime.fromJSDate(faker.date.past())
    })(),
    website: (() => {
      const omit = faker.datatype.boolean()
      return omit ? null : `https://${faker.internet.domainName()}`
    })(),
    notes: (() => {
      const omit = faker.datatype.boolean()
      return omit ? null : faker.lorem.paragraphs(faker.helpers.arrayElement([1, 2]))
    })(),
  }
}).build()

export default ContactFactory
