<template>
  <div>
    <div style="width: 100%; height: 500px; position: relative">
      <div style="position: absolute; top: 0px; left: 0px; width: 100%; height: 500px">
        <v-carousel
          v-model="header"
          cycle
          fill-height
          hide-delimiter-background
          show-arrows-on-hover
        >
          <v-carousel-item v-for="(game, i) in games" :key="i">
            <v-img
              style="filter: blur(5px)"
              :position="games[i].align"
              height="100%"
              :src="games[i].background"
            />
          </v-carousel-item>
        </v-carousel>
      </div>
      <div style="position: absolute; top: 0px; left: 0px; width: 100%; height: 500px">
        <v-content>
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
                <p class="title">Create your</p>

                <v-img
                  width="100%"
                  contain
                  height="200px"
                  max-width="600px"
                  :src="games[header].logo"
                />
                <p class="title">guild</p>
                <v-btn depressed>CREATE: {{games[header].name}}</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-content>
      </div>
    </div>
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
  name: "GameHeader",
  data() {
    return {
      header: 0,
      games: [
        {
          name: "Minecraft Java Edition",
          logo: "./common/assets/games/minecraft/logo.png",
          background: "./common/assets/games/minecraft/header.jpg",
          align: "center bottom"
        },
        {
          name: "Minecraft Bedrock Edition",
          logo: "./common/assets/games/minecraft/logo.png",
          background: "./common/assets/games/minecraft/header-bedrock.jpg",
          align: "center center"
        },
        {
          name: "Roblox",
          logo: "./common/assets/games/roblox/logo.png",
          background: "./common/assets/games/roblox/header.jpg",
          align: "center center"
        },
        {
          name: "Don't Starve",
          logo: "./common/assets/games/dontstarve/logo.png",
          background: "./common/assets/games/dontstarve/header.jpg",
          align: "center center"
        },
        {
          name: "Unturned",
          logo: "./common/assets/games/unturned/logo.png",
          background: "./common/assets/games/unturned/header.jpg",
          align: "center center"
        },
        {
          name: "Rust",
          logo: "./common/assets/games/rust/logo.png",
          background: "./common/assets/games/rust/header.jpg",
          align: "center center"
        },
        {
          name: "Ark",
          logo: "./common/assets/games/ark/logo.png",
          background: "./common/assets/games/ark/header.jpg",
          align: "center center"
        }
      ]
    };
  }
};
</script>
