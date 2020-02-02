<template>
  <div>
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-alert color="warning" v-if="error!=''" text>{{error}}</v-alert>
    <div v-if="error==''">
      <v-card outlined class="mb-2">
        <v-skeleton-loader v-if="category==null" type="article" />
        <div class="pa-4" v-if="category!=null">
          <p class="headline mb-0">{{category.name}}</p>
          <p class="mb-0">{{category.description}}</p>
        </div>
      </v-card>
      <div v-if="posts!=null">
        <v-card v-if="posts.length>0" outlined>
          <v-list>
            <v-list-item
              @click="reviewPost(post)"
              class="pt-3 pb-3"
              v-for="post in posts"
              :key="post.uuid"
            >
              <v-list-item-avatar>
                <v-avatar>
                  <v-img :src="'https://minotar.net/helm/'+post.player.username+'/100.png'" />
                </v-avatar>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{post.title}}</v-list-item-title>
                <v-list-item-subtitle>By {{post.player.username}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </div>
      <v-row v-if="loadingPosts" no-gutters>
        <v-col cols="12" v-for="i in 20" :key="i">
          <v-card outlined class="pa-1 mb-2">
            <v-skeleton-loader type="list-item-avatar-two-line" />
          </v-card>
        </v-col>
      </v-row>
      <v-scroll-y-transition>
        <End v-show="stoploading" />
      </v-scroll-y-transition>
    </div>
    <div
      style="height:200px; width: 100%; transform: translateY(-200px)"
      v-intersect.once="onIntersect"
      v-if="!loadingPosts && !stoploading && posts!=null"
    ></div>
  </div>
</template>

<script>
import End from "../../Empty/End";

export default {
  props: ["network", "action", "actionid"],
  components: {
    End: End
  },
  watch: {
    actionid: function() {
      this.getCategory();
    },
    network: function(val) {
      if (val != null) {
        this.getCategory();
      }
    }
  },
  mounted() {
    this.getCategory();
  },
  data: () => ({
    category: null,
    posts: null,
    show: true,
    sections: null,
    error: "",
    page: 0,
    stoploading: false,
    loadingPosts: false,
    items: [
      {
        text: "Network",
        disabled: true
      },
      {
        text: "Forum",
        disabled: false,
        href: document.location.href.substring(
          0,
          document.location.href.length - 25
        )
      },
      {
        text: "Category",
        disabled: true
      }
    ]
  }),
  methods: {
    onIntersect(entries, observer, isIntersecting) {
      if (isIntersecting) {
        this.getPosts();
      }
    },
    reviewPost: function(post) {
      this.$router.push({
        name: "network",
        params: {
          uuid: this.network.uuid,
          page: "forum",
          action: "post",
          actionid: post.uuid
        }
      });
    },
    getCategory() {
      let main = this;
      main.network
        .getForum()
        .getCategory(main.actionid)
        .then(function(category) {
          main.error = "";
          main.category = category;
          main.getPosts();
        })
        .catch(function(err) {
          main.error = err.message;
        });
    },
    getPosts() {
      let main = this;
      if (!this.stoploading) {
        this.loadingPosts = true;
        this.category
          .getPosts(this.page)
          .then(function(posts) {
            if (posts.length < 20) {
              main.stoploading = true;
            }
            main.page++;
            main.loadingPosts = false;
            main.error = "";
            if (main.posts == null) {
              main.posts = [];
            }
            posts.forEach(post => {
              main.posts.push(post);
            });
          })
          .catch(function(err) {
            main.error = err.message;
          });
      }
    }
  }
};
</script>