"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var dataflow_1 = require("../../../src/compile/data/dataflow");
var impute_1 = require("../../../src/compile/data/impute");
var optimizers_1 = require("../../../src/compile/data/optimizers");
describe('compile/data/optimizer', function () {
    it('should merge two impute nodes with identical transforms', function () {
        var transform = {
            impute: 'y',
            key: 'x',
            method: 'value',
            value: 200
        };
        var root = new dataflow_1.DataFlowNode(null, 'root');
        var transform1 = new impute_1.ImputeNode(root, transform);
        // @ts-ignore
        var transform2 = new impute_1.ImputeNode(root, transform);
        optimizers_1.mergeIdenticalTransforms(root);
        chai_1.assert.deepEqual(root.children.length, 1);
        chai_1.assert.deepEqual(root.children[0], transform1);
    });
});
//# sourceMappingURL=optimizers.test.js.map