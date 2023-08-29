<template>
  <article class="markdown-body" v-html="content"></article>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import hljs from 'highlight.js'; // 增加转换高亮标签插件
import 'highlight.js/styles/github-dark.css';

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
});

onMounted(() => {
  document.querySelectorAll('pre code').forEach((el: HTMLElement) => {
    hljs.highlightElement(el);
  });
});
</script>