import {UnitConfig, unitConfig, defaultUnitConfig} from './config.unit.schema';
import {FacetConfig, facetConfig, defaultFacetConfig} from './config.facet.schema';
import {MarkConfig, markConfig, defaultMarkConfig} from './config.marks.schema';
import {ScaleConfig, scaleConfig, defaultScaleConfig} from './scale.schema';
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
  scale?: ScaleConfig;
  axis?: AxisConfig;
  legend?: LegendConfig;

  facet?: FacetConfig;
}

export const defaultConfig: Config = {
  numberFormat: 's',
  timeFormat: '%Y-%m-%d',

  unit: defaultUnitConfig,
  mark: defaultMarkConfig,
  scale: defaultScaleConfig,
  axis: defaultAxisConfig,
  legend: defaultLegendConfig,

  facet: defaultFacetConfig,
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
    scale: scaleConfig,
    axis: axisConfig,
    legend: legendConfig,
    facet: facetConfig
  }
};
