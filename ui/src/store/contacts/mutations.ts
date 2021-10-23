import { Contact } from "src/types";
import { MutationTree } from "vuex";
import { ContactStateInterface } from "./state";

const mutation: MutationTree<ContactStateInterface> = {
  setContactList: (state, payload: Contact[]) => {
    const contactListLength = state.contacts.length;
    const isContactListEmpty = contactListLength === 0;
    state.contacts.splice(
      isContactListEmpty ? 0 : contactListLength - 1,
      0,
      ...payload
    );
  },
  setCurrentContact: (state, payload: Contact) => {
    state.currentContact = payload;
  },
  setTotalContacts: (state, payload: number) => {
    state.totalContacts = payload;
  },
};

export default mutation;
