import { GetterTree } from "vuex";
import { StateInterface } from "../index";
import { ContactStateInterface } from "./state";

const getters: GetterTree<ContactStateInterface, StateInterface> = {
  contactList: (state) => state.contacts,
  currentContact: (state) => state.currentContact,
  totalContacts: (state) => state.totalContacts,
};

export default getters;
