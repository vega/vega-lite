import {X, DETAIL} from '../channel';
import {Config} from '../config';
import {Encoding} from '../encoding';
import {isAggregate, has} from '../encoding';
import {isMeasure} from '../fielddef';
import {AREA, POINT, LINE, TICK, CIRCLE, SQUARE, RULE, Mark} from '../mark';
import {contains, extend} from '../util';

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
           cfg[property] = isVertical(mark, encoding) ? 'vertical' : 'horizontal';
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

export function isVertical(mark: Mark, encoding: Encoding) {
  const xIsMeasure = isMeasure(encoding.x) || isMeasure(encoding.x2);
  const yIsMeasure = isMeasure(encoding.y) || isMeasure(encoding.y2);

  const xIsRange = encoding.x && encoding.x2;
  const yIsRange = encoding.y && encoding.y2;

  // In ambiguous cases (QxQ or OxO) use specified value
  // (and implicitly vertical by default.)
  let vertical = true;

  if (xIsMeasure && !yIsMeasure) {
    vertical = false;
  } else if (!xIsMeasure && yIsMeasure) {
    vertical = true;
  }

  if (TICK === mark) {
    vertical = !vertical;
  } else if (RULE === mark && !xIsRange && !yIsRange) {
    vertical = !vertical;
  }

  return vertical;
}
