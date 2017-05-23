import {assert} from 'chai';
import {VgLayout} from '../../src/vega.schema';
import {parseConcatModel} from '../util';

describe('Concat', function() {
  describe('merge scale domains', () => {
    it('should instantiate all children in vConcat', () => {
      const model = parseConcatModel({
        vConcat: [{
          mark: 'point',
          encoding: {
            x: {field: 'a', type: 'ordinal'}
          }
        },{
          mark: 'bar',
          encoding: {
            x: {field: 'b', type: 'ordinal'},
            y: {field: 'c', type: 'quantitative'}
          }
        }]
      });

      assert.equal(model.children.length, 2);
      assert(model.isVConcat);
    });

    it('should instantiate all children in hConcat', () => {
      const model = parseConcatModel({
        hConcat: [{
          mark: 'point',
          encoding: {
            x: {field: 'a', type: 'ordinal'}
          }
        },{
          mark: 'bar',
          encoding: {
            x: {field: 'b', type: 'ordinal'},
            y: {field: 'c', type: 'quantitative'}
          }
        }]
      });

      assert.equal(model.children.length, 2);
      assert(!model.isVConcat);
    });

    it('should create correct layout for vConcat', () => {
      const model = parseConcatModel({
        vConcat: [{
          mark: 'point',
          encoding: {
          }
        },{
          mark: 'bar',
          encoding: {
          }
        }]
      });

      assert.deepEqual<VgLayout>(model.assembleLayout(), {
        padding: {row: 10, column: 10},
        offset: 10,
        columns: 1,
        bounds: 'full',
        align: 'all'
      });
    });

    it('should create correct layout for hConcat', () => {
      const model = parseConcatModel({
        hConcat: [{
          mark: 'point',
          encoding: {
          }
        },{
          mark: 'bar',
          encoding: {
          }
        }]
      });

      assert.deepEqual<VgLayout>(model.assembleLayout(), {
        padding: {row: 10, column: 10},
        offset: 10,
        bounds: 'full',
        align: 'all'
      });
    });
  });
});
