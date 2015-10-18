'use strict';

/*global vl, d3, ZSchema, validateVl, validateVg */

var vgSchema = null;

var validateVl = function(vlspec) {
  var validator = new ZSchema();
  var valid = validator.validate(vlspec, vl.schema.schema);

  if (!valid) {
    console.error(validator.getLastErrors());
  }
};

var validateVg = function(vgspec) {
  var validator = new ZSchema();

  var callback = function() {
    var valid = validator.validate(vgspec, vgSchema);

    if (!valid) {
      console.error(validator.getLastErrors());
    }
  };

  if (vgSchema) {
    callback();
  } else {
    d3.json('editor/bower_components/vega/vega-schema.json', function(error, json) {
      if (error) return console.warn(error);
      vgSchema = json;
      callback();
    });
  }
};
