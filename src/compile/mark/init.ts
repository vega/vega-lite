import {Config} from '../../config';
import {Encoding, isAggregate} from '../../encoding';
import {FieldDef, isContinuous, isFieldDef} from '../../fielddef';
import * as log from '../../log';
import {AREA, BAR, CIRCLE, isMarkDef, LINE, Mark, MarkDef, Orient, POINT, RECT, RULE, SQUARE, TEXT, TICK} from '../../mark';
import {hasDiscreteDomain, Scale} from '../../scale';
import {StackProperties} from '../../stack';
import {TEMPORAL} from '../../type';
import {contains, Dict} from '../../util';
import {getMarkConfig} from '../common';

export function initMarkDef(mark: Mark | MarkDef, encoding: Encoding, scale: Dict<Scale>, config: Config): MarkDef {
  const markDef = isMarkDef(mark) ? {...mark} : {type: mark};

  const specifiedOrient = markDef.orient || getMarkConfig('orient', markDef.type, config);
  markDef.orient = orient(markDef.type, encoding, scale, specifiedOrient);
  if (specifiedOrient !== undefined && specifiedOrient !== markDef.orient) {
    log.warn(log.message.orientOverridden(markDef.orient,specifiedOrient));
  }

  const specifiedFilled = markDef.filled;
  if (specifiedFilled === undefined) {
    markDef.filled = filled(markDef.type, config);
  }

  return markDef;
}

/**
 * Initialize encoding's value with some special default values
 */
export function initEncoding(mark: Mark, encoding: Encoding, stacked: StackProperties, config: Config): Encoding {
  const opacityConfig = getMarkConfig('opacity', mark, config);
  if (!encoding.opacity && opacityConfig === undefined) {
    const opacity = defaultOpacity(mark, encoding, stacked);
    if (opacity !== undefined) {
      encoding.opacity = {value: opacity};
    }
  }
  return encoding;
}


function defaultOpacity(mark: Mark, encoding: Encoding, stacked: StackProperties) {
  if (contains([POINT, TICK, CIRCLE, SQUARE], mark)) {
    // point-based marks
    if (!isAggregate(encoding)) {
      return 0.7;
    }
  }
  return undefined;
}

function filled(mark: Mark, config: Config) {
  const filledConfig = getMarkConfig('filled', mark, config);
  return filledConfig !== undefined ? filledConfig : mark !== POINT && mark !== LINE && mark !== RULE;
}

function orient(mark: Mark, encoding: Encoding, scale: Dict<Scale>, specifiedOrient: Orient): Orient {
  switch (mark) {
    case POINT:
    case CIRCLE:
    case SQUARE:
    case TEXT:
    case RECT:
      // orient is meaningless for these marks.
      return undefined;
  }

  const yIsRange = encoding.y && encoding.y2;
  const xIsRange = encoding.x && encoding.x2;

  switch (mark) {
    case TICK:
      const xScaleType = scale['x'] ? scale['x'].type : null;
      const yScaleType = scale['y'] ? scale['y'].type : null;

      // Tick is opposite to bar, line, area and never have ranged mark.
      if (!hasDiscreteDomain(xScaleType) && (
            !encoding.y ||
            hasDiscreteDomain(yScaleType) ||
            (isFieldDef(encoding.y) && encoding.y.bin)
        )) {
        return 'vertical';
      }
      // y:Q or Ambiguous case, return horizontal
      return 'horizontal';

    case RULE:
    case BAR:
    case AREA:
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

      /* tslint:disable */
    case LINE: // intentional fall through
      /* tslint:enable */
      const xIsContinuous = isFieldDef(encoding.x) && isContinuous(encoding.x);
      const yIsContinuous = isFieldDef(encoding.y) && isContinuous(encoding.y);
      if (xIsContinuous && !yIsContinuous) {
        return 'horizontal';
      } else if (!xIsContinuous && yIsContinuous) {
        return 'vertical';
      } else if (xIsContinuous && yIsContinuous) {
        const xDef = encoding.x as FieldDef; // we can cast here since they are surely fieldDef
        const yDef = encoding.y as FieldDef;

        const xIsTemporal = xDef.type === TEMPORAL;
        const yIsTemporal = yDef.type === TEMPORAL;

        // temporal without timeUnit is considered continuous, but better serves as dimension
        if (xIsTemporal && !yIsTemporal) {
          return 'vertical';
        } else if (!xIsTemporal && yIsTemporal) {
          return 'horizontal';
        }

        if (!xDef.aggregate && yDef.aggregate) {
          return 'vertical';
        } else if (xDef.aggregate && !yDef.aggregate) {
          return 'horizontal';
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
