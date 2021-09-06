/*
 * Constants and utilities for encoding channels (Visual variables)
 * such as 'x', 'y', 'color'.
 */

import {RangeType} from './compile/scale/type';
import {Encoding} from './encoding';
import {Mark} from './mark';
import {EncodingFacetMapping} from './spec/facet';
import {Flag, keys} from './util';

export type Channel = keyof Encoding<any>;
export type ExtendedChannel = Channel | FacetChannel;

// Facet
export const ROW = 'row' as const;
export const COLUMN = 'column' as const;

export const FACET = 'facet' as const;

// Position
export const X = 'x' as const;
export const Y = 'y' as const;
export const X2 = 'x2' as const;
export const Y2 = 'y2' as const;

// Position Offset
export const XOFFSET = 'xOffset' as const;
export const YOFFSET = 'yOffset' as const;

// Arc-Position
export const RADIUS = 'radius' as const;
export const RADIUS2 = 'radius2' as const;
export const THETA = 'theta' as const;
export const THETA2 = 'theta2' as const;

// Geo Position
export const LATITUDE = 'latitude' as const;
export const LONGITUDE = 'longitude' as const;
export const LATITUDE2 = 'latitude2' as const;
export const LONGITUDE2 = 'longitude2' as const;

// Mark property with scale
export const COLOR = 'color' as const;

export const FILL = 'fill' as const;

export const STROKE = 'stroke' as const;

export const SHAPE = 'shape' as const;
export const SIZE = 'size' as const;

export const ANGLE = 'angle' as const;

export const OPACITY = 'opacity' as const;
export const FILLOPACITY = 'fillOpacity' as const;

export const STROKEOPACITY = 'strokeOpacity' as const;

export const STROKEWIDTH = 'strokeWidth' as const;
export const STROKEDASH = 'strokeDash' as const;

// Non-scale channel
export const TEXT = 'text' as const;
export const ORDER = 'order' as const;
export const DETAIL = 'detail' as const;
export const KEY = 'key' as const;

export const TOOLTIP = 'tooltip' as const;
export const HREF = 'href' as const;

export const URL = 'url' as const;
export const DESCRIPTION = 'description' as const;

const POSITION_CHANNEL_INDEX = {
  x: 1,
  y: 1,
  x2: 1,
  y2: 1
} as const;

export type PositionChannel = keyof typeof POSITION_CHANNEL_INDEX;

const POLAR_POSITION_CHANNEL_INDEX = {
  theta: 1,
  theta2: 1,
  radius: 1,
  radius2: 1
} as const;

export type PolarPositionChannel = keyof typeof POLAR_POSITION_CHANNEL_INDEX;

export function isPolarPositionChannel(c: Channel): c is PolarPositionChannel {
  return c in POLAR_POSITION_CHANNEL_INDEX;
}

const GEO_POSIITON_CHANNEL_INDEX = {
  longitude: 1,
  longitude2: 1,
  latitude: 1,
  latitude2: 1
} as const;

export type GeoPositionChannel = keyof typeof GEO_POSIITON_CHANNEL_INDEX;

export function getPositionChannelFromLatLong(channel: GeoPositionChannel): PositionChannel {
  switch (channel) {
    case LATITUDE:
      return 'y';
    case LATITUDE2:
      return 'y2';
    case LONGITUDE:
      return 'x';
    case LONGITUDE2:
      return 'x2';
  }
}

export function isGeoPositionChannel(c: Channel): c is GeoPositionChannel {
  return c in GEO_POSIITON_CHANNEL_INDEX;
}

export const GEOPOSITION_CHANNELS = keys(GEO_POSIITON_CHANNEL_INDEX);

const UNIT_CHANNEL_INDEX: Flag<Channel> = {
  ...POSITION_CHANNEL_INDEX,
  ...POLAR_POSITION_CHANNEL_INDEX,

  ...GEO_POSIITON_CHANNEL_INDEX,
  xOffset: 1,
  yOffset: 1,

  // color
  color: 1,
  fill: 1,
  stroke: 1,

  // other non-position with scale
  opacity: 1,
  fillOpacity: 1,
  strokeOpacity: 1,

  strokeWidth: 1,
  strokeDash: 1,
  size: 1,
  angle: 1,
  shape: 1,

  // channels without scales
  order: 1,
  text: 1,
  detail: 1,
  key: 1,
  tooltip: 1,
  href: 1,
  url: 1,
  description: 1
};

export type ColorChannel = 'color' | 'fill' | 'stroke';

export function isColorChannel(channel: Channel): channel is ColorChannel {
  return channel === COLOR || channel === FILL || channel === STROKE;
}

export type FacetChannel = keyof EncodingFacetMapping<any, any>;

const FACET_CHANNEL_INDEX: Flag<keyof EncodingFacetMapping<any, any>> = {
  row: 1,
  column: 1,
  facet: 1
};

export const FACET_CHANNELS = keys(FACET_CHANNEL_INDEX);

const CHANNEL_INDEX = {
  ...UNIT_CHANNEL_INDEX,
  ...FACET_CHANNEL_INDEX
};

export const CHANNELS = keys(CHANNEL_INDEX);

const {order: _o, detail: _d, tooltip: _tt1, ...SINGLE_DEF_CHANNEL_INDEX} = CHANNEL_INDEX;
const {row: _r, column: _c, facet: _f, ...SINGLE_DEF_UNIT_CHANNEL_INDEX} = SINGLE_DEF_CHANNEL_INDEX;
/**
 * Channels that cannot have an array of channelDef.
 * model.fieldDef, getFieldDef only work for these channels.
 *
 * (The only two channels that can have an array of channelDefs are "detail" and "order".
 * Since there can be multiple fieldDefs for detail and order, getFieldDef/model.fieldDef
 * are not applicable for them. Similarly, selection projection won't work with "detail" and "order".)
 */

export const SINGLE_DEF_CHANNELS = keys(SINGLE_DEF_CHANNEL_INDEX);

export type SingleDefChannel = typeof SINGLE_DEF_CHANNELS[number];

export const SINGLE_DEF_UNIT_CHANNELS = keys(SINGLE_DEF_UNIT_CHANNEL_INDEX);

export type SingleDefUnitChannel = typeof SINGLE_DEF_UNIT_CHANNELS[number];

export function isSingleDefUnitChannel(str: string): str is SingleDefUnitChannel {
  return !!SINGLE_DEF_UNIT_CHANNEL_INDEX[str];
}

export function isChannel(str: string): str is Channel {
  return !!CHANNEL_INDEX[str];
}

export type SecondaryRangeChannel = 'x2' | 'y2' | 'latitude2' | 'longitude2' | 'theta2' | 'radius2';

export const SECONDARY_RANGE_CHANNEL: SecondaryRangeChannel[] = [X2, Y2, LATITUDE2, LONGITUDE2, THETA2, RADIUS2];

export function isSecondaryRangeChannel(c: ExtendedChannel): c is SecondaryRangeChannel {
  const main = getMainRangeChannel(c);
  return main !== c;
}

export type MainChannelOf<C extends ExtendedChannel> = C extends 'x2'
  ? 'x'
  : C extends 'y2'
  ? 'y'
  : C extends 'latitude2'
  ? 'latitude'
  : C extends 'longitude2'
  ? 'longitude'
  : C extends 'theta2'
  ? 'theta'
  : C extends 'radius2'
  ? 'radius'
  : C;

/**
 * Get the main channel for a range channel. E.g. `x` for `x2`.
 */
export function getMainRangeChannel<C extends ExtendedChannel>(channel: C): MainChannelOf<C> {
  switch (channel) {
    case X2:
      return X as MainChannelOf<C>;
    case Y2:
      return Y as MainChannelOf<C>;
    case LATITUDE2:
      return LATITUDE as MainChannelOf<C>;
    case LONGITUDE2:
      return LONGITUDE as MainChannelOf<C>;
    case THETA2:
      return THETA as MainChannelOf<C>;
    case RADIUS2:
      return RADIUS as MainChannelOf<C>;
  }
  return channel as MainChannelOf<C>;
}

export type SecondaryChannelOf<C extends Channel> = C extends 'x'
  ? 'x2'
  : C extends 'y'
  ? 'y2'
  : C extends 'latitude'
  ? 'latitude2'
  : C extends 'longitude'
  ? 'longitude2'
  : C extends 'theta'
  ? 'theta2'
  : C extends 'radius'
  ? 'radius2'
  : undefined;

export function getVgPositionChannel(channel: PolarPositionChannel | PositionChannel) {
  if (isPolarPositionChannel(channel)) {
    switch (channel) {
      case THETA:
        return 'startAngle';
      case THETA2:
        return 'endAngle';
      case RADIUS:
        return 'outerRadius';
      case RADIUS2:
        return 'innerRadius';
    }
  }
  return channel;
}

/**
 * Get the main channel for a range channel. E.g. `x` for `x2`.
 */
export function getSecondaryRangeChannel<C extends Channel>(channel: C): SecondaryChannelOf<C> | undefined {
  switch (channel) {
    case X:
      return X2 as SecondaryChannelOf<C>;
    case Y:
      return Y2 as SecondaryChannelOf<C>;
    case LATITUDE:
      return LATITUDE2 as SecondaryChannelOf<C>;
    case LONGITUDE:
      return LONGITUDE2 as SecondaryChannelOf<C>;
    case THETA:
      return THETA2 as SecondaryChannelOf<C>;
    case RADIUS:
      return RADIUS2 as SecondaryChannelOf<C>;
  }
  return undefined;
}

export function getSizeChannel(channel: PositionChannel): 'width' | 'height';
export function getSizeChannel(channel: Channel): 'width' | 'height' | undefined;
export function getSizeChannel(channel: Channel): 'width' | 'height' | undefined {
  switch (channel) {
    case X:
    case X2:
      return 'width';
    case Y:
    case Y2:
      return 'height';
  }
  return undefined;
}

/**
 * Get the main channel for a range channel. E.g. `x` for `x2`.
 */
export function getOffsetChannel(channel: Channel) {
  switch (channel) {
    case X:
      return 'xOffset';
    case Y:
      return 'yOffset';
    case X2:
      return 'x2Offset';
    case Y2:
      return 'y2Offset';
    case THETA:
      return 'thetaOffset';
    case RADIUS:
      return 'radiusOffset';
    case THETA2:
      return 'theta2Offset';
    case RADIUS2:
      return 'radius2Offset';
  }
  return undefined;
}

/**
 * Get the main channel for a range channel. E.g. `x` for `x2`.
 */
export function getOffsetScaleChannel(channel: Channel): OffsetScaleChannel {
  switch (channel) {
    case X:
      return 'xOffset';
    case Y:
      return 'yOffset';
  }
  return undefined;
}

export function getMainChannelFromOffsetChannel(channel: OffsetScaleChannel): PositionScaleChannel {
  switch (channel) {
    case 'xOffset':
      return 'x';
    case 'yOffset':
      return 'y';
  }
}

// CHANNELS without COLUMN, ROW
export const UNIT_CHANNELS = keys(UNIT_CHANNEL_INDEX);

// NONPOSITION_CHANNELS = UNIT_CHANNELS without X, Y, X2, Y2;
const {
  x: _x,
  y: _y,
  // x2 and y2 share the same scale as x and y
  x2: _x2,
  y2: _y2,
  //
  xOffset: _xo,
  yOffset: _yo,
  latitude: _latitude,
  longitude: _longitude,
  latitude2: _latitude2,
  longitude2: _longitude2,
  theta: _theta,
  theta2: _theta2,
  radius: _radius,
  radius2: _radius2,
  // The rest of unit channels then have scale
  ...NONPOSITION_CHANNEL_INDEX
} = UNIT_CHANNEL_INDEX;

export const NONPOSITION_CHANNELS = keys(NONPOSITION_CHANNEL_INDEX);
export type NonPositionChannel = typeof NONPOSITION_CHANNELS[number];

const POSITION_SCALE_CHANNEL_INDEX = {
  x: 1,
  y: 1
} as const;
export const POSITION_SCALE_CHANNELS = keys(POSITION_SCALE_CHANNEL_INDEX);
export type PositionScaleChannel = keyof typeof POSITION_SCALE_CHANNEL_INDEX;

export function isXorY(channel: ExtendedChannel): channel is PositionScaleChannel {
  return channel in POSITION_SCALE_CHANNEL_INDEX;
}

export const POLAR_POSITION_SCALE_CHANNEL_INDEX = {
  theta: 1,
  radius: 1
} as const;

export const POLAR_POSITION_SCALE_CHANNELS = keys(POLAR_POSITION_SCALE_CHANNEL_INDEX);
export type PolarPositionScaleChannel = keyof typeof POLAR_POSITION_SCALE_CHANNEL_INDEX;

export function getPositionScaleChannel(sizeType: 'width' | 'height'): PositionScaleChannel {
  return sizeType === 'width' ? X : Y;
}

const OFFSET_SCALE_CHANNEL_INDEX: {xOffset: 1; yOffset: 1} = {xOffset: 1, yOffset: 1};

export const OFFSET_SCALE_CHANNELS = keys(OFFSET_SCALE_CHANNEL_INDEX);

export type OffsetScaleChannel = typeof OFFSET_SCALE_CHANNELS[0];

export function isXorYOffset(channel: Channel): channel is OffsetScaleChannel {
  return channel in OFFSET_SCALE_CHANNEL_INDEX;
}

// NON_POSITION_SCALE_CHANNEL = SCALE_CHANNELS without position / offset
const {
  // x2 and y2 share the same scale as x and y
  // text and tooltip have format instead of scale,
  // href has neither format, nor scale
  text: _t,
  tooltip: _tt,
  href: _hr,
  url: _u,
  description: _al,
  // detail and order have no scale
  detail: _dd,
  key: _k,
  order: _oo,
  ...NONPOSITION_SCALE_CHANNEL_INDEX
} = NONPOSITION_CHANNEL_INDEX;
export const NONPOSITION_SCALE_CHANNELS = keys(NONPOSITION_SCALE_CHANNEL_INDEX);
export type NonPositionScaleChannel = typeof NONPOSITION_SCALE_CHANNELS[number];

export function isNonPositionScaleChannel(channel: Channel): channel is NonPositionScaleChannel {
  return !!NONPOSITION_CHANNEL_INDEX[channel];
}

/**
 * @returns whether Vega supports legends for a particular channel
 */
export function supportLegend(channel: NonPositionScaleChannel) {
  switch (channel) {
    case COLOR:
    case FILL:
    case STROKE:
    case SIZE:
    case SHAPE:
    case OPACITY:
    case STROKEWIDTH:
    case STROKEDASH:
      return true;
    case FILLOPACITY:
    case STROKEOPACITY:
    case ANGLE:
      return false;
  }
}

// Declare SCALE_CHANNEL_INDEX
const SCALE_CHANNEL_INDEX = {
  ...POSITION_SCALE_CHANNEL_INDEX,
  ...POLAR_POSITION_SCALE_CHANNEL_INDEX,
  ...OFFSET_SCALE_CHANNEL_INDEX,
  ...NONPOSITION_SCALE_CHANNEL_INDEX
};

/** List of channels with scales */
export const SCALE_CHANNELS = keys(SCALE_CHANNEL_INDEX);
export type ScaleChannel = typeof SCALE_CHANNELS[number];

export function isScaleChannel(channel: Channel): channel is ScaleChannel {
  return !!SCALE_CHANNEL_INDEX[channel];
}

export type SupportedMark = Partial<Record<Mark, 'always' | 'binned'>>;

/**
 * Return whether a channel supports a particular mark type.
 * @param channel  channel name
 * @param mark the mark type
 * @return whether the mark supports the channel
 */
export function supportMark(channel: ExtendedChannel, mark: Mark) {
  return getSupportedMark(channel)[mark];
}

const ALL_MARKS: Record<Mark, 'always'> = {
  // all marks
  arc: 'always',
  area: 'always',
  bar: 'always',
  circle: 'always',
  geoshape: 'always',
  image: 'always',
  line: 'always',
  rule: 'always',
  point: 'always',
  rect: 'always',
  square: 'always',
  trail: 'always',
  text: 'always',
  tick: 'always'
};

const {geoshape: _g, ...ALL_MARKS_EXCEPT_GEOSHAPE} = ALL_MARKS;

/**
 * Return a dictionary showing whether a channel supports mark type.
 * @param channel
 * @return A dictionary mapping mark types to 'always', 'binned', or undefined
 */
function getSupportedMark(channel: ExtendedChannel): SupportedMark {
  switch (channel) {
    case COLOR:
    case FILL:
    case STROKE:
    // falls through

    case DESCRIPTION:
    case DETAIL:
    case KEY:
    case TOOLTIP:
    case HREF:
    case ORDER: // TODO: revise (order might not support rect, which is not stackable?)
    case OPACITY:
    case FILLOPACITY:
    case STROKEOPACITY:
    case STROKEWIDTH:

    // falls through

    case FACET:
    case ROW: // falls through
    case COLUMN:
      return ALL_MARKS;
    case X:
    case Y:
    case XOFFSET:
    case YOFFSET:
    case LATITUDE:
    case LONGITUDE:
      // all marks except geoshape. geoshape does not use X, Y -- it uses a projection
      return ALL_MARKS_EXCEPT_GEOSHAPE;
    case X2:
    case Y2:
    case LATITUDE2:
    case LONGITUDE2:
      return {
        area: 'always',
        bar: 'always',
        image: 'always',
        rect: 'always',
        rule: 'always',
        circle: 'binned',
        point: 'binned',
        square: 'binned',
        tick: 'binned',
        line: 'binned',
        trail: 'binned'
      };
    case SIZE:
      return {
        point: 'always',
        tick: 'always',
        rule: 'always',
        circle: 'always',
        square: 'always',
        bar: 'always',
        text: 'always',
        line: 'always',
        trail: 'always'
      };
    case STROKEDASH:
      return {
        line: 'always',
        point: 'always',
        tick: 'always',
        rule: 'always',
        circle: 'always',
        square: 'always',
        bar: 'always',
        geoshape: 'always'
      };
    case SHAPE:
      return {point: 'always', geoshape: 'always'};
    case TEXT:
      return {text: 'always'};
    case ANGLE:
      return {point: 'always', square: 'always', text: 'always'};
    case URL:
      return {image: 'always'};
    case THETA:
      return {text: 'always', arc: 'always'};
    case RADIUS:
      return {text: 'always', arc: 'always'};
    case THETA2:
    case RADIUS2:
      return {arc: 'always'};
  }
}

export function rangeType(channel: ExtendedChannel): RangeType {
  switch (channel) {
    case X:
    case Y:
    case THETA:
    case RADIUS:
    case XOFFSET:
    case YOFFSET:
    case SIZE:
    case ANGLE:
    case STROKEWIDTH:
    case OPACITY:
    case FILLOPACITY:
    case STROKEOPACITY:

    // X2 and Y2 use X and Y scales, so they similarly have continuous range. [falls through]
    case X2:
    case Y2:
    case THETA2:
    case RADIUS2:
      return undefined;

    case FACET:
    case ROW:
    case COLUMN:
    case SHAPE:
    case STROKEDASH:
    // TEXT, TOOLTIP, URL, and HREF have no scale but have discrete output [falls through]
    case TEXT:
    case TOOLTIP:
    case HREF:
    case URL:
    case DESCRIPTION:
      return 'discrete';

    // Color can be either continuous or discrete, depending on scale type.
    case COLOR:
    case FILL:
    case STROKE:
      return 'flexible';

    // No scale, no range type.

    case LATITUDE:
    case LONGITUDE:
    case LATITUDE2:
    case LONGITUDE2:
    case DETAIL:
    case KEY:
    case ORDER:
      return undefined;
  }
}
