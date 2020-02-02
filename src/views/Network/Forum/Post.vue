<template>
  <div>
    <v-fab-transition>
      <v-btn
        v-show="!replying"
        color="primary"
        class="black--text"
        @click="reply()"
        fixed
        dark
        fab
        bottom
        right
      >
        <v-icon>reply</v-icon>
      </v-btn>
    </v-fab-transition>
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
          <v-card outlined>
            <div class="pa-4">
              <vue-markdown :html="false" :source="post.content" />
            </div>
            <v-divider />
            <v-list-item class="pt-3 pb-3">
              <v-list-item-avatar>
                <v-avatar>
                  <v-img :src="'https://minotar.net/helm/'+post.player.username+'/100.png'" />
                </v-avatar>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{post.player.username}}</v-list-item-title>
                <v-list-item-subtitle>{{post.player.id}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
        <v-col cols="6" class="mt-3" align="left" justify="center">
          <v-chip-group column active-class="primary--text" multiple>
            <v-chip>
              <v-avatar>
                <v-img
                  contain
                  src="https://www.freeiconspng.com/uploads/tennis-ball-png-transparent-image-8.png"
                />
              </v-avatar>
              <span class="ml-2">1</span>
            </v-chip>
            <v-chip>
              <v-icon>add</v-icon>
            </v-chip>
          </v-chip-group>
        </v-col>
        <v-col cols="6" class="mt-3" align="right" justify="center">
          <v-btn-toggle rounded>
            <v-btn>
              <v-icon>keyboard_arrow_down</v-icon>
            </v-btn>
            <v-btn>
              <v-icon>keyboard_arrow_up</v-icon>
            </v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>
    </v-card>
    <v-expand-transition>
      <v-card v-show="replying" outlined class="mt-2 pa-2">
        <v-textarea
          v-model="replyContent"
          autofocus
          row-height="20px"
          auto-grow
          class="mt-0"
          hide-details
        ></v-textarea>
        <v-row>
          <v-col cols="6" v-if="$vuetify.breakpoint.xsOnly">
            <v-btn @click="replying=false" class="pl-10 pr-10" depressed block large>Cancel</v-btn>
          </v-col>
          <v-col cols="6" v-if="$vuetify.breakpoint.xsOnly">
            <v-btn
              @click="postReply()"
              class="pl-10 pr-10"
              depressed
              block
              large
              color="primary"
            >Post</v-btn>
          </v-col>
          <v-col cols="12" v-if="$vuetify.breakpoint.smAndUp" justify="right" align="right">
            <v-btn @click="replying=false" class="pl-10 pr-10 mr-4" depressed large>Cancel</v-btn>
            <v-btn @click="postReply()" class="pl-10 pr-10" depressed large color="primary">Post</v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-expand-transition>
    <div v-if="replyList==null">
      <v-progress-linear class="pa-0 ma-0" color="primary" indeterminate />
    </div>
    <div class="pt-2" v-if="replyList!=null">
      <div v-if="replyList.length>0">
        <Comment :comment="reply" v-for="reply in replyList" :key="reply.uuid" />
      </div>
    </div>
  </div>
</template>

<script>
import VueMarkdown from "vue-markdown";
import Comment from "./Comment";

export default {
  props: ["network", "actionid"],
  components: {
    VueMarkdown,
    Comment
  },
  data() {
    return {
      replying: false,
      post: null,
      error: "",
      postContent: "",
      replyContent: "",
      postTitle: "",
      replyPage: 0,
      stopLoadingReplies: false,
      replyList: null
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
    postReply: function() {
      let main = this;
      this.post
        .createReply(this.replyContent)
        .then(function() {
          main.replying = false;
          main.error = "";
          main.getReplies(true);
        })
        .catch(function(error) {
          main.replying = true;
          main.error = error.message;
        });
    },
    reply: function() {
      this.replying = true;
    },
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
              main.getReplies();
            })
            .catch(function(error) {
              main.error = error.message;
            });
        } catch (error) {
          main.error = error.message;
        }
      }
    },
    getReplies: function(clear = false) {
      let main = this;
      if (clear) {
        main.replyList = null;
        main.replyPage = 0;
        main.stopLoadingReplies = false;
      }
      if (main.post != null && !main.stopLoadingReplies) {
        main.post
          .getReplies(main.replyPage)
          .then(function(replyList) {
            main.error = "";
            main.replyPage++;
            if (main.replyList == null) {
              main.replyList = [];
            }
            replyList.forEach(reply => {
              main.replyList.push(reply);
            });
            if (replyList.length < 20) {
              main.stopLoadingReplies = true;
            }
          })
          .catch(function(error) {
            main.error = error.message;
          });
      }
    }
  }
};
</script>