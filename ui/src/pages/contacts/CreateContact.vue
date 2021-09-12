<template>
  <q-page class="row justify-center q-mt-lg">
    <div class="q-pa-lg col-xs-12 col-sm-9 col-md-9 col-lg-6 col-xl-6">
      <q-form @submit="submitForm" class="q-gutter-md">
        <q-input
          v-for="({ label, icon, inputType }, key) in form"
          :key="key"
          :for="`${key}_${inputType}_input`"
          bottom-slots
          v-model="form[key].value"
          :label="label"
          :dense="dense"
          :class="!icon && 'q-pl-lg'"
          :type="inputType || 'text'"
          :autogrow="inputType === 'textarea'"
          :autofocus="key === 'firstName'"
        >
          <template v-slot:before>
            <q-icon v-if="icon" :name="icon" />
          </template>

          <template v-slot:after>
            <q-icon
              v-if="form[key].value"
              name="close"
              @click="form[key].value = ''"
              class="cursor-pointer"
            />
          </template>
        </q-input>

        <div class="q-mt-xl">
          <q-btn
            label="Submit"
            type="submit"
            color="primary"
            @click.prevent="submitForm"
          />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { useQuasar } from "quasar";
import { ContactFormInterface } from "../../types";

export default defineComponent({
  name: "CreateContact",
  components: {},
  setup() {
    const $q = useQuasar();

    const submitForm = function () {
      console.log("Form submitted");
    };

    const form: ContactFormInterface = reactive({
      firstName: {
        label: "First Name",
        required: true,
        value: "",
        icon: "person",
      },
      surname: { label: "Surname", required: true, value: "" },
      company: {
        label: "Company",
        required: false,
        value: "",
        icon: "business",
      },
      jobTitle: { label: "Job Title", required: false, value: "" },
      email1: {
        label: "Email 1",
        required: false,
        value: "",
        icon: "email",
        inputType: "email",
      },
      email2: { label: "Email 2", required: false, value: "" },
      phoneNumber1: {
        label: "Phone Number 1",
        required: false,
        value: "",
        icon: "phone",
        inputType: "email",
      },
      phoneNumber2: { label: "Phone Number 2", required: false, value: "" },
      country: {
        label: "Country",
        required: false,
        value: "",
        icon: "location_pin",
      },
      streetAddressLine1: {
        label: "Street Address Line 1",
        required: false,
        value: "",
      },
      streetAddressLine2: {
        label: "Street Address Line 2",
        required: false,
        value: "",
      },
      city: { label: "City", required: false, value: "" },
      postCode: { label: "Post Code", required: false, value: "" },
      state: { label: "State", required: false, value: "" },
      birthday: {
        label: "Birthday",
        required: false,
        value: "",
        inputType: "date",
      },
      website: {
        label: "Website",
        required: false,
        value: "",
        inputType: "url",
      },
      notes: {
        label: "Notes",
        required: false,
        value: "",
        icon: "note",
        inputType: "textarea",
      },
    });

    return {
      form,
      dense: $q.screen.lt.sm,
      submitForm,
    };
  },
});
</script>
