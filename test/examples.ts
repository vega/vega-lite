import * as __ from 'lodash';
var galleryExamples = require('../site/examples');

import {f} from './fixtures';

var e = [];

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

e = e.concat(addTitles(__.values(f.bars), 'bars'));
e = e.concat(addTitles(__.values(f.points), 'points'));
e = e.concat(addTitles(__.values(f.lines), 'lines'));
e = e.concat(addTitles(__.values(f.area), 'area'));
e = e.concat(galleryExamples);

module.exports = e;
