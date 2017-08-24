import {BinParams, binToString} from '../../bin';
import {Channel} from '../../channel';
import {Config} from '../../config';
import {field, FieldDef, normalizeBin} from '../../fielddef';
import {BinTransform} from '../../transform';
import {Dict, duplicate, extend, flatten, keys, vals} from '../../util';
import {VgBinTransform, VgTransform} from '../../vega.schema';
import {binFormatExpression} from '../common';
import {isUnitModel, Model, ModelWithField} from '../model';
import {DataFlowNode} from './dataflow';

function rangeFormula(model: ModelWithField, fieldDef: FieldDef<string>, channel: Channel, config: Config) {
    const discreteDomain = model.hasDiscreteDomain(channel);

    if (discreteDomain) {
      // read format from axis or legend, if there is no format then use config.numberFormat

      const guide = isUnitModel(model) ? (model.axis(channel) || model.legend(channel) || {}) : {};

      const startField = field(fieldDef, {expr: 'datum',});
      const endField = field(fieldDef, {expr: 'datum', binSuffix: 'end'});

      return {
        formulaAs: field(fieldDef, {binSuffix: 'range'}),
        formula: binFormatExpression(startField, endField, guide.format, config)
      };
    }
    return {};
}

function binKey(bin: BinParams, field: string) {
  return `${binToString(bin)}_${field}`;
}

function isModelParams(p: {model: Model} | {signal?: string, extentSignal?: string}): p is {model: Model} {
  return !!p['model'];
}

function getSignalsFromParams(
  params: {model: Model} | {signal?: string, extentSignal?: string},
  key: string
) {
  if (isModelParams(params)) {
    const model = params.model;
    return {
      signal: model.getName(`${key}_bins`),
      extentSignal: model.getName(`${key}_extent`)
    };
  }
  return params;
}

function createBinComponent(
  t: FieldDef<string>|BinTransform,
  params: {model: Model} | {signal?: string, extentSignal?: string}
) {
  const bin = normalizeBin(t.bin, undefined) || {};
  const key = binKey(bin, t.field);
  const {signal, extentSignal} = getSignalsFromParams(params, key);

  const binComponent: BinComponent = {
    bin: bin,
    field: t.field,
    as: [field(t, {}), field(t, {binSuffix: 'end'})],
    ...signal ? {signal} : {},
    ...extentSignal ? {extentSignal} : {}
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
    return new BinNode(duplicate(this.bins));
  }

  constructor(private bins: Dict<BinComponent>) {
    super();
  }

  public static makeBinFromEncoding(model: ModelWithField) {
    const bins = model.reduceFieldDef((binComponentIndex: Dict<BinComponent>, fieldDef, channel) => {
      const fieldDefBin = fieldDef.bin;
      if (fieldDefBin) {
        const {key, binComponent} = createBinComponent(fieldDef, {model});
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

    return new BinNode(bins);
  }

  /**
   * Creates a bin node from BinTransform.
   * The optional parameter should provide
   */
  public static makeFromTransform(t: BinTransform, params: {model: Model} | {signal?: string, extentSignal?: string}) {
    const {key, binComponent} = createBinComponent(t, params);
    return new BinNode({
      [key]: binComponent
    });
  }

  public merge(other: BinNode) {
    this.bins = extend(other.bins);
    other.remove();
  }

  public producedFields() {
    const out = {};

    vals(this.bins).forEach(c => {
      c.as.forEach(f => out[f] = true);
    });

    return out;
  }

  public dependentFields() {
    const out = {};

    vals(this.bins).forEach(c => {
      out[c.field] = true;
    });

    return out;
  }

  public assemble(): VgTransform[] {
    return flatten(vals(this.bins).map(bin => {
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
    }));
  }
}
