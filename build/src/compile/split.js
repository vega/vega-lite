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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BsaXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcGlsZS9zcGxpdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw0QkFBOEI7QUFDOUIsZ0NBQTZDO0FBRzdDOzs7OztHQUtHO0FBQ0g7SUFDRSxlQUNrQixRQUF5QixFQUN6QixRQUF5QjtRQUR6Qix5QkFBQSxFQUFBLGFBQXlCO1FBQ3pCLHlCQUFBLEVBQUEsYUFBeUI7UUFEekIsYUFBUSxHQUFSLFFBQVEsQ0FBaUI7UUFDekIsYUFBUSxHQUFSLFFBQVEsQ0FBaUI7SUFDeEMsQ0FBQztJQUVHLHFCQUFLLEdBQVo7UUFDRSxPQUFPLElBQUksS0FBSyxDQUFDLGdCQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLGdCQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQUVNLHVCQUFPLEdBQWQ7UUFDRSx5QkFBeUI7UUFDekIsdUZBQXVGO1FBQ3ZGLDRCQUNLLElBQUksQ0FBQyxRQUFlLEVBQ3BCLElBQUksQ0FBQyxRQUFlLEVBQ3ZCO0lBQ0osQ0FBQztJQUVNLG1CQUFHLEdBQVYsVUFBOEIsR0FBTTtRQUNsQyxpQ0FBaUM7UUFDakMsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNwRixDQUFDO0lBRU0sK0JBQWUsR0FBdEIsVUFBMEMsR0FBTTtRQUM5QyxpQ0FBaUM7UUFDakMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFNBQVMsRUFBRTtZQUNwQyxPQUFPLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFH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cyBsb2cgZnJvbSAnLi4vbG9nJztcbmltcG9ydCB7ZHVwbGljYXRlLCBzdHJpbmdpZnl9IGZyb20gJy4uL3V0aWwnO1xuXG5cbi8qKlxuICogR2VuZXJpYyBjbGFzcyBmb3Igc3RvcmluZyBwcm9wZXJ0aWVzIHRoYXQgYXJlIGV4cGxpY2l0bHkgc3BlY2lmaWVkXG4gKiBhbmQgaW1wbGljaXRseSBkZXRlcm1pbmVkIGJ5IHRoZSBjb21waWxlci5cbiAqIFRoaXMgaXMgaW1wb3J0YW50IGZvciBzY2FsZS9heGlzL2xlZ2VuZCBtZXJnaW5nIGFzXG4gKiB3ZSB3YW50IHRvIHByaW9yaXRpemUgcHJvcGVydGllcyB0aGF0IHVzZXJzIGV4cGxpY2l0bHkgc3BlY2lmaWVkLlxuICovXG5leHBvcnQgY2xhc3MgU3BsaXQ8VCBleHRlbmRzIG9iamVjdD4ge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgcmVhZG9ubHkgZXhwbGljaXQ6IFBhcnRpYWw8VD4gPSB7fSxcbiAgICBwdWJsaWMgcmVhZG9ubHkgaW1wbGljaXQ6IFBhcnRpYWw8VD4gPSB7fVxuICApIHt9XG5cbiAgcHVibGljIGNsb25lKCkge1xuICAgIHJldHVybiBuZXcgU3BsaXQoZHVwbGljYXRlKHRoaXMuZXhwbGljaXQpLCBkdXBsaWNhdGUodGhpcy5pbXBsaWNpdCkpO1xuICB9XG5cbiAgcHVibGljIGNvbWJpbmUoKTogUGFydGlhbDxUPiB7XG4gICAgLy8gRklYTUUgcmVtb3ZlIFwiYXMgYW55XCIuXG4gICAgLy8gQWRkIFwiYXMgYW55XCIgdG8gYXZvaWQgYW4gZXJyb3IgXCJTcHJlYWQgdHlwZXMgbWF5IG9ubHkgYmUgY3JlYXRlZCBmcm9tIG9iamVjdCB0eXBlc1wiLlxuICAgIHJldHVybiB7XG4gICAgICAuLi50aGlzLmV4cGxpY2l0IGFzIGFueSwgLy8gRXhwbGljaXQgcHJvcGVydGllcyBjb21lcyBmaXJzdFxuICAgICAgLi4udGhpcy5pbXBsaWNpdCBhcyBhbnlcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIGdldDxLIGV4dGVuZHMga2V5b2YgVD4oa2V5OiBLKTogVFtLXSB7XG4gICAgLy8gRXhwbGljaXQgaGFzIGhpZ2hlciBwcmVjZWRlbmNlXG4gICAgcmV0dXJuIHRoaXMuZXhwbGljaXRba2V5XSAhPT0gdW5kZWZpbmVkID8gdGhpcy5leHBsaWNpdFtrZXldIDogdGhpcy5pbXBsaWNpdFtrZXldO1xuICB9XG5cbiAgcHVibGljIGdldFdpdGhFeHBsaWNpdDxLIGV4dGVuZHMga2V5b2YgVD4oa2V5OiBLKTogRXhwbGljaXQ8VFtLXT4ge1xuICAgIC8vIEV4cGxpY2l0IGhhcyBoaWdoZXIgcHJlY2VkZW5jZVxuICAgIGlmICh0aGlzLmV4cGxpY2l0W2tleV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHtleHBsaWNpdDogdHJ1ZSwgdmFsdWU6IHRoaXMuZXhwbGljaXRba2V5XX07XG4gICAgfSBlbHNlIGlmICh0aGlzLmltcGxpY2l0W2tleV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHtleHBsaWNpdDogZmFsc2UsIHZhbHVlOiB0aGlzLmltcGxpY2l0W2tleV19O1xuICAgIH1cbiAgICByZXR1cm4ge2V4cGxpY2l0OiBmYWxzZSwgdmFsdWU6IHVuZGVmaW5lZH07XG4gIH1cblxuICBwdWJsaWMgc2V0V2l0aEV4cGxpY2l0PEsgZXh0ZW5kcyBrZXlvZiBUPihrZXk6IEssIHZhbHVlOiBFeHBsaWNpdDxUW0tdPikge1xuICAgIGlmICh2YWx1ZS52YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnNldChrZXksIHZhbHVlLnZhbHVlLCB2YWx1ZS5leHBsaWNpdCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHNldDxLIGV4dGVuZHMga2V5b2YgVD4oa2V5OiBLLCB2YWx1ZTogVFtLXSwgZXhwbGljaXQ6IGJvb2xlYW4pIHtcbiAgICBkZWxldGUgdGhpc1tleHBsaWNpdCA/ICdpbXBsaWNpdCcgOiAnZXhwbGljaXQnXVtrZXldO1xuICAgIHRoaXNbZXhwbGljaXQgPyAnZXhwbGljaXQnIDogJ2ltcGxpY2l0J11ba2V5XSA9IHZhbHVlO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcHVibGljIGNvcHlLZXlGcm9tU3BsaXQ8UyBleHRlbmRzIFQ+KGtleToga2V5b2YgVCwgczogU3BsaXQ8Uz4pIHtcbiAgICAvLyBFeHBsaWNpdCBoYXMgaGlnaGVyIHByZWNlZGVuY2VcbiAgICBpZiAocy5leHBsaWNpdFtrZXldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuc2V0KGtleSwgcy5leHBsaWNpdFtrZXldLCB0cnVlKTtcbiAgICB9IGVsc2UgaWYgKHMuaW1wbGljaXRba2V5XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnNldChrZXksIHMuaW1wbGljaXRba2V5XSwgZmFsc2UpO1xuICAgIH1cbiAgfVxuICBwdWJsaWMgY29weUtleUZyb21PYmplY3Q8UyBleHRlbmRzIFBhcnRpYWw8VD4+KGtleToga2V5b2YgVCwgczogUykge1xuICAgIC8vIEV4cGxpY2l0IGhhcyBoaWdoZXIgcHJlY2VkZW5jZVxuICAgIGlmIChzW2tleV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5zZXQoa2V5LCBzW2tleV0sIHRydWUpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEV4cGxpY2l0PFQ+IHtcbiAgZXhwbGljaXQ6IGJvb2xlYW47XG4gIHZhbHVlOiBUO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlRXhwbGljaXQ8VD4odmFsdWU6IFQpOiBFeHBsaWNpdDxUPiB7XG4gIHJldHVybiB7XG4gICAgZXhwbGljaXQ6IHRydWUsXG4gICAgdmFsdWVcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VJbXBsaWNpdDxUPih2YWx1ZTogVCk6IEV4cGxpY2l0PFQ+IHtcbiAgcmV0dXJuIHtcbiAgICBleHBsaWNpdDogZmFsc2UsXG4gICAgdmFsdWVcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRpZUJyZWFrQnlDb21wYXJpbmc8UywgVD4oY29tcGFyZTogKHYxOiBULCB2MjogVCkgPT4gbnVtYmVyKSB7XG4gIHJldHVybiAodjE6IEV4cGxpY2l0PFQ+LCB2MjogRXhwbGljaXQ8VD4sIHByb3BlcnR5OiBrZXlvZiBTIHwgbmV2ZXIsIHByb3BlcnR5T2Y6IHN0cmluZyk6IEV4cGxpY2l0PFQ+ID0+IHtcbiAgICBjb25zdCBkaWZmID0gY29tcGFyZSh2MS52YWx1ZSwgdjIudmFsdWUpO1xuICAgIGlmIChkaWZmID4gMCkge1xuICAgICAgcmV0dXJuIHYxO1xuICAgIH0gZWxzZSBpZiAoZGlmZiA8IDApIHtcbiAgICAgIHJldHVybiB2MjtcbiAgICB9XG4gICAgcmV0dXJuIGRlZmF1bHRUaWVCcmVha2VyPFMsIFQ+KHYxLCB2MiwgcHJvcGVydHksIHByb3BlcnR5T2YpO1xuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVmYXVsdFRpZUJyZWFrZXI8UywgVD4odjE6IEV4cGxpY2l0PFQ+LCB2MjogRXhwbGljaXQ8VD4sIHByb3BlcnR5OiBrZXlvZiBTLCBwcm9wZXJ0eU9mOiBzdHJpbmcpIHtcbiAgaWYgKHYxLmV4cGxpY2l0ICYmIHYyLmV4cGxpY2l0KSB7XG4gICAgbG9nLndhcm4obG9nLm1lc3NhZ2UubWVyZ2VDb25mbGljdGluZ1Byb3BlcnR5KHByb3BlcnR5LCBwcm9wZXJ0eU9mLCB2MS52YWx1ZSwgdjIudmFsdWUpKTtcbiAgfVxuICAvLyBJZiBlcXVhbCBzY29yZSwgcHJlZmVyIHYxLlxuICByZXR1cm4gdjE7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZVZhbHVlc1dpdGhFeHBsaWNpdDxTLCBUPihcbiAgICB2MTogRXhwbGljaXQ8VD4sIHYyOiBFeHBsaWNpdDxUPixcbiAgICBwcm9wZXJ0eToga2V5b2YgUyxcbiAgICBwcm9wZXJ0eU9mOiAnc2NhbGUnIHwgJ2F4aXMnIHwgJ2xlZ2VuZCcgfCAnJyxcbiAgICB0aWVCcmVha2VyOiAodjE6IEV4cGxpY2l0PFQ+LCB2MjogRXhwbGljaXQ8VD4sIHByb3BlcnR5OiBrZXlvZiBTLCBwcm9wZXJ0eU9mOiBzdHJpbmcpID0+IEV4cGxpY2l0PFQ+ID0gZGVmYXVsdFRpZUJyZWFrZXJcbiAgKSB7XG4gIGlmICh2MSA9PT0gdW5kZWZpbmVkIHx8IHYxLnZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAvLyBGb3IgZmlyc3QgcnVuXG4gICAgcmV0dXJuIHYyO1xuICB9XG5cbiAgaWYgKHYxLmV4cGxpY2l0ICYmICF2Mi5leHBsaWNpdCkge1xuICAgIHJldHVybiB2MTtcbiAgfSBlbHNlIGlmICh2Mi5leHBsaWNpdCAmJiAhdjEuZXhwbGljaXQpIHtcbiAgICByZXR1cm4gdjI7XG4gIH0gZWxzZSBpZiAoc3RyaW5naWZ5KHYxLnZhbHVlKSA9PT0gc3RyaW5naWZ5KHYyLnZhbHVlKSkge1xuICAgIHJldHVybiB2MTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdGllQnJlYWtlcih2MSwgdjIsIHByb3BlcnR5LCBwcm9wZXJ0eU9mKTtcbiAgfVxufVxuIl19