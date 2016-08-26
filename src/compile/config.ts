import {X, Y, DETAIL} from '../channel';
import {Config, Orient, MarkConfig} from '../config';
import {Encoding, isAggregate, has} from '../encoding';
import {isMeasure} from '../fielddef';
import {BAR, AREA, POINT, LINE, TICK, CIRCLE, SQUARE, RULE, TEXT, Mark} from '../mark';
import {ScaleType} from '../scale';
import {contains, extend} from '../util';
import {scaleType} from '../compile/scale';

/**
 * Augment config.mark with rule-based default values.
 */
export function initMarkConfig(mark: Mark, encoding: Encoding, config: Config) {
   return extend(
     ['filled', 'opacity', 'orient', 'align'].reduce(function(cfg, property: string) {
       const value = config.mark[property];
       switch (property) {
         case 'filled':
           if (value === undefined) {
             // Point, line, and rule are not filled by default
             cfg[property] = mark !== POINT && mark !== LINE && mark !== RULE;
           }
           break;
         case 'opacity':
           if (value === undefined) {
            if (contains([POINT, TICK, CIRCLE, SQUARE], mark)) {
              // point-based marks and bar
              if (!isAggregate(encoding) || has(encoding, DETAIL)) {
                cfg[property] = 0.7;
              }
            }
            if (mark === AREA) {
              cfg[property] = 0.7; // inspired by Tableau
            }
           }
           break;
         case 'orient':
           cfg[property] = orient(mark, encoding, config.mark);
           break;
         // text-only
         case 'align':
          if (value === undefined) {
            cfg[property] = has(encoding, X) ? 'center' : 'right';
          }
       }
       return cfg;
     }, {}),
     config.mark
   );
}

export function orient(mark: Mark, encoding: Encoding, markConfig: MarkConfig = {}): Orient {
  switch (mark) {
    case POINT:
    case CIRCLE:
    case SQUARE:
    case TEXT:
      // orient is meaningless for these marks.
      return undefined;
  }

  const yIsRange = encoding.y && encoding.y2;
  const xIsRange = encoding.x && encoding.x2;

  switch (mark) {
    case TICK:
      const xScaleType = encoding.x ? scaleType(encoding.x.scale || {}, encoding.x, X, mark) : null;
      const yScaleType = encoding.y ? scaleType(encoding.y.scale || {}, encoding.y, Y, mark) : null;

      // Tick is opposite to bar, line, area and never have ranged mark.
      if (xScaleType !== ScaleType.ORDINAL && (!encoding.y || yScaleType === ScaleType.ORDINAL)) {
        return Orient.VERTICAL;
      }
      // y:Q or Ambiguous case, return horizontal
      return Orient.HORIZONTAL;
    case RULE:
      if (xIsRange) {
        return Orient.HORIZONTAL;
      }
      if (yIsRange) {
        return Orient.VERTICAL;
      }
      if (encoding.y) {
        return Orient.HORIZONTAL;
      }
      if (encoding.x) {
        return Orient.VERTICAL;
      }
      // no x/y -- so it's undefined
      return undefined;
    case BAR:
    case AREA:
      // If there are range for both x and y, y (vertical) has higher precedence.

      if (yIsRange) {
        return Orient.VERTICAL;
      }

      if (xIsRange) {
        return Orient.HORIZONTAL;
      }
      /* tslint:disable */
    case LINE: // intentional fall through
      /* tslint:enable */
      const xIsMeasure = isMeasure(encoding.x) || isMeasure(encoding.x2);
      const yIsMeasure = isMeasure(encoding.y) || isMeasure(encoding.y2);
      if (xIsMeasure && !yIsMeasure) {
        return Orient.HORIZONTAL;
      }
      // y:Q or Ambiguous case, return vertical
      return Orient.VERTICAL;
  }
  /* istanbul ignore:next */
  console.warn('orient unimplemented for mark', mark);
  return Orient.VERTICAL;
}
