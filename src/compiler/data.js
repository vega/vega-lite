var vlFieldDef = require('../fielddef');
var util_1 = require('../util');
var bin_1 = require('../bin');
var channel_1 = require('../channel');
var data_1 = require('../data');
var time = require('./time');
var type_1 = require('../type');
function compileData(model) {
    var def = [source.def(model)];
    var summaryDef = summary.def(model);
    if (summaryDef) {
        def.push(summaryDef);
    }
    filterNonPositiveForLog(def[def.length - 1], model);
    var statsDef = layout.def(model);
    if (statsDef) {
        def.push(statsDef);
    }
    var stackDef = model.stack();
    if (stackDef) {
        def.push(stack.def(model, stackDef));
    }
    return def;
}
exports.compileData = compileData;
var source;
(function (source_1) {
    function def(model) {
        var source = { name: data_1.SOURCE };
        if (model.hasValues()) {
            source.values = model.data().values;
            source.format = { type: 'json' };
        }
        else {
            source.url = model.data().url;
            source.format = { type: model.data().formatType };
        }
        var parse = formatParse(model);
        if (parse) {
            source.format.parse = parse;
        }
        source.transform = transform(model);
        return source;
    }
    source_1.def = def;
    function formatParse(model) {
        var calcFieldMap = (model.data().calculate || []).reduce(function (fieldMap, formula) {
            fieldMap[formula.field] = true;
            return fieldMap;
        }, {});
        var parse;
        model.forEach(function (fieldDef) {
            if (fieldDef.type === type_1.TEMPORAL) {
                parse = parse || {};
                parse[fieldDef.field] = 'date';
            }
            else if (fieldDef.type === type_1.QUANTITATIVE) {
                if (vlFieldDef.isCount(fieldDef) || calcFieldMap[fieldDef.field]) {
                    return;
                }
                parse = parse || {};
                parse[fieldDef.field] = 'number';
            }
        });
        return parse;
    }
    function transform(model) {
        return nullFilterTransform(model).concat(formulaTransform(model), timeTransform(model), binTransform(model), filterTransform(model));
    }
    source_1.transform = transform;
    function timeTransform(model) {
        return model.reduce(function (transform, fieldDef, channel) {
            if (fieldDef.type === type_1.TEMPORAL && fieldDef.timeUnit) {
                var field = model.field(channel, { nofn: true, datum: true });
                transform.push({
                    type: 'formula',
                    field: model.field(channel),
                    expr: time.formula(fieldDef.timeUnit, field)
                });
            }
            return transform;
        }, []);
    }
    source_1.timeTransform = timeTransform;
    function binTransform(model) {
        return model.reduce(function (transform, fieldDef, channel) {
            var bin = model.fieldDef(channel).bin;
            if (bin) {
                var binTrans = util_1.extend({
                    type: 'bin',
                    field: fieldDef.field,
                    output: {
                        start: model.field(channel, { binSuffix: '_start' }),
                        mid: model.field(channel, { binSuffix: '_mid' }),
                        end: model.field(channel, { binSuffix: '_end' })
                    }
                }, typeof bin === 'boolean' ? {} : bin);
                if (!binTrans.maxbins && !binTrans.step) {
                    binTrans.maxbins = bin_1.autoMaxBins(channel);
                }
                transform.push(binTrans);
            }
            return transform;
        }, []);
    }
    source_1.binTransform = binTransform;
    function nullFilterTransform(model) {
        var filterNull = model.config('filterNull');
        var filteredFields = util_1.keys(model.reduce(function (aggregator, fieldDef) {
            if (fieldDef.field && fieldDef.field !== '*' && filterNull[fieldDef.type]) {
                aggregator[fieldDef.field] = true;
            }
            return aggregator;
        }, {}));
        return filteredFields.length > 0 ?
            [{
                    type: 'filter',
                    test: filteredFields.map(function (fieldName) {
                        return 'datum.' + fieldName + '!==null';
                    }).join(' && ')
                }] : [];
    }
    source_1.nullFilterTransform = nullFilterTransform;
    function filterTransform(model) {
        var filter = model.data().filter;
        return filter ? [{
                type: 'filter',
                test: filter
            }] : [];
    }
    source_1.filterTransform = filterTransform;
    function formulaTransform(model) {
        return (model.data().calculate || []).reduce(function (transform, formula) {
            transform.push(util_1.extend({ type: 'formula' }, formula));
            return transform;
        }, []);
    }
    source_1.formulaTransform = formulaTransform;
})(source = exports.source || (exports.source = {}));
var layout;
(function (layout_1) {
    function def(model) {
        var summarize = [];
        var formulas = [];
        if (model.has(channel_1.X) && model.isOrdinalScale(channel_1.X)) {
            var xScale = model.fieldDef(channel_1.X).scale;
            var xHasDomain = xScale.domain instanceof Array;
            if (!xHasDomain) {
                summarize.push({
                    field: model.field(channel_1.X),
                    ops: ['distinct']
                });
            }
            var xCardinality = xHasDomain ? xScale.domain.length :
                model.field(channel_1.X, { datum: true, prefn: 'distinct_' });
            formulas.push({
                type: 'formula',
                field: 'cellWidth',
                expr: '(' + xCardinality + ' + ' + xScale.padding + ') * ' + xScale.bandWidth
            });
        }
        if (model.has(channel_1.Y) && model.isOrdinalScale(channel_1.Y)) {
            var yScale = model.fieldDef(channel_1.Y).scale;
            var yHasDomain = yScale.domain instanceof Array;
            if (!yHasDomain) {
                summarize.push({
                    field: model.field(channel_1.Y),
                    ops: ['distinct']
                });
            }
            var yCardinality = yHasDomain ? yScale.domain.length :
                model.field(channel_1.Y, { datum: true, prefn: 'distinct_' });
            formulas.push({
                type: 'formula',
                field: 'cellHeight',
                expr: '(' + yCardinality + ' + ' + yScale.padding + ') * ' + yScale.bandWidth
            });
        }
        var cellPadding = model.config('cell').padding;
        var layout = model.layout();
        if (model.has(channel_1.COLUMN)) {
            var cellWidth = layout.cellWidth.field ?
                'datum.' + layout.cellWidth.field :
                layout.cellWidth;
            var colScale = model.fieldDef(channel_1.COLUMN).scale;
            var colHasDomain = colScale.domain instanceof Array;
            if (!colHasDomain) {
                summarize.push({
                    field: model.field(channel_1.COLUMN),
                    ops: ['distinct']
                });
            }
            var colCardinality = colHasDomain ? colScale.domain.length :
                model.field(channel_1.COLUMN, { datum: true, prefn: 'distinct_' });
            formulas.push({
                type: 'formula',
                field: 'width',
                expr: cellWidth + ' * ' + colCardinality + ' + ' +
                    '(' + colCardinality + ' - 1) * ' + cellPadding
            });
        }
        if (model.has(channel_1.ROW)) {
            var cellHeight = layout.cellHeight.field ?
                'datum.' + layout.cellHeight.field :
                layout.cellHeight;
            var rowScale = model.fieldDef(channel_1.ROW).scale;
            var rowHasDomain = rowScale.domain instanceof Array;
            if (!rowHasDomain) {
                summarize.push({
                    field: model.field(channel_1.ROW),
                    ops: ['distinct']
                });
            }
            var rowCardinality = rowHasDomain ? rowScale.domain.length :
                model.field(channel_1.ROW, { datum: true, prefn: 'distinct_' });
            formulas.push({
                type: 'formula',
                field: 'height',
                expr: cellHeight + ' * ' + rowCardinality + ' + ' +
                    '(' + rowCardinality + ' - 1) * ' + cellPadding
            });
        }
        if (formulas.length > 0) {
            return summarize.length > 0 ? {
                name: data_1.LAYOUT,
                source: model.dataTable(),
                transform: [{
                        type: 'aggregate',
                        summarize: summarize
                    }].concat(formulas)
            } : {
                name: data_1.LAYOUT,
                values: [{}],
                transform: formulas
            };
        }
        return null;
    }
    layout_1.def = def;
})(layout = exports.layout || (exports.layout = {}));
var summary;
(function (summary) {
    function def(model) {
        var dims = {};
        var meas = {};
        var hasAggregate = false;
        model.forEach(function (fieldDef, channel) {
            if (fieldDef.aggregate) {
                hasAggregate = true;
                if (fieldDef.aggregate === 'count') {
                    meas['*'] = meas['*'] || {};
                    meas['*'].count = true;
                }
                else {
                    meas[fieldDef.field] = meas[fieldDef.field] || {};
                    meas[fieldDef.field][fieldDef.aggregate] = true;
                }
            }
            else {
                if (fieldDef.bin) {
                    dims[model.field(channel, { binSuffix: '_start' })] = model.field(channel, { binSuffix: '_start' });
                    dims[model.field(channel, { binSuffix: '_mid' })] = model.field(channel, { binSuffix: '_mid' });
                    dims[model.field(channel, { binSuffix: '_end' })] = model.field(channel, { binSuffix: '_end' });
                }
                else {
                    dims[fieldDef.field] = model.field(channel);
                }
            }
        });
        var groupby = util_1.vals(dims);
        var summarize = util_1.reduce(meas, function (aggregator, fnDictSet, field) {
            aggregator[field] = util_1.keys(fnDictSet);
            return aggregator;
        }, {});
        if (hasAggregate) {
            return {
                name: data_1.SUMMARY,
                source: data_1.SOURCE,
                transform: [{
                        type: 'aggregate',
                        groupby: groupby,
                        summarize: summarize
                    }]
            };
        }
        return null;
    }
    summary.def = def;
    ;
})(summary = exports.summary || (exports.summary = {}));
var stack;
(function (stack) {
    function def(model, stackProps) {
        var groupbyChannel = stackProps.groupbyChannel;
        var fieldChannel = stackProps.fieldChannel;
        var facetFields = (model.has(channel_1.COLUMN) ? [model.field(channel_1.COLUMN)] : [])
            .concat((model.has(channel_1.ROW) ? [model.field(channel_1.ROW)] : []));
        var stacked = {
            name: data_1.STACKED,
            source: model.dataTable(),
            transform: [{
                    type: 'aggregate',
                    groupby: [model.field(groupbyChannel)].concat(facetFields),
                    summarize: [{ ops: ['sum'], field: model.field(fieldChannel) }]
                }]
        };
        if (facetFields && facetFields.length > 0) {
            stacked.transform.push({
                type: 'aggregate',
                groupby: facetFields,
                summarize: [{
                        ops: ['max'],
                        field: model.field(fieldChannel, { prefn: 'sum_' })
                    }]
            });
        }
        return stacked;
    }
    stack.def = def;
    ;
})(stack = exports.stack || (exports.stack = {}));
function filterNonPositiveForLog(dataTable, model) {
    model.forEach(function (_, channel) {
        if (model.fieldDef(channel).scale.type === 'log') {
            dataTable.transform.push({
                type: 'filter',
                test: model.field(channel, { datum: true }) + ' > 0'
            });
        }
    });
}
exports.filterNonPositiveForLog = filterNonPositiveForLog;
//# sourceMappingURL=data.js.map