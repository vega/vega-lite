// Defining Vegalite Encoding's schema

//


// TODO use vl.merge, vl.duplicate instead, move to /src as vl.schema
var _ = require("lodash");

var schema = {};

schema.marktype = {
  type: "string",
  enum: ["point", "bar", "line", "area", "circle", "square", "text"]
};

schema.aggr = {
  type: "string",
  enum: [null, "avg", "sum", "min", "max", "count"],
  supportedEnums: {
    Q: [null, "avg", "sum", "min", "max", "count"],
    O: [null, "count"],
    T: [null, "avg", "min", "max", "count"],
    "": [null, "count"]
  }
};

schema.timefns = ["month", "year", "day", "date", "hour", "minute", "second"];

schema.fn = {
  type: "string",
  enum: [null].concat(schema.timefns),
  supportedTypes: {}
}

schema.timefns.forEach(function(timeFn){
  schema.fn.supportedTypes[timeFn] = {T:1};
});

//TODO(kanitw): add other type of function here

schema.scale_type = {
  type: "string",
  enum: ["linear", "log","pow", "sqrt", "quantile"],
  supportedTypes: ["Q"]
};

schema.field = {
  type: "object",
  required: ["name", "type"],
  properties: {
    name: {
      type: "string"
    }
  }
};

var typicalField = _.chain(schema.field).cloneDeep().merge({
  type: "object",
  properties: {
    type: {
      type: "string",
      enum: ["O", "Q", "T"]
    },
    bin: {
      type: "boolean",
      supportedTypes: ["Q", "O"]
    },
    aggr: schema.aggr,
    fn: schema.fn,
    scale: {
      type: "object",
      properties: {
        type: schema.scale_type,
        reverse: { type: "boolean", default: false },
        zero: {
          type: "boolean",
          description: "Include zero",
          default: false,
          supportedTypes: ["Q"]
        }
      }
    }
  }
}).value();

var onlyOrdinalField = _.chain(schema.field).cloneDeep().merge({
  type: "object",
  properties: {
    type: {
      type: "string",
      enum: ["O"]
    },
    bin: {
      type: "boolean"
    },
    aggr: {
      type: "string",
      enum: [null, "count"]
    }
  }
}).value();

var x = _.cloneDeep(typicalField);
var y = _.cloneDeep(x);

var row = _.cloneDeep(onlyOrdinalField);
var col = _.cloneDeep(row);

var size = _.cloneDeep(typicalField);
var color = _.cloneDeep(typicalField);
var alpha = _.cloneDeep(typicalField);
var shape = _.cloneDeep(onlyOrdinalField)

var text = _.chain(typicalField).cloneDeep().merge({
  type: "object",
  properties: {
    text: {
      type: "object",
      properties: {
        weight: {
          type: "string",
          enum: ["normal", "bold"],
          default: "normal"
        },
        size: {
          type: "integer",
          default: 10,
          minimum: 0
        },
        font: {
          type: "string",
          default: "Halvetica Neue"
        }
      }
    }
  }
}).value();

exports.schema = schema;

exports.spec = {
  $schema: "http://json-schema.org/draft-04/schema#",
  type: "object",
  required: ["marktype", "enc", "cfg"],
  properties: {
    marktype: schema.marktype,
    enc: {
      type: "object",
      properties: {
        x: x,
        y: y,
        row: row,
        col: col,
        size: size,
        color: color,
        alpha: alpha,
        shape: shape,
        text: text
      }
    },
    cfg: {
      type: "object",
      properties: {
        dataFormatType: {
          type: "string",
          enum: ["json", "csv"]
        },
        useVegaServer: {
          type: "boolean"
        },
        dataUrl: {
          type: "string"
        },
        vegaServerTable: {
          type: "string"
        }
      }
    }
  }
};
