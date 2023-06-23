import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import {
  responsiveAttachment,
  ResponsiveAttachmentContract,
} from '@ioc:Adonis/Addons/ResponsiveAttachment'

export default class Contact extends BaseModel {
  public static selfAssignPrimaryKey = true // <-- Very important

  @column({ isPrimary: true })
  public id: string

  @column()
  public firstName: string

  @column()
  public surname: string

  @column()
  public company: string | null

  @column()
  public jobTitle: string | null

  @column()
  public email1: string

  @column()
  public email2: string | null

  @column()
  public phoneNumber1: string

  @column()
  public phoneNumber2: string | null

  @column()
  public country: string | null

  @column()
  public streetAddressLine1: string | null

  @column()
  public streetAddressLine2: string | null

  @column()
  public city: string | null

  @column()
  public postCode: string | null

  @column()
  public state: string | null

  @column.date({ autoCreate: false, autoUpdate: false })
  public birthday: DateTime | null

  @column()
  public website: string | null

  @column()
  public notes: string | null

  @responsiveAttachment({
    disk: 'local',
    folder: 'avatars/contacts',
    preComputeUrls: true,
    keepOriginal: false,
    breakpoints: {
      medium: 'off',
      large: 'off',
    },
  })
  public profilePicture: ResponsiveAttachmentContract | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static generateUUID(contact: Contact): void {
    /**
     * This static method is used to generate a random ID for the `id` column
     * `cuid()` returns a unique collision-resistant ID
     */
    contact.id = cuid()
  }
}
