<template>
  <div>
    <v-expand-transition>
      <v-card v-show="news!=null" dark outlined>
        <v-card :style="'background: '+getRandomBackground()">
          <v-row align="center" style="height: 300px">
            <v-col cols="12" md="6">
              <div v-if="$vuetify.breakpoint.mdAndUp" class="pa-5">
                <h1>News Example!</h1>
                <h3>An amazing headline that will interest your players!</h3>
                <v-btn class="mt-4">Read Article</v-btn>
              </div>
              <div v-if="!$vuetify.breakpoint.mdAndUp" class="pa-5 text-center">
                <h1>News Example!</h1>
                <h3>An amazing headline that will interest your players!</h3>
                <v-btn class="mt-4">Read Article</v-btn>
              </div>
            </v-col>
            <v-col style="height: 300px" cols="1" md="6" v-if="$vuetify.breakpoint.mdAndUp">
              <v-img height="100%" contain src="../../assets/empty/aquatic.png"></v-img>
            </v-col>
          </v-row>
        </v-card>
      </v-card>
    </v-expand-transition>
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <SectionList :network="network" />
  </div>
</template>

<script>
import SectionList from "./Forum/SectionList";

export default {
  props: ["network"],
  components: {
    SectionList: SectionList
  },
  methods: {
    getRandomColor: function() {
      return Math.floor(255 - Math.random() * 200);
    },
    getRandomBackground: function() {
      var deg = Math.random() * 180;

      var gradient =
        "linear-gradient(" +
        deg +
        "deg, rgba(" +
        this.getRandomColor() +
        "," +
        this.getRandomColor() +
        "," +
        this.getRandomColor() +
        ",1) 50%, rgba(" +
        this.getRandomColor() +
        "," +
        this.getRandomColor() +
        "," +
        this.getRandomColor() +
        ",1) 100%);";
      return gradient;
    }
  },
  data: () => ({
    news: ["hello"],
    items: [
      {
        text: "Network",
        disabled: true
      },
      {
        text: "Forum",
        disabled: false
      }
    ]
  }),
};
</script>