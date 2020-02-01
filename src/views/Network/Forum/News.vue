<template>
  <v-expand-transition>
    <v-card class="mb-4" v-show="show" dark outlined>
      <v-card :style="'background: '+getRandomBackground()">
        <v-carousel
          height="300px"
          cycle
          :show-arrows="false"
          hide-delimiter-background
          delimiter-icon="mdi-minus"
        >
          <v-carousel-item v-for="(news, i) in newsList" :key="i">
            <v-row align="center">
              <v-col cols="12" md="6">
                <div v-if="$vuetify.breakpoint.mdAndUp" class="pa-5">
                  <h1>{{news.title}}</h1>
                  <h3>{{news.headline}}</h3>
                  <v-btn class="mt-4">Read Article</v-btn>
                </div>
                <div v-if="!$vuetify.breakpoint.mdAndUp" class="pa-5 text-center">
                  <h1>{{news.title}}</h1>
                  <h3>{{news.headline}}</h3>
                  <v-btn class="mt-4">Read Article</v-btn>
                </div>
              </v-col>
              <v-col style="height: 300px" cols="1" md="6" v-if="$vuetify.breakpoint.mdAndUp">
                <v-img height="100%" contain src="../../../assets/empty/aquatic.png"></v-img>
              </v-col>
            </v-row>
          </v-carousel-item>
        </v-carousel>
      </v-card>
    </v-card>
  </v-expand-transition>
</template>

<script>
export default {
  props: ["show"],
  data: () => ({
    newsList: [
      {
        title: "An amazing headline!",
        headline: "This will show your news!"
      },
      {
        title: "More news?",
        headline: "Ye"
      }
    ]
  }),
  methods: {
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