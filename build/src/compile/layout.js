"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
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
            .map(function (f) {
            return tslib_1.__assign({ type: 'formula' }, f);
        });
        return [
            distinctFields.length > 0 ? {
                name: model.getName(data_1.LAYOUT),
                source: model.lookupDataSource(layoutComponent.width.source || layoutComponent.height.source),
                transform: [{
                        type: 'aggregate',
                        fields: distinctFields,
                        ops: distinctFields.map(function () { return 'distinct'; })
                    }].concat(formula)
            } : {
                name: model.getName(data_1.LAYOUT),
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
    var distinct = getDistinct(model, channel);
    return {
        source: util_1.keys(distinct).length > 0 ? model.getDataName(data_1.MAIN) : null,
        distinct: distinct,
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
            source: model.getDataName(data_1.MAIN),
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
            source: model.getDataName(data_1.MAIN),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBpbGUvbGF5b3V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHNDQUFzRDtBQUN0RCxnQ0FBcUM7QUFDckMsa0NBQTJDO0FBQzNDLGdDQUFnRDtBQStCaEQsd0JBQStCLEtBQVksRUFBRSxVQUFvQjtJQUMvRCxJQUFNLGVBQWUsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztJQUMvQyxFQUFFLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxLQUFLLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUN0RCxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsYUFBYTtJQUNsQyxDQUFDO0lBRUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNULElBQU0sY0FBYyxHQUFHLFdBQUksQ0FBQyxhQUFNLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsZUFBZSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ3JHLElBQU0sT0FBTyxHQUFHLGVBQWUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQzthQUNqRixHQUFHLENBQUMsVUFBQSxDQUFDO1lBQ0osTUFBTSxDQUFDLG1CQUNMLElBQUksRUFBRSxTQUFTLElBQ1osQ0FBQyxDQUNpQixDQUFDO1FBQzFCLENBQUMsQ0FBQyxDQUFDO1FBRUwsTUFBTSxDQUFDO1lBQ0wsY0FBYyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUc7Z0JBQzFCLElBQUksRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLGFBQU0sQ0FBQztnQkFDM0IsTUFBTSxFQUFFLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSSxlQUFlLENBQUMs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