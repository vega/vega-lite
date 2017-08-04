/**
 * Utility for generating row / column headers
 */
import {FacetFieldDef} from '../../facet';
import {field} from '../../fielddef';
import {contains} from '../../util';
import {AxisOrient, Orient, VgAxis, VgEncodeEntry, VgMarkGroup, VgValueRef} from '../../vega.schema';
import {formatSignalRef} from '../common';
import {FacetModel} from '../facet';
import {Model} from '../model';

export type HeaderChannel = 'row' | 'column';
export const HEADER_CHANNELS: HeaderChannel[] = ['row', 'column'];

export type HeaderType = 'header' | 'footer';
export const HEADER_TYPES: HeaderType[] = ['header', 'footer'];

/**
 * A component that represents all header, footers and title of a Vega group with layout directive.
 */
export interface LayoutHeaderComponent {
  title?: string;

  // TODO: repeat and concat can have multiple header / footer.
  // Need to redesign this part a bit.

  facetFieldDef?: FacetFieldDef<string>;

  /**
   * An array of header components for headers.
   * For facet, there should be only one header component, which is data-driven.
   * For repeat and concat, there can be multiple header components that explicitly list different axes.
   */
  header?: HeaderComponent[];

  /**
   * An array of header components for footers.
   * For facet, there should be only one header component, which is data-driven.
   * For repeat and concat, there can be multiple header components that explicitly list different axes.
   */
  footer?: HeaderComponent[];
}

/**
 * A component that represents one group of row/column-header/footer.
 */
export interface HeaderComponent {

  labels: boolean;

  sizeSignal: {signal: string};

  axes: VgAxis[];
}

export function getHeaderType(orient: AxisOrient) {
  if (orient === 'top' || orient === 'left') {
    return 'header';
  }
  return 'footer';
}

export function getTitleGroup(model: Model, channel: HeaderChannel) {
  const title = model.component.layoutHeaders[channel].title;
  const textOrient = channel === 'row' ? 'vertical' : undefined;

  return {
    name:  model.getName(`${channel}_title`),
    role: `${channel}-title`,
    type: 'group',
    marks: [{
      type: 'text',
      role: `${channel}-title-text`,
      encode: {
        update: {
          // TODO: add title align
          align: {value: 'center'},
          text: {value: title},
          fill: {value: 'black'},
          fontWeight: {value: 'bold'},
          ...(textOrient === 'vertical' ? {angle: {value: 270}} : {}),
        }
      }
    }]
  };
}

export function getHeaderGroup(model: Model, channel: HeaderChannel, headerType: HeaderType, layoutHeader: LayoutHeaderComponent, header: HeaderComponent) {
  if (header) {
    let title = null;
    if (layoutHeader.facetFieldDef && header.labels) {
      const {facetFieldDef} = layoutHeader;
      const format = facetFieldDef.header ? facetFieldDef.header.format : undefined;

      title = {
        text: formatSignalRef(facetFieldDef, format, 'parent', model.config, true),
        offset: 10,
        orient: channel === 'row' ? 'left' : 'top',
        encode: {
          update: {
            fontWeight: {value: 'normal'},
            angle: {value: 0},
            fontSize: {value: 10}, // default label font size
            ... (channel === 'row' ? {
              align: {value: 'right'},
              baseline: {value: 'middle'}
            } : {})
          }
        }
      };
    }

    const axes = header.axes;

    const hasAxes = axes && axes.length > 0;
    if (title || hasAxes) {
      const sizeChannel = channel === 'row' ? 'height' : 'width';

      return {
        name: model.getName(`${channel}_${headerType}`),
        type: 'group',
        role: `${channel}-${headerType}`,
        ...(layoutHeader.facetFieldDef ? {
          from: {data: model.getName(channel)},
          sort: {
            field: field(layoutHeader.facetFieldDef, {expr: 'datum'}),
            order: (layoutHeader.facetFieldDef.header && layoutHeader.facetFieldDef.header.sort) || 'ascending'
          }
        } : {}),
        ...(title ? {title} : {}),
        ...(header.sizeSignal ? {
          encode: {
            update: {
              [sizeChannel]: header.sizeSignal
            }
          }
        }: {}),
        ...(hasAxes ? {axes} : {})
      };
    }
  }
  return null;
}
