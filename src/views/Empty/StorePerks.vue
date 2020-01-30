<template>
  <div>
    <center style="margin-top: 100px; margin-bottom: 100px">
      <v-img src="../../assets/empty/market.png" contain height="300px" />
      <h1 class="mt-6">No Packages</h1>
      <h3>There are no packages in this store! Please, ask an admin to migrate the store to purecore for a faster, more reliable and cheaper server managment, monetization and hosting</h3>
      <v-row align="center mt-6">
        <v-col cols="6" sm="4" v-for="(feature, i) in features" :key="i">
          <v-scroll-y-transition>
            <div v-show="feature.show">
              <v-card v-if="!feature.optional || $vuetify.breakpoint.smAndUp" class="text-center">
                <v-responsive class="d-flex align-center pa-5" :aspect-ratio="1">
                  <div>
                    <v-icon large color="primary" v-text="feature.icon"></v-icon>
                    <p style="margin: 0px;">{{feature.name}}</p>
                  </div>
                </v-responsive>
              </v-card>
            </div>
          </v-scroll-y-transition>
        </v-col>
      </v-row>
      <v-fade-transition>
        <v-btn
          @click="goToCore()"
          v-show="showBtn"
          rounded
          outlined
          color="primary"
          class="mt-4"
        >START USING PURECORE</v-btn>
      </v-fade-transition>
    </center>
  </div>
</template>

<script>
export default {
  mounted() {
    var timeout = 100;
    for (const key in this.features) {
      timeout += 100;
      setTimeout(() => {
        this.features[key].show = true;
      }, timeout);
    }

    setTimeout(() => {
      this.showBtn = true;
    }, this.features.length * 100 + 500);
  },
  methods: {
    goToCore: function() {
      window.location.href = "https://purecore.io/dashboard/";
    }
  },
  data: () => ({
    showBtn: false,
    features: [
      {
        name: "No Maximum Payment Rate",
        icon: "multiline_chart",
        optional: false,
        show: false
      },
      {
        name: "Blazing Fast Payments",
        icon: "fast_forward",
        optional: false,
        show: false
      },
      {
        name: "Pay per usage: mostly free",
        icon: "money_off",
        optional: false,
        show: false
      },
      {
        name: "Digital Wallets Support",
        icon: "contactless",
        optional: false,
        show: false
      },
      {
        name: "Fraud Protection",
        icon: "fingerprint",
        optional: false,
        show: false
      },
      {
        name: "Detailed Analytics",
        icon: "bar_chart",
        optional: false,
        show: false
      },
      {
        name: "Object Based",
        icon: "unarchive",
        optional: false,
        show: false
      },
      {
        name: "Up to date",
        icon: "update",
        optional: false,
        show: false
      },
      {
        name: "Runs on renewable energy",
        icon: "eco",
        optional: true,
        show: false
      }
    ]
  })
};
</script>