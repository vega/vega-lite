import * as log from '../log';

import {X, COLOR, SIZE, DETAIL} from '../channel';
import {Config, Orient, MarkConfig, HorizontalAlign} from '../config';
import {Encoding, isAggregate, has} from '../encoding';
import {isMeasure} from '../fielddef';
import {BAR, AREA, POINT, LINE, TICK, CIRCLE, SQUARE, RECT, RULE, TEXT, Mark} from '../mark';
import {Scale, isDiscreteScale} from '../scale';
import {StackProperties} from '../stack';
import {TEMPORAL} from '../type';
import {contains, duplicate, Dict} from '../util';
/**
 * Augment config.mark with rule-based default values.
 */
export function initMarkConfig(mark: Mark, encoding: Encoding, scale: Dict<Scale>, stacked: StackProperties, config: Config) {
  const markConfig = duplicate(config.mark);

  if (markConfig.filled === undefined) {
    markConfig.filled = mark !== POINT && mark !== LINE && mark !== RULE;
  }

  if (markConfig.opacity === undefined) {
    const o = opacity(mark, encoding, stacked);
    if (o) {
      markConfig.opacity = o;
    }
  }

  // For orient, users can only specify for ambiguous cases.
  markConfig.orient = orient(mark, encoding, scale, config.mark);
  if (config.mark.orient !== undefined && markConfig.orient !== config.mark.orient) {
    log.warn(log.message.orientOverridden(config.mark.orient, markConfig.orient));
  }

  if (markConfig.align === undefined) {
    markConfig.align = has(encoding, X) ? HorizontalAlign.CENTER : HorizontalAlign.RIGHT;
  }

  return markConfig;
}

export function opacity(mark: Mark, encoding: Encoding, stacked: StackProperties) {
  if (contains([POINT, TICK, CIRCLE, SQUARE], mark)) {
    // point-based marks
    if (!isAggregate(encoding) || has(encoding, DETAIL)) {
      return 0.7;
    }
  }
  if (mark === BAR && !stacked) {
    if (has(encoding, COLOR) || has(encoding, DETAIL) || has(encoding, SIZE)) {
      return 0.7;
    }
  }
  if (mark === AREA) {
    return 0.7; // inspired by Tableau
  }
  return undefined;
}

export function orient(mark: Mark, encoding: Encoding, scale: Dict<Scale>, markConfig: MarkConfig = {}): Orient {
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
      if (!isDiscreteScale(xScaleType) && (
            !encoding.y ||
            isDiscreteScale(yScaleType) ||
            encoding.y.bin
        )) {
        return Orient.VERTICAL;
      }
      // y:Q or Ambiguous case, return horizontal
      return Orient.HORIZONTAL;

    case RULE:
    case BAR:
    case AREA:
      // If there are range for both x and y, y (vertical) has higher precedence.
      if (yIsRange) {
        return Orient.VERTICAL;
      } else if (xIsRange) {
        return Orient.HORIZONTAL;
      } else if (mark === RULE) {
        if (encoding.x && !encoding.y) {
          return Orient.VERTICAL;
        } else if (encoding.y && !encoding.x) {
          return Orient.HORIZONTAL;
        }
      }

      /* tslint:disable */
    case LINE: // intentional fall through
      /* tslint:enable */
      const xIsMeasure = isMeasure(encoding.x) || isMeasure(encoding.x2);
      const yIsMeasure = isMeasure(encoding.y) || isMeasure(encoding.y2);
      if (xIsMeasure && !yIsMeasure) {
        return Orient.HORIZONTAL;
      } else if (!xIsMeasure && yIsMeasure) {
        return Orient.VERTICAL;
      } else if (xIsMeasure && yIsMeasure) {
        // temporal without timeUnit is considered continuous, but better serves as dimension
        if (encoding.x.type === TEMPORAL) {
          return Orient.VERTICAL;
        } else if (encoding.y.type === TEMPORAL) {
          return Orient.HORIZONTAL;
        }

        if (markConfig.orient) {
          // When ambiguous, use user specified one.
          return markConfig.orient;
        }

        if (!(mark === LINE &&  encoding.path)) {
          // Except for connected scatterplot, we should log warning for unclear orientation of QxQ plots.
          log.warn(log.message.unclearOrientContinuous(mark));
        }
        return Orient.VERTICAL;
      } else {
        // For Discrete x Discrete case, return undefined.
        log.warn(log.message.unclearOrientDiscreteOrEmpty(mark));
        return undefined;
      }
  }
  return Orient.VERTICAL;
}
