<template>
    <div class="topnav">
        <div @click="handleClick('/')" style="margin-left: 15px; font-size: 30px; color: hsla(0,0%,100%,.7);">
          onnx infer
        </div>
        <div style="display: flex;padding-right: 15px; color: white">
            <div @click="handleClick('/')" style="margin-right: 20px;">首页</div>
            <div @click="handleClick('/demo')" style="margin-right: 20px;">Demo</div>
            <div @click="handleClick('/docs')">文档</div>
        </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  let activeName = $ref('/');
  
  const handleClick = (path) => {
    router.replace({ path });
  }
  </script>
  
  <style lang="postcss" scoped>
  .topnav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    width: 100%;
    border-bottom: solid 1px rgb(239, 239, 245);
    background-color: darkblue;
  }
  </style>