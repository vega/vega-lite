"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("../log");
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
        return __assign({}, this.explicit, this.implicit);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BsaXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcGlsZS9zcGxpdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsNEJBQThCO0FBQzlCLGdDQUE2QztBQUc3Qzs7Ozs7R0FLRztBQUNIO0lBQ0UsZUFBNEIsUUFBcUIsRUFBa0IsUUFBcUI7UUFBNUQseUJBQUEsRUFBQSxXQUFjLEVBQU87UUFBa0IseUJBQUEsRUFBQSxXQUFjLEVBQU87UUFBNUQsYUFBUSxHQUFSLFFBQVEsQ0FBYTtRQUFrQixhQUFRLEdBQVIsUUFBUSxDQUFhO0lBQUcsQ0FBQztJQUVyRixxQkFBSyxHQUFaO1FBQ0UsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLGdCQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLGdCQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQUVNLHVCQUFPLEdBQWQ7UUFDRSx5QkFBeUI7UUFDekIsdUZBQXVGO1FBQ3ZGLE1BQU0sY0FDRCxJQUFJLENBQUMsUUFBZSxFQUNwQixJQUFJLENBQUMsUUFBZSxFQUN2QjtJQUNKLENBQUM7SUFFTSxtQkFBRyxHQUFWLFVBQThCLEdBQU07UUFDbEMsaUNBQWlDO1FBQ2pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNwRixDQUFDO0lBRU0sK0JBQWUsR0FBdEIsVUFBMEMsR0FBTTtRQUM5QyxpQ0FBaUM7UUFDakMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLE1BQU0sQ0FBQyxFQUFDLFFB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QVEsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxFQUFFLENBQUM7SUFDWixDQUFDO0lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLElBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUN2QyxNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxnQkFBUyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxnQkFBUyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkQsTUFBTSxDQUFDLEVBQUUsQ0FBQztJQUNaLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLE1BQU0sQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDbEQsQ0FBQztBQUNILENBQUM7QUFwQkQsMERBb0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uL2xvZyc7XG5pbXBvcnQge2R1cGxpY2F0ZSwgc3RyaW5naWZ5fSBmcm9tICcuLi91dGlsJztcblxuXG4vKipcbiAqIEdlbmVyaWMgY2xhc3MgZm9yIHN0b3JpbmcgcHJvcGVydGllcyB0aGF0IGFyZSBleHBsaWNpdGx5IHNwZWNpZmllZFxuICogYW5kIGltcGxpY2l0bHkgZGV0ZXJtaW5lZCBieSB0aGUgY29tcGlsZXIuXG4gKiBUaGlzIGlzIGltcG9ydGFudCBmb3Igc2NhbGUvYXhpcy9sZWdlbmQgbWVyZ2luZyBhc1xuICogd2Ugd2FudCB0byBwcmlvcml0aXplIHByb3BlcnRpZXMgdGhhdCB1c2VycyBleHBsaWNpdGx5IHNwZWNpZmllZC5cbiAqL1xuZXhwb3J0IGNsYXNzIFNwbGl0PFQgZXh0ZW5kcyBvYmplY3Q+IHtcbiAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IGV4cGxpY2l0OiBUID0ge30gYXMgVCwgcHVibGljIHJlYWRvbmx5IGltcGxpY2l0OiBUID0ge30gYXMgVCkge31cblxuICBwdWJsaWMgY2xvbmUoKSB7XG4gICAgcmV0dXJuIG5ldyBTcGxpdChkdXBsaWNhdGUodGhpcy5leHBsaWNpdCksIGR1cGxpY2F0ZSh0aGlzLmltcGxpY2l0KSk7XG4gIH1cblxuICBwdWJsaWMgY29tYmluZSgpOiBUIHtcbiAgICAvLyBGSVhNRSByZW1vdmUgXCJhcyBhbnlcIi5cbiAgICAvLyBBZGQgXCJhcyBhbnlcIiB0byBhdm9pZCBhbiBlcnJvciBcIlNwcmVhZCB0eXBlcyBtYXkgb25seSBiZSBjcmVhdGVkIGZyb20gb2JqZWN0IHR5cGVzXCIuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnRoaXMuZXhwbGljaXQgYXMgYW55LCAvLyBFeHBsaWNpdCBwcm9wZXJ0aWVzIGNvbWVzIGZpcnN0XG4gICAgICAuLi50aGlzLmltcGxpY2l0IGFzIGFueVxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgZ2V0PEsgZXh0ZW5kcyBrZXlvZiBUPihrZXk6IEspOiBUW0tdIHtcbiAgICAvLyBFeHBsaWNpdCBoYXMgaGlnaGVyIHByZWNlZGVuY2VcbiAgICByZXR1cm4gdGhpcy5leHBsaWNpdFtrZXldICE9PSB1bmRlZmluZWQgPyB0aGlzLmV4cGxpY2l0W2tleV0gOiB0aGlzLmltcGxpY2l0W2tleV07XG4gIH1cblxuICBwdWJsaWMgZ2V0V2l0aEV4cGxpY2l0PEsgZXh0ZW5kcyBrZXlvZiBUPihrZXk6IEspOiBFeHBsaWNpdDxUW0tdPiB7XG4gICAgLy8gRXhwbGljaXQgaGFzIGhpZ2hlciBwcmVjZWRlbmNlXG4gICAgaWYgKHRoaXMuZXhwbGljaXRba2V5XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4ge2V4cGxpY2l0OiB0cnVlLCB2YWx1ZTogdGhpcy5leHBsaWNpdFtrZXldfTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaW1wbGljaXRba2V5XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4ge2V4cGxpY2l0OiBmYWxzZSwgdmFsdWU6IHRoaXMuaW1wbGljaXRba2V5XX07XG4gICAgfVxuICAgIHJldHVybiB7ZXhwbGljaXQ6IGZhbHNlLCB2YWx1ZTogdW5kZWZpbmVkfTtcbiAgfVxuXG4gIHB1YmxpYyBzZXRXaXRoRXhwbGljaXQ8SyBleHRlbmRzIGtleW9mIFQ+KGtleTogSywgdmFsdWU6IEV4cGxpY2l0PFRbS10+KSB7XG4gICAgaWYgKHZhbHVlLnZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuc2V0KGtleSwgdmFsdWUudmFsdWUsIHZhbHVlLmV4cGxpY2l0KTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgc2V0PEsgZXh0ZW5kcyBrZXlvZiBUPihrZXk6IEssIHZhbHVlOiBUW0tdLCBleHBsaWNpdDogYm9vbGVhbikge1xuICAgIGRlbGV0ZSB0aGlzW2V4cGxpY2l0ID8gJ2ltcGxpY2l0JyA6ICdleHBsaWNpdCddW2tleV07XG4gICAgdGhpc1tleHBsaWNpdCA/ICdleHBsaWNpdCcgOiAnaW1wbGljaXQnXVtrZXldID0gdmFsdWU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwdWJsaWMgY29weUtleUZyb21TcGxpdDxTIGV4dGVuZHMgb2JqZWN0LCBLIGV4dGVuZHMga2V5b2YgKFR8Uyk+KGtleTogSywgczogU3BsaXQ8Uz4pIHtcbiAgICAvLyBFeHBsaWNpdCBoYXMgaGlnaGVyIHByZWNlZGVuY2VcbiAgICBpZiAocy5leHBsaWNpdFtrZXldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuc2V0KGtleSwgcy5leHBsaWNpdFtrZXldLCB0cnVlKTtcbiAgICB9IGVsc2UgaWYgKHMuaW1wbGljaXRba2V5XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnNldChrZXksIHMuaW1wbGljaXRba2V5XSwgZmFsc2UpO1xuICAgIH1cbiAgfVxuICBwdWJsaWMgY29weUtleUZyb21PYmplY3Q8UywgSyBleHRlbmRzIGtleW9mIChUfFMpPihrZXk6IEssIHM6IFMpIHtcbiAgICAvLyBFeHBsaWNpdCBoYXMgaGlnaGVyIHByZWNlZGVuY2VcbiAgICBpZiAoc1trZXldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuc2V0KGtleSwgc1trZXldLCB0cnVlKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBFeHBsaWNpdDxUPiB7XG4gIGV4cGxpY2l0OiBib29sZWFuO1xuICB2YWx1ZTogVDtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gbWFrZUV4cGxpY2l0PFQ+KHZhbHVlOiBUKTogRXhwbGljaXQ8VD4ge1xuICByZXR1cm4ge1xuICAgIGV4cGxpY2l0OiB0cnVlLFxuICAgIHZhbHVlXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlSW1wbGljaXQ8VD4odmFsdWU6IFQpOiBFeHBsaWNpdDxUPiB7XG4gIHJldHVybiB7XG4gICAgZXhwbGljaXQ6IGZhbHNlLFxuICAgIHZhbHVlXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0aWVCcmVha0J5Q29tcGFyaW5nPFMsIFQ+KGNvbXBhcmU6ICh2MTogVCwgdjI6IFQpID0+IG51bWJlcikge1xuICByZXR1cm4gKHYxOiBFeHBsaWNpdDxUPiwgdjI6IEV4cGxpY2l0PFQ+LCBwcm9wZXJ0eToga2V5b2YgUyB8IG5ldmVyLCBwcm9wZXJ0eU9mOiBzdHJpbmcpOiBFeHBsaWNpdDxUPiA9PiB7XG4gICAgY29uc3QgZGlmZiA9IGNvbXBhcmUodjEudmFsdWUsIHYyLnZhbHVlKTtcbiAgICBpZiAoZGlmZiA+IDApIHtcbiAgICAgIHJldHVybiB2MTtcbiAgICB9IGVsc2UgaWYgKGRpZmYgPCAwKSB7XG4gICAgICByZXR1cm4gdjI7XG4gICAgfVxuICAgIHJldHVybiBkZWZhdWx0VGllQnJlYWtlcjxTLCBUPih2MSwgdjIsIHByb3BlcnR5LCBwcm9wZXJ0eU9mKTtcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRUaWVCcmVha2VyPFMsIFQ+KHYxOiBFeHBsaWNpdDxUPiwgdjI6IEV4cGxpY2l0PFQ+LCBwcm9wZXJ0eToga2V5b2YgUywgcHJvcGVydHlPZjogc3RyaW5nKSB7XG4gIGlmICh2MS5leHBsaWNpdCAmJiB2Mi5leHBsaWNpdCkge1xuICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLm1lcmdlQ29uZmxpY3RpbmdQcm9wZXJ0eShwcm9wZXJ0eSwgcHJvcGVydHlPZiwgdjEudmFsdWUsIHYyLnZhbHVlKSk7XG4gIH1cbiAgLy8gSWYgZXF1YWwgc2NvcmUsIHByZWZlciB2MS5cbiAgcmV0dXJuIHYxO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VWYWx1ZXNXaXRoRXhwbGljaXQ8UywgVD4oXG4gICAgdjE6IEV4cGxpY2l0PFQ+LCB2MjogRXhwbGljaXQ8VD4sXG4gICAgcHJvcGVydHk6IGtleW9mIFMsXG4gICAgcHJvcGVydHlPZjogJ3NjYWxlJyB8ICdheGlzJyB8ICdsZWdlbmQnIHwgJycsXG4gICAgdGllQnJlYWtlcjogKHYxOiBFeHBsaWNpdDxUPiwgdjI6IEV4cGxpY2l0PFQ+LCBwcm9wZXJ0eToga2V5b2YgUywgcHJvcGVydHlPZjogc3RyaW5nKSA9PiBFeHBsaWNpdDxUPiA9IGRlZmF1bHRUaWVCcmVha2VyXG4gICkge1xuICBpZiAodjEgPT09IHVuZGVmaW5lZCB8fCB2MS52YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gRm9yIGZpcnN0IHJ1blxuICAgIHJldHVybiB2MjtcbiAgfVxuXG4gIGlmICh2MS5leHBsaWNpdCAmJiAhdjIuZXhwbGljaXQpIHtcbiAgICByZXR1cm4gdjE7XG4gIH0gZWxzZSBpZiAodjIuZXhwbGljaXQgJiYgIXYxLmV4cGxpY2l0KSB7XG4gICAgcmV0dXJuIHYyO1xuICB9IGVsc2UgaWYgKHN0cmluZ2lmeSh2MS52YWx1ZSkgPT09IHN0cmluZ2lmeSh2Mi52YWx1ZSkpIHtcbiAgICByZXR1cm4gdjE7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRpZUJyZWFrZXIodjEsIHYyLCBwcm9wZXJ0eSwgcHJvcGVydHlPZik7XG4gIH1cbn1cbiJdfQ==