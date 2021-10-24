/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  Contact,
  HttpResponse,
  PaginatedContact,
  PaginatedData,
  ResponseData,
} from "src/types";
import { ActionTree } from "vuex";
import { StateInterface } from "../index";
import { ContactStateInterface } from "./state";
import { api } from "../../boot/axios";

const actions: ActionTree<ContactStateInterface, StateInterface> = {
  LOAD_CURRENT_CONTACT({ commit }, id: Contact["id"]): Promise<Contact> {
    return new Promise(async (resolve, reject) => {
      await api
        .get(`/contacts/${id}`)
        .then((response: HttpResponse) => {
          const currentContact = response.data.data as Contact;
          commit("setCurrentContact", currentContact);

          return resolve(currentContact);
        })
        .catch((error) => reject(error));
    });
  },

  LOAD_CONTACTS(
    { commit },
    { nextPage, pageSize }: { nextPage: number; pageSize: number }
  ): Promise<ResponseData["data"]> {
    return new Promise(async (resolve, reject) => {
      await api
        .get("/contacts", { params: { page: nextPage, perPage: pageSize } })
        .then((response: HttpResponse) => {
          const paginatedContacts = response.data.data
            .data as PaginatedContact[];
          const paginatedMeta = response.data.data
            .meta as PaginatedData["meta"];

          commit("setContactList", paginatedContacts);
          commit("setTotalContacts", paginatedMeta.total);

          return resolve(response.data.data);
        })
        .catch((error) => reject(error));
    });
  },
};

export default actions;
