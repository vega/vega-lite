/**
 * Utility for generating row / column headers
 */
import {AxisOrient, TitleAnchor, TitleConfig} from 'vega';
import {isArray} from 'vega-util';
import {FACET_CHANNELS, FacetChannel} from '../../channel';
import {Config} from '../../config';
import {vgField} from '../../fielddef';
import {
  HEADER_LABEL_PROPERTIES,
  HEADER_LABEL_PROPERTIES_MAP,
  HEADER_TITLE_PROPERTIES,
  HEADER_TITLE_PROPERTIES_MAP,
  HeaderConfig
} from '../../header';
import {isSortField} from '../../sort';
import {FacetFieldDef} from '../../spec/facet';
import {keys} from '../../util';
import {RowCol, VgComparator, VgMarkGroup} from '../../vega.schema';
import {formatSignalRef} from '../common';
import {sortArrayIndexField} from '../data/calculate';
import {Model} from '../model';
import {
  HEADER_TYPES,
  HeaderChannel,
  HeaderComponent,
  HeaderType,
  LayoutHeaderComponent,
  LayoutHeaderComponentIndex
} from './component';

export function getHeaderType(orient: AxisOrient) {
  if (orient === 'top' || orient === 'left') {
    return 'header';
  }
  return 'footer';
}

export function assembleTitleGroup(model: Model, channel: FacetChannel) {
  const title = model.component.layoutHeaders[channel].title;
  const config = model.config ? model.config : undefined;
  const facetFieldDef = model.component.layoutHeaders[channel].facetFieldDef
    ? model.component.layoutHeaders[channel].facetFieldDef
    : undefined;

  const titleAnchor = (facetFieldDef && facetFieldDef.header && facetFieldDef.header.titleAnchor) || undefined;

  return {
    name: `${channel}-title`,
    type: 'group',
    role: `${channel === 'facet' ? 'column' : channel}-title`,
    title: {
      text: title,
      offset: 10,
      ...(channel === 'row' ? {orient: 'left'} : {}),
      style: 'guide-title',
      ...titleAlign(titleAnchor),
      ...getHeaderProperties(config, facetFieldDef, HEADER_TITLE_PROPERTIES, HEADER_TITLE_PROPERTIES_MAP)
    }
  };
}

export function titleAlign(titleAnchor: TitleAnchor) {
  switch (titleAnchor) {
    case 'start':
      return {align: 'left'};
    case 'end':
      return {align: 'right'};
  }
  // TODO: take TitleAngle into account for the "middle" case
  return {};
}

export function assembleHeaderGroups(model: Model, channel: HeaderChannel): VgMarkGroup[] {
  const layoutHeader = model.component.layoutHeaders[channel];
  const groups = [];
  for (const headerType of HEADER_TYPES) {
    if (layoutHeader[headerType]) {
      for (const headerCmpt of layoutHeader[headerType]) {
        groups.push(assembleHeaderGroup(model, channel, headerType, layoutHeader, headerCmpt));
      }
    }
  }
  return groups;
}

// 0, (0,90), 90, (90, 180), 180, (180, 270), 270, (270, 0)

export function labelAlign(angle: number) {
  // to keep angle in [0, 360)
  angle = ((angle % 360) + 360) % 360;
  if ((angle + 90) % 180 === 0) {
    // for 90 and 270
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
    return {baseline: 'top'};
  }
  return {baseline: 'middle'};
}

function getSort(facetFieldDef: FacetFieldDef<string>, channel: 'row' | 'column'): VgComparator {
  const {sort} = facetFieldDef;
  if (isSortField(sort)) {
    return {
      field: vgField(sort, {expr: 'datum'}),
      order: sort.order || 'ascending'
    };
  } else if (isArray(sort)) {
    return {
      field: sortArrayIndexField(facetFieldDef, channel, {expr: 'datum'}),
      order: 'ascending'
    };
  } else {
    return {
      field: vgField(facetFieldDef, {expr: 'datum'}),
      order: sort || 'ascending'
    };
  }
}

export function assembleLabelTitle(facetFieldDef: FacetFieldDef<string>, channel: FacetChannel, config: Config) {
  const {header = {}} = facetFieldDef;
  const {format, labelAngle} = header;

  const update = {
    ...labelAlign(labelAngle)
  };

  return {
    text: formatSignalRef(facetFieldDef, format, 'parent', config),
    offset: 10,
    ...(channel === 'row' ? {orient: 'left'} : {}),
    style: 'guide-label',
    frame: 'group',
    ...(labelAngle !== undefined ? {angle: labelAngle} : {}),
    ...labelBaseline(labelAngle),
    ...getHeaderProperties(config, facetFieldDef, HEADER_LABEL_PROPERTIES, HEADER_LABEL_PROPERTIES_MAP),
    ...(keys(update).length > 0 ? {encode: {update}} : {})
  };
}

export function assembleHeaderGroup(
  model: Model,
  channel: HeaderChannel,
  headerType: HeaderType,
  layoutHeader: LayoutHeaderComponent,
  headerCmpt: HeaderComponent
) {
  if (headerCmpt) {
    let title = null;
    const {facetFieldDef} = layoutHeader;
    const config = model.config ? model.config : undefined;
    if (facetFieldDef && headerCmpt.labels) {
      title = assembleLabelTitle(facetFieldDef, channel, config);
    }

    const axes = headerCmpt.axes;

    const hasAxes = axes && axes.length > 0;
    if (title || hasAxes) {
      const sizeChannel = channel === 'row' ? 'height' : 'width';

      return {
        name: model.getName(`${channel}_${headerType}`),
        type: 'group',
        role: `${channel}-${headerType}`,
        ...(layoutHeader.facetFieldDef
          ? {
              from: {data: model.getName(channel + '_domain')},
              sort: getSort(facetFieldDef, channel)
            }
          : {}),
        ...(title ? {title} : {}),
        ...(headerCmpt.sizeSignal
          ? {
              encode: {
                update: {
                  [sizeChannel]: headerCmpt.sizeSignal
                }
              }
            }
          : {}),
        ...(hasAxes ? {axes} : {})
      };
    }
  }
  return null;
}

export function getLayoutTitleBand(titleAnchor: TitleAnchor) {
  if (titleAnchor === 'start') {
    return 0;
  } else if (titleAnchor === 'end') {
    return 1;
  }
  return undefined;
}

export function assembleLayoutTitleBand(headerComponentIndex: LayoutHeaderComponentIndex): RowCol<number> {
  const titleBand = {};

  for (const channel of FACET_CHANNELS) {
    const headerComponent = headerComponentIndex[channel];
    if (headerComponent && headerComponent.facetFieldDef && headerComponent.facetFieldDef.header) {
      const {titleAnchor} = headerComponent.facetFieldDef.header;
      const band = getLayoutTitleBand(titleAnchor);
      if (band !== undefined) {
        titleBand[channel === 'facet' ? 'column' : channel] = band;
      }
    }
  }

  return keys(titleBand).length > 0 ? titleBand : undefined;
}

export function getHeaderProperties(
  config: Config,
  facetFieldDef: FacetFieldDef<string>,
  properties: (keyof HeaderConfig)[],
  propertiesMap: {[k in keyof HeaderConfig]: keyof TitleConfig}
) {
  const props = {};
  for (const prop of properties) {
    if (!propertiesMap[prop]) {
      continue;
    }
    if (config && config.header) {
      if (config.header[prop]) {
        props[propertiesMap[prop]] = config.header[prop];
      }
    }
    if (facetFieldDef && facetFieldDef.header) {
      if (facetFieldDef.header[prop]) {
        props[propertiesMap[prop]] = facetFieldDef.header[prop];
      }
    }
  }
  return props;
}
