<template>
  <div>
    <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.mdAndUp" app>
      <v-list rounded>
        <v-list-item-group mandatory v-model="item" color="primary">
          <v-list-item v-for="item in items" @click="goTo(item.path)" :key="item.text" link>
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-container fluid>
      <v-row fill-height align="start" justify="center">
        <v-col
          fill-height
          cols="12"
          xs="12"
          sm="12"
          md="10"
          lg="8"
          xl="6"
          align="start"
          justify="center"
        >
          <NetworkNews :network="network" v-if="page=='news'" />
          <NetworkVote :network="network" v-if="page=='vote'" />
          <NetworkShop :network="network" v-if="page=='shop'" />
          <NetworkForum
            :network="network"
            :action="action"
            :actionid="actionid"
            v-if="page=='forum'"
          />
          <NetworkPlayers :network="network" v-if="page=='players'" />
          <NetworkRules :network="network" v-if="page=='rules'" />
          <NetworkDetails :network="network" v-if="page=='details'" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import NetworkNews from "./Network/News";
import NetworkVote from "./Network/Vote";
import NetworkShop from "./Network/Shop";
import NetworkForum from "./Network/Forum";
import NetworkPlayers from "./Network/Players";
import NetworkRules from "./Network/Rules";
import NetworkDetails from "./Network/News";

export default {
  props: ["uuid", "page", "action", "actionid"],
  components: {
    NetworkNews,
    NetworkVote,
    NetworkShop,
    NetworkForum,
    NetworkPlayers,
    NetworkRules,
    NetworkDetails
  },
  data: () => ({
    drawer: null,
    item: 0,
    items: [
      {
        icon: "chat_bubble",
        text: "News",
        active: false,
        path: "news"
      },
      { icon: "how_to_vote", text: "Vote", active: false, path: "vote" },
      { icon: "storefront", text: "Shop", active: false, path: "shop" },
      { icon: "forum", text: "Forum", active: false, path: "forum" },
      { icon: "people", text: "Players", active: false, path: "players" },
      { icon: "gavel", text: "Rules", active: false, path: "rules" },
      { icon: "details", text: "Details", active: false, path: "details" }
    ]
  }),
  mounted() {
    this.calculateIndex(true);
    this.$emit("setDrawer", true);
    this.network = this.$store.getters.core.getInstance(this.uuid).asNetwork();
  },
  methods: {
    openDrawer: function() {
      this.drawer = true;
    },
    goTo: function(path) {
      let main = this;
      this.$router
        .push({
          name: "network",
          params: { uuid: main.uuid, page: path }
        })
        .then(function() {
          main.calculateIndex(true);
        })
        .catch(function() {
          // ignore
        });
    },
    calculateIndex: function(page = false) {
      var to = this.$route;
      try {
        for (let index = 0; index < this.items.length; index++) {
          if (page) {
            if (this.page.includes(this.items[index].path)) {
              this.item = index;
            }
          } else {
            if (to.includes(this.items[index].path)) {
              this.item = index;
            }
          }
        }
      } catch (error) {
        // ignore
      }
    }
  },
  watch: {
    $route() {
      this.calculateIndex();
    },
    uuid() {
      this.$nextTick(() => {
        this.goTo("wall");
      });
    }
  }
};
</script>