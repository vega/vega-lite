'use strict';

var VEGA_DIR = 'vega';

var program = require('commander');
program.version('0.0.1')
  .description('Generate Test Cases. Regenerate all testcases in ' + VEGA_DIR + ' by default.  Use -f or -j to generate single test case.')
  .option('-j, --json [string]', 'Create test from json strings [null]', null)
  .option('-f, --file [path]', 'Create test from file [null]', null)
  .option('-d, --data [path]', 'Data file path (otherwise, path will be parsed from dataUrl config.) [null]', null)
  .option('-n, --note [String]', 'Add _info.description property to the vega-lite json file.', null)
  .parse(process.argv);

var fs = require('fs'),
  vl = require('../src/vl.js'),
  stringify = require('../lib/json3-compactstringify').stringify;

if (program.json || program.file) {
  var json = program.json ? JSON.parse(program.json) : require(program.file),
    encoding = vl.Encoding.fromSpec(json);

  if (program.note) {
    (encoding._info = encoding._info  || {}).description = program.note;
  }

  generate(encoding, 'specs');
}else {
  var testcases = require('./testcases');

  vl.keys(testcases).forEach(function(dataUrl) {
    testcases[dataUrl].forEach(function(tc) {
      var encoding = vl.Encoding.parseShorthand(tc.e, {dataUrl: dataUrl});
      encoding._info = {
        description: tc.n
      };
      generate(encoding, 'shorthand2vg');
    });
  });
  //TODO read from testcases.js instead

  // fs.readdir(vegaliteDir, function(err, files){
  //   files.filter(function(f){
  //     return f.lastIndexOf(".json") == f.length - 5; //filter .DSStore and other unrelated files
  //   }).forEach(function(f){
  //     generate(require(vegaliteDir+"/"+f));
  //   });
  // });
}

function writeErrorHandler(path) {
  return function(err) {
    if (err) {
      console.log(err);
    }else {
      console.log('File ', path, 'is saved!');
    }
  };
}

function generate(encoding, vlDir, vgDir) {
  if (program.note) {
    encoding._note = program.note;
  }
  var dataUrl = program.data || (encoding.data('url') ? '../' + encoding.data('url') : null);

  if (!dataUrl) {
    console.log('no data provided neither as argument or as dataUrl config.');
    process.exit(1);
  }

  var data = require(dataUrl);

  var dataname = dataUrl.split('/').pop().split('.');
  dataname = dataname.slice(0, dataname.length - 1).join('.');

  var filename = encoding.toShorthand();

  var stats = vl.data.stats(data),
    spec = vl.compile.encoding(encoding, stats);

  var vlPath = vlDir + '/'+ dataname + '.'+ filename + '.json',
    vgPath = vgDir + '/'+ dataname + '.'+ filename + '.json';

  if (vlDir) {
    fs.writeFile(vlPath, stringify(json, null, '  ', 80), writeErrorHandler(vlPath));
  }
  if (vgDir) {
    fs.writeFile(vgPath, stringify(spec, null, '  ', 80), writeErrorHandler(vgPath));
  }else {
    //output in console
    console.log(stringify(spec, null, '  ', 80));
  }
}
