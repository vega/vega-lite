#!/usr/bin/env node

var VEGA_DIR = "shorthand2vg";

var program = require('commander');
program.version('0.0.1')
  .description("Generate Vega specs from Vegalite object in testcases.js and compare output with testcases in "+ VEGA_DIR)
  // .option('-f, --files [path]', 'Test specific files (Use comma to separate filename', null)
  .parse(process.argv);

var  fs = require('fs'),
  vl = require('../src/vegalite.js'),
  stringify = require('../lib/json3-compactstringify').stringify,
  assert = require('chai').assert,
  deepDiff = require('deep-diff').diff;

var badList = [], goodList = [];

// if(program.files){
//   program.files.split(",").forEach(function(filename){
//     var json = require("./"+VEGALITE_DIR+"/"+filename),
//       encoding = vl.Encoding.parseJSON(json);
//     test(filename, encoding);
//   });
//   log();
// }else{
  var testcases =  require('./testcases');
  vl.keys(testcases).forEach(function(dataUrl){
    testcases[dataUrl].forEach(function(tc){
      var encoding = vl.Encoding.parseShorthand(tc.e, {dataUrl: dataUrl}),
        filename = encoding.toShorthand();
      test(filename, encoding);
    })
  })
// }

function test(filename, encoding){
  var dataUrl = '../'+encoding.config("dataUrl"),
    data = require(dataUrl),
    stats = vl.getStats(encoding, data),
    spec = vl.toVegaSpec(encoding, stats);

  var dataname = dataUrl.split("/").pop().split(".");
  dataname = dataname.slice(0, dataname.length -1).join(".");
  var vgPath = VEGA_DIR+"/"+dataname+"."+filename+'.json',
    testSpec = require(vgPath);

  var diff = deepDiff(spec, testSpec);

  if(diff){
    console.log("Bad:", filename, diff);
    badList.push({
      filename: filename,
      spec: spec,
      testSpec: testSpec
    });
  }else{
    console.log("Good:", filename);
    goodList.push({
      filename: filename,
      spec: spec
    });
  }
}

function writeErrorHandler(path){
  return function(err){
    if(err){
      console.log(err);
    }else{
      console.log('File ', path, 'is saved!');
    }
  };
}

function log(){
  var out = stringify({bad: badList, good: goodList}, null, "  ", 80);
  fs.writeFile("log/difflist.json", out, writeErrorHandler("log/difflist.json"));
  fs.writeFile("log/difflist_" + (new Date()).toJSON() + ".json", out, writeErrorHandler("log/difflist_" + (new Date()).toJSON() + ".json"));
}
