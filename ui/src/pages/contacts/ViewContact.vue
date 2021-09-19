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
                ><img src="https://cdn.quasar.dev/img/avatar.png"
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
            <q-btn flat round icon="more_vert" />
            <q-btn color="primary">Edit</q-btn>
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
              <q-item v-if="item.text" :key="item.key" v-ripple>
                <q-item-section avatar middle>
                  <q-icon
                    :name="item.icon"
                    color="primary"
                    text-color="white"
                  />
                </q-item-section>

                <q-item-section>
                  <template v-if="item.text && Array.isArray(item.text)">
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
                  </template>
                  <q-item-label
                    v-else
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
                            : undefined
                        "
                        :style="{
                          textDecoration: 'none',
                          color: 'var(--q-primary)',
                        }"
                        ><q-btn round flat icon="outbound"></q-btn
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
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  defineComponent,
  watchEffect,
  reactive,
  PropType,
  onBeforeUnmount,
  computed,
  ComputedRef,
} from "vue";
import { contacts } from "../../data/Google_Contacts_Clone_Mock_Data";
import { Contact } from "../../types";

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
    let contact: Contact | null = reactive({
      id: "",
      firstName: "",
      surname: "",
      email1: "",
      phoneNumber1: "",
    });

    const stopContactsEffect = watchEffect(() => {
      const fetchedContact = contacts.filter(
        (cont) => cont.id === props.contactId
      );
      const [fetchedContactObject] = fetchedContact;
      contact = fetchedContactObject;
    });

    const fullName = computed(
      () => `${contact?.firstName} ${contact?.surname}`
    );

    const jobDescription = computed(() =>
      `${contact?.jobTitle ?? ""}${contact?.jobTitle ? " at " : ""}${
        contact?.company ?? ""
      }`.trim()
    );

    const contactData: ComputedRef<
      Array<{
        icon: string;
        text: string | undefined | null | Array<string | null | undefined>;
        key: string;
        side?: string | undefined;
        sideColor?: string | undefined;
        clampLines?: number | "none";
        linkAs?: "email" | "tel";
      }>
    > = computed(() => [
      {
        icon: "local_phone",
        text: contact?.phoneNumber1,
        side: "mobile",
        sideColor: "purple",
        key: "phoneNumber1",
        linkAs: "tel",
      },
      {
        icon: "local_phone",
        text: contact?.phoneNumber2,
        side: "home",
        sideColor: "purple",
        key: "phoneNumber2",
        linkAs: "tel",
      },
      {
        icon: "email",
        text: contact?.email1,
        key: "email1",
        linkAs: "email",
      },
      {
        icon: "email",
        text: contact?.email2,
        key: "email2",
        linkAs: "email",
      },
      {
        icon: "calendar_today",
        text: contact?.birthday,
        key: "birthday",
      },
      {
        icon: "location_pin",
        text: [
          contact?.streetAddressLine1,
          contact?.streetAddressLine2,
          contact?.city,
          contact?.state,
          contact?.country,
        ],
        key: "address",
      },
      {
        icon: "link",
        text: contact?.website,
        key: "website",
      },
      {
        icon: "note",
        text: contact?.notes,
        key: "notes",
        clampLines: "none",
      },
    ]);

    onBeforeUnmount(() => {
      void stopContactsEffect();
    });

    return { contact, fullName, contactData, jobDescription };
  },
});
</script>
