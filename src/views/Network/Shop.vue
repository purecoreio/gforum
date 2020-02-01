<template>
  <div>
    <v-dialog v-model="keepShoppingModal" max-width="450px">
      <v-card v-if="selectedItem!=null">
        <v-sheet tile color="primary">
          <v-card-title class="black--text">Go to checkout?</v-card-title>
        </v-sheet>
        <v-sheet tile color="grey darken-3">
          <v-card-actions>
            <v-btn color="primary" text @click="keepShoppingModal = false">Keep Shopping</v-btn>
            <v-spacer />
            <v-btn
              color="primary"
              class="black--text"
              depressed
              @click="keepShoppingModal = false; checkout()"
            >Yes</v-btn>
          </v-card-actions>
        </v-sheet>
      </v-card>
    </v-dialog>
    <v-dialog v-model="itemDialog" scrollable max-width="400px">
      <v-card v-if="selectedItem!=null">
        <v-sheet tile color="primary">
          <v-card-title class="black--text">{{selectedItem.name}}</v-card-title>
          <v-card-subtitle class="black--text">{{selectedItem.description}}</v-card-subtitle>
        </v-sheet>
        <v-divider></v-divider>

        <v-list>
          <v-list-group
            :key="i"
            v-for="(organizedPerk,i) in selectedItem.getOrganizedPerks()"
            no-action
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title v-text="organizedPerk.getCategory().name"></v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item v-for="subItem in organizedPerk.getPerks()" :key="subItem.perk.uuid">
              <v-list-item-content>
                <p style="margin: 0px">
                  <v-chip
                    v-if="subItem.quantity!=null"
                    color="primary"
                    class="black--text mr-1 .d-flex"
                    style="display: inline-block"
                    label
                  >x{{subItem.quantity}}</v-chip>
                  {{subItem.perk.name}}
                </p>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </v-list>
        <v-sheet tile color="grey darken-3">
          <v-card-actions>
            <v-btn color="primary" text @click="itemDialog = false">Cancel</v-btn>
            <v-spacer />
            <v-btn
              color="primary"
              class="black--text"
              depressed
              @click="itemDialog = false; addToBasket(selectedItem)"
            >Add</v-btn>
          </v-card-actions>
        </v-sheet>
      </v-card>
    </v-dialog>
    <center>
      <v-scroll-y-transition>
        <div v-show="this.showPerks" style="max-width: 600px">
          <Perks class="mb-6" />
        </div>
      </v-scroll-y-transition>
    </center>
    <center>
      <v-scroll-y-transition>
        <div v-show="error!=''" style="max-width: 600px">
          <Privacy class="mb-6" />
          <v-alert text color="primary">{{error}}</v-alert>
        </div>
      </v-scroll-y-transition>
    </center>
    <div v-if="this.categories == null && this.error==''">
      <v-card v-for="i in 1" :key="i" class="pa-4 mt-4" dark outlined>
        <v-skeleton-loader type="heading" class="mb-2"></v-skeleton-loader>
        <v-skeleton-loader type="sentences"></v-skeleton-loader>
        <v-divider class="mt-4 mb-4" />
        <v-row>
          <v-col v-for="index in 6" :key="index" cols="6" xs="3" sm="4" md="4" lg="3">
            <v-skeleton-loader type="image" width="100%" height="100%"></v-skeleton-loader>
          </v-col>
        </v-row>
      </v-card>
    </div>
    <div v-if="!this.showPerks">
      <v-expand-transition>
        <v-card v-show="categories!=null" dark outlined>
          <v-card :style="'background: '+getRandomBackground()">
            <v-row align="center" style="height: 300px">
              <v-col cols="12" md="6">
                <div v-if="$vuetify.breakpoint.mdAndUp" class="pa-5">
                  <h1>Immortal</h1>
                  <h3>Most Popular</h3>
                  <v-btn class="mt-4">Add To Basket</v-btn>
                </div>
                <div v-if="!$vuetify.breakpoint.mdAndUp" class="pa-5 text-center">
                  <h1>Immortal</h1>
                  <h3>Most Popular</h3>
                  <v-btn class="mt-4">Add To Basket</v-btn>
                </div>
              </v-col>
              <v-col style="height: 300px" cols="1" md="6" v-if="$vuetify.breakpoint.mdAndUp">
                <v-img height="100%" contain src="../../assets/empty/aquatic.png"></v-img>
              </v-col>
            </v-row>
          </v-card>
        </v-card>
      </v-expand-transition>
      <v-card v-for="(nestedItem,i) in categories" :key="i" class="pa-4 mt-4" dark outlined>
        <h1>{{nestedItem.getCategory().name}}</h1>
        <h3>{{nestedItem.getCategory().description}}</h3>
        <v-divider class="mt-4 mb-4" />
        <v-row>
          <v-col
            v-for="item in nestedItem.getItems()"
            :key="item.uuid"
            cols="6"
            xs="3"
            sm="4"
            md="4"
            lg="3"
          >
            <v-card
              @click="previewItem(item)"
              v-ripple
              :style="'background: '+getRandomBackground()"
            >
              <v-responsive :aspect-ratio="1/1">
                <v-img
                  style="position: relative"
                  height="100%"
                  src="../../assets/empty/aquatic.png"
                >
                  <v-sheet
                    tile
                    style="bottom: 0px; position: absolute; width: 100%; background-color: rgba(0,0,0,0.8)"
                    class="pa-1"
                  >
                    <center>
                      <v-btn style="padding:0px" text>{{item.name}}: {{item.price}} €</v-btn>
                    </center>
                  </v-sheet>
                </v-img>
              </v-responsive>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </div>
    <v-scroll-x-reverse-transition>
      <v-btn
        v-show="this.basket.length > 0"
        color="primary"
        class="black--text"
        @click="checkout()"
        large
        dark
        fixed
        bottom
        right
        rounded
      >
        Checkout {{this.basket.length }} item
        <span v-if="this.basket.length>1">s</span>
      </v-btn>
    </v-scroll-x-reverse-transition>
  </div>
</template>

<script>
import Perks from "../Empty/StorePerks";
import Privacy from "../Empty/Privacy";

export default {
  components: {
    Perks,
    Privacy
  },
  props: ["network"],
  mounted() {
    this.$nextTick(() => {
      this.getPackages();
    });
  },
  data: () => ({
    show: true,
    showPerks: false,
    categories: null,
    basket: [],
    error: "",
    itemDialog: false,
    selectedItem: null,
    askedKeepShopping: false,
    keepShoppingModal: false
  }),
  watch: {
    categories: function(value) {
      if (value.length <= 0) {
        this.showPerks = true;
      } else {
        this.showPerks = false;
      }
    },
    basket: function(value) {
      if (value.length > 0) {
        if (!this.askedKeepShopping) {
          this.askedKeepShopping = true;
          this.keepShoppingModal = true;
        }
      }
    }
  },
  methods: {
    checkout: function() {
      var basicItems = this.network.getStore().itemIdList(this.basket);

      this.$router.push({
        name: "checkout",
        params: {
          network: this.network.uuid,
          basket: btoa(JSON.stringify(basicItems))
        }
      });
    },
    previewItem: function(item) {
      this.itemDialog = true;
      this.selectedItem = item;
    },
    addToBasket: function(item) {
      if (!this.basket.includes(item)) {
        this.basket.push(item);
      } else {
        this.basket.splice(this.basket.indexOf(item), 1);
      }
    },
    getPackages: function() {
      let main = this;
      this.categories = null;
      if (this.network != null && this.network != undefined) {
        this.network
          .getStore()
          .getPackages()
          .then(function(categories) {
            main.categories = categories;
          })
          .catch(function(err) {
            main.error = err.message;
          });
      } else {
        this.categories = [];
      }
    },
    getRandomColor: function() {
      return Math.floor(255 - Math.random() * 200);
    },
    getRandomBackground: function() {
      var deg = Math.random() * 180;

      var gradient =
        "linear-gradient(" +
        deg +
        "deg, rgba(" +
        this.getRandomColor() +
        "," +
        this.getRandomColor() +
        "," +
        this.getRandomColor() +
        ",1) 50%, rgba(" +
        this.getRandomColor() +
        "," +
        this.getRandomColor() +
        "," +
        this.getRandomColor() +
        ",1) 100%);";
      return gradient;
    }
  }
};
</script>