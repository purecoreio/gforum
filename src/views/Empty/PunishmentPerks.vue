<template>
  <div>
    <center style="margin-top: 100px; margin-bottom: 100px">
      <v-img src="../../assets/empty/spider.png" contain height="300px" />
      <h1 class="mt-6">Not using GRS</h1>
      <h3>This network is not using our GRS system. GRS is our global system to improve the gaming community, using it will prevent toxic behavior before it happens. All the actions performed by the system are objective based on the rules, individual to each network</h3>
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
        name: "Appeal System",
        icon: "all_inbox",
        optional: false,
        show: false
      },
      {
        name: "Person Object",
        icon: "account_circle",
        optional: false,
        show: false
      },
      {
        name: "Objective",
        icon: "gavel",
        optional: false,
        show: false
      },
      {
        name: "Contextualized",
        icon: "label",
        optional: false,
        show: false
      },
      {
        name: "Prevention",
        icon: "pan_tool",
        optional: false,
        show: false
      },
      {
        name: "Second Chances",
        icon: "query_builder",
        optional: false,
        show: false
      },
      {
        name: "Private",
        icon: "visibility_off",
        optional: false,
        show: false
      },
      {
        name: "Alt Detection",
        icon: "recent_actors",
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