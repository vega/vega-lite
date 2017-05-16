"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fielddef_1 = require("./../fielddef");
exports.BOXPLOT = 'box-plot';
function normalizeBoxPlot(spec, config) {
    var _m = spec.mark, encoding = spec.encoding, outerSpec = tslib_1.__rest(spec, ["mark", "encoding"]);
    var _x = encoding.x, _y = encoding.y, nonPositionEncoding = tslib_1.__rest(encoding, ["x", "y"]);
    var size = nonPositionEncoding.size, nonPositionEncodingWithoutSize = tslib_1.__rest(nonPositionEncoding, ["size"]);
    var _color = nonPositionEncodingWithoutSize.color, nonPositionEncodingWithoutColorSize = tslib_1.__rest(nonPositionEncodingWithoutSize, ["color"]);
    var midTickAndBarSizeChannelDef = size ? { size: size } : { size: { value: config.box.size } };
    var discreteAxisFieldDef, continuousAxisChannelDef;
    var discreteAxis, continuousAxis;
    if (encoding.x && encoding.y) {
        // 2D
        if (fielddef_1.isDiscrete(encoding.x) && fielddef_1.isContinuous(encoding.y)) {
            // vertical
            discreteAxis = 'x';
            continuousAxis = 'y';
            continuousAxisChannelDef = encoding.y;
            discreteAxisFieldDef = encoding.x;
        }
        else if (fielddef_1.isDiscrete(encoding.y) && fielddef_1.isContinuous(encoding.x)) {
            // horizontal
            discreteAxis = 'y';
            continuousAxis = 'x';
            continuousAxisChannelDef = encoding.x;
            discreteAxisFieldDef = encoding.y;
        }
        else {
            throw new Error('Need one continuous and one discrete axis for 2D boxplots');
        }
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
        throw new Error('Continuous axis should not be aggregated');
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
                encoding: tslib_1.__assign({}, discreteAxisEncodingMixin, (_e = {}, _e[continuousAxis] = medianFieldDef, _e), nonPositionEncoding, midTickAndBarSizeChannelDef, { 'color': { 'value': 'white' } })
            }
        ] });
    var _a, _b, _c, _d, _e;
}
exports.normalizeBoxPlot = normalizeBoxPlot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm94cGxvdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb3NpdGVtYXJrL2JveHBsb3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBR0EsMENBQXlFO0FBSTVELFFBQUEsT0FBTyxHQUFlLFVBQVUsQ0FBQztBQVM5QywwQkFBaUMsSUFBK0MsRUFBRSxNQUFjO0lBQ3ZGLElBQUEsY0FBUSxFQUFFLHdCQUFrQixFQUFFLHNEQUFZLENBQVM7SUFDbkQsSUFBQSxlQUFLLEVBQUUsZUFBSyxFQUFFLDBEQUFzQixDQUFhO0lBQ2pELElBQUEsK0JBQVUsRUFBRSw4RUFBaUMsQ0FBd0I7SUFDckUsSUFBQSw2Q0FBYSxFQUFFLCtGQUFzQyxDQUFtQztJQUMvRixJQUFNLDJCQUEyQixHQUFHLElBQUksR0FBRyxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUMsR0FBRyxFQUFDLElBQUksRUFBRSxFQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksRUFBQyxFQUFDLENBQUM7SUFFM0YsSUFBSSxvQkFBb0IsRUFBRSx3QkFBaUQsQ0FBQztJQUM1RSxJQUFJLFlBQVksRUFBRSxjQUFjLENBQUM7SUFFakMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QixLQUFLO1FBQ0wsRUFBRSxDQUFDLENBQUMscUJBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksdUJBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZELFdBQVc7WUFDWCxZQUFZLEdBQUcsR0FBRyxDQUFDO1lBQ25CLGNBQWMsR0FBRyxHQUFHLENBQUM7WUFDckIsd0JBQXdCLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUV0QyxvQkFBb0IsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLENBQUM7UUFBQyxJQUFJLENB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