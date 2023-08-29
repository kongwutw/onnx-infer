const reshapeToRGB = (imageData, opt): Float32Array => {
    // mean和std是介于0-1之间的
    const { mean, std, targetShape, bgr, normalizeType = 0 } = opt;
    const [, c, h, w] = targetShape;
    const data = imageData.data || imageData;
    const result = new Float32Array(h * w * c);

    let offset = 0;
    for (let i = 0; i < h; ++i) {
        const iw = i * w;
        for (let j = 0; j < w; ++j) {
            const iwj = iw + j;
            for (let k = 0; k < c; ++k) {
                const a = bgr ? iwj * 4 + (2 - k) : iwj * 4 + k;
                result[offset] = normalizeType === 0 ? data[a] / 255 : (data[a] - 128) / 128;
                result[offset] -= mean[k];
                result[offset] /= std[k];
                offset++;
            }
        }
    }

    return nhwc2nchw(result, [1, h, w, c]);
}

export const getImgTensorByElm = (img, config, modelShape): Float32Array => {
    const { gapFillWith, mean, std, bgr, keepRatio, scale } = config;
    const { channel, height, width } = modelShape;
    const opt = {
        gapFillWith,
        mean,
        std,
        bgr,
        keepRatio,
        scale,
        targetSize: {
            width,
            height
        },
        targetShape: [1, channel, height, width]
    };

    const imageDataInfo = {
        gapFillWith,
        dx: 0,
        dy: 0,
        dWidth: width,
        dHeight: height
    };

    const imageData = resizeImg(img, imageDataInfo, opt);

    return reshapeToRGB(imageData, opt) as Float32Array;
}

export const getImgTensorByUrl= async(url: string, config: object, modelShape: object) => {
    const img: any = await fetchImg(url);
    return getImgTensorByElm(img, config, modelShape);
}

export const getMaxIndex = (arr: number[]) => {
    const max: number = Math.max.apply(null, arr);

    return arr.indexOf(max);
};

export const fetchImg = (url: string) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = url;
    return new Promise((resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = e => {
            reject(e);
        };
    });
};

export const getImageData = (imageElement: any) => {
    const canvas: any = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const { width, height } = imageElement;
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(imageElement, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height);
    
    return imageData;
};

export const nhwc2nchw = (data: number[] | Float32Array, shape: number[]) => {
    const N = shape[0];
    const H = shape[1];
    const W = shape[2];
    const C = shape[3];
    const WXC = W * C;
    const HXWXC = H * W * C;
    const nchwData: any[] = [];
    for (let n = 0; n < N; n++) {
        for (let c = 0; c < C; c++) {
            for (let h = 0; h < H; h++) {
                for (let w = 0; w < W; w++) {
                    nchwData.push(data[n * HXWXC + h * WXC + w * C + c]);
                }
            }
        }
    }
    return new Float32Array(nchwData);
}

/**
 * 缩放成目标尺寸, keepRatio 为 true 则保持比例拉伸并居中，为 false 则变形拉伸为目标尺寸
 */
export const resizeImg = (image, imageDataInfo, opt?) => {
    const targetCanvas = document.createElement('canvas') as HTMLCanvasElement;
    const targetContext = targetCanvas.getContext('2d') as CanvasRenderingContext2D;
    const pixelWidth = (image as HTMLImageElement).naturalWidth || image.width;
    const pixelHeight = (image as HTMLImageElement).naturalHeight || image.height;
    const {
        keepRatio = true,
        scale = 0
    } = opt || {};
    const targetWidth = imageDataInfo.dWidth;
    const targetHeight = imageDataInfo.dHeight;

    let canvasWidth = targetWidth;
    let canvasHeight = targetHeight;
    // 缩放后的宽高
    let sw = targetWidth;
    let sh = targetHeight;
    let x = 0;
    let y = 0;

    if (scale) {
        if (sw - targetWidth < 0 || sh - targetHeight < 0) {
            throw new Error('scale size smaller than target size');
        }
        if (pixelWidth > pixelHeight) {
            sh = scale;
            sw = Math.round(sh * pixelWidth / pixelHeight);
        } else {
            sw = scale;
            sh = Math.round(sw * pixelHeight / pixelWidth);
        }
        targetCanvas.width = canvasWidth = sw;
        targetCanvas.height = canvasHeight = sh;
        imageDataInfo.dx = (sw - targetWidth) / 2;
        imageDataInfo.dy = (sh - targetHeight) / 2;
    } else {
        if (keepRatio) {
            // target的长宽比大些 就把原图的高变成target那么高
            if (targetWidth / targetHeight * pixelHeight / pixelWidth >= 1) {
                sw = Math.round(sh * pixelWidth / pixelHeight);
                x = Math.floor((targetWidth - sw) / 2);
            }
            // target的长宽比小些 就把原图的宽变成target那么宽
            else {
                sh = Math.round(sw * pixelHeight / pixelWidth);
                y = Math.floor((targetHeight - sh) / 2);
            }
        }
        targetCanvas.width = imageDataInfo.dWidth = canvasWidth;
        targetCanvas.height = imageDataInfo.dHeight = canvasHeight;
    }

    targetContext.fillStyle = imageDataInfo.gapFillWith;
    targetContext.fillRect(0, 0, targetCanvas.width, targetCanvas.height);
    targetContext.drawImage(image, x, y, sw, sh);

    const { dx, dy, dWidth, dHeight } = imageDataInfo;

    return targetContext.getImageData(dx, dy, dWidth, dHeight);
}

export const getYoloInputByElm = (img: any, targetWidth: number, targetHeight: number, fillStyle: string) => {
    const { width, height } = img;  

    let scaleWidth = targetWidth;
    let scaleHeight = targetHeight;
    // eg: width 1280 height 640, 就把原图的宽变成target那么宽
    if ((width / height) > (targetWidth / targetHeight)) {
        scaleHeight = Math.round(scaleWidth * height / width);
    } else {
        scaleWidth = Math.round(scaleHeight * width / height);
    }
    const maxSize = height > width ? height : width;
    const xRatio = maxSize / width;
    const yRatio = maxSize / height;

    const canvas: any = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx: any = canvas.getContext('2d');
    ctx.fillStyle = fillStyle || '#fff';
    ctx.fillRect(0, 0, targetWidth, targetHeight);
    ctx.drawImage(img, 0, 0, scaleWidth, scaleHeight);
    const { data } = ctx.getImageData(0, 0, targetWidth, targetHeight);

    const redArray: any = [];
    const greenArray: any = [];
    const blueArray: any = [];
    for (let i = 0; i < data.length; i += 4) {
        redArray.push(data[i]);
        greenArray.push(data[i + 1]);
        blueArray.push(data[i + 2]);
    }
    const transposedData = redArray.concat(greenArray).concat(blueArray);
    const { length } = transposedData;
    const float32Data = new Float32Array(3 * targetWidth * targetHeight);
    for (let i = 0; i < length; i++) {
        float32Data[i] = transposedData[i] / 255;
    }

    return { float32Data, xRatio, yRatio }
};

export const getYoloInputByUrl = async (url: string, targetWidth: number, targetHeight: number, fillStyle: string) => {
    const img: any = await fetchImg(url);
    return getYoloInputByElm(img, targetWidth, targetHeight, fillStyle);
};

export const getYoloInput = async (image: string, targetWidth: number, targetHeight: number, fillStyle: string) => {
    console.log('111', typeof image, image)
    if (typeof image === 'string') {
        return getYoloInputByUrl(image, targetWidth, targetHeight, fillStyle)
    } else {
        return getYoloInputByElm(image, targetWidth, targetHeight, fillStyle);
    }
};

const sigmoid = (x: any) => {
    return 1 / (1 + Math.exp(-x));
}

export const yoloDecodeInfer = (output: any, stride: any, anchors: any) => {
    const { data, dims } = output;
    const channels = dims[1];
    const height = dims[2];
    const width = dims[3];
    const pred_item = dims[4] || 85;
    const boxes: any[] = [];

    for(let ci=0; ci < channels; ci++) {
        // console.log('ci', ci, dims);
        const channel_ptr = ci * (height * width * pred_item);
        
        for(let hi = 0; hi < height; hi++) {
            const height_ptr = channel_ptr + hi * width * pred_item;
            for(let wi = 0; wi < width; wi++) {
                const width_ptr: any = height_ptr + wi * pred_item;
                const confidence = sigmoid(data[width_ptr + 4]);

                for(let classId = 0; classId < 80; classId++) {
                    const probability = sigmoid(data[width_ptr + 5 + classId]) * confidence;
                    if(probability > 0.3) {
                        let cx = (sigmoid(data[width_ptr]) * 2 - 0.5 + wi) * stride;
                        let cy = (sigmoid(data[width_ptr + 1]) * 2 - 0.5 + hi) * stride;
                        let w = Math.pow(sigmoid(data[width_ptr + 2]) * 2, 2) * anchors[ci].width;
                        let h = Math.pow(sigmoid(data[width_ptr + 3]) * 2, 2) * anchors[ci].height;
            
                        const x1 = Math.max(0, Math.min(640, (cx - w / 2)));
                        const y1 = Math.max(0, Math.min(640, (cy - h / 2)));
                        const x2 = Math.max(0, Math.min(640, (cx + w / 2)));
                        const y2 = Math.max(0, Math.min(640, (cy + h / 2)));
                        boxes.push({
                            classId,
                            probability,
                            bounding: [x1, y1, x2, y2],
                        });
                    }
                }
            }
        }
    }

    return boxes;
};

export const yoloNms = (boxes: any) => {
    boxes.sort((a: any, b: any) => a.probability > b.probability);
    const vArea: any[] = [];
    boxes.map((item: any) => {
        const { bounding } = item;
        vArea.push((bounding[2] - bounding[0] + 1) * (bounding[3] - bounding[1] + 1));
    });

    for (let i = 0; i < boxes.length; ++i) {
        for (let j = i + 1; j < boxes.length;) {
            const xx1 = Math.max(boxes[i].bounding[0], boxes[j].bounding[0]);
            const yy1 = Math.max(boxes[i].bounding[1], boxes[j].bounding[1]);
            const xx2 = Math.min(boxes[i].bounding[2], boxes[j].bounding[2]);
            const yy2 = Math.min(boxes[i].bounding[3], boxes[j].bounding[3]);
            const w = Math.max(0, xx2 - xx1 + 1);
            const h = Math.max(0, yy2 - yy1 + 1);
            const inter = w * h;
            const ovr = inter / (vArea[i] + vArea[j] - inter);
            if (ovr >= 0.7) {
                boxes.splice(j, 1);
                vArea.splice(j, 1);
            } else {
                j++;
            }
        }
    }

    return boxes;
};

