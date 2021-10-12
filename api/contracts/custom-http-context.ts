import Contact from 'App/Models/Contact'

declare module '@ioc:Adonis/Core/HttpContext' {
  interface HttpContextContract {
    requestedContact?: Contact
  }
}
