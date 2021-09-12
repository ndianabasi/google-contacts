export interface ContactFormItem {
  label: string;
  required: boolean;
  value: string;
  inputType?: "text" | "number" | "date" | "email" | "url" | "textarea";
  icon?: string;
}
export interface ContactFormInterface {
  [index: string]: ContactFormItem;
}
