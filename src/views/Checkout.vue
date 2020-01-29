<template>
  <div>
    <v-snackbar
      :value="indicatorErrorCount>2"
    >We are experiencing a high volume of failed requests, taking a breath and trying again</v-snackbar>
    <v-overlay :value="paying">
      <center>
        <h2>Authenticating Payment</h2>
        <v-btn icon @click="paying = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </center>
    </v-overlay>
    <v-container fluid>
      <v-row fill-height align="start" justify="center">
        <v-col
          fill-height
          cols="12"
          xs="12"
          sm="8"
          md="6"
          lg="5"
          xl="3"
          align="start"
          justify="center"
        >
          <v-stepper v-model="paymentStep">
            <v-stepper-header>
              <v-stepper-step :editable="!paymentSuccess" :complete="paymentStep > 1" step="1">
                Account
                <small v-if="selectedUsername!=null">{{selectedUsername}}</small>
              </v-stepper-step>

              <v-stepper-step :complete="paymentStep > 2" step="2">Checkout</v-stepper-step>

              <v-stepper-step :complete="paymentSuccess" step="3">Complete</v-stepper-step>
            </v-stepper-header>
            <v-stepper-items>
              <v-stepper-content step="1">
                <v-expansion-panels v-model="loginType">
                  <v-expansion-panel>
                    <v-expansion-panel-header>Use logged in user</v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-expand-transition>
                        <v-card v-show="session==null" outlined dark class="pa-2">
                          <v-alert color="primary" text>No accounts were detected</v-alert>
                          <v-btn depressed block color="primary" class="black--text">Retry</v-btn>
                        </v-card>
                      </v-expand-transition>
                      <div v-if="session!=null">
                        <v-expand-transition>
                          <v-card v-show="session!=null" outlined dark class="pa-2">
                            <v-row align="center">
                              <v-col v-if="$vuetify.breakpoint.smAndUp" cols="12" sm="3">
                                <center>
                                  <v-avatar size="54">
                                    <img
                                      :src="'https://minotar.net/helm/'+session.player.username+'/100.png'"
                                    />
                                  </v-avatar>
                                </center>
                              </v-col>
                              <v-col cols="12" sm="9">
                                <v-row no-gutters align="center">
                                  <v-col cols="12" sm="12">
                                    <p
                                      style="margin: 0px; font-size: 20px; display: inline-block"
                                    >{{session.player.username}}</p>
                                    <v-btn icon>
                                      <v-icon>exit_to_app</v-icon>
                                    </v-btn>
                                    <p style="margin: 0px; font-size: 14px;">{{session.player.uuid}}</p>
                                  </v-col>
                                </v-row>
                              </v-col>
                            </v-row>
                          </v-card>
                        </v-expand-transition>
                      </div>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                  <v-expansion-panel>
                    <v-expansion-panel-header>Use IGN</v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-text-field v-model="ignInput" label="IGN" outlined></v-text-field>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
                <v-flex xs12 offset-xs8>
                  <v-btn
                    row
                    block
                    depressed
                    class="black--text mt-4"
                    rounded
                    color="primary"
                    @click="paymentStep = 2"
                  >Next</v-btn>
                </v-flex>
              </v-stepper-content>
            </v-stepper-items>

            <v-stepper-content step="2" style="padding:0px">
              <div class="pa-5">
                <v-scroll-y-transition>
                  <div v-show="error!=''">
                    <v-alert color="warning" text>{{error}}</v-alert>
                  </div>
                </v-scroll-y-transition>
                <div v-if="paymentRequest!=null">
                  <v-card class="pa-4 mb-4">
                    <v-row justify="center">
                      <v-col cols="12" sm="12" align="center">
                        <p style="margin: 0px; font-size: 20px; display: inline-block">
                          {{paymentRequest.username}}
                          <v-chip
                            small
                            class="ma-2"
                            :color="paymentRequest.player==null ? 'warning' : 'primary'"
                            outlined
                          >
                            <span
                              v-if="paymentRequest.player==null && !$vuetify.breakpoint.xsOnly"
                            >Account not found</span>
                            <span
                              v-if="paymentRequest.player!=null && !$vuetify.breakpoint.xsOnly "
                            >Account found</span>
                            <v-icon
                              small
                              :class="!$vuetify.breakpoint.xsOnly ? 'ml-2' : ''"
                              v-text="paymentRequest.player==null ? 'warning' : 'done'"
                            ></v-icon>
                          </v-chip>
                        </p>
                      </v-col>
                    </v-row>
                  </v-card>
                  <v-alert
                    text
                    class="mb-4"
                    color="warning"
                    v-for="(warning,i) in paymentRequest.warnings"
                    :key="i"
                  >{{warning.text}}</v-alert>
                  <v-expand-transition>
                    <div v-show="paymentRequest.products.length>0">
                      <v-list>
                        <v-list-item
                          class="mb-2"
                          v-for="item in paymentRequest.products"
                          :key="item.uuid"
                        >
                          <v-list-item-content
                            style="margin-top: 0px; adding-top: 0px; padding-bottom: 0px"
                          >
                            <v-row align="center">
                              <v-col cols="6" sm="9">
                                <v-list-item-title>
                                  {{item.name}}
                                  <v-chip small class="ml-2" outlined>{{item.uuid}}</v-chip>
                                </v-list-item-title>
                              </v-col>
                              <v-spacer />
                              <v-col cols="6" sm="3">
                                <v-alert
                                  text
                                  class="pa-2 black--text"
                                  style="text-align: center; margin: 0px"
                                  color="primary"
                                >
                                  <small>- {{item.price}}</small>
                                </v-alert>
                              </v-col>
                            </v-row>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item
                          class="mb-2"
                          v-for="item in paymentRequest.discounts"
                          :key="item.uuid"
                        >
                          <v-list-item-content
                            style="margin-top: 0px; margin-bottom: 0px; padding-top: 0px; padding-bottom: 0px"
                          >
                            <v-row align="center">
                              <v-col cols="6" sm="9">
                                <v-list-item-title>
                                  {{item.description}}
                                  <v-chip small class="ml-2" outlined>{{item.uuid}}</v-chip>
                                </v-list-item-title>
                              </v-col>
                              <v-spacer />
                              <v-col cols="6" sm="3">
                                <v-alert
                                  text
                                  class="pa-2 black--text"
                                  style="text-align: center; margin: 0px"
                                  color="primary"
                                >
                                  <small>+ {{item.amount}}</small>
                                </v-alert>
                              </v-col>
                            </v-row>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                      <v-card class="pl-4 pr-4 mt-4">
                        <v-row align="center">
                          <v-col cols="6" sm="9" justify="center">Amount Due:</v-col>
                          <v-col align="right" cols="6" sm="3">
                            <v-alert
                              text
                              class="pa-2 black--text"
                              style="text-align: center; margin: 0px"
                              color="primary"
                            >
                              <small>{{paymentRequest.currency}} {{paymentRequest.due}}</small>
                            </v-alert>
                          </v-col>
                        </v-row>
                      </v-card>
                      <v-divider class="mt-4 mb-4" />
                      <v-scroll-y-transition>
                        <div v-show="stripe.error!=''">
                          <v-alert color="warning" text>{{stripe.error}}</v-alert>
                        </div>
                      </v-scroll-y-transition>
                      <v-card class="pa-2">
                        <v-card class="pa-4" outlined>
                          <card
                            :stripe="stripe.key"
                            :options="stripe.options"
                            @change="complete = $event.complete"
                          />
                        </v-card>
                        <v-btn
                          :loading="stripe.loading || paying"
                          :disabled="stripe.loading || paying"
                          class="mt-4"
                          @click="pay"
                          block
                          depressed
                        >Complete Purchase</v-btn>
                      </v-card>
                      <v-row class="mt-4 mb-4" no-gutters align="center" justify="center">
                        <v-col cols="4">
                          <v-divider />
                        </v-col>
                        <v-col cols="4">
                          <center>
                            <small class="grey--text">or</small>
                          </center>
                        </v-col>
                        <v-col cols="4">
                          <v-divider />
                        </v-col>
                      </v-row>
                      <template v-for="paybtn in paymentRequest.gateways">
                        <v-btn
                          :key="paybtn.name"
                          v-if="paybtn.name!='stripe'"
                          x-large
                          block
                          :disabled="paying"
                          :loading="paying"
                          class="black--text mb-2"
                          :color="paybtn.color"
                          @click="payPopup(paybtn)"
                        >
                          <v-avatar style="transform: scale(1.5)" tile>
                            <v-img contain :src="paybtn.logo" />
                          </v-avatar>
                        </v-btn>
                      </template>
                    </div>
                  </v-expand-transition>
                </div>
                <div v-if="paymentRequest==null">
                  <v-skeleton-loader class="mx-auto mb-3" type="article"></v-skeleton-loader>
                  <v-skeleton-loader v-for="i in 3" :key="i" class="mx-auto mb-3" type="list-item"></v-skeleton-loader>
                </div>
              </div>
              <v-sheet color="grey darken-3 pt-2 pb-2 pl-5 pr-5">
                <v-row no-gutters align="center">
                  <v-col cols="4" justify="start">
                    <qrcode
                      :version="3"
                      :margin="0"
                      :color="{dark:'#000',light:'#424242'}"
                      :width="50"
                      type="image/png"
                      :value="requestId"
                    />
                  </v-col>
                  <v-col justify="center" align="center" cols="4">
                    <v-chip v-html="date" />
                  </v-col>
                  <v-col align="end" cols="4">
                    <v-fade-transition>
                      <v-avatar v-show="indicator" size="20px" :color="indicatorColor"></v-avatar>
                    </v-fade-transition>
                  </v-col>
                </v-row>
              </v-sheet>
            </v-stepper-content>
            <v-stepper-content step="3" style="padding: 0px">
              <div style="position: relative; height: 300px">
                <canvas
                  id="confettiCanvas"
                  style="position: absolute; top: 0px; left: 0px; height: 100%; width: 100%"
                ></canvas>
                <v-container
                  fill-height
                  fluid
                  class="pa-5"
                  style="position: absolute; top: 0px; left: 0px; height: 100%; width: 100%"
                >
                  <v-row align="center" justify="center">
                    <v-col>
                      <center>
                        <div style="max-width: 400px">
                          <h2>Thank you!</h2>
                          <h4>This transaction has been authenticated</h4>
                          <v-divider class="mt-4 mb-4" />
                          <p>This will appear as a pending payment on your account, once we ensure that you are going to get your package, the transaction will be marked as completed</p>
                        </div>
                      </center>
                    </v-col>
                  </v-row>
                </v-container>
              </div>
            </v-stepper-content>
          </v-stepper>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import confetti from "canvas-confetti";
import { Card, handleCardPayment } from "vue-stripe-elements-plus";
import Qrcode from "vue-qrcode";
export default {
  props: ["uuid", "basket"],
  components: { Card, Qrcode },
  mounted() {
    setInterval(() => {
      this.getCurrentDate();
    }, 1000);
    setInterval(() => {
      if (this.seekUpdates) {
        this.showIndicator();
      }
    }, 3000);
    this.session = this.$store.getters.core.getCoreSession();
    this.$emit("setDrawer", null);
    this.store = this.$store.getters.core
      .getInstance(this.uuid)
      .asNetwork()
      .getStore();
    this.itemList = this.store.itemIdListFromJSON(
      JSON.parse(atob(this.basket))
    );
  },
  watch: {
    ignInput: function(val) {
      if (this.loginType != 0) {
        this.selectedUsername = val;
      }
    },
    session: function(val) {
      try {
        if (val.player.username != null) {
          this.loginType = 0;
        }
      } catch (error) {
        this.loginType = 1;
      }
    },
    loginType: function(val) {
      if (val == 0) {
        this.selectedUsername = this.session.player.username;
      } else {
        this.selectedUsername = this.ignInput;
      }
    },
    paymentStep: function(val) {
      if (val == 2) {
        this.paymentRequest = null;
        this.requestPayment();
      }
    },
    paymentRequest: function(val) {
      this.requestId = val.uuid;
    },
    paid: function(val) {
      if (val) {
        this.paymentStep = 3;

        var conff = confetti.create(
          document.getElementById("confettiCanvas", {
            useWorker: true
          })
        );
        conff({
          particleCount: 100,
          startVelocity: 30,
          spread: 100,
          origin: {
            x: Math.random(),
            // since they fall down, start a bit higher than random
            y: 0
          }
        });
      }
    }
  },
  data: () => ({
    indicatorColor: "primary",
    indicatorErrorCount: 0,
    indicatorErrorShown: 0,
    requestId: "Unknown",
    complete: false,
    indicator: false,
    seekUpdates: false,
    stripe: {
      options: {
        style: {
          base: {
            color: "white"
          }
        }
      },
      key: "pk_live_EApGv1EQo2QX4zp4E543Na5Q00JGPBZESa",
      loading: false,
      error: ""
    },
    paymentStep: 1,
    itemList: [],
    store: null,
    paymentRequest: null,
    session: null,
    loginType: null,
    ignInput: "",
    selectedUsername: "",
    paymentSuccess: false,
    error: "",
    paid: false,
    paying: false,
    date:
      new Date().getHours() +
      ":" +
      new Date().getMinutes() +
      ":" +
      new Date().getSeconds()
  }),
  methods: {
    payPopup: function(gateway) {
      this.discordLinked = true;
      this.loginForm = true;

      if ("url" in gateway) {
        this.openWindow(
          gateway.url,
          "Pay using oAuth",
          window,
          400,
          600,
          false
        );
      }
    },

    openWindow: function(url, title, win, w, h) {
      let mainObj = this;
      mainObj.paying = true;
      const y = win.top.outerHeight / 2 + win.top.screenY - h / 2;
      const x = win.top.outerWidth / 2 + win.top.screenX - w / 2;
      var size = " width=" + w + ", height=" + h + ", top=" + y + ", left=" + x;
      var extraProps =
        "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no,";
      var newWin = win.open(url, title, extraProps + size);

      var timer = setInterval(function() {
        if (newWin.closed) {
          clearInterval(timer);
          mainObj.paying = false;
          mainObj.showIndicator();
        }
      }, 200);
    },
    showIndicator() {
      let mainObj = this;

      if (this.indicatorErrorCount > 2) {
        this.seekUpdates = false;
        setTimeout(() => {
          this.indicatorErrorCount = 0;
          this.seekUpdates = true;
        }, 5000 * (this.indicatorErrorShown + 1));
        this.indicatorErrorShown++;
      } else {
        this.seekUpdates = true;
        this.indicator = true;
        this.indicatorColor = "primary";

        try {
          this.paymentRequest
            .isPaid()
            .then(function(result) {
              setTimeout(() => {
                mainObj.indicator = false;
              }, 200);
              if (result) {
                mainObj.seekUpdates = false;
              }
              mainObj.paid = result;
            })
            .catch(function() {
              mainObj.indicatorColor = "red";
              setTimeout(() => {
                mainObj.indicator = false;
              }, 200);
              mainObj.indicatorErrorCount++;
            });
        } catch (error) {
          mainObj.indicatorColor = "red";
          mainObj.indicatorErrorCount++;
          setTimeout(() => {
            mainObj.indicator = false;
          }, 200);
        }
      }
    },
    getCurrentDate() {
      this.date =
        new Date().getHours() +
        ":" +
        new Date().getMinutes() +
        ":" +
        new Date().getSeconds();
    },
    pay() {
      this.showIndicator();
      let main = this;
      main.stripe.loading = true;
      handleCardPayment(this.getStripePaymentIntent()).then(function(result) {
        if (result.error) {
          main.stripe.error = result.error.message;
        } else {
          if (result.paymentIntent.status === "succeeded") {
            main.stripe.error = "";
          }
        }
        main.stripe.loading = false;
      });
    },
    getStripePaymentIntent() {
      var pi = "";
      this.paymentRequest.gateways.forEach(gateway => {
        if (gateway.name == "stripe") {
          pi = gateway.url.charge;
        }
      });
      return pi;
    },
    requestPayment: function() {
      let main = this;
      this.categories = null;
      main.paymentRequest = null;
      if (this.store != null && this.store != undefined) {
        this.store
          .requestPayment(main.itemList, main.selectedUsername)
          .then(function(request) {
            main.error = "";
            main.paymentRequest = request;
          })
          .catch(function(err) {
            main.error = err.message;
          });
      } else {
        main.error = "Invalid store";
      }
    }
  }
};
</script>