"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fielddef_1 = require("./../fielddef");
exports.BOXPLOT = 'box-plot';
function isBoxPlotDef(mark) {
    return !!mark['type'];
}
exports.isBoxPlotDef = isBoxPlotDef;
exports.BOXPLOT_ROLES = ['boxWhisker', 'box', 'boxMid'];
exports.VL_ONLY_BOXPLOT_CONFIG_PROPERTY_INDEX = {
    box: ['size']
};
function normalizeBoxPlot(spec, config) {
    var mark = spec.mark, encoding = spec.encoding, outerSpec = tslib_1.__rest(spec, ["mark", "encoding"]);
    var _x = encoding.x, _y = encoding.y, nonPositionEncoding = tslib_1.__rest(encoding, ["x", "y"]);
    var size = nonPositionEncoding.size, nonPositionEncodingWithoutSize = tslib_1.__rest(nonPositionEncoding, ["size"]);
    var _color = nonPositionEncodingWithoutSize.color, nonPositionEncodingWithoutColorSize = tslib_1.__rest(nonPositionEncodingWithoutSize, ["color"]);
    var midTickAndBarSizeChannelDef = size ? { size: size } : { size: { value: config.box.size } };
    var discreteAxisFieldDef, continuousAxisChannelDef;
    var discreteAxis, continuousAxis;
    if (encoding.x && encoding.y) {
        // 2D
        var orient = box2DOrient(spec);
        var params = box2DParams(spec, orient);
        discreteAxisFieldDef = params.discreteAxisFieldDef;
        continuousAxisChannelDef = params.continuousAxisChannelDef;
        discreteAxis = params.discreteAxis;
        continuousAxis = params.continuousAxis;
    }
    else if (encoding.x && fielddef_1.isContinuous(encoding.x) && encoding.y === undefined) {
        // 1D horizontal
        continuousAxis = 'x';
        continuousAxisChannelDef = encoding.x;
    }
    else if (encoding.x === undefined && encoding.y && fielddef_1.isContinuous(encoding.y)) {
        // 1D vertical
        continuousAxis = 'y';
        continuousAxisChannelDef = encoding.y;
    }
    else {
        throw new Error('Need a continuous axis for 1D boxplots');
    }
    if (continuousAxisChannelDef.aggregate !== undefined && continuousAxisChannelDef.aggregate !== exports.BOXPLOT) {
        throw new Error("Continuous axis should not have customized aggregation function " + continuousAxisChannelDef.aggregate);
    }
    var baseContinuousFieldDef = {
        field: continuousAxisChannelDef.field,
        type: continuousAxisChannelDef.type
    };
    var minFieldDef = tslib_1.__assign({ aggregate: 'min' }, baseContinuousFieldDef);
    var minWithAxisFieldDef = tslib_1.__assign({ axis: continuousAxisChannelDef.axis }, minFieldDef);
    var q1FieldDef = tslib_1.__assign({ aggregate: 'q1' }, baseContinuousFieldDef);
    var medianFieldDef = tslib_1.__assign({ aggregate: 'median' }, baseContinuousFieldDef);
    var q3FieldDef = tslib_1.__assign({ aggregate: 'q3' }, baseContinuousFieldDef);
    var maxFieldDef = tslib_1.__assign({ aggregate: 'max' }, baseContinuousFieldDef);
    var discreteAxisEncodingMixin = discreteAxisFieldDef !== undefined ? (_a = {}, _a[discreteAxis] = discreteAxisFieldDef, _a) : {};
    return tslib_1.__assign({}, outerSpec, { layer: [
            {
                mark: {
                    type: 'rule',
                    role: 'boxWhisker'
                },
                encoding: tslib_1.__assign({}, discreteAxisEncodingMixin, (_b = {}, _b[continuousAxis] = minWithAxisFieldDef, _b[continuousAxis + '2'] = q1FieldDef, _b), nonPositionEncodingWithoutColorSize)
            }, {
                mark: {
                    type: 'rule',
                    role: 'boxWhisker'
                },
                encoding: tslib_1.__assign({}, discreteAxisEncodingMixin, (_c = {}, _c[continuousAxis] = q3FieldDef, _c[continuousAxis + '2'] = maxFieldDef, _c), nonPositionEncodingWithoutColorSize)
            }, {
                mark: {
                    type: 'bar',
                    role: 'box'
                },
                encoding: tslib_1.__assign({}, discreteAxisEncodingMixin, (_d = {}, _d[continuousAxis] = q1FieldDef, _d[continuousAxis + '2'] = q3FieldDef, _d), nonPositionEncodingWithoutSize, midTickAndBarSizeChannelDef)
            }, {
                mark: {
                    type: 'tick',
                    role: 'boxMid'
                },
                encoding: tslib_1.__assign({}, discreteAxisEncodingMixin, (_e = {}, _e[continuousAxis] = medianFieldDef, _e), nonPositionEncoding, midTickAndBarSizeChannelDef, { color: { value: 'white' } })
            }
        ] });
    var _a, _b, _c, _d, _e;
}
exports.normalizeBoxPlot = normalizeBoxPlot;
function box2DOrient(spec) {
    var mark = spec.mark, encoding = spec.encoding, outerSpec = tslib_1.__rest(spec, ["mark", "encoding"]);
    var xEncChannel = encoding.x;
    var yEncChannel = encoding.y;
    var resultOrient;
    if (fielddef_1.isDiscrete(encoding.x) && fielddef_1.isContinuous(encoding.y)) {
        resultOrient = 'vertical';
    }
    else if (fielddef_1.isDiscrete(encoding.y) && fielddef_1.isContinuous(encoding.x)) {
        resultOrient = 'horizontal';
    }
    else {
        if (fielddef_1.isContinuous(encoding.x) && fielddef_1.isContinuous(encoding.y)) {
            if (xEncChannel.aggregate === undefined && yEncChannel.aggregate === exports.BOXPLOT) {
                resultOrient = 'vertical';
            }
            else if (yEncChannel.aggregate === undefined && xEncChannel.aggregate === exports.BOXPLOT) {
                resultOrient = 'horizontal';
            }
            else if (xEncChannel.aggregate === exports.BOXPLOT && yEncChannel.aggregate === exports.BOXPLOT) {
                throw new Error('Both x and y cannot have aggregate');
            }
            else {
                if (isBoxPlotDef(mark)) {
                    if (mark && mark.orient) {
                        resultOrient = mark.orient;
                    }
                    else {
                        // default orientation = vertical
                        resultOrient = 'vertical';
                    }
                }
                else {
                    resultOrient = 'vertical';
                }
            }
        }
        else {
            throw new Error('Both x and y cannot be discrete');
        }
    }
    return resultOrient;
}
exports.box2DOrient = box2DOrient;
function box2DParams(spec, orient) {
    var mark = spec.mark, encoding = spec.encoding, outerSpec = tslib_1.__rest(spec, ["mark", "encoding"]);
    var discreteAxisFieldDef, continuousAxisChannelDef;
    var discreteAxis, continuousAxis;
    if (orient === 'vertical') {
        discreteAxis = 'x';
        continuousAxis = 'y';
        continuousAxisChannelDef = encoding.y;
        discreteAxisFieldDef = encoding.x;
    }
    else {
        discreteAxis = 'y';
        continuousAxis = 'x';
        continuousAxisChannelDef = encoding.x;
        discreteAxisFieldDef = encoding.y;
    }
    if (continuousAxisChannelDef && continuousAxisChannelDef.aggregate) {
        var aggregate = continuousAxisChannelDef.aggregate, continuousAxisWithoutAggregate = tslib_1.__rest(continuousAxisChannelDef, ["aggregate"]);
        if (aggregate !== exports.BOXPLOT) {
            throw new Error("Continuous axis should not have customized aggregation function " + aggregate);
        }
        continuousAxisChannelDef = continuousAxisWithoutAggregate;
    }
    return {
        discreteAxisFieldDef: discreteAxisFieldDef,
        continuousAxisChannelDef: continuousAxisChannelDef,
        discreteAxis: discreteAxis,
        continuousAxis: continuousAxis
    };
}
exports.box2DParams = box2DParams;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm94cGxvdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb3NpdGVtYXJrL2JveHBsb3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsMENBQTBGO0FBSzdFLFFBQUEsT0FBTyxHQUFlLFVBQVUsQ0FBQztBQVM5QyxzQkFBNkIsSUFBMEI7SUFDckQsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDeEIsQ0FBQztBQUZELG9DQUVDO0FBRVksUUFBQSxhQUFhLEdBQWtCLENBQUMsWUFBWSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztBQWdCL0QsUUFBQSxxQ0FBcUMsR0FFOUM7SUFDRixHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUM7Q0FDZCxDQUFDO0FBRUYsMEJBQWlDLElBQTRELEVBQUUsTUFBYztJQUNwRyxJQUFBLGdCQUFVLEVBQUUsd0JBQWtCLEVBQUUsc0RBQVksQ0FBUztJQUNyRCxJQUFBLGVBQUssRUFBRSxlQUFLLEVBQUUsMERBQXNCLENBQWE7SUFDakQsSUFBQSwrQkFBVSxFQUFFLDhFQUFpQyxDQUF3QjtJQUNyRSxJQUFBLDZDQUFhLEVBQUUsK0ZBQXNDLENBQW1DO0lBQy9GLElBQU0sMkJBQTJCLEdBQUcsSUFBSSxHQUFHLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxHQUFHLEVBQUMsSUFBSSxFQUFFLEVBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFDLEVBQUMsQ0FBQztJQUUzRixJQUFJLG9CQUFvQixFQUFFLHdCQUFpRCxDQUFDO0lBQzVFLElBQUksWUFBWSxFQUFFLGNBQWMsQ0FBQztJQUVqQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdCLEtBQUs7UUFFTCxJQUFNLE1BQU0sR0FBVyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7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