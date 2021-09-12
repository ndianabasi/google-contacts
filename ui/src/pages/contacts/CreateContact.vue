<template>
  <q-page class="row justify-center q-mt-lg">
    <div class="q-pa-lg col-xs-12 col-sm-9 col-md-9 col-lg-6 col-xl-6">
      <q-form @submit="submitForm" class="q-gutter-md">
        <q-input
          v-for="({ label, icon, inputType, autocomplete }, key) in form"
          :key="key"
          :for="`${key}_${inputType || 'text'}_input`"
          bottom-slots
          v-model="form[key].value"
          :label="label"
          :dense="dense"
          :class="!icon && 'q-pl-lg'"
          :type="inputType || 'text'"
          :autogrow="inputType === 'textarea'"
          :autofocus="key === 'firstName'"
          :aria-autocomplete="autocomplete"
          :autocomplete="autocomplete"
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
import { FormInterface } from "../../types";

export default defineComponent({
  name: "CreateContact",
  components: {},
  setup() {
    const $q = useQuasar();

    const submitForm = function () {
      console.log("Form submitted");
    };

    const form: FormInterface = reactive({
      firstName: {
        label: "First Name",
        required: true,
        value: "",
        icon: "person",
        autocomplete: "given-name",
      },
      surname: {
        label: "Surname",
        required: true,
        value: "",
        autocomplete: "family-name",
      },
      company: {
        label: "Company",
        required: false,
        value: "",
        icon: "business",
        autocomplete: "organization",
      },
      jobTitle: {
        label: "Job Title",
        required: false,
        value: "",
        autocomplete: "organization-title",
      },
      email1: {
        label: "Email 1",
        required: false,
        value: "",
        icon: "email",
        inputType: "email",
        autocomplete: "email",
      },
      email2: {
        label: "Email 2",
        required: false,
        value: "",
        autocomplete: "email",
      },
      phoneNumber1: {
        label: "Phone Number 1",
        required: false,
        value: "",
        icon: "phone",
        inputType: "email",
        autocomplete: "tel",
      },
      phoneNumber2: {
        label: "Phone Number 2",
        required: false,
        value: "",
        autocomplete: "tel",
      },
      country: {
        label: "Country",
        required: false,
        value: "",
        icon: "location_pin",
        autocomplete: "country-name",
      },
      streetAddressLine1: {
        label: "Street Address Line 1",
        required: false,
        value: "",
        autocomplete: "address-line1",
      },
      streetAddressLine2: {
        label: "Street Address Line 2",
        required: false,
        value: "",
        autocomplete: "address-line2",
      },
      city: {
        label: "City",
        required: false,
        value: "",
        autocomplete: "address-level2",
      },
      postCode: {
        label: "Post Code",
        required: false,
        value: "",
        autocomplete: "postal-code",
      },
      state: {
        label: "State",
        required: false,
        value: "",
        autocomplete: "address-level1",
      },
      birthday: {
        label: "Birthday",
        required: false,
        value: "",
        inputType: "date",
        autocomplete: "bday",
      },
      website: {
        label: "Website",
        required: false,
        value: "",
        inputType: "url",
        autocomplete: "url",
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
