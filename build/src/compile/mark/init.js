import * as tslib_1 from "tslib";
import { isAggregate } from '../../encoding';
import { isContinuous, isFieldDef } from '../../fielddef';
import * as log from '../../log';
import { AREA, BAR, CIRCLE, isMarkDef, LINE, POINT, RECT, RULE, SQUARE, TEXT, TICK } from '../../mark';
import { QUANTITATIVE, TEMPORAL } from '../../type';
import { contains } from '../../util';
import { getMarkConfig } from '../common';
export function normalizeMarkDef(mark, encoding, config) {
    var markDef = isMarkDef(mark) ? tslib_1.__assign({}, mark) : { type: mark };
    // set orient, which can be overridden by rules as sometimes the specified orient is invalid.
    var specifiedOrient = markDef.orient || getMarkConfig('orient', markDef, config);
    markDef.orient = orient(markDef.type, encoding, specifiedOrient);
    if (specifiedOrient !== undefined && specifiedOrient !== markDef.orient) {
        log.warn(log.message.orientOverridden(markDef.orient, specifiedOrient));
    }
    // set opacity and filled if not specified in mark config
    var specifiedOpacity = markDef.opacity !== undefined ? markDef.opacity : getMarkConfig('opacity', markDef, config);
    if (specifiedOpacity === undefined) {
        markDef.opacity = opacity(markDef.type, encoding);
    }
    var specifiedFilled = markDef.filled;
    if (specifiedFilled === undefined) {
        markDef.filled = filled(markDef, config);
    }
    // set cursor, which should be pointer if href channel is present unless otherwise specified
    var specifiedCursor = markDef.cursor || getMarkConfig('cursor', markDef, config);
    if (specifiedCursor === undefined) {
        markDef.cursor = cursor(markDef, encoding, config);
    }
    return markDef;
}
function cursor(markDef, encoding, config) {
    if (encoding.href || markDef.href || getMarkConfig('href', markDef, config)) {
        return 'pointer';
    }
    return markDef.cursor;
}
function opacity(mark, encoding) {
    if (contains([POINT, TICK, CIRCLE, SQUARE], mark)) {
        // point-based marks
        if (!isAggregate(encoding)) {
            return 0.7;
        }
    }
    return undefined;
}
function filled(markDef, config) {
    var filledConfig = getMarkConfig('filled', markDef, config);
    var mark = markDef.type;
    return filledConfig !== undefined ? filledConfig : mark !== POINT && mark !== LINE && mark !== RULE;
}
function orient(mark, encoding, specifiedOrient) {
    switch (mark) {
        case POINT:
        case CIRCLE:
        case SQUARE:
        case TEXT:
        case RECT:
            // orient is meaningless for these marks.
            return undefined;
    }
    var yIsRange = encoding.y2;
    var xIsRange = encoding.x2;
    switch (mark) {
        case BAR:
            if (yIsRange || xIsRange) {
                // Ranged bar does not always have clear orientation, so we allow overriding
                if (specifiedOrient) {
                    return specifiedOrient;
                }
                // If y is range and x is non-range, non-bin Q, y is likely a prebinned field
                var xDef = encoding.x;
                if (!xIsRange && isFieldDef(xDef) && xDef.type === QUANTITATIVE && !xDef.bin) {
                    return 'horizontal';
                }
                // If x is range and y is non-range, non-bin Q, x is likely a prebinned field
                var yDef = encoding.y;
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
            }
            else if (xIsRange) {
                return 'horizontal';
            }
            else if (mark === RULE) {
                if (encoding.x && !encoding.y) {
                    return 'vertical';
                }
                else if (encoding.y && !encoding.x) {
                    return 'horizontal';
                }
            }
        case LINE: // intentional fall through
        case TICK: // Tick is opposite to bar, line, area and never have ranged mark.
            /* tslint:enable */
            var xIsContinuous = isFieldDef(encoding.x) && isContinuous(encoding.x);
            var yIsContinuous = isFieldDef(encoding.y) && isContinuous(encoding.y);
            if (xIsContinuous && !yIsContinuous) {
                return mark !== 'tick' ? 'horizontal' : 'vertical';
            }
            else if (!xIsContinuous && yIsContinuous) {
                return mark !== 'tick' ? 'vertical' : 'horizontal';
            }
            else if (xIsContinuous && yIsContinuous) {
                var xDef = encoding.x; // we can cast here since they are surely fieldDef
                var yDef = encoding.y;
                var xIsTemporal = xDef.type === TEMPORAL;
                var yIsTemporal = yDef.type === TEMPORAL;
                // temporal without timeUnit is considered continuous, but better serves as dimension
                if (xIsTemporal && !yIsTemporal) {
                    return mark !== 'tick' ? 'vertical' : 'horizontal';
                }
                else if (!xIsTemporal && yIsTemporal) {
                    return mark !== 'tick' ? 'horizontal' : 'vertical';
                }
                if (!xDef.aggregate && yDef.aggregate) {
                    return mark !== 'tick' ? 'vertical' : 'horizontal';
                }
                else if (xDef.aggregate && !yDef.aggregate) {
                    return mark !== 'tick' ? 'horizontal' : 'vertical';
                }
                if (specifiedOrient) {
                    // When ambiguous, use user specified one.
                    return specifiedOrient;
                }
                return 'vertical';
            }
            else {
                // Discrete x Discrete case
                if (specifiedOrient) {
                    // When ambiguous, use user specified one.
                    return specifiedOrient;
                }
                return undefined;
            }
    }
    return 'vertical';
}
//# sourceMappingURL=init.js.map