<template>
  <div>
    <center>
      <v-scroll-y-transition>
        <div v-show="true" style="max-width: 600px">
          <Perks class="mb-6" />
        </div>
      </v-scroll-y-transition>
    </center>
  </div>
</template>

<script>
import Perks from "../Empty/ForumPerks";

export default {
  components: {
    Perks: Perks
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