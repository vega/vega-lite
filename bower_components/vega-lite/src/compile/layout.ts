import {VgData} from '../vega.schema';

import {Model} from './Model';
import {Channel, X, Y, ROW, COLUMN} from '../channel';
import {LAYOUT} from '../data';
import {TEXT as TEXT_MARK} from '../mark';
import {rawDomain} from './time';

export function compileLayoutData(model: Model): VgData {
  /* Aggregation summary object for fields with ordinal scales
   * that wee need to calculate cardinality for. */
  const distinctSummary = [X, Y, ROW, COLUMN].reduce(function(summary, channel: Channel) {
    if (model.has(channel) && model.isOrdinalScale(channel)) {
      const scale = model.scale(channel);

      if (!(scale.domain instanceof Array)) {
        // if explicit domain is declared, use array length
        summary.push({
          field: model.field(channel),
          ops: ['distinct']
        });
      }
    }
    return summary;
  }, []);


  // TODO: handle "fit" mode
  const cellWidthFormula = scaleWidthFormula(model, X, model.cellWidth());
  const cellHeightFormula = scaleWidthFormula(model, Y, model.cellHeight());
  const isFacet =  model.has(COLUMN) || model.has(ROW);

  const formulas = [{
    type: 'formula',
    field: 'cellWidth',
    expr: cellWidthFormula
  },{
    type: 'formula',
    field: 'cellHeight',
    expr: cellHeightFormula
  },{
    type: 'formula',
    field: 'width',
    expr: isFacet ?
          facetScaleWidthFormula(model, COLUMN, 'datum.cellWidth') :
          cellWidthFormula
  },{
    type: 'formula',
    field: 'height',
    expr: isFacet ?
          facetScaleWidthFormula(model, ROW, 'datum.cellHeight') :
          cellHeightFormula
  }];

  return distinctSummary.length > 0 ? {
    name: LAYOUT,
    source: model.dataTable(),
    transform: [].concat(
      [{
        type: 'aggregate',
        summarize: distinctSummary
      }],
      formulas)
  } : {
    name: LAYOUT,
    values: [{}],
    transform: formulas
  };
}

function cardinalityFormula(model: Model, channel: Channel) {
  const scale = model.scale(channel);
  if (scale.domain instanceof Array) {
    return scale.domain.length;
  }

  const timeUnit = model.fieldDef(channel).timeUnit;
  const timeUnitDomain = timeUnit ? rawDomain(timeUnit, channel) : null;

  return timeUnitDomain !== null ? timeUnitDomain.length :
        model.field(channel, {datum: true, prefn: 'distinct_'});
}

function scaleWidthFormula(model: Model, channel: Channel, nonOrdinalSize: number): string {
  if (model.has(channel)) {
    if (model.isOrdinalScale(channel)) {
      const scale = model.scale(channel);
      return '(' + cardinalityFormula(model, channel) +
                ' + ' + scale.padding +
             ') * ' + scale.bandSize;
    } else {
      return nonOrdinalSize + '';
    }
  } else {
    if (model.mark() === TEXT_MARK && channel === X) {
      // for text table without x/y scale we need wider bandSize
      return model.config().scale.textBandWidth + '';
    }
    return model.config().scale.bandSize + '';
  }
}

function facetScaleWidthFormula(model: Model, channel: Channel, innerWidth: string) {
  const scale = model.scale(channel);
  if (model.has(channel)) {
    const cardinality = scale.domain instanceof Array ? scale.domain.length :
                             model.field(channel, {datum: true, prefn: 'distinct_'});

    return '(' + innerWidth + ' + ' + scale.padding + ')' + ' * ' + cardinality;
  } else {
    return innerWidth + ' + ' + model.config().facet.scale.padding; // need to add outer padding for facet
  }
}
