export interface FormItem {
  label: string;
  required: boolean;
  value: string;
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
