
import {Channel, COLUMN, ROW, X, Y} from '../../channel';
import {MAIN} from '../../data';
import {hasDiscreteDomain} from '../../scale';
import {extend, isArray, keys, StringSet} from '../../util';
import {VgData, VgFormulaTransform, VgSignal, VgTransform} from '../../vega.schema';

import {FacetModel} from '../facet';
import {LayerModel} from '../layer';
import {Model, ModelWithField} from '../model';
import {UnitModel} from '../unit';


// FIXME: for nesting x and y, we need to declare x,y layout separately before joining later
// For now, let's always assume shared scale
export interface LayoutComponent {
  width: SizeComponent;
  height: SizeComponent;
}

export interface Formula {
    as: string;
    expr: string;
}

export interface SizeComponent {
  /** Where to pull data from */
  source: string;

  /** Field that we need to calculate distinct */
  distinct: StringSet;

  /** Array of formulas */
  formula: Formula[];
}

// FIXME: for nesting x and y, we need to declare x,y layout separately before joining later
// For now, let's always assume shared scale
export function parseUnitLayout(model: UnitModel): LayoutComponent {
  return {
    width: parseUnitSizeLayout(model, X),
    height: parseUnitSizeLayout(model, Y)
  };
}

function parseUnitSizeLayout(model: UnitModel, channel: Channel): SizeComponent {
  const distinct = getDistinct(model, channel);

  return {
    source: keys(distinct).length > 0 ? model.getDataName(MAIN) : null,
    distinct,
    formula: [{
      as: model.channelSizeName(channel),
      expr: oldUnitSizeExpr(model, channel)
    }]
  };
}

// TODO: rewrite this such that we merge redundant signals
export function assembleLayoutLayerSignals(model: LayerModel): VgSignal[] {
  return [
    {name: model.getName('width'), update: layerSizeExpr(model, 'width')},
    {name: model.getName('height'), update: layerSizeExpr(model, 'height')}
  ];
}

export function layerSizeExpr(model: LayerModel, sizeType: 'width' | 'height'): string {
  const childrenSizeSignals = model.children.map(child => child.getName(sizeType)).join(', ');
  return `max(${childrenSizeSignals})`;
}

export function assembleLayoutUnitSignals(model: UnitModel): VgSignal[] {
  return [
    {name: model.getName('width'), update: unitSizeExpr(model, 'width')},
    {name: model.getName('height'), update: unitSizeExpr(model, 'height')}
  ];
}

export function unitSizeExpr(model: UnitModel, sizeType: 'width' | 'height'): string {
  const channel = sizeType==='width' ? 'x' : 'y';
  const scale = model.scale(channel);
  if (scale) {
    if (hasDiscreteDomain(scale.type) && scale.rangeStep) {
      const scaleName = model.scaleName(channel);

      const cardinality = `domain('${scaleName}').length`;
      const paddingOuter = scale.paddingOuter !== undefined ? scale.paddingOuter : scale.padding;
      const paddingInner = scale.type === 'band' ?
        // only band has real paddingInner
        (scale.paddingInner !== undefined ? scale.paddingInner : scale.padding) :
        // For point, as calculated in https://github.com/vega/vega-scale/blob/master/src/band.js#L128,
        // it's equivalent to have paddingInner = 1 since there is only n-1 steps between n points.
        1;

      return `bandspace(${cardinality}, ${paddingInner}, ${paddingOuter}) * ${scale.rangeStep}`;
    }
  }
  return `${model[sizeType]}`;
}



export function oldUnitSizeExpr(model: UnitModel, channel: Channel): string {
  const scale = model.scale(channel);
  if (scale) {

    if (hasDiscreteDomain(scale.type) && scale.rangeStep) {
      // If the spec has top level size or specified rangeStep = fit, it will be undefined here.

      const cardinality = cardinalityExpr(model, channel);
      const paddingOuter = scale.paddingOuter !== undefined ? scale.paddingOuter : scale.padding;
      const paddingInner = scale.type === 'band' ?
        // only band has real paddingInner
        (scale.paddingInner !== undefined ? scale.paddingInner : scale.padding) :
        // For point, as calculated in https://github.com/vega/vega-scale/blob/master/src/band.js#L128,
        // it's equivalent to have paddingInner = 1 since there is only n-1 steps between n points.
        1;

      const space = cardinality +
        (paddingInner ? ` - ${paddingInner}` : '') +
        (paddingOuter ? ` + 2*${paddingOuter}` : '');

      // This formula is equivalent to
      // space = count - inner + outer * 2
      // range = rangeStep * (space > 0 ? space : 0)
      // in https://github.com/vega/vega-encode/blob/master/src/Scale.js#L112
      return `max(${space}, 0) * ${scale.rangeStep}`;
    }
  }
  return (channel === X ? model.width : model.height) + '';
}

export function parseFacetLayout(model: FacetModel): LayoutComponent {
  return {
    width: parseFacetSizeLayout(model, COLUMN),
    height: parseFacetSizeLayout(model, ROW)
  };
}

function parseFacetSizeLayout(model: FacetModel, channel: Channel): SizeComponent {
  const childLayoutComponent = model.child.component.layout;
  const sizeType = channel === ROW ? 'height' : 'width';
  const childSizeComponent: SizeComponent = childLayoutComponent[sizeType];

  if (true) { // assume shared scale
    // For shared scale, we can simply merge the layout into one data source

    const distinct = extend(getDistinct(model, channel), childSizeComponent.distinct);
    const formula = childSizeComponent.formula.concat([{
      as: model.channelSizeName(channel),
      expr: facetSizeFormula(model, channel, model.child.channelSizeName(channel))
    }]);

    delete childLayoutComponent[sizeType];
    return {
      source: model.getDataName(MAIN),
      distinct: distinct,
      formula: formula
    };
  }
  // FIXME implement independent scale as well
  // TODO: - also consider when children have different data source
}

// FIXME remove
function facetSizeFormula(model: FacetModel, channel: Channel, innerSize: string) {
  if (model.channelHasField(channel)) {
    return '(datum["' + innerSize + '"] + ' + 5 + ')' + ' * ' + cardinalityExpr(model, channel);
  } else {
    return 'datum["' + innerSize + '"] + ' + 5; // need to add outer padding for facet
  }
}

export function parseLayerLayout(model: LayerModel): LayoutComponent {
  return {
    width: parseLayerSizeLayout(model, X),
    height: parseLayerSizeLayout(model, Y)
  };
}

function parseLayerSizeLayout(model: LayerModel, channel: Channel): SizeComponent {
  if (true) {
    // For shared scale, we can simply merge the layout into one data source
    // TODO: don't just take the layout from the first child

    const childLayoutComponent = model.children[0].component.layout;
    const sizeType = channel === Y ? 'height' : 'width';
    const childSizeComponent: SizeComponent = childLayoutComponent[sizeType];

    const distinct = childSizeComponent.distinct;
    const formula: Formula[] = [{
      as: model.channelSizeName(channel),
      expr: childSizeComponent.formula[0].expr
    }];

    model.children.forEach((child) => {
      delete child.component.layout[sizeType];
    });

    return {
      source: model.children[0].getDataName(MAIN),
      distinct: distinct,
      formula: formula
    };
  }
}

function getDistinct(model: ModelWithField, channel: Channel): StringSet {
  if (model.channelHasField(channel) && model.hasDiscreteDomain(channel)) {
    if (model instanceof UnitModel) {
      const scale = model.scale(channel);
      if (isArray<any>(scale.domain)) {
        return {};
      }
    }

    if (model.hasDiscreteDomain(channel)) {
      // if explicit domain is declared, use array length
      const distinctField = model.field(channel);
      const distinct: StringSet = {};
      distinct[distinctField] = true;
      return distinct;
    }
  }
  return {};
}

export function cardinalityExpr(model: ModelWithField, channel: Channel):string {
  if (model instanceof UnitModel) {
    const scale = model.scale(channel);
    if (scale.domain instanceof Array) {
      return scale.domain.length + '';
    }
  }

  return model.field(channel, {datum: true, prefix: 'distinct'});
}
