var config_stack_schema_1 = require('./config.stack.schema');
var config_cell_schema_1 = require('./config.cell.schema');
var config_marks_schema_1 = require('./config.marks.schema');
exports.config = {
    type: 'object',
    properties: {
        viewport: {
            type: 'array',
            items: {
                type: 'integer'
            },
            default: undefined,
            description: 'The width and height of the on-screen viewport, in pixels. If necessary, clipping and scrolling will be applied.'
        },
        background: {
            type: 'string',
            role: 'color',
            default: undefined,
            description: 'CSS color property to use as background of visualization. Default is `"transparent"`.'
        },
        scene: {
            type: 'object',
            default: undefined,
            description: 'An object to style the top-level scenegraph root. Available properties include `fill`, `fillOpacity`, `stroke`, `strokeOpacity`, `strokeWidth`, `strokeDash`, `strokeDashOffset`'
        },
        filterNull: {
            type: 'object',
            properties: {
                nominal: { type: 'boolean', default: false },
                ordinal: { type: 'boolean', default: false },
                quantitative: { type: 'boolean', default: true },
                temporal: { type: 'boolean', default: true }
            }
        },
        textCellWidth: {
            type: 'integer',
            default: 90,
            minimum: 0
        },
        sortLineBy: {
            type: 'string',
            default: undefined,
            description: 'Data field to sort line by. ' +
                '\'-\' prefix can be added to suggest descending order.'
        },
        stack: config_stack_schema_1.stackConfig,
        cell: config_cell_schema_1.cellConfig,
        marks: config_marks_schema_1.marksConfig,
        singleBarOffset: {
            type: 'integer',
            default: 5,
            minimum: 0
        },
        characterWidth: {
            type: 'integer',
            default: 6
        },
        numberFormat: {
            type: 'string',
            default: 's',
            description: 'D3 Number format for axis labels and text tables.'
        },
        timeFormat: {
            type: 'string',
            default: '%Y-%m-%d',
            description: 'Date format for axis labels.'
        }
    }
};
//# sourceMappingURL=config.schema.js.map