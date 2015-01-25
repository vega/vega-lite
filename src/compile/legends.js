var global = require('../globals');

var legends = module.exports = {};

legends.defs = function(encoding) {
  var _legends = [];

  // TODO: support alpha

  if (encoding.has(COLOR) && encoding.legend(COLOR)) {
    _legends.push(legends.def(COLOR, encoding, {
      fill: COLOR,
      orient: 'right'
    }));
  }

  if (encoding.has(SIZE) && encoding.legend(SIZE)) {
    _legends.push(legends.def(SIZE, encoding, {
      size: SIZE,
      orient: _legends.length === 1 ? 'left' : 'right'
    }));
  }

  if (encoding.has(SHAPE) && encoding.legend(SHAPE)) {
    if (_legends.length === 2) {
      // TODO: fix this
      console.error('Vegalite currently only supports two _legends');
      return _legends;
    }
    _legends.push(legends.def(SHAPE, encoding, {
      shape: SHAPE,
      orient: _legends.length === 1 ? 'left' : 'right'
    }));
  }

  return _legends;
};

legends.def = function(name, encoding, props) {
  var _legend = props;

  _legend.title = encoding.fieldTitle(name);

  if (encoding.isType(name, T)) {
    var fn = encoding.fn(name),
      properties = _legend.properties = _legend.properties || {},
      labels = properties.labels = properties.labels || {},
      text = labels.text = labels.text || {};

    switch (fn) {
      case 'day':
      case 'month':
        text.scale = 'time-'+ fn;
        break;
    }
  }

  return _legend;
};
