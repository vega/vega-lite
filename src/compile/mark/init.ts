
import {Config} from '../../config';
import {Encoding, isAggregate} from '../../encoding';
import {FieldDef, isContinuous, isFieldDef} from '../../fielddef';
import * as log from '../../log';
import {AREA, BAR, CIRCLE, LINE, Mark, MarkDef, POINT, RECT, RULE, SQUARE, TEXT, TICK} from '../../mark';
import {hasDiscreteDomain} from '../../scale';
import {StackProperties} from '../../stack';
import {TEMPORAL} from '../../type';
import {contains} from '../../util';
import {getMarkConfig} from '../common';
import {ScaleComponentIndex} from '../scale/component';
import {Orient} from './../../vega.schema';


export function normalizeMarkDef(markDef: MarkDef, encoding: Encoding<string>, scales: ScaleComponentIndex, config: Config) {
  const specifiedOrient = markDef.orient || getMarkConfig('orient', markDef, config);
  markDef.orient = orient(markDef.type, encoding, scales, specifiedOrient);
  if (specifiedOrient !== undefined && specifiedOrient !== markDef.orient) {
    log.warn(log.message.orientOverridden(markDef.orient,specifiedOrient));
  }

  const specifiedFilled = markDef.filled;
  if (specifiedFilled === undefined) {
    markDef.filled = filled(markDef, config);
  }
}

/**
 * Initialize encoding's value with some special default values
 */
export function initEncoding(mark: MarkDef, encoding: Encoding<string>, stacked: StackProperties, config: Config): Encoding<string> {
  const opacityConfig = getMarkConfig('opacity', mark, config);
  if (!encoding.opacity && opacityConfig === undefined) {
    const opacity = defaultOpacity(mark.type, encoding, stacked);
    if (opacity !== undefined) {
      encoding.opacity = {value: opacity};
    }
  }

  return encoding;
}


function defaultOpacity(mark: Mark, encoding: Encoding<string>, stacked: StackProperties) {
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

function orient(mark: Mark, encoding: Encoding<string>, scales: ScaleComponentIndex, specifiedOrient: Orient): Orient {
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
      const xScaleType = scales.x ? scales.x.get('type') : null;
      const yScaleType = scales.y ? scales.y.get('type') : null;

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
        const xDef = encoding.x as FieldDef<string>; // we can cast here since they are surely fieldDef
        const yDef = encoding.y as FieldDef<string>;

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
