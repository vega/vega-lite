/**
 * Utility for generating row / column headers
 */
import {FacetFieldDef} from '../../facet';
import {vgField} from '../../fielddef';
import {keys} from '../../util';
import {AxisOrient, VgAxis, VgMarkGroup} from '../../vega.schema';
import {formatSignalRef} from '../common';
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

  const update = {
    align: {value: 'center'},
    text: {value: title},
    ...(textOrient === 'vertical' ? {angle: {value: 270}}: {}),
    // TODO*https://github.com/vega/vega-lite/issues/2446): add title* properties (e.g., titleAlign)
    // also make sure that guide-title config override these Vega-lite default
  };

  return {
    name:  model.getName(`${channel}_title`),
    role: `${channel}-title`,
    type: 'group',
    marks: [{
      type: 'text',
      role: `${channel}-title-text`,
      style: 'guide-title',
      ...(keys(update).length > 0 ? {encode: {update}} : {})
    }]
  };
}

export function getHeaderGroups(model: Model, channel: HeaderChannel): VgMarkGroup[] {
  const layoutHeader = model.component.layoutHeaders[channel];
  const groups = [];
  for (const headerType of HEADER_TYPES) {
    if (layoutHeader[headerType]) {
      for (const headerCmpt of layoutHeader[headerType]) {
        groups.push(getHeaderGroup(model, channel, headerType, layoutHeader, headerCmpt));
      }
    }
  }
  return groups;
}

// 0, (0,90), 90, (90, 180), 180, (180, 270), 270, (270, 0)

export function labelAlign(angle: number) {
  // to keep angle in [0, 360)
  angle = ((angle % 360) + 360) % 360;
  if ((angle + 90) % 180 === 0) {  // for 90 and 270
    return {}; // default center
  } else if (angle < 90 || 270 < angle) {
    return {align: {value: 'right'}};
  } else if (135 <= angle && angle < 225) {
    return {align: {value: 'left'}};
  }
  return {};
}

export function labelBaseline(angle: number) {
  // to keep angle in [0, 360)
  angle = ((angle % 360) + 360) % 360;
  if (45 <= angle && angle <= 135) {
    return {baseline: {value: 'top'}};
  }
  return {};
}

function getHeaderGroup(model: Model, channel: HeaderChannel, headerType: HeaderType, layoutHeader: LayoutHeaderComponent, headerCmpt: HeaderComponent) {
  if (headerCmpt) {
    let title = null;
    const {facetFieldDef} = layoutHeader;
    if (facetFieldDef && headerCmpt.labels) {
      const {header = {}} = facetFieldDef;
      const {format, labelAngle} = header;

      const update = {
        ...(
          labelAngle !== undefined ? {angle: {value: labelAngle}} : {}
        ),
        ...labelAlign(labelAngle),
        ...labelBaseline(labelAngle)

      };

      title = {
        text: formatSignalRef(facetFieldDef, format, 'parent', model.config),
        offset: 10,
        orient: channel === 'row' ? 'left' : 'top',
        style: 'guide-label',
        ...(keys(update).length > 0 ? {encode: {update}} : {})
      };
    }

    const axes = headerCmpt.axes;

    const hasAxes = axes && axes.length > 0;
    if (title || hasAxes) {
      const sizeChannel = channel === 'row' ? 'height' : 'width';

      return {
        name: model.getName(`${channel}_${headerType}`),
        type: 'group',
        role: `${channel}-${headerType}`,
        ...(layoutHeader.facetFieldDef ? {
          from: {data: model.getName(channel + '_domain')},
          sort: {
            field: vgField(facetFieldDef, {expr: 'datum'}),
            order: facetFieldDef.sort || 'ascending'
          }
        } : {}),
        ...(title ? {title} : {}),
        ...(headerCmpt.sizeSignal ? {
          encode: {
            update: {
              [sizeChannel]: headerCmpt.sizeSignal
            }
          }
        }: {}),
        ...(hasAxes ? {axes} : {})
      };
    }
  }
  return null;
}
