/* tslint:disable quote */

import {expect} from 'chai';
import {parseModel} from '../util';
import {extend} from '../../src/util'
import {X, Y, SIZE, COLOR, SHAPE} from '../../src/channel';
import {bar} from '../../src/compile/mark-bar';

describe('Mark: Bar', function() {
  describe('with size.value specified', function() {
    // TODO
  });

  describe('vertical, with log', function() {
    const model = parseModel({
      "mark": "bar",
      "encoding": {
        "x": {"bin": true, "type": "quantitative", "field": "IMDB_Rating"},
        "y": {"scale": {"type": 'log'}, "type": "quantitative", "field": 'US_Gross', "aggregate": "mean"}
      },
      "data": {"url": 'data/movies.json'}
    });
    const props = bar.properties(model);

    it('should end on axis', function() {
      expect(props.y2).to.eql({field: {group: 'height'}});
    });

    it('should has no height', function(){
      expect(props.height).to.be.undefined;
    });
  });

  describe('horizontal, with log', function() {
    const model = parseModel({
      "mark": "bar",
      "encoding": {
        "y": {"bin": true, "type": "quantitative", "field": "IMDB_Rating"},
        "x": {"scale": {"type": 'log'}, "type": "quantitative", "field": 'US_Gross', "aggregate": "mean"}
      },
      "data": {"url": 'data/movies.json'}
    });

    const props = bar.properties(model);

    it('should end on axis', function() {
      expect(props.x2).to.eql({value: 0});
    });

    it('should have no width', function(){
      expect(props.width).to.be.undefined;
    });
  });

  describe('1D, vertical', function() {
    const model = parseModel({
        "mark": "bar",
        "encoding": {"y": {"type": "quantitative", "field": 'US_Gross', "aggregate": "sum"}},
        "data": {"url": 'data/movies.json'}
      });
    const props = bar.properties(model);

    it('should end on axis', function() {
      expect(props.y2).to.eql({field: {group: 'height'}});
    });

    it('should have no height', function(){
      expect(props.height).to.be.undefined;
    });

    it('should have x-offset', function(){
      expect(props.x.offset).to.eql(2);
    });
  });

  describe('1D, horizontal', function() {
    const model = parseModel({
        "mark": "bar",
        "encoding": {"x": {"type": "quantitative", "field": 'US_Gross', "aggregate": 'sum'}},
        "data": {"url": 'data/movies.json'}
      });
    const props = bar.properties(model);

    it('should end on axis', function() {
      expect(props.x2).to.eql({value: 0});
    });

    it('should have no width', function(){
      expect(props.width).to.be.undefined;
    });

    it('should have y-offset', function(){
      expect(props.y2).to.eql({
        field: {group: 'height'},
        offset: -1
      });
    });
  });
});
