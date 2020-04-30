<template>
  <div v-if="available">
    <v-dialog persistent v-model="notificationResult" max-width="400">
      <v-card v-if="notificationsGranted">
        <v-card-text v-if="showAmazing" class="pt-10 pb-10">
          <center>
            <p class="mt-4">Contacting with bongo cat...</p>
          </center>
        </v-card-text>
        <v-scroll-y-transition>
          <div v-show="!showAmazing">
            <center>
              <v-card-text class="pt-10 pb-3">
                <center>
                  <h2>wanna get 'em on the phone?</h2>
                  <qrcode
                    class="mt-4"
                    style="border-radius: 5px"
                    :version="3"
                    :margin="2"
                    :color="{dark:'#000',light:'#fff'}"
                    :width="150"
                    type="image/png"
                    value="https://gforum.co/#/account/notifications/"
                  />
                  <p>point ur camera here</p>
                </center>
              </v-card-text>
            </center>
          </div>
        </v-scroll-y-transition>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-if="!showAmazing" color="primary" depressed @click="closeAll()">Done</v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-if="!notificationsGranted">
        <v-card-text class="pt-10 pb-3">
          <center>
            <h2>well... yeah... that didn't work</h2>
            <div v-if="!isMobile">
              <qrcode
                class="mt-4"
                style="border-radius: 5px"
                :version="3"
                :margin="2"
                :color="{dark:'#000',light:'#fff'}"
                :width="150"
                type="image/png"
                value="https://gforum.co/#/account/notifications/"
              />
              <p>maybe try on your phone?</p>
            </div>
          </center>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" depressed @click="closeAll()">Well, bye!</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent v-model="askingNotifications" max-width="400">
      <v-card>
        <v-card-text class="pt-10 pb-6">
          <center>
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
            <p class="mt-4">Please, accept the permission</p>
          </center>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog persistent v-model="askingSession" max-width="400">
      <LoginHelper @session="updateSession" />
    </v-dialog>
    <v-dialog v-model="askNotifications" max-width="400">
      <v-card>
        <v-card-title
          style="word-break: break-word"
          class="headline"
        >Would you like to receive vote reminders?</v-card-title>

        <v-card-text>
          Never forget to vote for your favourite servers!
          <u>Receive friend requests, reports and vote reminders</u>!
          <br />
          <br />We will only send notifications when you forget to vote. You can disable notifications anytime on your account settings!
          <u>Vote reminders will be automatically disabled once you stop playing regularly on a community</u> 🤍
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text @click="askNotifications = false">Ask me later</v-btn>

          <v-btn color="primary" depressed @click="checkSession()">Yes, please!</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import core from "purecore";
import Qrcode from "vue-qrcode";
import { isMobile } from "mobile-device-detect";
import LoginHelper from "./LoginHelper";
import firebase from "firebase";

const messaging = firebase.messaging();
messaging.usePublicVapidKey(
  "BJphOjxSPRTR-M4PtBo93BkcoBj_4au323bXjy8SXOuswVEhORlRseedi90TVlsuVUsyQl7hHOX2w5UFGQNyDiA"
);

export default {
  props: ["show"],
  components: { LoginHelper, Qrcode },
  data: () => ({
    triggered: false,
    askNotifications: false,
    askingNotifications: false,
    notificationResult: false,
    notificationsGranted: false,
    askingSession: false,
    session: null,
    showAmazing: true,
    available: true,
    token: "..."
  }),
  watch: {
    triggered(value) {
      if (value) {
        this.askForNotifications();
      }
    },
    show(value) {
      if (value) {
        this.triggered = true;
      }
    },
    session(value) {
      value = JSON.parse(value);
      if (value != null) {
        if (value.core.session != null) {
          this.askingSession = false;
          this.askNotificationsPlease();
        }
      }
    }
  },
  beforeUpdate() {
    if (this.show) {
      this.askForNotifications();
    }
  },
  methods: {
    closeAll() {
      this.askNotifications = false;
      this.askingNotifications = false;
      this.notificationResult = false;
      this.askingSession = false;
      this.available = false;
    },
    updateSession(session) {
      this.session = session;
    },
    askForNotifications() {
      if (localStorage.getItem("verifiedGForumNotifications") != "yes") {
        this.askNotifications = true;
      }
    },
    checkSession() {
      this.askNotifications = false;
      this.askingNotifications = false;
      this.notificationResult = false;
      this.askingSession = true;
    },
    askNotificationsPlease() {
      localStorage.setItem("askedGForumNotifications", "yes");
      this.askingNotifications = true;
      let main = this;
      messaging
        .requestPermission()
        .then(() => {
          main.askingNotifications = false;
          main.notificationResult = true;

          localStorage.setItem("verifiedGForumNotifications", "yes");
          main.notificationsGranted = true;

          // Get Token
          messaging.getToken().then(token => {
            var coreinstance = new core(JSON.parse(this.session));
            coreinstance.pushFCM(token).then(function() {
              main.token = token;
              if (isMobile) {
                main.closeAll();
              } else {
                main.showAmazing = false;
              }
            });
          });
        })
        .catch(function() {
          localStorage.setItem("verifiedGForumNotifications", "no");
          main.askingNotifications = false;
          main.notificationResult = true;
          main.notificationsGranted = false;
        });
    }
  }
};
</script>