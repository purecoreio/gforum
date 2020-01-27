<template>
  <div>
    <div v-if="loading">
      <v-row>
        <v-col cols="12" sm="12" lg="4" v-for="i in 1" :key="i">
          <v-skeleton-loader height="200px" type="image" />
        </v-col>
      </v-row>
    </div>
    <v-fade-transition>
      <v-row v-show="!loading">
        <v-col cols="12" sm="12" lg="4" :key="i">
          <div
            @mouseover="hover=true"
            @mouseleave="hover=false"
            style="height: 200px; position: relative; border-radius: 4px; overflow: hidden"
          >
            <v-img
              src="/common/assets/games/minecraft/header.jpg"
              style="height: 100%; width: 100%; position: absolute; top: 0px; left: 0px;"
            >
              <v-fade-transition>
                <div
                  v-if="hover"
                  class="d-flex"
                  style="height: 100%;"
                >
                  <v-img src="/common/assets/games/minecraft/logo.png" style="width: 100%" contain />
                </div>
              </v-fade-transition>
            </v-img>
          </div>
        </v-col>
      </v-row>
    </v-fade-transition>
  </div>
</template>

<script>
export default {
  mounted() {
    let main = this;
    setTimeout(() => {
      main.loading = false;
    }, 200);
  },
  data: () => ({
    loading: true,
    hover: false
  })
};
</script>