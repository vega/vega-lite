import {autoMaxBins, Bin, binToString} from '../../bin';
import {Channel} from '../../channel';
import {Config} from '../../config';
import {field, FieldDef} from '../../fielddef';
import {hasDiscreteDomain} from '../../scale';
import {Dict, duplicate, extend, flatten, hash, isBoolean, StringSet, vals} from '../../util';
import {VgBinTransform, VgTransform} from '../../vega.schema';
import {numberFormat} from '../common';
import {ModelWithField} from '../model';
import {UnitModel} from '../unit';
import {DataFlowNode} from './dataflow';


function numberFormatExpr(expr: string, format: string) {
  return `format(${expr}, '${format}')`;
}

function rangeFormula(model: ModelWithField, fieldDef: FieldDef<string>, channel: Channel, config: Config) {
    const discreteDomain = model.hasDiscreteDomain(channel);

    if (discreteDomain) {
      // read format from axis or legend, if there is no format then use config.numberFormat

      const guide = (model instanceof UnitModel) ? (model.axis(channel) || model.legend(channel) || {}) : {};
      const format = numberFormat(fieldDef, guide.format, config, channel);

      const startField = field(fieldDef, {expr: 'datum', binSuffix: 'start'});
      const endField = field(fieldDef, {expr: 'datum', binSuffix: 'end'});

      return {
        formulaAs: field(fieldDef, {binSuffix: 'range'}),
        formula: `${numberFormatExpr(startField, format)} + ' - ' + ${numberFormatExpr(endField, format)}`
      };
    }
    return {};
}

export interface BinComponent {
  bin: Bin;
  field: string;
  extentSignal: string;
  signal: string;
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

  public static make(model: ModelWithField) {
    const bins = model.reduceFieldDef((binComponent: Dict<BinComponent>, fieldDef, channel) => {
      const fieldDefBin = model.fieldDef(channel).bin;
      if (fieldDefBin) {
        const bin: Bin = isBoolean(fieldDefBin) ? {} : fieldDefBin;
        const key = `${binToString(fieldDef.bin)}_${fieldDef.field}`;

        if (!(key in binComponent)) {
          binComponent[key] = {
            bin: bin,
            field: fieldDef.field,
            as: [field(fieldDef, {binSuffix: 'start'}), field(fieldDef, {binSuffix: 'end'})],
            signal: model.getName(`${key}_bins`),
            extentSignal: model.getName(key + '_extent')
          };
        }

        binComponent[key] = {
          ...binComponent[key],
          ...rangeFormula(model, fieldDef, channel, model.config)
        };
      }
      return binComponent;
    }, {});

    if (Object.keys(bins).length === 0) {
      return null;
    }

    return new BinNode(bins);
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

      if (!bin.bin.extent) {
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
