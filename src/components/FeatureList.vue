<template>
  <div>
    <v-sheet tile>
      <v-container fluid>
        <v-row fill-height align="center" justify="center">
          <v-col
            fill-height
            cols="12"
            xs="12"
            sm="12"
            md="10"
            lg="8"
            xl="6"
            align="center"
            justify="center"
          >
            <v-row>
              <v-col cols="4">
                <v-icon large>fingerprint</v-icon>
                <p style="margin-top: 20px; margin-bottom: 0px">Unique and secure</p>
              </v-col>
              <v-col cols="4">
                <v-icon large>show_chart</v-icon>
                <p style="margin-top: 20px; margin-bottom: 0px">Game Analytics</p>
              </v-col>
              <v-col cols="4">
                <v-icon large>people</v-icon>
                <p style="margin-top: 20px; margin-bottom: 0px">Global Profiles</p>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
    <v-sheet style="background-color: rgba(255,255,255,0.2)" tile>
      <v-container fluid>
        <v-row fill-height align="center" justify="center">
          <v-col
            fill-height
            cols="12"
            xs="12"
            sm="12"
            md="10"
            lg="8"
            xl="6"
            align="center"
            justify="center"
          >Are you a guild owner? Go into the <a>purecore managment panel <v-icon>link</v-icon></a></v-col>
        </v-row>
      </v-container>
    </v-sheet>
  </div>
</template>

<style lang="css" scoped>
.title {
  font-family: "Heebo", sans-serif;
  font-weight: 800;
}
</style>

<script>
export default {
  name: "FeatureList",
  data() {
    return {};
  }
};
</script>
