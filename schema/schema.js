// script for generating Encoding's schema (encoding.json)

var _ = require("lodash");

var encType = {
  type: "object",
  required: ["name", "type"],
  properties: {
    name: {
      type: "string"
    }
  }
}

var typicalEncType = _.chain(encType).cloneDeep().merge({
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
    aggr: {
      type: "string",
      enum: [null, "avg", "sum", "min", "max", "count"],
      supportedEnums: {
        Q: [null, "avg", "sum", "min", "max", "count"],
        O: [null, "count"],
        T: [null, "avg", "min", "max", "count"]
      }
    },
    scale: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: [null, "linear", "log","pow", "sqrt", "quantile"],
          supportedTypes: ["Q", "T"]
        },
        reverse: {
          type: "boolean",
          default: false
        },
        zero: {
          type: "boolean",
          description: "include zero",
          default: false,
          supportedTypes: ["Q"]
        }
      }
    }
  }
}).value();

var onlyOrdinalEncType = _.chain(encType).cloneDeep().merge({
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

var x = _.cloneDeep(typicalEncType);
var y = _.cloneDeep(x);

var row = _.cloneDeep(onlyOrdinalEncType);
var col = _.cloneDeep(row);

var size = _.cloneDeep(typicalEncType);
var color = _.cloneDeep(typicalEncType);
var alpha = _.cloneDeep(typicalEncType);
var shape = _.cloneDeep(onlyOrdinalEncType)

var text = _.chain(typicalEncType).cloneDeep().merge({
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

exports.encoding = {
  $schema: "http://json-schema.org/draft-04/schema#",
  type: "object",
  required: ["marktype", "enc", "cfg"],
  properties: {
    marktype: {
      type: "string",
      enum: ["point", "bar", "line", "area", "circle", "square", "text"]
    },
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
