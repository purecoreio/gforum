<template>
  <div>
    <v-expand-transition>
      <div v-show="show">
        <v-row>
          <v-col cols="12" sm="12" lg="4" v-for="i in 5" :key="i">
            <v-skeleton-loader type="image" />
          </v-col>
        </v-row>
      </div>
    </v-expand-transition>
    <v-expand-transition>
      <div v-show="!show">
        <Development />
      </div>
    </v-expand-transition>
  </div>
</template>

<script>
import Development from "../Empty/Development";

export default {
  components: {
    Development: Development
  },
  mounted() {
    let main = this;
    setTimeout(() => {
      main.show = false;
    }, 1000);
  },
  data: () => ({
    show: true
  })
};
</script>