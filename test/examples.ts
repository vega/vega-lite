var galleryExamples = require('../gallery/examples');

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

function values(obj) {
  return Object.keys(obj).map(key => obj[key]);
}

e = e.concat(addTitles(values(f.bars), 'bars'));
e = e.concat(addTitles(values(f.points), 'points'));
e = e.concat(addTitles(values(f.lines), 'lines'));
e = e.concat(addTitles(values(f.area), 'area'));
e = e.concat(galleryExamples);

module.exports = e;
