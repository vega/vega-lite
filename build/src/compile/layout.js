"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("../channel");
var data_1 = require("../data");
var scale_1 = require("../scale");
var util_1 = require("../util");
function assembleLayout(model, layoutData) {
    var layoutComponent = model.component.layout;
    if (!layoutComponent.width && !layoutComponent.height) {
        return layoutData; // Do nothing
    }
    if (true) {
        var distinctFields = util_1.keys(util_1.extend(layoutComponent.width.distinct, layoutComponent.height.distinct));
        var formula = layoutComponent.width.formula.concat(layoutComponent.height.formula)
            .map(function (f) { return util_1.extend({ type: 'formula' }, f); });
        return [
            distinctFields.length > 0 ? {
                name: model.dataName(data_1.LAYOUT),
                source: model.dataTable(),
                transform: [{
                        type: 'aggregate',
                        fields: distinctFields,
                        ops: distinctFields.map(function () { return 'distinct'; })
                    }].concat(formula)
            } : {
                name: model.dataName(data_1.LAYOUT),
                values: [{}],
                transform: formula
            }
        ];
    }
    // FIXME: implement
    // otherwise, we need to join width and height (cross)
}
exports.assembleLayout = assembleLayout;
// FIXME: for nesting x and y, we need to declare x,y layout separately before joining later
// For now, let's always assume shared scale
function parseUnitLayout(model) {
    return {
        width: parseUnitSizeLayout(model, channel_1.X),
        height: parseUnitSizeLayout(model, channel_1.Y)
    };
}
exports.parseUnitLayout = parseUnitLayout;
function parseUnitSizeLayout(model, channel) {
    return {
        distinct: getDistinct(model, channel),
        formula: [{
                as: model.channelSizeName(channel),
                expr: unitSizeExpr(model, channel)
            }]
    };
}
function unitSizeExpr(model, channel) {
    var scale = model.scale(channel);
    if (scale) {
        if (scale_1.hasDiscreteDomain(scale.type) && scale.rangeStep) {
            // If the spec has top level size or specified rangeStep = fit, it will be undefined here.
            var cardinality = cardinalityExpr(model, channel);
            var paddingOuter = scale.paddingOuter !== undefined ? scale.paddingOuter : scale.padding;
            var paddingInner = scale.type === 'band' ?
                // only band has real paddingInner
                (scale.paddingInner !== undefined ? scale.paddingInner : scale.padding) :
                // For point, as calculated in https://github.com/vega/vega-scale/blob/master/src/band.js#L128,
                // it's equivalent to have paddingInner = 1 since there is only n-1 steps between n points.
                1;
            var space = cardinality +
                (paddingInner ? " - " + paddingInner : '') +
                (paddingOuter ? " + 2*" + paddingOuter : '');
            // This formula is equivalent to
            // space = count - inner + outer * 2
            // range = rangeStep * (space > 0 ? space : 0)
            // in https://github.com/vega/vega-encode/blob/master/src/Scale.js#L112
            return "max(" + space + ", 0) * " + scale.rangeStep;
        }
    }
    return (channel === channel_1.X ? model.width : model.height) + '';
}
exports.unitSizeExpr = unitSizeExpr;
function parseFacetLayout(model) {
    return {
        width: parseFacetSizeLayout(model, channel_1.COLUMN),
        height: parseFacetSizeLayout(model, channel_1.ROW)
    };
}
exports.parseFacetLayout = parseFacetLayout;
function parseFacetSizeLayout(model, channel) {
    var childLayoutComponent = model.child.component.layout;
    var sizeType = channel === channel_1.ROW ? 'height' : 'width';
    var childSizeComponent = childLayoutComponent[sizeType];
    if (true) {
        // For shared scale, we can simply merge the layout into one data source
        var distinct = util_1.extend(getDistinct(model, channel), childSizeComponent.distinct);
        var formula = childSizeComponent.formula.concat([{
                as: model.channelSizeName(channel),
                expr: facetSizeFormula(model, channel, model.child.channelSizeName(channel))
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
function facetSizeFormula(model, channel, innerSize) {
    if (model.channelHasField(channel)) {
        return '(datum["' + innerSize + '"] + ' + model.spacing(channel) + ')' + ' * ' + cardinalityExpr(model, channel);
    }
    else {
        return 'datum["' + innerSize + '"] + ' + model.config.scale.facetSpacing; // need to add outer padding for facet
    }
}
function parseLayerLayout(model) {
    return {
        width: parseLayerSizeLayout(model, channel_1.X),
        height: parseLayerSizeLayout(model, channel_1.Y)
    };
}
exports.parseLayerLayout = parseLayerLayout;
function parseLayerSizeLayout(model, channel) {
    if (true) {
        // For shared scale, we can simply merge the layout into one data source
        // TODO: don't just take the layout from the first child
        var childLayoutComponent = model.children[0].component.layout;
        var sizeType_1 = channel === channel_1.Y ? 'height' : 'width';
        var childSizeComponent = childLayoutComponent[sizeType_1];
        var distinct = childSizeComponent.distinct;
        var formula = [{
                as: model.channelSizeName(channel),
                expr: childSizeComponent.formula[0].expr
            }];
        model.children.forEach(function (child) {
            delete child.component.layout[sizeType_1];
        });
        return {
            distinct: distinct,
            formula: formula
        };
    }
}
function getDistinct(model, channel) {
    if (model.channelHasField(channel) && model.hasDiscreteScale(channel)) {
        var scale = model.scale(channel);
        if (scale_1.hasDiscreteDomain(scale.type) && !(scale.domain instanceof Array)) {
            // if explicit domain is declared, use array length
            var distinctField = model.field(channel);
            var distinct = {};
            distinct[distinctField] = true;
            return distinct;
        }
    }
    return {};
}
function cardinalityExpr(model, channel) {
    var scale = model.scale(channel);
    if (scale.domain instanceof Array) {
        return scale.domain.length + '';
    }
    return model.field(channel, { datum: true, prefix: 'distinct' });
}
exports.cardinalityExpr = cardinalityExpr;
//# sourceMappingURL=layout.js.map