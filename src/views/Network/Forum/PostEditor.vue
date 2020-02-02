<template>
  <div>
    <v-row>
      <v-expand-transition>
        <v-col v-show="error!=''" cols="12">
          <v-alert class="mb-0" text color="warning">{{error}}</v-alert>
        </v-col>
      </v-expand-transition>
      <v-col cols="6">
        <v-select
          :items="forumSections"
          :disabled="forumSections==null"
          :loading="forumSections==null"
          no-data-text="Fetching data..."
          outlined
          hide-details
          v-model="selectedSection"
          item-text="name"
          item-value="uuid"
          label="Forum Section"
        ></v-select>
      </v-col>
      <v-col cols="6">
        <v-select
          :items="sectionCategories"
          :disabled="sectionCategories==null"
          :loading="sectionCategoriesLoading==null"
          v-model="selectedCategory"
          no-data-text="Please, select a section first"
          outlined
          hide-details
          item-text="name"
          item-value="uuid"
          label="Forum Category"
        ></v-select>
      </v-col>
      <v-col cols="12">
        <v-text-field v-model="title" label="Title" hide-details outlined></v-text-field>
      </v-col>
      <v-col cols="12" xl="6">
        <v-card outlined>
          <v-sheet class="pa-3" tile color="rgba(0,0,0,0.05)">
            <center>
              <small>
                Do you need help formatting your post?
                <a
                  href="https://www.markdownguide.org/basic-syntax/"
                  target="_blank"
                >Click here</a>
              </small>
            </center>
          </v-sheet>
          <v-textarea
            flat
            solo
            v-model="content"
            hide-details
            row-height="50px"
            auto-grow
            label="Your post content goes here"
          ></v-textarea>
          <v-sheet tile color="rgba(0,0,0,0.05)">
            <v-row no-gutters align="center">
              <v-col cols="6" class="pl-5">
                <v-checkbox prepend-icon="highlight" v-model="lightMode"></v-checkbox>
              </v-col>
              <v-col cols="6" class="pr-5" align="right" justify="right">
                <v-img
                  v-if="!$vuetify.theme.dark"
                  contain
                  width="30px"
                  src="../../../assets/edit/markdown.svg"
                />
                <v-img
                  v-if="$vuetify.theme.dark"
                  contain
                  width="30px"
                  src="../../../assets/edit/markdown-white.svg"
                />
              </v-col>
            </v-row>
          </v-sheet>
        </v-card>
      </v-col>
      <v-col v-if="$vuetify.breakpoint.xlOnly || content.length>0" cols="12" xl="6">
        <v-card outlined class="pa-4">
          <v-expand-transition>
            <vue-markdown v-show="content.length>0" :html="false" :source="content"></vue-markdown>
          </v-expand-transition>
          <v-expand-transition>
            <div v-show="content.length==0">
              Yes, I'll let you take advantage of your huge screen, isn't that cool?
              Now start typing!
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>
      <v-col cols="6" v-if="$vuetify.breakpoint.xsOnly">
        <v-btn
          :to="{ name: 'network', params: { uuid: network.uuid, page: 'forum' }}"
          class="pl-10 pr-10"
          depressed
          block
          large
        >Cancel</v-btn>
      </v-col>
      <v-col cols="6" v-if="$vuetify.breakpoint.xsOnly">
        <v-btn @click="post()" class="pl-10 pr-10" depressed block large color="primary">Post</v-btn>
      </v-col>
      <v-col cols="12" v-if="$vuetify.breakpoint.smAndUp" justify="right" align="right">
        <v-btn
          :to="{ name: 'network', params: { uuid: network.uuid, page: 'forum' }}"
          class="pl-10 pr-10 mr-4"
          depressed
          large
        >Cancel</v-btn>
        <v-btn @click="post()" class="pl-10 pr-10" depressed large color="primary">Post</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import VueMarkdown from "vue-markdown";

export default {
  components: {
    VueMarkdown
  },
  props: ["network"],
  data() {
    return {
      lightMode: true,
      content: "",
      textColor: "black",
      forumSections: null,
      selectedSection: [],
      selectedSectionObject: null,
      sectionCategories: null,
      sectionCategoriesLoading: false,
      selectedCategory: [],
      selectedCategoryObject: null,
      error: "",
      title: ""
    };
  },
  mounted() {
    this.getSections();
    this.$vuetify.theme.dark = false;
  },
  methods: {
    post() {
      let main = this;
      if (this.selectedCategoryObject != null) {
        this.selectedCategoryObject
          .createPost(this.title, this.content)
          .then(function(post) {
            main.error = "";
            main.$router.push({
              name: "network",
              params: {
                uuid: main.network.uuid,
                page: "forum",
                action: "post",
                actionid: post.uuid
              }
            });
          })
          .catch(function(err) {
            main.error = err.message;
          });
      } else {
        this.error = "No category selected";
      }
    },
    getSections() {
      let main = this;
      main.network
        .getForum()
        .getSections()
        .then(function(sections) {
          main.error = "";
          main.forumSections = sections;
        })
        .catch(function(err) {
          main.error = err.message;
        });
    },
    getCategories: function() {
      let main = this;
      main.sectionCategoriesLoading = true;
      if (this.selectedSectionObject != null) {
        this.selectedSectionObject
          .getCategories()
          .then(function(categories) {
            main.sectionCategoriesLoading = false;
            main.error = "";
            main.sectionCategories = categories;
          })
          .catch(function(err) {
            main.sectionCategoriesLoading = false;
            main.error = err.message;
          });
      }
    }
  },
  watch: {
    selectedSection: function(selected) {
      var selectedObject = null;
      this.forumSections.forEach(element => {
        if (element.uuid == selected) {
          selectedObject = element;
        }
      });
      this.selectedSectionObject = selectedObject;
    },
    selectedCategory: function(selected) {
      var selectedObject = null;
      this.sectionCategories.forEach(element => {
        if (element.uuid == selected) {
          selectedObject = element;
        }
      });
      this.selectedCategoryObject = selectedObject;
    },
    selectedSectionObject: function() {
      this.getCategories();
    },
    lightMode: function(val) {
      this.$vuetify.theme.dark = !val;
      if (val) {
        this.textColor = "black";
      } else {
        this.textColor = "white";
      }
    }
  },
  beforeDestroy() {
    this.$vuetify.theme.dark = true;
  }
};
</script>
