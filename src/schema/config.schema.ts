import {CellConfig, defaultCellConfig} from './config.cell.schema';
import {FacetConfig, defaultFacetConfig} from './config.facet.schema';
import {MarkConfig, defaultMarkConfig} from './config.mark.schema';
import {ScaleConfig, defaultScaleConfig} from './scale.schema';
import {AxisConfig, defaultAxisConfig} from './axis.schema';
import {LegendConfig, defaultLegendConfig} from './legend.schema';

export interface Config {
  // TODO: add this back once we have top-down layout approach
  // width?: number;
  // height?: number;
  // padding?: number|string;
  /**
   * The width and height of the on-screen viewport, in pixels. If necessary, clipping and scrolling will be applied.
   */
  viewport?: number;
  /**
   * CSS color property to use as background of visualization. Default is `"transparent"`.
   */
  background?: string;

  /**
   * D3 Number format for axis labels and text tables. For example "s" for SI units.
   */
  numberFormat?: string;
  /**
   * Default datetime format for axis and legend labels. The format can be set directly on each axis and legend.
   */
  timeFormat?: string;

  cell?: CellConfig;
  mark?: MarkConfig;
  scale?: ScaleConfig;
  axis?: AxisConfig;
  legend?: LegendConfig;

  facet?: FacetConfig;
}

export const defaultConfig: Config = {
  numberFormat: 's',
  timeFormat: '%Y-%m-%d',

  cell: defaultCellConfig,
  mark: defaultMarkConfig,
  scale: defaultScaleConfig,
  axis: defaultAxisConfig,
  legend: defaultLegendConfig,

  facet: defaultFacetConfig,
};
