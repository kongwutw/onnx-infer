"use strict";const t={},e=[],r=async r=>{const i=0===r.length?e:r,n=[];for(const e of i){const r=t[e];if(r){if(r.initialized)return r.backend;if(r.aborted)continue;const t=!!r.initPromise;try{return t||(r.initPromise=r.backend.init()),await r.initPromise,r.initialized=!0,r.backend}catch(i){t||n.push({name:e,err:i}),r.aborted=!0}finally{delete r.initPromise}}}throw new Error(`no available backend found. ERR: ${n.map((t=>`[${t.name}] ${t.err}`)).join(", ")}`)};const i=new class{constructor(){this.wasm={},this.webgl={},this.webgpu={},this.logLevelInternal="warning"}set logLevel(t){if(void 0!==t){if("string"!=typeof t||-1===["verbose","info","warning","error","fatal"].indexOf(t))throw new Error(`Unsupported logging level: ${t}`);this.logLevelInternal=t}}get logLevel(){return this.logLevelInternal}debug;wasm;webgl;webgpu;logLevelInternal};const n=class t{constructor(t){this.handler=t}async run(t,e,r){const i={};let n={};if("object"!=typeof t||null===t||t instanceof h||Array.isArray(t))throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");let o=!0;if("object"==typeof e){if(null===e)throw new TypeError("Unexpected argument[1]: cannot be null.");if(e instanceof h)throw new TypeError("'fetches' cannot be a Tensor");if(Array.isArray(e)){if(0===e.length)throw new TypeError("'fetches' cannot be an empty array.");o=!1;for(const t of e){if("string"!=typeof t)throw new TypeError("'fetches' must be a string array or an object.");if(-1===this.outputNames.indexOf(t))throw new RangeError(`'fetches' contains invalid output name: ${t}.`);i[t]=null}if("object"==typeof r&&null!==r)n=r;else if(void 0!==r)throw new TypeError("'options' must be an object.")}else{let t=!1;const a=Object.getOwnPropertyNames(e);for(const r of this.outputNames)if(-1!==a.indexOf(r)){const n=e[r];(null===n||n instanceof h)&&(t=!0,o=!1,i[r]=n)}if(t){if("object"==typeof r&&null!==r)n=r;else if(void 0!==r)throw new TypeError("'options' must be an object.")}else n=e}}else if(void 0!==e)throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(const e of this.inputNames)if(void 0===t[e])throw new Error(`input '${e}' is missing in 'feeds'.`);if(o)for(const t of this.outputNames)i[t]=null;const a=await this.handler.run(t,i,n),s={};for(const t in a)Object.hasOwnProperty.call(a,t)&&(s[t]=new h(a[t].type,a[t].data,a[t].dims));return s}static async create(e,i,n,o){let a,s={};if("string"==typeof e){if(a=e,"object"==typeof i&&null!==i)s=i;else if(void 0!==i)throw new TypeError("'options' must be an object.")}else if(e instanceof Uint8Array){if(a=e,"object"==typeof i&&null!==i)s=i;else if(void 0!==i)throw new TypeError("'options' must be an object.")}else{if(!(e instanceof ArrayBuffer||"undefined"!=typeof SharedArrayBuffer&&e instanceof SharedArrayBuffer))throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");{const t=e;let r=0,h=e.byteLength;if("object"==typeof i&&null!==i)s=i;else if("number"==typeof i){if(r=i,!Number.isSafeInteger(r))throw new RangeError("'byteOffset' must be an integer.");if(r<0||r>=t.byteLength)throw new RangeError(`'byteOffset' is out of range [0, ${t.byteLength}).`);if(h=e.byteLength-r,"number"==typeof n){if(h=n,!Number.isSafeInteger(h))throw new RangeError("'byteLength' must be an integer.");if(h<=0||r+h>t.byteLength)throw new RangeError(`'byteLength' is out of range (0, ${t.byteLength-r}].`);if("object"==typeof o&&null!==o)s=o;else if(void 0!==o)throw new TypeError("'options' must be an object.")}else if(void 0!==n)throw new TypeError("'byteLength' must be a number.")}else if(void 0!==i)throw new TypeError("'options' must be an object.");a=new Uint8Array(t,r,h)}}const h=(s.executionProviders||[]).map((t=>"string"==typeof t?t:t.name)),d=await r(h),f=await d.createSessionHandler(a,s);return new t(f)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}handler},o=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array]]),a=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]);let s=!1;const h=class t{constructor(t,e,r){let i,n,h;if((()=>{if(!s){s=!0;const t="undefined"!=typeof BigInt64Array&&"function"==typeof BigInt64Array.from,e="undefined"!=typeof BigUint64Array&&"function"==typeof BigUint64Array.from;t&&(o.set("int64",BigInt64Array),a.set(BigInt64Array,"int64")),e&&(o.set("uint64",BigUint64Array),a.set(BigUint64Array,"uint64"))}})(),"string"==typeof t)if(i=t,h=r,"string"===t){if(!Array.isArray(e))throw new TypeError("A string tensor's data must be a string array.");n=e}else{const r=o.get(t);if(void 0===r)throw new TypeError(`Unsupported tensor type: ${t}.`);if(Array.isArray(e))n=r.from(e);else{if(!(e instanceof r))throw new TypeError(`A ${i} tensor's data must be type of ${r}`);n=e}}else if(h=e,Array.isArray(t)){if(0===t.length)throw new TypeError("Tensor type cannot be inferred from an empty array.");const e=typeof t[0];if("string"===e)i="string",n=t;else{if("boolean"!==e)throw new TypeError(`Invalid element type of data array: ${e}.`);i="bool",n=Uint8Array.from(t)}}else{const e=a.get(t.constructor);if(void 0===e)throw new TypeError(`Unsupported type for tensor data: ${t.constructor}.`);i=e,n=t}if(void 0===h)h=[n.length];else if(!Array.isArray(h))throw new TypeError("A tensor's dims must be a number array");const d=(t=>{let e=1;for(let r=0;r<t.length;r++){const i=t[r];if("number"!=typeof i||!Number.isSafeInteger(i))throw new TypeError(`dims[${r}] must be an integer, got: ${i}`);if(i<0)throw new RangeError(`dims[${r}] must be a non-negative integer, got: ${i}`);e*=i}return e})(h);if(d!==n.length)throw new Error(`Tensor's size(${d}) does not match data length(${n.length}).`);this.dims=h,this.type=i,this.data=n,this.size=d}static bufferToTensor(e,r){if(void 0===e)throw new Error("Image buffer must be defined");if(void 0===r.height||void 0===r.width)throw new Error("Image height and width must be defined");if("NHWC"===r.tensorLayout)throw new Error("NHWC Tensor layout is not supported yet");const{height:i,width:n}=r,o=r.norm??{mean:255,bias:0};let a,s;a="number"==typeof o.mean?[o.mean,o.mean,o.mean,o.mean]:[o.mean[0],o.mean[1],o.mean[2],o.mean[3]??255],s="number"==typeof o.bias?[o.bias,o.bias,o.bias,o.bias]:[o.bias[0],o.bias[1],o.bias[2],o.bias[3]??0];const h=void 0!==r.bitmapFormat?r.bitmapFormat:"RGBA",d=void 0!==r.tensorFormat&&void 0!==r.tensorFormat?r.tensorFormat:"RGB",f=i*n,m="RGBA"===d?new Float32Array(4*f):new Float32Array(3*f);let g=4,c=0,l=1,w=2,u=3,p=0,y=f,b=2*f,v=-1;"RGB"===h&&(g=3,c=0,l=1,w=2,u=-1),"RGBA"===d?v=3*f:"RBG"===d?(p=0,b=f,y=2*f):"BGR"===d&&(b=0,y=f,p=2*f);for(let t=0;t<f;t++,c+=g,w+=g,l+=g,u+=g)m[p++]=(e[c]+s[0])/a[0],m[y++]=(e[l]+s[1])/a[1],m[b++]=(e[w]+s[2])/a[2],-1!==v&&-1!==u&&(m[v++]=(e[u]+s[3])/a[3]);return new t("float32",m,"RGBA"===d?[1,4,i,n]:[1,3,i,n])}static async fromImage(e,r){const i="undefined"!=typeof HTMLImageElement&&e instanceof HTMLImageElement,n="undefined"!=typeof ImageData&&e instanceof ImageData,o="undefined"!=typeof ImageBitmap&&e instanceof ImageBitmap,a="string"==typeof e;let s,h=r??{};if(i){const t=document.createElement("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");if(null==i)throw new Error("Can not access image data");{let t=e.height,n=e.width;if(void 0!==r&&void 0!==r.resizedHeight&&void 0!==r.resizedWidth&&(t=r.resizedHeight,n=r.resizedWidth),void 0!==r){if(h=r,void 0!==r.tensorFormat)throw new Error("Image input config format must be RGBA for HTMLImageElement");if(h.tensorFormat="RGBA",void 0!==r.height&&r.height!==t)throw new Error("Image input config height doesn't match HTMLImageElement height");if(h.height=t,void 0!==r.width&&r.width!==n)throw new Error("Image input config width doesn't match HTMLImageElement width");h.width=n}else h.tensorFormat="RGBA",h.height=t,h.width=n;i.drawImage(e,0,0),s=i.getImageData(0,0,n,t).data}}else{if(!n){if(o){if(void 0===r)throw new Error("Please provide image config with format for Imagebitmap");if(void 0!==r.bitmapFormat)throw new Error("Image input config format must be defined for ImageBitmap");const i=document.createElement("canvas").getContext("2d");if(null!=i){const n=e.height,o=e.width;if(i.drawImage(e,0,0,o,n),s=i.getImageData(0,0,o,n).data,void 0!==r){if(void 0!==r.height&&r.height!==n)throw new Error("Image input config height doesn't match ImageBitmap height");if(h.height=n,void 0!==r.width&&r.width!==o)throw new Error("Image input config width doesn't match ImageBitmap width");h.width=o}else h.height=n,h.width=o;return t.bufferToTensor(s,h)}throw new Error("Can not access image data")}if(a)return new Promise(((i,n)=>{const o=document.createElement("canvas"),a=o.getContext("2d");if(!e||!a)return n();const s=new Image;s.crossOrigin="Anonymous",s.src=e,s.onload=()=>{o.width=s.width,o.height=s.height,a.drawImage(s,0,0,o.width,o.height);const e=a.getImageData(0,0,o.width,o.height);if(void 0!==r){if(void 0!==r.height&&r.height!==o.height)throw new Error("Image input config height doesn't match height");if(h.height=o.height,void 0!==r.width&&r.width!==o.width)throw new Error("Image input config width doesn't match width");h.width=o.width}else h.height=o.height,h.width=o.width;i(t.bufferToTensor(e.data,h))}}));throw new Error("Input data provided is not supported - aborted tensor creation")}{const t="RGBA";let i,n;if(void 0!==r&&void 0!==r.resizedWidth&&void 0!==r.resizedHeight?(i=r.resizedHeight,n=r.resizedWidth):(i=e.height,n=e.width),void 0!==r){if(h=r,void 0!==r.bitmapFormat&&r.bitmapFormat!==t)throw new Error("Image input config format must be RGBA for ImageData");h.bitmapFormat="RGBA"}else h.bitmapFormat="RGBA";if(h.height=i,h.width=n,void 0!==r){const t=document.createElement("canvas");t.width=n,t.height=i;const r=t.getContext("2d");if(null==r)throw new Error("Can not access image data");r.putImageData(e,0,0),s=r.getImageData(0,0,n,i).data}else s=e.data}}if(void 0!==s)return t.bufferToTensor(s,h);throw new Error("Input data provided is not supported - aborted tensor creation")}toDataURL(t){const e=document.createElement("canvas");e.width=this.dims[3],e.height=this.dims[2];const r=e.getContext("2d");if(null!=r){let i,n;void 0!==t?.tensorLayout&&"NHWC"===t.tensorLayout?(i=this.dims[2],n=this.dims[3]):(i=this.dims[3],n=this.dims[2]);const o=void 0!==t?.format?t.format:"RGB",a=t?.norm;let s,h;void 0===a||void 0===a.mean?s=[255,255,255,255]:"number"==typeof a.mean?s=[a.mean,a.mean,a.mean,a.mean]:(s=[a.mean[0],a.mean[1],a.mean[2],0],void 0!==a.mean[3]&&(s[3]=a.mean[3])),void 0===a||void 0===a.bias?h=[0,0,0,0]:"number"==typeof a.bias?h=[a.bias,a.bias,a.bias,a.bias]:(h=[a.bias[0],a.bias[1],a.bias[2],0],void 0!==a.bias[3]&&(h[3]=a.bias[3]));const d=n*i;let f=0,m=d,g=2*d,c=-1;"RGBA"===o?(f=0,m=d,g=2*d,c=3*d):"RGB"===o?(f=0,m=d,g=2*d):"RBG"===o&&(f=0,g=d,m=2*d);for(let t=0;t<n;t++)for(let e=0;e<i;e++){const i=(this.data[f++]-h[0])*s[0],n=(this.data[m++]-h[1])*s[1],o=(this.data[g++]-h[2])*s[2],a=-1===c?255:(this.data[c++]-h[3])*s[3];r.fillStyle="rgba("+i+","+n+","+o+","+a+")",r.fillRect(e,t,1,1)}return e.toDataURL()}throw new Error("Can not access image data")}toImageData(t){const e=document.createElement("canvas").getContext("2d");let r;if(null==e)throw new Error("Can not access image data");{let i,n,o;void 0!==t?.tensorLayout&&"NHWC"===t.tensorLayout?(i=this.dims[2],n=this.dims[1],o=this.dims[3]):(i=this.dims[3],n=this.dims[2],o=this.dims[1]);const a=void 0!==t&&void 0!==t.format?t.format:"RGB",s=t?.norm;let h,d;void 0===s||void 0===s.mean?h=[255,255,255,255]:"number"==typeof s.mean?h=[s.mean,s.mean,s.mean,s.mean]:(h=[s.mean[0],s.mean[1],s.mean[2],255],void 0!==s.mean[3]&&(h[3]=s.mean[3])),void 0===s||void 0===s.bias?d=[0,0,0,0]:"number"==typeof s.bias?d=[s.bias,s.bias,s.bias,s.bias]:(d=[s.bias[0],s.bias[1],s.bias[2],0],void 0!==s.bias[3]&&(d[3]=s.bias[3]));const f=n*i;if(void 0!==t){if(void 0!==t.height&&t.height!==n)throw new Error("Image output config height doesn't match tensor height");if(void 0!==t.width&&t.width!==i)throw new Error("Image output config width doesn't match tensor width");if(void 0!==t.format&&4===o&&"RGBA"!==t.format||3===o&&"RGB"!==t.format&&"BGR"!==t.format)throw new Error("Tensor format doesn't match input tensor dims")}const m=4;let g=0,c=1,l=2,w=3,u=0,p=f,y=2*f,b=-1;"RGBA"===a?(u=0,p=f,y=2*f,b=3*f):"RGB"===a?(u=0,p=f,y=2*f):"RBG"===a&&(u=0,y=f,p=2*f),r=e.createImageData(i,n);for(let t=0;t<n*i;g+=m,c+=m,l+=m,w+=m,t++)r.data[g]=(this.data[u++]-d[0])*h[0],r.data[c]=(this.data[p++]-d[1])*h[1],r.data[l]=(this.data[y++]-d[2])*h[2],r.data[w]=-1===b?255:(this.data[b++]-d[3])*h[3]}return r}dims;type;data;size;reshape(e){return new t(this.type,this.data,e)}};exports.InferenceSession=n,exports.Tensor=h,exports.env=i,exports.registerBackend=(r,i,n)=>{if(!i||"function"!=typeof i.init||"function"!=typeof i.createSessionHandler)throw new TypeError("not a valid backend");{const o=t[r];if(void 0===o)t[r]={backend:i,priority:n};else{if(o.priority>n)return;if(o.priority===n&&o.backend!==i)throw new Error(`cannot register backend "${r}" using priority ${n}`)}if(n>=0){const i=e.indexOf(r);-1!==i&&e.splice(i,1);for(let i=0;i<e.length;i++)if(t[e[i]].priority<=n)return void e.splice(i,0,r);e.push(r)}}},exports.resolveBackend=r;
//# sourceMappingURL=index.cjs.js.map