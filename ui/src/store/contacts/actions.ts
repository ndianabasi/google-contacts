import { ActionTree } from "vuex";
import { StateInterface } from "../index";
import { ContactStateInterface } from "./state";

const actions: ActionTree<ContactStateInterface, StateInterface> = {
  someAction(/* context */) {
    // your code
  },
};

export default actions;
