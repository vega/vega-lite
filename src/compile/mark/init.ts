import {Mark, MarkDef, isMarkDef, BAR, AREA, POINT, LINE, TICK, CIRCLE, SQUARE, RECT, RULE, TEXT, Orient} from '../../mark';
import {Encoding, isAggregate, channelHasField} from '../../encoding';
import * as log from '../../log';
import {Dict, contains} from '../../util';
import {Scale, hasDiscreteDomain} from '../../scale';
import {isFieldDef, isMeasure, FieldDef} from '../../fielddef';
import {TEMPORAL} from '../../type';
import {Config} from '../../config';
import {getMarkConfig} from '../common';
import {StackProperties} from '../../stack';

export function initMarkDef(mark: Mark | MarkDef, encoding: Encoding, scale: Dict<Scale>, config: Config): MarkDef {
  let markDef = isMarkDef(mark) ? {...mark} : {type: mark};
  const specifiedOrient = markDef.orient || getMarkConfig('orient', markDef.type, config);

  markDef.orient = orient(markDef.type, encoding, scale, specifiedOrient);
  if (specifiedOrient !== undefined && specifiedOrient !== markDef.orient) {
    log.warn(log.message.orientOverridden(markDef.orient,specifiedOrient));
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


export function defaultOpacity(mark: Mark, encoding: Encoding, stacked: StackProperties) {
  if (contains([POINT, TICK, CIRCLE, SQUARE], mark)) {
    // point-based marks
    if (!isAggregate(encoding) || channelHasField(encoding, 'detail')) {
      return 0.7;
    }
  }
  if (mark === BAR && !stacked) {
    if (channelHasField(encoding, 'color') || channelHasField(encoding, 'detail') || channelHasField(encoding, 'size')) {
      return 0.7;
    }
  }
  if (mark === AREA) {
    return 0.7; // inspired by Tableau
  }
  return undefined;
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
