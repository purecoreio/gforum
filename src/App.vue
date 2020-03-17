<template>
  <v-app>
    <v-app-bar clipped-left app dark>
      <v-row align="center">
        <v-col cols="2" xs="2" sm="3" md="3">
          <div class="d-inline-flex" @click="goHome()">
            <v-btn :icon="$vuetify.breakpoint.xsOnly" :text="!$vuetify.breakpoint.xsOnly">
              <span v-if="$vuetify.breakpoint.smAndUp" class="mr-2">gforum</span>
              <v-icon v-if="!drawer || !$vuetify.breakpoint.mdAndDown">videogame_asset</v-icon>
              <v-icon v-if="drawer && $vuetify.breakpoint.mdAndDown">menu</v-icon>
            </v-btn>
          </div>
        </v-col>
        <v-col cols="8" xs="8" sm="6" md="6" align="center">
          <v-autocomplete
            :items="items"
            :loading="isLoading"
            :search-input.sync="search"
            auto-select-first
            flat
            hide-details
            clearable
            solo-inverted
            v-model="selected"
            item-text="name"
            item-value="uuid"
            prepend-inner-icon="mdi-magnify"
            label="Search"
          >
            <template v-slot:no-data>
              <v-list-item>
                <v-list-item-title>
                  Search for your
                  <strong>
                    <vue-typer
                      style="color: white"
                      :text="['favorite games','best friends','known servers']"
                    ></vue-typer>
                  </strong>
                </v-list-item-title>
              </v-list-item>
            </template>
            <template v-slot:item="{ item }">
              <v-list-item-avatar
                color="primary"
                class="headline font-weight-light white--text"
              >{{ item.name.charAt(0).toUpperCase() }}</v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
                <v-list-item-subtitle v-text="item.type"></v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-autocomplete>
        </v-col>
        <v-col cols="2" :xs="2" :sm="3" :md="3" align="end">
          <v-menu allow-overflow transition="slide-y-transition" bottom v-model="loginForm">
            <template v-slot:activator="{ on }">
              <div class="d-inline-flex" v-on="on">
                <v-btn :icon="$vuetify.breakpoint.xsOnly" :text="!$vuetify.breakpoint.xsOnly">
                  <span v-if="session==null && !$vuetify.breakpoint.xsOnly" class="mr-2">Login</span>
                  <span
                    v-if="session!=null && !$vuetify.breakpoint.xsOnly"
                    class="mr-2"
                  >{{ getSessionUsername() }}</span>
                  <v-icon v-if="session==null">account_circle</v-icon>
                  <v-avatar v-if="session!=null" size="24px">
                    <img :src="getSessionPfp()" />
                  </v-avatar>
                </v-btn>
              </div>
            </template>
            <LoginHelper
              style="width: 300px"
              @session="sessionUpdate"
              @shouldInteract="showLoginForm"
            />
          </v-menu>
        </v-col>
      </v-row>
    </v-app-bar>

    <v-content>
      <router-view @setDrawer="setDrawer" :drawer="drawer" ref="childComponent" />
    </v-content>

  </v-app>
</template>

<style lang="scss">
.vue-typer {
  .custom.char {
    &.typed {
      color: white;
    }
  }
}
</style>

<script>
import LoginHelper from "./components/LoginHelper";

export default {
  name: "App",
  components: {
    LoginHelper
  },
  data: () => ({
    loginForm: true,
    isLoading: false,
    items: [],
    links: ["Home", "Report Abuse", "PureCore"],
    model: null,
    search: null,
    selected: null,
    selfRouter: null,
    drawer: false,
    session: null
  }),
  mounted() {
    this.selfRouter = this.$router;
  },
  methods: {
    showLoginForm(value) {
      this.loginForm = value;
    },
    sessionUpdate(value) {
      this.session = value;
    },
    setDrawer(e) {
      this.drawer = e;
    },
    getSessionUsername() {
      if (this.session != null) {
        var session = JSON.parse(this.session);
        return session.player.username;
      } else {
        return "Unknown";
      }
    },
    getSessionPfp() {
      if (this.session != null) {
        var session = JSON.parse(this.session);
        return (
          "https://minotar.net/helm/" + session.player.username + "/100.pngs"
        );
      } else {
        ("https://minotar.net/helm/MHF_Question/100.pngs");
      }
    },
    goHome: function() {
      if (!this.drawer || !this.$vuetify.breakpoint.mdAndDown) {
        this.selfRouter.push({ name: "home" }).catch(function() {
          // ignore
        });
        this.selected = [];
      } else {
        this.$refs.childComponent.openDrawer();
      }
    }
  },
  watch: {
    model(val) {
      if (val != null) this.tab = 0;
      else this.tab = null;
    },
    search(val) {
      // Items have already been loaded

      if (val != "" && val != null) {
        this.isLoading = true;

        // Lazily load input items
        fetch("https://api.purecore.io/rest/2/search/?string=" + val)
          .then(res => res.json())
          .then(res => {
            this.items = res;
          })
          .catch(err => {
            alert(err);
          })
          .finally(() => (this.isLoading = false));
      } else {
        this.selected = [];
        this.$router.push({ name: "home" });
      }
    },
    selected(val) {
      if (val != undefined) {
        var selectedItem = null;
        this.items.forEach(item => {
          if (item.uuid == val) {
            selectedItem = item;
          }
        });

        if (selectedItem != null) {
          if (selectedItem.type == "PLAYER") {
            this.$router.push({
              name: "player",
              params: { uuid: val, page: "wall" }
            });
          } else if (selectedItem.type == "NETWORK") {
            this.$router.push({
              name: "network",
              params: {
                uuid: val,
                page: "news"
              }
            });
          }
        } else {
          this.$router.push({ name: "home" }).catch(function() {
            // ignore
          });
        }
      } else {
        this.$router.push({ name: "home" }).catch(function() {
          // ignore
        });
      }
    }
  }
};
</script>
