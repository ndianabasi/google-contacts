import { Menu } from "src/types";

export const drawerMenuGroupOne: Array<Menu> = [
  { icon: "person", text: "Contacts", to: { name: "home" } },
  { icon: "groups", text: "Groups" },
  { icon: "history", text: "Frequently contacted" },
  { icon: "auto_fix_high", text: "Merge and fix" },
];

export const drawerMenuGroupTwo: Array<Menu> = [
  { icon: "archive", text: "Other contacts" },
  { icon: "delete", text: "Bin" },
];

export const drawerMenuGroupThree: Array<Menu> = [
  { icon: "cloud_upload", text: "Import" },
  { icon: "cloud_download", text: "Export" },
  { icon: "print", text: "Print" },
];

export const createMenu: Array<Menu> = [
  { icon: "person_add", text: "Contact", to: { name: "new_contact" } },
  { icon: "group_add", text: "Group" },
];
