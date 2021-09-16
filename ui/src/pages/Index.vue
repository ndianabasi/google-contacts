<template>
  <q-page class="row justify-center justify-evenly">
    <div class="q-px-md full-width">
      <q-table
        v-model:selected="selected"
        :rows="rows"
        :columns="columns"
        :loading="loading"
        row-key="id"
        virtual-scroll
        :virtual-scroll-item-size="48"
        :virtual-scroll-sticky-size-start="48"
        :pagination="pagination"
        :rows-per-page-options="[0]"
        binary-state-sort
        selection="multiple"
        flat
        class="sticky-table-header"
        @virtual-scroll="onScroll"
      >
        <template #top-row>
          <q-tr>
            <q-td colspan="100%"> Starred Contacts (xx) </q-td>
          </q-tr>
        </template>

        <template #body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <q-checkbox v-model="props.selected" />
            </q-td>
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <q-avatar v-if="col.name === 'profilePicture'">
                <img src="https://cdn.quasar.dev/img/avatar.png" />
              </q-avatar>
              <span v-else>
                {{ col.value }}
              </span>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed, nextTick } from "vue";
import { VirtualScrollCtx } from "../types";
import { contacts } from "../data/Google_Contacts_Clone_Mock_Data";
import columns from "../data/table-definitions/contacts";

const pageSize = 50;
const lastPage = Math.ceil(contacts.length / pageSize);

export default defineComponent({
  name: "HomePage",
  components: {},
  setup() {
    const nextPage = ref(2);
    const loading = ref(false);

    const rows = computed(() =>
      contacts.slice(0, pageSize * (nextPage.value - 1))
    );

    const onScroll = function ({ to, ref: ref2 }: VirtualScrollCtx): void {
      const lastIndex = rows.value.length - 1;

      if (
        loading.value !== true &&
        nextPage.value < lastPage &&
        to === lastIndex
      ) {
        loading.value = true;

        setTimeout(() => {
          nextPage.value++;
          void nextTick(() => {
            ref2.refresh();
            loading.value = false;
          });
        }, 500);
      }
    };

    return {
      selected: ref([]),
      columns,
      rows,

      nextPage,
      loading,

      pagination: {
        rowsPerPage: 0,
        rowsNumber: rows.value.length,
      },

      onScroll,
    };
  },
});
</script>

<style lang="sass">
.sticky-table-header
  /* height or max-height is important */
  height: 100vh

  .q-table__top,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: white

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
</style>
