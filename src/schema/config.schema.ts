import {StackConfig, stackConfig} from './config.stack.schema';
import {CellConfig, cellConfig} from './config.cell.schema';
import {MarksConfig, marksConfig} from './config.marks.schema';

export interface Config {
  width?: number;
  height?: number;
  viewport?: number;
  padding?: number|string;
  background?: string;
  description?: string;
  spec?: any; // TODO: VgGroupMarks
  sortLineBy?: string;
  characterWidth?: number;

  stack?: StackConfig;
  cell?: CellConfig;
  marks?: MarksConfig;

  // TODO: revise
  filterNull?: any;
  textCellWidth?: any;
  singleBarOffset?: number;
  numberFormat?: string;
  timeFormat?: string;
}

export const config = {
  type: 'object',
  properties: {
    // template
    // TODO: add this back once we have top-down layout approach
    // width: {
    //   type: 'integer',
    //   default: undefined
    // },
    // height: {
    //   type: 'integer',
    //   default: undefined
    // },
    // padding: {
    //   type: ['number', 'string'],
    //   default: 'auto'
    // },
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
    // nested
    stack: stackConfig,
    cell: cellConfig,
    marks: marksConfig,

    // FIXME remove this
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
    // FIXME(#497) handle this
    numberFormat: {
      type: 'string',
      default: 's',
      description: 'D3 Number format for axis labels and text tables.'
    },
    // FIXME(#497) handle this
    timeFormat: {
      type: 'string',
      default: '%Y-%m-%d',
      description: 'Date format for axis labels.'
    }
  }
};
