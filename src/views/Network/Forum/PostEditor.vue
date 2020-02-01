<template>
  <div id="editor">
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <Development />
  </div>
</template>

<script>
import Development from "../../Empty/Development";
export default {
  components: {
    Development: Development
  },
  data: () => ({
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
          document.location.href.length - 4
        )
      },
      {
        text: "Editor",
        disabled: true
      }
    ]
  })
};
</script>