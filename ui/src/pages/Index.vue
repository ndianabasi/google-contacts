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
            <q-td v-if="isHoverable" style="width: 15%">&nbsp;</q-td>
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
            @click.prevent="
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
                    :src="
                      props.row.profilePicture
                        ? formatProfilePicture(props.row.profilePicture)
                        : 'https://cdn.quasar.dev/img/avatar.png'
                    "
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
                <q-btn
                  flat
                  round
                  color="primary"
                  icon="edit"
                  @click.stop.prevent="
                    $router.push({
                      name: 'edit_contact',
                      params: { contactId: props.row.id },
                    })
                  "
                />
                <q-btn flat round color="accent" icon="more_vert" /> </q-toolbar
            ></q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  defineComponent,
  Ref,
  ref,
  computed,
  nextTick,
  watchEffect,
  onBeforeUnmount,
} from "vue";
import {
  Contact,
  EditedContactInterface,
  PaginatedData,
  VirtualScrollCtx,
} from "../types";
import columns from "../data/table-definitions/contacts";
import { useStore } from "../store";

export default defineComponent({
  name: "HomePage",
  components: {},
  setup() {
    const store = useStore();
    const loading = ref(true);
    const pageSize = 50;
    const nextPage = ref(1);
    const tableRef: Ref<VirtualScrollCtx["ref"] | null> = ref(null);

    const rootURL = computed(() => store.getters.getRootURL);

    const contacts = computed(
      () => store.getters["contacts/contactList"] as Contact[]
    );

    const totalContacts = computed({
      get: () => store.getters["contacts/totalContacts"] as number,
      set: (value) => value,
    });

    const stopContactListEffect = watchEffect(async () => {
      await store
        .dispatch("contacts/LOAD_CONTACTS", {
          nextPage: nextPage.value,
          pageSize,
        })
        .then((data: PaginatedData) => {
          void nextTick(() => {
            tableRef.value?.refresh();
            loading.value = false;
            totalContacts.value = data.meta.total;
          });
        });
    });

    const lastPage = computed(() => Math.ceil(totalContacts.value / pageSize));

    const onScroll = function ({ to, ref: ref2 }: VirtualScrollCtx): void {
      if (
        loading.value === false &&
        nextPage.value < lastPage.value &&
        to === nextPage.value * pageSize - 1
      ) {
        tableRef.value = ref2;
        loading.value = true;
        nextPage.value++;
      }
    };

    const selected = ref([]);

    const visibleColumns = columns
      .filter((column) => column.required)
      .map((column) => column.name);

    const isHoverable = computed(
      () => window.matchMedia("(hover: hover) and (pointer: fine)")?.matches
    );

    const isTouchEnabled = computed(
      () => window.matchMedia("(any-pointer: coarse)")?.matches
    );

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

    onBeforeUnmount(() => stopContactListEffect());

    return {
      selected,
      columns,
      rows: contacts,
      visibleColumns,

      nextPage,
      loading,

      pagination: {
        rowsPerPage: 0,
        page: nextPage.value,
        rowsNumber: totalContacts.value,
      },

      onScroll,
      handleMouseEvents,
      isHoverable,
      isTouchEnabled,
      handleAvatarClick,
      formatProfilePicture: (
        profilePicture: EditedContactInterface["profilePicture"]
      ): string =>
        profilePicture
          ? `${rootURL.value}${
              profilePicture?.breakpoints?.small?.url ??
              profilePicture?.breakpoints?.thumbnail?.url ??
              ""
            }`
          : "",
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
