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
          <v-scroll-y-transition>
            <div v-show="error!=''">
              <v-alert text color="primary">{{error}}</v-alert>
            </div>
          </v-scroll-y-transition>

          <PlayerWall :player="player" v-if="page=='wall'" />
          <PlayerActivity :player="player" v-if="page=='activity'" />
          <PlayerInventory :player="player" v-if="page=='inventory'" />
          <PlayerAdvancements :player="player" v-if="page=='advancements'" />
          <PlayerFriends :player="player" v-if="page=='friends'" />
          <PlayerNetworks :player="player" v-if="page=='networks'" />
          <PlayerPosts :player="player" v-if="page=='posts'" />
          <PlayerAppeals :player="player" v-if="page=='appeals'" />
          <PlayerGames :player="player" v-if="page=='games'" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>


<script>
import PlayerWall from "./Player/Wall";
import PlayerActivity from "./Player/Activity";
import PlayerInventory from "./Player/Inventory";
import PlayerAdvancements from "./Player/Advancements";
import PlayerFriends from "./Player/Friends";
import PlayerNetworks from "./Player/Networks";
import PlayerPosts from "./Player/Posts";
import PlayerAppeals from "./Player/Appeals";
import PlayerGames from "./Player/Games";

export default {
  components: {
    PlayerWall: PlayerWall,
    PlayerActivity: PlayerActivity,
    PlayerInventory: PlayerInventory,
    PlayerAdvancements: PlayerAdvancements,
    PlayerFriends: PlayerFriends,
    PlayerNetworks: PlayerNetworks,
    PlayerPosts: PlayerPosts,
    PlayerAppeals: PlayerAppeals,
    PlayerGames: PlayerGames
  },
  props: ["uuid", "page"],
  data: () => ({
    item: 0,
    drawer: null,
    error: "",
    player: null,
    items: [
      {
        icon: "chat_bubble",
        text: "Wall",
        active: false,
        path: "wall",
        visible: true
      },
      {
        icon: "compare_arrows",
        text: "Activity",
        active: false,
        path: "activity",
        visible: true
      },
      {
        icon: "dashboard",
        text: "Inventory",
        active: false,
        path: "inventory",
        visible: true
      },
      {
        icon: "widgets",
        text: "Advancements",
        active: false,
        path: "advancements",
        visible: true
      },
      {
        icon: "people",
        text: "Friends",
        active: false,
        path: "friends",
        visible: true
      },
      {
        icon: "storage",
        text: "Networks",
        active: false,
        path: "networks",
        visible: true
      },
      {
        icon: "chat",
        text: "Posts",
        active: false,
        path: "posts",
        visible: true
      },
      {
        icon: "gavel",
        text: "Appeals",
        active: false,
        path: "appeals",
        visible: false
      },
      {
        icon: "gamepad",
        text: "Games",
        active: false,
        path: "games",
        visible: true
      }
    ]
  }),
  methods: {
    openDrawer: function(){
      this.drawer=true
    },
    isOwner() {
      if (localStorage.sessiongforum) {
        try {
          if (this.uuid == JSON.parse(localStorage.sessiongforum).player.id) {
            return true;
          } else {
            return false;
          }
        } catch (error) {
          return false;
        }
      } else {
        return false;
      }
    },
    goTo: function(path) {
      let main = this;
      this.$router
        .push({
          name: "player",
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
  mounted() {
    this.$emit("setDrawer", true);
    let main = this;
    var instance = main.$store.getters.core.getInstance(null);
    instance
      .asNetwork()
      .getPlayer(main.uuid)
      .then(function(data) {
        main.player = data;
      })
      .catch(function(err) {
        main.error = err.message;
      });
    this.$nextTick(() => {
      main.calculateIndex(true);
    });

    for (const key in this.items) {
      const element = this.items[key];
      if (element.path == "appeals") {
        this.items[key].visible = this.isOwner();
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