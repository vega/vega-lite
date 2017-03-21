/* tslint:disable quotemark */

import {assert} from 'chai';
import * as selection from '../../../src/compile/selection/selection';
import nearest from '../../../src/compile/selection/transforms/nearest';
import {parseUnitModel} from '../../util';

function getModel(markType: any) {
  const model = parseUnitModel({
    "mark": markType,
    "encoding": {
      "x": {"field": "Horsepower","type": "quantitative"},
      "y": {"field": "Miles_per_Gallon","type": "quantitative"},
      "color": {"field": "Origin", "type": "N"}
    }
  });

  model.component.selection = selection.parseUnitSelection(model, {
    "one": {"type": "single", "nearest": true},
    "two": {"type": "multi", "nearest": true},
    "three": {"type": "interval", "nearest": true},
    "four": {"type": "single", "nearest": false},
    "five": {"type": "multi"}
  });

  return model;
}

describe('Nearest Selection Transform', function() {
  it('identifies transform invocation', function() {
    const selCmpts = getModel('circle').component.selection;
    assert.isTrue(nearest.has(selCmpts['one']));
    assert.isTrue(nearest.has(selCmpts['two']));
    assert.isTrue(nearest.has(selCmpts['three']));
    assert.isFalse(nearest.has(selCmpts['four']));
    assert.isFalse(nearest.has(selCmpts['five']));
  });

  it('adds voronoi for non-path marks', function() {
    const model = getModel('circle'),
      selCmpts = model.component.selection,
      marks: any[] = [{hello: "world"}];

    assert.sameDeepMembers(nearest.marks(model, selCmpts['one'], marks, marks), [
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
            "x": "datum.x",
            "y": "datum.y",
            "size": [{"signal": "width"},{"signal": "height"}]
          }
        ]
      }
    ]);
  });

  it('adds voronoi for path marks', function() {
    const model = getModel('line'),
      selCmpts = model.component.selection,
      marks: any[] = [{name: "pathgroup", hello: "world", marks: [{foo: "bar"}]}];

    assert.sameDeepMembers(nearest.marks(model, selCmpts['one'], marks, marks), [
      {
        name: "pathgroup",
        hello: "world",
        marks: [
          {foo: "bar"},
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
                "x": "datum.x",
                "y": "datum.y",
                "size": [{"signal": "width"},{"signal": "height"}]
              }
            ]
          }
        ]
      }
    ]);
  });

  it('limits to a single voronoi per unit', function() {
    let model = getModel('circle'),
      selCmpts = model.component.selection,
      marks: any[] = [{hello: "world"}];

    let marks2 = nearest.marks(model, selCmpts['one'], marks, marks);
    assert.sameDeepMembers(nearest.marks(model, selCmpts['two'], marks, marks2), [
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
            "x": "datum.x",
            "y": "datum.y",
            "size": [{"signal": "width"},{"signal": "height"}]
          }
        ]
      }
    ]);

    model = getModel('line');
    selCmpts = model.component.selection;
    marks = [{name: "pathgroup", hello: "world", marks: [{foo: "bar"}]}];
    marks2 = nearest.marks(model, selCmpts['one'], marks, marks);
    assert.sameDeepMembers(nearest.marks(model, selCmpts['two'], marks, marks2), [
      {
        name: "pathgroup",
        hello: "world",
        marks: [
          {foo: "bar"},
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
                "x": "datum.x",
                "y": "datum.y",
                "size": [{"signal": "width"},{"signal": "height"}]
              }
            ]
          }
        ]
      }
    ]);
  });
});
