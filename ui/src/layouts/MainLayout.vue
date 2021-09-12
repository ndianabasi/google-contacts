<template>
  <q-layout view="hHh Lpr lff" class="bg-grey-1">
    <q-header class="bg-white text-grey-8" height-hint="64">
      <q-toolbar class="GPL__toolbar" style="height: 64px">
        <template v-if="showHeaderToolbarTitle">
          <q-btn
            flat
            dense
            round
            @click="toggleLeftDrawer"
            aria-label="Menu"
            icon="menu"
            class="q-ml-md"
          />

          <q-toolbar-title
            @click="$router.push({ name: 'home' })"
            shrink
            class="row items-center no-wrap"
          >
            <q-btn
              v-if="$q.screen.gt.xs"
              round
              unelevated
              color="primary"
              icon="person"
            />
            <span
              :class="[
                $q.screen.gt.xs && 'q-ml-sm',
                $q.screen.lt.xs && 'hidden',
              ]"
              >Contacts</span
            >
          </q-toolbar-title>

          <q-space v-if="!$q.screen.lt.sm" />

          <q-input
            v-if="!$q.screen.lt.sm"
            class="GPL__toolbar-input"
            dense
            standout="bg-primary"
            v-model="search"
            placeholder="Search"
          >
            <template v-slot:prepend>
              <q-icon
                v-if="search"
                name="clear"
                class="cursor-pointer"
                @click="search = ''"
              />
            </template>
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>

          <q-space />

          <q-btn
            v-if="$q.screen.lt.sm"
            @click="toggleMobileSearchInput"
            flat
            round
            ripple
            icon="search"
            class="q-ml-sm q-mr-md"
          />

          <q-btn
            round
            ripple
            dense
            no-wrap
            color="primary"
            icon="add"
            class="q-ml-sm q-ml-md-lg q-mr-md q-px-md"
          >
            <q-menu anchor="top end" self="top end">
              <q-list class="text-grey-8" style="min-width: 100px">
                <q-item aria-hidden="true">
                  <q-item-section
                    class="text-uppercase text-grey-7"
                    style="font-size: 0.7rem"
                    >Create New</q-item-section
                  >
                </q-item>
                <q-item
                  v-for="menu in createMenu"
                  :key="menu.text"
                  clickable
                  v-close-popup
                  aria-hidden="true"
                >
                  <q-item-section avatar>
                    <q-icon :name="menu.icon" />
                  </q-item-section>
                  <q-item-section>{{ menu.text }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>

          <div class="q-gutter-sm row items-center no-wrap">
            <q-btn round flat>
              <q-avatar size="26px">
                <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
              </q-avatar>
              <q-tooltip>Account</q-tooltip>
            </q-btn>
          </div>
        </template>
        <q-input
          v-else
          class="GPL__toolbar-input"
          :style="{ width: '100vw' }"
          dense
          standout="bg-primary"
          v-model="search"
          placeholder="Search"
        >
          <template v-slot:prepend>
            <q-btn
              round
              flat
              ripple
              icon="arrow_back"
              @click="toggleMobileSearchInput"
            />
          </template>
          <template v-slot:append>
            <q-icon v-if="search === ''" name="search" />
            <q-icon
              v-else
              name="clear"
              class="cursor-pointer"
              @click="search = ''"
            />
          </template>
        </q-input>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :show-if-above="$q.screen.gt.sm"
      bordered
      :width="300"
      :breakpoint="500"
      :behavior="$q.screen.lt.md ? 'mobile' : 'default'"
      @click="leftDrawerOpen = false"
    >
      <q-scroll-area class="fit">
        <q-toolbar
          v-if="$q.screen.lt.md"
          class="GPL__toolbar flex-center"
          style="height: 64px"
        >
          <q-toolbar-title shrink class="row items-center no-wrap">
            <img
              src="https://cdn.quasar.dev/img/layout-gallery/logo-google.svg"
            />
            <span class="q-ml-sm q-mb-xs">Contacts</span>
          </q-toolbar-title>
        </q-toolbar>
        <q-list padding>
          <q-item
            v-for="link in links1"
            :key="link.text"
            clickable
            class="GPL__drawer-item"
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" />

          <q-item
            v-for="link in links2"
            :key="link.text"
            clickable
            class="GPL__drawer-item"
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" />

          <q-item
            v-for="link in links3"
            :key="link.text"
            clickable
            class="GPL__drawer-item"
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container class="GPL__page-container">
      <q-toolbar
        v-if="$route.name !== 'home'"
        class="text-primary q-mt-sm sticky-top"
      >
        <q-toolbar-title class="text-center">
          {{ $route.meta.title }}
        </q-toolbar-title>
      </q-toolbar>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
/* eslint-disable operator-linebreak */
/* eslint-disable implicit-arrow-linebreak */
import { ref, computed } from "vue";
import { useQuasar } from "quasar";

export default {
  name: "GoogleContactsLayout",

  setup() {
    const $q = useQuasar();

    const leftDrawerOpen = ref(false);
    const search = ref("");
    const isMobileSearchVisible = ref(false);
    const showHeaderToolbarTitle = computed(
      () =>
        !isMobileSearchVisible.value ||
        (isMobileSearchVisible.value && !$q.screen.lt.sm),
    );

    function toggleLeftDrawer() {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    }

    function toggleMobileSearchInput() {
      if ($q.screen.lt.sm) {
        isMobileSearchVisible.value = !isMobileSearchVisible.value;
      }
    }

    return {
      leftDrawerOpen,
      search,

      links1: [
        { icon: "person", text: "Contacts" },
        { icon: "groups", text: "Groups" },
        { icon: "history", text: "Frequently contacted" },
        { icon: "auto_fix_high", text: "Merge and fix" },
      ],
      links2: [
        { icon: "archive", text: "Other contacts" },
        { icon: "delete", text: "Bin" },
      ],
      links3: [
        { icon: "cloud_upload", text: "Import" },
        { icon: "cloud_download", text: "Export" },
        { icon: "print", text: "Print" },
      ],
      createMenu: [
        { icon: "person_add", text: "Contact" },
        { icon: "group_add", text: "Group" },
      ],

      toggleLeftDrawer,
      toggleMobileSearchInput,
      showHeaderToolbarTitle,
    };
  },
};
</script>

<style lang="sass">
.GPL

  &__toolbar
    height: 64px

  &__toolbar-input
    width: 35%

  &__drawer-item
    line-height: 24px
    border-radius: 0 24px 24px 0
    margin-right: 12px

    .q-item__section--avatar
      padding-left: 12px
      .q-icon
        color: #5f6368

    .q-item__label:not(.q-item__label--caption)
      color: #3c4043
      letter-spacing: .01785714em
      font-size: .875rem
      font-weight: 500
      line-height: 1.25rem

    &--storage
      border-radius: 0
      margin-right: 0
      padding-top: 24px
      padding-bottom: 24px

  &__side-btn
    &__label
      font-size: 12px
      line-height: 24px
      letter-spacing: .01785714em
      font-weight: 500

  @media (min-width: 1024px)
    &__page-container
      padding-left: 94px
</style>
