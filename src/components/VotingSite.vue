<template>
  <div>
    <v-card
      :href="site.url"
      target="_blank"
      @click="vote()"
      :style="'background:'+getRandomBackground()"
    >
      <v-list-item>
        <v-list-item-content class="pt-8 pb-8">
          <v-list-item-title>{{site.votingSite.name}}</v-list-item-title>
          <v-list-item-subtitle>{{site.votingSite.url}}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-icon v-if="icon!=null">
          <v-img :src="icon" />
        </v-list-item-icon>
      </v-list-item>
      <v-divider />
      <v-list-item>
        <v-list-item-content class="pt-3 pb-3">
          <v-list-item-subtitle>Vote for {{site.network.name}}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon>
            <v-icon>how_to_vote</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-card>
  </div>
</template>

<script>
var getFavicons = require("get-website-favicon");
export default {
  props: ["site"],
  data: () => ({
    icon: null
  }),
  methods: {
    getRandomColor: function() {
      return Math.floor(200 - Math.random() * 100);
    },
    getRandomBackground: function() {
      var deg = Math.random() * 45;

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
    },
    vote() {}
  },
  mounted() {
    let main = this;
    try {
      getFavicons("https://" + this.site.votingSite.url)
        .then(data => {
          try {
            if (data.icons.length > 0) {
              main.icon = data.icons[0].src;
            }
          } catch (error) {
            main.icon = null;
          }
        })
        .catch(function() {
          main.icon = null;
        });
    } catch (error) {
      main.icon = null;
    }
  }
};
</script>