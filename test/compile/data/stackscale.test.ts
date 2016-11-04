/* tslint:disable:quotemark */

import {assert} from 'chai';

import {stackScale} from '../../../src/compile/data/stackscale';
import {DataComponent} from '../../../src/compile/data/data';

import {parseUnitModel} from '../../util';

describe('compile/data/stackscale', function() {
  describe('unit without stack', function() {
    const model = parseUnitModel({
      "mark": "point",
      "encoding": {}
    });

    it('should not produce stack component', function() {
      model.component.data = {} as DataComponent;
      model.component.data.stackScale = stackScale.parseUnit(model);
      assert.equal(model.component.data.stackScale, null);
    });
  });

  describe('unit with color and binned x', function() {
    const model = parseUnitModel({
      "mark": "bar",
      "encoding": {
        "x": {"type": "quantitative", "field": "Cost__Other", "aggregate": "sum"},
        "y": {"bin": true, "type": "quantitative", "field": "Cost__Total_$"},
        "color": {"type": "ordinal", "field": "Effect__Amount_of_damage"}
      }
    });
    model.component.data = {} as DataComponent;
    model.component.data.stackScale = stackScale.parseUnit(model);

    it('should produce the correct stack component', function() {
      const stackedData = model.component.data.stackScale;
      assert.equal(stackedData.transform[0].groupby[0], 'bin_Cost__Total_$_start');
    });

    it('should assemble stack summary data correctly', function() {
      // simply return identity
      const summaryData = stackScale.assemble(model.component.data);
      assert.deepEqual(summaryData, model.component.data.stackScale);
    });
  });

  describe('unit with color and binned y', function() {
    const model = parseUnitModel({
      "mark": "bar",
      "encoding": {
        "y": {"type": "quantitative", "field": "Cost__Other", "aggregate": "sum"},
        "x": {"bin": true, "type": "quantitative", "field": "Cost__Total_$"},
        "color": {"type": "ordinal", "field": "Effect__Amount_of_damage"}
      }
    });

    model.component.data = {} as DataComponent;
    model.component.data.stackScale = stackScale.parseUnit(model);

    it('should produce the correct stack component', function() {
      const stackedData = model.component.data.stackScale;
      assert.equal(stackedData.transform[0].groupby[0], 'bin_Cost__Total_$_start');
    });

    it('should assemble stack summary data correctly', function() {
      // simply return identity
      const summaryData = stackScale.assemble(model.component.data);
      assert.deepEqual(summaryData, model.component.data.stackScale);
    });
  });

  describe('parseLayer', function() {
    // TODO: write test
  });

  describe('parseFacet', function() {
    // TODO: write test
  });

  describe('assemble', function() {
    // TODO: write test
  });
});
