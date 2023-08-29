import { InferenceSession, Tensor, env } from 'onnxruntime-web';

const createSession = async(fileName: string) => {
    const url = `/models/${fileName}`;
    const response = await fetch(url);
    const modelFile = await response.arrayBuffer();
    // const session = await InferenceSession.create(modelFile, { executionProviders: ['webgl'] });
    const session = await InferenceSession.create(modelFile, { executionProviders: ['wasm'] });
    return session;
};

const overflowBoxes = (box: any, maxSize: any) => {
    box[0] = box[0] >= 0 ? box[0] : 0;
    box[1] = box[1] >= 0 ? box[1] : 0;
    box[2] = box[0] + box[2] <= maxSize ? box[2] : maxSize - box[0];
    box[3] = box[1] + box[3] <= maxSize ? box[3] : maxSize - box[1];
    return box;
  };

export const initONNX = async() => {
    env.wasm.simd = true;
    env.wasm.numThreads = 1;
    env.wasm.proxy = false;
    // const yolo = await createSession('yolov5n-seg.onnx');
    // const nms = await createSession('nms-yolov5.onnx');
    // const maskOrt = await createSession('mask-yolov5-seg.onnx');

    const yolo = await createSession('yolov8n-seg.onnx');
    const nms = await createSession('nms-yolov8.onnx');
    const maskOrt = await createSession('mask-yolov8-seg.onnx');
    return { yolo, nms, maskOrt };
};

export const runONNX = async(onnxInstance: any, inputData: any, xRatio: any, yRatio: any) => {
    const numClass = 80;
    const modelWidth = 640;
    const modelHeight = 640;
    const maxSize = Math.max(modelWidth, modelHeight);
    const { yolo, nms, maskOrt } = onnxInstance;
    const tensor = new Tensor('float32', inputData, [1, 3, 640, 640]);

    const { output0, output1 } = await yolo.run({ images: tensor });
    // v8
    const config = new Tensor('float32', new Float32Array([80, 100, 0.45, 0.2])); 
    // v5
    // const config = new Tensor('float32', new Float32Array([100, 0.4, 0.2]));

    const { selected } = await nms.run({ detection: output0, config }); 
    // v5
    // const { selected_idx } = await nms.run({ detection: output0, config });
    // const selected = selected_idx;
    let overlay: any = new Tensor("uint8", new Uint8Array(modelHeight * modelWidth * 4), [modelHeight, modelWidth, 4]);
    
    for (let idx = 0; idx < selected.dims[1]; idx++) {
    // for (let idx = 0; idx < output0.dims[1]; idx++) {
    //     if (!selected_idx.data.includes(idx)) continue; 
        // const data = output0.data.slice(idx * output0.dims[2], (idx + 1) * output0.dims[2]);
        const data = selected.data.slice(idx * selected.dims[2], (idx + 1) * selected.dims[2]);
        let box = data.slice(0, 4);
        const color = [255, 0, 255, 255];
    
        box = overflowBoxes([box[0] - 0.5 * box[2], box[1] - 0.5 * box[3], box[2], box[3]],maxSize);
    
        const [x, y, w, h] = overflowBoxes([
            Math.floor(box[0] * xRatio),
            Math.floor(box[1] * yRatio),
            Math.floor(box[2] * xRatio),
            Math.floor(box[3] * yRatio),
          ],
        maxSize);
    
        const detection = new Tensor("float32", new Float32Array([...box, ...data.slice(4 + numClass)]));
        // v5
        // const detection = new Tensor("float32", new Float32Array([...box, ...data.slice(5 + numClass)]));
        const maskConfig = new Tensor("float32", new Float32Array([maxSize, x, y, w, h, ...color])); 
        
        const { mask_filter } = await maskOrt.run({ detection, mask: output1, config: maskConfig, overlay});
        // v5
        // const { mask_filter } = await maskOrt.run({ detection, mask: output1, config: maskConfig});
        overlay = mask_filter;
    }

    const { data } = overlay;

    drawMask(data, xRatio, yRatio);
};

const drawMask = (data: any, xRatio: any, yRatio: any) => {
    const canvas: any = document.getElementById('mask');
    const ctx = canvas.getContext('2d');
    const mask_img = new ImageData(new Uint8ClampedArray(data), 640, 640);
    ctx.canvas.width = 640;
    ctx.canvas.height = 640;
    ctx.putImageData(mask_img, 0, 0); 

    const img = document.createElement('img');;
    img.src = canvas.toDataURL("image/png");
    setTimeout(() => {
        ctx.canvas.width = 320 / xRatio;
        ctx.canvas.height = 320 / yRatio;
        ctx.drawImage(img, 0, 0, 320 / xRatio, 320 / yRatio);

        drawResult(320 / xRatio, 320 / yRatio);
    }, 0);
}

const drawResult = (canvasWidth: any, canvasHeight: any) => {
    const mask: any = document.getElementById('mask');
    const maskCtx = mask.getContext('2d');
    const { data } = maskCtx.getImageData(0, 0, maskCtx.canvas.width, maskCtx.canvas.height);
    
    const img: any = document.getElementById('image');
    const imgCtx = img.getContext('2d');
    const imgData = imgCtx.getImageData(0, 0, imgCtx.canvas.width, imgCtx.canvas.height);

    for (let i = 0; i < data.length / 4; i++) {
        const index = i * 4;
        if (data[index] !== 255) {
            imgData.data[index + 3] = 0;
        }
    }

    const result: any = document.getElementById('result');
    const ctx = result.getContext('2d');
    ctx.canvas.width = canvasWidth;
    ctx.canvas.height = canvasHeight;
    ctx.putImageData(imgData, 0, 0); 
};
