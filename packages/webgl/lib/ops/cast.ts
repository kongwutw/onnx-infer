import {Graph} from '../session/graph';
import {OperatorImplementation, OperatorInitialization} from '../ops/operators';
import {Tensor} from '../tensor';
import {ProtoUtil} from '../util';
import {WebGLInferenceHandler} from '../backend/inference-handler';

export const cast: OperatorImplementation<Tensor.DataType> =
    (handler: WebGLInferenceHandler, inputs: Tensor[], to: Tensor.DataType): Tensor[] => {
      validateInputs(inputs);
      return [handler.cast(inputs[0], to)];
    };

export const parseCastAttributes: OperatorInitialization<Tensor.DataType> = (node: Graph.Node): Tensor.DataType =>
    ProtoUtil.tensorDataTypeFromProto(node.attributes.getInt('to'));

const validateInputs = (inputs: Tensor[]): void => {
  if (!inputs || inputs.length !== 1) {
    throw new Error('Cast requires 1 input.');
  }

  if (inputs[0].type === 'string') {
    throw new Error('Invalid input type.');
  }
};