import { Module } from "vuex";
import { StateInterface } from "../index";
import state, { ContactStateInterface } from "./state";
import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

const contactsModule: Module<ContactStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default contactsModule;
