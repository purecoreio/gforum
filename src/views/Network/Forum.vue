<template>
  <div>
    <v-fab-transition>
      <v-btn
        v-show="action!='edit'&&action!='post'"
        color="primary"
        class="black--text"
        @click="createPost()"
        fixed
        dark
        fab
        bottom
        right
      >
        <v-icon>edit</v-icon>
      </v-btn>
    </v-fab-transition>
    <NetworkNews :show="action!='edit'&&action!='post'" />
    <SectionList v-if="action==null" :network="network" />
    <PostList
      v-if="action=='category'"
      :network="network"
      :action="action"
      :actionid="actionid"
      :key="actionid"
    />
    <PostEditor v-if="action=='edit'" :network="network" />
    <Post v-if="action=='post'" :network="network" :actionid="actionid" />
  </div>
</template>

<script>
import SectionList from "./Forum/SectionList";
import PostList from "./Forum/PostList";
import NetworkNews from "./Forum/News";
import PostEditor from "./Forum/PostEditor";
import Post from "./Forum/Post";

export default {
  props: ["network", "action", "actionid"],
  components: {
    SectionList: SectionList,
    NetworkNews: NetworkNews,
    PostList: PostList,
    PostEditor: PostEditor,
    Post: Post
  },
  data: () => ({
    news: ["hello"],
    items: [
      {
        text: "Network",
        disabled: true
      },
      {
        text: "Forum",
        disabled: false
      }
    ]
  }),
  methods: {
    createPost: function() {
      this.$router.push({
        name: "network",
        params: {
          uuid: this.network.uuid,
          page: "forum",
          action: "edit"
        }
      });
    }
  }
};
</script>