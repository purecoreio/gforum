<template>
  <div>
    <v-expand-transition>
      <div v-show="show">
        <v-skeleton-loader type="card-avatar" />
        <v-divider style="margin-top: 10px" />
        <v-row>
          <v-col cols="12" v-for="i in 5" :key="i">
            <v-skeleton-loader type="article" />
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
  props: ["player"],
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