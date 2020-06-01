<template>
  <div>
    <v-dialog v-model="showCouldntOpen" persistent max-width="290">
      <v-card>
        <v-img
          class="white--text align-end"
          src="../../assets/vote/popup.png"
        />
        <v-card-text class="pt-4">
          Please, allow popups in your browser and click retry
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showCouldntOpen = false">Cancel</v-btn>
          <v-btn color="primary" depressed @click="retryUnOpened()"
            >Retry</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <center>
      <div v-if="sites != null">
        <v-scroll-y-transition>
          <div v-show="sites.length == 0" style="max-width: 600px">
            <VotePerks class="mb-6" />
          </div>
        </v-scroll-y-transition>
      </div>
    </center>
    <v-scroll-y-transition v-if="sites != null">
      <div v-show="sites.length > 1">
        <VoteAssistant :sites="sites" />
        <v-alert class="mt-6" color="blue">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="mb-1" style="font-size: 120%">
                <b>Why is voting important?</b>
              </v-list-item-title>
              <p>
                With every vote, the community popularity increases! Isn't that
                amazing? You can also get some amazing rewards in exchange! You
                can also support the server by donating. In certain cases,
                donator packages might change vote rewards for the better!
              </p>
            </v-list-item-content>
            <v-list-item-action v-if="$vuetify.breakpoint.mdAndUp">
              <v-btn to="shop" large text>
                store
                <v-icon class="ml-1">store</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-alert>
      </div>
    </v-scroll-y-transition>
    <v-scroll-y-transition>
      <div v-show="error != ''">
        <v-alert text color="primary">{{ error }}</v-alert>
      </div>
    </v-scroll-y-transition>
    <v-row v-if="this.sites == null && this.error == ''">
      <v-col cols="12" sm="12" lg="4" v-for="i in 5" :key="i">
        <v-skeleton-loader type="image" />
      </v-col>
    </v-row>
    <v-row
      v-if="this.sites != null && this.sites.length > 0 && this.error == ''"
    >
      <v-col
        cols="12"
        sm="12"
        lg="4"
        v-for="site in sites"
        :key="site.votingSite.uuid"
      >
        <Site :site="site" />
      </v-col>
      <v-col cols="12" sm="12" lg="4">
        <v-card
          :style="'background:' + getRandomBackground()"
          @click="allSites()"
        >
          <v-list-item>
            <v-list-item-content class="pt-8 pb-8">
              <v-list-item-title>Open all sites</v-list-item-title>
              <v-list-item-subtitle>In seperate tabs</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-icon v-if="icon != null">
              <v-img :src="icon" />
            </v-list-item-icon>
          </v-list-item>
          <v-divider />
          <v-list-item>
            <v-list-item-content class="pt-3 pb-3">
              <v-list-item-subtitle
                >Vote for {{ sites[0].network.name }}</v-list-item-subtitle
              >
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon>
                <v-icon>how_to_vote</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Site from "../../components/VotingSite.vue";
import VoteAssistant from "../../components/VoteAssistant.vue";
import VotePerks from "../Empty/VotePerks.vue";
export default {
  props: ["network"],
  components: {
    Site: Site,
    VotePerks: VotePerks,
    VoteAssistant: VoteAssistant,
  },
  data: () => ({
    couldntOpen: [],
    showCouldntOpen: false,
    show: true,
    error: "",
    sites: null,
  }),
  methods: {
    getRandomBackground() {
      const getRandomColor = () => Math.floor(200 - Math.random() * 100);

      return (
        "linear-gradient(" +
        Math.random() * 45 +
        "deg, rgba(" +
        getRandomColor() +
        "," +
        getRandomColor() +
        "," +
        getRandomColor() +
        ",1) 50%, rgba(" +
        getRandomColor() +
        "," +
        getRandomColor() +
        "," +
        getRandomColor() +
        ",1) 100%);"
      );
    },
    retryUnOpened() {
      var couldntOpen = [];
      this.couldntOpen.forEach((site) => {
        var win = window.open(site.url, "_blank");
        if (win == null) {
          couldntOpen.push(site);
        }
      });
      if (couldntOpen.length > 0) {
        this.showCouldntOpen = true;
      } else {
        this.showCouldntOpen = false;
      }
      this.couldntOpen = couldntOpen;
    },
    allSites() {
      var couldntOpen = [];
      this.sites.forEach((site) => {
        var win = window.open(site.url, "_blank");
        if (win == null) {
          couldntOpen.push(site);
        }
      });
      this.showCouldntOpen = true;
      this.couldntOpen = couldntOpen;
    },
  },
  mounted() {
    this.$nextTick(() => {
      let main = this;
      this.network
        .getSetupVotingSites()
        .then(function(result) {
          main.sites = result;
        })
        .catch(function(err) {
          main.error = err.message;
        });
    });
  },
};
</script>
