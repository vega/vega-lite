"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var log = tslib_1.__importStar(require("../log"));
var util_1 = require("../util");
/**
 * Generic class for storing properties that are explicitly specified
 * and implicitly determined by the compiler.
 * This is important for scale/axis/legend merging as
 * we want to prioritize properties that users explicitly specified.
 */
var Split = /** @class */ (function () {
    function Split(explicit, implicit) {
        if (explicit === void 0) { explicit = {}; }
        if (implicit === void 0) { implicit = {}; }
        this.explicit = explicit;
        this.implicit = implicit;
    }
    Split.prototype.clone = function () {
        return new Split(util_1.duplicate(this.explicit), util_1.duplicate(this.implicit));
    };
    Split.prototype.combine = function () {
        // FIXME remove "as any".
        // Add "as any" to avoid an error "Spread types may only be created from object types".
        return tslib_1.__assign({}, this.explicit, this.implicit);
    };
    Split.prototype.get = function (key) {
        // Explicit has higher precedence
        return this.explicit[key] !== undefined ? this.explicit[key] : this.implicit[key];
    };
    Split.prototype.getWithExplicit = function (key) {
        // Explicit has higher precedence
        if (this.explicit[key] !== undefined) {
            return { explicit: true, value: this.explicit[key] };
        }
        else if (this.implicit[key] !== undefined) {
            return { explicit: false, value: this.implicit[key] };
        }
        return { explicit: false, value: undefined };
    };
    Split.prototype.setWithExplicit = function (key, value) {
        if (value.value !== undefined) {
            this.set(key, value.value, value.explicit);
        }
    };
    Split.prototype.set = function (key, value, explicit) {
        delete this[explicit ? 'implicit' : 'explicit'][key];
        this[explicit ? 'explicit' : 'implicit'][key] = value;
        return this;
    };
    Split.prototype.copyKeyFromSplit = function (key, s) {
        // Explicit has higher precedence
        if (s.explicit[key] !== undefined) {
            this.set(key, s.explicit[key], true);
        }
        else if (s.implicit[key] !== undefined) {
            this.set(key, s.implicit[key], false);
        }
    };
    Split.prototype.copyKeyFromObject = function (key, s) {
        // Explicit has higher precedence
        if (s[key] !== undefined) {
            this.set(key, s[key], true);
        }
    };
    /**
     * Merge split object into this split object. Properties from the other split
     * overwrite properties from this split.
     */
    Split.prototype.copyAll = function (other) {
        for (var _i = 0, _a = util_1.keys(other.combine()); _i < _a.length; _i++) {
            var key = _a[_i];
            var val = other.getWithExplicit(key);
            this.setWithExplicit(key, val);
        }
    };
    return Split;
}());
exports.Split = Split;
function makeExplicit(value) {
    return {
        explicit: true,
        value: value
    };
}
exports.makeExplicit = makeExplicit;
function makeImplicit(value) {
    return {
        explicit: false,
        value: value
    };
}
exports.makeImplicit = makeImplicit;
function tieBreakByComparing(compare) {
    return function (v1, v2, property, propertyOf) {
        var diff = compare(v1.value, v2.value);
        if (diff > 0) {
            return v1;
        }
        else if (diff < 0) {
            return v2;
        }
        return defaultTieBreaker(v1, v2, property, propertyOf);
    };
}
exports.tieBreakByComparing = tieBreakByComparing;
function defaultTieBreaker(v1, v2, property, propertyOf) {
    if (v1.explicit && v2.explicit) {
        log.warn(log.message.mergeConflictingProperty(property, propertyOf, v1.value, v2.value));
    }
    // If equal score, prefer v1.
    return v1;
}
exports.defaultTieBreaker = defaultTieBreaker;
function mergeValuesWithExplicit(v1, v2, property, propertyOf, tieBreaker) {
    if (tieBreaker === void 0) { tieBreaker = defaultTieBreaker; }
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
    else if (util_1.stringify(v1.value) === util_1.stringify(v2.value)) {
        return v1;
    }
    else {
        return tieBreaker(v1, v2, property, propertyOf);
    }
}
exports.mergeValuesWithExplicit = mergeValuesWithExplicit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BsaXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcGlsZS9zcGxpdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxrREFBOEI7QUFDOUIsZ0NBQW1EO0FBR25EOzs7OztHQUtHO0FBQ0g7SUFDRSxlQUNrQixRQUF5QixFQUN6QixRQUF5QjtRQUR6Qix5QkFBQSxFQUFBLGFBQXlCO1FBQ3pCLHlCQUFBLEVBQUEsYUFBeUI7UUFEekIsYUFBUSxHQUFSLFFBQVEsQ0FBaUI7UUFDekIsYUFBUSxHQUFSLFFBQVEsQ0FBaUI7SUFDeEMsQ0FBQztJQUVHLHFCQUFLLEdBQVo7UUFDRSxPQUFPLElBQUksS0FBSyxDQUFDLGdCQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLGdCQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQUVNLHVCQUFPLEdBQWQ7UUFDRSx5QkFBeUI7UUFDekIsdUZBQXVGO1FBQ3ZGLDRCQUNLLElBQUksQ0FBQyxRQUFlLEVBQ3BCLElBQUksQ0FBQyxRQUFlLEVBQ3ZCO0lBQ0osQ0FBQztJQUVNLG1CQUFHLEdBQVYsVUFBOEIsR0FBTTtRQUNsQyxpQ0FBaUM7UUFDakMsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNwRixDQUFDO0lBRU0sK0JBQWUsR0FBdEIsVUFBMEMsR0FBTTtRQUM5QyxpQ0FBaUM7UUFDakMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFNBQVMsRUFBRTtZQUNwQyxPQUFPLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFH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LFFBQVEsRUFBRTtRQUN0QyxPQUFPLEVBQUUsQ0FBQztLQUNYO1NBQU0sSUFBSSxnQkFBUyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxnQkFBUyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUN0RCxPQUFPLEVBQUUsQ0FBQztLQUNYO1NBQU07UUFDTCxPQUFPLFVBQVUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztLQUNqRDtBQUNILENBQUM7QUFwQkQsMERBb0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uL2xvZyc7XG5pbXBvcnQge2R1cGxpY2F0ZSwga2V5cywgc3RyaW5naWZ5fSBmcm9tICcuLi91dGlsJztcblxuXG4vKipcbiAqIEdlbmVyaWMgY2xhc3MgZm9yIHN0b3JpbmcgcHJvcGVydGllcyB0aGF0IGFyZSBleHBsaWNpdGx5IHNwZWNpZmllZFxuICogYW5kIGltcGxpY2l0bHkgZGV0ZXJtaW5lZCBieSB0aGUgY29tcGlsZXIuXG4gKiBUaGlzIGlzIGltcG9ydGFudCBmb3Igc2NhbGUvYXhpcy9sZWdlbmQgbWVyZ2luZyBhc1xuICogd2Ugd2FudCB0byBwcmlvcml0aXplIHByb3BlcnRpZXMgdGhhdCB1c2VycyBleHBsaWNpdGx5IHNwZWNpZmllZC5cbiAqL1xuZXhwb3J0IGNsYXNzIFNwbGl0PFQgZXh0ZW5kcyBvYmplY3Q+IHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHJlYWRvbmx5IGV4cGxpY2l0OiBQYXJ0aWFsPFQ+ID0ge30sXG4gICAgcHVibGljIHJlYWRvbmx5IGltcGxpY2l0OiBQYXJ0aWFsPFQ+ID0ge31cbiAgKSB7fVxuXG4gIHB1YmxpYyBjbG9uZSgpIHtcbiAgICByZXR1cm4gbmV3IFNwbGl0KGR1cGxpY2F0ZSh0aGlzLmV4cGxpY2l0KSwgZHVwbGljYXRlKHRoaXMuaW1wbGljaXQpKTtcbiAgfVxuXG4gIHB1YmxpYyBjb21iaW5lKCk6IFBhcnRpYWw8VD4ge1xuICAgIC8vIEZJWE1FIHJlbW92ZSBcImFzIGFueVwiLlxuICAgIC8vIEFkZCBcImFzIGFueVwiIHRvIGF2b2lkIGFuIGVycm9yIFwiU3ByZWFkIHR5cGVzIG1heSBvbmx5IGJlIGNyZWF0ZWQgZnJvbSBvYmplY3QgdHlwZXNcIi5cbiAgICByZXR1cm4ge1xuICAgICAgLi4udGhpcy5leHBsaWNpdCBhcyBhbnksIC8vIEV4cGxpY2l0IHByb3BlcnRpZXMgY29tZXMgZmlyc3RcbiAgICAgIC4uLnRoaXMuaW1wbGljaXQgYXMgYW55XG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQ8SyBleHRlbmRzIGtleW9mIFQ+KGtleTogSyk6IFRbS10ge1xuICAgIC8vIEV4cGxpY2l0IGhhcyBoaWdoZXIgcHJlY2VkZW5jZVxuICAgIHJldHVybiB0aGlzLmV4cGxpY2l0W2tleV0gIT09IHVuZGVmaW5lZCA/IHRoaXMuZXhwbGljaXRba2V5XSA6IHRoaXMuaW1wbGljaXRba2V5XTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRXaXRoRXhwbGljaXQ8SyBleHRlbmRzIGtleW9mIFQ+KGtleTogSyk6IEV4cGxpY2l0PFRbS10+IHtcbiAgICAvLyBFeHBsaWNpdCBoYXMgaGlnaGVyIHByZWNlZGVuY2VcbiAgICBpZiAodGhpcy5leHBsaWNpdFtrZXldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB7ZXhwbGljaXQ6IHRydWUsIHZhbHVlOiB0aGlzLmV4cGxpY2l0W2tleV19O1xuICAgIH0gZWxzZSBpZiAodGhpcy5pbXBsaWNpdFtrZXldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB7ZXhwbGljaXQ6IGZhbHNlLCB2YWx1ZTogdGhpcy5pbXBsaWNpdFtrZXldfTtcbiAgICB9XG4gICAgcmV0dXJuIHtleHBsaWNpdDogZmFsc2UsIHZhbHVlOiB1bmRlZmluZWR9O1xuICB9XG5cbiAgcHVibGljIHNldFdpdGhFeHBsaWNpdDxLIGV4dGVuZHMga2V5b2YgVD4oa2V5OiBLLCB2YWx1ZTogRXhwbGljaXQ8VFtLXT4pIHtcbiAgICBpZiAodmFsdWUudmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5zZXQoa2V5LCB2YWx1ZS52YWx1ZSwgdmFsdWUuZXhwbGljaXQpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzZXQ8SyBleHRlbmRzIGtleW9mIFQ+KGtleTogSywgdmFsdWU6IFRbS10sIGV4cGxpY2l0OiBib29sZWFuKSB7XG4gICAgZGVsZXRlIHRoaXNbZXhwbGljaXQgPyAnaW1wbGljaXQnIDogJ2V4cGxpY2l0J11ba2V5XTtcbiAgICB0aGlzW2V4cGxpY2l0ID8gJ2V4cGxpY2l0JyA6ICdpbXBsaWNpdCddW2tleV0gPSB2YWx1ZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHB1YmxpYyBjb3B5S2V5RnJvbVNwbGl0PFMgZXh0ZW5kcyBUPihrZXk6IGtleW9mIFQsIHM6IFNwbGl0PFM+KSB7XG4gICAgLy8gRXhwbGljaXQgaGFzIGhpZ2hlciBwcmVjZWRlbmNlXG4gICAgaWYgKHMuZXhwbGljaXRba2V5XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnNldChrZXksIHMuZXhwbGljaXRba2V5XSwgdHJ1ZSk7XG4gICAgfSBlbHNlIGlmIChzLmltcGxpY2l0W2tleV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5zZXQoa2V5LCBzLmltcGxpY2l0W2tleV0sIGZhbHNlKTtcbiAgICB9XG4gIH1cbiAgcHVibGljIGNvcHlLZXlGcm9tT2JqZWN0PFMgZXh0ZW5kcyBQYXJ0aWFsPFQ+PihrZXk6IGtleW9mIFQsIHM6IFMpIHtcbiAgICAvLyBFeHBsaWNpdCBoYXMgaGlnaGVyIHByZWNlZGVuY2VcbiAgICBpZiAoc1trZXldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuc2V0KGtleSwgc1trZXldLCB0cnVlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTWVyZ2Ugc3BsaXQgb2JqZWN0IGludG8gdGhpcyBzcGxpdCBvYmplY3QuIFByb3BlcnRpZXMgZnJvbSB0aGUgb3RoZXIgc3BsaXRcbiAgICogb3ZlcndyaXRlIHByb3BlcnRpZXMgZnJvbSB0aGlzIHNwbGl0LlxuICAgKi9cbiAgcHVibGljIGNvcHlBbGwob3RoZXI6IFNwbGl0PFQ+KSB7XG4gICAgZm9yIChjb25zdCBrZXkgb2Yga2V5cyhvdGhlci5jb21iaW5lKCkpKSB7XG4gICAgICBjb25zdCB2YWwgPSBvdGhlci5nZXRXaXRoRXhwbGljaXQoa2V5KTtcbiAgICAgIHRoaXMuc2V0V2l0aEV4cGxpY2l0KGtleSwgdmFsKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBFeHBsaWNpdDxUPiB7XG4gIGV4cGxpY2l0OiBib29sZWFuO1xuICB2YWx1ZTogVDtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gbWFrZUV4cGxpY2l0PFQ+KHZhbHVlOiBUKTogRXhwbGljaXQ8VD4ge1xuICByZXR1cm4ge1xuICAgIGV4cGxpY2l0OiB0cnVlLFxuICAgIHZhbHVlXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlSW1wbGljaXQ8VD4odmFsdWU6IFQpOiBFeHBsaWNpdDxUPiB7XG4gIHJldHVybiB7XG4gICAgZXhwbGljaXQ6IGZhbHNlLFxuICAgIHZhbHVlXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0aWVCcmVha0J5Q29tcGFyaW5nPFMsIFQ+KGNvbXBhcmU6ICh2MTogVCwgdjI6IFQpID0+IG51bWJlcikge1xuICByZXR1cm4gKHYxOiBFeHBsaWNpdDxUPiwgdjI6IEV4cGxpY2l0PFQ+LCBwcm9wZXJ0eToga2V5b2YgUyB8IG5ldmVyLCBwcm9wZXJ0eU9mOiBzdHJpbmcgfCBudW1iZXIgfCBzeW1ib2wpOiBFeHBsaWNpdDxUPiA9PiB7XG4gICAgY29uc3QgZGlmZiA9IGNvbXBhcmUodjEudmFsdWUsIHYyLnZhbHVlKTtcbiAgICBpZiAoZGlmZiA+IDApIHtcbiAgICAgIHJldHVybiB2MTtcbiAgICB9IGVsc2UgaWYgKGRpZmYgPCAwKSB7XG4gICAgICByZXR1cm4gdjI7XG4gICAgfVxuICAgIHJldHVybiBkZWZhdWx0VGllQnJlYWtlcjxTLCBUPih2MSwgdjIsIHByb3BlcnR5LCBwcm9wZXJ0eU9mKTtcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRUaWVCcmVha2VyPFMsIFQ+KHYxOiBFeHBsaWNpdDxUPiwgdjI6IEV4cGxpY2l0PFQ+LCBwcm9wZXJ0eToga2V5b2YgUywgcHJvcGVydHlPZjogc3RyaW5nIHwgbnVtYmVyIHwgc3ltYm9sKSB7XG4gIGlmICh2MS5leHBsaWNpdCAmJiB2Mi5leHBsaWNpdCkge1xuICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLm1lcmdlQ29uZmxpY3RpbmdQcm9wZXJ0eShwcm9wZXJ0eSwgcHJvcGVydHlPZiwgdjEudmFsdWUsIHYyLnZhbHVlKSk7XG4gIH1cbiAgLy8gSWYgZXF1YWwgc2NvcmUsIHByZWZlciB2MS5cbiAgcmV0dXJuIHYxO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VWYWx1ZXNXaXRoRXhwbGljaXQ8UywgVD4oXG4gICAgdjE6IEV4cGxpY2l0PFQ+LCB2MjogRXhwbGljaXQ8VD4sXG4gICAgcHJvcGVydHk6IGtleW9mIFMsXG4gICAgcHJvcGVydHlPZjogJ3NjYWxlJyB8ICdheGlzJyB8ICdsZWdlbmQnIHwgJycsXG4gICAgdGllQnJlYWtlcjogKHYxOiBFeHBsaWNpdDxUPiwgdjI6IEV4cGxpY2l0PFQ+LCBwcm9wZXJ0eToga2V5b2YgUywgcHJvcGVydHlPZjogc3RyaW5nKSA9PiBFeHBsaWNpdDxUPiA9IGRlZmF1bHRUaWVCcmVha2VyXG4gICkge1xuICBpZiAodjEgPT09IHVuZGVmaW5lZCB8fCB2MS52YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gRm9yIGZpcnN0IHJ1blxuICAgIHJldHVybiB2MjtcbiAgfVxuXG4gIGlmICh2MS5leHBsaWNpdCAmJiAhdjIuZXhwbGljaXQpIHtcbiAgICByZXR1cm4gdjE7XG4gIH0gZWxzZSBpZiAodjIuZXhwbGljaXQgJiYgIXYxLmV4cGxpY2l0KSB7XG4gICAgcmV0dXJuIHYyO1xuICB9IGVsc2UgaWYgKHN0cmluZ2lmeSh2MS52YWx1ZSkgPT09IHN0cmluZ2lmeSh2Mi52YWx1ZSkpIHtcbiAgICByZXR1cm4gdjE7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRpZUJyZWFrZXIodjEsIHYyLCBwcm9wZXJ0eSwgcHJvcGVydHlPZik7XG4gIH1cbn1cbiJdfQ==