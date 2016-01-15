/* tslint:disable quote */

import {expect} from 'chai';
import {parseModel} from '../util';
import {extend} from '../../src/util'
import {X, Y, SIZE, COLOR, SHAPE} from '../../src/channel';
import {bar} from '../../src/compiler/marks-bar';

describe('compile/marks-bar', function() {
  describe('vertical, with log', function() {
    const e = parseModel({
      "mark": "bar",
      "encoding": {
        "x": {"bin": true, "type": "quantitative", "field": "IMDB_Rating"},
        "y": {"scale": {"type": 'log'}, "type": "quantitative", "field": 'US_Gross', "aggregate": "mean"}
      },
      "data": {"url": 'data/movies.json'}
    }),
        def = bar.properties(e);
    it('should end on axis', function() {
      expect(def.y2).to.eql({field: {group: 'height'}});
    });
    it('should has no height', function(){
      expect(def.height).to.be.undefined;
    });
  });

  describe('horizontal, with log', function() {
    const e = parseModel({
      "mark": "bar",
      "encoding": {
        "y": {"bin": true, "type": "quantitative", "field": "IMDB_Rating"},
        "x": {"scale": {"type": 'log'}, "type": "quantitative", "field": 'US_Gross', "aggregate": "mean"}
      },
      "data": {"url": 'data/movies.json'}
    });
    const def = bar.properties(e);
    it('should end on axis', function() {
      expect(def.x2).to.eql({value: 0});
    });
    it('should have no width', function(){
      expect(def.width).to.be.undefined;
    });
  });

  describe('1D, vertical', function() {
    const e = parseModel({
        "mark": "bar",
        "encoding": {"y": {"type": "quantitative", "field": 'US_Gross', "aggregate": "sum"}},
        "data": {"url": 'data/movies.json'}
      }),
      def = bar.properties(e);
    it('should end on axis', function() {
      expect(def.y2).to.eql({field: {group: 'height'}});
    });
    it('should have no height', function(){
      expect(def.height).to.be.undefined;
    });
    it('should have x-offset', function(){
      expect(def.x.offset).to.eql(2);
    });
  });

  describe('1D, horizontal', function() {
    const e = parseModel({
        "mark": "bar",
        "encoding": {"x": {"type": "quantitative", "field": 'US_Gross', "aggregate": 'sum'}},
        "data": {"url": 'data/movies.json'}
      }),
      def = bar.properties(e);
    it('should end on axis', function() {
      expect(def.x2).to.eql({value: 0});
    });
    it('should have no width', function(){
      expect(def.width).to.be.undefined;
    });
    it('should have y-offset', function(){
      expect(def.y2).to.eql({
        field: {group: 'height'},
        offset: -1
      });
    });
  });
});
