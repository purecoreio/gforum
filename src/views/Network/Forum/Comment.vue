<template>
  <div>
    <v-list-item class="pa-0">
      <v-list-item-content class="pa-0 mb-2">
        <v-card outlined>
          <div class="pa-2">
            <v-row no-gutters align="center">
              <v-col cols="10">
                <vue-markdown :html="false" :source="comment.content" />
              </v-col>
              <v-col cols="2" justify="right" align="right">
                <v-btn @click="replying=!replying" icon>
                  <v-icon>reply</v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <v-divider class="mt-2 mb-1" />

            <div class="d-flex align-center">
              <div class="pb-1">
                <small class="grey--text mr-2">{{comment.player.username}}</small>
              </div>
              <div>
                <v-chip-group class="mb-0 pb-0" active-class="primary--text" multiple>
                  <v-chip small>
                    <v-img
                      width="10px"
                      contain
                      src="https://www.freeiconspng.com/uploads/tennis-ball-png-transparent-image-8.png"
                    />
                    <small class="ml-2">1</small>
                  </v-chip>
                  <v-chip small class="pl-1 pr-1">
                    <v-icon small>add</v-icon>
                  </v-chip>
                </v-chip-group>
              </div>
              <div class="ml-auto">
                <v-btn-toggle dense>
                  <v-btn icon small>
                    <v-icon small>keyboard_arrow_down</v-icon>
                  </v-btn>
                  <v-btn icon small>
                    <v-icon small>keyboard_arrow_up</v-icon>
                  </v-btn>
                </v-btn-toggle>
              </div>
            </div>
          </div>
          <v-expand-transition>
            <v-sheet v-show="replying" style="background-color: rgba(0,0,0,0.1)">
              <div class="pa-2">
                <v-textarea
                  v-model="replyContent"
                  autofocus
                  auto-grow
                  row-height="15px"
                  outlined
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
                    <v-btn
                      @click="postReply()"
                      class="pl-10 pr-10"
                      depressed
                      large
                      color="primary"
                    >Post</v-btn>
                  </v-col>
                </v-row>
              </div>
            </v-sheet>
          </v-expand-transition>
          <v-progress-linear v-if="commentList==null" indeterminate />
        </v-card>
      </v-list-item-content>
    </v-list-item>
    <v-expand-transition>
      <div v-if="commentList!=null" class="pl-5">
        <div v-show="commentList.length>0">
          <Comment
            :comment="commentInfo"
            v-for="commentInfo in commentList"
            :key="commentInfo.uuid"
          />
        </div>
      </div>
    </v-expand-transition>
  </div>
</template>


<script>
import VueMarkdown from "vue-markdown";
export default {
  name: "Comment",
  props: ["comment"],
  components: {
    VueMarkdown
  },
  data() {
    return {
      replying: false,
      replyPage: 0,
      commentList: null,
      replyContent: ""
    };
  },
  mounted() {
    this.getSubComments();
  },
  methods: {
    postReply: function() {
      let main = this;
      this.comment
        .createReply(this.replyContent)
        .then(function() {
          main.replying = false;
          main.error = "";
          main.getSubComments(true);
        })
        .catch(function(error) {
          main.replying = true;
          main.error = error.message;
        });
    },
    getSubComments: function(clear) {
      if (clear) {
        this.replyPage = 0;
        this.commentList = null;
      }
      let main = this;
      this.comment
        .getReplies(main.replyPage)
        .then(function(replyList) {
          main.error = "";
          main.replyPage++;
          if (main.replyList == null) {
            main.commentList = [];
          }
          replyList.forEach(reply => {
            main.commentList.push(reply);
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
};
</script>