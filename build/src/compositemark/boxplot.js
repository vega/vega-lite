"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fielddef_1 = require("../fielddef");
var fielddef_2 = require("./../fielddef");
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
    var discreteAxisFieldDef;
    var continuousAxisChannelDef;
    var discreteAxis;
    var continuousAxis;
    if (fielddef_1.isFieldDef(encoding.x) && fielddef_1.isFieldDef(encoding.y)) {
        // 2D
        var orient = box2DOrient(spec);
        var params = box2DParams(spec, orient);
        discreteAxisFieldDef = params.discreteAxisFieldDef;
        continuousAxisChannelDef = params.continuousAxisChannelDef;
        discreteAxis = params.discreteAxis;
        continuousAxis = params.continuousAxis;
    }
    else if (fielddef_1.isFieldDef(encoding.x) && fielddef_2.isContinuous(encoding.x) && encoding.y === undefined) {
        // 1D horizontal
        continuousAxis = 'x';
        continuousAxisChannelDef = encoding.x;
    }
    else if (encoding.x === undefined && fielddef_1.isFieldDef(encoding.y) && fielddef_2.isContinuous(encoding.y)) {
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
    // FIXME: refactor code such that we don't have to do this casting
    // We can cast here as we already check from outside that both x and y are FieldDef
    var xDef = encoding.x;
    var yDef = encoding.y;
    var resultOrient;
    if (fielddef_2.isDiscrete(xDef) && fielddef_2.isContinuous(yDef)) {
        resultOrient = 'vertical';
    }
    else if (fielddef_2.isDiscrete(yDef) && fielddef_2.isContinuous(xDef)) {
        resultOrient = 'horizontal';
    }
    else {
        if (fielddef_2.isContinuous(xDef) && fielddef_2.isContinuous(yDef)) {
            if (xDef.aggregate === undefined && yDef.aggregate === exports.BOXPLOT) {
                resultOrient = 'vertical';
            }
            else if (yDef.aggregate === undefined && xDef.aggregate === exports.BOXPLOT) {
                resultOrient = 'horizontal';
            }
            else if (xDef.aggregate === exports.BOXPLOT && yDef.aggregate === exports.BOXPLOT) {
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
    var discreteAxisFieldDef;
    var continuousAxisChannelDef;
    var discreteAxis;
    var continuousAxis;
    // FIXME: refactor code such that we don't have to do this casting
    // We can cast here as we already check from outside that both x and y are FieldDef
    var xDef = encoding.x;
    var yDef = encoding.y;
    if (orient === 'vertical') {
        discreteAxis = 'x';
        continuousAxis = 'y';
        continuousAxisChannelDef = yDef;
        discreteAxisFieldDef = xDef;
    }
    else {
        discreteAxis = 'y';
        continuousAxis = 'x';
        continuousAxisChannelDef = xDef;
        discreteAxisFieldDef = yDef;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm94cGxvdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb3NpdGVtYXJrL2JveHBsb3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0Esd0NBQXVDO0FBRXZDLDBDQUEwRjtBQU03RSxRQUFBLE9BQU8sR0FBZSxVQUFVLENBQUM7QUFTOUMsc0JBQTZCLElBQTBCO0lBQ3JELE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3hCLENBQUM7QUFGRCxvQ0FFQztBQUVZLFFBQUEsYUFBYSxHQUFrQixDQUFDLFlBQVksRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFnQi9ELFFBQUEscUNBQXFDLEdBRTlDO0lBQ0YsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDO0NBQ2QsQ0FBQztBQUVGLDBCQUFpQyxJQUE0RCxFQUFFLE1BQWM7SUFDcEcsSUFBQSxnQkFBVSxFQUFFLHdCQUFrQixFQUFFLHNEQUFZLENBQVM7SUFDckQsSUFBQSxlQUFLLEVBQUUsZUFBSyxFQUFFLDBEQUFzQixDQUFhO0lBQ2pELElBQUEsK0JBQVUsRUFBRSw4RUFBaUMsQ0FBd0I7SUFDckUsSUFBQSw2Q0FBYSxFQUFFLCtGQUFzQyxDQUFtQztJQUMvRixJQUFNLDJCQUEyQixHQUFHLElBQUksR0FBRyxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUMsR0FBRyxFQUFDLElBQUksRUFBRSxFQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksRUFBQyxFQUFDLENBQUM7SUFFM0YsSUFBSSxvQkFBb0IsQ0FBQztJQUN6QixJQUFJLHdCQUFpRCxDQUFDO0lBQ3RELElBQUksWUFBWSxDQUFDO0lBQ2pCLElBQUksY0FBYyxDQUFDO0lBRW5CLEVBQUUsQ0FBQyxDQUFDLHFCQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLHFCQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFD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