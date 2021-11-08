/* eslint-disable camelcase */
import { AxiosError, AxiosResponse } from "axios";

export interface FormItem {
  label: string;
  required: boolean;
  value: string | number | null | undefined;
  inputType?: "text" | "number" | "date" | "email" | "url" | "textarea";
  icon?: string;
  autocomplete?:
    | "given-name"
    | "additional-name"
    | "family-name"
    | "email"
    | "organization"
    | "organization-title"
    | "street-address"
    | "address-line1"
    | "address-line2"
    | "address-line3"
    | "address-level1"
    | "address-level2"
    | "address-level3"
    | "country-name"
    | "postal-code"
    | "bday"
    | "tel"
    | "url";
}
export interface FormInterface {
  [index: string]: FormItem;
}

export interface Contact
  extends Record<string, string | null | undefined | number> {
  id: string;
  firstName: string;
  surname: string;
  company?: string | null | undefined;
  jobTitle?: string | null | undefined;
  email1: string;
  email2?: string | null | undefined;
  phoneNumber1: string;
  phoneNumber2?: string | null | undefined;
  country?: string | null | undefined;
  streetAddressLine1?: string | null | undefined;
  streetAddressLine2?: string | null | undefined;
  city?: string | null | undefined;
  state?: string | null | undefined;
  birthday?: string | null | undefined;
  website?: string | null | undefined;
  notes?: string | null | undefined;
}

export interface TableColumn {
  name: string;
  label: string;
  align?: string;
  sortable?: boolean;
  field: string | ((row: TableColumn) => unknown) | unknown;
  required?: boolean;
  format?: unknown;
}

export interface VirtualScrollCtx {
  to: number;
  ref: {
    refresh: () => void;
  };
}

export interface Menu {
  icon: string;
  text: string;
  to?: string | { name: string; params?: { [index: string]: string | number } };
}

export type PaginatedData = {
  data?: Record<string, unknown>;
  meta: {
    current_page: number;
    first_page: number;
    first_page_url: string;
    last_page: number;
    last_page_url: string;
    next_page_url: string;
    per_page: number;
    previous_page_url: string;
    total: number;
  };
};

export interface ResponseData {
  message?: string;
  status?: number;
  statusText?: string;
  stack?: string;
  data: Record<string, unknown> & string;
  errors?: Array<{ rule: string; field: string; message: string }>;
}

export interface HttpResponse extends AxiosResponse {
  data: ResponseData & string;
  message?: string;
  code?: string;
  stack?: string;
  headers: Record<string, string>;
}

export interface PaginatedContact {
  id: string;
  first_name: string;
  surname: string;
  email1: string;
  phone_number1: string;
  company: string;
  job_title: string;
}

interface ValidationError {
  data?: {
    error?: {
      messages?: {
        errors?: Array<{ field: string; message: string; rule: string }>;
      };
    };
  };
}

export interface HttpError extends AxiosError {
  response?: HttpResponse & ValidationError;
}
