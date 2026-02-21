/**
 * Utility for generating row / column headers
 */

import {SignalRef, TitleAnchor, TitleConfig} from 'vega';
import {isArray} from 'vega-util';
import {FacetChannel, FACET_CHANNELS} from '../../channel.js';
import {vgField} from '../../channeldef.js';
import {Config} from '../../config.js';
import {ExprRef} from '../../expr.js';
import {
  CoreHeaderInternal,
  HEADER_LABEL_PROPERTIES,
  HEADER_LABEL_PROPERTIES_MAP,
  HEADER_TITLE_PROPERTIES,
  HEADER_TITLE_PROPERTIES_MAP,
} from '../../header.js';
import {isSortField} from '../../sort.js';
import {FacetFieldDef, isFacetMapping} from '../../spec/facet.js';
import {contains, isEmpty, normalizeAngle, replaceAll} from '../../util.js';
import {isSignalRef, RowCol, VgComparator, VgMarkGroup, VgTitle} from '../../vega.schema.js';
import {defaultLabelAlign, defaultLabelBaseline} from '../axis/properties.js';
import {signalRefOrValue} from '../common.js';
import {sortArrayIndexField} from '../data/calculate.js';
import {formatSignalRef} from '../format.js';
import {isFacetModel, Model} from '../model.js';
import {getHeaderChannel, getHeaderProperties, getHeaderProperty} from './common.js';
import {
  HeaderChannel,
  HeaderComponent,
  HeaderType,
  HEADER_TYPES,
  LayoutHeaderComponent,
  LayoutHeaderComponentIndex,
} from './component.js';

// TODO: rename to assembleHeaderTitleGroup
export function assembleTitleGroup(model: Model, channel: FacetChannel) {
  const title = model.component.layoutHeaders[channel].title;
  const config = model.config ? model.config : undefined;
  const facetFieldDef = model.component.layoutHeaders[channel].facetFieldDef
    ? model.component.layoutHeaders[channel].facetFieldDef
    : undefined;

  const {
    titleAnchor,
    titleAngle: ta,
    titleOrient,
  } = getHeaderProperties(['titleAnchor', 'titleAngle', 'titleOrient'], facetFieldDef.header, config, channel);
  const headerChannel = getHeaderChannel(channel, titleOrient);

  const titleAngle = normalizeAngle(ta);

  return {
    name: `${channel}-title`,
    type: 'group',
    role: `${headerChannel}-title`,
    title: {
      text: title,
      ...(channel === 'row' ? {orient: 'left'} : {}),
      style: 'guide-title',
      ...defaultHeaderGuideBaseline(titleAngle, headerChannel),
      ...defaultHeaderGuideAlign(headerChannel, titleAngle, titleAnchor),
      ...assembleHeaderProperties(config, facetFieldDef, channel, HEADER_TITLE_PROPERTIES, HEADER_TITLE_PROPERTIES_MAP),
    },
  };
}

export function defaultHeaderGuideAlign(headerChannel: HeaderChannel, angle: number, anchor: TitleAnchor = 'middle') {
  switch (anchor) {
    case 'start':
      return {align: 'left'};
    case 'end':
      return {align: 'right'};
  }

  const align = defaultLabelAlign(angle, headerChannel === 'row' ? 'left' : 'top', headerChannel === 'row' ? 'y' : 'x');
  return align ? {align} : {};
}

export function defaultHeaderGuideBaseline(angle: number, channel: FacetChannel) {
  const baseline = defaultLabelBaseline(angle, channel === 'row' ? 'left' : 'top', channel === 'row' ? 'y' : 'x', true);
  return baseline ? {baseline} : {};
}

export function assembleHeaderGroups(model: Model, channel: HeaderChannel): VgMarkGroup[] {
  const layoutHeader = model.component.layoutHeaders[channel];
  const groups = [];
  for (const headerType of HEADER_TYPES) {
    if (layoutHeader[headerType]) {
      for (const headerComponent of layoutHeader[headerType]) {
        const group = assembleHeaderGroup(model, channel, headerType, layoutHeader, headerComponent);
        if (group != null) {
          groups.push(group);
        }
      }
    }
  }
  return groups;
}

function getSort(facetFieldDef: FacetFieldDef<string>, channel: HeaderChannel): VgComparator {
  const {sort} = facetFieldDef;
  if (isSortField(sort)) {
    return {
      field: vgField(sort, {expr: 'datum'}),
      order: sort.order ?? 'ascending',
    };
  } else if (isArray(sort)) {
    return {
      field: sortArrayIndexField(facetFieldDef, channel, {expr: 'datum'}),
      order: 'ascending',
    };
  } else {
    return {
      field: vgField(facetFieldDef, {expr: 'datum'}),
      order: sort ?? 'ascending',
    };
  }
}

export function assembleLabelTitle(
  facetFieldDef: FacetFieldDef<string, SignalRef | ExprRef>,
  channel: FacetChannel,
  config: Config<SignalRef | ExprRef>,
) {
  const {format, formatType, labelAngle, labelAnchor, labelOrient, labelExpr} = getHeaderProperties(
    ['format', 'formatType', 'labelAngle', 'labelAnchor', 'labelOrient', 'labelExpr'],
    facetFieldDef.header,
    config,
    channel,
  );

  const titleTextExpr = formatSignalRef({
    fieldOrDatumDef: facetFieldDef,
    format,
    formatType,
    expr: 'parent',
    config,
  }).signal;
  const headerChannel = getHeaderChannel(channel, labelOrient);

  return {
    text: {
      signal: labelExpr
        ? (transformHeaderSignalExpression({signal: labelExpr}, facetFieldDef, titleTextExpr) as SignalRef).signal
        : titleTextExpr,
    },
    ...(channel === 'row' ? {orient: 'left'} : {}),
    style: 'guide-label',
    frame: 'group',
    ...defaultHeaderGuideBaseline(labelAngle, headerChannel),
    ...defaultHeaderGuideAlign(headerChannel, labelAngle, labelAnchor),
    ...assembleHeaderProperties(
      config,
      facetFieldDef,
      channel,
      HEADER_LABEL_PROPERTIES,
      HEADER_LABEL_PROPERTIES_MAP,
      titleTextExpr,
    ),
  };
}

export function assembleHeaderGroup(
  model: Model,
  channel: HeaderChannel,
  headerType: HeaderType,
  layoutHeader: LayoutHeaderComponent,
  headerComponent: HeaderComponent,
) {
  if (headerComponent) {
    let title = null;
    const {facetFieldDef} = layoutHeader;
    const config = model.config ? model.config : undefined;
    if (facetFieldDef && headerComponent.labels) {
      const {labelOrient} = getHeaderProperties(['labelOrient'], facetFieldDef.header, config, channel);

      // Include label title in the header if orient aligns with the channel
      if (
        (channel === 'row' && !contains(['top', 'bottom'], labelOrient)) ||
        (channel === 'column' && !contains(['left', 'right'], labelOrient))
      ) {
        title = assembleLabelTitle(facetFieldDef, channel, config);
      }
    }

    const isFacetWithoutRowCol = isFacetModel(model) && !isFacetMapping(model.facet);

    const axes = headerComponent.axes;

    const hasAxes = axes?.length > 0;
    if (title || hasAxes) {
      const sizeChannel = channel === 'row' ? 'height' : 'width';

      return {
        name: model.getName(`${channel}_${headerType}`),
        type: 'group',
        role: `${channel}-${headerType}`,

        ...(layoutHeader.facetFieldDef
          ? {
              from: {data: model.getName(`${channel}_domain`)},
              sort: getSort(facetFieldDef, channel),
            }
          : {}),
        ...(hasAxes && isFacetWithoutRowCol
          ? {
              from: {data: model.getName(`facet_domain_${channel}`)},
            }
          : {}),

        ...(title ? {title} : {}),
        ...(headerComponent.sizeSignal
          ? {
              encode: {
                update: {
                  [sizeChannel]: headerComponent.sizeSignal,
                },
              },
            }
          : {}),
        ...(hasAxes ? {axes} : {}),
      };
    }
  }
  return null;
}

const LAYOUT_TITLE_BAND: Record<HeaderChannel, Record<string, 0 | 1>> = {
  column: {
    start: 0,
    end: 1,
  },
  row: {
    start: 1,
    end: 0,
  },
};

export function getLayoutTitleBand(titleAnchor: TitleAnchor, headerChannel: HeaderChannel): 0 | 1 | undefined {
  return LAYOUT_TITLE_BAND[headerChannel][titleAnchor];
}

export function assembleLayoutTitleBand(
  headerComponentIndex: LayoutHeaderComponentIndex,
  config: Config<SignalRef | ExprRef>,
): RowCol<number> {
  const titleBand: Partial<RowCol<number>> = {};

  for (const channel of FACET_CHANNELS) {
    const headerComponent = headerComponentIndex[channel];
    if (headerComponent?.facetFieldDef) {
      const {titleAnchor, titleOrient} = getHeaderProperties(
        ['titleAnchor', 'titleOrient'],
        headerComponent.facetFieldDef.header,
        config,
        channel,
      );

      const headerChannel = getHeaderChannel(channel, titleOrient);
      const band = getLayoutTitleBand(titleAnchor, headerChannel);
      if (band !== undefined) {
        titleBand[headerChannel] = band;
      }
    }
  }

  return isEmpty(titleBand) ? undefined : titleBand;
}

/**
 * Transform signal expressions in header properties to use parent data context.
 * Headers compile to Vega title objects (with `parent` context), unlike axes which use `datum` context.
 * This function rewrites expressions to maintain a consistent user-facing API:
 * - `datum.value` → `parent["fieldName"]`
 * - `datum.label` → formatted text expression
 */
function transformHeaderSignalExpression<T>(
  value: T,
  facetFieldDef: FacetFieldDef<string, SignalRef | ExprRef>,
  titleTextExpr: string,
): T | SignalRef {
  if (value === undefined) {
    return undefined as T;
  }

  // First convert ExprRef {expr: ...} to SignalRef {signal: ...} if needed
  const signalValue = signalRefOrValue(value);

  if (isSignalRef(signalValue)) {
    const fieldRef = vgField(facetFieldDef, {expr: 'parent'});
    return {
      signal: replaceAll(replaceAll(signalValue.signal, 'datum.label', titleTextExpr), 'datum.value', fieldRef),
    };
  }
  return signalValue as T | SignalRef;
}

export function assembleHeaderProperties(
  config: Config<SignalRef | ExprRef>,
  facetFieldDef: FacetFieldDef<string, SignalRef | ExprRef>,
  channel: FacetChannel,
  properties: (keyof CoreHeaderInternal)[],
  propertiesMap: Partial<Record<keyof CoreHeaderInternal, keyof TitleConfig>>,
  titleTextExpr?: string,
): Partial<VgTitle> {
  const props: Record<string, any> = {};
  for (const prop of properties) {
    if (!propertiesMap[prop]) {
      continue;
    }

    let value = getHeaderProperty(prop, facetFieldDef?.header, config, channel);
    if (value !== undefined) {
      // Transform signal expressions to use parent context instead of datum context
      // (only for label properties where titleTextExpr is provided)
      if (titleTextExpr) {
        value = transformHeaderSignalExpression(value, facetFieldDef, titleTextExpr);
      }
      const mappedProp = propertiesMap[prop];
      if (mappedProp) {
        props[mappedProp] = value;
      }
    }
  }
  return props;
}
