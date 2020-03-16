<template>
  <div>
    <center style="margin-top: 100px; margin-bottom: 100px">
      <v-img src="../../assets/empty/forum.png" contain height="300px" />
      <h1 class="mt-6">Not A Single Site!</h1>
      <h3>The community is better with gforum! Please, ask an admin to register the current vote sites on purecore in order to enjoy these features</h3>
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
        name: "Vote Analytics",
        icon: "thumbs_up_down",
        optional: false,
        show: false
      },
      {
        name: "Vote Trending",
        icon: "chat",
        optional: false,
        show: false
      },
      {
        name: "Individual Analytics",
        icon: "add_photo_alternate",
        optional: false,
        show: false
      },
      {
        name: "Vote Rewards",
        icon: "gavel",
        optional: false,
        show: false
      },
      {
        name: "Link Performance",
        icon: "tag_faces",
        optional: false,
        show: false
      },
      {
        name: "Vote Assistant",
        icon: "sync",
        optional: false,
        show: false
      },
      {
        name: "Vote Notifications",
        icon: "delete",
        optional: false,
        show: false
      },
      {
        name: "Easy and fast",
        icon: "all_inbox",
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