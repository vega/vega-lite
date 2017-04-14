/* tslint:disable:quotemark */

import {assert} from 'chai';

import {parseMark} from '../../../src/compile/mark/mark';
import {UnitModel} from '../../../src/compile/unit';
import {parseFacetModel, parseUnitModel} from '../../util';

describe('Mark', function() {
  describe('parseMark', function() {
    // PATH
    describe('Multi-series Line', () => {
      it('should have a facet directive and a nested mark group that uses the faceted data.', () => {
        const model = parseUnitModel({
          "mark": "line",
          "encoding": {
            "x": {"field": "date", "type": "temporal", "axis": {"format": "%Y"}},
            "y": {"field": "price", "type": "quantitative"},
            "color": {"field": "symbol", "type": "nominal"}
          }
        });
        const markGroup = parseMark(model)[0];
        assert.equal(markGroup.name, 'pathgroup');
        assert.deepEqual(markGroup.from, {
          facet: {
            name: 'faceted-path-main',
            data: 'main',
            groupby: ['symbol']
          }
        });
        const submarkGroup = markGroup.marks[0];
        assert.equal(submarkGroup.name, 'marks');
        assert.equal(submarkGroup.type, 'line');
        assert.equal(submarkGroup.from.data, 'faceted-path-main');
      });
    });

    describe('Single Line', () => {
      it('should have a facet directive and a nested mark group', () => {
        const model = parseUnitModel({
          "mark": "line",
          "encoding": {
            "x": {"field": "date", "type": "temporal", "axis": {"format": "%Y"}},
            "y": {"field": "price", "type": "quantitative"}
          }
        });
        const markGroup = parseMark(model)[0];
        assert.equal(markGroup.name, 'marks');
        assert.equal(markGroup.type, 'line');
        assert.equal(markGroup.from.data, 'main');
      });
    });

    // NON-PATH
    describe('Aggregated Bar with a color with binned x', () => {
      it(' should use main stacked data source', () => {
        const model = parseUnitModel({
          "mark": "bar",
          "encoding": {
            "x": {"type": "quantitative", "field": "Cost__Other", "aggregate": "sum"},
            "y": {"bin": true, "type": "quantitative", "field": "Cost__Total_$"},
            "color": {"type": "ordinal", "field": "Effect__Amount_of_damage"}
          }
        });
        const markGroup = parseMark(model);
        assert.equal(markGroup[0].from.data, 'main');
      });
    });

    describe('Faceted aggregated Bar with a color with binned x', () => {
      it('should use faceted data source', () => {
        const model = parseFacetModel({
          facet: {
            row: {field: 'a', type: 'nominal'}
          },
          spec: {
            "mark": "bar",
            "encoding": {
              "x": {"type": "quantitative", "field": "Cost__Other", "aggregate": "sum"},
              "y": {"bin": true, "type": "quantitative", "field": "Cost__Total_$"},
              "color": {"type": "ordinal", "field": "Effect__Amount_of_damage"}
            }
          }
        });
        const markGroup = parseMark(model.child as UnitModel);
        assert.equal(markGroup[0].from.data, 'child_main');
      });
    });

    describe('Aggregated bar', () => {
      it('should use main aggregated data source', () => {
        const model = parseUnitModel({
          "mark": "bar",
          "encoding": {
            "x": {"type": "quantitative", "field": "Cost__Other", "aggregate": "sum"},
            "y": {"bin": true, "type": "quantitative", "field": "Cost__Total_$"}
          }
        });
        const markGroup = parseMark(model);
        assert.equal(markGroup[0].from.data, 'main');
      });
    });
  });
});
