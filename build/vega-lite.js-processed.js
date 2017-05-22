(function () {
    var _$0 = this;

    var _$1 = Object.setPrototypeOf;
    var _$2 = RegExp;
    var _$3 = Object.defineProperty;

    function _0(d, b) {
        _1(d, b);

        function __() {
            this.constructor = d;
        }

        d.prototype = b === null ? _$0.Object.create(b) : (__.prototype = b.prototype, new __());
    }

    function _3(s, e) {
        var t = {};

        for (var p in s) if (_$0.Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];

        if (s != null && typeof _$0.Object.getOwnPropertySymbols === "function") for (var i = 0, p = _$0.Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
        return t;
    }

    function _4(decorators, target, key, desc) {
        var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = _$0.Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
        if (typeof _$0.Reflect === "object" && typeof _$0.Reflect.decorate === "function") r = _$0.Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && _$0.Object.defineProperty(target, key, r), r;
    }

    function _5(paramIndex, decorator) {
        return function (target, key) {
            decorator(target, key, paramIndex);
        };
    }

    function _6(metadataKey, metadataValue) {
        if (typeof _$0.Reflect === "object" && typeof _$0.Reflect.metadata === "function") return _$0.Reflect.metadata(metadataKey, metadataValue);
    }

    function _7(thisArg, _arguments, P, generator) {
        return new (P || (P = _$0.Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }

            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }

            function step(result) {
                result.done ? resolve(result.value) : new P(function (resolve) {
                    resolve(result.value);
                }).then(fulfilled, rejected);
            }

            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function _8(thisArg, body) {
        var _ = {
            label: 0,
            sent: function () {
                if (t[0] & 1) throw t[1];
                return t[1];
            },
            trys: [],
            ops: []
        },
            f,
            y,
            t,
            g;
        return g = {
            next: verb(0),
            "throw": verb(1),
            "return": verb(2)
        }, typeof _$0.Symbol === "function" && (g[_$0.Symbol.iterator] = function () {
            return this;
        }), g;

        function verb(n) {
            return function (v) {
                return step([n, v]);
            };
        }

        function step(op) {
            if (f) throw new _$0.TypeError("Generator is already executing.");

            while (_) try {
                if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [0, t.value];

                switch (op[0]) {
                    case 0:
                    case 1:
                        t = op;
                        break;

                    case 4:
                        _.label++;
                        return {
                            value: op[1],
                            done: false
                        };

                    case 5:
                        _.label++;
                        y = op[1];
                        op = [0];
                        continue;

                    case 7:
                        op = _.ops.pop();

                        _.trys.pop();

                        continue;

                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                            _ = 0;
                            continue;
                        }

                        if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                            _.label = op[1];
                            break;
                        }

                        if (op[0] === 6 && _.label < t[1]) {
                            _.label = t[1];
                            t = op;
                            break;
                        }

                        if (t && _.label < t[2]) {
                            _.label = t[2];

                            _.ops.push(op);

                            break;
                        }

                        if (t[2]) _.ops.pop();

                        _.trys.pop();

                        continue;
                }

                op = body.call(thisArg, _);
            } catch (e) {
                op = [6, e];
                y = 0;
            } finally {
                f = t = 0;
            }

            if (op[0] & 5) throw op[1];
            return {
                value: op[0] ? op[1] : void 0,
                done: true
            };
        }
    }

    function _9(m, exports) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }

    function _f(o) {
        var m = typeof _$0.Symbol === "function" && o[_$0.Symbol.iterator],
            i = 0;
        if (m) return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return {
                    value: o && o[i++],
                    done: !o
                };
            }
        };
    }

    function _g(o, n) {
        var m = typeof _$0.Symbol === "function" && o[_$0.Symbol.iterator];
        if (!m) return o;
        var i = m.call(o),
            r,
            ar = [],
            e;

        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        } catch (error) {
            e = {
                error: error
            };
        } finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            } finally {
                if (e) throw e.error;
            }
        }

        return ar;
    }

    function _h() {
        for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(_g(arguments[i]));

        return ar;
    }

    function _j(thisArg, _arguments, generator) {
        if (!_$0.Symbol.asyncIterator) throw new _$0.TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []),
            q = [],
            c,
            i;
        return i = {
            next: verb("next"),
            "throw": verb("throw"),
            "return": verb("return")
        }, i[_$0.Symbol.asyncIterator] = function () {
            return this;
        }, i;

        function verb(n) {
            return function (v) {
                return new _$0.Promise(function (a, b) {
                    q.push([n, v, a, b]), next();
                });
            };
        }

        function next() {
            if (!c && q.length) resume((c = q.shift())[0], c[1]);
        }

        function resume(n, v) {
            try {
                step(g[n](v));
            } catch (e) {
                settle(c[3], e);
            }
        }

        function step(r) {
            r.done ? settle(c[2], r) : _$0.Promise.resolve(r.value[1]).then(r.value[0] === "yield" ? send : fulfill, reject);
        }

        function send(value) {
            settle(c[2], {
                value: value,
                done: false
            });
        }

        function fulfill(value) {
            resume("next", value);
        }

        function reject(value) {
            resume("throw", value);
        }

        function settle(f, v) {
            c = void 0, f(v), next();
        }
    }

    function _k(o) {
        var i = {
            next: verb("next"),
            "throw": verb("throw", function (e) {
                throw e;
            }),
            "return": verb("return", function (v) {
                return {
                    value: v,
                    done: true
                };
            })
        },
            p;
        return o = _l(o), i[_$0.Symbol.iterator] = function () {
            return this;
        }, i;

        function verb(n, f) {
            return function (v) {
                return v = p && n === "throw" ? f(v) : p && v.done ? v : {
                    value: p ? ["yield", v.value] : ["await", (o[n] || f).call(o, v)],
                    done: false
                }, p = !p, v;
            };
        }
    }

    function _l(o) {
        if (!_$0.Symbol.asyncIterator) throw new _$0.TypeError("Symbol.asyncIterator is not defined.");
        var m = o[_$0.Symbol.asyncIterator];
        return m ? m.call(o) : typeof _f === "function" ? _f(o) : o[_$0.Symbol.iterator]();
    }

    function _w(bin) {
        "use strict";

        if (_x.isBoolean(bin)) {
            return 'bin';
        }

        return 'bin' + _$0.Object.keys(bin).map(function (p) {
            return "_" + p + "_" + bin[p];
        }).join('');
    }

    function _y(_) {
        "use strict";

        for (var x, k, i = 1, len = arguments.length; i < len; ++i) {
            x = arguments[i];

            for (k in x) {
                _[k] = x[k];
            }
        }

        return _;
    }

    function _A(_) {
        "use strict";

        return _ === _$0.Object(_);
    }

    function _B(_) {
        "use strict";

        return typeof _ === 'number';
    }

    function _C(_) {
        "use strict";

        return typeof _ === 'string';
    }

    function _D(str, length, align, ellipsis) {
        "use strict";

        var e = ellipsis != null ? ellipsis : '\u2026',
            s = str + '',
            n = s.length,
            l = _$0.Math.max(0, length - e.length);

        return n <= length ? s : align === 'left' ? e + s.slice(n - l) : align === 'center' ? s.slice(0, _$0.Math.ceil(l / 2)) + e + s.slice(n - ~~(l / 2)) : s.slice(0, l) + e;
    }

    function _E(_) {
        "use strict";

        for (var s = {}, i = 0, n = _.length; i < n; ++i) s[_[i]] = 1;

        return s;
    }

    function _F(x) {
        "use strict";

        return _z(x) ? '[' + x.map(_F) + ']' : _A(x) || _C(x) ? // Output valid JSON and JS source strings.
        // See http://timelessrepo.com/json-isnt-a-javascript-subset
        _$0.JSON.stringify(x).replace('\u2028', '\\u2028').replace('\u2029', '\\u2029') : x;
    }

    function _G(obj, props) {
        "use strict";

        var copy = {};
        props.forEach(function (prop) {
            if (obj.hasOwnProperty(prop)) {
                copy[prop] = obj[prop];
            }
        });
        return copy;
    }

    function _H(obj, props) {
        "use strict";

        var copy = _I(obj);

        props.forEach(function (prop) {
            delete copy[prop];
        });
        return copy;
    }

    function _I(obj) {
        "use strict";

        return _$0.JSON.parse(_$0.JSON.stringify(obj));
    }

    function _J(a) {
        "use strict";

        if (_K.isString(a) || _K.isNumber(a) || _1m(a)) {
            return _$0.String(a);
        }

        return _1n(a);
    }

    function _L(fn, fields, name) {
        "use strict";

        return fn.fields = fields || [], fn.fname = name, fn;
    }

    function _M(fn) {
        "use strict";

        return fn == null ? null : fn.fname;
    }

    function _N(fn) {
        "use strict";

        return fn == null ? null : fn.fields;
    }

    function _O(_) {
        return _["id"];
    }

    function _Q(_) {
        "use strict";

        return _;
    }

    function _S() {
        "use strict";

        return 0;
    }

    function _T() {
        "use strict";

        return 1;
    }

    function _U() {
        "use strict";

        return true;
    }

    function _V() {
        "use strict";

        return false;
    }

    function _W(_) {
        "use strict";

        var level = _ || 0;
        return {
            level: function (_) {
                return arguments.length ? (level = +_, this) : level;
            },
            warn: function () {
                if (level >= 1) _X('warn', 'WARN', arguments);
                return this;
            },
            info: function () {
                if (level >= 2) _X('log', 'INFO', arguments);
                return this;
            },
            debug: function () {
                if (level >= 3) _X('log', 'DEBUG', arguments);
                return this;
            }
        };
    }

    function _X(method, level, input) {
        "use strict";

        var args = [level].concat([].slice.call(input));

        _$0.console[method].apply(_$0.console, args); // eslint-disable-line no-console

    }

    function _Y(_) {
        "use strict";

        return _ != null ? _z(_) ? _ : [_] : [];
    }

    function _Z(fields, orders) {
        "use strict";

        var idx = [],
            cmp = (fields = _Y(fields)).map(function (f, i) {
            return f == null ? null : (idx.push(i), _10(f).map(_F).join(']['));
        }),
            n = idx.length - 1,
            ord = _Y(orders),
            code = 'var u,v;return ',
            i,
            j,
            f,
            u,
            v,
            d,
            lt,
            gt;

        if (n < 0) return null;

        for (j = 0; j <= n; ++j) {
            i = idx[j];
            f = cmp[i];
            u = '(u=a[' + f + '])';
            v = '(v=b[' + f + '])';
            d = '((v=v instanceof Date?+v:v),(u=u instanceof Date?+u:u))';
            lt = ord[i] !== 'descending' ? (gt = 1, -1) : (gt = -1, 1);
            code += '(' + u + '<' + v + '||u==null)&&v!=null?' + lt + ':(u>v||v==null)&&u!=null?' + gt + ':' + d + '!==u&&v===v?' + lt + ':v!==v&&u===u?' + gt + (i < n ? ':' : ':0');
        }

        return _L(_$0.Function('a', 'b', code + ';'), fields.filter(function (_) {
            return _ != null;
        }));
    }

    function _10(p) {
        "use strict";

        var path = [],
            q = null,
            b = 0,
            n = p.length,
            s = '',
            i,
            j,
            c;
        p = p + '';

        function push() {
            path.push(s + p.substring(i, j));
            s = '';
            i = j + 1;
        }

        for (i = j = 0; j < n; ++j) {
            c = p[j];
            if (c === '\\') s += p.substring(i, j), i = ++j;else if (c === q) push(), q = null, b = -1;else if (q) continue;else if (i === b && c === '"') i = j + 1, q = c;else if (i === b && c === "'") i = j + 1, q = c;else if (c === '.' && !b) j > i ? push() : i = j + 1;else if (c === '[') {
                if (j > i) push();
                b = i = j + 1;
            } else if (c === ']') {
                if (!b) _11('Access path missing open bracket: ' + p);
                if (b > 0) push();
                b = 0;
                i = j + 1;
            }
        }

        if (b) _11('Access path missing closing bracket: ' + p);
        if (q) _11('Access path missing closing quote: ' + p);
        if (j > i) ++j, push();
        return path;
    }

    function _11(message) {
        "use strict";

        throw _$0.Error(message);
    }

    function _12(_) {
        "use strict";

        return _13(_) ? _ : function () {
            return _;
        };
    }

    function _13(_) {
        "use strict";

        return typeof _ === 'function';
    }

    function _14(array, f) {
        "use strict";

        var i = -1,
            n = array.length,
            a,
            b,
            c,
            u,
            v;

        if (f == null) {
            while (++i < n) if ((b = array[i]) != null && b >= b) {
                a = c = b;
                break;
            }

            u = v = i;

            while (++i < n) if ((b = array[i]) != null) {
                if (a > b) a = b, u = i;
                if (c < b) c = b, v = i;
            }
        } else {
            while (++i < n) if ((b = f(array[i], i, array)) != null && b >= b) {
                a = c = b;
                break;
            }

            u = v = i;

            while (++i < n) if ((b = f(array[i], i, array)) != null) {
                if (a > b) a = b, u = i;
                if (c < b) c = b, v = i;
            }
        }

        return [u, v];
    }

    function _15(input) {
        "use strict";

        var obj = {},
            map,
            test;

        function has(key) {
            return obj.hasOwnProperty(key) && obj[key] !== _16;
        }

        map = {
            size: 0,
            empty: 0,
            object: obj,
            has: has,
            get: function (key) {
                return has(key) ? obj[key] : _$0.undefined;
            },
            set: function (key, value) {
                if (!has(key)) {
                    ++map.size;
                    if (obj[key] === _16) --map.empty;
                }

                obj[key] = value;
                return this;
            },
            delete: function (key) {
                if (has(key)) {
                    --map.size;
                    ++map.empty;
                    obj[key] = _16;
                }

                return this;
            },
            clear: function () {
                map.size = map.empty = 0;
                map.object = obj = {};
            },
            test: function (_) {
                return arguments.length ? (test = _, map) : test;
            },
            clean: function () {
                var next = {},
                    size = 0,
                    key,
                    value;

                for (key in obj) {
                    value = obj[key];

                    if (value !== _16 && (!test || !test(value))) {
                        next[key] = value;
                        ++size;
                    }
                }

                map.size = size;
                map.empty = 0;
                map.object = obj = next;
            }
        };
        if (input) _$0.Object.keys(input).forEach(function (key) {
            map.set(key, input[key]);
        });
        return map;
    }

    function _17(field, name) {
        "use strict";

        var path = _10(field),
            code = 'return _[' + path.map(_F).join('][') + '];';

        return _L(_$0.Function('_', code), [field = path.length === 1 ? path[0] : field], name || field);
    }

    function _18(child, parent) {
        "use strict";

        var proto = child.prototype = _$0.Object.create(parent.prototype);

        proto.constructor = child;
        return proto;
    }

    function _19(_) {
        "use strict";

        return typeof _ === 'boolean';
    }

    function _1a(_) {
        "use strict";

        return _$0.Object.prototype.toString.call(_) === '[object Date]';
    }

    function _1b(_) {
        "use strict";

        return _$0.Object.prototype.toString.call(_) === '[object RegExp]';
    }

    function _1c(fields) {
        "use strict";

        fields = fields ? _Y(fields) : fields;
        var fn = !(fields && fields.length) ? function () {
            return '';
        } : _$0.Function('_', 'return \'\'+' + fields.map(function (f) {
            return '_[' + _10(f).map(_F).join('][') + ']';
        }).join('+\'|\'+') + ';');
        return _L(fn, fields, 'key');
    }

    function _1d(compare, array0, array1, output) {
        "use strict";

        var n0 = array0.length,
            n1 = array1.length;
        if (!n1) return array0;
        if (!n0) return array1;
        var merged = output || new array0.constructor(n0 + n1),
            i0 = 0,
            i1 = 0,
            i = 0;

        for (; i0 < n0 && i1 < n1; ++i) {
            merged[i] = compare(array0[i0], array1[i1]) > 0 ? array1[i1++] : array0[i0++];
        }

        for (; i0 < n0; ++i0, ++i) {
            merged[i] = array0[i0];
        }

        for (; i1 < n1; ++i1, ++i) {
            merged[i] = array1[i1];
        }

        return merged;
    }

    function _1e(str, length, padchar, align) {
        "use strict";

        var c = padchar || ' ',
            s = str + '',
            n = length - s.length;
        return n <= 0 ? s : align === 'left' ? _1f(c, n) + s : align === 'center' ? _1f(c, ~~(n / 2)) + s + _1f(c, _$0.Math.ceil(n / 2)) : s + _1f(c, n);
    }

    function _1f(str, reps) {
        "use strict";

        var s = '';

        while (--reps >= 0) s += str;

        return s;
    }

    function _1g(array) {
        "use strict";

        return array[array.length - 1];
    }

    function _1h(_) {
        "use strict";

        return _ == null || _ === '' ? null : !_ || _ === 'false' ? false : !!_;
    }

    function _1i(_, parser) {
        "use strict";

        return _ == null || _ === '' ? null : parser ? parser(_) : _$0.Date.parse(_);
    }

    function _1j(_) {
        "use strict";

        return _ == null || _ === '' ? null : +_;
    }

    function _1k(_) {
        "use strict";

        return _ == null || _ === '' ? null : _ + '';
    }

    function _1l(array, filter, visitor) {
        "use strict";

        if (array) {
            var i = 0,
                n = array.length,
                t;

            if (filter) {
                for (; i < n; ++i) {
                    if (t = filter(array[i])) visitor(t, i, array);
                }
            } else {
                array.forEach(visitor);
            }
        }
    }

    function _1m(b) {
        "use strict";

        return b === true || b === false;
    }

    function _1n(obj, opts) {
        if (!opts) opts = {};
        if (typeof opts === 'function') opts = {
            cmp: opts
        };
        var space = opts.space || '';
        if (typeof space === 'number') space = _$0.Array(space + 1).join(' ');
        var cycles = typeof opts.cycles === 'boolean' ? opts.cycles : false;

        var replacer = opts.replacer || function (key, value) {
            return value;
        };

        var cmp = opts.cmp && function (f) {
            return function (node) {
                return function (a, b) {
                    var aobj = {
                        key: a,
                        value: node[a]
                    };
                    var bobj = {
                        key: b,
                        value: node[b]
                    };
                    return f(aobj, bobj);
                };
            };
        }(opts.cmp);

        var seen = [];
        return function stringify(parent, key, node, level) {
            var indent = space ? '\n' + new _$0.Array(level + 1).join(space) : '';
            var colonSeparator = space ? ': ' : ':';

            if (node && node.toJSON && typeof node.toJSON === 'function') {
                node = node.toJSON();
            }

            node = replacer.call(parent, key, node);

            if (node === _$0.undefined) {
                return;
            }

            if (typeof node !== 'object' || node === null) {
                return _1o.stringify(node);
            }

            if (_z(node)) {
                var out = [];

                for (var i = 0; i < node.length; i++) {
                    var item = stringify(node, i, node[i], level + 1) || _1o.stringify(null);

                    out.push(indent + space + item);
                }

                return '[' + out.join(',') + indent + ']';
            } else {
                if (seen.indexOf(node) !== -1) {
                    if (cycles) return _1o.stringify('__cycle__');
                    throw new _$0.TypeError('Converting circular structure to JSON');
                } else seen.push(node);

                var keys = _1p(node).sort(cmp && cmp(node));

                var out = [];

                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    var value = stringify(node, key, node[key], level + 1);
                    if (!value) continue;
                    var keyValue = _1o.stringify(key) + colonSeparator + value;
                    ;
                    out.push(indent + space + keyValue);
                }

                seen.splice(seen.indexOf(node), 1);
                return '{' + out.join(',') + indent + '}';
            }
        }({
            '': obj
        }, '', obj, 0);
    }

    function _1q(array, item) {
        "use strict";

        return array.indexOf(item) > -1;
    }

    function _1r(array, excludedItems) {
        "use strict";

        return array.filter(function (item) {
            return !_1q(excludedItems, item);
        });
    }

    function _1s(array, other) {
        "use strict";

        return array.concat(_1r(other, array));
    }

    function _1t(arr, f) {
        "use strict";

        var i = 0;

        for (var k = 0; k < arr.length; k++) {
            if (f(arr[k], k, i++)) {
                return true;
            }
        }

        return false;
    }

    function _1u(arr, f) {
        "use strict";

        var i = 0;

        for (var k = 0; k < arr.length; k++) {
            if (!f(arr[k], k, i++)) {
                return false;
            }
        }

        return true;
    }

    function _1v(arrays) {
        "use strict";

        return [].concat.apply([], arrays);
    }

    function _1w(dest) {
        "use strict";

        var src = [];

        for (var _i = 1; _i < arguments.length; _i++) {
            src[_i - 1] = arguments[_i];
        }

        for (var _a = 0, src_1 = src; _a < src_1.length; _a++) {
            var s = src_1[_a];
            dest = _1x(dest, s);
        }

        return dest;
    }

    function _1x(dest, src) {
        "use strict";

        if (typeof src !== 'object' || src === null) {
            return dest;
        }

        for (var p in src) {
            if (!src.hasOwnProperty(p)) {
                continue;
            }

            if (src[p] === _$0.undefined) {
                continue;
            }

            if (typeof src[p] !== 'object' || _K.isArray(src[p]) || src[p] === null) {
                dest[p] = src[p];
            } else if (typeof dest[p] !== 'object' || dest[p] === null) {
                dest[p] = _1w(src[p].constructor === _$0.Array ? [] : {}, src[p]);
            } else {
                _1w(dest[p], src[p]);
            }
        }

        return dest;
    }

    function _1y(values, f) {
        "use strict";

        var results = [];
        var u = {};
        var v;

        for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
            var val = values_1[_i];
            v = f(val);

            if (v in u) {
                continue;
            }

            u[v] = 1;
            results.push(val);
        }

        return results;
    }

    function _1z(dict, other) {
        "use strict";

        for (var key in dict) {
            if (dict.hasOwnProperty(key)) {
                if (other[key] && dict[key] && other[key] !== dict[key]) {
                    return true;
                }
            }
        }

        return false;
    }

    function _1A(a, b) {
        "use strict";

        for (var key in a) {
            if (key in b) {
                return true;
            }
        }

        return false;
    }

    function _1B(array, other) {
        "use strict";

        if (array.length !== other.length) {
            return true;
        }

        array.sort();
        other.sort();

        for (var i = 0; i < array.length; i++) {
            if (other[i] !== array[i]) {
                return true;
            }
        }

        return false;
    }

    function _1C(x) {
        "use strict";

        var _vals = [];

        for (var k in x) {
            if (x.hasOwnProperty(k)) {
                _vals.push(x[k]);
            }
        }

        return _vals;
    }

    function _1D(s) {
        "use strict";

        // Replace non-alphanumeric characters (anything besides a-zA-Z0-9_) with _
        var alphanumericS = s.replace(/\W/g, '_'); // Add _ if the string has leading numbers.

        return (s.match(/^\d+/) ? '_' : '') + alphanumericS;
    }

    function _1E(channel) {
        "use strict";

        switch (channel) {
            case _1F.ROW:
            case _1F.COLUMN:
            case _1F.SIZE:
            case _1F.COLOR:
            case _1F.OPACITY: // Facets and Size shouldn't have too many bins
            // We choose 6 like shape to simplify the rule

            case _1F.SHAPE:
                return 6;
            // Vega's "shape" has 6 distinct values

            default:
                return 10;
        }
    }

    function _1I(str) {
        "use strict";

        return !!_1J[str];
    }

    function _1S(channel, mark) {
        "use strict";

        return mark in _1T(channel);
    }

    function _1T(channel) {
        "use strict";

        switch (channel) {
            case _1F.X:
            case _1F.Y:
            case _1F.COLOR:
            case _1F.DETAIL:
            case _1F.TOOLTIP:
            case _1F.ORDER: // TODO: revise (order might not support rect, which is not stackable?)

            case _1F.OPACITY:
            case _1F.ROW:
            case _1F.COLUMN:
                return {
                    point: true,
                    tick: true,
                    rule: true,
                    circle: true,
                    square: true,
                    bar: true,
                    rect: true,
                    line: true,
                    area: true,
                    text: true
                };

            case _1F.X2:
            case _1F.Y2:
                return {
                    rule: true,
                    bar: true,
                    rect: true,
                    area: true
                };

            case _1F.SIZE:
                return {
                    point: true,
                    tick: true,
                    rule: true,
                    circle: true,
                    square: true,
                    bar: true,
                    text: true,
                    line: true
                };

            case _1F.SHAPE:
                return {
                    point: true
                };

            case _1F.TEXT:
                return {
                    text: true
                };
        }
    }

    function _1U(channel) {
        "use strict";

        return !_x.contains([_1F.DETAIL, _1F.TEXT, _1F.ORDER, _1F.TOOLTIP], channel);
    }

    function _1V(channel, scaleType) {
        "use strict";

        switch (channel) {
            case _1F.ROW:
            case _1F.COLUMN:
                return scaleType === 'band';
            // row / column currently supports band only

            case _1F.X:
            case _1F.Y:
            case _1F.SIZE: // TODO: size and opacity can support ordinal with more modification

            case _1F.OPACITY:
                // Although it generally doesn't make sense to use band with size and opacity,
                // it can also work since we use band: 0.5 to get midpoint.
                return scaleType in _1W;

            case _1F.COLOR:
                return scaleType !== 'band';
            // band does not make sense with color

            case _1F.SHAPE:
                return scaleType === 'ordinal';
            // shape = lookup only
        } /* istanbul ignore next: it should never reach here */

        return false;
    }

    function _1X(channel) {
        "use strict";

        switch (channel) {
            case _1F.X:
            case _1F.Y:
            case _1F.SIZE:
            case _1F.OPACITY: // X2 and Y2 use X and Y scales, so they similarly have continuous range.

            case _1F.X2:
            case _1F.Y2:
                return 'continuous';

            case _1F.ROW:
            case _1F.COLUMN:
            case _1F.SHAPE: // TEXT and TOOLTIP have no scale but have discrete output

            case _1F.TEXT:
            case _1F.TOOLTIP:
                return 'discrete';
            // Color can be either continuous or discrete, depending on scale type.

            case _1F.COLOR:
                return 'flexible';
            // No scale, no range type.

            case _1F.DETAIL:
            case _1F.ORDER:
                return _$0.undefined;
        } /* istanbul ignore next: should never reach here. */

        throw new _$0.Error('getSupportedRole not implemented for ' + channel);
    }

    function _1Z(mark, normalizer) {
        "use strict";

        _20[mark] = normalizer;
    }

    function _21(spec, config) {
        "use strict";

        var _m = spec.mark,
            encoding = spec.encoding,
            outerSpec = _22.__rest(spec, ["mark", "encoding"]);

        var _x = encoding.x,
            _y = encoding.y,
            nonPositionEncoding = _22.__rest(encoding, ["x", "y"]);

        var size = nonPositionEncoding.size,
            nonPositionEncodingWithoutSize = _22.__rest(nonPositionEncoding, ["size"]);

        var _color = nonPositionEncodingWithoutSize.color,
            nonPositionEncodingWithoutColorSize = _22.__rest(nonPositionEncodingWithoutSize, ["color"]);

        var midTickAndBarSizeChannelDef = size ? {
            size: size
        } : {
            size: {
                value: config.box.size
            }
        };
        var discreteAxisFieldDef, continuousAxisChannelDef;
        var discreteAxis, continuousAxis;

        if (encoding.x && encoding.y) {
            // 2D
            if (_23.isDiscrete(encoding.x) && _23.isContinuous(encoding.y)) {
                // vertical
                discreteAxis = 'x';
                continuousAxis = 'y';
                continuousAxisChannelDef = encoding.y;
                discreteAxisFieldDef = encoding.x;
            } else if (_23.isDiscrete(encoding.y) && _23.isContinuous(encoding.x)) {
                // horizontal
                discreteAxis = 'y';
                continuousAxis = 'x';
                continuousAxisChannelDef = encoding.x;
                discreteAxisFieldDef = encoding.y;
            } else {
                throw new _$0.Error('Need one continuous and one discrete axis for 2D boxplots');
            }
        } else if (encoding.x && _23.isContinuous(encoding.x) && encoding.y === _$0.undefined) {
            // 1D horizontal
            continuousAxis = 'x';
            continuousAxisChannelDef = encoding.x;
        } else if (encoding.x === _$0.undefined && encoding.y && _23.isContinuous(encoding.y)) {
            // 1D vertical
            continuousAxis = 'y';
            continuousAxisChannelDef = encoding.y;
        } else {
            throw new _$0.Error('Need a continuous axis for 1D boxplots');
        }

        if (continuousAxisChannelDef.aggregate !== _$0.undefined && continuousAxisChannelDef.aggregate !== _3t.BOXPLOT) {
            throw new _$0.Error('Continuous axis should not be aggregated');
        }

        var baseContinuousFieldDef = {
            field: continuousAxisChannelDef.field,
            type: continuousAxisChannelDef.type
        };

        var minFieldDef = _22.__assign({
            aggregate: 'min'
        }, baseContinuousFieldDef);

        var minWithAxisFieldDef = _22.__assign({
            axis: continuousAxisChannelDef.axis
        }, minFieldDef);

        var q1FieldDef = _22.__assign({
            aggregate: 'q1'
        }, baseContinuousFieldDef);

        var medianFieldDef = _22.__assign({
            aggregate: 'median'
        }, baseContinuousFieldDef);

        var q3FieldDef = _22.__assign({
            aggregate: 'q3'
        }, baseContinuousFieldDef);

        var maxFieldDef = _22.__assign({
            aggregate: 'max'
        }, baseContinuousFieldDef);

        var discreteAxisEncodingMixin = discreteAxisFieldDef !== _$0.undefined ? (_a = {}, _a[discreteAxis] = discreteAxisFieldDef, _a) : {};
        return _22.__assign({}, outerSpec, {
            layer: [{
                mark: {
                    type: 'rule',
                    role: 'boxWhisker'
                },
                encoding: _22.__assign({}, discreteAxisEncodingMixin, (_b = {}, _b[continuousAxis] = minWithAxisFieldDef, _b[continuousAxis + '2'] = q1FieldDef, _b), nonPositionEncodingWithoutColorSize)
            }, {
                mark: {
                    type: 'rule',
                    role: 'boxWhisker'
                },
                encoding: _22.__assign({}, discreteAxisEncodingMixin, (_c = {}, _c[continuousAxis] = q3FieldDef, _c[continuousAxis + '2'] = maxFieldDef, _c), nonPositionEncodingWithoutColorSize)
            }, {
                mark: {
                    type: 'bar',
                    role: 'box'
                },
                encoding: _22.__assign({}, discreteAxisEncodingMixin, (_d = {}, _d[continuousAxis] = q1FieldDef, _d[continuousAxis + '2'] = q3FieldDef, _d), nonPositionEncodingWithoutSize, midTickAndBarSizeChannelDef)
            }, {
                mark: {
                    type: 'tick',
                    role: 'boxMid'
                },
                encoding: _22.__assign({}, discreteAxisEncodingMixin, (_e = {}, _e[continuousAxis] = medianFieldDef, _e), nonPositionEncoding, midTickAndBarSizeChannelDef, {
                    'color': {
                        'value': 'white'
                    }
                })
            }]
        });

        var _a, _b, _c, _d, _e;
    }

    function _24(field) {
        "use strict";

        return field && !_x.isString(field) && 'repeat' in field;
    }

    function _25(channelDef) {
        "use strict";

        return !!channelDef && (!!channelDef['field'] || channelDef['aggregate'] === 'count');
    }

    function _26(channelDef) {
        "use strict";

        return channelDef && 'value' in channelDef && channelDef['value'] !== _$0.undefined;
    }

    function _27(fieldDef, opt) {
        "use strict";

        if (opt === void 0) {
            opt = {};
        }

        var field = fieldDef.field;
        var prefix = opt.prefix;
        var suffix = opt.suffix;

        if (_28(fieldDef)) {
            field = 'count_*';
        } else {
            var fn = _$0.undefined;

            if (!opt.nofn) {
                if (fieldDef.bin) {
                    fn = _v.binToString(fieldDef.bin);
                    suffix = opt.binSuffix;
                } else if (fieldDef.aggregate) {
                    fn = _$0.String(opt.aggregate || fieldDef.aggregate);
                } else if (fieldDef.timeUnit) {
                    fn = _$0.String(fieldDef.timeUnit);
                }
            }

            if (fn) {
                field = fn + "_" + field;
            }
        }

        if (suffix) {
            field = field + "_" + suffix;
        }

        if (prefix) {
            field = prefix + "_" + field;
        }

        if (opt.expr) {
            field = opt.expr + "[" + _x.stringValue(field) + "]";
        }

        return field;
    }

    function _28(fieldDef) {
        "use strict";

        return fieldDef.aggregate === 'count';
    }

    function _29(fieldDef) {
        "use strict";

        switch (fieldDef.type) {
            case 'nominal':
            case 'ordinal':
                return true;

            case 'quantitative':
                return !!fieldDef.bin;

            case 'temporal':
                // TODO: deal with custom scale type case.
                return _2a.isDiscreteByDefault(fieldDef.timeUnit);
        }

        throw new _$0.Error(_2m.message.invalidFieldType(fieldDef.type));
    }

    function _2d(timeUnit) {
        "use strict";

        return !!_2e[timeUnit];
    }

    function _2f(unit, date) {
        "use strict";

        var result = new _$0.Date(0, 0, 1, 0, 0, 0, 0); // start with uniform date

        _2a.SINGLE_TIMEUNITS.forEach(function (singleUnit) {
            if (_2g(unit, singleUnit)) {
                switch (singleUnit) {
                    case _2b.DAY:
                        throw new _$0.Error('Cannot convert to TimeUnits containing \'day\'');

                    case _2b.YEAR:
                        result.setFullYear(date.getFullYear());
                        break;

                    case _2b.QUARTER:
                        // indicate quarter by setting month to be the first of the quarter i.e. may (4) -> april (3)
                        result.setMonth(_$0.Math.floor(date.getMonth() / 3) * 3);
                        break;

                    case _2b.MONTH:
                        result.setMonth(date.getMonth());
                        break;

                    case _2b.DATE:
                        result.setDate(date.getDate());
                        break;

                    case _2b.HOURS:
                        result.setHours(date.getHours());
                        break;

                    case _2b.MINUTES:
                        result.setMinutes(date.getMinutes());
                        break;

                    case _2b.SECONDS:
                        result.setSeconds(date.getSeconds());
                        break;

                    case _2b.MILLISECONDS:
                        result.setMilliseconds(date.getMilliseconds());
                        break;
                }
            }
        });

        return result;
    }

    function _2g(fullTimeUnit, timeUnit) {
        "use strict";

        var index = fullTimeUnit.indexOf(timeUnit);
        return index > -1 && (timeUnit !== _2b.SECONDS || index === 0 || fullTimeUnit.charAt(index - 1) !== 'i' // exclude milliseconds
        );
    }

    function _2i(timeUnit) {
        "use strict";

        return !!_2j[timeUnit];
    }

    function _2l(fullTimeUnit, field) {
        "use strict";

        var fieldRef = "datum[" + _x.stringValue(field) + "]";

        function func(timeUnit) {
            if (timeUnit === _2b.QUARTER) {
                // quarter starting at 0 (0,3,6,9).
                return "(quarter(" + fieldRef + ")-1)";
            } else {
                return timeUnit + "(" + fieldRef + ")";
            }
        }

        var d = _2a.SINGLE_TIMEUNITS.reduce(function (_d, tu) {
            if (_2g(fullTimeUnit, tu)) {
                _d[tu] = func(tu);
            }

            return _d;
        }, {});

        if (d.day && _x.keys(d).length > 1) {
            _2m.warn(_2m.message.dayReplacedWithDate(fullTimeUnit));

            delete d.day;
            d.date = func(_2b.DATE);
        }

        return _36.dateTimeExpr(d);
    }

    function _2n() {
        "use strict";

        this.warns = [];
        this.infos = [];
        this.debugs = [];
    }

    var _2o = _2n.prototype;

    function _2p(f) {
        "use strict";

        var localLogger = $0 = new _2n();
        f(localLogger);

        _2v();
    }

    function _2r(_) {
        "use strict";

        return arguments.length ? ($1 = +_, this) : $1;
    }

    function _2s() {
        "use strict";

        if ($1 >= 1) _X('warn', 'WARN', arguments);
        return this;
    }

    function _2t() {
        "use strict";

        if ($1 >= 2) _X('log', 'INFO', arguments);
        return this;
    }

    function _2u() {
        "use strict";

        if ($1 >= 3) _X('log', 'DEBUG', arguments);
        return this;
    }

    function _2v() {
        "use strict";

        $0 = _2q;
        return $0;
    }

    function _2w(f) {
        "use strict";

        return function () {
            var logger = $0 = new _2n();
            f(logger);

            _2v();
        };
    }

    function _2x(logger) {
        "use strict";

        $0 = logger;
        return $0;
    }

    function _2y() {
        "use strict";

        var _ = [];

        for (var _i = 0; _i < arguments.length; _i++) {
            _[_i] = arguments[_i];
        }

        $0.warn.apply($0, arguments);
    }

    function _2z() {
        "use strict";

        var _ = [];

        for (var _i = 0; _i < arguments.length; _i++) {
            _[_i] = arguments[_i];
        }

        $0.info.apply($0, arguments);
    }

    function _2A() {
        "use strict";

        var _ = [];

        for (var _i = 0; _i < arguments.length; _i++) {
            _[_i] = arguments[_i];
        }

        $0.debug.apply($0, arguments);
    }

    function _2C(field) {
        "use strict";

        return "Unknown repeated value \"" + field + "\".";
    }

    function _2D(p) {
        "use strict";

        return "Unrecognized parse " + p + ".";
    }

    function _2E(transform) {
        "use strict";

        return "Ignoring an invalid transform: " + _$0.JSON.stringify(transform) + ".";
    }

    function _2F(type) {
        "use strict";

        return "Invalid field type \"" + type + "\"";
    }

    function _2G(aggregate) {
        "use strict";

        return "Invalid aggregation operator \"" + aggregate + "\"";
    }

    function _2H(type, channel, newType) {
        "use strict";

        return "Invalid field type (" + type + ") for channel " + channel + ", using " + newType + " instead.";
    }

    function _2I(fieldDef, channel) {
        "use strict";

        return "Dropping " + _$0.JSON.stringify(fieldDef) + " from channel " + channel + " since it does not contain data field or value.";
    }

    function _2J(channel, markOrFacet, when) {
        "use strict";

        return channel + " dropped as it is incompatible with " + markOrFacet + (when ? " when " + when : '') + ".";
    }

    function _2K(channel) {
        "use strict";

        return channel + " encoding should be discrete (ordinal / nominal / binned).";
    }

    function _2L(channel, type) {
        "use strict";

        return "Using discrete channel " + channel + " to encode " + type + " field can be misleading as it does not encode " + (type === 'ordinal' ? 'order' : 'magnitude') + ".";
    }

    function _2M(mark) {
        "use strict";

        return "Cannot clearly determine orientation for " + mark + " since both x and y channel encode continous fields. In this case, we use vertical by default";
    }

    function _2N(mark) {
        "use strict";

        return "Cannot clearly determine orientation for " + mark + " since both x and y channel encode discrete or empty fields.";
    }

    function _2O(original, actual) {
        "use strict";

        return "Specified orient " + original + " overridden with " + actual;
    }

    function _2P(prop) {
        "use strict";

        return "Cannot use " + prop + " with non-color channel.";
    }

    function _2Q(fieldDef) {
        "use strict";

        return "Using unaggregated domain with raw field has no effect (" + _$0.JSON.stringify(fieldDef) + ").";
    }

    function _2R(aggregate) {
        "use strict";

        return "Unaggregated domain not applicable for " + aggregate + " since it produces values outside the origin domain of the source data.";
    }

    function _2S(fieldDef) {
        "use strict";

        return "Unaggregated domain is currently unsupported for log scale (" + _$0.JSON.stringify(fieldDef) + ").";
    }

    function _2T(propName) {
        "use strict";

        return "Cannot use custom " + propName + " with row or column channel. Please use width, height, or spacing instead.";
    }

    function _2U(channel) {
        "use strict";

        return "rangeStep for " + channel + " is dropped as top-level " + (channel === 'x' ? 'width' : 'height') + " is provided.";
    }

    function _2V(channel, scaleType, defaultScaleType) {
        "use strict";

        return "Channel " + channel + " does not work with " + scaleType + " scale. We are using " + defaultScaleType + " scale instead.";
    }

    function _2W(scaleType, defaultScaleType) {
        "use strict";

        return "FieldDef does not work with " + scaleType + " scale. We are using " + defaultScaleType + " scale instead.";
    }

    function _2X(scaleType, propName, channel) {
        "use strict";

        return channel + "-scale's \"" + propName + "\" is dropped as it does not work with " + scaleType + " scale.";
    }

    function _2Y(mark, scaleType) {
        "use strict";

        return "Scale type \"" + scaleType + "\" does not work with mark " + mark + ".";
    }

    function _2Z(channel) {
        "use strict";

        return "Setting the scale to be independent for " + channel + " means we also have to set the guide (axis or legend) to be independent.";
    }

    function _30(channel) {
        "use strict";

        return "Cannot stack " + channel + " if there is already " + channel + "2";
    }

    function _31(scaleType) {
        "use strict";

        return "Cannot stack non-linear scale (" + scaleType + ")";
    }

    function _32(aggregate) {
        "use strict";

        return "Cannot stack when the aggregate function is non-summative (" + aggregate + ")";
    }

    function _33(unitName, value) {
        "use strict";

        return "Invalid " + unitName + ": " + value;
    }

    function _34(fullTimeUnit) {
        "use strict";

        return "Time unit \"" + fullTimeUnit + "\" is not supported. We are replacing it with " + fullTimeUnit.replace('day', 'date') + ".";
    }

    function _35(d) {
        "use strict";

        return "Dropping day from datetime " + _$0.JSON.stringify(d) + " as day cannot be combined with other units.";
    }

    function _37(o) {
        "use strict";

        return !!o && (!!o.year || !!o.quarter || !!o.month || !!o.date || !!o.day || !!o.hours || !!o.minutes || !!o.seconds || !!o.milliseconds);
    }

    function _3c(d, normalize) {
        "use strict";

        var date = new _$0.Date(0, 0, 1, 0, 0, 0, 0); // start with uniform date
        // FIXME support UTC

        if (d.day !== _$0.undefined) {
            if (_x.keys(d).length > 1) {
                _2m.warn(_2m.message.droppedDay(d));

                d = _x.duplicate(d);
                delete d.day;
            } else {
                // Use a year that has 1/1 as Sunday so we can setDate below
                date.setFullYear(2006);
                var day = normalize ? _3d(d.day) : d.day;
                date.setDate(+day + 1); // +1 since date start at 1 in JS
            }
        }

        if (d.year !== _$0.undefined) {
            date.setFullYear(d.year);
        }

        if (d.quarter !== _$0.undefined) {
            var quarter = normalize ? _3e(d.quarter) : d.quarter;
            date.setMonth(+quarter * 3);
        }

        if (d.month !== _$0.undefined) {
            var month = normalize ? _3f(d.month) : d.month;
            date.setMonth(+month);
        }

        if (d.date !== _$0.undefined) {
            date.setDate(d.date);
        }

        if (d.hours !== _$0.undefined) {
            date.setHours(d.hours);
        }

        if (d.minutes !== _$0.undefined) {
            date.setMinutes(d.minutes);
        }

        if (d.seconds !== _$0.undefined) {
            date.setSeconds(d.seconds);
        }

        if (d.milliseconds !== _$0.undefined) {
            date.setMilliseconds(d.milliseconds);
        }

        return date.getTime();
    }

    function _3d(d) {
        "use strict";

        if (_x.isNumber(d)) {
            // mod so that this can be both 0-based where 0 = sunday
            // and 1-based where 7=sunday
            return d % 7 + '';
        } else {
            var lowerD = d.toLowerCase();

            var dayIndex = _36.DAYS.indexOf(lowerD);

            if (dayIndex !== -1) {
                return dayIndex + ''; // 0 for january, ...
            }

            var shortD = lowerD.substr(0, 3);

            var shortDayIndex = _36.SHORT_DAYS.indexOf(shortD);

            if (shortDayIndex !== -1) {
                return shortDayIndex + '';
            } // Invalid day


            throw new _$0.Error(_2m.message.invalidTimeUnit('day', d));
        }
    }

    function _3e(q) {
        "use strict";

        if (_x.isNumber(q)) {
            if (q > 4) {
                _2m.warn(_2m.message.invalidTimeUnit('quarter', q));
            } // We accept 1-based quarter, so need to readjust to 0-based quarter


            return q - 1 + '';
        } else {
            // Invalid quarter
            throw new _$0.Error(_2m.message.invalidTimeUnit('quarter', q));
        }
    }

    function _3f(m) {
        "use strict";

        if (_x.isNumber(m)) {
            // We accept 1-based month, so need to readjust to 0-based month
            return m - 1 + '';
        } else {
            var lowerM = m.toLowerCase();

            var monthIndex = _36.MONTHS.indexOf(lowerM);

            if (monthIndex !== -1) {
                return monthIndex + ''; // 0 for january, ...
            }

            var shortM = lowerM.substr(0, 3);

            var shortMonthIndex = _36.SHORT_MONTHS.indexOf(shortM);

            if (shortMonthIndex !== -1) {
                return shortMonthIndex + '';
            } // Invalid month


            throw new _$0.Error(_2m.message.invalidTimeUnit('month', m));
        }
    }

    function _3g(d, normalize) {
        "use strict";

        if (normalize === void 0) {
            normalize = false;
        }

        var units = [];

        if (normalize && d.day !== _$0.undefined) {
            if (_x.keys(d).length > 1) {
                _2m.warn(_2m.message.droppedDay(d));

                d = _x.duplicate(d);
                delete d.day;
            }
        }

        if (d.year !== _$0.undefined) {
            units.push(d.year);
        } else if (d.day !== _$0.undefined) {
            // Set year to 2006 for working with day since January 1 2006 is a Sunday
            units.push(2006);
        } else {
            units.push(0);
        }

        if (d.month !== _$0.undefined) {
            var month = normalize ? _3f(d.month) : d.month;
            units.push(month);
        } else if (d.quarter !== _$0.undefined) {
            var quarter = normalize ? _3e(d.quarter) : d.quarter;
            units.push(quarter + '*3');
        } else {
            units.push(0); // months start at zero in JS
        }

        if (d.date !== _$0.undefined) {
            units.push(d.date);
        } else if (d.day !== _$0.undefined) {
            // HACK: Day only works as a standalone unit
            // This is only correct because we always set year to 2006 for day
            var day = normalize ? _3d(d.day) : d.day;
            units.push(day + '+1');
        } else {
            units.push(1); // Date starts at 1 in JS
        } // Note: can't use TimeUnit enum here as importing it will create
        // circular dependency problem!


        for (var _i = 0, _a = ['hours', 'minutes', 'seconds', 'milliseconds']; _i < _a.length; _i++) {
            var timeUnit = _a[_i];

            if (d[timeUnit] !== _$0.undefined) {
                units.push(d[timeUnit]);
            } else {
                units.push(0);
            }
        }

        return 'datetime(' + units.join(', ') + ')';
    }

    function _3h(timeUnit) {
        "use strict";

        if (!timeUnit) {
            return _$0.undefined;
        }

        if (_2g(timeUnit, _2b.SECONDS)) {
            return 'second';
        }

        if (_2g(timeUnit, _2b.MINUTES)) {
            return 'minute';
        }

        if (_2g(timeUnit, _2b.HOURS)) {
            return 'hour';
        }

        if (_2g(timeUnit, _2b.DAY) || _2g(timeUnit, _2b.DATE)) {
            return 'day';
        }

        if (_2g(timeUnit, _2b.MONTH)) {
            return 'month';
        }

        if (_2g(timeUnit, _2b.YEAR)) {
            return 'year';
        }

        return _$0.undefined;
    }

    function _3i(timeUnit, field, shortTimeLabels) {
        "use strict";

        if (!timeUnit) {
            return _$0.undefined;
        }

        var dateComponents = [];
        var expression = '';

        var hasYear = _2g(timeUnit, _2b.YEAR);

        if (_2g(timeUnit, _2b.QUARTER)) {
            // special expression for quarter as prefix
            expression = "'Q' + quarter(" + field + ")";
        }

        if (_2g(timeUnit, _2b.MONTH)) {
            // By default use short month name
            dateComponents.push(shortTimeLabels !== false ? '%b' : '%B');
        }

        if (_2g(timeUnit, _2b.DAY)) {
            dateComponents.push(shortTimeLabels ? '%a' : '%A');
        } else if (_2g(timeUnit, _2b.DATE)) {
            dateComponents.push('%d' + (hasYear ? ',' : '')); // add comma if there is year
        }

        if (hasYear) {
            dateComponents.push(shortTimeLabels ? '%y' : '%Y');
        }

        var timeComponents = [];

        if (_2g(timeUnit, _2b.HOURS)) {
            timeComponents.push('%H');
        }

        if (_2g(timeUnit, _2b.MINUTES)) {
            timeComponents.push('%M');
        }

        if (_2g(timeUnit, _2b.SECONDS)) {
            timeComponents.push('%S');
        }

        if (_2g(timeUnit, _2b.MILLISECONDS)) {
            timeComponents.push('%L');
        }

        var dateTimeComponents = [];

        if (dateComponents.length > 0) {
            dateTimeComponents.push(dateComponents.join(' '));
        }

        if (timeComponents.length > 0) {
            dateTimeComponents.push(timeComponents.join(':'));
        }

        if (dateTimeComponents.length > 0) {
            if (expression) {
                // Add space between quarter and main time format
                expression += " + ' ' + ";
            }

            expression += "timeFormat(" + field + ", '" + dateTimeComponents.join(' ') + "')";
        } // If expression is still an empty string, return undefined instead.


        return expression || _$0.undefined;
    }

    function _3j(timeUnit) {
        "use strict";

        switch (timeUnit) {
            // These time unit use discrete scale by default
            case 'hours':
            case 'day':
            case 'month':
            case 'quarter':
                return true;
        }

        return false;
    }

    function _3k(fieldDef) {
        "use strict";

        return !_29(fieldDef);
    }

    function _3l(fieldDef, config) {
        "use strict";

        if (_28(fieldDef)) {
            return config.countTitle;
        }

        var fn = fieldDef.aggregate || fieldDef.timeUnit || fieldDef.bin && 'bin';

        if (fn) {
            return fn.toUpperCase() + '(' + fieldDef.field + ')';
        } else {
            return fieldDef.field;
        }
    }

    function _3m(fieldDef, channel) {
        "use strict";

        if (fieldDef.timeUnit) {
            return 'temporal';
        }

        if (fieldDef.bin) {
            return 'quantitative';
        }

        switch (_1F.rangeType(channel)) {
            case 'continuous':
                return 'quantitative';

            case 'discrete':
                return 'nominal';

            case 'flexible':
                return 'nominal';

            default:
                return 'quantitative';
        }
    }

    function _3n(channelDef, channel) {
        "use strict";

        // If a fieldDef contains a field, we need type.
        if (_25(channelDef)) {
            var fieldDef = channelDef; // Drop invalid aggregate

            if (fieldDef.aggregate && !_p.AGGREGATE_OP_INDEX[fieldDef.aggregate]) {
                var aggregate = fieldDef.aggregate,
                    fieldDefWithoutAggregate = _22.__rest(fieldDef, ["aggregate"]);

                _2m.warn(_2m.message.invalidAggregate(fieldDef.aggregate));

                fieldDef = fieldDefWithoutAggregate;
            } // Normalize bin


            if (fieldDef.bin) {
                var bin = fieldDef.bin;

                if (_x.isBoolean(bin)) {
                    fieldDef = _22.__assign({}, fieldDef, {
                        bin: {
                            maxbins: _v.autoMaxBins(channel)
                        }
                    });
                } else if (!bin.maxbins && !bin.step) {
                    fieldDef = _22.__assign({}, fieldDef, {
                        bin: _22.__assign({}, bin, {
                            maxbins: _v.autoMaxBins(channel)
                        })
                    });
                }
            } // Normalize Type


            if (fieldDef.type) {
                var fullType = _3o.getFullName(fieldDef.type);

                if (fieldDef.type !== fullType) {
                    // convert short type to full type
                    fieldDef = _22.__assign({}, fieldDef, {
                        type: fullType
                    });
                }
            } else {
                // If type is empty / invalid, then augment with default type
                var newType = _3m(fieldDef, channel);

                _2m.warn(_2m.message.emptyOrInvalidFieldType(fieldDef.type, channel, newType));

                fieldDef = _22.__assign({}, fieldDef, {
                    type: newType
                });
            }

            var _a = _3r(fieldDef, channel),
                compatible = _a.compatible,
                warning = _a.warning;

            if (!compatible) {
                _2m.warn(warning);
            }

            return fieldDef;
        }

        return channelDef;
    }

    function _3q(type) {
        "use strict";

        if (type) {
            type = type.toLowerCase();

            switch (type) {
                case 'q':
                case _3o.QUANTITATIVE:
                    return 'quantitative';

                case 't':
                case _3o.TEMPORAL:
                    return 'temporal';

                case 'o':
                case _3o.ORDINAL:
                    return 'ordinal';

                case 'n':
                case _3o.NOMINAL:
                    return 'nominal';
            }
        } // If we get invalid input, return undefined type.


        return _$0.undefined;
    }

    function _3r(fieldDef, channel) {
        "use strict";

        switch (channel) {
            case 'row':
            case 'column':
                if (_3k(fieldDef) && !fieldDef.timeUnit) {
                    // TODO:(https://github.com/vega/vega-lite/issues/2011):
                    // with timeUnit it's not always strictly continuous
                    return {
                        compatible: false,
                        warning: _2m.message.facetChannelShouldBeDiscrete(channel)
                    };
                }

                return _3s;

            case 'x':
            case 'y':
            case 'color':
            case 'text':
            case 'detail':
            case 'tooltip':
                return _3s;

            case 'opacity':
            case 'size':
            case 'x2':
            case 'y2':
                if (_29(fieldDef) && !fieldDef.bin) {
                    return {
                        compatible: false,
                        warning: "Channel " + channel + " should not be used with discrete field."
                    };
                }

                return _3s;

            case 'shape':
                if (fieldDef.type !== 'nominal') {
                    return {
                        compatible: false,
                        warning: 'Shape channel should be used with nominal data only'
                    };
                }

                return _3s;

            case 'order':
                if (fieldDef.type === 'nominal') {
                    return {
                        compatible: false,
                        warning: "Channel order is inappropriate for nominal field, which has no inherent order."
                    };
                }

                return _3s;
        }

        throw new _$0.Error('channelCompatability not implemented for channel ' + channel);
    }

    function _3u(spec) {
        "use strict";

        var _m = spec.mark,
            encoding = spec.encoding,
            outerSpec = _22.__rest(spec, ["mark", "encoding"]);

        var _s = encoding.size,
            encodingWithoutSize = _22.__rest(encoding, ["size"]);

        var _x2 = encoding.x2,
            _y2 = encoding.y2,
            encodingWithoutX2Y2 = _22.__rest(encoding, ["x2", "y2"]);

        var _x = encodingWithoutX2Y2.x,
            _y = encodingWithoutX2Y2.y,
            encodingWithoutX_X2_Y_Y2 = _22.__rest(encodingWithoutX2Y2, ["x", "y"]);

        if (!encoding.x2 && !encoding.y2) {
            throw new _$0.Error('Neither x2 or y2 provided');
        }

        return _22.__assign({}, outerSpec, {
            layer: [{
                mark: 'rule',
                encoding: encodingWithoutSize
            }, {
                mark: 'tick',
                encoding: encodingWithoutX2Y2
            }, {
                mark: 'tick',
                encoding: encoding.x2 ? _22.__assign({
                    x: encoding.x2,
                    y: encoding.y
                }, encodingWithoutX_X2_Y_Y2) : _22.__assign({
                    x: encoding.x,
                    y: encoding.y2
                }, encodingWithoutX_X2_Y_Y2)
            }]
        });
    }

    function _3v(mark) {
        "use strict";

        delete _20[mark];
    }

    function _3w( // This GenericUnitSpec has any as Encoding because unit specs with composite mark can have additional encoding channels.
    spec, config) {
        "use strict";

        var mark = _3x.isMarkDef(spec.mark) ? spec.mark.type : spec.mark;
        var normalizer = _20[mark];

        if (normalizer) {
            return normalizer(spec, config);
        }

        throw new _$0.Error("Unregistered composite mark " + mark);
    }

    function _3A(mark) {
        "use strict";

        return mark['type'];
    }

    function _3B(mark) {
        "use strict";

        var markType = _3A(mark) ? mark.type : mark;
        return markType in _3C;
    }

    function _3K(inputSpec, logger) {
        "use strict";

        if (logger) {
            // set the singleton logger to the provided logger
            _2m.set(logger);
        }

        try {
            // 1. initialize config
            var config = _3L.initConfig(inputSpec.config); // 2. Convert input spec into a normal form
            // (Decompose all extended unit specs into composition of unit spec.)


            var spec = _4k.normalize(inputSpec, config); // 3. Instantiate the model with default config


            var model = _5f.buildModel(spec, null, '', _$0.undefined, _$0.undefined, config); // 4. Parse each part of the model to produce components that will be assembled later
            // We traverse the whole tree to parse once for each type of components
            // (e.g., data, layout, mark, scale).
            // Please see inside model.parse() for order for compilation.


            model.parse(); // 5. Assemble a Vega Spec from the parsed components in 3.

            return _dy(model, _dA(inputSpec, config));
        } finally {
            // Reset the singleton logger if a logger is provided
            if (logger) {
                _2m.reset();
            }
        }
    }

    function _4j(config) {
        "use strict";

        return _x.mergeDeep(_x.duplicate(_3L.defaultConfig), config);
    }

    function _4l(spec) {
        "use strict";

        return spec['facet'] !== _$0.undefined;
    }

    function _4m(spec) {
        "use strict";

        return !!spec['mark'];
    }

    function _4n(spec) {
        "use strict";

        return spec['layer'] !== _$0.undefined;
    }

    function _4o(spec) {
        "use strict";

        return spec['repeat'] !== _$0.undefined;
    }

    function _4p(spec) {
        "use strict";

        return _4q(spec) || _4r(spec);
    }

    function _4q(spec) {
        "use strict";

        return spec['vconcat'] !== _$0.undefined;
    }

    function _4r(spec) {
        "use strict";

        return spec['hconcat'] !== _$0.undefined;
    }

    function _4s(spec, config) {
        "use strict";

        if (_4l(spec)) {
            return _4t(spec, config);
        }

        if (_4n(spec)) {
            return _4v(spec, config);
        }

        if (_4o(spec)) {
            return _56(spec, spec.config);
        }

        if (_4q(spec)) {
            return _58(spec, spec.config);
        }

        if (_4r(spec)) {
            return _59(spec, spec.config);
        }

        if (_4m(spec)) {
            var hasRow = _4y.channelHasField(spec.encoding, _1F.ROW);

            var hasColumn = _4y.channelHasField(spec.encoding, _1F.COLUMN);

            if (hasRow || hasColumn) {
                return _5a(spec, config);
            }

            return _4w(spec, config);
        }

        throw new _$0.Error(_2m.message.INVALID_SPEC);
    }

    function _4t(spec, config) {
        "use strict";

        var subspec = spec.spec,
            rest = _22.__rest(spec, ["spec"]);

        return _22.__assign({}, rest, {
            spec: _4u(subspec, config)
        });
    }

    function _4u(spec, config) {
        "use strict";

        if (_4n(spec)) {
            return _4v(spec, config);
        }

        if (_4o(spec)) {
            return _56(spec, config);
        }

        return _4w(spec, config);
    }

    function _4v(spec, config) {
        "use strict";

        var layer = spec.layer,
            rest = _22.__rest(spec, ["layer"]);

        return _22.__assign({}, rest, {
            layer: layer.map(function (subspec) {
                return _4n(subspec) ? _4v(subspec, config) : _4w(subspec, config);
            })
        });
    }

    function _4w(spec, config) {
        "use strict";

        if (_4x(spec)) {
            // TODO: thoroughly test
            if (_4y.isRanged(spec.encoding)) {
                return _4G(spec);
            }

            var overlayConfig = config && config.overlay;

            var overlayWithLine = overlayConfig && spec.mark === _3x.AREA && _x.contains(['linepoint', 'line'], overlayConfig.area);

            var overlayWithPoint = overlayConfig && (overlayConfig.line && spec.mark === _3x.LINE || overlayConfig.area === 'linepoint' && spec.mark === _3x.AREA); // TODO: consider moving this to become another case of compositeMark

            if (overlayWithPoint || overlayWithLine) {
                return _4H(spec, overlayWithPoint, overlayWithLine, config);
            }

            return spec; // Nothing to normalize
        } else {
            return _1Y.normalize(spec, config);
        }
    }

    function _4x(spec) {
        "use strict";

        return _3x.isPrimitiveMark(spec.mark);
    }

    function _4z(encoding, channel) {
        "use strict";

        var channelDef = encoding && encoding[channel];

        if (channelDef) {
            if (_x.isArray(channelDef)) {
                return _x.some(channelDef, function (fieldDef) {
                    return !!fieldDef.field;
                });
            } else {
                return _23.isFieldDef(channelDef);
            }
        }

        return false;
    }

    function _4A(encoding) {
        "use strict";

        return _x.some(_1F.CHANNELS, function (channel) {
            if (_4z(encoding, channel)) {
                var channelDef = encoding[channel];

                if (_x.isArray(channelDef)) {
                    return _x.some(channelDef, function (fieldDef) {
                        return !!fieldDef.aggregate;
                    });
                } else {
                    return _23.isFieldDef(channelDef) && !!channelDef.aggregate;
                }
            }

            return false;
        });
    }

    function _4B(encoding, mark) {
        "use strict";

        return _$0.Object.keys(encoding).reduce(function (normalizedEncoding, channel) {
            if (!_1F.supportMark(channel, mark)) {
                // Drop unsupported channel
                _2m.warn(_2m.message.incompatibleChannel(channel, mark));

                return normalizedEncoding;
            } // Drop line's size if the field is aggregated.


            if (channel === 'size' && mark === 'line') {
                var channelDef = encoding[channel];

                if (_23.isFieldDef(channelDef) && channelDef.aggregate) {
                    _2m.warn(_2m.message.incompatibleChannel(channel, mark, 'when the field is aggregated.'));

                    return normalizedEncoding;
                }
            }

            if (_x.isArray(encoding[channel])) {
                // Array of fieldDefs for detail channel (or production rule)
                normalizedEncoding[channel] = encoding[channel].reduce(function (channelDefs, channelDef) {
                    if (!_23.isFieldDef(channelDef) && !_23.isValueDef(channelDef)) {
                        _2m.warn(_2m.message.emptyFieldDef(channelDef, channel));
                    } else {
                        channelDefs.push(_23.normalize(channelDef, channel));
                    }

                    return channelDefs;
                }, []);
            } else {
                var channelDef = encoding[channel];

                if (!_23.isFieldDef(channelDef) && !_23.isValueDef(channelDef)) {
                    _2m.warn(_2m.message.emptyFieldDef(channelDef, channel));

                    return normalizedEncoding;
                }

                normalizedEncoding[channel] = _23.normalize(channelDef, channel);
            }

            return normalizedEncoding;
        }, {});
    }

    function _4C(encoding) {
        "use strict";

        return encoding && (!!encoding.x && !!encoding.x2 || !!encoding.y && !!encoding.y2);
    }

    function _4D(encoding) {
        "use strict";

        var arr = [];

        _1F.CHANNELS.forEach(function (channel) {
            if (_4z(encoding, channel)) {
                var channelDef = encoding[channel];
                (_x.isArray(channelDef) ? channelDef : [channelDef]).forEach(function (fieldDef) {
                    arr.push(fieldDef);
                });
            }
        });

        return arr;
    }

    function _4E(mapping, f, thisArg) {
        "use strict";

        if (!mapping) {
            return;
        }

        _$0.Object.keys(mapping).forEach(function (c) {
            var channel = c;

            if (_x.isArray(mapping[channel])) {
                mapping[channel].forEach(function (channelDef) {
                    f.call(thisArg, channelDef, channel);
                });
            } else {
                f.call(thisArg, mapping[channel], channel);
            }
        });
    }

    function _4F(mapping, f, init, thisArg) {
        "use strict";

        if (!mapping) {
            return init;
        }

        return _$0.Object.keys(mapping).reduce(function (r, c) {
            var channel = c;

            if (_x.isArray(mapping[channel])) {
                return mapping[channel].reduce(function (r1, channelDef) {
                    return f.call(thisArg, r1, channelDef, channel);
                }, r);
            } else {
                return f.call(thisArg, r, mapping[channel], channel);
            }
        }, init);
    }

    function _4G(spec) {
        "use strict";

        var hasX = _4y.channelHasField(spec.encoding, _1F.X);

        var hasY = _4y.channelHasField(spec.encoding, _1F.Y);

        var hasX2 = _4y.channelHasField(spec.encoding, _1F.X2);

        var hasY2 = _4y.channelHasField(spec.encoding, _1F.Y2);

        if (hasX2 && !hasX || hasY2 && !hasY) {
            var normalizedSpec = _x.duplicate(spec);

            if (hasX2 && !hasX) {
                normalizedSpec.encoding.x = normalizedSpec.encoding.x2;
                delete normalizedSpec.encoding.x2;
            }

            if (hasY2 && !hasY) {
                normalizedSpec.encoding.y = normalizedSpec.encoding.y2;
                delete normalizedSpec.encoding.y2;
            }

            return normalizedSpec;
        }

        return spec;
    }

    function _4H(spec, overlayWithPoint, overlayWithLine, config) {
        "use strict";

        var mark = spec.mark,
            encoding = spec.encoding,
            outerSpec = _22.__rest(spec, ["mark", "encoding"]);

        var layer = [{
            mark: mark,
            encoding: encoding
        }]; // Need to copy stack config to overlayed layer

        var stackProps = _4I.stack(mark, encoding, config ? config.stack : _$0.undefined);

        var overlayEncoding = encoding;

        if (stackProps) {
            var stackFieldChannel = stackProps.fieldChannel,
                offset = stackProps.offset;
            overlayEncoding = _22.__assign({}, encoding, (_a = {}, _a[stackFieldChannel] = _22.__assign({}, encoding[stackFieldChannel], offset ? {
                stack: offset
            } : {}), _a));
        }

        if (overlayWithLine) {
            layer.push({
                mark: {
                    type: 'line',
                    role: 'lineOverlay'
                },
                encoding: overlayEncoding
            });
        }

        if (overlayWithPoint) {
            layer.push({
                mark: {
                    type: 'point',
                    filled: true,
                    role: 'pointOverlay'
                },
                encoding: overlayEncoding
            });
        }

        return _22.__assign({}, outerSpec, {
            layer: layer
        });

        var _a;
    }

    function _4L(m, encoding, stackConfig) {
        "use strict";

        var mark = _3x.isMarkDef(m) ? m.type : m; // Should have stackable mark

        if (!_x.contains(_4I.STACKABLE_MARKS, mark)) {
            return null;
        } // Should be aggregate plot


        if (!_4y.isAggregate(encoding)) {
            return null;
        } // Should have grouping level of detail


        var stackBy = _1F.STACK_GROUP_CHANNELS.reduce(function (sc, channel) {
            if (_4y.channelHasField(encoding, channel)) {
                var channelDef = encoding[channel];
                (_x.isArray(channelDef) ? channelDef : [channelDef]).forEach(function (fieldDef) {
                    if (_23.isFieldDef(fieldDef) && !fieldDef.aggregate) {
                        sc.push({
                            channel: channel,
                            fieldDef: fieldDef
                        });
                    }
                });
            }

            return sc;
        }, []);

        if (stackBy.length === 0) {
            return null;
        } // Has only one aggregate axis


        var hasXField = _23.isFieldDef(encoding.x);

        var hasYField = _23.isFieldDef(encoding.y);

        var xIsAggregate = _23.isFieldDef(encoding.x) && !!encoding.x.aggregate;
        var yIsAggregate = _23.isFieldDef(encoding.y) && !!encoding.y.aggregate;

        if (xIsAggregate !== yIsAggregate) {
            var fieldChannel = xIsAggregate ? _1F.X : _1F.Y;
            var fieldDef = encoding[fieldChannel];
            var fieldChannelAggregate = fieldDef.aggregate;
            var fieldChannelScale = fieldDef.scale;
            var stackOffset = null;

            if (fieldDef.stack !== _$0.undefined) {
                stackOffset = fieldDef.stack;
            } else if (_x.contains(_4I.STACK_BY_DEFAULT_MARKS, mark)) {
                // Bar and Area with sum ops are automatically stacked by default
                stackOffset = stackConfig === _$0.undefined ? 'zero' : stackConfig;
            } else {
                stackOffset = stackConfig;
            }

            if (!stackOffset || stackOffset === 'none') {
                return null;
            } // If stacked, check if it qualifies for stacking (and log warning if not qualified.)


            if (fieldChannelScale && fieldChannelScale.type && fieldChannelScale.type !== _4M.ScaleType.LINEAR) {
                _2m.warn(_2m.message.cannotStackNonLinearScale(fieldChannelScale.type));

                return null;
            }

            if (_4y.channelHasField(encoding, fieldChannel === _1F.X ? _1F.X2 : _1F.Y2)) {
                _2m.warn(_2m.message.cannotStackRangedMark(fieldChannel));

                return null;
            }

            if (!_x.contains(_p.SUM_OPS, fieldChannelAggregate)) {
                _2m.warn(_2m.message.cannotStackNonSummativeAggregate(fieldChannelAggregate));

                return null;
            }

            return {
                groupbyChannel: xIsAggregate ? hasYField ? _1F.Y : null : hasXField ? _1F.X : null,
                fieldChannel: fieldChannel,
                stackBy: stackBy,
                offset: stackOffset
            };
        }

        return null;
    }

    function _4T(type) {
        "use strict";

        return type in _4U;
    }

    function _4V(type) {
        "use strict";

        return type in _4W;
    }

    function _4X(type) {
        "use strict";

        return type in _4Y;
    }

    function _4Z(type) {
        "use strict";

        return type in _50;
    }

    function _51(scheme) {
        "use strict";

        return scheme && !!scheme['name'];
    }

    function _52(domain) {
        "use strict";

        return domain && domain['selection'];
    }

    function _54(scaleType, propName) {
        "use strict";

        switch (propName) {
            case 'type':
            case 'domain':
            case 'range':
            case 'scheme':
                return true;

            case 'interpolate':
                return _x.contains(['linear', 'bin-linear', 'pow', 'log', 'sqrt', 'utc', 'time'], scaleType);

            case 'round':
                return _4Z(scaleType) || scaleType === 'band' || scaleType === 'point';

            case 'rangeStep':
            case 'padding':
            case 'paddingOuter':
                return _x.contains(['point', 'band'], scaleType);

            case 'paddingInner':
                return scaleType === 'band';

            case 'clamp':
                return _4Z(scaleType) || scaleType === 'sequential';

            case 'nice':
                return _4Z(scaleType) || scaleType === 'sequential' || scaleType === 'quantize';

            case 'exponent':
                return scaleType === 'pow' || scaleType === 'log';

            case 'zero':
                // TODO: what about quantize, threshold?
                return scaleType === 'bin-ordinal' || !_4T(scaleType) && !_x.contains(['log', 'time', 'utc', 'bin-linear'], scaleType);
        } /* istanbul ignore next: should never reach here*/

        throw new _$0.Error("Invalid scale property " + propName + ".");
    }

    function _55(channel, propName) {
        "use strict";

        switch (propName) {
            case 'range':
                // User should not customize range for position and facet channel directly.
                if (channel === 'x' || channel === 'y') {
                    return _2m.message.CANNOT_USE_RANGE_WITH_POSITION;
                }

                if (channel === 'row' || channel === 'column') {
                    return _2m.message.cannotUseRangePropertyWithFacet('range');
                }

                return _$0.undefined;
            // GOOD!
            // band / point

            case 'rangeStep':
                if (channel === 'row' || channel === 'column') {
                    return _2m.message.cannotUseRangePropertyWithFacet('rangeStep');
                }

                return _$0.undefined;
            // GOOD!

            case 'padding':
            case 'paddingInner':
            case 'paddingOuter':
                if (channel === 'row' || channel === 'column') {
                    /*
                     * We do not use d3 scale's padding for row/column because padding there
                     * is a ratio ([0, 1]) and it causes the padding to be decimals.
                     * Therefore, we manually calculate "spacing" in the layout by ourselves.
                     */return _2m.message.CANNOT_USE_PADDING_WITH_FACET;
                }

                return _$0.undefined;
            // GOOD!

            case 'interpolate':
            case 'scheme':
                if (channel !== 'color') {
                    return _2m.message.cannotUseScalePropertyWithNonColor(channel);
                }

                return _$0.undefined;

            case 'type':
            case 'domain':
            case 'round':
            case 'clamp':
            case 'exponent':
            case 'nice':
            case 'zero':
                // These channel do not have strict requirement
                return _$0.undefined;
            // GOOD!
        } /* istanbul ignore next: it should never reach here */

        throw new _$0.Error('Invalid scale property "${propName}".');
    }

    function _56(spec, config) {
        "use strict";

        var subspec = spec.spec,
            rest = _22.__rest(spec, ["spec"]);

        return _22.__assign({}, rest, {
            spec: _57(subspec, config)
        });
    }

    function _57(spec, config) {
        "use strict";

        if (_4n(spec)) {
            return _4v(spec, config);
        }

        if (_4o(spec)) {
            return _56(spec, config);
        }

        return _4w(spec, config);
    }

    function _58(spec, config) {
        "use strict";

        var vconcat = spec.vconcat,
            rest = _22.__rest(spec, ["vconcat"]);

        return _22.__assign({}, rest, {
            vconcat: vconcat.map(function (subspec) {
                return _4u(subspec, config);
            })
        });
    }

    function _59(spec, config) {
        "use strict";

        var hconcat = spec.hconcat,
            rest = _22.__rest(spec, ["hconcat"]);

        return _22.__assign({}, rest, {
            hconcat: hconcat.map(function (subspec) {
                return _4u(subspec, config);
            })
        });
    }

    function _5a(spec, config) {
        "use strict";

        // New encoding in the inside spec should not contain row / column
        // as row/column should be moved to facet
        var _a = spec.encoding,
            row = _a.row,
            column = _a.column,
            encoding = _22.__rest(_a, ["row", "column"]); // Mark and encoding should be moved into the inner spec


        var mark = spec.mark,
            selection = spec.selection,
            _ = spec.encoding,
            outerSpec = _22.__rest(spec, ["mark", "selection", "encoding"]);

        return _22.__assign({}, outerSpec, {
            facet: _22.__assign({}, row ? {
                row: row
            } : {}, column ? {
                column: column
            } : {}),
            spec: _4w(_22.__assign({
                mark: mark,
                encoding: encoding
            }, selection ? {
                selection: selection
            } : {}), config)
        });
    }

    function _5b(spec) {
        "use strict";

        return _x.vals(_5c(spec));
    }

    function _5c(spec, dict) {
        "use strict";

        if (dict === void 0) {
            dict = {};
        } // TODO: Support repeat and concat


        if (_4n(spec)) {
            spec.layer.forEach(function (layer) {
                if (_4m(layer)) {
                    _5d(dict, _4y.fieldDefs(layer.encoding));
                } else {
                    _5c(layer, dict);
                }
            });
        } else if (_4l(spec)) {
            _5d(dict, _4y.fieldDefs(spec.facet));

            _5c(spec.spec, dict);
        } else if (_4o(spec)) {
            _5d(dict, _4y.fieldDefs(spec.spec));

            _5c(spec.spec, dict);
        } else if (_4p(spec)) {
            var childSpec = _4q(spec) ? spec.vconcat : spec.hconcat;
            childSpec.forEach(function (child) {
                if (_4m(child)) {
                    _5d(dict, _4y.fieldDefs(child.encoding));
                } else {
                    _5c(child, dict);
                }
            });
        } else {
            _5d(dict, _4y.fieldDefs(spec.encoding));
        }

        return dict;
    }

    function _5d(dict, fieldDefs) {
        "use strict";

        fieldDefs.forEach(function (fieldDef) {
            // Consider only pure fieldDef properties (ignoring scale, axis, legend)
            var pureFieldDef = ['field', 'type', 'value', 'timeUnit', 'bin', 'aggregate'].reduce(function (f, key) {
                if (fieldDef[key] !== _$0.undefined) {
                    f[key] = fieldDef[key];
                }

                return f;
            }, {});

            var key = _x.hash(pureFieldDef);

            dict[key] = dict[key] || fieldDef;
        });
        return dict;
    }

    function _5e(spec, config) {
        "use strict";

        config = config || spec.config;

        if (_3x.isPrimitiveMark(spec.mark)) {
            return _4I.stack(spec.mark, spec.encoding, config ? config.stack : _$0.undefined) !== null;
        }

        return false;
    }

    function _5g(spec, parent, parentGivenName, unitSize, repeater, config) {
        "use strict";

        if (_4k.isFacetSpec(spec)) {
            return new _5h.FacetModel(spec, parent, parentGivenName, repeater, config);
        }

        if (_4k.isLayerSpec(spec)) {
            return new _7j.LayerModel(spec, parent, parentGivenName, unitSize, repeater, config);
        }

        if (_4k.isUnitSpec(spec)) {
            return new _8S.UnitModel(spec, parent, parentGivenName, unitSize, repeater, config);
        }

        if (_4k.isRepeatSpec(spec)) {
            return new _5s.RepeatModel(spec, parent, parentGivenName, repeater, config);
        }

        if (_4k.isConcatSpec(spec)) {
            return new _d8.ConcatModel(spec, parent, parentGivenName, repeater, config);
        }

        throw new _$0.Error(_2m.message.INVALID_SPEC);
    }

    function _5i(spec, parent, parentGivenName, repeater, config) {
        "use strict";

        var _this = _5j.call(this, spec, parent, parentGivenName, config) || this;

        _this.child = _5f.buildModel(spec.spec, _this, _this.getName('child'), _$0.undefined, repeater, config);
        _this.children = [_this.child];

        var facet = _5s.replaceRepeaterInFacet(spec.facet, repeater);

        _this.facet = _this.initFacet(facet);
        return _this;
    }

    function _5j() {
        "use strict";

        return _5k !== null && _5k.apply(this, arguments) || this;
    }

    function _5k(spec, parent, parentGivenName, config) {
        "use strict";

        var _this = this;

        this.children = []; /**
                             * Corrects the data references in marks after assemble.
                             */

        this.correctDataNames = function (mark) {
            // TODO: make this correct
            // for normal data references
            if (mark.from && mark.from.data) {
                mark.from.data = _this.lookupDataSource(mark.from.data);
            } // for access to facet data


            if (mark.from && mark.from.facet && mark.from.facet.data) {
                mark.from.facet.data = _this.lookupDataSource(mark.from.facet.data);
            }

            return mark;
        };

        this.parent = parent;
        this.config = config; // If name is not provided, always use parent's givenName to avoid name conflicts.

        this.name = spec.name || parentGivenName; // Shared name maps

        this.scaleNameMap = parent ? parent.scaleNameMap : new _5l();
        this.sizeNameMap = parent ? parent.sizeNameMap : new _5l();
        this.data = spec.data;
        this.description = spec.description;
        this.transforms = spec.transform || [];
        this.component = {
            data: {
                sources: parent ? parent.component.data.sources : {},
                outputNodes: parent ? parent.component.data.outputNodes : {}
            },
            mark: null,
            scales: null,
            axes: {
                x: null,
                y: null
            },
            layoutHeaders: {
                row: {},
                column: {}
            },
            legends: null,
            selection: null
        };
    }

    var _5n = _5k.prototype;

    function _5l() {
        "use strict";

        this.nameMap = {};
    }

    var _5m = _5l.prototype;

    function _5p(channel, opt) {
        "use strict";

        if (opt === void 0) {
            opt = {};
        }

        var fieldDef = this.fieldDef(channel);

        if (fieldDef.bin) {
            opt = _x.extend({
                binSuffix: this.hasDiscreteDomain(channel) ? 'range' : 'start'
            }, opt);
        }

        return _23.field(fieldDef, opt);
    }

    function _5q(f, init, t) {
        "use strict";

        return _4y.reduce(this.getMapping(), function (acc, cd, c) {
            return _23.isFieldDef(cd) ? f(acc, cd, c) : acc;
        }, init, t);
    }

    function _5r(f, t) {
        "use strict";

        _4y.forEach(this.getMapping(), function (cd, c) {
            if (_23.isFieldDef(cd)) {
                f(cd, c);
            }
        }, t);
    }

    function _5t(facet, repeater) {
        "use strict";

        return _5u(facet, repeater);
    }

    function _5u(mapping, repeater) {
        "use strict";

        var out = {};

        for (var channel in mapping) {
            if (mapping.hasOwnProperty(channel)) {
                var fieldDef = mapping[channel];

                if (_K.isArray(fieldDef)) {
                    out[channel] = fieldDef.map(function (fd) {
                        return _5v(fd, repeater);
                    }).filter(function (fd) {
                        return fd !== null;
                    });
                } else {
                    var fd = _5v(fieldDef, repeater);

                    if (fd !== null) {
                        out[channel] = fd;
                    }
                }
            }
        }

        return out;
    }

    function _5v(fieldDef, repeater) {
        "use strict";

        var field = fieldDef.field;

        if (_23.isRepeatRef(field)) {
            if (field.repeat in repeater) {
                return _22.__assign({}, fieldDef, {
                    field: repeater[field.repeat]
                });
            } else {
                _2m.warn(_2m.message.noSuchRepeatedValue(field.repeat));

                return null;
            }
        } else {
            // field is not a repeat ref so we can just return the field def
            return fieldDef;
        }
    }

    function _5w(encoding, repeater) {
        "use strict";

        return _5u(encoding, repeater);
    }

    function _5x(spec, parent, parentGivenName, repeatValues, config) {
        "use strict";

        var _this = _5k.call(this, spec, parent, parentGivenName, config) || this;

        _this.repeat = spec.repeat;
        _this.children = _this._initChildren(spec, _this.repeat, repeatValues, config);
        return _this;
    }

    function _5z(spec, repeat, repeater, config) {
        "use strict";

        var children = [];
        var row = repeat.row || [repeater ? repeater.row : null];
        var column = repeat.column || [repeater ? repeater.column : null]; // cross product

        for (var _i = 0, row_1 = row; _i < row_1.length; _i++) {
            var rowField = row_1[_i];

            for (var _a = 0, column_1 = column; _a < column_1.length; _a++) {
                var columnField = column_1[_a];
                var name_1 = (rowField ? '_' + rowField : '') + (columnField ? '_' + columnField : '');
                var childRepeat = {
                    row: rowField,
                    column: columnField
                };
                children.push(_5f.buildModel(spec.spec, this, this.getName('child' + name_1), _$0.undefined, childRepeat, config));
            }
        }

        return children;
    }

    function _5A() {
        "use strict";

        this.component.data = _5B.parseData(this);
        this.children.forEach(function (child) {
            child.parseData();
        });
    }

    function _5C(model) {
        "use strict";

        var root = _5D(model, model.component.data.sources);

        var outputNodes = model.component.data.outputNodes; // the current head of the tree that we are appending to

        var head = root;

        var parse = _5R.ParseNode.make(model);

        if (parse) {
            parse.parent = root;
            head = parse;
        } // HACK: This is equivalent for merging bin extent for union scale.
        // FIXME(https://github.com/vega/vega-lite/issues/2270): Correctly merge extent / bin node for shared bin scale


        var parentIsLayer = model.parent && model.parent instanceof _7j.LayerModel;

        if (model instanceof _cm.ModelWithField) {
            if (parentIsLayer) {
                var bin = _8I.BinNode.make(model);

                if (bin) {
                    bin.parent = head;
                    head = bin;
                }
            }
        }

        if (model.transforms.length > 0) {
            var _a = _81.parseTransformArray(model),
                first = _a.first,
                last = _a.last;

            first.parent = head;
            head = last;
        }

        if (model instanceof _cm.ModelWithField) {
            var nullFilter = _8c.NullFilterNode.make(model);

            if (nullFilter) {
                nullFilter.parent = head;
                head = nullFilter;
            }

            if (!parentIsLayer) {
                var bin = _8I.BinNode.make(model);

                if (bin) {
                    bin.parent = head;
                    head = bin;
                }
            }

            var tu = _bF.TimeUnitNode.make(model);

            if (tu) {
                tu.parent = head;
                head = tu;
            }
        } // add an output node pre aggregation


        var rawName = model.getName(_5I.RAW);
        var raw = new _bY.OutputNode(rawName, _5I.RAW);
        outputNodes[rawName] = raw;
        raw.parent = head;
        head = raw;

        if (model instanceof _8S.UnitModel) {
            var agg = _8k.AggregateNode.make(model);

            if (agg) {
                agg.parent = head;
                head = agg;
            }

            var stack = _bO.StackNode.make(model);

            if (stack) {
                stack.parent = head;
                head = stack;
            }

            var nonPosFilter = _8C.NonPositiveFilterNode.make(model);

            if (nonPosFilter) {
                nonPosFilter.parent = head;
                head = nonPosFilter;
            }
        }

        if (model instanceof _8S.UnitModel) {
            var order = _8w.OrderNode.make(model);

            if (order) {
                order.parent = head;
                head = order;
            }
        } // output node for marks


        var mainName = model.getName(_5I.MAIN);
        var main = new _bY.OutputNode(mainName, _5I.MAIN);
        outputNodes[mainName] = main;
        main.parent = head;
        head = main; // add facet marker

        var facetRoot = null;

        if (model instanceof _5h.FacetModel) {
            var facetName = model.getName('facet');
            facetRoot = new _7X.FacetNode(model, facetName, main.source);
            outputNodes[facetName] = facetRoot;
            facetRoot.parent = head;
            head = facetRoot;
        }

        return {
            sources: model.component.data.sources,
            outputNodes: outputNodes,
            main: main,
            facetRoot: facetRoot
        };
    }

    function _5D(model, sources) {
        "use strict";

        if (model.data || !model.parent) {
            // if the model defines a data source or is the root, create a source node
            var source = new _5E.SourceNode(model);
            var hash = source.hash();

            if (hash in sources) {
                // use a reference if we already have a source
                return sources[hash];
            } else {
                // otherwise add a new one
                sources[hash] = source;
                return source;
            }
        } else {
            // If we don't have a source defined (overriding parent's data), use the parent's facet root or main.
            return model.parent.component.data.facetRoot ? model.parent.component.data.facetRoot : model.parent.component.data.main;
        }
    }

    function _5F(model) {
        "use strict";

        var _this = _5G.call(this) || this;

        var data = model.data || {
            name: 'source'
        };

        if (_5I.isInlineData(data)) {
            _this._data = {
                values: data.values,
                format: {
                    type: 'json'
                }
            };
        } else if (_5I.isUrlData(data)) {
            // Extract extension from URL using snippet from
            // http://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript
            var defaultExtension = /(?:\.([^.]+))?$/.exec(data.url)[1];

            if (!_x.contains(['json', 'csv', 'tsv', 'topojson'], defaultExtension)) {
                defaultExtension = 'json';
            }

            var dataFormat = data.format || {}; // For backward compatibility for former `data.formatType` property

            var formatType = dataFormat.type || data['formatType'];
            var property = dataFormat.property,
                feature = dataFormat.feature,
                mesh = dataFormat.mesh;

            var format = _22.__assign({
                type: formatType ? formatType : defaultExtension
            }, property ? {
                property: property
            } : {}, feature ? {
                feature: feature
            } : {}, mesh ? {
                mesh: mesh
            } : {});

            _this._data = {
                url: data.url,
                format: format
            };
        } else if (_5I.isNamedData(data)) {
            _this._name = data.name;
            _this._data = {};
        }

        return _this;
    }

    function _5G(debugName) {
        "use strict";

        this.debugName = debugName;
        this._children = [];
        this._parent = null;
    }

    var _5H = _5G.prototype;

    function _5J(data) {
        "use strict";

        return !!data['url'];
    }

    function _5K(data) {
        "use strict";

        return !!data['values'];
    }

    function _5L(data) {
        "use strict";

        return !!data['name'];
    }

    function _5N() {
        "use strict";

        return !!this._name;
    }

    function _5O() {
        "use strict";

        throw new _$0.Error('Source nodes are roots and cannot be removed.');
    }

    function _5P() {
        "use strict";

        if (_5I.isInlineData(this._data)) {
            return _x.hash(this._data);
        } else if (_5I.isUrlData(this._data)) {
            return this._data.url + " " + _x.hash(this._data.format);
        } else {
            return this._name;
        }
    }

    function _5Q() {
        "use strict";

        return _22.__assign({
            name: this._name
        }, this._data, {
            transform: []
        });
    }

    function _5S(parse) {
        "use strict";

        var _this = _5G.call(this) || this;

        _this._parse = {};
        _this._parse = parse;
        return _this;
    }

    function _5U() {
        "use strict";

        return new _5S(_x.duplicate(this.parse));
    }

    function _5V(other) {
        "use strict";

        this._parse = _x.extend(this._parse, other.parse);
        other.remove();
    }

    function _5W() {
        "use strict";

        return this._parse;
    }

    function _5X() {
        "use strict";

        var _this = this;

        return _$0.Object.keys(this._parse).map(function (field) {
            var expr = _5Y(field, _this._parse[field]);

            if (!expr) {
                return null;
            }

            var formula = {
                type: 'formula',
                expr: expr,
                as: field
            };
            return formula;
        }).filter(function (t) {
            return t !== null;
        });
    }

    function _5Y(field, parse) {
        "use strict";

        var f = "datum[" + _x.stringValue(field) + "]";

        if (parse === 'number') {
            return "toNumber(" + f + ")";
        } else if (parse === 'boolean') {
            return "toBoolean(" + f + ")";
        } else if (parse === 'string') {
            return "toString(" + f + ")";
        } else if (parse === 'date') {
            return "toDate(" + f + ")";
        } else if (parse.indexOf('date:') === 0) {
            var specifier = parse.slice(6, parse.length - 1); // specifier is in "" or ''

            return "timeParse(" + f + ",\"" + specifier + "\")";
        } else {
            _2m.warn(_2m.message.unrecognizedParse(parse));

            return null;
        }
    }

    function _5Z(model) {
        "use strict";

        var parse = {};
        var calcFieldMap = model.transforms.filter(_60.isCalculate).reduce(function (fieldMap, formula) {
            fieldMap[formula.as] = true;
            return fieldMap;
        }, {}); // Parse filter fields

        model.transforms.filter(_60.isFilter).forEach(function (transform) {
            var filter = transform.filter;
            var val = null; // For EqualFilter, just use the equal property.
            // For RangeFilter and OneOfFilter, all array members should have
            // the same type, so we only use the first one.

            if (_63.isEqualFilter(filter)) {
                val = filter.equal;
            } else if (_63.isRangeFilter(filter)) {
                val = filter.range[0];
            } else if (_63.isOneOfFilter(filter)) {
                val = (filter.oneOf || filter['in'])[0];
            } // else -- for filter expression, we can't infer anything


            if (val) {
                if (_36.isDateTime(val)) {
                    parse[filter['field']] = 'date';
                } else if (_x.isNumber(val)) {
                    parse[filter['field']] = 'number';
                } else if (_x.isString(val)) {
                    parse[filter['field']] = 'string';
                }
            }
        });

        if (model instanceof _cm.ModelWithField) {
            // Parse encoded fields
            model.forEachFieldDef(function (fieldDef) {
                if (fieldDef.type === _3o.TEMPORAL) {
                    parse[fieldDef.field] = 'date';
                } else if (fieldDef.type === _3o.QUANTITATIVE) {
                    if (_23.isCount(fieldDef) || calcFieldMap[fieldDef.field]) {
                        return;
                    }

                    parse[fieldDef.field] = 'number';
                }
            });
        } // Custom parse should override inferred parse


        var data = model.data;

        if (data && data.format && data.format.parse) {
            var p_1 = data.format.parse;

            _x.keys(p_1).forEach(function (field) {
                parse[field] = p_1[field];
            });
        }

        if (_x.keys(parse).length === 0) {
            return null;
        }

        return new _5S(parse);
    }

    function _61(t) {
        "use strict";

        return t['filter'] !== _$0.undefined;
    }

    function _62(t) {
        "use strict";

        return t['calculate'] !== _$0.undefined;
    }

    function _64(filter) {
        "use strict";

        return filter && filter['selection'];
    }

    function _65(filter) {
        "use strict";

        return filter && !!filter.field && filter.equal !== _$0.undefined;
    }

    function _66(filter) {
        "use strict";

        if (filter && filter.field) {
            if (_x.isArray(filter.range) && filter.range.length === 2) {
                return true;
            }
        }

        return false;
    }

    function _67(filter) {
        "use strict";

        return filter && !!filter.field && (_x.isArray(filter.oneOf) || _x.isArray(filter.in) // backward compatibility
        );
    }

    function _68(model, filter) {
        "use strict";

        if (_x.isString(filter)) {
            return filter;
        } else if (_64(filter)) {
            var selection = model.getComponent('selection', filter.selection);
            return _69.predicate(filter.selection, selection.type, selection.resolve, null, null);
        } else {
            var fieldExpr = filter.timeUnit ? // For timeUnit, cast into integer with time() so we can use ===, inrange, indexOf to compare values directly.
            // TODO: We calculate timeUnit on the fly here. Consider if we would like to consolidate this with timeUnit pipeline
            // TODO: support utc
            'time(' + _2a.fieldExpr(filter.timeUnit, filter.field) + ')' : _23.field(filter, {
                expr: 'datum'
            });

            if (_65(filter)) {
                return fieldExpr + '===' + _cl(filter.equal, filter.timeUnit);
            } else if (_67(filter)) {
                // "oneOf" was formerly "in" -- so we need to add backward compatibility
                var oneOf = filter.oneOf || filter['in'];
                return 'indexof([' + oneOf.map(function (v) {
                    return _cl(v, filter.timeUnit);
                }).join(',') + '], ' + fieldExpr + ') !== -1';
            } else if (_66(filter)) {
                var lower = filter.range[0];
                var upper = filter.range[1];

                if (lower !== null && upper !== null) {
                    return 'inrange(' + fieldExpr + ', ' + _cl(lower, filter.timeUnit) + ', ' + _cl(upper, filter.timeUnit) + ')';
                } else if (lower !== null) {
                    return fieldExpr + ' >= ' + lower;
                } else if (upper !== null) {
                    return fieldExpr + ' <= ' + upper;
                }
            }
        }

        return _$0.undefined;
    }

    function _6a(model, selDefs) {
        "use strict";

        var selCmpts = {},
            selectionConfig = model.config.selection;

        var _loop_1 = function (name_1) {
            if (!selDefs.hasOwnProperty(name_1)) {
                return "continue";
            }

            var selDef = selDefs[name_1],
                cfg = selectionConfig[selDef.type]; // Set default values from config if a property hasn't been specified,
            // or if it is true. E.g., "translate": true should use the default
            // event handlers for translate. However, true may be a valid value for
            // a property (e.g., "nearest": true).

            for (var key in cfg) {
                // A selection should contain either `encodings` or `fields`, only use
                // default values for these two values if neither of them is specified.
                if (key === 'encodings' && selDef.fields || key === 'fields' && selDef.encodings) {
                    continue;
                }

                if (selDef[key] === _$0.undefined || selDef[key] === true) {
                    selDef[key] = cfg[key] || selDef[key];
                }
            }

            var selCmpt = selCmpts[name_1] = _x.extend({}, selDef, {
                name: name_1,
                events: _x.isString(selDef.on) ? _6b.selector(selDef.on, 'scope') : selDef.on,
                domain: 'data'
            });

            _6m.forEachTransform(selCmpt, function (txCompiler) {
                if (txCompiler.parse) {
                    txCompiler.parse(model, selDef, selCmpt);
                }
            });
        };

        for (var name_1 in selDefs) {
            _loop_1(name_1);
        }

        return selCmpts;
    }

    function _6c(selector, source, marks) {
        "use strict";

        $2 = source || "view";
        $3 = marks || _6d;
        return _6e(selector.trim()).map(_6g);
    }

    function _6e(s) {
        "use strict";

        var output = [],
            start = 0,
            n = s.length,
            i = 0;

        while (i < n) {
            i = _6f(s, i, ",", "[" + "{", "]" + "}");
            output.push(s.substring(start, i).trim());
            start = ++i;
        }

        if (output.length === 0) {
            throw 'Empty event selector: ' + s;
        }

        return output;
    }

    function _6f(s, i, endChar, pushChar, popChar) {
        "use strict";

        var count = 0,
            n = s.length,
            c;

        for (; i < n; ++i) {
            c = s[i];
            if (!count && c === endChar) return i;else if (popChar && popChar.indexOf(c) >= 0) --count;else if (pushChar && pushChar.indexOf(c) >= 0) ++count;
        }

        return i;
    }

    function _6g(s) {
        "use strict";

        return s[0] === '[' ? _6h(s) : _6i(s);
    }

    function _6h(s) {
        "use strict";

        var n = s.length,
            i = 1,
            b,
            stream;
        i = _6f(s, i, "]", "[", "]");

        if (i === n) {
            throw 'Empty between selector: ' + s;
        }

        b = _6e(s.substring(1, i));

        if (b.length !== 2) {
            throw 'Between selector must have two elements: ' + s;
        }

        s = s.slice(i + 1).trim();

        if (s[0] !== ">") {
            throw 'Expected \'>\' after between selector: ' + s;
        }

        b = b.map(_6g);
        stream = _6g(s.slice(1).trim());

        if (stream.between) {
            return {
                between: b,
                stream: stream
            };
        } else {
            stream.between = b;
        }

        return stream;
    }

    function _6i(s) {
        "use strict";

        var stream = {
            source: $2
        },
            source = [],
            throttle = [0, 0],
            markname = 0,
            start = 0,
            n = s.length,
            i = 0,
            j,
            filter; // extract throttle from end

        if (s[n - 1] === "}") {
            i = s.lastIndexOf("{");

            if (i >= 0) {
                try {
                    throttle = _6j(s.substring(i + 1, n - 1));
                } catch (e) {
                    throw 'Invalid throttle specification: ' + s;
                }

                s = s.slice(0, i).trim();
                n = s.length;
            } else throw 'Unmatched right brace: ' + s;

            i = 0;
        }

        if (!n) throw s; // set name flag based on first char

        if (s[0] === "@") markname = ++i; // extract first part of multi-part stream selector

        j = _6f(s, i, ":");

        if (j < n) {
            source.push(s.substring(start, j).trim());
            start = i = ++j;
        } // extract remaining part of stream selector


        i = _6f(s, i, "[");

        if (i === n) {
            source.push(s.substring(start, n).trim());
        } else {
            source.push(s.substring(start, i).trim());
            filter = [];
            start = ++i;
            if (start === n) throw 'Unmatched left bracket: ' + s;
        } // extract filters


        while (i < n) {
            i = _6f(s, i, "]");
            if (i === n) throw 'Unmatched left bracket: ' + s;
            filter.push(s.substring(start, i).trim());
            if (i < n - 1 && s[++i] !== "[") throw 'Expected left bracket: ' + s;
            start = ++i;
        } // marshall event stream specification


        if (!(n = source.length) || _6k.test(source[n - 1])) {
            throw 'Invalid event selector: ' + s;
        }

        if (n > 1) {
            stream.type = source[1];

            if (markname) {
                stream.markname = source[0].slice(1);
            } else if (_6l(source[0])) {
                stream.marktype = source[0];
            } else {
                stream.source = source[0];
            }
        } else {
            stream.type = source[0];
        }

        if (stream.type.slice(-1) === '!') {
            stream.consume = true;
            stream.type = stream.type.slice(0, -1);
        }

        if (filter != null) stream.filter = filter;
        if (throttle[0]) stream.throttle = throttle[0];
        if (throttle[1]) stream.debounce = throttle[1];
        return stream;
    }

    function _6j(s) {
        "use strict";

        var a = s.split(",");
        if (!s.length || a.length > 2) throw s;
        return a.map(function (_) {
            var x = +_;
            if (x !== x) throw s;
            return x;
        });
    }

    function _6l(type) {
        "use strict";

        return $3.hasOwnProperty(type);
    }

    function _6n(selCmpt, cb) {
        "use strict";

        for (var t in _6o) {
            if (_6o[t].has(selCmpt)) {
                cb(_6o[t]);
            }
        }
    }

    function _6q(selDef) {
        "use strict";

        return selDef.fields !== _$0.undefined || selDef.encodings !== _$0.undefined;
    }

    function _6r(model, selDef, selCmpt) {
        "use strict";

        var fields = {}; // TODO: find a possible channel mapping for these fields.

        (selDef.fields || []).forEach(function (f) {
            return fields[f] = null;
        });
        (selDef.encodings || []).forEach(function (c) {
            return fields[model.fieldDef(c).field] = c;
        });
        var projection = selCmpt.project || (selCmpt.project = []);

        for (var field in fields) {
            if (fields.hasOwnProperty(field)) {
                projection.push({
                    field: field,
                    encoding: fields[field]
                });
            }
        }

        fields = selCmpt.fields || (selCmpt.fields = {});
        projection.filter(function (p) {
            return p.encoding;
        }).forEach(function (p) {
            return fields[p.encoding] = p.field;
        });
    }

    function _6t(selCmpt) {
        "use strict";

        return selCmpt.toggle !== _$0.undefined && selCmpt.toggle !== false;
    }

    function _6u(model, selCmpt, signals) {
        "use strict";

        return signals.concat({
            name: selCmpt.name + "_toggle",
            value: false,
            on: [{
                events: selCmpt.events,
                update: selCmpt.toggle
            }]
        });
    }

    function _6v(model, selCmpt, expr) {
        "use strict";

        var tpl = selCmpt.name + _69.TUPLE,
            signal = selCmpt.name + "_toggle";
        return signal + " ? null : " + tpl + ", " + (selCmpt.resolve === 'global' ? signal + " ? null : true, " : signal + " ? null : {unit: " + tpl + ".unit}, ") + (signal + " ? " + tpl + " : null");
    }

    function _6x(selCmpt) {
        "use strict";

        return selCmpt.type === 'interval' && selCmpt.resolve === 'global' && selCmpt.bind && selCmpt.bind === 'scales';
    }

    function _6y(model, selDef, selCmpt) {
        "use strict";

        var bound = selCmpt.scales = [];
        selCmpt.project.forEach(function (p) {
            var channel = p.encoding;
            var scale = model.getComponent('scales', channel);

            if (!scale || !_4M.hasContinuousDomain(scale.type)) {
                _2m.warn('Scale bindings are currently only supported for scales with continuous domains.');

                return;
            }

            scale.domainRaw = {
                signal: _69.channelSignalName(selCmpt, channel)
            };
            bound.push(channel);
        });
    }

    function _6z(model, selCmpt, signals) {
        "use strict";

        var channels = selCmpt.scales.filter(function (channel) {
            return !signals.filter(function (s) {
                return s.name === _69.channelSignalName(selCmpt, channel);
            }).length;
        });
        return signals.concat(channels.map(function (channel) {
            return {
                name: _69.channelSignalName(selCmpt, channel)
            };
        }));
    }

    function _6A(model, selCmpt, signals) {
        "use strict";

        var name = selCmpt.name;
        signals = signals.filter(function (s) {
            return s.name !== name + _6B.SIZE && s.name !== name + _69.TUPLE && s.name !== _69.MODIFY;
        });
        selCmpt.scales.forEach(function (channel) {
            var signal = signals.filter(function (s) {
                return s.name === _69.channelSignalName(selCmpt, channel);
            })[0];
            signal.push = 'outer';
            delete signal.value;
            delete signal.update;
        });
        return signals;
    }

    function _6D(model, selCmpt) {
        "use strict";

        var signals = [],
            intervals = [],
            name = selCmpt.name,
            size = name + _6B.SIZE;

        if (selCmpt.translate && !_6E.default.has(selCmpt)) {
            _6G(selCmpt, function (_, evt) {
                var filters = evt.between[0].filter || (evt.between[0].filter = []);
                filters.push('!event.item || (event.item && ' + ("event.item.mark.name !== " + _x.stringValue(name + _6B.BRUSH) + ")"));
            });
        }

        selCmpt.project.forEach(function (p) {
            if (p.encoding !== _1F.X && p.encoding !== _1F.Y) {
                _2m.warn('Interval selections only support x and y encoding channels.');

                return;
            }

            var cs = _6H(model, selCmpt, p.encoding);

            signals.push(cs);
            intervals.push("{encoding: " + _x.stringValue(p.encoding) + ", " + ("field: " + _x.stringValue(p.field) + ", extent: " + cs.name + "}"));
        });
        signals.push({
            name: size,
            value: [],
            on: _6G(selCmpt, function (on, evt) {
                on.push({
                    events: evt.between[0],
                    update: '{x: x(unit), y: y(unit), width: 0, height: 0}'
                });
                on.push({
                    events: evt,
                    update: "{x: " + size + ".x, y: " + size + ".y, " + ("width: abs(x(unit) - " + size + ".x), height: abs(y(unit) - " + size + ".y)}")
                });
                return on;
            })
        }, {
            name: name,
            update: "[" + intervals.join(', ') + "]"
        });
        return signals;
    }

    function _6F(model, channel) {
        "use strict";

        var scale = _x.stringValue(model.scaleName(channel));

        return "domain(" + scale + ")";
    }

    function _6G(selCmpt, cb) {
        "use strict";

        return selCmpt.events.reduce(function (on, evt) {
            if (!evt.between) {
                _2m.warn(evt + " is not an ordered event stream for interval selections");

                return on;
            }

            return cb(on, evt);
        }, []);
    }

    function _6H(model, selCmpt, channel) {
        "use strict";

        var name = _69.channelSignalName(selCmpt, channel),
            size = model.getSizeSignalRef(channel === _1F.X ? 'width' : 'height').signal,
            coord = channel + "(unit)",
            invert = _69.invert.bind(null, model, selCmpt, channel);

        return {
            name: name,
            value: [],
            on: _6E.default.has(selCmpt) ? [] : _6G(selCmpt, function (on, evt) {
                on.push({
                    events: evt.between[0],
                    update: invert("[" + coord + ", " + coord + "]")
                });
                on.push({
                    events: evt,
                    update: "[" + name + "[0], " + invert("clamp(" + coord + ", 0, " + size + ")") + ']'
                });
                return on;
            })
        };
    }

    function _6I(model, selCmpt) {
        "use strict";

        return "intervals: " + selCmpt.name;
    }

    function _6J(model, selCmpt) {
        "use strict";

        var tpl = selCmpt.name + _69.TUPLE;
        return tpl + ', ' + (selCmpt.resolve === 'global' ? 'true' : "{unit: " + tpl + ".unit}");
    }

    function _6K(model, selCmpt, marks) {
        "use strict";

        var name = selCmpt.name,
            _a = _6L(selCmpt),
            xi = _a.xi,
            yi = _a.yi,
            tpl = name + _69.TUPLE,
            store = "data(" + _x.stringValue(selCmpt.name + _69.STORE) + ")"; // Do not add a brush if we're binding to scales.


        if (_6E.default.has(selCmpt)) {
            return marks;
        }

        var update = {
            x: _x.extend({}, xi !== null ? {
                scale: model.scaleName(_1F.X),
                signal: name + "[" + xi + "].extent[0]"
            } : {
                value: 0
            }),
            x2: _x.extend({}, xi !== null ? {
                scale: model.scaleName(_1F.X),
                signal: name + "[" + xi + "].extent[1]"
            } : {
                field: {
                    group: 'width'
                }
            }),
            y: _x.extend({}, yi !== null ? {
                scale: model.scaleName(_1F.Y),
                signal: name + "[" + yi + "].extent[0]"
            } : {
                value: 0
            }),
            y2: _x.extend({}, yi !== null ? {
                scale: model.scaleName(_1F.Y),
                signal: name + "[" + yi + "].extent[1]"
            } : {
                field: {
                    group: 'height'
                }
            })
        }; // If the selection is resolved to global, only a single interval is in
        // the store. Wrap brush mark's encodings with a production rule to test
        // this based on the `unit` property. Hide the brush mark if it corresponds
        // to a unit different from the one in the store.

        if (selCmpt.resolve === 'global') {
            _x.keys(update).forEach(function (key) {
                update[key] = [_22.__assign({
                    test: store + ".length && " + tpl + " && " + tpl + ".unit === " + store + "[0].unit"
                }, update[key]), {
                    value: 0
                }];
            });
        }

        return [{
            name: _$0.undefined,
            type: 'rect',
            encode: {
                enter: {
                    fill: {
                        value: '#eee'
                    }
                },
                update: update
            }
        }].concat(marks, {
            name: name + _6B.BRUSH,
            type: 'rect',
            encode: {
                enter: {
                    fill: {
                        value: 'transparent'
                    }
                },
                update: update
            }
        });
    }

    function _6L(selCmpt) {
        "use strict";

        var x = null,
            xi = null,
            y = null,
            yi = null;
        selCmpt.project.forEach(function (p, i) {
            if (p.encoding === _1F.X) {
                x = p;
                xi = i;
            } else if (p.encoding === _1F.Y) {
                y = p;
                yi = i;
            }
        });
        return {
            x: x,
            xi: xi,
            y: y,
            yi: yi
        };
    }

    function _6N(selCmpt) {
        "use strict";

        return selCmpt.type === 'interval' && selCmpt.translate !== _$0.undefined && selCmpt.translate !== false;
    }

    function _6O(model, selCmpt, signals) {
        "use strict";

        var name = selCmpt.name,
            scales = _6E.default.has(selCmpt),
            size = scales ? 'unit' : name + _6B.SIZE,
            anchor = name + "_translate_anchor",
            _a = _6B.projections(selCmpt),
            x = _a.x,
            y = _a.y;

        var events = _6b.selector(selCmpt.translate, 'scope');

        if (!scales) {
            events = events.map(function (e) {
                return e.between[0].markname = name + _6B.BRUSH, e;
            });
        }

        signals.push({
            name: anchor,
            value: {},
            on: [{
                events: events.map(function (e) {
                    return e.between[0];
                }),
                update: '{x: x(unit), y: y(unit), ' + ("width: " + size + ".width, height: " + size + ".height, ") + (x !== null ? 'extent_x: ' + (scales ? _6E.domain(model, _1F.X) : "slice(" + name + "_" + x.field + ")") + ', ' : '') + (y !== null ? 'extent_y: ' + (scales ? _6E.domain(model, _1F.Y) : "slice(" + name + "_" + y.field + ")") + ', ' : '') + '}'
            }]
        }, {
            name: name + "_translate_delta",
            value: {},
            on: [{
                events: events,
                update: "{x: x(unit) - " + anchor + ".x, y: y(unit) - " + anchor + ".y}"
            }]
        });

        if (x !== null) {
            _6P(model, selCmpt, _1F.X, 'width', signals);
        }

        if (y !== null) {
            _6P(model, selCmpt, _1F.Y, 'height', signals);
        }

        return signals;
    }

    function _6P(model, selCmpt, channel, size, signals) {
        "use strict";

        var name = selCmpt.name,
            signal = signals.filter(function (s) {
            return s.name === _69.channelSignalName(selCmpt, channel);
        })[0],
            anchor = name + "_translate_anchor",
            delta = name + "_translate_delta",
            scale = _x.stringValue(model.scaleName(channel)),
            extent = ".extent_" + channel,
            sign = _6Q(selCmpt, channel),
            offset = sign + " abs(span(" + anchor + extent + ")) * " + (delta + "." + channel + " / " + anchor + "." + size),
            range = "[" + anchor + extent + "[0] " + offset + ", " + ("" + anchor + extent + "[1] " + offset + "]"),
            lo = "invert(" + scale + (channel === _1F.X ? ', 0' : ", unit." + size) + ')',
            hi = "invert(" + scale + (channel === _1F.X ? ", unit." + size : ', 0') + ')';

        signal.on.push({
            events: {
                signal: delta
            },
            update: _6E.default.has(selCmpt) ? range : "clampRange(" + range + ", " + lo + ", " + hi + ")"
        });
    }

    function _6Q(selCmpt, channel) {
        "use strict";

        var s = channel === _1F.X ? '+' : '-';

        if (_6E.default.has(selCmpt)) {
            s = s === '+' ? '-' : '+';
        }

        return s;
    }

    function _6S(selCmpt) {
        "use strict";

        return selCmpt.type === 'interval' && selCmpt.zoom !== _$0.undefined && selCmpt.zoom !== false;
    }

    function _6T(model, selCmpt, signals) {
        "use strict";

        var name = selCmpt.name,
            delta = name + "_zoom_delta",
            _a = _6B.projections(selCmpt),
            x = _a.x,
            y = _a.y,
            sx = _x.stringValue(model.scaleName(_1F.X)),
            sy = _x.stringValue(model.scaleName(_1F.Y));

        var events = _6b.selector(selCmpt.zoom, 'scope');

        if (!_6E.default.has(selCmpt)) {
            events = events.map(function (e) {
                return e.markname = name + _6B.BRUSH, e;
            });
        }

        signals.push({
            name: name + "_zoom_anchor",
            on: [{
                events: events,
                update: "{x: invert(" + sx + ", x(unit)), y: invert(" + sy + ", y(unit))}"
            }]
        }, {
            name: delta,
            on: [{
                events: events,
                force: true,
                update: 'pow(1.001, event.deltaY * pow(16, event.deltaMode))'
            }]
        });

        if (x !== null) {
            _6U(model, selCmpt, 'x', 'width', signals);
        }

        if (y !== null) {
            _6U(model, selCmpt, 'y', 'height', signals);
        }

        var size = signals.filter(function (s) {
            return s.name === name + _6B.SIZE;
        });

        if (size.length) {
            var sname = size[0].name;
            size[0].on.push({
                events: {
                    signal: delta
                },
                update: "{x: " + sname + ".x, y: " + sname + ".y, " + ("width: " + sname + ".width * " + delta + " , ") + ("height: " + sname + ".height * " + delta + "}")
            });
        }

        return signals;
    }

    function _6U(model, selCmpt, channel, size, signals) {
        "use strict";

        var name = selCmpt.name,
            signal = signals.filter(function (s) {
            return s.name === _69.channelSignalName(selCmpt, channel);
        })[0],
            scales = _6E.default.has(selCmpt),
            base = scales ? _6E.domain(model, channel) : signal.name,
            anchor = "" + name + "_zoom_anchor" + "." + channel,
            delta = name + "_zoom_delta",
            scale = _x.stringValue(model.scaleName(channel)),
            range = "[" + anchor + " + (" + base + "[0] - " + anchor + ") * " + delta + ", " + (anchor + " + (" + base + "[1] - " + anchor + ") * " + delta + "]"),
            lo = "invert(" + scale + (channel === _1F.X ? ', 0' : ", unit." + size) + ')',
            hi = "invert(" + scale + (channel === _1F.X ? ", unit." + size : ', 0') + ')';

        signal.on.push({
            events: {
                signal: delta
            },
            update: scales ? range : "clampRange(" + range + ", " + lo + ", " + hi + ")"
        });
    }

    function _6W(selCmpt) {
        "use strict";

        return selCmpt.type === 'single' && selCmpt.resolve === 'global' && selCmpt.bind && selCmpt.bind !== 'scales';
    }

    function _6X(model, selCmpt, signals) {
        "use strict";

        var name = selCmpt.name,
            proj = selCmpt.project,
            bind = selCmpt.bind,
            datum = '(item().isVoronoi ? datum.datum : datum)';
        proj.forEach(function (p) {
            signals.unshift({
                name: name + _6Y(p.field),
                value: '',
                on: [{
                    events: selCmpt.events,
                    update: datum + "[" + _x.stringValue(p.field) + "]"
                }],
                bind: bind[p.field] || bind[p.encoding] || bind
            });
        });
        return signals;
    }

    function _6Y(str) {
        "use strict";

        return '_' + str.replace(/\W/g, '_');
    }

    function _6Z(model, selCmpt, signals) {
        "use strict";

        var name = selCmpt.name,
            proj = selCmpt.project,
            signal = signals.filter(function (s) {
            return s.name === name;
        })[0],
            fields = proj.map(function (p) {
            return _x.stringValue(p.field);
        }).join(', '),
            values = proj.map(function (p) {
            return name + _6Y(p.field);
        }).join(', ');
        signal.update = "{fields: [" + fields + "], values: [" + values + "]}";
        delete signal.value;
        delete signal.on;
        return signals;
    }

    function _71(selCmpt) {
        "use strict";

        return selCmpt.nearest !== _$0.undefined && selCmpt.nearest !== false;
    }

    function _72(model, selCmpt, marks, selMarks) {
        "use strict";

        var mark = marks[0],
            index = selMarks.indexOf(mark),
            isPathgroup = mark.name === model.getName('pathgroup'),
            exists = function (m) {
            return m.name && m.name.indexOf("voronoi") >= 0;
        },
            cellDef = {
            name: model.getName("voronoi"),
            type: 'path',
            from: {
                data: model.getName('marks')
            },
            encode: {
                enter: {
                    fill: {
                        value: 'transparent'
                    },
                    strokeWidth: {
                        value: 0.35
                    },
                    stroke: {
                        value: 'transparent'
                    },
                    isVoronoi: {
                        value: true
                    }
                }
            },
            transform: [{
                type: 'voronoi',
                x: 'datum.x',
                y: 'datum.y',
                size: [model.getSizeSignalRef('width'), model.getSizeSignalRef('height')]
            }]
        };

        if (isPathgroup && !mark.marks.filter(exists).length) {
            mark.marks.push(cellDef);
            selMarks.splice(index, 1, mark);
        } else if (!isPathgroup && !selMarks.filter(exists).length) {
            selMarks.splice(index + 1, 0, cellDef);
        }

        return selMarks;
    }

    function _73(model, signals) {
        "use strict";

        _74(model, function (selCmpt, selCompiler) {
            var name = selCmpt.name,
                tupleExpr = selCompiler.tupleExpr(model, selCmpt);
            var modifyExpr = selCompiler.modifyExpr(model, selCmpt);
            signals.push.apply(signals, selCompiler.signals(model, selCmpt));

            _6m.forEachTransform(selCmpt, function (txCompiler) {
                if (txCompiler.signals) {
                    signals = txCompiler.signals(model, selCmpt, signals);
                }

                if (txCompiler.modifyExpr) {
                    modifyExpr = txCompiler.modifyExpr(model, selCmpt, modifyExpr);
                }
            });

            signals.push({
                name: name + _69.TUPLE,
                on: [{
                    events: {
                        signal: name
                    },
                    update: "{unit: unit.datum && unit.datum._id, " + tupleExpr + "}"
                }]
            }, {
                name: name + _69.MODIFY,
                on: [{
                    events: {
                        signal: name
                    },
                    update: "modify(" + _x.stringValue(selCmpt.name + _69.STORE) + ", " + modifyExpr + ")"
                }]
            });
        });

        return signals;
    }

    function _74(model, cb) {
        "use strict";

        var selections = model.component.selection;

        for (var name_2 in selections) {
            if (selections.hasOwnProperty(name_2)) {
                var sel = selections[name_2];
                cb(sel, _75(sel.type));
            }
        }
    }

    function _75(type) {
        "use strict";

        switch (type) {
            case 'single':
                return _76.default;

            case 'multi':
                return _7c.default;

            case 'interval':
                return _6B.default;
        }

        return null;
    }

    function _78(model, selCmpt) {
        "use strict";

        var proj = selCmpt.project,
            datum = '(item().isVoronoi ? datum.datum : datum)',
            encodings = proj.map(function (p) {
            return _x.stringValue(p.encoding);
        }).join(', '),
            fields = proj.map(function (p) {
            return _x.stringValue(p.field);
        }).join(', '),
            values = proj.map(function (p) {
            return datum + "[" + _x.stringValue(p.field) + "]";
        }).join(', ');
        return [{
            name: selCmpt.name,
            value: {},
            on: [{
                events: selCmpt.events,
                update: "{encodings: [" + encodings + "], fields: [" + fields + "], values: [" + values + "]}"
            }]
        }];
    }

    function _79(model, selCmpt) {
        "use strict";

        return [{
            name: selCmpt.name,
            update: "data(" + _x.stringValue(selCmpt.name + _69.STORE) + ")[0]"
        }];
    }

    function _7a(model, selCmpt) {
        "use strict";

        var name = selCmpt.name,
            values = name + ".values";
        return "encodings: " + name + ".encodings, fields: " + name + ".fields, " + ("values: " + values + ", ") + selCmpt.project.map(function (p, i) {
            return p.field + ": " + values + "[" + i + "]";
        }).join(', ');
    }

    function _7b(model, selCmpt) {
        "use strict";

        var tpl = selCmpt.name + _69.TUPLE;
        return tpl + ', ' + (selCmpt.resolve === 'global' ? 'true' : "{unit: " + tpl + ".unit}");
    }

    function _7e(model, selCmpt) {
        "use strict";

        var name = selCmpt.name;
        return "encodings: " + name + ".encodings, fields: " + name + ".fields, values: " + name + ".values";
    }

    function _7f(model, selCmpt) {
        "use strict";

        var tpl = selCmpt.name + _69.TUPLE;
        return tpl + ', ' + (selCmpt.resolve === 'global' ? 'null' : "{unit: " + tpl + ".unit}");
    }

    function _7g(model, signals) {
        "use strict";

        var hasUnit = signals.filter(function (s) {
            return s.name === 'unit';
        });

        if (!hasUnit.length) {
            signals.push({
                name: 'unit',
                value: {},
                on: [{
                    events: 'mousemove',
                    update: 'group()._id ? group() : unit'
                }]
            });
        }

        _74(model, function (selCmpt, selCompiler) {
            if (selCompiler.topLevelSignals) {
                signals.push.apply(signals, selCompiler.topLevelSignals(model, selCmpt));
            }

            _6m.forEachTransform(selCmpt, function (txCompiler) {
                if (txCompiler.topLevelSignals) {
                    signals = txCompiler.topLevelSignals(model, selCmpt, signals);
                }
            });
        });

        return signals;
    }

    function _7h(model, data) {
        "use strict";

        _74(model, function (selCmpt) {
            var contains = data.filter(function (d) {
                return d.name === selCmpt.name + _69.STORE;
            });

            if (!contains.length) {
                data.push({
                    name: selCmpt.name + _69.STORE
                });
            }
        });

        return data;
    }

    function _7i(model, marks) {
        "use strict";

        var clipGroup = false,
            selMarks = marks;

        _74(model, function (selCmpt, selCompiler) {
            selMarks = selCompiler.marks ? selCompiler.marks(model, selCmpt, selMarks) : selMarks;

            _6m.forEachTransform(selCmpt, function (txCompiler) {
                clipGroup = clipGroup || txCompiler.clipGroup;

                if (txCompiler.marks) {
                    selMarks = txCompiler.marks(model, selCmpt, marks, selMarks);
                }
            });
        }); // In a layered spec, we want to clip all layers together rather than
        // only the layer within which the selection is defined. Propagate
        // our assembled state up and let the LayerModel make the right call.


        if (model.parent && model.parent instanceof _7j.LayerModel) {
            return [selMarks, _cf];
        } else {
            return clipGroup ? _cf(selMarks) : selMarks;
        }
    }

    function _7k(spec, parent, parentGivenName, parentUnitSize, repeater, config) {
        "use strict";

        var _this = _5k.call(this, spec, parent, parentGivenName, config) || this;

        _this.resolve = _7l.initLayerResolve(spec.resolve || {});

        var unitSize = _22.__assign({}, parentUnitSize, spec.width ? {
            width: spec.width
        } : {}, spec.height ? {
            height: spec.height
        } : {});

        _this.children = spec.layer.map(function (layer, i) {
            // FIXME: this is not always the case
            // we know that the model has to be a unit model because we pass in a unit spec
            return _5f.buildModel(layer, _this, _this.getName('layer_' + i), unitSize, repeater, config);
        });
        return _this;
    }

    function _7m(resolve) {
        "use strict";

        var out = {};

        _1F.UNIT_SCALE_CHANNELS.forEach(function (channel) {
            var res = resolve[channel] || {
                scale: 'shared'
            };
            var guide = _x.contains(_1F.SPATIAL_SCALE_CHANNELS, channel) ? 'axis' : 'legend';

            if (res.scale === 'independent' && (res['axis'] === 'shared' || res['legend'] === 'shared')) {
                _2m.warn(_2m.message.independentScaleMeansIndependentGuide(channel));
            }

            out[channel] = (_a = {
                scale: res.scale || 'shared'
            }, _a[guide] = res.scale === 'independent' ? 'independent' : res[guide] || 'shared', _a);

            var _a;
        });

        return out;
    }

    function _7o() {
        "use strict";

        this.component.data = _5B.parseData(this);

        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.parseData();
        }
    }

    function _7p() {
        "use strict";

        var _this = this; // Merge selections up the hierarchy so that they may be referenced
        // across unit specs. Persist their definitions within each child
        // to assemble signals which remain within output Vega unit groups.


        this.component.selection = {};

        var _loop_1 = function (child) {
            child.parseSelection();

            _x.keys(child.component.selection).forEach(function (key) {
                _this.component.selection[key] = child.component.selection[key];
            });
        };

        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];

            _loop_1(child);
        }
    }

    function _7q() {
        "use strict";

        var _this = this;

        var model = this;
        var scaleComponent = this.component.scales = {};

        var _loop_2 = function (child) {
            child.parseScale(); // Check whether the scales are actually compatible, e.g. use the same sort or throw error

            _x.keys(child.component.scales).forEach(function (channel) {
                if (_this.resolve[channel].scale === 'shared') {
                    var childScale = child.component.scales[channel];
                    var modelScale = scaleComponent[channel];

                    if (!childScale || _7r.isSignalRefDomain(childScale.domain) || modelScale && _7r.isSignalRefDomain(modelScale.domain)) {
                        // TODO: merge signal ref domains
                        return;
                    }

                    if (modelScale) {
                        modelScale.domain = _7w.unionDomains(modelScale.domain, childScale.domain);
                    } else {
                        scaleComponent[channel] = childScale;
                    } // rename child scale to parent scales


                    var scaleNameWithoutPrefix = childScale.name.substr(child.getName('').length);
                    var newName = model.scaleName(scaleNameWithoutPrefix, true);
                    child.renameScale(childScale.name, newName);
                    childScale.name = newName; // remove merged scales from children

                    delete child.component.scales[channel];
                }
            });
        };

        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];

            _loop_2(child);
        }
    }

    function _7s(domain) {
        "use strict";

        if (!_x.isArray(domain)) {
            return 'fields' in domain && !('data' in domain);
        }

        return false;
    }

    function _7t(domain) {
        "use strict";

        if (!_x.isArray(domain)) {
            return 'fields' in domain && 'data' in domain;
        }

        return false;
    }

    function _7u(domain) {
        "use strict";

        if (!_x.isArray(domain)) {
            return 'field' in domain && 'data' in domain;
        }

        return false;
    }

    function _7v(domain) {
        "use strict";

        if (!_x.isArray(domain)) {
            return 'signal' in domain;
        }

        return false;
    }

    function _7x(domain, fieldDef, scale, scaleConfig) {
        "use strict";

        if (domain === 'unaggregated') {
            var _a = _7y(fieldDef, scale),
                valid = _a.valid,
                reason = _a.reason;

            if (!valid) {
                _2m.warn(reason);

                return _$0.undefined;
            }
        } else if (domain === _$0.undefined && scaleConfig.useUnaggregatedDomain) {
            // Apply config if domain is not specified.
            var valid = _7y(fieldDef, scale).valid;

            if (valid) {
                return 'unaggregated';
            }
        }

        return domain;
    }

    function _7y(fieldDef, scaleType) {
        "use strict";

        if (!fieldDef.aggregate) {
            return {
                valid: false,
                reason: _2m.message.unaggregateDomainHasNoEffectForRawField(fieldDef)
            };
        }

        if (!_p.SHARED_DOMAIN_OP_INDEX[fieldDef.aggregate]) {
            return {
                valid: false,
                reason: _2m.message.unaggregateDomainWithNonSharedDomainOp(fieldDef.aggregate)
            };
        }

        if (fieldDef.type === 'quantitative') {
            if (scaleType === 'log') {
                return {
                    valid: false,
                    reason: _2m.message.unaggregatedDomainWithLogScale(fieldDef)
                };
            }
        }

        return {
            valid: true
        };
    }

    function _7z(model, channel) {
        "use strict";

        var scale = model.scale(channel); // If channel is either X or Y then union them with X2 & Y2 if they exist

        if (channel === 'x' && model.channelHasField('x2')) {
            if (model.channelHasField('x')) {
                return _7A(_7C(scale, model, 'x'), _7C(scale, model, 'x2'));
            } else {
                return _7C(scale, model, 'x2');
            }
        } else if (channel === 'y' && model.channelHasField('y2')) {
            if (model.channelHasField('y')) {
                return _7A(_7C(scale, model, 'y'), _7C(scale, model, 'y2'));
            } else {
                return _7C(scale, model, 'y2');
            }
        }

        return _7C(scale, model, channel);
    }

    function _7A(domain1, domain2) {
        "use strict";

        if (_7r.isSignalRefDomain(domain1) || _7r.isSignalRefDomain(domain2)) {
            if (!_7r.isSignalRefDomain(domain1) || !_7r.isSignalRefDomain(domain2) || domain1.signal !== domain2.signal) {
                throw new _$0.Error(_2m.message.UNABLE_TO_MERGE_DOMAINS);
            }

            return domain1;
        }

        var normalizedDomain1 = _7B(domain1);

        var normalizedDomain2 = _7B(domain2);

        var domains = normalizedDomain1.concat(normalizedDomain2);
        domains = _x.unique(domains, _x.hash);

        if (domains.length > 1) {
            var allData = domains.map(function (d) {
                if (_7r.isDataRefDomain(d)) {
                    return d.data;
                }

                return null;
            });

            if (_x.unique(allData, function (x) {
                return x;
            }).length === 1 && allData[0] !== null) {
                return {
                    data: allData[0],
                    fields: domains.map(function (d) {
                        return d.field;
                    })
                };
            }

            return {
                fields: domains,
                sort: true
            };
        } else {
            return domains[0];
        }
    }

    function _7B(domain) {
        "use strict";

        if (_x.isArray(domain)) {
            return [domain];
        } else if (_7r.isDataRefDomain(domain)) {
            delete domain.sort;
            return [domain];
        } else if (_7r.isFieldRefUnionDomain(domain)) {
            return domain.fields.map(function (d) {
                return {
                    data: domain.data,
                    field: d
                };
            });
        } else if (_7r.isDataRefUnionedDomain(domain)) {
            return domain.fields.map(function (d) {
                if (_x.isArray(d)) {
                    return d;
                }

                return {
                    data: d.data,
                    field: d.field
                };
            });
        } /* istanbul ignore next: This should never happen. */

        throw new _$0.Error(_2m.message.INVAID_DOMAIN);
    }

    function _7C(scale, model, channel) {
        "use strict";

        var fieldDef = model.fieldDef(channel);

        if (scale.domain && scale.domain !== 'unaggregated' && !_4M.isSelectionDomain(scale.domain)) {
            if (_36.isDateTime(scale.domain[0])) {
                return scale.domain.map(function (dt) {
                    return _36.timestamp(dt, true);
                });
            }

            return scale.domain;
        }

        var stack = model.stack;

        if (stack && channel === stack.fieldChannel) {
            if (stack.offset === 'normalize') {
                return [0, 1];
            }

            return {
                data: model.requestDataName(_5I.MAIN),
                fields: [model.field(channel, {
                    suffix: 'start'
                }), model.field(channel, {
                    suffix: 'end'
                })]
            };
        }

        var sort = _7D(model, channel, scale.type);

        if (scale.domain === 'unaggregated') {
            return {
                data: model.requestDataName(_5I.MAIN),
                fields: [model.field(channel, {
                    aggregate: 'min'
                }), model.field(channel, {
                    aggregate: 'max'
                })]
            };
        } else if (fieldDef.bin) {
            if (_4M.isBinScale(scale.type)) {
                var signal = model.getName(_v.binToString(fieldDef.bin) + "_" + fieldDef.field + "_bins");
                return {
                    signal: "sequence(" + signal + ".start, " + signal + ".stop + " + signal + ".step, " + signal + ".step)"
                };
            }

            if (_4M.hasDiscreteDomain(scale.type)) {
                // ordinal bin scale takes domain from bin_range, ordered by bin_start
                // This is useful for both axis-based scale (x, y, column, and row) and legend-based scale (other channels).
                return {
                    data: model.requestDataName(_5I.MAIN),
                    field: model.field(channel, {
                        binSuffix: 'range'
                    }),
                    sort: {
                        field: model.field(channel, {
                            binSuffix: 'start'
                        }),
                        op: 'min' // min or max doesn't matter since same _range would have the same _start

                    }
                };
            } else {
                if (channel === 'x' || channel === 'y') {
                    // X/Y position have to include start and end for non-ordinal scale
                    return {
                        data: model.requestDataName(_5I.MAIN),
                        fields: [model.field(channel, {
                            binSuffix: 'start'
                        }), model.field(channel, {
                            binSuffix: 'end'
                        })]
                    };
                } else {
                    // TODO: use bin_mid
                    return {
                        data: model.requestDataName(_5I.MAIN),
                        field: model.field(channel, {
                            binSuffix: 'start'
                        })
                    };
                }
            }
        } else if (sort) {
            return {
                // If sort by aggregation of a specified sort field, we need to use RAW table,
                // so we can aggregate values for the scale independently from the main aggregation.
                data: _x.isBoolean(sort) ? model.requestDataName(_5I.MAIN) : model.requestDataName(_5I.RAW),
                field: model.field(channel),
                sort: sort
            };
        } else {
            return {
                data: model.requestDataName(_5I.MAIN),
                field: model.field(channel)
            };
        }
    }

    function _7D(model, channel, scaleType) {
        "use strict";

        if (!_4M.hasDiscreteDomain(scaleType)) {
            return _$0.undefined /* default =ascending*/;
        }

        var sort = model.sort(channel); // Sorted based on an aggregate calculation over a specified sort field (only for ordinal scale)

        if (_7E.isSortField(sort)) {
            return {
                op: sort.op,
                field: sort.field
            };
        }

        if (_x.contains(['ascending', 'descending', _$0.undefined], sort)) {
            return true;
        } // sort === 'none'


        return _$0.undefined;
    }

    function _7F(sort) {
        "use strict";

        return !!sort && !!sort['field'] && !!sort['op'];
    }

    function _7G() {
        "use strict";

        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.parseMark();
        }
    }

    function _7H() {
        "use strict";

        var _this = this;

        var axisComponent = this.component.axes = {};

        var _loop_3 = function (child) {
            child.parseAxisAndHeader();

            _x.keys(child.component.axes).forEach(function (channel) {
                if (_this.resolve[channel].axis === 'shared') {
                    // If shared/union axis
                    // Just use the first axes definition for each channel
                    // TODO: what if the axes from different children are not compatible
                    if (!axisComponent[channel]) {
                        axisComponent[channel] = child.component.axes[channel];
                    }
                } else {
                    // If axes are independent
                    // TODO(#2251): correctly merge axis
                    if (!axisComponent[channel]) {
                        // copy the first axis
                        axisComponent[channel] = child.component.axes[channel];
                    } else {
                        // put every odd numbered axis on the right/top
                        axisComponent[channel].axes.push(_22.__assign({}, child.component.axes[channel].axes[0], axisComponent[channel].axes.length % 2 === 1 ? {
                            orient: channel === 'y' ? 'right' : 'top'
                        } : {}));

                        if (child.component.axes[channel].gridAxes.length > 0) {
                            axisComponent[channel].gridAxes.push(_22.__assign({}, child.component.axes[channel].gridAxes[0]));
                        }
                    }
                } // delete child.component.axes[channel];

            });
        };

        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];

            _loop_3(child);
        }
    }

    function _7I() {
        "use strict";

        var _this = this;

        var legendComponent = this.component.legends = {};

        var _loop_4 = function (child) {
            child.parseLegend(); // TODO: correctly implement independent axes

            _x.keys(child.component.legends).forEach(function (channel) {
                if (_this.resolve[channel].legend === 'shared') {
                    // just use the first legend definition for each channel
                    if (!legendComponent[channel]) {
                        legendComponent[channel] = child.component.legends[channel];
                    }
                } else {}
            });
        };

        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];

            _loop_4(child);
        }
    }

    function _7J() {
        "use strict";

        return _22.__assign({
            width: this.getSizeSignalRef('width'),
            height: this.getSizeSignalRef('height')
        }, _5f.applyConfig({}, this.config.cell, _3x.FILL_STROKE_CONFIG.concat(['clip'])));
    }

    function _7K(signals) {
        "use strict";

        return this.children.reduce(function (sg, child) {
            return child.assembleSelectionTopLevelSignals(sg);
        }, signals);
    }

    function _7L() {
        "use strict";

        return this.children.reduce(function (signals, child) {
            return signals.concat(child.assembleSelectionSignals());
        }, []);
    }

    function _7M() {
        "use strict";

        return this.children.reduce(function (signals, child) {
            return signals.concat(child.assembleLayoutSignals());
        }, _7N.assembleLayoutLayerSignals(this));
    }

    function _7O(model) {
        "use strict";

        return [{
            name: model.getName('width'),
            update: _7P(model, 'width')
        }, {
            name: model.getName('height'),
            update: _7P(model, 'height')
        }];
    }

    function _7P(model, sizeType) {
        "use strict";

        var childrenSizeSignals = model.children.map(function (child) {
            return child.getName(sizeType);
        }).join(', ');
        return "max(" + childrenSizeSignals + ")";
    }

    function _7Q(model) {
        "use strict";

        return [{
            name: model.getName('width'),
            update: _7R(model, 'width')
        }, {
            name: model.getName('height'),
            update: _7R(model, 'height')
        }];
    }

    function _7R(model, sizeType) {
        "use strict";

        var channel = sizeType === 'width' ? 'x' : 'y';
        var scale = model.scale(channel);

        if (scale) {
            if (_4M.hasDiscreteDomain(scale.type) && scale.rangeStep) {
                var scaleName = model.scaleName(channel);
                var cardinality = "domain('" + scaleName + "').length";
                var paddingOuter = scale.paddingOuter !== _$0.undefined ? scale.paddingOuter : scale.padding;
                var paddingInner = scale.type === 'band' ? // only band has real paddingInner
                scale.paddingInner !== _$0.undefined ? scale.paddingInner : scale.padding : // For point, as calculated in https://github.com/vega/vega-scale/blob/master/src/band.js#L128,
                // it's equivalent to have paddingInner = 1 since there is only n-1 steps between n points.
                1;
                return "bandspace(" + cardinality + ", " + paddingInner + ", " + paddingOuter + ") * " + scale.rangeStep;
            }
        }

        return "" + model[sizeType];
    }

    function _7S(data) {
        "use strict";

        return this.children.reduce(function (db, child) {
            return child.assembleSelectionData(db);
        }, []);
    }

    function _7T() {
        "use strict";

        if (!this.parent) {
            // only assemble data in the root
            return _7U.assembleData(_x.vals(this.component.data.sources));
        }

        return [];
    }

    function _7V(root) {
        "use strict";

        var data = [];

        var walkTree = _7W(data);

        root.children.forEach(function (child) {
            return walkTree(child, {
                source: root.name,
                name: null,
                transform: []
            });
        });
        return data;
    }

    function _7W(data) {
        "use strict";

        // to name datasources
        var datasetIndex = 0; /**
                               * Recursively walk down the tree.
                               */

        function walkTree(node, dataSource) {
            if (node instanceof _5R.ParseNode) {
                if (node.parent instanceof _5E.SourceNode && !dataSource.source) {
                    // If node's parent is a root source and the data source does not refer to another data source, use normal format parse
                    dataSource.format = _22.__assign({}, dataSource.format || {}, {
                        parse: node.assembleFormatParse()
                    });
                } else {
                    // Otherwise use Vega expression to parse
                    dataSource.transform = dataSource.transform.concat(node.assembleTransforms());
                }
            }

            if (node instanceof _7X.FacetNode) {
                if (!dataSource.name) {
                    dataSource.name = "data_" + datasetIndex++;
                }

                if (!dataSource.source || dataSource.transform.length > 0) {
                    data.push(dataSource);
                    node.data = dataSource.name;
                } else {
                    node.data = dataSource.source;
                }

                node.assemble().forEach(function (d) {
                    return data.push(d);
                }); // break here because the rest of the tree has to be taken care of by the facet.

                return;
            }

            if (node instanceof _81.FilterNode || node instanceof _8c.NullFilterNode || node instanceof _81.CalculateNode || node instanceof _8k.AggregateNode || node instanceof _8w.OrderNode) {
                dataSource.transform.push(node.assemble());
            }

            if (node instanceof _8C.NonPositiveFilterNode || node instanceof _8I.BinNode || node instanceof _bF.TimeUnitNode || node instanceof _bO.StackNode) {
                dataSource.transform = dataSource.transform.concat(node.assemble());
            }

            if (node instanceof _bY.OutputNode) {
                if (dataSource.source && dataSource.transform.length === 0) {
                    node.source = dataSource.source;
                } else if (node.parent instanceof _bY.OutputNode) {
                    // Note that an output node may be required but we still do not assemble a
                    // separate data source for it.
                    node.source = dataSource.name;
                } else {
                    if (!dataSource.name) {
                        dataSource.name = "data_" + datasetIndex++;
                    } // Here we set the name of the datasource we generated. From now on
                    // other assemblers can use it.


                    node.source = dataSource.name; // if this node has more than one child, we will add a datasource automatically

                    if (node.numChildren() === 1 && dataSource.transform.length > 0) {
                        data.push(dataSource);
                        var newData = {
                            name: null,
                            source: dataSource.name,
                            transform: []
                        };
                        dataSource = newData;
                    }
                }
            }

            switch (node.numChildren()) {
                case 0:
                    // done
                    if (node instanceof _bY.OutputNode && (!dataSource.source || dataSource.transform.length > 0)) {
                        // do not push empty datasources that are simply references
                        data.push(dataSource);
                    }

                    break;

                case 1:
                    walkTree(node.children[0], dataSource);
                    break;

                default:
                    var source_2 = dataSource.name;

                    if (!dataSource.source || dataSource.transform.length > 0) {
                        data.push(dataSource);
                    } else {
                        source_2 = dataSource.source;
                    }

                    node.children.forEach(function (child) {
                        var newData = {
                            name: null,
                            source: source_2,
                            transform: []
                        };
                        walkTree(child, newData);
                    });
                    break;
            }
        }

        return walkTree;
    }

    function _7Y(model, name, data) {
        "use strict";

        var _this = _5G.call(this) || this;

        _this.model = model;
        _this.name = name;
        _this.data = data;

        if (model.facet.column) {
            _this.columnField = model.field(_1F.COLUMN);
            _this.columnName = model.getName('column');
        }

        if (model.facet.row) {
            _this.rowField = model.field(_1F.ROW);
            _this.rowName = model.getName('row');
        }

        return _this;
    }

    function _80() {
        "use strict";

        var data = [];

        if (this.columnName) {
            data.push({
                name: this.columnName,
                source: this.data,
                transform: [{
                    type: 'aggregate',
                    groupby: [this.columnField]
                }]
            }); // Column needs another data source to calculate cardinality as input to layout

            data.push({
                name: this.columnName + '_layout',
                source: this.columnName,
                transform: [{
                    type: 'aggregate',
                    ops: ['distinct'],
                    fields: [this.columnField]
                }]
            });
        }

        if (this.rowName) {
            data.push({
                name: this.rowName,
                source: this.data,
                transform: [{
                    type: 'aggregate',
                    groupby: [this.rowField]
                }]
            });
        }

        return data;
    }

    function _82(model, filter) {
        "use strict";

        var _this = _5G.call(this) || this;

        _this.model = model;
        _this.filter = filter;
        return _this;
    }

    function _84() {
        "use strict";

        return new _82(this.model, _x.duplicate(this.filter));
    }

    function _85() {
        "use strict";

        return {
            type: 'filter',
            expr: _63.expression(this.model, this.filter)
        };
    }

    function _86(transform) {
        "use strict";

        var _this = _5G.call(this) || this;

        _this.transform = transform;
        return _this;
    }

    function _88() {
        "use strict";

        return new _86(_x.duplicate(this.transform));
    }

    function _89() {
        "use strict";

        var out = {};
        out[this.transform.as] = true;
        return out;
    }

    function _8a() {
        "use strict";

        return {
            type: 'formula',
            expr: this.transform.calculate,
            as: this.transform.as
        };
    }

    function _8b(model) {
        "use strict";

        var first;
        var last;
        var node;
        var previous;
        model.transforms.forEach(function (t, i) {
            if (_60.isCalculate(t)) {
                node = new _86(t);
            } else if (_60.isFilter(t)) {
                node = new _82(model, t.filter);
            } else {
                _2m.warn(_2m.message.invalidTransformIgnored(t));

                return;
            }

            if (i === 0) {
                first = node;
            } else {
                node.parent = previous;
            }

            previous = node;
        });
        last = node;
        return {
            first: first,
            last: last
        };
    }

    function _8d(fields) {
        "use strict";

        var _this = _5G.call(this) || this;

        _this._filteredFields = fields;
        return _this;
    }

    function _8f() {
        "use strict";

        return new _8d(_x.duplicate(this._filteredFields));
    }

    function _8g(other) {
        "use strict";

        var _this = this;

        var t = _$0.Object.keys(this._filteredFields).map(function (k) {
            return k + ' ' + _x.hash(_this._filteredFields[k]);
        });

        var o = _$0.Object.keys(other.filteredFields).map(function (k) {
            return k + ' ' + _x.hash(other.filteredFields[k]);
        });

        if (!_x.differArray(t, o)) {
            this._filteredFields = _x.extend(this._filteredFields, other._filteredFields);
            other.remove();
        }
    }

    function _8h() {
        "use strict";

        var _this = this;

        var filters = _x.keys(this._filteredFields).reduce(function (_filters, field) {
            var fieldDef = _this._filteredFields[field];

            if (fieldDef !== null) {
                _filters.push("datum[" + _x.stringValue(fieldDef.field) + "] !== null");

                if (_x.contains([_3o.QUANTITATIVE, _3o.TEMPORAL], fieldDef.type)) {
                    // TODO(https://github.com/vega/vega-lite/issues/1436):
                    // We can be even smarter and add NaN filter for N,O that are numbers
                    // based on the `parse` property once we have it.
                    _filters.push("!isNaN(datum[" + _x.stringValue(fieldDef.field) + "])");
                }
            }

            return _filters;
        }, []);

        return filters.length > 0 ? {
            type: 'filter',
            expr: filters.join(' && ')
        } : null;
    }

    function _8i(model) {
        "use strict";

        var fields = model.reduceFieldDef(function (aggregator, fieldDef) {
            if (fieldDef.aggregate !== 'count') {
                if (model.config.filterInvalid || model.config.filterInvalid === _$0.undefined && fieldDef.field && _8j[fieldDef.type]) {
                    aggregator[fieldDef.field] = fieldDef;
                } else {
                    // define this so we know that we don't filter nulls for this field
                    // this makes it easier to merge into parents
                    aggregator[fieldDef.field] = null;
                }
            }

            return aggregator;
        }, {});

        if (_$0.Object.keys(fields).length === 0) {
            return null;
        }

        return new _8d(fields);
    }

    function _8l(dimensions, measures) {
        "use strict";

        var _this = _5G.call(this) || this;

        _this.dimensions = dimensions;
        _this.measures = measures;
        return _this;
    }

    function _8n() {
        "use strict";

        return new _8l(_x.extend({}, this.dimensions), _x.duplicate(this.measures));
    }

    function _8o(other) {
        "use strict";

        if (!_x.differ(this.dimensions, other.dimensions)) {
            _8p(this.measures, other.measures);

            other.remove();
        } else {
            _2m.debug('different dimensions, cannot merge');
        }
    }

    function _8p(parentMeasures, childMeasures) {
        "use strict";

        for (var field_1 in childMeasures) {
            if (childMeasures.hasOwnProperty(field_1)) {
                // when we merge a measure, we either have to add an aggregation operator or even a new field
                var ops = childMeasures[field_1];

                for (var op in ops) {
                    if (ops.hasOwnProperty(op)) {
                        if (field_1 in parentMeasures) {
                            // add operator to existing measure field
                            parentMeasures[field_1][op] = true;
                        } else {
                            parentMeasures[field_1] = {
                                op: true
                            };
                        }
                    }
                }
            }
        }
    }

    function _8q(fields) {
        "use strict";

        var _this = this;

        fields.forEach(function (f) {
            return _this.dimensions[f] = true;
        });
    }

    function _8r() {
        "use strict";

        var out = {};

        _x.keys(this.dimensions).forEach(function (f) {
            return out[f] = true;
        });

        _x.keys(this.measures).forEach(function (m) {
            return out[m] = true;
        });

        return out;
    }

    function _8s() {
        "use strict";

        var _this = this;

        var out = {};

        _x.keys(this.measures).forEach(function (field) {
            _x.keys(_this.measures[field]).forEach(function (op) {
                out[op + "_" + field] = true;
            });
        });

        return out;
    }

    function _8t() {
        "use strict";

        var _this = this;

        var ops = [];
        var fields = [];

        _x.keys(this.measures).forEach(function (field) {
            _x.keys(_this.measures[field]).forEach(function (op) {
                ops.push(op);
                fields.push(field);
            });
        });

        return {
            type: 'aggregate',
            groupby: _x.keys(this.dimensions),
            ops: ops,
            fields: fields
        };
    }

    function _8u(model) {
        "use strict";

        var isAggregate = false;
        model.forEachFieldDef(function (fd) {
            if (fd.aggregate) {
                isAggregate = true;
            }
        });
        var meas = {};
        var dims = {};

        if (!isAggregate) {
            // no need to create this node if the model has no aggregation
            return null;
        }

        model.forEachFieldDef(function (fieldDef, channel) {
            if (fieldDef.aggregate) {
                if (fieldDef.aggregate === 'count') {
                    meas['*'] = meas['*'] || {}; /* tslint:disable:no-string-literal */
                    meas['*']['count'] = true;
                } else {
                    meas[fieldDef.field] = meas[fieldDef.field] || {};
                    meas[fieldDef.field][fieldDef.aggregate] = true; // add min/max so we can use their union as unaggregated domain

                    var scale = model.scale(channel);

                    if (scale && scale.domain === 'unaggregated') {
                        meas[fieldDef.field]['min'] = true;
                        meas[fieldDef.field]['max'] = true;
                    }
                }
            } else {
                _8v(dims, fieldDef);
            }
        });

        if (_$0.Object.keys(dims).length + _$0.Object.keys(meas).length === 0) {
            return null;
        }

        return new _8l(dims, meas);
    }

    function _8v(dims, fieldDef) {
        "use strict";

        if (fieldDef.bin) {
            dims[_23.field(fieldDef, {
                binSuffix: 'start'
            })] = true;
            dims[_23.field(fieldDef, {
                binSuffix: 'end'
            })] = true; // We need the range only when the user explicitly forces a binned field to be ordinal (range used in axis and legend labels).
            // We could check whether the axis or legend exists but that seems overkill. In axes and legends, we check hasDiscreteDomain(scaleType).

            if (fieldDef.type === _3o.ORDINAL) {
                dims[_23.field(fieldDef, {
                    binSuffix: 'range'
                })] = true;
            }
        } else {
            dims[_23.field(fieldDef)] = true;
        }

        return dims;
    }

    function _8x(sort) {
        "use strict";

        var _this = _5G.call(this) || this;

        _this.sort = sort;
        return _this;
    }

    function _8z() {
        "use strict";

        return new _8x(_x.duplicate(this.sort));
    }

    function _8A() {
        "use strict";

        return {
            type: 'collect',
            sort: this.sort
        };
    }

    function _8B(model) {
        "use strict";

        var sort = null;

        if (_x.contains(['line', 'area'], model.mark())) {
            if (model.mark() === 'line' && model.channelHasField('order')) {
                // For only line, sort by the order field if it is specified.
                sort = _5f.sortParams(model.encoding.order);
            } else {
                // For both line and area, we sort values based on dimension by default
                var dimensionChannel = model.markDef.orient === 'horizontal' ? 'y' : 'x';
                var s = model.sort(dimensionChannel);
                var sortField = _7E.isSortField(s) ? _23.field({
                    // FIXME: this op might not already exist?
                    // FIXME: what if dimensionChannel (x or y) contains custom domain?
                    aggregate: _4y.isAggregate(model.encoding) ? s.op : _$0.undefined,
                    field: s.field
                }) : model.field(dimensionChannel, {
                    binSuffix: 'start'
                });
                sort = {
                    field: sortField,
                    order: 'descending'
                };
            }
        } else {
            return null;
        }

        return new _8x(sort);
    }

    function _8D(filter) {
        "use strict";

        var _this = _5G.call(this) || this;

        _this._filter = filter;
        return _this;
    }

    function _8F() {
        "use strict";

        return new _8D(_x.extend({}, this._filter));
    }

    function _8G() {
        "use strict";

        var _this = this;

        return _x.keys(this._filter).filter(function (field) {
            // Only filter fields (keys) with value = true
            return _this._filter[field];
        }).map(function (field) {
            return {
                type: 'filter',
                expr: 'datum["' + field + '"] > 0'
            };
        });
    }

    function _8H(model) {
        "use strict";

        var filter = model.channels().reduce(function (nonPositiveComponent, channel) {
            var scale = model.scale(channel);

            if (!scale || !model.field(channel)) {
                // don't set anything
                return nonPositiveComponent;
            }

            nonPositiveComponent[model.field(channel)] = scale.type === _4M.ScaleType.LOG;
            return nonPositiveComponent;
        }, {});

        if (!_$0.Object.keys(filter).length) {
            return null;
        }

        return new _8D(filter);
    }

    function _8J(bins) {
        "use strict";

        var _this = _5G.call(this) || this;

        _this.bins = bins;
        return _this;
    }

    function _8L() {
        "use strict";

        return new _8J(_x.duplicate(this.bins));
    }

    function _8M(other) {
        "use strict";

        this.bins = _x.extend(other.bins);
        other.remove();
    }

    function _8N() {
        "use strict";

        var out = {};

        _x.vals(this.bins).forEach(function (c) {
            c.as.forEach(function (f) {
                return out[f] = true;
            });
        });

        return out;
    }

    function _8O() {
        "use strict";

        var out = {};

        _x.vals(this.bins).forEach(function (c) {
            out[c.field] = true;
        });

        return out;
    }

    function _8P() {
        "use strict";

        return _x.flatten(_x.vals(this.bins).map(function (bin) {
            var transform = [];

            var binTrans = _22.__assign({
                type: 'bin',
                field: bin.field,
                as: bin.as,
                signal: bin.signal
            }, bin.bin);

            if (!bin.bin.extent) {
                transform.push({
                    type: 'extent',
                    field: bin.field,
                    signal: bin.extentSignal
                });
                binTrans.extent = {
                    signal: bin.extentSignal
                };
            }

            transform.push(binTrans);

            if (bin.formula) {
                transform.push({
                    type: 'formula',
                    expr: bin.formula,
                    as: bin.formulaAs
                });
            }

            return transform;
        }));
    }

    function _8Q(model) {
        "use strict";

        var bins = model.reduceFieldDef(function (binComponent, fieldDef, channel) {
            var fieldDefBin = model.fieldDef(channel).bin;

            if (fieldDefBin) {
                var bin = _x.isBoolean(fieldDefBin) ? {} : fieldDefBin;
                var key = _v.binToString(fieldDef.bin) + "_" + fieldDef.field;

                if (!(key in binComponent)) {
                    binComponent[key] = {
                        bin: bin,
                        field: fieldDef.field,
                        as: [_23.field(fieldDef, {
                            binSuffix: 'start'
                        }), _23.field(fieldDef, {
                            binSuffix: 'end'
                        })],
                        signal: model.getName(key + "_bins"),
                        extentSignal: model.getName(key + '_extent')
                    };
                }

                binComponent[key] = _22.__assign({}, binComponent[key], _8R(model, fieldDef, channel, model.config));
            }

            return binComponent;
        }, {});

        if (_$0.Object.keys(bins).length === 0) {
            return null;
        }

        return new _8J(bins);
    }

    function _8R(model, fieldDef, channel, config) {
        "use strict";

        var discreteDomain = model.hasDiscreteDomain(channel);

        if (discreteDomain) {
            // read format from axis or legend, if there is no format then use config.numberFormat
            var guide = model instanceof _8S.UnitModel ? model.axis(channel) || model.legend(channel) || {} : {};

            var format = _5f.numberFormat(fieldDef, guide.format, config, channel);

            var startField = _23.field(fieldDef, {
                expr: 'datum',
                binSuffix: 'start'
            });

            var endField = _23.field(fieldDef, {
                expr: 'datum',
                binSuffix: 'end'
            });

            return {
                formulaAs: _23.field(fieldDef, {
                    binSuffix: 'range'
                }),
                formula: _bE(startField, format) + " + ' - ' + " + _bE(endField, format)
            };
        }

        return {};
    }

    function _8T(spec, parent, parentGivenName, parentUnitSize, repeater, config) {
        "use strict";

        if (parentUnitSize === void 0) {
            parentUnitSize = {};
        }

        var _this = _5j.call(this, spec, parent, parentGivenName, config) || this;

        _this.scales = {};
        _this.axes = {};
        _this.legends = {};
        _this.selection = {};
        _this.children = []; // FIXME(#2041): copy config.facet.cell to config.cell -- this seems incorrect and should be rewritten

        _this.initFacetCellConfig(); // use top-level width / height or ancestor's width / height


        var providedWidth = spec.width || parentUnitSize.width;
        var providedHeight = spec.height || parentUnitSize.height;
        var mark = _3x.isMarkDef(spec.mark) ? spec.mark.type : spec.mark;

        var encoding = _this.encoding = _4y.normalizeEncoding(_5s.replaceRepeaterInEncoding(spec.encoding || {}, repeater), mark); // calculate stack properties


        _this.stack = _4I.stack(mark, encoding, _this.config.stack);
        _this.scales = _this.initScales(mark, encoding, providedWidth, providedHeight);
        _this.markDef = _8U.initMarkDef(spec.mark, encoding, _this.scales, _this.config);
        _this.encoding = _8U.initEncoding(mark, encoding, _this.stack, _this.config);
        _this.axes = _this.initAxes(encoding);
        _this.legends = _this.initLegend(encoding); // Selections will be initialized upon parse.

        _this.selection = spec.selection; // width / height

        var _a = _this.initSize(mark, _this.scales, providedWidth, providedHeight),
            _b = _a.width,
            width = _b === void 0 ? _this.width : _b,
            _c = _a.height,
            height = _c === void 0 ? _this.height : _c;

        _this.width = width;
        _this.height = height;
        return _this;
    }

    function _8V(mark, encoding, scale, config) {
        "use strict";

        var markDef = _3x.isMarkDef(mark) ? _22.__assign({}, mark) : {
            type: mark
        };

        var specifiedOrient = markDef.orient || _5f.getMarkConfig('orient', markDef.type, config);

        markDef.orient = _8W(markDef.type, encoding, scale, specifiedOrient);

        if (specifiedOrient !== _$0.undefined && specifiedOrient !== markDef.orient) {
            _2m.warn(_2m.message.orientOverridden(markDef.orient, specifiedOrient));
        }

        var specifiedFilled = markDef.filled;

        if (specifiedFilled === _$0.undefined) {
            markDef.filled = _8X(markDef.type, config);
        }

        return markDef;
    }

    function _8W(mark, encoding, scale, specifiedOrient) {
        "use strict";

        switch (mark) {
            case _3x.POINT:
            case _3x.CIRCLE:
            case _3x.SQUARE:
            case _3x.TEXT:
            case _3x.RECT:
                // orient is meaningless for these marks.
                return _$0.undefined;
        }

        var yIsRange = encoding.y && encoding.y2;
        var xIsRange = encoding.x && encoding.x2;

        switch (mark) {
            case _3x.TICK:
                var xScaleType = scale['x'] ? scale['x'].type : null;
                var yScaleType = scale['y'] ? scale['y'].type : null; // Tick is opposite to bar, line, area and never have ranged mark.

                if (!_4M.hasDiscreteDomain(xScaleType) && (!encoding.y || _4M.hasDiscreteDomain(yScaleType) || _23.isFieldDef(encoding.y) && encoding.y.bin)) {
                    return 'vertical';
                } // y:Q or Ambiguous case, return horizontal


                return 'horizontal';

            case _3x.RULE:
            case _3x.BAR:
            case _3x.AREA:
                // If there are range for both x and y, y (vertical) has higher precedence.
                if (yIsRange) {
                    return 'vertical';
                } else if (xIsRange) {
                    return 'horizontal';
                } else if (mark === _3x.RULE) {
                    if (encoding.x && !encoding.y) {
                        return 'vertical';
                    } else if (encoding.y && !encoding.x) {
                        return 'horizontal';
                    }
                }

            /* tslint:disable */

            case _3x.LINE:
                /* tslint:enable */var xIsContinuous = _23.isFieldDef(encoding.x) && _23.isContinuous(encoding.x);

                var yIsContinuous = _23.isFieldDef(encoding.y) && _23.isContinuous(encoding.y);

                if (xIsContinuous && !yIsContinuous) {
                    return 'horizontal';
                } else if (!xIsContinuous && yIsContinuous) {
                    return 'vertical';
                } else if (xIsContinuous && yIsContinuous) {
                    var xDef = encoding.x; // we can cast here since they are surely fieldDef

                    var yDef = encoding.y;
                    var xIsTemporal = xDef.type === _3o.TEMPORAL;
                    var yIsTemporal = yDef.type === _3o.TEMPORAL; // temporal without timeUnit is considered continuous, but better serves as dimension

                    if (xIsTemporal && !yIsTemporal) {
                        return 'vertical';
                    } else if (!xIsTemporal && yIsTemporal) {
                        return 'horizontal';
                    }

                    if (!xDef.aggregate && yDef.aggregate) {
                        return 'vertical';
                    } else if (xDef.aggregate && !yDef.aggregate) {
                        return 'horizontal';
                    }

                    if (specifiedOrient) {
                        // When ambiguous, use user specified one.
                        return specifiedOrient;
                    }

                    if (!(mark === _3x.LINE && encoding.order)) {
                        // Except for connected scatterplot, we should log warning for unclear orientation of QxQ plots.
                        _2m.warn(_2m.message.unclearOrientContinuous(mark));
                    }

                    return 'vertical';
                } else {
                    // For Discrete x Discrete case, return undefined.
                    _2m.warn(_2m.message.unclearOrientDiscreteOrEmpty(mark));

                    return _$0.undefined;
                }

        }

        return 'vertical';
    }

    function _8X(mark, config) {
        "use strict";

        var filledConfig = _5f.getMarkConfig('filled', mark, config);

        return filledConfig !== _$0.undefined ? filledConfig : mark !== _3x.POINT && mark !== _3x.LINE && mark !== _3x.RULE;
    }

    function _8Y(mark, encoding, stacked, config) {
        "use strict";

        var opacityConfig = _5f.getMarkConfig('opacity', mark, config);

        if (!encoding.opacity && opacityConfig === _$0.undefined) {
            var opacity = _8Z(mark, encoding, stacked);

            if (opacity !== _$0.undefined) {
                encoding.opacity = {
                    value: opacity
                };
            }
        }

        return encoding;
    }

    function _8Z(mark, encoding, stacked) {
        "use strict";

        if (_x.contains([_3x.POINT, _3x.TICK, _3x.CIRCLE, _3x.SQUARE], mark)) {
            // point-based marks
            if (!_4y.isAggregate(encoding)) {
                return 0.7;
            }
        }

        return _$0.undefined;
    }

    function _91(channel) {
        "use strict";

        return this.scales[channel];
    }

    function _92(channel) {
        "use strict";

        var scale = this.scale(channel);
        return scale && _4M.hasDiscreteDomain(scale.type);
    }

    function _93(channel) {
        "use strict";

        return (this.getMapping()[channel] || {}).sort;
    }

    function _94(channel) {
        "use strict";

        return this.axes[channel];
    }

    function _95(channel) {
        "use strict";

        return this.legends[channel];
    }

    function _96() {
        "use strict";

        var config = this.config;
        var ancestor = this.parent;
        var hasFacetAncestor = false;

        while (ancestor !== null) {
            if (ancestor instanceof _5h.FacetModel) {
                hasFacetAncestor = true;
                break;
            }

            ancestor = ancestor.parent;
        }

        if (hasFacetAncestor) {
            config.cell = _x.extend({}, config.cell, config.facet.cell);
        }
    }

    function _97(mark, encoding, topLevelWidth, topLevelHeight) {
        "use strict";

        var _this = this;

        var xyRangeSteps = [];
        return _1F.UNIT_SCALE_CHANNELS.reduce(function (scales, channel) {
            if (_4y.channelHasField(encoding, channel) || channel === _1F.X && _4y.channelHasField(encoding, _1F.X2) || channel === _1F.Y && _4y.channelHasField(encoding, _1F.Y2)) {
                var scale = scales[channel] = _98.default(channel, encoding[channel], _this.config, mark, channel === _1F.X ? topLevelWidth : channel === _1F.Y ? topLevelHeight : _$0.undefined, xyRangeSteps // for determine point / bar size
                );

                if (channel === _1F.X || channel === _1F.Y) {
                    if (scale.rangeStep) {
                        xyRangeSteps.push(scale.rangeStep);
                    }
                }
            }

            return scales;
        }, {});
    }

    function _9a(channel, fieldDef, config, mark, topLevelSize, xyRangeSteps) {
        "use strict";

        var specifiedScale = (fieldDef || {}).scale || {};
        var scale = {
            type: _9b.default(specifiedScale.type, channel, fieldDef, mark, topLevelSize !== _$0.undefined, specifiedScale.rangeStep, config.scale)
        }; // Use specified value if compatible or determine default values for each property

        _98.NON_TYPE_RANGE_SCALE_PROPERTIES.forEach(function (property) {
            var specifiedValue = specifiedScale[property];

            var supportedByScaleType = _4M.scaleTypeSupportProperty(scale.type, property);

            var channelIncompatability = _4M.channelScalePropertyIncompatability(channel, property);

            if (specifiedValue !== _$0.undefined) {
                // If there is a specified value, check if it is compatible with scale type and channel
                if (!supportedByScaleType) {
                    _2m.warn(_2m.message.scalePropertyNotWorkWithScaleType(scale.type, property, channel));
                } else if (channelIncompatability) {
                    _2m.warn(channelIncompatability);
                }
            }

            if (supportedByScaleType && channelIncompatability === _$0.undefined) {
                var value = _9h(specifiedValue, property, scale, channel, fieldDef, config.scale);

                if (value !== _$0.undefined) {
                    scale[property] = value;
                }
            }
        });

        return _x.extend(scale, _9q.default(channel, scale.type, fieldDef.type, specifiedScale, config, scale.zero, mark, topLevelSize, xyRangeSteps));
    }

    function _9c(specifiedType, channel, fieldDef, mark, hasTopLevelSize, specifiedRangeStep, scaleConfig) {
        "use strict";

        var defaultScaleType = _9d(channel, fieldDef, mark, hasTopLevelSize, specifiedRangeStep, scaleConfig);

        if (!_1F.hasScale(channel)) {
            // There is no scale for these channels
            return null;
        }

        if (specifiedType !== _$0.undefined) {
            // Check if explicitly specified scale type is supported by the channel
            if (!_1F.supportScaleType(channel, specifiedType)) {
                _2m.warn(_2m.message.scaleTypeNotWorkWithChannel(channel, specifiedType, defaultScaleType));

                return defaultScaleType;
            } // Check if explicitly specified scale type is supported by the data type


            if (!_9g(specifiedType, fieldDef)) {
                _2m.warn(_2m.message.scaleTypeNotWorkWithFieldDef(specifiedType, defaultScaleType));

                return defaultScaleType;
            }

            return specifiedType;
        }

        return defaultScaleType;
    }

    function _9d(channel, fieldDef, mark, hasTopLevelSize, specifiedRangeStep, scaleConfig) {
        "use strict";

        if (_x.contains(['row', 'column'], channel)) {
            return 'band';
        }

        switch (fieldDef.type) {
            case 'nominal':
                if (channel === 'color' || _1F.rangeType(channel) === 'discrete') {
                    return 'ordinal';
                }

                return _9e(channel, mark, hasTopLevelSize, specifiedRangeStep, scaleConfig);

            case 'ordinal':
                if (channel === 'color') {
                    return 'ordinal';
                } else if (_1F.rangeType(channel) === 'discrete') {
                    _2m.warn(_2m.message.discreteChannelCannotEncode(channel, 'ordinal'));

                    return 'ordinal';
                }

                return _9e(channel, mark, hasTopLevelSize, specifiedRangeStep, scaleConfig);

            case 'temporal':
                if (channel === 'color') {
                    // Always use `sequential` as the default color scale for continuous data
                    // since it supports both array range and scheme range.
                    return 'sequential';
                } else if (_1F.rangeType(channel) === 'discrete') {
                    _2m.warn(_2m.message.discreteChannelCannotEncode(channel, 'temporal')); // TODO: consider using quantize (equivalent to binning) once we have it


                    return 'ordinal';
                }

                if (_2a.isDiscreteByDefault(fieldDef.timeUnit)) {
                    return _9e(channel, mark, hasTopLevelSize, specifiedRangeStep, scaleConfig);
                }

                return 'time';

            case 'quantitative':
                if (channel === 'color') {
                    if (fieldDef.bin) {
                        return 'bin-ordinal';
                    } // Use `sequential` as the default color scale for continuous data
                    // since it supports both array range and scheme range.


                    return 'sequential';
                } else if (_1F.rangeType(channel) === 'discrete') {
                    _2m.warn(_2m.message.discreteChannelCannotEncode(channel, 'quantitative')); // TODO: consider using quantize (equivalent to binning) once we have it


                    return 'ordinal';
                }

                if (fieldDef.bin) {
                    return 'bin-linear';
                }

                return 'linear';
        } /* istanbul ignore next: should never reach this */

        throw new _$0.Error(_2m.message.invalidFieldType(fieldDef.type));
    }

    function _9e(channel, mark, hasTopLevelSize, specifiedRangeStep, scaleConfig) {
        "use strict";

        if (_x.contains(['x', 'y'], channel)) {
            if (mark === 'rect') {
                // The rect mark should fit into a band.
                return 'band';
            }

            if (mark === 'bar') {
                // For bar, use band only if there is no rangeStep since we need to use band for fit mode.
                // However, for non-fit mode, point scale provides better center position.
                if (_9f(hasTopLevelSize, specifiedRangeStep, scaleConfig)) {
                    return 'point';
                }

                return 'band';
            }
        } // Otherwise, use ordinal point scale so we can easily get center positions of the marks.


        return 'point';
    }

    function _9f(hasTopLevelSize, specifiedRangeStep, scaleConfig) {
        "use strict";

        if (hasTopLevelSize) {
            // if topLevelSize is provided, rangeStep will be dropped.
            return false;
        }

        if (specifiedRangeStep !== _$0.undefined) {
            return specifiedRangeStep !== null;
        }

        return !!scaleConfig.rangeStep;
    }

    function _9g(specifiedType, fieldDef) {
        "use strict";

        var type = fieldDef.type;

        if (_x.contains([_3o.Type.ORDINAL, _3o.Type.NOMINAL], type)) {
            return specifiedType === _$0.undefined || _4M.hasDiscreteDomain(specifiedType);
        } else if (type === _3o.Type.TEMPORAL) {
            if (!fieldDef.timeUnit) {
                return _x.contains([_4M.ScaleType.TIME, _4M.ScaleType.UTC, _$0.undefined], specifiedType);
            } else {
                return _x.contains([_4M.ScaleType.TIME, _4M.ScaleType.UTC, _$0.undefined], specifiedType) || _4M.hasDiscreteDomain(specifiedType);
            }
        } else if (type === _3o.Type.QUANTITATIVE) {
            if (fieldDef.bin) {
                return specifiedType === _4M.ScaleType.BIN_LINEAR || specifiedType === _4M.ScaleType.BIN_ORDINAL;
            }

            return _x.contains([_4M.ScaleType.LOG, _4M.ScaleType.POW, _4M.ScaleType.SQRT, _4M.ScaleType.QUANTILE, _4M.ScaleType.QUANTIZE, _4M.ScaleType.LINEAR, _$0.undefined], specifiedType);
        }

        return true;
    }

    function _9h(specifiedValue, property, scale, channel, fieldDef, scaleConfig) {
        "use strict";

        // For domain, we might override specified value
        if (property === 'domain') {
            return _7w.initDomain(specifiedValue, fieldDef, scale.type, scaleConfig);
        } // Other properties, no overriding default values


        if (specifiedValue !== _$0.undefined) {
            return specifiedValue;
        }

        return _9i(property, scale, channel, fieldDef, scaleConfig);
    }

    function _9i(property, scale, channel, fieldDef, scaleConfig) {
        "use strict";

        // If we have default rule-base, determine default value first
        switch (property) {
            case 'nice':
                return _9j.nice(scale.type, channel, fieldDef);

            case 'padding':
                return _9j.padding(channel, scale.type, scaleConfig);

            case 'paddingInner':
                return _9j.paddingInner(scale.padding, channel, scaleConfig);

            case 'paddingOuter':
                return _9j.paddingOuter(scale.padding, channel, scale.type, scale.paddingInner, scaleConfig);

            case 'round':
                return _9j.round(channel, scaleConfig);

            case 'zero':
                return _9j.zero(scale, channel, fieldDef);
        } // Otherwise, use scale config


        return scaleConfig[property];
    }

    function _9k(scaleType, channel, fieldDef) {
        "use strict";

        if (_x.contains([_4M.ScaleType.TIME, _4M.ScaleType.UTC], scaleType)) {
            return _2a.smallestUnit(fieldDef.timeUnit);
        }

        return _x.contains([_1F.X, _1F.Y], channel); // return true for quantitative X/Y
    }

    function _9l(channel, scaleType, scaleConfig) {
        "use strict";

        if (_x.contains([_1F.X, _1F.Y], channel)) {
            if (scaleType === _4M.ScaleType.POINT) {
                return scaleConfig.pointPadding;
            }
        }

        return _$0.undefined;
    }

    function _9m(padding, channel, scaleConfig) {
        "use strict";

        if (padding !== _$0.undefined) {
            // If user has already manually specified "padding", no need to add default paddingInner.
            return _$0.undefined;
        }

        if (_x.contains([_1F.X, _1F.Y], channel)) {
            // Padding is only set for X and Y by default.
            // Basically it doesn't make sense to add padding for color and size.
            // paddingOuter would only be called if it's a band scale, just return the default for bandScale.
            return scaleConfig.bandPaddingInner;
        }

        return _$0.undefined;
    }

    function _9n(padding, channel, scaleType, paddingInner, scaleConfig) {
        "use strict";

        if (padding !== _$0.undefined) {
            // If user has already manually specified "padding", no need to add default paddingOuter.
            return _$0.undefined;
        }

        if (_x.contains([_1F.X, _1F.Y], channel)) {
            // Padding is only set for X and Y by default.
            // Basically it doesn't make sense to add padding for color and size.
            if (scaleType === _4M.ScaleType.BAND) {
                if (scaleConfig.bandPaddingOuter !== _$0.undefined) {
                    return scaleConfig.bandPaddingOuter;
                } /* By default, paddingOuter is paddingInner / 2. The reason is that
                      size (width/height) = step * (cardinality - paddingInner + 2 * paddingOuter).
                      and we want the width/height to be integer by default.
                      Note that step (by default) and cardinality are integers.) */

                return paddingInner / 2;
            }
        }

        return _$0.undefined;
    }

    function _9o(channel, scaleConfig) {
        "use strict";

        if (_x.contains(['x', 'y', 'row', 'column'], channel)) {
            return scaleConfig.round;
        }

        return _$0.undefined;
    }

    function _9p(specifiedScale, channel, fieldDef) {
        "use strict";

        // By default, return true only for the following cases:
        // 1) using quantitative field with size
        // While this can be either ratio or interval fields, our assumption is that
        // ratio are more common.
        if (channel === 'size' && fieldDef.type === 'quantitative') {
            return true;
        } // 2) non-binned, quantitative x-scale or y-scale if no custom domain is provided.
        // (For binning, we should not include zero by default because binning are calculated without zero.
        // Similar, if users explicitly provide a domain range, we should not augment zero as that will be unexpected.)


        if (!specifiedScale.domain && !fieldDef.bin && _x.contains([_1F.X, _1F.Y], channel)) {
            return true;
        }

        return false;
    }

    function _9r(scale) {
        "use strict";

        if (scale.rangeStep) {
            return {
                step: scale.rangeStep
            };
        } else if (scale.scheme) {
            var scheme = scale.scheme;

            if (_4M.isExtendedScheme(scheme)) {
                var r = {
                    scheme: scheme.name
                };

                if (scheme.count) {
                    r.count = scheme.count;
                }

                if (scheme.extent) {
                    r.extent = scheme.extent;
                }

                return r;
            } else {
                return {
                    scheme: scheme
                };
            }
        }

        return scale.range;
    }

    function _9t(channel, scaleType, type, specifiedScale, config, zero, mark, topLevelSize, xyRangeSteps) {
        "use strict";

        var specifiedRangeStepIsNull = false; // Check if any of the range properties is specified.
        // If so, check if it is compatible and make sure that we only output one of the properties

        for (var _i = 0, RANGE_PROPERTIES_1 = _9q.RANGE_PROPERTIES; _i < RANGE_PROPERTIES_1.length; _i++) {
            var property = RANGE_PROPERTIES_1[_i];

            if (specifiedScale[property] !== _$0.undefined) {
                var supportedByScaleType = _4M.scaleTypeSupportProperty(scaleType, property);

                var channelIncompatability = _4M.channelScalePropertyIncompatability(channel, property);

                if (!supportedByScaleType) {
                    _2m.warn(_2m.message.scalePropertyNotWorkWithScaleType(scaleType, property, channel));
                } else if (channelIncompatability) {
                    _2m.warn(channelIncompatability);
                } else {
                    switch (property) {
                        case 'range':
                            return {
                                range: specifiedScale[property]
                            };

                        case 'scheme':
                            return {
                                scheme: specifiedScale[property]
                            };

                        case 'rangeStep':
                            if (topLevelSize === _$0.undefined) {
                                var stepSize = specifiedScale[property];

                                if (stepSize !== null) {
                                    return {
                                        rangeStep: stepSize
                                    };
                                } else {
                                    specifiedRangeStepIsNull = true;
                                }
                            } else {
                                // If top-level size is specified, we ignore specified rangeStep.
                                _2m.warn(_2m.message.rangeStepDropped(channel));
                            }

                    }
                }
            }
        }

        switch (channel) {
            // TODO: revise row/column when facetSpec has top-level width/height
            case _1F.ROW:
                return {
                    range: 'height'
                };

            case _1F.COLUMN:
                return {
                    range: 'width'
                };

            case _1F.X:
            case _1F.Y:
                if (topLevelSize === _$0.undefined) {
                    if (_x.contains(['point', 'band'], scaleType) && !specifiedRangeStepIsNull) {
                        if (channel === _1F.X && mark === 'text') {
                            if (config.scale.textXRangeStep) {
                                return {
                                    rangeStep: config.scale.textXRangeStep
                                };
                            }
                        } else {
                            if (config.scale.rangeStep) {
                                return {
                                    rangeStep: config.scale.rangeStep
                                };
                            }
                        }
                    } // If specified range step is null or the range step config is null.
                    // Use default topLevelSize rule/config


                    topLevelSize = channel === _1F.X ? config.cell.width : config.cell.height;
                }

                return {
                    range: channel === _1F.X ? [0, topLevelSize] : [topLevelSize, 0]
                };

            case _1F.SIZE:
                // TODO: support custom rangeMin, rangeMax
                var rangeMin = _9u(mark, zero, config);

                var rangeMax = _9v(mark, xyRangeSteps, config);

                return {
                    range: [rangeMin, rangeMax]
                };

            case _1F.SHAPE:
            case _1F.COLOR:
                return {
                    range: _9x(channel, scaleType, type, mark)
                };

            case _1F.OPACITY:
                // TODO: support custom rangeMin, rangeMax
                return {
                    range: [config.scale.minOpacity, config.scale.maxOpacity]
                };
        } /* istanbul ignore next: should never reach here */

        throw new _$0.Error("Scale range undefined for channel " + channel);
    }

    function _9u(mark, zero, config) {
        "use strict";

        if (zero) {
            return 0;
        }

        switch (mark) {
            case 'bar':
                return config.scale.minBandSize !== _$0.undefined ? config.scale.minBandSize : config.bar.continuousBandSize;

            case 'tick':
                return config.scale.minBandSize;

            case 'line':
            case 'rule':
                return config.scale.minStrokeWidth;

            case 'text':
                return config.scale.minFontSize;

            case 'point':
            case 'square':
            case 'circle':
                if (config.scale.minSize) {
                    return config.scale.minSize;
                }

        } /* istanbul ignore next: should never reach here */ // sizeRangeMin not implemented for the mark


        throw new _$0.Error(_2m.message.incompatibleChannel('size', mark));
    }

    function _9v(mark, xyRangeSteps, config) {
        "use strict";

        var scaleConfig = config.scale; // TODO(#1168): make max size scale based on rangeStep / overall plot size

        switch (mark) {
            case 'bar':
            case 'tick':
                if (config.scale.maxBandSize !== _$0.undefined) {
                    return config.scale.maxBandSize;
                }

                return _9w(xyRangeSteps, config.scale) - 1;

            case 'line':
            case 'rule':
                return config.scale.maxStrokeWidth;

            case 'text':
                return config.scale.maxFontSize;

            case 'point':
            case 'square':
            case 'circle':
                if (config.scale.maxSize) {
                    return config.scale.maxSize;
                } // FIXME this case totally should be refactored


                var pointStep = _9w(xyRangeSteps, scaleConfig);

                return (pointStep - 2) * (pointStep - 2);
        } /* istanbul ignore next: should never reach here */ // sizeRangeMax not implemented for the mark


        throw new _$0.Error(_2m.message.incompatibleChannel('size', mark));
    }

    function _9w(xyRangeSteps, scaleConfig) {
        "use strict";

        if (xyRangeSteps.length > 0) {
            return _$0.Math.min.apply(null, xyRangeSteps);
        }

        if (scaleConfig.rangeStep) {
            return scaleConfig.rangeStep;
        }

        return 21; // FIXME: re-evaluate the default value here.
    }

    function _9x(channel, scaleType, type, mark) {
        "use strict";

        switch (channel) {
            case _1F.SHAPE:
                return 'symbol';

            case _1F.COLOR:
                if (scaleType === 'ordinal') {
                    // Only nominal data uses ordinal scale by default
                    return type === 'nominal' ? 'category' : 'ordinal';
                }

                return mark === 'rect' ? 'heatmap' : 'ramp';
        }
    }

    function _9y(mark, scale, width, height) {
        "use strict";

        var cellConfig = this.config.cell;
        var scaleConfig = this.config.scale;

        if (width === _$0.undefined) {
            if (scale[_1F.X]) {
                if (!_4M.hasDiscreteDomain(scale[_1F.X].type) || !scale[_1F.X].rangeStep) {
                    width = cellConfig.width;
                } // else: Do nothing, use dynamic width.

            } else {
                if (mark === _3x.TEXT) {
                    // for text table without x/y scale we need wider rangeStep
                    width = scaleConfig.textXRangeStep;
                } else {
                    if (typeof scaleConfig.rangeStep === 'string') {
                        throw new _$0.Error('_initSize does not handle string rangeSteps');
                    }

                    width = scaleConfig.rangeStep;
                }
            }
        }

        if (height === _$0.undefined) {
            if (scale[_1F.Y]) {
                if (!_4M.hasDiscreteDomain(scale[_1F.Y].type) || !scale[_1F.Y].rangeStep) {
                    height = cellConfig.height;
                } // else: Do nothing, use dynamic height .

            } else {
                if (typeof scaleConfig.rangeStep === 'string') {
                    throw new _$0.Error('_initSize does not handle string rangeSteps');
                }

                height = scaleConfig.rangeStep;
            }
        }

        return {
            width: width,
            height: height
        };
    }

    function _9z(encoding) {
        "use strict";

        return [_1F.X, _1F.Y].reduce(function (_axis, channel) {
            // Position Axis
            var channelDef = encoding[channel];

            if (_23.isFieldDef(channelDef) || channel === _1F.X && _23.isFieldDef(encoding.x2) || channel === _1F.Y && _23.isFieldDef(encoding.y2)) {
                var axisSpec = _23.isFieldDef(channelDef) ? channelDef.axis : null; // We no longer support false in the schema, but we keep false here for backward compatability.

                if (axisSpec !== null && axisSpec !== false) {
                    _axis[channel] = _22.__assign({}, axisSpec);
                }
            }

            return _axis;
        }, {});
    }

    function _9A(encoding) {
        "use strict";

        return _1F.NONSPATIAL_SCALE_CHANNELS.reduce(function (_legend, channel) {
            var channelDef = encoding[channel];

            if (_23.isFieldDef(channelDef)) {
                var legendSpec = channelDef.legend;

                if (legendSpec !== null && legendSpec !== false) {
                    _legend[channel] = _22.__assign({}, legendSpec);
                }
            }

            return _legend;
        }, {});
    }

    function _9B() {
        "use strict";

        this.component.data = _5B.parseData(this);
    }

    function _9C() {
        "use strict";

        this.component.selection = _69.parseUnitSelection(this, this.selection);
    }

    function _9D() {
        "use strict";

        this.component.scales = _9E.default(this);
    }

    function _9F(model) {
        "use strict";

        // TODO: should model.channels() inlcude X2/Y2?
        return model.channels().reduce(function (scaleComponentsIndex, channel) {
            var scaleComponents = _9G(model, channel);

            if (scaleComponents) {
                scaleComponentsIndex[channel] = scaleComponents;
            }

            return scaleComponentsIndex;
        }, {});
    }

    function _9G(model, channel) {
        "use strict";

        if (!model.scale(channel)) {
            return null;
        }

        var scale = model.scale(channel);
        var sort = model.sort(channel);
        var scaleComponent = {
            name: model.scaleName(channel + '', true),
            type: scale.type,
            domain: _7w.parseDomain(model, channel),
            range: _9q.parseRange(scale)
        };

        if (_4M.isSelectionDomain(scale.domain)) {
            scaleComponent.domainRaw = scale.domain;
        }

        _9E.NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES.forEach(function (property) {
            scaleComponent[property] = scale[property];
        });

        if (sort && (_7E.isSortField(sort) ? sort.order : sort) === 'descending') {
            scaleComponent.reverse = true;
        }

        return scaleComponent;
    }

    function _9I() {
        "use strict";

        this.component.mark = _9J.parseMark(this);
    }

    function _9K(model) {
        "use strict";

        if (_x.contains([_3x.LINE, _3x.AREA], model.mark())) {
            return _9L(model);
        } else {
            return _aL(model);
        }
    }

    function _9L(model) {
        "use strict";

        var mark = model.mark(); // FIXME: replace this with more general case for composition

        var details = _9M(model);

        var pathMarks = [_22.__assign({
            name: model.getName('marks'),
            type: _9N[mark].vgMark
        }, _aK(model), {
            // If has subfacet for line/area group, need to use faceted data from below.
            // FIXME: support sorting path order (in connected scatterplot)
            from: {
                data: (details.length > 0 ? "faceted_path_" : '') + model.requestDataName(_5I.MAIN)
            },
            encode: {
                update: _9N[mark].encodeEntry(model)
            }
        })];

        if (details.length > 0) {
            // TODO: for non-stacked plot, map order to zindex. (Maybe rename order for layer to zindex?)
            return [{
                name: model.getName('pathgroup'),
                type: 'group',
                from: {
                    facet: {
                        name: "faceted_path_" + model.requestDataName(_5I.MAIN),
                        data: model.requestDataName(_5I.MAIN),
                        groupby: details
                    }
                },
                encode: {
                    update: {
                        width: {
                            field: {
                                group: 'width'
                            }
                        },
                        height: {
                            field: {
                                group: 'height'
                            }
                        }
                    }
                },
                marks: pathMarks
            }];
        } else {
            return pathMarks;
        }
    }

    function _9M(model) {
        "use strict";

        return _1F.LEVEL_OF_DETAIL_CHANNELS.reduce(function (details, channel) {
            if (model.channelHasField(channel) && !model.fieldDef(channel).aggregate) {
                details.push(model.field(channel));
            }

            return details;
        }, []);
    }

    function _9P(model) {
        "use strict";

        return _22.__assign({}, _9Q.pointPosition('x', model, 'zeroOrMin'), _9Q.pointPosition('y', model, 'zeroOrMin'), _9Q.pointPosition2(model, 'zeroOrMin'), _9Q.color(model), _9Q.text(model, 'tooltip'), _9Q.nonPosition('opacity', model), _9Q.markDefProperties(model.markDef, ['orient', 'interpolate', 'tension']));
    }

    function _9R(model) {
        "use strict";

        var config = model.config;
        var filled = model.markDef.filled;

        var e = _9S('color', model, {
            vgChannel: filled ? 'fill' : 'stroke',
            defaultValue: _5f.getMarkConfig('color', model.mark(), config)
        }); // If there is no fill, always fill symbols
        // with transparent fills https://github.com/vega/vega-lite/issues/1316


        if (!e.fill && _x.contains(['bar', 'point', 'circle', 'square'], model.mark())) {
            e.fill = {
                value: 'transparent'
            };
        }

        return e;
    }

    function _9S(channel, model, opt) {
        "use strict";

        // TODO: refactor how refer to scale as discussed in https://github.com/vega/vega-lite/pull/1613
        if (opt === void 0) {
            opt = {};
        }

        var defaultValue = opt.defaultValue,
            vgChannel = opt.vgChannel;
        var defaultRef = opt.defaultRef || (defaultValue !== _$0.undefined ? {
            value: defaultValue
        } : _$0.undefined);
        var channelDef = model.encoding[channel];

        var valueRef = _9T.midPoint(channel, channelDef, model.scaleName(channel), model.scale(channel), defaultRef);

        return _a8(model, channelDef && channelDef.condition, vgChannel || channel, valueRef);
    }

    function _9U(channel, channelDef, scaleName, scale, stack, defaultRef) {
        "use strict";

        if (channelDef && stack && channel === stack.fieldChannel) {
            // x or y use stack_end so that stacked line's point mark use stack_end too.
            return _9V(channelDef, scaleName, {
                suffix: 'end'
            });
        }

        return _9W(channel, channelDef, scaleName, scale, defaultRef);
    }

    function _9V(fieldDef, scaleName, opt, offset) {
        "use strict";

        var ref = {
            scale: scaleName,
            field: _23.field(fieldDef, opt)
        };

        if (offset) {
            ref.offset = offset;
        }

        return ref;
    }

    function _9W(channel, channelDef, scaleName, scale, defaultRef) {
        "use strict";

        // TODO: datum support
        if (channelDef) {
            /* istanbul ignore else */if (_23.isFieldDef(channelDef)) {
                if (_4M.isBinScale(scale.type)) {
                    // Use middle only for x an y to place marks in the center between start and end of the bin range.
                    // We do not use the mid point for other channels (e.g. size) so that properties of legends and marks match.
                    if (_x.contains(['x', 'y'], channel)) {
                        return _9X(channelDef, scaleName);
                    }

                    return _9V(channelDef, scaleName, {
                        binSuffix: 'start'
                    });
                }

                if (_4M.hasDiscreteDomain(scale.type)) {
                    if (scale.type === 'band') {
                        // For band, to get mid point, need to offset by half of the band
                        return _9V(channelDef, scaleName, {
                            binSuffix: 'range'
                        }, _9Y(scaleName, 0.5));
                    }

                    return _9V(channelDef, scaleName, {
                        binSuffix: 'range'
                    });
                } else {
                    return _9V(channelDef, scaleName, {}); // no need for bin suffix
                }
            } else if (channelDef.value !== _$0.undefined) {
                return {
                    value: channelDef.value
                };
            } else {
                throw new _$0.Error('FieldDef without field or value.'); // FIXME add this to log.message
            }
        }

        if (defaultRef === 'zeroOrMin') {
            /* istanbul ignore else */if (channel === _1F.X || channel === _1F.X2) {
                return _9Z(scaleName, scale);
            } else if (channel === _1F.Y || channel === _1F.Y2) {
                return _a0(scaleName, scale);
            } else {
                throw new _$0.Error("Unsupported channel " + channel + " for base function"); // FIXME add this to log.message
            }
        } else if (defaultRef === 'zeroOrMax') {
            /* istanbul ignore else */if (channel === _1F.X || channel === _1F.X2) {
                return _a1(scaleName, scale);
            } else if (channel === _1F.Y || channel === _1F.Y2) {
                return _a2(scaleName, scale);
            } else {
                throw new _$0.Error("Unsupported channel " + channel + " for base function"); // FIXME add this to log.message
            }
        }

        return defaultRef;
    }

    function _9X(fieldDef, scaleName) {
        "use strict";

        return {
            signal: "(" + ("scale(\"" + scaleName + "\", " + _23.field(fieldDef, {
                binSuffix: 'start',
                expr: 'datum'
            }) + ")") + " + " + ("scale(\"" + scaleName + "\", " + _23.field(fieldDef, {
                binSuffix: 'end',
                expr: 'datum'
            }) + ")") + ")/2"
        };
    }

    function _9Y(scaleName, band) {
        "use strict";

        if (band === void 0) {
            band = true;
        }

        return {
            scale: scaleName,
            band: band
        };
    }

    function _9Z(scaleName, scale) {
        "use strict";

        if (scaleName) {
            // Log / Time / UTC scale do not support zero
            if (!_x.contains([_4M.ScaleType.LOG, _4M.ScaleType.TIME, _4M.ScaleType.UTC], scale.type) && scale.zero !== false) {
                return {
                    scale: scaleName,
                    value: 0
                };
            }
        } // Put the mark on the x-axis


        return {
            value: 0
        };
    }

    function _a0(scaleName, scale) {
        "use strict";

        if (scaleName) {
            // Log / Time / UTC scale do not support zero
            if (!_x.contains([_4M.ScaleType.LOG, _4M.ScaleType.TIME, _4M.ScaleType.UTC], scale.type) && scale.zero !== false) {
                return {
                    scale: scaleName,
                    value: 0
                };
            }
        } // Put the mark on the y-axis


        return {
            field: {
                group: 'height'
            }
        };
    }

    function _a1(scaleName, scale) {
        "use strict";

        if (scaleName) {
            // Log / Time / UTC scale do not support zero
            if (!_x.contains([_4M.ScaleType.LOG, _4M.ScaleType.TIME, _4M.ScaleType.UTC], scale.type) && scale.zero !== false) {
                return {
                    scale: scaleName,
                    value: 0
                };
            }
        }

        return {
            field: {
                group: 'width'
            }
        };
    }

    function _a2(scaleName, scale) {
        "use strict";

        if (scaleName) {
            // Log / Time / UTC scale do not support zero
            if (!_x.contains([_4M.ScaleType.LOG, _4M.ScaleType.TIME, _4M.ScaleType.UTC], scale.type) && scale.zero !== false) {
                return {
                    scale: scaleName,
                    value: 0
                };
            }
        } // Put the mark on the y-axis


        return {
            value: 0
        };
    }

    function _a3(channel, aFieldDef, a2fieldDef, scaleName, scale, stack, defaultRef) {
        "use strict";

        if (aFieldDef && stack && // If fieldChannel is X and channel is X2 (or Y and Y2)
        channel.charAt(0) === stack.fieldChannel.charAt(0)) {
            return _9V(aFieldDef, scaleName, {
                suffix: 'start'
            });
        }

        return _9W(channel, a2fieldDef, scaleName, scale, defaultRef);
    }

    function _a4(fieldDef, scaleName, side, offset) {
        "use strict";

        return _9V(fieldDef, scaleName, {
            binSuffix: side
        }, offset);
    }

    function _a5(textDef, config) {
        "use strict";

        // text
        if (textDef) {
            if (_23.isFieldDef(textDef)) {
                return _5f.formatSignalRef(textDef, textDef.format, 'datum', config);
            } else if (textDef.value) {
                return {
                    value: textDef.value
                };
            }
        }

        return {
            value: config.text.text
        };
    }

    function _a6(width, config) {
        "use strict";

        if (width) {
            return {
                value: width / 2
            };
        }

        if (typeof config.scale.rangeStep === 'string') {
            // TODO: For fit-mode, use middle of the width
            throw new _$0.Error('midX can not handle string rangeSteps');
        }

        return {
            value: config.scale.rangeStep / 2
        };
    }

    function _a7(height, config) {
        "use strict";

        if (height) {
            return {
                value: height / 2
            };
        }

        if (typeof config.scale.rangeStep === 'string') {
            // TODO: For fit-mode, use middle of the width
            throw new _$0.Error('midX can not handle string rangeSteps');
        }

        return {
            value: config.scale.rangeStep / 2
        };
    }

    function _a8(model, condition, vgChannel, valueRef) {
        "use strict";

        if (condition) {
            var selection = condition.selection,
                value = condition.value;
            return _a = {}, _a[vgChannel] = [{
                test: _a9(model, selection),
                value: value
            }].concat(valueRef !== _$0.undefined ? [valueRef] : []), _a;
        } else {
            return valueRef !== _$0.undefined ? (_b = {}, _b[vgChannel] = valueRef, _b) : {};
        }

        var _a, _b;
    }

    function _a9(model, selectionName) {
        "use strict";

        var negate = selectionName.charAt(0) === '!',
            name = negate ? selectionName.slice(1) : selectionName,
            selection = model.getComponent('selection', name);
        return (negate ? '!' : '') + _69.predicate(selection.name, selection.type, selection.resolve);
    }

    function _aa(mark, props) {
        "use strict";

        return props.reduce(function (m, prop) {
            if (mark[prop]) {
                m[prop] = {
                    value: mark[prop]
                };
            }

            return m;
        }, {});
    }

    function _ab(prop, value) {
        "use strict";

        if (value !== _$0.undefined) {
            return _a = {}, _a[prop] = {
                value: value
            }, _a;
        }

        return _$0.undefined;

        var _a;
    }

    function _ac(model, vgChannel) {
        "use strict";

        if (vgChannel === void 0) {
            vgChannel = 'text';
        }

        var channelDef = model.encoding[vgChannel];
        var valueRef = vgChannel === 'tooltip' && !channelDef ? _$0.undefined : _9T.text(channelDef, model.config);
        return _a8(model, channelDef && channelDef.condition, vgChannel, valueRef);
    }

    function _ad(channel, model) {
        "use strict";

        // TODO: band scale doesn't support size yet
        var fieldDef = model.encoding[channel];
        var scaleName = model.scaleName(channel);
        var sizeChannel = channel === 'x' ? 'width' : 'height';
        return _a = {}, _a[channel] = _9T.fieldRef(fieldDef, scaleName, {}), _a[sizeChannel] = _9T.band(scaleName), _a;

        var _a;
    }

    function _ae(channel, model, defaultPosRef, defaultSizeRef) {
        "use strict";

        var centerChannel = channel === 'x' ? 'xc' : 'yc';
        var sizeChannel = channel === 'x' ? 'width' : 'height';
        return _22.__assign({}, _af(channel, model, defaultPosRef, centerChannel), _9S('size', model, {
            defaultRef: defaultSizeRef,
            vgChannel: sizeChannel
        }));
    }

    function _af(channel, model, defaultRef, vgChannel) {
        "use strict";

        // TODO: refactor how refer to scale as discussed in https://github.com/vega/vega-lite/pull/1613
        var encoding = model.encoding,
            stack = model.stack;

        var valueRef = _9T.stackable(channel, encoding[channel], model.scaleName(channel), model.scale(channel), stack, defaultRef);

        return _a = {}, _a[vgChannel || channel] = valueRef, _a;

        var _a;
    }

    function _ag(channel, model, spacing) {
        "use strict";

        var fieldDef = model.encoding[channel];
        var scaleName = model.scaleName(channel);

        if (channel === 'x') {
            return {
                x2: _9T.bin(fieldDef, scaleName, 'start', spacing),
                x: _9T.bin(fieldDef, scaleName, 'end')
            };
        } else {
            return {
                y2: _9T.bin(fieldDef, scaleName, 'start'),
                y: _9T.bin(fieldDef, scaleName, 'end', spacing)
            };
        }
    }

    function _ah(model, defaultRef, channel) {
        "use strict";

        var encoding = model.encoding,
            markDef = model.markDef,
            stack = model.stack;
        channel = channel || (markDef.orient === 'horizontal' ? 'x2' : 'y2');
        var baseChannel = channel === 'x2' ? 'x' : 'y';

        var valueRef = _9T.stackable2(channel, encoding[baseChannel], encoding[channel], model.scaleName(baseChannel), model.scale(baseChannel), stack, defaultRef);

        return _a = {}, _a[channel] = valueRef, _a;

        var _a;
    }

    function _aj(model) {
        "use strict";

        var stack = model.stack;
        return _22.__assign({}, _ak(model, stack), _am(model, stack), _9Q.color(model), _9Q.text(model, 'tooltip'), _9Q.nonPosition('opacity', model));
    }

    function _ak(model, stack) {
        "use strict";

        var config = model.config,
            width = model.width;
        var orient = model.markDef.orient;
        var sizeDef = model.encoding.size;
        var xDef = model.encoding.x;
        var xScaleName = model.scaleName(_1F.X);
        var xScale = model.scale(_1F.X); // x, x2, and width -- we must specify two of these in all conditions

        if (orient === 'horizontal') {
            return _22.__assign({}, _9Q.pointPosition('x', model, 'zeroOrMin'), _9Q.pointPosition2(model, 'zeroOrMin'));
        } else {
            if (_23.isFieldDef(xDef)) {
                if (!sizeDef && _4M.isBinScale(xScale.type)) {
                    return _9Q.binnedPosition('x', model, config.bar.binSpacing);
                } else if (xScale.type === _4M.ScaleType.BAND) {
                    return _9Q.bandPosition('x', model);
                }
            } // sized bin, normal point-ordinal axis, quantitative x-axis, or no x


            return _9Q.centeredBandPosition('x', model, _22.__assign({}, _9T.midX(width, config)), _al(xScaleName, model.scale(_1F.X), config));
        }
    }

    function _al(scaleName, scale, config) {
        "use strict";

        if (config.bar.discreteBandSize) {
            return {
                value: config.bar.discreteBandSize
            };
        }

        if (scale) {
            if (scale.type === _4M.ScaleType.POINT) {
                if (scale.rangeStep !== null) {
                    return {
                        value: scale.rangeStep - 1
                    };
                }

                _2m.warn(_2m.message.BAR_WITH_POINT_SCALE_AND_RANGESTEP_NULL);
            } else if (scale.type === _4M.ScaleType.BAND) {
                return _9T.band(scaleName);
            } else {
                return {
                    value: config.bar.continuousBandSize
                };
            }
        }

        if (config.scale.rangeStep && config.scale.rangeStep !== null) {
            return {
                value: config.scale.rangeStep - 1
            };
        } // TODO: this should depends on cell's width / height?


        return {
            value: 20
        };
    }

    function _am(model, stack) {
        "use strict";

        var config = model.config,
            encoding = model.encoding,
            height = model.height;
        var orient = model.markDef.orient;
        var sizeDef = encoding.size;
        var yDef = encoding.y;
        var yScaleName = model.scaleName(_1F.Y);
        var yScale = model.scale(_1F.Y); // y, y2 & height -- we must specify two of these in all conditions

        if (orient === 'vertical') {
            return _22.__assign({}, _9Q.pointPosition('y', model, 'zeroOrMin'), _9Q.pointPosition2(model, 'zeroOrMin'));
        } else {
            if (_23.isFieldDef(yDef)) {
                if (yDef.bin && !sizeDef) {
                    return _9Q.binnedPosition('y', model, config.bar.binSpacing);
                } else if (yScale.type === _4M.ScaleType.BAND) {
                    return _9Q.bandPosition('y', model);
                }
            }

            return _9Q.centeredBandPosition('y', model, _9T.midY(height, config), _al(yScaleName, model.scale(_1F.Y), config));
        }
    }

    function _ao(model) {
        "use strict";

        return _22.__assign({}, _9Q.pointPosition('x', model, 'zeroOrMin'), _9Q.pointPosition('y', model, 'zeroOrMin'), _9Q.color(model), _9Q.text(model, 'tooltip'), _9Q.nonPosition('opacity', model), _9Q.nonPosition('size', model, {
            vgChannel: 'strokeWidth' // VL's line size is strokeWidth

        }), _9Q.markDefProperties(model.markDef, ['interpolate', 'tension']));
    }

    function _aq(model) {
        "use strict";

        return _ar(model);
    }

    function _ar(model, fixedShape) {
        "use strict";

        var config = model.config,
            width = model.width,
            height = model.height;
        return _22.__assign({}, _9Q.pointPosition('x', model, _9T.midX(width, config)), _9Q.pointPosition('y', model, _9T.midY(height, config)), _9Q.color(model), _9Q.text(model, 'tooltip'), _9Q.nonPosition('size', model), _as(model, config, fixedShape), _9Q.nonPosition('opacity', model));
    }

    function _as(model, config, fixedShape) {
        "use strict";

        if (fixedShape) {
            return {
                shape: {
                    value: fixedShape
                }
            };
        }

        return _9Q.nonPosition('shape', model, {
            defaultValue: _5f.getMarkConfig('shape', 'point', config)
        });
    }

    function _au(model) {
        "use strict";

        var config = model.config,
            encoding = model.encoding,
            height = model.height;
        var textDef = encoding.text;
        return _22.__assign({}, _9Q.pointPosition('x', model, _av(config, textDef)), _9Q.pointPosition('y', model, _9T.midY(height, config)), _9Q.text(model), _9Q.color(model), _9Q.text(model, 'tooltip'), _9Q.nonPosition('opacity', model), _9Q.nonPosition('size', model, {
            vgChannel: 'fontSize' // VL's text size is fontSize

        }), _9Q.valueIfDefined('align', _aw(encoding, config)));
    }

    function _av(config, textDef) {
        "use strict";

        if (_23.isFieldDef(textDef) && textDef.type === _3o.QUANTITATIVE) {
            return {
                field: {
                    group: 'width'
                },
                offset: -5
            };
        } // TODO: allow this to fit (Be consistent with ref.midX())


        return {
            value: config.scale.textXRangeStep / 2
        };
    }

    function _aw(encoding, config) {
        "use strict";

        var alignConfig = _5f.getMarkConfig('align', 'text', config);

        if (alignConfig === _$0.undefined) {
            return _4y.channelHasField(encoding, _1F.X) ? 'center' : 'right';
        } // If there is a config, Vega-parser will process this already.


        return _$0.undefined;
    }

    function _ay(model) {
        "use strict";

        var config = model.config,
            markDef = model.markDef,
            width = model.width,
            height = model.height;
        var orient = markDef.orient;
        var vgSizeChannel = orient === 'horizontal' ? 'width' : 'height';
        var vgThicknessChannel = orient === 'horizontal' ? 'height' : 'width';
        return _22.__assign({}, _9Q.pointPosition('x', model, _9T.midX(width, config), 'xc'), _9Q.pointPosition('y', model, _9T.midY(height, config), 'yc'), _9Q.nonPosition('size', model, {
            defaultValue: _az(model),
            vgChannel: vgSizeChannel
        }), (_a = {}, _a[vgThicknessChannel] = {
            value: config.tick.thickness
        }, _a), _9Q.color(model), _9Q.nonPosition('opacity', model));

        var _a;
    }

    function _az(model) {
        "use strict";

        var config = model.config;
        var orient = model.markDef.orient;
        var scaleRangeStep = (model.scale(orient === 'horizontal' ? 'x' : 'y') || {}).rangeStep;

        if (config.tick.bandSize !== _$0.undefined) {
            return config.tick.bandSize;
        } else {
            var rangeStep = scaleRangeStep !== _$0.undefined ? scaleRangeStep : config.scale.rangeStep;

            if (typeof rangeStep !== 'number') {
                // FIXME consolidate this log
                throw new _$0.Error('Function does not handle non-numeric rangeStep');
            }

            return rangeStep / 1.5;
        }
    }

    function _aB(model) {
        "use strict";

        return _22.__assign({}, _aC(model), _aD(model), _9Q.color(model), _9Q.text(model, 'tooltip'), _9Q.nonPosition('opacity', model));
    }

    function _aC(model) {
        "use strict";

        var xDef = model.encoding.x;
        var x2Def = model.encoding.x2;
        var xScale = model.scale(_1F.X);

        if (_23.isFieldDef(xDef) && xDef.bin && !x2Def) {
            return _9Q.binnedPosition('x', model, 0);
        } else if (xScale && _4M.hasDiscreteDomain(xScale.type)) {
            /* istanbul ignore else */if (xScale.type === _4M.ScaleType.BAND) {
                return _9Q.bandPosition('x', model);
            } else {
                // We don't support rect mark with point/ordinal scale
                throw new _$0.Error(_2m.message.scaleTypeNotWorkWithMark(_3x.RECT, xScale.type));
            }
        } else {
            return _22.__assign({}, _9Q.pointPosition('x', model, 'zeroOrMax'), _9Q.pointPosition2(model, 'zeroOrMin', 'x2'));
        }
    }

    function _aD(model) {
        "use strict";

        var yDef = model.encoding.y;
        var y2Def = model.encoding.y2;
        var yScale = model.scale(_1F.Y);

        if (_23.isFieldDef(yDef) && yDef.bin && !y2Def) {
            return _9Q.binnedPosition('y', model, 0);
        } else if (yScale && _4M.hasDiscreteDomain(yScale.type)) {
            /* istanbul ignore else */if (yScale.type === _4M.ScaleType.BAND) {
                return _9Q.bandPosition('y', model);
            } else {
                // We don't support rect mark with point/ordinal scale
                throw new _$0.Error(_2m.message.scaleTypeNotWorkWithMark(_3x.RECT, yScale.type));
            }
        } else {
            return _22.__assign({}, _9Q.pointPosition('y', model, 'zeroOrMax'), _9Q.pointPosition2(model, 'zeroOrMin', 'y2'));
        }
    }

    function _aF(model) {
        "use strict";

        var config = model.config,
            markDef = model.markDef,
            width = model.width,
            height = model.height;
        var orient = markDef.orient;
        return _22.__assign({}, _9Q.pointPosition('x', model, orient === 'horizontal' ? 'zeroOrMin' : _9T.midX(width, config)), _9Q.pointPosition('y', model, orient === 'vertical' ? 'zeroOrMin' : _9T.midY(height, config)), _9Q.pointPosition2(model, 'zeroOrMax'), _9Q.color(model), _9Q.text(model, 'tooltip'), _9Q.nonPosition('opacity', model), _9Q.nonPosition('size', model, {
            vgChannel: 'strokeWidth' // VL's rule size is strokeWidth

        }));
    }

    function _aH(model) {
        "use strict";

        return _ar(model, 'circle');
    }

    function _aJ(model) {
        "use strict";

        return _ar(model, 'square');
    }

    function _aK(model) {
        "use strict";

        var xscale = model.scale(_1F.X),
            yscale = model.scale(_1F.Y);
        return xscale && _4M.isSelectionDomain(xscale.domain) || yscale && _4M.isSelectionDomain(yscale.domain) ? {
            clip: true
        } : {};
    }

    function _aL(model) {
        "use strict";

        var mark = model.mark();
        var role = model.markDef.role || _9N[mark].defaultRole;
        var marks = []; // TODO: vgMarks
        // TODO: for non-stacked plot, map order to zindex. (Maybe rename order for layer to zindex?)

        marks.push(_22.__assign({
            name: model.getName('marks'),
            type: _9N[mark].vgMark
        }, _aK(model), role ? {
            role: role
        } : {}, {
            from: {
                data: model.requestDataName(_5I.MAIN)
            },
            encode: {
                update: _9N[mark].encodeEntry(model)
            }
        }));
        return marks;
    }

    function _aM() {
        "use strict";

        this.component.axes = _aN.parseAxisComponent(this, [_1F.X, _1F.Y]);
    }

    function _aO(model, axisChannels) {
        "use strict";

        return axisChannels.reduce(function (axis, channel) {
            var axisComponent = {
                axes: [],
                gridAxes: []
            };

            if (model.axis(channel)) {
                // TODO: support multiple axis
                var main = _aP(channel, model);

                if (main && _b8(main)) {
                    axisComponent.axes.push(main);
                }

                var grid = _b9(channel, model);

                if (grid && _b8(grid)) {
                    axisComponent.gridAxes.push(grid);
                }

                axis[channel] = axisComponent;
            }

            return axis;
        }, {});
    }

    function _aP(channel, model) {
        "use strict";

        return _aQ(channel, model, false);
    }

    function _aQ(channel, model, isGridAxis) {
        "use strict";

        var axis = model.axis(channel);
        var vgAxis = {
            scale: model.scaleName(channel)
        }; // 1.2. Add properties

        _n.AXIS_PROPERTIES.forEach(function (property) {
            var value = _aR(property, axis, channel, model, isGridAxis);

            if (value !== _$0.undefined) {
                vgAxis[property] = value;
            }
        }); // Special case for gridScale since gridScale is not a Vega-Lite Axis property.


        var gridScale = _aR('gridScale', axis, channel, model, isGridAxis);

        if (gridScale !== _$0.undefined) {
            vgAxis.gridScale = gridScale;
        } // 2) Add guide encode definition groups


        var encodeSpec = axis.encode || {};

        _b3.forEach(function (part) {
            if (!_b4(vgAxis, part)) {
                // No need to create encode for a disabled part.
                return;
            } // TODO(@yuhanlu): instead of calling encode[part], break this line based on part type
            // as different require different parameters.


            var value;

            if (part === 'labels') {
                value = _b6.labels(model, channel, encodeSpec.labels || {}, vgAxis);
            } else {
                value = encodeSpec[part] || {};
            }

            if (value !== _$0.undefined && _x.keys(value).length > 0) {
                vgAxis.encode = vgAxis.encode || {};
                vgAxis.encode[part] = {
                    update: value
                };
            }
        });

        return vgAxis;
    }

    function _aR(property, specifiedAxis, channel, model, isGridAxis) {
        "use strict";

        var fieldDef = model.fieldDef(channel);

        switch (property) {
            case 'labels':
                return isGridAxis ? false : specifiedAxis[property];

            case 'domain':
                return _aS.domain(property, specifiedAxis, isGridAxis, channel);

            case 'ticks':
                return _aS.ticks(property, specifiedAxis, isGridAxis, channel);

            case 'format':
                return _aS.format(specifiedAxis, channel, fieldDef, model.config);

            case 'grid':
                return _aS.grid(model, channel, isGridAxis);
            // FIXME: refactor this

            case 'gridScale':
                return _aS.gridScale(model, channel, isGridAxis);

            case 'orient':
                return _aS.orient(specifiedAxis, channel);

            case 'tickCount':
                return _aS.tickCount(specifiedAxis, channel, fieldDef);
            // TODO: scaleType

            case 'title':
                return _aS.title(specifiedAxis, fieldDef, model.config, isGridAxis);

            case 'values':
                return _aS.values(specifiedAxis);

            case 'zindex':
                return _aS.zindex(specifiedAxis, isGridAxis);
        } // Otherwise, return specified property.


        return specifiedAxis[property];
    }

    function _aT(specifiedAxis, channel, fieldDef, config) {
        "use strict";

        return _5f.numberFormat(fieldDef, specifiedAxis.format, config, channel);
    }

    function _aU(model, channel) {
        "use strict";

        var grid = model.axis(channel).grid;

        if (grid !== _$0.undefined) {
            return grid;
        }

        return !model.hasDiscreteDomain(channel) && !model.fieldDef(channel).bin;
    }

    function _aV(model, channel, isGridAxis) {
        "use strict";

        if (channel === _1F.ROW || channel === _1F.COLUMN) {
            // never apply grid for ROW and COLUMN since we manually create rule-group for them
            return false;
        }

        if (!isGridAxis) {
            return _$0.undefined;
        }

        return _aU(model, channel);
    }

    function _aW(model, channel, isGridAxis) {
        "use strict";

        if (isGridAxis) {
            var gridChannel = channel === 'x' ? 'y' : 'x';

            if (model.scale(gridChannel)) {
                return model.scaleName(gridChannel);
            }
        }

        return _$0.undefined;
    }

    function _aX(specifiedAxis, channel) {
        "use strict";

        var orient = specifiedAxis.orient;

        if (orient) {
            return orient;
        }

        switch (channel) {
            case _1F.COLUMN:
                // FIXME test and decide
                return 'top';

            case _1F.X:
                return 'bottom';

            case _1F.ROW:
            case _1F.Y:
                return 'left';
        } /* istanbul ignore next: This should never happen. */

        throw new _$0.Error(_2m.message.INVALID_CHANNEL_FOR_AXIS);
    }

    function _aY(specifiedAxis, channel, fieldDef) {
        "use strict";

        var count = specifiedAxis.tickCount;

        if (count !== _$0.undefined) {
            return count;
        } // FIXME depends on scale type too


        if (channel === _1F.X && !fieldDef.bin) {
            // Vega's default tickCount often lead to a lot of label occlusion on X without 90 degree rotation
            return 5;
        }

        return _$0.undefined;
    }

    function _aZ(specifiedAxis, fieldDef, config, isGridAxis) {
        "use strict";

        if (isGridAxis) {
            return _$0.undefined;
        }

        if (specifiedAxis.title === '') {
            return _$0.undefined;
        }

        if (specifiedAxis.title !== _$0.undefined) {
            return specifiedAxis.title;
        } // if not defined, automatically determine axis title from field def


        var fieldTitle = _23.title(fieldDef, config);

        var maxLength = specifiedAxis.titleMaxLength;
        return maxLength ? _x.truncate(fieldTitle, maxLength) : fieldTitle;
    }

    function _b0(specifiedAxis) {
        "use strict";

        var vals = specifiedAxis.values;

        if (specifiedAxis.values && _36.isDateTime(vals[0])) {
            return vals.map(function (dt) {
                // normalize = true as end user won't put 0 = January
                return _36.timestamp(dt, true);
            });
        }

        return vals;
    }

    function _b1(specifiedAxis, isGridAxis) {
        "use strict";

        var z = specifiedAxis.zindex;

        if (z !== _$0.undefined) {
            return z;
        }

        if (isGridAxis) {
            // if grid is true, need to put layer on the back so that grid is behind marks
            return 0;
        }

        return 1; // otherwise return undefined and use Vega's default.
    }

    function _b2(property, specifiedAxis, isGridAxis, channel) {
        "use strict";

        if (isGridAxis || channel === _1F.ROW || channel === _1F.COLUMN) {
            return false;
        }

        return specifiedAxis[property];
    }

    function _b4(axis, part) {
        "use strict";

        // FIXME this method can be wrong if users use a Vega theme.
        // (Not sure how to correctly handle that yet.).
        if (part === 'grid' || part === 'title') {
            return !!axis[part];
        } // Other parts are enabled by default, so they should not be false or null.


        return !_b5(axis[part]);
    }

    function _b5(v) {
        "use strict";

        return v === false || v === null;
    }

    function _b7(model, channel, labelsSpec, def) {
        "use strict";

        var fieldDef = model.fieldDef(channel);
        var axis = model.axis(channel);
        var config = model.config; // Text

        if (fieldDef.type === _3o.TEMPORAL) {
            labelsSpec = _x.extend({
                text: {
                    signal: _5f.timeFormatExpression('datum.value', fieldDef.timeUnit, axis.format, config.axis.shortTimeLabels, config.timeFormat)
                }
            }, labelsSpec);
        } // Label Angle


        if (axis.labelAngle !== _$0.undefined) {
            labelsSpec.angle = {
                value: axis.labelAngle
            };
        } else {
            // auto rotate for X
            if (channel === _1F.X && (_x.contains([_3o.NOMINAL, _3o.ORDINAL], fieldDef.type) || !!fieldDef.bin || fieldDef.type === _3o.TEMPORAL)) {
                labelsSpec.angle = {
                    value: 270
                };
            }
        } // Auto set align if rotated
        // TODO: consider other value besides 270, 90


        if (labelsSpec.angle) {
            if (labelsSpec.angle.value === 270) {
                labelsSpec.align = {
                    value: def.orient === 'top' ? 'left' : channel === _1F.X ? 'right' : 'center'
                };
            } else if (labelsSpec.angle.value === 90) {
                labelsSpec.align = {
                    value: 'center'
                };
            }
        }

        if (labelsSpec.angle) {
            // Auto set baseline if rotated
            // TODO: consider other value besides 270, 90
            if (labelsSpec.angle.value === 270) {
                labelsSpec.baseline = {
                    value: channel === _1F.X ? 'middle' : 'bottom'
                };
            } else if (labelsSpec.angle.value === 90) {
                labelsSpec.baseline = {
                    value: 'bottom'
                };
            }
        }

        return _x.keys(labelsSpec).length === 0 ? _$0.undefined : labelsSpec;
    }

    function _b8(axis) {
        "use strict";

        return _x.some(_b3, function (part) {
            return _b4(axis, part);
        });
    }

    function _b9(channel, model) {
        "use strict";

        // FIXME: support adding ticks for grid axis that are inner axes of faceted plots.
        return _aQ(channel, model, true);
    }

    function _ba() {
        "use strict";

        this.component.legends = _bb.parseLegendComponent(this);
    }

    function _bc(model) {
        "use strict";

        return [_1F.COLOR, _1F.SIZE, _1F.SHAPE, _1F.OPACITY].reduce(function (legendComponent, channel) {
            if (model.legend(channel)) {
                legendComponent[channel] = _bd(model, channel);
            }

            return legendComponent;
        }, {});
    }

    function _bd(model, channel) {
        "use strict";

        var fieldDef = model.fieldDef(channel);
        var legend = model.legend(channel);

        var def = _be(model, channel);

        _bf.LEGEND_PROPERTIES.forEach(function (property) {
            var value = _bh(property, legend, channel, model);

            if (value !== _$0.undefined) {
                def[property] = value;
            }
        }); // 2) Add mark property definition groups


        var encodeSpec = legend.encode || {};
        ['labels', 'legend', 'title', 'symbols'].forEach(function (part) {
            var value = _bm[part] ? _bm[part](fieldDef, encodeSpec[part], model, channel) : encodeSpec[part]; // no rule -- just default values

            if (value !== _$0.undefined && _x.keys(value).length > 0) {
                def.encode = def.encode || {};
                def.encode[part] = {
                    update: value
                };
            }
        });
        return def;
    }

    function _be(model, channel) {
        "use strict";

        // For binned field with continuous scale, use a special scale so we can overrride the mark props and labels
        switch (channel) {
            case _1F.COLOR:
                var scale = model.scaleName(_1F.COLOR);
                return model.markDef.filled ? {
                    fill: scale
                } : {
                    stroke: scale
                };

            case _1F.SIZE:
                return {
                    size: model.scaleName(_1F.SIZE)
                };

            case _1F.SHAPE:
                return {
                    shape: model.scaleName(_1F.SHAPE)
                };

            case _1F.OPACITY:
                return {
                    opacity: model.scaleName(_1F.OPACITY)
                };
        }

        return null;
    }

    function _bh(property, specifiedLegend, channel, model) {
        "use strict";

        var fieldDef = model.fieldDef(channel);

        switch (property) {
            case 'format':
                return _5f.numberFormat(fieldDef, specifiedLegend.format, model.config, channel);

            case 'title':
                return _bi.title(specifiedLegend, fieldDef, model.config);

            case 'values':
                return _bi.values(specifiedLegend);

            case 'type':
                return _bi.type(specifiedLegend, fieldDef.type, channel, model.scale(channel).type);
        } // Otherwise, return specified property.


        return specifiedLegend[property];
    }

    function _bj(legend, fieldDef, config) {
        "use strict";

        if (legend.title !== _$0.undefined) {
            return legend.title;
        }

        return _23.title(fieldDef, config);
    }

    function _bk(legend) {
        "use strict";

        var vals = legend.values;

        if (vals && _36.isDateTime(vals[0])) {
            return vals.map(function (dt) {
                // normalize = true as end user won't put 0 = January
                return _36.timestamp(dt, true);
            });
        }

        return vals;
    }

    function _bl(legend, type, channel, scaleType) {
        "use strict";

        if (legend.type) {
            return legend.type;
        }

        if (channel === _1F.COLOR && (type === 'quantitative' && !_4M.isBinScale(scaleType) || type === 'temporal' && _x.contains(['time', 'utc'], scaleType))) {
            return 'gradient';
        }

        return _$0.undefined;
    }

    function _bn(fieldDef, symbolsSpec, model, channel) {
        "use strict";

        var symbols = {};
        var mark = model.mark();

        switch (mark) {
            case _3x.BAR:
            case _3x.TICK:
            case _3x.TEXT:
                symbols.shape = {
                    value: 'square'
                };
                break;

            case _3x.CIRCLE:
            case _3x.SQUARE:
                symbols.shape = {
                    value: mark
                };
                break;

            case _3x.POINT:
            case _3x.LINE:
            case _3x.AREA:
                // use default circle
                break;
        }

        var cfg = model.config;
        var filled = model.markDef.filled;
        var config = channel === _1F.COLOR ? /* For color's legend, do not set fill (when filled) or stroke (when unfilled) property from config because the legend's `fill` or `stroke` scale should have precedence */_x.without(_3x.FILL_STROKE_CONFIG, [filled ? 'fill' : 'stroke', 'strokeDash', 'strokeDashOffset']) : /* For other legend, no need to omit. */_3x.FILL_STROKE_CONFIG;
        config = _x.without(config, ['strokeDash', 'strokeDashOffset']);

        _5f.applyMarkConfig(symbols, model, config);

        if (channel !== _1F.COLOR) {
            var colorMixins = _9Q.color(model); // If there are field for fill or stroke, remove them as we already apply channels.


            if (colorMixins.fill && _23.isFieldDef(colorMixins.fill)) {
                delete colorMixins.fill;
            }

            if (colorMixins.stroke && _23.isFieldDef(colorMixins.stroke)) {
                delete colorMixins.stroke;
            }

            _x.extend(symbols, colorMixins);
        }

        if (channel !== _1F.SHAPE) {
            var shapeDef = model.encoding.shape;

            if (_23.isValueDef(shapeDef)) {
                symbols.shape = {
                    value: shapeDef.value
                };
            }
        }

        symbols = _x.extend(symbols, symbolsSpec || {});
        return _x.keys(symbols).length > 0 ? symbols : _$0.undefined;
    }

    function _bo(fieldDef, labelsSpec, model, channel) {
        "use strict";

        var legend = model.legend(channel);
        var config = model.config;
        var labels = {};

        if (fieldDef.type === _3o.TEMPORAL) {
            labelsSpec = _x.extend({
                text: {
                    signal: _5f.timeFormatExpression('datum.value', fieldDef.timeUnit, legend.format, config.legend.shortTimeLabels, config.timeFormat)
                }
            }, labelsSpec || {});
        }

        labels = _x.extend(labels, labelsSpec || {});
        return _x.keys(labels).length > 0 ? labels : _$0.undefined;
    }

    function _bp() {
        "use strict";

        if (!this.parent) {
            // only assemble data in the root
            return _7U.assembleData(_x.vals(this.component.data.sources));
        }

        return [];
    }

    function _bq(signals) {
        "use strict";

        return _69.assembleTopLevelSignals(this, signals);
    }

    function _br() {
        "use strict";

        return _69.assembleUnitSelectionSignals(this, []);
    }

    function _bs(data) {
        "use strict";

        return _69.assembleUnitSelectionData(this, data);
    }

    function _bt() {
        "use strict";

        return null;
    }

    function _bu() {
        "use strict";

        return _7N.assembleLayoutUnitSignals(this);
    }

    function _bv() {
        "use strict";

        var marks = this.component.mark || []; // If this unit is part of a layer, selections should augment
        // all in concert rather than each unit individually. This
        // ensures correct interleaving of clipping and brushed marks.

        if (!this.parent || !(this.parent instanceof _7j.LayerModel)) {
            marks = _69.assembleUnitSelectionMarks(this, marks);
        }

        return marks.map(this.correctDataNames);
    }

    function _bw() {
        "use strict";

        return _22.__assign({
            width: this.getSizeSignalRef('width'),
            height: this.getSizeSignalRef('height')
        }, _5f.applyConfig({}, this.config.cell, _3x.FILL_STROKE_CONFIG.concat(['clip'])));
    }

    function _bx() {
        "use strict";

        return _1F.UNIT_CHANNELS;
    }

    function _by() {
        "use strict";

        return this.encoding;
    }

    function _bz(excludeConfig, excludeData) {
        "use strict";

        var encoding = _x.duplicate(this.encoding);

        var spec;
        spec = {
            mark: this.markDef,
            encoding: encoding
        };

        if (!excludeConfig) {
            spec.config = _x.duplicate(this.config);
        }

        if (!excludeData) {
            spec.data = _x.duplicate(this.data);
        } // remove defaults


        return spec;
    }

    function _bA() {
        "use strict";

        return this.markDef.type;
    }

    function _bB(channel) {
        "use strict";

        return _4y.channelHasField(this.encoding, channel);
    }

    function _bC(channel) {
        "use strict";

        // TODO: remove this || {}
        // Currently we have it to prevent null pointer exception.
        return this.encoding[channel] || {};
    }

    function _bD(channel, opt) {
        "use strict";

        if (opt === void 0) {
            opt = {};
        }

        var fieldDef = this.fieldDef(channel);

        if (fieldDef.bin) {
            opt = _x.extend({
                binSuffix: _4M.hasDiscreteDomain(this.scale(channel).type) ? 'range' : 'start'
            }, opt);
        }

        return _23.field(fieldDef, opt);
    }

    function _bE(expr, format) {
        "use strict";

        return "format(" + expr + ", '" + format + "')";
    }

    function _bG(formula) {
        "use strict";

        var _this = _5G.call(this) || this;

        _this.formula = formula;
        return _this;
    }

    function _bI() {
        "use strict";

        return new _bG(_x.duplicate(this.formula));
    }

    function _bJ(other) {
        "use strict";

        this.formula = _x.extend(this.formula, other.formula);
        other.remove();
    }

    function _bK() {
        "use strict";

        var out = {};

        _x.vals(this.formula).forEach(function (f) {
            out[f.as] = true;
        });

        return out;
    }

    function _bL() {
        "use strict";

        var out = {};

        _x.vals(this.formula).forEach(function (f) {
            out[f.field] = true;
        });

        return out;
    }

    function _bM() {
        "use strict";

        return _x.vals(this.formula).map(function (c) {
            return {
                type: 'formula',
                as: c.as,
                expr: _2a.fieldExpr(c.timeUnit, c.field)
            };
        });
    }

    function _bN(model) {
        "use strict";

        var formula = model.reduceFieldDef(function (timeUnitComponent, fieldDef) {
            if (fieldDef.type === _3o.TEMPORAL && fieldDef.timeUnit) {
                var f = _23.field(fieldDef);

                timeUnitComponent[f] = {
                    as: f,
                    timeUnit: fieldDef.timeUnit,
                    field: fieldDef.field
                };
            }

            return timeUnitComponent;
        }, {});

        if (_$0.Object.keys(formula).length === 0) {
            return null;
        }

        return new _bG(formula);
    }

    function _bP(stack) {
        "use strict";

        var _this = _5G.call(this) || this;

        _this._stack = stack;
        return _this;
    }

    function _bR() {
        "use strict";

        return new _bP(_x.duplicate(this._stack));
    }

    function _bS(fields) {
        "use strict";

        this._stack.groupby = this._stack.groupby.concat(fields);
    }

    function _bT() {
        "use strict";

        var out = {};
        out[this._stack.field] = true;

        this._stack.groupby.forEach(function (f) {
            return out[f] = true;
        });

        var field = this._stack.sort.field;
        _K.isArray(field) ? field.forEach(function (f) {
            return out[f] = true;
        }) : out[field] = true;
        return out;
    }

    function _bU() {
        "use strict";

        var out = {};
        out[this._stack.field + '_start'] = true;
        out[this._stack.field + '_end'] = true;
        return out;
    }

    function _bV() {
        "use strict";

        var transform = [];
        var stack = this._stack; // Impute

        if (stack.impute) {
            transform.push({
                type: 'impute',
                field: stack.field,
                groupby: stack.stackby,
                orderby: stack.groupby,
                method: 'value',
                value: 0
            });
        } // Stack


        transform.push({
            type: 'stack',
            groupby: stack.groupby,
            field: stack.field,
            sort: stack.sort,
            as: [stack.field + '_start', stack.field + '_end'],
            offset: stack.offset
        });
        return transform;
    }

    function _bW(model) {
        "use strict";

        var stackProperties = model.stack;

        if (!stackProperties) {
            return null;
        }

        var groupby = [];

        if (stackProperties.groupbyChannel) {
            var groupbyFieldDef = model.fieldDef(stackProperties.groupbyChannel);

            if (groupbyFieldDef.bin) {
                // For Bin, we need to add both start and end to ensure that both get imputed
                // and included in the stack output (https://github.com/vega/vega-lite/issues/1805).
                groupby.push(model.field(stackProperties.groupbyChannel, {
                    binSuffix: 'start'
                }));
                groupby.push(model.field(stackProperties.groupbyChannel, {
                    binSuffix: 'end'
                }));
            } else {
                groupby.push(model.field(stackProperties.groupbyChannel));
            }
        }

        var stackby = _bX(model);

        var orderDef = model.encoding.order;
        var sort;

        if (orderDef) {
            sort = _5f.sortParams(orderDef);
        } else {
            // default = descending by stackFields
            // FIXME is the default here correct for binned fields?
            sort = stackby.reduce(function (s, field) {
                s.field.push(field);
                s.order.push('descending');
                return s;
            }, {
                field: [],
                order: []
            });
        }

        return new _bP({
            groupby: groupby,
            field: model.field(stackProperties.fieldChannel),
            stackby: stackby,
            sort: sort,
            offset: stackProperties.offset,
            impute: _x.contains(['area', 'line'], model.mark())
        });
    }

    function _bX(model) {
        "use strict";

        return model.stack.stackBy.reduce(function (fields, by) {
            var channel = by.channel;
            var fieldDef = by.fieldDef;
            var scale = model.scale(channel);

            var _field = _23.field(fieldDef, {
                binSuffix: scale && _4M.hasDiscreteDomain(scale.type) ? 'range' : 'start'
            });

            if (_field) {
                fields.push(_field);
            }

            return fields;
        }, []);
    }

    function _bZ(source, type) {
        "use strict";

        var _this = _5G.call(this, source) || this;

        _this.type = type;
        _this._refcount = 0;
        _this._source = source;
        return _this;
    }

    function _c1() {
        "use strict";

        var cloneObj = new this.constructor();
        cloneObj._source = this._source;
        cloneObj.debugName = 'clone_' + this.debugName;
        cloneObj._refcount = this._refcount;
        return cloneObj;
    }

    function _c2(roots) {
        "use strict";

        var data = [];
        roots.forEach(_c3); // remove source nodes that don't have any children because they also don't have output nodes

        roots = roots.filter(function (r) {
            return r.numChildren() > 0;
        });

        _c4(roots).forEach(_c5.iterateFromLeaves(_c5.removeUnusedSubtrees));

        roots = roots.filter(function (r) {
            return r.numChildren() > 0;
        });

        _c4(roots).forEach(_c5.iterateFromLeaves(_c5.moveParseUp));

        roots.forEach(_c9); // roots.forEach(debug);

        var walkTree = _7W(data);

        var sourceIndex = 0;
        roots.forEach(function (root) {
            // assign a name if the source does not have a name yet
            if (!root.hasName()) {
                root.dataName = "source_" + sourceIndex++;
            }

            var newData = root.assemble();
            walkTree(root, newData);
        }); // remove empty transform arrays for cleaner output

        data.forEach(function (d) {
            if (d.transform.length === 0) {
                delete d.transform;
            }
        });
        return data;
    }

    function _c3(node) {
        "use strict";

        // remove empty non positive filter
        if (node instanceof _8C.NonPositiveFilterNode && _x.every(_x.vals(node.filter), function (b) {
            return b === false;
        })) {
            node.remove();
        } // remove empty null filter nodes


        if (node instanceof _8c.NullFilterNode && _x.every(_x.vals(node.filteredFields), function (f) {
            return f === null;
        })) {
            node.remove();
        } // remove output nodes that are not required


        if (node instanceof _bY.OutputNode && !node.required) {
            node.remove();
        }

        node.children.forEach(_c3);
    }

    function _c4(roots) {
        "use strict";

        var leaves = [];

        function append(node) {
            if (node.numChildren() === 0) {
                leaves.push(node);
            } else {
                node.children.forEach(append);
            }
        }

        roots.forEach(append);
        return leaves;
    }

    function _c6(f) {
        "use strict";

        function optimizeNextFromLeaves(node) {
            if (node instanceof _5E.SourceNode) {
                return;
            }

            var next = node.parent;

            if (f(node)) {
                optimizeNextFromLeaves(next);
            }
        }

        return optimizeNextFromLeaves;
    }

    function _c7(node) {
        "use strict";

        var parent = node.parent; // move parse up by merging or swapping

        if (node instanceof _5R.ParseNode) {
            if (parent instanceof _5E.SourceNode) {
                return false;
            }

            if (parent.numChildren() > 1) {
                return true;
            }

            if (parent instanceof _5R.ParseNode) {
                parent.merge(node);
            } else {
                node.swapWithParent();
            }
        }

        return true;
    }

    function _c8(node) {
        "use strict";

        var parent = node.parent;

        if (node instanceof _bY.OutputNode || node.numChildren() > 0) {
            // no need to continue with parent because it is output node or will have children (there was a fork)
            return false;
        } else {
            node.remove();
        }

        return true;
    }

    function _c9(node) {
        "use strict";

        if (node instanceof _7X.FacetNode) {
            if (node.numChildren() === 1 && !(node.children[0] instanceof _bY.OutputNode)) {
                // move down until we hit a fork or output node
                var child = node.children[0];

                if (child instanceof _8k.AggregateNode || child instanceof _bO.StackNode) {
                    child.addDimensions(node.fields);
                }

                child.swapWithParent();

                _c9(node);
            } else {
                // move main to facet
                _ca(node.model.component.data.main); // replicate the subtree and place it before the facet's main node


                var copy = _x.flatten(node.children.map(_cb(node)));

                copy.forEach(function (c) {
                    return c.parent = node.model.component.data.main;
                });
            }
        } else {
            node.children.forEach(_c9);
        }
    }

    function _ca(node) {
        "use strict";

        if (node instanceof _bY.OutputNode && node.type === _5I.MAIN) {
            if (node.numChildren() === 1) {
                var child = node.children[0];

                if (!(child instanceof _7X.FacetNode)) {
                    child.swapWithParent();

                    _ca(node);
                }
            }
        }
    }

    function _cb(facet) {
        "use strict";

        function clone(node) {
            if (!(node instanceof _8w.OrderNode)) {
                var copy_1 = node.clone();

                if (copy_1 instanceof _bY.OutputNode) {
                    var newName = _7U.FACET_SCALE_PREFIX + facet.model.getName(copy_1.source);
                    copy_1.source = newName;
                    facet.model.component.data.outputNodes[newName] = copy_1;

                    _x.flatten(node.children.map(clone)).forEach(function (n) {
                        return n.parent = copy_1;
                    });
                } else if (copy_1 instanceof _8k.AggregateNode || copy_1 instanceof _bO.StackNode) {
                    copy_1.addDimensions(facet.fields);

                    _x.flatten(node.children.map(clone)).forEach(function (n) {
                        return n.parent = copy_1;
                    });
                } else {
                    _x.flatten(node.children.map(clone)).forEach(function (n) {
                        return n.parent = copy_1;
                    });
                }

                return [copy_1];
            }

            return _x.flatten(node.children.map(clone));
        }

        return clone;
    }

    function _cc() {
        "use strict";

        // combine with scales from children
        return this.children.reduce(function (scales, c) {
            return scales.concat(c.assembleScales());
        }, _5k.prototype.assembleScales.call(this));
    }

    function _cd() {
        "use strict";

        return null;
    }

    function _ce() {
        "use strict";

        return _69.assembleLayerSelectionMarks(this, _x.flatten(this.children.map(function (child) {
            return child.assembleMarks();
        })));
    }

    function _cf(marks) {
        "use strict";

        return marks.map(function (m) {
            return m.clip = true, m;
        });
    }

    function _cg(model, marks) {
        "use strict";

        var clipGroup = false;
        model.children.forEach(function (child) {
            var unit = _7i(child, marks);

            marks = unit[0];
            clipGroup = clipGroup || unit[1];
        });
        return clipGroup ? _cf(marks) : marks;
    }

    function _ch(name, type, resolve, datum, parent) {
        "use strict";

        var store = _x.stringValue(name + _69.STORE),
            op = _ci[resolve || 'global'];

        datum = datum || 'datum';
        parent = parent === null ? null : 'parent._id';
        return _75(type).predicate + ("(" + store + ", " + parent + ", " + datum + ", " + op + ")");
    }

    function _cj(model, selCmpt, channel, expr) {
        "use strict";

        var scale = _x.stringValue(model.scaleName(channel));

        return selCmpt.domain === 'data' ? "invert(" + scale + ", " + expr + ")" : expr;
    }

    function _ck(selCmpt, channel) {
        "use strict";

        return selCmpt.name + '_' + selCmpt.fields[channel];
    }

    function _cl(v, timeUnit) {
        "use strict";

        if (_36.isDateTime(v)) {
            var expr = _36.dateTimeExpr(v, true);

            return 'time(' + expr + ')';
        }

        if (_2a.isSingleTimeUnit(timeUnit)) {
            var datetime = {};
            datetime[timeUnit] = v;

            var expr = _36.dateTimeExpr(datetime, true);

            return 'time(' + expr + ')';
        }

        return _$0.JSON.stringify(v);
    }

    function _cn() {
        "use strict";

        var _this = this; // Merge selections up the hierarchy so that they may be referenced
        // across unit specs. Persist their definitions within each child
        // to assemble signals which remain within output Vega unit groups.


        this.component.selection = {};

        var _loop_1 = function (child) {
            child.parseSelection();

            _x.keys(child.component.selection).forEach(function (key) {
                _this.component.selection[key] = child.component.selection[key];
            });
        };

        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];

            _loop_1(child);
        }
    }

    function _co() {
        "use strict";

        var model = this;
        var scaleComponent = this.component.scales = {};
        this.children.forEach(function (child) {
            child.parseScale(); // FIXME(#1602): correctly implement independent scale
            // Also need to check whether the scales are actually compatible, e.g. use the same sort or throw error

            if (true) {
                _x.keys(child.component.scales).forEach(function (channel) {
                    if (_x.contains(_1F.NONSPATIAL_SCALE_CHANNELS, channel)) {
                        var childScale = child.component.scales[channel];
                        var modelScale = scaleComponent[channel];

                        if (!childScale || _7r.isSignalRefDomain(childScale.domain) || modelScale && _7r.isSignalRefDomain(modelScale.domain)) {
                            // TODO: merge signal ref domains
                            return;
                        }

                        if (modelScale) {
                            modelScale.domain = _7w.unionDomains(modelScale.domain, childScale.domain);
                        } else {
                            scaleComponent[channel] = childScale;
                        } // rename child scale to parent scales


                        var scaleNameWithoutPrefix = childScale.name.substr(child.getName('').length);
                        var newName = model.scaleName(scaleNameWithoutPrefix, true);
                        child.renameScale(childScale.name, newName);
                        childScale.name = newName; // remove merged scales from children

                        delete child.component.scales[channel];
                    }
                });
            }
        });
    }

    function _cp() {
        "use strict";

        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.parseMark();
        }
    }

    function _cq() {
        "use strict";

        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.parseAxisAndHeader();
        }
    }

    function _cr() {
        "use strict";

        return null;
    }

    function _cs() {
        "use strict";

        var legendComponent = this.component.legends = {};

        var _loop_2 = function (child) {
            child.parseLegend(); // TODO: correctly implement independent legends

            if (true) {
                _x.keys(child.component.legends).forEach(function (channel) {
                    // just use the first legend definition for each channel
                    if (!legendComponent[channel]) {
                        legendComponent[channel] = child.component.legends[channel];
                    }

                    delete child.component.legends[channel];
                });
            }
        };

        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];

            _loop_2(child);
        }
    }

    function _ct() {
        "use strict";

        if (!this.parent) {
            // only assemble data in the root
            return _7U.assembleData(_x.vals(this.component.data.sources));
        }

        return [];
    }

    function _cu() {
        "use strict";

        return null;
    }

    function _cv(signals) {
        "use strict";

        return this.children.reduce(function (sg, child) {
            return child.assembleSelectionTopLevelSignals(sg);
        }, signals);
    }

    function _cw() {
        "use strict";

        this.children.forEach(function (child) {
            return child.assembleSelectionSignals();
        });
        return [];
    }

    function _cx() {
        "use strict";

        return this.children.reduce(function (signals, child) {
            return signals.concat(child.assembleLayoutSignals());
        }, []);
    }

    function _cy(data) {
        "use strict";

        return this.children.reduce(function (db, child) {
            return child.assembleSelectionData(db);
        }, []);
    }

    function _cz() {
        "use strict";

        // combine with scales from children
        return this.children.reduce(function (scales, c) {
            return scales.concat(c.assembleScales());
        }, _5k.prototype.assembleScales.call(this));
    }

    function _cA() {
        "use strict";

        // TODO: allow customization
        return {
            padding: {
                row: 10,
                column: 10
            },
            offset: 10,
            columns: this.repeat && this.repeat.column ? this.repeat.column.length : 1,
            bounds: 'full',
            align: 'all'
        };
    }

    function _cB() {
        "use strict";

        // only children have marks
        return this.children.map(function (child) {
            var encodeEntry = child.assembleParentGroupProperties();
            return _22.__assign({
                type: 'group',
                name: child.getName('group')
            }, encodeEntry ? {
                encode: {
                    update: encodeEntry
                }
            } : {}, child.assembleGroup());
        });
    }

    function _cD(facet) {
        "use strict";

        // clone to prevent side effect to the original spec
        return _4y.reduce(facet, function (normalizedFacet, fieldDef, channel) {
            if (!_x.contains([_1F.ROW, _1F.COLUMN], channel)) {
                // Drop unsupported channel
                _2m.warn(_2m.message.incompatibleChannel(channel, 'facet'));

                return normalizedFacet;
            }

            if (fieldDef.field === _$0.undefined) {
                _2m.warn(_2m.message.emptyFieldDef(fieldDef, channel));

                return normalizedFacet;
            } // Convert type to full, lowercase type, or augment the fieldDef with a default type if missing.


            normalizedFacet[channel] = _23.normalize(fieldDef, channel);
            return normalizedFacet;
        }, {});
    }

    function _cE(channel) {
        "use strict";

        return !!this.facet[channel];
    }

    function _cF(channel) {
        "use strict";

        return true;
    }

    function _cG(channel) {
        "use strict";

        return this.facet[channel];
    }

    function _cH() {
        "use strict";

        this.component.data = _5B.parseData(this);
        this.child.parseData();
    }

    function _cI() {
        "use strict";

        // As a facet has a single child, the selection components are the same.
        // The child maintains its selections to assemble signals, which remain
        // within its unit.
        this.child.parseSelection();
        this.component.selection = this.child.component.selection;
    }

    function _cJ() {
        "use strict";

        var _this = this;

        var child = this.child;
        var model = this;
        child.parseScale();
        var scaleComponent = this.component.scales = {}; // Then, move shared/union from its child spec.

        _x.keys(child.component.scales).forEach(function (channel) {
            // TODO: correctly implement independent scale
            if (true) {
                var scale = scaleComponent[channel] = child.component.scales[channel];
                var scaleNameWithoutPrefix = scale.name.substr(child.getName('').length);
                var newName = model.scaleName(scaleNameWithoutPrefix, true);
                child.renameScale(scale.name, newName);
                scale.name = newName; // Replace the scale domain with data output from a cloned subtree after the facet.

                var domain = scale.domain;

                if (_7r.isDataRefDomain(domain) || _7r.isFieldRefUnionDomain(domain)) {
                    domain.data = _7U.FACET_SCALE_PREFIX + _this.getName(domain.data);
                } else if (_7r.isDataRefUnionedDomain(domain)) {
                    domain.fields = domain.fields.map(function (f) {
                        return _22.__assign({}, f, {
                            data: _7U.FACET_SCALE_PREFIX + _this.getName(f.data)
                        });
                    });
                } // Once put in parent, just remove the child's scale.


                delete child.component.scales[channel];
            }
        });
    }

    function _cK() {
        "use strict";

        this.child.parseMark();
        this.component.mark = [{
            name: this.getName('cell'),
            type: 'group',
            from: {
                facet: {
                    name: this.component.data.facetRoot.name,
                    data: this.component.data.facetRoot.data,
                    groupby: [].concat(this.channelHasField(_1F.ROW) ? [this.field(_1F.ROW)] : [], this.channelHasField(_1F.COLUMN) ? [this.field(_1F.COLUMN)] : [])
                }
            },
            encode: {
                update: _cL(this)
            }
        }];
    }

    function _cL(model) {
        "use strict";

        var encodeEntry = model.child.assembleParentGroupProperties();
        return _22.__assign({}, encodeEntry ? encodeEntry : {}, _5f.applyConfig({}, model.config.facet.cell, _3x.FILL_STROKE_CONFIG.concat(['clip'])));
    }

    function _cM() {
        "use strict";

        this.child.parseAxisAndHeader();
        this.parseHeader('column');
        this.parseHeader('row');
        this.mergeChildAxis('x');
        this.mergeChildAxis('y');
    }

    function _cN(channel) {
        "use strict";

        if (this.channelHasField(channel)) {
            var fieldDef = this.facet[channel];
            var header = fieldDef.header || {};
            var title = header.title !== _$0.undefined ? header.title : _23.title(fieldDef, this.config);

            if (this.child.component.layoutHeaders[channel].title) {
                // merge title with child to produce "Title / Subtitle / Sub-subtitle"
                title += ' / ' + this.child.component.layoutHeaders[channel].title;
                this.child.component.layoutHeaders[channel].title = null;
            }

            this.component.layoutHeaders[channel] = {
                title: title,
                fieldRef: _5f.formatSignalRef(fieldDef, header.format, 'parent', this.config, true),
                // TODO: support adding label to footer as well
                header: [this.makeHeaderComponent(channel, true)]
            };
        }
    }

    function _cO(channel, labels) {
        "use strict";

        var sizeChannel = channel === 'row' ? 'height' : 'width';
        return {
            labels: labels,
            sizeSignal: this.child.getSizeSignalRef(sizeChannel),
            axes: []
        };
    }

    function _cP(channel) {
        "use strict";

        var child = this.child;

        if (child.component.axes[channel]) {
            // TODO: read these from the resolve syntax
            var scaleResolve = 'shared';
            var axisResolve = 'shared';

            if (scaleResolve === 'shared' && axisResolve === 'shared') {
                // For shared axis, move the axes to facet's header or footer
                var headerChannel = channel === 'x' ? 'column' : 'row';
                var layoutHeader = this.component.layoutHeaders[headerChannel];

                for (var _i = 0, _a = child.component.axes[channel].axes; _i < _a.length; _i++) {
                    var axis = _a[_i];

                    var headerType = _cQ.getHeaderType(axis.orient);

                    layoutHeader[headerType] = layoutHeader[headerType] || [this.makeHeaderComponent(headerChannel, false)];
                    layoutHeader[headerType][0].axes.push(axis);
                }

                child.component.axes[channel].axes = [];
            } else {}
        }
    }

    function _cT(orient) {
        "use strict";

        if (orient === 'top' || orient === 'left') {
            return 'header';
        }

        return 'footer';
    }

    function _cU(model, channel) {
        "use strict";

        var sizeChannel = channel === 'row' ? 'height' : 'width';
        var title = model.component.layoutHeaders[channel].title;
        var positionChannel = channel === 'row' ? 'y' : 'x';
        var align = channel === 'row' ? 'right' : 'center';
        var textOrient = channel === 'row' ? 'vertical' : _$0.undefined;
        return {
            name: model.getName(channel + "_title"),
            role: channel + "-title",
            type: 'group',
            marks: [{
                type: 'text',
                role: channel + "-title-text",
                encode: {
                    update: _22.__assign((_a = {}, _a[positionChannel] = {
                        signal: "0.5 * " + sizeChannel
                    }, _a.align = {
                        value: align
                    }, _a.text = {
                        value: title
                    }, _a.fill = {
                        value: 'black'
                    }, _a.fontWeight = {
                        value: 'bold'
                    }, _a), textOrient === 'vertical' ? {
                        angle: {
                            value: 270
                        }
                    } : {})
                }
            }]
        };

        var _a;
    }

    function _cV(model, channel, headerType, layoutHeader, header) {
        "use strict";

        if (header) {
            var title = null;

            if (layoutHeader.fieldRef && header.labels) {
                title = {
                    text: layoutHeader.fieldRef,
                    offset: 10,
                    orient: channel === 'row' ? 'left' : 'top',
                    encode: {
                        update: _22.__assign({
                            fontWeight: {
                                value: 'normal'
                            },
                            angle: {
                                value: 0
                            },
                            fontSize: {
                                value: 10
                            }
                        }, channel === 'row' ? {
                            align: {
                                value: 'right'
                            },
                            baseline: {
                                value: 'middle'
                            }
                        } : {})
                    }
                };
            }

            var axes = header.axes;
            var hasAxes = axes && axes.length > 0;

            if (title || hasAxes) {
                var sizeChannel = channel === 'row' ? 'height' : 'width';
                return _22.__assign({
                    name: model.getName(channel + "_" + headerType),
                    type: 'group',
                    role: channel + "-" + headerType
                }, layoutHeader.fieldRef ? {
                    from: {
                        data: model.getName(channel)
                    }
                } : {}, title ? {
                    title: title
                } : {}, {
                    encode: {
                        update: (_a = {}, _a[sizeChannel] = header.sizeSignal, _a)
                    }
                }, hasAxes ? {
                    axes: axes
                } : {});
            }
        }

        return null;

        var _a;
    }

    function _cW() {
        "use strict";

        this.child.parseLegend(); // TODO: support legend for independent non-position scale across facets
        // TODO: support legend for field reference of parent data (e.g., for SPLOM)
        // For now, assuming that non-positional scales are always shared across facets
        // Thus, just move all legends from its child

        this.component.legends = this.child.component.legends;
        this.child.component.legends = {};
    }

    function _cX() {
        "use strict";

        if (!this.parent) {
            // only assemble data in the root
            return _7U.assembleData(_x.vals(this.component.data.sources));
        }

        return [];
    }

    function _cY() {
        "use strict";

        return null;
    }

    function _cZ(signals) {
        "use strict";

        return this.child.assembleSelectionTopLevelSignals(signals);
    }

    function _d0() {
        "use strict";

        this.child.assembleSelectionSignals();
        return [];
    }

    function _d1(data) {
        "use strict";

        return this.child.assembleSelectionData(data);
    }

    function _d2() {
        "use strict";

        var columns = this.channelHasField('column') ? {
            signal: this.columnDistinctSignal()
        } : 1; // TODO: determine default align based on shared / independent scales

        return {
            padding: {
                row: 10,
                column: 10
            },
            // TODO: support offset for rowHeader/rowFooter/rowTitle/columnHeader/columnFooter/columnTitle
            offset: 10,
            columns: columns,
            bounds: 'full'
        };
    }

    function _d3() {
        "use strict";

        // FIXME(https://github.com/vega/vega-lite/issues/1193): this can be incorrect if we have independent scales.
        return this.child.assembleLayoutSignals();
    }

    function _d4() {
        "use strict";

        // In facetNode.assemble(), the name is always this.getName('column') + '_layout'.
        var facetLayoutDataName = this.getName('column') + '_layout';
        var columnDistinct = this.field('column', {
            prefix: 'distinct'
        });
        return "data('" + facetLayoutDataName + "')[0][" + _x.stringValue(columnDistinct) + "]";
    }

    function _d5() {
        "use strict";

        var facetRoot = this.component.data.facetRoot;

        var data = _7U.assembleFacetData(facetRoot);

        var mark = this.component.mark[0]; // correct the name of the faceted data source

        mark.from.facet = _22.__assign({}, mark.from.facet, {
            name: facetRoot.name,
            data: facetRoot.data
        });
        var marks = [_22.__assign({}, data.length > 0 ? {
            data: data
        } : {}, mark, this.child.assembleGroup())];
        return marks.map(this.correctDataNames);
    }

    function _d6() {
        "use strict";

        return [_1F.ROW, _1F.COLUMN];
    }

    function _d7() {
        "use strict";

        return this.facet;
    }

    function _d9(spec, parent, parentGivenName, repeater, config) {
        "use strict";

        var _this = _5k.call(this, spec, parent, parentGivenName, config) || this;

        _this.isVConcat = _4k.isVConcatSpec(spec);
        _this.children = (_4k.isVConcatSpec(spec) ? spec.vconcat : spec.hconcat).map(function (child, i) {
            return _5f.buildModel(child, _this, _this.getName('concat_' + i), _$0.undefined, repeater, config);
        });
        return _this;
    }

    function _db() {
        "use strict";

        this.component.data = _5B.parseData(this);
        this.children.forEach(function (child) {
            child.parseData();
        });
    }

    function _dc() {
        "use strict";

        var _this = this; // Merge selections up the hierarchy so that they may be referenced
        // across unit specs. Persist their definitions within each child
        // to assemble signals which remain within output Vega unit groups.


        this.component.selection = {};

        var _loop_1 = function (child) {
            child.parseSelection();

            _x.keys(child.component.selection).forEach(function (key) {
                _this.component.selection[key] = child.component.selection[key];
            });
        };

        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];

            _loop_1(child);
        }
    }

    function _dd() {
        "use strict";

        var model = this;
        var scaleComponent = this.component.scales = {};
        this.children.forEach(function (child) {
            child.parseScale();
        });
    }

    function _de() {
        "use strict";

        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.parseMark();
        }
    }

    function _df() {
        "use strict";

        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.parseAxisAndHeader();
        }
    }

    function _dg() {
        "use strict";

        return null;
    }

    function _dh() {
        "use strict";

        var legendComponent = this.component.legends = {};

        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.parseLegend();
        }
    }

    function _di() {
        "use strict";

        if (!this.parent) {
            // only assemble data in the root
            return _7U.assembleData(_x.vals(this.component.data.sources));
        }

        return [];
    }

    function _dj() {
        "use strict";

        return null;
    }

    function _dk(signals) {
        "use strict";

        return this.children.reduce(function (sg, child) {
            return child.assembleSelectionTopLevelSignals(sg);
        }, signals);
    }

    function _dl() {
        "use strict";

        this.children.forEach(function (child) {
            return child.assembleSelectionSignals();
        });
        return [];
    }

    function _dm() {
        "use strict";

        return this.children.reduce(function (signals, child) {
            return signals.concat(child.assembleLayoutSignals());
        }, []);
    }

    function _dn(data) {
        "use strict";

        return this.children.reduce(function (db, child) {
            return child.assembleSelectionData(db);
        }, []);
    }

    function _do() {
        "use strict";

        // combine with scales from children
        return this.children.reduce(function (scales, c) {
            return scales.concat(c.assembleScales());
        }, _5k.prototype.assembleScales.call(this));
    }

    function _dp() {
        "use strict";

        // TODO: allow customization
        return _22.__assign({
            padding: {
                row: 10,
                column: 10
            },
            offset: 10
        }, this.isVConcat ? {
            columns: 1
        } : {}, {
            bounds: 'full',
            align: 'all'
        });
    }

    function _dq() {
        "use strict";

        // only children have marks
        return this.children.map(function (child) {
            var encodeEntry = child.assembleParentGroupProperties();
            return _22.__assign({
                type: 'group',
                name: child.getName('group')
            }, encodeEntry ? {
                encode: {
                    update: encodeEntry
                }
            } : {}, child.assembleGroup());
        });
    }

    function _dr(e, config, // TODO(#1842): consolidate MarkConfig | TextConfig?
    propsList) {
        "use strict";

        for (var _i = 0, propsList_1 = propsList; _i < propsList_1.length; _i++) {
            var property = propsList_1[_i];
            var value = config[property];

            if (value !== _$0.undefined) {
                e[property] = {
                    value: value
                };
            }
        }

        return e;
    }

    function _ds(e, model, propsList) {
        "use strict";

        for (var _i = 0, propsList_2 = propsList; _i < propsList_2.length; _i++) {
            var property = propsList_2[_i];

            var value = _dt(property, model.mark(), model.config);

            if (value !== _$0.undefined) {
                e[property] = {
                    value: value
                };
            }
        }

        return e;
    }

    function _dt(prop, mark, config) {
        "use strict";

        var markSpecificConfig = config[mark];

        if (markSpecificConfig[prop] !== _$0.undefined) {
            return markSpecificConfig[prop];
        }

        return config.mark[prop];
    }

    function _du(fieldDef, specifiedFormat, expr, config, useBinRange) {
        "use strict";

        if (fieldDef.type === 'quantitative') {
            var format = _dv(fieldDef, specifiedFormat, config, 'text');

            if (fieldDef.bin) {
                if (useBinRange) {
                    // For bin range, no need to apply format as the formula that creates range already include format
                    return {
                        signal: _23.field(fieldDef, {
                            expr: expr,
                            binSuffix: 'range'
                        })
                    };
                } else {
                    return {
                        signal: "format(" + _23.field(fieldDef, {
                            expr: expr,
                            binSuffix: 'start'
                        }) + ", '" + format + "')" + "+'-'+" + ("format(" + _23.field(fieldDef, {
                            expr: expr,
                            binSuffix: 'end'
                        }) + ", '" + format + "')")
                    };
                }
            } else {
                return {
                    signal: "format(" + _23.field(fieldDef, {
                        expr: expr
                    }) + ", '" + format + "')"
                };
            }
        } else if (fieldDef.type === 'temporal') {
            return {
                signal: _dw(_23.field(fieldDef, {
                    expr: expr
                }), fieldDef.timeUnit, specifiedFormat, config.text.shortTimeLabels, config.timeFormat)
            };
        } else {
            return {
                signal: _23.field(fieldDef, {
                    expr: expr
                })
            };
        }
    }

    function _dv(fieldDef, specifiedFormat, config, channel) {
        "use strict";

        // Specified format in axis/legend has higher precedence than fieldDef.format
        var format = specifiedFormat;

        if (fieldDef.type === _3o.QUANTITATIVE) {
            // add number format for quantitative type only
            if (format) {
                return format;
            } else if (fieldDef.aggregate === 'count' && channel === _1F.TEXT) {
                // FIXME: need a more holistic way to deal with this.
                return 'd';
            } // TODO: need to make this work correctly for numeric ordinal / nominal type


            return config.numberFormat;
        }

        return _$0.undefined;
    }

    function _dw(field, timeUnit, format, shortTimeLabels, timeFormatConfig) {
        "use strict";

        if (!timeUnit || format) {
            // If there is not time unit, or if user explicitly specify format for axis/legend/text.
            var _format = format || timeFormatConfig; // only use config.timeFormat if there is no timeUnit.


            return "timeFormat(" + field + ", '" + _format + "')";
        } else {
            return _2a.formatExpression(timeUnit, field, shortTimeLabels);
        }
    }

    function _dx(orderDef) {
        "use strict";

        return (_x.isArray(orderDef) ? orderDef : [orderDef]).reduce(function (s, orderChannelDef) {
            s.field.push(_23.field(orderChannelDef, {
                binSuffix: 'start'
            }));
            s.order.push(orderChannelDef.sort || 'ascending');
            return s;
        }, {
            field: [],
            order: []
        });
    }

    function _dy(model, topLevelProperties) {
        "use strict";

        // TODO: change type to become VgSpec
        var output = _22.__assign({
            $schema: 'http://vega.github.io/schema/vega/v3.0.json'
        }, model.description ? {
            description: model.description
        } : {}, {
            autosize: 'pad'
        }, topLevelProperties, {
            data: [].concat(model.assembleSelectionData([]), model.assembleData()),
            signals: [].concat( // TODO(https://github.com/vega/vega-lite/issues/2198):
            // Merge the top-level's width/height signal with the top-level model
            // so we can remove this special casing based on model.name
            model.name ? [// If model has name, its calculated width and height will not be named width and height, need to map it to the global width and height signals.
            {
                name: 'width',
                update: model.getName('width')
            }, {
                name: 'height',
                update: model.getName('height')
            }] : [], model.assembleLayoutSignals(), model.assembleSelectionTopLevelSignals([]))
        }, _dz(model));

        return {
            spec: output
        };
    }

    function _dz(model) {
        "use strict";

        var _a = model.assembleGroup([]),
            layout = _a.layout,
            signals = _a.signals,
            group = _22.__rest(_a, ["layout", "signals"]);

        var marks = group.marks;
        var parentEncodeEntry = model.assembleParentGroupProperties();
        return _22.__assign({}, group, {
            marks: [_22.__assign({
                name: model.getName('nested_main_group'),
                type: 'group',
                layout: layout,
                signals: signals
            }, parentEncodeEntry ? {
                encode: {
                    update: parentEncodeEntry
                }
            } : {}, {
                marks: marks
            })]
        });
    }

    function _dA(topLevelSpec, config) {
        "use strict";

        return _22.__assign({}, _dB.extractTopLevelProperties(config), _dB.extractTopLevelProperties(topLevelSpec));
    }

    function _dC(t) {
        "use strict";

        return _dD.reduce(function (o, p) {
            if (t && t[p] !== _$0.undefined) {
                o[p] = t[p];
            }

            return o;
        }, {});
    }

    function _dT(spec, requiredChannelMap, supportedChannelMap) {
        "use strict";

        if (requiredChannelMap === void 0) {
            requiredChannelMap = _dF.DEFAULT_REQUIRED_CHANNEL_MAP;
        }

        if (supportedChannelMap === void 0) {
            supportedChannelMap = _dF.DEFAULT_SUPPORTED_CHANNEL_TYPE;
        }

        var mark = _3x.isMarkDef(spec.mark) ? spec.mark.type : spec.mark;
        var encoding = spec.encoding;
        var requiredChannels = requiredChannelMap[mark];
        var supportedChannels = supportedChannelMap[mark];

        for (var i in requiredChannels) {
            if (!(requiredChannels[i] in encoding)) {
                return 'Missing encoding channel \"' + requiredChannels[i] + '\" for mark \"' + mark + '\"';
            }
        }

        for (var channel in encoding) {
            if (!supportedChannels[channel]) {
                return 'Encoding channel \"' + channel + '\" is not supported by mark type \"' + mark + '\"';
            }
        }

        if (mark === _3x.BAR && !encoding.x && !encoding.y) {
            return 'Missing both x and y for bar';
        }

        return null;
    }

    function _dU() {
        "use strict";

        return this;
    }

    function _dV() {
        "use strict";

        var args = [];

        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }

        (_a = this.warns).push.apply(_a, args);

        return this;

        var _a;
    }

    function _dW() {
        "use strict";

        var args = [];

        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }

        (_a = this.infos).push.apply(_a, args);

        return this;

        var _a;
    }

    function _dX() {
        "use strict";

        var args = [];

        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }

        (_a = this.debugs).push.apply(_a, args);

        return this;

        var _a;
    }

    function _dY(oldName, newName) {
        "use strict";

        this.nameMap[oldName] = newName;
    }

    function _dZ(name) {
        "use strict";

        return this.nameMap[name] !== _$0.undefined;
    }

    function _e0(name) {
        "use strict";

        // If the name appears in the _nameMap, we need to read its new name.
        // We have to loop over the dict just in case the new name also gets renamed.
        while (this.nameMap[name]) {
            name = this.nameMap[name];
        }

        return name;
    }

    function _e1() {
        "use strict";

        this.parseData();
        this.parseScale(); // depends on data name

        this.parseSelection();
        this.parseAxisAndHeader(); // depends on scale name

        this.parseLegend(); // depends on scale name

        this.parseMark(); // depends on data name and scale name, axisGroup, and children's scale, axis, legend and mark.
    }

    function _e2() {
        "use strict";

        return _e3.assembleScale(this);
    }

    function _e4(model) {
        "use strict";

        return _x.vals(model.component.scales).map(function (scale) {
            // As selections are parsed _after_ scales, we can only shim in a domainRaw
            // in the output Vega during assembly. FIXME: This should be moved to
            // selection.ts, but any reference to it throws an error. Possible circular dependency?
            var raw = scale.domainRaw;

            if (raw && raw.selection) {
                raw.field = raw.field || null;
                raw.encoding = raw.encoding || null;
                var selName = raw.selection;
                var selCmpt = model.component.selection && model.component.selection[selName];

                if (selCmpt) {
                    _2m.warn('Use "bind": "scales" to setup a binding for scales and selections within the same view.');
                } else {
                    selCmpt = model.getComponent('selection', selName);
                    scale.domainRaw = {
                        signal: (selCmpt.type === 'interval' ? 'vlIntervalDomain' : 'vlPointDomain') + ("(" + _x.stringValue(selCmpt.name + '_store') + ", " + _x.stringValue(raw.encoding) + ", " + _x.stringValue(raw.field) + ", ") + (_x.stringValue(_e5[selCmpt.resolve]) + ")")
                    };
                }
            } // correct references to data


            var domain = scale.domain;

            if (_7r.isDataRefDomain(domain) || _7r.isFieldRefUnionDomain(domain)) {
                domain.data = model.lookupDataSource(domain.data);
                return scale;
            } else if (_7r.isDataRefUnionedDomain(domain)) {
                domain.fields = domain.fields.map(function (f) {
                    return _22.__assign({}, f, {
                        data: model.lookupDataSource(f.data)
                    });
                });
                return scale;
            } else if (_7r.isSignalRefDomain(domain) || _K.isArray(domain)) {
                return scale;
            } else {
                throw new _$0.Error('invalid scale domain');
            }
        });
    }

    function _e6() {
        "use strict";

        var layoutHeaders = this.component.layoutHeaders;
        var headerMarks = [];

        for (var _i = 0, HEADER_CHANNELS_1 = _cQ.HEADER_CHANNELS; _i < HEADER_CHANNELS_1.length; _i++) {
            var channel = HEADER_CHANNELS_1[_i];

            if (layoutHeaders[channel].title) {
                headerMarks.push(_cQ.getTitleGroup(this, channel));
            }
        }

        for (var _a = 0, HEADER_CHANNELS_2 = _cQ.HEADER_CHANNELS; _a < HEADER_CHANNELS_2.length; _a++) {
            var channel = HEADER_CHANNELS_2[_a];
            var layoutHeader = layoutHeaders[channel];

            for (var _b = 0, HEADER_TYPES_1 = _cQ.HEADER_TYPES; _b < HEADER_TYPES_1.length; _b++) {
                var headerType = HEADER_TYPES_1[_b];

                if (layoutHeader[headerType]) {
                    for (var _c = 0, _d = layoutHeader[headerType]; _c < _d.length; _c++) {
                        var header = _d[_c];

                        var headerGroup = _cQ.getHeaderGroup(this, channel, headerType, layoutHeader, header);

                        if (headerGroup) {
                            headerMarks.push(headerGroup);
                        }
                    }
                }
            }
        }

        return headerMarks;
    }

    function _e7() {
        "use strict";

        var _a = this.component.axes,
            x = _a.x,
            y = _a.y;
        return (x ? x.axes.concat(x.gridAxes) : []).concat(y ? y.axes.concat(y.gridAxes) : []);
    }

    function _e8() {
        "use strict";

        return _x.vals(this.component.legends);
    }

    function _e9(signals) {
        "use strict";

        if (signals === void 0) {
            signals = [];
        }

        var group = {};
        signals = signals.concat(this.assembleSelectionSignals());

        if (signals.length > 0) {
            group.signals = signals;
        }

        var layout = this.assembleLayout();

        if (layout) {
            group.layout = layout;
        }

        group.marks = [].concat(this.assembleHeaderMarks(), this.assembleMarks());
        var scales = this.assembleScales();

        if (scales.length > 0) {
            group.scales = scales;
        }

        var axes = this.assembleAxes();

        if (axes.length > 0) {
            group.axes = axes;
        }

        var legends = this.assembleLegends();

        if (legends.length > 0) {
            group.legends = legends;
        }

        return group;
    }

    function _ea(channel) {
        "use strict";

        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];

            if (child instanceof _8S.UnitModel) {
                if (child.channelHasField(channel)) {
                    return true;
                }
            } else {
                if (child.hasDescendantWithFieldOnChannel(channel)) {
                    return true;
                }
            }
        }

        return false;
    }

    function _eb(text) {
        "use strict";

        return _x.varName((this.name ? this.name + '_' : '') + text);
    }

    function _ec(name) {
        "use strict";

        var fullName = this.getName(name);
        return this.lookupDataSource(fullName);
    }

    function _ed(sizeType) {
        "use strict";

        // TODO: this could change in the future once we have sizeSignal merging
        return {
            signal: this.getName(sizeType)
        };
    }

    function _ee(name) {
        "use strict";

        var node = this.component.data.outputNodes[name];

        if (!node) {
            // name not found in map so let's just return what we got
            return name;
        }

        return node.source;
    }

    function _ef(oldName, newName) {
        "use strict";

        this.sizeNameMap.rename(oldName, newName);
    }

    function _eg(channel) {
        "use strict";

        return this.sizeName(channel === _1F.X || channel === _1F.COLUMN ? 'width' : 'height');
    }

    function _eh(size) {
        "use strict";

        return this.sizeNameMap.get(this.getName(size));
    }

    function _ei(oldName, newName) {
        "use strict";

        this.scaleNameMap.rename(oldName, newName);
    }

    function _ej(channel) {
        "use strict";

        return null;
    }

    function _ek(originalScaleName, parse) {
        "use strict";

        if (parse) {
            // During the parse phase always return a value
            // No need to refer to rename map because a scale can't be renamed
            // before it has the original name.
            return this.getName(originalScaleName);
        } // If there is a scale for the channel, it should either
        // be in the _scale mapping or exist in the name map


        if ( // in the scale map (the scale is not merged by its parent)
        this.scale && _1F.isChannel(originalScaleName) && this.scale(originalScaleName) || // in the scale name map (the the scale get merged by its parent)
        this.scaleNameMap.has(this.getName(originalScaleName))) {
            return this.scaleNameMap.get(this.getName(originalScaleName));
        }

        return _$0.undefined;
    }

    function _el(type, name) {
        "use strict";

        return this.component[type][name] || this.parent.getComponent(type, name);
    }

    function _em() {
        "use strict";

        throw new _$0.Error('Cannot clone node');
    }

    function _en() {
        "use strict";

        return {};
    }

    function _eo() {
        "use strict";

        return {};
    }

    function _ep(parent) {
        "use strict";

        this._parent = parent;
        parent.addChild(this);
    }

    function _eq() {
        "use strict";

        return this._children;
    }

    function _er() {
        "use strict";

        return this._children.length;
    }

    function _es(child) {
        "use strict";

        this._children.push(child);
    }

    function _et(oldChild) {
        "use strict";

        this._children.splice(this._children.indexOf(oldChild), 1);
    }

    function _eu() {
        "use strict";

        var _this = this;

        this._children.forEach(function (child) {
            return child.parent = _this._parent;
        });

        this._parent.removeChild(this);
    }

    function _ev() {
        "use strict";

        var parent = this._parent;
        var newParent = parent.parent; // reconnect the children

        this._children.forEach(function (c) {
            return c.parent = parent;
        }); // remove old links


        this._children = []; // equivalent to removing every child link one by one

        parent.removeChild(this);
        parent.parent.removeChild(parent); // swap two nodes

        this.parent = newParent;
        parent.parent = this;
    }

    function _ew() {
        "use strict";

        return this._data;
    }

    function _ex(name) {
        "use strict";

        this._name = name;
    }

    function _ey(parent) {
        "use strict";

        throw new _$0.Error('Source nodes have to be roots.');
    }

    function _ez() {
        "use strict";

        return this._parse;
    }

    function _eA() {
        "use strict";

        var fields = [];

        if (this.columnField) {
            fields.push(this.columnField);
        }

        if (this.rowField) {
            fields.push(this.rowField);
        }

        return fields;
    }

    function _eB() {
        "use strict";

        return this.name;
    }

    function _eC() {
        "use strict";

        return this._filteredFields;
    }

    function _eD() {
        "use strict";

        return this._filter;
    }

    function _eE() {
        "use strict";

        return this._stack;
    }

    function _eF(source) {
        "use strict";

        this._source = source;
    }

    function _eG() {
        "use strict";

        return this._refcount > 0;
    }

    function _eH() {
        "use strict";

        this._refcount++;
        return this._source;
    }

    function _eI() {
        "use strict";

        return this._name;
    }

    function _eJ() {
        "use strict";

        return this._parent;
    }

    var _1 = Object.setPrototypeOf;
    __extends = _0;
    var _2 = Object.assign;
    __assign = _2;
    __rest = _3;
    __decorate = _4;
    __param = _5;
    __metadata = _6;
    __awaiter = _7;
    __generator = _8;
    __exportStar = _9;
    __values = _f;
    __read = _g;
    __spread = _h;
    __asyncGenerator = _j;
    __asyncDelegator = _k;
    __asyncValues = _l;
    var _n = {
        AXIS_PROPERTIES: ["domain", "format", "grid", "labelPadding", "labels", "maxExtent", "minExtent", "offset", "orient", "position", "tickCount", "ticks", "tickSize", "title", "titlePadding", "values", "zindex"]
    };
    var _p = {
        AGGREGATE_OPS: ["values", "count", "valid", "missing", "distinct", "sum", "mean", "average", "variance", "variancep", "stdev", "stdevp", "median", "q1", "q3", "ci0", "ci1", "modeskew", "min", "max", "argmin", "argmax"],
        AGGREGATE_OP_INDEX: {
            values: 1,
            count: 1,
            valid: 1,
            missing: 1,
            distinct: 1,
            sum: 1,
            mean: 1,
            average: 1,
            variance: 1,
            variancep: 1,
            stdev: 1,
            stdevp: 1,
            median: 1,
            q1: 1,
            q3: 1,
            ci0: 1,
            ci1: 1,
            modeskew: 1,
            min: 1,
            max: 1,
            argmin: 1,
            argmax: 1
        },
        SUM_OPS: ["count", "sum", "distinct", "valid", "missing"],
        SHARED_DOMAIN_OPS: ["mean", "average", "median", "q1", "q3", "min", "max"],
        SHARED_DOMAIN_OP_INDEX: {
            mean: 1,
            average: 1,
            median: 1,
            q1: 1,
            q3: 1,
            min: 1,
            max: 1
        }
    };
    var _z = Array.isArray;
    _O.fields = ["id"];
    _O.fname = "id";
    var _R = [];
    _Q.fields = _R;
    _Q.fname = "identity";
    _S.fields = _R;
    _S.fname = "zero";
    _T.fields = _R;
    _T.fname = "one";
    _U.fields = _R;
    _U.fname = "true";
    _V.fields = _R;
    _V.fname = "false";
    var _16 = {};
    var _K = {
        accessor: _L,
        accessorName: _M,
        accessorFields: _N,
        id: _O,
        identity: _Q,
        zero: _S,
        one: _T,
        truthy: _U,
        falsy: _V,
        logger: _W,
        None: 0,
        Warn: 1,
        Info: 2,
        Debug: 3,
        array: _Y,
        compare: _Z,
        constant: _12,
        error: _11,
        extend: _y,
        extentIndex: _14,
        fastmap: _15,
        field: _17,
        inherits: _18,
        isArray: _z,
        isBoolean: _19,
        isDate: _1a,
        isFunction: _13,
        isNumber: _B,
        isObject: _A,
        isRegExp: _1b,
        isString: _C,
        key: _1c,
        merge: _1d,
        pad: _1e,
        peek: _1g,
        repeat: _1f,
        splitAccessPath: _10,
        stringValue: _F,
        toBoolean: _1h,
        toDate: _1i,
        toNumber: _1j,
        toString: _1k,
        toSet: _E,
        truncate: _D,
        visitArray: _1l
    };
    var _1o = JSON;
    var _1p = Object.keys;
    var _x = {
        extend: _y,
        isArray: _z,
        isObject: _A,
        isNumber: _B,
        isString: _C,
        truncate: _D,
        toSet: _E,
        stringValue: _F,
        pick: _G,
        omit: _H,
        hash: _J,
        contains: _1q,
        without: _1r,
        union: _1s,
        some: _1t,
        every: _1u,
        flatten: _1v,
        mergeDeep: _1w,
        unique: _1y,
        differ: _1z,
        hasIntersection: _1A,
        differArray: _1B,
        keys: _1p,
        vals: _1C,
        duplicate: _I,
        isBoolean: _1m,
        varName: _1D
    };
    var _1J = {
        x: 1,
        y: 1,
        x2: 1,
        y2: 1,
        row: 1,
        column: 1,
        size: 1,
        shape: 1,
        color: 1,
        order: 1,
        opacity: 1,
        text: 1,
        detail: 1,
        tooltip: 1
    };
    var _1W = {
        linear: 1,
        "bin-linear": 1,
        log: 1,
        pow: 1,
        sqrt: 1,
        time: 1,
        utc: 1,
        "bin-ordinal": 1,
        point: 1,
        band: 1
    };
    var _1F = {
        Channel: {
            ROW: "row",
            COLUMN: "column",
            X: "x",
            Y: "y",
            X2: "x2",
            Y2: "y2",
            COLOR: "color",
            SHAPE: "shape",
            SIZE: "size",
            OPACITY: "opacity",
            TEXT: "text",
            ORDER: "order",
            DETAIL: "detail",
            TOOLTIP: "tooltip"
        },
        X: "x",
        Y: "y",
        X2: "x2",
        Y2: "y2",
        ROW: "row",
        COLUMN: "column",
        SHAPE: "shape",
        SIZE: "size",
        COLOR: "color",
        TEXT: "text",
        DETAIL: "detail",
        ORDER: "order",
        OPACITY: "opacity",
        TOOLTIP: "tooltip",
        CHANNELS: ["x", "y", "x2", "y2", "row", "column", "size", "shape", "color", "order", "opacity", "text", "detail", "tooltip"],
        isChannel: _1I,
        UNIT_CHANNELS: ["x", "y", "x2", "y2", "size", "shape", "color", "order", "opacity", "text", "detail", "tooltip"],
        UNIT_SCALE_CHANNELS: ["x", "y", "size", "shape", "color", "opacity"],
        SCALE_CHANNELS: ["x", "y", "size", "shape", "color", "opacity", "row", "column"],
        NONSPATIAL_CHANNELS: ["size", "shape", "color", "order", "opacity", "text", "detail", "tooltip"],
        SPATIAL_SCALE_CHANNELS: ["x", "y"],
        NONSPATIAL_SCALE_CHANNELS: ["size", "shape", "color", "opacity"],
        LEVEL_OF_DETAIL_CHANNELS: ["size", "shape", "color", "opacity", "text", "detail", "tooltip"],
        STACK_GROUP_CHANNELS: ["color", "detail", "order", "opacity", "size"],
        supportMark: _1S,
        getSupportedMark: _1T,
        hasScale: _1U,
        supportScaleType: _1V,
        rangeType: _1X
    };
    var _v = {
        binToString: _w,
        autoMaxBins: _1E
    };
    var _22 = {
        __extends: _0,
        __assign: _2,
        __rest: _3,
        __decorate: _4,
        __param: _5,
        __metadata: _6,
        __awaiter: _7,
        __generator: _8,
        __exportStar: _9,
        __values: _f,
        __read: _g,
        __spread: _h,
        __asyncGenerator: _j,
        __asyncDelegator: _k,
        __asyncValues: _l
    };
    var _2b = {
        YEAR: "year",
        MONTH: "month",
        DAY: "day",
        DATE: "date",
        HOURS: "hours",
        MINUTES: "minutes",
        SECONDS: "seconds",
        MILLISECONDS: "milliseconds",
        YEARMONTH: "yearmonth",
        YEARMONTHDATE: "yearmonthdate",
        YEARMONTHDATEHOURS: "yearmonthdatehours",
        YEARMONTHDATEHOURSMINUTES: "yearmonthdatehoursminutes",
        YEARMONTHDATEHOURSMINUTESSECONDS: "yearmonthdatehoursminutesseconds",
        MONTHDATE: "monthdate",
        HOURSMINUTES: "hoursminutes",
        HOURSMINUTESSECONDS: "hoursminutesseconds",
        MINUTESSECONDS: "minutesseconds",
        SECONDSMILLISECONDS: "secondsmilliseconds",
        QUARTER: "quarter",
        YEARQUARTER: "yearquarter",
        QUARTERMONTH: "quartermonth",
        YEARQUARTERMONTH: "yearquartermonth"
    };
    var _2e = {
        year: true,
        quarter: true,
        month: true,
        day: true,
        date: true,
        hours: true,
        minutes: true,
        seconds: true,
        milliseconds: true
    };
    var _2j = {
        yearquarter: true,
        yearquartermonth: true,
        yearmonth: true,
        yearmonthdate: true,
        yearmonthdatehours: true,
        yearmonthdatehoursminutes: true,
        yearmonthdatehoursminutesseconds: true,
        quartermonth: true,
        hoursminutes: true,
        hoursminutesseconds: true,
        minutesseconds: true,
        secondsmilliseconds: true
    };
    var $1 = 1;
    var _2q = {
        level: _2r,
        warn: _2s,
        info: _2t,
        debug: _2u
    };
    var $0 = _2q;
    var _2m = {
        LocalLogger: _2n,
        runLocalLogger: _2p,
        wrap: _2w,
        set: _2x,
        reset: _2v,
        warn: _2y,
        info: _2z,
        debug: _2A,
        message: {
            INVALID_SPEC: "Invalid spec",
            noSuchRepeatedValue: _2C,
            unrecognizedParse: _2D,
            invalidTransformIgnored: _2E,
            invalidFieldType: _2F,
            invalidAggregate: _2G,
            emptyOrInvalidFieldType: _2H,
            emptyFieldDef: _2I,
            incompatibleChannel: _2J,
            facetChannelShouldBeDiscrete: _2K,
            discreteChannelCannotEncode: _2L,
            BAR_WITH_POINT_SCALE_AND_RANGESTEP_NULL: "Bar mark should not be used with point scale when rangeStep is null. Please use band scale instead.",
            unclearOrientContinuous: _2M,
            unclearOrientDiscreteOrEmpty: _2N,
            orientOverridden: _2O,
            CANNOT_UNION_CUSTOM_DOMAIN_WITH_FIELD_DOMAIN: "custom domain scale cannot be unioned with default field-based domain",
            cannotUseScalePropertyWithNonColor: _2P,
            unaggregateDomainHasNoEffectForRawField: _2Q,
            unaggregateDomainWithNonSharedDomainOp: _2R,
            unaggregatedDomainWithLogScale: _2S,
            CANNOT_USE_RANGE_WITH_POSITION: "Cannot use custom range with x or y channel.  Please customize width, height, padding, or rangeStep instead.",
            CANNOT_USE_PADDING_WITH_FACET: "Cannot use padding with facet's scale.  Please use spacing instead.",
            cannotUseRangePropertyWithFacet: _2T,
            rangeStepDropped: _2U,
            scaleTypeNotWorkWithChannel: _2V,
            scaleTypeNotWorkWithFieldDef: _2W,
            scalePropertyNotWorkWithScaleType: _2X,
            scaleTypeNotWorkWithMark: _2Y,
            independentScaleMeansIndependentGuide: _2Z,
            INVAID_DOMAIN: "Invalid scale domain",
            UNABLE_TO_MERGE_DOMAINS: "Unable to merge domains",
            INVALID_CHANNEL_FOR_AXIS: "Invalid channel for axis.",
            cannotStackRangedMark: _30,
            cannotStackNonLinearScale: _31,
            cannotStackNonSummativeAggregate: _32,
            invalidTimeUnit: _33,
            dayReplacedWithDate: _34,
            droppedDay: _35
        }
    };
    var _36 = {
        isDateTime: _37,
        MONTHS: ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"],
        SHORT_MONTHS: ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"],
        DAYS: ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
        SHORT_DAYS: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"],
        timestamp: _3c,
        dateTimeExpr: _3g
    };
    var _2a = {
        TimeUnit: _2b,
        SINGLE_TIMEUNITS: ["year", "quarter", "month", "day", "date", "hours", "minutes", "seconds", "milliseconds"],
        isSingleTimeUnit: _2d,
        convert: _2f,
        MULTI_TIMEUNITS: ["yearquarter", "yearquartermonth", "yearmonth", "yearmonthdate", "yearmonthdatehours", "yearmonthdatehoursminutes", "yearmonthdatehoursminutesseconds", "quartermonth", "hoursminutes", "hoursminutesseconds", "minutesseconds", "secondsmilliseconds"],
        isMultiTimeUnit: _2i,
        TIMEUNITS: ["year", "quarter", "month", "day", "date", "hours", "minutes", "seconds", "milliseconds", "yearquarter", "yearquartermonth", "yearmonth", "yearmonthdate", "yearmonthdatehours", "yearmonthdatehoursminutes", "yearmonthdatehoursminutesseconds", "quartermonth", "hoursminutes", "hoursminutesseconds", "minutesseconds", "secondsmilliseconds"],
        containsTimeUnit: _2g,
        fieldExpr: _2l,
        smallestUnit: _3h,
        formatExpression: _3i,
        isDiscreteByDefault: _3j
    };
    var _3o = {
        Type: {
            QUANTITATIVE: "quantitative",
            ORDINAL: "ordinal",
            TEMPORAL: "temporal",
            NOMINAL: "nominal"
        },
        QUANTITATIVE: "quantitative",
        ORDINAL: "ordinal",
        TEMPORAL: "temporal",
        NOMINAL: "nominal",
        getFullName: _3q
    };
    var _3s = {
        compatible: true
    };
    var _23 = {
        isRepeatRef: _24,
        isFieldDef: _25,
        isValueDef: _26,
        field: _27,
        isDiscrete: _29,
        isContinuous: _3k,
        isCount: _28,
        title: _3l,
        defaultType: _3m,
        normalize: _3n,
        channelCompatibility: _3r
    };
    var _3t = {
        BOXPLOT: "box-plot",
        normalizeBoxPlot: _21
    };
    var _20 = {
        "box-plot": _21,
        "error-bar": _3u
    };
    var _3C = {
        area: 1,
        bar: 1,
        line: 1,
        point: 1,
        text: 1,
        tick: 1,
        rect: 1,
        rule: 1,
        circle: 1,
        square: 1
    };
    var _3G = {
        color: "#4c78a8"
    };
    var _3H = {
        binSpacing: 1,
        continuousBandSize: 2
    };
    var _3I = {
        baseline: "middle"
    };
    var _3J = {
        thickness: 1
    };
    var _3x = {
        Mark: {
            AREA: "area",
            BAR: "bar",
            LINE: "line",
            POINT: "point",
            RECT: "rect",
            RULE: "rule",
            TEXT: "text",
            TICK: "tick",
            CIRCLE: "circle",
            SQUARE: "square"
        },
        AREA: "area",
        BAR: "bar",
        LINE: "line",
        POINT: "point",
        TEXT: "text",
        TICK: "tick",
        RECT: "rect",
        RULE: "rule",
        CIRCLE: "circle",
        SQUARE: "square",
        PRIMITIVE_MARKS: ["area", "bar", "line", "point", "text", "tick", "rect", "rule", "circle", "square"],
        isMarkDef: _3A,
        isPrimitiveMark: _3B,
        STROKE_CONFIG: ["stroke", "strokeWidth", "strokeDash", "strokeDashOffset", "strokeOpacity"],
        FILL_CONFIG: ["fill", "fillOpacity"],
        FILL_STROKE_CONFIG: ["stroke", "strokeWidth", "strokeDash", "strokeDashOffset", "strokeOpacity", "fill", "fillOpacity"],
        defaultMarkConfig: _3G,
        defaultBarConfig: _3H,
        defaultTextConfig: _3I,
        defaultTickConfig: _3J
    };
    var _1Y = {
        add: _1Z,
        remove: _3v,
        normalize: _3w
    };
    var _3M = {
        width: 200,
        height: 200,
        fill: "transparent"
    };
    var _3N = {
        stroke: "#ccc",
        strokeWidth: 1
    };
    var _3O = {
        cell: _3N
    };
    var _3P = {
        line: false
    };
    var _41 = {
        round: true,
        textXRangeStep: 90,
        rangeStep: 21,
        pointPadding: 0.5,
        bandPaddingInner: 0.1,
        facetSpacing: 16,
        minFontSize: 8,
        maxFontSize: 40,
        minOpacity: 0.3,
        maxOpacity: 0.8,
        minSize: 9,
        minStrokeWidth: 1,
        maxStrokeWidth: 4,
        shapes: ["circle", "square", "cross", "diamond", "triangle-up", "triangle-down"]
    };
    var _4b = {
        orient: undefined
    };
    var _3L = {
        defaultCellConfig: _3M,
        defaultFacetCellConfig: _3N,
        defaultFacetConfig: _3O,
        defaultOverlayConfig: _3P,
        defaultConfig: {
            padding: 5,
            numberFormat: "s",
            timeFormat: "%b %d, %Y",
            countTitle: "Number of Records",
            cell: _3M,
            mark: _3G,
            area: {},
            bar: _3H,
            circle: {},
            line: {},
            point: {},
            rect: {},
            rule: {},
            square: {},
            text: _3I,
            tick: _3J,
            box: {
                size: 14
            },
            boxWhisker: {},
            boxMid: {},
            overlay: _3P,
            scale: _41,
            axis: {},
            axisX: {},
            axisY: {},
            axisLeft: {},
            axisRight: {},
            axisTop: {},
            axisBottom: {},
            axisBand: {},
            legend: _4b,
            facet: _3O,
            selection: {
                single: {
                    on: "click",
                    fields: ["_id"],
                    resolve: "global"
                },
                multi: {
                    on: "click",
                    fields: ["_id"],
                    toggle: "event.shiftKey",
                    resolve: "global"
                },
                interval: {
                    on: "[mousedown, window:mouseup] > window:mousemove!",
                    encodings: ["x", "y"],
                    translate: "[mousedown, window:mouseup] > window:mousemove!",
                    zoom: "wheel",
                    resolve: "global"
                }
            }
        },
        initConfig: _4j
    };
    var _4y = {
        channelHasField: _4z,
        isAggregate: _4A,
        normalizeEncoding: _4B,
        isRanged: _4C,
        fieldDefs: _4D,
        forEach: _4E,
        reduce: _4F
    };
    var _4U = {
        ordinal: 1,
        "bin-ordinal": 1,
        point: 1,
        band: 1
    };
    var _4W = {
        "bin-linear": 1,
        "bin-ordinal": 1
    };
    var _4Y = {
        linear: 1,
        "bin-linear": 1,
        log: 1,
        pow: 1,
        sqrt: 1,
        time: 1,
        utc: 1,
        sequential: 1
    };
    var _50 = {
        linear: 1,
        "bin-linear": 1,
        log: 1,
        pow: 1,
        sqrt: 1,
        time: 1,
        utc: 1
    };
    var _4M = {
        ScaleType: {
            LINEAR: "linear",
            BIN_LINEAR: "bin-linear",
            LOG: "log",
            POW: "pow",
            SQRT: "sqrt",
            TIME: "time",
            UTC: "utc",
            SEQUENTIAL: "sequential",
            QUANTILE: "quantile",
            QUANTIZE: "quantize",
            THRESHOLD: "threshold",
            ORDINAL: "ordinal",
            BIN_ORDINAL: "bin-ordinal",
            POINT: "point",
            BAND: "band"
        },
        SCALE_TYPES: ["linear", "bin-linear", "log", "pow", "sqrt", "time", "utc", "sequential", "ordinal", "bin-ordinal", "point", "band"],
        CONTINUOUS_TO_CONTINUOUS_SCALES: ["linear", "bin-linear", "log", "pow", "sqrt", "time", "utc"],
        CONTINUOUS_DOMAIN_SCALES: ["linear", "bin-linear", "log", "pow", "sqrt", "time", "utc", "sequential"],
        DISCRETE_DOMAIN_SCALES: ["ordinal", "bin-ordinal", "point", "band"],
        TIME_SCALE_TYPES: ["time", "utc"],
        hasDiscreteDomain: _4T,
        isBinScale: _4V,
        hasContinuousDomain: _4X,
        isContinuousToContinuous: _4Z,
        defaultScaleConfig: _41,
        isExtendedScheme: _51,
        isSelectionDomain: _52,
        SCALE_PROPERTIES: ["type", "domain", "range", "round", "rangeStep", "scheme", "padding", "paddingInner", "paddingOuter", "clamp", "nice", "exponent", "zero", "interpolate"],
        scaleTypeSupportProperty: _54,
        channelScalePropertyIncompatability: _55
    };
    var _4I = {
        STACKABLE_MARKS: ["bar", "area", "rule", "point", "circle", "square", "line", "text", "tick"],
        STACK_BY_DEFAULT_MARKS: ["bar", "area"],
        stack: _4L
    };
    var _4k = {
        isFacetSpec: _4l,
        isUnitSpec: _4m,
        isLayerSpec: _4n,
        isRepeatSpec: _4o,
        isConcatSpec: _4p,
        isVConcatSpec: _4q,
        isHConcatSpec: _4r,
        normalize: _4s,
        fieldDefs: _5b,
        isStacked: _5e
    };
    var _5o = {
        constructor: _5j,
        field: _5p,
        reduceFieldDef: _5q,
        forEachFieldDef: _5r
    };
    _5j.prototype = _5o;

    _$1(_5j, _5k);

    var _5I = {
        isUrlData: _5J,
        isInlineData: _5K,
        isNamedData: _5L,
        MAIN: "main",
        RAW: "raw"
    };
    var _5M = {
        constructor: _5F,
        hasName: _5N,
        remove: _5O,
        hash: _5P,
        assemble: _5Q
    };
    _5F.prototype = _5M;

    _$1(_5F, _5G);

    var _5E = {
        SourceNode: _5F
    };
    var _5T = {
        constructor: _5S,
        clone: _5U,
        merge: _5V,
        assembleFormatParse: _5W,
        assembleTransforms: _5X
    };
    _5S.prototype = _5T;
    var _60 = {
        isFilter: _61,
        isCalculate: _62
    };
    var _6d = {
        "*": 1,
        arc: 1,
        area: 1,
        group: 1,
        image: 1,
        line: 1,
        path: 1,
        rect: 1,
        rule: 1,
        shape: 1,
        symbol: 1,
        text: 1,
        trail: 1
    };

    var _6k = _$2("[\\[\\]\\{\\}]", "");

    var $2 = undefined;
    var $3 = undefined;
    var _6b = {
        selector: _6c
    };
    var _6E = {
        domain: _6F
    };
    var _6B = {
        BRUSH: "_brush",
        SIZE: "_size",
        "default": {
            predicate: "vlInterval",
            signals: _6D,
            tupleExpr: _6I,
            modifyExpr: _6J,
            marks: _6K
        },
        projections: _6L
    };
    var _6w = {
        clipGroup: true,
        has: _6x,
        parse: _6y,
        topLevelSignals: _6z,
        signals: _6A
    };
    var _6o = {
        project: {
            has: _6q,
            parse: _6r
        },
        toggle: {
            has: _6t,
            signals: _6u,
            modifyExpr: _6v
        },
        scales: _6w,
        translate: {
            has: _6N,
            signals: _6O
        },
        zoom: {
            has: _6S,
            signals: _6T
        },
        inputs: {
            has: _6W,
            topLevelSignals: _6X,
            signals: _6Z
        },
        nearest: {
            has: _71,
            marks: _72
        }
    };
    var _6m = {
        forEachTransform: _6n
    };
    var _76 = {
        "default": {
            predicate: "vlPoint",
            signals: _78,
            topLevelSignals: _79,
            tupleExpr: _7a,
            modifyExpr: _7b
        }
    };
    var _7c = {
        "default": {
            predicate: "vlPoint",
            signals: _78,
            tupleExpr: _7e,
            modifyExpr: _7f
        }
    };
    var _7l = {
        initLayerResolve: _7m
    };
    var _7r = {
        isDataRefUnionedDomain: _7s,
        isFieldRefUnionDomain: _7t,
        isDataRefDomain: _7u,
        isSignalRefDomain: _7v
    };
    var _7E = {
        isSortField: _7F
    };
    var _7w = {
        initDomain: _7x,
        parseDomain: _7z,
        domainSort: _7D,
        canUseUnaggregatedDomain: _7y,
        unionDomains: _7A
    };
    var _7N = {
        assembleLayoutLayerSignals: _7O,
        layerSizeExpr: _7P,
        assembleLayoutUnitSignals: _7Q,
        unitSizeExpr: _7R
    };
    var _7Z = {
        constructor: _7Y,
        assemble: _80
    };
    _7Y.prototype = _7Z;

    _$1(_7Y, _5G);

    var _7X = {
        FacetNode: _7Y
    };
    var _83 = {
        constructor: _82,
        clone: _84,
        assemble: _85
    };
    _82.prototype = _83;

    _$1(_82, _5G);

    var _87 = {
        constructor: _86,
        clone: _88,
        producedFields: _89,
        assemble: _8a
    };
    _86.prototype = _87;

    _$1(_86, _5G);

    var _81 = {
        FilterNode: _82,
        CalculateNode: _86,
        parseTransformArray: _8b
    };
    var _8e = {
        constructor: _8d,
        clone: _8f,
        merge: _8g,
        assemble: _8h
    };
    _8d.prototype = _8e;
    var _8j = {
        nominal: false,
        ordinal: false,
        quantitative: true,
        temporal: true
    };
    _8d.make = _8i;

    _$1(_8d, _5G);

    var _8c = {
        NullFilterNode: _8d
    };
    var _8m = {
        constructor: _8l,
        clone: _8n,
        merge: _8o,
        addDimensions: _8q,
        dependentFields: _8r,
        producedFields: _8s,
        assemble: _8t
    };
    _8l.prototype = _8m;
    _8l.make = _8u;

    _$1(_8l, _5G);

    var _8k = {
        AggregateNode: _8l
    };
    var _8y = {
        constructor: _8x,
        clone: _8z,
        assemble: _8A
    };
    _8x.prototype = _8y;
    _8x.make = _8B;

    _$1(_8x, _5G);

    var _8w = {
        OrderNode: _8x
    };
    var _8E = {
        constructor: _8D,
        clone: _8F,
        assemble: _8G
    };
    _8D.prototype = _8E;
    _8D.make = _8H;

    _$1(_8D, _5G);

    var _8C = {
        NonPositiveFilterNode: _8D
    };
    var _8K = {
        constructor: _8J,
        clone: _8L,
        merge: _8M,
        producedFields: _8N,
        dependentFields: _8O,
        assemble: _8P
    };
    _8J.prototype = _8K;
    var _8U = {
        initMarkDef: _8V,
        initEncoding: _8Y
    };
    var _9b = {
        "default": _9c,
        fieldDefMatchScaleType: _9g
    };
    var _9j = {
        nice: _9k,
        padding: _9l,
        paddingInner: _9m,
        paddingOuter: _9n,
        round: _9o,
        zero: _9p
    };
    var _9q = {
        parseRange: _9r,
        RANGE_PROPERTIES: ["range", "rangeStep", "scheme"],
        "default": _9t
    };
    var _98 = {
        NON_TYPE_RANGE_SCALE_PROPERTIES: ["domain", "round", "clamp", "nice", "exponent", "zero", "interpolate", "padding", "paddingInner", "paddingOuter"],
        "default": _9a
    };
    var _9E = {
        "default": _9F,
        NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES: ["round", "clamp", "nice", "exponent", "interpolate", "zero", "padding", "paddingInner", "paddingOuter"],
        parseScale: _9G
    };
    var _9T = {
        stackable: _9U,
        stackable2: _a3,
        bin: _a4,
        fieldRef: _9V,
        band: _9Y,
        midPoint: _9W,
        text: _a5,
        midX: _a6,
        midY: _a7
    };
    var _9Q = {
        color: _9R,
        markDefProperties: _aa,
        valueIfDefined: _ab,
        nonPosition: _9S,
        text: _ac,
        bandPosition: _ad,
        centeredBandPosition: _ae,
        binnedPosition: _ag,
        pointPosition: _af,
        pointPosition2: _ah
    };
    var _9N = {
        area: {
            vgMark: "area",
            defaultRole: undefined,
            encodeEntry: _9P
        },
        bar: {
            vgMark: "rect",
            defaultRole: "bar",
            encodeEntry: _aj
        },
        line: {
            vgMark: "line",
            defaultRole: undefined,
            encodeEntry: _ao
        },
        point: {
            vgMark: "symbol",
            defaultRole: "point",
            encodeEntry: _aq
        },
        text: {
            vgMark: "text",
            defaultRole: undefined,
            encodeEntry: _au
        },
        tick: {
            vgMark: "rect",
            defaultRole: "tick",
            encodeEntry: _ay
        },
        rect: {
            vgMark: "rect",
            defaultRole: undefined,
            encodeEntry: _aB
        },
        rule: {
            vgMark: "rule",
            defaultRole: undefined,
            encodeEntry: _aF
        },
        circle: {
            vgMark: "symbol",
            defaultRole: "circle",
            encodeEntry: _aH
        },
        square: {
            vgMark: "symbol",
            defaultRole: "square",
            encodeEntry: _aJ
        }
    };
    var _9J = {
        parseMark: _9K
    };
    var _aS = {
        format: _aT,
        gridShow: _aU,
        grid: _aV,
        gridScale: _aW,
        orient: _aX,
        tickCount: _aY,
        title: _aZ,
        values: _b0,
        zindex: _b1,
        domainAndTicks: _b2,
        domain: _b2,
        ticks: _b2
    };
    var _b3 = ["domain", "grid", "labels", "ticks", "title"];
    var _b6 = {
        labels: _b7
    };
    var _aN = {
        parseAxisComponent: _aO,
        parseGridAxis: _b9,
        parseMainAxis: _aP
    };
    var _bf = {
        defaultLegendConfig: _4b,
        LEGEND_PROPERTIES: ["entryPadding", "format", "offset", "orient", "tickCount", "title", "type", "values", "zindex"]
    };
    var _bi = {
        title: _bj,
        values: _bk,
        type: _bl
    };
    var _bm = {
        symbols: _bn,
        labels: _bo
    };
    var _bb = {
        parseLegendComponent: _bc,
        parseLegend: _bd
    };
    var _90 = {
        constructor: _8T,
        scale: _91,
        hasDiscreteDomain: _92,
        sort: _93,
        axis: _94,
        legend: _95,
        initFacetCellConfig: _96,
        initScales: _97,
        initSize: _9y,
        initAxes: _9z,
        initLegend: _9A,
        parseData: _9B,
        parseSelection: _9C,
        parseScale: _9D,
        parseMark: _9I,
        parseAxisAndHeader: _aM,
        parseLegend: _ba,
        assembleData: _bp,
        assembleSelectionTopLevelSignals: _bq,
        assembleSelectionSignals: _br,
        assembleSelectionData: _bs,
        assembleLayout: _bt,
        assembleLayoutSignals: _bu,
        assembleMarks: _bv,
        assembleParentGroupProperties: _bw,
        channels: _bx,
        getMapping: _by,
        toSpec: _bz,
        mark: _bA,
        channelHasField: _bB,
        fieldDef: _bC,
        field: _bD
    };
    _8T.prototype = _90;

    _$1(_8T, _5j);

    var _8S = {
        UnitModel: _8T
    };
    _8J.make = _8Q;

    _$1(_8J, _5G);

    var _8I = {
        BinNode: _8J
    };
    var _bH = {
        constructor: _bG,
        clone: _bI,
        merge: _bJ,
        producedFields: _bK,
        dependentFields: _bL,
        assemble: _bM
    };
    _bG.prototype = _bH;
    _bG.make = _bN;

    _$1(_bG, _5G);

    var _bF = {
        TimeUnitNode: _bG
    };
    var _bQ = {
        constructor: _bP,
        clone: _bR,
        addDimensions: _bS,
        dependentFields: _bT,
        producedFields: _bU,
        assemble: _bV
    };
    _bP.prototype = _bQ;
    _bP.make = _bW;

    _$1(_bP, _5G);

    var _bO = {
        StackNode: _bP
    };
    var _c0 = {
        constructor: _bZ,
        clone: _c1
    };
    _bZ.prototype = _c0;

    _$1(_bZ, _5G);

    var _bY = {
        DataFlowNode: _5G,
        OutputNode: _bZ
    };
    var _c5 = {
        iterateFromLeaves: _c6,
        moveParseUp: _c7,
        removeUnusedSubtrees: _c8
    };
    var _7U = {
        FACET_SCALE_PREFIX: "scale_",
        assembleFacetData: _7V,
        assembleData: _c2
    };
    var _7n = {
        constructor: _7k,
        parseData: _7o,
        parseSelection: _7p,
        parseScale: _7q,
        parseMark: _7G,
        parseAxisAndHeader: _7H,
        parseLegend: _7I,
        assembleParentGroupProperties: _7J,
        assembleSelectionTopLevelSignals: _7K,
        assembleSelectionSignals: _7L,
        assembleLayoutSignals: _7M,
        assembleSelectionData: _7S,
        assembleData: _7T,
        assembleScales: _cc,
        assembleLayout: _cd,
        assembleMarks: _ce
    };
    _7k.prototype = _7n;

    _$1(_7k, _5k);

    var _7j = {
        LayerModel: _7k
    };
    var _ci = {
        global: "\"union\", \"all\"",
        independent: "\"intersect\", \"unit\"",
        union: "\"union\", \"all\"",
        union_others: "\"union\", \"others\"",
        intersect: "\"intersect\", \"all\"",
        intersect_others: "\"intersect\", \"others\""
    };
    var _69 = {
        STORE: "_store",
        TUPLE: "_tuple",
        MODIFY: "_modify",
        parseUnitSelection: _6a,
        assembleUnitSelectionSignals: _73,
        assembleTopLevelSignals: _7g,
        assembleUnitSelectionData: _7h,
        assembleUnitSelectionMarks: _7i,
        assembleLayerSelectionMarks: _cg,
        predicate: _ch,
        invert: _cj,
        channelSignalName: _ck
    };
    var _63 = {
        isSelectionFilter: _64,
        isEqualFilter: _65,
        isRangeFilter: _66,
        isOneOfFilter: _67,
        expression: _68
    };
    var _cm = {
        NameMap: _5l,
        Model: _5k,
        ModelWithField: _5j
    };
    _5S.make = _5Z;

    _$1(_5S, _5G);

    var _5R = {
        ParseNode: _5S
    };
    var _5B = {
        parseData: _5C
    };
    var _5y = {
        constructor: _5x,
        _initChildren: _5z,
        parseData: _5A,
        parseSelection: _cn,
        parseScale: _co,
        parseMark: _cp,
        parseAxisAndHeader: _cq,
        parseAxisGroup: _cr,
        parseLegend: _cs,
        assembleData: _ct,
        assembleParentGroupProperties: _cu,
        assembleSelectionTopLevelSignals: _cv,
        assembleSelectionSignals: _cw,
        assembleLayoutSignals: _cx,
        assembleSelectionData: _cy,
        assembleScales: _cz,
        assembleLayout: _cA,
        assembleMarks: _cB
    };
    _5x.prototype = _5y;

    _$1(_5x, _5k);

    var _5s = {
        replaceRepeaterInFacet: _5t,
        replaceRepeaterInEncoding: _5w,
        RepeatModel: _5x
    };
    var _cQ = {
        HEADER_CHANNELS: ["row", "column"],
        HEADER_TYPES: ["header", "footer"],
        getHeaderType: _cT,
        getTitleGroup: _cU,
        getHeaderGroup: _cV
    };
    var _cC = {
        constructor: _5i,
        initFacet: _cD,
        channelHasField: _cE,
        hasDiscreteDomain: _cF,
        fieldDef: _cG,
        parseData: _cH,
        parseSelection: _cI,
        parseScale: _cJ,
        parseMark: _cK,
        parseAxisAndHeader: _cM,
        parseHeader: _cN,
        makeHeaderComponent: _cO,
        mergeChildAxis: _cP,
        parseLegend: _cW,
        assembleData: _cX,
        assembleParentGroupProperties: _cY,
        assembleSelectionTopLevelSignals: _cZ,
        assembleSelectionSignals: _d0,
        assembleSelectionData: _d1,
        assembleLayout: _d2,
        assembleLayoutSignals: _d3,
        columnDistinctSignal: _d4,
        assembleMarks: _d5,
        channels: _d6,
        getMapping: _d7
    };
    _5i.prototype = _cC;

    _$1(_5i, _5j);

    var _5h = {
        FacetModel: _5i
    };
    var _da = {
        constructor: _d9,
        parseData: _db,
        parseSelection: _dc,
        parseScale: _dd,
        parseMark: _de,
        parseAxisAndHeader: _df,
        parseAxisGroup: _dg,
        parseLegend: _dh,
        assembleData: _di,
        assembleParentGroupProperties: _dj,
        assembleSelectionTopLevelSignals: _dk,
        assembleSelectionSignals: _dl,
        assembleLayoutSignals: _dm,
        assembleSelectionData: _dn,
        assembleScales: _do,
        assembleLayout: _dp,
        assembleMarks: _dq
    };
    _d9.prototype = _da;

    _$1(_d9, _5k);

    var _d8 = {
        ConcatModel: _d9
    };
    var _5f = {
        buildModel: _5g,
        applyConfig: _dr,
        applyMarkConfig: _ds,
        getMarkConfig: _dt,
        formatSignalRef: _du,
        numberFormat: _dv,
        timeFormatExpression: _dw,
        sortParams: _dx
    };
    var _dD = ["background", "padding"];
    var _dB = {
        extractTopLevelProperties: _dC
    };
    var _dF = {
        DEFAULT_REQUIRED_CHANNEL_MAP: {
            text: ["text"],
            line: ["x", "y"],
            area: ["x", "y"]
        },
        DEFAULT_SUPPORTED_CHANNEL_TYPE: {
            bar: {
                row: 1,
                column: 1,
                x: 1,
                y: 1,
                size: 1,
                color: 1,
                detail: 1
            },
            line: {
                row: 1,
                column: 1,
                x: 1,
                y: 1,
                color: 1,
                detail: 1
            },
            area: {
                row: 1,
                column: 1,
                x: 1,
                y: 1,
                color: 1,
                detail: 1
            },
            tick: {
                row: 1,
                column: 1,
                x: 1,
                y: 1,
                color: 1,
                detail: 1
            },
            circle: {
                row: 1,
                column: 1,
                x: 1,
                y: 1,
                color: 1,
                size: 1,
                detail: 1
            },
            square: {
                row: 1,
                column: 1,
                x: 1,
                y: 1,
                color: 1,
                size: 1,
                detail: 1
            },
            point: {
                row: 1,
                column: 1,
                x: 1,
                y: 1,
                color: 1,
                size: 1,
                detail: 1,
                shape: 1
            },
            text: {
                row: 1,
                column: 1,
                size: 1,
                color: 1,
                text: 1
            }
        },
        getEncodingMappingError: _dT
    };
    var $$0 = {
        enumerable: false,
        configurable: false,
        writable: false
    };
    $$0.value = true;

    _$3(_K, "__esModule", $$0);

    var _e5 = {
        global: "union",
        independent: "intersect",
        union: "union",
        union_others: "union",
        intersect: "intersect",
        intersect_others: "intersect"
    };
    var _e3 = {
        assembleScale: _e4
    };

    _$1(_5o, _5n);

    var $$1 = {
        enumerable: true,
        configurable: true
    };
    $$1.set = undefined;
    $$1.set = undefined;

    _$1(_5M, _5H);

    $$1.set = undefined;

    _$1(_5T, _5H);

    var $$2 = {
        enumerable: false,
        configurable: false,
        writable: true
    };
    $$2.value = 0;

    _$3(_6k, "lastIndex", $$2);

    $$0.value = true;

    _$3(_6b, "__esModule", $$0);

    _6E["default"] = _6w;
    $$0.value = true;

    _$3(_6E, "__esModule", $$0);

    $$0.value = true;

    _$3(_6B, "__esModule", $$0);

    $$0.value = true;

    _$3(_76, "__esModule", $$0);

    $$0.value = true;

    _$3(_7c, "__esModule", $$0);

    $$1.set = undefined;
    $$1.set = undefined;

    _$1(_7Z, _5H);

    _$1(_83, _5H);

    _$1(_87, _5H);

    $$1.set = undefined;

    _$1(_8e, _5H);

    _$1(_8m, _5H);

    _$1(_8y, _5H);

    $$1.set = undefined;

    _$1(_8E, _5H);

    _$1(_8K, _5H);

    $$0.value = true;

    _$3(_9b, "__esModule", $$0);

    $$0.value = true;

    _$3(_9q, "__esModule", $$0);

    $$0.value = true;

    _$3(_98, "__esModule", $$0);

    $$0.value = true;

    _$3(_9E, "__esModule", $$0);

    _$1(_90, _5o);

    _$1(_bH, _5H);

    $$1.set = undefined;

    _$1(_bQ, _5H);

    $$1.set = undefined;

    _$1(_c0, _5H);

    _$1(_7n, _5n);

    _$1(_5y, _5n);

    _$1(_cC, _5o);

    _$1(_da, _5n);

    $$1.get = _eG;

    _$3(_c0, "required", $$1);

    $$1.set = _eF;
    $$1.get = _eH;

    _$3(_c0, "source", $$1);

    $$1.get = _eE;

    _$3(_bQ, "stack", $$1);

    $$1.get = _eD;

    _$3(_8E, "filter", $$1);

    $$1.get = _eC;

    _$3(_8e, "filteredFields", $$1);

    $$1.get = _eB;

    _$3(_7Z, "source", $$1);

    $$1.get = _eA;

    _$3(_7Z, "fields", $$1);

    $$1.get = _ez;

    _$3(_5T, "parse", $$1);

    $$1.set = _ey;
    $$1.get = undefined;

    _$3(_5M, "parent", $$1);

    $$1.set = _ex;
    $$1.get = _eI;

    _$3(_5M, "dataName", $$1);

    $$1.get = _ew;

    _$3(_5M, "data", $$1);

    _5H.swapWithParent = _ev;
    _5H.remove = _eu;
    _5H.removeChild = _et;
    _5H.addChild = _es;
    _5H.numChildren = _er;
    $$1.get = _eq;

    _$3(_5H, "children", $$1);

    $$1.set = _ep;
    $$1.get = _eJ;

    _$3(_5H, "parent", $$1);

    _5H.dependentFields = _eo;
    _5H.producedFields = _en;
    _5H.clone = _em;
    _5n.getComponent = _el;
    _5n.scaleName = _ek;
    _5n.scale = _ej;
    _5n.renameScale = _ei;
    _5n.sizeName = _eh;
    _5n.channelSizeName = _eg;
    _5n.renameSize = _ef;
    _5n.lookupDataSource = _ee;
    _5n.getSizeSignalRef = _ed;
    _5n.requestDataName = _ec;
    _5n.getName = _eb;
    _5n.hasDescendantWithFieldOnChannel = _ea;
    _5n.assembleGroup = _e9;
    _5n.assembleLegends = _e8;
    _5n.assembleAxes = _e7;
    _5n.assembleHeaderMarks = _e6;
    _5n.assembleScales = _e2;
    _5n.parse = _e1;
    _5m.get = _e0;
    _5m.has = _dZ;
    _5m.rename = _dY;
    _2o.debug = _dX;
    _2o.info = _dW;
    _2o.warn = _dV;
    _2o.level = _dU;
    vl = {
        axis: _n,
        aggregate: _p,
        bin: _v,
        channel: _1F,
        compositeMark: _1Y,
        compile: _3K,
        config: _3L,
        data: _5I,
        datetime: _36,
        encoding: _4y,
        facet: {},
        fieldDef: _23,
        legend: _bf,
        mark: _3x,
        scale: _4M,
        sort: _7E,
        spec: _4k,
        stack: _4I,
        timeUnit: _2a,
        transform: _60,
        type: _3o,
        util: _x,
        validate: _dF,
        version: "2.0.0-beta.2"
    };
}).call(this);