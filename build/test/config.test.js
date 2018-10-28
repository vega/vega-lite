import * as tslib_1 from "tslib";
import { assert } from 'chai';
import { defaultConfig, isVgScheme, stripAndRedirectConfig } from '../src/config';
import { PRIMITIVE_MARKS } from '../src/mark';
import { duplicate } from '../src/util';
describe('config', function () {
    describe('stripAndRedirectConfig', function () {
        var config = tslib_1.__assign({}, defaultConfig, { mark: tslib_1.__assign({}, defaultConfig.mark, { opacity: 0.3 }), bar: tslib_1.__assign({ opacity: 0.5 }, defaultConfig.bar), view: {
                fill: '#eee'
            }, title: {
                color: 'red',
                fontWeight: 'bold'
            }, boxplot: {
                rule: {
                    fill: 'red'
                },
                median: {
                    color: 'white'
                }
            } });
        var copy = duplicate(config);
        var output = stripAndRedirectConfig(config);
        it('should not cause side-effect to the input', function () {
            assert.deepEqual(config, copy);
        });
        it('should remove VL only mark config but keep Vega mark config', function () {
            assert.isUndefined(output.mark.color);
            assert.equal(output.mark.opacity, 0.3);
        });
        it('should redirect mark config to style and remove VL only mark-specific config', function () {
            for (var _i = 0, PRIMITIVE_MARKS_1 = PRIMITIVE_MARKS; _i < PRIMITIVE_MARKS_1.length; _i++) {
                var mark = PRIMITIVE_MARKS_1[_i];
                assert.isUndefined(output[mark], mark + " config should be redirected");
            }
            assert.isUndefined(output.style.bar['binSpacing'], "VL only Bar config should be removed");
            assert.isUndefined(output.style.cell['width'], "VL only cell config should be removed");
            assert.isUndefined(output.style.cell['height'], "VL only cell config should be removed");
            assert.equal(output.style.cell['fill'], '#eee', "config.view should be redirect to config.style.cell");
            assert.deepEqual(output.style.bar.opacity, 0.5, 'Bar config should be redirected to config.style.bar');
        });
        it('should redirect config.title to config.style.group-title and rename color to fill', function () {
            assert.deepEqual(output.title, undefined);
            assert.deepEqual(output.style['group-title'].fontWeight, 'bold');
            assert.deepEqual(output.style['group-title'].fill, 'red');
        });
        it('should remove empty config object', function () {
            assert.isUndefined(output.axisTop);
        });
    });
    describe('isVgScheme', function () {
        it('should return true for valid scheme object', function () {
            assert.isTrue(isVgScheme({ scheme: 'viridis', count: 2 }));
        });
        it('should return false for non-scheme object', function () {
            assert.isFalse(isVgScheme(['#EA98D2', '#659CCA']));
        });
    });
});
//# sourceMappingURL=config.test.js.map