/**
 * Utility for generating row / column headers
 */
import {AxisOrient} from '../../axis';
import {contains} from '../../util';
import {Orient, VgAxis, VgEncodeEntry, VgMarkGroup, VgValueRef} from '../../vega.schema';
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

  /**
   * Field that is used to drive a header group (for facet only).
   */
  fieldRef?: {signal: string};

  // TODO: repeat and concat can have multiple header / footer.
  // Need to redesign this part a bit.

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
  const sizeChannel = channel === 'row' ? 'height' : 'width';
  const title = model.component.layoutHeaders[channel].title;
  const positionChannel = channel === 'row' ? 'y' : 'x';
  const align = channel === 'row' ? 'right' : 'center';
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
          [positionChannel]: {signal: `0.5 * ${sizeChannel}`},
          align: {value: align},
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
    if (layoutHeader.fieldRef && header.labels) {
      title = {
        text: layoutHeader.fieldRef,
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
        ...(layoutHeader.fieldRef ? {from: {data: model.getName(channel)}} : {}),
        ...(title ? {title} : {}),
        encode: {
          update: {
            [sizeChannel]: header.sizeSignal
          }
        },
        ...(hasAxes ? {axes} : {})
      };
    }
  }
  return null;
}
