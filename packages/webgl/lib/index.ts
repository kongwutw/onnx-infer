/* eslint-disable import/no-internal-modules */
import {Backend, InferenceSession, SessionHandler} from '@onnx-infer/core';

import {Session} from './session';
import {OnnxjsSessionHandler} from './session/handler';

export class WebglBackend implements Backend {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async init(): Promise<void> {}

  async createSessionHandler(pathOrBuffer: string|Uint8Array, options?: InferenceSession.SessionOptions): Promise<SessionHandler> {
    const session = new Session(options as unknown as Session.Config);

    if (typeof pathOrBuffer === 'string') {
      await session.loadModel(pathOrBuffer);
    } else {
      await session.loadModel(pathOrBuffer);
    }

    return new OnnxjsSessionHandler(session);
  }
}
