import {Encoding} from '../encoding';
import {Config} from '../config';
import {StackProperties} from './stack';

import {X, Y, DETAIL} from '../channel';
import {isAggregate, has} from '../encoding';
import {isMeasure} from '../fielddef';
import {POINT, LINE, TICK, CIRCLE, SQUARE, Mark} from '../mark';
import {contains, extend} from '../util';

/**
 * Augment config.mark with rule-based default values.
 */
export function compileMarkConfig(mark: Mark, encoding: Encoding, config: Config, stack: StackProperties) {
   return extend(
     ['filled', 'opacity', 'orient', 'align'].reduce(function(cfg, property: string) {
       const value = config.mark[property];
       switch (property) {
         case 'filled':
           if (value === undefined) {
             // Point and line are not filled by default
             cfg[property] = mark !== POINT && mark !== LINE;
           }
           break;
         case 'opacity':
           if (value === undefined && contains([POINT, TICK, CIRCLE, SQUARE], mark)) {
             // point-based marks and bar
             if (!isAggregate(encoding) || has(encoding, DETAIL)) {
               cfg[property] = 0.7;
             }
           }
           break;
         case 'orient':
           if (stack) {
             // For stacked chart, explicitly specified orient property will be ignored.
             cfg[property] = stack.groupbyChannel === Y ? 'horizontal' : undefined;
           }
           if (value === undefined) {
             cfg[property] = isMeasure(encoding[X]) &&  !isMeasure(encoding[Y]) ?
               // horizontal if X is measure and Y is dimension or unspecified
               'horizontal' :
               // vertical (undefined) otherwise.  This includes when
               // - Y is measure and X is dimension or unspecified
               // - both X and Y are measures or both are dimension
               undefined;  //
           }
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
