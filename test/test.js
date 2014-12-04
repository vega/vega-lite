#!/usr/bin/env node

var VEGA_DIR = "vega", VEGALITE_DIR = "vegalite";

var program = require('commander');
program.version('0.0.1')
  .description("Generate Vega specs from Vegalite object in"+VEGALITE_DIR+"/ and compare output with testcases in "+ VEGA_DIR)
  .option('-f, --files [path]', 'Test specific files (Use comma to separate filename', null)
  .parse(process.argv);

var  fs = require('fs'),
  vl = require('../src/vegalite.js'),
  stringify = require('../lib/json3-compactstringify').stringify,
  assert = require('chai').assert,
  deepDiff = require('deep-diff').diff;

var badList = [], goodList = [];

if(program.files){
  program.files.split(",").forEach(test);
  log();
}else{
  fs.readdir(VEGALITE_DIR, function(err, files){
    files.filter(function(f){
      return f.lastIndexOf(".json") == f.length - 5; //filter .DSStore and other unrelated files
    }).forEach(test);

    log();
  });
}

function test(filename){
  var json = require("./"+VEGALITE_DIR+"/"+filename),
    encoding = vl.Encoding.parseJSON(json),
    dataUrl = '../'+encoding.config("dataUrl"),
    data = require(dataUrl),
    spec = vl.toVegaSpec(encoding, data),
    testSpec = require("./"+VEGA_DIR+"/"+filename);

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
