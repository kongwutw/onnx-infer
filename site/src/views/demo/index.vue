<template>
  <div>
    <h2>yolov8 分割</h2>

  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

import { InferenceSession, env } from '@onnx-infer/webgl';


onMounted(async()=> {
  const res = await fetch('/models/yolov8n-seg.onnx');
  const model = await res.arrayBuffer();
  const session = await InferenceSession.create(model);

  console.log('session', session);
});
</script>

<style lang="postcss" scoped>

</style>