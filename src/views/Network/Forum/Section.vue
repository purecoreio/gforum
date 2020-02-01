<template>
  <v-card outlined>
    <div class="pa-4">
      <p class="headline mb-0">{{section.name}}</p>
      <p class="mb-0">{{section.description}}</p>
      <v-alert v-if="error!=''" text color="warning">{{error}}</v-alert>
      <div v-if="categories==null && error == ''">
        <v-skeleton-loader v-for="i in 5" :key="i" type="list-item-two-line" />
      </div>
    </div>
    <v-divider class="mt-1 mb-3" />
    <div v-if="categories!=null && error == ''">
      <v-list class="mt-0 pt-0" two-line>
        <v-list-item
          @click="goToCategory(category)"
          v-for="category in categories"
          :key="category.uuid"
        >
          <v-list-item-content>
            <v-list-item-title>{{category.name}}</v-list-item-title>
            <v-list-item-subtitle>{{category.description}}</v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-btn icon>
              <v-icon>arrow_forward</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </div>
  </v-card>
</template>


<script>
export default {
  props: ["section"],
  data: () => ({
    categories: null,
    error: ""
  }),
  mounted() {
    this.getCategories();
  },
  methods: {
    getCategories: function() {
      let main = this;
      if (this.section != null) {
        this.section
          .getCategories()
          .then(function(categories) {
            main.error = "";
            main.categories = categories;
          })
          .catch(function(err) {
            main.error = err.message;
          });
      }
    },
    goToCategory: function(category) {
      alert(category.uuid);
    }
  }
};
</script>