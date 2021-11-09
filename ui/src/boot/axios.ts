/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { boot } from "quasar/wrappers";
import axios, { AxiosInstance } from "axios";
import { Notify } from "quasar";
import { HttpError } from "src/types";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

const api = axios.create();

export default boot(({ app, store }) => {
  api.defaults.baseURL = store.getters.getHttpNoAuthOptions.baseURL;
  api.defaults.timeout = store.getters.getHttpNoAuthOptions.timeout;

  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;

  api.interceptors.response.use(
    (response) => response,
    async (error: HttpError) => {
      if (error?.response?.status === 400) {
        Notify.create({
          message:
            error?.response?.data?.message ??
            (typeof error?.response?.data === "string"
              ? error?.response?.data
              : "You made a bad request."),
          type: "negative",
          position: "top",
          progress: true,
          timeout: 5000,
          actions: [
            {
              label: "Dismiss",
              color: "white",
            },
          ],
        });
      } else if (error?.response?.status === 403) {
        Notify.create({
          message:
            "You are not permitted to perform the requested action. Make sure that you are viewing the right company.",
          type: "negative",
          position: "top",
          progress: true,
          timeout: 5000,
          actions: [
            {
              label: "Dismiss",
              color: "white",
            },
          ],
        });
      } else if (error?.response?.status === 422) {
        // Intercept validation errors
        const validationErrors = error?.response?.data?.error?.messages?.errors;
        if (Array.isArray(validationErrors) && validationErrors.length) {
          const errorListItems: string[] = validationErrors.map(
            (err) => `<li>${err.message}</li>`
          );
          Notify.create({
            message: `<ul>${errorListItems.join("")}</ul>`,
            html: true,
            type: "negative",
            position: "top",
            progress: true,
            timeout: 10000,
            actions: [
              {
                label: "Dismiss",
                color: "white",
              },
            ],
          });
        }
      } else if (error?.response?.status === 404) {
        Notify.create({
          message:
            error?.response?.data?.message ??
            (error?.response?.data as string) ??
            "Request resource was not found!",
          type: "negative",
          position: "top",
          progress: true,
          timeout: 5000,
          actions: [
            {
              label: "Dismiss",
              color: "white",
            },
          ],
        });
      } else if (
        error &&
        error.response &&
        error.response.status &&
        error.response.status >= 500
      ) {
        Notify.create({
          message:
            error?.response?.data?.message ??
            (error?.response?.data as string) ??
            "Internal Server Error",
          type: "negative",
          position: "top",
          progress: true,
          timeout: 5000,
          actions: [
            {
              label: "Dismiss",
              color: "white",
            },
          ],
        });
      }

      return Promise.reject(error);
    }
  );
});

export { api };
