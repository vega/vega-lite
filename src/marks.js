var globals = require("./globals"),
  util = require("./util");

var marks = module.exports = {};

marks.bar = {
  type: "rect",
  stack: true,
  prop: bar_props,
  requiredEncoding: ["x", "y"],
  supportedEncoding: {row:1, col:1, x:1, y:1, size:1, color:1, alpha:1}
};

marks.line = {
  type: "line",
  line: true,
  prop: line_props,
  requiredEncoding: ["x", "y"],
  supportedEncoding: {row:1, col:1, x:1, y:1, color:1, alpha:1}
};

marks.area = {
  type: "area",
  stack: true,
  line: true,
  requiredEncoding: ["x", "y"],
  prop: area_props,
  supportedEncoding: marks.line.supportedEncoding
};

marks.circle = {
  type: "symbol",
  prop: filled_point_props("circle"),
  supportedEncoding: {row:1, col:1, x:1, y:1, size:1, color:1, alpha:1}
};

marks.square = {
  type: "symbol",
  prop: filled_point_props("square"),
  supportedEncoding: marks.circle.supportedEncoding
};

marks.point = {
  type: "symbol",
  prop: point_props,
  supportedEncoding: {row:1, col:1, x:1, y:1, size:1, color:1, alpha:1, shape:1}
};

marks.text = {
  type: "text",
  prop: text_props,
  requiredEncoding: ["text"],
  supportedEncoding: {row:1, col:1, size:1, color:1, alpha:1, text:1}
};

function bar_props(e) {
  var p = {};

  // x
  if (e.isType(X,Q|T) && !e.bin(X)) {
    p.x = {scale: X, field: e.field(X)};
    if (e.has(Y) && (!e.isType(Y,Q|T) || e.bin(Y))) {
      p.x2 = {scale: X, value: 0};
    }
  } else if (e.has(X)) {
    p.xc = {scale: X, field: e.field(X)};
  } else {
    p.xc = {value: 0};
  }

  // y
  if (e.isType(Y,Q|T) && !e.bin(Y)) {
    p.y = {scale: Y, field: e.field(Y)};
    p.y2 = {scale: Y, value: 0};
  } else if (e.has(Y)) {
    p.yc = {scale: Y, field: e.field(Y)};
  } else {
    p.yc = {group: "height"};
  }

  // width
  if (!e.isType(X,Q|T)) {
    if (e.has(SIZE)) {
      p.width = {scale: SIZE, field: e.field(SIZE)};
    } else {
      // p.width = {scale: X, band: true, offset: -1};
      p.width = {value: +e.config("bandSize"), offset: -1};
    }
  } else if (!e.isType(Y,O) && !e.bin(Y)) {
    p.width = {value: +e.config("bandSize"), offset: -1};
  }

  // height
  if (!e.isType(Y,Q|T)) {
    if (e.has(SIZE)) {
      p.height = {scale: SIZE, field: e.field(SIZE)};
    } else {
      // p.height = {scale: Y, band: true, offset: -1};
      p.height = {value: +e.config("bandSize"), offset: -1};
    }
  } else if (!e.isType(X,O) && !e.bin(X)) {
    p.height = {value: +e.config("bandSize"), offset: -1};
  }

  // fill
  if (e.has(COLOR)) {
    p.fill = {scale: COLOR, field: e.field(COLOR)};
  } else if (!e.has(COLOR)) {
    p.fill = {value: e.value(COLOR)};
  }

  // alpha
  if (e.has(ALPHA)) {
    p.opacity = {scale: ALPHA, field: e.field(ALPHA)};
  }

  return p;
}

function point_props(e, opt) {
  var p = {};
  opt = opt || {};

  // x
  if (e.has(X)) {
    p.x = {scale: X, field: e.field(X)};
  } else if (!e.has(X)) {
    p.x = {value: e.config("bandSize")/2};
  }

  // y
  if (e.has(Y)) {
    p.y = {scale: Y, field: e.field(Y)};
  } else if (!e.has(Y)) {
    p.y = {value: e.config("bandSize")/2};
  }

  // size
  if (e.has(SIZE)) {
    p.size = {scale: SIZE, field: e.field(SIZE)};
  } else if (!e.has(SIZE)) {
    p.size = {value: e.value(SIZE)};
  }

  // shape
  if (e.has(SHAPE)) {
    p.shape = {scale: SHAPE, field: e.field(SHAPE)};
  } else if (!e.has(SHAPE)) {
    p.shape = {value: e.value(SHAPE)};
  }

  // stroke
  if (e.has(COLOR)) {
    p.stroke = {scale: COLOR, field: e.field(COLOR)};
  } else if (!e.has(COLOR)) {
    p.stroke = {value: e.value(COLOR)};
  }

  // alpha
  if (e.has(ALPHA)) {
    p.opacity = {scale: ALPHA, field: e.field(ALPHA)};
  }else{
    p.opacity = {
      value: e.value(ALPHA)
    };
  }

  p.strokeWidth = {value: e.config("strokeWidth")};

  return p;
}

function line_props(e) {
  var p = {};

  // x
  if (e.has(X)) {
    p.x = {scale: X, field: e.field(X)};
  } else if (!e.has(X)) {
    p.x = {value: 0};
  }

  // y
  if (e.has(Y)) {
    p.y = {scale: Y, field: e.field(Y)};
  } else if (!e.has(Y)) {
    p.y = {group: "height"};
  }

  // stroke
  if (e.has(COLOR)) {
    p.stroke = {scale: COLOR, field: e.field(COLOR)};
  } else if (!e.has(COLOR)) {
    p.stroke = {value: e.value(COLOR)};
  }

  // alpha
  if (e.has(ALPHA)) {
    p.opacity = {scale: ALPHA, field: e.field(ALPHA)};
  }

  p.strokeWidth = {value: e.config("strokeWidth")};

  return p;
}

function area_props(e) {
  var p = {};

  // x
  if (e.isType(X,Q|T)) {
    p.x = {scale: X, field: e.field(X)};
    if (!e.isType(Y,Q|T) && e.has(Y)) {
      p.x2 = {scale: X, value: 0};
      p.orient = {value: "horizontal"};
    }
  } else if (e.has(X)) {
    p.x = {scale: X, field: e.field(X)};
  } else {
    p.x = {value: 0};
  }

  // y
  if (e.isType(Y,Q|T)) {
    p.y = {scale: Y, field: e.field(Y)};
    p.y2 = {scale: Y, value: 0};
  } else if (e.has(Y)) {
    p.y = {scale: Y, field: e.field(Y)};
  } else {
    p.y = {group: "height"};
  }

  // stroke
  if (e.has(COLOR)) {
    p.fill = {scale: COLOR, field: e.field(COLOR)};
  } else if (!e.has(COLOR)) {
    p.fill = {value: e.value(COLOR)};
  }

  // alpha
  if (e.has(ALPHA)) {
    p.opacity = {scale: ALPHA, field: e.field(ALPHA)};
  }

  return p;
}

function filled_point_props(shape) {
  return function(e, opt) {
    var p = {};
    opt = opt || {};

    // x
    if (e.has(X)) {
      p.x = {scale: X, field: e.field(X)};
    } else if (!e.has(X)) {
      p.x = {value: e.config("bandSize")/2};
    }

    // y
    if (e.has(Y)) {
      p.y = {scale: Y, field: e.field(Y)};
    } else if (!e.has(Y)) {
      p.y = {value: e.config("bandSize")/2};
    }

    // size
    if (e.has(SIZE)) {
      p.size = {scale: SIZE, field: e.field(SIZE)};
    } else if (!e.has(X)) {
      p.size = {value: e.config("pointSize")};
    }

    // shape
    p.shape = {value: shape};

    // fill
    if (e.has(COLOR)) {
      p.fill = {scale: COLOR, field: e.field(COLOR)};
    } else if (!e.has(COLOR)) {
      p.fill = {value: e.value(COLOR)};
    }

    // alpha
    if (e.has(ALPHA)) {
      p.opacity = {scale: ALPHA, field: e.field(ALPHA)};
    }else {
      p.opacity = {
        value: e.value(ALPHA)
      };
    }

    return p;
  };
}

function text_props(e) {
  var p = {};

  // x
  if (e.has(X)) {
    p.x = {scale: X, field: e.field(X)};
  } else if (!e.has(X)) {
    p.x = {value: e.config("bandSize")/2};
  }

  // y
  if (e.has(Y)) {
    p.y = {scale: Y, field: e.field(Y)};
  } else if (!e.has(Y)) {
    p.y = {value: e.config("bandSize")/2};
  }

  // size
  if (e.has(SIZE)) {
    p.fontSize = {scale: SIZE, field: e.field(SIZE)};
  } else if (!e.has(X)) {
    p.fontSize = {value: e.config("fontSize")};
  }

  // fill
  if (e.has(COLOR)) {
    p.fill = {scale: COLOR, field: e.field(COLOR)};
  } else if (!e.has(COLOR)) {
    p.fill = {value: e.config("textColor")};
  }

  // alpha
  if (e.has(ALPHA)) {
    p.opacity = {scale: ALPHA, field: e.field(ALPHA)};
  }

  // text
  if (e.has(TEXT)) {
    p.text = {field: e.field(TEXT)};
  } else {
    p.text = {value: "Abc"};
  }

  p.font = {value: e.config("font")};
  p.fontWeight = {value: e.config("fontWeight")};
  p.fontStyle = {value: e.config("fontStyle")};
  p.baseline = {value: e.config("textBaseline")};

  // align
  if (e.has(X)) {
    if (e.isType(X,O)) {
      p.align = {value: "left"};
      p.dx = {value: e.config("textMargin")};
    } else {
      p.align = {value: "center"}
    }
  } else if (e.has(Y)) {
    p.align = {value: "left"};
    p.dx = {value: e.config("textMargin")};
  } else {
    p.align = {value: e.config("textAlign")};
  }

  return p;
}