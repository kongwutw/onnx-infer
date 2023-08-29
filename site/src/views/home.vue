<template>
    <div class="home-ctn">
      <h1 class="title">onnx 推理引擎</h1>
      <p style="font-size: 25px;">面向 onnx 模型格式的全端推理方案</p>
      <div style="display: flex; margin-bottom: 20px;">
        <button ghost style="margin-right: 24px;" @click="goRoute('/docs/dev')">参与开发</button>
        <button ghost style="margin-right: 24px;" type="success" @click="goRoute('/docs/start')">快速使用</button>
      </div>
      <div class="list-wrap">
        <div 
          v-for="(item, index) in listData" 
          :key="index"
          style="width: 30%;"
        >
          <h1>{{ item.title }}</h1>
          <p>{{ item.desc }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted } from 'vue';
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  
  
  const listData = [{
    title: '123',
    desc: '456',
  }, {
    title: '345',
    desc: '1',
  }, {
    title: '345',
    desc: '456',
  }];
  
  const goRoute = (path: string) => {
    router.replace({ path });
  }
  </script>
  
  <style lang="postcss" scoped>
  .home-ctn {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  
    .title {
      color: rgb(44, 62, 80);
      font-size: 80px;
      line-height: 80px;
      font-weight: 500;
      margin-bottom: 18px;
      font-family: Metropolis, sans-serif;
    }
  
    .list-wrap {
      display: flex; 
      justify-content: space-between;
      width: 80%;
      margin-top: 200px;
      padding-top: 20px;
      border-top: solid 1px rgb(239, 239, 245);
    }
  }
</style>