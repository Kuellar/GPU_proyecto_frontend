// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"tU1w":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.epsilon = void 0;
exports.estimate = estimate;
exports.negate = negate;
exports.resulterrbound = void 0;
exports.scale = scale;
exports.splitter = void 0;
exports.sum = sum;
exports.sum_three = sum_three;
exports.vec = vec;
const epsilon = 1.1102230246251565e-16;
exports.epsilon = epsilon;
const splitter = 134217729;
exports.splitter = splitter;
const resulterrbound = (3 + 8 * epsilon) * epsilon; // fast_expansion_sum_zeroelim routine from oritinal code

exports.resulterrbound = resulterrbound;

function sum(elen, e, flen, f, h) {
  let Q, Qnew, hh, bvirt;
  let enow = e[0];
  let fnow = f[0];
  let eindex = 0;
  let findex = 0;

  if (fnow > enow === fnow > -enow) {
    Q = enow;
    enow = e[++eindex];
  } else {
    Q = fnow;
    fnow = f[++findex];
  }

  let hindex = 0;

  if (eindex < elen && findex < flen) {
    if (fnow > enow === fnow > -enow) {
      Qnew = enow + Q;
      hh = Q - (Qnew - enow);
      enow = e[++eindex];
    } else {
      Qnew = fnow + Q;
      hh = Q - (Qnew - fnow);
      fnow = f[++findex];
    }

    Q = Qnew;

    if (hh !== 0) {
      h[hindex++] = hh;
    }

    while (eindex < elen && findex < flen) {
      if (fnow > enow === fnow > -enow) {
        Qnew = Q + enow;
        bvirt = Qnew - Q;
        hh = Q - (Qnew - bvirt) + (enow - bvirt);
        enow = e[++eindex];
      } else {
        Qnew = Q + fnow;
        bvirt = Qnew - Q;
        hh = Q - (Qnew - bvirt) + (fnow - bvirt);
        fnow = f[++findex];
      }

      Q = Qnew;

      if (hh !== 0) {
        h[hindex++] = hh;
      }
    }
  }

  while (eindex < elen) {
    Qnew = Q + enow;
    bvirt = Qnew - Q;
    hh = Q - (Qnew - bvirt) + (enow - bvirt);
    enow = e[++eindex];
    Q = Qnew;

    if (hh !== 0) {
      h[hindex++] = hh;
    }
  }

  while (findex < flen) {
    Qnew = Q + fnow;
    bvirt = Qnew - Q;
    hh = Q - (Qnew - bvirt) + (fnow - bvirt);
    fnow = f[++findex];
    Q = Qnew;

    if (hh !== 0) {
      h[hindex++] = hh;
    }
  }

  if (Q !== 0 || hindex === 0) {
    h[hindex++] = Q;
  }

  return hindex;
}

function sum_three(alen, a, blen, b, clen, c, tmp, out) {
  return sum(sum(alen, a, blen, b, tmp), tmp, clen, c, out);
} // scale_expansion_zeroelim routine from oritinal code


function scale(elen, e, b, h) {
  let Q, sum, hh, product1, product0;
  let bvirt, c, ahi, alo, bhi, blo;
  c = splitter * b;
  bhi = c - (c - b);
  blo = b - bhi;
  let enow = e[0];
  Q = enow * b;
  c = splitter * enow;
  ahi = c - (c - enow);
  alo = enow - ahi;
  hh = alo * blo - (Q - ahi * bhi - alo * bhi - ahi * blo);
  let hindex = 0;

  if (hh !== 0) {
    h[hindex++] = hh;
  }

  for (let i = 1; i < elen; i++) {
    enow = e[i];
    product1 = enow * b;
    c = splitter * enow;
    ahi = c - (c - enow);
    alo = enow - ahi;
    product0 = alo * blo - (product1 - ahi * bhi - alo * bhi - ahi * blo);
    sum = Q + product0;
    bvirt = sum - Q;
    hh = Q - (sum - bvirt) + (product0 - bvirt);

    if (hh !== 0) {
      h[hindex++] = hh;
    }

    Q = product1 + sum;
    hh = sum - (Q - product1);

    if (hh !== 0) {
      h[hindex++] = hh;
    }
  }

  if (Q !== 0 || hindex === 0) {
    h[hindex++] = Q;
  }

  return hindex;
}

function negate(elen, e) {
  for (let i = 0; i < elen; i++) e[i] = -e[i];

  return elen;
}

function estimate(elen, e) {
  let Q = e[0];

  for (let i = 1; i < elen; i++) Q += e[i];

  return Q;
}

function vec(n) {
  return new Float64Array(n);
}
},{}],"PG9F":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.orient2d = orient2d;
exports.orient2dfast = orient2dfast;

var _util = require("./util.js");

const ccwerrboundA = (3 + 16 * _util.epsilon) * _util.epsilon;
const ccwerrboundB = (2 + 12 * _util.epsilon) * _util.epsilon;
const ccwerrboundC = (9 + 64 * _util.epsilon) * _util.epsilon * _util.epsilon;
const B = (0, _util.vec)(4);
const C1 = (0, _util.vec)(8);
const C2 = (0, _util.vec)(12);
const D = (0, _util.vec)(16);
const u = (0, _util.vec)(4);

function orient2dadapt(ax, ay, bx, by, cx, cy, detsum) {
  let acxtail, acytail, bcxtail, bcytail;

  let bvirt, c, ahi, alo, bhi, blo, _i, _j, _0, s1, s0, t1, t0, u3;

  const acx = ax - cx;
  const bcx = bx - cx;
  const acy = ay - cy;
  const bcy = by - cy;
  s1 = acx * bcy;
  c = _util.splitter * acx;
  ahi = c - (c - acx);
  alo = acx - ahi;
  c = _util.splitter * bcy;
  bhi = c - (c - bcy);
  blo = bcy - bhi;
  s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
  t1 = acy * bcx;
  c = _util.splitter * acy;
  ahi = c - (c - acy);
  alo = acy - ahi;
  c = _util.splitter * bcx;
  bhi = c - (c - bcx);
  blo = bcx - bhi;
  t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
  _i = s0 - t0;
  bvirt = s0 - _i;
  B[0] = s0 - (_i + bvirt) + (bvirt - t0);
  _j = s1 + _i;
  bvirt = _j - s1;
  _0 = s1 - (_j - bvirt) + (_i - bvirt);
  _i = _0 - t1;
  bvirt = _0 - _i;
  B[1] = _0 - (_i + bvirt) + (bvirt - t1);
  u3 = _j + _i;
  bvirt = u3 - _j;
  B[2] = _j - (u3 - bvirt) + (_i - bvirt);
  B[3] = u3;
  let det = (0, _util.estimate)(4, B);
  let errbound = ccwerrboundB * detsum;

  if (det >= errbound || -det >= errbound) {
    return det;
  }

  bvirt = ax - acx;
  acxtail = ax - (acx + bvirt) + (bvirt - cx);
  bvirt = bx - bcx;
  bcxtail = bx - (bcx + bvirt) + (bvirt - cx);
  bvirt = ay - acy;
  acytail = ay - (acy + bvirt) + (bvirt - cy);
  bvirt = by - bcy;
  bcytail = by - (bcy + bvirt) + (bvirt - cy);

  if (acxtail === 0 && acytail === 0 && bcxtail === 0 && bcytail === 0) {
    return det;
  }

  errbound = ccwerrboundC * detsum + _util.resulterrbound * Math.abs(det);
  det += acx * bcytail + bcy * acxtail - (acy * bcxtail + bcx * acytail);
  if (det >= errbound || -det >= errbound) return det;
  s1 = acxtail * bcy;
  c = _util.splitter * acxtail;
  ahi = c - (c - acxtail);
  alo = acxtail - ahi;
  c = _util.splitter * bcy;
  bhi = c - (c - bcy);
  blo = bcy - bhi;
  s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
  t1 = acytail * bcx;
  c = _util.splitter * acytail;
  ahi = c - (c - acytail);
  alo = acytail - ahi;
  c = _util.splitter * bcx;
  bhi = c - (c - bcx);
  blo = bcx - bhi;
  t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
  _i = s0 - t0;
  bvirt = s0 - _i;
  u[0] = s0 - (_i + bvirt) + (bvirt - t0);
  _j = s1 + _i;
  bvirt = _j - s1;
  _0 = s1 - (_j - bvirt) + (_i - bvirt);
  _i = _0 - t1;
  bvirt = _0 - _i;
  u[1] = _0 - (_i + bvirt) + (bvirt - t1);
  u3 = _j + _i;
  bvirt = u3 - _j;
  u[2] = _j - (u3 - bvirt) + (_i - bvirt);
  u[3] = u3;
  const C1len = (0, _util.sum)(4, B, 4, u, C1);
  s1 = acx * bcytail;
  c = _util.splitter * acx;
  ahi = c - (c - acx);
  alo = acx - ahi;
  c = _util.splitter * bcytail;
  bhi = c - (c - bcytail);
  blo = bcytail - bhi;
  s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
  t1 = acy * bcxtail;
  c = _util.splitter * acy;
  ahi = c - (c - acy);
  alo = acy - ahi;
  c = _util.splitter * bcxtail;
  bhi = c - (c - bcxtail);
  blo = bcxtail - bhi;
  t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
  _i = s0 - t0;
  bvirt = s0 - _i;
  u[0] = s0 - (_i + bvirt) + (bvirt - t0);
  _j = s1 + _i;
  bvirt = _j - s1;
  _0 = s1 - (_j - bvirt) + (_i - bvirt);
  _i = _0 - t1;
  bvirt = _0 - _i;
  u[1] = _0 - (_i + bvirt) + (bvirt - t1);
  u3 = _j + _i;
  bvirt = u3 - _j;
  u[2] = _j - (u3 - bvirt) + (_i - bvirt);
  u[3] = u3;
  const C2len = (0, _util.sum)(C1len, C1, 4, u, C2);
  s1 = acxtail * bcytail;
  c = _util.splitter * acxtail;
  ahi = c - (c - acxtail);
  alo = acxtail - ahi;
  c = _util.splitter * bcytail;
  bhi = c - (c - bcytail);
  blo = bcytail - bhi;
  s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
  t1 = acytail * bcxtail;
  c = _util.splitter * acytail;
  ahi = c - (c - acytail);
  alo = acytail - ahi;
  c = _util.splitter * bcxtail;
  bhi = c - (c - bcxtail);
  blo = bcxtail - bhi;
  t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
  _i = s0 - t0;
  bvirt = s0 - _i;
  u[0] = s0 - (_i + bvirt) + (bvirt - t0);
  _j = s1 + _i;
  bvirt = _j - s1;
  _0 = s1 - (_j - bvirt) + (_i - bvirt);
  _i = _0 - t1;
  bvirt = _0 - _i;
  u[1] = _0 - (_i + bvirt) + (bvirt - t1);
  u3 = _j + _i;
  bvirt = u3 - _j;
  u[2] = _j - (u3 - bvirt) + (_i - bvirt);
  u[3] = u3;
  const Dlen = (0, _util.sum)(C2len, C2, 4, u, D);
  return D[Dlen - 1];
}

function orient2d(ax, ay, bx, by, cx, cy) {
  const detleft = (ay - cy) * (bx - cx);
  const detright = (ax - cx) * (by - cy);
  const det = detleft - detright;
  if (detleft === 0 || detright === 0 || detleft > 0 !== detright > 0) return det;
  const detsum = Math.abs(detleft + detright);
  if (Math.abs(det) >= ccwerrboundA * detsum) return det;
  return -orient2dadapt(ax, ay, bx, by, cx, cy, detsum);
}

function orient2dfast(ax, ay, bx, by, cx, cy) {
  return (ay - cy) * (bx - cx) - (ax - cx) * (by - cy);
}
},{"./util.js":"tU1w"}],"wJFU":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.orient3d = orient3d;
exports.orient3dfast = orient3dfast;

var _util = require("./util.js");

const o3derrboundA = (7 + 56 * _util.epsilon) * _util.epsilon;
const o3derrboundB = (3 + 28 * _util.epsilon) * _util.epsilon;
const o3derrboundC = (26 + 288 * _util.epsilon) * _util.epsilon * _util.epsilon;
const bc = (0, _util.vec)(4);
const ca = (0, _util.vec)(4);
const ab = (0, _util.vec)(4);
const at_b = (0, _util.vec)(4);
const at_c = (0, _util.vec)(4);
const bt_c = (0, _util.vec)(4);
const bt_a = (0, _util.vec)(4);
const ct_a = (0, _util.vec)(4);
const ct_b = (0, _util.vec)(4);
const bct = (0, _util.vec)(8);
const cat = (0, _util.vec)(8);
const abt = (0, _util.vec)(8);
const u = (0, _util.vec)(4);

const _8 = (0, _util.vec)(8);

const _8b = (0, _util.vec)(8);

const _16 = (0, _util.vec)(8);

const _12 = (0, _util.vec)(12);

let fin = (0, _util.vec)(192);
let fin2 = (0, _util.vec)(192);

function finadd(finlen, alen, a) {
  finlen = (0, _util.sum)(finlen, fin, alen, a, fin2);
  const tmp = fin;
  fin = fin2;
  fin2 = tmp;
  return finlen;
}

function tailinit(xtail, ytail, ax, ay, bx, by, a, b) {
  let bvirt, c, ahi, alo, bhi, blo, _i, _j, _k, _0, s1, s0, t1, t0, u3, negate;

  if (xtail === 0) {
    if (ytail === 0) {
      a[0] = 0;
      b[0] = 0;
      return 1;
    } else {
      negate = -ytail;
      s1 = negate * ax;
      c = _util.splitter * negate;
      ahi = c - (c - negate);
      alo = negate - ahi;
      c = _util.splitter * ax;
      bhi = c - (c - ax);
      blo = ax - bhi;
      a[0] = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
      a[1] = s1;
      s1 = ytail * bx;
      c = _util.splitter * ytail;
      ahi = c - (c - ytail);
      alo = ytail - ahi;
      c = _util.splitter * bx;
      bhi = c - (c - bx);
      blo = bx - bhi;
      b[0] = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
      b[1] = s1;
      return 2;
    }
  } else {
    if (ytail === 0) {
      s1 = xtail * ay;
      c = _util.splitter * xtail;
      ahi = c - (c - xtail);
      alo = xtail - ahi;
      c = _util.splitter * ay;
      bhi = c - (c - ay);
      blo = ay - bhi;
      a[0] = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
      a[1] = s1;
      negate = -xtail;
      s1 = negate * by;
      c = _util.splitter * negate;
      ahi = c - (c - negate);
      alo = negate - ahi;
      c = _util.splitter * by;
      bhi = c - (c - by);
      blo = by - bhi;
      b[0] = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
      b[1] = s1;
      return 2;
    } else {
      s1 = xtail * ay;
      c = _util.splitter * xtail;
      ahi = c - (c - xtail);
      alo = xtail - ahi;
      c = _util.splitter * ay;
      bhi = c - (c - ay);
      blo = ay - bhi;
      s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
      t1 = ytail * ax;
      c = _util.splitter * ytail;
      ahi = c - (c - ytail);
      alo = ytail - ahi;
      c = _util.splitter * ax;
      bhi = c - (c - ax);
      blo = ax - bhi;
      t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
      _i = s0 - t0;
      bvirt = s0 - _i;
      a[0] = s0 - (_i + bvirt) + (bvirt - t0);
      _j = s1 + _i;
      bvirt = _j - s1;
      _0 = s1 - (_j - bvirt) + (_i - bvirt);
      _i = _0 - t1;
      bvirt = _0 - _i;
      a[1] = _0 - (_i + bvirt) + (bvirt - t1);
      u3 = _j + _i;
      bvirt = u3 - _j;
      a[2] = _j - (u3 - bvirt) + (_i - bvirt);
      a[3] = u3;
      s1 = ytail * bx;
      c = _util.splitter * ytail;
      ahi = c - (c - ytail);
      alo = ytail - ahi;
      c = _util.splitter * bx;
      bhi = c - (c - bx);
      blo = bx - bhi;
      s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
      t1 = xtail * by;
      c = _util.splitter * xtail;
      ahi = c - (c - xtail);
      alo = xtail - ahi;
      c = _util.splitter * by;
      bhi = c - (c - by);
      blo = by - bhi;
      t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
      _i = s0 - t0;
      bvirt = s0 - _i;
      b[0] = s0 - (_i + bvirt) + (bvirt - t0);
      _j = s1 + _i;
      bvirt = _j - s1;
      _0 = s1 - (_j - bvirt) + (_i - bvirt);
      _i = _0 - t1;
      bvirt = _0 - _i;
      b[1] = _0 - (_i + bvirt) + (bvirt - t1);
      u3 = _j + _i;
      bvirt = u3 - _j;
      b[2] = _j - (u3 - bvirt) + (_i - bvirt);
      b[3] = u3;
      return 4;
    }
  }
}

function tailadd(finlen, a, b, k, z) {
  let bvirt, c, ahi, alo, bhi, blo, _i, _j, _k, _0, s1, s0, u3;

  s1 = a * b;
  c = _util.splitter * a;
  ahi = c - (c - a);
  alo = a - ahi;
  c = _util.splitter * b;
  bhi = c - (c - b);
  blo = b - bhi;
  s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
  c = _util.splitter * k;
  bhi = c - (c - k);
  blo = k - bhi;
  _i = s0 * k;
  c = _util.splitter * s0;
  ahi = c - (c - s0);
  alo = s0 - ahi;
  u[0] = alo * blo - (_i - ahi * bhi - alo * bhi - ahi * blo);
  _j = s1 * k;
  c = _util.splitter * s1;
  ahi = c - (c - s1);
  alo = s1 - ahi;
  _0 = alo * blo - (_j - ahi * bhi - alo * bhi - ahi * blo);
  _k = _i + _0;
  bvirt = _k - _i;
  u[1] = _i - (_k - bvirt) + (_0 - bvirt);
  u3 = _j + _k;
  u[2] = _k - (u3 - _j);
  u[3] = u3;
  finlen = finadd(finlen, 4, u);

  if (z !== 0) {
    c = _util.splitter * z;
    bhi = c - (c - z);
    blo = z - bhi;
    _i = s0 * z;
    c = _util.splitter * s0;
    ahi = c - (c - s0);
    alo = s0 - ahi;
    u[0] = alo * blo - (_i - ahi * bhi - alo * bhi - ahi * blo);
    _j = s1 * z;
    c = _util.splitter * s1;
    ahi = c - (c - s1);
    alo = s1 - ahi;
    _0 = alo * blo - (_j - ahi * bhi - alo * bhi - ahi * blo);
    _k = _i + _0;
    bvirt = _k - _i;
    u[1] = _i - (_k - bvirt) + (_0 - bvirt);
    u3 = _j + _k;
    u[2] = _k - (u3 - _j);
    u[3] = u3;
    finlen = finadd(finlen, 4, u);
  }

  return finlen;
}

function orient3dadapt(ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz, permanent) {
  let finlen;
  let adxtail, bdxtail, cdxtail;
  let adytail, bdytail, cdytail;
  let adztail, bdztail, cdztail;

  let bvirt, c, ahi, alo, bhi, blo, _i, _j, _k, _0, s1, s0, t1, t0, u3;

  const adx = ax - dx;
  const bdx = bx - dx;
  const cdx = cx - dx;
  const ady = ay - dy;
  const bdy = by - dy;
  const cdy = cy - dy;
  const adz = az - dz;
  const bdz = bz - dz;
  const cdz = cz - dz;
  s1 = bdx * cdy;
  c = _util.splitter * bdx;
  ahi = c - (c - bdx);
  alo = bdx - ahi;
  c = _util.splitter * cdy;
  bhi = c - (c - cdy);
  blo = cdy - bhi;
  s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
  t1 = cdx * bdy;
  c = _util.splitter * cdx;
  ahi = c - (c - cdx);
  alo = cdx - ahi;
  c = _util.splitter * bdy;
  bhi = c - (c - bdy);
  blo = bdy - bhi;
  t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
  _i = s0 - t0;
  bvirt = s0 - _i;
  bc[0] = s0 - (_i + bvirt) + (bvirt - t0);
  _j = s1 + _i;
  bvirt = _j - s1;
  _0 = s1 - (_j - bvirt) + (_i - bvirt);
  _i = _0 - t1;
  bvirt = _0 - _i;
  bc[1] = _0 - (_i + bvirt) + (bvirt - t1);
  u3 = _j + _i;
  bvirt = u3 - _j;
  bc[2] = _j - (u3 - bvirt) + (_i - bvirt);
  bc[3] = u3;
  s1 = cdx * ady;
  c = _util.splitter * cdx;
  ahi = c - (c - cdx);
  alo = cdx - ahi;
  c = _util.splitter * ady;
  bhi = c - (c - ady);
  blo = ady - bhi;
  s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
  t1 = adx * cdy;
  c = _util.splitter * adx;
  ahi = c - (c - adx);
  alo = adx - ahi;
  c = _util.splitter * cdy;
  bhi = c - (c - cdy);
  blo = cdy - bhi;
  t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
  _i = s0 - t0;
  bvirt = s0 - _i;
  ca[0] = s0 - (_i + bvirt) + (bvirt - t0);
  _j = s1 + _i;
  bvirt = _j - s1;
  _0 = s1 - (_j - bvirt) + (_i - bvirt);
  _i = _0 - t1;
  bvirt = _0 - _i;
  ca[1] = _0 - (_i + bvirt) + (bvirt - t1);
  u3 = _j + _i;
  bvirt = u3 - _j;
  ca[2] = _j - (u3 - bvirt) + (_i - bvirt);
  ca[3] = u3;
  s1 = adx * bdy;
  c = _util.splitter * adx;
  ahi = c - (c - adx);
  alo = adx - ahi;
  c = _util.splitter * bdy;
  bhi = c - (c - bdy);
  blo = bdy - bhi;
  s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
  t1 = bdx * ady;
  c = _util.splitter * bdx;
  ahi = c - (c - bdx);
  alo = bdx - ahi;
  c = _util.splitter * ady;
  bhi = c - (c - ady);
  blo = ady - bhi;
  t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
  _i = s0 - t0;
  bvirt = s0 - _i;
  ab[0] = s0 - (_i + bvirt) + (bvirt - t0);
  _j = s1 + _i;
  bvirt = _j - s1;
  _0 = s1 - (_j - bvirt) + (_i - bvirt);
  _i = _0 - t1;
  bvirt = _0 - _i;
  ab[1] = _0 - (_i + bvirt) + (bvirt - t1);
  u3 = _j + _i;
  bvirt = u3 - _j;
  ab[2] = _j - (u3 - bvirt) + (_i - bvirt);
  ab[3] = u3;
  finlen = (0, _util.sum)((0, _util.sum)((0, _util.scale)(4, bc, adz, _8), _8, (0, _util.scale)(4, ca, bdz, _8b), _8b, _16), _16, (0, _util.scale)(4, ab, cdz, _8), _8, fin);
  let det = (0, _util.estimate)(finlen, fin);
  let errbound = o3derrboundB * permanent;

  if (det >= errbound || -det >= errbound) {
    return det;
  }

  bvirt = ax - adx;
  adxtail = ax - (adx + bvirt) + (bvirt - dx);
  bvirt = bx - bdx;
  bdxtail = bx - (bdx + bvirt) + (bvirt - dx);
  bvirt = cx - cdx;
  cdxtail = cx - (cdx + bvirt) + (bvirt - dx);
  bvirt = ay - ady;
  adytail = ay - (ady + bvirt) + (bvirt - dy);
  bvirt = by - bdy;
  bdytail = by - (bdy + bvirt) + (bvirt - dy);
  bvirt = cy - cdy;
  cdytail = cy - (cdy + bvirt) + (bvirt - dy);
  bvirt = az - adz;
  adztail = az - (adz + bvirt) + (bvirt - dz);
  bvirt = bz - bdz;
  bdztail = bz - (bdz + bvirt) + (bvirt - dz);
  bvirt = cz - cdz;
  cdztail = cz - (cdz + bvirt) + (bvirt - dz);

  if (adxtail === 0 && bdxtail === 0 && cdxtail === 0 && adytail === 0 && bdytail === 0 && cdytail === 0 && adztail === 0 && bdztail === 0 && cdztail === 0) {
    return det;
  }

  errbound = o3derrboundC * permanent + _util.resulterrbound * Math.abs(det);
  det += adz * (bdx * cdytail + cdy * bdxtail - (bdy * cdxtail + cdx * bdytail)) + adztail * (bdx * cdy - bdy * cdx) + bdz * (cdx * adytail + ady * cdxtail - (cdy * adxtail + adx * cdytail)) + bdztail * (cdx * ady - cdy * adx) + cdz * (adx * bdytail + bdy * adxtail - (ady * bdxtail + bdx * adytail)) + cdztail * (adx * bdy - ady * bdx);

  if (det >= errbound || -det >= errbound) {
    return det;
  }

  const at_len = tailinit(adxtail, adytail, bdx, bdy, cdx, cdy, at_b, at_c);
  const bt_len = tailinit(bdxtail, bdytail, cdx, cdy, adx, ady, bt_c, bt_a);
  const ct_len = tailinit(cdxtail, cdytail, adx, ady, bdx, bdy, ct_a, ct_b);
  const bctlen = (0, _util.sum)(bt_len, bt_c, ct_len, ct_b, bct);
  finlen = finadd(finlen, (0, _util.scale)(bctlen, bct, adz, _16), _16);
  const catlen = (0, _util.sum)(ct_len, ct_a, at_len, at_c, cat);
  finlen = finadd(finlen, (0, _util.scale)(catlen, cat, bdz, _16), _16);
  const abtlen = (0, _util.sum)(at_len, at_b, bt_len, bt_a, abt);
  finlen = finadd(finlen, (0, _util.scale)(abtlen, abt, cdz, _16), _16);

  if (adztail !== 0) {
    finlen = finadd(finlen, (0, _util.scale)(4, bc, adztail, _12), _12);
    finlen = finadd(finlen, (0, _util.scale)(bctlen, bct, adztail, _16), _16);
  }

  if (bdztail !== 0) {
    finlen = finadd(finlen, (0, _util.scale)(4, ca, bdztail, _12), _12);
    finlen = finadd(finlen, (0, _util.scale)(catlen, cat, bdztail, _16), _16);
  }

  if (cdztail !== 0) {
    finlen = finadd(finlen, (0, _util.scale)(4, ab, cdztail, _12), _12);
    finlen = finadd(finlen, (0, _util.scale)(abtlen, abt, cdztail, _16), _16);
  }

  if (adxtail !== 0) {
    if (bdytail !== 0) {
      finlen = tailadd(finlen, adxtail, bdytail, cdz, cdztail);
    }

    if (cdytail !== 0) {
      finlen = tailadd(finlen, -adxtail, cdytail, bdz, bdztail);
    }
  }

  if (bdxtail !== 0) {
    if (cdytail !== 0) {
      finlen = tailadd(finlen, bdxtail, cdytail, adz, adztail);
    }

    if (adytail !== 0) {
      finlen = tailadd(finlen, -bdxtail, adytail, cdz, cdztail);
    }
  }

  if (cdxtail !== 0) {
    if (adytail !== 0) {
      finlen = tailadd(finlen, cdxtail, adytail, bdz, bdztail);
    }

    if (bdytail !== 0) {
      finlen = tailadd(finlen, -cdxtail, bdytail, adz, adztail);
    }
  }

  return fin[finlen - 1];
}

function orient3d(ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz) {
  const adx = ax - dx;
  const bdx = bx - dx;
  const cdx = cx - dx;
  const ady = ay - dy;
  const bdy = by - dy;
  const cdy = cy - dy;
  const adz = az - dz;
  const bdz = bz - dz;
  const cdz = cz - dz;
  const bdxcdy = bdx * cdy;
  const cdxbdy = cdx * bdy;
  const cdxady = cdx * ady;
  const adxcdy = adx * cdy;
  const adxbdy = adx * bdy;
  const bdxady = bdx * ady;
  const det = adz * (bdxcdy - cdxbdy) + bdz * (cdxady - adxcdy) + cdz * (adxbdy - bdxady);
  const permanent = (Math.abs(bdxcdy) + Math.abs(cdxbdy)) * Math.abs(adz) + (Math.abs(cdxady) + Math.abs(adxcdy)) * Math.abs(bdz) + (Math.abs(adxbdy) + Math.abs(bdxady)) * Math.abs(cdz);
  const errbound = o3derrboundA * permanent;

  if (det > errbound || -det > errbound) {
    return det;
  }

  return orient3dadapt(ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz, permanent);
}

function orient3dfast(ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz) {
  const adx = ax - dx;
  const bdx = bx - dx;
  const cdx = cx - dx;
  const ady = ay - dy;
  const bdy = by - dy;
  const cdy = cy - dy;
  const adz = az - dz;
  const bdz = bz - dz;
  const cdz = cz - dz;
  return adx * (bdy * cdz - bdz * cdy) + bdx * (cdy * adz - cdz * ady) + cdx * (ady * bdz - adz * bdy);
}
},{"./util.js":"tU1w"}],"yQlA":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.incircle = incircle;
exports.incirclefast = incirclefast;

var _util = require("./util.js");

const iccerrboundA = (10 + 96 * _util.epsilon) * _util.epsilon;
const iccerrboundB = (4 + 48 * _util.epsilon) * _util.epsilon;
const iccerrboundC = (44 + 576 * _util.epsilon) * _util.epsilon * _util.epsilon;
const bc = (0, _util.vec)(4);
const ca = (0, _util.vec)(4);
const ab = (0, _util.vec)(4);
const aa = (0, _util.vec)(4);
const bb = (0, _util.vec)(4);
const cc = (0, _util.vec)(4);
const u = (0, _util.vec)(4);
const v = (0, _util.vec)(4);
const axtbc = (0, _util.vec)(8);
const aytbc = (0, _util.vec)(8);
const bxtca = (0, _util.vec)(8);
const bytca = (0, _util.vec)(8);
const cxtab = (0, _util.vec)(8);
const cytab = (0, _util.vec)(8);
const abt = (0, _util.vec)(8);
const bct = (0, _util.vec)(8);
const cat = (0, _util.vec)(8);
const abtt = (0, _util.vec)(4);
const bctt = (0, _util.vec)(4);
const catt = (0, _util.vec)(4);

const _8 = (0, _util.vec)(8);

const _16 = (0, _util.vec)(16);

const _16b = (0, _util.vec)(16);

const _16c = (0, _util.vec)(16);

const _32 = (0, _util.vec)(32);

const _32b = (0, _util.vec)(32);

const _48 = (0, _util.vec)(48);

const _64 = (0, _util.vec)(64);

let fin = (0, _util.vec)(1152);
let fin2 = (0, _util.vec)(1152);

function finadd(finlen, a, alen) {
  finlen = (0, _util.sum)(finlen, fin, a, alen, fin2);
  const tmp = fin;
  fin = fin2;
  fin2 = tmp;
  return finlen;
}

function incircleadapt(ax, ay, bx, by, cx, cy, dx, dy, permanent) {
  let finlen;
  let adxtail, bdxtail, cdxtail, adytail, bdytail, cdytail;
  let axtbclen, aytbclen, bxtcalen, bytcalen, cxtablen, cytablen;
  let abtlen, bctlen, catlen;
  let abttlen, bcttlen, cattlen;
  let n1, n0;

  let bvirt, c, ahi, alo, bhi, blo, _i, _j, _0, s1, s0, t1, t0, u3;

  const adx = ax - dx;
  const bdx = bx - dx;
  const cdx = cx - dx;
  const ady = ay - dy;
  const bdy = by - dy;
  const cdy = cy - dy;
  s1 = bdx * cdy;
  c = _util.splitter * bdx;
  ahi = c - (c - bdx);
  alo = bdx - ahi;
  c = _util.splitter * cdy;
  bhi = c - (c - cdy);
  blo = cdy - bhi;
  s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
  t1 = cdx * bdy;
  c = _util.splitter * cdx;
  ahi = c - (c - cdx);
  alo = cdx - ahi;
  c = _util.splitter * bdy;
  bhi = c - (c - bdy);
  blo = bdy - bhi;
  t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
  _i = s0 - t0;
  bvirt = s0 - _i;
  bc[0] = s0 - (_i + bvirt) + (bvirt - t0);
  _j = s1 + _i;
  bvirt = _j - s1;
  _0 = s1 - (_j - bvirt) + (_i - bvirt);
  _i = _0 - t1;
  bvirt = _0 - _i;
  bc[1] = _0 - (_i + bvirt) + (bvirt - t1);
  u3 = _j + _i;
  bvirt = u3 - _j;
  bc[2] = _j - (u3 - bvirt) + (_i - bvirt);
  bc[3] = u3;
  s1 = cdx * ady;
  c = _util.splitter * cdx;
  ahi = c - (c - cdx);
  alo = cdx - ahi;
  c = _util.splitter * ady;
  bhi = c - (c - ady);
  blo = ady - bhi;
  s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
  t1 = adx * cdy;
  c = _util.splitter * adx;
  ahi = c - (c - adx);
  alo = adx - ahi;
  c = _util.splitter * cdy;
  bhi = c - (c - cdy);
  blo = cdy - bhi;
  t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
  _i = s0 - t0;
  bvirt = s0 - _i;
  ca[0] = s0 - (_i + bvirt) + (bvirt - t0);
  _j = s1 + _i;
  bvirt = _j - s1;
  _0 = s1 - (_j - bvirt) + (_i - bvirt);
  _i = _0 - t1;
  bvirt = _0 - _i;
  ca[1] = _0 - (_i + bvirt) + (bvirt - t1);
  u3 = _j + _i;
  bvirt = u3 - _j;
  ca[2] = _j - (u3 - bvirt) + (_i - bvirt);
  ca[3] = u3;
  s1 = adx * bdy;
  c = _util.splitter * adx;
  ahi = c - (c - adx);
  alo = adx - ahi;
  c = _util.splitter * bdy;
  bhi = c - (c - bdy);
  blo = bdy - bhi;
  s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
  t1 = bdx * ady;
  c = _util.splitter * bdx;
  ahi = c - (c - bdx);
  alo = bdx - ahi;
  c = _util.splitter * ady;
  bhi = c - (c - ady);
  blo = ady - bhi;
  t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
  _i = s0 - t0;
  bvirt = s0 - _i;
  ab[0] = s0 - (_i + bvirt) + (bvirt - t0);
  _j = s1 + _i;
  bvirt = _j - s1;
  _0 = s1 - (_j - bvirt) + (_i - bvirt);
  _i = _0 - t1;
  bvirt = _0 - _i;
  ab[1] = _0 - (_i + bvirt) + (bvirt - t1);
  u3 = _j + _i;
  bvirt = u3 - _j;
  ab[2] = _j - (u3 - bvirt) + (_i - bvirt);
  ab[3] = u3;
  finlen = (0, _util.sum)((0, _util.sum)((0, _util.sum)((0, _util.scale)((0, _util.scale)(4, bc, adx, _8), _8, adx, _16), _16, (0, _util.scale)((0, _util.scale)(4, bc, ady, _8), _8, ady, _16b), _16b, _32), _32, (0, _util.sum)((0, _util.scale)((0, _util.scale)(4, ca, bdx, _8), _8, bdx, _16), _16, (0, _util.scale)((0, _util.scale)(4, ca, bdy, _8), _8, bdy, _16b), _16b, _32b), _32b, _64), _64, (0, _util.sum)((0, _util.scale)((0, _util.scale)(4, ab, cdx, _8), _8, cdx, _16), _16, (0, _util.scale)((0, _util.scale)(4, ab, cdy, _8), _8, cdy, _16b), _16b, _32), _32, fin);
  let det = (0, _util.estimate)(finlen, fin);
  let errbound = iccerrboundB * permanent;

  if (det >= errbound || -det >= errbound) {
    return det;
  }

  bvirt = ax - adx;
  adxtail = ax - (adx + bvirt) + (bvirt - dx);
  bvirt = ay - ady;
  adytail = ay - (ady + bvirt) + (bvirt - dy);
  bvirt = bx - bdx;
  bdxtail = bx - (bdx + bvirt) + (bvirt - dx);
  bvirt = by - bdy;
  bdytail = by - (bdy + bvirt) + (bvirt - dy);
  bvirt = cx - cdx;
  cdxtail = cx - (cdx + bvirt) + (bvirt - dx);
  bvirt = cy - cdy;
  cdytail = cy - (cdy + bvirt) + (bvirt - dy);

  if (adxtail === 0 && bdxtail === 0 && cdxtail === 0 && adytail === 0 && bdytail === 0 && cdytail === 0) {
    return det;
  }

  errbound = iccerrboundC * permanent + _util.resulterrbound * Math.abs(det);
  det += (adx * adx + ady * ady) * (bdx * cdytail + cdy * bdxtail - (bdy * cdxtail + cdx * bdytail)) + 2 * (adx * adxtail + ady * adytail) * (bdx * cdy - bdy * cdx) + ((bdx * bdx + bdy * bdy) * (cdx * adytail + ady * cdxtail - (cdy * adxtail + adx * cdytail)) + 2 * (bdx * bdxtail + bdy * bdytail) * (cdx * ady - cdy * adx)) + ((cdx * cdx + cdy * cdy) * (adx * bdytail + bdy * adxtail - (ady * bdxtail + bdx * adytail)) + 2 * (cdx * cdxtail + cdy * cdytail) * (adx * bdy - ady * bdx));

  if (det >= errbound || -det >= errbound) {
    return det;
  }

  if (bdxtail !== 0 || bdytail !== 0 || cdxtail !== 0 || cdytail !== 0) {
    s1 = adx * adx;
    c = _util.splitter * adx;
    ahi = c - (c - adx);
    alo = adx - ahi;
    s0 = alo * alo - (s1 - ahi * ahi - (ahi + ahi) * alo);
    t1 = ady * ady;
    c = _util.splitter * ady;
    ahi = c - (c - ady);
    alo = ady - ahi;
    t0 = alo * alo - (t1 - ahi * ahi - (ahi + ahi) * alo);
    _i = s0 + t0;
    bvirt = _i - s0;
    aa[0] = s0 - (_i - bvirt) + (t0 - bvirt);
    _j = s1 + _i;
    bvirt = _j - s1;
    _0 = s1 - (_j - bvirt) + (_i - bvirt);
    _i = _0 + t1;
    bvirt = _i - _0;
    aa[1] = _0 - (_i - bvirt) + (t1 - bvirt);
    u3 = _j + _i;
    bvirt = u3 - _j;
    aa[2] = _j - (u3 - bvirt) + (_i - bvirt);
    aa[3] = u3;
  }

  if (cdxtail !== 0 || cdytail !== 0 || adxtail !== 0 || adytail !== 0) {
    s1 = bdx * bdx;
    c = _util.splitter * bdx;
    ahi = c - (c - bdx);
    alo = bdx - ahi;
    s0 = alo * alo - (s1 - ahi * ahi - (ahi + ahi) * alo);
    t1 = bdy * bdy;
    c = _util.splitter * bdy;
    ahi = c - (c - bdy);
    alo = bdy - ahi;
    t0 = alo * alo - (t1 - ahi * ahi - (ahi + ahi) * alo);
    _i = s0 + t0;
    bvirt = _i - s0;
    bb[0] = s0 - (_i - bvirt) + (t0 - bvirt);
    _j = s1 + _i;
    bvirt = _j - s1;
    _0 = s1 - (_j - bvirt) + (_i - bvirt);
    _i = _0 + t1;
    bvirt = _i - _0;
    bb[1] = _0 - (_i - bvirt) + (t1 - bvirt);
    u3 = _j + _i;
    bvirt = u3 - _j;
    bb[2] = _j - (u3 - bvirt) + (_i - bvirt);
    bb[3] = u3;
  }

  if (adxtail !== 0 || adytail !== 0 || bdxtail !== 0 || bdytail !== 0) {
    s1 = cdx * cdx;
    c = _util.splitter * cdx;
    ahi = c - (c - cdx);
    alo = cdx - ahi;
    s0 = alo * alo - (s1 - ahi * ahi - (ahi + ahi) * alo);
    t1 = cdy * cdy;
    c = _util.splitter * cdy;
    ahi = c - (c - cdy);
    alo = cdy - ahi;
    t0 = alo * alo - (t1 - ahi * ahi - (ahi + ahi) * alo);
    _i = s0 + t0;
    bvirt = _i - s0;
    cc[0] = s0 - (_i - bvirt) + (t0 - bvirt);
    _j = s1 + _i;
    bvirt = _j - s1;
    _0 = s1 - (_j - bvirt) + (_i - bvirt);
    _i = _0 + t1;
    bvirt = _i - _0;
    cc[1] = _0 - (_i - bvirt) + (t1 - bvirt);
    u3 = _j + _i;
    bvirt = u3 - _j;
    cc[2] = _j - (u3 - bvirt) + (_i - bvirt);
    cc[3] = u3;
  }

  if (adxtail !== 0) {
    axtbclen = (0, _util.scale)(4, bc, adxtail, axtbc);
    finlen = finadd(finlen, (0, _util.sum_three)((0, _util.scale)(axtbclen, axtbc, 2 * adx, _16), _16, (0, _util.scale)((0, _util.scale)(4, cc, adxtail, _8), _8, bdy, _16b), _16b, (0, _util.scale)((0, _util.scale)(4, bb, adxtail, _8), _8, -cdy, _16c), _16c, _32, _48), _48);
  }

  if (adytail !== 0) {
    aytbclen = (0, _util.scale)(4, bc, adytail, aytbc);
    finlen = finadd(finlen, (0, _util.sum_three)((0, _util.scale)(aytbclen, aytbc, 2 * ady, _16), _16, (0, _util.scale)((0, _util.scale)(4, bb, adytail, _8), _8, cdx, _16b), _16b, (0, _util.scale)((0, _util.scale)(4, cc, adytail, _8), _8, -bdx, _16c), _16c, _32, _48), _48);
  }

  if (bdxtail !== 0) {
    bxtcalen = (0, _util.scale)(4, ca, bdxtail, bxtca);
    finlen = finadd(finlen, (0, _util.sum_three)((0, _util.scale)(bxtcalen, bxtca, 2 * bdx, _16), _16, (0, _util.scale)((0, _util.scale)(4, aa, bdxtail, _8), _8, cdy, _16b), _16b, (0, _util.scale)((0, _util.scale)(4, cc, bdxtail, _8), _8, -ady, _16c), _16c, _32, _48), _48);
  }

  if (bdytail !== 0) {
    bytcalen = (0, _util.scale)(4, ca, bdytail, bytca);
    finlen = finadd(finlen, (0, _util.sum_three)((0, _util.scale)(bytcalen, bytca, 2 * bdy, _16), _16, (0, _util.scale)((0, _util.scale)(4, cc, bdytail, _8), _8, adx, _16b), _16b, (0, _util.scale)((0, _util.scale)(4, aa, bdytail, _8), _8, -cdx, _16c), _16c, _32, _48), _48);
  }

  if (cdxtail !== 0) {
    cxtablen = (0, _util.scale)(4, ab, cdxtail, cxtab);
    finlen = finadd(finlen, (0, _util.sum_three)((0, _util.scale)(cxtablen, cxtab, 2 * cdx, _16), _16, (0, _util.scale)((0, _util.scale)(4, bb, cdxtail, _8), _8, ady, _16b), _16b, (0, _util.scale)((0, _util.scale)(4, aa, cdxtail, _8), _8, -bdy, _16c), _16c, _32, _48), _48);
  }

  if (cdytail !== 0) {
    cytablen = (0, _util.scale)(4, ab, cdytail, cytab);
    finlen = finadd(finlen, (0, _util.sum_three)((0, _util.scale)(cytablen, cytab, 2 * cdy, _16), _16, (0, _util.scale)((0, _util.scale)(4, aa, cdytail, _8), _8, bdx, _16b), _16b, (0, _util.scale)((0, _util.scale)(4, bb, cdytail, _8), _8, -adx, _16c), _16c, _32, _48), _48);
  }

  if (adxtail !== 0 || adytail !== 0) {
    if (bdxtail !== 0 || bdytail !== 0 || cdxtail !== 0 || cdytail !== 0) {
      s1 = bdxtail * cdy;
      c = _util.splitter * bdxtail;
      ahi = c - (c - bdxtail);
      alo = bdxtail - ahi;
      c = _util.splitter * cdy;
      bhi = c - (c - cdy);
      blo = cdy - bhi;
      s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
      t1 = bdx * cdytail;
      c = _util.splitter * bdx;
      ahi = c - (c - bdx);
      alo = bdx - ahi;
      c = _util.splitter * cdytail;
      bhi = c - (c - cdytail);
      blo = cdytail - bhi;
      t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
      _i = s0 + t0;
      bvirt = _i - s0;
      u[0] = s0 - (_i - bvirt) + (t0 - bvirt);
      _j = s1 + _i;
      bvirt = _j - s1;
      _0 = s1 - (_j - bvirt) + (_i - bvirt);
      _i = _0 + t1;
      bvirt = _i - _0;
      u[1] = _0 - (_i - bvirt) + (t1 - bvirt);
      u3 = _j + _i;
      bvirt = u3 - _j;
      u[2] = _j - (u3 - bvirt) + (_i - bvirt);
      u[3] = u3;
      s1 = cdxtail * -bdy;
      c = _util.splitter * cdxtail;
      ahi = c - (c - cdxtail);
      alo = cdxtail - ahi;
      c = _util.splitter * -bdy;
      bhi = c - (c - -bdy);
      blo = -bdy - bhi;
      s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
      t1 = cdx * -bdytail;
      c = _util.splitter * cdx;
      ahi = c - (c - cdx);
      alo = cdx - ahi;
      c = _util.splitter * -bdytail;
      bhi = c - (c - -bdytail);
      blo = -bdytail - bhi;
      t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
      _i = s0 + t0;
      bvirt = _i - s0;
      v[0] = s0 - (_i - bvirt) + (t0 - bvirt);
      _j = s1 + _i;
      bvirt = _j - s1;
      _0 = s1 - (_j - bvirt) + (_i - bvirt);
      _i = _0 + t1;
      bvirt = _i - _0;
      v[1] = _0 - (_i - bvirt) + (t1 - bvirt);
      u3 = _j + _i;
      bvirt = u3 - _j;
      v[2] = _j - (u3 - bvirt) + (_i - bvirt);
      v[3] = u3;
      bctlen = (0, _util.sum)(4, u, 4, v, bct);
      s1 = bdxtail * cdytail;
      c = _util.splitter * bdxtail;
      ahi = c - (c - bdxtail);
      alo = bdxtail - ahi;
      c = _util.splitter * cdytail;
      bhi = c - (c - cdytail);
      blo = cdytail - bhi;
      s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
      t1 = cdxtail * bdytail;
      c = _util.splitter * cdxtail;
      ahi = c - (c - cdxtail);
      alo = cdxtail - ahi;
      c = _util.splitter * bdytail;
      bhi = c - (c - bdytail);
      blo = bdytail - bhi;
      t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
      _i = s0 - t0;
      bvirt = s0 - _i;
      bctt[0] = s0 - (_i + bvirt) + (bvirt - t0);
      _j = s1 + _i;
      bvirt = _j - s1;
      _0 = s1 - (_j - bvirt) + (_i - bvirt);
      _i = _0 - t1;
      bvirt = _0 - _i;
      bctt[1] = _0 - (_i + bvirt) + (bvirt - t1);
      u3 = _j + _i;
      bvirt = u3 - _j;
      bctt[2] = _j - (u3 - bvirt) + (_i - bvirt);
      bctt[3] = u3;
      bcttlen = 4;
    } else {
      bct[0] = 0;
      bctlen = 1;
      bctt[0] = 0;
      bcttlen = 1;
    }

    if (adxtail !== 0) {
      const len = (0, _util.scale)(bctlen, bct, adxtail, _16c);
      finlen = finadd(finlen, (0, _util.sum)((0, _util.scale)(axtbclen, axtbc, adxtail, _16), _16, (0, _util.scale)(len, _16c, 2 * adx, _32), _32, _48), _48);
      const len2 = (0, _util.scale)(bcttlen, bctt, adxtail, _8);
      finlen = finadd(finlen, (0, _util.sum_three)((0, _util.scale)(len2, _8, 2 * adx, _16), _16, (0, _util.scale)(len2, _8, adxtail, _16b), _16b, (0, _util.scale)(len, _16c, adxtail, _32), _32, _32b, _64), _64);

      if (bdytail !== 0) {
        finlen = finadd(finlen, (0, _util.scale)((0, _util.scale)(4, cc, adxtail, _8), _8, bdytail, _16), _16);
      }

      if (cdytail !== 0) {
        finlen = finadd(finlen, (0, _util.scale)((0, _util.scale)(4, bb, -adxtail, _8), _8, cdytail, _16), _16);
      }
    }

    if (adytail !== 0) {
      const len = (0, _util.scale)(bctlen, bct, adytail, _16c);
      finlen = finadd(finlen, (0, _util.sum)((0, _util.scale)(aytbclen, aytbc, adytail, _16), _16, (0, _util.scale)(len, _16c, 2 * ady, _32), _32, _48), _48);
      const len2 = (0, _util.scale)(bcttlen, bctt, adytail, _8);
      finlen = finadd(finlen, (0, _util.sum_three)((0, _util.scale)(len2, _8, 2 * ady, _16), _16, (0, _util.scale)(len2, _8, adytail, _16b), _16b, (0, _util.scale)(len, _16c, adytail, _32), _32, _32b, _64), _64);
    }
  }

  if (bdxtail !== 0 || bdytail !== 0) {
    if (cdxtail !== 0 || cdytail !== 0 || adxtail !== 0 || adytail !== 0) {
      s1 = cdxtail * ady;
      c = _util.splitter * cdxtail;
      ahi = c - (c - cdxtail);
      alo = cdxtail - ahi;
      c = _util.splitter * ady;
      bhi = c - (c - ady);
      blo = ady - bhi;
      s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
      t1 = cdx * adytail;
      c = _util.splitter * cdx;
      ahi = c - (c - cdx);
      alo = cdx - ahi;
      c = _util.splitter * adytail;
      bhi = c - (c - adytail);
      blo = adytail - bhi;
      t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
      _i = s0 + t0;
      bvirt = _i - s0;
      u[0] = s0 - (_i - bvirt) + (t0 - bvirt);
      _j = s1 + _i;
      bvirt = _j - s1;
      _0 = s1 - (_j - bvirt) + (_i - bvirt);
      _i = _0 + t1;
      bvirt = _i - _0;
      u[1] = _0 - (_i - bvirt) + (t1 - bvirt);
      u3 = _j + _i;
      bvirt = u3 - _j;
      u[2] = _j - (u3 - bvirt) + (_i - bvirt);
      u[3] = u3;
      n1 = -cdy;
      n0 = -cdytail;
      s1 = adxtail * n1;
      c = _util.splitter * adxtail;
      ahi = c - (c - adxtail);
      alo = adxtail - ahi;
      c = _util.splitter * n1;
      bhi = c - (c - n1);
      blo = n1 - bhi;
      s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
      t1 = adx * n0;
      c = _util.splitter * adx;
      ahi = c - (c - adx);
      alo = adx - ahi;
      c = _util.splitter * n0;
      bhi = c - (c - n0);
      blo = n0 - bhi;
      t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
      _i = s0 + t0;
      bvirt = _i - s0;
      v[0] = s0 - (_i - bvirt) + (t0 - bvirt);
      _j = s1 + _i;
      bvirt = _j - s1;
      _0 = s1 - (_j - bvirt) + (_i - bvirt);
      _i = _0 + t1;
      bvirt = _i - _0;
      v[1] = _0 - (_i - bvirt) + (t1 - bvirt);
      u3 = _j + _i;
      bvirt = u3 - _j;
      v[2] = _j - (u3 - bvirt) + (_i - bvirt);
      v[3] = u3;
      catlen = (0, _util.sum)(4, u, 4, v, cat);
      s1 = cdxtail * adytail;
      c = _util.splitter * cdxtail;
      ahi = c - (c - cdxtail);
      alo = cdxtail - ahi;
      c = _util.splitter * adytail;
      bhi = c - (c - adytail);
      blo = adytail - bhi;
      s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
      t1 = adxtail * cdytail;
      c = _util.splitter * adxtail;
      ahi = c - (c - adxtail);
      alo = adxtail - ahi;
      c = _util.splitter * cdytail;
      bhi = c - (c - cdytail);
      blo = cdytail - bhi;
      t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
      _i = s0 - t0;
      bvirt = s0 - _i;
      catt[0] = s0 - (_i + bvirt) + (bvirt - t0);
      _j = s1 + _i;
      bvirt = _j - s1;
      _0 = s1 - (_j - bvirt) + (_i - bvirt);
      _i = _0 - t1;
      bvirt = _0 - _i;
      catt[1] = _0 - (_i + bvirt) + (bvirt - t1);
      u3 = _j + _i;
      bvirt = u3 - _j;
      catt[2] = _j - (u3 - bvirt) + (_i - bvirt);
      catt[3] = u3;
      cattlen = 4;
    } else {
      cat[0] = 0;
      catlen = 1;
      catt[0] = 0;
      cattlen = 1;
    }

    if (bdxtail !== 0) {
      const len = (0, _util.scale)(catlen, cat, bdxtail, _16c);
      finlen = finadd(finlen, (0, _util.sum)((0, _util.scale)(bxtcalen, bxtca, bdxtail, _16), _16, (0, _util.scale)(len, _16c, 2 * bdx, _32), _32, _48), _48);
      const len2 = (0, _util.scale)(cattlen, catt, bdxtail, _8);
      finlen = finadd(finlen, (0, _util.sum_three)((0, _util.scale)(len2, _8, 2 * bdx, _16), _16, (0, _util.scale)(len2, _8, bdxtail, _16b), _16b, (0, _util.scale)(len, _16c, bdxtail, _32), _32, _32b, _64), _64);

      if (cdytail !== 0) {
        finlen = finadd(finlen, (0, _util.scale)((0, _util.scale)(4, aa, bdxtail, _8), _8, cdytail, _16), _16);
      }

      if (adytail !== 0) {
        finlen = finadd(finlen, (0, _util.scale)((0, _util.scale)(4, cc, -bdxtail, _8), _8, adytail, _16), _16);
      }
    }

    if (bdytail !== 0) {
      const len = (0, _util.scale)(catlen, cat, bdytail, _16c);
      finlen = finadd(finlen, (0, _util.sum)((0, _util.scale)(bytcalen, bytca, bdytail, _16), _16, (0, _util.scale)(len, _16c, 2 * bdy, _32), _32, _48), _48);
      const len2 = (0, _util.scale)(cattlen, catt, bdytail, _8);
      finlen = finadd(finlen, (0, _util.sum_three)((0, _util.scale)(len2, _8, 2 * bdy, _16), _16, (0, _util.scale)(len2, _8, bdytail, _16b), _16b, (0, _util.scale)(len, _16c, bdytail, _32), _32, _32b, _64), _64);
    }
  }

  if (cdxtail !== 0 || cdytail !== 0) {
    if (adxtail !== 0 || adytail !== 0 || bdxtail !== 0 || bdytail !== 0) {
      s1 = adxtail * bdy;
      c = _util.splitter * adxtail;
      ahi = c - (c - adxtail);
      alo = adxtail - ahi;
      c = _util.splitter * bdy;
      bhi = c - (c - bdy);
      blo = bdy - bhi;
      s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
      t1 = adx * bdytail;
      c = _util.splitter * adx;
      ahi = c - (c - adx);
      alo = adx - ahi;
      c = _util.splitter * bdytail;
      bhi = c - (c - bdytail);
      blo = bdytail - bhi;
      t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
      _i = s0 + t0;
      bvirt = _i - s0;
      u[0] = s0 - (_i - bvirt) + (t0 - bvirt);
      _j = s1 + _i;
      bvirt = _j - s1;
      _0 = s1 - (_j - bvirt) + (_i - bvirt);
      _i = _0 + t1;
      bvirt = _i - _0;
      u[1] = _0 - (_i - bvirt) + (t1 - bvirt);
      u3 = _j + _i;
      bvirt = u3 - _j;
      u[2] = _j - (u3 - bvirt) + (_i - bvirt);
      u[3] = u3;
      n1 = -ady;
      n0 = -adytail;
      s1 = bdxtail * n1;
      c = _util.splitter * bdxtail;
      ahi = c - (c - bdxtail);
      alo = bdxtail - ahi;
      c = _util.splitter * n1;
      bhi = c - (c - n1);
      blo = n1 - bhi;
      s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
      t1 = bdx * n0;
      c = _util.splitter * bdx;
      ahi = c - (c - bdx);
      alo = bdx - ahi;
      c = _util.splitter * n0;
      bhi = c - (c - n0);
      blo = n0 - bhi;
      t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
      _i = s0 + t0;
      bvirt = _i - s0;
      v[0] = s0 - (_i - bvirt) + (t0 - bvirt);
      _j = s1 + _i;
      bvirt = _j - s1;
      _0 = s1 - (_j - bvirt) + (_i - bvirt);
      _i = _0 + t1;
      bvirt = _i - _0;
      v[1] = _0 - (_i - bvirt) + (t1 - bvirt);
      u3 = _j + _i;
      bvirt = u3 - _j;
      v[2] = _j - (u3 - bvirt) + (_i - bvirt);
      v[3] = u3;
      abtlen = (0, _util.sum)(4, u, 4, v, abt);
      s1 = adxtail * bdytail;
      c = _util.splitter * adxtail;
      ahi = c - (c - adxtail);
      alo = adxtail - ahi;
      c = _util.splitter * bdytail;
      bhi = c - (c - bdytail);
      blo = bdytail - bhi;
      s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
      t1 = bdxtail * adytail;
      c = _util.splitter * bdxtail;
      ahi = c - (c - bdxtail);
      alo = bdxtail - ahi;
      c = _util.splitter * adytail;
      bhi = c - (c - adytail);
      blo = adytail - bhi;
      t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
      _i = s0 - t0;
      bvirt = s0 - _i;
      abtt[0] = s0 - (_i + bvirt) + (bvirt - t0);
      _j = s1 + _i;
      bvirt = _j - s1;
      _0 = s1 - (_j - bvirt) + (_i - bvirt);
      _i = _0 - t1;
      bvirt = _0 - _i;
      abtt[1] = _0 - (_i + bvirt) + (bvirt - t1);
      u3 = _j + _i;
      bvirt = u3 - _j;
      abtt[2] = _j - (u3 - bvirt) + (_i - bvirt);
      abtt[3] = u3;
      abttlen = 4;
    } else {
      abt[0] = 0;
      abtlen = 1;
      abtt[0] = 0;
      abttlen = 1;
    }

    if (cdxtail !== 0) {
      const len = (0, _util.scale)(abtlen, abt, cdxtail, _16c);
      finlen = finadd(finlen, (0, _util.sum)((0, _util.scale)(cxtablen, cxtab, cdxtail, _16), _16, (0, _util.scale)(len, _16c, 2 * cdx, _32), _32, _48), _48);
      const len2 = (0, _util.scale)(abttlen, abtt, cdxtail, _8);
      finlen = finadd(finlen, (0, _util.sum_three)((0, _util.scale)(len2, _8, 2 * cdx, _16), _16, (0, _util.scale)(len2, _8, cdxtail, _16b), _16b, (0, _util.scale)(len, _16c, cdxtail, _32), _32, _32b, _64), _64);

      if (adytail !== 0) {
        finlen = finadd(finlen, (0, _util.scale)((0, _util.scale)(4, bb, cdxtail, _8), _8, adytail, _16), _16);
      }

      if (bdytail !== 0) {
        finlen = finadd(finlen, (0, _util.scale)((0, _util.scale)(4, aa, -cdxtail, _8), _8, bdytail, _16), _16);
      }
    }

    if (cdytail !== 0) {
      const len = (0, _util.scale)(abtlen, abt, cdytail, _16c);
      finlen = finadd(finlen, (0, _util.sum)((0, _util.scale)(cytablen, cytab, cdytail, _16), _16, (0, _util.scale)(len, _16c, 2 * cdy, _32), _32, _48), _48);
      const len2 = (0, _util.scale)(abttlen, abtt, cdytail, _8);
      finlen = finadd(finlen, (0, _util.sum_three)((0, _util.scale)(len2, _8, 2 * cdy, _16), _16, (0, _util.scale)(len2, _8, cdytail, _16b), _16b, (0, _util.scale)(len, _16c, cdytail, _32), _32, _32b, _64), _64);
    }
  }

  return fin[finlen - 1];
}

function incircle(ax, ay, bx, by, cx, cy, dx, dy) {
  const adx = ax - dx;
  const bdx = bx - dx;
  const cdx = cx - dx;
  const ady = ay - dy;
  const bdy = by - dy;
  const cdy = cy - dy;
  const bdxcdy = bdx * cdy;
  const cdxbdy = cdx * bdy;
  const alift = adx * adx + ady * ady;
  const cdxady = cdx * ady;
  const adxcdy = adx * cdy;
  const blift = bdx * bdx + bdy * bdy;
  const adxbdy = adx * bdy;
  const bdxady = bdx * ady;
  const clift = cdx * cdx + cdy * cdy;
  const det = alift * (bdxcdy - cdxbdy) + blift * (cdxady - adxcdy) + clift * (adxbdy - bdxady);
  const permanent = (Math.abs(bdxcdy) + Math.abs(cdxbdy)) * alift + (Math.abs(cdxady) + Math.abs(adxcdy)) * blift + (Math.abs(adxbdy) + Math.abs(bdxady)) * clift;
  const errbound = iccerrboundA * permanent;

  if (det > errbound || -det > errbound) {
    return det;
  }

  return incircleadapt(ax, ay, bx, by, cx, cy, dx, dy, permanent);
}

function incirclefast(ax, ay, bx, by, cx, cy, dx, dy) {
  const adx = ax - dx;
  const ady = ay - dy;
  const bdx = bx - dx;
  const bdy = by - dy;
  const cdx = cx - dx;
  const cdy = cy - dy;
  const abdet = adx * bdy - bdx * ady;
  const bcdet = bdx * cdy - cdx * bdy;
  const cadet = cdx * ady - adx * cdy;
  const alift = adx * adx + ady * ady;
  const blift = bdx * bdx + bdy * bdy;
  const clift = cdx * cdx + cdy * cdy;
  return alift * bcdet + blift * cadet + clift * abdet;
}
},{"./util.js":"tU1w"}],"tPUG":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insphere = insphere;
exports.inspherefast = inspherefast;

var _util = require("./util.js");

const isperrboundA = (16 + 224 * _util.epsilon) * _util.epsilon;
const isperrboundB = (5 + 72 * _util.epsilon) * _util.epsilon;
const isperrboundC = (71 + 1408 * _util.epsilon) * _util.epsilon * _util.epsilon;
const ab = (0, _util.vec)(4);
const bc = (0, _util.vec)(4);
const cd = (0, _util.vec)(4);
const de = (0, _util.vec)(4);
const ea = (0, _util.vec)(4);
const ac = (0, _util.vec)(4);
const bd = (0, _util.vec)(4);
const ce = (0, _util.vec)(4);
const da = (0, _util.vec)(4);
const eb = (0, _util.vec)(4);
const abc = (0, _util.vec)(24);
const bcd = (0, _util.vec)(24);
const cde = (0, _util.vec)(24);
const dea = (0, _util.vec)(24);
const eab = (0, _util.vec)(24);
const abd = (0, _util.vec)(24);
const bce = (0, _util.vec)(24);
const cda = (0, _util.vec)(24);
const deb = (0, _util.vec)(24);
const eac = (0, _util.vec)(24);
const adet = (0, _util.vec)(1152);
const bdet = (0, _util.vec)(1152);
const cdet = (0, _util.vec)(1152);
const ddet = (0, _util.vec)(1152);
const edet = (0, _util.vec)(1152);
const abdet = (0, _util.vec)(2304);
const cddet = (0, _util.vec)(2304);
const cdedet = (0, _util.vec)(3456);
const deter = (0, _util.vec)(5760);

const _8 = (0, _util.vec)(8);

const _8b = (0, _util.vec)(8);

const _8c = (0, _util.vec)(8);

const _16 = (0, _util.vec)(16);

const _24 = (0, _util.vec)(24);

const _48 = (0, _util.vec)(48);

const _48b = (0, _util.vec)(48);

const _96 = (0, _util.vec)(96);

const _192 = (0, _util.vec)(192);

const _384x = (0, _util.vec)(384);

const _384y = (0, _util.vec)(384);

const _384z = (0, _util.vec)(384);

const _768 = (0, _util.vec)(768);

function sum_three_scale(a, b, c, az, bz, cz, out) {
  return (0, _util.sum_three)((0, _util.scale)(4, a, az, _8), _8, (0, _util.scale)(4, b, bz, _8b), _8b, (0, _util.scale)(4, c, cz, _8c), _8c, _16, out);
}

function liftexact(alen, a, blen, b, clen, c, dlen, d, x, y, z, out) {
  const len = (0, _util.sum)((0, _util.sum)(alen, a, blen, b, _48), _48, (0, _util.negate)((0, _util.sum)(clen, c, dlen, d, _48b), _48b), _48b, _96);
  return (0, _util.sum_three)((0, _util.scale)((0, _util.scale)(len, _96, x, _192), _192, x, _384x), _384x, (0, _util.scale)((0, _util.scale)(len, _96, y, _192), _192, y, _384y), _384y, (0, _util.scale)((0, _util.scale)(len, _96, z, _192), _192, z, _384z), _384z, _768, out);
}

function insphereexact(ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz, ex, ey, ez) {
  let bvirt, c, ahi, alo, bhi, blo, _i, _j, _0, s1, s0, t1, t0, u3;

  s1 = ax * by;
  c = _util.splitter * ax;
  ahi = c - (c - ax);
  alo = ax - ahi;
  c = _util.splitter * by;
  bhi = c - (c - by);
  blo = by - bhi;
  s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
  t1 = bx * ay;
  c = _util.splitter * bx;
  ahi = c - (c - bx);
  alo = bx - ahi;
  c = _util.splitter * ay;
  bhi = c - (c - ay);
  blo = ay - bhi;
  t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
  _i = s0 - t0;
  bvirt = s0 - _i;
  ab[0] = s0 - (_i + bvirt) + (bvirt - t0);
  _j = s1 + _i;
  bvirt = _j - s1;
  _0 = s1 - (_j - bvirt) + (_i - bvirt);
  _i = _0 - t1;
  bvirt = _0 - _i;
  ab[1] = _0 - (_i + bvirt) + (bvirt - t1);
  u3 = _j + _i;
  bvirt = u3 - _j;
  ab[2] = _j - (u3 - bvirt) + (_i - bvirt);
  ab[3] = u3;
  s1 = bx * cy;
  c = _util.splitter * bx;
  ahi = c - (c - bx);
  alo = bx - ahi;
  c = _util.splitter * cy;
  bhi = c - (c - cy);
  blo = cy - bhi;
  s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
  t1 = cx * by;
  c = _util.splitter * cx;
  ahi = c - (c - cx);
  alo = cx - ahi;
  c = _util.splitter * by;
  bhi = c - (c - by);
  blo = by - bhi;
  t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
  _i = s0 - t0;
  bvirt = s0 - _i;
  bc[0] = s0 - (_i + bvirt) + (bvirt - t0);
  _j = s1 + _i;
  bvirt = _j - s1;
  _0 = s1 - (_j - bvirt) + (_i - bvirt);
  _i = _0 - t1;
  bvirt = _0 - _i;
  bc[1] = _0 - (_i + bvirt) + (bvirt - t1);
  u3 = _j + _i;
  bvirt = u3 - _j;
  bc[2] = _j - (u3 - bvirt) + (_i - bvirt);
  bc[3] = u3;
  s1 = cx * dy;
  c = _util.splitter * cx;
  ahi = c - (c - cx);
  alo = cx - ahi;
  c = _util.splitter * dy;
  bhi = c - (c - dy);
  blo = dy - bhi;
  s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
  t1 = dx * cy;
  c = _util.splitter * dx;
  ahi = c - (c - dx);
  alo = dx - ahi;
  c = _util.splitter * cy;
  bhi = c - (c - cy);
  blo = cy - bhi;
  t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
  _i = s0 - t0;
  bvirt = s0 - _i;
  cd[0] = s0 - (_i + bvirt) + (bvirt - t0);
  _j = s1 + _i;
  bvirt = _j - s1;
  _0 = s1 - (_j - bvirt) + (_i - bvirt);
  _i = _0 - t1;
  bvirt = _0 - _i;
  cd[1] = _0 - (_i + bvirt) + (bvirt - t1);
  u3 = _j + _i;
  bvirt = u3 - _j;
  cd[2] = _j - (u3 - bvirt) + (_i - bvirt);
  cd[3] = u3;
  s1 = dx * ey;
  c = _util.splitter * dx;
  ahi = c - (c - dx);
  alo = dx - ahi;
  c = _util.splitter * ey;
  bhi = c - (c - ey);
  blo = ey - bhi;
  s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
  t1 = ex * dy;
  c = _util.splitter * ex;
  ahi = c - (c - ex);
  alo = ex - ahi;
  c = _util.splitter * dy;
  bhi = c - (c - dy);
  blo = dy - bhi;
  t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
  _i = s0 - t0;
  bvirt = s0 - _i;
  de[0] = s0 - (_i + bvirt) + (bvirt - t0);
  _j = s1 + _i;
  bvirt = _j - s1;
  _0 = s1 - (_j - bvirt) + (_i - bvirt);
  _i = _0 - t1;
  bvirt = _0 - _i;
  de[1] = _0 - (_i + bvirt) + (bvirt - t1);
  u3 = _j + _i;
  bvirt = u3 - _j;
  de[2] = _j - (u3 - bvirt) + (_i - bvirt);
  de[3] = u3;
  s1 = ex * ay;
  c = _util.splitter * ex;
  ahi = c - (c - ex);
  alo = ex - ahi;
  c = _util.splitter * ay;
  bhi = c - (c - ay);
  blo = ay - bhi;
  s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
  t1 = ax * ey;
  c = _util.splitter * ax;
  ahi = c - (c - ax);
  alo = ax - ahi;
  c = _util.splitter * ey;
  bhi = c - (c - ey);
  blo = ey - bhi;
  t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
  _i = s0 - t0;
  bvirt = s0 - _i;
  ea[0] = s0 - (_i + bvirt) + (bvirt - t0);
  _j = s1 + _i;
  bvirt = _j - s1;
  _0 = s1 - (_j - bvirt) + (_i - bvirt);
  _i = _0 - t1;
  bvirt = _0 - _i;
  ea[1] = _0 - (_i + bvirt) + (bvirt - t1);
  u3 = _j + _i;
  bvirt = u3 - _j;
  ea[2] = _j - (u3 - bvirt) + (_i - bvirt);
  ea[3] = u3;
  s1 = ax * cy;
  c = _util.splitter * ax;
  ahi = c - (c - ax);
  alo = ax - ahi;
  c = _util.splitter * cy;
  bhi = c - (c - cy);
  blo = cy - bhi;
  s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
  t1 = cx * ay;
  c = _util.splitter * cx;
  ahi = c - (c - cx);
  alo = cx - ahi;
  c = _util.splitter * ay;
  bhi = c - (c - ay);
  blo = ay - bhi;
  t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
  _i = s0 - t0;
  bvirt = s0 - _i;
  ac[0] = s0 - (_i + bvirt) + (bvirt - t0);
  _j = s1 + _i;
  bvirt = _j - s1;
  _0 = s1 - (_j - bvirt) + (_i - bvirt);
  _i = _0 - t1;
  bvirt = _0 - _i;
  ac[1] = _0 - (_i + bvirt) + (bvirt - t1);
  u3 = _j + _i;
  bvirt = u3 - _j;
  ac[2] = _j - (u3 - bvirt) + (_i - bvirt);
  ac[3] = u3;
  s1 = bx * dy;
  c = _util.splitter * bx;
  ahi = c - (c - bx);
  alo = bx - ahi;
  c = _util.splitter * dy;
  bhi = c - (c - dy);
  blo = dy - bhi;
  s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
  t1 = dx * by;
  c = _util.splitter * dx;
  ahi = c - (c - dx);
  alo = dx - ahi;
  c = _util.splitter * by;
  bhi = c - (c - by);
  blo = by - bhi;
  t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
  _i = s0 - t0;
  bvirt = s0 - _i;
  bd[0] = s0 - (_i + bvirt) + (bvirt - t0);
  _j = s1 + _i;
  bvirt = _j - s1;
  _0 = s1 - (_j - bvirt) + (_i - bvirt);
  _i = _0 - t1;
  bvirt = _0 - _i;
  bd[1] = _0 - (_i + bvirt) + (bvirt - t1);
  u3 = _j + _i;
  bvirt = u3 - _j;
  bd[2] = _j - (u3 - bvirt) + (_i - bvirt);
  bd[3] = u3;
  s1 = cx * ey;
  c = _util.splitter * cx;
  ahi = c - (c - cx);
  alo = cx - ahi;
  c = _util.splitter * ey;
  bhi = c - (c - ey);
  blo = ey - bhi;
  s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
  t1 = ex * cy;
  c = _util.splitter * ex;
  ahi = c - (c - ex);
  alo = ex - ahi;
  c = _util.splitter * cy;
  bhi = c - (c - cy);
  blo = cy - bhi;
  t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
  _i = s0 - t0;
  bvirt = s0 - _i;
  ce[0] = s0 - (_i + bvirt) + (bvirt - t0);
  _j = s1 + _i;
  bvirt = _j - s1;
  _0 = s1 - (_j - bvirt) + (_i - bvirt);
  _i = _0 - t1;
  bvirt = _0 - _i;
  ce[1] = _0 - (_i + bvirt) + (bvirt - t1);
  u3 = _j + _i;
  bvirt = u3 - _j;
  ce[2] = _j - (u3 - bvirt) + (_i - bvirt);
  ce[3] = u3;
  s1 = dx * ay;
  c = _util.splitter * dx;
  ahi = c - (c - dx);
  alo = dx - ahi;
  c = _util.splitter * ay;
  bhi = c - (c - ay);
  blo = ay - bhi;
  s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
  t1 = ax * dy;
  c = _util.splitter * ax;
  ahi = c - (c - ax);
  alo = ax - ahi;
  c = _util.splitter * dy;
  bhi = c - (c - dy);
  blo = dy - bhi;
  t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
  _i = s0 - t0;
  bvirt = s0 - _i;
  da[0] = s0 - (_i + bvirt) + (bvirt - t0);
  _j = s1 + _i;
  bvirt = _j - s1;
  _0 = s1 - (_j - bvirt) + (_i - bvirt);
  _i = _0 - t1;
  bvirt = _0 - _i;
  da[1] = _0 - (_i + bvirt) + (bvirt - t1);
  u3 = _j + _i;
  bvirt = u3 - _j;
  da[2] = _j - (u3 - bvirt) + (_i - bvirt);
  da[3] = u3;
  s1 = ex * by;
  c = _util.splitter * ex;
  ahi = c - (c - ex);
  alo = ex - ahi;
  c = _util.splitter * by;
  bhi = c - (c - by);
  blo = by - bhi;
  s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
  t1 = bx * ey;
  c = _util.splitter * bx;
  ahi = c - (c - bx);
  alo = bx - ahi;
  c = _util.splitter * ey;
  bhi = c - (c - ey);
  blo = ey - bhi;
  t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
  _i = s0 - t0;
  bvirt = s0 - _i;
  eb[0] = s0 - (_i + bvirt) + (bvirt - t0);
  _j = s1 + _i;
  bvirt = _j - s1;
  _0 = s1 - (_j - bvirt) + (_i - bvirt);
  _i = _0 - t1;
  bvirt = _0 - _i;
  eb[1] = _0 - (_i + bvirt) + (bvirt - t1);
  u3 = _j + _i;
  bvirt = u3 - _j;
  eb[2] = _j - (u3 - bvirt) + (_i - bvirt);
  eb[3] = u3;
  const abclen = sum_three_scale(ab, bc, ac, cz, az, -bz, abc);
  const bcdlen = sum_three_scale(bc, cd, bd, dz, bz, -cz, bcd);
  const cdelen = sum_three_scale(cd, de, ce, ez, cz, -dz, cde);
  const dealen = sum_three_scale(de, ea, da, az, dz, -ez, dea);
  const eablen = sum_three_scale(ea, ab, eb, bz, ez, -az, eab);
  const abdlen = sum_three_scale(ab, bd, da, dz, az, bz, abd);
  const bcelen = sum_three_scale(bc, ce, eb, ez, bz, cz, bce);
  const cdalen = sum_three_scale(cd, da, ac, az, cz, dz, cda);
  const deblen = sum_three_scale(de, eb, bd, bz, dz, ez, deb);
  const eaclen = sum_three_scale(ea, ac, ce, cz, ez, az, eac);
  const deterlen = (0, _util.sum_three)(liftexact(cdelen, cde, bcelen, bce, deblen, deb, bcdlen, bcd, ax, ay, az, adet), adet, liftexact(dealen, dea, cdalen, cda, eaclen, eac, cdelen, cde, bx, by, bz, bdet), bdet, (0, _util.sum_three)(liftexact(eablen, eab, deblen, deb, abdlen, abd, dealen, dea, cx, cy, cz, cdet), cdet, liftexact(abclen, abc, eaclen, eac, bcelen, bce, eablen, eab, dx, dy, dz, ddet), ddet, liftexact(bcdlen, bcd, abdlen, abd, cdalen, cda, abclen, abc, ex, ey, ez, edet), edet, cddet, cdedet), cdedet, abdet, deter);
  return deter[deterlen - 1];
}

const xdet = (0, _util.vec)(96);
const ydet = (0, _util.vec)(96);
const zdet = (0, _util.vec)(96);
const fin = (0, _util.vec)(1152);

function liftadapt(a, b, c, az, bz, cz, x, y, z, out) {
  const len = sum_three_scale(a, b, c, az, bz, cz, _24);
  return (0, _util.sum_three)((0, _util.scale)((0, _util.scale)(len, _24, x, _48), _48, x, xdet), xdet, (0, _util.scale)((0, _util.scale)(len, _24, y, _48), _48, y, ydet), ydet, (0, _util.scale)((0, _util.scale)(len, _24, z, _48), _48, z, zdet), zdet, _192, out);
}

function insphereadapt(ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz, ex, ey, ez, permanent) {
  let ab3, bc3, cd3, da3, ac3, bd3;
  let aextail, bextail, cextail, dextail;
  let aeytail, beytail, ceytail, deytail;
  let aeztail, beztail, ceztail, deztail;

  let bvirt, c, ahi, alo, bhi, blo, _i, _j, _0, s1, s0, t1, t0;

  const aex = ax - ex;
  const bex = bx - ex;
  const cex = cx - ex;
  const dex = dx - ex;
  const aey = ay - ey;
  const bey = by - ey;
  const cey = cy - ey;
  const dey = dy - ey;
  const aez = az - ez;
  const bez = bz - ez;
  const cez = cz - ez;
  const dez = dz - ez;
  s1 = aex * bey;
  c = _util.splitter * aex;
  ahi = c - (c - aex);
  alo = aex - ahi;
  c = _util.splitter * bey;
  bhi = c - (c - bey);
  blo = bey - bhi;
  s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
  t1 = bex * aey;
  c = _util.splitter * bex;
  ahi = c - (c - bex);
  alo = bex - ahi;
  c = _util.splitter * aey;
  bhi = c - (c - aey);
  blo = aey - bhi;
  t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
  _i = s0 - t0;
  bvirt = s0 - _i;
  ab[0] = s0 - (_i + bvirt) + (bvirt - t0);
  _j = s1 + _i;
  bvirt = _j - s1;
  _0 = s1 - (_j - bvirt) + (_i - bvirt);
  _i = _0 - t1;
  bvirt = _0 - _i;
  ab[1] = _0 - (_i + bvirt) + (bvirt - t1);
  ab3 = _j + _i;
  bvirt = ab3 - _j;
  ab[2] = _j - (ab3 - bvirt) + (_i - bvirt);
  ab[3] = ab3;
  s1 = bex * cey;
  c = _util.splitter * bex;
  ahi = c - (c - bex);
  alo = bex - ahi;
  c = _util.splitter * cey;
  bhi = c - (c - cey);
  blo = cey - bhi;
  s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
  t1 = cex * bey;
  c = _util.splitter * cex;
  ahi = c - (c - cex);
  alo = cex - ahi;
  c = _util.splitter * bey;
  bhi = c - (c - bey);
  blo = bey - bhi;
  t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
  _i = s0 - t0;
  bvirt = s0 - _i;
  bc[0] = s0 - (_i + bvirt) + (bvirt - t0);
  _j = s1 + _i;
  bvirt = _j - s1;
  _0 = s1 - (_j - bvirt) + (_i - bvirt);
  _i = _0 - t1;
  bvirt = _0 - _i;
  bc[1] = _0 - (_i + bvirt) + (bvirt - t1);
  bc3 = _j + _i;
  bvirt = bc3 - _j;
  bc[2] = _j - (bc3 - bvirt) + (_i - bvirt);
  bc[3] = bc3;
  s1 = cex * dey;
  c = _util.splitter * cex;
  ahi = c - (c - cex);
  alo = cex - ahi;
  c = _util.splitter * dey;
  bhi = c - (c - dey);
  blo = dey - bhi;
  s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
  t1 = dex * cey;
  c = _util.splitter * dex;
  ahi = c - (c - dex);
  alo = dex - ahi;
  c = _util.splitter * cey;
  bhi = c - (c - cey);
  blo = cey - bhi;
  t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
  _i = s0 - t0;
  bvirt = s0 - _i;
  cd[0] = s0 - (_i + bvirt) + (bvirt - t0);
  _j = s1 + _i;
  bvirt = _j - s1;
  _0 = s1 - (_j - bvirt) + (_i - bvirt);
  _i = _0 - t1;
  bvirt = _0 - _i;
  cd[1] = _0 - (_i + bvirt) + (bvirt - t1);
  cd3 = _j + _i;
  bvirt = cd3 - _j;
  cd[2] = _j - (cd3 - bvirt) + (_i - bvirt);
  cd[3] = cd3;
  s1 = dex * aey;
  c = _util.splitter * dex;
  ahi = c - (c - dex);
  alo = dex - ahi;
  c = _util.splitter * aey;
  bhi = c - (c - aey);
  blo = aey - bhi;
  s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
  t1 = aex * dey;
  c = _util.splitter * aex;
  ahi = c - (c - aex);
  alo = aex - ahi;
  c = _util.splitter * dey;
  bhi = c - (c - dey);
  blo = dey - bhi;
  t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
  _i = s0 - t0;
  bvirt = s0 - _i;
  da[0] = s0 - (_i + bvirt) + (bvirt - t0);
  _j = s1 + _i;
  bvirt = _j - s1;
  _0 = s1 - (_j - bvirt) + (_i - bvirt);
  _i = _0 - t1;
  bvirt = _0 - _i;
  da[1] = _0 - (_i + bvirt) + (bvirt - t1);
  da3 = _j + _i;
  bvirt = da3 - _j;
  da[2] = _j - (da3 - bvirt) + (_i - bvirt);
  da[3] = da3;
  s1 = aex * cey;
  c = _util.splitter * aex;
  ahi = c - (c - aex);
  alo = aex - ahi;
  c = _util.splitter * cey;
  bhi = c - (c - cey);
  blo = cey - bhi;
  s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
  t1 = cex * aey;
  c = _util.splitter * cex;
  ahi = c - (c - cex);
  alo = cex - ahi;
  c = _util.splitter * aey;
  bhi = c - (c - aey);
  blo = aey - bhi;
  t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
  _i = s0 - t0;
  bvirt = s0 - _i;
  ac[0] = s0 - (_i + bvirt) + (bvirt - t0);
  _j = s1 + _i;
  bvirt = _j - s1;
  _0 = s1 - (_j - bvirt) + (_i - bvirt);
  _i = _0 - t1;
  bvirt = _0 - _i;
  ac[1] = _0 - (_i + bvirt) + (bvirt - t1);
  ac3 = _j + _i;
  bvirt = ac3 - _j;
  ac[2] = _j - (ac3 - bvirt) + (_i - bvirt);
  ac[3] = ac3;
  s1 = bex * dey;
  c = _util.splitter * bex;
  ahi = c - (c - bex);
  alo = bex - ahi;
  c = _util.splitter * dey;
  bhi = c - (c - dey);
  blo = dey - bhi;
  s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
  t1 = dex * bey;
  c = _util.splitter * dex;
  ahi = c - (c - dex);
  alo = dex - ahi;
  c = _util.splitter * bey;
  bhi = c - (c - bey);
  blo = bey - bhi;
  t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
  _i = s0 - t0;
  bvirt = s0 - _i;
  bd[0] = s0 - (_i + bvirt) + (bvirt - t0);
  _j = s1 + _i;
  bvirt = _j - s1;
  _0 = s1 - (_j - bvirt) + (_i - bvirt);
  _i = _0 - t1;
  bvirt = _0 - _i;
  bd[1] = _0 - (_i + bvirt) + (bvirt - t1);
  bd3 = _j + _i;
  bvirt = bd3 - _j;
  bd[2] = _j - (bd3 - bvirt) + (_i - bvirt);
  bd[3] = bd3;
  const finlen = (0, _util.sum)((0, _util.sum)((0, _util.negate)(liftadapt(bc, cd, bd, dez, bez, -cez, aex, aey, aez, adet), adet), adet, liftadapt(cd, da, ac, aez, cez, dez, bex, bey, bez, bdet), bdet, abdet), abdet, (0, _util.sum)((0, _util.negate)(liftadapt(da, ab, bd, bez, dez, aez, cex, cey, cez, cdet), cdet), cdet, liftadapt(ab, bc, ac, cez, aez, -bez, dex, dey, dez, ddet), ddet, cddet), cddet, fin);
  let det = (0, _util.estimate)(finlen, fin);
  let errbound = isperrboundB * permanent;

  if (det >= errbound || -det >= errbound) {
    return det;
  }

  bvirt = ax - aex;
  aextail = ax - (aex + bvirt) + (bvirt - ex);
  bvirt = ay - aey;
  aeytail = ay - (aey + bvirt) + (bvirt - ey);
  bvirt = az - aez;
  aeztail = az - (aez + bvirt) + (bvirt - ez);
  bvirt = bx - bex;
  bextail = bx - (bex + bvirt) + (bvirt - ex);
  bvirt = by - bey;
  beytail = by - (bey + bvirt) + (bvirt - ey);
  bvirt = bz - bez;
  beztail = bz - (bez + bvirt) + (bvirt - ez);
  bvirt = cx - cex;
  cextail = cx - (cex + bvirt) + (bvirt - ex);
  bvirt = cy - cey;
  ceytail = cy - (cey + bvirt) + (bvirt - ey);
  bvirt = cz - cez;
  ceztail = cz - (cez + bvirt) + (bvirt - ez);
  bvirt = dx - dex;
  dextail = dx - (dex + bvirt) + (bvirt - ex);
  bvirt = dy - dey;
  deytail = dy - (dey + bvirt) + (bvirt - ey);
  bvirt = dz - dez;
  deztail = dz - (dez + bvirt) + (bvirt - ez);

  if (aextail === 0 && aeytail === 0 && aeztail === 0 && bextail === 0 && beytail === 0 && beztail === 0 && cextail === 0 && ceytail === 0 && ceztail === 0 && dextail === 0 && deytail === 0 && deztail === 0) {
    return det;
  }

  errbound = isperrboundC * permanent + _util.resulterrbound * Math.abs(det);
  const abeps = aex * beytail + bey * aextail - (aey * bextail + bex * aeytail);
  const bceps = bex * ceytail + cey * bextail - (bey * cextail + cex * beytail);
  const cdeps = cex * deytail + dey * cextail - (cey * dextail + dex * ceytail);
  const daeps = dex * aeytail + aey * dextail - (dey * aextail + aex * deytail);
  const aceps = aex * ceytail + cey * aextail - (aey * cextail + cex * aeytail);
  const bdeps = bex * deytail + dey * bextail - (bey * dextail + dex * beytail);
  det += (bex * bex + bey * bey + bez * bez) * (cez * daeps + dez * aceps + aez * cdeps + (ceztail * da3 + deztail * ac3 + aeztail * cd3)) + (dex * dex + dey * dey + dez * dez) * (aez * bceps - bez * aceps + cez * abeps + (aeztail * bc3 - beztail * ac3 + ceztail * ab3)) - ((aex * aex + aey * aey + aez * aez) * (bez * cdeps - cez * bdeps + dez * bceps + (beztail * cd3 - ceztail * bd3 + deztail * bc3)) + (cex * cex + cey * cey + cez * cez) * (dez * abeps + aez * bdeps + bez * daeps + (deztail * ab3 + aeztail * bd3 + beztail * da3))) + 2 * ((bex * bextail + bey * beytail + bez * beztail) * (cez * da3 + dez * ac3 + aez * cd3) + (dex * dextail + dey * deytail + dez * deztail) * (aez * bc3 - bez * ac3 + cez * ab3) - ((aex * aextail + aey * aeytail + aez * aeztail) * (bez * cd3 - cez * bd3 + dez * bc3) + (cex * cextail + cey * ceytail + cez * ceztail) * (dez * ab3 + aez * bd3 + bez * da3)));

  if (det >= errbound || -det >= errbound) {
    return det;
  }

  return insphereexact(ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz, ex, ey, ez);
}

function insphere(ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz, ex, ey, ez) {
  const aex = ax - ex;
  const bex = bx - ex;
  const cex = cx - ex;
  const dex = dx - ex;
  const aey = ay - ey;
  const bey = by - ey;
  const cey = cy - ey;
  const dey = dy - ey;
  const aez = az - ez;
  const bez = bz - ez;
  const cez = cz - ez;
  const dez = dz - ez;
  const aexbey = aex * bey;
  const bexaey = bex * aey;
  const ab = aexbey - bexaey;
  const bexcey = bex * cey;
  const cexbey = cex * bey;
  const bc = bexcey - cexbey;
  const cexdey = cex * dey;
  const dexcey = dex * cey;
  const cd = cexdey - dexcey;
  const dexaey = dex * aey;
  const aexdey = aex * dey;
  const da = dexaey - aexdey;
  const aexcey = aex * cey;
  const cexaey = cex * aey;
  const ac = aexcey - cexaey;
  const bexdey = bex * dey;
  const dexbey = dex * bey;
  const bd = bexdey - dexbey;
  const abc = aez * bc - bez * ac + cez * ab;
  const bcd = bez * cd - cez * bd + dez * bc;
  const cda = cez * da + dez * ac + aez * cd;
  const dab = dez * ab + aez * bd + bez * da;
  const alift = aex * aex + aey * aey + aez * aez;
  const blift = bex * bex + bey * bey + bez * bez;
  const clift = cex * cex + cey * cey + cez * cez;
  const dlift = dex * dex + dey * dey + dez * dez;
  const det = clift * dab - dlift * abc + (alift * bcd - blift * cda);
  const aezplus = Math.abs(aez);
  const bezplus = Math.abs(bez);
  const cezplus = Math.abs(cez);
  const dezplus = Math.abs(dez);
  const aexbeyplus = Math.abs(aexbey);
  const bexaeyplus = Math.abs(bexaey);
  const bexceyplus = Math.abs(bexcey);
  const cexbeyplus = Math.abs(cexbey);
  const cexdeyplus = Math.abs(cexdey);
  const dexceyplus = Math.abs(dexcey);
  const dexaeyplus = Math.abs(dexaey);
  const aexdeyplus = Math.abs(aexdey);
  const aexceyplus = Math.abs(aexcey);
  const cexaeyplus = Math.abs(cexaey);
  const bexdeyplus = Math.abs(bexdey);
  const dexbeyplus = Math.abs(dexbey);
  const permanent = ((cexdeyplus + dexceyplus) * bezplus + (dexbeyplus + bexdeyplus) * cezplus + (bexceyplus + cexbeyplus) * dezplus) * alift + ((dexaeyplus + aexdeyplus) * cezplus + (aexceyplus + cexaeyplus) * dezplus + (cexdeyplus + dexceyplus) * aezplus) * blift + ((aexbeyplus + bexaeyplus) * dezplus + (bexdeyplus + dexbeyplus) * aezplus + (dexaeyplus + aexdeyplus) * bezplus) * clift + ((bexceyplus + cexbeyplus) * aezplus + (cexaeyplus + aexceyplus) * bezplus + (aexbeyplus + bexaeyplus) * cezplus) * dlift;
  const errbound = isperrboundA * permanent;

  if (det > errbound || -det > errbound) {
    return det;
  }

  return -insphereadapt(ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz, ex, ey, ez, permanent);
}

function inspherefast(pax, pay, paz, pbx, pby, pbz, pcx, pcy, pcz, pdx, pdy, pdz, pex, pey, pez) {
  const aex = pax - pex;
  const bex = pbx - pex;
  const cex = pcx - pex;
  const dex = pdx - pex;
  const aey = pay - pey;
  const bey = pby - pey;
  const cey = pcy - pey;
  const dey = pdy - pey;
  const aez = paz - pez;
  const bez = pbz - pez;
  const cez = pcz - pez;
  const dez = pdz - pez;
  const ab = aex * bey - bex * aey;
  const bc = bex * cey - cex * bey;
  const cd = cex * dey - dex * cey;
  const da = dex * aey - aex * dey;
  const ac = aex * cey - cex * aey;
  const bd = bex * dey - dex * bey;
  const abc = aez * bc - bez * ac + cez * ab;
  const bcd = bez * cd - cez * bd + dez * bc;
  const cda = cez * da + dez * ac + aez * cd;
  const dab = dez * ab + aez * bd + bez * da;
  const alift = aex * aex + aey * aey + aez * aez;
  const blift = bex * bex + bey * bey + bez * bez;
  const clift = cex * cex + cey * cey + cez * cez;
  const dlift = dex * dex + dey * dey + dez * dez;
  return clift * dab - dlift * abc + (alift * bcd - blift * cda);
}
},{"./util.js":"tU1w"}],"rPLr":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "incircle", {
  enumerable: true,
  get: function () {
    return _incircle.incircle;
  }
});
Object.defineProperty(exports, "incirclefast", {
  enumerable: true,
  get: function () {
    return _incircle.incirclefast;
  }
});
Object.defineProperty(exports, "insphere", {
  enumerable: true,
  get: function () {
    return _insphere.insphere;
  }
});
Object.defineProperty(exports, "inspherefast", {
  enumerable: true,
  get: function () {
    return _insphere.inspherefast;
  }
});
Object.defineProperty(exports, "orient2d", {
  enumerable: true,
  get: function () {
    return _orient2d.orient2d;
  }
});
Object.defineProperty(exports, "orient2dfast", {
  enumerable: true,
  get: function () {
    return _orient2d.orient2dfast;
  }
});
Object.defineProperty(exports, "orient3d", {
  enumerable: true,
  get: function () {
    return _orient3d.orient3d;
  }
});
Object.defineProperty(exports, "orient3dfast", {
  enumerable: true,
  get: function () {
    return _orient3d.orient3dfast;
  }
});

var _orient2d = require("./esm/orient2d.js");

var _orient3d = require("./esm/orient3d.js");

var _incircle = require("./esm/incircle.js");

var _insphere = require("./esm/insphere.js");
},{"./esm/orient2d.js":"PG9F","./esm/orient3d.js":"wJFU","./esm/incircle.js":"yQlA","./esm/insphere.js":"tPUG"}],"GBJ0":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _robustPredicates = require("robust-predicates");

const EPSILON = Math.pow(2, -52);
const EDGE_STACK = new Uint32Array(512);

class Delaunator {
  static from(points, getX = defaultGetX, getY = defaultGetY) {
    const n = points.length;
    const coords = new Float64Array(n * 2);

    for (let i = 0; i < n; i++) {
      const p = points[i];
      coords[2 * i] = getX(p);
      coords[2 * i + 1] = getY(p);
    }

    return new Delaunator(coords);
  }

  constructor(coords) {
    const n = coords.length >> 1;
    if (n > 0 && typeof coords[0] !== 'number') throw new Error('Expected coords to contain numbers.');
    this.coords = coords; // arrays that will store the triangulation graph

    const maxTriangles = Math.max(2 * n - 5, 0);
    this._triangles = new Uint32Array(maxTriangles * 3);
    this._halfedges = new Int32Array(maxTriangles * 3); // temporary arrays for tracking the edges of the advancing convex hull

    this._hashSize = Math.ceil(Math.sqrt(n));
    this._hullPrev = new Uint32Array(n); // edge to prev edge

    this._hullNext = new Uint32Array(n); // edge to next edge

    this._hullTri = new Uint32Array(n); // edge to adjacent triangle

    this._hullHash = new Int32Array(this._hashSize).fill(-1); // angular edge hash
    // temporary arrays for sorting points

    this._ids = new Uint32Array(n);
    this._dists = new Float64Array(n);
    this.update();
  }

  update() {
    const {
      coords,
      _hullPrev: hullPrev,
      _hullNext: hullNext,
      _hullTri: hullTri,
      _hullHash: hullHash
    } = this;
    const n = coords.length >> 1; // populate an array of point indices; calculate input data bbox

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (let i = 0; i < n; i++) {
      const x = coords[2 * i];
      const y = coords[2 * i + 1];
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
      this._ids[i] = i;
    }

    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    let minDist = Infinity;
    let i0, i1, i2; // pick a seed point close to the center

    for (let i = 0; i < n; i++) {
      const d = dist(cx, cy, coords[2 * i], coords[2 * i + 1]);

      if (d < minDist) {
        i0 = i;
        minDist = d;
      }
    }

    const i0x = coords[2 * i0];
    const i0y = coords[2 * i0 + 1];
    minDist = Infinity; // find the point closest to the seed

    for (let i = 0; i < n; i++) {
      if (i === i0) continue;
      const d = dist(i0x, i0y, coords[2 * i], coords[2 * i + 1]);

      if (d < minDist && d > 0) {
        i1 = i;
        minDist = d;
      }
    }

    let i1x = coords[2 * i1];
    let i1y = coords[2 * i1 + 1];
    let minRadius = Infinity; // find the third point which forms the smallest circumcircle with the first two

    for (let i = 0; i < n; i++) {
      if (i === i0 || i === i1) continue;
      const r = circumradius(i0x, i0y, i1x, i1y, coords[2 * i], coords[2 * i + 1]);

      if (r < minRadius) {
        i2 = i;
        minRadius = r;
      }
    }

    let i2x = coords[2 * i2];
    let i2y = coords[2 * i2 + 1];

    if (minRadius === Infinity) {
      // order collinear points by dx (or dy if all x are identical)
      // and return the list as a hull
      for (let i = 0; i < n; i++) {
        this._dists[i] = coords[2 * i] - coords[0] || coords[2 * i + 1] - coords[1];
      }

      quicksort(this._ids, this._dists, 0, n - 1);
      const hull = new Uint32Array(n);
      let j = 0;

      for (let i = 0, d0 = -Infinity; i < n; i++) {
        const id = this._ids[i];

        if (this._dists[id] > d0) {
          hull[j++] = id;
          d0 = this._dists[id];
        }
      }

      this.hull = hull.subarray(0, j);
      this.triangles = new Uint32Array(0);
      this.halfedges = new Uint32Array(0);
      return;
    } // swap the order of the seed points for counter-clockwise orientation


    if ((0, _robustPredicates.orient2d)(i0x, i0y, i1x, i1y, i2x, i2y) < 0) {
      const i = i1;
      const x = i1x;
      const y = i1y;
      i1 = i2;
      i1x = i2x;
      i1y = i2y;
      i2 = i;
      i2x = x;
      i2y = y;
    }

    const center = circumcenter(i0x, i0y, i1x, i1y, i2x, i2y);
    this._cx = center.x;
    this._cy = center.y;

    for (let i = 0; i < n; i++) {
      this._dists[i] = dist(coords[2 * i], coords[2 * i + 1], center.x, center.y);
    } // sort the points by distance from the seed triangle circumcenter


    quicksort(this._ids, this._dists, 0, n - 1); // set up the seed triangle as the starting hull

    this._hullStart = i0;
    let hullSize = 3;
    hullNext[i0] = hullPrev[i2] = i1;
    hullNext[i1] = hullPrev[i0] = i2;
    hullNext[i2] = hullPrev[i1] = i0;
    hullTri[i0] = 0;
    hullTri[i1] = 1;
    hullTri[i2] = 2;
    hullHash.fill(-1);
    hullHash[this._hashKey(i0x, i0y)] = i0;
    hullHash[this._hashKey(i1x, i1y)] = i1;
    hullHash[this._hashKey(i2x, i2y)] = i2;
    this.trianglesLen = 0;

    this._addTriangle(i0, i1, i2, -1, -1, -1);

    for (let k = 0, xp, yp; k < this._ids.length; k++) {
      const i = this._ids[k];
      const x = coords[2 * i];
      const y = coords[2 * i + 1]; // skip near-duplicate points

      if (k > 0 && Math.abs(x - xp) <= EPSILON && Math.abs(y - yp) <= EPSILON) continue;
      xp = x;
      yp = y; // skip seed triangle points

      if (i === i0 || i === i1 || i === i2) continue; // find a visible edge on the convex hull using edge hash

      let start = 0;

      for (let j = 0, key = this._hashKey(x, y); j < this._hashSize; j++) {
        start = hullHash[(key + j) % this._hashSize];
        if (start !== -1 && start !== hullNext[start]) break;
      }

      start = hullPrev[start];
      let e = start,
          q;

      while (q = hullNext[e], (0, _robustPredicates.orient2d)(x, y, coords[2 * e], coords[2 * e + 1], coords[2 * q], coords[2 * q + 1]) >= 0) {
        e = q;

        if (e === start) {
          e = -1;
          break;
        }
      }

      if (e === -1) continue; // likely a near-duplicate point; skip it
      // add the first triangle from the point

      let t = this._addTriangle(e, i, hullNext[e], -1, -1, hullTri[e]); // recursively flip triangles from the point until they satisfy the Delaunay condition


      hullTri[i] = this._legalize(t + 2);
      hullTri[e] = t; // keep track of boundary triangles on the hull

      hullSize++; // walk forward through the hull, adding more triangles and flipping recursively

      let n = hullNext[e];

      while (q = hullNext[n], (0, _robustPredicates.orient2d)(x, y, coords[2 * n], coords[2 * n + 1], coords[2 * q], coords[2 * q + 1]) < 0) {
        t = this._addTriangle(n, i, q, hullTri[i], -1, hullTri[n]);
        hullTri[i] = this._legalize(t + 2);
        hullNext[n] = n; // mark as removed

        hullSize--;
        n = q;
      } // walk backward from the other side, adding more triangles and flipping


      if (e === start) {
        while (q = hullPrev[e], (0, _robustPredicates.orient2d)(x, y, coords[2 * q], coords[2 * q + 1], coords[2 * e], coords[2 * e + 1]) < 0) {
          t = this._addTriangle(q, i, e, -1, hullTri[e], hullTri[q]);

          this._legalize(t + 2);

          hullTri[q] = t;
          hullNext[e] = e; // mark as removed

          hullSize--;
          e = q;
        }
      } // update the hull indices


      this._hullStart = hullPrev[i] = e;
      hullNext[e] = hullPrev[n] = i;
      hullNext[i] = n; // save the two new edges in the hash table

      hullHash[this._hashKey(x, y)] = i;
      hullHash[this._hashKey(coords[2 * e], coords[2 * e + 1])] = e;
    }

    this.hull = new Uint32Array(hullSize);

    for (let i = 0, e = this._hullStart; i < hullSize; i++) {
      this.hull[i] = e;
      e = hullNext[e];
    } // trim typed triangle mesh arrays


    this.triangles = this._triangles.subarray(0, this.trianglesLen);
    this.halfedges = this._halfedges.subarray(0, this.trianglesLen);
  }

  _hashKey(x, y) {
    return Math.floor(pseudoAngle(x - this._cx, y - this._cy) * this._hashSize) % this._hashSize;
  }

  _legalize(a) {
    const {
      _triangles: triangles,
      _halfedges: halfedges,
      coords
    } = this;
    let i = 0;
    let ar = 0; // recursion eliminated with a fixed-size stack

    while (true) {
      const b = halfedges[a];
      /* if the pair of triangles doesn't satisfy the Delaunay condition
       * (p1 is inside the circumcircle of [p0, pl, pr]), flip them,
       * then do the same check/flip recursively for the new pair of triangles
       *
       *           pl                    pl
       *          /||\                  /  \
       *       al/ || \bl            al/    \a
       *        /  ||  \              /      \
       *       /  a||b  \    flip    /___ar___\
       *     p0\   ||   /p1   =>   p0\---bl---/p1
       *        \  ||  /              \      /
       *       ar\ || /br             b\    /br
       *          \||/                  \  /
       *           pr                    pr
       */

      const a0 = a - a % 3;
      ar = a0 + (a + 2) % 3;

      if (b === -1) {
        // convex hull edge
        if (i === 0) break;
        a = EDGE_STACK[--i];
        continue;
      }

      const b0 = b - b % 3;
      const al = a0 + (a + 1) % 3;
      const bl = b0 + (b + 2) % 3;
      const p0 = triangles[ar];
      const pr = triangles[a];
      const pl = triangles[al];
      const p1 = triangles[bl];
      const illegal = inCircle(coords[2 * p0], coords[2 * p0 + 1], coords[2 * pr], coords[2 * pr + 1], coords[2 * pl], coords[2 * pl + 1], coords[2 * p1], coords[2 * p1 + 1]);

      if (illegal) {
        triangles[a] = p1;
        triangles[b] = p0;
        const hbl = halfedges[bl]; // edge swapped on the other side of the hull (rare); fix the halfedge reference

        if (hbl === -1) {
          let e = this._hullStart;

          do {
            if (this._hullTri[e] === bl) {
              this._hullTri[e] = a;
              break;
            }

            e = this._hullPrev[e];
          } while (e !== this._hullStart);
        }

        this._link(a, hbl);

        this._link(b, halfedges[ar]);

        this._link(ar, bl);

        const br = b0 + (b + 1) % 3; // don't worry about hitting the cap: it can only happen on extremely degenerate input

        if (i < EDGE_STACK.length) {
          EDGE_STACK[i++] = br;
        }
      } else {
        if (i === 0) break;
        a = EDGE_STACK[--i];
      }
    }

    return ar;
  }

  _link(a, b) {
    this._halfedges[a] = b;
    if (b !== -1) this._halfedges[b] = a;
  } // add a new triangle given vertex indices and adjacent half-edge ids


  _addTriangle(i0, i1, i2, a, b, c) {
    const t = this.trianglesLen;
    this._triangles[t] = i0;
    this._triangles[t + 1] = i1;
    this._triangles[t + 2] = i2;

    this._link(t, a);

    this._link(t + 1, b);

    this._link(t + 2, c);

    this.trianglesLen += 3;
    return t;
  }

} // monotonically increases with real angle, but doesn't need expensive trigonometry


exports.default = Delaunator;

function pseudoAngle(dx, dy) {
  const p = dx / (Math.abs(dx) + Math.abs(dy));
  return (dy > 0 ? 3 - p : 1 + p) / 4; // [0..1]
}

function dist(ax, ay, bx, by) {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}

function inCircle(ax, ay, bx, by, cx, cy, px, py) {
  const dx = ax - px;
  const dy = ay - py;
  const ex = bx - px;
  const ey = by - py;
  const fx = cx - px;
  const fy = cy - py;
  const ap = dx * dx + dy * dy;
  const bp = ex * ex + ey * ey;
  const cp = fx * fx + fy * fy;
  return dx * (ey * cp - bp * fy) - dy * (ex * cp - bp * fx) + ap * (ex * fy - ey * fx) < 0;
}

function circumradius(ax, ay, bx, by, cx, cy) {
  const dx = bx - ax;
  const dy = by - ay;
  const ex = cx - ax;
  const ey = cy - ay;
  const bl = dx * dx + dy * dy;
  const cl = ex * ex + ey * ey;
  const d = 0.5 / (dx * ey - dy * ex);
  const x = (ey * bl - dy * cl) * d;
  const y = (dx * cl - ex * bl) * d;
  return x * x + y * y;
}

function circumcenter(ax, ay, bx, by, cx, cy) {
  const dx = bx - ax;
  const dy = by - ay;
  const ex = cx - ax;
  const ey = cy - ay;
  const bl = dx * dx + dy * dy;
  const cl = ex * ex + ey * ey;
  const d = 0.5 / (dx * ey - dy * ex);
  const x = ax + (ey * bl - dy * cl) * d;
  const y = ay + (dx * cl - ex * bl) * d;
  return {
    x,
    y
  };
}

function quicksort(ids, dists, left, right) {
  if (right - left <= 20) {
    for (let i = left + 1; i <= right; i++) {
      const temp = ids[i];
      const tempDist = dists[temp];
      let j = i - 1;

      while (j >= left && dists[ids[j]] > tempDist) ids[j + 1] = ids[j--];

      ids[j + 1] = temp;
    }
  } else {
    const median = left + right >> 1;
    let i = left + 1;
    let j = right;
    swap(ids, median, i);
    if (dists[ids[left]] > dists[ids[right]]) swap(ids, left, right);
    if (dists[ids[i]] > dists[ids[right]]) swap(ids, i, right);
    if (dists[ids[left]] > dists[ids[i]]) swap(ids, left, i);
    const temp = ids[i];
    const tempDist = dists[temp];

    while (true) {
      do i++; while (dists[ids[i]] < tempDist);

      do j--; while (dists[ids[j]] > tempDist);

      if (j < i) break;
      swap(ids, i, j);
    }

    ids[left + 1] = ids[j];
    ids[j] = temp;

    if (right - i + 1 >= j - left) {
      quicksort(ids, dists, i, right);
      quicksort(ids, dists, left, j - 1);
    } else {
      quicksort(ids, dists, left, j - 1);
      quicksort(ids, dists, i, right);
    }
  }
}

function swap(arr, i, j) {
  const tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}

function defaultGetX(p) {
  return p[0];
}

function defaultGetY(p) {
  return p[1];
}
},{"robust-predicates":"rPLr"}],"wjdi":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.edgeLengCalc = exports.areaCalc = void 0;

var edgeLengCalc = function edgeLengCalc(ax, ay, bx, by) {
  var res = Math.pow(ax - bx, 2) + Math.pow(ay - by, 2);
  return Math.sqrt(res);
};

exports.edgeLengCalc = edgeLengCalc;

var areaCalc = function areaCalc(e1, e2, e3) {
  var s = (e1 + e2 + e3) / 2;
  var res = Math.sqrt(s * (s - e1) * (s - e2) * (s - e3));
  return res;
};

exports.areaCalc = areaCalc;
},{}],"DES9":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Voidseeker = void 0;

var _delaunator = _interopRequireDefault(require("delaunator"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/*
 *  Class that storage the data - Data structure
 */
var Voidseeker = /*#__PURE__*/function () {
  function Voidseeker(starData, ra, dec, amp) {
    var _this = this;

    _classCallCheck(this, Voidseeker);

    console.time("setPoints");
    this.rawData = starData;
    this.points = []; // [x0, y0, x1, y1, ..., xn, yn]

    this.drawingPoints = []; // [x0, y0, 0, x1, y1, 0,..., xn, yn, 0]
    // Constant for drawing fancy stars

    this.gPoints = [];
    this.iPoints = [];
    starData.forEach(function (star) {
      // X
      _this.points.push((star.ra - (ra - amp / 2)) * 2 / amp - 1);

      _this.drawingPoints.push((star.ra - (ra - amp / 2)) * 2 / amp - 1); // Y


      _this.points.push((star.dec - (dec - amp / 2)) * 2 / amp - 1);

      _this.drawingPoints.push((star.dec - (dec - amp / 2)) * 2 / amp - 1); // Z


      _this.drawingPoints.push(0); // Constants


      _this.gPoints.push(star.g);

      _this.iPoints.push(star.i);
    }); // Update html Statistics

    document.getElementById("est-points").textContent = this.points.length / 2; // console.log(this);

    console.timeEnd("setPoints");
  }

  _createClass(Voidseeker, [{
    key: "setTriangulation",
    value: function setTriangulation() {
      console.time("setTriangulation");
      var delaunay = new _delaunator.default(this.points);
      this.triangles = [];

      for (var i = 0; i < delaunay.triangles.length; i++) {
        this.triangles.push(delaunay.triangles[i]);
      } // Update html Statistics


      document.getElementById("est-triang").textContent = this.triangles.length / 3; // console.log(this);

      console.timeEnd("setTriangulation");
    }
  }, {
    key: "setEdges",
    value: function setEdges() {
      var _this2 = this;

      console.time("setEdges"); // Get array of edges

      var tmp;
      var edgeList = []; // Edges know their points, distance and triangles

      var edgeListInner = [];

      var edgeListTmp = _toConsumableArray(new Array(this.points.length / 2)).map(function () {
        return [];
      }); // For optimization


      var _loop = function _loop() {
        var _edgeListTmp$Math$min, _edgeListTmp$Math$min2, _edgeListTmp$Math$min3;

        var point1 = _this2.triangles[i];
        var point2 = _this2.triangles[i + 1];
        var point3 = _this2.triangles[i + 2]; // Edge 1

        tmp = (_edgeListTmp$Math$min = edgeListTmp[Math.min(point1, point2)]) === null || _edgeListTmp$Math$min === void 0 ? void 0 : _edgeListTmp$Math$min.find(function (elm) {
          return elm[1] == Math.max(point1, point2);
        });

        if (tmp) {
          tmp[4] = i;
          edgeListInner.push(tmp);
        } else {
          var edge1 = [Math.min(point1, point2), // point 1
          Math.max(point1, point2), // point 2
          (0, _utils.edgeLengCalc)(_this2.points[point1 * 2], _this2.points[point1 * 2 + 1], _this2.points[point2 * 2], _this2.points[point2 * 2 + 1]), i, // triangle
          null // triangle
          ];
          edgeListTmp[Math.min(point1, point2)].push(edge1);
        } // Edge 2


        tmp = (_edgeListTmp$Math$min2 = edgeListTmp[Math.min(point1, point3)]) === null || _edgeListTmp$Math$min2 === void 0 ? void 0 : _edgeListTmp$Math$min2.find(function (elm) {
          return elm[1] == Math.max(point1, point3);
        });

        if (tmp) {
          tmp[4] = i;
          edgeListInner.push(tmp);
        } else {
          var edge2 = [Math.min(point1, point3), // point 1
          Math.max(point1, point3), // point 2
          (0, _utils.edgeLengCalc)(_this2.points[point1 * 2], _this2.points[point1 * 2 + 1], _this2.points[point3 * 2], _this2.points[point3 * 2 + 1]), i, // triangle
          null // triangle
          ];
          edgeListTmp[Math.min(point1, point3)].push(edge2);
        } // Edge 3


        tmp = (_edgeListTmp$Math$min3 = edgeListTmp[Math.min(point2, point3)]) === null || _edgeListTmp$Math$min3 === void 0 ? void 0 : _edgeListTmp$Math$min3.find(function (elm) {
          return elm[1] == Math.max(point2, point3);
        });

        if (tmp) {
          tmp[4] = i;
          edgeListInner.push(tmp);
        } else {
          var edge3 = [Math.min(point2, point3), // point 1
          Math.max(point2, point3), // point 2
          (0, _utils.edgeLengCalc)(_this2.points[point2 * 2], _this2.points[point2 * 2 + 1], _this2.points[point3 * 2], _this2.points[point3 * 2 + 1]), i, // triangle
          null // triangle
          ];
          edgeListTmp[Math.min(point2, point3)].push(edge3);
        }
      };

      for (var i = 0; i < this.triangles.length; i += 3) {
        _loop();
      }

      for (var i = 0; i < edgeListTmp.length; i++) {
        for (var j = 0; j < edgeListTmp[i].length; j++) {
          edgeList.push(edgeListTmp[i][j]);
        }
      } //  Sort by lenght


      this.edges = edgeList.sort(function (a, b) {
        return a[2] - b[2];
      });
      this.edgesInner = edgeListInner; // Update html - Allow void

      document.getElementById("est-edges").textContent = this.edges.length;
      document.getElementById("est-edges-inner").textContent = this.edgesInner.length;
      document.getElementById("vis-void").removeAttribute("disabled", ""); // Generate triang - edge  // Obtein edge from triang position

      var triangEdge = Array(this.triangles.length / 3);

      for (var i = 0; i < this.edges.length; i++) {
        var idx1 = this.edges[i][3] / 3;
        var idx2 = this.edges[i][4] / 3;
        if (triangEdge[idx1]) triangEdge[idx1].push(i);else triangEdge[idx1] = [i];

        if (idx2) {
          if (triangEdge[idx2]) triangEdge[idx2].push(i);else triangEdge[idx2] = [i];
        }
      }

      this.triangEdge = triangEdge; // console.log(this);

      console.timeEnd("setEdges");
    }
  }, {
    key: "setVoids",
    value: function setVoids() {
      console.time("setVoids"); //  Classification

      var sets = []; // Sets of possibles voids

      var sets_area = []; // Sets of possibles voids (area)

      var sets_idx = []; // Sets of possibles voids for drawing

      var marked_triangules = Array(this.triangles.length / 3); // Array of booleans

      var marked_triangules_count = 0; // Search sets

      while (marked_triangules_count < this.triangles.length / 3) {
        var triangle_set = [];
        var triangle_set_idx = [];
        var area = 0;
        var le_idx = 0; // longest edge
        // Search longest edge (unmarked triangules -> O(n))

        for (var idx = le_idx; idx < this.edges.length; idx++) {
          var le = this.edges[this.edges.length - 1 - idx];

          if (le[4]) {
            if (!marked_triangules[le[3]] && !marked_triangules[le[4]]) {
              // le[3]
              triangle_set.push(le[3]);
              var point_idx_1 = this.triangles[le[3]];
              var point_idx_2 = this.triangles[le[3] + 1];
              var point_idx_3 = this.triangles[le[3] + 2];
              triangle_set_idx.push(point_idx_1, point_idx_2, point_idx_3);
              marked_triangules[le[3]] = true;
              marked_triangules_count++;
              area += (0, _utils.areaCalc)(this.edges[this.triangEdge[le[3] / 3][0]][2], this.edges[this.triangEdge[le[3] / 3][1]][2], this.edges[this.triangEdge[le[3] / 3][2]][2]); // le[4]

              triangle_set.push(le[4]);
              var point_idx_1 = this.triangles[le[4]];
              var point_idx_2 = this.triangles[le[4] + 1];
              var point_idx_3 = this.triangles[le[4] + 2];
              triangle_set_idx.push(point_idx_1, point_idx_2, point_idx_3);
              marked_triangules[le[4]] = true;
              marked_triangules_count++;
              area += (0, _utils.areaCalc)(this.edges[this.triangEdge[le[4] / 3][0]][2], this.edges[this.triangEdge[le[4] / 3][1]][2], this.edges[this.triangEdge[le[4] / 3][2]][2]);
              le_idx = idx;
              break;
            }
          }
        } // ERROR


        if (triangle_set.length === 0) {
          // console.log("");
          break;
        } // Search adjacent triangules (search every neighboard of each triangle included in triagle_set... is horrible)


        var found = true;

        while (found) {
          found = false;

          for (var t = 0; t < triangle_set.length; t++) {
            var triangIdx = triangle_set[t] / 3;
            var triang = this.triangEdge[triangIdx]; // Edge 1

            var ed1 = this.edges[triang[0]];
            var neighbor1Idx = ed1[3] === triangIdx ? ed1[4] : ed1[3];

            if (neighbor1Idx && !marked_triangules[neighbor1Idx]) {
              var neighbor1TriangEdges = this.triangEdge[neighbor1Idx / 3];

              if (Math.max(this.edges[neighbor1TriangEdges[0]][2], this.edges[neighbor1TriangEdges[1]][2], this.edges[neighbor1TriangEdges[2]][2]) === ed1[2]) {
                found = true;
                triangle_set.push(neighbor1Idx);
                marked_triangules[neighbor1Idx] = true;
                marked_triangules_count++;
                triangle_set_idx.push(this.triangles[neighbor1Idx], this.triangles[neighbor1Idx + 1], this.triangles[neighbor1Idx + 2]);
                area += (0, _utils.areaCalc)(this.edges[neighbor1TriangEdges[0]][2], this.edges[neighbor1TriangEdges[1]][2], this.edges[neighbor1TriangEdges[2]][2]);
              }
            } // Edge 2


            var ed2 = this.edges[triang[1]];
            var neighbor2Idx = ed2[3] === triangIdx ? ed2[4] : ed2[3];

            if (neighbor2Idx && !marked_triangules[neighbor2Idx]) {
              var neighbor2TriangEdges = this.triangEdge[neighbor2Idx / 3];

              if (Math.max(this.edges[neighbor2TriangEdges[0]][2], this.edges[neighbor2TriangEdges[1]][2], this.edges[neighbor2TriangEdges[2]][2]) === ed2[2]) {
                found = true;
                triangle_set.push(neighbor2Idx);
                marked_triangules[neighbor2Idx] = true;
                marked_triangules_count++;
                triangle_set_idx.push(this.triangles[neighbor2Idx], this.triangles[neighbor2Idx + 1], this.triangles[neighbor2Idx + 2]);
                area += (0, _utils.areaCalc)(this.edges[neighbor2TriangEdges[0]][2], this.edges[neighbor2TriangEdges[1]][2], this.edges[neighbor2TriangEdges[2]][2]);
              }
            } // Edge 3 -> Immposible case?


            var ed3 = this.edges[triang[2]];
            var neighbor3Idx = ed3[3] === triangIdx ? ed3[4] : ed3[3];

            if (neighbor3Idx && !marked_triangules[neighbor3Idx]) {
              var neighbor3TriangEdges = this.triangEdge[neighbor3Idx / 3];

              if (Math.max(this.edges[neighbor3TriangEdges[0]][2], this.edges[neighbor3TriangEdges[1]][2], this.edges[neighbor3TriangEdges[2]][2]) === ed3[2]) {
                console.log("Immposible case?");
                found = true;
                triangle_set.push(neighbor3Idx);
                marked_triangules[neighbor3Idx] = true;
                marked_triangules_count++;
                triangle_set_idx.push(this.triangles[neighbor3Idx], this.triangles[neighbor3Idx + 1], this.triangles[neighbor3Idx + 2]);
                area += (0, _utils.areaCalc)(this.edges[neighbor3TriangEdges[0]][2], this.edges[neighbor3TriangEdges[1]][2], this.edges[neighbor3TriangEdges[2]][2]);
              }
            }
          }
        }

        sets.push(triangle_set);
        sets_idx.push(triangle_set_idx);
        sets_area.push(area);
      }

      this.setArea = sets_area;
      this.voidSets = sets;
      this.voidSetsIdx = sets_idx; // console.log(this);

      console.timeEnd("setVoids");
    }
  }]);

  return Voidseeker;
}();

exports.Voidseeker = Voidseeker;
},{"delaunator":"GBJ0","./utils":"wjdi"}],"D3UB":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.skyRequest = void 0;

var _voidseeker = require("./voidseeker");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
 *   SKYSERVER API and Database
 *   Documentation: http://skyserver.sdss.org/dr16/en/help/docs/api.aspx
 *   TEST SQL: http://skyserver.sdss.org/dr17/SearchTools/sql
 *   TABLES: http://skyserver.sdss.org/dr17/MoreTools/browser
 *   Recomendation: Try first the api, the response return the sql search
 */
var skyRequest = function skyRequest(query, ra, dec, amp, rect) {
  var data = _objectSpread(_objectSpread({}, query), {}, {
    whichway: "equatorial",
    limit: "500000",
    format: "json",
    fp: "none",
    whichquery: "imaging"
  });

  var params = new URLSearchParams(data).toString();
  var url = "";

  if (rect) {
    url = "https://skyserver.sdss.org/dr17/SkyServerWS/SearchTools/RectangularSearch?" + params;
  } else {
    url = "https://skyserver.sdss.org/dr17/SkyServerWS/SearchTools/RadialSearch?" + params;
  }

  fetch(url, {
    method: "GET"
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    console.log("QUERY:\n", data[1].Rows[0].query);
    var starData = data[0].Rows;

    if (!starData.length) {
      alert("No data");
      return;
    }

    console.log("DATA:\n", starData);
    console.log("MUESTRA:\n");
    console.table(starData.slice(0, 10).map(function (x) {
      return {
        obj: x.obj,
        objid: x.objid,
        ra: x.ra,
        dec: x.dec
      };
    })); // SET GLOBAL

    window.voidseeker = new _voidseeker.Voidseeker(starData, ra, dec, amp);
    window.starfieldLoaded = false;
    window.pointsLoaded = false;
    window.triangulationLoaded = false;
    window.edgesLoaded = false;
    window.voidLoaded = false;
  });
};

exports.skyRequest = skyRequest;
},{"./voidseeker":"DES9"}],"sKWv":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchData = void 0;

var _request = require("./request.js");

/**
 * Action taken by pressing "Search".
 */
var fetchData = function fetchData() {
  // Disable void
  document.getElementById("vis-void").setAttribute("disabled", "");
  document.getElementById("vis-void").checked = false; // Set base data empty

  delete window.voidseeker;
  document.getElementById("est-points").textContent = 0;
  document.getElementById("est-triang").textContent = 0;
  document.getElementById("est-edges").textContent = 0;
  document.getElementById("est-edges-inner").textContent = 0;
  console.log("Fetching data"); // Set waiting gif

  var waiting = document.getElementById("waiting");

  if (waiting.classList.contains("waiting-dots-hidden")) {
    waiting.classList.remove("waiting-dots-hidden");
    waiting.classList.add("waiting-dots-not-hidden");
  }

  var ra = Number(document.getElementById("ra").value);
  var dec = Number(document.getElementById("dec").value);
  var amp = Number(document.getElementById("amp").value) / 60;
  var type = document.getElementById("type-search-rec").checked; // True -> rectangular

  if (isNaN(ra) || ra < 0 || ra > 360) {
    alert("ERROR: RA " + ra);
    return;
  }

  if (isNaN(dec) || dec < -90 || dec > 90) {
    alert("ERROR: DEC " + dec);
    return;
  }

  if (isNaN(amp) || amp <= 0 || amp > 180) {
    alert("ERROR: Amplitud " + amp);
    return;
  }

  window.ra = ra;
  window.dec = dec;
  window.amp = amp;
  document.getElementById("s-ra").textContent = ra.toString().slice(0, 10);
  document.getElementById("s-dec").textContent = dec.toString().slice(0, 10);
  document.getElementById("s-amp").textContent = (amp * 60).toString().slice(0, 10);
  var query;

  if (type) {
    query = {
      min_ra: Math.max(ra - amp / 2, 0),
      max_ra: Math.min(ra + amp / 2, 360),
      min_dec: Math.max(dec - amp / 2, -90),
      max_dec: Math.min(dec + amp / 2, 90)
    };
  } else {
    query = {
      ra: Math.max(ra, 0),
      dec: Math.max(dec, -90),
      radius: amp * 60 / 2
    };
  }

  (0, _request.skyRequest)(query, ra, dec, amp, type);
};

exports.fetchData = fetchData;
document.getElementById("search").addEventListener("click", fetchData);
/**
 * Action taken by pressing toggler button.
 */

var changeMenu = function changeMenu() {
  var menu = document.getElementById("menu-section");
  var alternatorButton = document.getElementById("alternator");
  var alternatorIcon = document.getElementById("alternator-icon");

  if (menu.classList.contains("menu-section-init")) {
    menu.classList.remove("menu-section-init");
    menu.classList.add("menu-section-close");
    alternatorIcon.classList.add("alternator-icon-left");
    alternatorButton.classList.add("alternator-left");
  } else {
    menu.classList.toggle("menu-section-open");
    menu.classList.toggle("menu-section-close");
    alternatorIcon.classList.toggle("alternator-icon-right");
    alternatorIcon.classList.toggle("alternator-icon-left");
    alternatorButton.classList.toggle("alternator-right");
    alternatorButton.classList.toggle("alternator-left");
  }
};

document.getElementById("alternator").addEventListener("click", changeMenu);
/**
 * Action taken clicking threejs canvas
 */

var updateCoords = function updateCoords() {
  if (window.amp === 0) return;
  var w = window.innerWidth;
  var h = window.innerHeight;
  var size = Math.min(h, w);
  var off = Math.max(w - h, 0) / 2;
  var mx = (window.event.clientX - off) * window.amp / size - window.amp / 2 + window.ra;
  var my = -(window.event.clientY * window.amp / size - window.amp / 2 - window.dec);
  document.getElementById("ra").value = mx;
  document.getElementById("dec").value = my;
};

document.getElementById("threeJS").addEventListener("click", updateCoords);
},{"./request.js":"D3UB"}]},{},["sKWv"], null)
//# sourceMappingURL=/voidseeker/actions.00366040.js.map