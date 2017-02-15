import * as log from '../log';

import {X, COLOR, SIZE, DETAIL} from '../channel';
import {Config} from '../config';
import {Encoding, isAggregate, channelHasField} from '../encoding';
import {isMeasure, isFieldDef, FieldDef} from '../fielddef';
import {MarkConfig, TextConfig, Orient} from '../mark';
import {BAR, AREA, POINT, LINE, TICK, CIRCLE, SQUARE, RECT, RULE, TEXT, LABEL, Mark} from '../mark';
import {Scale, hasDiscreteDomain} from '../scale';
import {StackProperties} from '../stack';
import {TEMPORAL} from '../type';
import {contains, extend, Dict} from '../util';
/**
 * Augment config.mark with rule-based default values.
 */
export function initMarkConfig(mark: Mark, encoding: Encoding, scale: Dict<Scale>, stacked: StackProperties, config: Config): MarkConfig {
  // override mark config with mark specific config
  const markConfig = extend({}, config.mark, config[mark]);

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

  return markConfig;
}

export function initTextConfig(encoding: Encoding, config: Config) {
  const textConfig: TextConfig = extend({}, config.text);

  if (textConfig.align === undefined) {
    textConfig.align = channelHasField(encoding, X) ? 'center' : 'right';
  }
  return textConfig;
}

export function opacity(mark: Mark, encoding: Encoding, stacked: StackProperties) {
  if (contains([POINT, TICK, CIRCLE, SQUARE], mark)) {
    // point-based marks
    if (!isAggregate(encoding) || channelHasField(encoding, DETAIL)) {
      return 0.7;
    }
  }
  if (mark === BAR && !stacked) {
    if (channelHasField(encoding, COLOR) || channelHasField(encoding, DETAIL) || channelHasField(encoding, SIZE)) {
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
    case LABEL:
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
      const xIsMeasure = isMeasure(encoding.x) || isMeasure(encoding.x2);
      const yIsMeasure = isMeasure(encoding.y) || isMeasure(encoding.y2);
      if (xIsMeasure && !yIsMeasure) {
        return 'horizontal';
      } else if (!xIsMeasure && yIsMeasure) {
        return 'vertical';
      } else if (xIsMeasure && yIsMeasure) {
        const xDef = encoding.x as FieldDef;
        const yDef = encoding.y as FieldDef;
        // temporal without timeUnit is considered continuous, but better serves as dimension
        if (xDef.type === TEMPORAL) {
          return 'vertical';
        } else if (yDef.type === TEMPORAL) {
          return 'horizontal';
        }

        if (markConfig.orient) {
          // When ambiguous, use user specified one.
          return markConfig.orient;
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
