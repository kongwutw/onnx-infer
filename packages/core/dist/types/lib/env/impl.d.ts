import { Env } from './index';
type LogLevelType = Env['logLevel'];
export declare class EnvImpl implements Env {
    constructor();
    set logLevel(value: LogLevelType);
    get logLevel(): LogLevelType;
    debug?: boolean;
    wasm: Env.WebAssemblyFlags;
    webgl: Env.WebGLFlags;
    webgpu: Env.WebGpuFlags;
    [name: string]: unknown;
    private logLevelInternal;
}
export {};
