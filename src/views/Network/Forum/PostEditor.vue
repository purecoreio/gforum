<template>
  <div>
    <Editor v-model="text" />
  </div>
</template>
<script>
import { Editor } from "vuetify-markdown-editor";

export default {
  name: "app",
  components: {
    Editor
  },
  data() {
    return {
      text: ""
    };
  }
};
</script>

<style>
@import "https://cdn.jsdelivr.net/npm/katex@0.10.2/dist/katex.min.css";
@import "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.8/styles/default.min.css";
</style>