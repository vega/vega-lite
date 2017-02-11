/* tslint:disable:quotemark */

import {assert} from 'chai';

import {parseUnitModel, parseFacetModel} from '../../util';
import {parseMark} from '../../../src/compile/mark/mark';
import {UnitModel} from '../../../src/compile/unit';

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
            name: 'faceted-path-source',
            data: 'source',
            groupby: ['symbol']
          }
        });
        const submarkGroup = markGroup.marks[0];
        assert.equal(submarkGroup.name, 'marks');
        assert.equal(submarkGroup.type, 'line');
        assert.equal(submarkGroup.from.data, 'faceted-path-source');
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
        assert.equal(markGroup.from.data, 'source');
      });
    });

    // NON-PATH
    describe('Aggregated Bar with a color with binned x', () => {
      it(' should use stacked data source', () => {
        const model = parseUnitModel({
          "mark": "bar",
          "encoding": {
            "x": {"type": "quantitative", "field": "Cost__Other", "aggregate": "sum"},
            "y": {"bin": true, "type": "quantitative", "field": "Cost__Total_$"},
            "color": {"type": "ordinal", "field": "Effect__Amount_of_damage"}
          }
        });
        const markGroup = parseMark(model);
        assert.equal(markGroup[0].from.data, 'stacked');
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
        assert.equal(markGroup[0].from.data, 'faceted-data');
      });
    });

    describe('Aggregated bar', () => {
      it('should use summary data source', () => {
        const model = parseUnitModel({
          "mark": "bar",
          "encoding": {
            "x": {"type": "quantitative", "field": "Cost__Other", "aggregate": "sum"},
            "y": {"bin": true, "type": "quantitative", "field": "Cost__Total_$"}
          }
        });
        const markGroup = parseMark(model);
        assert.equal(markGroup[0].from.data, 'summary');
      });
    });
  });
});
