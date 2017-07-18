/* tslint:disable quotemark */

import {assert} from 'chai';
import * as selection from '../../../src/compile/selection/selection';
import nearest from '../../../src/compile/selection/transforms/nearest';
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

  model.component.selection = selection.parseUnitSelection(model, {
    "one": {"type": "single", "nearest": true},
    "two": {"type": "multi", "nearest": true},
    "three": {"type": "interval", "nearest": true},
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
          "x": x || "datum.x",
          "y": y || "datum.y",
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
      nearest.marks(model, selCmpts['one'], marks, marks), voronoiMark());
  });

  it('adds voronoi for path marks', function() {
    const model = getModel('line');
    const selCmpts = model.component.selection;
    const marks: any[] = [{name: "pathgroup", hello: "world", marks: [{foo: "bar"}]}];

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
    let model = getModel('circle');
    let selCmpts = model.component.selection;
    let marks: any[] = [{hello: "world"}];

    let marks2 = nearest.marks(model, selCmpts['one'], marks, marks);
    assert.sameDeepMembers(
      nearest.marks(model, selCmpts['two'], marks, marks2), voronoiMark());

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

  it('supports 1D voronoi', function() {
    const model = getModel('circle');
    const selCmpts = model.component.selection;
    const marks: any[] = [{hello: "world"}];

    assert.sameDeepMembers(
      nearest.marks(model, selCmpts['seven'], duplicate(marks), duplicate(marks)),
      voronoiMark("datum.x", {"expr": "0"}));

    assert.sameDeepMembers(
      nearest.marks(model, selCmpts['eight'], duplicate(marks), duplicate(marks)),
      voronoiMark({"expr": "0"}, "datum.y"));

    assert.sameDeepMembers(
      nearest.marks(model, selCmpts['nine'], duplicate(marks), duplicate(marks)),
      voronoiMark("datum.x", "datum.y"));
  });
});
