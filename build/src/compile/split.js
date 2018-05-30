"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BsaXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcGlsZS9zcGxpdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw0QkFBOEI7QUFDOUIsZ0NBQW1EO0FBR25EOzs7OztHQUtHO0FBQ0g7SUFDRSxlQUNrQixRQUF5QixFQUN6QixRQUF5QjtRQUR6Qix5QkFBQSxFQUFBLGFBQXlCO1FBQ3pCLHlCQUFBLEVBQUEsYUFBeUI7UUFEekIsYUFBUSxHQUFSLFFBQVEsQ0FBaUI7UUFDekIsYUFBUSxHQUFSLFFBQVEsQ0FBaUI7SUFDeEMsQ0FBQztJQUVHLHFCQUFLLEdBQVo7UUFDRSxPQUFPLElBQUksS0FBSyxDQUFDLGdCQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLGdCQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQUVNLHVCQUFPLEdBQWQ7UUFDRSx5QkFBeUI7UUFDekIsdUZBQXVGO1FBQ3ZGLDRCQUNLLElBQUksQ0FBQyxRQUFlLEVBQ3BCLElBQUksQ0FBQyxRQUFlLEVBQ3ZCO0lBQ0osQ0FBQztJQUVNLG1CQUFHLEdBQVYsVUFBOEIsR0FBTTtRQUNsQyxpQ0FBaUM7UUFDakMsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNwRixDQUFDO0lBRU0sK0JBQWUsR0FBdEIsVUFBMEMsR0FBTTtRQUM5QyxpQ0FBaUM7UUFDakMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFNBQVMsRUFBRTtZQUNwQyxPQUFPLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFH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LEVBQUU7UUFDdEMsT0FBTyxFQUFFLENBQUM7S0FDWDtTQUFNLElBQUksZ0JBQVMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssZ0JBQVMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDdEQsT0FBTyxFQUFFLENBQUM7S0FDWDtTQUFNO1FBQ0wsT0FBTyxVQUFVLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7S0FDakQ7QUFDSCxDQUFDO0FBcEJELDBEQW9CQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi9sb2cnO1xuaW1wb3J0IHtkdXBsaWNhdGUsIGtleXMsIHN0cmluZ2lmeX0gZnJvbSAnLi4vdXRpbCc7XG5cblxuLyoqXG4gKiBHZW5lcmljIGNsYXNzIGZvciBzdG9yaW5nIHByb3BlcnRpZXMgdGhhdCBhcmUgZXhwbGljaXRseSBzcGVjaWZpZWRcbiAqIGFuZCBpbXBsaWNpdGx5IGRldGVybWluZWQgYnkgdGhlIGNvbXBpbGVyLlxuICogVGhpcyBpcyBpbXBvcnRhbnQgZm9yIHNjYWxlL2F4aXMvbGVnZW5kIG1lcmdpbmcgYXNcbiAqIHdlIHdhbnQgdG8gcHJpb3JpdGl6ZSBwcm9wZXJ0aWVzIHRoYXQgdXNlcnMgZXhwbGljaXRseSBzcGVjaWZpZWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBTcGxpdDxUIGV4dGVuZHMgb2JqZWN0PiB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyByZWFkb25seSBleHBsaWNpdDogUGFydGlhbDxUPiA9IHt9LFxuICAgIHB1YmxpYyByZWFkb25seSBpbXBsaWNpdDogUGFydGlhbDxUPiA9IHt9XG4gICkge31cblxuICBwdWJsaWMgY2xvbmUoKSB7XG4gICAgcmV0dXJuIG5ldyBTcGxpdChkdXBsaWNhdGUodGhpcy5leHBsaWNpdCksIGR1cGxpY2F0ZSh0aGlzLmltcGxpY2l0KSk7XG4gIH1cblxuICBwdWJsaWMgY29tYmluZSgpOiBQYXJ0aWFsPFQ+IHtcbiAgICAvLyBGSVhNRSByZW1vdmUgXCJhcyBhbnlcIi5cbiAgICAvLyBBZGQgXCJhcyBhbnlcIiB0byBhdm9pZCBhbiBlcnJvciBcIlNwcmVhZCB0eXBlcyBtYXkgb25seSBiZSBjcmVhdGVkIGZyb20gb2JqZWN0IHR5cGVzXCIuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnRoaXMuZXhwbGljaXQgYXMgYW55LCAvLyBFeHBsaWNpdCBwcm9wZXJ0aWVzIGNvbWVzIGZpcnN0XG4gICAgICAuLi50aGlzLmltcGxpY2l0IGFzIGFueVxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgZ2V0PEsgZXh0ZW5kcyBrZXlvZiBUPihrZXk6IEspOiBUW0tdIHtcbiAgICAvLyBFeHBsaWNpdCBoYXMgaGlnaGVyIHByZWNlZGVuY2VcbiAgICByZXR1cm4gdGhpcy5leHBsaWNpdFtrZXldICE9PSB1bmRlZmluZWQgPyB0aGlzLmV4cGxpY2l0W2tleV0gOiB0aGlzLmltcGxpY2l0W2tleV07XG4gIH1cblxuICBwdWJsaWMgZ2V0V2l0aEV4cGxpY2l0PEsgZXh0ZW5kcyBrZXlvZiBUPihrZXk6IEspOiBFeHBsaWNpdDxUW0tdPiB7XG4gICAgLy8gRXhwbGljaXQgaGFzIGhpZ2hlciBwcmVjZWRlbmNlXG4gICAgaWYgKHRoaXMuZXhwbGljaXRba2V5XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4ge2V4cGxpY2l0OiB0cnVlLCB2YWx1ZTogdGhpcy5leHBsaWNpdFtrZXldfTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaW1wbGljaXRba2V5XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4ge2V4cGxpY2l0OiBmYWxzZSwgdmFsdWU6IHRoaXMuaW1wbGljaXRba2V5XX07XG4gICAgfVxuICAgIHJldHVybiB7ZXhwbGljaXQ6IGZhbHNlLCB2YWx1ZTogdW5kZWZpbmVkfTtcbiAgfVxuXG4gIHB1YmxpYyBzZXRXaXRoRXhwbGljaXQ8SyBleHRlbmRzIGtleW9mIFQ+KGtleTogSywgdmFsdWU6IEV4cGxpY2l0PFRbS10+KSB7XG4gICAgaWYgKHZhbHVlLnZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuc2V0KGtleSwgdmFsdWUudmFsdWUsIHZhbHVlLmV4cGxpY2l0KTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgc2V0PEsgZXh0ZW5kcyBrZXlvZiBUPihrZXk6IEssIHZhbHVlOiBUW0tdLCBleHBsaWNpdDogYm9vbGVhbikge1xuICAgIGRlbGV0ZSB0aGlzW2V4cGxpY2l0ID8gJ2ltcGxpY2l0JyA6ICdleHBsaWNpdCddW2tleV07XG4gICAgdGhpc1tleHBsaWNpdCA/ICdleHBsaWNpdCcgOiAnaW1wbGljaXQnXVtrZXldID0gdmFsdWU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwdWJsaWMgY29weUtleUZyb21TcGxpdDxTIGV4dGVuZHMgVD4oa2V5OiBrZXlvZiBULCBzOiBTcGxpdDxTPikge1xuICAgIC8vIEV4cGxpY2l0IGhhcyBoaWdoZXIgcHJlY2VkZW5jZVxuICAgIGlmIChzLmV4cGxpY2l0W2tleV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5zZXQoa2V5LCBzLmV4cGxpY2l0W2tleV0sIHRydWUpO1xuICAgIH0gZWxzZSBpZiAocy5pbXBsaWNpdFtrZXldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuc2V0KGtleSwgcy5pbXBsaWNpdFtrZXldLCBmYWxzZSk7XG4gICAgfVxuICB9XG4gIHB1YmxpYyBjb3B5S2V5RnJvbU9iamVjdDxTIGV4dGVuZHMgUGFydGlhbDxUPj4oa2V5OiBrZXlvZiBULCBzOiBTKSB7XG4gICAgLy8gRXhwbGljaXQgaGFzIGhpZ2hlciBwcmVjZWRlbmNlXG4gICAgaWYgKHNba2V5XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnNldChrZXksIHNba2V5XSwgdHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1lcmdlIHNwbGl0IG9iamVjdCBpbnRvIHRoaXMgc3BsaXQgb2JqZWN0LiBQcm9wZXJ0aWVzIGZyb20gdGhlIG90aGVyIHNwbGl0XG4gICAqIG92ZXJ3cml0ZSBwcm9wZXJ0aWVzIGZyb20gdGhpcyBzcGxpdC5cbiAgICovXG4gIHB1YmxpYyBjb3B5QWxsKG90aGVyOiBTcGxpdDxUPikge1xuICAgIGZvciAoY29uc3Qga2V5IG9mIGtleXMob3RoZXIuY29tYmluZSgpKSkge1xuICAgICAgY29uc3QgdmFsID0gb3RoZXIuZ2V0V2l0aEV4cGxpY2l0KGtleSk7XG4gICAgICB0aGlzLnNldFdpdGhFeHBsaWNpdChrZXksIHZhbCk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRXhwbGljaXQ8VD4ge1xuICBleHBsaWNpdDogYm9vbGVhbjtcbiAgdmFsdWU6IFQ7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VFeHBsaWNpdDxUPih2YWx1ZTogVCk6IEV4cGxpY2l0PFQ+IHtcbiAgcmV0dXJuIHtcbiAgICBleHBsaWNpdDogdHJ1ZSxcbiAgICB2YWx1ZVxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFrZUltcGxpY2l0PFQ+KHZhbHVlOiBUKTogRXhwbGljaXQ8VD4ge1xuICByZXR1cm4ge1xuICAgIGV4cGxpY2l0OiBmYWxzZSxcbiAgICB2YWx1ZVxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGllQnJlYWtCeUNvbXBhcmluZzxTLCBUPihjb21wYXJlOiAodjE6IFQsIHYyOiBUKSA9PiBudW1iZXIpIHtcbiAgcmV0dXJuICh2MTogRXhwbGljaXQ8VD4sIHYyOiBFeHBsaWNpdDxUPiwgcHJvcGVydHk6IGtleW9mIFMgfCBuZXZlciwgcHJvcGVydHlPZjogc3RyaW5nKTogRXhwbGljaXQ8VD4gPT4ge1xuICAgIGNvbnN0IGRpZmYgPSBjb21wYXJlKHYxLnZhbHVlLCB2Mi52YWx1ZSk7XG4gICAgaWYgKGRpZmYgPiAwKSB7XG4gICAgICByZXR1cm4gdjE7XG4gICAgfSBlbHNlIGlmIChkaWZmIDwgMCkge1xuICAgICAgcmV0dXJuIHYyO1xuICAgIH1cbiAgICByZXR1cm4gZGVmYXVsdFRpZUJyZWFrZXI8UywgVD4odjEsIHYyLCBwcm9wZXJ0eSwgcHJvcGVydHlPZik7XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWZhdWx0VGllQnJlYWtlcjxTLCBUPih2MTogRXhwbGljaXQ8VD4sIHYyOiBFeHBsaWNpdDxUPiwgcHJvcGVydHk6IGtleW9mIFMsIHByb3BlcnR5T2Y6IHN0cmluZykge1xuICBpZiAodjEuZXhwbGljaXQgJiYgdjIuZXhwbGljaXQpIHtcbiAgICBsb2cud2Fybihsb2cubWVzc2FnZS5tZXJnZUNvbmZsaWN0aW5nUHJvcGVydHkocHJvcGVydHksIHByb3BlcnR5T2YsIHYxLnZhbHVlLCB2Mi52YWx1ZSkpO1xuICB9XG4gIC8vIElmIGVxdWFsIHNjb3JlLCBwcmVmZXIgdjEuXG4gIHJldHVybiB2MTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlVmFsdWVzV2l0aEV4cGxpY2l0PFMsIFQ+KFxuICAgIHYxOiBFeHBsaWNpdDxUPiwgdjI6IEV4cGxpY2l0PFQ+LFxuICAgIHByb3BlcnR5OiBrZXlvZiBTLFxuICAgIHByb3BlcnR5T2Y6ICdzY2FsZScgfCAnYXhpcycgfCAnbGVnZW5kJyB8ICcnLFxuICAgIHRpZUJyZWFrZXI6ICh2MTogRXhwbGljaXQ8VD4sIHYyOiBFeHBsaWNpdDxUPiwgcHJvcGVydHk6IGtleW9mIFMsIHByb3BlcnR5T2Y6IHN0cmluZykgPT4gRXhwbGljaXQ8VD4gPSBkZWZhdWx0VGllQnJlYWtlclxuICApIHtcbiAgaWYgKHYxID09PSB1bmRlZmluZWQgfHwgdjEudmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgIC8vIEZvciBmaXJzdCBydW5cbiAgICByZXR1cm4gdjI7XG4gIH1cblxuICBpZiAodjEuZXhwbGljaXQgJiYgIXYyLmV4cGxpY2l0KSB7XG4gICAgcmV0dXJuIHYxO1xuICB9IGVsc2UgaWYgKHYyLmV4cGxpY2l0ICYmICF2MS5leHBsaWNpdCkge1xuICAgIHJldHVybiB2MjtcbiAgfSBlbHNlIGlmIChzdHJpbmdpZnkodjEudmFsdWUpID09PSBzdHJpbmdpZnkodjIudmFsdWUpKSB7XG4gICAgcmV0dXJuIHYxO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0aWVCcmVha2VyKHYxLCB2MiwgcHJvcGVydHksIHByb3BlcnR5T2YpO1xuICB9XG59XG4iXX0=