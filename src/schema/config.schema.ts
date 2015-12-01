// TODO: add interface Config

export var config = {
  type: 'object',
  properties: {
    // template
    width: {
      type: 'integer',
      default: undefined
    },
    height: {
      type: 'integer',
      default: undefined
    },
    viewport: {
      type: 'array',
      items: {
        type: 'integer'
      },
      default: undefined
    },

    // filter null
    // TODO(#597) revise this config
    filterNull: {
      type: 'object',
      properties: {
        nominal: {type:'boolean', default: false},
        ordinal: {type:'boolean', default: false},
        quantitative: {type:'boolean', default: true},
        temporal: {type:'boolean', default: true}
      }
    },

    // band size
    bandWidth: {
      type: 'integer',
      default: 21,
      minimum: 0
    },
    padding: {
      type: 'number',
      default: 1,
      description: 'default scale padding ratio for ordinal x/y scales.'
    },
    // small multiples
    textCellWidth: {
      type: 'integer',
      default: 90,
      minimum: 0
    },

    // layout
    // TODO: add orient
    sortLineBy: {
      type: 'string',
      default: undefined,
      description: 'Data field to sort line by. ' +
        '\'-\' prefix can be added to suggest descending order.'
    },
    stack: {
      type: ['boolean', 'object'],
      default: {},
      description: 'Enable stacking (for bar and area marks only).',
      properties: {
        sort: {
          oneOf: [{
            type: 'string',
            enum: ['ascending', 'descending']
          },{
            type: 'array',
            items: {type: 'string'},
          }],
          description: 'Order of the stack. ' +
            'This can be either a string (either "descending" or "ascending")' +
            'or a list of fields to determine the order of stack layers.' +
            'By default, stack uses descending order.'
        },
        offset: {
          type: 'string',
          enum: ['zero', 'center', 'normalize']
          // TODO(#620) refer to Vega spec once it doesn't throw error
          // enum: vgStackSchema.properties.offset.oneOf[0].enum
        }
      }
    },
    // cell
    cell: {
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
          default: 6 // equal to tickSize
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
    },
    marks: {
      type: 'object',
      properties: {
        // text-only
        align: {
          type: 'string',
          default: 'right',
          enum: ['left', 'right', 'center'],
          description: 'The horizontal alignment of the text. One of left, right, center.'
        },
        baseline: {
          type: 'string',
          default: 'middle',
          enum: ['top', 'middle', 'bottom'],
          description: 'The vertical alignment of the text. One of top, middle, bottom.'
        },
        // TODO dx, dy, radius, theta, angle
        fill: {
          type: 'string',
          role: 'color',
          default: '#000000'
        },
        font: {
          type: 'string',
          default: undefined,
          role: 'font',
          description: 'The typeface to set the text in (e.g., Helvetica Neue).'
        },
        fontSize: {
          type: 'integer',
          default: undefined,
          minimum: 0,
          description: 'The font size, in pixels.'
        },
        fontStyle: {
          type: 'string',
          default: undefined,
          enum: ['normal', 'italic'],
          description: 'The font style (e.g., italic).'
        },
        fontWeight: {
          type: 'string',
          enum: ['normal', 'bold'],
          default: undefined,
          description: 'The font weight (e.g., bold).'
        },
        format: {
          type: 'string',
          default: '',  // auto
          description: 'The formatting pattern for text value.'+
                       'If not defined, this will be determined automatically'
        }
      }
    },

    // marks
    strokeWidth: {
      type: 'integer',
      default: 2,
      minimum: 0
    },
    singleBarOffset: {
      type: 'integer',
      default: 5,
      minimum: 0
    },
    // other
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
    },
    useRawDomain: {
      type: 'boolean',
      default: false,
      description: 'Use the source data range as scale domain instead of ' +
                   'aggregated data for aggregate axis. ' +
                   'This option does not work with sum or count aggregate' +
                   'as they might have a substantially larger scale range.' +
                   'By default, use value from config.useRawDomain.'
    }
  }
};
