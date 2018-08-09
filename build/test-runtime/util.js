"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
// import {assert} from 'chai';
var fs = tslib_1.__importStar(require("fs"));
var mkdirp_1 = require("mkdirp");
var vega_util_1 = require("vega-util");
exports.generate = process.env.VL_GENERATE_TESTS;
exports.output = 'test-runtime/resources';
exports.selectionTypes = ['single', 'multi', 'interval'];
exports.compositeTypes = ['repeat', 'facet'];
exports.resolutions = ['union', 'intersect'];
exports.bound = 'bound';
exports.unbound = 'unbound';
exports.tuples = [
    { a: 0, b: 28, c: 0 },
    { a: 0, b: 55, c: 1 },
    { a: 0, b: 23, c: 2 },
    { a: 1, b: 43, c: 0 },
    { a: 1, b: 91, c: 1 },
    { a: 1, b: 54, c: 2 },
    { a: 2, b: 81, c: 0 },
    { a: 2, b: 53, c: 1 },
    { a: 2, b: 76, c: 2 },
    { a: 3, b: 19, c: 0 },
    { a: 3, b: 87, c: 1 },
    { a: 3, b: 12, c: 2 },
    { a: 4, b: 52, c: 0 },
    { a: 4, b: 48, c: 1 },
    { a: 4, b: 35, c: 2 },
    { a: 5, b: 24, c: 0 },
    { a: 5, b: 49, c: 1 },
    { a: 5, b: 48, c: 2 },
    { a: 6, b: 87, c: 0 },
    { a: 6, b: 66, c: 1 },
    { a: 6, b: 23, c: 2 },
    { a: 7, b: 17, c: 0 },
    { a: 7, b: 27, c: 1 },
    { a: 7, b: 39, c: 2 },
    { a: 8, b: 68, c: 0 },
    { a: 8, b: 16, c: 1 },
    { a: 8, b: 67, c: 2 },
    { a: 9, b: 49, c: 0 },
    { a: 9, b: 15, c: 1 },
    { a: 9, b: 48, c: 2 }
];
var unitNames = {
    repeat: ['child_d', 'child_e', 'child_f'],
    facet: ['child_0', 'child_1', 'child_2']
};
exports.hits = {
    discrete: {
        qq: [8, 19],
        qq_clear: [5, 16],
        bins: [4, 29],
        bins_clear: [18, 7],
        repeat: [5, 10, 17],
        repeat_clear: [13, 14, 2],
        facet: [2, 6, 9],
        facet_clear: [3, 4, 8]
    },
    interval: {
        drag: [[5, 14], [18, 26]],
        drag_clear: [[5], [16]],
        translate: [[6, 16], [24, 8]],
        bins: [[4, 8], [2, 7]],
        bins_clear: [[5], [9]],
        bins_translate: [[5, 7], [1, 8]],
        repeat: [[8, 29], [11, 26], [7, 21]],
        repeat_clear: [[8], [11], [17]],
        facet: [[1, 9], [2, 8], [4, 10]],
        facet_clear: [[3], [5], [7]]
    }
};
function base(iter, sel, opts) {
    if (opts === void 0) { opts = {}; }
    var data = { values: opts.values || exports.tuples };
    var x = tslib_1.__assign({ field: 'a', type: 'quantitative' }, opts.x);
    var y = tslib_1.__assign({ field: 'b', type: 'quantitative' }, opts.y);
    var color = tslib_1.__assign({ field: 'c', type: 'nominal' }, opts.color);
    var size = tslib_1.__assign({ value: 100 }, opts.size);
    var selection = { sel: sel };
    var mark = 'circle';
    return iter % 2 === 0
        ? {
            data: data,
            selection: selection,
            mark: mark,
            encoding: {
                x: x,
                y: y,
                size: size,
                color: {
                    condition: tslib_1.__assign({ selection: 'sel' }, color),
                    value: 'grey'
                }
            }
        }
        : {
            data: data,
            layer: [
                {
                    selection: selection,
                    mark: mark,
                    encoding: {
                        x: x,
                        y: y,
                        size: size,
                        color: color,
                        opacity: { value: 0.25 }
                    }
                },
                {
                    transform: [{ filter: { selection: 'sel' } }],
                    mark: mark,
                    encoding: { x: x, y: y, size: size, color: color }
                }
            ]
        };
}
function spec(compose, iter, sel, opts) {
    if (opts === void 0) { opts = {}; }
    var _a = base(iter, sel, opts), data = _a.data, specification = tslib_1.__rest(_a, ["data"]);
    var resolve = opts.resolve;
    switch (compose) {
        case 'unit':
            return tslib_1.__assign({ data: data }, specification);
        case 'facet':
            return {
                data: data,
                facet: { row: { field: 'c', type: 'nominal' } },
                spec: specification,
                resolve: resolve
            };
        case 'repeat':
            return {
                data: data,
                repeat: { row: ['d', 'e', 'f'] },
                spec: specification,
                resolve: resolve
            };
    }
    return null;
}
exports.spec = spec;
function unitNameRegex(specType, idx) {
    var name = unitNames[specType][idx].replace('child_', '');
    return new RegExp("child(.*?)_" + name);
}
exports.unitNameRegex = unitNameRegex;
function parentSelector(compositeType, index) {
    return compositeType === 'facet' ? "cell > g:nth-child(" + (index + 1) + ")" : unitNames.repeat[index] + '_group';
}
exports.parentSelector = parentSelector;
function brush(key, idx, parent, targetBrush) {
    var fn = key.match('_clear') ? 'clear' : 'brush';
    return "return " + fn + "(" + exports.hits.interval[key][idx].join(', ') + ", " + vega_util_1.stringValue(parent) + ", " + !!targetBrush + ")";
}
exports.brush = brush;
function pt(key, idx, parent) {
    var fn = key.match('_clear') ? 'clear' : 'pt';
    return "return " + fn + "(" + exports.hits.discrete[key][idx] + ", " + vega_util_1.stringValue(parent) + ")";
}
exports.pt = pt;
function embedFn(browser) {
    return function (specification) {
        browser.execute(function (_) { return window['embed'](_); }, specification);
    };
}
exports.embedFn = embedFn;
function svg(browser, path, filename) {
    var xml = browser.executeAsync(function (done) {
        window['view'].runAfter(function (view) { return view.toSVG().then(function (_) { return done(_); }); });
    });
    if (exports.generate) {
        mkdirp_1.sync((path = exports.output + "/" + path));
        fs.writeFileSync(path + "/" + filename + ".svg", xml.value);
    }
    return xml.value;
}
exports.svg = svg;
function testRenderFn(browser, path) {
    return function (filename) {
        // const render =
        svg(browser, path, filename);
        // const file = fs.readFileSync(`${output}/${path}/${filename}.svg`);
        // assert.equal(render, file);
    };
}
exports.testRenderFn = testRenderFn;
//# sourceMappingURL=util.js.map