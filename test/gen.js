#!/usr/bin/env node

var VEGA_DIR = "vega", VEGALITE_DIR = "vegalite";

var program = require('commander');
program.version('0.0.1')
  .description('Generate Test Cases. Regenerate all testcases in '+ VEGA_DIR + ' by default.  Use -f or -j to generate single test case.')
  .option('-j, --json [path]', 'Create test from json strings [null]', null)
  .option('-f, --file [path]', 'Create test from file [null]', null)
  .option('-d, --data [path]', 'Data file path (otherwise, path will be parsed from dataUrl config.) [null]', null)
  .option('-n, --note [String]', 'Add _note property to the vegalite json file.', null)
  .parse(process.argv);


var fs = require('fs'),
  vl = require('../src/vegalite.js'),
  stringify = require('../lib/json3-compactstringify').stringify;


var jsons, dataUrl, data, dataname, encoding, filename, spec;

if(program.file){
  generate(require(file), true);
}else if(program.json){
  generate(JSON.parse(program.json), true);
}else {
  fs.readdir(VEGALITE_DIR, function(err, files){
    files.filter(function(f){
      return f.lastIndexOf(".json") == f.length - 5; //filter .DSStore and other unrelated files
    }).forEach(function(f){
      generate(require(VEGALITE_DIR+"/"+f));
    });
  });
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

function generate(json, genVl){
  if(program.note){
    json._note = program.note;
  }

  encoding = vl.Encoding.parseJSON(json);

  dataUrl = program.data || (encoding.config("dataUrl") ? '../'+encoding.config("dataUrl") : null);

  if(!dataUrl){
    console.log('no data provided neither as argument or as dataUrl config.');
    process.exit(1);
  }

  data = require(dataUrl);

  dataname = dataUrl.split("/").pop().split(".");
  dataname = dataname.slice(0, dataname.length -1).join(".");

  filename = encoding.toShorthand();
  spec = vl.toVegaSpec(encoding, data);

  var vlPath = VEGALITE_DIR+"/"+dataname+"."+filename+'.json',
    vgPath = VEGA_DIR+"/"+dataname+"."+filename+'.json';

  if(genVl){
    fs.writeFile(vlPath, stringify(json, null, '  ', 80), writeErrorHandler(vlPath));
  }
  fs.writeFile(vgPath, stringify(spec, null, '  ', 80), writeErrorHandler(vgPath))
}