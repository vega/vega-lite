import {Spec} from '../schema/schema';
import {StackProperties} from './stack';

import {X, Y, DETAIL} from '../channel';
import {isAggregate, has} from '../encoding';
import {isMeasure} from '../fielddef';
import {POINT, TICK, CIRCLE, SQUARE} from '../mark';
import {contains, extend} from '../util';

/**
 * Augment config.mark with rule-based default values.
 */
export function compileMarkConfig(spec: Spec, stack: StackProperties) {
   return extend(
     ['filled', 'opacity', 'orient', 'align'].reduce(function(cfg, property: string) {
       const value = spec.config.mark[property];
       switch (property) {
         case 'filled':
           if (value === undefined) {
             // only point is not filled by default
             cfg[property] = spec.mark !== POINT;
           }
           break;
         case 'opacity':
           if (value === undefined && contains([POINT, TICK, CIRCLE, SQUARE], spec.mark)) {
             // point-based marks and bar
             if (!isAggregate(spec.encoding) || has(spec.encoding, DETAIL)) {
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
             cfg[property] = isMeasure(spec.encoding[X]) &&  !isMeasure(spec.encoding[Y]) ?
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
            cfg[property] = has(spec.encoding, X) ? 'center' : 'right';
          }
       }
       return cfg;
     }, {}),
     spec.config.mark
   );
}
