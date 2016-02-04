import {UnitConfig, unitConfig} from './config.unit.schema';
import {CellConfig, cellConfig} from './config.cell.schema';
import {MarkConfig, markConfig} from './config.marks.schema';
import {SceneConfig, sceneConfig} from './config.scene.schema';

export interface Config {
  // TODO: add this back once we have top-down layout approach
  // width?: number;
  // height?: number;
  // padding?: number|string;
  viewport?: number;
  background?: string;

  numberFormat?: string;
  timeFormat?: string;

  unit?: UnitConfig;
  cell?: CellConfig;
  mark?: MarkConfig;
  scene?: SceneConfig;
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

    // formats
    numberFormat: {
      type: 'string',
      default: 's',
      description: 'D3 Number format for axis labels and text tables. For example "s" for SI units.'
    },
    timeFormat: {
      type: 'string',
      default: '%Y-%m-%d',
      description: 'Default datetime format for axis and legend labels. The format can be set directly on each axis and legend.'
    },

    // nested
    unit: unitConfig,
    cell: cellConfig,
    mark: markConfig,
    scene: sceneConfig
  }
};
