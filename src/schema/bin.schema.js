var bin_1 = require('../bin');
var type_1 = require('../type');
var util_1 = require('../util');
exports.bin = {
    type: ['boolean', 'object'],
    default: false,
    properties: {
        maxbins: {
            type: 'integer',
            default: bin_1.MAXBINS_DEFAULT,
            minimum: 2,
            description: 'Maximum number of bins.'
        }
    },
    supportedTypes: util_1.toMap([type_1.QUANTITATIVE])
};
//# sourceMappingURL=bin.schema.js.map