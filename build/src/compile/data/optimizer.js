import * as tslib_1 from "tslib";
import { SourceNode } from './source';
/**
 * Abstract base class for BottomUpOptimizer and TopDownOptimizer.
 * Contains only mutation handling logic. Subclasses need to implement iteration logic.
 */
var OptimizerBase = /** @class */ (function () {
    function OptimizerBase() {
        this._mutated = false;
    }
    // Once true, _mutated is never set to false
    OptimizerBase.prototype.setMutated = function () {
        this._mutated = true;
    };
    Object.defineProperty(OptimizerBase.prototype, "mutatedFlag", {
        get: function () {
            return this._mutated;
        },
        enumerable: true,
        configurable: true
    });
    return OptimizerBase;
}());
/**
 * Starts from a node and runs the optimization function(the "run" method) upwards to the root,
 * depending on the continueFlag and mutatedFlag values returned by the optimization function.
 */
var BottomUpOptimizer = /** @class */ (function (_super) {
    tslib_1.__extends(BottomUpOptimizer, _super);
    function BottomUpOptimizer() {
        var _this = _super.call(this) || this;
        _this._continue = false;
        return _this;
    }
    BottomUpOptimizer.prototype.setContinue = function () {
        this._continue = true;
    };
    Object.defineProperty(BottomUpOptimizer.prototype, "continueFlag", {
        get: function () {
            return this._continue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BottomUpOptimizer.prototype, "flags", {
        get: function () {
            return { continueFlag: this.continueFlag, mutatedFlag: this.mutatedFlag };
        },
        set: function (_a) {
            var continueFlag = _a.continueFlag, mutatedFlag = _a.mutatedFlag;
            if (continueFlag) {
                this.setContinue();
            }
            if (mutatedFlag) {
                this.setMutated();
            }
        },
        enumerable: true,
        configurable: true
    });
    BottomUpOptimizer.prototype.optimizeNextFromLeaves = function (node) {
        if (node instanceof SourceNode) {
            return false;
        }
        var next = node.parent;
        var continueFlag = this.run(node).continueFlag;
        if (continueFlag) {
            this.optimizeNextFromLeaves(next);
        }
        return this.mutatedFlag;
    };
    return BottomUpOptimizer;
}(OptimizerBase));
export { BottomUpOptimizer };
/**
 * The optimizer function( the "run" method), is invoked on the given node and then continues recursively.
 */
var TopDownOptimizer = /** @class */ (function (_super) {
    tslib_1.__extends(TopDownOptimizer, _super);
    function TopDownOptimizer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TopDownOptimizer;
}(OptimizerBase));
export { TopDownOptimizer };
//# sourceMappingURL=optimizer.js.map