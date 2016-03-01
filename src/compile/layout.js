"use strict";
var channel_1 = require('../channel');
var data_1 = require('../data');
var mark_1 = require('../mark');
var time_1 = require('./time');
function compileLayoutData(model) {
    var distinctSummary = [channel_1.X, channel_1.Y, channel_1.ROW, channel_1.COLUMN].reduce(function (summary, channel) {
        if (model.has(channel) && model.isOrdinalScale(channel)) {
            var scale = model.scale(channel);
            if (!(scale.domain instanceof Array)) {
                summary.push({
                    field: model.field(channel),
                    ops: ['distinct']
                });
            }
        }
        return summary;
    }, []);
    var cellWidthFormula = scaleWidthFormula(model, channel_1.X, model.cellWidth());
    var cellHeightFormula = scaleWidthFormula(model, channel_1.Y, model.cellHeight());
    var isFacet = model.has(channel_1.COLUMN) || model.has(channel_1.ROW);
    var formulas = [{
            type: 'formula',
            field: 'cellWidth',
            expr: cellWidthFormula
        }, {
            type: 'formula',
            field: 'cellHeight',
            expr: cellHeightFormula
        }, {
            type: 'formula',
            field: 'width',
            expr: isFacet ?
                facetScaleWidthFormula(model, channel_1.COLUMN, 'datum.cellWidth') :
                cellWidthFormula
        }, {
            type: 'formula',
            field: 'height',
            expr: isFacet ?
                facetScaleWidthFormula(model, channel_1.ROW, 'datum.cellHeight') :
                cellHeightFormula
        }];
    return distinctSummary.length > 0 ? {
        name: data_1.LAYOUT,
        source: model.dataTable(),
        transform: [].concat([{
                type: 'aggregate',
                summarize: distinctSummary
            }], formulas)
    } : {
        name: data_1.LAYOUT,
        values: [{}],
        transform: formulas
    };
}
exports.compileLayoutData = compileLayoutData;
function cardinalityFormula(model, channel) {
    var scale = model.scale(channel);
    if (scale.domain instanceof Array) {
        return scale.domain.length;
    }
    var timeUnit = model.fieldDef(channel).timeUnit;
    var timeUnitDomain = timeUnit ? time_1.rawDomain(timeUnit, channel) : null;
    return timeUnitDomain !== null ? timeUnitDomain.length :
        model.field(channel, { datum: true, prefn: 'distinct_' });
}
function scaleWidthFormula(model, channel, nonOrdinalSize) {
    if (model.has(channel)) {
        if (model.isOrdinalScale(channel)) {
            var scale = model.scale(channel);
            return '(' + cardinalityFormula(model, channel) +
                ' + ' + scale.padding +
                ') * ' + scale.bandSize;
        }
        else {
            return nonOrdinalSize + '';
        }
    }
    else {
        if (model.mark() === mark_1.TEXT && channel === channel_1.X) {
            return model.config().scale.textBandWidth + '';
        }
        return model.config().scale.bandSize + '';
    }
}
function facetScaleWidthFormula(model, channel, innerWidth) {
    var scale = model.scale(channel);
    if (model.has(channel)) {
        var cardinality = scale.domain instanceof Array ? scale.domain.length :
            model.field(channel, { datum: true, prefn: 'distinct_' });
        return '(' + innerWidth + ' + ' + scale.padding + ')' + ' * ' + cardinality;
    }
    else {
        return innerWidth + ' + ' + model.config().facet.scale.padding;
    }
}
//# sourceMappingURL=layout.js.map