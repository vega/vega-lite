var schemautil_1 = require('./schemautil');
var util_1 = require('../util');
var axis_schema_1 = require('./axis.schema');
var legend_schema_1 = require('./legend.schema');
var sort_schema_1 = require('./sort.schema');
var fielddef_schema_1 = require('./fielddef.schema');
var requiredNameType = {
    required: ['field', 'type']
};
var x = schemautil_1.merge(util_1.duplicate(fielddef_schema_1.typicalField), requiredNameType, {
    properties: {
        scale: {
            properties: {
                padding: { default: 1 },
                bandWidth: { default: 21 }
            }
        },
        axis: axis_schema_1.axis,
        sort: sort_schema_1.sort
    }
});
var y = util_1.duplicate(x);
var facet = schemautil_1.merge(util_1.duplicate(fielddef_schema_1.onlyOrdinalField), requiredNameType, {
    properties: {
        axis: axis_schema_1.axis,
        sort: sort_schema_1.sort
    }
});
var row = schemautil_1.merge(util_1.duplicate(facet));
var column = schemautil_1.merge(util_1.duplicate(facet));
var size = schemautil_1.merge(util_1.duplicate(fielddef_schema_1.typicalField), {
    properties: {
        legend: legend_schema_1.legend,
        sort: sort_schema_1.sort,
        value: {
            type: 'integer',
            default: 30,
            minimum: 0,
            description: 'Size of marks.'
        }
    }
});
var color = schemautil_1.merge(util_1.duplicate(fielddef_schema_1.typicalField), {
    properties: {
        legend: legend_schema_1.legend,
        sort: sort_schema_1.sort,
        value: {
            type: 'string',
            role: 'color',
            default: '#4682b4',
            description: 'Color to be used for marks.'
        },
        scale: {
            type: 'object',
            properties: {
                quantitativeRange: {
                    type: 'array',
                    default: ['#AFC6A3', '#09622A'],
                    description: 'Color range to encode quantitative variables.',
                    minItems: 2,
                    maxItems: 2,
                    items: {
                        type: 'string',
                        role: 'color'
                    }
                }
            }
        }
    }
});
var shape = schemautil_1.merge(util_1.duplicate(fielddef_schema_1.onlyOrdinalField), {
    properties: {
        legend: legend_schema_1.legend,
        sort: sort_schema_1.sort,
        value: {
            type: 'string',
            enum: ['circle', 'square', 'cross', 'diamond', 'triangle-up', 'triangle-down'],
            default: 'circle',
            description: 'Mark to be used.'
        }
    }
});
var detail = schemautil_1.merge(util_1.duplicate(fielddef_schema_1.onlyOrdinalField), {
    properties: {
        sort: sort_schema_1.sort
    }
});
var text = schemautil_1.merge(util_1.duplicate(fielddef_schema_1.typicalField), {
    properties: {
        sort: sort_schema_1.sort,
        value: {
            type: 'string',
            default: 'Abc'
        }
    }
});
exports.encoding = {
    type: 'object',
    properties: {
        x: x,
        y: y,
        row: row,
        column: column,
        size: size,
        color: color,
        shape: shape,
        text: text,
        detail: detail
    }
};
//# sourceMappingURL=encoding.schema.js.map