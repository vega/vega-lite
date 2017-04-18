import {assert} from 'chai';
import {parseConcatModel} from '../util';

describe('Concat', function() {
  describe('merge scale domains', () => {
    it('should instantiate all children', () => {
      const model = parseConcatModel({
        concat: [{
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
    });
  });
});
