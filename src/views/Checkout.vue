<template>
  <div>
    <v-container fluid>
      <v-row fill-height align="start" justify="center">
        <v-col
          fill-height
          cols="12"
          xs="12"
          sm="12"
          md="10"
          lg="8"
          xl="6"
          align="start"
          justify="center"
        >
          <div :key="item.uuid" v-for="item in this.items">{{item.uuid}}</div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  props: ["uuid", "items"],
  components: {},
  data: () => ({
      network: null
  }),
  mounted() {
    this.$emit("setDrawer", null);
    this.network = this.$store.getters.core.getInstance(this.uuid).asNetwork();
    this.network.getStore()
  }
};
</script>