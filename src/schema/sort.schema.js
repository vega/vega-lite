var aggregate_1 = require('../aggregate');
var type_1 = require('../type');
var util_1 = require('../util');
exports.sort = {
    default: 'ascending',
    supportedTypes: util_1.toMap([type_1.QUANTITATIVE, type_1.ORDINAL]),
    oneOf: [
        {
            type: 'string',
            enum: ['ascending', 'descending', 'unsorted']
        },
        {
            type: 'object',
            required: ['field', 'op'],
            properties: {
                field: {
                    type: 'string',
                    description: 'The field name to aggregate over.'
                },
                op: {
                    type: 'string',
                    enum: aggregate_1.AGGREGATE_OPS,
                    description: 'The field name to aggregate over.'
                },
                order: {
                    type: 'string',
                    enum: ['ascending', 'descending']
                }
            }
        }
    ]
};
//# sourceMappingURL=sort.schema.js.map