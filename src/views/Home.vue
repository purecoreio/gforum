<template>
  <div class="home">
    <GameHeader />
    <FeatureList />

    <v-container fluid>
      <v-row fill-height align="center" justify="center">
        <v-col
          fill-height
          cols="12"
          xs="12"
          sm="12"
          md="10"
          lg="8"
          xl="6"
          align="center"
          justify="center"
        >
          <FeaturedNetworks />
        </v-col>
      </v-row>
    </v-container>

    <v-footer color="grey darken-2" padless>
      <v-row justify="center" no-gutters>
        <v-btn v-for="link in links" :key="link" color="white" text rounded class="my-2">{{ link }}</v-btn>
        <v-col class="grey darken-3 py-4 text-center white--text" cols="12">
          {{ new Date().getFullYear() }} —
          <strong>quiquelhappy</strong>
        </v-col>
      </v-row>
    </v-footer>
  </div>
</template>

<script>
// @ is an alias to /src
import GameHeader from "@/components/GameHeader.vue";
import FeatureList from "@/components/FeatureList.vue";
import FeaturedNetworks from "@/components/FeaturedNetworks.vue";

export default {
  name: "home",
  components: {
    GameHeader,
    FeatureList,
    FeaturedNetworks
  },
  data: () => ({}),
  mounted() {
    this.$emit("setDrawer", false);
  },
  
};
</script>
