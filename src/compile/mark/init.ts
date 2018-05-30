
import {Config} from '../../config';
import {Encoding, isAggregate} from '../../encoding';
import {FieldDef, isContinuous, isFieldDef} from '../../fielddef';
import * as log from '../../log';
import {AREA, BAR, CIRCLE, isMarkDef, LINE, Mark, MarkDef, POINT, RECT, RULE, SQUARE, TEXT, TICK} from '../../mark';
import {QUANTITATIVE, TEMPORAL} from '../../type';
import {contains} from '../../util';
import {getMarkConfig} from '../common';
import {Orient} from './../../vega.schema';


export function normalizeMarkDef(mark: Mark | MarkDef, encoding: Encoding<string>, config: Config) {
  const markDef: MarkDef = isMarkDef(mark) ? {...mark} : {type: mark};

  // set orient, which can be overridden by rules as sometimes the specified orient is invalid.
  const specifiedOrient = markDef.orient || getMarkConfig('orient', markDef, config);
  markDef.orient = orient(markDef.type, encoding, specifiedOrient);
  if (specifiedOrient !== undefined && specifiedOrient !== markDef.orient) {
    log.warn(log.message.orientOverridden(markDef.orient,specifiedOrient));
  }

  // set opacity and filled if not specified in mark config
  const specifiedOpacity = markDef.opacity !== undefined ? markDef.opacity : getMarkConfig('opacity', markDef, config);
  if (specifiedOpacity === undefined) {
    markDef.opacity = defaultOpacity(markDef.type, encoding);
  }

  const specifiedFilled = markDef.filled;
  if (specifiedFilled === undefined) {
    markDef.filled = filled(markDef, config);
  }
  return markDef;
}

function defaultOpacity(mark: Mark, encoding: Encoding<string>) {
  if (contains([POINT, TICK, CIRCLE, SQUARE], mark)) {
    // point-based marks
    if (!isAggregate(encoding)) {
      return 0.7;
    }
  }
  return undefined;
}

function filled(markDef: MarkDef, config: Config) {
  const filledConfig = getMarkConfig('filled', markDef, config);
  const mark = markDef.type;
  return filledConfig !== undefined ? filledConfig : mark !== POINT && mark !== LINE && mark !== RULE;
}

function orient(mark: Mark, encoding: Encoding<string>, specifiedOrient: Orient): Orient {
  switch (mark) {
    case POINT:
    case CIRCLE:
    case SQUARE:
    case TEXT:
    case RECT:
      // orient is meaningless for these marks.
      return undefined;
  }

  const yIsRange = encoding.y2;
  const xIsRange = encoding.x2;

  switch (mark) {
    case BAR:
      if (yIsRange || xIsRange) {
        // Ranged bar does not always have clear orientation, so we allow overriding
        if (specifiedOrient) {
          return specifiedOrient;
        }

        // If y is range and x is non-range, non-bin Q, y is likely a prebinned field
        const xDef = encoding.x;
        if (!xIsRange && isFieldDef(xDef) && xDef.type === QUANTITATIVE && !xDef.bin) {
          return 'horizontal';
        }

        // If x is range and y is non-range, non-bin Q, x is likely a prebinned field
        const yDef = encoding.y;
        if (!yIsRange && isFieldDef(yDef) && yDef.type === QUANTITATIVE && !yDef.bin) {
          return 'vertical';
        }
      }
      /* tslint:disable */
    case RULE: // intentionally fall through
      // return undefined for line segment rule and bar with both axis ranged
      if (xIsRange && yIsRange) {
        return undefined;
      }

    case AREA: // intentionally fall through
      // If there are range for both x and y, y (vertical) has higher precedence.
      if (yIsRange) {
        return 'vertical';
      } else if (xIsRange) {
        return 'horizontal';
      } else if (mark === RULE) {
        if (encoding.x && !encoding.y) {
          return 'vertical';
        } else if (encoding.y && !encoding.x) {
          return 'horizontal';
        }
      }


    case LINE: // intentional fall through
    case TICK: // Tick is opposite to bar, line, area and never have ranged mark.

      /* tslint:enable */
      const xIsContinuous = isFieldDef(encoding.x) && isContinuous(encoding.x);
      const yIsContinuous = isFieldDef(encoding.y) && isContinuous(encoding.y);
      if (xIsContinuous && !yIsContinuous) {
        return mark !== 'tick' ? 'horizontal' : 'vertical';
      } else if (!xIsContinuous && yIsContinuous) {
        return mark !== 'tick' ? 'vertical' : 'horizontal';
      } else if (xIsContinuous && yIsContinuous) {
        const xDef = encoding.x as FieldDef<string>; // we can cast here since they are surely fieldDef
        const yDef = encoding.y as FieldDef<string>;

        const xIsTemporal = xDef.type === TEMPORAL;
        const yIsTemporal = yDef.type === TEMPORAL;

        // temporal without timeUnit is considered continuous, but better serves as dimension
        if (xIsTemporal && !yIsTemporal) {
          return mark !== 'tick' ? 'vertical' : 'horizontal';
        } else if (!xIsTemporal && yIsTemporal) {
          return mark !== 'tick' ? 'horizontal' : 'vertical';
        }

        if (!xDef.aggregate && yDef.aggregate) {
          return mark !== 'tick' ? 'vertical' : 'horizontal';
        } else if (xDef.aggregate && !yDef.aggregate) {
          return mark !== 'tick' ? 'horizontal' : 'vertical';
        }

        if (specifiedOrient) {
          // When ambiguous, use user specified one.
          return specifiedOrient;
        }

        if (!(mark === LINE && encoding.order)) {
          // Except for connected scatterplot, we should log warning for unclear orientation of QxQ plots.
          log.warn(log.message.unclearOrientContinuous(mark));
        }
        return 'vertical';
      } else {
        // For Discrete x Discrete case, return undefined.
        log.warn(log.message.unclearOrientDiscreteOrEmpty(mark));
        return undefined;
      }
  }
  return 'vertical';
}

