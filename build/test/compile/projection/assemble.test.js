import { assert } from 'chai';
import { assembleProjectionForModel } from '../../../src/compile/projection/assemble';
import { isVgSignalRef } from '../../../src/vega.schema';
import { parseUnitModelWithScaleAndLayoutSize } from '../../util';
describe('compile/projection/assemble', function () {
    describe('assembleProjectionForModel', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            'mark': 'geoshape',
            'projection': {
                'type': 'albersUsa'
            },
            'data': {
                'url': 'data/us-10m.json',
                'format': {
                    'type': 'topojson',
                    'feature': 'states'
                }
            },
            'encoding': {}
        });
        model.parse();
        it('should not be empty', function () {
            assert.isNotEmpty(assembleProjectionForModel(model));
        });
        it('should have properties of right type', function () {
            var projection = assembleProjectionForModel(model)[0];
            assert.isDefined(projection.name);
            assert.isString(projection.name);
            assert.isDefined(projection.size);
            assert.isTrue(isVgSignalRef(projection.size));
            assert.isDefined(projection.fit);
            assert.isTrue(isVgSignalRef(projection.fit));
        });
    });
});
//# sourceMappingURL=assemble.test.js.map