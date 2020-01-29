<template>
  <div>
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

            <v-stepper-content step="2">
              <v-scroll-y-transition>
                <div v-show="error!=''">
                  <v-alert color="primary" text>{{error}}</v-alert>
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
                  color="primary"
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
                    <v-btn
                      x-large
                      block
                      class="black--text mb-2"
                      v-for="paybtn in paymentRequest.gateways"
                      :key="paybtn.name"
                      :color="paybtn.color"
                    >
                      <v-avatar style="transform: scale(1.5)" tile>
                        <v-img contain :src="paybtn.logo" />
                      </v-avatar>
                    </v-btn>
                  </div>
                </v-expand-transition>
              </div>
              <div v-if="paymentRequest==null">
                <v-skeleton-loader class="mx-auto mb-3" type="article"></v-skeleton-loader>
                <v-skeleton-loader v-for="i in 3" :key="i" class="mx-auto mb-3" type="list-item"></v-skeleton-loader>
              </div>
            </v-stepper-content>

            <v-stepper-content step="3">
              <v-card color="grey lighten-1" class="mb-12" height="200px"></v-card>
              <v-btn color="primary" @click="e6 = 4">Continue</v-btn>
              <v-btn text>Cancel</v-btn>
            </v-stepper-content>
          </v-stepper>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  props: ["uuid", "basket"],
  components: {},
  mounted() {
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
    }
  },
  data: () => ({
    paymentStep: 1,
    itemList: [],
    store: null,
    paymentRequest: null,
    session: null,
    loginType: null,
    ignInput: "",
    selectedUsername: "",
    paymentSuccess: false,
    error: ""
  }),
  methods: {
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