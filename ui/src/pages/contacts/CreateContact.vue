<template>
  <q-page class="row justify-center q-mt-lg">
    <div class="q-pa-lg col-xs-12 col-sm-9 col-md-9 col-lg-6 col-xl-6">
      <q-form class="q-gutter-md" @submit="submitForm">
        <q-input
          v-for="({ label, icon, inputType, autocomplete }, key) in form"
          :key="key"
          v-model="form[key].value"
          :for="`${key}_${inputType || 'text'}_input`"
          bottom-slots
          :label="label"
          :dense="dense"
          :class="!icon && 'q-pl-lg'"
          :type="inputType || 'text'"
          :autogrow="inputType === 'textarea'"
          :autofocus="key === 'firstName'"
          :aria-autocomplete="autocomplete"
          :autocomplete="autocomplete"
          :error="v$?.[key]?.$error"
          :error-message="
            v$?.[key]?.$errors?.map((error) => error.$message).join('\n')
          "
        >
          <template #before>
            <q-icon v-if="icon" :name="icon" />
          </template>

          <template #after>
            <q-icon
              v-if="form[key].value"
              name="close"
              class="cursor-pointer"
              @click="form[key].value = ''"
            />
          </template>
        </q-input>

        <div class="q-mt-xl row justify-center">
          <div class="col-12 col-md-6 col-lg-6 col-xl-6">
            <q-btn
              class="full-width"
              label="Submit"
              type="submit"
              color="primary"
              @click.prevent="submitForm"
            />
          </div>
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  defineComponent,
  reactive,
  computed,
  PropType,
  watchEffect,
  onBeforeUnmount,
  nextTick,
} from "vue";
import { useQuasar } from "quasar";
import useVuelidate from "@vuelidate/core";
import { required, email, url, helpers, integer } from "@vuelidate/validators";
import { useRouter } from "vue-router";
import { FormInterface, Contact } from "../../types";
import { useStore } from "../../store";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const phoneNumberValidator = helpers.regex(
  /^[+]?[(]{0,1}[0-9]{1,4}[)]?[\(\)-\s\./0-9]*$/
);

export default defineComponent({
  name: "CreateContact",
  props: {
    editMode: {
      type: Boolean as PropType<boolean>,
      required: true,
      default: () => false,
    },
    contactId: {
      type: String as PropType<string>,
      required: false,
      default: "",
    },
  },
  setup(props) {
    const store = useStore();
    const $q = useQuasar();
    const router = useRouter();

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

    const rules = computed(() => ({
      firstName: {
        value: {
          required: helpers.withMessage("First Name is required.", required),
        },
      },
      surname: {
        value: {
          required: helpers.withMessage("Surname is required.", required),
        },
      },
      email1: {
        value: {
          email: helpers.withMessage("Email is invalid", email),
          required: helpers.withMessage("Email 1 is required.", required),
        },
      },
      email2: {
        value: {
          email: helpers.withMessage("Email is invalid", email),
        },
      },
      phoneNumber1: {
        value: {
          phoneNumber: helpers.withMessage(
            "Provide phone number is invalid",
            phoneNumberValidator
          ),
          required: helpers.withMessage(
            "Phone Number 1 is required.",
            required
          ),
        },
      },
      phoneNumber2: {
        value: {
          phoneNumber: helpers.withMessage(
            "Provide phone number is invalid",
            phoneNumberValidator
          ),
        },
      },
      postCode: {
        value: {
          integer: helpers.withMessage(
            "The postal code must be positive integers.",
            integer
          ),
        },
      },
      website: {
        value: {
          url: helpers.withMessage(
            "The value for `website` is invalid. Make sure it contains the protocol: `http` or `https`.",
            url
          ),
        },
      },
    }));

    const v$ = useVuelidate(rules, form, { $lazy: true, $autoDirty: true });

    const currentContact = computed(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      () => store.getters["contacts/currentContact"] as Contact
    );

    const stopContactsEffect = watchEffect(
      async () => {
        if (!props.contactId || !props.editMode) return;

        await store
          .dispatch("contacts/LOAD_CURRENT_CONTACT", props.contactId)
          .then(() => {
            void nextTick(() => {
              Object.keys(currentContact.value).forEach((key) => {
                if (["id", "createdAt", "updatedAt"].includes(key) === false) {
                  form[key].value = currentContact.value[key];
                }
              });
            });
          });
      },
      { flush: "pre" }
    );

    const submitPayload = computed(() => ({
      birthday: form.birthday.value,
      city: form.city.value,
      company: form.company.value,
      country: form.country.value,
      email1: form.email1.value,
      email2: form.email2.value,
      firstName: form.firstName.value,
      jobTitle: form.jobTitle.value,
      notes: form.notes.value,
      phoneNumber1: form.phoneNumber1.value,
      phoneNumber2: form.phoneNumber2.value,
      postCode: form.postCode.value,
      state: form.state.value,
      streetAddressLine1: form.streetAddressLine1.value,
      streetAddressLine2: form.streetAddressLine2.value,
      surname: form.surname.value,
      website: form.website.value,
    }));

    const submitForm = async function () {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      v$?.value?.$touch();
      if (v$?.value?.$error) {
        const numberOfErrors = v$?.value?.$errors?.length;

        $q.notify({
          message: `${numberOfErrors} validation error${
            numberOfErrors > 1 ? "s" : ""
          } exist${numberOfErrors > 1 ? "" : "s"}. Please scroll to check.`,
          type: "negative",
        });
      } else {
        await store
          .dispatch("contacts/CREATE_CONTACT", {
            editMode: props.editMode,
            payload: submitPayload.value,
            contactId: props.contactId,
          })
          .then((contactId) => {
            $q.notify({
              message: props.editMode ? "Contact edited" : "Contact created",
              type: "positive",
            });

            void router.push({
              name: "view_contact",
              params: { contactId },
            });
          });
      }
    };

    onBeforeUnmount(() => {
      void stopContactsEffect();
    });

    return {
      form,
      dense: $q.screen.lt.sm,
      submitForm,
      v$,
    };
  },
});
</script>
