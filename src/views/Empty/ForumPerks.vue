<template>
  <div>
    <center style="margin-top: 100px; margin-bottom: 100px">
      <v-img src="../../assets/empty/forum.png" contain height="300px" />
      <h1 class="mt-6">Empty Forum</h1>
      <h3>The community is better with gforum! Please, ask an admin to migrate the forum in order to enjoy these features</h3>
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
        name: "Public Opinion",
        icon: "thumbs_up_down",
        optional: false,
        show: false
      },
      {
        name: "Subcomment threads",
        icon: "chat",
        optional: false,
        show: false
      },
      {
        name: "Image Uploading",
        icon: "add_photo_alternate",
        optional: false,
        show: false
      },
      {
        name: "Global Reporting",
        icon: "gavel",
        optional: false,
        show: false
      },
      {
        name: "Emote Reactions",
        icon: "tag_faces",
        optional: false,
        show: false
      },
      {
        name: "Discord Sync",
        icon: "sync",
        optional: false,
        show: false
      },
      {
        name: "Antispam",
        icon: "delete",
        optional: false,
        show: false
      },
      {
        name: "Separate System",
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