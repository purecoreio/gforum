<template>
  <div>
    <v-alert v-if="error!=''" text color="warning">{{error}}</v-alert>
    <v-card v-if="post==null" outlined class="pa-4">
      <v-row no-gutters>
        <v-col cols="12">
          <v-text-field outlined disabled hide-details :loading="this.post==null"></v-text-field>
        </v-col>
        <v-col cols="12" class="mt-4">
          <v-textarea
            auto-grow
            row-height="50px"
            outlined
            disabled
            hide-details
            :loading="this.post==null"
            :value="postContent"
          ></v-textarea>
        </v-col>
        <v-col cols="12" class="mt-4">
          <v-list-item>
            <v-list-item-avatar>
              <v-avatar>
                <v-img src />
              </v-avatar>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>username</v-list-item-title>
              <v-list-item-subtitle>uuid</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon>
                <v-icon>thumb_up</v-icon>
              </v-btn>
            </v-list-item-action>
            <v-list-item-action>
              <v-btn icon>
                <v-icon>thumb_down</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-col>
      </v-row>
    </v-card>
    <v-card v-if="post!=null" outlined class="pa-4">
      <v-row no-gutters>
        <v-col cols="12">
          <v-text-field :value="post.title" outlined disabled hide-details></v-text-field>
        </v-col>
        <v-col cols="12" class="mt-4">
          <v-card outlined class="pa-4">
            <vue-markdown :html="false" :source="post.content"></vue-markdown>
          </v-card>
        </v-col>
        <v-col cols="12" class="mt-4">
          <v-list-item>
            <v-list-item-avatar>
              <v-avatar>
                <v-img :src="'https://minotar.net/helm/'+post.player.username+'/100.png'" />
              </v-avatar>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{post.player.username}}</v-list-item-title>
              <v-list-item-subtitle>{{post.player.id}}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon>
                <v-icon>thumb_up</v-icon>
              </v-btn>
            </v-list-item-action>
            <v-list-item-action>
              <v-btn icon>
                <v-icon>thumb_down</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-col>
      </v-row>
    </v-card>
    <v-card outlined class="pa-4 mt-4">
      <center>
        <v-progress-circular indeterminate></v-progress-circular>
      </center>
    </v-card>
  </div>
</template>

<script>
import VueMarkdown from "vue-markdown";

export default {
  props: ["network", "actionid"],
  components: {
    VueMarkdown
  },
  data() {
    return {
      post: null,
      error: "",
      postContent: "",
      postTitle: ""
    };
  },
  mounted() {
    this.getPost();
  },
  watch: {
    network: function() {
      this.getPost();
    }
  },
  methods: {
    getPost: function() {
      let main = this;
      if (main.network != null) {
        try {
          main.network
            .getForum()
            .getPost(this.actionid)
            .then(function(post) {
              main.error = "";
              main.post = post;
            })
            .catch(function(error) {
              main.error = error.message;
            });
        } catch (error) {
          main.error = error.message;
        }
      }
    }
  }
};
</script>