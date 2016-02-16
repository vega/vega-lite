import {UnitConfig, unitConfig, defaultUnitConfig} from './config.unit.schema';
import {CellConfig, cellConfig, defaultCellConfig} from './config.cell.schema';
import {FacetConfig, facetConfig, defaultFacetConfig} from './config.facet.schema';
import {MarkConfig, markConfig, defaultMarkConfig} from './config.marks.schema';
import {AxisConfig, axisConfig, defaultAxisConfig} from './axis.schema';
import {LegendConfig, legendConfig, defaultLegendConfig} from './legend.schema';

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
  mark?: MarkConfig;
  axis?: AxisConfig;
  legend?: LegendConfig;

  facet?: FacetConfig;
  cell?: CellConfig;
}

export const defaultConfig: Config = {
  numberFormat: 's',
  timeFormat: '%Y-%m-%d',

  unit: defaultUnitConfig,
  mark: defaultMarkConfig,
  axis: defaultAxisConfig,
  legend: defaultLegendConfig,

  facet: defaultFacetConfig,
  cell: defaultCellConfig
};

export const config = {
  type: 'object',
  properties: {
    // template
    // TODO: add this back once we have top-down layout approach
    // width: {
    //   type: 'integer',
    // },
    // height: {
    //   type: 'integer',
    // },
    // padding: {
    //   type: ['number', 'string'],
    // },
    viewport: {
      type: 'array',
      items: {
        type: 'integer'
      },
      description: 'The width and height of the on-screen viewport, in pixels. If necessary, clipping and scrolling will be applied.'
    },
    background: {
      type: 'string',
      format: 'color',
      description: 'CSS color property to use as background of visualization. Default is `"transparent"`.'
    },

    // formats
    numberFormat: {
      type: 'string',
      description: 'D3 Number format for axis labels and text tables. For example "s" for SI units.'
    },
    timeFormat: {
      type: 'string',
      description: 'Default datetime format for axis and legend labels. The format can be set directly on each axis and legend.'
    },

    // nested
    unit: unitConfig,
    mark: markConfig,
    axis: axisConfig,
    legend: legendConfig,

    facet: facetConfig,
    cell: cellConfig,
  }
};
