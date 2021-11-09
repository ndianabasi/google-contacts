/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { store } from "quasar/wrappers";
import { InjectionKey } from "vue";
import {
  createStore,
  Store as VuexStore,
  useStore as vuexUseStore,
  createLogger,
} from "vuex";

import contacts from "./contacts";
import { ContactStateInterface } from "./contacts/state";

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export interface StateInterface {
  contacts?: ContactStateInterface;
}

export interface RootState {
  httpTimeout: number;
  apiPort: string;
  apiVersion: string | null;
  apiProtocol: string;
  apiHost: string;
}

// provide typings for `this.$store`
declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $store: VuexStore<StateInterface>;
  }
}

// provide typings for `useStore` helper
export const storeKey: InjectionKey<VuexStore<StateInterface>> =
  Symbol("vuex-key");

export default store((/* { ssrContext } */) => {
  const Store = createStore<StateInterface & RootState>({
    state() {
      return {
        apiHost: process.env.API_HOST ?? "127.0.0.1",
        apiPort: process.env.API_PORT ?? "3333",
        apiVersion: null,
        apiProtocol:
          window.location.hostname === "localhost"
            ? "http://"
            : ["staging", "production"].includes(process.env.NODE_ENV)
            ? "https://"
            : "http://",
        httpTimeout: process.env.NODE_ENV === "production" ? 60000 : 30000,
      };
    },

    getters: {
      getHttpProtocol: (state) => state.apiProtocol,
      getRootURL: (state) =>
        `${state.apiProtocol}${state.apiHost}:${state.apiPort}`,
      getBaseURL: (state) =>
        `${state.apiProtocol}${state.apiHost}:${state.apiPort}${
          state.apiVersion ? `/${state.apiVersion}` : ""
        }`,
      getHttpTimeout: (state) => state.httpTimeout,
      getHttpNoAuthOptions: (state, getters) => ({
        baseURL: getters.getBaseURL as string,
        timeout: getters.getHttpTimeout as string,
      }),
    },

    modules: {
      contacts,
    },
    plugins: [createLogger({ logActions: true, logMutations: true })],

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: !!process.env.DEBUGGING,
  });

  return Store;
});

export function useStore() {
  return vuexUseStore(storeKey);
}
