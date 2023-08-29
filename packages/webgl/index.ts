export * from '@onnx-infer/core';

import { registerBackend } from '@onnx-infer/core';

import { WebglBackend } from './lib';

const backend = new WebglBackend();
  
registerBackend('webgl', backend, 10);