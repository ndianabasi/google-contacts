import { Contact } from "src/types";
import { contacts } from "../../data/Google_Contacts_Clone_Mock_Data";

export interface ContactStateInterface {
  contacts: Array<Contact>;
  currentContact: Contact | null;
}

function state(): ContactStateInterface {
  return {
    contacts,
    currentContact: null,
  };
}

export default state;
