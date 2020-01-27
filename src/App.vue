<template>
  <v-app>
    <v-overlay :value="overlay">
      <v-btn icon @click="overlay = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-overlay>
    <v-app-bar clipped-left app dark>
      <v-row align="center">
        <v-col cols="2" xs="2" sm="3" md="3">
          <div class="d-inline-flex" @click="goHome()">
            <v-btn text>
              <span v-if="$vuetify.breakpoint.mdAndUp" class="mr-2">gforum</span>
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
                <v-btn v-if="$vuetify.breakpoint.smAndUp" text>
                  <span v-if="session==null" class="mr-2">Login</span>
                  <span v-if="session!=null" class="mr-2">{{ getSessionUsername() }}</span>
                  <v-icon v-if="session==null">account_circle</v-icon>
                  <v-avatar v-if="session!=null" size="24px">
                    <img :src="getSessionPfp()" />
                  </v-avatar>
                </v-btn>
                <v-btn v-if="$vuetify.breakpoint.xsOnly" icon>
                  <v-icon v-if="session==null">account_circle</v-icon>
                  <v-avatar v-if="session!=null" size="24px">
                    <img :src="getSessionPfp()" />
                  </v-avatar>
                </v-btn>
              </div>
            </template>
            <v-card style="width: 300px">
              <v-expand-transition>
                <div v-show="loginError!=''">
                  <v-alert style="margin-bottom: 0px" tile color="primary" text>{{loginError}}</v-alert>
                </div>
              </v-expand-transition>
              <div v-if="accounts.length<=0 && session==null">
                <center>
                  <v-img src="./assets/login/whoareyou.gif" />
                  <v-sheet style="padding: 10px; width: 100%; display: block" class="grey darken-4">
                    <p style="margin: 0px">Who are you?</p>
                  </v-sheet>
                  <v-sheet style="padding: 10px; width: 100%; display: block" class="grey darken-3">
                    <p
                      style="margin: 0px"
                    >No accounts where detected in your connection, you must play on a network using purecore first</p>
                  </v-sheet>
                </center>
              </div>
              <div v-if="accounts.length>0 && session==null">
                <v-list>
                  <v-list-item
                    v-for="(account, index) in accounts"
                    :key="index"
                    style="margin: 0px"
                    @click="login(account)"
                  >
                    <v-list-item-avatar>
                      <v-img :src="'https://minotar.net/helm/'+account.player.username+'/100.png'"></v-img>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>{{ account.player.username }}</v-list-item-title>
                    </v-list-item-content>

                    <v-list-item-icon>
                      <v-icon v-if="!loadingAccounts.includes(account)" color="primary">lock</v-icon>
                      <v-progress-circular
                        v-if="loadingAccounts.includes(account)"
                        size="20"
                        color="primary"
                        indeterminate
                      ></v-progress-circular>
                    </v-list-item-icon>
                  </v-list-item>
                </v-list>
              </div>
              <div v-if="session!=null">
                <v-expand-transition>
                  <div v-show="discordLinked">
                    <v-card tile color="grey darken-4" class="mx-auto">
                      <v-list-item three-line>
                        <v-list-item-content>
                          <v-list-item-title class="headline">{{ getSessionUsername() }}</v-list-item-title>
                          <v-list-item-subtitle>{{ getSessionCoreId() }}</v-list-item-subtitle>
                        </v-list-item-content>

                        <v-list-item-avatar size="80">
                          <v-img :src="getSessionPfp()" />
                        </v-list-item-avatar>
                      </v-list-item>
                    </v-card>
                    <v-sheet tile color="grey darken-3" class="pa-4">
                      <v-btn
                        dark
                        block
                        depressed
                        color="primary"
                        style="color: black"
                        @click="logout()"
                      >Logout</v-btn>
                    </v-sheet>
                  </div>
                </v-expand-transition>
                <v-expand-transition>
                  <div v-show="!discordLinked">
                    <v-alert color="primary" tile style="margin-bottom: 0px">
                      <v-list-item three-line>
                        <v-list-item-content>
                          <v-list-item-title class="headline black--text">Secure your account</v-list-item-title>
                          <v-list-item-subtitle
                            class="black--text"
                            style="display: block; overflow: auto"
                          >Link your Discord account in order to lock it from people in the same network. You'll also enjoy Discord-related features!</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-alert>
                    <v-sheet tile color="grey darken-3" class="pa-4">
                      <v-btn
                        dark
                        block
                        depressed
                        color="primary"
                        style="color: black"
                        @click="discordLink()"
                      >LINK DISCORD</v-btn>
                    </v-sheet>
                  </div>
                </v-expand-transition>
              </div>
            </v-card>
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
import core from "purecore";

export default {
  name: "App",

  data: () => ({
    isLoading: false,
    items: [],
    model: null,
    search: null,
    selected: null,
    links: ["Home", "Report Abuse", "PureCore"],
    selfRouter: null,
    accounts: [],
    loadingAccounts: [],
    loginError: "",
    loginForm: false,
    request: null,
    overlay: false,
    session: null,
    discordLinked: true,
    drawer: false
  }),
  mounted() {
    this.selfRouter = this.$router;
    this.session = localStorage.sessiongforum;
    var mainObj = this;

    this.$nextTick(() => {
      mainObj.getSessionHashes();
    });
  },
  methods: {
    setDrawer(e) {
      this.drawer = e;
    },
    discordLink: function() {
      this.discordLinked = true;
      this.loginForm = true;

      this.openWindow(
        this.request.getValidationUrl(),
        "Link Discord",
        window,
        400,
        600,
        false
      );
    },
    getSessionHashes: function() {
      var mainObj = this;
      var login = false;

      if (localStorage.sessiongforum) {
        if (
          localStorage.sessiongforum != undefined &&
          localStorage.sessiongforum != null &&
          localStorage.sessiongforum != "null" &&
          localStorage.sessiongforum != "undefined"
        ) {
          this.session = localStorage.sessiongforum;
        } else {
          localStorage.removeItem("sessiongforum");
          login = true;
        }
      } else {
        login = true;
      }

      if (login) {
        this.$store.getters.core
          .requestGlobalHash()
          .then(function(globalHashList) {
            mainObj.loginError = "";
            mainObj.accounts = [];
            mainObj.accounts = globalHashList;
          })
          .catch(function(err) {
            mainObj.loginError = err.message;
          });
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
    },
    login: function(account) {
      let mainobj = this;
      mainobj.discordLinked = false;
      mainobj.loadingAccounts.push(account);
      account
        .requestSession()
        .then(function(request) {
          mainobj.request = request;

          if (request.isValidated()) {
            mainobj.discordLinked = false;
            mainobj.loginForm = true;
            mainobj.getSession();
          } else {
            mainobj.discordLinked = true;
            mainobj.openWindow(
              request.getValidationUrl(),
              "Two-factor authentication",
              window,
              400,
              600,
              true
            );
          }
        })
        .catch(function(err) {
          mainobj.loginError = err.message;
        });
    },
    logout() {
      this.discordLinked = false;
      this.session = null;
      localStorage.removeItem("sessiongforum");
      this.getSessionHashes();
    },
    getSession: function() {
      let mainobj = this;
      mainobj.request
        .getSession()
        .then(function(session) {
          mainobj.loadingAccounts = [];
          mainobj.session = JSON.stringify(session);
          localStorage.setItem("sessiongforum", JSON.stringify(session));
        })
        .catch(function(err) {
          mainobj.loadingAccounts = [];
          mainobj.loginError = err.message;
        });
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
    getSessionCoreId() {
      if (this.session != null) {
        var session = JSON.parse(this.session);
        return session.player.id;
      } else {
        return "";
      }
    },
    getSessionUsername() {
      if (this.session != null) {
        var session = JSON.parse(this.session);
        return session.player.username;
      } else {
        return "Unknown";
      }
    },
    openWindow: function(url, title, win, w, h, save) {
      let mainObj = this;
      mainObj.overlay = true;
      const y = win.top.outerHeight / 2 + win.top.screenY - h / 2;
      const x = win.top.outerWidth / 2 + win.top.screenX - w / 2;
      var size = " width=" + w + ", height=" + h + ", top=" + y + ", left=" + x;
      var extraProps =
        "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no,";
      var newWin = win.open(url, title, extraProps + size);

      var timer = setInterval(function() {
        if (newWin.closed) {
          clearInterval(timer);
          if (save) {
            mainObj.getSession();
          }
          mainObj.overlay = false;
        }
      }, 200);
    }
  },
  watch: {
    accounts(val) {
      if (val.length > 0 && this.session == null) {
        this.loginForm = true;
      }
    },
    loginError(err) {
      if (err != "") {
        this.loginForm = true;
      }
    },
    model(val) {
      if (val != null) this.tab = 0;
      else this.tab = null;
    },
    session(val) {
      if (val != null && val != undefined) {
        this.$store.commit("core", new core(JSON.parse(val)));
      } else {
        this.$store.commit("core", new core());
      }
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
              params: { uuid: val, page: "news" }
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
