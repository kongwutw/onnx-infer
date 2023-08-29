<template>
  <div class="yolo">
      <h3 @click="onChange">yolov8n seg</h3>
      <button @click="downloadImg">下载图片</button>
      <div style="display: flex; justify-content: space-around; width: 100%; margin-top: 20px;">
          <canvas id="image" style="border: 1px solid blue;" />
          <canvas id="mask" style="border: 1px solid red;" />
          <canvas id="result" style="border: 1px solid green;" />
      </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { getYoloInputByElm, fetchImg } from './utils';
// import { getYoloInputByElm, fetchImg } from '@onnx-infer/utils';

import { initONNX, runONNX } from './onnx';

let testImg: string = $ref('1.png');

let onnx: any;

const downloadImg = () => {
  const result: any = document.getElementById('result');
  const img = result.toDataURL("image/png");
  const a = document.createElement('a');
  a.download = 'kt.png';
  a.href = img;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const onChange = async () => {
  const img: any = await fetchImg(testImg);
  const { width, height } = img;
  let canvasHeight = 0;
  let canvasWidth = 0;
  if (width > height) {
      canvasWidth = 320;
      canvasHeight = 320 * height / width;
  } else {
      canvasWidth = 320 * width / height;
      canvasHeight = 320;
  }

  const canvas: any = document.getElementById('image');
  const ctx = canvas.getContext('2d');

  ctx.canvas.width = canvasWidth;
  ctx.canvas.height = canvasHeight;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

  const { float32Data, xRatio, yRatio } = await getYoloInputByElm(img, 640, 640, '#fff');

  await runONNX(onnx, float32Data, xRatio, yRatio);
}

onMounted(async () => {
  onnx = await initONNX();
});
</script>

<style scoped>
.yolo {
  height: 100vh;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
<!-- 
<template>
  <div>
    <h2>yolov8 分割</h2>

  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

import { InferenceSession, env } from 'onnxruntime-web';
// import { InferenceSession, env } from '@onnx-infer/webgl';

onMounted(async()=> {
  const res = await fetch('/models/yolov8n-seg.onnx');
  const model = await res.arrayBuffer();
  const session = await InferenceSession.create(model, { });

  console.log('session', session);
});
</script>

<style lang="postcss" scoped>

</style> -->