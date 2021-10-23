import { Contact } from "src/types";
import { ActionTree } from "vuex";
import { StateInterface } from "../index";
import { ContactStateInterface } from "./state";
import { contacts as rawContacts } from "../../data/Google_Contacts_Clone_Mock_Data";

const actions: ActionTree<ContactStateInterface, StateInterface> = {
  LOAD_CURRENT_CONTACT({ commit }, id: Contact["id"]): Promise<Contact> {
    return new Promise((resolve, reject) => {
      try {
        const currentContact = rawContacts
          .filter((contact) => contact.id === id)
          .reduce((prev, cur) => {
            prev = { ...cur };
            return prev;
          }, {} as Contact);

        commit("setCurrentContact", currentContact);

        return resolve(currentContact);
      } catch (error) {
        return reject(error);
      }
    });
  },

  LOAD_CONTACTS(
    { commit },
    { nextPage, pageSize }: { nextPage: number; pageSize: number }
  ): Promise<Contact[]> {
    return new Promise((resolve, reject) => {
      try {
        const requestedContacts = [...rawContacts].slice(
          nextPage <= 1 ? 0 : (nextPage - 1) * pageSize,
          nextPage <= 1 ? pageSize : nextPage * pageSize
        );

        commit("setContactList", requestedContacts);
        commit("setTotalContacts", rawContacts.length);

        return resolve(requestedContacts);
      } catch (error) {
        return reject(error);
      }
    });
  },
};

export default actions;
