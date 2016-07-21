
import {Channel, X, Y, ROW, COLUMN} from '../channel';
import {LAYOUT} from '../data';
import {ScaleType, BANDSIZE_FIT} from '../scale';
import {Formula} from '../transform';
import {extend, keys, StringSet} from '../util';
import {VgData} from '../vega.schema';

import {FacetModel} from './facet';
import {LayerModel} from './layer';
import {Model} from './model';
import {rawDomain} from '../timeunit';
import {UnitModel} from './unit';

// FIXME: for nesting x and y, we need to declare x,y layout separately before joining later
// For now, let's always assume shared scale
export interface LayoutComponent {
  width: SizeComponent;
  height: SizeComponent;
}

export interface SizeComponent {
  /** Field that we need to calculate distinct */
  distinct: StringSet;

  /** Array of formulas */
  formula: Formula[];
}

export function assembleLayout(model: Model, layoutData: VgData[]): VgData[] {
  const layoutComponent = model.component.layout;
  if (!layoutComponent.width && !layoutComponent.height) {
    return layoutData; // Do nothing
  }

  if (true) { // if both are shared scale, we can simply merge data source for width and for height
    const distinctFields = keys(extend(layoutComponent.width.distinct, layoutComponent.height.distinct));
    const formula = layoutComponent.width.formula.concat(layoutComponent.height.formula)
      .map(function(formula) {
        return extend({type: 'formula'}, formula);
      });

    return [
      distinctFields.length > 0 ? {
        name: model.dataName(LAYOUT),
        source: model.dataTable(),
        transform: [{
          type: 'aggregate',
          summarize: distinctFields.map(function(field) {
            return { field: field, ops: ['distinct'] };
          })
        }].concat(formula)
      } : {
        name: model.dataName(LAYOUT),
        values: [{}],
        transform: formula
      }
    ];
  }
  // FIXME: implement
  // otherwise, we need to join width and height (cross)
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
  return {
    distinct: getDistinct(model, channel),
    formula: [{
      field: model.channelSizeName(channel),
      expr: unitSizeExpr(model, channel)
    }]
  };
}

export function unitSizeExpr(model: UnitModel, channel: Channel): string {
  const scale = model.scale(channel);
  if (scale) {
    if (scale.type === ScaleType.ORDINAL && scale.bandSize !== BANDSIZE_FIT) {
      return '(' + cardinalityExpr(model, channel) +
        ' + ' + 1 +
        ') * ' + scale.bandSize;
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
  const childLayoutComponent = model.child().component.layout;
  const sizeType = channel === ROW ? 'height' : 'width';
  const childSizeComponent: SizeComponent = childLayoutComponent[sizeType];

  if (true) { // assume shared scale
    // For shared scale, we can simply merge the layout into one data source

    const distinct = extend(getDistinct(model, channel), childSizeComponent.distinct);
    const formula = childSizeComponent.formula.concat([{
      field: model.channelSizeName(channel),
      expr: facetSizeFormula(model, channel, model.child().channelSizeName(channel))
    }]);

    delete childLayoutComponent[sizeType];
    return {
      distinct: distinct,
      formula: formula
    };
  }
  // FIXME implement independent scale as well
  // TODO: - also consider when children have different data source
}

function facetSizeFormula(model: Model, channel: Channel, innerSize: string) {
  const scale = model.scale(channel);
  if (model.has(channel)) {
    return '(datum["' + innerSize + '"] + ' + scale.padding + ')' + ' * ' + cardinalityExpr(model, channel);
  } else {
    return 'datum["' + innerSize + '"] + ' + model.config().facet.scale.padding; // need to add outer padding for facet
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

    const childLayoutComponent = model.children()[0].component.layout;
    const sizeType = channel === Y ? 'height' : 'width';
    const childSizeComponent: SizeComponent = childLayoutComponent[sizeType];

    const distinct = childSizeComponent.distinct;
    const formula = [{
      field: model.channelSizeName(channel),
      expr: childSizeComponent.formula[0].expr
    }];

    model.children().forEach((child) => {
      delete child.component.layout[sizeType];
    });

    return {
      distinct: distinct,
      formula: formula
    };
  }
}

function getDistinct(model: Model, channel: Channel): StringSet {
  if (model.has(channel) && model.isOrdinalScale(channel)) {
    const scale = model.scale(channel);
    if (scale.type === ScaleType.ORDINAL && !(scale.domain instanceof Array)) {
      // if explicit domain is declared, use array length
      const distinctField = model.field(channel);
      let distinct: StringSet = {};
      distinct[distinctField] = true;
      return distinct;
    }
  }
  return {};
}

export function cardinalityExpr(model: Model, channel: Channel) {
  const scale = model.scale(channel);
  if (scale.domain instanceof Array) {
    return scale.domain.length;
  }

  const timeUnit = model.fieldDef(channel).timeUnit;
  const timeUnitDomain = timeUnit ? rawDomain(timeUnit, channel) : null;

  // FIXME: production rule will break here!
  return timeUnitDomain !== null ? timeUnitDomain.length :
    model.field(channel, {datum: true, prefix: 'distinct'});
}
