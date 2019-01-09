import * as log from '../log';
import { duplicate, getFirstDefined, keys, stringify } from '../util';
/**
 * Generic class for storing properties that are explicitly specified
 * and implicitly determined by the compiler.
 * This is important for scale/axis/legend merging as
 * we want to prioritize properties that users explicitly specified.
 */
export class Split {
    constructor(explicit = {}, implicit = {}) {
        this.explicit = explicit;
        this.implicit = implicit;
    }
    clone() {
        return new Split(duplicate(this.explicit), duplicate(this.implicit));
    }
    combine() {
        // FIXME remove "as any".
        // Add "as any" to avoid an error "Spread types may only be created from object types".
        return Object.assign({}, this.explicit, this.implicit);
    }
    get(key) {
        // Explicit has higher precedence
        return getFirstDefined(this.explicit[key], this.implicit[key]);
    }
    getWithExplicit(key) {
        // Explicit has higher precedence
        if (this.explicit[key] !== undefined) {
            return { explicit: true, value: this.explicit[key] };
        }
        else if (this.implicit[key] !== undefined) {
            return { explicit: false, value: this.implicit[key] };
        }
        return { explicit: false, value: undefined };
    }
    setWithExplicit(key, value) {
        if (value.value !== undefined) {
            this.set(key, value.value, value.explicit);
        }
    }
    set(key, value, explicit) {
        delete this[explicit ? 'implicit' : 'explicit'][key];
        this[explicit ? 'explicit' : 'implicit'][key] = value;
        return this;
    }
    copyKeyFromSplit(key, s) {
        // Explicit has higher precedence
        if (s.explicit[key] !== undefined) {
            this.set(key, s.explicit[key], true);
        }
        else if (s.implicit[key] !== undefined) {
            this.set(key, s.implicit[key], false);
        }
    }
    copyKeyFromObject(key, s) {
        // Explicit has higher precedence
        if (s[key] !== undefined) {
            this.set(key, s[key], true);
        }
    }
    /**
     * Merge split object into this split object. Properties from the other split
     * overwrite properties from this split.
     */
    copyAll(other) {
        for (const key of keys(other.combine())) {
            const val = other.getWithExplicit(key);
            this.setWithExplicit(key, val);
        }
    }
}
export function makeExplicit(value) {
    return {
        explicit: true,
        value
    };
}
export function makeImplicit(value) {
    return {
        explicit: false,
        value
    };
}
export function tieBreakByComparing(compare) {
    return (v1, v2, property, propertyOf) => {
        const diff = compare(v1.value, v2.value);
        if (diff > 0) {
            return v1;
        }
        else if (diff < 0) {
            return v2;
        }
        return defaultTieBreaker(v1, v2, property, propertyOf);
    };
}
export function defaultTieBreaker(v1, v2, property, propertyOf) {
    if (v1.explicit && v2.explicit) {
        log.warn(log.message.mergeConflictingProperty(property, propertyOf, v1.value, v2.value));
    }
    // If equal score, prefer v1.
    return v1;
}
export function mergeValuesWithExplicit(v1, v2, property, propertyOf, tieBreaker = defaultTieBreaker) {
    if (v1 === undefined || v1.value === undefined) {
        // For first run
        return v2;
    }
    if (v1.explicit && !v2.explicit) {
        return v1;
    }
    else if (v2.explicit && !v1.explicit) {
        return v2;
    }
    else if (stringify(v1.value) === stringify(v2.value)) {
        return v1;
    }
    else {
        return tieBreaker(v1, v2, property, propertyOf);
    }
}
//# sourceMappingURL=split.js.map