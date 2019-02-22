import {isString} from 'vega-util';
import {BinParams, binToString, isBinning} from '../../bin';
import {Channel} from '../../channel';
import {Config} from '../../config';
import {binRequiresRange, isTypedFieldDef, normalizeBin, TypedFieldDef, vgField} from '../../fielddef';
import {BinTransform} from '../../transform';
import {Dict, duplicate, flatten, hash, keys, vals} from '../../util';
import {VgBinTransform, VgTransform} from '../../vega.schema';
import {binFormatExpression} from '../common';
import {isUnitModel, Model, ModelWithField} from '../model';
import {DataFlowNode} from './dataflow';

function rangeFormula(model: ModelWithField, fieldDef: TypedFieldDef<string>, channel: Channel, config: Config) {
  if (binRequiresRange(fieldDef, channel)) {
    // read format from axis or legend, if there is no format then use config.numberFormat

    const guide = isUnitModel(model) ? model.axis(channel) || model.legend(channel) || {} : {};

    const startField = vgField(fieldDef, {expr: 'datum'});
    const endField = vgField(fieldDef, {expr: 'datum', binSuffix: 'end'});

    return {
      formulaAs: vgField(fieldDef, {binSuffix: 'range', forAs: true}),
      formula: binFormatExpression(startField, endField, guide.format, config)
    };
  }
  return {};
}

function binKey(bin: BinParams, field: string) {
  return `${binToString(bin)}_${field}`;
}

function getSignalsFromModel(model: Model, key: string) {
  return {
    signal: model.getName(`${key}_bins`),
    extentSignal: model.getName(`${key}_extent`)
  };
}

function isBinTransform(t: TypedFieldDef<string> | BinTransform): t is BinTransform {
  return 'as' in t;
}

function createBinComponent(t: TypedFieldDef<string> | BinTransform, bin: boolean | BinParams, model: Model) {
  let as: [string, string];

  if (isBinTransform(t)) {
    as = isString(t.as) ? [t.as, `${t.as}_end`] : [t.as[0], t.as[1]];
  } else {
    as = [vgField(t, {forAs: true}), vgField(t, {binSuffix: 'end', forAs: true})];
  }

  const normalizedBin = normalizeBin(bin, undefined) || {};
  const key = binKey(normalizedBin, t.field);
  const {signal, extentSignal} = getSignalsFromModel(model, key);

  const binComponent: BinComponent = {
    bin: normalizedBin,
    field: t.field,
    as: as,
    ...(signal ? {signal} : {}),
    ...(extentSignal ? {extentSignal} : {})
  };

  return {key, binComponent};
}

export interface BinComponent {
  bin: BinParams;
  field: string;
  extentSignal?: string;
  signal?: string;
  as: string[];

  // Range Formula

  formula?: string;
  formulaAs?: string;
}

export class BinNode extends DataFlowNode {
  public clone() {
    return new BinNode(null, duplicate(this.bins));
  }

  constructor(parent: DataFlowNode, private bins: Dict<BinComponent>) {
    super(parent);
  }

  public static makeFromEncoding(parent: DataFlowNode, model: ModelWithField) {
    const bins = model.reduceFieldDef((binComponentIndex: Dict<BinComponent>, fieldDef, channel) => {
      if (isTypedFieldDef(fieldDef) && isBinning(fieldDef.bin)) {
        const {key, binComponent} = createBinComponent(fieldDef, fieldDef.bin, model);
        binComponentIndex[key] = {
          ...binComponent,
          ...binComponentIndex[key],
          ...rangeFormula(model, fieldDef, channel, model.config)
        };
      }
      return binComponentIndex;
    }, {});

    if (keys(bins).length === 0) {
      return null;
    }

    return new BinNode(parent, bins);
  }

  /**
   * Creates a bin node from BinTransform.
   * The optional parameter should provide
   */
  public static makeFromTransform(parent: DataFlowNode, t: BinTransform, model: Model) {
    const {key, binComponent} = createBinComponent(t, t.bin, model);
    return new BinNode(parent, {
      [key]: binComponent
    });
  }

  public merge(other: BinNode) {
    this.bins = {...this.bins, ...other.bins};
    other.remove();
  }

  public producedFields() {
    return new Set(flatten(vals(this.bins).map(c => c.as)));
  }

  public dependentFields() {
    return new Set(vals(this.bins).map(c => c.field));
  }

  public hash() {
    return `Bin ${hash(this.bins)}`;
  }

  public assemble(): VgTransform[] {
    return flatten(
      vals(this.bins).map(bin => {
        const transform: VgTransform[] = [];

        const binTrans: VgBinTransform = {
          type: 'bin',
          field: bin.field,
          as: bin.as,
          signal: bin.signal,
          ...bin.bin
        };

        if (!bin.bin.extent && bin.extentSignal) {
          transform.push({
            type: 'extent',
            field: bin.field,
            signal: bin.extentSignal
          });
          binTrans.extent = {signal: bin.extentSignal};
        }

        transform.push(binTrans);

        if (bin.formula) {
          transform.push({
            type: 'formula',
            expr: bin.formula,
            as: bin.formulaAs
          });
        }

        return transform;
      })
    );
  }
}
