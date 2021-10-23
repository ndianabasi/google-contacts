import { Contact } from "src/types";

export interface ContactStateInterface {
  contacts: Array<Contact>;
  currentContact: Contact | null;
  totalContacts: number | null;
}

function state(): ContactStateInterface {
  return {
    contacts: [],
    currentContact: null,
    totalContacts: null,
  };
}

export default state;
