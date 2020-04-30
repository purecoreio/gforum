<template>
  <div>
    <v-container fluid>
      <v-row fill-height align="start" justify="center">
        <v-col
          fill-height
          cols="12"
          xs="12"
          sm="8"
          md="6"
          lg="5"
          xl="3"
          align="start"
          justify="center"
        >
          <checkout :uuid="uuid" :basket="basket" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import checkout from "../components/CheckoutBox";
export default {
  props: ["uuid", "basket"],
  components: {
    checkout
  }
};
</script>