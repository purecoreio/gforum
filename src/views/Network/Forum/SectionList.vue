<template>
  <div>
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <div v-if="sections!=null">
      <center>
        <v-scroll-y-transition>
          <div v-show="sections.length==0" style="max-width: 600px">
            <Perks class="mb-6" />
          </div>
        </v-scroll-y-transition>
      </center>
      <div v-if="sections.length>0">
        <Section class="mb-4" :section="section" v-for="section in sections" :key="section.uuid" />
      </div>
    </div>
    <div v-if="sections==null">
      <v-card outlined class="pa-1 mb-2" v-for="i in 5" :key="i">
        <v-skeleton-loader type="article" />
        <v-divider />
        <v-row no-gutters>
          <v-col cols="12" v-for="i in 3" :key="i">
            <v-skeleton-loader type="list-item-two-line" />
          </v-col>
        </v-row>
      </v-card>
    </div>
  </div>
</template>

<script>
import Section from "../Forum/Section";
import Perks from "../../Empty/ForumPerks";

export default {
  components: {
    Section: Section,
    Perks: Perks
  },
  props: ["network"],
  mounted() {
    if (this.network != null) {
      this.getSections();
    }
  },
  watch: {
    network: function(val) {
      if (val != null) {
        this.getSections();
      }
    }
  },
  data: () => ({
    show: true,
    sections: null,
    error: "",
    items: [
      {
        text: "Network",
        disabled: true,
      },
      {
        text: "Forum",
        disabled: true,
      }
    ]
  }),
  methods: {
    getSections() {
      let main = this;
      main.network
        .getForum()
        .getSections()
        .then(function(sections) {
          main.error = "";
          main.sections = sections;
        })
        .catch(function(err) {
          main.error = err.message;
        });
    }
  }
};
</script>