import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("pages/Index.vue"),
        meta: { title: "Home", showDefaultTitle: false },
      },
      {
        path: "/contacts/new",
        name: "new_contact",
        component: () => import("pages/contacts/CreateContact.vue"),
        meta: { title: "New Contact", showDefaultTitle: true },
      },
      {
        path: "contacts/:contactId/details",
        name: "view_contact",
        component: () => import("pages/contacts/ViewContact.vue"),
        meta: { title: "View Contact", showDefaultTitle: false },
        props: true,
      },
      {
        path: "contacts/:contactId/edit",
        name: "edit_contact",
        component: () => import("pages/contacts/EditContact.vue"),
        meta: { title: "Edit Contact", showDefaultTitle: true },
        props: true,
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
