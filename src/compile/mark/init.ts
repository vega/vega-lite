import {Orientation, SignalRef} from 'vega';
import {isBinned, isBinning} from '../../bin.js';
import {
  isFieldDef,
  isNumericDataDef,
  isUnbinnedQuantitativeFieldOrDatumDef,
  isTypedFieldDef,
} from '../../channeldef.js';
import {Config} from '../../config.js';
import {Encoding, isAggregate} from '../../encoding.js';
import {replaceExprRef} from '../../expr.js';
import * as log from '../../log/index.js';
import {
  AREA,
  BAR,
  BAR_CORNER_RADIUS_INDEX as BAR_CORNER_RADIUS_END_INDEX,
  CIRCLE,
  IMAGE,
  LINE,
  Mark,
  MarkDef,
  POINT,
  RECT,
  RULE,
  SQUARE,
  TEXT,
  TICK,
} from '../../mark.js';
import {QUANTITATIVE, TEMPORAL} from '../../type.js';
import {contains, getFirstDefined} from '../../util.js';
import {getMarkConfig, getMarkPropOrConfig} from '../common.js';

export function initMarkdef(originalMarkDef: MarkDef, encoding: Encoding<string>, config: Config<SignalRef>) {
  // FIXME: markDef expects that exprRefs are replaced recursively but replaceExprRef only replaces the top level
  const markDef: MarkDef<Mark, SignalRef> = replaceExprRef(originalMarkDef) as any;

  // set orient, which can be overridden by rules as sometimes the specified orient is invalid.
  const specifiedOrient = getMarkPropOrConfig('orient', markDef, config);
  markDef.orient = orient(markDef.type, encoding, specifiedOrient);
  if (specifiedOrient !== undefined && specifiedOrient !== markDef.orient) {
    log.warn(log.message.orientOverridden(markDef.orient, specifiedOrient));
  }

  if (markDef.type === 'bar' && markDef.orient) {
    const cornerRadiusEnd = getMarkPropOrConfig('cornerRadiusEnd', markDef, config);
    if (cornerRadiusEnd !== undefined) {
      const newProps =
        (markDef.orient === 'horizontal' && encoding.x2) || (markDef.orient === 'vertical' && encoding.y2)
          ? (['cornerRadius'] as const)
          : BAR_CORNER_RADIUS_END_INDEX[markDef.orient];

      for (const newProp of newProps) {
        markDef[newProp] = cornerRadiusEnd;
      }

      if (markDef.cornerRadiusEnd !== undefined) {
        delete markDef.cornerRadiusEnd; // no need to keep the original cap cornerRadius
      }
    }
  }

  // set opacity and filled if not specified in mark config
  const specifiedOpacity = getMarkPropOrConfig('opacity', markDef, config);
  const specifiedFillOpacity = getMarkPropOrConfig('fillOpacity', markDef, config);
  if (specifiedOpacity === undefined && specifiedFillOpacity === undefined) {
    markDef.opacity = opacity(markDef.type, encoding);
  }

  // Set cursor, which should be pointer if href channel is present unless otherwise specified.
  // We will also set the cursor in parse via getMarkGroup since we need access to the selections.
  const specifiedCursor = getMarkPropOrConfig('cursor', markDef, config);
  if (specifiedCursor === undefined) {
    markDef.cursor = cursor(markDef, encoding, config);
  }

  return markDef;
}

function cursor(markDef: MarkDef<Mark, SignalRef>, encoding: Encoding<string>, config: Config<SignalRef>) {
  if (encoding.href || markDef.href || getMarkPropOrConfig('href', markDef, config)) {
    return 'pointer';
  }
  return markDef.cursor;
}

export const DEFAULT_REDUCED_OPACITY = 0.7;

function opacity(mark: Mark, encoding: Encoding<string>) {
  if (contains([POINT, TICK, CIRCLE, SQUARE], mark) && !isAggregate(encoding)) {
    return DEFAULT_REDUCED_OPACITY;
  }
  return undefined;
}

export function defaultFilled(markDef: MarkDef, config: Config<SignalRef>, {graticule}: {graticule: boolean}) {
  if (graticule) {
    return false;
  }
  const filledConfig = getMarkConfig('filled', markDef, config);
  const mark = markDef.type;
  return getFirstDefined(filledConfig, mark !== POINT && mark !== LINE && mark !== RULE);
}

function orient(mark: Mark, encoding: Encoding<string>, specifiedOrient: Orientation): Orientation {
  switch (mark) {
    case POINT:
    case CIRCLE:
    case SQUARE:
    case RECT:
    case IMAGE:
      // orient is meaningless for these marks.
      return undefined;
  }

  const {x, y, x2, y2} = encoding;

  switch (mark) {
    case TEXT:
    case BAR:
      if (isFieldDef(x) && (isBinned(x.bin) || (isFieldDef(y) && y.aggregate && !x.aggregate))) {
        return 'vertical';
      }
      if (isFieldDef(y) && (isBinned(y.bin) || (isFieldDef(x) && x.aggregate && !y.aggregate))) {
        return 'horizontal';
      }
      if (y2 || x2) {
        // Ranged bar does not always have clear orientation, so we allow overriding
        if (specifiedOrient) {
          return specifiedOrient;
        }

        // If y is range and x is non-range, non-bin Q
        if (!x2) {
          if ((isFieldDef(x) && x.type === QUANTITATIVE && !isBinning(x.bin)) || isNumericDataDef(x)) {
            if (isFieldDef(y) && isBinned(y.bin)) {
              return 'horizontal';
            }
          }
          return 'vertical';
        }

        // If x is range and y is non-range, non-bin Q
        if (!y2) {
          if ((isFieldDef(y) && y.type === QUANTITATIVE && !isBinning(y.bin)) || isNumericDataDef(y)) {
            if (isFieldDef(x) && isBinned(x.bin)) {
              return 'vertical';
            }
          }
          return 'horizontal';
        }
      }

    // falls through
    case RULE:
      // return undefined for line segment rule and bar with both axis ranged
      // we have to ignore the case that the data are already binned
      if (x2 && !(isFieldDef(x) && isBinned(x.bin)) && y2 && !(isFieldDef(y) && isBinned(y.bin))) {
        return undefined;
      }

    // falls through
    case AREA:
      // If there are range for both x and y, y (vertical) has higher precedence.
      if (y2) {
        if (isFieldDef(y) && isBinned(y.bin)) {
          return 'horizontal';
        } else {
          return 'vertical';
        }
      } else if (x2) {
        if (isFieldDef(x) && isBinned(x.bin)) {
          return 'vertical';
        } else {
          return 'horizontal';
        }
      } else if (mark === RULE) {
        if (x && !y) {
          return 'vertical';
        } else if (y && !x) {
          return 'horizontal';
        }
      }

    // falls through
    case LINE:
    case TICK: {
      const xIsMeasure = isUnbinnedQuantitativeFieldOrDatumDef(x);
      const yIsMeasure = isUnbinnedQuantitativeFieldOrDatumDef(y);

      if (specifiedOrient) {
        return specifiedOrient;
      } else if (xIsMeasure && !yIsMeasure) {
        // Tick is opposite to bar, line, area
        return mark !== 'tick' ? 'horizontal' : 'vertical';
      } else if (!xIsMeasure && yIsMeasure) {
        // Tick is opposite to bar, line, area
        return mark !== 'tick' ? 'vertical' : 'horizontal';
      } else if (xIsMeasure && yIsMeasure) {
        return 'vertical';
      } else {
        const xIsTemporal = isTypedFieldDef(x) && x.type === TEMPORAL;
        const yIsTemporal = isTypedFieldDef(y) && y.type === TEMPORAL;

        // x: T, y: N --> vertical tick
        if (xIsTemporal && !yIsTemporal) {
          return 'vertical';
        } else if (!xIsTemporal && yIsTemporal) {
          return 'horizontal';
        }
      }
      return undefined;
    }
  }
  return 'vertical';
}
