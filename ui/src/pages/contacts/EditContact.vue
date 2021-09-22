<template>
  <CreateContact :contact-id="contactId" edit-mode />
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import CreateContact from "./CreateContact.vue";

export default defineComponent({
  name: "EditContact",
  components: { CreateContact },
  props: {
    contactId: {
      type: String as PropType<string>,
      required: true,
      default: "",
    },
  },
  setup() {
    //
  },
});
</script>
