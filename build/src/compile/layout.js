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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBpbGUvbGF5b3V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esc0NBQXNEO0FBQ3RELGdDQUErQjtBQUMvQixrQ0FBMkM7QUFFM0MsZ0NBQWdEO0FBdUJoRCx3QkFBK0IsS0FBWSxFQUFFLFVBQW9CO0lBQy9ELElBQU0sZUFBZSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO0lBQy9DLEVBQUUsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLEtBQUssSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3RELE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxhQUFhO0lBQ2xDLENBQUM7SUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ1QsSUFBTSxjQUFjLEdBQUcsV0FBSSxDQUFDLGFBQU0sQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxlQUFlLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDckcsSUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO2FBQ2pGLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLGFBQU0sQ0FBQyxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUMsRUFBRSxDQUFDLENBQUMsRUFBNUIsQ0FBNEIsQ0FBQyxDQUFDO1FBRTFDLE1BQU0sQ0FBQztZQUNMLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHO2dCQUMxQixJQUFJLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxhQUFNLENBQUM7Z0JBQzVCLE1BQU0sRUFBRSxLQUFLLENBQUMsU0FBUyxFQUFFO2dCQUN6QixTQUFTLEVBQUUsQ0FBQzt3QkFDVixJQUFJLEVBQUUs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