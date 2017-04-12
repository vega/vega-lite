import {autoMaxBins, Bin, binToString} from '../../bin';
import {Channel} from '../../channel';
import {field, FieldDef} from '../../fielddef';
import {hasDiscreteDomain} from '../../scale';
import {Dict, extend, flatten, hash, isBoolean, StringSet, vals, varName} from '../../util';
import {VgBinTransform, VgTransform} from '../../vega.schema';
import {Model} from './../model';
import {DataFlowNode, DependentNode, NewFieldNode} from './dataflow';


function numberFormatExpr(expr: string, format: string) {
  return `format(${expr}, '${format}')`;
}

function rangeFormula(model: Model, fieldDef: FieldDef, channel: Channel) {
    const discreteDomain = hasDiscreteDomain(model.scale(channel).type);

    if (discreteDomain) {
      // read format from axis or legend, if there is no format then use config.numberFormat
      const format = (model.axis(channel) || model.legend(channel) || {}).format ||
        model.config.numberFormat;

      const startField = field(fieldDef, {datum: true, binSuffix: 'start'});
      const endField = field(fieldDef, {datum: true, binSuffix: 'end'});

      return {
        formulaAs: field(fieldDef, {binSuffix: 'range'}),
        formula: `${numberFormatExpr(startField, format)} + ' - ' + ${numberFormatExpr(endField, format)}`
      };
    }
    return {};
}

interface BinComponent {
  bin: Bin;
  field: string;
  extentSignal: string;
  signal: string;
  as: string[];

  // Range Formula

  formula?: string;
  formulaAs?: string;
}

export class BinNode extends DataFlowNode implements NewFieldNode, DependentNode {
  private bins: Dict<BinComponent>;

  constructor(model: Model) {
    super();

    this.bins = model.reduceFieldDef((binComponent: Dict<BinComponent>, fieldDef: FieldDef, channel: Channel) => {
      const fieldDefBin = model.fieldDef(channel).bin;
      if (fieldDefBin) {
        const bin: Bin = isBoolean(fieldDefBin) ? {} : fieldDefBin;
        const key = `${binToString(fieldDef.bin)}_${fieldDef.field}`;

        if (!(key in binComponent)) {
          binComponent[key] = {
            bin: bin,
            field: fieldDef.field,
            as: [field(fieldDef, {binSuffix: 'start'}), field(fieldDef, {binSuffix: 'end'})],
            signal: varName(model.getName(`${key}_bins`)),
            extentSignal: model.getName(key + '_extent')
          };
        }

        binComponent[key] = {
          ...binComponent[key],
          ...rangeFormula(model, fieldDef, channel)
        };
      }
      return binComponent;
    }, {});
  }

  public size() {
    return Object.keys(this.bins).length;
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
