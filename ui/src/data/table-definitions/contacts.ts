import { Contact, TableColumn } from "src/types";

const columns: Array<TableColumn> = [
  {
    name: "profilePicture",
    required: true,
    label: "Profile Picture",
    align: "center",
    field: "profilePicture",
  },
  {
    name: "firstName",
    align: "center",
    label: "First Name",
    field: "firstName",
    sortable: true,
  },
  {
    name: "surname",
    align: "center",
    label: "Surname",
    field: "surname",
    sortable: true,
  },
  {
    name: "email1",
    align: "center",
    label: "Email 1",
    field: "email1",
    sortable: true,
  },
  {
    name: "phoneNumber1",
    align: "center",
    label: "Phone Number 1",
    field: "phoneNumber1",
    sortable: true,
  },
  {
    name: "jobTitleAndCompany",
    align: "center",
    label: "Job Title & Company",
    field: (row: Contact) => row,
    format: (row: Contact): string | null => {
      if (!row) return null;
      return row?.jobTitle && row?.company
        ? `${row.jobTitle} at ${row.company}`
        : row?.jobTitle && !row?.company
        ? `${row.jobTitle}`
        : !row?.jobTitle && row?.company
        ? `${row.company}`
        : "";
    },
    sortable: false,
  },
];

export default columns;
