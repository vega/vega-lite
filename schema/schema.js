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

var typicalEncType = _.assign(encType, {
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
      supportedTypes: {
        avg: {Q: 1, T: 1},
        sum: {Q: 1},
        min: {Q: 1, T: 1},
        max: {Q: 1, T: 1},
        count: {Q: 1, O: 1, T: 1},
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
});

var x = _.merge(typicalEncType, {
  type: "object",
  properties: {
    axis: {
      type: "object",
      properties: {
        margin: {
          type: "integer",
          default: 80,
          minimum: 0
        }
      }
    },
    aggr: {
      type: "string",
      enum: [null, "count"],
    }
  }
});

var y = _.cloneDeep(x);

var row = _.merge(encType, {
  type: "object",
  properties: {
    bin: {
      type: "boolean"
    },
    aggr: {
      type: "string",
      enum: [null, "count"]
    }
  }
});
var col = _.cloneDeep(row);

var size = _.cloneDeep(typicalEncType);
var color = _.cloneDeep(typicalEncType);
var alpha = _.cloneDeep(typicalEncType);
var shape = _.cloneDeep(typicalEncType);
var text = _.merge(typicalEncType, {
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
});

exports.encoding = {
  $schema: "http://json-schema.org/draft-04/schema#",
  type: "object",
  required: ["marktype", "enc", "cfg"],
  properties: {
    marktype: {
      type: "string",
      enum: [null, "point", "bar", "line", "area", "circle", "square", "text"]
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
