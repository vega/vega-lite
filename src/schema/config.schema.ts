import {StackConfig, stackConfig} from './config.stack.schema';
import {CellConfig, cellConfig} from './config.cell.schema';
import {MarkConfig, markConfig} from './config.marks.schema';
import {SceneConfig, sceneConfig} from './config.scene.schema';

export interface Config {
  width?: number;
  height?: number;
  padding?: number|string;
  viewport?: number;
  background?: string;

  cell?: CellConfig;
  mark?: MarkConfig;
  scene?: SceneConfig;
  stack?: StackConfig;

  // TODO: revise
  filterNull?: any;
  textCellWidth?: any;
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

    // FIXME(#497) remove these
    numberFormat: {
      type: 'string',
      default: 's',
      description: 'D3 Number format for axis labels and text tables.'
    },
    // FIXME(#497) handle this
    textCellWidth: {
      type: 'integer',
      default: 90,
      minimum: 0
    },
    timeFormat: {
      type: 'string',
      default: '%Y-%m-%d',
      description: 'Date format for axis labels.'
    },

    // nested
    stack: stackConfig,
    cell: cellConfig,
    mark: markConfig,
    scene: sceneConfig
  }
};
