/* tslint:disable quotemark */

import {assert} from 'chai';
import {nonPosition} from '../../../src/compile/mark/mixins';
import * as selection from '../../../src/compile/selection/selection';
import {expression} from '../../../src/filter';
import {parseUnitModel} from '../../util';

const predicate = selection.predicate;

describe('Selection Predicate', function() {
  const model = parseUnitModel({
    "mark": "circle",
    "encoding": {
      "x": {"field": "Horsepower","type": "quantitative"},
      "y": {"field": "Miles_per_Gallon","type": "quantitative"},
      "color": {
        "field": "Cylinders", "type": "O",
        "condition": {
          "selection": "one",
          "value": "grey"
        }
      },
      "opacity": {
        "field": "Origin", "type": "N",
        "condition": {
          "selection": {"or": ["one", {"and": ["two", {"not": "three"}]}]},
          "value": 0.5
        }
      }
    }
  });

  model.parseScale();

  model.component.selection = selection.parseUnitSelection(model, {
    "one": {"type": "single"},
    "two": {"type": "multi", "resolve": "union"},
    "three": {"type": "interval", "resolve": "intersect_others"}
  });

  it('generates the predicate expression', function() {
    assert.equal(predicate(model, "one"),
      'vlPoint("one_store", "", datum, "union", "all")');

    assert.equal(predicate(model, {"not": "one"}),
      '!(vlPoint("one_store", "", datum, "union", "all"))');

    assert.equal(predicate(model, {"not": {"and": ["one", "two"]}}),
      '!((vlPoint("one_store", "", datum, "union", "all")) && ' +
      '(vlPoint("two_store", "", datum, "union", "all")))');

    assert.equal(predicate(model, {"and": ["one", "two", {"not": "three"}]}),
      '(vlPoint("one_store", "", datum, "union", "all")) && ' +
      '(vlPoint("two_store", "", datum, "union", "all")) && ' +
      '(!(vlInterval("three_store", "", datum, "intersect", "others")))');

    assert.equal(predicate(model, {"or": ["one", {"and": ["two", {"not": "three"}]}]}),
      '(vlPoint("one_store", "", datum, "union", "all")) || ' +
      '((vlPoint("two_store", "", datum, "union", "all")) && ' +
      '(!(vlInterval("three_store", "", datum, "intersect", "others"))))');
  });

  it('generates Vega production rules', function() {
    assert.deepEqual(nonPosition('color', model), {
      color: [
        {test: 'vlPoint("one_store", "", datum, "union", "all")', value: "grey"},
        {scale: "color", field: "Cylinders"}
      ]
    });

    assert.deepEqual(nonPosition('opacity', model), {
      opacity: [
        {test: '(vlPoint("one_store", "", datum, "union", "all")) || ' +
              '((vlPoint("two_store", "", datum, "union", "all")) && ' +
              '(!(vlInterval("three_store", "", datum, "intersect", "others"))))',
          value: 0.5},
        {scale: "opacity", field: "Origin"}
      ]
    });
  });

  it('generates a selection filter', function() {
    assert.equal(expression(model, {"selection": "one"}),
      'vlPoint("one_store", "", datum, "union", "all")');

    assert.equal(expression(model, {"selection": {"not": "one"}}),
      '!(vlPoint("one_store", "", datum, "union", "all"))');

    assert.equal(expression(model, {"selection": {"not": {"and": ["one", "two"]}}}),
      '!((vlPoint("one_store", "", datum, "union", "all")) && ' +
      '(vlPoint("two_store", "", datum, "union", "all")))');

    assert.equal(expression(model, {"selection": {"and": ["one", "two", {"not": "three"}]}}),
      '(vlPoint("one_store", "", datum, "union", "all")) && ' +
      '(vlPoint("two_store", "", datum, "union", "all")) && ' +
      '(!(vlInterval("three_store", "", datum, "intersect", "others")))');

    assert.equal(expression(model, {"selection": {"or": ["one", {"and": ["two", {"not": "three"}]}]}}),
      '(vlPoint("one_store", "", datum, "union", "all")) || ' +
      '((vlPoint("two_store", "", datum, "union", "all")) && ' +
      '(!(vlInterval("three_store", "", datum, "intersect", "others"))))');
  });
});
