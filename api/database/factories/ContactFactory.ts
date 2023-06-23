import Contact from 'App/Models/Contact'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { DateTime } from 'luxon'

const ContactFactory = Factory.define(Contact, ({ faker }) => {
  const firstName = faker.person.firstName(faker.helpers.arrayElement(['male', 'female']))
  const surname = faker.person.lastName()
  const omitAddresses = faker.datatype.boolean()

  return {
    firstName,
    surname,
    company: faker.company.name(),
    jobTitle: faker.person.jobTitle(),
    email1: faker.internet.email({ firstName, lastName: surname }),
    email2: `${firstName}.${surname}@${faker.internet.domainName()}`,
    phoneNumber1: faker.phone.number('+234 919 ### ####'),
    phoneNumber2: faker.phone.number('+234 919 ### ####'),
    country: faker.location.country(),
    state: omitAddresses ? null : faker.location.state(),
    streetAddressLine1: omitAddresses ? null : faker.location.streetAddress(),
    streetAddressLine2: omitAddresses ? null : faker.location.streetAddress(),
    postCode: omitAddresses ? null : faker.location.zipCode(),
    birthday: DateTime.fromJSDate(faker.date.past()),
    website: `https://${faker.internet.domainName()}`,
    notes: faker.lorem.paragraphs(faker.helpers.arrayElement([1, 2])),
  }
}).build()

export default ContactFactory
