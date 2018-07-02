import {isFieldDef} from '../../fielddef';
import {ImputeSequence, ImputeTransform, isImputeSequence} from '../../transform';
import {duplicate} from '../../util';
import {VgFormulaTransform, VgImputeTransform, VgSignalRef, VgWindowTransform} from '../../vega.schema';
import {pathGroupingFields} from '../mark/mark';
import {UnitModel} from '../unit';
import {DataFlowNode} from './dataflow';

export class ImputeNode extends DataFlowNode {
  public clone() {
    return new ImputeNode(this.parent, duplicate(this.transform));
  }

  public producedFields() {
    // typescript detects true as boolean type
    return {[this.transform.impute]: true as true};
  }

  constructor(parent: DataFlowNode, private transform: ImputeTransform) {
    super(parent);

  }

  private processSequence(keyvals: ImputeSequence): VgSignalRef {
    const {start = 0, stop, step} = keyvals;
    const result = [
      start,
      stop,
      ...(step ? [step] : [])
    ].join(',');

    return {signal: `sequence(${result})`};
  }

  public static makeFromTransform(parent: DataFlowNode, imputeTransform: ImputeTransform): ImputeNode {
    return new ImputeNode (parent, imputeTransform);
  }

  public static makeFromEncoding(parent: DataFlowNode, model: UnitModel) {
    const encoding = model.encoding;
    const xDef = encoding.x;
    const yDef = encoding.y;

    if (isFieldDef(xDef) && isFieldDef(yDef)) {

      const imputedChannel = xDef.impute ? xDef : (yDef.impute ? yDef: undefined);
      if (imputedChannel === undefined) {
        return undefined;
      }
      const keyChannel = xDef.impute ? yDef : (yDef.impute ? xDef: undefined);
      const {method, value, frame} = imputedChannel.impute;
      const groupbyFields = pathGroupingFields(model.mark, encoding);

      return new ImputeNode(parent, {
        impute: imputedChannel.field,
        key: keyChannel.field,
        ...(method ? {method}:{}),
        ...(value ? {value} : {}),
        ...(frame ? {frame} : {}),
        ...(groupbyFields.length ? {groupby: groupbyFields} : {} )
      });
    }
    return null;
  }

  public assemble(): [VgImputeTransform, VgWindowTransform | VgFormulaTransform, VgFormulaTransform] {
    const {impute, key, keyvals, method, groupby, value, frame=[null,null]} = this.transform;

      const initialImpute: VgImputeTransform = {
        type: 'impute',
        field: impute,
        key,
        ...(keyvals ? {keyvals: isImputeSequence(keyvals) ? this.processSequence(keyvals) : keyvals}: {}),
        method: 'value',
        ...(groupby ? {groupby}: {}),
        value: null
      };

    let deriveNewField: VgWindowTransform | VgFormulaTransform;
      if (method && method !== 'value') {
        deriveNewField = {
          type: 'window',
          as: ['derived_field'],
          ops: [method],
          fields: [impute],
          frame,
          ignorePeers: false,
          ...(groupby ? {groupby}: {})
        };
      } else {
        deriveNewField = {
          type: 'formula',
          expr: `${value}`,
          as: 'derived_field'
        };
      }
      const replaceOriginal: VgFormulaTransform = {
        type: 'formula',
        expr: `datum.${impute} === null ? datum.derived_field : datum.${impute}`,
        as: impute
      };

      return [initialImpute, deriveNewField, replaceOriginal];

  }
}
