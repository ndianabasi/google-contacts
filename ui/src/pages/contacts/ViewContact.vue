<template>
  <q-page class="row justify-center q-my-lg">
    <div
      class="q-pa-lg q-mb-lg col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-9"
    >
      <q-toolbar class="text-primary">
        <q-btn
          color="primary"
          flat
          round
          icon="arrow_back"
          @click.prevent="$router.go(-1)"
        />
        <q-space />
        <template v-if="!$q.screen.gt.sm">
          <q-btn color="primary" flat round icon="star" />
          <q-btn flat round icon="more_vert" />
        </template>
      </q-toolbar>
      <div :class="['row', $q.screen.lt.lg && 'justify-center']">
        <div class="col-sm-12 col-md-9 col-xs-12 col-lg-9 col-xl-9">
          <div class="row items-center justify-center">
            <div :class="[$q.screen.lt.lg ? 'col-auto' : '']">
              <q-avatar size="200px"
                ><img
                  :src="
                    profilePicture
                      ? profilePicture
                      : 'https://cdn.quasar.dev/img/avatar.png'
                  "
              /></q-avatar>
            </div>
            <div :class="{ 'col-auto': true, 'q-mr-auto': $q.screen.gt.sm }">
              <div
                :class="{
                  column: true,
                  'q-ml-xl': $q.screen.gt.sm,
                }"
              >
                <div
                  :class="[
                    'col text-h5',
                    !$q.screen.gt.sm && 'text-center q-mt-md',
                  ]"
                >
                  {{ fullName }}
                </div>
                <div
                  v-if="jobDescription"
                  :class="[
                    'col text-caption',
                    !$q.screen.gt.sm && 'text-center q-mt-xs',
                  ]"
                >
                  {{ jobDescription }}
                </div>
                <div class="col q-mt-md q-gutter-xs">
                  <q-btn
                    v-for="group in 3"
                    :key="`group_${group}`"
                    outline
                    rounded
                    color="dark"
                    :label="'Group ' + group"
                  />
                  <q-btn flat round color="primary" icon="group_add" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="$q.screen.gt.sm"
          class="col-md-3 col-lg-3 col-xl-3 q-ml-auto q-mt-auto"
        >
          <q-toolbar>
            <q-btn color="primary" flat round icon="star" />
            <q-btn flat round ripple icon="more_vert" class="q-mr-1">
              <q-menu anchor="bottom end" self="top end">
                <q-list class="text-grey-8" style="min-width: 100px">
                  <q-item
                    v-close-popup
                    clickable
                    class="text-negative"
                    @click="confirmDeletion"
                  >
                    <q-item-section avatar>
                      <q-icon name="delete_outline" />
                    </q-item-section>
                    <q-item-section>Delete Contact</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
            <q-btn
              :to="{
                name: 'edit_contact',
                params: { contactId: $route.params.contactId },
              }"
              color="primary"
              >Edit</q-btn
            >
          </q-toolbar>
        </div>
      </div>
      <div class="row q-mt-lg justify-center">
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <q-list bordered padding class="rounded-borders">
            <q-item-label class="text-bold" header
              >Contact Details</q-item-label
            >

            <template v-for="item in contactData">
              <q-item
                v-if="
                  (item.text &&
                    Array.isArray(item.text) &&
                    !isNullArray(item.text)) ||
                  typeof item.text === 'string'
                "
                :key="item.key"
                v-ripple
              >
                <q-item-section avatar middle>
                  <q-icon
                    :name="item.icon"
                    color="primary"
                    text-color="white"
                  />
                </q-item-section>

                <q-item-section v-if="Array.isArray(item.text)">
                  <q-item-label class="text-caption" caption>{{
                    item.label
                  }}</q-item-label>
                  <q-item-label
                    v-for="(line, index) in item.text.filter((l) => l)"
                    :key="'item_line_' + index"
                    :lines="
                      line?.clampLines && line?.clampLines !== 'none'
                        ? line.clampLines
                        : line?.clampLines && line?.clampLines === 'none'
                        ? undefined
                        : 1
                    "
                    >{{ line }}</q-item-label
                  >
                </q-item-section>
                <q-item-section v-if="typeof item.text === 'string'">
                  <q-item-label class="text-caption" caption>{{
                    item.label
                  }}</q-item-label>
                  <q-item-label
                    :lines="
                      item?.clampLines && item?.clampLines !== 'none'
                        ? item.clampLines
                        : item?.clampLines && item?.clampLines === 'none'
                        ? undefined
                        : 1
                    "
                    >{{ item.text }}</q-item-label
                  >
                </q-item-section>

                <q-item-section side>
                  <div class="row items-center">
                    <div class="col-auto">
                      <q-badge
                        v-if="item.side && item.sideColor"
                        rounded
                        :color="item.sideColor + '-2'"
                        :text-color="item.sideColor + '-9'"
                        >{{ item.side }}</q-badge
                      >
                    </div>
                    <div class="col-auto">
                      <a
                        v-if="item.linkAs"
                        :href="
                          item.linkAs === 'email'
                            ? `mailto:${item.text}`
                            : item.linkAs === 'tel'
                            ? `tel:${item.text}`
                            : item.linkAs === 'website'
                            ? item.text
                            : undefined
                        "
                        :style="{
                          textDecoration: 'none',
                          color: 'var(--q-primary)',
                        }"
                        ><q-btn
                          :to="{
                            name: 'edit_contact',
                            params: { contactId: $route.params.contactId },
                          }"
                          round
                          flat
                          icon="outbound"
                        ></q-btn
                      ></a>
                    </div>
                  </div>
                </q-item-section>
              </q-item>
            </template>
          </q-list>
        </div>
      </div>
    </div>
    <q-page-sticky
      v-if="!$q.screen.gt.sm"
      position="bottom-right"
      :offset="[18, 25]"
    >
      <q-btn fab icon="edit" color="primary" />
    </q-page-sticky>
  </q-page>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */

type ContactData = Array<{
  icon: string;
  text: string | undefined | null | Array<string | null | undefined>;
  label: string;
  key: string;
  side?: string | undefined;
  sideColor?: string | undefined;
  clampLines?: number | "none";
  linkAs?: "email" | "tel" | "website";
}>;

import {
  defineComponent,
  watchEffect,
  PropType,
  onBeforeUnmount,
  computed,
  ComputedRef,
} from "vue";

import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { EditedContactInterface } from "../../types";
import { useStore } from "../../store";

export default defineComponent({
  name: "ContactDetails",
  props: {
    contactId: {
      type: String as PropType<string>,
      required: true,
      default: "",
    },
  },
  setup(props) {
    const store = useStore();
    const $q = useQuasar();
    const router = useRouter();

    const currentContact = computed(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      () => store.getters["contacts/currentContact"] as EditedContactInterface
    );

    const stopContactsEffect = watchEffect(() => {
      void store.dispatch("contacts/LOAD_CURRENT_CONTACT", props.contactId);
    });

    const fullName = computed(
      () =>
        `${currentContact.value?.firstName} ${currentContact.value?.surname}`
    );

    const jobDescription = computed(() =>
      `${currentContact.value?.jobTitle ?? ""}${
        currentContact.value?.jobTitle ? " at " : ""
      }${currentContact.value?.company ?? ""}`.trim()
    );

    const profilePicture = computed(() => {
      const rootURL = computed(() => store.getters.getRootURL);
      return `${rootURL.value}${
        currentContact?.value?.profilePicture?.breakpoints?.small?.url ??
        currentContact?.value?.profilePicture?.breakpoints?.thumbnail?.url ??
        ""
      }`;
    });

    const contactData: ComputedRef<ContactData> = computed(() => [
      {
        icon: "local_phone",
        text: currentContact.value?.phoneNumber1,
        label: "Phone Number 1",
        side: "mobile",
        sideColor: "purple",
        key: "phoneNumber1",
        linkAs: "tel",
      },
      {
        icon: "local_phone",
        text: currentContact.value?.phoneNumber2,
        label: "Phone Number 2",
        side: "home",
        sideColor: "purple",
        key: "phoneNumber2",
        linkAs: "tel",
      },
      {
        icon: "email",
        text: currentContact.value?.email1,
        label: "Email 1",
        key: "email1",
        linkAs: "email",
      },
      {
        icon: "email",
        text: currentContact.value?.email2,
        label: "Email 2",
        key: "email2",
        linkAs: "email",
      },
      {
        icon: "calendar_today",
        text: currentContact.value?.birthday,
        label: "Birthday",
        key: "birthday",
      },
      {
        icon: "location_pin",
        text: [
          currentContact.value?.streetAddressLine1,
          currentContact.value?.streetAddressLine2,
          currentContact.value?.city,
          currentContact.value?.state,
          currentContact.value?.country,
        ],
        label: "Address",
        key: "address",
      },
      {
        icon: "link",
        text: currentContact.value?.website,
        label: "Website",
        key: "website",
        linkAs: "website",
      },
      {
        icon: "note",
        text: currentContact.value?.notes,
        label: "Notes",
        key: "notes",
        clampLines: "none",
      },
    ]);

    const isNullArray = function (array: Array<string | null | undefined>) {
      return array.every(
        (item) => !item || item === null || item === undefined
      );
    };

    const deleteContact = async function () {
      await store
        .dispatch("contacts/DELETE_CONTACT", props.contactId)
        .then(() => {
          $q.notify({
            message: "Contact deleted",
            type: "positive",
          });

          void router.push({
            name: "home",
          });
        });
    };

    const confirmDeletion = function () {
      $q.dialog({
        title: "Confirm",
        message: "Please confirm this deletion?",
        cancel: {
          textColor: "green-6",
          flat: true,
        },
        ok: { textColor: "red-6", flat: true },
        persistent: true,
      })
        .onOk(async () => {
          await deleteContact();
        })
        .onCancel(() => {
          $q.notify({
            message: "Contact not deleted",
            type: "positive",
          });
        });
    };

    onBeforeUnmount(() => {
      void stopContactsEffect();
    });

    return {
      currentContact,
      fullName,
      contactData,
      jobDescription,
      isNullArray,
      profilePicture,
      confirmDeletion,
    };
  },
});
</script>
