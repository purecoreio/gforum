<template>
  <div>
    <v-overlay :value="overlay">
      <v-btn icon @click="overlay = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-overlay>
    <v-card>
      <v-expand-transition>
        <div v-show="loginError!=''">
          <v-alert style="margin-bottom: 0px" tile color="primary" text>{{loginError}}</v-alert>
        </div>
      </v-expand-transition>
      <div v-if="accounts.length<=0 && session==null">
        <center>
          <v-img src="../assets/login/whoareyou.gif" />
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
  </div>
</template>


<script>
import core from "purecore";

export default {
  name: "App",
  data: () => ({
    accounts: [],
    loadingAccounts: [],
    loginError: "",
    loginForm: true,
    request: null,
    overlay: false,
    session: null,
    discordLinked: true
  }),
  mounted() {
    this.selfRouter = this.$router;
    this.session = localStorage.sessiongforum;
    this.$emit("session", this.session);
    let main = this;
    this.$nextTick(() => {
      if (
        main.session != "null" &&
        main.session != null &&
        !main.session != "undefined"
      ) {
        main.loginForm = false;
      }
      main.getSessionHashes();
    });
  },
  methods: {
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
    session(val) {
      this.$emit("session", val);
      if (val != null && val != undefined) {
        this.$store.commit("core", new core(JSON.parse(val)));
      } else {
        this.$store.commit("core", new core());
      }
    },
    loginForm(val) {
      this.$emit("shouldInteract", val);
    }
  }
};
</script>
