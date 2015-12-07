exports.cellConfig = {
    type: 'object',
    properties: {
        width: {
            type: 'integer',
            default: 200
        },
        height: {
            type: 'integer',
            default: 200
        },
        padding: {
            type: 'integer',
            default: 16,
            description: 'default padding between facets.'
        },
        gridColor: {
            type: 'string',
            role: 'color',
            default: '#000000'
        },
        gridOpacity: {
            type: 'number',
            minimum: 0,
            maximum: 1,
            default: 0.25
        },
        gridOffset: {
            type: 'number',
            default: 6
        },
        fill: {
            type: 'string',
            role: 'color',
            default: 'rgba(0,0,0,0)'
        },
        fillOpacity: {
            type: 'number',
        },
        stroke: {
            type: 'string',
            role: 'color',
        },
        strokeWidth: {
            type: 'integer'
        },
        strokeOpacity: {
            type: 'number'
        },
        strokeDash: {
            type: 'array',
            default: undefined
        },
        strokeDashOffset: {
            type: 'integer',
            description: 'The offset (in pixels) into which to begin drawing with the stroke dash array.'
        }
    }
};
//# sourceMappingURL=config.cell.schema.js.map