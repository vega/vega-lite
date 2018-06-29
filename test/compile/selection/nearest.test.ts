/* tslint:disable quotemark */

import {assert} from 'chai';
import * as selection from '../../../src/compile/selection/selection';
import nearest from '../../../src/compile/selection/transforms/nearest';
import * as log from '../../../src/log';
import {duplicate} from '../../../src/util';
import {parseUnitModel} from '../../util';

function getModel(markType: any) {
  const model = parseUnitModel({
    "mark": markType,
    "encoding": {
      "x": {"field": "Horsepower","type": "quantitative"},
      "y": {"field": "Miles_per_Gallon","type": "quantitative"},
      "color": {"field": "Origin", "type": "nominal"}
    }
  });
  model.parseScale();
  model.parseMarkGroup();
  model.component.selection = selection.parseUnitSelection(model, {
    "one": {"type": "single", "nearest": true},
    "two": {"type": "multi", "nearest": true},
    "three": {"type": "interval"},
    "four": {"type": "single", "nearest": false},
    "five": {"type": "multi"},
    "six": {"type": "multi", "nearest": null},
    "seven": {"type": "single", "nearest": true, "encodings": ["x"]},
    "eight": {"type": "single", "nearest": true, "encodings": ["y"]},
    "nine": {"type": "single", "nearest": true, "encodings": ["color"]}
  });

  return model;
}

function voronoiMark(x?: string | {expr: string}, y?: string | {expr: string}) {
  return [
    {hello: "world"},
    {
      "name": "voronoi",
      "type": "path",
      "from": {"data": "marks"},
      "encode": {
        "enter": {
          "fill": {"value": "transparent"},
          "strokeWidth": {"value": 0.35},
          "stroke": {"value": "transparent"},
          "isVoronoi": {"value": true}
        }
      },
      "transform": [
        {
          "type": "voronoi",
          "x": x || {"expr": "datum.datum.x || 0"},
          "y": y || {"expr": "datum.datum.y || 0"},
          "size": [{"signal": "width"},{"signal": "height"}]
        }
      ]
    }
  ];
}

describe('Nearest Selection Transform', function() {
  it('identifies transform invocation', function() {
    const selCmpts = getModel('circle').component.selection;
    assert.isNotFalse(nearest.has(selCmpts['one']));
    assert.isNotFalse(nearest.has(selCmpts['two']));
    assert.isNotTrue(nearest.has(selCmpts['three']));
    assert.isNotTrue(nearest.has(selCmpts['four']));
    assert.isNotTrue(nearest.has(selCmpts['five']));
    assert.isNotTrue(nearest.has(selCmpts['six']));
  });

  it('adds voronoi for non-path marks', function() {
    const model = getModel('circle');
    const selCmpts = model.component.selection;
    const marks: any[] = [{hello: "world"}];

    assert.sameDeepMembers(
      nearest.marks(model, selCmpts['one'], marks), voronoiMark());
  });

  it('should warn for path marks', log.wrap((localLogger) => {
    const model = getModel('line');
    const selCmpts = model.component.selection;
    const marks: any[] = [];
    assert.equal(nearest.marks(model, selCmpts['one'], marks), marks);
    assert.equal(localLogger.warns[0], log.message.nearestNotSupportForContinuous('line'));
  }));

  it('limits to a single voronoi per unit', function() {
    const model = getModel('circle');
    const selCmpts = model.component.selection;
    const marks: any[] = [{hello: "world"}];

    const marks2 = nearest.marks(model, selCmpts['one'], marks);
    assert.sameDeepMembers(
      nearest.marks(model, selCmpts['two'], marks2), voronoiMark());
  });

  it('supports 1D voronoi', function() {
    const model = getModel('circle');
    const selCmpts = model.component.selection;
    const marks: any[] = [{hello: "world"}];

    assert.sameDeepMembers(
      nearest.marks(model, selCmpts['seven'], duplicate(marks)),
      voronoiMark(null, {"expr": "0"}));

    assert.sameDeepMembers(
      nearest.marks(model, selCmpts['eight'], duplicate(marks)),
      voronoiMark({"expr": "0"}));

    assert.sameDeepMembers(
      nearest.marks(model, selCmpts['nine'], duplicate(marks)),
      voronoiMark());
  });
});
