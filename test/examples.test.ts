import {expect} from 'chai';
import {VL_EXAMPLES} from '../examples/vlexamples';
import * as vl from '../src/vl';

const zSchema = require('z-schema');
const inspect = require('util').inspect;
const dl = require('datalib');

const validator = new zSchema();
const vlSchema = require('../src/schema/schema').schema,
  vgSchema = require('../node_modules/vega/vega-schema.json');

import {f} from './fixtures';

function validateAgainstSchemas(vlspec, done?) {
  var isVlValid = validator.validate(vlspec, vlSchema);
  var errors;

  if (!isVlValid) {
    errors = validator.getLastErrors();
    console.log(inspect(errors, { depth: 10, colors: true }));
  }
  expect(isVlValid).to.eql(true);

  var vegaSpec = vl.compile(vlspec);

  var isVgValid = validator.validate(vegaSpec, vgSchema);

  if (!isVgValid) {
    errors = validator.getLastErrors();
    console.log(inspect(errors, { depth: 10, colors: true }));
  }
  expect(isVgValid).to.eql(true);

  if (done) {
    done();
  }
}

describe('Examples', function() {
  var examples = dl.keys(VL_EXAMPLES).reduce(function(specs, groupName) {
    var group = VL_EXAMPLES[groupName];
    return specs.concat(group);
  }, []);

  examples.forEach(function(example) {
    it('should be valid and produce valid vega for: ' + example.name, function(done) {
      var json_data = dl.load({url: 'examples/' + example.name + '.json'});
      var data = dl.read(json_data, {type: 'json', parse: 'auto'});
      validateAgainstSchemas(data, done);
    });
  });
});

describe('Fixtures', function() {
  var fixtures = [];
  var addTitles = function(examples, name) {
    var  i = 1;
    return examples.reduce(function(aggregator, example) {
      aggregator.push({
        spec: example,
        title: name + ' ' + i++
      });
      return aggregator;
    }, []);
  };

  function values(obj) {
    return Object.keys(obj).map(key => obj[key]);
  }

  fixtures = fixtures.concat(addTitles(values(f.bars), 'bars'));
  fixtures = fixtures.concat(addTitles(values(f.points), 'points'));
  fixtures = fixtures.concat(addTitles(values(f.lines), 'lines'));
  fixtures = fixtures.concat(addTitles(values(f.area), 'area'));

  fixtures.forEach(function(fixture) {
    it('should be valid and produce valid vega for: ' + fixture.title, function() {
      validateAgainstSchemas(fixture.spec);
    });
  });
});
