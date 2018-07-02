/* tslint:disable quotemark */
import { assert } from 'chai';
import { geoshape } from '../../../src/compile/mark/geoshape';
import { parseUnitModelWithScaleAndLayoutSize } from '../../util';
describe('Mark: Geoshape', function () {
    describe('encode', function () {
        it('should create no properties', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": "geoshape",
                "projection": {
                    "type": "albersUsa"
                },
                "data": {
                    "url": "data/us-10m.json",
                    "format": {
                        "type": "topojson",
                        "feature": "states"
                    }
                },
                "encoding": {
                    "color": {
                        "value": "black"
                    },
                    "opacity": {
                        "value": 0.8
                    }
                }
            });
            var props = geoshape.encodeEntry(model);
            assert.deepEqual({
                "fill": {
                    "value": "black"
                },
                "opacity": {
                    "value": 0.8
                }
            }, props);
        });
    });
});
//# sourceMappingURL=geoshape.test.js.map