import { Tensor, TensorToImageDataOptions, TypedTensor } from './index';
interface Properties {
    /**
     * Get the number of elements in the tensor.
     */
    readonly size: number;
}
export interface TypedShapeUtils<T extends Tensor.Type> {
    /**
     * Create a new tensor with the same data buffer and specified dims.
     *
     * @param dims - New dimensions. Size should match the old one.
     */
    reshape(dims: readonly number[]): TypedTensor<T>;
}
export interface TypedTensorUtils<T extends Tensor.Type> extends Properties, TypedShapeUtils<T> {
    /**
     * creates an DataURL instance from tensor
     *
     * @param options - Interface describing tensor instance - Defaults: RGB, 3 channels, 0-255, NHWC
     * 0-255, NHWC
     * @returns An DataURL instance which can be used to draw on canvas
     */
    toDataURL(options?: TensorToImageDataOptions): string;
    /**
     * creates an ImageData instance from tensor
     *
     * @param tensorFormat - Interface describing tensor instance - Defaults: RGB, 3 channels, 0-255, NHWC
     * 0-255, NHWC
     * @returns An ImageData instance which can be used to draw on canvas
     */
    toImageData(options?: TensorToImageDataOptions): ImageData;
}
export {};
