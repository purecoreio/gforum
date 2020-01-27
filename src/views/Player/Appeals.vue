<template>
  <div>
    <center>
      <v-scroll-y-transition>
        <div v-show="error!=''" style="max-width: 600px">
          <Privacy class="mb-6" />
          <v-alert text color="primary">{{error}}</v-alert>
        </div>
      </v-scroll-y-transition>
    </center>
    <v-expand-transition>
      <div v-show="show && error==''">
        <v-timeline dense>
          <v-timeline-item v-for="index in 10" :key="index" color="primary" small fill-dot>
            <v-card class="elevation-2">
              <v-skeleton-loader type="article" />
            </v-card>
          </v-timeline-item>
        </v-timeline>
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
import Privacy from "../Empty/Privacy";

export default {
  components: {
    Development: Development,
    Privacy: Privacy
  },
  props: ["player"],
  mounted() {
    let main = this;
    this.$nextTick(() => {
      try {
        main.player
          .getPunishments(null, main.page)
          .then(function(punishmentList) {
            punishmentList.forEach(punishment => {
              alert(JSON.stringify(punishment.getOffenceList()));
            });
          })
          .catch(function(err) {
            main.error = err.message;
          });
      } catch (error) {
        main.error = error.message;
      }
    });
  },
  data: () => ({
    show: true,
    error: "",
    page: 0
  })
};
</script>