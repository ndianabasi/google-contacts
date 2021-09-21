<template>
  <q-page class="row justify-center justify-evenly">
    <div class="q-px-md full-width">
      <template v-if="selected.length">
        <q-toolbar class="text-primary">
          <q-btn flat round dense icon="more_vert" />
          <q-space />
          <span class="text-bold">{{ selected.length }} selected</span>
        </q-toolbar>
      </template>
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
        separator="none"
        :visible-columns="visibleColumns"
        class="sticky-table-header"
        @virtual-scroll="onScroll"
      >
        <template #header="props">
          <q-tr>
            <q-th auto-width>
              <q-checkbox v-model="props.selected" />
            </q-th>
            <q-th
              v-for="column in props.cols"
              :key="column.name"
              class="text-center"
            >
              {{ column.label }}
            </q-th>
            <q-td v-if="isHoverable" auto-width>&nbsp;</q-td>
          </q-tr>
        </template>

        <template #top-row>
          <q-tr>
            <q-td colspan="100%"> Starred Contacts (xx) </q-td>
          </q-tr>
        </template>

        <template #body="props">
          <q-tr
            :props="props"
            @mouseover="handleMouseEvents"
            @mouseleave="handleMouseEvents"
            @click.stop.prevent="
              $router.push({
                name: 'view_contact',
                params: { contactId: props.row.id },
              })
            "
          >
            <q-td auto-width>
              <transition
                v-if="!props.selected"
                appear
                enter-active-class="animated flipInX"
                leave-active-class="animated flipOutX"
              >
                <q-avatar>
                  <img
                    src="https://cdn.quasar.dev/img/avatar.png"
                    @click.stop.prevent="handleAvatarClick(props)"
                  />
                </q-avatar>
              </transition>

              <transition
                v-else
                appear
                enter-active-class="animated flipInY"
                leave-active-class="animated flipOutY"
              >
                <q-avatar
                  color="primary"
                  @click.stop.prevent="handleAvatarClick(props)"
                  ><q-icon name="check" color="white" />
                </q-avatar>
              </transition>

              <q-checkbox
                v-model="props.selected"
                :style="{ display: 'none' }"
              />
            </q-td>

            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.value }}
            </q-td>

            <q-td v-if="isHoverable" auto-width
              ><q-toolbar class="hidden">
                <q-btn flat round color="yellow" icon="star" />
                <q-btn flat round color="primary" icon="edit" />
                <q-btn flat round color="accent" icon="more_vert" /> </q-toolbar
            ></q-td>
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
    const selected = ref([]);

    const visibleColumns = columns
      .filter((column) => column.required)
      .map((column) => column.name);

    const rows = computed(() =>
      contacts.slice(0, pageSize * (nextPage.value - 1))
    );

    const isHoverable = computed(
      () => window.matchMedia("(hover: hover) and (pointer: fine)")?.matches
    );

    const isTouchEnabled = computed(
      () => window.matchMedia("(any-pointer: coarse)")?.matches
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

    const handleMouseEvents = function (event: MouseEvent) {
      if (isHoverable.value) {
        const eventName = event.type;

        const target = event.target as HTMLElement;
        const avatar = target.querySelector(".q-avatar") as HTMLElement;
        const checkbox = target.querySelector(".q-checkbox") as HTMLElement;

        if (avatar && checkbox) {
          if (eventName === "mouseover") {
            avatar.style.display = "none";
            checkbox.style.display = "inline-flex";
          }
          if (eventName === "mouseleave") {
            avatar.style.display = "inline-flex";
            checkbox.style.display = "none";
          }
        }
      }
    };

    const handleAvatarClick = function (props: { selected: boolean }) {
      if (isTouchEnabled.value) {
        props.selected = !props.selected;
      }
    };

    return {
      selected,
      columns,
      rows,
      visibleColumns,

      nextPage,
      loading,

      pagination: {
        rowsPerPage: 0,
        rowsNumber: rows.value.length,
      },

      onScroll,
      handleMouseEvents,
      isHoverable,
      isTouchEnabled,
      handleAvatarClick,
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
