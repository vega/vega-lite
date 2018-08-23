import * as tslib_1 from "tslib";
import { isString, toSet } from 'vega-util';
import * as log from '../../log';
import { hash } from '../../util';
import { OutputNode, TransformNode } from './dataflow';
import { SourceNode } from './source';
var LookupNode = /** @class */ (function (_super) {
    tslib_1.__extends(LookupNode, _super);
    function LookupNode(parent, transform, secondary) {
        var _this = _super.call(this, parent) || this;
        _this.transform = transform;
        _this.secondary = secondary;
        return _this;
    }
    LookupNode.make = function (parent, model, transform, counter) {
        var sources = model.component.data.sources;
        var s = new SourceNode(transform.from.data);
        var fromSource = sources[s.hash()];
        if (!fromSource) {
            sources[s.hash()] = s;
            fromSource = s;
        }
        var fromOutputName = model.getName("lookup_" + counter);
        var fromOutputNode = new OutputNode(fromSource, fromOutputName, 'lookup', model.component.data.outputNodeRefCounts);
        model.component.data.outputNodes[fromOutputName] = fromOutputNode;
        return new LookupNode(parent, transform, fromOutputNode.getSource());
    };
    LookupNode.prototype.producedFields = function () {
        return toSet(this.transform.from.fields || (this.transform.as instanceof Array ? this.transform.as : [this.transform.as]));
    };
    LookupNode.prototype.hash = function () {
        return "Lookup " + hash({ transform: this.transform, secondary: this.secondary });
    };
    LookupNode.prototype.assemble = function () {
        var foreign;
        if (this.transform.from.fields) {
            // lookup a few fields and add create a flat output
            foreign = tslib_1.__assign({ values: this.transform.from.fields }, (this.transform.as ? { as: this.transform.as instanceof Array ? this.transform.as : [this.transform.as] } : {}));
        }
        else {
            // lookup full record and nest it
            var asName = this.transform.as;
            if (!isString(asName)) {
                log.warn(log.message.NO_FIELDS_NEEDS_AS);
                asName = '_lookup';
            }
            foreign = {
                as: [asName]
            };
        }
        return tslib_1.__assign({ type: 'lookup', from: this.secondary, key: this.transform.from.key, fields: [this.transform.lookup] }, foreign, (this.transform.default ? { default: this.transform.default } : {}));
    };
    return LookupNode;
}(TransformNode));
export { LookupNode };
//# sourceMappingURL=lookup.js.map