import {assert} from 'chai';

import {LayerModel} from '../../src/compile/layer';
import {LayerSpec} from '../../src/spec';
import {parseLayerModel} from '../util';

describe('Layer', function() {
  it('should say it is layer', function() {
    const model = new LayerModel({layer: []} as LayerSpec, null, null);
    assert(!model.isUnit());
    assert(!model.isFacet());
    assert(model.isLayer());
  });

  describe('merge scale domains', () => {
    it('should merge domains', () => {
      const model = parseLayerModel({
        layer: [{
          mark: 'point',
          encoding: {
            x: {field: 'a', type: 'ordinal'}
          }
        },{
          mark: 'point',
          encoding: {
            x: {field: 'b', type: 'ordinal'}
          }
        }]
      });
      assert.equal(model.children.length, 2);
      model.parseScale();

      assert.deepEqual(model.component.scales['x'].main.domain, {
        fields: [{
          data: 'layer_0_source',
          field: 'a'
        },{
          data: 'layer_1_source',
          field: 'b'
        }],
        sort: true
      });
    });

    it('should merge unioned domains', () => {
      const model = parseLayerModel({
        layer: [{
          mark: 'point',
          encoding: {
            x: {bin: true, field: 'a', type: 'quantitative'}
          }
        },{
          mark: 'point',
          encoding: {
            x: {field: 'b', type: 'ordinal'}
          }
        }]
      });
      assert.equal(model.children.length, 2);
      model.parseScale();

      assert.deepEqual(model.component.scales['x'].main.domain, {
        fields: [{
          data: 'layer_0_source',
          field: 'bin_a_start'
        },{
          data: 'layer_0_source',
          field: 'bin_a_end'
        },{
          data: 'layer_1_source',
          field: 'b'
        }],
        sort: true
      });
    });

    it('should unioned explicit and referenced domains', () => {
      const model = parseLayerModel({
        layer: [{
          mark: 'point',
          encoding: {
            x: {scale: {domain: [1, 2, 3]}, field: 'b', type: 'ordinal'}
          }
        },{
          mark: 'point',
          encoding: {
            x: {field: 'b', type: 'ordinal'}
          }
        }]
      });
      model.parseScale();

      assert.deepEqual(model.component.scales['x'].main.domain, {
        fields: [
          [1, 2, 3],
          {
            data: 'layer_1_source',
            field: 'b'
          }
        ],
        sort: true
      });
    });
  });
});
