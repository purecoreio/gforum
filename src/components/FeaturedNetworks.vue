<template>
  <v-row v-if="loading">
    <v-col cols="12" xl="3" md="4" sm="6" v-for="i in 3" :key="i">
      <v-skeleton-loader type="image" class="mx-auto"></v-skeleton-loader>
    </v-col>
  </v-row>
</template>

<style lang="css" scoped>
.title {
  font-family: "Heebo", sans-serif;
  font-weight: 800;
}
</style>

<script>
export default {
  name: "FeaturedNetworks",
  data() {
    return {
      loading: true
    };
  }
};
</script>
