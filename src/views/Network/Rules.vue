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
  </div>
</template>

<script>
import Privacy from "../Empty/Privacy";

export default {
  components: {
    Privacy: Privacy
  },
  props: ["network"],
  mounted() {
    let main = this;
    this.$nextTick(() => {
      this.network
        .getOffences()
        .then(function(offences) {
          alert(JSON.stringify(offences));
        })
        .catch(function(error) {
          main.error = error.message;
        });
    });
  },
  data: () => ({
    show: true,
    error: ""
  })
};
</script>