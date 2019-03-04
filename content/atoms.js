var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.checkStringArgs = function(a, b, c) {
  if (null == a) {
    throw new TypeError("The 'this' value for String.prototype." + c + " must not be null or undefined");
  }
  if (b instanceof RegExp) {
    throw new TypeError("First argument to String.prototype." + c + " must not be a regular expression");
  }
  return a + "";
};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
  a != Array.prototype && a != Object.prototype && (a[b] = c.value);
};
$jscomp.getGlobal = function(a) {
  return "undefined" != typeof window && window === a ? a : "undefined" != typeof global && null != global ? global : a;
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.polyfill = function(a, b, c, d) {
  if (b) {
    c = $jscomp.global;
    a = a.split(".");
    for (d = 0; d < a.length - 1; d++) {
      var e = a[d];
      e in c || (c[e] = {});
      c = c[e];
    }
    a = a[a.length - 1];
    d = c[a];
    b = b(d);
    b != d && null != b && $jscomp.defineProperty(c, a, {configurable:!0, writable:!0, value:b});
  }
};
$jscomp.polyfill("String.prototype.repeat", function(a) {
  return a ? a : function(a) {
    var b = $jscomp.checkStringArgs(this, null, "repeat");
    if (0 > a || 1342177279 < a) {
      throw new RangeError("Invalid count value");
    }
    a |= 0;
    for (var d = ""; a;) {
      if (a & 1 && (d += b), a >>>= 1) {
        b += b;
      }
    }
    return d;
  };
}, "es6-impl", "es3");
$jscomp.findInternal = function(a, b, c) {
  a instanceof String && (a = String(a));
  for (var d = a.length, e = 0; e < d; e++) {
    var f = a[e];
    if (b.call(c, f, e, a)) {
      return {i:e, v:f};
    }
  }
  return {i:-1, v:void 0};
};
$jscomp.polyfill("Array.prototype.findIndex", function(a) {
  return a ? a : function(a, c) {
    return $jscomp.findInternal(this, a, c).i;
  };
}, "es6-impl", "es3");
$jscomp.polyfill("Array.prototype.find", function(a) {
  return a ? a : function(a, c) {
    return $jscomp.findInternal(this, a, c).v;
  };
}, "es6-impl", "es3");
$jscomp.polyfill("String.prototype.endsWith", function(a) {
  return a ? a : function(a, c) {
    var b = $jscomp.checkStringArgs(this, a, "endsWith");
    a += "";
    void 0 === c && (c = b.length);
    c = Math.max(0, Math.min(c | 0, b.length));
    for (var e = a.length; 0 < e && 0 < c;) {
      if (b[--c] != a[--e]) {
        return !1;
      }
    }
    return 0 >= e;
  };
}, "es6-impl", "es3");
$jscomp.polyfill("String.prototype.startsWith", function(a) {
  return a ? a : function(a, c) {
    var b = $jscomp.checkStringArgs(this, a, "startsWith");
    a += "";
    var e = b.length, f = a.length;
    c = Math.max(0, Math.min(c | 0, b.length));
    for (var g = 0; g < f && c < e;) {
      if (b[c++] != a[g++]) {
        return !1;
      }
    }
    return g >= f;
  };
}, "es6-impl", "es3");
$jscomp.SYMBOL_PREFIX = "jscomp_symbol_";
$jscomp.initSymbol = function() {
  $jscomp.initSymbol = function() {
  };
  $jscomp.global.Symbol || ($jscomp.global.Symbol = $jscomp.Symbol);
};
$jscomp.symbolCounter_ = 0;
$jscomp.Symbol = function(a) {
  return $jscomp.SYMBOL_PREFIX + (a || "") + $jscomp.symbolCounter_++;
};
$jscomp.initSymbolIterator = function() {
  $jscomp.initSymbol();
  var a = $jscomp.global.Symbol.iterator;
  a || (a = $jscomp.global.Symbol.iterator = $jscomp.global.Symbol("iterator"));
  "function" != typeof Array.prototype[a] && $jscomp.defineProperty(Array.prototype, a, {configurable:!0, writable:!0, value:function() {
    return $jscomp.arrayIterator(this);
  }});
  $jscomp.initSymbolIterator = function() {
  };
};
$jscomp.arrayIterator = function(a) {
  var b = 0;
  return $jscomp.iteratorPrototype(function() {
    return b < a.length ? {done:!1, value:a[b++]} : {done:!0};
  });
};
$jscomp.iteratorPrototype = function(a) {
  $jscomp.initSymbolIterator();
  a = {next:a};
  a[$jscomp.global.Symbol.iterator] = function() {
    return this;
  };
  return a;
};
$jscomp.iteratorFromArray = function(a, b) {
  $jscomp.initSymbolIterator();
  a instanceof String && (a += "");
  var c = 0, d = {next:function() {
    if (c < a.length) {
      var e = c++;
      return {value:b(e, a[e]), done:!1};
    }
    d.next = function() {
      return {done:!0, value:void 0};
    };
    return d.next();
  }};
  d[Symbol.iterator] = function() {
    return d;
  };
  return d;
};
$jscomp.polyfill("Array.prototype.keys", function(a) {
  return a ? a : function() {
    return $jscomp.iteratorFromArray(this, function(a) {
      return a;
    });
  };
}, "es6-impl", "es3");
var COMPILED = !0, goog = goog || {};
goog.global = this;
goog.isDef = function(a) {
  return void 0 !== a;
};
goog.isString = function(a) {
  return "string" == typeof a;
};
goog.isBoolean = function(a) {
  return "boolean" == typeof a;
};
goog.isNumber = function(a) {
  return "number" == typeof a;
};
goog.exportPath_ = function(a, b, c) {
  a = a.split(".");
  c = c || goog.global;
  a[0] in c || !c.execScript || c.execScript("var " + a[0]);
  for (var d; a.length && (d = a.shift());) {
    !a.length && goog.isDef(b) ? c[d] = b : c = c[d] && c[d] !== Object.prototype[d] ? c[d] : c[d] = {};
  }
};
goog.define = function(a, b) {
  COMPILED || (goog.global.CLOSURE_UNCOMPILED_DEFINES && void 0 === goog.global.CLOSURE_UNCOMPILED_DEFINES.nodeType && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_UNCOMPILED_DEFINES, a) ? b = goog.global.CLOSURE_UNCOMPILED_DEFINES[a] : goog.global.CLOSURE_DEFINES && void 0 === goog.global.CLOSURE_DEFINES.nodeType && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_DEFINES, a) && (b = goog.global.CLOSURE_DEFINES[a]));
  goog.exportPath_(a, b);
};
goog.DEBUG = !0;
goog.LOCALE = "en";
goog.TRUSTED_SITE = !0;
goog.STRICT_MODE_COMPATIBLE = !1;
goog.DISALLOW_TEST_ONLY_CODE = COMPILED && !goog.DEBUG;
goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING = !1;
goog.provide = function(a) {
  if (goog.isInModuleLoader_()) {
    throw Error("goog.provide can not be used within a goog.module.");
  }
  if (!COMPILED && goog.isProvided_(a)) {
    throw Error('Namespace "' + a + '" already declared.');
  }
  goog.constructNamespace_(a);
};
goog.constructNamespace_ = function(a, b) {
  if (!COMPILED) {
    delete goog.implicitNamespaces_[a];
    for (var c = a; (c = c.substring(0, c.lastIndexOf("."))) && !goog.getObjectByName(c);) {
      goog.implicitNamespaces_[c] = !0;
    }
  }
  goog.exportPath_(a, b);
};
goog.VALID_MODULE_RE_ = /^[a-zA-Z_$][a-zA-Z0-9._$]*$/;
goog.module = function(a) {
  if (!goog.isString(a) || !a || -1 == a.search(goog.VALID_MODULE_RE_)) {
    throw Error("Invalid module identifier");
  }
  if (!goog.isInModuleLoader_()) {
    throw Error("Module " + a + " has been loaded incorrectly. Note, modules cannot be loaded as normal scripts. They require some kind of pre-processing step. You're likely trying to load a module via a script tag or as a part of a concatenated bundle without rewriting the module. For more info see: https://github.com/google/closure-library/wiki/goog.module:-an-ES6-module-like-alternative-to-goog.provide.");
  }
  if (goog.moduleLoaderState_.moduleName) {
    throw Error("goog.module may only be called once per module.");
  }
  goog.moduleLoaderState_.moduleName = a;
  if (!COMPILED) {
    if (goog.isProvided_(a)) {
      throw Error('Namespace "' + a + '" already declared.');
    }
    delete goog.implicitNamespaces_[a];
  }
};
goog.module.get = function(a) {
  return goog.module.getInternal_(a);
};
goog.module.getInternal_ = function(a) {
  if (!COMPILED) {
    if (a in goog.loadedModules_) {
      return goog.loadedModules_[a];
    }
    if (!goog.implicitNamespaces_[a]) {
      return a = goog.getObjectByName(a), null != a ? a : null;
    }
  }
  return null;
};
goog.moduleLoaderState_ = null;
goog.isInModuleLoader_ = function() {
  return null != goog.moduleLoaderState_;
};
goog.module.declareLegacyNamespace = function() {
  if (!COMPILED && !goog.isInModuleLoader_()) {
    throw Error("goog.module.declareLegacyNamespace must be called from within a goog.module");
  }
  if (!COMPILED && !goog.moduleLoaderState_.moduleName) {
    throw Error("goog.module must be called prior to goog.module.declareLegacyNamespace.");
  }
  goog.moduleLoaderState_.declareLegacyNamespace = !0;
};
goog.setTestOnly = function(a) {
  if (goog.DISALLOW_TEST_ONLY_CODE) {
    throw a = a || "", Error("Importing test-only code into non-debug environment" + (a ? ": " + a : "."));
  }
};
goog.forwardDeclare = function(a) {
};
COMPILED || (goog.isProvided_ = function(a) {
  return a in goog.loadedModules_ || !goog.implicitNamespaces_[a] && goog.isDefAndNotNull(goog.getObjectByName(a));
}, goog.implicitNamespaces_ = {"goog.module":!0});
goog.getObjectByName = function(a, b) {
  a = a.split(".");
  b = b || goog.global;
  for (var c; c = a.shift();) {
    if (goog.isDefAndNotNull(b[c])) {
      b = b[c];
    } else {
      return null;
    }
  }
  return b;
};
goog.globalize = function(a, b) {
  b = b || goog.global;
  for (var c in a) {
    b[c] = a[c];
  }
};
goog.addDependency = function(a, b, c, d) {
  if (goog.DEPENDENCIES_ENABLED) {
    var e;
    a = a.replace(/\\/g, "/");
    var f = goog.dependencies_;
    d && "boolean" !== typeof d || (d = d ? {module:"goog"} : {});
    for (var g = 0; e = b[g]; g++) {
      f.nameToPath[e] = a, f.loadFlags[a] = d;
    }
    for (d = 0; b = c[d]; d++) {
      a in f.requires || (f.requires[a] = {}), f.requires[a][b] = !0;
    }
  }
};
goog.ENABLE_DEBUG_LOADER = !0;
goog.logToConsole_ = function(a) {
  goog.global.console && goog.global.console.error(a);
};
goog.require = function(a) {
  if (!COMPILED) {
    goog.ENABLE_DEBUG_LOADER && goog.IS_OLD_IE_ && goog.maybeProcessDeferredDep_(a);
    if (goog.isProvided_(a)) {
      if (goog.isInModuleLoader_()) {
        return goog.module.getInternal_(a);
      }
    } else {
      if (goog.ENABLE_DEBUG_LOADER) {
        var b = goog.getPathFromDeps_(a);
        if (b) {
          goog.writeScripts_(b);
        } else {
          throw a = "goog.require could not find: " + a, goog.logToConsole_(a), Error(a);
        }
      }
    }
    return null;
  }
};
goog.basePath = "";
goog.nullFunction = function() {
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(a) {
  a.instance_ = void 0;
  a.getInstance = function() {
    if (a.instance_) {
      return a.instance_;
    }
    goog.DEBUG && (goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = a);
    return a.instance_ = new a;
  };
};
goog.instantiatedSingletons_ = [];
goog.LOAD_MODULE_USING_EVAL = !0;
goog.SEAL_MODULE_EXPORTS = goog.DEBUG;
goog.loadedModules_ = {};
goog.DEPENDENCIES_ENABLED = !COMPILED && goog.ENABLE_DEBUG_LOADER;
goog.TRANSPILE = "detect";
goog.TRANSPILER = "transpile.js";
goog.DEPENDENCIES_ENABLED && (goog.dependencies_ = {loadFlags:{}, nameToPath:{}, requires:{}, visited:{}, written:{}, deferred:{}}, goog.inHtmlDocument_ = function() {
  var a = goog.global.document;
  return null != a && "write" in a;
}, goog.findBasePath_ = function() {
  if (goog.isDef(goog.global.CLOSURE_BASE_PATH) && goog.isString(goog.global.CLOSURE_BASE_PATH)) {
    goog.basePath = goog.global.CLOSURE_BASE_PATH;
  } else {
    if (goog.inHtmlDocument_()) {
      var a = goog.global.document;
      var b = a.currentScript;
      a = b ? [b] : a.getElementsByTagName("SCRIPT");
      for (b = a.length - 1; 0 <= b; --b) {
        var c = a[b].src, d = c.lastIndexOf("?"), d = -1 == d ? c.length : d;
        if ("base.js" == c.substr(d - 7, 7)) {
          goog.basePath = c.substr(0, d - 7);
          break;
        }
      }
    }
  }
}, goog.importScript_ = function(a, b) {
  (goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_)(a, b) && (goog.dependencies_.written[a] = !0);
}, goog.IS_OLD_IE_ = !(goog.global.atob || !goog.global.document || !goog.global.document.all), goog.oldIeWaiting_ = !1, goog.importProcessedScript_ = function(a, b, c) {
  goog.importScript_("", 'goog.retrieveAndExec_("' + a + '", ' + b + ", " + c + ");");
}, goog.queuedModules_ = [], goog.wrapModule_ = function(a, b) {
  return goog.LOAD_MODULE_USING_EVAL && goog.isDef(goog.global.JSON) ? "goog.loadModule(" + goog.global.JSON.stringify(b + "\n//# sourceURL=" + a + "\n") + ");" : 'goog.loadModule(function(exports) {"use strict";' + b + "\n;return exports});\n//# sourceURL=" + a + "\n";
}, goog.loadQueuedModules_ = function() {
  var a = goog.queuedModules_.length;
  if (0 < a) {
    var b = goog.queuedModules_;
    goog.queuedModules_ = [];
    for (var c = 0; c < a; c++) {
      goog.maybeProcessDeferredPath_(b[c]);
    }
  }
  goog.oldIeWaiting_ = !1;
}, goog.maybeProcessDeferredDep_ = function(a) {
  goog.isDeferredModule_(a) && goog.allDepsAreAvailable_(a) && (a = goog.getPathFromDeps_(a), goog.maybeProcessDeferredPath_(goog.basePath + a));
}, goog.isDeferredModule_ = function(a) {
  var b = (a = goog.getPathFromDeps_(a)) && goog.dependencies_.loadFlags[a] || {}, c = b.lang || "es3";
  return a && ("goog" == b.module || goog.needsTranspile_(c)) ? goog.basePath + a in goog.dependencies_.deferred : !1;
}, goog.allDepsAreAvailable_ = function(a) {
  if ((a = goog.getPathFromDeps_(a)) && a in goog.dependencies_.requires) {
    for (var b in goog.dependencies_.requires[a]) {
      if (!goog.isProvided_(b) && !goog.isDeferredModule_(b)) {
        return !1;
      }
    }
  }
  return !0;
}, goog.maybeProcessDeferredPath_ = function(a) {
  if (a in goog.dependencies_.deferred) {
    var b = goog.dependencies_.deferred[a];
    delete goog.dependencies_.deferred[a];
    goog.globalEval(b);
  }
}, goog.loadModuleFromUrl = function(a) {
  goog.retrieveAndExec_(a, !0, !1);
}, goog.writeScriptSrcNode_ = function(a) {
  goog.global.document.write('<script type="text/javascript" src="' + a + '">\x3c/script>');
}, goog.appendScriptSrcNode_ = function(a) {
  var b = goog.global.document, c = b.createElement("script");
  c.type = "text/javascript";
  c.src = a;
  c.defer = !1;
  c.async = !1;
  b.head.appendChild(c);
}, goog.writeScriptTag_ = function(a, b) {
  if (goog.inHtmlDocument_()) {
    var c = goog.global.document;
    if (!goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING && "complete" == c.readyState) {
      if (/\bdeps.js$/.test(a)) {
        return !1;
      }
      throw Error('Cannot write "' + a + '" after document load');
    }
    void 0 === b ? goog.IS_OLD_IE_ ? (goog.oldIeWaiting_ = !0, b = " onreadystatechange='goog.onScriptLoad_(this, " + ++goog.lastNonModuleScriptIndex_ + ")' ", c.write('<script type="text/javascript" src="' + a + '"' + b + ">\x3c/script>")) : goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING ? goog.appendScriptSrcNode_(a) : goog.writeScriptSrcNode_(a) : c.write('<script type="text/javascript">' + goog.protectScriptTag_(b) + "\x3c/script>");
    return !0;
  }
  return !1;
}, goog.protectScriptTag_ = function(a) {
  return a.replace(/<\/(SCRIPT)/ig, "\\x3c/$1");
}, goog.needsTranspile_ = function(a) {
  if ("always" == goog.TRANSPILE) {
    return !0;
  }
  if ("never" == goog.TRANSPILE) {
    return !1;
  }
  goog.requiresTranspilation_ || (goog.requiresTranspilation_ = goog.createRequiresTranspilation_());
  if (a in goog.requiresTranspilation_) {
    return goog.requiresTranspilation_[a];
  }
  throw Error("Unknown language mode: " + a);
}, goog.requiresTranspilation_ = null, goog.lastNonModuleScriptIndex_ = 0, goog.onScriptLoad_ = function(a, b) {
  "complete" == a.readyState && goog.lastNonModuleScriptIndex_ == b && goog.loadQueuedModules_();
  return !0;
}, goog.writeScripts_ = function(a) {
  function b(a) {
    if (!(a in e.written || a in e.visited)) {
      e.visited[a] = !0;
      if (a in e.requires) {
        for (var f in e.requires[a]) {
          if (!goog.isProvided_(f)) {
            if (f in e.nameToPath) {
              b(e.nameToPath[f]);
            } else {
              throw Error("Undefined nameToPath for " + f);
            }
          }
        }
      }
      a in d || (d[a] = !0, c.push(a));
    }
  }
  var c = [], d = {}, e = goog.dependencies_;
  b(a);
  for (var f = 0; f < c.length; f++) {
    a = c[f], goog.dependencies_.written[a] = !0;
  }
  var g = goog.moduleLoaderState_;
  goog.moduleLoaderState_ = null;
  for (f = 0; f < c.length; f++) {
    if (a = c[f]) {
      var h = e.loadFlags[a] || {}, k = goog.needsTranspile_(h.lang || "es3");
      "goog" == h.module || k ? goog.importProcessedScript_(goog.basePath + a, "goog" == h.module, k) : goog.importScript_(goog.basePath + a);
    } else {
      throw goog.moduleLoaderState_ = g, Error("Undefined script input");
    }
  }
  goog.moduleLoaderState_ = g;
}, goog.getPathFromDeps_ = function(a) {
  return a in goog.dependencies_.nameToPath ? goog.dependencies_.nameToPath[a] : null;
}, goog.findBasePath_(), goog.global.CLOSURE_NO_DEPS || goog.importScript_(goog.basePath + "deps.js"));
goog.hasBadLetScoping = null;
goog.useSafari10Workaround = function() {
  if (null == goog.hasBadLetScoping) {
    try {
      var a = !eval('"use strict";let x = 1; function f() { return typeof x; };f() == "number";');
    } catch (b) {
      a = !1;
    }
    goog.hasBadLetScoping = a;
  }
  return goog.hasBadLetScoping;
};
goog.workaroundSafari10EvalBug = function(a) {
  return "(function(){" + a + "\n;})();\n";
};
goog.loadModule = function(a) {
  var b = goog.moduleLoaderState_;
  try {
    goog.moduleLoaderState_ = {moduleName:void 0, declareLegacyNamespace:!1};
    if (goog.isFunction(a)) {
      var c = a.call(void 0, {});
    } else {
      if (goog.isString(a)) {
        goog.useSafari10Workaround() && (a = goog.workaroundSafari10EvalBug(a)), c = goog.loadModuleFromSource_.call(void 0, a);
      } else {
        throw Error("Invalid module definition");
      }
    }
    var d = goog.moduleLoaderState_.moduleName;
    if (!goog.isString(d) || !d) {
      throw Error('Invalid module name "' + d + '"');
    }
    goog.moduleLoaderState_.declareLegacyNamespace ? goog.constructNamespace_(d, c) : goog.SEAL_MODULE_EXPORTS && Object.seal && "object" == typeof c && null != c && Object.seal(c);
    goog.loadedModules_[d] = c;
  } finally {
    goog.moduleLoaderState_ = b;
  }
};
goog.loadModuleFromSource_ = function(a) {
  eval(a);
  return {};
};
goog.normalizePath_ = function(a) {
  a = a.split("/");
  for (var b = 0; b < a.length;) {
    "." == a[b] ? a.splice(b, 1) : b && ".." == a[b] && a[b - 1] && ".." != a[b - 1] ? a.splice(--b, 2) : b++;
  }
  return a.join("/");
};
goog.loadFileSync_ = function(a) {
  if (goog.global.CLOSURE_LOAD_FILE_SYNC) {
    return goog.global.CLOSURE_LOAD_FILE_SYNC(a);
  }
  try {
    var b = new goog.global.XMLHttpRequest;
    b.open("get", a, !1);
    b.send();
    return 0 == b.status || 200 == b.status ? b.responseText : null;
  } catch (c) {
    return null;
  }
};
goog.retrieveAndExec_ = function(a, b, c) {
  if (!COMPILED) {
    var d = a;
    a = goog.normalizePath_(a);
    var e = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_, f = goog.loadFileSync_(a);
    if (null == f) {
      throw Error('Load of "' + a + '" failed');
    }
    c && (f = goog.transpile_.call(goog.global, f, a));
    f = b ? goog.wrapModule_(a, f) : f + ("\n//# sourceURL=" + a);
    goog.IS_OLD_IE_ && goog.oldIeWaiting_ ? (goog.dependencies_.deferred[d] = f, goog.queuedModules_.push(d)) : e(a, f);
  }
};
goog.transpile_ = function(a, b) {
  var c = goog.global.$jscomp;
  c || (goog.global.$jscomp = c = {});
  var d = c.transpile;
  if (!d) {
    var e = goog.basePath + goog.TRANSPILER, f = goog.loadFileSync_(e);
    if (f) {
      eval(f + "\n//# sourceURL=" + e);
      if (goog.global.$gwtExport && goog.global.$gwtExport.$jscomp && !goog.global.$gwtExport.$jscomp.transpile) {
        throw Error('The transpiler did not properly export the "transpile" method. $gwtExport: ' + JSON.stringify(goog.global.$gwtExport));
      }
      goog.global.$jscomp.transpile = goog.global.$gwtExport.$jscomp.transpile;
      c = goog.global.$jscomp;
      d = c.transpile;
    }
  }
  d || (d = c.transpile = function(a, b) {
    goog.logToConsole_(b + " requires transpilation but no transpiler was found.");
    return a;
  });
  return d(a, b);
};
goog.typeOf = function(a) {
  var b = typeof a;
  if ("object" == b) {
    if (a) {
      if (a instanceof Array) {
        return "array";
      }
      if (a instanceof Object) {
        return b;
      }
      var c = Object.prototype.toString.call(a);
      if ("[object Window]" == c) {
        return "object";
      }
      if ("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) {
        return "array";
      }
      if ("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) {
        return "function";
      }
    } else {
      return "null";
    }
  } else {
    if ("function" == b && "undefined" == typeof a.call) {
      return "object";
    }
  }
  return b;
};
goog.isNull = function(a) {
  return null === a;
};
goog.isDefAndNotNull = function(a) {
  return null != a;
};
goog.isArray = function(a) {
  return "array" == goog.typeOf(a);
};
goog.isArrayLike = function(a) {
  var b = goog.typeOf(a);
  return "array" == b || "object" == b && "number" == typeof a.length;
};
goog.isDateLike = function(a) {
  return goog.isObject(a) && "function" == typeof a.getFullYear;
};
goog.isFunction = function(a) {
  return "function" == goog.typeOf(a);
};
goog.isObject = function(a) {
  var b = typeof a;
  return "object" == b && null != a || "function" == b;
};
goog.getUid = function(a) {
  return a[goog.UID_PROPERTY_] || (a[goog.UID_PROPERTY_] = ++goog.uidCounter_);
};
goog.hasUid = function(a) {
  return !!a[goog.UID_PROPERTY_];
};
goog.removeUid = function(a) {
  null !== a && "removeAttribute" in a && a.removeAttribute(goog.UID_PROPERTY_);
  try {
    delete a[goog.UID_PROPERTY_];
  } catch (b) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + (1e9 * Math.random() >>> 0);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(a) {
  var b = goog.typeOf(a);
  if ("object" == b || "array" == b) {
    if (a.clone) {
      return a.clone();
    }
    var b = "array" == b ? [] : {}, c;
    for (c in a) {
      b[c] = goog.cloneObject(a[c]);
    }
    return b;
  }
  return a;
};
goog.bindNative_ = function(a, b, c) {
  return a.call.apply(a.bind, arguments);
};
goog.bindJs_ = function(a, b, c) {
  if (!a) {
    throw Error();
  }
  if (2 < arguments.length) {
    var d = Array.prototype.slice.call(arguments, 2);
    return function() {
      var c = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(c, d);
      return a.apply(b, c);
    };
  }
  return function() {
    return a.apply(b, arguments);
  };
};
goog.bind = function(a, b, c) {
  Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? goog.bind = goog.bindNative_ : goog.bind = goog.bindJs_;
  return goog.bind.apply(null, arguments);
};
goog.partial = function(a, b) {
  var c = Array.prototype.slice.call(arguments, 1);
  return function() {
    var b = c.slice();
    b.push.apply(b, arguments);
    return a.apply(this, b);
  };
};
goog.mixin = function(a, b) {
  for (var c in b) {
    a[c] = b[c];
  }
};
goog.now = goog.TRUSTED_SITE && Date.now || function() {
  return +new Date;
};
goog.globalEval = function(a) {
  if (goog.global.execScript) {
    goog.global.execScript(a, "JavaScript");
  } else {
    if (goog.global.eval) {
      if (null == goog.evalWorksForGlobals_) {
        if (goog.global.eval("var _evalTest_ = 1;"), "undefined" != typeof goog.global._evalTest_) {
          try {
            delete goog.global._evalTest_;
          } catch (d) {
          }
          goog.evalWorksForGlobals_ = !0;
        } else {
          goog.evalWorksForGlobals_ = !1;
        }
      }
      if (goog.evalWorksForGlobals_) {
        goog.global.eval(a);
      } else {
        var b = goog.global.document, c = b.createElement("SCRIPT");
        c.type = "text/javascript";
        c.defer = !1;
        c.appendChild(b.createTextNode(a));
        b.body.appendChild(c);
        b.body.removeChild(c);
      }
    } else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.evalWorksForGlobals_ = null;
goog.getCssName = function(a, b) {
  if ("." == String(a).charAt(0)) {
    throw Error('className passed in goog.getCssName must not start with ".". You passed: ' + a);
  }
  var c = function(a) {
    return goog.cssNameMapping_[a] || a;
  }, d = function(a) {
    a = a.split("-");
    for (var b = [], d = 0; d < a.length; d++) {
      b.push(c(a[d]));
    }
    return b.join("-");
  }, d = goog.cssNameMapping_ ? "BY_WHOLE" == goog.cssNameMappingStyle_ ? c : d : function(a) {
    return a;
  };
  a = b ? a + "-" + d(b) : d(a);
  return goog.global.CLOSURE_CSS_NAME_MAP_FN ? goog.global.CLOSURE_CSS_NAME_MAP_FN(a) : a;
};
goog.setCssNameMapping = function(a, b) {
  goog.cssNameMapping_ = a;
  goog.cssNameMappingStyle_ = b;
};
!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING && (goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING);
goog.getMsg = function(a, b) {
  b && (a = a.replace(/\{\$([^}]+)}/g, function(a, d) {
    return null != b && d in b ? b[d] : a;
  }));
  return a;
};
goog.getMsgWithFallback = function(a, b) {
  return a;
};
goog.exportSymbol = function(a, b, c) {
  goog.exportPath_(a, b, c);
};
goog.exportProperty = function(a, b, c) {
  a[b] = c;
};
goog.inherits = function(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.superClass_ = b.prototype;
  a.prototype = new c;
  a.prototype.constructor = a;
  a.base = function(a, c, f) {
    for (var d = Array(arguments.length - 2), e = 2; e < arguments.length; e++) {
      d[e - 2] = arguments[e];
    }
    return b.prototype[c].apply(a, d);
  };
};
goog.base = function(a, b, c) {
  var d = arguments.callee.caller;
  if (goog.STRICT_MODE_COMPATIBLE || goog.DEBUG && !d) {
    throw Error("arguments.caller not defined.  goog.base() cannot be used with strict mode code. See http://www.ecma-international.org/ecma-262/5.1/#sec-C");
  }
  if (d.superClass_) {
    for (var e = Array(arguments.length - 1), f = 1; f < arguments.length; f++) {
      e[f - 1] = arguments[f];
    }
    return d.superClass_.constructor.apply(a, e);
  }
  e = Array(arguments.length - 2);
  for (f = 2; f < arguments.length; f++) {
    e[f - 2] = arguments[f];
  }
  for (var f = !1, g = a.constructor; g; g = g.superClass_ && g.superClass_.constructor) {
    if (g.prototype[b] === d) {
      f = !0;
    } else {
      if (f) {
        return g.prototype[b].apply(a, e);
      }
    }
  }
  if (a[b] === d) {
    return a.constructor.prototype[b].apply(a, e);
  }
  throw Error("goog.base called from a method of one name to a method of a different name");
};
goog.scope = function(a) {
  if (goog.isInModuleLoader_()) {
    throw Error("goog.scope is not supported within a goog.module.");
  }
  a.call(goog.global);
};
COMPILED || (goog.global.COMPILED = COMPILED);
goog.defineClass = function(a, b) {
  var c = b.constructor, d = b.statics;
  c && c != Object.prototype.constructor || (c = function() {
    throw Error("cannot instantiate an interface (no constructor defined).");
  });
  c = goog.defineClass.createSealingConstructor_(c, a);
  a && goog.inherits(c, a);
  delete b.constructor;
  delete b.statics;
  goog.defineClass.applyProperties_(c.prototype, b);
  null != d && (d instanceof Function ? d(c) : goog.defineClass.applyProperties_(c, d));
  return c;
};
goog.defineClass.SEAL_CLASS_INSTANCES = goog.DEBUG;
goog.defineClass.createSealingConstructor_ = function(a, b) {
  if (!goog.defineClass.SEAL_CLASS_INSTANCES) {
    return a;
  }
  var c = !goog.defineClass.isUnsealable_(b), d = function() {
    var b = a.apply(this, arguments) || this;
    b[goog.UID_PROPERTY_] = b[goog.UID_PROPERTY_];
    this.constructor === d && c && Object.seal instanceof Function && Object.seal(b);
    return b;
  };
  return d;
};
goog.defineClass.isUnsealable_ = function(a) {
  return a && a.prototype && a.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_];
};
goog.defineClass.OBJECT_PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
goog.defineClass.applyProperties_ = function(a, b) {
  for (var c in b) {
    Object.prototype.hasOwnProperty.call(b, c) && (a[c] = b[c]);
  }
  for (var d = 0; d < goog.defineClass.OBJECT_PROTOTYPE_FIELDS_.length; d++) {
    c = goog.defineClass.OBJECT_PROTOTYPE_FIELDS_[d], Object.prototype.hasOwnProperty.call(b, c) && (a[c] = b[c]);
  }
};
goog.tagUnsealableClass = function(a) {
  !COMPILED && goog.defineClass.SEAL_CLASS_INSTANCES && (a.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_] = !0);
};
goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_ = "goog_defineClass_legacy_unsealable";
goog.createRequiresTranspilation_ = function() {
  function a(a, b) {
    d ? c[a] = !0 : b() ? c[a] = !1 : d = c[a] = !0;
  }
  function b(a) {
    try {
      return !!eval(a);
    } catch (g) {
      return !1;
    }
  }
  var c = {es3:!1}, d = !1, e = goog.global.navigator && goog.global.navigator.userAgent ? goog.global.navigator.userAgent : "";
  a("es5", function() {
    return b("[1,].length==1");
  });
  a("es6", function() {
    var a = e.match(/Edge\/(\d+)(\.\d)*/i);
    return a && 15 > Number(a[1]) ? !1 : b('(()=>{"use strict";class X{constructor(){if(new.target!=String)throw 1;this.x=42}}let q=Reflect.construct(X,[],String);if(q.x!=42||!(q instanceof String))throw 1;for(const a of[2,3]){if(a==2)continue;function f(z={a}){let a=0;return z.a}{function f(){return 0;}}return f()==3}})()');
  });
  a("es6-impl", function() {
    return !0;
  });
  a("es7", function() {
    return b("2 ** 2 == 4");
  });
  a("es8", function() {
    return b("async () => 1, true");
  });
  return c;
};
/*

 The MIT License

 Copyright (c) 2007 Cybozu Labs, Inc.
 Copyright (c) 2012 Google Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to
 deal in the Software without restriction, including without limitation the
 rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 sell copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 IN THE SOFTWARE.
*/
var wgxpath = {DataType:{VOID:0, NUMBER:1, BOOLEAN:2, STRING:3, NODESET:4}};
goog.debug = {};
goog.debug.Error = function(a) {
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, goog.debug.Error);
  } else {
    var b = Error().stack;
    b && (this.stack = b);
  }
  a && (this.message = String(a));
  this.reportErrorToServer = !0;
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
goog.dom = {};
goog.dom.NodeType = {ELEMENT:1, ATTRIBUTE:2, TEXT:3, CDATA_SECTION:4, ENTITY_REFERENCE:5, ENTITY:6, PROCESSING_INSTRUCTION:7, COMMENT:8, DOCUMENT:9, DOCUMENT_TYPE:10, DOCUMENT_FRAGMENT:11, NOTATION:12};
goog.string = {};
goog.string.DETECT_DOUBLE_ESCAPING = !1;
goog.string.FORCE_NON_DOM_HTML_UNESCAPING = !1;
goog.string.Unicode = {NBSP:"\u00a0"};
goog.string.startsWith = function(a, b) {
  return 0 == a.lastIndexOf(b, 0);
};
goog.string.endsWith = function(a, b) {
  var c = a.length - b.length;
  return 0 <= c && a.indexOf(b, c) == c;
};
goog.string.caseInsensitiveStartsWith = function(a, b) {
  return 0 == goog.string.caseInsensitiveCompare(b, a.substr(0, b.length));
};
goog.string.caseInsensitiveEndsWith = function(a, b) {
  return 0 == goog.string.caseInsensitiveCompare(b, a.substr(a.length - b.length, b.length));
};
goog.string.caseInsensitiveEquals = function(a, b) {
  return a.toLowerCase() == b.toLowerCase();
};
goog.string.subs = function(a, b) {
  for (var c = a.split("%s"), d = "", e = Array.prototype.slice.call(arguments, 1); e.length && 1 < c.length;) {
    d += c.shift() + e.shift();
  }
  return d + c.join("%s");
};
goog.string.collapseWhitespace = function(a) {
  return a.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "");
};
goog.string.isEmptyOrWhitespace = function(a) {
  return /^[\s\xa0]*$/.test(a);
};
goog.string.isEmptyString = function(a) {
  return 0 == a.length;
};
goog.string.isEmpty = goog.string.isEmptyOrWhitespace;
goog.string.isEmptyOrWhitespaceSafe = function(a) {
  return goog.string.isEmptyOrWhitespace(goog.string.makeSafe(a));
};
goog.string.isEmptySafe = goog.string.isEmptyOrWhitespaceSafe;
goog.string.isBreakingWhitespace = function(a) {
  return !/[^\t\n\r ]/.test(a);
};
goog.string.isAlpha = function(a) {
  return !/[^a-zA-Z]/.test(a);
};
goog.string.isNumeric = function(a) {
  return !/[^0-9]/.test(a);
};
goog.string.isAlphaNumeric = function(a) {
  return !/[^a-zA-Z0-9]/.test(a);
};
goog.string.isSpace = function(a) {
  return " " == a;
};
goog.string.isUnicodeChar = function(a) {
  return 1 == a.length && " " <= a && "~" >= a || "\u0080" <= a && "\ufffd" >= a;
};
goog.string.stripNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)+/g, " ");
};
goog.string.canonicalizeNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)/g, "\n");
};
goog.string.normalizeWhitespace = function(a) {
  return a.replace(/\xa0|\s/g, " ");
};
goog.string.normalizeSpaces = function(a) {
  return a.replace(/\xa0|[ \t]+/g, " ");
};
goog.string.collapseBreakingSpaces = function(a) {
  return a.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "");
};
goog.string.trim = goog.TRUSTED_SITE && String.prototype.trim ? function(a) {
  return a.trim();
} : function(a) {
  return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "");
};
goog.string.trimLeft = function(a) {
  return a.replace(/^[\s\xa0]+/, "");
};
goog.string.trimRight = function(a) {
  return a.replace(/[\s\xa0]+$/, "");
};
goog.string.caseInsensitiveCompare = function(a, b) {
  a = String(a).toLowerCase();
  b = String(b).toLowerCase();
  return a < b ? -1 : a == b ? 0 : 1;
};
goog.string.numberAwareCompare_ = function(a, b, c) {
  if (a == b) {
    return 0;
  }
  if (!a) {
    return -1;
  }
  if (!b) {
    return 1;
  }
  for (var d = a.toLowerCase().match(c), e = b.toLowerCase().match(c), f = Math.min(d.length, e.length), g = 0; g < f; g++) {
    c = d[g];
    var h = e[g];
    if (c != h) {
      return a = parseInt(c, 10), !isNaN(a) && (b = parseInt(h, 10), !isNaN(b) && a - b) ? a - b : c < h ? -1 : 1;
    }
  }
  return d.length != e.length ? d.length - e.length : a < b ? -1 : 1;
};
goog.string.intAwareCompare = function(a, b) {
  return goog.string.numberAwareCompare_(a, b, /\d+|\D+/g);
};
goog.string.floatAwareCompare = function(a, b) {
  return goog.string.numberAwareCompare_(a, b, /\d+|\.\d+|\D+/g);
};
goog.string.numerateCompare = goog.string.floatAwareCompare;
goog.string.urlEncode = function(a) {
  return encodeURIComponent(String(a));
};
goog.string.urlDecode = function(a) {
  return decodeURIComponent(a.replace(/\+/g, " "));
};
goog.string.newLineToBr = function(a, b) {
  return a.replace(/(\r\n|\r|\n)/g, b ? "<br />" : "<br>");
};
goog.string.htmlEscape = function(a, b) {
  if (b) {
    a = a.replace(goog.string.AMP_RE_, "&amp;").replace(goog.string.LT_RE_, "&lt;").replace(goog.string.GT_RE_, "&gt;").replace(goog.string.QUOT_RE_, "&quot;").replace(goog.string.SINGLE_QUOTE_RE_, "&#39;").replace(goog.string.NULL_RE_, "&#0;"), goog.string.DETECT_DOUBLE_ESCAPING && (a = a.replace(goog.string.E_RE_, "&#101;"));
  } else {
    if (!goog.string.ALL_RE_.test(a)) {
      return a;
    }
    -1 != a.indexOf("&") && (a = a.replace(goog.string.AMP_RE_, "&amp;"));
    -1 != a.indexOf("<") && (a = a.replace(goog.string.LT_RE_, "&lt;"));
    -1 != a.indexOf(">") && (a = a.replace(goog.string.GT_RE_, "&gt;"));
    -1 != a.indexOf('"') && (a = a.replace(goog.string.QUOT_RE_, "&quot;"));
    -1 != a.indexOf("'") && (a = a.replace(goog.string.SINGLE_QUOTE_RE_, "&#39;"));
    -1 != a.indexOf("\x00") && (a = a.replace(goog.string.NULL_RE_, "&#0;"));
    goog.string.DETECT_DOUBLE_ESCAPING && -1 != a.indexOf("e") && (a = a.replace(goog.string.E_RE_, "&#101;"));
  }
  return a;
};
goog.string.AMP_RE_ = /&/g;
goog.string.LT_RE_ = /</g;
goog.string.GT_RE_ = />/g;
goog.string.QUOT_RE_ = /"/g;
goog.string.SINGLE_QUOTE_RE_ = /'/g;
goog.string.NULL_RE_ = /\x00/g;
goog.string.E_RE_ = /e/g;
goog.string.ALL_RE_ = goog.string.DETECT_DOUBLE_ESCAPING ? /[\x00&<>"'e]/ : /[\x00&<>"']/;
goog.string.unescapeEntities = function(a) {
  return goog.string.contains(a, "&") ? !goog.string.FORCE_NON_DOM_HTML_UNESCAPING && "document" in goog.global ? goog.string.unescapeEntitiesUsingDom_(a) : goog.string.unescapePureXmlEntities_(a) : a;
};
goog.string.unescapeEntitiesWithDocument = function(a, b) {
  return goog.string.contains(a, "&") ? goog.string.unescapeEntitiesUsingDom_(a, b) : a;
};
goog.string.unescapeEntitiesUsingDom_ = function(a, b) {
  var c = {"&amp;":"&", "&lt;":"<", "&gt;":">", "&quot;":'"'};
  var d = b ? b.createElement("div") : goog.global.document.createElement("div");
  return a.replace(goog.string.HTML_ENTITY_PATTERN_, function(a, b) {
    var e = c[a];
    if (e) {
      return e;
    }
    "#" == b.charAt(0) && (b = Number("0" + b.substr(1)), isNaN(b) || (e = String.fromCharCode(b)));
    e || (d.innerHTML = a + " ", e = d.firstChild.nodeValue.slice(0, -1));
    return c[a] = e;
  });
};
goog.string.unescapePureXmlEntities_ = function(a) {
  return a.replace(/&([^;]+);/g, function(a, c) {
    switch(c) {
      case "amp":
        return "&";
      case "lt":
        return "<";
      case "gt":
        return ">";
      case "quot":
        return '"';
      default:
        return "#" != c.charAt(0) || (c = Number("0" + c.substr(1)), isNaN(c)) ? a : String.fromCharCode(c);
    }
  });
};
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
goog.string.whitespaceEscape = function(a, b) {
  return goog.string.newLineToBr(a.replace(/  /g, " &#160;"), b);
};
goog.string.preserveSpaces = function(a) {
  return a.replace(/(^|[\n ]) /g, "$1" + goog.string.Unicode.NBSP);
};
goog.string.stripQuotes = function(a, b) {
  for (var c = b.length, d = 0; d < c; d++) {
    var e = 1 == c ? b : b.charAt(d);
    if (a.charAt(0) == e && a.charAt(a.length - 1) == e) {
      return a.substring(1, a.length - 1);
    }
  }
  return a;
};
goog.string.truncate = function(a, b, c) {
  c && (a = goog.string.unescapeEntities(a));
  a.length > b && (a = a.substring(0, b - 3) + "...");
  c && (a = goog.string.htmlEscape(a));
  return a;
};
goog.string.truncateMiddle = function(a, b, c, d) {
  c && (a = goog.string.unescapeEntities(a));
  if (d && a.length > b) {
    d > b && (d = b);
    var e = a.length - d;
    a = a.substring(0, b - d) + "..." + a.substring(e);
  } else {
    a.length > b && (d = Math.floor(b / 2), e = a.length - d, a = a.substring(0, d + b % 2) + "..." + a.substring(e));
  }
  c && (a = goog.string.htmlEscape(a));
  return a;
};
goog.string.specialEscapeChars_ = {"\x00":"\\0", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\x0B", '"':'\\"', "\\":"\\\\", "<":"<"};
goog.string.jsEscapeCache_ = {"'":"\\'"};
goog.string.quote = function(a) {
  a = String(a);
  for (var b = ['"'], c = 0; c < a.length; c++) {
    var d = a.charAt(c), e = d.charCodeAt(0);
    b[c + 1] = goog.string.specialEscapeChars_[d] || (31 < e && 127 > e ? d : goog.string.escapeChar(d));
  }
  b.push('"');
  return b.join("");
};
goog.string.escapeString = function(a) {
  for (var b = [], c = 0; c < a.length; c++) {
    b[c] = goog.string.escapeChar(a.charAt(c));
  }
  return b.join("");
};
goog.string.escapeChar = function(a) {
  if (a in goog.string.jsEscapeCache_) {
    return goog.string.jsEscapeCache_[a];
  }
  if (a in goog.string.specialEscapeChars_) {
    return goog.string.jsEscapeCache_[a] = goog.string.specialEscapeChars_[a];
  }
  var b = a.charCodeAt(0);
  if (31 < b && 127 > b) {
    var c = a;
  } else {
    if (256 > b) {
      if (c = "\\x", 16 > b || 256 < b) {
        c += "0";
      }
    } else {
      c = "\\u", 4096 > b && (c += "0");
    }
    c += b.toString(16).toUpperCase();
  }
  return goog.string.jsEscapeCache_[a] = c;
};
goog.string.contains = function(a, b) {
  return -1 != a.indexOf(b);
};
goog.string.caseInsensitiveContains = function(a, b) {
  return goog.string.contains(a.toLowerCase(), b.toLowerCase());
};
goog.string.countOf = function(a, b) {
  return a && b ? a.split(b).length - 1 : 0;
};
goog.string.removeAt = function(a, b, c) {
  var d = a;
  0 <= b && b < a.length && 0 < c && (d = a.substr(0, b) + a.substr(b + c, a.length - b - c));
  return d;
};
goog.string.remove = function(a, b) {
  return a.replace(b, "");
};
goog.string.removeAll = function(a, b) {
  b = new RegExp(goog.string.regExpEscape(b), "g");
  return a.replace(b, "");
};
goog.string.replaceAll = function(a, b, c) {
  b = new RegExp(goog.string.regExpEscape(b), "g");
  return a.replace(b, c.replace(/\$/g, "$$$$"));
};
goog.string.regExpEscape = function(a) {
  return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08");
};
goog.string.repeat = String.prototype.repeat ? function(a, b) {
  return a.repeat(b);
} : function(a, b) {
  return Array(b + 1).join(a);
};
goog.string.padNumber = function(a, b, c) {
  a = goog.isDef(c) ? a.toFixed(c) : String(a);
  c = a.indexOf(".");
  -1 == c && (c = a.length);
  return goog.string.repeat("0", Math.max(0, b - c)) + a;
};
goog.string.makeSafe = function(a) {
  return null == a ? "" : String(a);
};
goog.string.buildString = function(a) {
  return Array.prototype.join.call(arguments, "");
};
goog.string.getRandomString = function() {
  return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ goog.now()).toString(36);
};
goog.string.compareVersions = function(a, b) {
  var c = 0;
  a = goog.string.trim(String(a)).split(".");
  b = goog.string.trim(String(b)).split(".");
  for (var d = Math.max(a.length, b.length), e = 0; 0 == c && e < d; e++) {
    var f = a[e] || "", g = b[e] || "";
    do {
      f = /(\d*)(\D*)(.*)/.exec(f) || ["", "", "", ""];
      g = /(\d*)(\D*)(.*)/.exec(g) || ["", "", "", ""];
      if (0 == f[0].length && 0 == g[0].length) {
        break;
      }
      var c = 0 == f[1].length ? 0 : parseInt(f[1], 10), h = 0 == g[1].length ? 0 : parseInt(g[1], 10), c = goog.string.compareElements_(c, h) || goog.string.compareElements_(0 == f[2].length, 0 == g[2].length) || goog.string.compareElements_(f[2], g[2]), f = f[3], g = g[3];
    } while (0 == c);
  }
  return c;
};
goog.string.compareElements_ = function(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
};
goog.string.hashCode = function(a) {
  for (var b = 0, c = 0; c < a.length; ++c) {
    b = 31 * b + a.charCodeAt(c) >>> 0;
  }
  return b;
};
goog.string.uniqueStringCounter_ = 2147483648 * Math.random() | 0;
goog.string.createUniqueString = function() {
  return "goog_" + goog.string.uniqueStringCounter_++;
};
goog.string.toNumber = function(a) {
  var b = Number(a);
  return 0 == b && goog.string.isEmptyOrWhitespace(a) ? NaN : b;
};
goog.string.isLowerCamelCase = function(a) {
  return /^[a-z]+([A-Z][a-z]*)*$/.test(a);
};
goog.string.isUpperCamelCase = function(a) {
  return /^([A-Z][a-z]*)+$/.test(a);
};
goog.string.toCamelCase = function(a) {
  return String(a).replace(/\-([a-z])/g, function(a, c) {
    return c.toUpperCase();
  });
};
goog.string.toSelectorCase = function(a) {
  return String(a).replace(/([A-Z])/g, "-$1").toLowerCase();
};
goog.string.toTitleCase = function(a, b) {
  b = goog.isString(b) ? goog.string.regExpEscape(b) : "\\s";
  return a.replace(new RegExp("(^" + (b ? "|[" + b + "]+" : "") + ")([a-z])", "g"), function(a, b, e) {
    return b + e.toUpperCase();
  });
};
goog.string.capitalize = function(a) {
  return String(a.charAt(0)).toUpperCase() + String(a.substr(1)).toLowerCase();
};
goog.string.parseInt = function(a) {
  isFinite(a) && (a = String(a));
  return goog.isString(a) ? /^\s*-?0x/i.test(a) ? parseInt(a, 16) : parseInt(a, 10) : NaN;
};
goog.string.splitLimit = function(a, b, c) {
  a = a.split(b);
  for (var d = []; 0 < c && a.length;) {
    d.push(a.shift()), c--;
  }
  a.length && d.push(a.join(b));
  return d;
};
goog.string.lastComponent = function(a, b) {
  if (b) {
    "string" == typeof b && (b = [b]);
  } else {
    return a;
  }
  for (var c = -1, d = 0; d < b.length; d++) {
    if ("" != b[d]) {
      var e = a.lastIndexOf(b[d]);
      e > c && (c = e);
    }
  }
  return -1 == c ? a : a.slice(c + 1);
};
goog.string.editDistance = function(a, b) {
  var c = [], d = [];
  if (a == b) {
    return 0;
  }
  if (!a.length || !b.length) {
    return Math.max(a.length, b.length);
  }
  for (var e = 0; e < b.length + 1; e++) {
    c[e] = e;
  }
  for (e = 0; e < a.length; e++) {
    d[0] = e + 1;
    for (var f = 0; f < b.length; f++) {
      d[f + 1] = Math.min(d[f] + 1, c[f + 1] + 1, c[f] + Number(a[e] != b[f]));
    }
    for (f = 0; f < c.length; f++) {
      c[f] = d[f];
    }
  }
  return d[b.length];
};
goog.asserts = {};
goog.asserts.ENABLE_ASSERTS = goog.DEBUG;
goog.asserts.AssertionError = function(a, b) {
  b.unshift(a);
  goog.debug.Error.call(this, goog.string.subs.apply(null, b));
  b.shift();
  this.messagePattern = a;
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.DEFAULT_ERROR_HANDLER = function(a) {
  throw a;
};
goog.asserts.errorHandler_ = goog.asserts.DEFAULT_ERROR_HANDLER;
goog.asserts.doAssertFailure_ = function(a, b, c, d) {
  var e = "Assertion failed";
  if (c) {
    e += ": " + c;
    var f = d;
  } else {
    a && (e += ": " + a, f = b);
  }
  a = new goog.asserts.AssertionError("" + e, f || []);
  goog.asserts.errorHandler_(a);
};
goog.asserts.setErrorHandler = function(a) {
  goog.asserts.ENABLE_ASSERTS && (goog.asserts.errorHandler_ = a);
};
goog.asserts.assert = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !a && goog.asserts.doAssertFailure_("", null, b, Array.prototype.slice.call(arguments, 2));
  return a;
};
goog.asserts.fail = function(a, b) {
  goog.asserts.ENABLE_ASSERTS && goog.asserts.errorHandler_(new goog.asserts.AssertionError("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1)));
};
goog.asserts.assertNumber = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isNumber(a) && goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
goog.asserts.assertString = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isString(a) && goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
goog.asserts.assertFunction = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isFunction(a) && goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
goog.asserts.assertObject = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isObject(a) && goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
goog.asserts.assertArray = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isArray(a) && goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
goog.asserts.assertBoolean = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(a) && goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
goog.asserts.assertElement = function(a, b, c) {
  !goog.asserts.ENABLE_ASSERTS || goog.isObject(a) && a.nodeType == goog.dom.NodeType.ELEMENT || goog.asserts.doAssertFailure_("Expected Element but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
goog.asserts.assertInstanceof = function(a, b, c, d) {
  !goog.asserts.ENABLE_ASSERTS || a instanceof b || goog.asserts.doAssertFailure_("Expected instanceof %s but got %s.", [goog.asserts.getType_(b), goog.asserts.getType_(a)], c, Array.prototype.slice.call(arguments, 3));
  return a;
};
goog.asserts.assertObjectPrototypeIsIntact = function() {
  for (var a in Object.prototype) {
    goog.asserts.fail(a + " should not be enumerable in Object.prototype.");
  }
};
goog.asserts.getType_ = function(a) {
  return a instanceof Function ? a.displayName || a.name || "unknown type name" : a instanceof Object ? a.constructor.displayName || a.constructor.name || Object.prototype.toString.call(a) : null === a ? "null" : typeof a;
};
goog.array = {};
goog.NATIVE_ARRAY_PROTOTYPES = !1;
goog.array.ASSUME_NATIVE_FUNCTIONS = !1;
goog.array.peek = function(a) {
  return a[a.length - 1];
};
goog.array.last = goog.array.peek;
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.indexOf) ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return Array.prototype.indexOf.call(a, b, c);
} : function(a, b, c) {
  c = null == c ? 0 : 0 > c ? Math.max(0, a.length + c) : c;
  if (goog.isString(a)) {
    return goog.isString(b) && 1 == b.length ? a.indexOf(b, c) : -1;
  }
  for (; c < a.length; c++) {
    if (c in a && a[c] === b) {
      return c;
    }
  }
  return -1;
};
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.lastIndexOf) ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return Array.prototype.lastIndexOf.call(a, b, null == c ? a.length - 1 : c);
} : function(a, b, c) {
  c = null == c ? a.length - 1 : c;
  0 > c && (c = Math.max(0, a.length + c));
  if (goog.isString(a)) {
    return goog.isString(b) && 1 == b.length ? a.lastIndexOf(b, c) : -1;
  }
  for (; 0 <= c; c--) {
    if (c in a && a[c] === b) {
      return c;
    }
  }
  return -1;
};
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.forEach) ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  Array.prototype.forEach.call(a, b, c);
} : function(a, b, c) {
  for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0; f < d; f++) {
    f in e && b.call(c, e[f], f, a);
  }
};
goog.array.forEachRight = function(a, b, c) {
  for (var d = a.length, e = goog.isString(a) ? a.split("") : a, d = d - 1; 0 <= d; --d) {
    d in e && b.call(c, e[d], d, a);
  }
};
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.filter) ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return Array.prototype.filter.call(a, b, c);
} : function(a, b, c) {
  for (var d = a.length, e = [], f = 0, g = goog.isString(a) ? a.split("") : a, h = 0; h < d; h++) {
    if (h in g) {
      var k = g[h];
      b.call(c, k, h, a) && (e[f++] = k);
    }
  }
  return e;
};
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.map) ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return Array.prototype.map.call(a, b, c);
} : function(a, b, c) {
  for (var d = a.length, e = Array(d), f = goog.isString(a) ? a.split("") : a, g = 0; g < d; g++) {
    g in f && (e[g] = b.call(c, f[g], g, a));
  }
  return e;
};
goog.array.reduce = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.reduce) ? function(a, b, c, d) {
  goog.asserts.assert(null != a.length);
  d && (b = goog.bind(b, d));
  return Array.prototype.reduce.call(a, b, c);
} : function(a, b, c, d) {
  var e = c;
  goog.array.forEach(a, function(c, g) {
    e = b.call(d, e, c, g, a);
  });
  return e;
};
goog.array.reduceRight = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.reduceRight) ? function(a, b, c, d) {
  goog.asserts.assert(null != a.length);
  goog.asserts.assert(null != b);
  d && (b = goog.bind(b, d));
  return Array.prototype.reduceRight.call(a, b, c);
} : function(a, b, c, d) {
  var e = c;
  goog.array.forEachRight(a, function(c, g) {
    e = b.call(d, e, c, g, a);
  });
  return e;
};
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.some) ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return Array.prototype.some.call(a, b, c);
} : function(a, b, c) {
  for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0; f < d; f++) {
    if (f in e && b.call(c, e[f], f, a)) {
      return !0;
    }
  }
  return !1;
};
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.every) ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return Array.prototype.every.call(a, b, c);
} : function(a, b, c) {
  for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0; f < d; f++) {
    if (f in e && !b.call(c, e[f], f, a)) {
      return !1;
    }
  }
  return !0;
};
goog.array.count = function(a, b, c) {
  var d = 0;
  goog.array.forEach(a, function(a, f, g) {
    b.call(c, a, f, g) && ++d;
  }, c);
  return d;
};
goog.array.find = function(a, b, c) {
  b = goog.array.findIndex(a, b, c);
  return 0 > b ? null : goog.isString(a) ? a.charAt(b) : a[b];
};
goog.array.findIndex = function(a, b, c) {
  for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0; f < d; f++) {
    if (f in e && b.call(c, e[f], f, a)) {
      return f;
    }
  }
  return -1;
};
goog.array.findRight = function(a, b, c) {
  b = goog.array.findIndexRight(a, b, c);
  return 0 > b ? null : goog.isString(a) ? a.charAt(b) : a[b];
};
goog.array.findIndexRight = function(a, b, c) {
  for (var d = a.length, e = goog.isString(a) ? a.split("") : a, d = d - 1; 0 <= d; d--) {
    if (d in e && b.call(c, e[d], d, a)) {
      return d;
    }
  }
  return -1;
};
goog.array.contains = function(a, b) {
  return 0 <= goog.array.indexOf(a, b);
};
goog.array.isEmpty = function(a) {
  return 0 == a.length;
};
goog.array.clear = function(a) {
  if (!goog.isArray(a)) {
    for (var b = a.length - 1; 0 <= b; b--) {
      delete a[b];
    }
  }
  a.length = 0;
};
goog.array.insert = function(a, b) {
  goog.array.contains(a, b) || a.push(b);
};
goog.array.insertAt = function(a, b, c) {
  goog.array.splice(a, c, 0, b);
};
goog.array.insertArrayAt = function(a, b, c) {
  goog.partial(goog.array.splice, a, c, 0).apply(null, b);
};
goog.array.insertBefore = function(a, b, c) {
  var d;
  2 == arguments.length || 0 > (d = goog.array.indexOf(a, c)) ? a.push(b) : goog.array.insertAt(a, b, d);
};
goog.array.remove = function(a, b) {
  b = goog.array.indexOf(a, b);
  var c;
  (c = 0 <= b) && goog.array.removeAt(a, b);
  return c;
};
goog.array.removeLast = function(a, b) {
  b = goog.array.lastIndexOf(a, b);
  return 0 <= b ? (goog.array.removeAt(a, b), !0) : !1;
};
goog.array.removeAt = function(a, b) {
  goog.asserts.assert(null != a.length);
  return 1 == Array.prototype.splice.call(a, b, 1).length;
};
goog.array.removeIf = function(a, b, c) {
  b = goog.array.findIndex(a, b, c);
  return 0 <= b ? (goog.array.removeAt(a, b), !0) : !1;
};
goog.array.removeAllIf = function(a, b, c) {
  var d = 0;
  goog.array.forEachRight(a, function(e, f) {
    b.call(c, e, f, a) && goog.array.removeAt(a, f) && d++;
  });
  return d;
};
goog.array.concat = function(a) {
  return Array.prototype.concat.apply([], arguments);
};
goog.array.join = function(a) {
  return Array.prototype.concat.apply([], arguments);
};
goog.array.toArray = function(a) {
  var b = a.length;
  if (0 < b) {
    for (var c = Array(b), d = 0; d < b; d++) {
      c[d] = a[d];
    }
    return c;
  }
  return [];
};
goog.array.clone = goog.array.toArray;
goog.array.extend = function(a, b) {
  for (var c = 1; c < arguments.length; c++) {
    var d = arguments[c];
    if (goog.isArrayLike(d)) {
      var e = a.length || 0, f = d.length || 0;
      a.length = e + f;
      for (var g = 0; g < f; g++) {
        a[e + g] = d[g];
      }
    } else {
      a.push(d);
    }
  }
};
goog.array.splice = function(a, b, c, d) {
  goog.asserts.assert(null != a.length);
  return Array.prototype.splice.apply(a, goog.array.slice(arguments, 1));
};
goog.array.slice = function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return 2 >= arguments.length ? Array.prototype.slice.call(a, b) : Array.prototype.slice.call(a, b, c);
};
goog.array.removeDuplicates = function(a, b, c) {
  b = b || a;
  var d = function(a) {
    return goog.isObject(a) ? "o" + goog.getUid(a) : (typeof a).charAt(0) + a;
  };
  c = c || d;
  for (var d = {}, e = 0, f = 0; f < a.length;) {
    var g = a[f++], h = c(g);
    Object.prototype.hasOwnProperty.call(d, h) || (d[h] = !0, b[e++] = g);
  }
  b.length = e;
};
goog.array.binarySearch = function(a, b, c) {
  return goog.array.binarySearch_(a, c || goog.array.defaultCompare, !1, b);
};
goog.array.binarySelect = function(a, b, c) {
  return goog.array.binarySearch_(a, b, !0, void 0, c);
};
goog.array.binarySearch_ = function(a, b, c, d, e) {
  for (var f = 0, g = a.length, h; f < g;) {
    var k = f + g >> 1;
    var l = c ? b.call(e, a[k], k, a) : b(d, a[k]);
    0 < l ? f = k + 1 : (g = k, h = !l);
  }
  return h ? f : ~f;
};
goog.array.sort = function(a, b) {
  a.sort(b || goog.array.defaultCompare);
};
goog.array.stableSort = function(a, b) {
  for (var c = Array(a.length), d = 0; d < a.length; d++) {
    c[d] = {index:d, value:a[d]};
  }
  var e = b || goog.array.defaultCompare;
  goog.array.sort(c, function(a, b) {
    return e(a.value, b.value) || a.index - b.index;
  });
  for (d = 0; d < a.length; d++) {
    a[d] = c[d].value;
  }
};
goog.array.sortByKey = function(a, b, c) {
  var d = c || goog.array.defaultCompare;
  goog.array.sort(a, function(a, c) {
    return d(b(a), b(c));
  });
};
goog.array.sortObjectsByKey = function(a, b, c) {
  goog.array.sortByKey(a, function(a) {
    return a[b];
  }, c);
};
goog.array.isSorted = function(a, b, c) {
  b = b || goog.array.defaultCompare;
  for (var d = 1; d < a.length; d++) {
    var e = b(a[d - 1], a[d]);
    if (0 < e || 0 == e && c) {
      return !1;
    }
  }
  return !0;
};
goog.array.equals = function(a, b, c) {
  if (!goog.isArrayLike(a) || !goog.isArrayLike(b) || a.length != b.length) {
    return !1;
  }
  var d = a.length;
  c = c || goog.array.defaultCompareEquality;
  for (var e = 0; e < d; e++) {
    if (!c(a[e], b[e])) {
      return !1;
    }
  }
  return !0;
};
goog.array.compare3 = function(a, b, c) {
  c = c || goog.array.defaultCompare;
  for (var d = Math.min(a.length, b.length), e = 0; e < d; e++) {
    var f = c(a[e], b[e]);
    if (0 != f) {
      return f;
    }
  }
  return goog.array.defaultCompare(a.length, b.length);
};
goog.array.defaultCompare = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
};
goog.array.inverseDefaultCompare = function(a, b) {
  return -goog.array.defaultCompare(a, b);
};
goog.array.defaultCompareEquality = function(a, b) {
  return a === b;
};
goog.array.binaryInsert = function(a, b, c) {
  c = goog.array.binarySearch(a, b, c);
  return 0 > c ? (goog.array.insertAt(a, b, -(c + 1)), !0) : !1;
};
goog.array.binaryRemove = function(a, b, c) {
  b = goog.array.binarySearch(a, b, c);
  return 0 <= b ? goog.array.removeAt(a, b) : !1;
};
goog.array.bucket = function(a, b, c) {
  for (var d = {}, e = 0; e < a.length; e++) {
    var f = a[e], g = b.call(c, f, e, a);
    goog.isDef(g) && (d[g] || (d[g] = [])).push(f);
  }
  return d;
};
goog.array.toObject = function(a, b, c) {
  var d = {};
  goog.array.forEach(a, function(e, f) {
    d[b.call(c, e, f, a)] = e;
  });
  return d;
};
goog.array.range = function(a, b, c) {
  var d = [], e = 0, f = a;
  c = c || 1;
  void 0 !== b && (e = a, f = b);
  if (0 > c * (f - e)) {
    return [];
  }
  if (0 < c) {
    for (a = e; a < f; a += c) {
      d.push(a);
    }
  } else {
    for (a = e; a > f; a += c) {
      d.push(a);
    }
  }
  return d;
};
goog.array.repeat = function(a, b) {
  for (var c = [], d = 0; d < b; d++) {
    c[d] = a;
  }
  return c;
};
goog.array.flatten = function(a) {
  for (var b = [], c = 0; c < arguments.length; c++) {
    var d = arguments[c];
    if (goog.isArray(d)) {
      for (var e = 0; e < d.length; e += 8192) {
        for (var f = goog.array.slice(d, e, e + 8192), f = goog.array.flatten.apply(null, f), g = 0; g < f.length; g++) {
          b.push(f[g]);
        }
      }
    } else {
      b.push(d);
    }
  }
  return b;
};
goog.array.rotate = function(a, b) {
  goog.asserts.assert(null != a.length);
  a.length && (b %= a.length, 0 < b ? Array.prototype.unshift.apply(a, a.splice(-b, b)) : 0 > b && Array.prototype.push.apply(a, a.splice(0, -b)));
  return a;
};
goog.array.moveItem = function(a, b, c) {
  goog.asserts.assert(0 <= b && b < a.length);
  goog.asserts.assert(0 <= c && c < a.length);
  b = Array.prototype.splice.call(a, b, 1);
  Array.prototype.splice.call(a, c, 0, b[0]);
};
goog.array.zip = function(a) {
  if (!arguments.length) {
    return [];
  }
  for (var b = [], c = arguments[0].length, d = 1; d < arguments.length; d++) {
    arguments[d].length < c && (c = arguments[d].length);
  }
  for (d = 0; d < c; d++) {
    for (var e = [], f = 0; f < arguments.length; f++) {
      e.push(arguments[f][d]);
    }
    b.push(e);
  }
  return b;
};
goog.array.shuffle = function(a, b) {
  b = b || Math.random;
  for (var c = a.length - 1; 0 < c; c--) {
    var d = Math.floor(b() * (c + 1)), e = a[c];
    a[c] = a[d];
    a[d] = e;
  }
};
goog.array.copyByIndex = function(a, b) {
  var c = [];
  goog.array.forEach(b, function(b) {
    c.push(a[b]);
  });
  return c;
};
goog.array.concatMap = function(a, b, c) {
  return goog.array.concat.apply([], goog.array.map(a, b, c));
};
goog.labs = {};
goog.labs.userAgent = {};
goog.labs.userAgent.util = {};
goog.labs.userAgent.util.getNativeUserAgentString_ = function() {
  var a = goog.labs.userAgent.util.getNavigator_();
  return a && (a = a.userAgent) ? a : "";
};
goog.labs.userAgent.util.getNavigator_ = function() {
  return goog.global.navigator;
};
goog.labs.userAgent.util.userAgent_ = goog.labs.userAgent.util.getNativeUserAgentString_();
goog.labs.userAgent.util.setUserAgent = function(a) {
  goog.labs.userAgent.util.userAgent_ = a || goog.labs.userAgent.util.getNativeUserAgentString_();
};
goog.labs.userAgent.util.getUserAgent = function() {
  return goog.labs.userAgent.util.userAgent_;
};
goog.labs.userAgent.util.matchUserAgent = function(a) {
  var b = goog.labs.userAgent.util.getUserAgent();
  return goog.string.contains(b, a);
};
goog.labs.userAgent.util.matchUserAgentIgnoreCase = function(a) {
  var b = goog.labs.userAgent.util.getUserAgent();
  return goog.string.caseInsensitiveContains(b, a);
};
goog.labs.userAgent.util.extractVersionTuples = function(a) {
  for (var b = /(\w[\w ]+)\/([^\s]+)\s*(?:\((.*?)\))?/g, c = [], d; d = b.exec(a);) {
    c.push([d[1], d[2], d[3] || void 0]);
  }
  return c;
};
goog.object = {};
goog.object.is = function(a, b) {
  return a === b ? 0 !== a || 1 / a === 1 / b : a !== a && b !== b;
};
goog.object.forEach = function(a, b, c) {
  for (var d in a) {
    b.call(c, a[d], d, a);
  }
};
goog.object.filter = function(a, b, c) {
  var d = {}, e;
  for (e in a) {
    b.call(c, a[e], e, a) && (d[e] = a[e]);
  }
  return d;
};
goog.object.map = function(a, b, c) {
  var d = {}, e;
  for (e in a) {
    d[e] = b.call(c, a[e], e, a);
  }
  return d;
};
goog.object.some = function(a, b, c) {
  for (var d in a) {
    if (b.call(c, a[d], d, a)) {
      return !0;
    }
  }
  return !1;
};
goog.object.every = function(a, b, c) {
  for (var d in a) {
    if (!b.call(c, a[d], d, a)) {
      return !1;
    }
  }
  return !0;
};
goog.object.getCount = function(a) {
  var b = 0, c;
  for (c in a) {
    b++;
  }
  return b;
};
goog.object.getAnyKey = function(a) {
  for (var b in a) {
    return b;
  }
};
goog.object.getAnyValue = function(a) {
  for (var b in a) {
    return a[b];
  }
};
goog.object.contains = function(a, b) {
  return goog.object.containsValue(a, b);
};
goog.object.getValues = function(a) {
  var b = [], c = 0, d;
  for (d in a) {
    b[c++] = a[d];
  }
  return b;
};
goog.object.getKeys = function(a) {
  var b = [], c = 0, d;
  for (d in a) {
    b[c++] = d;
  }
  return b;
};
goog.object.getValueByKeys = function(a, b) {
  for (var c = goog.isArrayLike(b), d = c ? b : arguments, c = c ? 0 : 1; c < d.length && (a = a[d[c]], goog.isDef(a)); c++) {
  }
  return a;
};
goog.object.containsKey = function(a, b) {
  return null !== a && b in a;
};
goog.object.containsValue = function(a, b) {
  for (var c in a) {
    if (a[c] == b) {
      return !0;
    }
  }
  return !1;
};
goog.object.findKey = function(a, b, c) {
  for (var d in a) {
    if (b.call(c, a[d], d, a)) {
      return d;
    }
  }
};
goog.object.findValue = function(a, b, c) {
  return (b = goog.object.findKey(a, b, c)) && a[b];
};
goog.object.isEmpty = function(a) {
  for (var b in a) {
    return !1;
  }
  return !0;
};
goog.object.clear = function(a) {
  for (var b in a) {
    delete a[b];
  }
};
goog.object.remove = function(a, b) {
  var c;
  (c = b in a) && delete a[b];
  return c;
};
goog.object.add = function(a, b, c) {
  if (null !== a && b in a) {
    throw Error('The object already contains the key "' + b + '"');
  }
  goog.object.set(a, b, c);
};
goog.object.get = function(a, b, c) {
  return null !== a && b in a ? a[b] : c;
};
goog.object.set = function(a, b, c) {
  a[b] = c;
};
goog.object.setIfUndefined = function(a, b, c) {
  return b in a ? a[b] : a[b] = c;
};
goog.object.setWithReturnValueIfNotSet = function(a, b, c) {
  if (b in a) {
    return a[b];
  }
  c = c();
  return a[b] = c;
};
goog.object.equals = function(a, b) {
  for (var c in a) {
    if (!(c in b) || a[c] !== b[c]) {
      return !1;
    }
  }
  for (c in b) {
    if (!(c in a)) {
      return !1;
    }
  }
  return !0;
};
goog.object.clone = function(a) {
  var b = {}, c;
  for (c in a) {
    b[c] = a[c];
  }
  return b;
};
goog.object.unsafeClone = function(a) {
  var b = goog.typeOf(a);
  if ("object" == b || "array" == b) {
    if (goog.isFunction(a.clone)) {
      return a.clone();
    }
    var b = "array" == b ? [] : {}, c;
    for (c in a) {
      b[c] = goog.object.unsafeClone(a[c]);
    }
    return b;
  }
  return a;
};
goog.object.transpose = function(a) {
  var b = {}, c;
  for (c in a) {
    b[a[c]] = c;
  }
  return b;
};
goog.object.PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
goog.object.extend = function(a, b) {
  for (var c, d, e = 1; e < arguments.length; e++) {
    d = arguments[e];
    for (c in d) {
      a[c] = d[c];
    }
    for (var f = 0; f < goog.object.PROTOTYPE_FIELDS_.length; f++) {
      c = goog.object.PROTOTYPE_FIELDS_[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c]);
    }
  }
};
goog.object.create = function(a) {
  var b = arguments.length;
  if (1 == b && goog.isArray(arguments[0])) {
    return goog.object.create.apply(null, arguments[0]);
  }
  if (b % 2) {
    throw Error("Uneven number of arguments");
  }
  for (var c = {}, d = 0; d < b; d += 2) {
    c[arguments[d]] = arguments[d + 1];
  }
  return c;
};
goog.object.createSet = function(a) {
  var b = arguments.length;
  if (1 == b && goog.isArray(arguments[0])) {
    return goog.object.createSet.apply(null, arguments[0]);
  }
  for (var c = {}, d = 0; d < b; d++) {
    c[arguments[d]] = !0;
  }
  return c;
};
goog.object.createImmutableView = function(a) {
  var b = a;
  Object.isFrozen && !Object.isFrozen(a) && (b = Object.create(a), Object.freeze(b));
  return b;
};
goog.object.isImmutableView = function(a) {
  return !!Object.isFrozen && Object.isFrozen(a);
};
goog.object.getAllPropertyNames = function(a, b, c) {
  if (!a) {
    return [];
  }
  if (!Object.getOwnPropertyNames || !Object.getPrototypeOf) {
    return goog.object.getKeys(a);
  }
  for (var d = {}; a && (a !== Object.prototype || b) && (a !== Function.prototype || c);) {
    for (var e = Object.getOwnPropertyNames(a), f = 0; f < e.length; f++) {
      d[e[f]] = !0;
    }
    a = Object.getPrototypeOf(a);
  }
  return goog.object.getKeys(d);
};
goog.labs.userAgent.browser = {};
goog.labs.userAgent.browser.matchOpera_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Opera");
};
goog.labs.userAgent.browser.matchIE_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Trident") || goog.labs.userAgent.util.matchUserAgent("MSIE");
};
goog.labs.userAgent.browser.matchEdge_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Edge");
};
goog.labs.userAgent.browser.matchFirefox_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Firefox");
};
goog.labs.userAgent.browser.matchSafari_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Safari") && !(goog.labs.userAgent.browser.matchChrome_() || goog.labs.userAgent.browser.matchCoast_() || goog.labs.userAgent.browser.matchOpera_() || goog.labs.userAgent.browser.matchEdge_() || goog.labs.userAgent.browser.isSilk() || goog.labs.userAgent.util.matchUserAgent("Android"));
};
goog.labs.userAgent.browser.matchCoast_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Coast");
};
goog.labs.userAgent.browser.matchIosWebview_ = function() {
  return (goog.labs.userAgent.util.matchUserAgent("iPad") || goog.labs.userAgent.util.matchUserAgent("iPhone")) && !goog.labs.userAgent.browser.matchSafari_() && !goog.labs.userAgent.browser.matchChrome_() && !goog.labs.userAgent.browser.matchCoast_() && goog.labs.userAgent.util.matchUserAgent("AppleWebKit");
};
goog.labs.userAgent.browser.matchChrome_ = function() {
  return (goog.labs.userAgent.util.matchUserAgent("Chrome") || goog.labs.userAgent.util.matchUserAgent("CriOS")) && !goog.labs.userAgent.browser.matchEdge_();
};
goog.labs.userAgent.browser.matchAndroidBrowser_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Android") && !(goog.labs.userAgent.browser.isChrome() || goog.labs.userAgent.browser.isFirefox() || goog.labs.userAgent.browser.isOpera() || goog.labs.userAgent.browser.isSilk());
};
goog.labs.userAgent.browser.isOpera = goog.labs.userAgent.browser.matchOpera_;
goog.labs.userAgent.browser.isIE = goog.labs.userAgent.browser.matchIE_;
goog.labs.userAgent.browser.isEdge = goog.labs.userAgent.browser.matchEdge_;
goog.labs.userAgent.browser.isFirefox = goog.labs.userAgent.browser.matchFirefox_;
goog.labs.userAgent.browser.isSafari = goog.labs.userAgent.browser.matchSafari_;
goog.labs.userAgent.browser.isCoast = goog.labs.userAgent.browser.matchCoast_;
goog.labs.userAgent.browser.isIosWebview = goog.labs.userAgent.browser.matchIosWebview_;
goog.labs.userAgent.browser.isChrome = goog.labs.userAgent.browser.matchChrome_;
goog.labs.userAgent.browser.isAndroidBrowser = goog.labs.userAgent.browser.matchAndroidBrowser_;
goog.labs.userAgent.browser.isSilk = function() {
  return goog.labs.userAgent.util.matchUserAgent("Silk");
};
goog.labs.userAgent.browser.getVersion = function() {
  function a(a) {
    a = goog.array.find(a, d);
    return c[a] || "";
  }
  var b = goog.labs.userAgent.util.getUserAgent();
  if (goog.labs.userAgent.browser.isIE()) {
    return goog.labs.userAgent.browser.getIEVersion_(b);
  }
  var b = goog.labs.userAgent.util.extractVersionTuples(b), c = {};
  goog.array.forEach(b, function(a) {
    c[a[0]] = a[1];
  });
  var d = goog.partial(goog.object.containsKey, c);
  return goog.labs.userAgent.browser.isOpera() ? a(["Version", "Opera"]) : goog.labs.userAgent.browser.isEdge() ? a(["Edge"]) : goog.labs.userAgent.browser.isChrome() ? a(["Chrome", "CriOS"]) : (b = b[2]) && b[1] || "";
};
goog.labs.userAgent.browser.isVersionOrHigher = function(a) {
  return 0 <= goog.string.compareVersions(goog.labs.userAgent.browser.getVersion(), a);
};
goog.labs.userAgent.browser.getIEVersion_ = function(a) {
  var b = /rv: *([\d\.]*)/.exec(a);
  if (b && b[1]) {
    return b[1];
  }
  var b = "", c = /MSIE +([\d\.]+)/.exec(a);
  if (c && c[1]) {
    if (a = /Trident\/(\d.\d)/.exec(a), "7.0" == c[1]) {
      if (a && a[1]) {
        switch(a[1]) {
          case "4.0":
            b = "8.0";
            break;
          case "5.0":
            b = "9.0";
            break;
          case "6.0":
            b = "10.0";
            break;
          case "7.0":
            b = "11.0";
        }
      } else {
        b = "7.0";
      }
    } else {
      b = c[1];
    }
  }
  return b;
};
goog.labs.userAgent.engine = {};
goog.labs.userAgent.engine.isPresto = function() {
  return goog.labs.userAgent.util.matchUserAgent("Presto");
};
goog.labs.userAgent.engine.isTrident = function() {
  return goog.labs.userAgent.util.matchUserAgent("Trident") || goog.labs.userAgent.util.matchUserAgent("MSIE");
};
goog.labs.userAgent.engine.isEdge = function() {
  return goog.labs.userAgent.util.matchUserAgent("Edge");
};
goog.labs.userAgent.engine.isWebKit = function() {
  return goog.labs.userAgent.util.matchUserAgentIgnoreCase("WebKit") && !goog.labs.userAgent.engine.isEdge();
};
goog.labs.userAgent.engine.isGecko = function() {
  return goog.labs.userAgent.util.matchUserAgent("Gecko") && !goog.labs.userAgent.engine.isWebKit() && !goog.labs.userAgent.engine.isTrident() && !goog.labs.userAgent.engine.isEdge();
};
goog.labs.userAgent.engine.getVersion = function() {
  var a = goog.labs.userAgent.util.getUserAgent();
  if (a) {
    var a = goog.labs.userAgent.util.extractVersionTuples(a), b = goog.labs.userAgent.engine.getEngineTuple_(a);
    if (b) {
      return "Gecko" == b[0] ? goog.labs.userAgent.engine.getVersionForKey_(a, "Firefox") : b[1];
    }
    var a = a[0], c;
    if (a && (c = a[2]) && (c = /Trident\/([^\s;]+)/.exec(c))) {
      return c[1];
    }
  }
  return "";
};
goog.labs.userAgent.engine.getEngineTuple_ = function(a) {
  if (!goog.labs.userAgent.engine.isEdge()) {
    return a[1];
  }
  for (var b = 0; b < a.length; b++) {
    var c = a[b];
    if ("Edge" == c[0]) {
      return c;
    }
  }
};
goog.labs.userAgent.engine.isVersionOrHigher = function(a) {
  return 0 <= goog.string.compareVersions(goog.labs.userAgent.engine.getVersion(), a);
};
goog.labs.userAgent.engine.getVersionForKey_ = function(a, b) {
  return (a = goog.array.find(a, function(a) {
    return b == a[0];
  })) && a[1] || "";
};
goog.labs.userAgent.platform = {};
goog.labs.userAgent.platform.isAndroid = function() {
  return goog.labs.userAgent.util.matchUserAgent("Android");
};
goog.labs.userAgent.platform.isIpod = function() {
  return goog.labs.userAgent.util.matchUserAgent("iPod");
};
goog.labs.userAgent.platform.isIphone = function() {
  return goog.labs.userAgent.util.matchUserAgent("iPhone") && !goog.labs.userAgent.util.matchUserAgent("iPod") && !goog.labs.userAgent.util.matchUserAgent("iPad");
};
goog.labs.userAgent.platform.isIpad = function() {
  return goog.labs.userAgent.util.matchUserAgent("iPad");
};
goog.labs.userAgent.platform.isIos = function() {
  return goog.labs.userAgent.platform.isIphone() || goog.labs.userAgent.platform.isIpad() || goog.labs.userAgent.platform.isIpod();
};
goog.labs.userAgent.platform.isMacintosh = function() {
  return goog.labs.userAgent.util.matchUserAgent("Macintosh");
};
goog.labs.userAgent.platform.isLinux = function() {
  return goog.labs.userAgent.util.matchUserAgent("Linux");
};
goog.labs.userAgent.platform.isWindows = function() {
  return goog.labs.userAgent.util.matchUserAgent("Windows");
};
goog.labs.userAgent.platform.isChromeOS = function() {
  return goog.labs.userAgent.util.matchUserAgent("CrOS");
};
goog.labs.userAgent.platform.getVersion = function() {
  var a = goog.labs.userAgent.util.getUserAgent();
  var b = "";
  goog.labs.userAgent.platform.isWindows() ? (b = /Windows (?:NT|Phone) ([0-9.]+)/, b = (a = b.exec(a)) ? a[1] : "0.0") : goog.labs.userAgent.platform.isIos() ? (b = /(?:iPhone|iPod|iPad|CPU)\s+OS\s+(\S+)/, b = (a = b.exec(a)) && a[1].replace(/_/g, ".")) : goog.labs.userAgent.platform.isMacintosh() ? (b = /Mac OS X ([0-9_.]+)/, b = (a = b.exec(a)) ? a[1].replace(/_/g, ".") : "10") : goog.labs.userAgent.platform.isAndroid() ? (b = /Android\s+([^\);]+)(\)|;)/, b = (a = b.exec(a)) && a[1]) : goog.labs.userAgent.platform.isChromeOS() &&
  (b = /(?:CrOS\s+(?:i686|x86_64)\s+([0-9.]+))/, b = (a = b.exec(a)) && a[1]);
  return b || "";
};
goog.labs.userAgent.platform.isVersionOrHigher = function(a) {
  return 0 <= goog.string.compareVersions(goog.labs.userAgent.platform.getVersion(), a);
};
goog.reflect = {};
goog.reflect.object = function(a, b) {
  return b;
};
goog.reflect.objectProperty = function(a, b) {
  return a;
};
goog.reflect.sinkValue = function(a) {
  goog.reflect.sinkValue[" "](a);
  return a;
};
goog.reflect.sinkValue[" "] = goog.nullFunction;
goog.reflect.canAccessProperty = function(a, b) {
  try {
    return goog.reflect.sinkValue(a[b]), !0;
  } catch (c) {
  }
  return !1;
};
goog.reflect.cache = function(a, b, c, d) {
  d = d ? d(b) : b;
  return Object.prototype.hasOwnProperty.call(a, d) ? a[d] : a[d] = c(b);
};
goog.userAgent = {};
goog.userAgent.ASSUME_IE = !1;
goog.userAgent.ASSUME_EDGE = !1;
goog.userAgent.ASSUME_GECKO = !1;
goog.userAgent.ASSUME_WEBKIT = !1;
goog.userAgent.ASSUME_MOBILE_WEBKIT = !1;
goog.userAgent.ASSUME_OPERA = !1;
goog.userAgent.ASSUME_ANY_VERSION = !1;
goog.userAgent.BROWSER_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_EDGE || goog.userAgent.ASSUME_GECKO || goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_OPERA;
goog.userAgent.getUserAgentString = function() {
  return goog.labs.userAgent.util.getUserAgent();
};
goog.userAgent.getNavigator = function() {
  return goog.global.navigator || null;
};
goog.userAgent.OPERA = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_OPERA : goog.labs.userAgent.browser.isOpera();
goog.userAgent.IE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_IE : goog.labs.userAgent.browser.isIE();
goog.userAgent.EDGE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_EDGE : goog.labs.userAgent.engine.isEdge();
goog.userAgent.EDGE_OR_IE = goog.userAgent.EDGE || goog.userAgent.IE;
goog.userAgent.GECKO = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_GECKO : goog.labs.userAgent.engine.isGecko();
goog.userAgent.WEBKIT = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_MOBILE_WEBKIT : goog.labs.userAgent.engine.isWebKit();
goog.userAgent.isMobile_ = function() {
  return goog.userAgent.WEBKIT && goog.labs.userAgent.util.matchUserAgent("Mobile");
};
goog.userAgent.MOBILE = goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.isMobile_();
goog.userAgent.SAFARI = goog.userAgent.WEBKIT;
goog.userAgent.determinePlatform_ = function() {
  var a = goog.userAgent.getNavigator();
  return a && a.platform || "";
};
goog.userAgent.PLATFORM = goog.userAgent.determinePlatform_();
goog.userAgent.ASSUME_MAC = !1;
goog.userAgent.ASSUME_WINDOWS = !1;
goog.userAgent.ASSUME_LINUX = !1;
goog.userAgent.ASSUME_X11 = !1;
goog.userAgent.ASSUME_ANDROID = !1;
goog.userAgent.ASSUME_IPHONE = !1;
goog.userAgent.ASSUME_IPAD = !1;
goog.userAgent.ASSUME_IPOD = !1;
goog.userAgent.PLATFORM_KNOWN_ = goog.userAgent.ASSUME_MAC || goog.userAgent.ASSUME_WINDOWS || goog.userAgent.ASSUME_LINUX || goog.userAgent.ASSUME_X11 || goog.userAgent.ASSUME_ANDROID || goog.userAgent.ASSUME_IPHONE || goog.userAgent.ASSUME_IPAD || goog.userAgent.ASSUME_IPOD;
goog.userAgent.MAC = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_MAC : goog.labs.userAgent.platform.isMacintosh();
goog.userAgent.WINDOWS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_WINDOWS : goog.labs.userAgent.platform.isWindows();
goog.userAgent.isLegacyLinux_ = function() {
  return goog.labs.userAgent.platform.isLinux() || goog.labs.userAgent.platform.isChromeOS();
};
goog.userAgent.LINUX = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_LINUX : goog.userAgent.isLegacyLinux_();
goog.userAgent.isX11_ = function() {
  var a = goog.userAgent.getNavigator();
  return !!a && goog.string.contains(a.appVersion || "", "X11");
};
goog.userAgent.X11 = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_X11 : goog.userAgent.isX11_();
goog.userAgent.ANDROID = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_ANDROID : goog.labs.userAgent.platform.isAndroid();
goog.userAgent.IPHONE = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPHONE : goog.labs.userAgent.platform.isIphone();
goog.userAgent.IPAD = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPAD : goog.labs.userAgent.platform.isIpad();
goog.userAgent.IPOD = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPOD : goog.labs.userAgent.platform.isIpod();
goog.userAgent.IOS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPHONE || goog.userAgent.ASSUME_IPAD || goog.userAgent.ASSUME_IPOD : goog.labs.userAgent.platform.isIos();
goog.userAgent.determineVersion_ = function() {
  var a = "", b = goog.userAgent.getVersionRegexResult_();
  b && (a = b ? b[1] : "");
  return goog.userAgent.IE && (b = goog.userAgent.getDocumentMode_(), null != b && b > parseFloat(a)) ? String(b) : a;
};
goog.userAgent.getVersionRegexResult_ = function() {
  var a = goog.userAgent.getUserAgentString();
  if (goog.userAgent.GECKO) {
    return /rv\:([^\);]+)(\)|;)/.exec(a);
  }
  if (goog.userAgent.EDGE) {
    return /Edge\/([\d\.]+)/.exec(a);
  }
  if (goog.userAgent.IE) {
    return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);
  }
  if (goog.userAgent.WEBKIT) {
    return /WebKit\/(\S+)/.exec(a);
  }
  if (goog.userAgent.OPERA) {
    return /(?:Version)[ \/]?(\S+)/.exec(a);
  }
};
goog.userAgent.getDocumentMode_ = function() {
  var a = goog.global.document;
  return a ? a.documentMode : void 0;
};
goog.userAgent.VERSION = goog.userAgent.determineVersion_();
goog.userAgent.compare = function(a, b) {
  return goog.string.compareVersions(a, b);
};
goog.userAgent.isVersionOrHigherCache_ = {};
goog.userAgent.isVersionOrHigher = function(a) {
  return goog.userAgent.ASSUME_ANY_VERSION || goog.reflect.cache(goog.userAgent.isVersionOrHigherCache_, a, function() {
    return 0 <= goog.string.compareVersions(goog.userAgent.VERSION, a);
  });
};
goog.userAgent.isVersion = goog.userAgent.isVersionOrHigher;
goog.userAgent.isDocumentModeOrHigher = function(a) {
  return Number(goog.userAgent.DOCUMENT_MODE) >= a;
};
goog.userAgent.isDocumentMode = goog.userAgent.isDocumentModeOrHigher;
goog.userAgent.DOCUMENT_MODE = function() {
  var a = goog.global.document, b = goog.userAgent.getDocumentMode_();
  if (a && goog.userAgent.IE) {
    return b || ("CSS1Compat" == a.compatMode ? parseInt(goog.userAgent.VERSION, 10) : 5);
  }
}();
goog.dom.BrowserFeature = {CAN_ADD_NAME_OR_TYPE_ATTRIBUTES:!goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9), CAN_USE_CHILDREN_ATTRIBUTE:!goog.userAgent.GECKO && !goog.userAgent.IE || goog.userAgent.IE && goog.userAgent.isDocumentModeOrHigher(9) || goog.userAgent.GECKO && goog.userAgent.isVersionOrHigher("1.9.1"), CAN_USE_INNER_TEXT:goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9"), CAN_USE_PARENT_ELEMENT_PROPERTY:goog.userAgent.IE || goog.userAgent.OPERA || goog.userAgent.WEBKIT,
INNER_HTML_NEEDS_SCOPED_ELEMENT:goog.userAgent.IE, LEGACY_IE_RANGES:goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9)};
goog.dom.HtmlElement = function() {
};
goog.dom.TagName = function(a) {
  this.tagName_ = a;
};
goog.dom.TagName.prototype.toString = function() {
  return this.tagName_;
};
goog.dom.TagName.A = new goog.dom.TagName("A");
goog.dom.TagName.ABBR = new goog.dom.TagName("ABBR");
goog.dom.TagName.ACRONYM = new goog.dom.TagName("ACRONYM");
goog.dom.TagName.ADDRESS = new goog.dom.TagName("ADDRESS");
goog.dom.TagName.APPLET = new goog.dom.TagName("APPLET");
goog.dom.TagName.AREA = new goog.dom.TagName("AREA");
goog.dom.TagName.ARTICLE = new goog.dom.TagName("ARTICLE");
goog.dom.TagName.ASIDE = new goog.dom.TagName("ASIDE");
goog.dom.TagName.AUDIO = new goog.dom.TagName("AUDIO");
goog.dom.TagName.B = new goog.dom.TagName("B");
goog.dom.TagName.BASE = new goog.dom.TagName("BASE");
goog.dom.TagName.BASEFONT = new goog.dom.TagName("BASEFONT");
goog.dom.TagName.BDI = new goog.dom.TagName("BDI");
goog.dom.TagName.BDO = new goog.dom.TagName("BDO");
goog.dom.TagName.BIG = new goog.dom.TagName("BIG");
goog.dom.TagName.BLOCKQUOTE = new goog.dom.TagName("BLOCKQUOTE");
goog.dom.TagName.BODY = new goog.dom.TagName("BODY");
goog.dom.TagName.BR = new goog.dom.TagName("BR");
goog.dom.TagName.BUTTON = new goog.dom.TagName("BUTTON");
goog.dom.TagName.CANVAS = new goog.dom.TagName("CANVAS");
goog.dom.TagName.CAPTION = new goog.dom.TagName("CAPTION");
goog.dom.TagName.CENTER = new goog.dom.TagName("CENTER");
goog.dom.TagName.CITE = new goog.dom.TagName("CITE");
goog.dom.TagName.CODE = new goog.dom.TagName("CODE");
goog.dom.TagName.COL = new goog.dom.TagName("COL");
goog.dom.TagName.COLGROUP = new goog.dom.TagName("COLGROUP");
goog.dom.TagName.COMMAND = new goog.dom.TagName("COMMAND");
goog.dom.TagName.DATA = new goog.dom.TagName("DATA");
goog.dom.TagName.DATALIST = new goog.dom.TagName("DATALIST");
goog.dom.TagName.DD = new goog.dom.TagName("DD");
goog.dom.TagName.DEL = new goog.dom.TagName("DEL");
goog.dom.TagName.DETAILS = new goog.dom.TagName("DETAILS");
goog.dom.TagName.DFN = new goog.dom.TagName("DFN");
goog.dom.TagName.DIALOG = new goog.dom.TagName("DIALOG");
goog.dom.TagName.DIR = new goog.dom.TagName("DIR");
goog.dom.TagName.DIV = new goog.dom.TagName("DIV");
goog.dom.TagName.DL = new goog.dom.TagName("DL");
goog.dom.TagName.DT = new goog.dom.TagName("DT");
goog.dom.TagName.EM = new goog.dom.TagName("EM");
goog.dom.TagName.EMBED = new goog.dom.TagName("EMBED");
goog.dom.TagName.FIELDSET = new goog.dom.TagName("FIELDSET");
goog.dom.TagName.FIGCAPTION = new goog.dom.TagName("FIGCAPTION");
goog.dom.TagName.FIGURE = new goog.dom.TagName("FIGURE");
goog.dom.TagName.FONT = new goog.dom.TagName("FONT");
goog.dom.TagName.FOOTER = new goog.dom.TagName("FOOTER");
goog.dom.TagName.FORM = new goog.dom.TagName("FORM");
goog.dom.TagName.FRAME = new goog.dom.TagName("FRAME");
goog.dom.TagName.FRAMESET = new goog.dom.TagName("FRAMESET");
goog.dom.TagName.H1 = new goog.dom.TagName("H1");
goog.dom.TagName.H2 = new goog.dom.TagName("H2");
goog.dom.TagName.H3 = new goog.dom.TagName("H3");
goog.dom.TagName.H4 = new goog.dom.TagName("H4");
goog.dom.TagName.H5 = new goog.dom.TagName("H5");
goog.dom.TagName.H6 = new goog.dom.TagName("H6");
goog.dom.TagName.HEAD = new goog.dom.TagName("HEAD");
goog.dom.TagName.HEADER = new goog.dom.TagName("HEADER");
goog.dom.TagName.HGROUP = new goog.dom.TagName("HGROUP");
goog.dom.TagName.HR = new goog.dom.TagName("HR");
goog.dom.TagName.HTML = new goog.dom.TagName("HTML");
goog.dom.TagName.I = new goog.dom.TagName("I");
goog.dom.TagName.IFRAME = new goog.dom.TagName("IFRAME");
goog.dom.TagName.IMG = new goog.dom.TagName("IMG");
goog.dom.TagName.INPUT = new goog.dom.TagName("INPUT");
goog.dom.TagName.INS = new goog.dom.TagName("INS");
goog.dom.TagName.ISINDEX = new goog.dom.TagName("ISINDEX");
goog.dom.TagName.KBD = new goog.dom.TagName("KBD");
goog.dom.TagName.KEYGEN = new goog.dom.TagName("KEYGEN");
goog.dom.TagName.LABEL = new goog.dom.TagName("LABEL");
goog.dom.TagName.LEGEND = new goog.dom.TagName("LEGEND");
goog.dom.TagName.LI = new goog.dom.TagName("LI");
goog.dom.TagName.LINK = new goog.dom.TagName("LINK");
goog.dom.TagName.MAP = new goog.dom.TagName("MAP");
goog.dom.TagName.MARK = new goog.dom.TagName("MARK");
goog.dom.TagName.MATH = new goog.dom.TagName("MATH");
goog.dom.TagName.MENU = new goog.dom.TagName("MENU");
goog.dom.TagName.META = new goog.dom.TagName("META");
goog.dom.TagName.METER = new goog.dom.TagName("METER");
goog.dom.TagName.NAV = new goog.dom.TagName("NAV");
goog.dom.TagName.NOFRAMES = new goog.dom.TagName("NOFRAMES");
goog.dom.TagName.NOSCRIPT = new goog.dom.TagName("NOSCRIPT");
goog.dom.TagName.OBJECT = new goog.dom.TagName("OBJECT");
goog.dom.TagName.OL = new goog.dom.TagName("OL");
goog.dom.TagName.OPTGROUP = new goog.dom.TagName("OPTGROUP");
goog.dom.TagName.OPTION = new goog.dom.TagName("OPTION");
goog.dom.TagName.OUTPUT = new goog.dom.TagName("OUTPUT");
goog.dom.TagName.P = new goog.dom.TagName("P");
goog.dom.TagName.PARAM = new goog.dom.TagName("PARAM");
goog.dom.TagName.PRE = new goog.dom.TagName("PRE");
goog.dom.TagName.PROGRESS = new goog.dom.TagName("PROGRESS");
goog.dom.TagName.Q = new goog.dom.TagName("Q");
goog.dom.TagName.RP = new goog.dom.TagName("RP");
goog.dom.TagName.RT = new goog.dom.TagName("RT");
goog.dom.TagName.RUBY = new goog.dom.TagName("RUBY");
goog.dom.TagName.S = new goog.dom.TagName("S");
goog.dom.TagName.SAMP = new goog.dom.TagName("SAMP");
goog.dom.TagName.SCRIPT = new goog.dom.TagName("SCRIPT");
goog.dom.TagName.SECTION = new goog.dom.TagName("SECTION");
goog.dom.TagName.SELECT = new goog.dom.TagName("SELECT");
goog.dom.TagName.SMALL = new goog.dom.TagName("SMALL");
goog.dom.TagName.SOURCE = new goog.dom.TagName("SOURCE");
goog.dom.TagName.SPAN = new goog.dom.TagName("SPAN");
goog.dom.TagName.STRIKE = new goog.dom.TagName("STRIKE");
goog.dom.TagName.STRONG = new goog.dom.TagName("STRONG");
goog.dom.TagName.STYLE = new goog.dom.TagName("STYLE");
goog.dom.TagName.SUB = new goog.dom.TagName("SUB");
goog.dom.TagName.SUMMARY = new goog.dom.TagName("SUMMARY");
goog.dom.TagName.SUP = new goog.dom.TagName("SUP");
goog.dom.TagName.SVG = new goog.dom.TagName("SVG");
goog.dom.TagName.TABLE = new goog.dom.TagName("TABLE");
goog.dom.TagName.TBODY = new goog.dom.TagName("TBODY");
goog.dom.TagName.TD = new goog.dom.TagName("TD");
goog.dom.TagName.TEMPLATE = new goog.dom.TagName("TEMPLATE");
goog.dom.TagName.TEXTAREA = new goog.dom.TagName("TEXTAREA");
goog.dom.TagName.TFOOT = new goog.dom.TagName("TFOOT");
goog.dom.TagName.TH = new goog.dom.TagName("TH");
goog.dom.TagName.THEAD = new goog.dom.TagName("THEAD");
goog.dom.TagName.TIME = new goog.dom.TagName("TIME");
goog.dom.TagName.TITLE = new goog.dom.TagName("TITLE");
goog.dom.TagName.TR = new goog.dom.TagName("TR");
goog.dom.TagName.TRACK = new goog.dom.TagName("TRACK");
goog.dom.TagName.TT = new goog.dom.TagName("TT");
goog.dom.TagName.U = new goog.dom.TagName("U");
goog.dom.TagName.UL = new goog.dom.TagName("UL");
goog.dom.TagName.VAR = new goog.dom.TagName("VAR");
goog.dom.TagName.VIDEO = new goog.dom.TagName("VIDEO");
goog.dom.TagName.WBR = new goog.dom.TagName("WBR");
goog.dom.tags = {};
goog.dom.tags.VOID_TAGS_ = {area:!0, base:!0, br:!0, col:!0, command:!0, embed:!0, hr:!0, img:!0, input:!0, keygen:!0, link:!0, meta:!0, param:!0, source:!0, track:!0, wbr:!0};
goog.dom.tags.isVoidTag = function(a) {
  return !0 === goog.dom.tags.VOID_TAGS_[a];
};
goog.string.TypedString = function() {
};
goog.string.Const = function() {
  this.stringConstValueWithSecurityContract__googStringSecurityPrivate_ = "";
  this.STRING_CONST_TYPE_MARKER__GOOG_STRING_SECURITY_PRIVATE_ = goog.string.Const.TYPE_MARKER_;
};
goog.string.Const.prototype.implementsGoogStringTypedString = !0;
goog.string.Const.prototype.getTypedStringValue = function() {
  return this.stringConstValueWithSecurityContract__googStringSecurityPrivate_;
};
goog.string.Const.prototype.toString = function() {
  return "Const{" + this.stringConstValueWithSecurityContract__googStringSecurityPrivate_ + "}";
};
goog.string.Const.unwrap = function(a) {
  if (a instanceof goog.string.Const && a.constructor === goog.string.Const && a.STRING_CONST_TYPE_MARKER__GOOG_STRING_SECURITY_PRIVATE_ === goog.string.Const.TYPE_MARKER_) {
    return a.stringConstValueWithSecurityContract__googStringSecurityPrivate_;
  }
  goog.asserts.fail("expected object of type Const, got '" + a + "'");
  return "type_error:Const";
};
goog.string.Const.from = function(a) {
  return goog.string.Const.create__googStringSecurityPrivate_(a);
};
goog.string.Const.TYPE_MARKER_ = {};
goog.string.Const.create__googStringSecurityPrivate_ = function(a) {
  var b = new goog.string.Const;
  b.stringConstValueWithSecurityContract__googStringSecurityPrivate_ = a;
  return b;
};
goog.string.Const.EMPTY = goog.string.Const.from("");
goog.html = {};
goog.html.SafeScript = function() {
  this.privateDoNotAccessOrElseSafeScriptWrappedValue_ = "";
  this.SAFE_SCRIPT_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.SafeScript.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
};
goog.html.SafeScript.prototype.implementsGoogStringTypedString = !0;
goog.html.SafeScript.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
goog.html.SafeScript.fromConstant = function(a) {
  a = goog.string.Const.unwrap(a);
  return 0 === a.length ? goog.html.SafeScript.EMPTY : goog.html.SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse(a);
};
goog.html.SafeScript.prototype.getTypedStringValue = function() {
  return this.privateDoNotAccessOrElseSafeScriptWrappedValue_;
};
goog.DEBUG && (goog.html.SafeScript.prototype.toString = function() {
  return "SafeScript{" + this.privateDoNotAccessOrElseSafeScriptWrappedValue_ + "}";
});
goog.html.SafeScript.unwrap = function(a) {
  if (a instanceof goog.html.SafeScript && a.constructor === goog.html.SafeScript && a.SAFE_SCRIPT_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.SafeScript.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) {
    return a.privateDoNotAccessOrElseSafeScriptWrappedValue_;
  }
  goog.asserts.fail("expected object of type SafeScript, got '" + a + "' of type " + goog.typeOf(a));
  return "type_error:SafeScript";
};
goog.html.SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse = function(a) {
  return (new goog.html.SafeScript).initSecurityPrivateDoNotAccessOrElse_(a);
};
goog.html.SafeScript.prototype.initSecurityPrivateDoNotAccessOrElse_ = function(a) {
  this.privateDoNotAccessOrElseSafeScriptWrappedValue_ = a;
  return this;
};
goog.html.SafeScript.EMPTY = goog.html.SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse("");
goog.html.SafeStyle = function() {
  this.privateDoNotAccessOrElseSafeStyleWrappedValue_ = "";
  this.SAFE_STYLE_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.SafeStyle.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
};
goog.html.SafeStyle.prototype.implementsGoogStringTypedString = !0;
goog.html.SafeStyle.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
goog.html.SafeStyle.fromConstant = function(a) {
  a = goog.string.Const.unwrap(a);
  if (0 === a.length) {
    return goog.html.SafeStyle.EMPTY;
  }
  goog.html.SafeStyle.checkStyle_(a);
  goog.asserts.assert(goog.string.endsWith(a, ";"), "Last character of style string is not ';': " + a);
  goog.asserts.assert(goog.string.contains(a, ":"), "Style string must contain at least one ':', to specify a \"name: value\" pair: " + a);
  return goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(a);
};
goog.html.SafeStyle.checkStyle_ = function(a) {
  goog.asserts.assert(!/[<>]/.test(a), "Forbidden characters in style string: " + a);
};
goog.html.SafeStyle.prototype.getTypedStringValue = function() {
  return this.privateDoNotAccessOrElseSafeStyleWrappedValue_;
};
goog.DEBUG && (goog.html.SafeStyle.prototype.toString = function() {
  return "SafeStyle{" + this.privateDoNotAccessOrElseSafeStyleWrappedValue_ + "}";
});
goog.html.SafeStyle.unwrap = function(a) {
  if (a instanceof goog.html.SafeStyle && a.constructor === goog.html.SafeStyle && a.SAFE_STYLE_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.SafeStyle.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) {
    return a.privateDoNotAccessOrElseSafeStyleWrappedValue_;
  }
  goog.asserts.fail("expected object of type SafeStyle, got '" + a + "' of type " + goog.typeOf(a));
  return "type_error:SafeStyle";
};
goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse = function(a) {
  return (new goog.html.SafeStyle).initSecurityPrivateDoNotAccessOrElse_(a);
};
goog.html.SafeStyle.prototype.initSecurityPrivateDoNotAccessOrElse_ = function(a) {
  this.privateDoNotAccessOrElseSafeStyleWrappedValue_ = a;
  return this;
};
goog.html.SafeStyle.EMPTY = goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse("");
goog.html.SafeStyle.INNOCUOUS_STRING = "zClosurez";
goog.html.SafeStyle.create = function(a) {
  var b = "", c;
  for (c in a) {
    if (!/^[-_a-zA-Z0-9]+$/.test(c)) {
      throw Error("Name allows only [-_a-zA-Z0-9], got: " + c);
    }
    var d = a[c];
    null != d && (d instanceof goog.string.Const ? (d = goog.string.Const.unwrap(d), goog.asserts.assert(!/[{;}]/.test(d), "Value does not allow [{;}].")) : goog.html.SafeStyle.VALUE_RE_.test(d) ? goog.html.SafeStyle.hasBalancedQuotes_(d) || (goog.asserts.fail("String value requires balanced quotes, got: " + d), d = goog.html.SafeStyle.INNOCUOUS_STRING) : (goog.asserts.fail("String value allows only [-,.\"'%_!# a-zA-Z0-9], rgb() and rgba(), got: " + d), d = goog.html.SafeStyle.INNOCUOUS_STRING),
    b += c + ":" + d + ";");
  }
  if (!b) {
    return goog.html.SafeStyle.EMPTY;
  }
  goog.html.SafeStyle.checkStyle_(b);
  return goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(b);
};
goog.html.SafeStyle.hasBalancedQuotes_ = function(a) {
  for (var b = !0, c = !0, d = 0; d < a.length; d++) {
    var e = a.charAt(d);
    "'" == e && c ? b = !b : '"' == e && b && (c = !c);
  }
  return b && c;
};
goog.html.SafeStyle.VALUE_RE_ = /^([-,."'%_!# a-zA-Z0-9]+|(?:rgb|hsl)a?\([0-9.%, ]+\))$/;
goog.html.SafeStyle.concat = function(a) {
  var b = "", c = function(a) {
    goog.isArray(a) ? goog.array.forEach(a, c) : b += goog.html.SafeStyle.unwrap(a);
  };
  goog.array.forEach(arguments, c);
  return b ? goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(b) : goog.html.SafeStyle.EMPTY;
};
goog.html.SafeStyleSheet = function() {
  this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_ = "";
  this.SAFE_STYLE_SHEET_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.SafeStyleSheet.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
};
goog.html.SafeStyleSheet.prototype.implementsGoogStringTypedString = !0;
goog.html.SafeStyleSheet.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
goog.html.SafeStyleSheet.concat = function(a) {
  var b = "", c = function(a) {
    goog.isArray(a) ? goog.array.forEach(a, c) : b += goog.html.SafeStyleSheet.unwrap(a);
  };
  goog.array.forEach(arguments, c);
  return goog.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse(b);
};
goog.html.SafeStyleSheet.fromConstant = function(a) {
  a = goog.string.Const.unwrap(a);
  if (0 === a.length) {
    return goog.html.SafeStyleSheet.EMPTY;
  }
  goog.asserts.assert(!goog.string.contains(a, "<"), "Forbidden '<' character in style sheet string: " + a);
  return goog.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse(a);
};
goog.html.SafeStyleSheet.prototype.getTypedStringValue = function() {
  return this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_;
};
goog.DEBUG && (goog.html.SafeStyleSheet.prototype.toString = function() {
  return "SafeStyleSheet{" + this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_ + "}";
});
goog.html.SafeStyleSheet.unwrap = function(a) {
  if (a instanceof goog.html.SafeStyleSheet && a.constructor === goog.html.SafeStyleSheet && a.SAFE_STYLE_SHEET_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.SafeStyleSheet.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) {
    return a.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_;
  }
  goog.asserts.fail("expected object of type SafeStyleSheet, got '" + a + "' of type " + goog.typeOf(a));
  return "type_error:SafeStyleSheet";
};
goog.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse = function(a) {
  return (new goog.html.SafeStyleSheet).initSecurityPrivateDoNotAccessOrElse_(a);
};
goog.html.SafeStyleSheet.prototype.initSecurityPrivateDoNotAccessOrElse_ = function(a) {
  this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_ = a;
  return this;
};
goog.html.SafeStyleSheet.EMPTY = goog.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse("");
goog.fs = {};
goog.fs.url = {};
goog.fs.url.createObjectUrl = function(a) {
  return goog.fs.url.getUrlObject_().createObjectURL(a);
};
goog.fs.url.revokeObjectUrl = function(a) {
  goog.fs.url.getUrlObject_().revokeObjectURL(a);
};
goog.fs.url.getUrlObject_ = function() {
  var a = goog.fs.url.findUrlObject_();
  if (null != a) {
    return a;
  }
  throw Error("This browser doesn't seem to support blob URLs");
};
goog.fs.url.findUrlObject_ = function() {
  return goog.isDef(goog.global.URL) && goog.isDef(goog.global.URL.createObjectURL) ? goog.global.URL : goog.isDef(goog.global.webkitURL) && goog.isDef(goog.global.webkitURL.createObjectURL) ? goog.global.webkitURL : goog.isDef(goog.global.createObjectURL) ? goog.global : null;
};
goog.fs.url.browserSupportsObjectUrls = function() {
  return null != goog.fs.url.findUrlObject_();
};
goog.i18n = {};
goog.i18n.bidi = {};
goog.i18n.bidi.FORCE_RTL = !1;
goog.i18n.bidi.IS_RTL = goog.i18n.bidi.FORCE_RTL || ("ar" == goog.LOCALE.substring(0, 2).toLowerCase() || "fa" == goog.LOCALE.substring(0, 2).toLowerCase() || "he" == goog.LOCALE.substring(0, 2).toLowerCase() || "iw" == goog.LOCALE.substring(0, 2).toLowerCase() || "ps" == goog.LOCALE.substring(0, 2).toLowerCase() || "sd" == goog.LOCALE.substring(0, 2).toLowerCase() || "ug" == goog.LOCALE.substring(0, 2).toLowerCase() || "ur" == goog.LOCALE.substring(0, 2).toLowerCase() || "yi" == goog.LOCALE.substring(0,
2).toLowerCase()) && (2 == goog.LOCALE.length || "-" == goog.LOCALE.substring(2, 3) || "_" == goog.LOCALE.substring(2, 3)) || 3 <= goog.LOCALE.length && "ckb" == goog.LOCALE.substring(0, 3).toLowerCase() && (3 == goog.LOCALE.length || "-" == goog.LOCALE.substring(3, 4) || "_" == goog.LOCALE.substring(3, 4));
goog.i18n.bidi.Format = {LRE:"\u202a", RLE:"\u202b", PDF:"\u202c", LRM:"\u200e", RLM:"\u200f"};
goog.i18n.bidi.Dir = {LTR:1, RTL:-1, NEUTRAL:0};
goog.i18n.bidi.RIGHT = "right";
goog.i18n.bidi.LEFT = "left";
goog.i18n.bidi.I18N_RIGHT = goog.i18n.bidi.IS_RTL ? goog.i18n.bidi.LEFT : goog.i18n.bidi.RIGHT;
goog.i18n.bidi.I18N_LEFT = goog.i18n.bidi.IS_RTL ? goog.i18n.bidi.RIGHT : goog.i18n.bidi.LEFT;
goog.i18n.bidi.toDir = function(a, b) {
  return "number" == typeof a ? 0 < a ? goog.i18n.bidi.Dir.LTR : 0 > a ? goog.i18n.bidi.Dir.RTL : b ? null : goog.i18n.bidi.Dir.NEUTRAL : null == a ? null : a ? goog.i18n.bidi.Dir.RTL : goog.i18n.bidi.Dir.LTR;
};
goog.i18n.bidi.ltrChars_ = "A-Za-z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02b8\u0300-\u0590\u0800-\u1fff\u200e\u2c00-\ufb1c\ufe00-\ufe6f\ufefd-\uffff";
goog.i18n.bidi.rtlChars_ = "\u0591-\u06ef\u06fa-\u07ff\u200f\ufb1d-\ufdff\ufe70-\ufefc";
goog.i18n.bidi.htmlSkipReg_ = /<[^>]*>|&[^;]+;/g;
goog.i18n.bidi.stripHtmlIfNeeded_ = function(a, b) {
  return b ? a.replace(goog.i18n.bidi.htmlSkipReg_, "") : a;
};
goog.i18n.bidi.rtlCharReg_ = new RegExp("[" + goog.i18n.bidi.rtlChars_ + "]");
goog.i18n.bidi.ltrCharReg_ = new RegExp("[" + goog.i18n.bidi.ltrChars_ + "]");
goog.i18n.bidi.hasAnyRtl = function(a, b) {
  return goog.i18n.bidi.rtlCharReg_.test(goog.i18n.bidi.stripHtmlIfNeeded_(a, b));
};
goog.i18n.bidi.hasRtlChar = goog.i18n.bidi.hasAnyRtl;
goog.i18n.bidi.hasAnyLtr = function(a, b) {
  return goog.i18n.bidi.ltrCharReg_.test(goog.i18n.bidi.stripHtmlIfNeeded_(a, b));
};
goog.i18n.bidi.ltrRe_ = new RegExp("^[" + goog.i18n.bidi.ltrChars_ + "]");
goog.i18n.bidi.rtlRe_ = new RegExp("^[" + goog.i18n.bidi.rtlChars_ + "]");
goog.i18n.bidi.isRtlChar = function(a) {
  return goog.i18n.bidi.rtlRe_.test(a);
};
goog.i18n.bidi.isLtrChar = function(a) {
  return goog.i18n.bidi.ltrRe_.test(a);
};
goog.i18n.bidi.isNeutralChar = function(a) {
  return !goog.i18n.bidi.isLtrChar(a) && !goog.i18n.bidi.isRtlChar(a);
};
goog.i18n.bidi.ltrDirCheckRe_ = new RegExp("^[^" + goog.i18n.bidi.rtlChars_ + "]*[" + goog.i18n.bidi.ltrChars_ + "]");
goog.i18n.bidi.rtlDirCheckRe_ = new RegExp("^[^" + goog.i18n.bidi.ltrChars_ + "]*[" + goog.i18n.bidi.rtlChars_ + "]");
goog.i18n.bidi.startsWithRtl = function(a, b) {
  return goog.i18n.bidi.rtlDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(a, b));
};
goog.i18n.bidi.isRtlText = goog.i18n.bidi.startsWithRtl;
goog.i18n.bidi.startsWithLtr = function(a, b) {
  return goog.i18n.bidi.ltrDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(a, b));
};
goog.i18n.bidi.isLtrText = goog.i18n.bidi.startsWithLtr;
goog.i18n.bidi.isRequiredLtrRe_ = /^http:\/\/.*/;
goog.i18n.bidi.isNeutralText = function(a, b) {
  a = goog.i18n.bidi.stripHtmlIfNeeded_(a, b);
  return goog.i18n.bidi.isRequiredLtrRe_.test(a) || !goog.i18n.bidi.hasAnyLtr(a) && !goog.i18n.bidi.hasAnyRtl(a);
};
goog.i18n.bidi.ltrExitDirCheckRe_ = new RegExp("[" + goog.i18n.bidi.ltrChars_ + "][^" + goog.i18n.bidi.rtlChars_ + "]*$");
goog.i18n.bidi.rtlExitDirCheckRe_ = new RegExp("[" + goog.i18n.bidi.rtlChars_ + "][^" + goog.i18n.bidi.ltrChars_ + "]*$");
goog.i18n.bidi.endsWithLtr = function(a, b) {
  return goog.i18n.bidi.ltrExitDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(a, b));
};
goog.i18n.bidi.isLtrExitText = goog.i18n.bidi.endsWithLtr;
goog.i18n.bidi.endsWithRtl = function(a, b) {
  return goog.i18n.bidi.rtlExitDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(a, b));
};
goog.i18n.bidi.isRtlExitText = goog.i18n.bidi.endsWithRtl;
goog.i18n.bidi.rtlLocalesRe_ = /^(ar|ckb|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|.*[-_](Arab|Hebr|Thaa|Nkoo|Tfng))(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)/i;
goog.i18n.bidi.isRtlLanguage = function(a) {
  return goog.i18n.bidi.rtlLocalesRe_.test(a);
};
goog.i18n.bidi.bracketGuardTextRe_ = /(\(.*?\)+)|(\[.*?\]+)|(\{.*?\}+)|(<.*?>+)/g;
goog.i18n.bidi.guardBracketInText = function(a, b) {
  b = (void 0 === b ? goog.i18n.bidi.hasAnyRtl(a) : b) ? goog.i18n.bidi.Format.RLM : goog.i18n.bidi.Format.LRM;
  return a.replace(goog.i18n.bidi.bracketGuardTextRe_, b + "$&" + b);
};
goog.i18n.bidi.enforceRtlInHtml = function(a) {
  return "<" == a.charAt(0) ? a.replace(/<\w+/, "$& dir=rtl") : "\n<span dir=rtl>" + a + "</span>";
};
goog.i18n.bidi.enforceRtlInText = function(a) {
  return goog.i18n.bidi.Format.RLE + a + goog.i18n.bidi.Format.PDF;
};
goog.i18n.bidi.enforceLtrInHtml = function(a) {
  return "<" == a.charAt(0) ? a.replace(/<\w+/, "$& dir=ltr") : "\n<span dir=ltr>" + a + "</span>";
};
goog.i18n.bidi.enforceLtrInText = function(a) {
  return goog.i18n.bidi.Format.LRE + a + goog.i18n.bidi.Format.PDF;
};
goog.i18n.bidi.dimensionsRe_ = /:\s*([.\d][.\w]*)\s+([.\d][.\w]*)\s+([.\d][.\w]*)\s+([.\d][.\w]*)/g;
goog.i18n.bidi.leftRe_ = /left/gi;
goog.i18n.bidi.rightRe_ = /right/gi;
goog.i18n.bidi.tempRe_ = /%%%%/g;
goog.i18n.bidi.mirrorCSS = function(a) {
  return a.replace(goog.i18n.bidi.dimensionsRe_, ":$1 $4 $3 $2").replace(goog.i18n.bidi.leftRe_, "%%%%").replace(goog.i18n.bidi.rightRe_, goog.i18n.bidi.LEFT).replace(goog.i18n.bidi.tempRe_, goog.i18n.bidi.RIGHT);
};
goog.i18n.bidi.doubleQuoteSubstituteRe_ = /([\u0591-\u05f2])"/g;
goog.i18n.bidi.singleQuoteSubstituteRe_ = /([\u0591-\u05f2])'/g;
goog.i18n.bidi.normalizeHebrewQuote = function(a) {
  return a.replace(goog.i18n.bidi.doubleQuoteSubstituteRe_, "$1\u05f4").replace(goog.i18n.bidi.singleQuoteSubstituteRe_, "$1\u05f3");
};
goog.i18n.bidi.wordSeparatorRe_ = /\s+/;
goog.i18n.bidi.hasNumeralsRe_ = /[\d\u06f0-\u06f9]/;
goog.i18n.bidi.rtlDetectionThreshold_ = 0.40;
goog.i18n.bidi.estimateDirection = function(a, b) {
  var c = 0, d = 0, e = !1;
  a = goog.i18n.bidi.stripHtmlIfNeeded_(a, b).split(goog.i18n.bidi.wordSeparatorRe_);
  for (b = 0; b < a.length; b++) {
    var f = a[b];
    goog.i18n.bidi.startsWithRtl(f) ? (c++, d++) : goog.i18n.bidi.isRequiredLtrRe_.test(f) ? e = !0 : goog.i18n.bidi.hasAnyLtr(f) ? d++ : goog.i18n.bidi.hasNumeralsRe_.test(f) && (e = !0);
  }
  return 0 == d ? e ? goog.i18n.bidi.Dir.LTR : goog.i18n.bidi.Dir.NEUTRAL : c / d > goog.i18n.bidi.rtlDetectionThreshold_ ? goog.i18n.bidi.Dir.RTL : goog.i18n.bidi.Dir.LTR;
};
goog.i18n.bidi.detectRtlDirectionality = function(a, b) {
  return goog.i18n.bidi.estimateDirection(a, b) == goog.i18n.bidi.Dir.RTL;
};
goog.i18n.bidi.setElementDirAndAlign = function(a, b) {
  a && (b = goog.i18n.bidi.toDir(b)) && (a.style.textAlign = b == goog.i18n.bidi.Dir.RTL ? goog.i18n.bidi.RIGHT : goog.i18n.bidi.LEFT, a.dir = b == goog.i18n.bidi.Dir.RTL ? "rtl" : "ltr");
};
goog.i18n.bidi.setElementDirByTextDirectionality = function(a, b) {
  switch(goog.i18n.bidi.estimateDirection(b)) {
    case goog.i18n.bidi.Dir.LTR:
      a.dir = "ltr";
      break;
    case goog.i18n.bidi.Dir.RTL:
      a.dir = "rtl";
      break;
    default:
      a.removeAttribute("dir");
  }
};
goog.i18n.bidi.DirectionalString = function() {
};
goog.html.TrustedResourceUrl = function() {
  this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_ = "";
  this.TRUSTED_RESOURCE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.TrustedResourceUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
};
goog.html.TrustedResourceUrl.prototype.implementsGoogStringTypedString = !0;
goog.html.TrustedResourceUrl.prototype.getTypedStringValue = function() {
  return this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_;
};
goog.html.TrustedResourceUrl.prototype.implementsGoogI18nBidiDirectionalString = !0;
goog.html.TrustedResourceUrl.prototype.getDirection = function() {
  return goog.i18n.bidi.Dir.LTR;
};
goog.DEBUG && (goog.html.TrustedResourceUrl.prototype.toString = function() {
  return "TrustedResourceUrl{" + this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_ + "}";
});
goog.html.TrustedResourceUrl.unwrap = function(a) {
  if (a instanceof goog.html.TrustedResourceUrl && a.constructor === goog.html.TrustedResourceUrl && a.TRUSTED_RESOURCE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.TrustedResourceUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) {
    return a.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_;
  }
  goog.asserts.fail("expected object of type TrustedResourceUrl, got '" + a + "' of type " + goog.typeOf(a));
  return "type_error:TrustedResourceUrl";
};
goog.html.TrustedResourceUrl.format = function(a, b) {
  var c = goog.string.Const.unwrap(a);
  if (!goog.html.TrustedResourceUrl.BASE_URL_.test(c)) {
    throw Error("Invalid TrustedResourceUrl format: " + c);
  }
  a = c.replace(goog.html.TrustedResourceUrl.FORMAT_MARKER_, function(a, e) {
    if (!Object.prototype.hasOwnProperty.call(b, e)) {
      throw Error('Found marker, "' + e + '", in format string, "' + c + '", but no valid label mapping found in args: ' + JSON.stringify(b));
    }
    a = b[e];
    return a instanceof goog.string.Const ? goog.string.Const.unwrap(a) : encodeURIComponent(String(a));
  });
  return goog.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(a);
};
goog.html.TrustedResourceUrl.FORMAT_MARKER_ = /%{(\w+)}/g;
goog.html.TrustedResourceUrl.BASE_URL_ = /^(?:https:)?\/\/[0-9a-z.:[\]-]+\/|^\/[^\/\\]|^about:blank(#|$)/i;
goog.html.TrustedResourceUrl.fromConstant = function(a) {
  return goog.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(goog.string.Const.unwrap(a));
};
goog.html.TrustedResourceUrl.fromConstants = function(a) {
  for (var b = "", c = 0; c < a.length; c++) {
    b += goog.string.Const.unwrap(a[c]);
  }
  return goog.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(b);
};
goog.html.TrustedResourceUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
goog.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse = function(a) {
  var b = new goog.html.TrustedResourceUrl;
  b.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_ = a;
  return b;
};
goog.html.SafeUrl = function() {
  this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = "";
  this.SAFE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.SafeUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
};
goog.html.SafeUrl.INNOCUOUS_STRING = "about:invalid#zClosurez";
goog.html.SafeUrl.prototype.implementsGoogStringTypedString = !0;
goog.html.SafeUrl.prototype.getTypedStringValue = function() {
  return this.privateDoNotAccessOrElseSafeHtmlWrappedValue_;
};
goog.html.SafeUrl.prototype.implementsGoogI18nBidiDirectionalString = !0;
goog.html.SafeUrl.prototype.getDirection = function() {
  return goog.i18n.bidi.Dir.LTR;
};
goog.DEBUG && (goog.html.SafeUrl.prototype.toString = function() {
  return "SafeUrl{" + this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ + "}";
});
goog.html.SafeUrl.unwrap = function(a) {
  if (a instanceof goog.html.SafeUrl && a.constructor === goog.html.SafeUrl && a.SAFE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.SafeUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) {
    return a.privateDoNotAccessOrElseSafeHtmlWrappedValue_;
  }
  goog.asserts.fail("expected object of type SafeUrl, got '" + a + "' of type " + goog.typeOf(a));
  return "type_error:SafeUrl";
};
goog.html.SafeUrl.fromConstant = function(a) {
  return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(goog.string.Const.unwrap(a));
};
goog.html.SAFE_MIME_TYPE_PATTERN_ = /^(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm))$/i;
goog.html.SafeUrl.fromBlob = function(a) {
  a = goog.html.SAFE_MIME_TYPE_PATTERN_.test(a.type) ? goog.fs.url.createObjectUrl(a) : goog.html.SafeUrl.INNOCUOUS_STRING;
  return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a);
};
goog.html.DATA_URL_PATTERN_ = /^data:([^;,]*);base64,[a-z0-9+\/]+=*$/i;
goog.html.SafeUrl.fromDataUrl = function(a) {
  var b = a.match(goog.html.DATA_URL_PATTERN_), b = b && goog.html.SAFE_MIME_TYPE_PATTERN_.test(b[1]);
  return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(b ? a : goog.html.SafeUrl.INNOCUOUS_STRING);
};
goog.html.SafeUrl.fromTelUrl = function(a) {
  goog.string.caseInsensitiveStartsWith(a, "tel:") || (a = goog.html.SafeUrl.INNOCUOUS_STRING);
  return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a);
};
goog.html.SafeUrl.fromTrustedResourceUrl = function(a) {
  return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(goog.html.TrustedResourceUrl.unwrap(a));
};
goog.html.SAFE_URL_PATTERN_ = /^(?:(?:https?|mailto|ftp):|[^:/?#]*(?:[/?#]|$))/i;
goog.html.SafeUrl.sanitize = function(a) {
  if (a instanceof goog.html.SafeUrl) {
    return a;
  }
  a = a.implementsGoogStringTypedString ? a.getTypedStringValue() : String(a);
  goog.html.SAFE_URL_PATTERN_.test(a) || (a = goog.html.SafeUrl.INNOCUOUS_STRING);
  return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a);
};
goog.html.SafeUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse = function(a) {
  var b = new goog.html.SafeUrl;
  b.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = a;
  return b;
};
goog.html.SafeUrl.ABOUT_BLANK = goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse("about:blank");
goog.html.SafeHtml = function() {
  this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = "";
  this.SAFE_HTML_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.SafeHtml.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
  this.dir_ = null;
};
goog.html.SafeHtml.prototype.implementsGoogI18nBidiDirectionalString = !0;
goog.html.SafeHtml.prototype.getDirection = function() {
  return this.dir_;
};
goog.html.SafeHtml.prototype.implementsGoogStringTypedString = !0;
goog.html.SafeHtml.prototype.getTypedStringValue = function() {
  return this.privateDoNotAccessOrElseSafeHtmlWrappedValue_;
};
goog.DEBUG && (goog.html.SafeHtml.prototype.toString = function() {
  return "SafeHtml{" + this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ + "}";
});
goog.html.SafeHtml.unwrap = function(a) {
  if (a instanceof goog.html.SafeHtml && a.constructor === goog.html.SafeHtml && a.SAFE_HTML_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.SafeHtml.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) {
    return a.privateDoNotAccessOrElseSafeHtmlWrappedValue_;
  }
  goog.asserts.fail("expected object of type SafeHtml, got '" + a + "' of type " + goog.typeOf(a));
  return "type_error:SafeHtml";
};
goog.html.SafeHtml.htmlEscape = function(a) {
  if (a instanceof goog.html.SafeHtml) {
    return a;
  }
  var b = null;
  a.implementsGoogI18nBidiDirectionalString && (b = a.getDirection());
  a = a.implementsGoogStringTypedString ? a.getTypedStringValue() : String(a);
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(goog.string.htmlEscape(a), b);
};
goog.html.SafeHtml.htmlEscapePreservingNewlines = function(a) {
  if (a instanceof goog.html.SafeHtml) {
    return a;
  }
  a = goog.html.SafeHtml.htmlEscape(a);
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(goog.string.newLineToBr(goog.html.SafeHtml.unwrap(a)), a.getDirection());
};
goog.html.SafeHtml.htmlEscapePreservingNewlinesAndSpaces = function(a) {
  if (a instanceof goog.html.SafeHtml) {
    return a;
  }
  a = goog.html.SafeHtml.htmlEscape(a);
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(goog.string.whitespaceEscape(goog.html.SafeHtml.unwrap(a)), a.getDirection());
};
goog.html.SafeHtml.from = goog.html.SafeHtml.htmlEscape;
goog.html.SafeHtml.VALID_NAMES_IN_TAG_ = /^[a-zA-Z0-9-]+$/;
goog.html.SafeHtml.URL_ATTRIBUTES_ = {action:!0, cite:!0, data:!0, formaction:!0, href:!0, manifest:!0, poster:!0, src:!0};
goog.html.SafeHtml.NOT_ALLOWED_TAG_NAMES_ = {APPLET:!0, BASE:!0, EMBED:!0, IFRAME:!0, LINK:!0, MATH:!0, META:!0, OBJECT:!0, SCRIPT:!0, STYLE:!0, SVG:!0, TEMPLATE:!0};
goog.html.SafeHtml.create = function(a, b, c) {
  goog.html.SafeHtml.verifyTagName(String(a));
  return goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse(String(a), b, c);
};
goog.html.SafeHtml.verifyTagName = function(a) {
  if (!goog.html.SafeHtml.VALID_NAMES_IN_TAG_.test(a)) {
    throw Error("Invalid tag name <" + a + ">.");
  }
  if (a.toUpperCase() in goog.html.SafeHtml.NOT_ALLOWED_TAG_NAMES_) {
    throw Error("Tag name <" + a + "> is not allowed for SafeHtml.");
  }
};
goog.html.SafeHtml.createIframe = function(a, b, c, d) {
  a && goog.html.TrustedResourceUrl.unwrap(a);
  var e = {};
  e.src = a || null;
  e.srcdoc = b && goog.html.SafeHtml.unwrap(b);
  a = goog.html.SafeHtml.combineAttributes(e, {sandbox:""}, c);
  return goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("iframe", a, d);
};
goog.html.SafeHtml.createSandboxIframe = function(a, b, c, d) {
  if (!goog.html.SafeHtml.canUseSandboxIframe()) {
    throw Error("The browser does not support sandboxed iframes.");
  }
  var e = {};
  e.src = a ? goog.html.SafeUrl.unwrap(goog.html.SafeUrl.sanitize(a)) : null;
  e.srcdoc = b || null;
  e.sandbox = "";
  a = goog.html.SafeHtml.combineAttributes(e, {}, c);
  return goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("iframe", a, d);
};
goog.html.SafeHtml.canUseSandboxIframe = function() {
  return goog.global.HTMLIFrameElement && "sandbox" in goog.global.HTMLIFrameElement.prototype;
};
goog.html.SafeHtml.createScriptSrc = function(a, b) {
  goog.html.TrustedResourceUrl.unwrap(a);
  a = goog.html.SafeHtml.combineAttributes({src:a}, {}, b);
  return goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("script", a);
};
goog.html.SafeHtml.createScript = function(a, b) {
  for (var c in b) {
    var d = c.toLowerCase();
    if ("language" == d || "src" == d || "text" == d || "type" == d) {
      throw Error('Cannot set "' + d + '" attribute');
    }
  }
  c = "";
  a = goog.array.concat(a);
  for (d = 0; d < a.length; d++) {
    c += goog.html.SafeScript.unwrap(a[d]);
  }
  a = goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(c, goog.i18n.bidi.Dir.NEUTRAL);
  return goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("script", b, a);
};
goog.html.SafeHtml.createStyle = function(a, b) {
  b = goog.html.SafeHtml.combineAttributes({type:"text/css"}, {}, b);
  var c = "";
  a = goog.array.concat(a);
  for (var d = 0; d < a.length; d++) {
    c += goog.html.SafeStyleSheet.unwrap(a[d]);
  }
  a = goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(c, goog.i18n.bidi.Dir.NEUTRAL);
  return goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("style", b, a);
};
goog.html.SafeHtml.createMetaRefresh = function(a, b) {
  a = goog.html.SafeUrl.unwrap(goog.html.SafeUrl.sanitize(a));
  (goog.labs.userAgent.browser.isIE() || goog.labs.userAgent.browser.isEdge()) && goog.string.contains(a, ";") && (a = "'" + a.replace(/'/g, "%27") + "'");
  return goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("meta", {"http-equiv":"refresh", content:(b || 0) + "; url=" + a});
};
goog.html.SafeHtml.getAttrNameAndValue_ = function(a, b, c) {
  if (c instanceof goog.string.Const) {
    c = goog.string.Const.unwrap(c);
  } else {
    if ("style" == b.toLowerCase()) {
      c = goog.html.SafeHtml.getStyleValue_(c);
    } else {
      if (/^on/i.test(b)) {
        throw Error('Attribute "' + b + '" requires goog.string.Const value, "' + c + '" given.');
      }
      if (b.toLowerCase() in goog.html.SafeHtml.URL_ATTRIBUTES_) {
        if (c instanceof goog.html.TrustedResourceUrl) {
          c = goog.html.TrustedResourceUrl.unwrap(c);
        } else {
          if (c instanceof goog.html.SafeUrl) {
            c = goog.html.SafeUrl.unwrap(c);
          } else {
            if (goog.isString(c)) {
              c = goog.html.SafeUrl.sanitize(c).getTypedStringValue();
            } else {
              throw Error('Attribute "' + b + '" on tag "' + a + '" requires goog.html.SafeUrl, goog.string.Const, or string, value "' + c + '" given.');
            }
          }
        }
      }
    }
  }
  c.implementsGoogStringTypedString && (c = c.getTypedStringValue());
  goog.asserts.assert(goog.isString(c) || goog.isNumber(c), "String or number value expected, got " + typeof c + " with value: " + c);
  return b + '="' + goog.string.htmlEscape(String(c)) + '"';
};
goog.html.SafeHtml.getStyleValue_ = function(a) {
  if (!goog.isObject(a)) {
    throw Error('The "style" attribute requires goog.html.SafeStyle or map of style properties, ' + typeof a + " given: " + a);
  }
  a instanceof goog.html.SafeStyle || (a = goog.html.SafeStyle.create(a));
  return goog.html.SafeStyle.unwrap(a);
};
goog.html.SafeHtml.createWithDir = function(a, b, c, d) {
  b = goog.html.SafeHtml.create(b, c, d);
  b.dir_ = a;
  return b;
};
goog.html.SafeHtml.concat = function(a) {
  var b = goog.i18n.bidi.Dir.NEUTRAL, c = "", d = function(a) {
    goog.isArray(a) ? goog.array.forEach(a, d) : (a = goog.html.SafeHtml.htmlEscape(a), c += goog.html.SafeHtml.unwrap(a), a = a.getDirection(), b == goog.i18n.bidi.Dir.NEUTRAL ? b = a : a != goog.i18n.bidi.Dir.NEUTRAL && b != a && (b = null));
  };
  goog.array.forEach(arguments, d);
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(c, b);
};
goog.html.SafeHtml.concatWithDir = function(a, b) {
  var c = goog.html.SafeHtml.concat(goog.array.slice(arguments, 1));
  c.dir_ = a;
  return c;
};
goog.html.SafeHtml.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse = function(a, b) {
  return (new goog.html.SafeHtml).initSecurityPrivateDoNotAccessOrElse_(a, b);
};
goog.html.SafeHtml.prototype.initSecurityPrivateDoNotAccessOrElse_ = function(a, b) {
  this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = a;
  this.dir_ = b;
  return this;
};
goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse = function(a, b, c) {
  var d = null;
  var e = "<" + a + goog.html.SafeHtml.stringifyAttributes(a, b);
  goog.isDefAndNotNull(c) ? goog.isArray(c) || (c = [c]) : c = [];
  goog.dom.tags.isVoidTag(a.toLowerCase()) ? (goog.asserts.assert(!c.length, "Void tag <" + a + "> does not allow content."), e += ">") : (d = goog.html.SafeHtml.concat(c), e += ">" + goog.html.SafeHtml.unwrap(d) + "</" + a + ">", d = d.getDirection());
  (a = b && b.dir) && (d = /^(ltr|rtl|auto)$/i.test(a) ? goog.i18n.bidi.Dir.NEUTRAL : null);
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(e, d);
};
goog.html.SafeHtml.stringifyAttributes = function(a, b) {
  var c = "";
  if (b) {
    for (var d in b) {
      if (!goog.html.SafeHtml.VALID_NAMES_IN_TAG_.test(d)) {
        throw Error('Invalid attribute name "' + d + '".');
      }
      var e = b[d];
      goog.isDefAndNotNull(e) && (c += " " + goog.html.SafeHtml.getAttrNameAndValue_(a, d, e));
    }
  }
  return c;
};
goog.html.SafeHtml.combineAttributes = function(a, b, c) {
  var d = {}, e;
  for (e in a) {
    goog.asserts.assert(e.toLowerCase() == e, "Must be lower case"), d[e] = a[e];
  }
  for (e in b) {
    goog.asserts.assert(e.toLowerCase() == e, "Must be lower case"), d[e] = b[e];
  }
  for (e in c) {
    var f = e.toLowerCase();
    if (f in a) {
      throw Error('Cannot override "' + f + '" attribute, got "' + e + '" with value "' + c[e] + '"');
    }
    f in b && delete d[f];
    d[e] = c[e];
  }
  return d;
};
goog.html.SafeHtml.DOCTYPE_HTML = goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse("<!DOCTYPE html>", goog.i18n.bidi.Dir.NEUTRAL);
goog.html.SafeHtml.EMPTY = goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse("", goog.i18n.bidi.Dir.NEUTRAL);
goog.html.SafeHtml.BR = goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse("<br>", goog.i18n.bidi.Dir.NEUTRAL);
goog.dom.safe = {};
goog.dom.safe.InsertAdjacentHtmlPosition = {AFTERBEGIN:"afterbegin", AFTEREND:"afterend", BEFOREBEGIN:"beforebegin", BEFOREEND:"beforeend"};
goog.dom.safe.insertAdjacentHtml = function(a, b, c) {
  a.insertAdjacentHTML(b, goog.html.SafeHtml.unwrap(c));
};
goog.dom.safe.SET_INNER_HTML_DISALLOWED_TAGS_ = {MATH:!0, SCRIPT:!0, STYLE:!0, SVG:!0, TEMPLATE:!0};
goog.dom.safe.setInnerHtml = function(a, b) {
  if (goog.asserts.ENABLE_ASSERTS) {
    var c = a.tagName.toUpperCase();
    if (goog.dom.safe.SET_INNER_HTML_DISALLOWED_TAGS_[c]) {
      throw Error("goog.dom.safe.setInnerHtml cannot be used to set content of " + a.tagName + ".");
    }
  }
  a.innerHTML = goog.html.SafeHtml.unwrap(b);
};
goog.dom.safe.setOuterHtml = function(a, b) {
  a.outerHTML = goog.html.SafeHtml.unwrap(b);
};
goog.dom.safe.setStyle = function(a, b) {
  a.style.cssText = goog.html.SafeStyle.unwrap(b);
};
goog.dom.safe.documentWrite = function(a, b) {
  a.write(goog.html.SafeHtml.unwrap(b));
};
goog.dom.safe.setAnchorHref = function(a, b) {
  goog.dom.safe.assertIsHTMLAnchorElement_(a);
  b = b instanceof goog.html.SafeUrl ? b : goog.html.SafeUrl.sanitize(b);
  a.href = goog.html.SafeUrl.unwrap(b);
};
goog.dom.safe.setImageSrc = function(a, b) {
  goog.dom.safe.assertIsHTMLImageElement_(a);
  b = b instanceof goog.html.SafeUrl ? b : goog.html.SafeUrl.sanitize(b);
  a.src = goog.html.SafeUrl.unwrap(b);
};
goog.dom.safe.setEmbedSrc = function(a, b) {
  goog.dom.safe.assertIsHTMLEmbedElement_(a);
  a.src = goog.html.TrustedResourceUrl.unwrap(b);
};
goog.dom.safe.setFrameSrc = function(a, b) {
  goog.dom.safe.assertIsHTMLFrameElement_(a);
  a.src = goog.html.TrustedResourceUrl.unwrap(b);
};
goog.dom.safe.setIframeSrc = function(a, b) {
  goog.dom.safe.assertIsHTMLIFrameElement_(a);
  a.src = goog.html.TrustedResourceUrl.unwrap(b);
};
goog.dom.safe.setIframeSrcdoc = function(a, b) {
  goog.dom.safe.assertIsHTMLIFrameElement_(a);
  a.srcdoc = goog.html.SafeHtml.unwrap(b);
};
goog.dom.safe.setLinkHrefAndRel = function(a, b, c) {
  goog.dom.safe.assertIsHTMLLinkElement_(a);
  a.rel = c;
  goog.string.caseInsensitiveContains(c, "stylesheet") ? (goog.asserts.assert(b instanceof goog.html.TrustedResourceUrl, 'URL must be TrustedResourceUrl because "rel" contains "stylesheet"'), a.href = goog.html.TrustedResourceUrl.unwrap(b)) : a.href = b instanceof goog.html.TrustedResourceUrl ? goog.html.TrustedResourceUrl.unwrap(b) : b instanceof goog.html.SafeUrl ? goog.html.SafeUrl.unwrap(b) : goog.html.SafeUrl.sanitize(b).getTypedStringValue();
};
goog.dom.safe.setObjectData = function(a, b) {
  goog.dom.safe.assertIsHTMLObjectElement_(a);
  a.data = goog.html.TrustedResourceUrl.unwrap(b);
};
goog.dom.safe.setScriptSrc = function(a, b) {
  goog.dom.safe.assertIsHTMLScriptElement_(a);
  a.src = goog.html.TrustedResourceUrl.unwrap(b);
};
goog.dom.safe.setScriptContent = function(a, b) {
  goog.dom.safe.assertIsHTMLScriptElement_(a);
  a.text = goog.html.SafeScript.unwrap(b);
};
goog.dom.safe.setLocationHref = function(a, b) {
  goog.dom.safe.assertIsLocation_(a);
  b = b instanceof goog.html.SafeUrl ? b : goog.html.SafeUrl.sanitize(b);
  a.href = goog.html.SafeUrl.unwrap(b);
};
goog.dom.safe.openInWindow = function(a, b, c, d, e) {
  a = a instanceof goog.html.SafeUrl ? a : goog.html.SafeUrl.sanitize(a);
  return (b || window).open(goog.html.SafeUrl.unwrap(a), c ? goog.string.Const.unwrap(c) : "", d, e);
};
goog.dom.safe.assertIsLocation_ = function(a) {
  goog.asserts.ENABLE_ASSERTS && "undefined" != typeof Location && "undefined" != typeof Element && goog.asserts.assert(a && (a instanceof Location || !(a instanceof Element)), "Argument is not a Location (or a non-Element mock); got: %s", goog.dom.safe.debugStringForType_(a));
  return a;
};
goog.dom.safe.assertIsHTMLAnchorElement_ = function(a) {
  goog.asserts.ENABLE_ASSERTS && "undefined" != typeof HTMLAnchorElement && "undefined" != typeof Location && "undefined" != typeof Element && goog.asserts.assert(a && (a instanceof HTMLAnchorElement || !(a instanceof Location || a instanceof Element)), "Argument is not a HTMLAnchorElement (or a non-Element mock); got: %s", goog.dom.safe.debugStringForType_(a));
  return a;
};
goog.dom.safe.assertIsHTMLLinkElement_ = function(a) {
  goog.asserts.ENABLE_ASSERTS && "undefined" != typeof HTMLLinkElement && "undefined" != typeof Location && "undefined" != typeof Element && goog.asserts.assert(a && (a instanceof HTMLLinkElement || !(a instanceof Location || a instanceof Element)), "Argument is not a HTMLLinkElement (or a non-Element mock); got: %s", goog.dom.safe.debugStringForType_(a));
  return a;
};
goog.dom.safe.assertIsHTMLImageElement_ = function(a) {
  goog.asserts.ENABLE_ASSERTS && "undefined" != typeof HTMLImageElement && "undefined" != typeof Element && goog.asserts.assert(a && (a instanceof HTMLImageElement || !(a instanceof Element)), "Argument is not a HTMLImageElement (or a non-Element mock); got: %s", goog.dom.safe.debugStringForType_(a));
  return a;
};
goog.dom.safe.assertIsHTMLEmbedElement_ = function(a) {
  goog.asserts.ENABLE_ASSERTS && "undefined" != typeof HTMLEmbedElement && "undefined" != typeof Element && goog.asserts.assert(a && (a instanceof HTMLEmbedElement || !(a instanceof Element)), "Argument is not a HTMLEmbedElement (or a non-Element mock); got: %s", goog.dom.safe.debugStringForType_(a));
  return a;
};
goog.dom.safe.assertIsHTMLFrameElement_ = function(a) {
  goog.asserts.ENABLE_ASSERTS && "undefined" != typeof HTMLFrameElement && "undefined" != typeof Element && goog.asserts.assert(a && (a instanceof HTMLFrameElement || !(a instanceof Element)), "Argument is not a HTMLFrameElement (or a non-Element mock); got: %s", goog.dom.safe.debugStringForType_(a));
  return a;
};
goog.dom.safe.assertIsHTMLIFrameElement_ = function(a) {
  goog.asserts.ENABLE_ASSERTS && "undefined" != typeof HTMLIFrameElement && "undefined" != typeof Element && goog.asserts.assert(a && (a instanceof HTMLIFrameElement || !(a instanceof Element)), "Argument is not a HTMLIFrameElement (or a non-Element mock); got: %s", goog.dom.safe.debugStringForType_(a));
  return a;
};
goog.dom.safe.assertIsHTMLObjectElement_ = function(a) {
  goog.asserts.ENABLE_ASSERTS && "undefined" != typeof HTMLObjectElement && "undefined" != typeof Element && goog.asserts.assert(a && (a instanceof HTMLObjectElement || !(a instanceof Element)), "Argument is not a HTMLObjectElement (or a non-Element mock); got: %s", goog.dom.safe.debugStringForType_(a));
  return a;
};
goog.dom.safe.assertIsHTMLScriptElement_ = function(a) {
  goog.asserts.ENABLE_ASSERTS && "undefined" != typeof HTMLScriptElement && "undefined" != typeof Element && goog.asserts.assert(a && (a instanceof HTMLScriptElement || !(a instanceof Element)), "Argument is not a HTMLScriptElement (or a non-Element mock); got: %s", goog.dom.safe.debugStringForType_(a));
  return a;
};
goog.dom.safe.debugStringForType_ = function(a) {
  return goog.isObject(a) ? a.constructor.displayName || a.constructor.name || Object.prototype.toString.call(a) : void 0 === a ? "undefined" : null === a ? "null" : typeof a;
};
goog.html.uncheckedconversions = {};
goog.html.uncheckedconversions.safeHtmlFromStringKnownToSatisfyTypeContract = function(a, b, c) {
  goog.asserts.assertString(goog.string.Const.unwrap(a), "must provide justification");
  goog.asserts.assert(!goog.string.isEmptyOrWhitespace(goog.string.Const.unwrap(a)), "must provide non-empty justification");
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(b, c || null);
};
goog.html.uncheckedconversions.safeScriptFromStringKnownToSatisfyTypeContract = function(a, b) {
  goog.asserts.assertString(goog.string.Const.unwrap(a), "must provide justification");
  goog.asserts.assert(!goog.string.isEmptyOrWhitespace(goog.string.Const.unwrap(a)), "must provide non-empty justification");
  return goog.html.SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse(b);
};
goog.html.uncheckedconversions.safeStyleFromStringKnownToSatisfyTypeContract = function(a, b) {
  goog.asserts.assertString(goog.string.Const.unwrap(a), "must provide justification");
  goog.asserts.assert(!goog.string.isEmptyOrWhitespace(goog.string.Const.unwrap(a)), "must provide non-empty justification");
  return goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(b);
};
goog.html.uncheckedconversions.safeStyleSheetFromStringKnownToSatisfyTypeContract = function(a, b) {
  goog.asserts.assertString(goog.string.Const.unwrap(a), "must provide justification");
  goog.asserts.assert(!goog.string.isEmptyOrWhitespace(goog.string.Const.unwrap(a)), "must provide non-empty justification");
  return goog.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse(b);
};
goog.html.uncheckedconversions.safeUrlFromStringKnownToSatisfyTypeContract = function(a, b) {
  goog.asserts.assertString(goog.string.Const.unwrap(a), "must provide justification");
  goog.asserts.assert(!goog.string.isEmptyOrWhitespace(goog.string.Const.unwrap(a)), "must provide non-empty justification");
  return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(b);
};
goog.html.uncheckedconversions.trustedResourceUrlFromStringKnownToSatisfyTypeContract = function(a, b) {
  goog.asserts.assertString(goog.string.Const.unwrap(a), "must provide justification");
  goog.asserts.assert(!goog.string.isEmptyOrWhitespace(goog.string.Const.unwrap(a)), "must provide non-empty justification");
  return goog.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(b);
};
goog.math = {};
goog.math.randomInt = function(a) {
  return Math.floor(Math.random() * a);
};
goog.math.uniformRandom = function(a, b) {
  return a + Math.random() * (b - a);
};
goog.math.clamp = function(a, b, c) {
  return Math.min(Math.max(a, b), c);
};
goog.math.modulo = function(a, b) {
  a %= b;
  return 0 > a * b ? a + b : a;
};
goog.math.lerp = function(a, b, c) {
  return a + c * (b - a);
};
goog.math.nearlyEquals = function(a, b, c) {
  return Math.abs(a - b) <= (c || 0.000001);
};
goog.math.standardAngle = function(a) {
  return goog.math.modulo(a, 360);
};
goog.math.standardAngleInRadians = function(a) {
  return goog.math.modulo(a, 2 * Math.PI);
};
goog.math.toRadians = function(a) {
  return a * Math.PI / 180;
};
goog.math.toDegrees = function(a) {
  return 180 * a / Math.PI;
};
goog.math.angleDx = function(a, b) {
  return b * Math.cos(goog.math.toRadians(a));
};
goog.math.angleDy = function(a, b) {
  return b * Math.sin(goog.math.toRadians(a));
};
goog.math.angle = function(a, b, c, d) {
  return goog.math.standardAngle(goog.math.toDegrees(Math.atan2(d - b, c - a)));
};
goog.math.angleDifference = function(a, b) {
  a = goog.math.standardAngle(b) - goog.math.standardAngle(a);
  180 < a ? a -= 360 : -180 >= a && (a = 360 + a);
  return a;
};
goog.math.sign = function(a) {
  return 0 < a ? 1 : 0 > a ? -1 : a;
};
goog.math.longestCommonSubsequence = function(a, b, c, d) {
  c = c || function(a, b) {
    return a == b;
  };
  d = d || function(b, c) {
    return a[b];
  };
  for (var e = a.length, f = b.length, g = [], h = 0; h < e + 1; h++) {
    g[h] = [], g[h][0] = 0;
  }
  for (var k = 0; k < f + 1; k++) {
    g[0][k] = 0;
  }
  for (h = 1; h <= e; h++) {
    for (k = 1; k <= f; k++) {
      c(a[h - 1], b[k - 1]) ? g[h][k] = g[h - 1][k - 1] + 1 : g[h][k] = Math.max(g[h - 1][k], g[h][k - 1]);
    }
  }
  for (var l = [], h = e, k = f; 0 < h && 0 < k;) {
    c(a[h - 1], b[k - 1]) ? (l.unshift(d(h - 1, k - 1)), h--, k--) : g[h - 1][k] > g[h][k - 1] ? h-- : k--;
  }
  return l;
};
goog.math.sum = function(a) {
  return goog.array.reduce(arguments, function(a, c) {
    return a + c;
  }, 0);
};
goog.math.average = function(a) {
  return goog.math.sum.apply(null, arguments) / arguments.length;
};
goog.math.sampleVariance = function(a) {
  var b = arguments.length;
  if (2 > b) {
    return 0;
  }
  var c = goog.math.average.apply(null, arguments);
  return goog.math.sum.apply(null, goog.array.map(arguments, function(a) {
    return Math.pow(a - c, 2);
  })) / (b - 1);
};
goog.math.standardDeviation = function(a) {
  return Math.sqrt(goog.math.sampleVariance.apply(null, arguments));
};
goog.math.isInt = function(a) {
  return isFinite(a) && 0 == a % 1;
};
goog.math.isFiniteNumber = function(a) {
  return isFinite(a);
};
goog.math.isNegativeZero = function(a) {
  return 0 == a && 0 > 1 / a;
};
goog.math.log10Floor = function(a) {
  if (0 < a) {
    var b = Math.round(Math.log(a) * Math.LOG10E);
    return b - (parseFloat("1e" + b) > a ? 1 : 0);
  }
  return 0 == a ? -Infinity : NaN;
};
goog.math.safeFloor = function(a, b) {
  goog.asserts.assert(!goog.isDef(b) || 0 < b);
  return Math.floor(a + (b || 2e-15));
};
goog.math.safeCeil = function(a, b) {
  goog.asserts.assert(!goog.isDef(b) || 0 < b);
  return Math.ceil(a - (b || 2e-15));
};
goog.math.Coordinate = function(a, b) {
  this.x = goog.isDef(a) ? a : 0;
  this.y = goog.isDef(b) ? b : 0;
};
goog.math.Coordinate.prototype.clone = function() {
  return new goog.math.Coordinate(this.x, this.y);
};
goog.DEBUG && (goog.math.Coordinate.prototype.toString = function() {
  return "(" + this.x + ", " + this.y + ")";
});
goog.math.Coordinate.prototype.equals = function(a) {
  return a instanceof goog.math.Coordinate && goog.math.Coordinate.equals(this, a);
};
goog.math.Coordinate.equals = function(a, b) {
  return a == b ? !0 : a && b ? a.x == b.x && a.y == b.y : !1;
};
goog.math.Coordinate.distance = function(a, b) {
  var c = a.x - b.x;
  a = a.y - b.y;
  return Math.sqrt(c * c + a * a);
};
goog.math.Coordinate.magnitude = function(a) {
  return Math.sqrt(a.x * a.x + a.y * a.y);
};
goog.math.Coordinate.azimuth = function(a) {
  return goog.math.angle(0, 0, a.x, a.y);
};
goog.math.Coordinate.squaredDistance = function(a, b) {
  var c = a.x - b.x;
  a = a.y - b.y;
  return c * c + a * a;
};
goog.math.Coordinate.difference = function(a, b) {
  return new goog.math.Coordinate(a.x - b.x, a.y - b.y);
};
goog.math.Coordinate.sum = function(a, b) {
  return new goog.math.Coordinate(a.x + b.x, a.y + b.y);
};
goog.math.Coordinate.prototype.ceil = function() {
  this.x = Math.ceil(this.x);
  this.y = Math.ceil(this.y);
  return this;
};
goog.math.Coordinate.prototype.floor = function() {
  this.x = Math.floor(this.x);
  this.y = Math.floor(this.y);
  return this;
};
goog.math.Coordinate.prototype.round = function() {
  this.x = Math.round(this.x);
  this.y = Math.round(this.y);
  return this;
};
goog.math.Coordinate.prototype.translate = function(a, b) {
  a instanceof goog.math.Coordinate ? (this.x += a.x, this.y += a.y) : (this.x += Number(a), goog.isNumber(b) && (this.y += b));
  return this;
};
goog.math.Coordinate.prototype.scale = function(a, b) {
  b = goog.isNumber(b) ? b : a;
  this.x *= a;
  this.y *= b;
  return this;
};
goog.math.Coordinate.prototype.rotateRadians = function(a, b) {
  b = b || new goog.math.Coordinate(0, 0);
  var c = this.x, d = this.y, e = Math.cos(a);
  a = Math.sin(a);
  this.x = (c - b.x) * e - (d - b.y) * a + b.x;
  this.y = (c - b.x) * a + (d - b.y) * e + b.y;
};
goog.math.Coordinate.prototype.rotateDegrees = function(a, b) {
  this.rotateRadians(goog.math.toRadians(a), b);
};
goog.math.Size = function(a, b) {
  this.width = a;
  this.height = b;
};
goog.math.Size.equals = function(a, b) {
  return a == b ? !0 : a && b ? a.width == b.width && a.height == b.height : !1;
};
goog.math.Size.prototype.clone = function() {
  return new goog.math.Size(this.width, this.height);
};
goog.DEBUG && (goog.math.Size.prototype.toString = function() {
  return "(" + this.width + " x " + this.height + ")";
});
goog.math.Size.prototype.getLongest = function() {
  return Math.max(this.width, this.height);
};
goog.math.Size.prototype.getShortest = function() {
  return Math.min(this.width, this.height);
};
goog.math.Size.prototype.area = function() {
  return this.width * this.height;
};
goog.math.Size.prototype.perimeter = function() {
  return 2 * (this.width + this.height);
};
goog.math.Size.prototype.aspectRatio = function() {
  return this.width / this.height;
};
goog.math.Size.prototype.isEmpty = function() {
  return !this.area();
};
goog.math.Size.prototype.ceil = function() {
  this.width = Math.ceil(this.width);
  this.height = Math.ceil(this.height);
  return this;
};
goog.math.Size.prototype.fitsInside = function(a) {
  return this.width <= a.width && this.height <= a.height;
};
goog.math.Size.prototype.floor = function() {
  this.width = Math.floor(this.width);
  this.height = Math.floor(this.height);
  return this;
};
goog.math.Size.prototype.round = function() {
  this.width = Math.round(this.width);
  this.height = Math.round(this.height);
  return this;
};
goog.math.Size.prototype.scale = function(a, b) {
  b = goog.isNumber(b) ? b : a;
  this.width *= a;
  this.height *= b;
  return this;
};
goog.math.Size.prototype.scaleToCover = function(a) {
  a = this.aspectRatio() <= a.aspectRatio() ? a.width / this.width : a.height / this.height;
  return this.scale(a);
};
goog.math.Size.prototype.scaleToFit = function(a) {
  a = this.aspectRatio() > a.aspectRatio() ? a.width / this.width : a.height / this.height;
  return this.scale(a);
};
goog.dom.ASSUME_QUIRKS_MODE = !1;
goog.dom.ASSUME_STANDARDS_MODE = !1;
goog.dom.COMPAT_MODE_KNOWN_ = goog.dom.ASSUME_QUIRKS_MODE || goog.dom.ASSUME_STANDARDS_MODE;
goog.dom.getDomHelper = function(a) {
  return a ? new goog.dom.DomHelper(goog.dom.getOwnerDocument(a)) : goog.dom.defaultDomHelper_ || (goog.dom.defaultDomHelper_ = new goog.dom.DomHelper);
};
goog.dom.getDocument = function() {
  return document;
};
goog.dom.getElement = function(a) {
  return goog.dom.getElementHelper_(document, a);
};
goog.dom.getElementHelper_ = function(a, b) {
  return goog.isString(b) ? a.getElementById(b) : b;
};
goog.dom.getRequiredElement = function(a) {
  return goog.dom.getRequiredElementHelper_(document, a);
};
goog.dom.getRequiredElementHelper_ = function(a, b) {
  goog.asserts.assertString(b);
  a = goog.dom.getElementHelper_(a, b);
  return a = goog.asserts.assertElement(a, "No element found with id: " + b);
};
goog.dom.$ = goog.dom.getElement;
goog.dom.getElementsByTagName = function(a, b) {
  return (b || document).getElementsByTagName(String(a));
};
goog.dom.getElementsByTagNameAndClass = function(a, b, c) {
  return goog.dom.getElementsByTagNameAndClass_(document, a, b, c);
};
goog.dom.getElementsByClass = function(a, b) {
  var c = b || document;
  return goog.dom.canUseQuerySelector_(c) ? c.querySelectorAll("." + a) : goog.dom.getElementsByTagNameAndClass_(document, "*", a, b);
};
goog.dom.getElementByClass = function(a, b) {
  var c = b || document;
  return (c.getElementsByClassName ? c.getElementsByClassName(a)[0] : goog.dom.canUseQuerySelector_(c) ? c.querySelector("." + a) : goog.dom.getElementsByTagNameAndClass_(document, "*", a, b)[0]) || null;
};
goog.dom.getRequiredElementByClass = function(a, b) {
  b = goog.dom.getElementByClass(a, b);
  return goog.asserts.assert(b, "No element found with className: " + a);
};
goog.dom.canUseQuerySelector_ = function(a) {
  return !(!a.querySelectorAll || !a.querySelector);
};
goog.dom.getElementsByTagNameAndClass_ = function(a, b, c, d) {
  a = d || a;
  var e = b && "*" != b ? String(b).toUpperCase() : "";
  if (goog.dom.canUseQuerySelector_(a) && (e || c)) {
    return a.querySelectorAll(e + (c ? "." + c : ""));
  }
  if (c && a.getElementsByClassName) {
    d = a.getElementsByClassName(c);
    if (e) {
      a = {};
      for (var f = b = 0, g; g = d[f]; f++) {
        e == g.nodeName && (a[b++] = g);
      }
      a.length = b;
      return a;
    }
    return d;
  }
  d = a.getElementsByTagName(e || "*");
  if (c) {
    a = {};
    for (f = b = 0; g = d[f]; f++) {
      e = g.className, "function" == typeof e.split && goog.array.contains(e.split(/\s+/), c) && (a[b++] = g);
    }
    a.length = b;
    return a;
  }
  return d;
};
goog.dom.$$ = goog.dom.getElementsByTagNameAndClass;
goog.dom.setProperties = function(a, b) {
  goog.object.forEach(b, function(b, d) {
    b && b.implementsGoogStringTypedString && (b = b.getTypedStringValue());
    "style" == d ? a.style.cssText = b : "class" == d ? a.className = b : "for" == d ? a.htmlFor = b : goog.dom.DIRECT_ATTRIBUTE_MAP_.hasOwnProperty(d) ? a.setAttribute(goog.dom.DIRECT_ATTRIBUTE_MAP_[d], b) : goog.string.startsWith(d, "aria-") || goog.string.startsWith(d, "data-") ? a.setAttribute(d, b) : a[d] = b;
  });
};
goog.dom.DIRECT_ATTRIBUTE_MAP_ = {cellpadding:"cellPadding", cellspacing:"cellSpacing", colspan:"colSpan", frameborder:"frameBorder", height:"height", maxlength:"maxLength", nonce:"nonce", role:"role", rowspan:"rowSpan", type:"type", usemap:"useMap", valign:"vAlign", width:"width"};
goog.dom.getViewportSize = function(a) {
  return goog.dom.getViewportSize_(a || window);
};
goog.dom.getViewportSize_ = function(a) {
  a = a.document;
  a = goog.dom.isCss1CompatMode_(a) ? a.documentElement : a.body;
  return new goog.math.Size(a.clientWidth, a.clientHeight);
};
goog.dom.getDocumentHeight = function() {
  return goog.dom.getDocumentHeight_(window);
};
goog.dom.getDocumentHeightForWindow = function(a) {
  return goog.dom.getDocumentHeight_(a);
};
goog.dom.getDocumentHeight_ = function(a) {
  var b = a.document, c = 0;
  if (b) {
    var c = b.body, d = b.documentElement;
    if (!d || !c) {
      return 0;
    }
    a = goog.dom.getViewportSize_(a).height;
    if (goog.dom.isCss1CompatMode_(b) && d.scrollHeight) {
      c = d.scrollHeight != a ? d.scrollHeight : d.offsetHeight;
    } else {
      var b = d.scrollHeight, e = d.offsetHeight;
      d.clientHeight != e && (b = c.scrollHeight, e = c.offsetHeight);
      c = b > a ? b > e ? b : e : b < e ? b : e;
    }
  }
  return c;
};
goog.dom.getPageScroll = function(a) {
  return goog.dom.getDomHelper((a || goog.global || window).document).getDocumentScroll();
};
goog.dom.getDocumentScroll = function() {
  return goog.dom.getDocumentScroll_(document);
};
goog.dom.getDocumentScroll_ = function(a) {
  var b = goog.dom.getDocumentScrollElement_(a);
  a = goog.dom.getWindow_(a);
  return goog.userAgent.IE && goog.userAgent.isVersionOrHigher("10") && a.pageYOffset != b.scrollTop ? new goog.math.Coordinate(b.scrollLeft, b.scrollTop) : new goog.math.Coordinate(a.pageXOffset || b.scrollLeft, a.pageYOffset || b.scrollTop);
};
goog.dom.getDocumentScrollElement = function() {
  return goog.dom.getDocumentScrollElement_(document);
};
goog.dom.getDocumentScrollElement_ = function(a) {
  return a.scrollingElement ? a.scrollingElement : !goog.userAgent.WEBKIT && goog.dom.isCss1CompatMode_(a) ? a.documentElement : a.body || a.documentElement;
};
goog.dom.getWindow = function(a) {
  return a ? goog.dom.getWindow_(a) : window;
};
goog.dom.getWindow_ = function(a) {
  return a.parentWindow || a.defaultView;
};
goog.dom.createDom = function(a, b, c) {
  return goog.dom.createDom_(document, arguments);
};
goog.dom.createDom_ = function(a, b) {
  var c = String(b[0]), d = b[1];
  if (!goog.dom.BrowserFeature.CAN_ADD_NAME_OR_TYPE_ATTRIBUTES && d && (d.name || d.type)) {
    c = ["<", c];
    d.name && c.push(' name="', goog.string.htmlEscape(d.name), '"');
    if (d.type) {
      c.push(' type="', goog.string.htmlEscape(d.type), '"');
      var e = {};
      goog.object.extend(e, d);
      delete e.type;
      d = e;
    }
    c.push(">");
    c = c.join("");
  }
  c = a.createElement(c);
  d && (goog.isString(d) ? c.className = d : goog.isArray(d) ? c.className = d.join(" ") : goog.dom.setProperties(c, d));
  2 < b.length && goog.dom.append_(a, c, b, 2);
  return c;
};
goog.dom.append_ = function(a, b, c, d) {
  function e(c) {
    c && b.appendChild(goog.isString(c) ? a.createTextNode(c) : c);
  }
  for (; d < c.length; d++) {
    var f = c[d];
    goog.isArrayLike(f) && !goog.dom.isNodeLike(f) ? goog.array.forEach(goog.dom.isNodeList(f) ? goog.array.toArray(f) : f, e) : e(f);
  }
};
goog.dom.$dom = goog.dom.createDom;
goog.dom.createElement = function(a) {
  return goog.dom.createElement_(document, a);
};
goog.dom.createElement_ = function(a, b) {
  return a.createElement(String(b));
};
goog.dom.createTextNode = function(a) {
  return document.createTextNode(String(a));
};
goog.dom.createTable = function(a, b, c) {
  return goog.dom.createTable_(document, a, b, !!c);
};
goog.dom.createTable_ = function(a, b, c, d) {
  for (var e = goog.dom.createElement_(a, "TABLE"), f = e.appendChild(goog.dom.createElement_(a, "TBODY")), g = 0; g < b; g++) {
    for (var h = goog.dom.createElement_(a, "TR"), k = 0; k < c; k++) {
      var l = goog.dom.createElement_(a, "TD");
      d && goog.dom.setTextContent(l, goog.string.Unicode.NBSP);
      h.appendChild(l);
    }
    f.appendChild(h);
  }
  return e;
};
goog.dom.constHtmlToNode = function(a) {
  var b = goog.array.map(arguments, goog.string.Const.unwrap), b = goog.html.uncheckedconversions.safeHtmlFromStringKnownToSatisfyTypeContract(goog.string.Const.from("Constant HTML string, that gets turned into a Node later, so it will be automatically balanced."), b.join(""));
  return goog.dom.safeHtmlToNode(b);
};
goog.dom.safeHtmlToNode = function(a) {
  return goog.dom.safeHtmlToNode_(document, a);
};
goog.dom.safeHtmlToNode_ = function(a, b) {
  var c = goog.dom.createElement_(a, "DIV");
  goog.dom.BrowserFeature.INNER_HTML_NEEDS_SCOPED_ELEMENT ? (goog.dom.safe.setInnerHtml(c, goog.html.SafeHtml.concat(goog.html.SafeHtml.BR, b)), c.removeChild(c.firstChild)) : goog.dom.safe.setInnerHtml(c, b);
  return goog.dom.childrenToNode_(a, c);
};
goog.dom.childrenToNode_ = function(a, b) {
  if (1 == b.childNodes.length) {
    return b.removeChild(b.firstChild);
  }
  for (a = a.createDocumentFragment(); b.firstChild;) {
    a.appendChild(b.firstChild);
  }
  return a;
};
goog.dom.isCss1CompatMode = function() {
  return goog.dom.isCss1CompatMode_(document);
};
goog.dom.isCss1CompatMode_ = function(a) {
  return goog.dom.COMPAT_MODE_KNOWN_ ? goog.dom.ASSUME_STANDARDS_MODE : "CSS1Compat" == a.compatMode;
};
goog.dom.canHaveChildren = function(a) {
  if (a.nodeType != goog.dom.NodeType.ELEMENT) {
    return !1;
  }
  switch(a.tagName) {
    case "APPLET":
    case "AREA":
    case "BASE":
    case "BR":
    case "COL":
    case "COMMAND":
    case "EMBED":
    case "FRAME":
    case "HR":
    case "IMG":
    case "INPUT":
    case "IFRAME":
    case "ISINDEX":
    case "KEYGEN":
    case "LINK":
    case "NOFRAMES":
    case "NOSCRIPT":
    case "META":
    case "OBJECT":
    case "PARAM":
    case "SCRIPT":
    case "SOURCE":
    case "STYLE":
    case "TRACK":
    case "WBR":
      return !1;
  }
  return !0;
};
goog.dom.appendChild = function(a, b) {
  a.appendChild(b);
};
goog.dom.append = function(a, b) {
  goog.dom.append_(goog.dom.getOwnerDocument(a), a, arguments, 1);
};
goog.dom.removeChildren = function(a) {
  for (var b; b = a.firstChild;) {
    a.removeChild(b);
  }
};
goog.dom.insertSiblingBefore = function(a, b) {
  b.parentNode && b.parentNode.insertBefore(a, b);
};
goog.dom.insertSiblingAfter = function(a, b) {
  b.parentNode && b.parentNode.insertBefore(a, b.nextSibling);
};
goog.dom.insertChildAt = function(a, b, c) {
  a.insertBefore(b, a.childNodes[c] || null);
};
goog.dom.removeNode = function(a) {
  return a && a.parentNode ? a.parentNode.removeChild(a) : null;
};
goog.dom.replaceNode = function(a, b) {
  var c = b.parentNode;
  c && c.replaceChild(a, b);
};
goog.dom.flattenElement = function(a) {
  var b, c = a.parentNode;
  if (c && c.nodeType != goog.dom.NodeType.DOCUMENT_FRAGMENT) {
    if (a.removeNode) {
      return a.removeNode(!1);
    }
    for (; b = a.firstChild;) {
      c.insertBefore(b, a);
    }
    return goog.dom.removeNode(a);
  }
};
goog.dom.getChildren = function(a) {
  return goog.dom.BrowserFeature.CAN_USE_CHILDREN_ATTRIBUTE && void 0 != a.children ? a.children : goog.array.filter(a.childNodes, function(a) {
    return a.nodeType == goog.dom.NodeType.ELEMENT;
  });
};
goog.dom.getFirstElementChild = function(a) {
  return goog.isDef(a.firstElementChild) ? a.firstElementChild : goog.dom.getNextElementNode_(a.firstChild, !0);
};
goog.dom.getLastElementChild = function(a) {
  return goog.isDef(a.lastElementChild) ? a.lastElementChild : goog.dom.getNextElementNode_(a.lastChild, !1);
};
goog.dom.getNextElementSibling = function(a) {
  return goog.isDef(a.nextElementSibling) ? a.nextElementSibling : goog.dom.getNextElementNode_(a.nextSibling, !0);
};
goog.dom.getPreviousElementSibling = function(a) {
  return goog.isDef(a.previousElementSibling) ? a.previousElementSibling : goog.dom.getNextElementNode_(a.previousSibling, !1);
};
goog.dom.getNextElementNode_ = function(a, b) {
  for (; a && a.nodeType != goog.dom.NodeType.ELEMENT;) {
    a = b ? a.nextSibling : a.previousSibling;
  }
  return a;
};
goog.dom.getNextNode = function(a) {
  if (!a) {
    return null;
  }
  if (a.firstChild) {
    return a.firstChild;
  }
  for (; a && !a.nextSibling;) {
    a = a.parentNode;
  }
  return a ? a.nextSibling : null;
};
goog.dom.getPreviousNode = function(a) {
  if (!a) {
    return null;
  }
  if (!a.previousSibling) {
    return a.parentNode;
  }
  for (a = a.previousSibling; a && a.lastChild;) {
    a = a.lastChild;
  }
  return a;
};
goog.dom.isNodeLike = function(a) {
  return goog.isObject(a) && 0 < a.nodeType;
};
goog.dom.isElement = function(a) {
  return goog.isObject(a) && a.nodeType == goog.dom.NodeType.ELEMENT;
};
goog.dom.isWindow = function(a) {
  return goog.isObject(a) && a.window == a;
};
goog.dom.getParentElement = function(a) {
  var b;
  if (goog.dom.BrowserFeature.CAN_USE_PARENT_ELEMENT_PROPERTY && !(goog.userAgent.IE && goog.userAgent.isVersionOrHigher("9") && !goog.userAgent.isVersionOrHigher("10") && goog.global.SVGElement && a instanceof goog.global.SVGElement) && (b = a.parentElement)) {
    return b;
  }
  b = a.parentNode;
  return goog.dom.isElement(b) ? b : null;
};
goog.dom.contains = function(a, b) {
  if (!a || !b) {
    return !1;
  }
  if (a.contains && b.nodeType == goog.dom.NodeType.ELEMENT) {
    return a == b || a.contains(b);
  }
  if ("undefined" != typeof a.compareDocumentPosition) {
    return a == b || !!(a.compareDocumentPosition(b) & 16);
  }
  for (; b && a != b;) {
    b = b.parentNode;
  }
  return b == a;
};
goog.dom.compareNodeOrder = function(a, b) {
  if (a == b) {
    return 0;
  }
  if (a.compareDocumentPosition) {
    return a.compareDocumentPosition(b) & 2 ? 1 : -1;
  }
  if (goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9)) {
    if (a.nodeType == goog.dom.NodeType.DOCUMENT) {
      return -1;
    }
    if (b.nodeType == goog.dom.NodeType.DOCUMENT) {
      return 1;
    }
  }
  if ("sourceIndex" in a || a.parentNode && "sourceIndex" in a.parentNode) {
    var c = a.nodeType == goog.dom.NodeType.ELEMENT, d = b.nodeType == goog.dom.NodeType.ELEMENT;
    if (c && d) {
      return a.sourceIndex - b.sourceIndex;
    }
    var e = a.parentNode, f = b.parentNode;
    return e == f ? goog.dom.compareSiblingOrder_(a, b) : !c && goog.dom.contains(e, b) ? -1 * goog.dom.compareParentsDescendantNodeIe_(a, b) : !d && goog.dom.contains(f, a) ? goog.dom.compareParentsDescendantNodeIe_(b, a) : (c ? a.sourceIndex : e.sourceIndex) - (d ? b.sourceIndex : f.sourceIndex);
  }
  d = goog.dom.getOwnerDocument(a);
  c = d.createRange();
  c.selectNode(a);
  c.collapse(!0);
  a = d.createRange();
  a.selectNode(b);
  a.collapse(!0);
  return c.compareBoundaryPoints(goog.global.Range.START_TO_END, a);
};
goog.dom.compareParentsDescendantNodeIe_ = function(a, b) {
  var c = a.parentNode;
  if (c == b) {
    return -1;
  }
  for (; b.parentNode != c;) {
    b = b.parentNode;
  }
  return goog.dom.compareSiblingOrder_(b, a);
};
goog.dom.compareSiblingOrder_ = function(a, b) {
  for (; b = b.previousSibling;) {
    if (b == a) {
      return -1;
    }
  }
  return 1;
};
goog.dom.findCommonAncestor = function(a) {
  var b, c = arguments.length;
  if (!c) {
    return null;
  }
  if (1 == c) {
    return arguments[0];
  }
  var d = [], e = Infinity;
  for (b = 0; b < c; b++) {
    for (var f = [], g = arguments[b]; g;) {
      f.unshift(g), g = g.parentNode;
    }
    d.push(f);
    e = Math.min(e, f.length);
  }
  f = null;
  for (b = 0; b < e; b++) {
    for (var g = d[0][b], h = 1; h < c; h++) {
      if (g != d[h][b]) {
        return f;
      }
    }
    f = g;
  }
  return f;
};
goog.dom.getOwnerDocument = function(a) {
  goog.asserts.assert(a, "Node cannot be null or undefined.");
  return a.nodeType == goog.dom.NodeType.DOCUMENT ? a : a.ownerDocument || a.document;
};
goog.dom.getFrameContentDocument = function(a) {
  return a.contentDocument || a.contentWindow.document;
};
goog.dom.getFrameContentWindow = function(a) {
  try {
    return a.contentWindow || (a.contentDocument ? goog.dom.getWindow(a.contentDocument) : null);
  } catch (b) {
  }
  return null;
};
goog.dom.setTextContent = function(a, b) {
  goog.asserts.assert(null != a, "goog.dom.setTextContent expects a non-null value for node");
  if ("textContent" in a) {
    a.textContent = b;
  } else {
    if (a.nodeType == goog.dom.NodeType.TEXT) {
      a.data = b;
    } else {
      if (a.firstChild && a.firstChild.nodeType == goog.dom.NodeType.TEXT) {
        for (; a.lastChild != a.firstChild;) {
          a.removeChild(a.lastChild);
        }
        a.firstChild.data = b;
      } else {
        goog.dom.removeChildren(a);
        var c = goog.dom.getOwnerDocument(a);
        a.appendChild(c.createTextNode(String(b)));
      }
    }
  }
};
goog.dom.getOuterHtml = function(a) {
  goog.asserts.assert(null !== a, "goog.dom.getOuterHtml expects a non-null value for element");
  if ("outerHTML" in a) {
    return a.outerHTML;
  }
  var b = goog.dom.getOwnerDocument(a), b = goog.dom.createElement_(b, "DIV");
  b.appendChild(a.cloneNode(!0));
  return b.innerHTML;
};
goog.dom.findNode = function(a, b) {
  var c = [];
  return goog.dom.findNodes_(a, b, c, !0) ? c[0] : void 0;
};
goog.dom.findNodes = function(a, b) {
  var c = [];
  goog.dom.findNodes_(a, b, c, !1);
  return c;
};
goog.dom.findNodes_ = function(a, b, c, d) {
  if (null != a) {
    for (a = a.firstChild; a;) {
      if (b(a) && (c.push(a), d) || goog.dom.findNodes_(a, b, c, d)) {
        return !0;
      }
      a = a.nextSibling;
    }
  }
  return !1;
};
goog.dom.TAGS_TO_IGNORE_ = {SCRIPT:1, STYLE:1, HEAD:1, IFRAME:1, OBJECT:1};
goog.dom.PREDEFINED_TAG_VALUES_ = {IMG:" ", BR:"\n"};
goog.dom.isFocusableTabIndex = function(a) {
  return goog.dom.hasSpecifiedTabIndex_(a) && goog.dom.isTabIndexFocusable_(a);
};
goog.dom.setFocusableTabIndex = function(a, b) {
  b ? a.tabIndex = 0 : (a.tabIndex = -1, a.removeAttribute("tabIndex"));
};
goog.dom.isFocusable = function(a) {
  var b;
  return (b = goog.dom.nativelySupportsFocus_(a) ? !a.disabled && (!goog.dom.hasSpecifiedTabIndex_(a) || goog.dom.isTabIndexFocusable_(a)) : goog.dom.isFocusableTabIndex(a)) && goog.userAgent.IE ? goog.dom.hasNonZeroBoundingRect_(a) : b;
};
goog.dom.hasSpecifiedTabIndex_ = function(a) {
  return goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9") ? (a = a.getAttributeNode("tabindex"), goog.isDefAndNotNull(a) && a.specified) : a.hasAttribute("tabindex");
};
goog.dom.isTabIndexFocusable_ = function(a) {
  a = a.tabIndex;
  return goog.isNumber(a) && 0 <= a && 32768 > a;
};
goog.dom.nativelySupportsFocus_ = function(a) {
  return "A" == a.tagName || "INPUT" == a.tagName || "TEXTAREA" == a.tagName || "SELECT" == a.tagName || "BUTTON" == a.tagName;
};
goog.dom.hasNonZeroBoundingRect_ = function(a) {
  a = !goog.isFunction(a.getBoundingClientRect) || goog.userAgent.IE && null == a.parentElement ? {height:a.offsetHeight, width:a.offsetWidth} : a.getBoundingClientRect();
  return goog.isDefAndNotNull(a) && 0 < a.height && 0 < a.width;
};
goog.dom.getTextContent = function(a) {
  if (goog.dom.BrowserFeature.CAN_USE_INNER_TEXT && null !== a && "innerText" in a) {
    a = goog.string.canonicalizeNewlines(a.innerText);
  } else {
    var b = [];
    goog.dom.getTextContent_(a, b, !0);
    a = b.join("");
  }
  a = a.replace(/ \xAD /g, " ").replace(/\xAD/g, "");
  a = a.replace(/\u200B/g, "");
  goog.dom.BrowserFeature.CAN_USE_INNER_TEXT || (a = a.replace(/ +/g, " "));
  " " != a && (a = a.replace(/^\s*/, ""));
  return a;
};
goog.dom.getRawTextContent = function(a) {
  var b = [];
  goog.dom.getTextContent_(a, b, !1);
  return b.join("");
};
goog.dom.getTextContent_ = function(a, b, c) {
  if (!(a.nodeName in goog.dom.TAGS_TO_IGNORE_)) {
    if (a.nodeType == goog.dom.NodeType.TEXT) {
      c ? b.push(String(a.nodeValue).replace(/(\r\n|\r|\n)/g, "")) : b.push(a.nodeValue);
    } else {
      if (a.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
        b.push(goog.dom.PREDEFINED_TAG_VALUES_[a.nodeName]);
      } else {
        for (a = a.firstChild; a;) {
          goog.dom.getTextContent_(a, b, c), a = a.nextSibling;
        }
      }
    }
  }
};
goog.dom.getNodeTextLength = function(a) {
  return goog.dom.getTextContent(a).length;
};
goog.dom.getNodeTextOffset = function(a, b) {
  b = b || goog.dom.getOwnerDocument(a).body;
  for (var c = []; a && a != b;) {
    for (var d = a; d = d.previousSibling;) {
      c.unshift(goog.dom.getTextContent(d));
    }
    a = a.parentNode;
  }
  return goog.string.trimLeft(c.join("")).replace(/ +/g, " ").length;
};
goog.dom.getNodeAtOffset = function(a, b, c) {
  a = [a];
  for (var d = 0, e = null; 0 < a.length && d < b;) {
    if (e = a.pop(), !(e.nodeName in goog.dom.TAGS_TO_IGNORE_)) {
      if (e.nodeType == goog.dom.NodeType.TEXT) {
        var f = e.nodeValue.replace(/(\r\n|\r|\n)/g, "").replace(/ +/g, " "), d = d + f.length;
      } else {
        if (e.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
          d += goog.dom.PREDEFINED_TAG_VALUES_[e.nodeName].length;
        } else {
          for (f = e.childNodes.length - 1; 0 <= f; f--) {
            a.push(e.childNodes[f]);
          }
        }
      }
    }
  }
  goog.isObject(c) && (c.remainder = e ? e.nodeValue.length + b - d - 1 : 0, c.node = e);
  return e;
};
goog.dom.isNodeList = function(a) {
  if (a && "number" == typeof a.length) {
    if (goog.isObject(a)) {
      return "function" == typeof a.item || "string" == typeof a.item;
    }
    if (goog.isFunction(a)) {
      return "function" == typeof a.item;
    }
  }
  return !1;
};
goog.dom.getAncestorByTagNameAndClass = function(a, b, c, d) {
  if (!b && !c) {
    return null;
  }
  var e = b ? String(b).toUpperCase() : null;
  return goog.dom.getAncestor(a, function(a) {
    return (!e || a.nodeName == e) && (!c || goog.isString(a.className) && goog.array.contains(a.className.split(/\s+/), c));
  }, !0, d);
};
goog.dom.getAncestorByClass = function(a, b, c) {
  return goog.dom.getAncestorByTagNameAndClass(a, null, b, c);
};
goog.dom.getAncestor = function(a, b, c, d) {
  a && !c && (a = a.parentNode);
  for (c = 0; a && (null == d || c <= d);) {
    goog.asserts.assert("parentNode" != a.name);
    if (b(a)) {
      return a;
    }
    a = a.parentNode;
    c++;
  }
  return null;
};
goog.dom.getActiveElement = function(a) {
  try {
    return a && a.activeElement;
  } catch (b) {
  }
  return null;
};
goog.dom.getPixelRatio = function() {
  var a = goog.dom.getWindow();
  return goog.isDef(a.devicePixelRatio) ? a.devicePixelRatio : a.matchMedia ? goog.dom.matchesPixelRatio_(3) || goog.dom.matchesPixelRatio_(2) || goog.dom.matchesPixelRatio_(1.5) || goog.dom.matchesPixelRatio_(1) || .75 : 1;
};
goog.dom.matchesPixelRatio_ = function(a) {
  return goog.dom.getWindow().matchMedia("(min-resolution: " + a + "dppx),(min--moz-device-pixel-ratio: " + a + "),(min-resolution: " + 96 * a + "dpi)").matches ? a : 0;
};
goog.dom.getCanvasContext2D = function(a) {
  return a.getContext("2d");
};
goog.dom.DomHelper = function(a) {
  this.document_ = a || goog.global.document || document;
};
goog.dom.DomHelper.prototype.getDomHelper = goog.dom.getDomHelper;
goog.dom.DomHelper.prototype.setDocument = function(a) {
  this.document_ = a;
};
goog.dom.DomHelper.prototype.getDocument = function() {
  return this.document_;
};
goog.dom.DomHelper.prototype.getElement = function(a) {
  return goog.dom.getElementHelper_(this.document_, a);
};
goog.dom.DomHelper.prototype.getRequiredElement = function(a) {
  return goog.dom.getRequiredElementHelper_(this.document_, a);
};
goog.dom.DomHelper.prototype.$ = goog.dom.DomHelper.prototype.getElement;
goog.dom.DomHelper.prototype.getElementsByTagName = function(a, b) {
  return (b || this.document_).getElementsByTagName(String(a));
};
goog.dom.DomHelper.prototype.getElementsByTagNameAndClass = function(a, b, c) {
  return goog.dom.getElementsByTagNameAndClass_(this.document_, a, b, c);
};
goog.dom.DomHelper.prototype.getElementsByClass = function(a, b) {
  return goog.dom.getElementsByClass(a, b || this.document_);
};
goog.dom.DomHelper.prototype.getElementByClass = function(a, b) {
  return goog.dom.getElementByClass(a, b || this.document_);
};
goog.dom.DomHelper.prototype.getRequiredElementByClass = function(a, b) {
  return goog.dom.getRequiredElementByClass(a, b || this.document_);
};
goog.dom.DomHelper.prototype.$$ = goog.dom.DomHelper.prototype.getElementsByTagNameAndClass;
goog.dom.DomHelper.prototype.setProperties = goog.dom.setProperties;
goog.dom.DomHelper.prototype.getViewportSize = function(a) {
  return goog.dom.getViewportSize(a || this.getWindow());
};
goog.dom.DomHelper.prototype.getDocumentHeight = function() {
  return goog.dom.getDocumentHeight_(this.getWindow());
};
goog.dom.DomHelper.prototype.createDom = function(a, b, c) {
  return goog.dom.createDom_(this.document_, arguments);
};
goog.dom.DomHelper.prototype.$dom = goog.dom.DomHelper.prototype.createDom;
goog.dom.DomHelper.prototype.createElement = function(a) {
  return goog.dom.createElement_(this.document_, a);
};
goog.dom.DomHelper.prototype.createTextNode = function(a) {
  return this.document_.createTextNode(String(a));
};
goog.dom.DomHelper.prototype.createTable = function(a, b, c) {
  return goog.dom.createTable_(this.document_, a, b, !!c);
};
goog.dom.DomHelper.prototype.safeHtmlToNode = function(a) {
  return goog.dom.safeHtmlToNode_(this.document_, a);
};
goog.dom.DomHelper.prototype.isCss1CompatMode = function() {
  return goog.dom.isCss1CompatMode_(this.document_);
};
goog.dom.DomHelper.prototype.getWindow = function() {
  return goog.dom.getWindow_(this.document_);
};
goog.dom.DomHelper.prototype.getDocumentScrollElement = function() {
  return goog.dom.getDocumentScrollElement_(this.document_);
};
goog.dom.DomHelper.prototype.getDocumentScroll = function() {
  return goog.dom.getDocumentScroll_(this.document_);
};
goog.dom.DomHelper.prototype.getActiveElement = function(a) {
  return goog.dom.getActiveElement(a || this.document_);
};
goog.dom.DomHelper.prototype.appendChild = goog.dom.appendChild;
goog.dom.DomHelper.prototype.append = goog.dom.append;
goog.dom.DomHelper.prototype.canHaveChildren = goog.dom.canHaveChildren;
goog.dom.DomHelper.prototype.removeChildren = goog.dom.removeChildren;
goog.dom.DomHelper.prototype.insertSiblingBefore = goog.dom.insertSiblingBefore;
goog.dom.DomHelper.prototype.insertSiblingAfter = goog.dom.insertSiblingAfter;
goog.dom.DomHelper.prototype.insertChildAt = goog.dom.insertChildAt;
goog.dom.DomHelper.prototype.removeNode = goog.dom.removeNode;
goog.dom.DomHelper.prototype.replaceNode = goog.dom.replaceNode;
goog.dom.DomHelper.prototype.flattenElement = goog.dom.flattenElement;
goog.dom.DomHelper.prototype.getChildren = goog.dom.getChildren;
goog.dom.DomHelper.prototype.getFirstElementChild = goog.dom.getFirstElementChild;
goog.dom.DomHelper.prototype.getLastElementChild = goog.dom.getLastElementChild;
goog.dom.DomHelper.prototype.getNextElementSibling = goog.dom.getNextElementSibling;
goog.dom.DomHelper.prototype.getPreviousElementSibling = goog.dom.getPreviousElementSibling;
goog.dom.DomHelper.prototype.getNextNode = goog.dom.getNextNode;
goog.dom.DomHelper.prototype.getPreviousNode = goog.dom.getPreviousNode;
goog.dom.DomHelper.prototype.isNodeLike = goog.dom.isNodeLike;
goog.dom.DomHelper.prototype.isElement = goog.dom.isElement;
goog.dom.DomHelper.prototype.isWindow = goog.dom.isWindow;
goog.dom.DomHelper.prototype.getParentElement = goog.dom.getParentElement;
goog.dom.DomHelper.prototype.contains = goog.dom.contains;
goog.dom.DomHelper.prototype.compareNodeOrder = goog.dom.compareNodeOrder;
goog.dom.DomHelper.prototype.findCommonAncestor = goog.dom.findCommonAncestor;
goog.dom.DomHelper.prototype.getOwnerDocument = goog.dom.getOwnerDocument;
goog.dom.DomHelper.prototype.getFrameContentDocument = goog.dom.getFrameContentDocument;
goog.dom.DomHelper.prototype.getFrameContentWindow = goog.dom.getFrameContentWindow;
goog.dom.DomHelper.prototype.setTextContent = goog.dom.setTextContent;
goog.dom.DomHelper.prototype.getOuterHtml = goog.dom.getOuterHtml;
goog.dom.DomHelper.prototype.findNode = goog.dom.findNode;
goog.dom.DomHelper.prototype.findNodes = goog.dom.findNodes;
goog.dom.DomHelper.prototype.isFocusableTabIndex = goog.dom.isFocusableTabIndex;
goog.dom.DomHelper.prototype.setFocusableTabIndex = goog.dom.setFocusableTabIndex;
goog.dom.DomHelper.prototype.isFocusable = goog.dom.isFocusable;
goog.dom.DomHelper.prototype.getTextContent = goog.dom.getTextContent;
goog.dom.DomHelper.prototype.getNodeTextLength = goog.dom.getNodeTextLength;
goog.dom.DomHelper.prototype.getNodeTextOffset = goog.dom.getNodeTextOffset;
goog.dom.DomHelper.prototype.getNodeAtOffset = goog.dom.getNodeAtOffset;
goog.dom.DomHelper.prototype.isNodeList = goog.dom.isNodeList;
goog.dom.DomHelper.prototype.getAncestorByTagNameAndClass = goog.dom.getAncestorByTagNameAndClass;
goog.dom.DomHelper.prototype.getAncestorByClass = goog.dom.getAncestorByClass;
goog.dom.DomHelper.prototype.getAncestor = goog.dom.getAncestor;
goog.dom.DomHelper.prototype.getCanvasContext2D = goog.dom.getCanvasContext2D;
wgxpath.userAgent = {};
wgxpath.userAgent.IE_DOC_PRE_9 = goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9);
wgxpath.userAgent.IE_DOC_PRE_8 = goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(8);
wgxpath.IEAttrWrapper = function(a, b, c, d, e) {
  this.node_ = a;
  this.nodeName = c;
  this.nodeValue = d;
  this.nodeType = goog.dom.NodeType.ATTRIBUTE;
  this.ownerElement = b;
  this.parentSourceIndex_ = e;
  this.parentNode = b;
};
wgxpath.IEAttrWrapper.forAttrOf = function(a, b, c) {
  var d = wgxpath.userAgent.IE_DOC_PRE_8 && "href" == b.nodeName ? a.getAttribute(b.nodeName, 2) : b.nodeValue;
  return new wgxpath.IEAttrWrapper(b, a, b.nodeName, d, c);
};
wgxpath.IEAttrWrapper.forStyleOf = function(a, b) {
  return new wgxpath.IEAttrWrapper(a.style, a, "style", a.style.cssText, b);
};
wgxpath.IEAttrWrapper.prototype.getParentSourceIndex = function() {
  return this.parentSourceIndex_;
};
wgxpath.IEAttrWrapper.prototype.getNode = function() {
  return this.node_;
};
wgxpath.Node = {};
wgxpath.Node.equal = function(a, b) {
  return a == b || a instanceof wgxpath.IEAttrWrapper && b instanceof wgxpath.IEAttrWrapper && a.getNode() == b.getNode();
};
wgxpath.Node.getValueAsString = function(a) {
  var b = null, c = a.nodeType;
  c == goog.dom.NodeType.ELEMENT && (b = a.textContent, b = void 0 == b || null == b ? a.innerText : b, b = void 0 == b || null == b ? "" : b);
  if ("string" != typeof b) {
    if (wgxpath.userAgent.IE_DOC_PRE_9 && "title" == a.nodeName.toLowerCase() && c == goog.dom.NodeType.ELEMENT) {
      b = a.text;
    } else {
      if (c == goog.dom.NodeType.DOCUMENT || c == goog.dom.NodeType.ELEMENT) {
        a = c == goog.dom.NodeType.DOCUMENT ? a.documentElement : a.firstChild;
        for (var c = 0, d = [], b = ""; a;) {
          do {
            a.nodeType != goog.dom.NodeType.ELEMENT && (b += a.nodeValue), wgxpath.userAgent.IE_DOC_PRE_9 && "title" == a.nodeName.toLowerCase() && (b += a.text), d[c++] = a;
          } while (a = a.firstChild);
          for (; c && !(a = d[--c].nextSibling);) {
          }
        }
      } else {
        b = a.nodeValue;
      }
    }
  }
  return "" + b;
};
wgxpath.Node.getValueAsNumber = function(a) {
  return +wgxpath.Node.getValueAsString(a);
};
wgxpath.Node.getValueAsBool = function(a) {
  return !!wgxpath.Node.getValueAsString(a);
};
wgxpath.Node.attrMatches = function(a, b, c) {
  if (goog.isNull(b)) {
    return !0;
  }
  try {
    if (!a.getAttribute) {
      return !1;
    }
  } catch (d) {
    return !1;
  }
  wgxpath.userAgent.IE_DOC_PRE_8 && "class" == b && (b = "className");
  return null == c ? !!a.getAttribute(b) : a.getAttribute(b, 2) == c;
};
wgxpath.Node.getDescendantNodes = function(a, b, c, d, e) {
  e = e || new wgxpath.NodeSet;
  var f = wgxpath.userAgent.IE_DOC_PRE_9 ? wgxpath.Node.getDescendantNodesIEPre9_ : wgxpath.Node.getDescendantNodesGeneric_;
  c = goog.isString(c) ? c : null;
  d = goog.isString(d) ? d : null;
  return f.call(null, a, b, c, d, e);
};
wgxpath.Node.getDescendantNodesIEPre9_ = function(a, b, c, d, e) {
  if (wgxpath.Node.doesNeedSpecialHandlingIEPre9_(a, c)) {
    var f = b.all;
    if (!f) {
      return e;
    }
    var g = wgxpath.Node.getNameFromTestIEPre9_(a);
    if ("*" != g && (f = b.getElementsByTagName(g), !f)) {
      return e;
    }
    if (c) {
      var h = [];
      for (a = 0; b = f[a++];) {
        wgxpath.Node.attrMatches(b, c, d) && h.push(b);
      }
      f = h;
    }
    for (a = 0; b = f[a++];) {
      "*" == g && "!" == b.tagName || e.add(b);
    }
    return e;
  }
  wgxpath.Node.doRecursiveAttrMatch_(a, b, c, d, e);
  return e;
};
wgxpath.Node.getDescendantNodesGeneric_ = function(a, b, c, d, e) {
  b.getElementsByName && d && "name" == c && !goog.userAgent.IE ? (b = b.getElementsByName(d), goog.array.forEach(b, function(b) {
    a.matches(b) && e.add(b);
  })) : b.getElementsByClassName && d && "class" == c ? (b = b.getElementsByClassName(d), goog.array.forEach(b, function(b) {
    b.className == d && a.matches(b) && e.add(b);
  })) : a instanceof wgxpath.KindTest ? wgxpath.Node.doRecursiveAttrMatch_(a, b, c, d, e) : b.getElementsByTagName && (b = b.getElementsByTagName(a.getName()), goog.array.forEach(b, function(a) {
    wgxpath.Node.attrMatches(a, c, d) && e.add(a);
  }));
  return e;
};
wgxpath.Node.getChildNodes = function(a, b, c, d, e) {
  e = e || new wgxpath.NodeSet;
  var f = wgxpath.userAgent.IE_DOC_PRE_9 ? wgxpath.Node.getChildNodesIEPre9_ : wgxpath.Node.getChildNodesGeneric_;
  c = goog.isString(c) ? c : null;
  d = goog.isString(d) ? d : null;
  return f.call(null, a, b, c, d, e);
};
wgxpath.Node.getChildNodesIEPre9_ = function(a, b, c, d, e) {
  var f;
  if (wgxpath.Node.doesNeedSpecialHandlingIEPre9_(a, c) && (f = b.childNodes)) {
    var g = wgxpath.Node.getNameFromTestIEPre9_(a);
    if ("*" != g && (f = goog.array.filter(f, function(a) {
      return a.tagName && a.tagName.toLowerCase() == g;
    }), !f)) {
      return e;
    }
    c && (f = goog.array.filter(f, function(a) {
      return wgxpath.Node.attrMatches(a, c, d);
    }));
    goog.array.forEach(f, function(a) {
      "*" == g && ("!" == a.tagName || "*" == g && a.nodeType != goog.dom.NodeType.ELEMENT) || e.add(a);
    });
    return e;
  }
  return wgxpath.Node.getChildNodesGeneric_(a, b, c, d, e);
};
wgxpath.Node.getChildNodesGeneric_ = function(a, b, c, d, e) {
  for (b = b.firstChild; b; b = b.nextSibling) {
    wgxpath.Node.attrMatches(b, c, d) && a.matches(b) && e.add(b);
  }
  return e;
};
wgxpath.Node.doRecursiveAttrMatch_ = function(a, b, c, d, e) {
  for (b = b.firstChild; b; b = b.nextSibling) {
    wgxpath.Node.attrMatches(b, c, d) && a.matches(b) && e.add(b), wgxpath.Node.doRecursiveAttrMatch_(a, b, c, d, e);
  }
};
wgxpath.Node.doesNeedSpecialHandlingIEPre9_ = function(a, b) {
  return a instanceof wgxpath.NameTest || a.getType() == goog.dom.NodeType.COMMENT || !!b && goog.isNull(a.getType());
};
wgxpath.Node.getNameFromTestIEPre9_ = function(a) {
  if (a instanceof wgxpath.KindTest) {
    if (a.getType() == goog.dom.NodeType.COMMENT) {
      return "!";
    }
    if (goog.isNull(a.getType())) {
      return "*";
    }
  }
  return a.getName();
};
wgxpath.NodeSet = function() {
  this.last_ = this.first_ = null;
  this.length_ = 0;
};
wgxpath.NodeSet.Entry_ = function(a) {
  this.node = a;
  this.next = this.prev = null;
};
wgxpath.NodeSet.merge = function(a, b) {
  if (!a.first_) {
    return b;
  }
  if (!b.first_) {
    return a;
  }
  var c = a.first_;
  b = b.first_;
  for (var d = null, e, f = 0; c && b;) {
    wgxpath.Node.equal(c.node, b.node) ? (e = c, c = c.next, b = b.next) : 0 < goog.dom.compareNodeOrder(c.node, b.node) ? (e = b, b = b.next) : (e = c, c = c.next), (e.prev = d) ? d.next = e : a.first_ = e, d = e, f++;
  }
  for (e = c || b; e;) {
    e.prev = d, d = d.next = e, f++, e = e.next;
  }
  a.last_ = d;
  a.length_ = f;
  return a;
};
wgxpath.NodeSet.prototype.unshift = function(a) {
  a = new wgxpath.NodeSet.Entry_(a);
  a.next = this.first_;
  this.last_ ? this.first_.prev = a : this.first_ = this.last_ = a;
  this.first_ = a;
  this.length_++;
};
wgxpath.NodeSet.prototype.add = function(a) {
  a = new wgxpath.NodeSet.Entry_(a);
  a.prev = this.last_;
  this.first_ ? this.last_.next = a : this.first_ = this.last_ = a;
  this.last_ = a;
  this.length_++;
};
wgxpath.NodeSet.prototype.getFirst = function() {
  var a = this.first_;
  return a ? a.node : null;
};
wgxpath.NodeSet.prototype.getLength = function() {
  return this.length_;
};
wgxpath.NodeSet.prototype.string = function() {
  var a = this.getFirst();
  return a ? wgxpath.Node.getValueAsString(a) : "";
};
wgxpath.NodeSet.prototype.number = function() {
  return +this.string();
};
wgxpath.NodeSet.prototype.iterator = function(a) {
  return new wgxpath.NodeSet.Iterator(this, !!a);
};
wgxpath.NodeSet.Iterator = function(a, b) {
  this.nodeset_ = a;
  this.current_ = (this.reverse_ = b) ? a.last_ : a.first_;
  this.lastReturned_ = null;
};
wgxpath.NodeSet.Iterator.prototype.next = function() {
  var a = this.current_;
  if (null == a) {
    return null;
  }
  var b = this.lastReturned_ = a;
  this.current_ = this.reverse_ ? a.prev : a.next;
  return b.node;
};
wgxpath.NodeSet.Iterator.prototype.remove = function() {
  var a = this.nodeset_, b = this.lastReturned_;
  if (!b) {
    throw Error("Next must be called at least once before remove.");
  }
  var c = b.prev, b = b.next;
  c ? c.next = b : a.first_ = b;
  b ? b.prev = c : a.last_ = c;
  a.length_--;
  this.lastReturned_ = null;
};
wgxpath.Expr = function(a) {
  this.dataType_ = a;
  this.needContextNode_ = this.needContextPosition_ = !1;
  this.quickAttr_ = null;
};
wgxpath.Expr.indent = function(a) {
  return "\n  " + a.toString().split("\n").join("\n  ");
};
wgxpath.Expr.prototype.evaluate = goog.abstractMethod;
wgxpath.Expr.prototype.toString = goog.abstractMethod;
wgxpath.Expr.prototype.getDataType = function() {
  return this.dataType_;
};
wgxpath.Expr.prototype.doesNeedContextPosition = function() {
  return this.needContextPosition_;
};
wgxpath.Expr.prototype.setNeedContextPosition = function(a) {
  this.needContextPosition_ = a;
};
wgxpath.Expr.prototype.doesNeedContextNode = function() {
  return this.needContextNode_;
};
wgxpath.Expr.prototype.setNeedContextNode = function(a) {
  this.needContextNode_ = a;
};
wgxpath.Expr.prototype.getQuickAttr = function() {
  return this.quickAttr_;
};
wgxpath.Expr.prototype.setQuickAttr = function(a) {
  this.quickAttr_ = a;
};
wgxpath.Expr.prototype.asNumber = function(a) {
  a = this.evaluate(a);
  return a instanceof wgxpath.NodeSet ? a.number() : +a;
};
wgxpath.Expr.prototype.asString = function(a) {
  a = this.evaluate(a);
  return a instanceof wgxpath.NodeSet ? a.string() : "" + a;
};
wgxpath.Expr.prototype.asBool = function(a) {
  a = this.evaluate(a);
  return a instanceof wgxpath.NodeSet ? !!a.getLength() : !!a;
};
wgxpath.BinaryExpr = function(a, b, c) {
  wgxpath.Expr.call(this, a.dataType_);
  this.op_ = a;
  this.left_ = b;
  this.right_ = c;
  this.setNeedContextPosition(b.doesNeedContextPosition() || c.doesNeedContextPosition());
  this.setNeedContextNode(b.doesNeedContextNode() || c.doesNeedContextNode());
  this.op_ == wgxpath.BinaryExpr.Op.EQUAL && (c.doesNeedContextNode() || c.doesNeedContextPosition() || c.getDataType() == wgxpath.DataType.NODESET || c.getDataType() == wgxpath.DataType.VOID || !b.getQuickAttr() ? b.doesNeedContextNode() || b.doesNeedContextPosition() || b.getDataType() == wgxpath.DataType.NODESET || b.getDataType() == wgxpath.DataType.VOID || !c.getQuickAttr() || this.setQuickAttr({name:c.getQuickAttr().name, valueExpr:b}) : this.setQuickAttr({name:b.getQuickAttr().name, valueExpr:c}));
};
goog.inherits(wgxpath.BinaryExpr, wgxpath.Expr);
wgxpath.BinaryExpr.compare_ = function(a, b, c, d, e) {
  b = b.evaluate(d);
  c = c.evaluate(d);
  var f;
  if (b instanceof wgxpath.NodeSet && c instanceof wgxpath.NodeSet) {
    b = b.iterator();
    for (d = b.next(); d; d = b.next()) {
      for (e = c.iterator(), f = e.next(); f; f = e.next()) {
        if (a(wgxpath.Node.getValueAsString(d), wgxpath.Node.getValueAsString(f))) {
          return !0;
        }
      }
    }
    return !1;
  }
  if (b instanceof wgxpath.NodeSet || c instanceof wgxpath.NodeSet) {
    b instanceof wgxpath.NodeSet ? (e = b, d = c) : (e = c, d = b);
    f = e.iterator();
    for (var g = typeof d, h = f.next(); h; h = f.next()) {
      switch(g) {
        case "number":
          h = wgxpath.Node.getValueAsNumber(h);
          break;
        case "boolean":
          h = wgxpath.Node.getValueAsBool(h);
          break;
        case "string":
          h = wgxpath.Node.getValueAsString(h);
          break;
        default:
          throw Error("Illegal primitive type for comparison.");
      }
      if (e == b && a(h, d) || e == c && a(d, h)) {
        return !0;
      }
    }
    return !1;
  }
  return e ? "boolean" == typeof b || "boolean" == typeof c ? a(!!b, !!c) : "number" == typeof b || "number" == typeof c ? a(+b, +c) : a(b, c) : a(+b, +c);
};
wgxpath.BinaryExpr.prototype.evaluate = function(a) {
  return this.op_.evaluate_(this.left_, this.right_, a);
};
wgxpath.BinaryExpr.prototype.toString = function() {
  var a = "Binary Expression: " + this.op_, a = a + wgxpath.Expr.indent(this.left_);
  return a += wgxpath.Expr.indent(this.right_);
};
wgxpath.BinaryExpr.Op_ = function(a, b, c, d) {
  this.opString_ = a;
  this.precedence_ = b;
  this.dataType_ = c;
  this.evaluate_ = d;
};
wgxpath.BinaryExpr.Op_.prototype.getPrecedence = function() {
  return this.precedence_;
};
wgxpath.BinaryExpr.Op_.prototype.toString = function() {
  return this.opString_;
};
wgxpath.BinaryExpr.stringToOpMap_ = {};
wgxpath.BinaryExpr.createOp_ = function(a, b, c, d) {
  if (wgxpath.BinaryExpr.stringToOpMap_.hasOwnProperty(a)) {
    throw Error("Binary operator already created: " + a);
  }
  a = new wgxpath.BinaryExpr.Op_(a, b, c, d);
  return wgxpath.BinaryExpr.stringToOpMap_[a.toString()] = a;
};
wgxpath.BinaryExpr.getOp = function(a) {
  return wgxpath.BinaryExpr.stringToOpMap_[a] || null;
};
wgxpath.BinaryExpr.Op = {DIV:wgxpath.BinaryExpr.createOp_("div", 6, wgxpath.DataType.NUMBER, function(a, b, c) {
  return a.asNumber(c) / b.asNumber(c);
}), MOD:wgxpath.BinaryExpr.createOp_("mod", 6, wgxpath.DataType.NUMBER, function(a, b, c) {
  return a.asNumber(c) % b.asNumber(c);
}), MULT:wgxpath.BinaryExpr.createOp_("*", 6, wgxpath.DataType.NUMBER, function(a, b, c) {
  return a.asNumber(c) * b.asNumber(c);
}), PLUS:wgxpath.BinaryExpr.createOp_("+", 5, wgxpath.DataType.NUMBER, function(a, b, c) {
  return a.asNumber(c) + b.asNumber(c);
}), MINUS:wgxpath.BinaryExpr.createOp_("-", 5, wgxpath.DataType.NUMBER, function(a, b, c) {
  return a.asNumber(c) - b.asNumber(c);
}), LESSTHAN:wgxpath.BinaryExpr.createOp_("<", 4, wgxpath.DataType.BOOLEAN, function(a, b, c) {
  return wgxpath.BinaryExpr.compare_(function(a, b) {
    return a < b;
  }, a, b, c);
}), GREATERTHAN:wgxpath.BinaryExpr.createOp_(">", 4, wgxpath.DataType.BOOLEAN, function(a, b, c) {
  return wgxpath.BinaryExpr.compare_(function(a, b) {
    return a > b;
  }, a, b, c);
}), LESSTHAN_EQUAL:wgxpath.BinaryExpr.createOp_("<=", 4, wgxpath.DataType.BOOLEAN, function(a, b, c) {
  return wgxpath.BinaryExpr.compare_(function(a, b) {
    return a <= b;
  }, a, b, c);
}), GREATERTHAN_EQUAL:wgxpath.BinaryExpr.createOp_(">=", 4, wgxpath.DataType.BOOLEAN, function(a, b, c) {
  return wgxpath.BinaryExpr.compare_(function(a, b) {
    return a >= b;
  }, a, b, c);
}), EQUAL:wgxpath.BinaryExpr.createOp_("=", 3, wgxpath.DataType.BOOLEAN, function(a, b, c) {
  return wgxpath.BinaryExpr.compare_(function(a, b) {
    return a == b;
  }, a, b, c, !0);
}), NOT_EQUAL:wgxpath.BinaryExpr.createOp_("!=", 3, wgxpath.DataType.BOOLEAN, function(a, b, c) {
  return wgxpath.BinaryExpr.compare_(function(a, b) {
    return a != b;
  }, a, b, c, !0);
}), AND:wgxpath.BinaryExpr.createOp_("and", 2, wgxpath.DataType.BOOLEAN, function(a, b, c) {
  return a.asBool(c) && b.asBool(c);
}), OR:wgxpath.BinaryExpr.createOp_("or", 1, wgxpath.DataType.BOOLEAN, function(a, b, c) {
  return a.asBool(c) || b.asBool(c);
})};
wgxpath.Context = function(a, b, c) {
  this.node_ = a;
  this.position_ = b || 1;
  this.last_ = c || 1;
};
wgxpath.Context.prototype.getNode = function() {
  return this.node_;
};
wgxpath.Context.prototype.getPosition = function() {
  return this.position_;
};
wgxpath.Context.prototype.getLast = function() {
  return this.last_;
};
wgxpath.Lexer = function(a) {
  this.tokens_ = a;
  this.index_ = 0;
};
wgxpath.Lexer.tokenize = function(a) {
  a = a.match(wgxpath.Lexer.TOKEN_);
  for (var b = 0; b < a.length; b++) {
    wgxpath.Lexer.LEADING_WHITESPACE_.test(a[b]) && a.splice(b, 1);
  }
  return new wgxpath.Lexer(a);
};
wgxpath.Lexer.TOKEN_ = /\$?(?:(?![0-9-\.])(?:\*|[\w-\.]+):)?(?![0-9-\.])(?:\*|[\w-\.]+)|\/\/|\.\.|::|\d+(?:\.\d*)?|\.\d+|"[^"]*"|'[^']*'|[!<>]=|\s+|./g;
wgxpath.Lexer.LEADING_WHITESPACE_ = /^\s/;
wgxpath.Lexer.prototype.peek = function(a) {
  return this.tokens_[this.index_ + (a || 0)];
};
wgxpath.Lexer.prototype.next = function() {
  return this.tokens_[this.index_++];
};
wgxpath.Lexer.prototype.back = function() {
  this.index_--;
};
wgxpath.Lexer.prototype.empty = function() {
  return this.tokens_.length <= this.index_;
};
wgxpath.FilterExpr = function(a, b) {
  if (b.getLength() && a.getDataType() != wgxpath.DataType.NODESET) {
    throw Error("Primary expression must evaluate to nodeset if filter has predicate(s).");
  }
  wgxpath.Expr.call(this, a.getDataType());
  this.primary_ = a;
  this.predicates_ = b;
  this.setNeedContextPosition(a.doesNeedContextPosition());
  this.setNeedContextNode(a.doesNeedContextNode());
};
goog.inherits(wgxpath.FilterExpr, wgxpath.Expr);
wgxpath.FilterExpr.prototype.evaluate = function(a) {
  a = this.primary_.evaluate(a);
  return this.predicates_.evaluatePredicates(a);
};
wgxpath.FilterExpr.prototype.toString = function() {
  var a = "Filter:" + wgxpath.Expr.indent(this.primary_);
  return a += wgxpath.Expr.indent(this.predicates_);
};
wgxpath.FunctionCall = function(a, b) {
  if (b.length < a.minArgs_) {
    throw Error("Function " + a.name_ + " expects at least" + a.minArgs_ + " arguments, " + b.length + " given");
  }
  if (!goog.isNull(a.maxArgs_) && b.length > a.maxArgs_) {
    throw Error("Function " + a.name_ + " expects at most " + a.maxArgs_ + " arguments, " + b.length + " given");
  }
  a.nodesetsRequired_ && goog.array.forEach(b, function(b, d) {
    if (b.getDataType() != wgxpath.DataType.NODESET) {
      throw Error("Argument " + d + " to function " + a.name_ + " is not of type Nodeset: " + b);
    }
  });
  wgxpath.Expr.call(this, a.dataType_);
  this.func_ = a;
  this.args_ = b;
  this.setNeedContextPosition(a.needContextPosition_ || goog.array.some(b, function(a) {
    return a.doesNeedContextPosition();
  }));
  this.setNeedContextNode(a.needContextNodeWithoutArgs_ && !b.length || a.needContextNodeWithArgs_ && !!b.length || goog.array.some(b, function(a) {
    return a.doesNeedContextNode();
  }));
};
goog.inherits(wgxpath.FunctionCall, wgxpath.Expr);
wgxpath.FunctionCall.prototype.evaluate = function(a) {
  return this.func_.evaluate_.apply(null, goog.array.concat(a, this.args_));
};
wgxpath.FunctionCall.prototype.toString = function() {
  var a = "Function: " + this.func_;
  if (this.args_.length) {
    var b = goog.array.reduce(this.args_, function(a, b) {
      return a + wgxpath.Expr.indent(b);
    }, "Arguments:"), a = a + wgxpath.Expr.indent(b);
  }
  return a;
};
wgxpath.FunctionCall.Func_ = function(a, b, c, d, e, f, g, h, k) {
  this.name_ = a;
  this.dataType_ = b;
  this.needContextPosition_ = c;
  this.needContextNodeWithoutArgs_ = d;
  this.needContextNodeWithArgs_ = e;
  this.evaluate_ = f;
  this.minArgs_ = g;
  this.maxArgs_ = goog.isDef(h) ? h : g;
  this.nodesetsRequired_ = !!k;
};
wgxpath.FunctionCall.Func_.prototype.toString = function() {
  return this.name_;
};
wgxpath.FunctionCall.nameToFuncMap_ = {};
wgxpath.FunctionCall.createFunc_ = function(a, b, c, d, e, f, g, h, k) {
  if (wgxpath.FunctionCall.nameToFuncMap_.hasOwnProperty(a)) {
    throw Error("Function already created: " + a + ".");
  }
  b = new wgxpath.FunctionCall.Func_(a, b, c, d, e, f, g, h, k);
  return wgxpath.FunctionCall.nameToFuncMap_[a] = b;
};
wgxpath.FunctionCall.getFunc = function(a) {
  return wgxpath.FunctionCall.nameToFuncMap_[a] || null;
};
wgxpath.FunctionCall.Func = {BOOLEAN:wgxpath.FunctionCall.createFunc_("boolean", wgxpath.DataType.BOOLEAN, !1, !1, !1, function(a, b) {
  return b.asBool(a);
}, 1), CEILING:wgxpath.FunctionCall.createFunc_("ceiling", wgxpath.DataType.NUMBER, !1, !1, !1, function(a, b) {
  return Math.ceil(b.asNumber(a));
}, 1), CONCAT:wgxpath.FunctionCall.createFunc_("concat", wgxpath.DataType.STRING, !1, !1, !1, function(a, b) {
  var c = goog.array.slice(arguments, 1);
  return goog.array.reduce(c, function(b, c) {
    return b + c.asString(a);
  }, "");
}, 2, null), CONTAINS:wgxpath.FunctionCall.createFunc_("contains", wgxpath.DataType.BOOLEAN, !1, !1, !1, function(a, b, c) {
  return goog.string.contains(b.asString(a), c.asString(a));
}, 2), COUNT:wgxpath.FunctionCall.createFunc_("count", wgxpath.DataType.NUMBER, !1, !1, !1, function(a, b) {
  return b.evaluate(a).getLength();
}, 1, 1, !0), FALSE:wgxpath.FunctionCall.createFunc_("false", wgxpath.DataType.BOOLEAN, !1, !1, !1, function(a) {
  return !1;
}, 0), FLOOR:wgxpath.FunctionCall.createFunc_("floor", wgxpath.DataType.NUMBER, !1, !1, !1, function(a, b) {
  return Math.floor(b.asNumber(a));
}, 1), ID:wgxpath.FunctionCall.createFunc_("id", wgxpath.DataType.NODESET, !1, !1, !1, function(a, b) {
  function c(a) {
    if (wgxpath.userAgent.IE_DOC_PRE_9) {
      var b = e.all[a];
      if (b) {
        if (b.nodeType && a == b.id) {
          return b;
        }
        if (b.length) {
          return goog.array.find(b, function(b) {
            return a == b.id;
          });
        }
      }
      return null;
    }
    return e.getElementById(a);
  }
  var d = a.getNode(), e = d.nodeType == goog.dom.NodeType.DOCUMENT ? d : d.ownerDocument;
  a = b.asString(a).split(/\s+/);
  var f = [];
  goog.array.forEach(a, function(a) {
    (a = c(a)) && !goog.array.contains(f, a) && f.push(a);
  });
  f.sort(goog.dom.compareNodeOrder);
  var g = new wgxpath.NodeSet;
  goog.array.forEach(f, function(a) {
    g.add(a);
  });
  return g;
}, 1), LANG:wgxpath.FunctionCall.createFunc_("lang", wgxpath.DataType.BOOLEAN, !1, !1, !1, function(a, b) {
  return !1;
}, 1), LAST:wgxpath.FunctionCall.createFunc_("last", wgxpath.DataType.NUMBER, !0, !1, !1, function(a) {
  if (1 != arguments.length) {
    throw Error("Function last expects ()");
  }
  return a.getLast();
}, 0), LOCAL_NAME:wgxpath.FunctionCall.createFunc_("local-name", wgxpath.DataType.STRING, !1, !0, !1, function(a, b) {
  return (a = b ? b.evaluate(a).getFirst() : a.getNode()) ? a.localName || a.nodeName.toLowerCase() : "";
}, 0, 1, !0), NAME:wgxpath.FunctionCall.createFunc_("name", wgxpath.DataType.STRING, !1, !0, !1, function(a, b) {
  return (a = b ? b.evaluate(a).getFirst() : a.getNode()) ? a.nodeName.toLowerCase() : "";
}, 0, 1, !0), NAMESPACE_URI:wgxpath.FunctionCall.createFunc_("namespace-uri", wgxpath.DataType.STRING, !0, !1, !1, function(a, b) {
  return "";
}, 0, 1, !0), NORMALIZE_SPACE:wgxpath.FunctionCall.createFunc_("normalize-space", wgxpath.DataType.STRING, !1, !0, !1, function(a, b) {
  a = b ? b.asString(a) : wgxpath.Node.getValueAsString(a.getNode());
  return goog.string.collapseWhitespace(a);
}, 0, 1), NOT:wgxpath.FunctionCall.createFunc_("not", wgxpath.DataType.BOOLEAN, !1, !1, !1, function(a, b) {
  return !b.asBool(a);
}, 1), NUMBER:wgxpath.FunctionCall.createFunc_("number", wgxpath.DataType.NUMBER, !1, !0, !1, function(a, b) {
  return b ? b.asNumber(a) : wgxpath.Node.getValueAsNumber(a.getNode());
}, 0, 1), POSITION:wgxpath.FunctionCall.createFunc_("position", wgxpath.DataType.NUMBER, !0, !1, !1, function(a) {
  return a.getPosition();
}, 0), ROUND:wgxpath.FunctionCall.createFunc_("round", wgxpath.DataType.NUMBER, !1, !1, !1, function(a, b) {
  return Math.round(b.asNumber(a));
}, 1), STARTS_WITH:wgxpath.FunctionCall.createFunc_("starts-with", wgxpath.DataType.BOOLEAN, !1, !1, !1, function(a, b, c) {
  return goog.string.startsWith(b.asString(a), c.asString(a));
}, 2), STRING:wgxpath.FunctionCall.createFunc_("string", wgxpath.DataType.STRING, !1, !0, !1, function(a, b) {
  return b ? b.asString(a) : wgxpath.Node.getValueAsString(a.getNode());
}, 0, 1), STRING_LENGTH:wgxpath.FunctionCall.createFunc_("string-length", wgxpath.DataType.NUMBER, !1, !0, !1, function(a, b) {
  return (b ? b.asString(a) : wgxpath.Node.getValueAsString(a.getNode())).length;
}, 0, 1), SUBSTRING:wgxpath.FunctionCall.createFunc_("substring", wgxpath.DataType.STRING, !1, !1, !1, function(a, b, c, d) {
  c = c.asNumber(a);
  if (isNaN(c) || Infinity == c || -Infinity == c) {
    return "";
  }
  d = d ? d.asNumber(a) : Infinity;
  if (isNaN(d) || -Infinity === d) {
    return "";
  }
  c = Math.round(c) - 1;
  var e = Math.max(c, 0);
  a = b.asString(a);
  return Infinity == d ? a.substring(e) : a.substring(e, c + Math.round(d));
}, 2, 3), SUBSTRING_AFTER:wgxpath.FunctionCall.createFunc_("substring-after", wgxpath.DataType.STRING, !1, !1, !1, function(a, b, c) {
  b = b.asString(a);
  a = c.asString(a);
  c = b.indexOf(a);
  return -1 == c ? "" : b.substring(c + a.length);
}, 2), SUBSTRING_BEFORE:wgxpath.FunctionCall.createFunc_("substring-before", wgxpath.DataType.STRING, !1, !1, !1, function(a, b, c) {
  b = b.asString(a);
  a = c.asString(a);
  a = b.indexOf(a);
  return -1 == a ? "" : b.substring(0, a);
}, 2), SUM:wgxpath.FunctionCall.createFunc_("sum", wgxpath.DataType.NUMBER, !1, !1, !1, function(a, b) {
  a = b.evaluate(a).iterator();
  b = 0;
  for (var c = a.next(); c; c = a.next()) {
    b += wgxpath.Node.getValueAsNumber(c);
  }
  return b;
}, 1, 1, !0), TRANSLATE:wgxpath.FunctionCall.createFunc_("translate", wgxpath.DataType.STRING, !1, !1, !1, function(a, b, c, d) {
  b = b.asString(a);
  c = c.asString(a);
  var e = d.asString(a);
  d = {};
  for (var f = 0; f < c.length; f++) {
    a = c.charAt(f), a in d || (d[a] = e.charAt(f));
  }
  c = "";
  for (f = 0; f < b.length; f++) {
    a = b.charAt(f), c += a in d ? d[a] : a;
  }
  return c;
}, 3), TRUE:wgxpath.FunctionCall.createFunc_("true", wgxpath.DataType.BOOLEAN, !1, !1, !1, function(a) {
  return !0;
}, 0)};
wgxpath.NodeTest = function() {
};
wgxpath.NodeTest.prototype.matches = goog.abstractMethod;
wgxpath.NodeTest.prototype.getName = goog.abstractMethod;
wgxpath.NodeTest.prototype.toString = goog.abstractMethod;
wgxpath.KindTest = function(a, b) {
  this.typeName_ = a;
  this.literal_ = goog.isDef(b) ? b : null;
  this.type_ = null;
  switch(a) {
    case "comment":
      this.type_ = goog.dom.NodeType.COMMENT;
      break;
    case "text":
      this.type_ = goog.dom.NodeType.TEXT;
      break;
    case "processing-instruction":
      this.type_ = goog.dom.NodeType.PROCESSING_INSTRUCTION;
      break;
    case "node":
      break;
    default:
      throw Error("Unexpected argument");
  }
};
wgxpath.KindTest.isValidType = function(a) {
  return "comment" == a || "text" == a || "processing-instruction" == a || "node" == a;
};
wgxpath.KindTest.prototype.matches = function(a) {
  return goog.isNull(this.type_) || this.type_ == a.nodeType;
};
wgxpath.KindTest.prototype.getType = function() {
  return this.type_;
};
wgxpath.KindTest.prototype.getName = function() {
  return this.typeName_;
};
wgxpath.KindTest.prototype.toString = function() {
  var a = "Kind Test: " + this.typeName_;
  goog.isNull(this.literal_) || (a += wgxpath.Expr.indent(this.literal_));
  return a;
};
wgxpath.Literal = function(a) {
  wgxpath.Expr.call(this, wgxpath.DataType.STRING);
  this.text_ = a.substring(1, a.length - 1);
};
goog.inherits(wgxpath.Literal, wgxpath.Expr);
wgxpath.Literal.prototype.evaluate = function(a) {
  return this.text_;
};
wgxpath.Literal.prototype.toString = function() {
  return "Literal: " + this.text_;
};
wgxpath.NameTest = function(a, b) {
  this.name_ = a.toLowerCase();
  a = this.name_ == wgxpath.NameTest.WILDCARD ? wgxpath.NameTest.WILDCARD : wgxpath.NameTest.HTML_NAMESPACE_URI_;
  this.namespaceUri_ = b ? b.toLowerCase() : a;
};
wgxpath.NameTest.HTML_NAMESPACE_URI_ = "http://www.w3.org/1999/xhtml";
wgxpath.NameTest.WILDCARD = "*";
wgxpath.NameTest.prototype.matches = function(a) {
  var b = a.nodeType;
  if (b != goog.dom.NodeType.ELEMENT && b != goog.dom.NodeType.ATTRIBUTE) {
    return !1;
  }
  b = goog.isDef(a.localName) ? a.localName : a.nodeName;
  if (this.name_ != wgxpath.NameTest.WILDCARD && this.name_ != b.toLowerCase()) {
    return !1;
  }
  if (this.namespaceUri_ == wgxpath.NameTest.WILDCARD) {
    return !0;
  }
  a = a.namespaceURI ? a.namespaceURI.toLowerCase() : wgxpath.NameTest.HTML_NAMESPACE_URI_;
  return this.namespaceUri_ == a;
};
wgxpath.NameTest.prototype.getName = function() {
  return this.name_;
};
wgxpath.NameTest.prototype.getNamespaceUri = function() {
  return this.namespaceUri_;
};
wgxpath.NameTest.prototype.toString = function() {
  return "Name Test: " + (this.namespaceUri_ == wgxpath.NameTest.HTML_NAMESPACE_URI_ ? "" : this.namespaceUri_ + ":") + this.name_;
};
wgxpath.Number = function(a) {
  wgxpath.Expr.call(this, wgxpath.DataType.NUMBER);
  this.value_ = a;
};
goog.inherits(wgxpath.Number, wgxpath.Expr);
wgxpath.Number.prototype.evaluate = function(a) {
  return this.value_;
};
wgxpath.Number.prototype.toString = function() {
  return "Number: " + this.value_;
};
wgxpath.PathExpr = function(a, b) {
  wgxpath.Expr.call(this, a.getDataType());
  this.filter_ = a;
  this.steps_ = b;
  this.setNeedContextPosition(a.doesNeedContextPosition());
  this.setNeedContextNode(a.doesNeedContextNode());
  1 == this.steps_.length && (a = this.steps_[0], a.doesIncludeDescendants() || a.getAxis() != wgxpath.Step.Axis.ATTRIBUTE || (a = a.getTest(), "*" != a.getName() && this.setQuickAttr({name:a.getName(), valueExpr:null})));
};
goog.inherits(wgxpath.PathExpr, wgxpath.Expr);
wgxpath.PathExpr.RootHelperExpr = function() {
  wgxpath.Expr.call(this, wgxpath.DataType.NODESET);
};
goog.inherits(wgxpath.PathExpr.RootHelperExpr, wgxpath.Expr);
wgxpath.PathExpr.RootHelperExpr.prototype.evaluate = function(a) {
  var b = new wgxpath.NodeSet;
  a = a.getNode();
  a.nodeType == goog.dom.NodeType.DOCUMENT ? b.add(a) : b.add(a.ownerDocument);
  return b;
};
wgxpath.PathExpr.RootHelperExpr.prototype.toString = function() {
  return "Root Helper Expression";
};
wgxpath.PathExpr.ContextHelperExpr = function() {
  wgxpath.Expr.call(this, wgxpath.DataType.NODESET);
};
goog.inherits(wgxpath.PathExpr.ContextHelperExpr, wgxpath.Expr);
wgxpath.PathExpr.ContextHelperExpr.prototype.evaluate = function(a) {
  var b = new wgxpath.NodeSet;
  b.add(a.getNode());
  return b;
};
wgxpath.PathExpr.ContextHelperExpr.prototype.toString = function() {
  return "Context Helper Expression";
};
wgxpath.PathExpr.isValidOp = function(a) {
  return "/" == a || "//" == a;
};
wgxpath.PathExpr.prototype.evaluate = function(a) {
  var b = this.filter_.evaluate(a);
  if (!(b instanceof wgxpath.NodeSet)) {
    throw Error("Filter expression must evaluate to nodeset.");
  }
  a = this.steps_;
  for (var c = 0, d = a.length; c < d && b.getLength(); c++) {
    var e = a[c], f = e.getAxis().isReverse(), f = b.iterator(f);
    if (e.doesNeedContextPosition() || e.getAxis() != wgxpath.Step.Axis.FOLLOWING) {
      if (e.doesNeedContextPosition() || e.getAxis() != wgxpath.Step.Axis.PRECEDING) {
        var g = f.next();
        for (b = e.evaluate(new wgxpath.Context(g)); null != (g = f.next());) {
          g = e.evaluate(new wgxpath.Context(g)), b = wgxpath.NodeSet.merge(b, g);
        }
      } else {
        g = f.next(), b = e.evaluate(new wgxpath.Context(g));
      }
    } else {
      for (g = f.next(); (b = f.next()) && (!g.contains || g.contains(b)) && b.compareDocumentPosition(g) & 8; g = b) {
      }
      b = e.evaluate(new wgxpath.Context(g));
    }
  }
  return b;
};
wgxpath.PathExpr.prototype.toString = function() {
  var a = "Path Expression:" + wgxpath.Expr.indent(this.filter_);
  if (this.steps_.length) {
    var b = goog.array.reduce(this.steps_, function(a, b) {
      return a + wgxpath.Expr.indent(b);
    }, "Steps:");
    a += wgxpath.Expr.indent(b);
  }
  return a;
};
wgxpath.Predicates = function(a, b) {
  this.predicates_ = a;
  this.reverse_ = !!b;
};
wgxpath.Predicates.prototype.evaluatePredicates = function(a, b) {
  for (b = b || 0; b < this.predicates_.length; b++) {
    for (var c = this.predicates_[b], d = a.iterator(), e = a.getLength(), f, g = 0; f = d.next(); g++) {
      var h = this.reverse_ ? e - g : g + 1;
      f = c.evaluate(new wgxpath.Context(f, h, e));
      if ("number" == typeof f) {
        h = h == f;
      } else {
        if ("string" == typeof f || "boolean" == typeof f) {
          h = !!f;
        } else {
          if (f instanceof wgxpath.NodeSet) {
            h = 0 < f.getLength();
          } else {
            throw Error("Predicate.evaluate returned an unexpected type.");
          }
        }
      }
      h || d.remove();
    }
  }
  return a;
};
wgxpath.Predicates.prototype.getQuickAttr = function() {
  return 0 < this.predicates_.length ? this.predicates_[0].getQuickAttr() : null;
};
wgxpath.Predicates.prototype.doesNeedContextPosition = function() {
  for (var a = 0; a < this.predicates_.length; a++) {
    var b = this.predicates_[a];
    if (b.doesNeedContextPosition() || b.getDataType() == wgxpath.DataType.NUMBER || b.getDataType() == wgxpath.DataType.VOID) {
      return !0;
    }
  }
  return !1;
};
wgxpath.Predicates.prototype.getLength = function() {
  return this.predicates_.length;
};
wgxpath.Predicates.prototype.getPredicates = function() {
  return this.predicates_;
};
wgxpath.Predicates.prototype.toString = function() {
  return goog.array.reduce(this.predicates_, function(a, b) {
    return a + wgxpath.Expr.indent(b);
  }, "Predicates:");
};
wgxpath.Step = function(a, b, c, d) {
  wgxpath.Expr.call(this, wgxpath.DataType.NODESET);
  this.axis_ = a;
  this.test_ = b;
  this.predicates_ = c || new wgxpath.Predicates([]);
  this.descendants_ = !!d;
  b = this.predicates_.getQuickAttr();
  a.supportsQuickAttr_ && b && (a = b.name, a = wgxpath.userAgent.IE_DOC_PRE_9 ? a.toLowerCase() : a, this.setQuickAttr({name:a, valueExpr:b.valueExpr}));
  this.setNeedContextPosition(this.predicates_.doesNeedContextPosition());
};
goog.inherits(wgxpath.Step, wgxpath.Expr);
wgxpath.Step.prototype.evaluate = function(a) {
  var b = a.getNode(), c = this.getQuickAttr(), d = null, e = null, f = 0;
  c && (d = c.name, e = c.valueExpr ? c.valueExpr.asString(a) : null, f = 1);
  if (this.descendants_) {
    if (this.doesNeedContextPosition() || this.axis_ != wgxpath.Step.Axis.CHILD) {
      if (b = (new wgxpath.Step(wgxpath.Step.Axis.DESCENDANT_OR_SELF, new wgxpath.KindTest("node"))).evaluate(a).iterator(), c = b.next()) {
        for (a = this.evaluate_(c, d, e, f); null != (c = b.next());) {
          a = wgxpath.NodeSet.merge(a, this.evaluate_(c, d, e, f));
        }
      } else {
        a = new wgxpath.NodeSet;
      }
    } else {
      a = wgxpath.Node.getDescendantNodes(this.test_, b, d, e), a = this.predicates_.evaluatePredicates(a, f);
    }
  } else {
    a = this.evaluate_(a.getNode(), d, e, f);
  }
  return a;
};
wgxpath.Step.prototype.evaluate_ = function(a, b, c, d) {
  a = this.axis_.func_(this.test_, a, b, c);
  return a = this.predicates_.evaluatePredicates(a, d);
};
wgxpath.Step.prototype.doesIncludeDescendants = function() {
  return this.descendants_;
};
wgxpath.Step.prototype.getAxis = function() {
  return this.axis_;
};
wgxpath.Step.prototype.getTest = function() {
  return this.test_;
};
wgxpath.Step.prototype.toString = function() {
  var a = "Step:" + wgxpath.Expr.indent("Operator: " + (this.descendants_ ? "//" : "/"));
  this.axis_.name_ && (a += wgxpath.Expr.indent("Axis: " + this.axis_));
  a += wgxpath.Expr.indent(this.test_);
  if (this.predicates_.getLength()) {
    var b = goog.array.reduce(this.predicates_.getPredicates(), function(a, b) {
      return a + wgxpath.Expr.indent(b);
    }, "Predicates:");
    a += wgxpath.Expr.indent(b);
  }
  return a;
};
wgxpath.Step.Axis_ = function(a, b, c, d) {
  this.name_ = a;
  this.func_ = b;
  this.reverse_ = c;
  this.supportsQuickAttr_ = d;
};
wgxpath.Step.Axis_.prototype.isReverse = function() {
  return this.reverse_;
};
wgxpath.Step.Axis_.prototype.toString = function() {
  return this.name_;
};
wgxpath.Step.nameToAxisMap_ = {};
wgxpath.Step.createAxis_ = function(a, b, c, d) {
  if (wgxpath.Step.nameToAxisMap_.hasOwnProperty(a)) {
    throw Error("Axis already created: " + a);
  }
  b = new wgxpath.Step.Axis_(a, b, c, !!d);
  return wgxpath.Step.nameToAxisMap_[a] = b;
};
wgxpath.Step.getAxis = function(a) {
  return wgxpath.Step.nameToAxisMap_[a] || null;
};
wgxpath.Step.Axis = {ANCESTOR:wgxpath.Step.createAxis_("ancestor", function(a, b) {
  for (var c = new wgxpath.NodeSet; b = b.parentNode;) {
    a.matches(b) && c.unshift(b);
  }
  return c;
}, !0), ANCESTOR_OR_SELF:wgxpath.Step.createAxis_("ancestor-or-self", function(a, b) {
  var c = new wgxpath.NodeSet;
  do {
    a.matches(b) && c.unshift(b);
  } while (b = b.parentNode);
  return c;
}, !0), ATTRIBUTE:wgxpath.Step.createAxis_("attribute", function(a, b) {
  var c = new wgxpath.NodeSet, d = a.getName();
  if ("style" == d && wgxpath.userAgent.IE_DOC_PRE_9 && b.style) {
    return c.add(wgxpath.IEAttrWrapper.forStyleOf(b, b.sourceIndex)), c;
  }
  var e = b.attributes;
  if (e) {
    if (a instanceof wgxpath.KindTest && goog.isNull(a.getType()) || "*" == d) {
      for (var d = b.sourceIndex, f = 0; a = e[f]; f++) {
        wgxpath.userAgent.IE_DOC_PRE_9 ? a.nodeValue && c.add(wgxpath.IEAttrWrapper.forAttrOf(b, a, d)) : c.add(a);
      }
    } else {
      (a = e.getNamedItem(d)) && (wgxpath.userAgent.IE_DOC_PRE_9 ? a.nodeValue && c.add(wgxpath.IEAttrWrapper.forAttrOf(b, a, b.sourceIndex)) : c.add(a));
    }
  }
  return c;
}, !1), CHILD:wgxpath.Step.createAxis_("child", wgxpath.Node.getChildNodes, !1, !0), DESCENDANT:wgxpath.Step.createAxis_("descendant", wgxpath.Node.getDescendantNodes, !1, !0), DESCENDANT_OR_SELF:wgxpath.Step.createAxis_("descendant-or-self", function(a, b, c, d) {
  var e = new wgxpath.NodeSet;
  wgxpath.Node.attrMatches(b, c, d) && a.matches(b) && e.add(b);
  return wgxpath.Node.getDescendantNodes(a, b, c, d, e);
}, !1, !0), FOLLOWING:wgxpath.Step.createAxis_("following", function(a, b, c, d) {
  var e = new wgxpath.NodeSet;
  do {
    for (var f = b; f = f.nextSibling;) {
      wgxpath.Node.attrMatches(f, c, d) && a.matches(f) && e.add(f), e = wgxpath.Node.getDescendantNodes(a, f, c, d, e);
    }
  } while (b = b.parentNode);
  return e;
}, !1, !0), FOLLOWING_SIBLING:wgxpath.Step.createAxis_("following-sibling", function(a, b) {
  for (var c = new wgxpath.NodeSet; b = b.nextSibling;) {
    a.matches(b) && c.add(b);
  }
  return c;
}, !1), NAMESPACE:wgxpath.Step.createAxis_("namespace", function(a, b) {
  return new wgxpath.NodeSet;
}, !1), PARENT:wgxpath.Step.createAxis_("parent", function(a, b) {
  var c = new wgxpath.NodeSet;
  if (b.nodeType == goog.dom.NodeType.DOCUMENT) {
    return c;
  }
  if (b.nodeType == goog.dom.NodeType.ATTRIBUTE) {
    return c.add(b.ownerElement), c;
  }
  b = b.parentNode;
  a.matches(b) && c.add(b);
  return c;
}, !1), PRECEDING:wgxpath.Step.createAxis_("preceding", function(a, b, c, d) {
  var e = new wgxpath.NodeSet, f = [];
  do {
    f.unshift(b);
  } while (b = b.parentNode);
  for (var g = 1, h = f.length; g < h; g++) {
    var k = [];
    for (b = f[g]; b = b.previousSibling;) {
      k.unshift(b);
    }
    for (var l = 0, m = k.length; l < m; l++) {
      b = k[l], wgxpath.Node.attrMatches(b, c, d) && a.matches(b) && e.add(b), e = wgxpath.Node.getDescendantNodes(a, b, c, d, e);
    }
  }
  return e;
}, !0, !0), PRECEDING_SIBLING:wgxpath.Step.createAxis_("preceding-sibling", function(a, b) {
  for (var c = new wgxpath.NodeSet; b = b.previousSibling;) {
    a.matches(b) && c.unshift(b);
  }
  return c;
}, !0), SELF:wgxpath.Step.createAxis_("self", function(a, b) {
  var c = new wgxpath.NodeSet;
  a.matches(b) && c.add(b);
  return c;
}, !1)};
wgxpath.UnaryExpr = function(a) {
  wgxpath.Expr.call(this, wgxpath.DataType.NUMBER);
  this.expr_ = a;
  this.setNeedContextPosition(a.doesNeedContextPosition());
  this.setNeedContextNode(a.doesNeedContextNode());
};
goog.inherits(wgxpath.UnaryExpr, wgxpath.Expr);
wgxpath.UnaryExpr.prototype.evaluate = function(a) {
  return -this.expr_.asNumber(a);
};
wgxpath.UnaryExpr.prototype.toString = function() {
  return "Unary Expression: -" + wgxpath.Expr.indent(this.expr_);
};
wgxpath.UnionExpr = function(a) {
  wgxpath.Expr.call(this, wgxpath.DataType.NODESET);
  this.paths_ = a;
  this.setNeedContextPosition(goog.array.some(this.paths_, function(a) {
    return a.doesNeedContextPosition();
  }));
  this.setNeedContextNode(goog.array.some(this.paths_, function(a) {
    return a.doesNeedContextNode();
  }));
};
goog.inherits(wgxpath.UnionExpr, wgxpath.Expr);
wgxpath.UnionExpr.prototype.evaluate = function(a) {
  var b = new wgxpath.NodeSet;
  goog.array.forEach(this.paths_, function(c) {
    c = c.evaluate(a);
    if (!(c instanceof wgxpath.NodeSet)) {
      throw Error("Path expression must evaluate to NodeSet.");
    }
    b = wgxpath.NodeSet.merge(b, c);
  });
  return b;
};
wgxpath.UnionExpr.prototype.toString = function() {
  return goog.array.reduce(this.paths_, function(a, b) {
    return a + wgxpath.Expr.indent(b);
  }, "Union Expression:");
};
wgxpath.Parser = function(a, b) {
  this.lexer_ = a;
  this.nsResolver_ = b;
};
wgxpath.Parser.prototype.parseExpr = function() {
  for (var a, b = [];;) {
    this.checkNotEmpty_("Missing right hand side of binary expression.");
    a = this.parseUnaryExpr_();
    var c = this.lexer_.next();
    if (!c) {
      break;
    }
    var d = (c = wgxpath.BinaryExpr.getOp(c)) && c.getPrecedence();
    if (!d) {
      this.lexer_.back();
      break;
    }
    for (; b.length && d <= b[b.length - 1].getPrecedence();) {
      a = new wgxpath.BinaryExpr(b.pop(), b.pop(), a);
    }
    b.push(a, c);
  }
  for (; b.length;) {
    a = new wgxpath.BinaryExpr(b.pop(), b.pop(), a);
  }
  return a;
};
wgxpath.Parser.prototype.checkNotEmpty_ = function(a) {
  if (this.lexer_.empty()) {
    throw Error(a);
  }
};
wgxpath.Parser.prototype.checkNextEquals_ = function(a) {
  var b = this.lexer_.next();
  if (b != a) {
    throw Error("Bad token, expected: " + a + " got: " + b);
  }
};
wgxpath.Parser.prototype.checkNextNotEquals_ = function(a) {
  var b = this.lexer_.next();
  if (b != a) {
    throw Error("Bad token: " + b);
  }
};
wgxpath.Parser.prototype.parseFilterExpr_ = function() {
  var a = this.lexer_.peek();
  var b = a.charAt(0);
  switch(b) {
    case "$":
      throw Error("Variable reference not allowed in HTML XPath");
    case "(":
      this.lexer_.next();
      a = this.parseExpr();
      this.checkNotEmpty_('unclosed "("');
      this.checkNextEquals_(")");
      break;
    case '"':
    case "'":
      a = this.parseLiteral_();
      break;
    default:
      if (isNaN(+a)) {
        if (!wgxpath.KindTest.isValidType(a) && /(?![0-9])[\w]/.test(b) && "(" == this.lexer_.peek(1)) {
          a = this.parseFunctionCall_();
        } else {
          return null;
        }
      } else {
        a = this.parseNumber_();
      }
  }
  if ("[" != this.lexer_.peek()) {
    return a;
  }
  b = new wgxpath.Predicates(this.parsePredicates_());
  return new wgxpath.FilterExpr(a, b);
};
wgxpath.Parser.prototype.parseFunctionCall_ = function() {
  var a = this.lexer_.next(), a = wgxpath.FunctionCall.getFunc(a);
  this.lexer_.next();
  for (var b = []; ")" != this.lexer_.peek();) {
    this.checkNotEmpty_("Missing function argument list.");
    b.push(this.parseExpr());
    if ("," != this.lexer_.peek()) {
      break;
    }
    this.lexer_.next();
  }
  this.checkNotEmpty_("Unclosed function argument list.");
  this.checkNextNotEquals_(")");
  return new wgxpath.FunctionCall(a, b);
};
wgxpath.Parser.prototype.parseKindTest_ = function() {
  var a = this.lexer_.next();
  if (!wgxpath.KindTest.isValidType(a)) {
    throw Error("Invalid type name: " + a);
  }
  this.checkNextEquals_("(");
  this.checkNotEmpty_("Bad nodetype");
  var b = this.lexer_.peek().charAt(0), c = null;
  if ('"' == b || "'" == b) {
    c = this.parseLiteral_();
  }
  this.checkNotEmpty_("Bad nodetype");
  this.checkNextNotEquals_(")");
  return new wgxpath.KindTest(a, c);
};
wgxpath.Parser.prototype.parseLiteral_ = function() {
  var a = this.lexer_.next();
  if (2 > a.length) {
    throw Error("Unclosed literal string");
  }
  return new wgxpath.Literal(a);
};
wgxpath.Parser.prototype.parseNameTest_ = function() {
  var a = this.lexer_.next(), b = a.indexOf(":");
  if (-1 == b) {
    return new wgxpath.NameTest(a);
  }
  var c = a.substring(0, b);
  if (c == wgxpath.NameTest.WILDCARD) {
    var d = wgxpath.NameTest.WILDCARD;
  } else {
    if (d = this.nsResolver_(c), !d) {
      throw Error("Namespace prefix not declared: " + c);
    }
  }
  a = a.substr(b + 1);
  return new wgxpath.NameTest(a, d);
};
wgxpath.Parser.prototype.parseNumber_ = function() {
  return new wgxpath.Number(+this.lexer_.next());
};
wgxpath.Parser.prototype.parsePathExpr_ = function() {
  var a = [];
  if (wgxpath.PathExpr.isValidOp(this.lexer_.peek())) {
    var b = this.lexer_.next();
    var c = this.lexer_.peek();
    if ("/" == b && (this.lexer_.empty() || "." != c && ".." != c && "@" != c && "*" != c && !/(?![0-9])[\w]/.test(c))) {
      return new wgxpath.PathExpr.RootHelperExpr;
    }
    c = new wgxpath.PathExpr.RootHelperExpr;
    this.checkNotEmpty_("Missing next location step.");
    b = this.parseStep_(b);
    a.push(b);
  } else {
    if (b = this.parseFilterExpr_()) {
      if (wgxpath.PathExpr.isValidOp(this.lexer_.peek())) {
        c = b;
      } else {
        return b;
      }
    } else {
      b = this.parseStep_("/"), c = new wgxpath.PathExpr.ContextHelperExpr, a.push(b);
    }
  }
  for (; wgxpath.PathExpr.isValidOp(this.lexer_.peek());) {
    b = this.lexer_.next(), this.checkNotEmpty_("Missing next location step."), b = this.parseStep_(b), a.push(b);
  }
  return new wgxpath.PathExpr(c, a);
};
wgxpath.Parser.prototype.parseStep_ = function(a) {
  if ("/" != a && "//" != a) {
    throw Error('Step op should be "/" or "//"');
  }
  if ("." == this.lexer_.peek()) {
    var b = new wgxpath.Step(wgxpath.Step.Axis.SELF, new wgxpath.KindTest("node"));
    this.lexer_.next();
    return b;
  }
  if (".." == this.lexer_.peek()) {
    return b = new wgxpath.Step(wgxpath.Step.Axis.PARENT, new wgxpath.KindTest("node")), this.lexer_.next(), b;
  }
  if ("@" == this.lexer_.peek()) {
    var c = wgxpath.Step.Axis.ATTRIBUTE;
    this.lexer_.next();
    this.checkNotEmpty_("Missing attribute name");
  } else {
    if ("::" == this.lexer_.peek(1)) {
      if (!/(?![0-9])[\w]/.test(this.lexer_.peek().charAt(0))) {
        throw Error("Bad token: " + this.lexer_.next());
      }
      var d = this.lexer_.next();
      c = wgxpath.Step.getAxis(d);
      if (!c) {
        throw Error("No axis with name: " + d);
      }
      this.lexer_.next();
      this.checkNotEmpty_("Missing node name");
    } else {
      c = wgxpath.Step.Axis.CHILD;
    }
  }
  d = this.lexer_.peek();
  if (/(?![0-9])[\w\*]/.test(d.charAt(0))) {
    if ("(" == this.lexer_.peek(1)) {
      if (!wgxpath.KindTest.isValidType(d)) {
        throw Error("Invalid node type: " + d);
      }
      d = this.parseKindTest_();
    } else {
      d = this.parseNameTest_();
    }
  } else {
    throw Error("Bad token: " + this.lexer_.next());
  }
  var e = new wgxpath.Predicates(this.parsePredicates_(), c.isReverse());
  return b || new wgxpath.Step(c, d, e, "//" == a);
};
wgxpath.Parser.prototype.parsePredicates_ = function() {
  for (var a = []; "[" == this.lexer_.peek();) {
    this.lexer_.next();
    this.checkNotEmpty_("Missing predicate expression.");
    var b = this.parseExpr();
    a.push(b);
    this.checkNotEmpty_("Unclosed predicate expression.");
    this.checkNextEquals_("]");
  }
  return a;
};
wgxpath.Parser.prototype.parseUnaryExpr_ = function() {
  return "-" == this.lexer_.peek() ? (this.lexer_.next(), new wgxpath.UnaryExpr(this.parseUnaryExpr_())) : this.parseUnionExpr_();
};
wgxpath.Parser.prototype.parseUnionExpr_ = function() {
  var a = this.parsePathExpr_();
  if ("|" != this.lexer_.peek()) {
    return a;
  }
  for (a = [a]; "|" == this.lexer_.next();) {
    this.checkNotEmpty_("Missing next union location path."), a.push(this.parsePathExpr_());
  }
  this.lexer_.back();
  return new wgxpath.UnionExpr(a);
};
wgxpath.nsResolver = {};
wgxpath.nsResolver.getResolver = function(a) {
  switch(a.nodeType) {
    case goog.dom.NodeType.ELEMENT:
      return goog.partial(wgxpath.nsResolver.resolveForElement_, a);
    case goog.dom.NodeType.DOCUMENT:
      return wgxpath.nsResolver.getResolver(a.documentElement);
    case goog.dom.NodeType.DOCUMENT_FRAGMENT:
    case goog.dom.NodeType.DOCUMENT_TYPE:
    case goog.dom.NodeType.ENTITY:
    case goog.dom.NodeType.NOTATION:
      return wgxpath.nsResolver.nullResolver_;
    default:
      return a.parentNode ? wgxpath.nsResolver.getResolver(a.parentNode) : wgxpath.nsResolver.nullResolver_;
  }
};
wgxpath.nsResolver.nullResolver_ = function(a) {
  return null;
};
wgxpath.nsResolver.HTML_NAMESPACE_URI_ = "http://www.w3.org/1999/xhtml";
wgxpath.nsResolver.resolveForElement_ = function(a, b) {
  if (a.prefix == b) {
    return a.namespaceURI || wgxpath.nsResolver.HTML_NAMESPACE_URI_;
  }
  var c = a.getAttributeNode("xmlns:" + b);
  return c && c.specified ? c.value || null : a.parentNode && a.parentNode.nodeType != goog.dom.NodeType.DOCUMENT ? wgxpath.nsResolver.resolveForElement_(a.parentNode, b) : null;
};
wgxpath.XPathResultType = {ANY_TYPE:0, NUMBER_TYPE:1, STRING_TYPE:2, BOOLEAN_TYPE:3, UNORDERED_NODE_ITERATOR_TYPE:4, ORDERED_NODE_ITERATOR_TYPE:5, UNORDERED_NODE_SNAPSHOT_TYPE:6, ORDERED_NODE_SNAPSHOT_TYPE:7, ANY_UNORDERED_NODE_TYPE:8, FIRST_ORDERED_NODE_TYPE:9};
wgxpath.XPathExpression_ = function(a, b) {
  if (!a.length) {
    throw Error("Empty XPath expression.");
  }
  a = wgxpath.Lexer.tokenize(a);
  if (a.empty()) {
    throw Error("Invalid XPath expression.");
  }
  b ? goog.isFunction(b) || (b = goog.bind(b.lookupNamespaceURI, b)) : b = function(a) {
    return null;
  };
  var c = (new wgxpath.Parser(a, b)).parseExpr();
  if (!a.empty()) {
    throw Error("Bad token: " + a.next());
  }
  this.evaluate = function(a, b) {
    a = c.evaluate(new wgxpath.Context(a));
    return new wgxpath.XPathResult_(a, b);
  };
};
wgxpath.XPathResult_ = function(a, b) {
  if (b == wgxpath.XPathResultType.ANY_TYPE) {
    if (a instanceof wgxpath.NodeSet) {
      b = wgxpath.XPathResultType.UNORDERED_NODE_ITERATOR_TYPE;
    } else {
      if ("string" == typeof a) {
        b = wgxpath.XPathResultType.STRING_TYPE;
      } else {
        if ("number" == typeof a) {
          b = wgxpath.XPathResultType.NUMBER_TYPE;
        } else {
          if ("boolean" == typeof a) {
            b = wgxpath.XPathResultType.BOOLEAN_TYPE;
          } else {
            throw Error("Unexpected evaluation result.");
          }
        }
      }
    }
  }
  if (b != wgxpath.XPathResultType.STRING_TYPE && b != wgxpath.XPathResultType.NUMBER_TYPE && b != wgxpath.XPathResultType.BOOLEAN_TYPE && !(a instanceof wgxpath.NodeSet)) {
    throw Error("value could not be converted to the specified type");
  }
  this.resultType = b;
  switch(b) {
    case wgxpath.XPathResultType.STRING_TYPE:
      this.stringValue = a instanceof wgxpath.NodeSet ? a.string() : "" + a;
      break;
    case wgxpath.XPathResultType.NUMBER_TYPE:
      this.numberValue = a instanceof wgxpath.NodeSet ? a.number() : +a;
      break;
    case wgxpath.XPathResultType.BOOLEAN_TYPE:
      this.booleanValue = a instanceof wgxpath.NodeSet ? 0 < a.getLength() : !!a;
      break;
    case wgxpath.XPathResultType.UNORDERED_NODE_ITERATOR_TYPE:
    case wgxpath.XPathResultType.ORDERED_NODE_ITERATOR_TYPE:
    case wgxpath.XPathResultType.UNORDERED_NODE_SNAPSHOT_TYPE:
    case wgxpath.XPathResultType.ORDERED_NODE_SNAPSHOT_TYPE:
      var c = a.iterator();
      var d = [];
      for (var e = c.next(); e; e = c.next()) {
        d.push(e instanceof wgxpath.IEAttrWrapper ? e.getNode() : e);
      }
      this.snapshotLength = a.getLength();
      this.invalidIteratorState = !1;
      break;
    case wgxpath.XPathResultType.ANY_UNORDERED_NODE_TYPE:
    case wgxpath.XPathResultType.FIRST_ORDERED_NODE_TYPE:
      a = a.getFirst();
      this.singleNodeValue = a instanceof wgxpath.IEAttrWrapper ? a.getNode() : a;
      break;
    default:
      throw Error("Unknown XPathResult type.");
  }
  var f = 0;
  this.iterateNext = function() {
    if (b != wgxpath.XPathResultType.UNORDERED_NODE_ITERATOR_TYPE && b != wgxpath.XPathResultType.ORDERED_NODE_ITERATOR_TYPE) {
      throw Error("iterateNext called with wrong result type");
    }
    return f >= d.length ? null : d[f++];
  };
  this.snapshotItem = function(a) {
    if (b != wgxpath.XPathResultType.UNORDERED_NODE_SNAPSHOT_TYPE && b != wgxpath.XPathResultType.ORDERED_NODE_SNAPSHOT_TYPE) {
      throw Error("snapshotItem called with wrong result type");
    }
    return a >= d.length || 0 > a ? null : d[a];
  };
};
wgxpath.XPathResult_.ANY_TYPE = wgxpath.XPathResultType.ANY_TYPE;
wgxpath.XPathResult_.NUMBER_TYPE = wgxpath.XPathResultType.NUMBER_TYPE;
wgxpath.XPathResult_.STRING_TYPE = wgxpath.XPathResultType.STRING_TYPE;
wgxpath.XPathResult_.BOOLEAN_TYPE = wgxpath.XPathResultType.BOOLEAN_TYPE;
wgxpath.XPathResult_.UNORDERED_NODE_ITERATOR_TYPE = wgxpath.XPathResultType.UNORDERED_NODE_ITERATOR_TYPE;
wgxpath.XPathResult_.ORDERED_NODE_ITERATOR_TYPE = wgxpath.XPathResultType.ORDERED_NODE_ITERATOR_TYPE;
wgxpath.XPathResult_.UNORDERED_NODE_SNAPSHOT_TYPE = wgxpath.XPathResultType.UNORDERED_NODE_SNAPSHOT_TYPE;
wgxpath.XPathResult_.ORDERED_NODE_SNAPSHOT_TYPE = wgxpath.XPathResultType.ORDERED_NODE_SNAPSHOT_TYPE;
wgxpath.XPathResult_.ANY_UNORDERED_NODE_TYPE = wgxpath.XPathResultType.ANY_UNORDERED_NODE_TYPE;
wgxpath.XPathResult_.FIRST_ORDERED_NODE_TYPE = wgxpath.XPathResultType.FIRST_ORDERED_NODE_TYPE;
wgxpath.XPathNSResolver_ = function(a) {
  this.lookupNamespaceURI = wgxpath.nsResolver.getResolver(a);
};
wgxpath.install = function(a, b) {
  a = a || goog.global;
  var c = a.Document && a.Document.prototype || a.document;
  if (!c.evaluate || b) {
    a.XPathResult = wgxpath.XPathResult_, c.evaluate = function(a, b, c, g, h) {
      return (new wgxpath.XPathExpression_(a, c)).evaluate(b, g);
    }, c.createExpression = function(a, b) {
      return new wgxpath.XPathExpression_(a, b);
    }, c.createNSResolver = function(a) {
      return new wgxpath.XPathNSResolver_(a);
    };
  }
};
goog.exportSymbol("wgxpath.install", wgxpath.install);
goog.exportSymbol("wgxpath.install", wgxpath.install);
wgxpath.nodeModuleExports = {};
// module.exports.install = wgxpath.install;
// module.exports.XPathResultType = wgxpath.XPathResultType;
var bot = {};
try {
  bot.window_ = window;
} catch (a) {
  bot.window_ = goog.global;
}
bot.getWindow = function() {
  return bot.window_;
};
bot.setWindow = function(a) {
  bot.window_ = a;
};
bot.getDocument = function() {
  return bot.window_.document;
};
goog.color = {};
goog.color.names = {aliceblue:"#f0f8ff", antiquewhite:"#faebd7", aqua:"#00ffff", aquamarine:"#7fffd4", azure:"#f0ffff", beige:"#f5f5dc", bisque:"#ffe4c4", black:"#000000", blanchedalmond:"#ffebcd", blue:"#0000ff", blueviolet:"#8a2be2", brown:"#a52a2a", burlywood:"#deb887", cadetblue:"#5f9ea0", chartreuse:"#7fff00", chocolate:"#d2691e", coral:"#ff7f50", cornflowerblue:"#6495ed", cornsilk:"#fff8dc", crimson:"#dc143c", cyan:"#00ffff", darkblue:"#00008b", darkcyan:"#008b8b", darkgoldenrod:"#b8860b",
darkgray:"#a9a9a9", darkgreen:"#006400", darkgrey:"#a9a9a9", darkkhaki:"#bdb76b", darkmagenta:"#8b008b", darkolivegreen:"#556b2f", darkorange:"#ff8c00", darkorchid:"#9932cc", darkred:"#8b0000", darksalmon:"#e9967a", darkseagreen:"#8fbc8f", darkslateblue:"#483d8b", darkslategray:"#2f4f4f", darkslategrey:"#2f4f4f", darkturquoise:"#00ced1", darkviolet:"#9400d3", deeppink:"#ff1493", deepskyblue:"#00bfff", dimgray:"#696969", dimgrey:"#696969", dodgerblue:"#1e90ff", firebrick:"#b22222", floralwhite:"#fffaf0",
forestgreen:"#228b22", fuchsia:"#ff00ff", gainsboro:"#dcdcdc", ghostwhite:"#f8f8ff", gold:"#ffd700", goldenrod:"#daa520", gray:"#808080", green:"#008000", greenyellow:"#adff2f", grey:"#808080", honeydew:"#f0fff0", hotpink:"#ff69b4", indianred:"#cd5c5c", indigo:"#4b0082", ivory:"#fffff0", khaki:"#f0e68c", lavender:"#e6e6fa", lavenderblush:"#fff0f5", lawngreen:"#7cfc00", lemonchiffon:"#fffacd", lightblue:"#add8e6", lightcoral:"#f08080", lightcyan:"#e0ffff", lightgoldenrodyellow:"#fafad2", lightgray:"#d3d3d3",
lightgreen:"#90ee90", lightgrey:"#d3d3d3", lightpink:"#ffb6c1", lightsalmon:"#ffa07a", lightseagreen:"#20b2aa", lightskyblue:"#87cefa", lightslategray:"#778899", lightslategrey:"#778899", lightsteelblue:"#b0c4de", lightyellow:"#ffffe0", lime:"#00ff00", limegreen:"#32cd32", linen:"#faf0e6", magenta:"#ff00ff", maroon:"#800000", mediumaquamarine:"#66cdaa", mediumblue:"#0000cd", mediumorchid:"#ba55d3", mediumpurple:"#9370db", mediumseagreen:"#3cb371", mediumslateblue:"#7b68ee", mediumspringgreen:"#00fa9a",
mediumturquoise:"#48d1cc", mediumvioletred:"#c71585", midnightblue:"#191970", mintcream:"#f5fffa", mistyrose:"#ffe4e1", moccasin:"#ffe4b5", navajowhite:"#ffdead", navy:"#000080", oldlace:"#fdf5e6", olive:"#808000", olivedrab:"#6b8e23", orange:"#ffa500", orangered:"#ff4500", orchid:"#da70d6", palegoldenrod:"#eee8aa", palegreen:"#98fb98", paleturquoise:"#afeeee", palevioletred:"#db7093", papayawhip:"#ffefd5", peachpuff:"#ffdab9", peru:"#cd853f", pink:"#ffc0cb", plum:"#dda0dd", powderblue:"#b0e0e6",
purple:"#800080", red:"#ff0000", rosybrown:"#bc8f8f", royalblue:"#4169e1", saddlebrown:"#8b4513", salmon:"#fa8072", sandybrown:"#f4a460", seagreen:"#2e8b57", seashell:"#fff5ee", sienna:"#a0522d", silver:"#c0c0c0", skyblue:"#87ceeb", slateblue:"#6a5acd", slategray:"#708090", slategrey:"#708090", snow:"#fffafa", springgreen:"#00ff7f", steelblue:"#4682b4", tan:"#d2b48c", teal:"#008080", thistle:"#d8bfd8", tomato:"#ff6347", turquoise:"#40e0d0", violet:"#ee82ee", wheat:"#f5deb3", white:"#ffffff", whitesmoke:"#f5f5f5",
yellow:"#ffff00", yellowgreen:"#9acd32"};
bot.color = {};
bot.color.standardizeColor = function(a, b) {
  return goog.array.contains(bot.color.COLOR_PROPERTIES_, a) ? (a = bot.color.maybeParseRgbaColor_(b) || bot.color.maybeParseRgbColor_(b) || bot.color.maybeConvertHexOrColorName_(b)) ? "rgba(" + a.join(", ") + ")" : b : b;
};
bot.color.COLOR_PROPERTIES_ = "backgroundColor borderTopColor borderRightColor borderBottomColor borderLeftColor color outlineColor".split(" ");
bot.color.HEX_TRIPLET_RE_ = /#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])/;
bot.color.maybeConvertHexOrColorName_ = function(a) {
  a = a.toLowerCase();
  var b = goog.color.names[a.toLowerCase()];
  if (!b && (b = "#" == a.charAt(0) ? a : "#" + a, 4 == b.length && (b = b.replace(bot.color.HEX_TRIPLET_RE_, "#$1$1$2$2$3$3")), !bot.color.VALID_HEX_COLOR_RE_.test(b))) {
    return null;
  }
  a = parseInt(b.substr(1, 2), 16);
  var c = parseInt(b.substr(3, 2), 16), b = parseInt(b.substr(5, 2), 16);
  return [a, c, b, 1];
};
bot.color.VALID_HEX_COLOR_RE_ = /^#(?:[0-9a-f]{3}){1,2}$/i;
bot.color.RGBA_COLOR_RE_ = /^(?:rgba)?\((\d{1,3}),\s?(\d{1,3}),\s?(\d{1,3}),\s?(0|1|0\.\d*)\)$/i;
bot.color.maybeParseRgbaColor_ = function(a) {
  var b = a.match(bot.color.RGBA_COLOR_RE_);
  if (b) {
    a = Number(b[1]);
    var c = Number(b[2]), d = Number(b[3]), b = Number(b[4]);
    if (0 <= a && 255 >= a && 0 <= c && 255 >= c && 0 <= d && 255 >= d && 0 <= b && 1 >= b) {
      return [a, c, d, b];
    }
  }
  return null;
};
bot.color.RGB_COLOR_RE_ = /^(?:rgb)?\((0|[1-9]\d{0,2}),\s?(0|[1-9]\d{0,2}),\s?(0|[1-9]\d{0,2})\)$/i;
bot.color.maybeParseRgbColor_ = function(a) {
  var b = a.match(bot.color.RGB_COLOR_RE_);
  if (b) {
    a = Number(b[1]);
    var c = Number(b[2]), b = Number(b[3]);
    if (0 <= a && 255 >= a && 0 <= c && 255 >= c && 0 <= b && 255 >= b) {
      return [a, c, b, 1];
    }
  }
  return null;
};
bot.ErrorCode = {SUCCESS:0, NO_SUCH_ELEMENT:7, NO_SUCH_FRAME:8, UNKNOWN_COMMAND:9, UNSUPPORTED_OPERATION:9, STALE_ELEMENT_REFERENCE:10, ELEMENT_NOT_VISIBLE:11, INVALID_ELEMENT_STATE:12, UNKNOWN_ERROR:13, ELEMENT_NOT_SELECTABLE:15, JAVASCRIPT_ERROR:17, XPATH_LOOKUP_ERROR:19, TIMEOUT:21, NO_SUCH_WINDOW:23, INVALID_COOKIE_DOMAIN:24, UNABLE_TO_SET_COOKIE:25, UNEXPECTED_ALERT_OPEN:26, NO_SUCH_ALERT:27, SCRIPT_TIMEOUT:28, INVALID_ELEMENT_COORDINATES:29, IME_NOT_AVAILABLE:30, IME_ENGINE_ACTIVATION_FAILED:31,
INVALID_SELECTOR_ERROR:32, SESSION_NOT_CREATED:33, MOVE_TARGET_OUT_OF_BOUNDS:34, SQL_DATABASE_ERROR:35, INVALID_XPATH_SELECTOR:51, INVALID_XPATH_SELECTOR_RETURN_TYPE:52, INVALID_ARGUMENT:61, METHOD_NOT_ALLOWED:405};
bot.Error = function(a, b) {
  this.code = a;
  this.state = bot.Error.CODE_TO_STATE_[a] || bot.Error.State.UNKNOWN_ERROR;
  this.message = b || "";
  a = this.state.replace(/((?:^|\s+)[a-z])/g, function(a) {
    return a.toUpperCase().replace(/^[\s\xa0]+/g, "");
  });
  b = a.length - 5;
  if (0 > b || a.indexOf("Error", b) != b) {
    a += "Error";
  }
  this.name = a;
  a = Error(this.message);
  a.name = this.name;
  this.stack = a.stack || "";
};
goog.inherits(bot.Error, Error);
bot.Error.State = {ELEMENT_NOT_SELECTABLE:"element not selectable", ELEMENT_NOT_VISIBLE:"element not visible", INVALID_ARGUMENT:"invalid argument", INVALID_COOKIE_DOMAIN:"invalid cookie domain", INVALID_ELEMENT_COORDINATES:"invalid element coordinates", INVALID_ELEMENT_STATE:"invalid element state", INVALID_SELECTOR:"invalid selector", INVALID_SESSION_ID:"invalid session id", JAVASCRIPT_ERROR:"javascript error", MOVE_TARGET_OUT_OF_BOUNDS:"move target out of bounds", NO_SUCH_ALERT:"no such alert",
NO_SUCH_ELEMENT:"no such element", NO_SUCH_FRAME:"no such frame", NO_SUCH_WINDOW:"no such window", SCRIPT_TIMEOUT:"script timeout", SESSION_NOT_CREATED:"session not created", STALE_ELEMENT_REFERENCE:"stale element reference", TIMEOUT:"timeout", UNABLE_TO_SET_COOKIE:"unable to set cookie", UNEXPECTED_ALERT_OPEN:"unexpected alert open", UNKNOWN_COMMAND:"unknown command", UNKNOWN_ERROR:"unknown error", UNKNOWN_METHOD:"unknown method", UNSUPPORTED_OPERATION:"unsupported operation"};
bot.Error.CODE_TO_STATE_ = {};
bot.Error.CODE_TO_STATE_[bot.ErrorCode.ELEMENT_NOT_SELECTABLE] = bot.Error.State.ELEMENT_NOT_SELECTABLE;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.ELEMENT_NOT_VISIBLE] = bot.Error.State.ELEMENT_NOT_VISIBLE;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.IME_ENGINE_ACTIVATION_FAILED] = bot.Error.State.UNKNOWN_ERROR;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.IME_NOT_AVAILABLE] = bot.Error.State.UNKNOWN_ERROR;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.INVALID_COOKIE_DOMAIN] = bot.Error.State.INVALID_COOKIE_DOMAIN;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.INVALID_ELEMENT_COORDINATES] = bot.Error.State.INVALID_ELEMENT_COORDINATES;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.INVALID_ELEMENT_STATE] = bot.Error.State.INVALID_ELEMENT_STATE;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.INVALID_SELECTOR_ERROR] = bot.Error.State.INVALID_SELECTOR;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.INVALID_XPATH_SELECTOR] = bot.Error.State.INVALID_SELECTOR;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.INVALID_XPATH_SELECTOR_RETURN_TYPE] = bot.Error.State.INVALID_SELECTOR;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.JAVASCRIPT_ERROR] = bot.Error.State.JAVASCRIPT_ERROR;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.METHOD_NOT_ALLOWED] = bot.Error.State.UNSUPPORTED_OPERATION;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.MOVE_TARGET_OUT_OF_BOUNDS] = bot.Error.State.MOVE_TARGET_OUT_OF_BOUNDS;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.NO_SUCH_ALERT] = bot.Error.State.NO_SUCH_ALERT;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.NO_SUCH_ELEMENT] = bot.Error.State.NO_SUCH_ELEMENT;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.NO_SUCH_FRAME] = bot.Error.State.NO_SUCH_FRAME;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.NO_SUCH_WINDOW] = bot.Error.State.NO_SUCH_WINDOW;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.SCRIPT_TIMEOUT] = bot.Error.State.SCRIPT_TIMEOUT;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.SESSION_NOT_CREATED] = bot.Error.State.SESSION_NOT_CREATED;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.STALE_ELEMENT_REFERENCE] = bot.Error.State.STALE_ELEMENT_REFERENCE;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.TIMEOUT] = bot.Error.State.TIMEOUT;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.UNABLE_TO_SET_COOKIE] = bot.Error.State.UNABLE_TO_SET_COOKIE;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.UNEXPECTED_ALERT_OPEN] = bot.Error.State.UNEXPECTED_ALERT_OPEN;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.UNKNOWN_ERROR] = bot.Error.State.UNKNOWN_ERROR;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.UNSUPPORTED_OPERATION] = bot.Error.State.UNKNOWN_COMMAND;
bot.Error.prototype.isAutomationError = !0;
goog.DEBUG && (bot.Error.prototype.toString = function() {
  return this.name + ": " + this.message;
});
goog.userAgent.product = {};
goog.userAgent.product.ASSUME_FIREFOX = !1;
goog.userAgent.product.ASSUME_IPHONE = !1;
goog.userAgent.product.ASSUME_IPAD = !1;
goog.userAgent.product.ASSUME_ANDROID = !1;
goog.userAgent.product.ASSUME_CHROME = !1;
goog.userAgent.product.ASSUME_SAFARI = !1;
goog.userAgent.product.PRODUCT_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_EDGE || goog.userAgent.ASSUME_OPERA || goog.userAgent.product.ASSUME_FIREFOX || goog.userAgent.product.ASSUME_IPHONE || goog.userAgent.product.ASSUME_IPAD || goog.userAgent.product.ASSUME_ANDROID || goog.userAgent.product.ASSUME_CHROME || goog.userAgent.product.ASSUME_SAFARI;
goog.userAgent.product.OPERA = goog.userAgent.OPERA;
goog.userAgent.product.IE = goog.userAgent.IE;
goog.userAgent.product.EDGE = goog.userAgent.EDGE;
goog.userAgent.product.FIREFOX = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_FIREFOX : goog.labs.userAgent.browser.isFirefox();
goog.userAgent.product.isIphoneOrIpod_ = function() {
  return goog.labs.userAgent.platform.isIphone() || goog.labs.userAgent.platform.isIpod();
};
goog.userAgent.product.IPHONE = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_IPHONE : goog.userAgent.product.isIphoneOrIpod_();
goog.userAgent.product.IPAD = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_IPAD : goog.labs.userAgent.platform.isIpad();
goog.userAgent.product.ANDROID = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_ANDROID : goog.labs.userAgent.browser.isAndroidBrowser();
goog.userAgent.product.CHROME = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_CHROME : goog.labs.userAgent.browser.isChrome();
goog.userAgent.product.isSafariDesktop_ = function() {
  return goog.labs.userAgent.browser.isSafari() && !goog.labs.userAgent.platform.isIos();
};
goog.userAgent.product.SAFARI = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_SAFARI : goog.userAgent.product.isSafariDesktop_();
goog.userAgent.product.determineVersion_ = function() {
  if (goog.userAgent.product.FIREFOX) {
    return goog.userAgent.product.getFirstRegExpGroup_(/Firefox\/([0-9.]+)/);
  }
  if (goog.userAgent.product.IE || goog.userAgent.product.EDGE || goog.userAgent.product.OPERA) {
    return goog.userAgent.VERSION;
  }
  if (goog.userAgent.product.CHROME) {
    return goog.labs.userAgent.platform.isIos() ? goog.userAgent.product.getFirstRegExpGroup_(/CriOS\/([0-9.]+)/) : goog.userAgent.product.getFirstRegExpGroup_(/Chrome\/([0-9.]+)/);
  }
  if (goog.userAgent.product.SAFARI && !goog.labs.userAgent.platform.isIos()) {
    return goog.userAgent.product.getFirstRegExpGroup_(/Version\/([0-9.]+)/);
  }
  if (goog.userAgent.product.IPHONE || goog.userAgent.product.IPAD) {
    var a = goog.userAgent.product.execRegExp_(/Version\/(\S+).*Mobile\/(\S+)/);
    if (a) {
      return a[1] + "." + a[2];
    }
  } else {
    if (goog.userAgent.product.ANDROID) {
      return (a = goog.userAgent.product.getFirstRegExpGroup_(/Android\s+([0-9.]+)/)) ? a : goog.userAgent.product.getFirstRegExpGroup_(/Version\/([0-9.]+)/);
    }
  }
  return "";
};
goog.userAgent.product.getFirstRegExpGroup_ = function(a) {
  return (a = goog.userAgent.product.execRegExp_(a)) ? a[1] : "";
};
goog.userAgent.product.execRegExp_ = function(a) {
  return a.exec(goog.userAgent.getUserAgentString());
};
goog.userAgent.product.VERSION = goog.userAgent.product.determineVersion_();
goog.userAgent.product.isVersion = function(a) {
  return 0 <= goog.string.compareVersions(goog.userAgent.product.VERSION, a);
};
bot.userAgent = {};
bot.userAgent.isEngineVersion = function(a) {
  return bot.userAgent.FIREFOX_EXTENSION ? bot.userAgent.FIREFOX_EXTENSION_IS_ENGINE_VERSION_(a) : goog.userAgent.IE ? 0 <= goog.string.compareVersions(goog.userAgent.DOCUMENT_MODE, a) : goog.userAgent.isVersionOrHigher(a);
};
bot.userAgent.isProductVersion = function(a) {
  return bot.userAgent.FIREFOX_EXTENSION ? bot.userAgent.FIREFOX_EXTENSION_IS_PRODUCT_VERSION_(a) : goog.userAgent.product.ANDROID ? 0 <= goog.string.compareVersions(bot.userAgent.ANDROID_VERSION_, a) : goog.userAgent.product.isVersion(a);
};
bot.userAgent.FIREFOX_EXTENSION = function() {
  if (!goog.userAgent.GECKO) {
    return !1;
  }
  var a = goog.global.Components;
  if (!a) {
    return !1;
  }
  try {
    if (!a.classes) {
      return !1;
    }
  } catch (f) {
    return !1;
  }
  var b = a.classes, a = a.interfaces, c = b["@mozilla.org/xpcom/version-comparator;1"].getService(a.nsIVersionComparator), b = b["@mozilla.org/xre/app-info;1"].getService(a.nsIXULAppInfo), d = b.platformVersion, e = b.version;
  bot.userAgent.FIREFOX_EXTENSION_IS_ENGINE_VERSION_ = function(a) {
    return 0 <= c.compare(d, "" + a);
  };
  bot.userAgent.FIREFOX_EXTENSION_IS_PRODUCT_VERSION_ = function(a) {
    return 0 <= c.compare(e, "" + a);
  };
  return !0;
}();
bot.userAgent.WEBEXTENSION = function() {
  try {
    return !!(goog.global.chrome || goog.global.browser).extension;
  } catch (a) {
    return !1;
  }
}();
bot.userAgent.IOS = goog.userAgent.product.IPAD || goog.userAgent.product.IPHONE;
bot.userAgent.MOBILE = bot.userAgent.IOS || goog.userAgent.product.ANDROID;
bot.userAgent.ANDROID_VERSION_ = function() {
  if (goog.userAgent.product.ANDROID) {
    var a = goog.userAgent.getUserAgentString();
    return (a = /Android\s+([0-9\.]+)/.exec(a)) ? a[1] : "0";
  }
  return "0";
}();
bot.userAgent.IE_DOC_PRE8 = goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(8);
bot.userAgent.IE_DOC_9 = goog.userAgent.isDocumentModeOrHigher(9);
bot.userAgent.IE_DOC_PRE9 = goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9);
bot.userAgent.IE_DOC_10 = goog.userAgent.isDocumentModeOrHigher(10);
bot.userAgent.IE_DOC_PRE10 = goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(10);
bot.userAgent.ANDROID_PRE_GINGERBREAD = goog.userAgent.product.ANDROID && !bot.userAgent.isProductVersion(2.3);
bot.userAgent.ANDROID_PRE_ICECREAMSANDWICH = goog.userAgent.product.ANDROID && !bot.userAgent.isProductVersion(4);
bot.userAgent.SAFARI_6 = goog.userAgent.product.SAFARI && bot.userAgent.isProductVersion(6);
bot.userAgent.WINDOWS_PHONE = goog.userAgent.IE && -1 != goog.userAgent.getUserAgentString().indexOf("IEMobile");
bot.dom = {};
bot.dom.core = {};
bot.dom.core.getAttribute = function(a, b) {
  b = b.toLowerCase();
  return "style" == b ? bot.dom.core.standardizeStyleAttribute_(a.style.cssText) : bot.userAgent.IE_DOC_PRE8 && "value" == b && bot.dom.core.isElement(a, "INPUT") ? a.value : bot.userAgent.IE_DOC_PRE9 && !0 === a[b] ? String(a.getAttribute(b)) : (a = a.getAttributeNode(b)) && a.specified ? a.value : null;
};
bot.dom.core.SPLIT_STYLE_ATTRIBUTE_ON_SEMICOLONS_REGEXP_ = /[;]+(?=(?:(?:[^"]*"){2})*[^"]*$)(?=(?:(?:[^']*'){2})*[^']*$)(?=(?:[^()]*\([^()]*\))*[^()]*$)/;
bot.dom.core.standardizeStyleAttribute_ = function(a) {
  a = a.split(bot.dom.core.SPLIT_STYLE_ATTRIBUTE_ON_SEMICOLONS_REGEXP_);
  var b = [];
  goog.array.forEach(a, function(a) {
    var c = a.indexOf(":");
    0 < c && (a = [a.slice(0, c), a.slice(c + 1)], 2 == a.length && b.push(a[0].toLowerCase(), ":", a[1], ";"));
  });
  b = b.join("");
  return b = ";" == b.charAt(b.length - 1) ? b : b + ";";
};
bot.dom.core.getProperty = function(a, b) {
  return bot.userAgent.IE_DOC_PRE8 && "value" == b && bot.dom.core.isElement(a, "OPTION") && goog.isNull(bot.dom.core.getAttribute(a, "value")) ? goog.dom.getRawTextContent(a) : a[b];
};
bot.dom.core.isElement = function(a, b) {
  b && "string" !== typeof b && (b = b.toString());
  return !!a && a.nodeType == goog.dom.NodeType.ELEMENT && (!b || a.tagName.toUpperCase() == b);
};
bot.dom.core.isSelectable = function(a) {
  return bot.dom.core.isElement(a, "OPTION") ? !0 : bot.dom.core.isElement(a, "INPUT") ? (a = a.type.toLowerCase(), "checkbox" == a || "radio" == a) : !1;
};
bot.dom.core.isSelected = function(a) {
  if (!bot.dom.core.isSelectable(a)) {
    throw new bot.Error(bot.ErrorCode.ELEMENT_NOT_SELECTABLE, "Element is not selectable");
  }
  var b = "selected", c = a.type && a.type.toLowerCase();
  if ("checkbox" == c || "radio" == c) {
    b = "checked";
  }
  return !!bot.dom.core.getProperty(a, b);
};
bot.locators = {};
bot.locators.xpath = {};
bot.locators.XPathResult_ = {ORDERED_NODE_SNAPSHOT_TYPE:7, FIRST_ORDERED_NODE_TYPE:9};
bot.locators.xpath.DEFAULT_RESOLVER_ = function() {
  var a = {svg:"http://www.w3.org/2000/svg"};
  return function(b) {
    return a[b] || null;
  };
}();
bot.locators.xpath.evaluate_ = function(a, b, c) {
  var d = goog.dom.getOwnerDocument(a);
  if (!d.documentElement) {
    return null;
  }
  (goog.userAgent.IE || goog.userAgent.product.ANDROID) && wgxpath.install(goog.dom.getWindow(d));
  try {
    var e = d.createNSResolver ? d.createNSResolver(d.documentElement) : bot.locators.xpath.DEFAULT_RESOLVER_;
    if (goog.userAgent.IE && !goog.userAgent.isVersionOrHigher(7)) {
      return d.evaluate.call(d, b, a, e, c, null);
    }
    if (!goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9)) {
      for (var f = {}, g = d.getElementsByTagName("*"), h = 0; h < g.length; ++h) {
        var k = g[h], l = k.namespaceURI;
        if (l && !f[l]) {
          var m = k.lookupPrefix(l);
          if (!m) {
            var n = l.match(".*/(\\w+)/?$"), m = n ? n[1] : "xhtml";
          }
          f[l] = m;
        }
      }
      var p = {}, q;
      for (q in f) {
        p[f[q]] = q;
      }
      e = function(a) {
        return p[a] || null;
      };
    }
    try {
      return d.evaluate(b, a, e, c, null);
    } catch (r) {
      if ("TypeError" === r.name) {
        return e = d.createNSResolver ? d.createNSResolver(d.documentElement) : bot.locators.xpath.DEFAULT_RESOLVER_, d.evaluate(b, a, e, c, null);
      }
      throw r;
    }
  } catch (r) {
    if (!goog.userAgent.GECKO || "NS_ERROR_ILLEGAL_VALUE" != r.name) {
      throw new bot.Error(bot.ErrorCode.INVALID_SELECTOR_ERROR, "Unable to locate an element with the xpath expression " + b + " because of the following error:\n" + r);
    }
  }
};
bot.locators.xpath.checkElement_ = function(a, b) {
  if (!a || a.nodeType != goog.dom.NodeType.ELEMENT) {
    throw new bot.Error(bot.ErrorCode.INVALID_SELECTOR_ERROR, 'The result of the xpath expression "' + b + '" is: ' + a + ". It should be an element.");
  }
};
bot.locators.xpath.single = function(a, b) {
  var c = function() {
    var c = bot.locators.xpath.evaluate_(b, a, bot.locators.XPathResult_.FIRST_ORDERED_NODE_TYPE);
    return c ? c.singleNodeValue || null : b.selectSingleNode ? (c = goog.dom.getOwnerDocument(b), c.setProperty && c.setProperty("SelectionLanguage", "XPath"), b.selectSingleNode(a)) : null;
  }();
  goog.isNull(c) || bot.locators.xpath.checkElement_(c, a);
  return c;
};
bot.locators.xpath.many = function(a, b) {
  var c = function() {
    var c = bot.locators.xpath.evaluate_(b, a, bot.locators.XPathResult_.ORDERED_NODE_SNAPSHOT_TYPE);
    if (c) {
      for (var e = c.snapshotLength, f = [], g = 0; g < e; ++g) {
        f.push(c.snapshotItem(g));
      }
      return f;
    }
    return b.selectNodes ? (c = goog.dom.getOwnerDocument(b), c.setProperty && c.setProperty("SelectionLanguage", "XPath"), b.selectNodes(a)) : [];
  }();
  goog.array.forEach(c, function(b) {
    bot.locators.xpath.checkElement_(b, a);
  });
  return c;
};
goog.math.Box = function(a, b, c, d) {
  this.top = a;
  this.right = b;
  this.bottom = c;
  this.left = d;
};
goog.math.Box.boundingBox = function(a) {
  for (var b = new goog.math.Box(arguments[0].y, arguments[0].x, arguments[0].y, arguments[0].x), c = 1; c < arguments.length; c++) {
    b.expandToIncludeCoordinate(arguments[c]);
  }
  return b;
};
goog.math.Box.prototype.getWidth = function() {
  return this.right - this.left;
};
goog.math.Box.prototype.getHeight = function() {
  return this.bottom - this.top;
};
goog.math.Box.prototype.clone = function() {
  return new goog.math.Box(this.top, this.right, this.bottom, this.left);
};
goog.DEBUG && (goog.math.Box.prototype.toString = function() {
  return "(" + this.top + "t, " + this.right + "r, " + this.bottom + "b, " + this.left + "l)";
});
goog.math.Box.prototype.contains = function(a) {
  return goog.math.Box.contains(this, a);
};
goog.math.Box.prototype.expand = function(a, b, c, d) {
  goog.isObject(a) ? (this.top -= a.top, this.right += a.right, this.bottom += a.bottom, this.left -= a.left) : (this.top -= a, this.right += Number(b), this.bottom += Number(c), this.left -= Number(d));
  return this;
};
goog.math.Box.prototype.expandToInclude = function(a) {
  this.left = Math.min(this.left, a.left);
  this.top = Math.min(this.top, a.top);
  this.right = Math.max(this.right, a.right);
  this.bottom = Math.max(this.bottom, a.bottom);
};
goog.math.Box.prototype.expandToIncludeCoordinate = function(a) {
  this.top = Math.min(this.top, a.y);
  this.right = Math.max(this.right, a.x);
  this.bottom = Math.max(this.bottom, a.y);
  this.left = Math.min(this.left, a.x);
};
goog.math.Box.equals = function(a, b) {
  return a == b ? !0 : a && b ? a.top == b.top && a.right == b.right && a.bottom == b.bottom && a.left == b.left : !1;
};
goog.math.Box.contains = function(a, b) {
  return a && b ? b instanceof goog.math.Box ? b.left >= a.left && b.right <= a.right && b.top >= a.top && b.bottom <= a.bottom : b.x >= a.left && b.x <= a.right && b.y >= a.top && b.y <= a.bottom : !1;
};
goog.math.Box.relativePositionX = function(a, b) {
  return b.x < a.left ? b.x - a.left : b.x > a.right ? b.x - a.right : 0;
};
goog.math.Box.relativePositionY = function(a, b) {
  return b.y < a.top ? b.y - a.top : b.y > a.bottom ? b.y - a.bottom : 0;
};
goog.math.Box.distance = function(a, b) {
  var c = goog.math.Box.relativePositionX(a, b);
  a = goog.math.Box.relativePositionY(a, b);
  return Math.sqrt(c * c + a * a);
};
goog.math.Box.intersects = function(a, b) {
  return a.left <= b.right && b.left <= a.right && a.top <= b.bottom && b.top <= a.bottom;
};
goog.math.Box.intersectsWithPadding = function(a, b, c) {
  return a.left <= b.right + c && b.left <= a.right + c && a.top <= b.bottom + c && b.top <= a.bottom + c;
};
goog.math.Box.prototype.ceil = function() {
  this.top = Math.ceil(this.top);
  this.right = Math.ceil(this.right);
  this.bottom = Math.ceil(this.bottom);
  this.left = Math.ceil(this.left);
  return this;
};
goog.math.Box.prototype.floor = function() {
  this.top = Math.floor(this.top);
  this.right = Math.floor(this.right);
  this.bottom = Math.floor(this.bottom);
  this.left = Math.floor(this.left);
  return this;
};
goog.math.Box.prototype.round = function() {
  this.top = Math.round(this.top);
  this.right = Math.round(this.right);
  this.bottom = Math.round(this.bottom);
  this.left = Math.round(this.left);
  return this;
};
goog.math.Box.prototype.translate = function(a, b) {
  a instanceof goog.math.Coordinate ? (this.left += a.x, this.right += a.x, this.top += a.y, this.bottom += a.y) : (goog.asserts.assertNumber(a), this.left += a, this.right += a, goog.isNumber(b) && (this.top += b, this.bottom += b));
  return this;
};
goog.math.Box.prototype.scale = function(a, b) {
  b = goog.isNumber(b) ? b : a;
  this.left *= a;
  this.right *= a;
  this.top *= b;
  this.bottom *= b;
  return this;
};
goog.math.IRect = function() {
};
goog.math.Rect = function(a, b, c, d) {
  this.left = a;
  this.top = b;
  this.width = c;
  this.height = d;
};
goog.math.Rect.prototype.clone = function() {
  return new goog.math.Rect(this.left, this.top, this.width, this.height);
};
goog.math.Rect.prototype.toBox = function() {
  return new goog.math.Box(this.top, this.left + this.width, this.top + this.height, this.left);
};
goog.math.Rect.createFromPositionAndSize = function(a, b) {
  return new goog.math.Rect(a.x, a.y, b.width, b.height);
};
goog.math.Rect.createFromBox = function(a) {
  return new goog.math.Rect(a.left, a.top, a.right - a.left, a.bottom - a.top);
};
goog.DEBUG && (goog.math.Rect.prototype.toString = function() {
  return "(" + this.left + ", " + this.top + " - " + this.width + "w x " + this.height + "h)";
});
goog.math.Rect.equals = function(a, b) {
  return a == b ? !0 : a && b ? a.left == b.left && a.width == b.width && a.top == b.top && a.height == b.height : !1;
};
goog.math.Rect.prototype.intersection = function(a) {
  var b = Math.max(this.left, a.left), c = Math.min(this.left + this.width, a.left + a.width);
  if (b <= c) {
    var d = Math.max(this.top, a.top);
    a = Math.min(this.top + this.height, a.top + a.height);
    if (d <= a) {
      return this.left = b, this.top = d, this.width = c - b, this.height = a - d, !0;
    }
  }
  return !1;
};
goog.math.Rect.intersection = function(a, b) {
  var c = Math.max(a.left, b.left), d = Math.min(a.left + a.width, b.left + b.width);
  if (c <= d) {
    var e = Math.max(a.top, b.top);
    a = Math.min(a.top + a.height, b.top + b.height);
    if (e <= a) {
      return new goog.math.Rect(c, e, d - c, a - e);
    }
  }
  return null;
};
goog.math.Rect.intersects = function(a, b) {
  return a.left <= b.left + b.width && b.left <= a.left + a.width && a.top <= b.top + b.height && b.top <= a.top + a.height;
};
goog.math.Rect.prototype.intersects = function(a) {
  return goog.math.Rect.intersects(this, a);
};
goog.math.Rect.difference = function(a, b) {
  var c = goog.math.Rect.intersection(a, b);
  if (!c || !c.height || !c.width) {
    return [a.clone()];
  }
  var c = [], d = a.top, e = a.height, f = a.left + a.width, g = a.top + a.height, h = b.left + b.width, k = b.top + b.height;
  b.top > a.top && (c.push(new goog.math.Rect(a.left, a.top, a.width, b.top - a.top)), d = b.top, e -= b.top - a.top);
  k < g && (c.push(new goog.math.Rect(a.left, k, a.width, g - k)), e = k - d);
  b.left > a.left && c.push(new goog.math.Rect(a.left, d, b.left - a.left, e));
  h < f && c.push(new goog.math.Rect(h, d, f - h, e));
  return c;
};
goog.math.Rect.prototype.difference = function(a) {
  return goog.math.Rect.difference(this, a);
};
goog.math.Rect.prototype.boundingRect = function(a) {
  var b = Math.max(this.left + this.width, a.left + a.width), c = Math.max(this.top + this.height, a.top + a.height);
  this.left = Math.min(this.left, a.left);
  this.top = Math.min(this.top, a.top);
  this.width = b - this.left;
  this.height = c - this.top;
};
goog.math.Rect.boundingRect = function(a, b) {
  if (!a || !b) {
    return null;
  }
  a = new goog.math.Rect(a.left, a.top, a.width, a.height);
  a.boundingRect(b);
  return a;
};
goog.math.Rect.prototype.contains = function(a) {
  return a instanceof goog.math.Coordinate ? a.x >= this.left && a.x <= this.left + this.width && a.y >= this.top && a.y <= this.top + this.height : this.left <= a.left && this.left + this.width >= a.left + a.width && this.top <= a.top && this.top + this.height >= a.top + a.height;
};
goog.math.Rect.prototype.squaredDistance = function(a) {
  var b = a.x < this.left ? this.left - a.x : Math.max(a.x - (this.left + this.width), 0);
  a = a.y < this.top ? this.top - a.y : Math.max(a.y - (this.top + this.height), 0);
  return b * b + a * a;
};
goog.math.Rect.prototype.distance = function(a) {
  return Math.sqrt(this.squaredDistance(a));
};
goog.math.Rect.prototype.getSize = function() {
  return new goog.math.Size(this.width, this.height);
};
goog.math.Rect.prototype.getTopLeft = function() {
  return new goog.math.Coordinate(this.left, this.top);
};
goog.math.Rect.prototype.getCenter = function() {
  return new goog.math.Coordinate(this.left + this.width / 2, this.top + this.height / 2);
};
goog.math.Rect.prototype.getBottomRight = function() {
  return new goog.math.Coordinate(this.left + this.width, this.top + this.height);
};
goog.math.Rect.prototype.ceil = function() {
  this.left = Math.ceil(this.left);
  this.top = Math.ceil(this.top);
  this.width = Math.ceil(this.width);
  this.height = Math.ceil(this.height);
  return this;
};
goog.math.Rect.prototype.floor = function() {
  this.left = Math.floor(this.left);
  this.top = Math.floor(this.top);
  this.width = Math.floor(this.width);
  this.height = Math.floor(this.height);
  return this;
};
goog.math.Rect.prototype.round = function() {
  this.left = Math.round(this.left);
  this.top = Math.round(this.top);
  this.width = Math.round(this.width);
  this.height = Math.round(this.height);
  return this;
};
goog.math.Rect.prototype.translate = function(a, b) {
  a instanceof goog.math.Coordinate ? (this.left += a.x, this.top += a.y) : (this.left += goog.asserts.assertNumber(a), goog.isNumber(b) && (this.top += b));
  return this;
};
goog.math.Rect.prototype.scale = function(a, b) {
  b = goog.isNumber(b) ? b : a;
  this.left *= a;
  this.width *= a;
  this.top *= b;
  this.height *= b;
  return this;
};
goog.dom.vendor = {};
goog.dom.vendor.getVendorJsPrefix = function() {
  return goog.userAgent.WEBKIT ? "Webkit" : goog.userAgent.GECKO ? "Moz" : goog.userAgent.IE ? "ms" : goog.userAgent.OPERA ? "O" : null;
};
goog.dom.vendor.getVendorPrefix = function() {
  return goog.userAgent.WEBKIT ? "-webkit" : goog.userAgent.GECKO ? "-moz" : goog.userAgent.IE ? "-ms" : goog.userAgent.OPERA ? "-o" : null;
};
goog.dom.vendor.getPrefixedPropertyName = function(a, b) {
  if (b && a in b) {
    return a;
  }
  var c = goog.dom.vendor.getVendorJsPrefix();
  return c ? (c = c.toLowerCase(), a = c + goog.string.toTitleCase(a), !goog.isDef(b) || a in b ? a : null) : null;
};
goog.dom.vendor.getPrefixedEventType = function(a) {
  return ((goog.dom.vendor.getVendorJsPrefix() || "") + a).toLowerCase();
};
goog.html.legacyconversions = {};
goog.html.legacyconversions.safeHtmlFromString = function(a) {
  goog.html.legacyconversions.reportCallback_();
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(a, null);
};
goog.html.legacyconversions.safeStyleFromString = function(a) {
  goog.html.legacyconversions.reportCallback_();
  return goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(a);
};
goog.html.legacyconversions.safeStyleSheetFromString = function(a) {
  goog.html.legacyconversions.reportCallback_();
  return goog.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse(a);
};
goog.html.legacyconversions.safeUrlFromString = function(a) {
  goog.html.legacyconversions.reportCallback_();
  return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a);
};
goog.html.legacyconversions.trustedResourceUrlFromString = function(a) {
  goog.html.legacyconversions.reportCallback_();
  return goog.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(a);
};
goog.html.legacyconversions.reportCallback_ = goog.nullFunction;
goog.html.legacyconversions.setReportCallback = function(a) {
  goog.html.legacyconversions.reportCallback_ = a;
};
goog.style = {};
goog.style.setStyle = function(a, b, c) {
  if (goog.isString(b)) {
    goog.style.setStyle_(a, c, b);
  } else {
    for (var d in b) {
      goog.style.setStyle_(a, b[d], d);
    }
  }
};
goog.style.setStyle_ = function(a, b, c) {
  (c = goog.style.getVendorJsStyleName_(a, c)) && (a.style[c] = b);
};
goog.style.styleNameCache_ = {};
goog.style.getVendorJsStyleName_ = function(a, b) {
  var c = goog.style.styleNameCache_[b];
  if (!c) {
    var d = goog.string.toCamelCase(b), c = d;
    void 0 === a.style[d] && (d = goog.dom.vendor.getVendorJsPrefix() + goog.string.toTitleCase(d), void 0 !== a.style[d] && (c = d));
    goog.style.styleNameCache_[b] = c;
  }
  return c;
};
goog.style.getVendorStyleName_ = function(a, b) {
  var c = goog.string.toCamelCase(b);
  return void 0 === a.style[c] && (c = goog.dom.vendor.getVendorJsPrefix() + goog.string.toTitleCase(c), void 0 !== a.style[c]) ? goog.dom.vendor.getVendorPrefix() + "-" + b : b;
};
goog.style.getStyle = function(a, b) {
  var c = a.style[goog.string.toCamelCase(b)];
  return "undefined" !== typeof c ? c : a.style[goog.style.getVendorJsStyleName_(a, b)] || "";
};
goog.style.getComputedStyle = function(a, b) {
  var c = goog.dom.getOwnerDocument(a);
  return c.defaultView && c.defaultView.getComputedStyle && (a = c.defaultView.getComputedStyle(a, null)) ? a[b] || a.getPropertyValue(b) || "" : "";
};
goog.style.getCascadedStyle = function(a, b) {
  return a.currentStyle ? a.currentStyle[b] : null;
};
goog.style.getStyle_ = function(a, b) {
  return goog.style.getComputedStyle(a, b) || goog.style.getCascadedStyle(a, b) || a.style && a.style[b];
};
goog.style.getComputedBoxSizing = function(a) {
  return goog.style.getStyle_(a, "boxSizing") || goog.style.getStyle_(a, "MozBoxSizing") || goog.style.getStyle_(a, "WebkitBoxSizing") || null;
};
goog.style.getComputedPosition = function(a) {
  return goog.style.getStyle_(a, "position");
};
goog.style.getBackgroundColor = function(a) {
  return goog.style.getStyle_(a, "backgroundColor");
};
goog.style.getComputedOverflowX = function(a) {
  return goog.style.getStyle_(a, "overflowX");
};
goog.style.getComputedOverflowY = function(a) {
  return goog.style.getStyle_(a, "overflowY");
};
goog.style.getComputedZIndex = function(a) {
  return goog.style.getStyle_(a, "zIndex");
};
goog.style.getComputedTextAlign = function(a) {
  return goog.style.getStyle_(a, "textAlign");
};
goog.style.getComputedCursor = function(a) {
  return goog.style.getStyle_(a, "cursor");
};
goog.style.getComputedTransform = function(a) {
  var b = goog.style.getVendorStyleName_(a, "transform");
  return goog.style.getStyle_(a, b) || goog.style.getStyle_(a, "transform");
};
goog.style.setPosition = function(a, b, c) {
  if (b instanceof goog.math.Coordinate) {
    var d = b.x;
    b = b.y;
  } else {
    d = b, b = c;
  }
  a.style.left = goog.style.getPixelStyleValue_(d, !1);
  a.style.top = goog.style.getPixelStyleValue_(b, !1);
};
goog.style.getPosition = function(a) {
  return new goog.math.Coordinate(a.offsetLeft, a.offsetTop);
};
goog.style.getClientViewportElement = function(a) {
  a = a ? goog.dom.getOwnerDocument(a) : goog.dom.getDocument();
  return !goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9) || goog.dom.getDomHelper(a).isCss1CompatMode() ? a.documentElement : a.body;
};
goog.style.getViewportPageOffset = function(a) {
  var b = a.body;
  a = a.documentElement;
  return new goog.math.Coordinate(b.scrollLeft || a.scrollLeft, b.scrollTop || a.scrollTop);
};
goog.style.getBoundingClientRect_ = function(a) {
  try {
    var b = a.getBoundingClientRect();
  } catch (c) {
    return {left:0, top:0, right:0, bottom:0};
  }
  goog.userAgent.IE && a.ownerDocument.body && (a = a.ownerDocument, b.left -= a.documentElement.clientLeft + a.body.clientLeft, b.top -= a.documentElement.clientTop + a.body.clientTop);
  return b;
};
goog.style.getOffsetParent = function(a) {
  if (goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(8)) {
    return goog.asserts.assert(a && "offsetParent" in a), a.offsetParent;
  }
  var b = goog.dom.getOwnerDocument(a), c = goog.style.getStyle_(a, "position"), d = "fixed" == c || "absolute" == c;
  for (a = a.parentNode; a && a != b; a = a.parentNode) {
    if (a.nodeType == goog.dom.NodeType.DOCUMENT_FRAGMENT && a.host && (a = a.host), c = goog.style.getStyle_(a, "position"), d = d && "static" == c && a != b.documentElement && a != b.body, !d && (a.scrollWidth > a.clientWidth || a.scrollHeight > a.clientHeight || "fixed" == c || "absolute" == c || "relative" == c)) {
      return a;
    }
  }
  return null;
};
goog.style.getVisibleRectForElement = function(a) {
  for (var b = new goog.math.Box(0, Infinity, Infinity, 0), c = goog.dom.getDomHelper(a), d = c.getDocument().body, e = c.getDocument().documentElement, f = c.getDocumentScrollElement(); a = goog.style.getOffsetParent(a);) {
    if (!(goog.userAgent.IE && 0 == a.clientWidth || goog.userAgent.WEBKIT && 0 == a.clientHeight && a == d) && a != d && a != e && "visible" != goog.style.getStyle_(a, "overflow")) {
      var g = goog.style.getPageOffset(a), h = goog.style.getClientLeftTop(a);
      g.x += h.x;
      g.y += h.y;
      b.top = Math.max(b.top, g.y);
      b.right = Math.min(b.right, g.x + a.clientWidth);
      b.bottom = Math.min(b.bottom, g.y + a.clientHeight);
      b.left = Math.max(b.left, g.x);
    }
  }
  d = f.scrollLeft;
  f = f.scrollTop;
  b.left = Math.max(b.left, d);
  b.top = Math.max(b.top, f);
  c = c.getViewportSize();
  b.right = Math.min(b.right, d + c.width);
  b.bottom = Math.min(b.bottom, f + c.height);
  return 0 <= b.top && 0 <= b.left && b.bottom > b.top && b.right > b.left ? b : null;
};
goog.style.getContainerOffsetToScrollInto = function(a, b, c) {
  var d = b || goog.dom.getDocumentScrollElement();
  var e = goog.style.getPageOffset(a);
  var f = goog.style.getPageOffset(d), g = goog.style.getBorderBox(d);
  d == goog.dom.getDocumentScrollElement() ? (b = e.x - d.scrollLeft, e = e.y - d.scrollTop, goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(10) && (b += g.left, e += g.top)) : (b = e.x - f.x - g.left, e = e.y - f.y - g.top);
  g = goog.style.getSizeWithDisplay_(a);
  a = d.clientWidth - g.width;
  g = d.clientHeight - g.height;
  f = d.scrollLeft;
  d = d.scrollTop;
  c ? (f += b - a / 2, d += e - g / 2) : (f += Math.min(b, Math.max(b - a, 0)), d += Math.min(e, Math.max(e - g, 0)));
  return new goog.math.Coordinate(f, d);
};
goog.style.scrollIntoContainerView = function(a, b, c) {
  b = b || goog.dom.getDocumentScrollElement();
  a = goog.style.getContainerOffsetToScrollInto(a, b, c);
  b.scrollLeft = a.x;
  b.scrollTop = a.y;
};
goog.style.getClientLeftTop = function(a) {
  return new goog.math.Coordinate(a.clientLeft, a.clientTop);
};
goog.style.getPageOffset = function(a) {
  var b = goog.dom.getOwnerDocument(a);
  goog.asserts.assertObject(a, "Parameter is required");
  var c = new goog.math.Coordinate(0, 0), d = goog.style.getClientViewportElement(b);
  if (a == d) {
    return c;
  }
  a = goog.style.getBoundingClientRect_(a);
  b = goog.dom.getDomHelper(b).getDocumentScroll();
  c.x = a.left + b.x;
  c.y = a.top + b.y;
  return c;
};
goog.style.getPageOffsetLeft = function(a) {
  return goog.style.getPageOffset(a).x;
};
goog.style.getPageOffsetTop = function(a) {
  return goog.style.getPageOffset(a).y;
};
goog.style.getFramedPageOffset = function(a, b) {
  var c = new goog.math.Coordinate(0, 0), d = goog.dom.getWindow(goog.dom.getOwnerDocument(a));
  if (!goog.reflect.canAccessProperty(d, "parent")) {
    return c;
  }
  do {
    var e = d == b ? goog.style.getPageOffset(a) : goog.style.getClientPositionForElement_(goog.asserts.assert(a));
    c.x += e.x;
    c.y += e.y;
  } while (d && d != b && d != d.parent && (a = d.frameElement) && (d = d.parent));
  return c;
};
goog.style.translateRectForAnotherFrame = function(a, b, c) {
  if (b.getDocument() != c.getDocument()) {
    var d = b.getDocument().body;
    c = goog.style.getFramedPageOffset(d, c.getWindow());
    c = goog.math.Coordinate.difference(c, goog.style.getPageOffset(d));
    !goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9) || b.isCss1CompatMode() || (c = goog.math.Coordinate.difference(c, b.getDocumentScroll()));
    a.left += c.x;
    a.top += c.y;
  }
};
goog.style.getRelativePosition = function(a, b) {
  a = goog.style.getClientPosition(a);
  b = goog.style.getClientPosition(b);
  return new goog.math.Coordinate(a.x - b.x, a.y - b.y);
};
goog.style.getClientPositionForElement_ = function(a) {
  a = goog.style.getBoundingClientRect_(a);
  return new goog.math.Coordinate(a.left, a.top);
};
goog.style.getClientPosition = function(a) {
  goog.asserts.assert(a);
  if (a.nodeType == goog.dom.NodeType.ELEMENT) {
    return goog.style.getClientPositionForElement_(a);
  }
  a = a.changedTouches ? a.changedTouches[0] : a;
  return new goog.math.Coordinate(a.clientX, a.clientY);
};
goog.style.setPageOffset = function(a, b, c) {
  var d = goog.style.getPageOffset(a);
  b instanceof goog.math.Coordinate && (c = b.y, b = b.x);
  b = goog.asserts.assertNumber(b) - d.x;
  goog.style.setPosition(a, a.offsetLeft + b, a.offsetTop + (Number(c) - d.y));
};
goog.style.setSize = function(a, b, c) {
  if (b instanceof goog.math.Size) {
    c = b.height, b = b.width;
  } else {
    if (void 0 == c) {
      throw Error("missing height argument");
    }
  }
  goog.style.setWidth(a, b);
  goog.style.setHeight(a, c);
};
goog.style.getPixelStyleValue_ = function(a, b) {
  "number" == typeof a && (a = (b ? Math.round(a) : a) + "px");
  return a;
};
goog.style.setHeight = function(a, b) {
  a.style.height = goog.style.getPixelStyleValue_(b, !0);
};
goog.style.setWidth = function(a, b) {
  a.style.width = goog.style.getPixelStyleValue_(b, !0);
};
goog.style.getSize = function(a) {
  return goog.style.evaluateWithTemporaryDisplay_(goog.style.getSizeWithDisplay_, a);
};
goog.style.evaluateWithTemporaryDisplay_ = function(a, b) {
  if ("none" != goog.style.getStyle_(b, "display")) {
    return a(b);
  }
  var c = b.style, d = c.display, e = c.visibility, f = c.position;
  c.visibility = "hidden";
  c.position = "absolute";
  c.display = "inline";
  a = a(b);
  c.display = d;
  c.position = f;
  c.visibility = e;
  return a;
};
goog.style.getSizeWithDisplay_ = function(a) {
  var b = a.offsetWidth, c = a.offsetHeight, d = goog.userAgent.WEBKIT && !b && !c;
  return goog.isDef(b) && !d || !a.getBoundingClientRect ? new goog.math.Size(b, c) : (a = goog.style.getBoundingClientRect_(a), new goog.math.Size(a.right - a.left, a.bottom - a.top));
};
goog.style.getTransformedSize = function(a) {
  if (!a.getBoundingClientRect) {
    return null;
  }
  a = goog.style.evaluateWithTemporaryDisplay_(goog.style.getBoundingClientRect_, a);
  return new goog.math.Size(a.right - a.left, a.bottom - a.top);
};
goog.style.getBounds = function(a) {
  var b = goog.style.getPageOffset(a);
  a = goog.style.getSize(a);
  return new goog.math.Rect(b.x, b.y, a.width, a.height);
};
goog.style.toCamelCase = function(a) {
  return goog.string.toCamelCase(String(a));
};
goog.style.toSelectorCase = function(a) {
  return goog.string.toSelectorCase(a);
};
goog.style.getOpacity = function(a) {
  goog.asserts.assert(a);
  var b = a.style;
  a = "";
  "opacity" in b ? a = b.opacity : "MozOpacity" in b ? a = b.MozOpacity : "filter" in b && (b = b.filter.match(/alpha\(opacity=([\d.]+)\)/)) && (a = String(b[1] / 100));
  return "" == a ? a : Number(a);
};
goog.style.setOpacity = function(a, b) {
  goog.asserts.assert(a);
  a = a.style;
  "opacity" in a ? a.opacity = b : "MozOpacity" in a ? a.MozOpacity = b : "filter" in a && (a.filter = "" === b ? "" : "alpha(opacity=" + 100 * Number(b) + ")");
};
goog.style.setTransparentBackgroundImage = function(a, b) {
  a = a.style;
  goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("8") ? a.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + b + '", sizingMethod="crop")' : (a.backgroundImage = "url(" + b + ")", a.backgroundPosition = "top left", a.backgroundRepeat = "no-repeat");
};
goog.style.clearTransparentBackgroundImage = function(a) {
  a = a.style;
  "filter" in a ? a.filter = "" : a.backgroundImage = "none";
};
goog.style.showElement = function(a, b) {
  goog.style.setElementShown(a, b);
};
goog.style.setElementShown = function(a, b) {
  a.style.display = b ? "" : "none";
};
goog.style.isElementShown = function(a) {
  return "none" != a.style.display;
};
goog.style.installStyles = function(a, b) {
  return goog.style.installSafeStyleSheet(goog.html.legacyconversions.safeStyleSheetFromString(a), b);
};
goog.style.installSafeStyleSheet = function(a, b) {
  b = goog.dom.getDomHelper(b);
  var c = b.getDocument();
  if (goog.userAgent.IE && c.createStyleSheet) {
    var d = c.createStyleSheet();
    goog.style.setSafeStyleSheet(d, a);
  } else {
    c = b.getElementsByTagNameAndClass("HEAD")[0], c || (d = b.getElementsByTagNameAndClass("BODY")[0], c = b.createDom("HEAD"), d.parentNode.insertBefore(c, d)), d = b.createDom("STYLE"), goog.style.setSafeStyleSheet(d, a), b.appendChild(c, d);
  }
  return d;
};
goog.style.uninstallStyles = function(a) {
  goog.dom.removeNode(a.ownerNode || a.owningElement || a);
};
goog.style.setStyles = function(a, b) {
  goog.style.setSafeStyleSheet(a, goog.html.legacyconversions.safeStyleSheetFromString(b));
};
goog.style.setSafeStyleSheet = function(a, b) {
  b = goog.html.SafeStyleSheet.unwrap(b);
  goog.userAgent.IE && goog.isDef(a.cssText) ? a.cssText = b : a.innerHTML = b;
};
goog.style.setPreWrap = function(a) {
  a = a.style;
  goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("8") ? (a.whiteSpace = "pre", a.wordWrap = "break-word") : a.whiteSpace = goog.userAgent.GECKO ? "-moz-pre-wrap" : "pre-wrap";
};
goog.style.setInlineBlock = function(a) {
  a = a.style;
  a.position = "relative";
  goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("8") ? (a.zoom = "1", a.display = "inline") : a.display = "inline-block";
};
goog.style.isRightToLeft = function(a) {
  return "rtl" == goog.style.getStyle_(a, "direction");
};
goog.style.unselectableStyle_ = goog.userAgent.GECKO ? "MozUserSelect" : goog.userAgent.WEBKIT || goog.userAgent.EDGE ? "WebkitUserSelect" : null;
goog.style.isUnselectable = function(a) {
  return goog.style.unselectableStyle_ ? "none" == a.style[goog.style.unselectableStyle_].toLowerCase() : goog.userAgent.IE || goog.userAgent.OPERA ? "on" == a.getAttribute("unselectable") : !1;
};
goog.style.setUnselectable = function(a, b, c) {
  c = c ? null : a.getElementsByTagName("*");
  var d = goog.style.unselectableStyle_;
  if (d) {
    if (b = b ? "none" : "", a.style && (a.style[d] = b), c) {
      a = 0;
      for (var e; e = c[a]; a++) {
        e.style && (e.style[d] = b);
      }
    }
  } else {
    if (goog.userAgent.IE || goog.userAgent.OPERA) {
      if (b = b ? "on" : "", a.setAttribute("unselectable", b), c) {
        for (a = 0; e = c[a]; a++) {
          e.setAttribute("unselectable", b);
        }
      }
    }
  }
};
goog.style.getBorderBoxSize = function(a) {
  return new goog.math.Size(a.offsetWidth, a.offsetHeight);
};
goog.style.setBorderBoxSize = function(a, b) {
  var c = goog.dom.getOwnerDocument(a), d = goog.dom.getDomHelper(c).isCss1CompatMode();
  !goog.userAgent.IE || goog.userAgent.isVersionOrHigher("10") || d && goog.userAgent.isVersionOrHigher("8") ? goog.style.setBoxSizingSize_(a, b, "border-box") : (c = a.style, d ? (d = goog.style.getPaddingBox(a), a = goog.style.getBorderBox(a), c.pixelWidth = b.width - a.left - d.left - d.right - a.right, c.pixelHeight = b.height - a.top - d.top - d.bottom - a.bottom) : (c.pixelWidth = b.width, c.pixelHeight = b.height));
};
goog.style.getContentBoxSize = function(a) {
  var b = goog.dom.getOwnerDocument(a), c = goog.userAgent.IE && a.currentStyle;
  if (c && goog.dom.getDomHelper(b).isCss1CompatMode() && "auto" != c.width && "auto" != c.height && !c.boxSizing) {
    return b = goog.style.getIePixelValue_(a, c.width, "width", "pixelWidth"), a = goog.style.getIePixelValue_(a, c.height, "height", "pixelHeight"), new goog.math.Size(b, a);
  }
  c = goog.style.getBorderBoxSize(a);
  b = goog.style.getPaddingBox(a);
  a = goog.style.getBorderBox(a);
  return new goog.math.Size(c.width - a.left - b.left - b.right - a.right, c.height - a.top - b.top - b.bottom - a.bottom);
};
goog.style.setContentBoxSize = function(a, b) {
  var c = goog.dom.getOwnerDocument(a), d = goog.dom.getDomHelper(c).isCss1CompatMode();
  !goog.userAgent.IE || goog.userAgent.isVersionOrHigher("10") || d && goog.userAgent.isVersionOrHigher("8") ? goog.style.setBoxSizingSize_(a, b, "content-box") : (c = a.style, d ? (c.pixelWidth = b.width, c.pixelHeight = b.height) : (d = goog.style.getPaddingBox(a), a = goog.style.getBorderBox(a), c.pixelWidth = b.width + a.left + d.left + d.right + a.right, c.pixelHeight = b.height + a.top + d.top + d.bottom + a.bottom));
};
goog.style.setBoxSizingSize_ = function(a, b, c) {
  a = a.style;
  goog.userAgent.GECKO ? a.MozBoxSizing = c : goog.userAgent.WEBKIT ? a.WebkitBoxSizing = c : a.boxSizing = c;
  a.width = Math.max(b.width, 0) + "px";
  a.height = Math.max(b.height, 0) + "px";
};
goog.style.getIePixelValue_ = function(a, b, c, d) {
  if (/^\d+px?$/.test(b)) {
    return parseInt(b, 10);
  }
  var e = a.style[c], f = a.runtimeStyle[c];
  a.runtimeStyle[c] = a.currentStyle[c];
  a.style[c] = b;
  b = a.style[d];
  a.style[c] = e;
  a.runtimeStyle[c] = f;
  return +b;
};
goog.style.getIePixelDistance_ = function(a, b) {
  return (b = goog.style.getCascadedStyle(a, b)) ? goog.style.getIePixelValue_(a, b, "left", "pixelLeft") : 0;
};
goog.style.getBox_ = function(a, b) {
  if (goog.userAgent.IE) {
    var c = goog.style.getIePixelDistance_(a, b + "Left");
    var d = goog.style.getIePixelDistance_(a, b + "Right");
    var e = goog.style.getIePixelDistance_(a, b + "Top");
    a = goog.style.getIePixelDistance_(a, b + "Bottom");
    return new goog.math.Box(e, d, a, c);
  }
  c = goog.style.getComputedStyle(a, b + "Left");
  d = goog.style.getComputedStyle(a, b + "Right");
  e = goog.style.getComputedStyle(a, b + "Top");
  a = goog.style.getComputedStyle(a, b + "Bottom");
  return new goog.math.Box(parseFloat(e), parseFloat(d), parseFloat(a), parseFloat(c));
};
goog.style.getPaddingBox = function(a) {
  return goog.style.getBox_(a, "padding");
};
goog.style.getMarginBox = function(a) {
  return goog.style.getBox_(a, "margin");
};
goog.style.ieBorderWidthKeywords_ = {thin:2, medium:4, thick:6};
goog.style.getIePixelBorder_ = function(a, b) {
  if ("none" == goog.style.getCascadedStyle(a, b + "Style")) {
    return 0;
  }
  b = goog.style.getCascadedStyle(a, b + "Width");
  return b in goog.style.ieBorderWidthKeywords_ ? goog.style.ieBorderWidthKeywords_[b] : goog.style.getIePixelValue_(a, b, "left", "pixelLeft");
};
goog.style.getBorderBox = function(a) {
  if (goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9)) {
    var b = goog.style.getIePixelBorder_(a, "borderLeft");
    var c = goog.style.getIePixelBorder_(a, "borderRight");
    var d = goog.style.getIePixelBorder_(a, "borderTop");
    a = goog.style.getIePixelBorder_(a, "borderBottom");
    return new goog.math.Box(d, c, a, b);
  }
  b = goog.style.getComputedStyle(a, "borderLeftWidth");
  c = goog.style.getComputedStyle(a, "borderRightWidth");
  d = goog.style.getComputedStyle(a, "borderTopWidth");
  a = goog.style.getComputedStyle(a, "borderBottomWidth");
  return new goog.math.Box(parseFloat(d), parseFloat(c), parseFloat(a), parseFloat(b));
};
goog.style.getFontFamily = function(a) {
  var b = goog.dom.getOwnerDocument(a), c = "";
  if (b.body.createTextRange && goog.dom.contains(b, a)) {
    b = b.body.createTextRange();
    b.moveToElementText(a);
    try {
      c = b.queryCommandValue("FontName");
    } catch (d) {
      c = "";
    }
  }
  c || (c = goog.style.getStyle_(a, "fontFamily"));
  a = c.split(",");
  1 < a.length && (c = a[0]);
  return goog.string.stripQuotes(c, "\"'");
};
goog.style.lengthUnitRegex_ = /[^\d]+$/;
goog.style.getLengthUnits = function(a) {
  return (a = a.match(goog.style.lengthUnitRegex_)) && a[0] || null;
};
goog.style.ABSOLUTE_CSS_LENGTH_UNITS_ = {cm:1, "in":1, mm:1, pc:1, pt:1};
goog.style.CONVERTIBLE_RELATIVE_CSS_UNITS_ = {em:1, ex:1};
goog.style.getFontSize = function(a) {
  var b = goog.style.getStyle_(a, "fontSize"), c = goog.style.getLengthUnits(b);
  if (b && "px" == c) {
    return parseInt(b, 10);
  }
  if (goog.userAgent.IE) {
    if (String(c) in goog.style.ABSOLUTE_CSS_LENGTH_UNITS_) {
      return goog.style.getIePixelValue_(a, b, "left", "pixelLeft");
    }
    if (a.parentNode && a.parentNode.nodeType == goog.dom.NodeType.ELEMENT && String(c) in goog.style.CONVERTIBLE_RELATIVE_CSS_UNITS_) {
      return a = a.parentNode, c = goog.style.getStyle_(a, "fontSize"), goog.style.getIePixelValue_(a, b == c ? "1em" : b, "left", "pixelLeft");
    }
  }
  c = goog.dom.createDom("SPAN", {style:"visibility:hidden;position:absolute;line-height:0;padding:0;margin:0;border:0;height:1em;"});
  goog.dom.appendChild(a, c);
  b = c.offsetHeight;
  goog.dom.removeNode(c);
  return b;
};
goog.style.parseStyleAttribute = function(a) {
  var b = {};
  goog.array.forEach(a.split(/\s*;\s*/), function(a) {
    var c = a.match(/\s*([\w-]+)\s*\:(.+)/);
    c && (a = c[1], c = goog.string.trim(c[2]), b[goog.string.toCamelCase(a.toLowerCase())] = c);
  });
  return b;
};
goog.style.toStyleAttribute = function(a) {
  var b = [];
  goog.object.forEach(a, function(a, d) {
    b.push(goog.string.toSelectorCase(d), ":", a, ";");
  });
  return b.join("");
};
goog.style.setFloat = function(a, b) {
  a.style[goog.userAgent.IE ? "styleFloat" : "cssFloat"] = b;
};
goog.style.getFloat = function(a) {
  return a.style[goog.userAgent.IE ? "styleFloat" : "cssFloat"] || "";
};
goog.style.getScrollbarWidth = function(a) {
  var b = goog.dom.createElement("DIV");
  a && (b.className = a);
  b.style.cssText = "overflow:auto;position:absolute;top:0;width:100px;height:100px";
  a = goog.dom.createElement("DIV");
  goog.style.setSize(a, "200px", "200px");
  b.appendChild(a);
  goog.dom.appendChild(goog.dom.getDocument().body, b);
  a = b.offsetWidth - b.clientWidth;
  goog.dom.removeNode(b);
  return a;
};
goog.style.MATRIX_TRANSLATION_REGEX_ = /matrix\([0-9\.\-]+, [0-9\.\-]+, [0-9\.\-]+, [0-9\.\-]+, ([0-9\.\-]+)p?x?, ([0-9\.\-]+)p?x?\)/;
goog.style.getCssTranslation = function(a) {
  a = goog.style.getComputedTransform(a);
  return a ? (a = a.match(goog.style.MATRIX_TRANSLATION_REGEX_)) ? new goog.math.Coordinate(parseFloat(a[1]), parseFloat(a[2])) : new goog.math.Coordinate(0, 0) : new goog.math.Coordinate(0, 0);
};
bot.dom.IS_SHADOW_DOM_ENABLED = "function" === typeof ShadowRoot;
bot.dom.getActiveElement = function(a) {
  a = goog.dom.getActiveElement(goog.dom.getOwnerDocument(a));
  return goog.userAgent.IE && a && "undefined" === typeof a.nodeType ? null : a;
};
bot.dom.isElement = bot.dom.core.isElement;
bot.dom.isInteractable = function(a) {
  return bot.dom.isShown(a, !0) && bot.dom.isEnabled(a) && !bot.dom.hasPointerEventsDisabled_(a);
};
bot.dom.hasPointerEventsDisabled_ = function(a) {
  return goog.userAgent.IE || goog.userAgent.GECKO && !bot.userAgent.isEngineVersion("1.9.2") ? !1 : "none" == bot.dom.getEffectiveStyle(a, "pointer-events");
};
bot.dom.isSelectable = bot.dom.core.isSelectable;
bot.dom.isSelected = bot.dom.core.isSelected;
bot.dom.FOCUSABLE_FORM_FIELDS_ = "A AREA BUTTON INPUT LABEL SELECT TEXTAREA".split(" ");
bot.dom.isFocusable = function(a) {
  return goog.array.some(bot.dom.FOCUSABLE_FORM_FIELDS_, function(b) {
    return bot.dom.core.isElement(a, b);
  }) || null != bot.dom.core.getAttribute(a, "tabindex") && 0 <= Number(bot.dom.core.getProperty(a, "tabIndex")) || bot.dom.isEditable(a);
};
bot.dom.getProperty = bot.dom.core.getProperty;
bot.dom.getAttribute = bot.dom.core.getAttribute;
bot.dom.DISABLED_ATTRIBUTE_SUPPORTED_ = "BUTTON INPUT OPTGROUP OPTION SELECT TEXTAREA".split(" ");
bot.dom.isEnabled = function(a) {
  return goog.array.some(bot.dom.DISABLED_ATTRIBUTE_SUPPORTED_, function(b) {
    return bot.dom.core.isElement(a, b);
  }) ? bot.dom.core.getProperty(a, "disabled") ? !1 : a.parentNode && a.parentNode.nodeType == goog.dom.NodeType.ELEMENT && bot.dom.core.isElement(a, "OPTGROUP") || bot.dom.core.isElement(a, "OPTION") ? bot.dom.isEnabled(a.parentNode) : !goog.dom.getAncestor(a, function(a) {
    var b = a.parentNode;
    if (b && bot.dom.core.isElement(b, "FIELDSET") && bot.dom.core.getProperty(b, "disabled")) {
      if (!bot.dom.core.isElement(a, "LEGEND")) {
        return !0;
      }
      for (; a = goog.dom.getPreviousElementSibling(a);) {
        if (bot.dom.core.isElement(a, "LEGEND")) {
          return !0;
        }
      }
    }
    return !1;
  }, !0) : !0;
};
bot.dom.TEXTUAL_INPUT_TYPES_ = "text search tel url email password number".split(" ");
bot.dom.isTextual = function(a) {
  return bot.dom.core.isElement(a, "TEXTAREA") ? !0 : bot.dom.core.isElement(a, "INPUT") ? (a = a.type.toLowerCase(), goog.array.contains(bot.dom.TEXTUAL_INPUT_TYPES_, a)) : bot.dom.isContentEditable(a) ? !0 : !1;
};
bot.dom.isFileInput = function(a) {
  return bot.dom.core.isElement(a, "INPUT") ? "file" == a.type.toLowerCase() : !1;
};
bot.dom.isInputType = function(a, b) {
  return bot.dom.core.isElement(a, "INPUT") ? a.type.toLowerCase() == b : !1;
};
bot.dom.isContentEditable = function(a) {
  function b(a) {
    return "inherit" == a.contentEditable ? (a = bot.dom.getParentElement(a)) ? b(a) : !1 : "true" == a.contentEditable;
  }
  return goog.isDef(a.contentEditable) ? !goog.userAgent.IE && goog.isDef(a.isContentEditable) ? a.isContentEditable : b(a) : !1;
};
bot.dom.isEditable = function(a) {
  return (bot.dom.isTextual(a) || bot.dom.isFileInput(a) || bot.dom.isInputType(a, "range") || bot.dom.isInputType(a, "date") || bot.dom.isInputType(a, "month") || bot.dom.isInputType(a, "week") || bot.dom.isInputType(a, "time") || bot.dom.isInputType(a, "datetime-local") || bot.dom.isInputType(a, "color")) && !bot.dom.core.getProperty(a, "readOnly");
};
bot.dom.getParentElement = function(a) {
  for (a = a.parentNode; a && a.nodeType != goog.dom.NodeType.ELEMENT && a.nodeType != goog.dom.NodeType.DOCUMENT && a.nodeType != goog.dom.NodeType.DOCUMENT_FRAGMENT;) {
    a = a.parentNode;
  }
  return bot.dom.core.isElement(a) ? a : null;
};
bot.dom.getInlineStyle = function(a, b) {
  return goog.style.getStyle(a, b);
};
bot.dom.getEffectiveStyle = function(a, b) {
  b = goog.string.toCamelCase(b);
  if ("float" == b || "cssFloat" == b || "styleFloat" == b) {
    b = bot.userAgent.IE_DOC_PRE9 ? "styleFloat" : "cssFloat";
  }
  a = goog.style.getComputedStyle(a, b) || bot.dom.getCascadedStyle_(a, b);
  return null === a ? null : bot.color.standardizeColor(b, a);
};
bot.dom.getCascadedStyle_ = function(a, b) {
  var c = a.currentStyle || a.style, d = c[b];
  !goog.isDef(d) && goog.isFunction(c.getPropertyValue) && (d = c.getPropertyValue(b));
  return "inherit" != d ? goog.isDef(d) ? d : null : (a = bot.dom.getParentElement(a)) ? bot.dom.getCascadedStyle_(a, b) : null;
};
bot.dom.isShown_ = function(a, b, c) {
  function d(a) {
    var b = bot.dom.getClientRect(a);
    return 0 < b.height && 0 < b.width ? !0 : bot.dom.core.isElement(a, "PATH") && (0 < b.height || 0 < b.width) ? (a = bot.dom.getEffectiveStyle(a, "stroke-width"), !!a && 0 < parseInt(a, 10)) : "hidden" != bot.dom.getEffectiveStyle(a, "overflow") && goog.array.some(a.childNodes, function(a) {
      return a.nodeType == goog.dom.NodeType.TEXT || bot.dom.core.isElement(a) && d(a);
    });
  }
  function e(a) {
    return bot.dom.getOverflowState(a) == bot.dom.OverflowState.HIDDEN && goog.array.every(a.childNodes, function(a) {
      return !bot.dom.core.isElement(a) || e(a) || !d(a);
    });
  }
  if (!bot.dom.core.isElement(a)) {
    throw Error("Argument to isShown must be of type Element");
  }
  if (bot.dom.core.isElement(a, "BODY")) {
    return !0;
  }
  if (bot.dom.core.isElement(a, "OPTION") || bot.dom.core.isElement(a, "OPTGROUP")) {
    return a = goog.dom.getAncestor(a, function(a) {
      return bot.dom.core.isElement(a, "SELECT");
    }), !!a && bot.dom.isShown_(a, !0, c);
  }
  var f = bot.dom.maybeFindImageMap_(a);
  if (f) {
    return !!f.image && 0 < f.rect.width && 0 < f.rect.height && bot.dom.isShown_(f.image, b, c);
  }
  if (bot.dom.core.isElement(a, "INPUT") && "hidden" == a.type.toLowerCase() || bot.dom.core.isElement(a, "NOSCRIPT")) {
    return !1;
  }
  f = bot.dom.getEffectiveStyle(a, "visibility");
  return "collapse" != f && "hidden" != f && c(a) && (b || 0 != bot.dom.getOpacity(a)) && d(a) ? !e(a) : !1;
};
bot.dom.isShown = function(a, b) {
  function c(a) {
    if (bot.dom.core.isElement(a) && "none" == bot.dom.getEffectiveStyle(a, "display")) {
      return !1;
    }
    a = bot.dom.getParentNodeInComposedDom(a);
    if (bot.dom.IS_SHADOW_DOM_ENABLED && a instanceof ShadowRoot) {
      if (a.host.shadowRoot !== a) {
        return !1;
      }
      a = a.host;
    }
    return !a || a.nodeType != goog.dom.NodeType.DOCUMENT && a.nodeType != goog.dom.NodeType.DOCUMENT_FRAGMENT ? a && c(a) : !0;
  }
  return bot.dom.isShown_(a, !!b, c);
};
bot.dom.OverflowState = {NONE:"none", HIDDEN:"hidden", SCROLL:"scroll"};
bot.dom.getOverflowState = function(a, b) {
  function c(a) {
    function b(a) {
      if (a == g) {
        return !0;
      }
      var b = bot.dom.getEffectiveStyle(a, "display");
      return goog.string.startsWith(b, "inline") || "absolute" == c && "static" == bot.dom.getEffectiveStyle(a, "position") ? !1 : !0;
    }
    var c = bot.dom.getEffectiveStyle(a, "position");
    if ("fixed" == c) {
      return l = !0, a == g ? null : g;
    }
    for (a = bot.dom.getParentElement(a); a && !b(a);) {
      a = bot.dom.getParentElement(a);
    }
    return a;
  }
  function d(a) {
    var b = a;
    if ("visible" == k) {
      if (a == g && h) {
        b = h;
      } else {
        if (a == h) {
          return {x:"visible", y:"visible"};
        }
      }
    }
    b = {x:bot.dom.getEffectiveStyle(b, "overflow-x"), y:bot.dom.getEffectiveStyle(b, "overflow-y")};
    a == g && (b.x = "visible" == b.x ? "auto" : b.x, b.y = "visible" == b.y ? "auto" : b.y);
    return b;
  }
  function e(a) {
    return a == g ? (new goog.dom.DomHelper(f)).getDocumentScroll() : new goog.math.Coordinate(a.scrollLeft, a.scrollTop);
  }
  b = bot.dom.getClientRegion(a, b);
  var f = goog.dom.getOwnerDocument(a), g = f.documentElement, h = f.body, k = bot.dom.getEffectiveStyle(g, "overflow"), l;
  for (a = c(a); a; a = c(a)) {
    var m = d(a);
    if ("visible" != m.x || "visible" != m.y) {
      var n = bot.dom.getClientRect(a);
      if (0 == n.width || 0 == n.height) {
        return bot.dom.OverflowState.HIDDEN;
      }
      var p = b.right < n.left, q = b.bottom < n.top;
      if (p && "hidden" == m.x || q && "hidden" == m.y) {
        return bot.dom.OverflowState.HIDDEN;
      }
      if (p && "visible" != m.x || q && "visible" != m.y) {
        p = e(a);
        q = b.bottom < n.top - p.y;
        if (b.right < n.left - p.x && "visible" != m.x || q && "visible" != m.x) {
          return bot.dom.OverflowState.HIDDEN;
        }
        b = bot.dom.getOverflowState(a);
        return b == bot.dom.OverflowState.HIDDEN ? bot.dom.OverflowState.HIDDEN : bot.dom.OverflowState.SCROLL;
      }
      p = b.left >= n.left + n.width;
      n = b.top >= n.top + n.height;
      if (p && "hidden" == m.x || n && "hidden" == m.y) {
        return bot.dom.OverflowState.HIDDEN;
      }
      if (p && "visible" != m.x || n && "visible" != m.y) {
        if (l && (m = e(a), b.left >= g.scrollWidth - m.x || b.right >= g.scrollHeight - m.y)) {
          return bot.dom.OverflowState.HIDDEN;
        }
        b = bot.dom.getOverflowState(a);
        return b == bot.dom.OverflowState.HIDDEN ? bot.dom.OverflowState.HIDDEN : bot.dom.OverflowState.SCROLL;
      }
    }
  }
  return bot.dom.OverflowState.NONE;
};
bot.dom.CSS_TRANSFORM_MATRIX_REGEX_ = /matrix\(([\d\.\-]+), ([\d\.\-]+), ([\d\.\-]+), ([\d\.\-]+), ([\d\.\-]+)(?:px)?, ([\d\.\-]+)(?:px)?\)/;
bot.dom.getClientRect = function(a) {
  var b = bot.dom.maybeFindImageMap_(a);
  if (b) {
    return b.rect;
  }
  if (bot.dom.core.isElement(a, "HTML")) {
    return a = goog.dom.getOwnerDocument(a), a = goog.dom.getViewportSize(goog.dom.getWindow(a)), new goog.math.Rect(0, 0, a.width, a.height);
  }
  try {
    var c = a.getBoundingClientRect();
  } catch (d) {
    return new goog.math.Rect(0, 0, 0, 0);
  }
  b = new goog.math.Rect(c.left, c.top, c.right - c.left, c.bottom - c.top);
  goog.userAgent.IE && a.ownerDocument.body && (a = goog.dom.getOwnerDocument(a), b.left -= a.documentElement.clientLeft + a.body.clientLeft, b.top -= a.documentElement.clientTop + a.body.clientTop);
  return b;
};
bot.dom.maybeFindImageMap_ = function(a) {
  var b = bot.dom.core.isElement(a, "MAP");
  if (!b && !bot.dom.core.isElement(a, "AREA")) {
    return null;
  }
  var c = b ? a : bot.dom.core.isElement(a.parentNode, "MAP") ? a.parentNode : null, d = null, e = null;
  c && c.name && (d = goog.dom.getOwnerDocument(c), d = bot.locators.xpath.single('/descendant::*[@usemap = "#' + c.name + '"]', d)) && (e = bot.dom.getClientRect(d), b || "default" == a.shape.toLowerCase() || (a = bot.dom.getAreaRelativeRect_(a), b = Math.min(Math.max(a.left, 0), e.width), c = Math.min(Math.max(a.top, 0), e.height), e = new goog.math.Rect(b + e.left, c + e.top, Math.min(a.width, e.width - b), Math.min(a.height, e.height - c))));
  return {image:d, rect:e || new goog.math.Rect(0, 0, 0, 0)};
};
bot.dom.getAreaRelativeRect_ = function(a) {
  var b = a.shape.toLowerCase();
  a = a.coords.split(",");
  if ("rect" == b && 4 == a.length) {
    var b = a[0], c = a[1];
    return new goog.math.Rect(b, c, a[2] - b, a[3] - c);
  }
  if ("circle" == b && 3 == a.length) {
    return b = a[2], new goog.math.Rect(a[0] - b, a[1] - b, 2 * b, 2 * b);
  }
  if ("poly" == b && 2 < a.length) {
    for (var b = a[0], c = a[1], d = b, e = c, f = 2; f + 1 < a.length; f += 2) {
      b = Math.min(b, a[f]), d = Math.max(d, a[f]), c = Math.min(c, a[f + 1]), e = Math.max(e, a[f + 1]);
    }
    return new goog.math.Rect(b, c, d - b, e - c);
  }
  return new goog.math.Rect(0, 0, 0, 0);
};
bot.dom.getClientRegion = function(a, b) {
  a = bot.dom.getClientRect(a).toBox();
  b && (b = b instanceof goog.math.Rect ? b : new goog.math.Rect(b.x, b.y, 1, 1), a.left = goog.math.clamp(a.left + b.left, a.left, a.right), a.top = goog.math.clamp(a.top + b.top, a.top, a.bottom), a.right = goog.math.clamp(a.left + b.width, a.left, a.right), a.bottom = goog.math.clamp(a.top + b.height, a.top, a.bottom));
  return a;
};
bot.dom.trimExcludingNonBreakingSpaceCharacters_ = function(a) {
  return a.replace(/^[^\S\xa0]+|[^\S\xa0]+$/g, "");
};
bot.dom.concatenateCleanedLines_ = function(a) {
  a = goog.array.map(a, bot.dom.trimExcludingNonBreakingSpaceCharacters_);
  a = a.join("\n");
  return bot.dom.trimExcludingNonBreakingSpaceCharacters_(a).replace(/\xa0/g, " ");
};
bot.dom.getVisibleText = function(a) {
  var b = [];
  bot.dom.IS_SHADOW_DOM_ENABLED ? bot.dom.appendVisibleTextLinesFromElementInComposedDom_(a, b) : bot.dom.appendVisibleTextLinesFromElement_(a, b);
  return bot.dom.concatenateCleanedLines_(b);
};
bot.dom.appendVisibleTextLinesFromElementCommon_ = function(a, b, c, d) {
  if (bot.dom.core.isElement(a, "BR")) {
    b.push("");
  } else {
    var e = bot.dom.core.isElement(a, "TD"), f = bot.dom.getEffectiveStyle(a, "display"), g = !e && !goog.array.contains(bot.dom.INLINE_DISPLAY_BOXES_, f), h = goog.dom.getPreviousElementSibling(a), h = h ? bot.dom.getEffectiveStyle(h, "display") : "", k = bot.dom.getEffectiveStyle(a, "float") || bot.dom.getEffectiveStyle(a, "cssFloat") || bot.dom.getEffectiveStyle(a, "styleFloat");
    !g || "run-in" == h && "none" == k || goog.string.isEmptyOrWhitespace(goog.array.peek(b) || "") || b.push("");
    var l = c(a), m = null, n = null;
    l && (m = bot.dom.getEffectiveStyle(a, "white-space"), n = bot.dom.getEffectiveStyle(a, "text-transform"));
    goog.array.forEach(a.childNodes, function(a) {
      d(a, b, l, m, n);
    });
    a = goog.array.peek(b) || "";
    !e && "table-cell" != f || !a || goog.string.endsWith(a, " ") || (b[b.length - 1] += " ");
    g && "run-in" != f && !goog.string.isEmptyOrWhitespace(a) && b.push("");
  }
};
bot.dom.appendVisibleTextLinesFromElement_ = function(a, b) {
  bot.dom.appendVisibleTextLinesFromElementCommon_(a, b, bot.dom.isShown, function(a, b, e, f, g) {
    a.nodeType == goog.dom.NodeType.TEXT && e ? bot.dom.appendVisibleTextLinesFromTextNode_(a, b, f, g) : bot.dom.core.isElement(a) && bot.dom.appendVisibleTextLinesFromElement_(a, b);
  });
};
bot.dom.INLINE_DISPLAY_BOXES_ = "inline inline-block inline-table none table-cell table-column table-column-group".split(" ");
bot.dom.appendVisibleTextLinesFromTextNode_ = function(a, b, c, d) {
  a = a.nodeValue.replace(/[\u200b\u200e\u200f]/g, "");
  a = goog.string.canonicalizeNewlines(a);
  if ("normal" == c || "nowrap" == c) {
    a = a.replace(/\n/g, " ");
  }
  a = "pre" == c || "pre-wrap" == c ? a.replace(/[ \f\t\v\u2028\u2029]/g, "\u00a0") : a.replace(/[\ \f\t\v\u2028\u2029]+/g, " ");
  "capitalize" == d ? a = a.replace(/(^|\s)(\S)/g, function(a, b, c) {
    return b + c.toUpperCase();
  }) : "uppercase" == d ? a = a.toUpperCase() : "lowercase" == d && (a = a.toLowerCase());
  c = b.pop() || "";
  goog.string.endsWith(c, " ") && goog.string.startsWith(a, " ") && (a = a.substr(1));
  b.push(c + a);
};
bot.dom.getOpacity = function(a) {
  if (bot.userAgent.IE_DOC_PRE9) {
    if ("relative" == bot.dom.getEffectiveStyle(a, "position")) {
      return 1;
    }
    a = bot.dom.getEffectiveStyle(a, "filter");
    return (a = a.match(/^alpha\(opacity=(\d*)\)/) || a.match(/^progid:DXImageTransform.Microsoft.Alpha\(Opacity=(\d*)\)/)) ? Number(a[1]) / 100 : 1;
  }
  return bot.dom.getOpacityNonIE_(a);
};
bot.dom.getOpacityNonIE_ = function(a) {
  var b = 1, c = bot.dom.getEffectiveStyle(a, "opacity");
  c && (b = Number(c));
  (a = bot.dom.getParentElement(a)) && (b *= bot.dom.getOpacityNonIE_(a));
  return b;
};
bot.dom.getParentNodeInComposedDom = function(a) {
  var b = a.parentNode;
  return b && b.shadowRoot && void 0 !== a.assignedSlot ? a.assignedSlot ? a.assignedSlot.parentNode : null : a.getDestinationInsertionPoints && (a = a.getDestinationInsertionPoints(), 0 < a.length) ? a[a.length - 1] : b;
};
bot.dom.appendVisibleTextLinesFromNodeInComposedDom_ = function(a, b, c, d, e) {
  var f;
  if (a.nodeType == goog.dom.NodeType.TEXT && c) {
    bot.dom.appendVisibleTextLinesFromTextNode_(a, b, d, e);
  } else {
    if (bot.dom.core.isElement(a)) {
      if (bot.dom.core.isElement(a, "CONTENT") || bot.dom.core.isElement(a, "SLOT")) {
        for (f = a; f.parentNode;) {
          f = f.parentNode;
        }
        f instanceof ShadowRoot ? (a = bot.dom.core.isElement(a, "CONTENT") ? a.getDistributedNodes() : a.assignedNodes(), goog.array.forEach(a, function(a) {
          bot.dom.appendVisibleTextLinesFromNodeInComposedDom_(a, b, c, d, e);
        })) : bot.dom.appendVisibleTextLinesFromElementInComposedDom_(a, b);
      } else {
        if (bot.dom.core.isElement(a, "SHADOW")) {
          for (f = a; f.parentNode;) {
            f = f.parentNode;
          }
          if (f instanceof ShadowRoot && (a = f)) {
            for (a = a.olderShadowRoot; a;) {
              goog.array.forEach(a.childNodes, function(a) {
                bot.dom.appendVisibleTextLinesFromNodeInComposedDom_(a, b, c, d, e);
              }), a = a.olderShadowRoot;
            }
          }
        } else {
          bot.dom.appendVisibleTextLinesFromElementInComposedDom_(a, b);
        }
      }
    }
  }
};
bot.dom.isNodeDistributedIntoShadowDom = function(a) {
  var b = null;
  a.nodeType == goog.dom.NodeType.ELEMENT ? b = a : a.nodeType == goog.dom.NodeType.TEXT && (b = a);
  return null != b && (null != b.assignedSlot || b.getDestinationInsertionPoints && 0 < b.getDestinationInsertionPoints().length);
};
bot.dom.appendVisibleTextLinesFromElementInComposedDom_ = function(a, b) {
  a.shadowRoot && goog.array.forEach(a.shadowRoot.childNodes, function(a) {
    bot.dom.appendVisibleTextLinesFromNodeInComposedDom_(a, b, !0, null, null);
  });
  bot.dom.appendVisibleTextLinesFromElementCommon_(a, b, bot.dom.isShown, function(a, b, e, f, g) {
    bot.dom.isNodeDistributedIntoShadowDom(a) || bot.dom.appendVisibleTextLinesFromNodeInComposedDom_(a, b, e, f, g);
  });
};
bot.locators.className = {};
bot.locators.className.canUseQuerySelector_ = function(a) {
  return !(!a.querySelectorAll || !a.querySelector);
};
bot.locators.className.single = function(a, b) {
  if (!a) {
    throw new bot.Error(bot.ErrorCode.INVALID_SELECTOR_ERROR, "No class name specified");
  }
  a = goog.string.trim(a);
  if (-1 !== a.indexOf(" ")) {
    throw new bot.Error(bot.ErrorCode.INVALID_SELECTOR_ERROR, "Compound class names not permitted");
  }
  if (bot.locators.className.canUseQuerySelector_(b)) {
    try {
      return b.querySelector("." + a.replace(/\./g, "\\.")) || null;
    } catch (c) {
      throw new bot.Error(bot.ErrorCode.INVALID_SELECTOR_ERROR, "An invalid or illegal class name was specified");
    }
  }
  a = goog.dom.getDomHelper(b).getElementsByTagNameAndClass("*", a, b);
  return a.length ? a[0] : null;
};
bot.locators.className.many = function(a, b) {
  if (!a) {
    throw new bot.Error(bot.ErrorCode.INVALID_SELECTOR_ERROR, "No class name specified");
  }
  a = goog.string.trim(a);
  if (-1 !== a.indexOf(" ")) {
    throw new bot.Error(bot.ErrorCode.INVALID_SELECTOR_ERROR, "Compound class names not permitted");
  }
  if (bot.locators.className.canUseQuerySelector_(b)) {
    try {
      return b.querySelectorAll("." + a.replace(/\./g, "\\."));
    } catch (c) {
      throw new bot.Error(bot.ErrorCode.INVALID_SELECTOR_ERROR, "An invalid or illegal class name was specified");
    }
  }
  return goog.dom.getDomHelper(b).getElementsByTagNameAndClass("*", a, b);
};
bot.locators.css = {};
bot.locators.css.single = function(a, b) {
  if (!goog.isFunction(b.querySelector) && goog.userAgent.IE && bot.userAgent.isEngineVersion(8) && !goog.isObject(b.querySelector)) {
    throw Error("CSS selection is not supported");
  }
  if (!a) {
    throw new bot.Error(bot.ErrorCode.INVALID_SELECTOR_ERROR, "No selector specified");
  }
  a = goog.string.trim(a);
  try {
    var c = b.querySelector(a);
  } catch (d) {
    throw new bot.Error(bot.ErrorCode.INVALID_SELECTOR_ERROR, "An invalid or illegal selector was specified");
  }
  return c && c.nodeType == goog.dom.NodeType.ELEMENT ? c : null;
};
bot.locators.css.many = function(a, b) {
  if (!goog.isFunction(b.querySelectorAll) && goog.userAgent.IE && bot.userAgent.isEngineVersion(8) && !goog.isObject(b.querySelector)) {
    throw Error("CSS selection is not supported");
  }
  if (!a) {
    throw new bot.Error(bot.ErrorCode.INVALID_SELECTOR_ERROR, "No selector specified");
  }
  a = goog.string.trim(a);
  try {
    return b.querySelectorAll(a);
  } catch (c) {
    throw new bot.Error(bot.ErrorCode.INVALID_SELECTOR_ERROR, "An invalid or illegal selector was specified");
  }
};
bot.locators.id = {};
bot.locators.id.canUseQuerySelector_ = function(a, b) {
  return !(!a.querySelectorAll || !a.querySelector) && !/^\d.*/.test(b);
};
bot.locators.id.single = function(a, b) {
  var c = goog.dom.getDomHelper(b), d = c.getElement(a);
  if (!d) {
    return null;
  }
  if (bot.dom.core.getAttribute(d, "id") == a && b != d && goog.dom.contains(b, d)) {
    return d;
  }
  c = c.getElementsByTagNameAndClass("*");
  return goog.array.find(c, function(c) {
    return bot.dom.core.getAttribute(c, "id") == a && b != c && goog.dom.contains(b, c);
  });
};
bot.locators.id.many = function(a, b) {
  if (!a) {
    return [];
  }
  if (bot.locators.id.canUseQuerySelector_(b, a)) {
    try {
      return b.querySelectorAll("#" + bot.locators.id.cssEscape_(a));
    } catch (c) {
      return [];
    }
  }
  b = goog.dom.getDomHelper(b).getElementsByTagNameAndClass("*", null, b);
  return goog.array.filter(b, function(b) {
    return bot.dom.core.getAttribute(b, "id") == a;
  });
};
bot.locators.id.cssEscape_ = function(a) {
  return a.replace(/([\s'"\\#.:;,!?+<>=~*^$|%&@`{}\-\/\[\]\(\)])/g, "\\$1");
};
bot.locators.linkText = {};
bot.locators.partialLinkText = {};
bot.locators.linkText.single_ = function(a, b, c) {
  try {
    var d = bot.locators.css.many("a", b);
  } catch (e) {
    d = goog.dom.getDomHelper(b).getElementsByTagNameAndClass("A", null, b);
  }
  return goog.array.find(d, function(b) {
    b = bot.dom.getVisibleText(b);
    b = b.replace(/^[\s]+|[\s]+$/g, "");
    return c && -1 != b.indexOf(a) || b == a;
  });
};
bot.locators.linkText.many_ = function(a, b, c) {
  try {
    var d = bot.locators.css.many("a", b);
  } catch (e) {
    d = goog.dom.getDomHelper(b).getElementsByTagNameAndClass("A", null, b);
  }
  return goog.array.filter(d, function(b) {
    b = bot.dom.getVisibleText(b);
    b = b.replace(/^[\s]+|[\s]+$/g, "");
    return c && -1 != b.indexOf(a) || b == a;
  });
};
bot.locators.linkText.single = function(a, b) {
  return bot.locators.linkText.single_(a, b, !1);
};
bot.locators.linkText.many = function(a, b) {
  return bot.locators.linkText.many_(a, b, !1);
};
bot.locators.partialLinkText.single = function(a, b) {
  return bot.locators.linkText.single_(a, b, !0);
};
bot.locators.partialLinkText.many = function(a, b) {
  return bot.locators.linkText.many_(a, b, !0);
};
bot.locators.name = {};
bot.locators.name.single = function(a, b) {
  b = goog.dom.getDomHelper(b).getElementsByTagNameAndClass("*", null, b);
  return goog.array.find(b, function(b) {
    return bot.dom.core.getAttribute(b, "name") == a;
  });
};
bot.locators.name.many = function(a, b) {
  b = goog.dom.getDomHelper(b).getElementsByTagNameAndClass("*", null, b);
  return goog.array.filter(b, function(b) {
    return bot.dom.core.getAttribute(b, "name") == a;
  });
};
bot.locators.tagName = {};
bot.locators.tagName.single = function(a, b) {
  if ("" === a) {
    throw new bot.Error(bot.ErrorCode.INVALID_SELECTOR_ERROR, 'Unable to locate an element with the tagName ""');
  }
  return b.getElementsByTagName(a)[0] || null;
};
bot.locators.tagName.many = function(a, b) {
  if ("" === a) {
    throw new bot.Error(bot.ErrorCode.INVALID_SELECTOR_ERROR, 'Unable to locate an element with the tagName ""');
  }
  return b.getElementsByTagName(a);
};
bot.locators.STRATEGIES_ = {className:bot.locators.className, "class name":bot.locators.className, css:bot.locators.css, "css selector":bot.locators.css, id:bot.locators.id, linkText:bot.locators.linkText, "link text":bot.locators.linkText, name:bot.locators.name, partialLinkText:bot.locators.partialLinkText, "partial link text":bot.locators.partialLinkText, tagName:bot.locators.tagName, "tag name":bot.locators.tagName, xpath:bot.locators.xpath};
bot.locators.add = function(a, b) {
  bot.locators.STRATEGIES_[a] = b;
};
bot.locators.getOnlyKey = function(a) {
  for (var b in a) {
    if (a.hasOwnProperty(b)) {
      return b;
    }
  }
  return null;
};
bot.locators.findElement = function(a, b) {
  var c = bot.locators.getOnlyKey(a);
  if (c) {
    var d = bot.locators.STRATEGIES_[c];
    if (d && goog.isFunction(d.single)) {
      return b = b || bot.getDocument(), d.single(a[c], b);
    }
  }
  throw Error("Unsupported locator strategy: " + c);
};
bot.locators.findElements = function(a, b) {
  var c = bot.locators.getOnlyKey(a);
  if (c) {
    var d = bot.locators.STRATEGIES_[c];
    if (d && goog.isFunction(d.many)) {
      return b = b || bot.getDocument(), d.many(a[c], b);
    }
  }
  throw Error("Unsupported locator strategy: " + c);
};
bot.Device = function(a, b) {
  this.element_ = bot.getDocument().documentElement;
  this.select_ = null;
  var c = bot.dom.getActiveElement(this.element_);
  c && this.setElement(c);
  this.modifiersState = a || new bot.Device.ModifiersState;
  this.eventEmitter = b || new bot.Device.EventEmitter;
};
bot.Device.prototype.getElement = function() {
  return this.element_;
};
bot.Device.prototype.setElement = function(a) {
  this.element_ = a;
  bot.dom.core.isElement(a, "OPTION") ? this.select_ = goog.dom.getAncestor(a, function(a) {
    return bot.dom.core.isElement(a, "SELECT");
  }) : this.select_ = null;
};
bot.Device.prototype.fireHtmlEvent = function(a) {
  return this.eventEmitter.fireHtmlEvent(this.element_, a);
};
bot.Device.prototype.fireKeyboardEvent = function(a, b) {
  return this.eventEmitter.fireKeyboardEvent(this.element_, a, b);
};
bot.Device.prototype.fireMouseEvent = function(a, b, c, d, e, f, g, h) {
  if (!f && !bot.dom.isInteractable(this.element_)) {
    return !1;
  }
  if (d && bot.events.EventType.MOUSEOVER != a && bot.events.EventType.MOUSEOUT != a) {
    throw new bot.Error(bot.ErrorCode.INVALID_ELEMENT_STATE, "Event type does not allow related target: " + a);
  }
  b = {clientX:b.x, clientY:b.y, button:c, altKey:this.modifiersState.isAltPressed(), ctrlKey:this.modifiersState.isControlPressed(), shiftKey:this.modifiersState.isShiftPressed(), metaKey:this.modifiersState.isMetaPressed(), wheelDelta:e || 0, relatedTarget:d || null, count:h || 1};
  g = g || bot.Device.MOUSE_MS_POINTER_ID;
  c = this.element_;
  a != bot.events.EventType.CLICK && a != bot.events.EventType.MOUSEDOWN && g in bot.Device.pointerElementMap_ ? c = bot.Device.pointerElementMap_[g] : this.select_ && (c = this.getTargetOfOptionMouseEvent_(a));
  return c ? this.eventEmitter.fireMouseEvent(c, a, b) : !0;
};
bot.Device.prototype.fireTouchEvent = function(a, b, c, d, e) {
  function f(b, c) {
    b = {identifier:b, screenX:c.x, screenY:c.y, clientX:c.x, clientY:c.y, pageX:c.x + h.x, pageY:c.y + h.y};
    g.changedTouches.push(b);
    if (a == bot.events.EventType.TOUCHSTART || a == bot.events.EventType.TOUCHMOVE) {
      g.touches.push(b), g.targetTouches.push(b);
    }
  }
  var g = {touches:[], targetTouches:[], changedTouches:[], altKey:this.modifiersState.isAltPressed(), ctrlKey:this.modifiersState.isControlPressed(), shiftKey:this.modifiersState.isShiftPressed(), metaKey:this.modifiersState.isMetaPressed(), relatedTarget:null, scale:0, rotation:0}, h = goog.dom.getDomHelper(this.element_).getDocumentScroll();
  f(b, c);
  goog.isDef(d) && f(d, e);
  return this.eventEmitter.fireTouchEvent(this.element_, a, g);
};
bot.Device.prototype.fireMSPointerEvent = function(a, b, c, d, e, f, g, h) {
  if (!h && !bot.dom.isInteractable(this.element_)) {
    return !1;
  }
  if (g && bot.events.EventType.MSPOINTEROVER != a && bot.events.EventType.MSPOINTEROUT != a) {
    throw new bot.Error(bot.ErrorCode.INVALID_ELEMENT_STATE, "Event type does not allow related target: " + a);
  }
  b = {clientX:b.x, clientY:b.y, button:c, altKey:!1, ctrlKey:!1, shiftKey:!1, metaKey:!1, relatedTarget:g || null, width:0, height:0, pressure:0, rotation:0, pointerId:d, tiltX:0, tiltY:0, pointerType:e, isPrimary:f};
  c = this.select_ ? this.getTargetOfOptionMouseEvent_(a) : this.element_;
  bot.Device.pointerElementMap_[d] && (c = bot.Device.pointerElementMap_[d]);
  d = goog.dom.getWindow(goog.dom.getOwnerDocument(this.element_));
  if (d && a == bot.events.EventType.MSPOINTERDOWN) {
    var k = d.Element.prototype.msSetPointerCapture;
    d.Element.prototype.msSetPointerCapture = function(a) {
      bot.Device.pointerElementMap_[a] = this;
    };
  }
  a = c ? this.eventEmitter.fireMSPointerEvent(c, a, b) : !0;
  k && (d.Element.prototype.msSetPointerCapture = k);
  return a;
};
bot.Device.prototype.getTargetOfOptionMouseEvent_ = function(a) {
  if (goog.userAgent.IE) {
    switch(a) {
      case bot.events.EventType.MOUSEOVER:
      case bot.events.EventType.MSPOINTEROVER:
        return null;
      case bot.events.EventType.CONTEXTMENU:
      case bot.events.EventType.MOUSEMOVE:
      case bot.events.EventType.MSPOINTERMOVE:
        return this.select_.multiple ? this.select_ : null;
      default:
        return this.select_;
    }
  }
  if (goog.userAgent.WEBKIT) {
    switch(a) {
      case bot.events.EventType.CLICK:
      case bot.events.EventType.MOUSEUP:
        return this.select_.multiple ? this.element_ : this.select_;
      default:
        return this.select_.multiple ? this.element_ : null;
    }
  }
  return this.element_;
};
bot.Device.prototype.clickElement = function(a, b, c, d) {
  if (c || bot.dom.isInteractable(this.element_)) {
    var e = null, f = null;
    if (!bot.Device.ALWAYS_FOLLOWS_LINKS_ON_CLICK_) {
      for (var g = this.element_; g; g = g.parentNode) {
        if (bot.dom.core.isElement(g, "A")) {
          e = g;
          break;
        } else {
          if (bot.Device.isFormSubmitElement(g)) {
            f = g;
            break;
          }
        }
      }
    }
    var h = (g = !this.select_ && bot.dom.core.isSelectable(this.element_)) && bot.dom.core.isSelected(this.element_);
    goog.userAgent.IE && f ? f.click() : this.fireMouseEvent(bot.events.EventType.CLICK, a, b, null, 0, c, d) && (e && bot.Device.shouldFollowHref_(e) ? bot.Device.followHref_(e) : g && this.toggleRadioButtonOrCheckbox_(h));
  }
};
bot.Device.prototype.focusOnElement = function() {
  var a = goog.dom.getAncestor(this.element_, function(a) {
    return !!a && bot.dom.core.isElement(a) && bot.dom.isFocusable(a);
  }, !0), a = a || this.element_, b = bot.dom.getActiveElement(a);
  if (a == b) {
    return !1;
  }
  if (b && (goog.isFunction(b.blur) || goog.userAgent.IE && goog.isObject(b.blur))) {
    if (!bot.dom.core.isElement(b, "BODY")) {
      try {
        b.blur();
      } catch (c) {
        if (!goog.userAgent.IE || "Unspecified error." != c.message) {
          throw c;
        }
      }
    }
    goog.userAgent.IE && !bot.userAgent.isEngineVersion(8) && goog.dom.getWindow(goog.dom.getOwnerDocument(a)).focus();
  }
  return goog.isFunction(a.focus) || goog.userAgent.IE && goog.isObject(a.focus) ? (a.focus(), !0) : !1;
};
bot.Device.ALWAYS_FOLLOWS_LINKS_ON_CLICK_ = goog.userAgent.WEBKIT || bot.userAgent.FIREFOX_EXTENSION && bot.userAgent.isProductVersion(3.6);
bot.Device.isFormSubmitElement = function(a) {
  if (bot.dom.core.isElement(a, "INPUT")) {
    var b = a.type.toLowerCase();
    if ("submit" == b || "image" == b) {
      return !0;
    }
  }
  return bot.dom.core.isElement(a, "BUTTON") && (b = a.type.toLowerCase(), "submit" == b) ? !0 : !1;
};
bot.Device.shouldFollowHref_ = function(a) {
  if (bot.Device.ALWAYS_FOLLOWS_LINKS_ON_CLICK_ || !a.href) {
    return !1;
  }
  if (!bot.userAgent.FIREFOX_EXTENSION && !bot.userAgent.WEBEXTENSION) {
    return !0;
  }
  if (a.target || 0 == a.href.toLowerCase().indexOf("javascript")) {
    return !1;
  }
  var b = goog.dom.getWindow(goog.dom.getOwnerDocument(a)), c = b.location.href;
  a = bot.Device.resolveUrl_(b.location, a.href);
  return c.split("#")[0] !== a.split("#")[0];
};
bot.Device.followHref_ = function(a) {
  var b = a.href, c = goog.dom.getWindow(goog.dom.getOwnerDocument(a));
  goog.userAgent.IE && !bot.userAgent.isEngineVersion(8) && (b = bot.Device.resolveUrl_(c.location, b));
  a.target ? c.open(b, a.target) : c.location.href = b;
};
bot.Device.prototype.maybeToggleOption = function() {
  if (this.select_ && bot.dom.isInteractable(this.element_)) {
    var a = this.select_, b = bot.dom.core.isSelected(this.element_);
    if (!b || a.multiple) {
      this.element_.selected = !b, (!goog.userAgent.WEBKIT || !a.multiple || goog.userAgent.product.CHROME && bot.userAgent.isProductVersion(28) || goog.userAgent.product.ANDROID && bot.userAgent.isProductVersion(4)) && bot.events.fire(a, bot.events.EventType.CHANGE);
    }
  }
};
bot.Device.prototype.toggleRadioButtonOrCheckbox_ = function(a) {
  goog.userAgent.GECKO || goog.userAgent.WEBKIT || a && "radio" == this.element_.type.toLowerCase() || (this.element_.checked = !a);
};
bot.Device.findAncestorForm = function(a) {
  return goog.dom.getAncestor(a, bot.Device.isForm_, !0);
};
bot.Device.isForm_ = function(a) {
  return bot.dom.core.isElement(a, "FORM");
};
bot.Device.prototype.submitForm = function(a) {
  if (!bot.Device.isForm_(a)) {
    throw new bot.Error(bot.ErrorCode.INVALID_ELEMENT_STATE, "Element is not a form, so could not submit.");
  }
  if (bot.events.fire(a, bot.events.EventType.SUBMIT)) {
    if (bot.dom.core.isElement(a.submit)) {
      if (!goog.userAgent.IE || bot.userAgent.isEngineVersion(8)) {
        a.constructor.prototype.submit.call(a);
      } else {
        var b = bot.locators.findElements({id:"submit"}, a), c = bot.locators.findElements({name:"submit"}, a);
        goog.array.forEach(b, function(a) {
          a.removeAttribute("id");
        });
        goog.array.forEach(c, function(a) {
          a.removeAttribute("name");
        });
        a = a.submit;
        goog.array.forEach(b, function(a) {
          a.setAttribute("id", "submit");
        });
        goog.array.forEach(c, function(a) {
          a.setAttribute("name", "submit");
        });
        a();
      }
    } else {
      a.submit();
    }
  }
};
bot.Device.URL_REGEXP_ = /^([^:/?#.]+:)?(?:\/\/([^/]*))?([^?#]+)?(\?[^#]*)?(#.*)?$/;
bot.Device.resolveUrl_ = function(a, b) {
  var c = b.match(bot.Device.URL_REGEXP_);
  if (!c) {
    return "";
  }
  b = c[1] || "";
  var d = c[2] || "", e = c[3] || "", f = c[4] || "", c = c[5] || "";
  if (!b && (b = a.protocol, !d)) {
    if (d = a.host, !e) {
      e = a.pathname, f = f || a.search;
    } else {
      if ("/" != e.charAt(0)) {
        var g = a.pathname.lastIndexOf("/");
        -1 != g && (e = a.pathname.substr(0, g + 1) + e);
      }
    }
  }
  return b + "//" + d + e + f + c;
};
bot.Device.ModifiersState = function() {
  this.pressedModifiers_ = 0;
};
bot.Device.Modifier = {SHIFT:1, CONTROL:2, ALT:4, META:8};
bot.Device.ModifiersState.prototype.isPressed = function(a) {
  return 0 != (this.pressedModifiers_ & a);
};
bot.Device.ModifiersState.prototype.setPressed = function(a, b) {
  this.pressedModifiers_ = b ? this.pressedModifiers_ | a : this.pressedModifiers_ & ~a;
};
bot.Device.ModifiersState.prototype.isShiftPressed = function() {
  return this.isPressed(bot.Device.Modifier.SHIFT);
};
bot.Device.ModifiersState.prototype.isControlPressed = function() {
  return this.isPressed(bot.Device.Modifier.CONTROL);
};
bot.Device.ModifiersState.prototype.isAltPressed = function() {
  return this.isPressed(bot.Device.Modifier.ALT);
};
bot.Device.ModifiersState.prototype.isMetaPressed = function() {
  return this.isPressed(bot.Device.Modifier.META);
};
bot.Device.MOUSE_MS_POINTER_ID = 1;
bot.Device.pointerElementMap_ = {};
bot.Device.getPointerElement = function(a) {
  return bot.Device.pointerElementMap_[a];
};
bot.Device.clearPointerMap = function() {
  bot.Device.pointerElementMap_ = {};
};
bot.Device.EventEmitter = function() {
};
bot.Device.EventEmitter.prototype.fireHtmlEvent = function(a, b) {
  return bot.events.fire(a, b);
};
bot.Device.EventEmitter.prototype.fireKeyboardEvent = function(a, b, c) {
  return bot.events.fire(a, b, c);
};
bot.Device.EventEmitter.prototype.fireMouseEvent = function(a, b, c) {
  return bot.events.fire(a, b, c);
};
bot.Device.EventEmitter.prototype.fireTouchEvent = function(a, b, c) {
  return bot.events.fire(a, b, c);
};
bot.Device.EventEmitter.prototype.fireMSPointerEvent = function(a, b, c) {
  return bot.events.fire(a, b, c);
};
goog.events = {};
goog.events.BrowserFeature = {HAS_W3C_BUTTON:!goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9), HAS_W3C_EVENT_SUPPORT:!goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9), SET_KEY_CODE_TO_PREVENT_DEFAULT:goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9"), HAS_NAVIGATOR_ONLINE_PROPERTY:!goog.userAgent.WEBKIT || goog.userAgent.isVersionOrHigher("528"), HAS_HTML5_NETWORK_EVENT_SUPPORT:goog.userAgent.GECKO && goog.userAgent.isVersionOrHigher("1.9b") || goog.userAgent.IE &&
goog.userAgent.isVersionOrHigher("8") || goog.userAgent.OPERA && goog.userAgent.isVersionOrHigher("9.5") || goog.userAgent.WEBKIT && goog.userAgent.isVersionOrHigher("528"), HTML5_NETWORK_EVENTS_FIRE_ON_BODY:goog.userAgent.GECKO && !goog.userAgent.isVersionOrHigher("8") || goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9"), TOUCH_ENABLED:"ontouchstart" in goog.global || !!(goog.global.document && document.documentElement && "ontouchstart" in document.documentElement) || !(!goog.global.navigator ||
!goog.global.navigator.msMaxTouchPoints)};
goog.disposable = {};
goog.disposable.IDisposable = function() {
};
goog.disposable.IDisposable.prototype.dispose = goog.abstractMethod;
goog.disposable.IDisposable.prototype.isDisposed = goog.abstractMethod;
goog.Disposable = function() {
  goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF && (goog.Disposable.INCLUDE_STACK_ON_CREATION && (this.creationStack = Error().stack), goog.Disposable.instances_[goog.getUid(this)] = this);
  this.disposed_ = this.disposed_;
  this.onDisposeCallbacks_ = this.onDisposeCallbacks_;
};
goog.Disposable.MonitoringMode = {OFF:0, PERMANENT:1, INTERACTIVE:2};
goog.Disposable.MONITORING_MODE = 0;
goog.Disposable.INCLUDE_STACK_ON_CREATION = !0;
goog.Disposable.instances_ = {};
goog.Disposable.getUndisposedObjects = function() {
  var a = [], b;
  for (b in goog.Disposable.instances_) {
    goog.Disposable.instances_.hasOwnProperty(b) && a.push(goog.Disposable.instances_[Number(b)]);
  }
  return a;
};
goog.Disposable.clearUndisposedObjects = function() {
  goog.Disposable.instances_ = {};
};
goog.Disposable.prototype.disposed_ = !1;
goog.Disposable.prototype.isDisposed = function() {
  return this.disposed_;
};
goog.Disposable.prototype.getDisposed = goog.Disposable.prototype.isDisposed;
goog.Disposable.prototype.dispose = function() {
  if (!this.disposed_ && (this.disposed_ = !0, this.disposeInternal(), goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF)) {
    var a = goog.getUid(this);
    if (goog.Disposable.MONITORING_MODE == goog.Disposable.MonitoringMode.PERMANENT && !goog.Disposable.instances_.hasOwnProperty(a)) {
      throw Error(this + " did not call the goog.Disposable base constructor or was disposed of after a clearUndisposedObjects call");
    }
    delete goog.Disposable.instances_[a];
  }
};
goog.Disposable.prototype.registerDisposable = function(a) {
  this.addOnDisposeCallback(goog.partial(goog.dispose, a));
};
goog.Disposable.prototype.addOnDisposeCallback = function(a, b) {
  this.disposed_ ? goog.isDef(b) ? a.call(b) : a() : (this.onDisposeCallbacks_ || (this.onDisposeCallbacks_ = []), this.onDisposeCallbacks_.push(goog.isDef(b) ? goog.bind(a, b) : a));
};
goog.Disposable.prototype.disposeInternal = function() {
  if (this.onDisposeCallbacks_) {
    for (; this.onDisposeCallbacks_.length;) {
      this.onDisposeCallbacks_.shift()();
    }
  }
};
goog.Disposable.isDisposed = function(a) {
  return a && "function" == typeof a.isDisposed ? a.isDisposed() : !1;
};
goog.dispose = function(a) {
  a && "function" == typeof a.dispose && a.dispose();
};
goog.disposeAll = function(a) {
  for (var b = 0, c = arguments.length; b < c; ++b) {
    var d = arguments[b];
    goog.isArrayLike(d) ? goog.disposeAll.apply(null, d) : goog.dispose(d);
  }
};
goog.events.EventId = function(a) {
  this.id = a;
};
goog.events.EventId.prototype.toString = function() {
  return this.id;
};
goog.events.Event = function(a, b) {
  this.type = a instanceof goog.events.EventId ? String(a) : a;
  this.currentTarget = this.target = b;
  this.defaultPrevented = this.propagationStopped_ = !1;
  this.returnValue_ = !0;
};
goog.events.Event.prototype.stopPropagation = function() {
  this.propagationStopped_ = !0;
};
goog.events.Event.prototype.preventDefault = function() {
  this.defaultPrevented = !0;
  this.returnValue_ = !1;
};
goog.events.Event.stopPropagation = function(a) {
  a.stopPropagation();
};
goog.events.Event.preventDefault = function(a) {
  a.preventDefault();
};
goog.events.getVendorPrefixedName_ = function(a) {
  return goog.userAgent.WEBKIT ? "webkit" + a : goog.userAgent.OPERA ? "o" + a.toLowerCase() : a.toLowerCase();
};
goog.events.EventType = {CLICK:"click", RIGHTCLICK:"rightclick", DBLCLICK:"dblclick", MOUSEDOWN:"mousedown", MOUSEUP:"mouseup", MOUSEOVER:"mouseover", MOUSEOUT:"mouseout", MOUSEMOVE:"mousemove", MOUSEENTER:"mouseenter", MOUSELEAVE:"mouseleave", SELECTIONCHANGE:"selectionchange", SELECTSTART:"selectstart", WHEEL:"wheel", KEYPRESS:"keypress", KEYDOWN:"keydown", KEYUP:"keyup", BLUR:"blur", FOCUS:"focus", DEACTIVATE:"deactivate", FOCUSIN:goog.userAgent.IE ? "focusin" : "DOMFocusIn", FOCUSOUT:goog.userAgent.IE ?
"focusout" : "DOMFocusOut", CHANGE:"change", RESET:"reset", SELECT:"select", SUBMIT:"submit", INPUT:"input", PROPERTYCHANGE:"propertychange", DRAGSTART:"dragstart", DRAG:"drag", DRAGENTER:"dragenter", DRAGOVER:"dragover", DRAGLEAVE:"dragleave", DROP:"drop", DRAGEND:"dragend", TOUCHSTART:"touchstart", TOUCHMOVE:"touchmove", TOUCHEND:"touchend", TOUCHCANCEL:"touchcancel", BEFOREUNLOAD:"beforeunload", CONSOLEMESSAGE:"consolemessage", CONTEXTMENU:"contextmenu", DEVICEMOTION:"devicemotion", DEVICEORIENTATION:"deviceorientation",
DOMCONTENTLOADED:"DOMContentLoaded", ERROR:"error", HELP:"help", LOAD:"load", LOSECAPTURE:"losecapture", ORIENTATIONCHANGE:"orientationchange", READYSTATECHANGE:"readystatechange", RESIZE:"resize", SCROLL:"scroll", UNLOAD:"unload", CANPLAY:"canplay", CANPLAYTHROUGH:"canplaythrough", DURATIONCHANGE:"durationchange", EMPTIED:"emptied", ENDED:"ended", LOADEDDATA:"loadeddata", LOADEDMETADATA:"loadedmetadata", PAUSE:"pause", PLAY:"play", PLAYING:"playing", RATECHANGE:"ratechange", SEEKED:"seeked", SEEKING:"seeking",
STALLED:"stalled", SUSPEND:"suspend", TIMEUPDATE:"timeupdate", VOLUMECHANGE:"volumechange", WAITING:"waiting", SOURCEOPEN:"sourceopen", SOURCEENDED:"sourceended", SOURCECLOSED:"sourceclosed", ABORT:"abort", UPDATE:"update", UPDATESTART:"updatestart", UPDATEEND:"updateend", HASHCHANGE:"hashchange", PAGEHIDE:"pagehide", PAGESHOW:"pageshow", POPSTATE:"popstate", COPY:"copy", PASTE:"paste", CUT:"cut", BEFORECOPY:"beforecopy", BEFORECUT:"beforecut", BEFOREPASTE:"beforepaste", ONLINE:"online", OFFLINE:"offline",
MESSAGE:"message", CONNECT:"connect", INSTALL:"install", ACTIVATE:"activate", FETCH:"fetch", FOREIGNFETCH:"foreignfetch", MESSAGEERROR:"messageerror", STATECHANGE:"statechange", UPDATEFOUND:"updatefound", CONTROLLERCHANGE:"controllerchange", ANIMATIONSTART:goog.events.getVendorPrefixedName_("AnimationStart"), ANIMATIONEND:goog.events.getVendorPrefixedName_("AnimationEnd"), ANIMATIONITERATION:goog.events.getVendorPrefixedName_("AnimationIteration"), TRANSITIONEND:goog.events.getVendorPrefixedName_("TransitionEnd"),
POINTERDOWN:"pointerdown", POINTERUP:"pointerup", POINTERCANCEL:"pointercancel", POINTERMOVE:"pointermove", POINTEROVER:"pointerover", POINTEROUT:"pointerout", POINTERENTER:"pointerenter", POINTERLEAVE:"pointerleave", GOTPOINTERCAPTURE:"gotpointercapture", LOSTPOINTERCAPTURE:"lostpointercapture", MSGESTURECHANGE:"MSGestureChange", MSGESTUREEND:"MSGestureEnd", MSGESTUREHOLD:"MSGestureHold", MSGESTURESTART:"MSGestureStart", MSGESTURETAP:"MSGestureTap", MSGOTPOINTERCAPTURE:"MSGotPointerCapture", MSINERTIASTART:"MSInertiaStart",
MSLOSTPOINTERCAPTURE:"MSLostPointerCapture", MSPOINTERCANCEL:"MSPointerCancel", MSPOINTERDOWN:"MSPointerDown", MSPOINTERENTER:"MSPointerEnter", MSPOINTERHOVER:"MSPointerHover", MSPOINTERLEAVE:"MSPointerLeave", MSPOINTERMOVE:"MSPointerMove", MSPOINTEROUT:"MSPointerOut", MSPOINTEROVER:"MSPointerOver", MSPOINTERUP:"MSPointerUp", TEXT:"text", TEXTINPUT:goog.userAgent.IE ? "textinput" : "textInput", COMPOSITIONSTART:"compositionstart", COMPOSITIONUPDATE:"compositionupdate", COMPOSITIONEND:"compositionend",
BEFOREINPUT:"beforeinput", EXIT:"exit", LOADABORT:"loadabort", LOADCOMMIT:"loadcommit", LOADREDIRECT:"loadredirect", LOADSTART:"loadstart", LOADSTOP:"loadstop", RESPONSIVE:"responsive", SIZECHANGED:"sizechanged", UNRESPONSIVE:"unresponsive", VISIBILITYCHANGE:"visibilitychange", STORAGE:"storage", DOMSUBTREEMODIFIED:"DOMSubtreeModified", DOMNODEINSERTED:"DOMNodeInserted", DOMNODEREMOVED:"DOMNodeRemoved", DOMNODEREMOVEDFROMDOCUMENT:"DOMNodeRemovedFromDocument", DOMNODEINSERTEDINTODOCUMENT:"DOMNodeInsertedIntoDocument",
DOMATTRMODIFIED:"DOMAttrModified", DOMCHARACTERDATAMODIFIED:"DOMCharacterDataModified", BEFOREPRINT:"beforeprint", AFTERPRINT:"afterprint"};
goog.events.BrowserEvent = function(a, b) {
  goog.events.Event.call(this, a ? a.type : "");
  this.relatedTarget = this.currentTarget = this.target = null;
  this.button = this.screenY = this.screenX = this.clientY = this.clientX = this.offsetY = this.offsetX = 0;
  this.key = "";
  this.charCode = this.keyCode = 0;
  this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1;
  this.state = null;
  this.platformModifierKey = !1;
  this.event_ = null;
  a && this.init(a, b);
};
goog.inherits(goog.events.BrowserEvent, goog.events.Event);
goog.events.BrowserEvent.MouseButton = {LEFT:0, MIDDLE:1, RIGHT:2};
goog.events.BrowserEvent.IEButtonMap = [1, 4, 2];
goog.events.BrowserEvent.prototype.init = function(a, b) {
  var c = this.type = a.type, d = a.changedTouches ? a.changedTouches[0] : null;
  this.target = a.target || a.srcElement;
  this.currentTarget = b;
  (b = a.relatedTarget) ? goog.userAgent.GECKO && (goog.reflect.canAccessProperty(b, "nodeName") || (b = null)) : c == goog.events.EventType.MOUSEOVER ? b = a.fromElement : c == goog.events.EventType.MOUSEOUT && (b = a.toElement);
  this.relatedTarget = b;
  goog.isNull(d) ? (this.offsetX = goog.userAgent.WEBKIT || void 0 !== a.offsetX ? a.offsetX : a.layerX, this.offsetY = goog.userAgent.WEBKIT || void 0 !== a.offsetY ? a.offsetY : a.layerY, this.clientX = void 0 !== a.clientX ? a.clientX : a.pageX, this.clientY = void 0 !== a.clientY ? a.clientY : a.pageY, this.screenX = a.screenX || 0, this.screenY = a.screenY || 0) : (this.clientX = void 0 !== d.clientX ? d.clientX : d.pageX, this.clientY = void 0 !== d.clientY ? d.clientY : d.pageY, this.screenX =
  d.screenX || 0, this.screenY = d.screenY || 0);
  this.button = a.button;
  this.keyCode = a.keyCode || 0;
  this.key = a.key || "";
  this.charCode = a.charCode || ("keypress" == c ? a.keyCode : 0);
  this.ctrlKey = a.ctrlKey;
  this.altKey = a.altKey;
  this.shiftKey = a.shiftKey;
  this.metaKey = a.metaKey;
  this.platformModifierKey = goog.userAgent.MAC ? a.metaKey : a.ctrlKey;
  this.state = a.state;
  this.event_ = a;
  a.defaultPrevented && this.preventDefault();
};
goog.events.BrowserEvent.prototype.isButton = function(a) {
  return goog.events.BrowserFeature.HAS_W3C_BUTTON ? this.event_.button == a : "click" == this.type ? a == goog.events.BrowserEvent.MouseButton.LEFT : !!(this.event_.button & goog.events.BrowserEvent.IEButtonMap[a]);
};
goog.events.BrowserEvent.prototype.isMouseActionButton = function() {
  return this.isButton(goog.events.BrowserEvent.MouseButton.LEFT) && !(goog.userAgent.WEBKIT && goog.userAgent.MAC && this.ctrlKey);
};
goog.events.BrowserEvent.prototype.stopPropagation = function() {
  goog.events.BrowserEvent.superClass_.stopPropagation.call(this);
  this.event_.stopPropagation ? this.event_.stopPropagation() : this.event_.cancelBubble = !0;
};
goog.events.BrowserEvent.prototype.preventDefault = function() {
  goog.events.BrowserEvent.superClass_.preventDefault.call(this);
  var a = this.event_;
  if (a.preventDefault) {
    a.preventDefault();
  } else {
    if (a.returnValue = !1, goog.events.BrowserFeature.SET_KEY_CODE_TO_PREVENT_DEFAULT) {
      try {
        if (a.ctrlKey || 112 <= a.keyCode && 123 >= a.keyCode) {
          a.keyCode = -1;
        }
      } catch (b) {
      }
    }
  }
};
goog.events.BrowserEvent.prototype.getBrowserEvent = function() {
  return this.event_;
};
bot.events = {};
bot.events.SUPPORTS_TOUCH_EVENTS = !(goog.userAgent.IE && !bot.userAgent.isEngineVersion(10));
bot.events.BROKEN_TOUCH_API_ = function() {
  return goog.userAgent.product.ANDROID ? !bot.userAgent.isProductVersion(4) : !bot.userAgent.IOS;
}();
bot.events.SUPPORTS_MSPOINTER_EVENTS = goog.userAgent.IE && bot.getWindow().navigator.msPointerEnabled;
bot.events.EventFactory_ = function(a, b, c) {
  this.type_ = a;
  this.bubbles_ = b;
  this.cancelable_ = c;
};
bot.events.EventFactory_.prototype.create = function(a, b) {
  a = goog.dom.getOwnerDocument(a);
  bot.userAgent.IE_DOC_PRE9 && a.createEventObject ? a = a.createEventObject() : (a = a.createEvent("HTMLEvents"), a.initEvent(this.type_, this.bubbles_, this.cancelable_));
  return a;
};
bot.events.EventFactory_.prototype.toString = function() {
  return this.type_;
};
bot.events.MouseEventFactory_ = function(a, b, c) {
  bot.events.EventFactory_.call(this, a, b, c);
};
goog.inherits(bot.events.MouseEventFactory_, bot.events.EventFactory_);
bot.events.MouseEventFactory_.prototype.create = function(a, b) {
  if (!goog.userAgent.GECKO && this == bot.events.EventType.MOUSEPIXELSCROLL) {
    throw new bot.Error(bot.ErrorCode.UNSUPPORTED_OPERATION, "Browser does not support a mouse pixel scroll event.");
  }
  var c = goog.dom.getOwnerDocument(a);
  if (bot.userAgent.IE_DOC_PRE9) {
    var d = c.createEventObject();
    d.altKey = b.altKey;
    d.ctrlKey = b.ctrlKey;
    d.metaKey = b.metaKey;
    d.shiftKey = b.shiftKey;
    d.button = b.button;
    d.clientX = b.clientX;
    d.clientY = b.clientY;
    c = function(a, b) {
      Object.defineProperty(d, a, {get:function() {
        return b;
      }});
    };
    if (this == bot.events.EventType.MOUSEOUT || this == bot.events.EventType.MOUSEOVER) {
      if (Object.defineProperty) {
        var e = this == bot.events.EventType.MOUSEOUT;
        c("fromElement", e ? a : b.relatedTarget);
        c("toElement", e ? b.relatedTarget : a);
      } else {
        d.relatedTarget = b.relatedTarget;
      }
    }
    this == bot.events.EventType.MOUSEWHEEL && (Object.defineProperty ? c("wheelDelta", b.wheelDelta) : d.detail = b.wheelDelta);
  } else {
    e = goog.dom.getWindow(c);
    d = c.createEvent("MouseEvents");
    var f = 1;
    this == bot.events.EventType.MOUSEWHEEL && (goog.userAgent.GECKO || (d.wheelDelta = b.wheelDelta), goog.userAgent.GECKO && (f = b.wheelDelta / -40));
    goog.userAgent.GECKO && this == bot.events.EventType.MOUSEPIXELSCROLL && (f = b.wheelDelta);
    d.initMouseEvent(this.type_, this.bubbles_, this.cancelable_, e, f, b.clientX, b.clientY, b.clientX, b.clientY, b.ctrlKey, b.altKey, b.shiftKey, b.metaKey, b.button, b.relatedTarget);
    if (goog.userAgent.IE && 0 === d.pageX && 0 === d.pageY && Object.defineProperty) {
      a = goog.dom.getDomHelper(a).getDocumentScrollElement();
      var c = goog.style.getClientViewportElement(c), g = b.clientX + a.scrollLeft - c.clientLeft, h = b.clientY + a.scrollTop - c.clientTop;
      Object.defineProperty(d, "pageX", {get:function() {
        return g;
      }});
      Object.defineProperty(d, "pageY", {get:function() {
        return h;
      }});
    }
  }
  return d;
};
bot.events.KeyboardEventFactory_ = function(a, b, c) {
  bot.events.EventFactory_.call(this, a, b, c);
};
goog.inherits(bot.events.KeyboardEventFactory_, bot.events.EventFactory_);
bot.events.KeyboardEventFactory_.prototype.create = function(a, b) {
  var c = goog.dom.getOwnerDocument(a);
  if (goog.userAgent.GECKO) {
    a = goog.dom.getWindow(c);
    var d = b.charCode ? 0 : b.keyCode, c = c.createEvent("KeyboardEvent");
    c.initKeyEvent(this.type_, this.bubbles_, this.cancelable_, a, b.ctrlKey, b.altKey, b.shiftKey, b.metaKey, d, b.charCode);
    this.type_ == bot.events.EventType.KEYPRESS && b.preventDefault && c.preventDefault();
  } else {
    if (bot.userAgent.IE_DOC_PRE9 ? c = c.createEventObject() : (c = c.createEvent("Events"), c.initEvent(this.type_, this.bubbles_, this.cancelable_)), c.altKey = b.altKey, c.ctrlKey = b.ctrlKey, c.metaKey = b.metaKey, c.shiftKey = b.shiftKey, c.keyCode = b.charCode || b.keyCode, goog.userAgent.WEBKIT || goog.userAgent.EDGE) {
      c.charCode = this == bot.events.EventType.KEYPRESS ? c.keyCode : 0;
    }
  }
  return c;
};
bot.events.TouchEventStrategy_ = {MOUSE_EVENTS:1, INIT_TOUCH_EVENT:2, TOUCH_EVENT_CTOR:3};
bot.events.TouchEventFactory_ = function(a, b, c) {
  bot.events.EventFactory_.call(this, a, b, c);
};
goog.inherits(bot.events.TouchEventFactory_, bot.events.EventFactory_);
bot.events.TouchEventFactory_.prototype.create = function(a, b) {
  function c(b) {
    b = goog.array.map(b, function(b) {
      return g.createTouch(h, a, b.identifier, b.pageX, b.pageY, b.screenX, b.screenY);
    });
    return g.createTouchList.apply(g, b);
  }
  function d(b) {
    var c = goog.array.map(b, function(b) {
      return {identifier:b.identifier, screenX:b.screenX, screenY:b.screenY, clientX:b.clientX, clientY:b.clientY, pageX:b.pageX, pageY:b.pageY, target:a};
    });
    c.item = function(a) {
      return c[a];
    };
    return c;
  }
  function e(b) {
    return goog.array.map(b, function(b) {
      return new Touch({identifier:b.identifier, screenX:b.screenX, screenY:b.screenY, clientX:b.clientX, clientY:b.clientY, pageX:b.pageX, pageY:b.pageY, target:a});
    });
  }
  function f(a, b) {
    switch(a) {
      case bot.events.TouchEventStrategy_.MOUSE_EVENTS:
        return d(b);
      case bot.events.TouchEventStrategy_.INIT_TOUCH_EVENT:
        return c(b);
      case bot.events.TouchEventStrategy_.TOUCH_EVENT_CTOR:
        return e(b);
    }
    return null;
  }
  if (!bot.events.SUPPORTS_TOUCH_EVENTS) {
    throw new bot.Error(bot.ErrorCode.UNSUPPORTED_OPERATION, "Browser does not support firing touch events.");
  }
  var g = goog.dom.getOwnerDocument(a), h = goog.dom.getWindow(g);
  if (bot.events.BROKEN_TOUCH_API_) {
    var k = bot.events.TouchEventStrategy_.MOUSE_EVENTS;
  } else {
    if (TouchEvent.prototype.initTouchEvent) {
      k = bot.events.TouchEventStrategy_.INIT_TOUCH_EVENT;
    } else {
      if (TouchEvent && 0 < TouchEvent.length) {
        k = bot.events.TouchEventStrategy_.TOUCH_EVENT_CTOR;
      } else {
        throw new bot.Error(bot.ErrorCode.UNSUPPORTED_OPERATION, "Not able to create touch events in this browser");
      }
    }
  }
  var l = f(k, b.changedTouches), m = b.touches == b.changedTouches ? l : f(k, b.touches), n = b.targetTouches == b.changedTouches ? l : f(k, b.targetTouches);
  if (k == bot.events.TouchEventStrategy_.MOUSE_EVENTS) {
    k = g.createEvent("MouseEvents"), k.initMouseEvent(this.type_, this.bubbles_, this.cancelable_, h, 1, 0, 0, b.clientX, b.clientY, b.ctrlKey, b.altKey, b.shiftKey, b.metaKey, 0, b.relatedTarget), k.touches = m, k.targetTouches = n, k.changedTouches = l, k.scale = b.scale, k.rotation = b.rotation;
  } else {
    if (k == bot.events.TouchEventStrategy_.INIT_TOUCH_EVENT) {
      k = g.createEvent("TouchEvent"), 0 == k.initTouchEvent.length ? k.initTouchEvent(m, n, l, this.type_, h, 0, 0, b.clientX, b.clientY, b.ctrlKey, b.altKey, b.shiftKey, b.metaKey) : k.initTouchEvent(this.type_, this.bubbles_, this.cancelable_, h, 1, 0, 0, b.clientX, b.clientY, b.ctrlKey, b.altKey, b.shiftKey, b.metaKey, m, n, l, b.scale, b.rotation), k.relatedTarget = b.relatedTarget;
    } else {
      if (k == bot.events.TouchEventStrategy_.TOUCH_EVENT_CTOR) {
        k = new TouchEvent(this.type_, {touches:m, targetTouches:n, changedTouches:l, bubbles:this.bubbles_, cancelable:this.cancelable_, ctrlKey:b.ctrlKey, shiftKey:b.shiftKey, altKey:b.altKey, metaKey:b.metaKey});
      } else {
        throw new bot.Error(bot.ErrorCode.UNSUPPORTED_OPERATION, "Illegal TouchEventStrategy_ value (this is a bug)");
      }
    }
  }
  return k;
};
bot.events.MSGestureEventFactory_ = function(a, b, c) {
  bot.events.EventFactory_.call(this, a, b, c);
};
goog.inherits(bot.events.MSGestureEventFactory_, bot.events.EventFactory_);
bot.events.MSGestureEventFactory_.prototype.create = function(a, b) {
  if (!bot.events.SUPPORTS_MSPOINTER_EVENTS) {
    throw new bot.Error(bot.ErrorCode.UNSUPPORTED_OPERATION, "Browser does not support MSGesture events.");
  }
  var c = goog.dom.getOwnerDocument(a);
  a = goog.dom.getWindow(c);
  var c = c.createEvent("MSGestureEvent"), d = (new Date).getTime();
  c.initGestureEvent(this.type_, this.bubbles_, this.cancelable_, a, 1, 0, 0, b.clientX, b.clientY, 0, 0, b.translationX, b.translationY, b.scale, b.expansion, b.rotation, b.velocityX, b.velocityY, b.velocityExpansion, b.velocityAngular, d, b.relatedTarget);
  return c;
};
bot.events.MSPointerEventFactory_ = function(a, b, c) {
  bot.events.EventFactory_.call(this, a, b, c);
};
goog.inherits(bot.events.MSPointerEventFactory_, bot.events.EventFactory_);
bot.events.MSPointerEventFactory_.prototype.create = function(a, b) {
  if (!bot.events.SUPPORTS_MSPOINTER_EVENTS) {
    throw new bot.Error(bot.ErrorCode.UNSUPPORTED_OPERATION, "Browser does not support MSPointer events.");
  }
  var c = goog.dom.getOwnerDocument(a);
  a = goog.dom.getWindow(c);
  c = c.createEvent("MSPointerEvent");
  c.initPointerEvent(this.type_, this.bubbles_, this.cancelable_, a, 0, 0, 0, b.clientX, b.clientY, b.ctrlKey, b.altKey, b.shiftKey, b.metaKey, b.button, b.relatedTarget, 0, 0, b.width, b.height, b.pressure, b.rotation, b.tiltX, b.tiltY, b.pointerId, b.pointerType, 0, b.isPrimary);
  return c;
};
bot.events.EventType = {BLUR:new bot.events.EventFactory_("blur", !1, !1), CHANGE:new bot.events.EventFactory_("change", !0, !1), FOCUS:new bot.events.EventFactory_("focus", !1, !1), FOCUSIN:new bot.events.EventFactory_("focusin", !0, !1), FOCUSOUT:new bot.events.EventFactory_("focusout", !0, !1), INPUT:new bot.events.EventFactory_("input", !0, !1), ORIENTATIONCHANGE:new bot.events.EventFactory_("orientationchange", !1, !1), PROPERTYCHANGE:new bot.events.EventFactory_("propertychange", !1, !1), SELECT:new bot.events.EventFactory_("select",
!0, !1), SUBMIT:new bot.events.EventFactory_("submit", !0, !0), TEXTINPUT:new bot.events.EventFactory_("textInput", !0, !0), CLICK:new bot.events.MouseEventFactory_("click", !0, !0), CONTEXTMENU:new bot.events.MouseEventFactory_("contextmenu", !0, !0), DBLCLICK:new bot.events.MouseEventFactory_("dblclick", !0, !0), MOUSEDOWN:new bot.events.MouseEventFactory_("mousedown", !0, !0), MOUSEMOVE:new bot.events.MouseEventFactory_("mousemove", !0, !1), MOUSEOUT:new bot.events.MouseEventFactory_("mouseout",
!0, !0), MOUSEOVER:new bot.events.MouseEventFactory_("mouseover", !0, !0), MOUSEUP:new bot.events.MouseEventFactory_("mouseup", !0, !0), MOUSEWHEEL:new bot.events.MouseEventFactory_(goog.userAgent.GECKO ? "DOMMouseScroll" : "mousewheel", !0, !0), MOUSEPIXELSCROLL:new bot.events.MouseEventFactory_("MozMousePixelScroll", !0, !0), KEYDOWN:new bot.events.KeyboardEventFactory_("keydown", !0, !0), KEYPRESS:new bot.events.KeyboardEventFactory_("keypress", !0, !0), KEYUP:new bot.events.KeyboardEventFactory_("keyup",
!0, !0), TOUCHEND:new bot.events.TouchEventFactory_("touchend", !0, !0), TOUCHMOVE:new bot.events.TouchEventFactory_("touchmove", !0, !0), TOUCHSTART:new bot.events.TouchEventFactory_("touchstart", !0, !0), MSGESTURECHANGE:new bot.events.MSGestureEventFactory_("MSGestureChange", !0, !0), MSGESTUREEND:new bot.events.MSGestureEventFactory_("MSGestureEnd", !0, !0), MSGESTUREHOLD:new bot.events.MSGestureEventFactory_("MSGestureHold", !0, !0), MSGESTURESTART:new bot.events.MSGestureEventFactory_("MSGestureStart",
!0, !0), MSGESTURETAP:new bot.events.MSGestureEventFactory_("MSGestureTap", !0, !0), MSINERTIASTART:new bot.events.MSGestureEventFactory_("MSInertiaStart", !0, !0), MSGOTPOINTERCAPTURE:new bot.events.MSPointerEventFactory_("MSGotPointerCapture", !0, !1), MSLOSTPOINTERCAPTURE:new bot.events.MSPointerEventFactory_("MSLostPointerCapture", !0, !1), MSPOINTERCANCEL:new bot.events.MSPointerEventFactory_("MSPointerCancel", !0, !0), MSPOINTERDOWN:new bot.events.MSPointerEventFactory_("MSPointerDown", !0,
!0), MSPOINTERMOVE:new bot.events.MSPointerEventFactory_("MSPointerMove", !0, !0), MSPOINTEROVER:new bot.events.MSPointerEventFactory_("MSPointerOver", !0, !0), MSPOINTEROUT:new bot.events.MSPointerEventFactory_("MSPointerOut", !0, !0), MSPOINTERUP:new bot.events.MSPointerEventFactory_("MSPointerUp", !0, !0)};
bot.events.fire = function(a, b, c) {
  c = b.create(a, c);
  "isTrusted" in c || (c.isTrusted = !1);
  return bot.userAgent.IE_DOC_PRE9 && a.fireEvent ? a.fireEvent("on" + b.type_, c) : a.dispatchEvent(c);
};
bot.events.isSynthetic = function(a) {
  a = a.getBrowserEvent ? a.getBrowserEvent() : a;
  return "isTrusted" in a ? !a.isTrusted : !1;
};
goog.dom.InputType = {BUTTON:"button", CHECKBOX:"checkbox", COLOR:"color", DATE:"date", DATETIME:"datetime", DATETIME_LOCAL:"datetime-local", EMAIL:"email", FILE:"file", HIDDEN:"hidden", IMAGE:"image", MENU:"menu", MONTH:"month", NUMBER:"number", PASSWORD:"password", RADIO:"radio", RANGE:"range", RESET:"reset", SEARCH:"search", SELECT_MULTIPLE:"select-multiple", SELECT_ONE:"select-one", SUBMIT:"submit", TEL:"tel", TEXT:"text", TEXTAREA:"textarea", TIME:"time", URL:"url", WEEK:"week"};
goog.dom.selection = {};
goog.dom.selection.setStart = function(a, b) {
  if (goog.dom.selection.useSelectionProperties_(a)) {
    a.selectionStart = b;
  } else {
    if (goog.dom.selection.isLegacyIe_()) {
      var c = goog.dom.selection.getRangeIe_(a), d = c[0];
      d.inRange(c[1]) && (b = goog.dom.selection.canonicalizePositionIe_(a, b), d.collapse(!0), d.move("character", b), d.select());
    }
  }
};
goog.dom.selection.getStart = function(a) {
  return goog.dom.selection.getEndPoints_(a, !0)[0];
};
goog.dom.selection.getEndPointsTextareaIe_ = function(a, b, c) {
  b = b.duplicate();
  for (var d = a.text, e = d, f = b.text, g = f, h = !1; !h;) {
    0 == a.compareEndPoints("StartToEnd", a) ? h = !0 : (a.moveEnd("character", -1), a.text == d ? e += "\r\n" : h = !0);
  }
  if (c) {
    return [e.length, -1];
  }
  for (a = !1; !a;) {
    0 == b.compareEndPoints("StartToEnd", b) ? a = !0 : (b.moveEnd("character", -1), b.text == f ? g += "\r\n" : a = !0);
  }
  return [e.length, e.length + g.length];
};
goog.dom.selection.getEndPoints = function(a) {
  return goog.dom.selection.getEndPoints_(a, !1);
};
goog.dom.selection.getEndPoints_ = function(a, b) {
  var c = 0, d = 0;
  if (goog.dom.selection.useSelectionProperties_(a)) {
    c = a.selectionStart, d = b ? -1 : a.selectionEnd;
  } else {
    if (goog.dom.selection.isLegacyIe_()) {
      var e = goog.dom.selection.getRangeIe_(a), f = e[0], e = e[1];
      if (f.inRange(e)) {
        f.setEndPoint("EndToStart", e);
        if (a.type == goog.dom.InputType.TEXTAREA) {
          return goog.dom.selection.getEndPointsTextareaIe_(f, e, b);
        }
        c = f.text.length;
        d = b ? -1 : f.text.length + e.text.length;
      }
    }
  }
  return [c, d];
};
goog.dom.selection.setEnd = function(a, b) {
  if (goog.dom.selection.useSelectionProperties_(a)) {
    a.selectionEnd = b;
  } else {
    if (goog.dom.selection.isLegacyIe_()) {
      var c = goog.dom.selection.getRangeIe_(a), d = c[1];
      c[0].inRange(d) && (b = goog.dom.selection.canonicalizePositionIe_(a, b), a = goog.dom.selection.canonicalizePositionIe_(a, goog.dom.selection.getStart(a)), d.collapse(!0), d.moveEnd("character", b - a), d.select());
    }
  }
};
goog.dom.selection.getEnd = function(a) {
  return goog.dom.selection.getEndPoints_(a, !1)[1];
};
goog.dom.selection.setCursorPosition = function(a, b) {
  goog.dom.selection.useSelectionProperties_(a) ? (a.selectionStart = b, a.selectionEnd = b) : goog.dom.selection.isLegacyIe_() && (b = goog.dom.selection.canonicalizePositionIe_(a, b), a = a.createTextRange(), a.collapse(!0), a.move("character", b), a.select());
};
goog.dom.selection.setText = function(a, b) {
  if (goog.dom.selection.useSelectionProperties_(a)) {
    var c = a.value, d = a.selectionStart, e = c.substr(0, d), c = c.substr(a.selectionEnd);
    a.value = e + b + c;
    a.selectionStart = d;
    a.selectionEnd = d + b.length;
  } else {
    if (goog.dom.selection.isLegacyIe_()) {
      d = goog.dom.selection.getRangeIe_(a), a = d[1], d[0].inRange(a) && (d = a.duplicate(), a.text = b, a.setEndPoint("StartToStart", d), a.select());
    } else {
      throw Error("Cannot set the selection end");
    }
  }
};
goog.dom.selection.getText = function(a) {
  if (goog.dom.selection.useSelectionProperties_(a)) {
    return a.value.substring(a.selectionStart, a.selectionEnd);
  }
  if (goog.dom.selection.isLegacyIe_()) {
    var b = goog.dom.selection.getRangeIe_(a), c = b[1];
    return b[0].inRange(c) ? a.type == goog.dom.InputType.TEXTAREA ? goog.dom.selection.getSelectionRangeText_(c) : c.text : "";
  }
  throw Error("Cannot get the selection text");
};
goog.dom.selection.getSelectionRangeText_ = function(a) {
  a = a.duplicate();
  for (var b = a.text, c = b, d = !1; !d;) {
    0 == a.compareEndPoints("StartToEnd", a) ? d = !0 : (a.moveEnd("character", -1), a.text == b ? c += "\r\n" : d = !0);
  }
  return c;
};
goog.dom.selection.getRangeIe_ = function(a) {
  var b = a.ownerDocument || a.document, c = b.selection.createRange();
  a.type == goog.dom.InputType.TEXTAREA ? (b = b.body.createTextRange(), b.moveToElementText(a)) : b = a.createTextRange();
  return [b, c];
};
goog.dom.selection.canonicalizePositionIe_ = function(a, b) {
  a.type == goog.dom.InputType.TEXTAREA && (a = a.value.substring(0, b), b = goog.string.canonicalizeNewlines(a).length);
  return b;
};
goog.dom.selection.useSelectionProperties_ = function(a) {
  try {
    return "number" == typeof a.selectionStart;
  } catch (b) {
    return !1;
  }
};
goog.dom.selection.isLegacyIe_ = function() {
  return goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9");
};
goog.functions = {};
goog.functions.constant = function(a) {
  return function() {
    return a;
  };
};
goog.functions.FALSE = goog.functions.constant(!1);
goog.functions.TRUE = goog.functions.constant(!0);
goog.functions.NULL = goog.functions.constant(null);
goog.functions.identity = function(a, b) {
  return a;
};
goog.functions.error = function(a) {
  return function() {
    throw Error(a);
  };
};
goog.functions.fail = function(a) {
  return function() {
    throw a;
  };
};
goog.functions.lock = function(a, b) {
  b = b || 0;
  return function() {
    return a.apply(this, Array.prototype.slice.call(arguments, 0, b));
  };
};
goog.functions.nth = function(a) {
  return function() {
    return arguments[a];
  };
};
goog.functions.partialRight = function(a, b) {
  var c = Array.prototype.slice.call(arguments, 1);
  return function() {
    var b = Array.prototype.slice.call(arguments);
    b.push.apply(b, c);
    return a.apply(this, b);
  };
};
goog.functions.withReturnValue = function(a, b) {
  return goog.functions.sequence(a, goog.functions.constant(b));
};
goog.functions.equalTo = function(a, b) {
  return function(c) {
    return b ? a == c : a === c;
  };
};
goog.functions.compose = function(a, b) {
  var c = arguments, d = c.length;
  return function() {
    var a;
    d && (a = c[d - 1].apply(this, arguments));
    for (var b = d - 2; 0 <= b; b--) {
      a = c[b].call(this, a);
    }
    return a;
  };
};
goog.functions.sequence = function(a) {
  var b = arguments, c = b.length;
  return function() {
    for (var a, e = 0; e < c; e++) {
      a = b[e].apply(this, arguments);
    }
    return a;
  };
};
goog.functions.and = function(a) {
  var b = arguments, c = b.length;
  return function() {
    for (var a = 0; a < c; a++) {
      if (!b[a].apply(this, arguments)) {
        return !1;
      }
    }
    return !0;
  };
};
goog.functions.or = function(a) {
  var b = arguments, c = b.length;
  return function() {
    for (var a = 0; a < c; a++) {
      if (b[a].apply(this, arguments)) {
        return !0;
      }
    }
    return !1;
  };
};
goog.functions.not = function(a) {
  return function() {
    return !a.apply(this, arguments);
  };
};
goog.functions.create = function(a, b) {
  var c = function() {
  };
  c.prototype = a.prototype;
  c = new c;
  a.apply(c, Array.prototype.slice.call(arguments, 1));
  return c;
};
goog.functions.CACHE_RETURN_VALUE = !0;
goog.functions.cacheReturnValue = function(a) {
  var b = !1, c;
  return function() {
    if (!goog.functions.CACHE_RETURN_VALUE) {
      return a();
    }
    b || (c = a(), b = !0);
    return c;
  };
};
goog.functions.once = function(a) {
  var b = a;
  return function() {
    if (b) {
      var a = b;
      b = null;
      a();
    }
  };
};
goog.functions.debounce = function(a, b, c) {
  var d = 0;
  return function(e) {
    goog.global.clearTimeout(d);
    var f = arguments;
    d = goog.global.setTimeout(function() {
      a.apply(c, f);
    }, b);
  };
};
goog.functions.throttle = function(a, b, c) {
  var d = 0, e = !1, f = [], g = function() {
    d = 0;
    e && (e = !1, h());
  }, h = function() {
    d = goog.global.setTimeout(g, b);
    a.apply(c, f);
  };
  return function(a) {
    f = arguments;
    d ? e = !0 : h();
  };
};
goog.functions.rateLimit = function(a, b, c) {
  var d = 0, e = function() {
    d = 0;
  };
  return function(f) {
    d || (d = goog.global.setTimeout(e, b), a.apply(c, arguments));
  };
};
goog.iter = {};
goog.iter.StopIteration = "StopIteration" in goog.global ? goog.global.StopIteration : {message:"StopIteration", stack:""};
goog.iter.Iterator = function() {
};
goog.iter.Iterator.prototype.next = function() {
  throw goog.iter.StopIteration;
};
goog.iter.Iterator.prototype.__iterator__ = function(a) {
  return this;
};
goog.iter.toIterator = function(a) {
  if (a instanceof goog.iter.Iterator) {
    return a;
  }
  if ("function" == typeof a.__iterator__) {
    return a.__iterator__(!1);
  }
  if (goog.isArrayLike(a)) {
    var b = 0, c = new goog.iter.Iterator;
    c.next = function() {
      for (;;) {
        if (b >= a.length) {
          throw goog.iter.StopIteration;
        }
        if (b in a) {
          return a[b++];
        }
        b++;
      }
    };
    return c;
  }
  throw Error("Not implemented");
};
goog.iter.forEach = function(a, b, c) {
  if (goog.isArrayLike(a)) {
    try {
      goog.array.forEach(a, b, c);
    } catch (d) {
      if (d !== goog.iter.StopIteration) {
        throw d;
      }
    }
  } else {
    a = goog.iter.toIterator(a);
    try {
      for (;;) {
        b.call(c, a.next(), void 0, a);
      }
    } catch (d) {
      if (d !== goog.iter.StopIteration) {
        throw d;
      }
    }
  }
};
goog.iter.filter = function(a, b, c) {
  var d = goog.iter.toIterator(a);
  a = new goog.iter.Iterator;
  a.next = function() {
    for (;;) {
      var a = d.next();
      if (b.call(c, a, void 0, d)) {
        return a;
      }
    }
  };
  return a;
};
goog.iter.filterFalse = function(a, b, c) {
  return goog.iter.filter(a, goog.functions.not(b), c);
};
goog.iter.range = function(a, b, c) {
  var d = 0, e = a, f = c || 1;
  1 < arguments.length && (d = a, e = b);
  if (0 == f) {
    throw Error("Range step argument must not be zero");
  }
  var g = new goog.iter.Iterator;
  g.next = function() {
    if (0 < f && d >= e || 0 > f && d <= e) {
      throw goog.iter.StopIteration;
    }
    var a = d;
    d += f;
    return a;
  };
  return g;
};
goog.iter.join = function(a, b) {
  return goog.iter.toArray(a).join(b);
};
goog.iter.map = function(a, b, c) {
  var d = goog.iter.toIterator(a);
  a = new goog.iter.Iterator;
  a.next = function() {
    var a = d.next();
    return b.call(c, a, void 0, d);
  };
  return a;
};
goog.iter.reduce = function(a, b, c, d) {
  var e = c;
  goog.iter.forEach(a, function(a) {
    e = b.call(d, e, a);
  });
  return e;
};
goog.iter.some = function(a, b, c) {
  a = goog.iter.toIterator(a);
  try {
    for (;;) {
      if (b.call(c, a.next(), void 0, a)) {
        return !0;
      }
    }
  } catch (d) {
    if (d !== goog.iter.StopIteration) {
      throw d;
    }
  }
  return !1;
};
goog.iter.every = function(a, b, c) {
  a = goog.iter.toIterator(a);
  try {
    for (;;) {
      if (!b.call(c, a.next(), void 0, a)) {
        return !1;
      }
    }
  } catch (d) {
    if (d !== goog.iter.StopIteration) {
      throw d;
    }
  }
  return !0;
};
goog.iter.chain = function(a) {
  return goog.iter.chainFromIterable(arguments);
};
goog.iter.chainFromIterable = function(a) {
  var b = goog.iter.toIterator(a);
  a = new goog.iter.Iterator;
  var c = null;
  a.next = function() {
    for (;;) {
      if (null == c) {
        var a = b.next();
        c = goog.iter.toIterator(a);
      }
      try {
        return c.next();
      } catch (e) {
        if (e !== goog.iter.StopIteration) {
          throw e;
        }
        c = null;
      }
    }
  };
  return a;
};
goog.iter.dropWhile = function(a, b, c) {
  var d = goog.iter.toIterator(a);
  a = new goog.iter.Iterator;
  var e = !0;
  a.next = function() {
    for (;;) {
      var a = d.next();
      if (!e || !b.call(c, a, void 0, d)) {
        return e = !1, a;
      }
    }
  };
  return a;
};
goog.iter.takeWhile = function(a, b, c) {
  var d = goog.iter.toIterator(a);
  a = new goog.iter.Iterator;
  a.next = function() {
    var a = d.next();
    if (b.call(c, a, void 0, d)) {
      return a;
    }
    throw goog.iter.StopIteration;
  };
  return a;
};
goog.iter.toArray = function(a) {
  if (goog.isArrayLike(a)) {
    return goog.array.toArray(a);
  }
  a = goog.iter.toIterator(a);
  var b = [];
  goog.iter.forEach(a, function(a) {
    b.push(a);
  });
  return b;
};
goog.iter.equals = function(a, b, c) {
  a = goog.iter.zipLongest({}, a, b);
  var d = c || goog.array.defaultCompareEquality;
  return goog.iter.every(a, function(a) {
    return d(a[0], a[1]);
  });
};
goog.iter.nextOrValue = function(a, b) {
  try {
    return goog.iter.toIterator(a).next();
  } catch (c) {
    if (c != goog.iter.StopIteration) {
      throw c;
    }
    return b;
  }
};
goog.iter.product = function(a) {
  if (goog.array.some(arguments, function(a) {
    return !a.length;
  }) || !arguments.length) {
    return new goog.iter.Iterator;
  }
  var b = new goog.iter.Iterator, c = arguments, d = goog.array.repeat(0, c.length);
  b.next = function() {
    if (d) {
      for (var a = goog.array.map(d, function(a, b) {
        return c[b][a];
      }), b = d.length - 1; 0 <= b; b--) {
        goog.asserts.assert(d);
        if (d[b] < c[b].length - 1) {
          d[b]++;
          break;
        }
        if (0 == b) {
          d = null;
          break;
        }
        d[b] = 0;
      }
      return a;
    }
    throw goog.iter.StopIteration;
  };
  return b;
};
goog.iter.cycle = function(a) {
  var b = goog.iter.toIterator(a), c = [], d = 0;
  a = new goog.iter.Iterator;
  var e = !1;
  a.next = function() {
    var a = null;
    if (!e) {
      try {
        return a = b.next(), c.push(a), a;
      } catch (g) {
        if (g != goog.iter.StopIteration || goog.array.isEmpty(c)) {
          throw g;
        }
        e = !0;
      }
    }
    a = c[d];
    d = (d + 1) % c.length;
    return a;
  };
  return a;
};
goog.iter.count = function(a, b) {
  var c = a || 0, d = goog.isDef(b) ? b : 1;
  a = new goog.iter.Iterator;
  a.next = function() {
    var a = c;
    c += d;
    return a;
  };
  return a;
};
goog.iter.repeat = function(a) {
  var b = new goog.iter.Iterator;
  b.next = goog.functions.constant(a);
  return b;
};
goog.iter.accumulate = function(a) {
  var b = goog.iter.toIterator(a), c = 0;
  a = new goog.iter.Iterator;
  a.next = function() {
    return c += b.next();
  };
  return a;
};
goog.iter.zip = function(a) {
  var b = arguments, c = new goog.iter.Iterator;
  if (0 < b.length) {
    var d = goog.array.map(b, goog.iter.toIterator);
    c.next = function() {
      return goog.array.map(d, function(a) {
        return a.next();
      });
    };
  }
  return c;
};
goog.iter.zipLongest = function(a, b) {
  var c = goog.array.slice(arguments, 1), d = new goog.iter.Iterator;
  if (0 < c.length) {
    var e = goog.array.map(c, goog.iter.toIterator);
    d.next = function() {
      var b = !1, c = goog.array.map(e, function(c) {
        try {
          var d = c.next();
          b = !0;
        } catch (l) {
          if (l !== goog.iter.StopIteration) {
            throw l;
          }
          d = a;
        }
        return d;
      });
      if (!b) {
        throw goog.iter.StopIteration;
      }
      return c;
    };
  }
  return d;
};
goog.iter.compress = function(a, b) {
  var c = goog.iter.toIterator(b);
  return goog.iter.filter(a, function() {
    return !!c.next();
  });
};
goog.iter.GroupByIterator_ = function(a, b) {
  this.iterator = goog.iter.toIterator(a);
  this.keyFunc = b || goog.functions.identity;
};
goog.inherits(goog.iter.GroupByIterator_, goog.iter.Iterator);
goog.iter.GroupByIterator_.prototype.next = function() {
  for (; this.currentKey == this.targetKey;) {
    this.currentValue = this.iterator.next(), this.currentKey = this.keyFunc(this.currentValue);
  }
  this.targetKey = this.currentKey;
  return [this.currentKey, this.groupItems_(this.targetKey)];
};
goog.iter.GroupByIterator_.prototype.groupItems_ = function(a) {
  for (var b = []; this.currentKey == a;) {
    b.push(this.currentValue);
    try {
      this.currentValue = this.iterator.next();
    } catch (c) {
      if (c !== goog.iter.StopIteration) {
        throw c;
      }
      break;
    }
    this.currentKey = this.keyFunc(this.currentValue);
  }
  return b;
};
goog.iter.groupBy = function(a, b) {
  return new goog.iter.GroupByIterator_(a, b);
};
goog.iter.starMap = function(a, b, c) {
  var d = goog.iter.toIterator(a);
  a = new goog.iter.Iterator;
  a.next = function() {
    var a = goog.iter.toArray(d.next());
    return b.apply(c, goog.array.concat(a, void 0, d));
  };
  return a;
};
goog.iter.tee = function(a, b) {
  var c = goog.iter.toIterator(a);
  a = goog.isNumber(b) ? b : 2;
  var d = goog.array.map(goog.array.range(a), function() {
    return [];
  }), e = function() {
    var a = c.next();
    goog.array.forEach(d, function(b) {
      b.push(a);
    });
  };
  return goog.array.map(d, function(a) {
    var b = new goog.iter.Iterator;
    b.next = function() {
      goog.array.isEmpty(a) && e();
      goog.asserts.assert(!goog.array.isEmpty(a));
      return a.shift();
    };
    return b;
  });
};
goog.iter.enumerate = function(a, b) {
  return goog.iter.zip(goog.iter.count(b), a);
};
goog.iter.limit = function(a, b) {
  goog.asserts.assert(goog.math.isInt(b) && 0 <= b);
  var c = goog.iter.toIterator(a);
  a = new goog.iter.Iterator;
  var d = b;
  a.next = function() {
    if (0 < d--) {
      return c.next();
    }
    throw goog.iter.StopIteration;
  };
  return a;
};
goog.iter.consume = function(a, b) {
  goog.asserts.assert(goog.math.isInt(b) && 0 <= b);
  for (a = goog.iter.toIterator(a); 0 < b--;) {
    goog.iter.nextOrValue(a, null);
  }
  return a;
};
goog.iter.slice = function(a, b, c) {
  goog.asserts.assert(goog.math.isInt(b) && 0 <= b);
  a = goog.iter.consume(a, b);
  goog.isNumber(c) && (goog.asserts.assert(goog.math.isInt(c) && c >= b), a = goog.iter.limit(a, c - b));
  return a;
};
goog.iter.hasDuplicates_ = function(a) {
  var b = [];
  goog.array.removeDuplicates(a, b);
  return a.length != b.length;
};
goog.iter.permutations = function(a, b) {
  a = goog.iter.toArray(a);
  b = goog.isNumber(b) ? b : a.length;
  b = goog.array.repeat(a, b);
  b = goog.iter.product.apply(void 0, b);
  return goog.iter.filter(b, function(a) {
    return !goog.iter.hasDuplicates_(a);
  });
};
goog.iter.combinations = function(a, b) {
  function c(a) {
    return d[a];
  }
  var d = goog.iter.toArray(a);
  a = goog.iter.range(d.length);
  b = goog.iter.permutations(a, b);
  var e = goog.iter.filter(b, function(a) {
    return goog.array.isSorted(a);
  });
  b = new goog.iter.Iterator;
  b.next = function() {
    return goog.array.map(e.next(), c);
  };
  return b;
};
goog.iter.combinationsWithReplacement = function(a, b) {
  function c(a) {
    return d[a];
  }
  var d = goog.iter.toArray(a);
  a = goog.array.range(d.length);
  b = goog.array.repeat(a, b);
  b = goog.iter.product.apply(void 0, b);
  var e = goog.iter.filter(b, function(a) {
    return goog.array.isSorted(a);
  });
  b = new goog.iter.Iterator;
  b.next = function() {
    return goog.array.map(e.next(), c);
  };
  return b;
};
goog.structs = {};
goog.structs.Map = function(a, b) {
  this.map_ = {};
  this.keys_ = [];
  this.version_ = this.count_ = 0;
  var c = arguments.length;
  if (1 < c) {
    if (c % 2) {
      throw Error("Uneven number of arguments");
    }
    for (var d = 0; d < c; d += 2) {
      this.set(arguments[d], arguments[d + 1]);
    }
  } else {
    a && this.addAll(a);
  }
};
goog.structs.Map.prototype.getCount = function() {
  return this.count_;
};
goog.structs.Map.prototype.getValues = function() {
  this.cleanupKeysArray_();
  for (var a = [], b = 0; b < this.keys_.length; b++) {
    a.push(this.map_[this.keys_[b]]);
  }
  return a;
};
goog.structs.Map.prototype.getKeys = function() {
  this.cleanupKeysArray_();
  return this.keys_.concat();
};
goog.structs.Map.prototype.containsKey = function(a) {
  return goog.structs.Map.hasKey_(this.map_, a);
};
goog.structs.Map.prototype.containsValue = function(a) {
  for (var b = 0; b < this.keys_.length; b++) {
    var c = this.keys_[b];
    if (goog.structs.Map.hasKey_(this.map_, c) && this.map_[c] == a) {
      return !0;
    }
  }
  return !1;
};
goog.structs.Map.prototype.equals = function(a, b) {
  if (this === a) {
    return !0;
  }
  if (this.count_ != a.getCount()) {
    return !1;
  }
  b = b || goog.structs.Map.defaultEquals;
  this.cleanupKeysArray_();
  for (var c, d = 0; c = this.keys_[d]; d++) {
    if (!b(this.get(c), a.get(c))) {
      return !1;
    }
  }
  return !0;
};
goog.structs.Map.defaultEquals = function(a, b) {
  return a === b;
};
goog.structs.Map.prototype.isEmpty = function() {
  return 0 == this.count_;
};
goog.structs.Map.prototype.clear = function() {
  this.map_ = {};
  this.version_ = this.count_ = this.keys_.length = 0;
};
goog.structs.Map.prototype.remove = function(a) {
  return goog.structs.Map.hasKey_(this.map_, a) ? (delete this.map_[a], this.count_--, this.version_++, this.keys_.length > 2 * this.count_ && this.cleanupKeysArray_(), !0) : !1;
};
goog.structs.Map.prototype.cleanupKeysArray_ = function() {
  var a, b;
  if (this.count_ != this.keys_.length) {
    for (a = b = 0; b < this.keys_.length;) {
      var c = this.keys_[b];
      goog.structs.Map.hasKey_(this.map_, c) && (this.keys_[a++] = c);
      b++;
    }
    this.keys_.length = a;
  }
  if (this.count_ != this.keys_.length) {
    var d = {};
    for (a = b = 0; b < this.keys_.length;) {
      c = this.keys_[b], goog.structs.Map.hasKey_(d, c) || (this.keys_[a++] = c, d[c] = 1), b++;
    }
    this.keys_.length = a;
  }
};
goog.structs.Map.prototype.get = function(a, b) {
  return goog.structs.Map.hasKey_(this.map_, a) ? this.map_[a] : b;
};
goog.structs.Map.prototype.set = function(a, b) {
  goog.structs.Map.hasKey_(this.map_, a) || (this.count_++, this.keys_.push(a), this.version_++);
  this.map_[a] = b;
};
goog.structs.Map.prototype.addAll = function(a) {
  if (a instanceof goog.structs.Map) {
    var b = a.getKeys();
    a = a.getValues();
  } else {
    b = goog.object.getKeys(a), a = goog.object.getValues(a);
  }
  for (var c = 0; c < b.length; c++) {
    this.set(b[c], a[c]);
  }
};
goog.structs.Map.prototype.forEach = function(a, b) {
  for (var c = this.getKeys(), d = 0; d < c.length; d++) {
    var e = c[d], f = this.get(e);
    a.call(b, f, e, this);
  }
};
goog.structs.Map.prototype.clone = function() {
  return new goog.structs.Map(this);
};
goog.structs.Map.prototype.transpose = function() {
  for (var a = new goog.structs.Map, b = 0; b < this.keys_.length; b++) {
    var c = this.keys_[b];
    a.set(this.map_[c], c);
  }
  return a;
};
goog.structs.Map.prototype.toObject = function() {
  this.cleanupKeysArray_();
  for (var a = {}, b = 0; b < this.keys_.length; b++) {
    var c = this.keys_[b];
    a[c] = this.map_[c];
  }
  return a;
};
goog.structs.Map.prototype.getKeyIterator = function() {
  return this.__iterator__(!0);
};
goog.structs.Map.prototype.getValueIterator = function() {
  return this.__iterator__(!1);
};
goog.structs.Map.prototype.__iterator__ = function(a) {
  this.cleanupKeysArray_();
  var b = 0, c = this.version_, d = this, e = new goog.iter.Iterator;
  e.next = function() {
    if (c != d.version_) {
      throw Error("The map has changed since the iterator was created");
    }
    if (b >= d.keys_.length) {
      throw goog.iter.StopIteration;
    }
    var e = d.keys_[b++];
    return a ? e : d.map_[e];
  };
  return e;
};
goog.structs.Map.hasKey_ = function(a, b) {
  return Object.prototype.hasOwnProperty.call(a, b);
};
goog.structs.getCount = function(a) {
  return a.getCount && "function" == typeof a.getCount ? a.getCount() : goog.isArrayLike(a) || goog.isString(a) ? a.length : goog.object.getCount(a);
};
goog.structs.getValues = function(a) {
  if (a.getValues && "function" == typeof a.getValues) {
    return a.getValues();
  }
  if (goog.isString(a)) {
    return a.split("");
  }
  if (goog.isArrayLike(a)) {
    for (var b = [], c = a.length, d = 0; d < c; d++) {
      b.push(a[d]);
    }
    return b;
  }
  return goog.object.getValues(a);
};
goog.structs.getKeys = function(a) {
  if (a.getKeys && "function" == typeof a.getKeys) {
    return a.getKeys();
  }
  if (!a.getValues || "function" != typeof a.getValues) {
    if (goog.isArrayLike(a) || goog.isString(a)) {
      var b = [];
      a = a.length;
      for (var c = 0; c < a; c++) {
        b.push(c);
      }
      return b;
    }
    return goog.object.getKeys(a);
  }
};
goog.structs.contains = function(a, b) {
  return a.contains && "function" == typeof a.contains ? a.contains(b) : a.containsValue && "function" == typeof a.containsValue ? a.containsValue(b) : goog.isArrayLike(a) || goog.isString(a) ? goog.array.contains(a, b) : goog.object.containsValue(a, b);
};
goog.structs.isEmpty = function(a) {
  return a.isEmpty && "function" == typeof a.isEmpty ? a.isEmpty() : goog.isArrayLike(a) || goog.isString(a) ? goog.array.isEmpty(a) : goog.object.isEmpty(a);
};
goog.structs.clear = function(a) {
  a.clear && "function" == typeof a.clear ? a.clear() : goog.isArrayLike(a) ? goog.array.clear(a) : goog.object.clear(a);
};
goog.structs.forEach = function(a, b, c) {
  if (a.forEach && "function" == typeof a.forEach) {
    a.forEach(b, c);
  } else {
    if (goog.isArrayLike(a) || goog.isString(a)) {
      goog.array.forEach(a, b, c);
    } else {
      for (var d = goog.structs.getKeys(a), e = goog.structs.getValues(a), f = e.length, g = 0; g < f; g++) {
        b.call(c, e[g], d && d[g], a);
      }
    }
  }
};
goog.structs.filter = function(a, b, c) {
  if ("function" == typeof a.filter) {
    return a.filter(b, c);
  }
  if (goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.filter(a, b, c);
  }
  var d = goog.structs.getKeys(a), e = goog.structs.getValues(a), f = e.length;
  if (d) {
    var g = {};
    for (var h = 0; h < f; h++) {
      b.call(c, e[h], d[h], a) && (g[d[h]] = e[h]);
    }
  } else {
    for (g = [], h = 0; h < f; h++) {
      b.call(c, e[h], void 0, a) && g.push(e[h]);
    }
  }
  return g;
};
goog.structs.map = function(a, b, c) {
  if ("function" == typeof a.map) {
    return a.map(b, c);
  }
  if (goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.map(a, b, c);
  }
  var d = goog.structs.getKeys(a), e = goog.structs.getValues(a), f = e.length;
  if (d) {
    var g = {};
    for (var h = 0; h < f; h++) {
      g[d[h]] = b.call(c, e[h], d[h], a);
    }
  } else {
    for (g = [], h = 0; h < f; h++) {
      g[h] = b.call(c, e[h], void 0, a);
    }
  }
  return g;
};
goog.structs.some = function(a, b, c) {
  if ("function" == typeof a.some) {
    return a.some(b, c);
  }
  if (goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.some(a, b, c);
  }
  for (var d = goog.structs.getKeys(a), e = goog.structs.getValues(a), f = e.length, g = 0; g < f; g++) {
    if (b.call(c, e[g], d && d[g], a)) {
      return !0;
    }
  }
  return !1;
};
goog.structs.every = function(a, b, c) {
  if ("function" == typeof a.every) {
    return a.every(b, c);
  }
  if (goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.every(a, b, c);
  }
  for (var d = goog.structs.getKeys(a), e = goog.structs.getValues(a), f = e.length, g = 0; g < f; g++) {
    if (!b.call(c, e[g], d && d[g], a)) {
      return !1;
    }
  }
  return !0;
};
goog.structs.Collection = function() {
};
goog.structs.Set = function(a) {
  this.map_ = new goog.structs.Map;
  a && this.addAll(a);
};
goog.structs.Set.getKey_ = function(a) {
  var b = typeof a;
  return "object" == b && a || "function" == b ? "o" + goog.getUid(a) : b.substr(0, 1) + a;
};
goog.structs.Set.prototype.getCount = function() {
  return this.map_.getCount();
};
goog.structs.Set.prototype.add = function(a) {
  this.map_.set(goog.structs.Set.getKey_(a), a);
};
goog.structs.Set.prototype.addAll = function(a) {
  a = goog.structs.getValues(a);
  for (var b = a.length, c = 0; c < b; c++) {
    this.add(a[c]);
  }
};
goog.structs.Set.prototype.removeAll = function(a) {
  a = goog.structs.getValues(a);
  for (var b = a.length, c = 0; c < b; c++) {
    this.remove(a[c]);
  }
};
goog.structs.Set.prototype.remove = function(a) {
  return this.map_.remove(goog.structs.Set.getKey_(a));
};
goog.structs.Set.prototype.clear = function() {
  this.map_.clear();
};
goog.structs.Set.prototype.isEmpty = function() {
  return this.map_.isEmpty();
};
goog.structs.Set.prototype.contains = function(a) {
  return this.map_.containsKey(goog.structs.Set.getKey_(a));
};
goog.structs.Set.prototype.containsAll = function(a) {
  return goog.structs.every(a, this.contains, this);
};
goog.structs.Set.prototype.intersection = function(a) {
  var b = new goog.structs.Set;
  a = goog.structs.getValues(a);
  for (var c = 0; c < a.length; c++) {
    var d = a[c];
    this.contains(d) && b.add(d);
  }
  return b;
};
goog.structs.Set.prototype.difference = function(a) {
  var b = this.clone();
  b.removeAll(a);
  return b;
};
goog.structs.Set.prototype.getValues = function() {
  return this.map_.getValues();
};
goog.structs.Set.prototype.clone = function() {
  return new goog.structs.Set(this);
};
goog.structs.Set.prototype.equals = function(a) {
  return this.getCount() == goog.structs.getCount(a) && this.isSubsetOf(a);
};
goog.structs.Set.prototype.isSubsetOf = function(a) {
  var b = goog.structs.getCount(a);
  if (this.getCount() > b) {
    return !1;
  }
  !(a instanceof goog.structs.Set) && 5 < b && (a = new goog.structs.Set(a));
  return goog.structs.every(this, function(b) {
    return goog.structs.contains(a, b);
  });
};
goog.structs.Set.prototype.__iterator__ = function(a) {
  return this.map_.__iterator__(!1);
};
bot.Keyboard = function(a) {
  bot.Device.call(this);
  this.editable_ = bot.dom.isEditable(this.getElement());
  this.currentPos_ = 0;
  this.pressed_ = new goog.structs.Set;
  a && (goog.array.forEach(a.pressed, function(a) {
    this.setKeyPressed_(a, !0);
  }, this), this.currentPos_ = a.currentPos || 0);
};
goog.inherits(bot.Keyboard, bot.Device);
bot.Keyboard.CHAR_TO_KEY_ = {};
bot.Keyboard.newKey_ = function(a, b, c) {
  goog.isObject(a) && (a = goog.userAgent.GECKO ? a.gecko : a.ieWebkit);
  a = new bot.Keyboard.Key(a, b, c);
  !b || b in bot.Keyboard.CHAR_TO_KEY_ && !c || (bot.Keyboard.CHAR_TO_KEY_[b] = {key:a, shift:!1}, c && (bot.Keyboard.CHAR_TO_KEY_[c] = {key:a, shift:!0}));
  return a;
};
bot.Keyboard.Key = function(a, b, c) {
  this.code = a;
  this.character = b || null;
  this.shiftChar = c || this.character;
};
bot.Keyboard.Keys = {BACKSPACE:bot.Keyboard.newKey_(8), TAB:bot.Keyboard.newKey_(9), ENTER:bot.Keyboard.newKey_(13), SHIFT:bot.Keyboard.newKey_(16), CONTROL:bot.Keyboard.newKey_(17), ALT:bot.Keyboard.newKey_(18), PAUSE:bot.Keyboard.newKey_(19), CAPS_LOCK:bot.Keyboard.newKey_(20), ESC:bot.Keyboard.newKey_(27), SPACE:bot.Keyboard.newKey_(32, " "), PAGE_UP:bot.Keyboard.newKey_(33), PAGE_DOWN:bot.Keyboard.newKey_(34), END:bot.Keyboard.newKey_(35), HOME:bot.Keyboard.newKey_(36), LEFT:bot.Keyboard.newKey_(37),
UP:bot.Keyboard.newKey_(38), RIGHT:bot.Keyboard.newKey_(39), DOWN:bot.Keyboard.newKey_(40), PRINT_SCREEN:bot.Keyboard.newKey_(44), INSERT:bot.Keyboard.newKey_(45), DELETE:bot.Keyboard.newKey_(46), ZERO:bot.Keyboard.newKey_(48, "0", ")"), ONE:bot.Keyboard.newKey_(49, "1", "!"), TWO:bot.Keyboard.newKey_(50, "2", "@"), THREE:bot.Keyboard.newKey_(51, "3", "#"), FOUR:bot.Keyboard.newKey_(52, "4", "$"), FIVE:bot.Keyboard.newKey_(53, "5", "%"), SIX:bot.Keyboard.newKey_(54, "6", "^"), SEVEN:bot.Keyboard.newKey_(55,
"7", "&"), EIGHT:bot.Keyboard.newKey_(56, "8", "*"), NINE:bot.Keyboard.newKey_(57, "9", "("), A:bot.Keyboard.newKey_(65, "a", "A"), B:bot.Keyboard.newKey_(66, "b", "B"), C:bot.Keyboard.newKey_(67, "c", "C"), D:bot.Keyboard.newKey_(68, "d", "D"), E:bot.Keyboard.newKey_(69, "e", "E"), F:bot.Keyboard.newKey_(70, "f", "F"), G:bot.Keyboard.newKey_(71, "g", "G"), H:bot.Keyboard.newKey_(72, "h", "H"), I:bot.Keyboard.newKey_(73, "i", "I"), J:bot.Keyboard.newKey_(74, "j", "J"), K:bot.Keyboard.newKey_(75,
"k", "K"), L:bot.Keyboard.newKey_(76, "l", "L"), M:bot.Keyboard.newKey_(77, "m", "M"), N:bot.Keyboard.newKey_(78, "n", "N"), O:bot.Keyboard.newKey_(79, "o", "O"), P:bot.Keyboard.newKey_(80, "p", "P"), Q:bot.Keyboard.newKey_(81, "q", "Q"), R:bot.Keyboard.newKey_(82, "r", "R"), S:bot.Keyboard.newKey_(83, "s", "S"), T:bot.Keyboard.newKey_(84, "t", "T"), U:bot.Keyboard.newKey_(85, "u", "U"), V:bot.Keyboard.newKey_(86, "v", "V"), W:bot.Keyboard.newKey_(87, "w", "W"), X:bot.Keyboard.newKey_(88, "x", "X"),
Y:bot.Keyboard.newKey_(89, "y", "Y"), Z:bot.Keyboard.newKey_(90, "z", "Z"), META:bot.Keyboard.newKey_(goog.userAgent.WINDOWS ? {gecko:91, ieWebkit:91} : goog.userAgent.MAC ? {gecko:224, ieWebkit:91} : {gecko:0, ieWebkit:91}), META_RIGHT:bot.Keyboard.newKey_(goog.userAgent.WINDOWS ? {gecko:92, ieWebkit:92} : goog.userAgent.MAC ? {gecko:224, ieWebkit:93} : {gecko:0, ieWebkit:92}), CONTEXT_MENU:bot.Keyboard.newKey_(goog.userAgent.WINDOWS ? {gecko:93, ieWebkit:93} : goog.userAgent.MAC ? {gecko:0, ieWebkit:0} :
{gecko:93, ieWebkit:null}), NUM_ZERO:bot.Keyboard.newKey_({gecko:96, ieWebkit:96}, "0"), NUM_ONE:bot.Keyboard.newKey_({gecko:97, ieWebkit:97}, "1"), NUM_TWO:bot.Keyboard.newKey_({gecko:98, ieWebkit:98}, "2"), NUM_THREE:bot.Keyboard.newKey_({gecko:99, ieWebkit:99}, "3"), NUM_FOUR:bot.Keyboard.newKey_({gecko:100, ieWebkit:100}, "4"), NUM_FIVE:bot.Keyboard.newKey_({gecko:101, ieWebkit:101}, "5"), NUM_SIX:bot.Keyboard.newKey_({gecko:102, ieWebkit:102}, "6"), NUM_SEVEN:bot.Keyboard.newKey_({gecko:103,
ieWebkit:103}, "7"), NUM_EIGHT:bot.Keyboard.newKey_({gecko:104, ieWebkit:104}, "8"), NUM_NINE:bot.Keyboard.newKey_({gecko:105, ieWebkit:105}, "9"), NUM_MULTIPLY:bot.Keyboard.newKey_({gecko:106, ieWebkit:106}, "*"), NUM_PLUS:bot.Keyboard.newKey_({gecko:107, ieWebkit:107}, "+"), NUM_MINUS:bot.Keyboard.newKey_({gecko:109, ieWebkit:109}, "-"), NUM_PERIOD:bot.Keyboard.newKey_({gecko:110, ieWebkit:110}, "."), NUM_DIVISION:bot.Keyboard.newKey_({gecko:111, ieWebkit:111}, "/"), NUM_LOCK:bot.Keyboard.newKey_(144),
F1:bot.Keyboard.newKey_(112), F2:bot.Keyboard.newKey_(113), F3:bot.Keyboard.newKey_(114), F4:bot.Keyboard.newKey_(115), F5:bot.Keyboard.newKey_(116), F6:bot.Keyboard.newKey_(117), F7:bot.Keyboard.newKey_(118), F8:bot.Keyboard.newKey_(119), F9:bot.Keyboard.newKey_(120), F10:bot.Keyboard.newKey_(121), F11:bot.Keyboard.newKey_(122), F12:bot.Keyboard.newKey_(123), EQUALS:bot.Keyboard.newKey_({gecko:107, ieWebkit:187}, "=", "+"), SEPARATOR:bot.Keyboard.newKey_(108, ","), HYPHEN:bot.Keyboard.newKey_({gecko:109,
ieWebkit:189}, "-", "_"), COMMA:bot.Keyboard.newKey_(188, ",", "<"), PERIOD:bot.Keyboard.newKey_(190, ".", ">"), SLASH:bot.Keyboard.newKey_(191, "/", "?"), BACKTICK:bot.Keyboard.newKey_(192, "`", "~"), OPEN_BRACKET:bot.Keyboard.newKey_(219, "[", "{"), BACKSLASH:bot.Keyboard.newKey_(220, "\\", "|"), CLOSE_BRACKET:bot.Keyboard.newKey_(221, "]", "}"), SEMICOLON:bot.Keyboard.newKey_({gecko:59, ieWebkit:186}, ";", ":"), APOSTROPHE:bot.Keyboard.newKey_(222, "'", '"')};
bot.Keyboard.Key.fromChar = function(a) {
  if (1 != a.length) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "Argument not a single character: " + a);
  }
  var b = bot.Keyboard.CHAR_TO_KEY_[a];
  if (!b) {
    var b = a.toUpperCase(), c = b.charCodeAt(0), b = bot.Keyboard.newKey_(c, a.toLowerCase(), b), b = {key:b, shift:a != b.character};
  }
  return b;
};
bot.Keyboard.MODIFIERS = [bot.Keyboard.Keys.ALT, bot.Keyboard.Keys.CONTROL, bot.Keyboard.Keys.META, bot.Keyboard.Keys.SHIFT];
bot.Keyboard.MODIFIER_TO_KEY_MAP_ = function() {
  var a = new goog.structs.Map;
  a.set(bot.Device.Modifier.SHIFT, bot.Keyboard.Keys.SHIFT);
  a.set(bot.Device.Modifier.CONTROL, bot.Keyboard.Keys.CONTROL);
  a.set(bot.Device.Modifier.ALT, bot.Keyboard.Keys.ALT);
  a.set(bot.Device.Modifier.META, bot.Keyboard.Keys.META);
  return a;
}();
bot.Keyboard.KEY_TO_MODIFIER_ = function(a) {
  var b = new goog.structs.Map;
  goog.array.forEach(a.getKeys(), function(c) {
    b.set(a.get(c).code, c);
  });
  return b;
}(bot.Keyboard.MODIFIER_TO_KEY_MAP_);
bot.Keyboard.prototype.setKeyPressed_ = function(a, b) {
  if (goog.array.contains(bot.Keyboard.MODIFIERS, a)) {
    var c = bot.Keyboard.KEY_TO_MODIFIER_.get(a.code);
    this.modifiersState.setPressed(c, b);
  }
  b ? this.pressed_.add(a) : this.pressed_.remove(a);
};
bot.Keyboard.NEW_LINE_ = goog.userAgent.IE ? "\r\n" : "\n";
bot.Keyboard.prototype.isPressed = function(a) {
  return this.pressed_.contains(a);
};
bot.Keyboard.prototype.pressKey = function(a) {
  if (goog.array.contains(bot.Keyboard.MODIFIERS, a) && this.isPressed(a)) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "Cannot press a modifier key that is already pressed.");
  }
  var b = !goog.isNull(a.code) && this.fireKeyEvent_(bot.events.EventType.KEYDOWN, a);
  !b && !goog.userAgent.GECKO || this.requiresKeyPress_(a) && !this.fireKeyEvent_(bot.events.EventType.KEYPRESS, a, !b) || !b || (this.maybeSubmitForm_(a), this.editable_ && this.maybeEditText_(a));
  this.setKeyPressed_(a, !0);
};
bot.Keyboard.prototype.requiresKeyPress_ = function(a) {
  if (a.character || a == bot.Keyboard.Keys.ENTER) {
    return !0;
  }
  if (goog.userAgent.WEBKIT || goog.userAgent.EDGE) {
    return !1;
  }
  if (goog.userAgent.IE) {
    return a == bot.Keyboard.Keys.ESC;
  }
  switch(a) {
    case bot.Keyboard.Keys.SHIFT:
    case bot.Keyboard.Keys.CONTROL:
    case bot.Keyboard.Keys.ALT:
      return !1;
    case bot.Keyboard.Keys.META:
    case bot.Keyboard.Keys.META_RIGHT:
    case bot.Keyboard.Keys.CONTEXT_MENU:
      return goog.userAgent.GECKO;
    default:
      return !0;
  }
};
bot.Keyboard.prototype.maybeSubmitForm_ = function(a) {
  if (a == bot.Keyboard.Keys.ENTER && !goog.userAgent.GECKO && bot.dom.core.isElement(this.getElement(), "INPUT") && (a = bot.Device.findAncestorForm(this.getElement()))) {
    var b = a.getElementsByTagName("input");
    (goog.array.some(b, function(a) {
      return bot.Device.isFormSubmitElement(a);
    }) || 1 == b.length || goog.userAgent.WEBKIT && !bot.userAgent.isEngineVersion(534)) && this.submitForm(a);
  }
};
bot.Keyboard.prototype.maybeEditText_ = function(a) {
  if (a.character) {
    this.updateOnCharacter_(a);
  } else {
    switch(a) {
      case bot.Keyboard.Keys.ENTER:
        this.updateOnEnter_();
        break;
      case bot.Keyboard.Keys.BACKSPACE:
      case bot.Keyboard.Keys.DELETE:
        this.updateOnBackspaceOrDelete_(a);
        break;
      case bot.Keyboard.Keys.LEFT:
      case bot.Keyboard.Keys.RIGHT:
        this.updateOnLeftOrRight_(a);
        break;
      case bot.Keyboard.Keys.HOME:
      case bot.Keyboard.Keys.END:
        this.updateOnHomeOrEnd_(a);
    }
  }
};
bot.Keyboard.prototype.releaseKey = function(a) {
  if (!this.isPressed(a)) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "Cannot release a key that is not pressed. (" + a.code + ")");
  }
  goog.isNull(a.code) || this.fireKeyEvent_(bot.events.EventType.KEYUP, a);
  this.setKeyPressed_(a, !1);
};
bot.Keyboard.prototype.getChar_ = function(a) {
  if (!a.character) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "not a character key");
  }
  return this.isPressed(bot.Keyboard.Keys.SHIFT) ? a.shiftChar : a.character;
};
bot.Keyboard.KEYPRESS_EDITS_TEXT_ = goog.userAgent.GECKO && !bot.userAgent.isEngineVersion(12);
bot.Keyboard.prototype.updateOnCharacter_ = function(a) {
  if (!bot.Keyboard.KEYPRESS_EDITS_TEXT_) {
    a = this.getChar_(a);
    var b = goog.dom.selection.getStart(this.getElement()) + 1;
    bot.Keyboard.supportsSelection(this.getElement()) ? (goog.dom.selection.setText(this.getElement(), a), goog.dom.selection.setStart(this.getElement(), b)) : this.getElement().value += a;
    goog.userAgent.WEBKIT && this.fireHtmlEvent(bot.events.EventType.TEXTINPUT);
    bot.userAgent.IE_DOC_PRE9 || this.fireHtmlEvent(bot.events.EventType.INPUT);
    this.updateCurrentPos_(b);
  }
};
bot.Keyboard.prototype.updateOnEnter_ = function() {
  if (!bot.Keyboard.KEYPRESS_EDITS_TEXT_ && (goog.userAgent.WEBKIT && this.fireHtmlEvent(bot.events.EventType.TEXTINPUT), bot.dom.core.isElement(this.getElement(), "TEXTAREA"))) {
    var a = goog.dom.selection.getStart(this.getElement()) + bot.Keyboard.NEW_LINE_.length;
    bot.Keyboard.supportsSelection(this.getElement()) ? (goog.dom.selection.setText(this.getElement(), bot.Keyboard.NEW_LINE_), goog.dom.selection.setStart(this.getElement(), a)) : this.getElement().value += bot.Keyboard.NEW_LINE_;
    goog.userAgent.IE || this.fireHtmlEvent(bot.events.EventType.INPUT);
    this.updateCurrentPos_(a);
  }
};
bot.Keyboard.prototype.updateOnBackspaceOrDelete_ = function(a) {
  if (!bot.Keyboard.KEYPRESS_EDITS_TEXT_) {
    bot.Keyboard.checkCanUpdateSelection_(this.getElement());
    var b = goog.dom.selection.getEndPoints(this.getElement());
    b[0] == b[1] && (a == bot.Keyboard.Keys.BACKSPACE ? (goog.dom.selection.setStart(this.getElement(), b[1] - 1), goog.dom.selection.setEnd(this.getElement(), b[1])) : goog.dom.selection.setEnd(this.getElement(), b[1] + 1));
    b = goog.dom.selection.getEndPoints(this.getElement());
    b = !(b[0] == this.getElement().value.length || 0 == b[1]);
    goog.dom.selection.setText(this.getElement(), "");
    (!goog.userAgent.IE && b || goog.userAgent.GECKO && a == bot.Keyboard.Keys.BACKSPACE) && this.fireHtmlEvent(bot.events.EventType.INPUT);
    b = goog.dom.selection.getEndPoints(this.getElement());
    this.updateCurrentPos_(b[1]);
  }
};
bot.Keyboard.prototype.updateOnLeftOrRight_ = function(a) {
  bot.Keyboard.checkCanUpdateSelection_(this.getElement());
  var b = this.getElement(), c = goog.dom.selection.getStart(b), d = goog.dom.selection.getEnd(b), e = 0, f = 0;
  a == bot.Keyboard.Keys.LEFT ? this.isPressed(bot.Keyboard.Keys.SHIFT) ? this.currentPos_ == c ? (e = Math.max(c - 1, 0), f = d, a = e) : (e = c, a = f = d - 1) : a = c == d ? Math.max(c - 1, 0) : c : this.isPressed(bot.Keyboard.Keys.SHIFT) ? this.currentPos_ == d ? (e = c, a = f = Math.min(d + 1, b.value.length)) : (e = c + 1, f = d, a = e) : a = c == d ? Math.min(d + 1, b.value.length) : d;
  this.isPressed(bot.Keyboard.Keys.SHIFT) ? (goog.dom.selection.setStart(b, e), goog.dom.selection.setEnd(b, f)) : goog.dom.selection.setCursorPosition(b, a);
  this.updateCurrentPos_(a);
};
bot.Keyboard.prototype.updateOnHomeOrEnd_ = function(a) {
  bot.Keyboard.checkCanUpdateSelection_(this.getElement());
  var b = this.getElement(), c = goog.dom.selection.getStart(b), d = goog.dom.selection.getEnd(b);
  a == bot.Keyboard.Keys.HOME ? (this.isPressed(bot.Keyboard.Keys.SHIFT) ? (goog.dom.selection.setStart(b, 0), goog.dom.selection.setEnd(b, this.currentPos_ == c ? d : c)) : goog.dom.selection.setCursorPosition(b, 0), this.updateCurrentPos_(0)) : (this.isPressed(bot.Keyboard.Keys.SHIFT) ? (this.currentPos_ == c && goog.dom.selection.setStart(b, d), goog.dom.selection.setEnd(b, b.value.length)) : goog.dom.selection.setCursorPosition(b, b.value.length), this.updateCurrentPos_(b.value.length));
};
bot.Keyboard.checkCanUpdateSelection_ = function(a) {
  try {
    if ("number" == typeof a.selectionStart) {
      return;
    }
  } catch (b) {
    if (-1 != b.message.indexOf("does not support selection.")) {
      throw Error(b.message + " (For more information, see https://code.google.com/p/chromium/issues/detail?id=330456)");
    }
    throw b;
  }
  throw Error("Element does not support selection");
};
bot.Keyboard.supportsSelection = function(a) {
  try {
    bot.Keyboard.checkCanUpdateSelection_(a);
  } catch (b) {
    return !1;
  }
  return !0;
};
bot.Keyboard.prototype.updateCurrentPos_ = function(a) {
  this.currentPos_ = a;
};
bot.Keyboard.prototype.fireKeyEvent_ = function(a, b, c) {
  if (goog.isNull(b.code)) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "Key must have a keycode to be fired.");
  }
  b = {altKey:this.isPressed(bot.Keyboard.Keys.ALT), ctrlKey:this.isPressed(bot.Keyboard.Keys.CONTROL), metaKey:this.isPressed(bot.Keyboard.Keys.META), shiftKey:this.isPressed(bot.Keyboard.Keys.SHIFT), keyCode:b.code, charCode:b.character && a == bot.events.EventType.KEYPRESS ? this.getChar_(b).charCodeAt(0) : 0, preventDefault:!!c};
  return this.fireKeyboardEvent(a, b);
};
bot.Keyboard.prototype.moveCursor = function(a) {
  this.setElement(a);
  this.editable_ = bot.dom.isEditable(a);
  var b = this.focusOnElement();
  this.editable_ && b && (goog.dom.selection.setCursorPosition(a, a.value.length), this.updateCurrentPos_(a.value.length));
};
bot.Keyboard.prototype.getState = function() {
  return {pressed:this.pressed_.getValues(), currentPos:this.currentPos_};
};
bot.Keyboard.prototype.getModifiersState = function() {
  return this.modifiersState;
};
bot.Mouse = function(a, b, c) {
  bot.Device.call(this, b, c);
  this.elementPressed_ = this.buttonPressed_ = null;
  this.clientXY_ = new goog.math.Coordinate(0, 0);
  this.hasEverInteracted_ = this.nextClickIsDoubleClick_ = !1;
  if (a) {
    goog.isNumber(a.buttonPressed) && (this.buttonPressed_ = a.buttonPressed);
    try {
      bot.dom.core.isElement(a.elementPressed) && (this.elementPressed_ = a.elementPressed);
    } catch (d) {
      this.buttonPressed_ = null;
    }
    this.clientXY_ = new goog.math.Coordinate(a.clientXY.x, a.clientXY.y);
    this.nextClickIsDoubleClick_ = !!a.nextClickIsDoubleClick;
    this.hasEverInteracted_ = !!a.hasEverInteracted;
    try {
      a.element && bot.dom.core.isElement(a.element) && this.setElement(a.element);
    } catch (d) {
      this.buttonPressed_ = null;
    }
  }
};
goog.inherits(bot.Mouse, bot.Device);
bot.Mouse.Button = {LEFT:0, MIDDLE:1, RIGHT:2};
bot.Mouse.NO_BUTTON_VALUE_INDEX_ = 3;
bot.Mouse.MOUSE_BUTTON_VALUE_MAP_ = function() {
  var a = {};
  bot.userAgent.IE_DOC_PRE9 ? (a[bot.events.EventType.CLICK] = [0, 0, 0, null], a[bot.events.EventType.CONTEXTMENU] = [null, null, 0, null], a[bot.events.EventType.MOUSEUP] = [1, 4, 2, null], a[bot.events.EventType.MOUSEOUT] = [0, 0, 0, 0], a[bot.events.EventType.MOUSEMOVE] = [1, 4, 2, 0]) : goog.userAgent.WEBKIT || bot.userAgent.IE_DOC_9 ? (a[bot.events.EventType.CLICK] = [0, 1, 2, null], a[bot.events.EventType.CONTEXTMENU] = [null, null, 2, null], a[bot.events.EventType.MOUSEUP] = [0, 1, 2, null],
  a[bot.events.EventType.MOUSEOUT] = [0, 1, 2, 0], a[bot.events.EventType.MOUSEMOVE] = [0, 1, 2, 0]) : (a[bot.events.EventType.CLICK] = [0, 1, 2, null], a[bot.events.EventType.CONTEXTMENU] = [null, null, 2, null], a[bot.events.EventType.MOUSEUP] = [0, 1, 2, null], a[bot.events.EventType.MOUSEOUT] = [0, 0, 0, 0], a[bot.events.EventType.MOUSEMOVE] = [0, 0, 0, 0]);
  bot.userAgent.IE_DOC_10 && (a[bot.events.EventType.MSPOINTERDOWN] = a[bot.events.EventType.MOUSEUP], a[bot.events.EventType.MSPOINTERUP] = a[bot.events.EventType.MOUSEUP], a[bot.events.EventType.MSPOINTERMOVE] = [-1, -1, -1, -1], a[bot.events.EventType.MSPOINTEROUT] = a[bot.events.EventType.MSPOINTERMOVE], a[bot.events.EventType.MSPOINTEROVER] = a[bot.events.EventType.MSPOINTERMOVE]);
  a[bot.events.EventType.DBLCLICK] = a[bot.events.EventType.CLICK];
  a[bot.events.EventType.MOUSEDOWN] = a[bot.events.EventType.MOUSEUP];
  a[bot.events.EventType.MOUSEOVER] = a[bot.events.EventType.MOUSEOUT];
  return a;
}();
bot.Mouse.MOUSE_EVENT_MAP_ = function() {
  var a = {};
  a[bot.events.EventType.MOUSEDOWN] = bot.events.EventType.MSPOINTERDOWN;
  a[bot.events.EventType.MOUSEMOVE] = bot.events.EventType.MSPOINTERMOVE;
  a[bot.events.EventType.MOUSEOUT] = bot.events.EventType.MSPOINTEROUT;
  a[bot.events.EventType.MOUSEOVER] = bot.events.EventType.MSPOINTEROVER;
  a[bot.events.EventType.MOUSEUP] = bot.events.EventType.MSPOINTERUP;
  return a;
}();
bot.Mouse.prototype.fireMousedown_ = function(a) {
  var b = goog.userAgent.GECKO && !bot.userAgent.isProductVersion(4);
  if ((goog.userAgent.WEBKIT || b) && (bot.dom.core.isElement(this.getElement(), "OPTION") || bot.dom.core.isElement(this.getElement(), "SELECT"))) {
    return !0;
  }
  var c;
  (b = goog.userAgent.GECKO || goog.userAgent.IE) && (c = bot.dom.getActiveElement(this.getElement()));
  return (a = this.fireMouseEvent_(bot.events.EventType.MOUSEDOWN, null, null, !1, a)) && b && c != bot.dom.getActiveElement(this.getElement()) ? !1 : a;
};
bot.Mouse.prototype.pressButton = function(a, b) {
  if (!goog.isNull(this.buttonPressed_)) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "Cannot press more than one button or an already pressed button.");
  }
  this.buttonPressed_ = a;
  this.elementPressed_ = this.getElement();
  this.fireMousedown_(b) && (bot.userAgent.IE_DOC_10 && this.buttonPressed_ == bot.Mouse.Button.LEFT && bot.dom.core.isElement(this.elementPressed_, "OPTION") && this.fireMSPointerEvent(bot.events.EventType.MSGOTPOINTERCAPTURE, this.clientXY_, 0, bot.Device.MOUSE_MS_POINTER_ID, MSPointerEvent.MSPOINTER_TYPE_MOUSE, !0), this.focusOnElement());
};
bot.Mouse.prototype.releaseButton = function(a, b) {
  if (goog.isNull(this.buttonPressed_)) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "Cannot release a button when no button is pressed.");
  }
  this.maybeToggleOption();
  var c = bot.dom.isInteractable(this.getElement());
  this.fireMouseEvent_(bot.events.EventType.MOUSEUP, null, null, a, b);
  try {
    this.buttonPressed_ == bot.Mouse.Button.LEFT && this.getElement() == this.elementPressed_ ? (bot.userAgent.WINDOWS_PHONE && bot.dom.core.isElement(this.elementPressed_, "OPTION") || this.clickElement(this.clientXY_, this.getButtonValue_(bot.events.EventType.CLICK), c), this.maybeDoubleClickElement_(), bot.userAgent.IE_DOC_10 && this.buttonPressed_ == bot.Mouse.Button.LEFT && bot.dom.core.isElement(this.elementPressed_, "OPTION") && this.fireMSPointerEvent(bot.events.EventType.MSLOSTPOINTERCAPTURE,
    new goog.math.Coordinate(0, 0), 0, bot.Device.MOUSE_MS_POINTER_ID, MSPointerEvent.MSPOINTER_TYPE_MOUSE, !1)) : this.buttonPressed_ == bot.Mouse.Button.RIGHT && this.fireMouseEvent_(bot.events.EventType.CONTEXTMENU);
  } catch (d) {
  }
  bot.Device.clearPointerMap();
  this.elementPressed_ = this.buttonPressed_ = null;
};
bot.Mouse.prototype.maybeDoubleClickElement_ = function() {
  this.nextClickIsDoubleClick_ && this.fireMouseEvent_(bot.events.EventType.DBLCLICK);
  this.nextClickIsDoubleClick_ = !this.nextClickIsDoubleClick_;
};
bot.Mouse.prototype.move = function(a, b) {
  var c = bot.dom.isInteractable(a), d = bot.dom.getClientRect(a);
  this.clientXY_.x = b.x + d.left;
  this.clientXY_.y = b.y + d.top;
  b = this.getElement();
  if (a != b) {
    try {
      goog.dom.getWindow(goog.dom.getOwnerDocument(b)).closed && (b = null);
    } catch (e) {
      b = null;
    }
    b && (d = b === bot.getDocument().documentElement || b === bot.getDocument().body, b = !this.hasEverInteracted_ && d ? null : b, this.fireMouseEvent_(bot.events.EventType.MOUSEOUT, a));
    this.setElement(a);
    goog.userAgent.IE || this.fireMouseEvent_(bot.events.EventType.MOUSEOVER, b, null, c);
  }
  this.fireMouseEvent_(bot.events.EventType.MOUSEMOVE, null, null, c);
  goog.userAgent.IE && a != b && this.fireMouseEvent_(bot.events.EventType.MOUSEOVER, b, null, c);
  this.nextClickIsDoubleClick_ = !1;
};
bot.Mouse.prototype.scroll = function(a) {
  if (0 == a) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "Must scroll a non-zero number of ticks.");
  }
  for (var b = 0 < a ? -120 : 120, c = 0 < a ? 57 : -57, d = 0; d < Math.abs(a); d++) {
    this.fireMouseEvent_(bot.events.EventType.MOUSEWHEEL, null, b), goog.userAgent.GECKO && this.fireMouseEvent_(bot.events.EventType.MOUSEPIXELSCROLL, null, c);
  }
};
bot.Mouse.prototype.fireMouseEvent_ = function(a, b, c, d, e) {
  this.hasEverInteracted_ = !0;
  if (bot.userAgent.IE_DOC_10) {
    var f = bot.Mouse.MOUSE_EVENT_MAP_[a];
    if (f && !this.fireMSPointerEvent(f, this.clientXY_, this.getButtonValue_(f), bot.Device.MOUSE_MS_POINTER_ID, MSPointerEvent.MSPOINTER_TYPE_MOUSE, !0, b, d)) {
      return !1;
    }
  }
  return this.fireMouseEvent(a, this.clientXY_, this.getButtonValue_(a), b, c, d, null, e);
};
bot.Mouse.prototype.getButtonValue_ = function(a) {
  if (!(a in bot.Mouse.MOUSE_BUTTON_VALUE_MAP_)) {
    return 0;
  }
  var b = goog.isNull(this.buttonPressed_) ? bot.Mouse.NO_BUTTON_VALUE_INDEX_ : this.buttonPressed_;
  a = bot.Mouse.MOUSE_BUTTON_VALUE_MAP_[a][b];
  if (goog.isNull(a)) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "Event does not permit the specified mouse button.");
  }
  return a;
};
bot.Mouse.prototype.getState = function() {
  return {buttonPressed:this.buttonPressed_, elementPressed:this.elementPressed_, clientXY:{x:this.clientXY_.x, y:this.clientXY_.y}, nextClickIsDoubleClick:this.nextClickIsDoubleClick_, hasEverInteracted:this.hasEverInteracted_, element:this.getElement()};
};
bot.Touchscreen = function() {
  bot.Device.call(this);
  this.clientXY_ = new goog.math.Coordinate(0, 0);
  this.clientXY2_ = new goog.math.Coordinate(0, 0);
};
goog.inherits(bot.Touchscreen, bot.Device);
bot.Touchscreen.prototype.fireMouseEventsOnRelease_ = !0;
bot.Touchscreen.prototype.cancelled_ = !1;
bot.Touchscreen.prototype.touchIdentifier_ = 0;
bot.Touchscreen.prototype.touchIdentifier2_ = 0;
bot.Touchscreen.prototype.touchCounter_ = 2;
bot.Touchscreen.prototype.press = function(a) {
  if (this.isPressed()) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "Cannot press touchscreen when already pressed.");
  }
  this.touchIdentifier_ = this.touchCounter_++;
  a && (this.touchIdentifier2_ = this.touchCounter_++);
  bot.userAgent.IE_DOC_10 ? (this.fireMouseEventsOnRelease_ = !0, this.firePointerEvents_(bot.Touchscreen.fireSinglePressPointer_)) : this.fireMouseEventsOnRelease_ = this.fireTouchEvent_(bot.events.EventType.TOUCHSTART);
};
bot.Touchscreen.prototype.release = function() {
  if (!this.isPressed()) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "Cannot release touchscreen when not already pressed.");
  }
  bot.userAgent.IE_DOC_10 ? this.cancelled_ || this.firePointerEvents_(bot.Touchscreen.fireSingleReleasePointer_) : this.fireTouchReleaseEvents_();
  bot.Device.clearPointerMap();
  this.touchIdentifier2_ = this.touchIdentifier_ = 0;
  this.cancelled_ = !1;
};
bot.Touchscreen.prototype.move = function(a, b, c) {
  var d = this.getElement();
  this.isPressed() && !bot.userAgent.IE_DOC_10 || this.setElement(a);
  var e = bot.dom.getClientRect(a);
  this.clientXY_.x = b.x + e.left;
  this.clientXY_.y = b.y + e.top;
  goog.isDef(c) && (this.clientXY2_.x = c.x + e.left, this.clientXY2_.y = c.y + e.top);
  this.isPressed() && (bot.userAgent.IE_DOC_10 ? this.cancelled_ || (a != d && (this.fireMouseEventsOnRelease_ = !1), bot.Touchscreen.hasMsTouchActionsEnabled_(a) ? this.firePointerEvents_(bot.Touchscreen.fireSingleMovePointer_) : (this.fireMSPointerEvent(bot.events.EventType.MSPOINTEROUT, b, -1, this.touchIdentifier_, MSPointerEvent.MSPOINTER_TYPE_TOUCH, !0), this.fireMouseEvent(bot.events.EventType.MOUSEOUT, b, 0), this.fireMSPointerEvent(bot.events.EventType.MSPOINTERCANCEL, b, 0, this.touchIdentifier_,
  MSPointerEvent.MSPOINTER_TYPE_TOUCH, !0), this.cancelled_ = !0, bot.Device.clearPointerMap())) : (this.fireMouseEventsOnRelease_ = !1, this.fireTouchEvent_(bot.events.EventType.TOUCHMOVE)));
};
bot.Touchscreen.prototype.isPressed = function() {
  return !!this.touchIdentifier_;
};
bot.Touchscreen.prototype.fireTouchEvent_ = function(a) {
  if (!this.isPressed()) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "Should never fire event when touchscreen is not pressed.");
  }
  if (this.touchIdentifier2_) {
    var b = this.touchIdentifier2_;
    var c = this.clientXY2_;
  }
  return this.fireTouchEvent(a, this.touchIdentifier_, this.clientXY_, b, c);
};
bot.Touchscreen.prototype.fireTouchReleaseEvents_ = function() {
  var a = this.fireTouchEvent_(bot.events.EventType.TOUCHEND);
  this.fireMouseEventsOnRelease_ && (a || !bot.userAgent.IOS && !goog.userAgent.product.CHROME) && (this.fireMouseEvent(bot.events.EventType.MOUSEMOVE, this.clientXY_, 0), this.fireMouseEvent(bot.events.EventType.MOUSEDOWN, this.clientXY_, 0) && this.focusOnElement(), this.maybeToggleOption(), a = bot.dom.isInteractable(this.getElement()), this.fireMouseEvent(bot.events.EventType.MOUSEUP, this.clientXY_, 0), bot.userAgent.WINDOWS_PHONE && bot.dom.core.isElement(this.getElement(), "OPTION") || this.clickElement(this.clientXY_,
  0, a));
};
bot.Touchscreen.prototype.firePointerEvents_ = function(a) {
  a(this, this.getElement(), this.clientXY_, this.touchIdentifier_, !0);
  this.touchIdentifier2_ && bot.Touchscreen.hasMsTouchActionsEnabled_(this.getElement()) && a(this, this.getElement(), this.clientXY2_, this.touchIdentifier2_, !1);
};
bot.Touchscreen.fireSinglePressPointer_ = function(a, b, c, d, e) {
  a.fireMouseEvent(bot.events.EventType.MOUSEMOVE, c, 0);
  a.fireMSPointerEvent(bot.events.EventType.MSPOINTEROVER, c, 0, d, MSPointerEvent.MSPOINTER_TYPE_TOUCH, e);
  a.fireMouseEvent(bot.events.EventType.MOUSEOVER, c, 0);
  a.fireMSPointerEvent(bot.events.EventType.MSPOINTERDOWN, c, 0, d, MSPointerEvent.MSPOINTER_TYPE_TOUCH, e);
  a.fireMouseEvent(bot.events.EventType.MOUSEDOWN, c, 0) && (bot.dom.core.isSelectable(b) && a.fireMSPointerEvent(bot.events.EventType.MSGOTPOINTERCAPTURE, c, 0, d, MSPointerEvent.MSPOINTER_TYPE_TOUCH, e), a.focusOnElement());
};
bot.Touchscreen.fireSingleReleasePointer_ = function(a, b, c, d, e) {
  a.fireMSPointerEvent(bot.events.EventType.MSPOINTERUP, c, 0, d, MSPointerEvent.MSPOINTER_TYPE_TOUCH, e);
  var f = bot.dom.isInteractable(a.getElement());
  a.fireMouseEvent(bot.events.EventType.MOUSEUP, c, 0, null, 0, !1, d);
  a.fireMouseEventsOnRelease_ && (a.maybeToggleOption(), bot.userAgent.WINDOWS_PHONE && bot.dom.core.isElement(b, "OPTION") || a.clickElement(a.clientXY_, 0, f, d));
  bot.dom.core.isSelectable(b) && a.fireMSPointerEvent(bot.events.EventType.MSLOSTPOINTERCAPTURE, new goog.math.Coordinate(0, 0), 0, d, MSPointerEvent.MSPOINTER_TYPE_TOUCH, !1);
  a.fireMSPointerEvent(bot.events.EventType.MSPOINTEROUT, c, -1, d, MSPointerEvent.MSPOINTER_TYPE_TOUCH, e);
  a.fireMouseEvent(bot.events.EventType.MOUSEOUT, c, 0, null, 0, !1, d);
};
bot.Touchscreen.fireSingleMovePointer_ = function(a, b, c, d, e) {
  a.fireMSPointerEvent(bot.events.EventType.MSPOINTERMOVE, c, -1, d, MSPointerEvent.MSPOINTER_TYPE_TOUCH, e);
  a.fireMouseEvent(bot.events.EventType.MOUSEMOVE, c, 0, null, 0, !1, d);
};
bot.Touchscreen.hasMsTouchActionsEnabled_ = function(a) {
  if (!bot.userAgent.IE_DOC_10) {
    throw Error("hasMsTouchActionsEnable should only be called from IE 10");
  }
  if ("none" == bot.dom.getEffectiveStyle(a, "ms-touch-action")) {
    return !0;
  }
  a = bot.dom.getParentElement(a);
  return !!a && bot.Touchscreen.hasMsTouchActionsEnabled_(a);
};
goog.math.Vec2 = function(a, b) {
  this.x = a;
  this.y = b;
};
goog.inherits(goog.math.Vec2, goog.math.Coordinate);
goog.math.Vec2.randomUnit = function() {
  var a = Math.random() * Math.PI * 2;
  return new goog.math.Vec2(Math.cos(a), Math.sin(a));
};
goog.math.Vec2.random = function() {
  var a = Math.sqrt(Math.random()), b = Math.random() * Math.PI * 2;
  return new goog.math.Vec2(Math.cos(b) * a, Math.sin(b) * a);
};
goog.math.Vec2.fromCoordinate = function(a) {
  return new goog.math.Vec2(a.x, a.y);
};
goog.math.Vec2.prototype.clone = function() {
  return new goog.math.Vec2(this.x, this.y);
};
goog.math.Vec2.prototype.magnitude = function() {
  return Math.sqrt(this.x * this.x + this.y * this.y);
};
goog.math.Vec2.prototype.squaredMagnitude = function() {
  return this.x * this.x + this.y * this.y;
};
goog.math.Vec2.prototype.scale = goog.math.Coordinate.prototype.scale;
goog.math.Vec2.prototype.invert = function() {
  this.x = -this.x;
  this.y = -this.y;
  return this;
};
goog.math.Vec2.prototype.normalize = function() {
  return this.scale(1 / this.magnitude());
};
goog.math.Vec2.prototype.add = function(a) {
  this.x += a.x;
  this.y += a.y;
  return this;
};
goog.math.Vec2.prototype.subtract = function(a) {
  this.x -= a.x;
  this.y -= a.y;
  return this;
};
goog.math.Vec2.prototype.rotate = function(a) {
  var b = Math.cos(a);
  a = Math.sin(a);
  var c = this.y * b + this.x * a;
  this.x = this.x * b - this.y * a;
  this.y = c;
  return this;
};
goog.math.Vec2.rotateAroundPoint = function(a, b, c) {
  return a.clone().subtract(b).rotate(c).add(b);
};
goog.math.Vec2.prototype.equals = function(a) {
  return this == a ? !0 : a instanceof goog.math.Vec2 && !!a && this.x == a.x && this.y == a.y;
};
goog.math.Vec2.distance = goog.math.Coordinate.distance;
goog.math.Vec2.squaredDistance = goog.math.Coordinate.squaredDistance;
goog.math.Vec2.equals = goog.math.Coordinate.equals;
goog.math.Vec2.sum = function(a, b) {
  return new goog.math.Vec2(a.x + b.x, a.y + b.y);
};
goog.math.Vec2.difference = function(a, b) {
  return new goog.math.Vec2(a.x - b.x, a.y - b.y);
};
goog.math.Vec2.dot = function(a, b) {
  return a.x * b.x + a.y * b.y;
};
goog.math.Vec2.determinant = function(a, b) {
  return a.x * b.y - a.y * b.x;
};
goog.math.Vec2.lerp = function(a, b, c) {
  return new goog.math.Vec2(goog.math.lerp(a.x, b.x, c), goog.math.lerp(a.y, b.y, c));
};
bot.action = {};
bot.action.checkShown_ = function(a) {
  if (!bot.dom.isShown(a, !0)) {
    throw new bot.Error(bot.ErrorCode.ELEMENT_NOT_VISIBLE, "Element is not currently visible and may not be manipulated");
  }
};
bot.action.checkInteractable_ = function(a) {
  if (!bot.dom.isInteractable(a)) {
    throw new bot.Error(bot.ErrorCode.INVALID_ELEMENT_STATE, "Element is not currently interactable and may not be manipulated");
  }
};
bot.action.clear = function(a) {
  bot.action.checkInteractable_(a);
  if (!bot.dom.isEditable(a)) {
    throw new bot.Error(bot.ErrorCode.INVALID_ELEMENT_STATE, "Element must be user-editable in order to clear it.");
  }
  if (a.value) {
    bot.action.LegacyDevice_.focusOnElement(a);
    if (goog.userAgent.IE && bot.dom.isInputType(a, "range")) {
      var b = a.min ? a.min : 0, c = a.max ? a.max : 100;
      a.value = c < b ? b : b + (c - b) / 2;
    } else {
      a.value = "";
    }
    bot.events.fire(a, bot.events.EventType.CHANGE);
    bot.events.fire(a, bot.events.EventType.BLUR);
    if (b = bot.getDocument().body) {
      bot.action.LegacyDevice_.focusOnElement(b);
    } else {
      throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "Cannot unfocus element after clearing.");
    }
  } else {
    bot.dom.core.isElement(a, "INPUT") && a.getAttribute("type") && "number" == a.getAttribute("type").toLowerCase() && (bot.action.LegacyDevice_.focusOnElement(a), a.value = "");
  }
  bot.dom.isContentEditable(a) && (bot.action.LegacyDevice_.focusOnElement(a), a.innerHTML = " ");
};
bot.action.focusOnElement = function(a) {
  bot.action.checkInteractable_(a);
  bot.action.LegacyDevice_.focusOnElement(a);
};
bot.action.type = function(a, b, c, d) {
  function e(a) {
    goog.isString(a) ? goog.array.forEach(a.split(""), function(a) {
      a = bot.Keyboard.Key.fromChar(a);
      var b = f.isPressed(bot.Keyboard.Keys.SHIFT);
      a.shift && !b && f.pressKey(bot.Keyboard.Keys.SHIFT);
      f.pressKey(a.key);
      f.releaseKey(a.key);
      a.shift && !b && f.releaseKey(bot.Keyboard.Keys.SHIFT);
    }) : goog.array.contains(bot.Keyboard.MODIFIERS, a) ? f.isPressed(a) ? f.releaseKey(a) : f.pressKey(a) : (f.pressKey(a), f.releaseKey(a));
  }
  a != bot.dom.getActiveElement(a) && (bot.action.checkInteractable_(a), bot.action.scrollIntoView(a));
  var f = c || new bot.Keyboard;
  f.moveCursor(a);
  if ((!goog.userAgent.product.SAFARI || goog.userAgent.MOBILE) && goog.userAgent.WEBKIT && "date" == a.type) {
    c = goog.isArray(b) ? b = b.join("") : b;
    var g = /\d{4}-\d{2}-\d{2}/;
    if (c.match(g)) {
      goog.userAgent.MOBILE && goog.userAgent.product.SAFARI && (bot.events.fire(a, bot.events.EventType.TOUCHSTART), bot.events.fire(a, bot.events.EventType.TOUCHEND));
      bot.events.fire(a, bot.events.EventType.FOCUS);
      a.value = c.match(g)[0];
      bot.events.fire(a, bot.events.EventType.CHANGE);
      bot.events.fire(a, bot.events.EventType.BLUR);
      return;
    }
  }
  goog.isArray(b) ? goog.array.forEach(b, e) : e(b);
  d || goog.array.forEach(bot.Keyboard.MODIFIERS, function(a) {
    f.isPressed(a) && f.releaseKey(a);
  });
};
bot.action.submit = function(a) {
  var b = bot.action.LegacyDevice_.findAncestorForm(a);
  if (!b) {
    throw new bot.Error(bot.ErrorCode.NO_SUCH_ELEMENT, "Element was not in a form, so could not submit.");
  }
  bot.action.LegacyDevice_.submitForm(a, b);
};
bot.action.moveMouse = function(a, b, c) {
  b = bot.action.prepareToInteractWith_(a, b);
  (c || new bot.Mouse).move(a, b);
};
bot.action.click = function(a, b, c, d) {
  b = bot.action.prepareToInteractWith_(a, b);
  c = c || new bot.Mouse;
  c.move(a, b);
  c.pressButton(bot.Mouse.Button.LEFT);
  c.releaseButton(d);
};
bot.action.rightClick = function(a, b, c) {
  b = bot.action.prepareToInteractWith_(a, b);
  c = c || new bot.Mouse;
  c.move(a, b);
  c.pressButton(bot.Mouse.Button.RIGHT);
  c.releaseButton();
};
bot.action.doubleClick = function(a, b, c) {
  b = bot.action.prepareToInteractWith_(a, b);
  c = c || new bot.Mouse;
  c.move(a, b);
  c.pressButton(bot.Mouse.Button.LEFT);
  c.releaseButton();
  c.pressButton(bot.Mouse.Button.LEFT);
  c.releaseButton();
};
bot.action.doubleClick2 = function(a, b, c) {
  b = bot.action.prepareToInteractWith_(a, b);
  c = c || new bot.Mouse;
  c.move(a, b);
  c.pressButton(bot.Mouse.Button.LEFT, 2);
  c.releaseButton(!0, 2);
};
bot.action.scrollMouse = function(a, b, c, d) {
  c = bot.action.prepareToInteractWith_(a, c);
  d = d || new bot.Mouse;
  d.move(a, c);
  d.scroll(b);
};
bot.action.drag = function(a, b, c, d, e, f) {
  e = bot.action.prepareToInteractWith_(a, e);
  var g = bot.dom.getClientRect(a);
  f = f || new bot.Mouse;
  f.move(a, e);
  f.pressButton(bot.Mouse.Button.LEFT);
  d = goog.isDef(d) ? d : 2;
  if (1 > d) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "There must be at least one step as part of a drag.");
  }
  for (var h = 1; h <= d; h++) {
    var k = Math.floor(h * b / d), l = Math.floor(h * c / d), m = bot.dom.getClientRect(a), k = new goog.math.Coordinate(e.x + g.left + k - m.left, e.y + g.top + l - m.top);
    f.move(a, k);
  }
  f.releaseButton();
};
bot.action.tap = function(a, b, c) {
  b = bot.action.prepareToInteractWith_(a, b);
  c = c || new bot.Touchscreen;
  c.move(a, b);
  c.press();
  c.release();
};
bot.action.swipe = function(a, b, c, d, e, f) {
  e = bot.action.prepareToInteractWith_(a, e);
  f = f || new bot.Touchscreen;
  var g = bot.dom.getClientRect(a);
  f.move(a, e);
  f.press();
  d = goog.isDef(d) ? d : 2;
  if (1 > d) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "There must be at least one step as part of a swipe.");
  }
  for (var h = 1; h <= d; h++) {
    var k = Math.floor(h * b / d), l = Math.floor(h * c / d), m = bot.dom.getClientRect(a), k = new goog.math.Coordinate(e.x + g.left + k - m.left, e.y + g.top + l - m.top);
    f.move(a, k);
  }
  f.release();
};
bot.action.pinch = function(a, b, c, d) {
  if (0 == b) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "Cannot pinch by a distance of zero.");
  }
  var e = b / 2;
  bot.action.multiTouchAction_(a, function(a) {
    if (0 > b) {
      var c = a.magnitude();
      a.scale(c ? (c + b) / c : 0);
    }
  }, function(a) {
    var b = a.magnitude();
    a.scale(b ? (b - e) / b : 0);
  }, c, d);
};
bot.action.rotate = function(a, b, c, d) {
  if (0 == b) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "Cannot rotate by an angle of zero.");
  }
  var e = b / 180 * Math.PI / 2;
  bot.action.multiTouchAction_(a, function(a) {
    a.scale(0.5);
  }, function(a) {
    a.rotate(e);
  }, c, d);
};
bot.action.multiTouchAction_ = function(a, b, c, d, e) {
  d = bot.action.prepareToInteractWith_(a, d);
  var f = bot.action.getInteractableSize(a), f = new goog.math.Vec2(Math.min(d.x, f.width - d.x), Math.min(d.y, f.height - d.y));
  e = e || new bot.Touchscreen;
  b(f);
  b = goog.math.Vec2.sum(d, f);
  var g = goog.math.Vec2.difference(d, f);
  e.move(a, b, g);
  e.press(!0);
  b = bot.dom.getClientRect(a);
  c(f);
  var g = goog.math.Vec2.sum(d, f), h = goog.math.Vec2.difference(d, f);
  e.move(a, g, h);
  g = bot.dom.getClientRect(a);
  b = goog.math.Vec2.difference(new goog.math.Vec2(g.left, g.top), new goog.math.Vec2(b.left, b.top));
  c(f);
  c = goog.math.Vec2.sum(d, f).subtract(b);
  d = goog.math.Vec2.difference(d, f).subtract(b);
  e.move(a, c, d);
  e.release();
};
bot.action.prepareToInteractWith_ = function(a, b) {
  bot.action.checkShown_(a);
  bot.action.scrollIntoView(a, b || void 0);
  if (b) {
    return goog.math.Vec2.fromCoordinate(b);
  }
  a = bot.action.getInteractableSize(a);
  return new goog.math.Vec2(a.width / 2, a.height / 2);
};
bot.action.getInteractableSize = function(a) {
  var b = goog.style.getSize(a);
  return 0 < b.width && 0 < b.height || !a.offsetParent ? b : bot.action.getInteractableSize(a.offsetParent);
};
bot.action.LegacyDevice_ = function() {
  bot.Device.call(this);
};
goog.inherits(bot.action.LegacyDevice_, bot.Device);
goog.addSingletonGetter(bot.action.LegacyDevice_);
bot.action.LegacyDevice_.focusOnElement = function(a) {
  var b = bot.action.LegacyDevice_.getInstance();
  b.setElement(a);
  return b.focusOnElement();
};
bot.action.LegacyDevice_.submitForm = function(a, b) {
  var c = bot.action.LegacyDevice_.getInstance();
  c.setElement(a);
  c.submitForm(b);
};
bot.action.LegacyDevice_.findAncestorForm = function(a) {
  return bot.Device.findAncestorForm(a);
};
bot.action.scrollIntoView = function(a, b) {
  var c = bot.dom.getOverflowState(a, b);
  if (c != bot.dom.OverflowState.SCROLL) {
    return c == bot.dom.OverflowState.NONE;
  }
  if (a.scrollIntoView && (a.scrollIntoView(), bot.dom.OverflowState.NONE == bot.dom.getOverflowState(a, b))) {
    return !0;
  }
  for (var c = bot.dom.getClientRegion(a, b), d = bot.dom.getParentElement(a); d; d = bot.dom.getParentElement(d)) {
    var e = d, f = bot.dom.getClientRect(e), g = goog.style.getBorderBox(e), h = c.left - f.left - g.left, f = c.top - f.top - g.top, g = e.clientHeight + c.top - c.bottom;
    e.scrollLeft += Math.min(h, Math.max(h - (e.clientWidth + c.left - c.right), 0));
    e.scrollTop += Math.min(f, Math.max(f - g, 0));
  }
  return bot.dom.OverflowState.NONE == bot.dom.getOverflowState(a, b);
};
bot.frame = {};
bot.frame.defaultContent = function() {
  return bot.getWindow().top;
};
bot.frame.activeElement = function() {
  return document.activeElement || document.body;
};
bot.frame.parentFrame = function(a) {
  return (a || bot.getWindow()).parent;
};
bot.frame.getFrameWindow = function(a) {
  if (bot.frame.isFrame_(a)) {
    return goog.dom.getFrameContentWindow(a);
  }
  throw new bot.Error(bot.ErrorCode.NO_SUCH_FRAME, "The given element isn't a frame or an iframe.");
};
bot.frame.isFrame_ = function(a) {
  return bot.dom.core.isElement(a, "FRAME") || bot.dom.core.isElement(a, "IFRAME");
};
bot.frame.findFrameByNameOrId = function(a, b) {
  for (var c = b || bot.getWindow(), d = c.frames.length, e = 0; e < d; e++) {
    var f = c.frames[e];
    b = f.frameElement || f;
    if (b.name == a) {
      return f.document ? f : goog.dom.getFrameContentWindow(f);
    }
  }
  a = bot.locators.findElements({id:a}, c.document);
  for (e = 0; e < a.length; e++) {
    if ((b = a[e]) && bot.frame.isFrame_(b)) {
      return goog.dom.getFrameContentWindow(b);
    }
  }
  return null;
};
bot.frame.findFrameByIndex = function(a, b) {
  return (b || bot.getWindow()).frames[a] || null;
};
bot.frame.getFrameIndex = function(a, b) {
  try {
    var c = a.contentWindow;
  } catch (d) {
    return null;
  }
  if (!bot.frame.isFrame_(a)) {
    return null;
  }
  a = b || bot.getWindow();
  for (b = 0; b < a.frames.length; b++) {
    if (c == a.frames[b]) {
      return b;
    }
  }
  return null;
};
goog.json = {};
goog.json.USE_NATIVE_JSON = !1;
goog.json.TRY_NATIVE_JSON = !1;
goog.json.isValid = function(a) {
  return /^\s*$/.test(a) ? !1 : /^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g, "@").replace(/(?:"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)[\s\u2028\u2029]*(?=:|,|]|}|$)/g, "]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g, ""));
};
goog.json.errorLogger_ = goog.nullFunction;
goog.json.setErrorLogger = function(a) {
  goog.json.errorLogger_ = a;
};
goog.json.parse = goog.json.USE_NATIVE_JSON ? goog.global.JSON.parse : function(a) {
  if (goog.json.TRY_NATIVE_JSON) {
    try {
      return goog.global.JSON.parse(a);
    } catch (d) {
      var b = d;
    }
  }
  a = String(a);
  if (goog.json.isValid(a)) {
    try {
      var c = eval("(" + a + ")");
      b && goog.json.errorLogger_("Invalid JSON: " + a, b);
      return c;
    } catch (d) {
    }
  }
  throw Error("Invalid JSON string: " + a);
};
goog.json.unsafeParse = goog.json.USE_NATIVE_JSON ? goog.global.JSON.parse : function(a) {
  if (goog.json.TRY_NATIVE_JSON) {
    try {
      return goog.global.JSON.parse(a);
    } catch (d) {
      var b = d;
    }
  }
  var c = eval("(" + a + ")");
  b && goog.json.errorLogger_("Invalid JSON: " + a, b);
  return c;
};
goog.json.serialize = goog.json.USE_NATIVE_JSON ? goog.global.JSON.stringify : function(a, b) {
  return (new goog.json.Serializer(b)).serialize(a);
};
goog.json.Serializer = function(a) {
  this.replacer_ = a;
};
goog.json.Serializer.prototype.serialize = function(a) {
  var b = [];
  this.serializeInternal(a, b);
  return b.join("");
};
goog.json.Serializer.prototype.serializeInternal = function(a, b) {
  if (null == a) {
    b.push("null");
  } else {
    if ("object" == typeof a) {
      if (goog.isArray(a)) {
        this.serializeArray(a, b);
        return;
      }
      if (a instanceof String || a instanceof Number || a instanceof Boolean) {
        a = a.valueOf();
      } else {
        this.serializeObject_(a, b);
        return;
      }
    }
    switch(typeof a) {
      case "string":
        this.serializeString_(a, b);
        break;
      case "number":
        this.serializeNumber_(a, b);
        break;
      case "boolean":
        b.push(String(a));
        break;
      case "function":
        b.push("null");
        break;
      default:
        throw Error("Unknown type: " + typeof a);
    }
  }
};
goog.json.Serializer.charToJsonCharCache_ = {'"':'\\"', "\\":"\\\\", "/":"\\/", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\u000b"};
goog.json.Serializer.charsToReplace_ = /\uffff/.test("\uffff") ? /[\\\"\x00-\x1f\x7f-\uffff]/g : /[\\\"\x00-\x1f\x7f-\xff]/g;
goog.json.Serializer.prototype.serializeString_ = function(a, b) {
  b.push('"', a.replace(goog.json.Serializer.charsToReplace_, function(a) {
    var b = goog.json.Serializer.charToJsonCharCache_[a];
    b || (b = "\\u" + (a.charCodeAt(0) | 65536).toString(16).substr(1), goog.json.Serializer.charToJsonCharCache_[a] = b);
    return b;
  }), '"');
};
goog.json.Serializer.prototype.serializeNumber_ = function(a, b) {
  b.push(isFinite(a) && !isNaN(a) ? String(a) : "null");
};
goog.json.Serializer.prototype.serializeArray = function(a, b) {
  var c = a.length;
  b.push("[");
  for (var d = "", e = 0; e < c; e++) {
    b.push(d), d = a[e], this.serializeInternal(this.replacer_ ? this.replacer_.call(a, String(e), d) : d, b), d = ",";
  }
  b.push("]");
};
goog.json.Serializer.prototype.serializeObject_ = function(a, b) {
  b.push("{");
  var c = "", d;
  for (d in a) {
    if (Object.prototype.hasOwnProperty.call(a, d)) {
      var e = a[d];
      "function" != typeof e && (b.push(c), this.serializeString_(d, b), b.push(":"), this.serializeInternal(this.replacer_ ? this.replacer_.call(a, d, e) : e, b), c = ",");
    }
  }
  b.push("}");
};
bot.json = {};
bot.json.NATIVE_JSON = !0;
bot.json.SUPPORTS_NATIVE_JSON_ = goog.userAgent.WEBKIT || goog.userAgent.GECKO && bot.userAgent.isEngineVersion(3.5) || goog.userAgent.IE && bot.userAgent.isEngineVersion(8);
bot.json.stringify = bot.json.NATIVE_JSON && bot.json.SUPPORTS_NATIVE_JSON_ ? JSON.stringify : goog.json.serialize;
bot.json.parse = JSON.parse;
bot.response = {};
bot.response.isResponseObject = function(a) {
  return goog.isObject(a) && goog.isNumber(a.status);
};
bot.response.createResponse = function(a) {
  return bot.response.isResponseObject(a) ? a : {status:bot.ErrorCode.SUCCESS, value:a};
};
bot.response.createErrorResponse = function(a) {
  return bot.response.isResponseObject(a) ? a : {status:a && goog.isNumber(a.code) ? a.code : bot.ErrorCode.UNKNOWN_ERROR, value:{message:(a && a.message || a) + ""}};
};
bot.response.checkResponse = function(a) {
  var b = a.status;
  if (b == bot.ErrorCode.SUCCESS) {
    return a;
  }
  b = b || bot.ErrorCode.UNKNOWN_ERROR;
  a = a.value;
  if (!a || !goog.isObject(a)) {
    throw new bot.Error(b, a + "");
  }
  throw new bot.Error(b, a.message + "");
};
bot.inject = {};
bot.inject.cache = {};
bot.inject.ELEMENT_KEY = "ELEMENT";
bot.inject.WINDOW_KEY = "WINDOW";
bot.inject.wrapValue = function(a) {
  var b = function(a, d) {
    switch(goog.typeOf(a)) {
      case "string":
      case "number":
      case "boolean":
        return a;
      case "function":
        return a.toString();
      case "array":
        return goog.array.map(a, function(a) {
          return b(a, d);
        });
      case "object":
        if (0 <= d.indexOf(a)) {
          throw new bot.Error(bot.ErrorCode.JAVASCRIPT_ERROR, "Recursive object cannot be transferred");
        }
        if (goog.object.containsKey(a, "nodeType") && (a.nodeType == goog.dom.NodeType.ELEMENT || a.nodeType == goog.dom.NodeType.DOCUMENT)) {
          var c = {};
          c[bot.inject.ELEMENT_KEY] = bot.inject.cache.addElement(a);
          return c;
        }
        if (goog.object.containsKey(a, "document")) {
          return c = {}, c[bot.inject.WINDOW_KEY] = bot.inject.cache.addElement(a), c;
        }
        d.push(a);
        if (goog.isArrayLike(a)) {
          return goog.array.map(a, function(a) {
            return b(a, d);
          });
        }
        a = goog.object.filter(a, function(a, b) {
          return goog.isNumber(b) || goog.isString(b);
        });
        return goog.object.map(a, function(a) {
          return b(a, d);
        });
      default:
        return null;
    }
  };
  return b(a, []);
};
bot.inject.unwrapValue = function(a, b) {
  return goog.isArray(a) ? goog.array.map(a, function(a) {
    return bot.inject.unwrapValue(a, b);
  }) : goog.isObject(a) ? "function" == typeof a ? a : goog.object.containsKey(a, bot.inject.ELEMENT_KEY) ? bot.inject.cache.getElement(a[bot.inject.ELEMENT_KEY], b) : goog.object.containsKey(a, bot.inject.WINDOW_KEY) ? bot.inject.cache.getElement(a[bot.inject.WINDOW_KEY], b) : goog.object.map(a, function(a) {
    return bot.inject.unwrapValue(a, b);
  }) : a;
};
bot.inject.recompileFunction_ = function(a, b) {
  if (goog.isString(a)) {
    try {
      return new b.Function(a);
    } catch (c) {
      if (goog.userAgent.IE && b.execScript) {
        return b.execScript(";"), new b.Function(a);
      }
      throw c;
    }
  }
  return b == window ? a : new b.Function("return (" + a + ").apply(null,arguments);");
};
bot.inject.executeScript = function(a, b, c, d) {
  d = d || bot.getWindow();
  try {
    a = bot.inject.recompileFunction_(a, d);
    var e = bot.inject.unwrapValue(b, d.document);
    var f = bot.inject.wrapResponse(a.apply(null, e));
  } catch (g) {
    f = bot.inject.wrapError(g);
  }
  return c ? bot.json.stringify(f) : f;
};
bot.inject.executeAsyncScript = function(a, b, c, d, e, f) {
  function g(a, b) {
    l || (k.removeEventListener ? k.removeEventListener("unload", h, !0) : k.detachEvent("onunload", h), k.clearTimeout(n), a != bot.ErrorCode.SUCCESS ? (a = new bot.Error(a, b.message || b + ""), a.stack = b.stack, b = bot.inject.wrapError(a)) : b = bot.inject.wrapResponse(b), d(e ? bot.json.stringify(b) : b), l = !0);
  }
  function h() {
    g(bot.ErrorCode.UNKNOWN_ERROR, Error("Detected a page unload event; asynchronous script execution does not work across page loads."));
  }
  var k = f || window, l = !1;
  f = goog.partial(g, bot.ErrorCode.UNKNOWN_ERROR);
  if (k.closed) {
    f("Unable to execute script; the target window is closed.");
  } else {
    a = bot.inject.recompileFunction_(a, k);
    b = bot.inject.unwrapValue(b, k.document);
    b.push(goog.partial(g, bot.ErrorCode.SUCCESS));
    k.addEventListener ? k.addEventListener("unload", h, !0) : k.attachEvent("onunload", h);
    var m = goog.now();
    try {
      a.apply(k, b);
      var n = k.setTimeout(function() {
        g(bot.ErrorCode.SCRIPT_TIMEOUT, Error("Timed out waiting for asyncrhonous script result after " + (goog.now() - m) + " ms"));
      }, Math.max(0, c));
    } catch (p) {
      g(p.code || bot.ErrorCode.UNKNOWN_ERROR, p);
    }
  }
};
bot.inject.wrapResponse = function(a) {
  return {status:bot.ErrorCode.SUCCESS, value:bot.inject.wrapValue(a)};
};
bot.inject.wrapError = function(a) {
  return {status:goog.object.containsKey(a, "code") ? a.code : bot.ErrorCode.UNKNOWN_ERROR, value:{message:a.message}};
};
bot.inject.cache.CACHE_KEY_ = "$wdc_";
bot.inject.cache.ELEMENT_KEY_PREFIX = ":wdc:";
bot.inject.cache.getCache_ = function(a) {
  a = a || document;
  var b = a[bot.inject.cache.CACHE_KEY_];
  b || (b = a[bot.inject.cache.CACHE_KEY_] = {}, b.nextId = goog.now());
  b.nextId || (b.nextId = goog.now());
  return b;
};
bot.inject.cache.addElement = function(a) {
  var b = bot.inject.cache.getCache_(a.ownerDocument), c = goog.object.findKey(b, function(b) {
    return b == a;
  });
  c || (c = bot.inject.cache.ELEMENT_KEY_PREFIX + b.nextId++, b[c] = a);
  return c;
};
bot.inject.cache.getElement = function(a, b) {
  a = decodeURIComponent(a);
  b = b || document;
  var c = bot.inject.cache.getCache_(b);
  if (!goog.object.containsKey(c, a)) {
    throw new bot.Error(bot.ErrorCode.STALE_ELEMENT_REFERENCE, "Element does not exist in cache");
  }
  var d = c[a];
  if (goog.object.containsKey(d, "setInterval")) {
    if (d.closed) {
      throw delete c[a], new bot.Error(bot.ErrorCode.NO_SUCH_WINDOW, "Window has been closed.");
    }
    return d;
  }
  for (var e = d; e;) {
    if (e == b.documentElement) {
      return d;
    }
    e = e.parentNode;
  }
  delete c[a];
  throw new bot.Error(bot.ErrorCode.STALE_ELEMENT_REFERENCE, "Element is no longer attached to the DOM");
};
bot.window = {};
bot.window.HISTORY_LENGTH_INCLUDES_NEW_PAGE_ = !goog.userAgent.IE;
bot.window.HISTORY_LENGTH_INCLUDES_FORWARD_PAGES_ = !goog.userAgent.WEBKIT || bot.userAgent.isEngineVersion("533");
bot.window.Orientation = {PORTRAIT:"portrait-primary", PORTRAIT_SECONDARY:"portrait-secondary", LANDSCAPE:"landscape-primary", LANDSCAPE_SECONDARY:"landscape-secondary"};
bot.window.getOrientationDegrees_ = function() {
  var a;
  return function(b) {
    a || (a = {}, goog.userAgent.MOBILE ? (a[bot.window.Orientation.PORTRAIT] = 0, a[bot.window.Orientation.LANDSCAPE] = 90, a[bot.window.Orientation.LANDSCAPE_SECONDARY] = -90, goog.userAgent.product.IPAD && (a[bot.window.Orientation.PORTRAIT_SECONDARY] = 180)) : goog.userAgent.product.ANDROID && (a[bot.window.Orientation.PORTRAIT] = -90, a[bot.window.Orientation.LANDSCAPE] = 0, a[bot.window.Orientation.PORTRAIT_SECONDARY] = 90, a[bot.window.Orientation.LANDSCAPE_SECONDARY] = 180));
    return a[b];
  };
}();
bot.window.back = function(a) {
  var b = bot.window.HISTORY_LENGTH_INCLUDES_NEW_PAGE_ ? bot.getWindow().history.length - 1 : bot.getWindow().history.length;
  a = bot.window.checkNumPages_(b, a);
  bot.getWindow().history.go(-a);
};
bot.window.forward = function(a) {
  var b = bot.window.HISTORY_LENGTH_INCLUDES_FORWARD_PAGES_ ? bot.getWindow().history.length - 1 : null;
  a = bot.window.checkNumPages_(b, a);
  bot.getWindow().history.go(a);
};
bot.window.checkNumPages_ = function(a, b) {
  b = goog.isDef(b) ? b : 1;
  if (0 >= b) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "number of pages must be positive");
  }
  if (null !== a && b > a) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "number of pages must be less than the length of the browser history");
  }
  return b;
};
bot.window.getInteractableSize = function(a) {
  var b = (a || bot.getWindow()).document;
  a = b.documentElement;
  var c = b.body;
  if (!c) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "No BODY element present");
  }
  b = [a.clientHeight, a.scrollHeight, a.offsetHeight, c.scrollHeight, c.offsetHeight];
  a = Math.max.apply(null, [a.clientWidth, a.scrollWidth, a.offsetWidth, c.scrollWidth, c.offsetWidth]);
  b = Math.max.apply(null, b);
  return new goog.math.Size(a, b);
};
bot.window.getFrame_ = function(a) {
  try {
    return a.frameElement;
  } catch (b) {
    return null;
  }
};
bot.window.getSize = function(a) {
  a = a || bot.getWindow();
  var b = bot.window.getFrame_(a);
  if (bot.userAgent.ANDROID_PRE_ICECREAMSANDWICH) {
    return b ? (a = goog.style.getBorderBox(b), new goog.math.Size(b.clientWidth - a.left - a.right, b.clientHeight)) : new goog.math.Size(320, 240);
  }
  if (b) {
    return new goog.math.Size(b.clientWidth, b.clientHeight);
  }
  var b = a.document.documentElement, c = a.document.body;
  return new goog.math.Size(a.outerWidth || b && b.clientWidth || c && c.clientWidth || 0, a.outerHeight || b && b.clientHeight || c && c.clientHeight || 0);
};
bot.window.setSize = function(a, b) {
  b = b || bot.getWindow();
  var c = bot.window.getFrame_(b);
  c ? (c.style.minHeight = "0px", c.style.minWidth = "0px", c.width = a.width + "px", c.style.width = a.width + "px", c.height = a.height + "px", c.style.height = a.height + "px") : b.resizeTo(a.width, a.height);
};
bot.window.getScroll = function(a) {
  a = a || bot.getWindow();
  return (new goog.dom.DomHelper(a.document)).getDocumentScroll();
};
bot.window.setScroll = function(a, b) {
  (b || bot.getWindow()).scrollTo(a.x, a.y);
};
bot.window.getPosition = function(a) {
  var b = a || bot.getWindow();
  goog.userAgent.IE ? (a = b.screenLeft, b = b.screenTop) : (a = b.screenX, b = b.screenY);
  return new goog.math.Coordinate(a, b);
};
bot.window.setPosition = function(a, b) {
  (b || bot.getWindow()).moveTo(a.x, a.y);
};
bot.window.scrollIntoView = function(a, b) {
  function c(a, b, c) {
    return a < b ? a : a >= b + c ? a - c + 1 : b;
  }
  b = b || bot.getWindow();
  var d = goog.dom.getViewportSize(b), e = bot.window.getScroll(b);
  a = new goog.math.Coordinate(c(a.x, e.x, d.width), c(a.y, e.y, d.height));
  goog.math.Coordinate.equals(a, e) || bot.window.setScroll(a, b);
  if (!goog.math.Coordinate.equals(a, bot.window.getScroll(b))) {
    throw new bot.Error(bot.ErrorCode.MOVE_TARGET_OUT_OF_BOUNDS, "The target scroll location " + a + " is not on the page.");
  }
};
bot.window.getCurrentOrientationDegrees_ = function() {
  var a = bot.getWindow();
  goog.isDef(a.orientation) || (a.orientation = 0);
  return a.orientation;
};
bot.window.changeOrientation = function(a) {
  var b = bot.getWindow(), c = bot.window.getCurrentOrientationDegrees_(), d = bot.window.getOrientationDegrees_(a);
  if (c != d && goog.isDef(d)) {
    if (Object.getOwnPropertyDescriptor && Object.defineProperty) {
      var e = Object.getOwnPropertyDescriptor(b, "orientation");
      e && e.configurable && Object.defineProperty(b, "orientation", {configurable:!0, get:function() {
        return d;
      }});
    }
    bot.events.fire(b, bot.events.EventType.ORIENTATIONCHANGE);
    0 != Math.abs(c - d) % 180 && (c = bot.window.getSize(), b = c.getShortest(), c = c.getLongest(), a == bot.window.Orientation.PORTRAIT || a == bot.window.Orientation.PORTRAIT_SECONDARY ? bot.window.setSize(new goog.math.Size(b, c)) : bot.window.setSize(new goog.math.Size(c, b)));
  }
};
bot.html5 = {};
bot.html5.API = {APPCACHE:"appcache", BROWSER_CONNECTION:"browser_connection", DATABASE:"database", GEOLOCATION:"location", LOCAL_STORAGE:"local_storage", SESSION_STORAGE:"session_storage", VIDEO:"video", AUDIO:"audio", CANVAS:"canvas"};
bot.html5.IS_IE8_OR_EARLIER_ = goog.userAgent.IE && !bot.userAgent.isEngineVersion(9);
bot.html5.IS_SAFARI4_OR_EARLIER_ = goog.userAgent.product.SAFARI && !bot.userAgent.isProductVersion(5);
bot.html5.IS_ANDROID_FROYO_OR_EARLIER_ = goog.userAgent.product.ANDROID && !bot.userAgent.isProductVersion(2.3);
bot.html5.IS_SAFARI_WINDOWS_ = goog.userAgent.WINDOWS && goog.userAgent.product.SAFARI && bot.userAgent.isProductVersion(4) && !bot.userAgent.isProductVersion(6);
bot.html5.isSupported = function(a, b) {
  b = b || bot.getWindow();
  switch(a) {
    case bot.html5.API.APPCACHE:
      return bot.html5.IS_IE8_OR_EARLIER_ ? !1 : goog.isDefAndNotNull(b.applicationCache);
    case bot.html5.API.BROWSER_CONNECTION:
      return goog.isDefAndNotNull(b.navigator) && goog.isDefAndNotNull(b.navigator.onLine);
    case bot.html5.API.DATABASE:
      return bot.html5.IS_SAFARI4_OR_EARLIER_ || bot.html5.IS_ANDROID_FROYO_OR_EARLIER_ ? !1 : goog.isDefAndNotNull(b.openDatabase);
    case bot.html5.API.GEOLOCATION:
      return bot.html5.IS_SAFARI_WINDOWS_ ? !1 : goog.isDefAndNotNull(b.navigator) && goog.isDefAndNotNull(b.navigator.geolocation);
    case bot.html5.API.LOCAL_STORAGE:
      return bot.html5.IS_IE8_OR_EARLIER_ ? !1 : goog.isDefAndNotNull(b.localStorage);
    case bot.html5.API.SESSION_STORAGE:
      return bot.html5.IS_IE8_OR_EARLIER_ ? !1 : goog.isDefAndNotNull(b.sessionStorage) && goog.isDefAndNotNull(b.sessionStorage.clear);
    default:
      throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "Unsupported API identifier provided as parameter");
  }
};
bot.appcache = {};
bot.appcache.getStatus = function(a) {
  a = a || bot.getWindow();
  if (bot.html5.isSupported(bot.html5.API.APPCACHE, a)) {
    return a.applicationCache.status;
  }
  throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "Undefined application cache");
};
bot.storage = {};
bot.storage.database = {};
bot.storage.database.openOrCreate = function(a, b, c, d, e) {
  b = b || "";
  c = c || a + "name";
  d = d || 5242880;
  return (e || bot.getWindow()).openDatabase(a, b, c, d);
};
bot.storage.database.executeSql = function(a, b, c, d, e, f, g) {
  try {
    var h = bot.storage.database.openOrCreate(a);
  } catch (l) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, l.message);
  }
  var k = function(a, b) {
    b = new bot.storage.database.ResultSet(b);
    d(a, b);
  };
  h.transaction(function(a) {
    a.executeSql(b, c, k, g);
  }, e, f);
};
bot.storage.database.ResultSet = function(a) {
  this.rows = [];
  for (var b = 0; b < a.rows.length; b++) {
    this.rows[b] = a.rows.item(b);
  }
  this.rowsAffected = a.rowsAffected;
  this.insertId = -1;
  try {
    this.insertId = a.insertId;
  } catch (c) {
  }
};
bot.geolocation = {};
bot.geolocation.DEFAULT_OPTIONS = {enableHighAccuracy:!0, maximumAge:Infinity, timeout:5000};
bot.geolocation.getCurrentPosition = function(a, b, c) {
  var d = bot.getWindow();
  c = c || bot.geolocation.DEFAULT_OPTIONS;
  if (bot.html5.isSupported(bot.html5.API.GEOLOCATION, d)) {
    d.navigator.geolocation.getCurrentPosition(a, b, c);
  } else {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "Geolocation undefined");
  }
};
bot.storage.getLocalStorage = function(a) {
  a = a || bot.getWindow();
  if (!bot.html5.isSupported(bot.html5.API.LOCAL_STORAGE, a)) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "Local storage undefined");
  }
  return new bot.storage.Storage(a.localStorage);
};
bot.storage.getSessionStorage = function(a) {
  a = a || bot.getWindow();
  if (bot.html5.isSupported(bot.html5.API.SESSION_STORAGE, a)) {
    return new bot.storage.Storage(a.sessionStorage);
  }
  throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "Session storage undefined");
};
bot.storage.Storage = function(a) {
  this.storageMap_ = a;
};
bot.storage.Storage.prototype.setItem = function(a, b) {
  try {
    this.storageMap_.setItem(a, b + "");
  } catch (c) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, c.message);
  }
};
bot.storage.Storage.prototype.getItem = function(a) {
  return this.storageMap_.getItem(a);
};
bot.storage.Storage.prototype.keySet = function() {
  for (var a = [], b = this.size(), c = 0; c < b; c++) {
    a[c] = this.storageMap_.key(c);
  }
  return a;
};
bot.storage.Storage.prototype.removeItem = function(a) {
  var b = this.getItem(a);
  this.storageMap_.removeItem(a);
  return b;
};
bot.storage.Storage.prototype.clear = function() {
  this.storageMap_.clear();
};
bot.storage.Storage.prototype.size = function() {
  return this.storageMap_.length;
};
bot.storage.Storage.prototype.key = function(a) {
  return this.storageMap_.key(a);
};
bot.storage.Storage.prototype.getStorageMap = function() {
  return this.storageMap_;
};
var webdriver = {Key:{NULL:"\ue000", CANCEL:"\ue001", HELP:"\ue002", BACK_SPACE:"\ue003", TAB:"\ue004", CLEAR:"\ue005", RETURN:"\ue006", ENTER:"\ue007", SHIFT:"\ue008", CONTROL:"\ue009", ALT:"\ue00a", PAUSE:"\ue00b", ESCAPE:"\ue00c", SPACE:"\ue00d", PAGE_UP:"\ue00e", PAGE_DOWN:"\ue00f", END:"\ue010", HOME:"\ue011", ARROW_LEFT:"\ue012", LEFT:"\ue012", ARROW_UP:"\ue013", UP:"\ue013", ARROW_RIGHT:"\ue014", RIGHT:"\ue014", ARROW_DOWN:"\ue015", DOWN:"\ue015", INSERT:"\ue016", DELETE:"\ue017", SEMICOLON:"\ue018",
EQUALS:"\ue019", NUMPAD0:"\ue01a", NUMPAD1:"\ue01b", NUMPAD2:"\ue01c", NUMPAD3:"\ue01d", NUMPAD4:"\ue01e", NUMPAD5:"\ue01f", NUMPAD6:"\ue020", NUMPAD7:"\ue021", NUMPAD8:"\ue022", NUMPAD9:"\ue023", MULTIPLY:"\ue024", ADD:"\ue025", SEPARATOR:"\ue026", SUBTRACT:"\ue027", DECIMAL:"\ue028", DIVIDE:"\ue029", F1:"\ue031", F2:"\ue032", F3:"\ue033", F4:"\ue034", F5:"\ue035", F6:"\ue036", F7:"\ue037", F8:"\ue038", F9:"\ue039", F10:"\ue03a", F11:"\ue03b", F12:"\ue03c", COMMAND:"\ue03d", META:"\ue03d"}};
webdriver.atoms = {};
webdriver.atoms.element = {};
webdriver.atoms.element.attribute = {};
var module$contents$webdriver$atoms$element$attribute_PROPERTY_ALIASES = {"class":"className", readonly:"readOnly"}, module$contents$webdriver$atoms$element$attribute_BOOLEAN_PROPERTIES = "allowfullscreen allowpaymentrequest allowusermedia async autofocus autoplay checked compact complete controls declare default defaultchecked defaultselected defer disabled ended formnovalidate hidden indeterminate iscontenteditable ismap itemscope loop multiple muted nohref nomodule noresize noshade novalidate nowrap open paused playsinline pubdate readonly required reversed scoped seamless seeking selected truespeed typemustmatch willvalidate".split(" ");
webdriver.atoms.element.attribute.get = function(a, b) {
  var c = b.toLowerCase();
  if ("style" == c) {
    return (b = a.style) && !goog.isString(b) && (b = b.cssText), b;
  }
  if (("selected" == c || "checked" == c) && bot.dom.core.isSelectable(a)) {
    return bot.dom.core.isSelected(a) ? "true" : null;
  }
  var d = bot.dom.core.isElement(a, "A");
  if (bot.dom.core.isElement(a, "IMG") && "src" == c || d && "href" == c) {
    return (b = bot.dom.core.getAttribute(a, c)) && (b = bot.dom.core.getProperty(a, c)), b;
  }
  if ("spellcheck" == c) {
    b = bot.dom.core.getAttribute(a, c);
    if (!goog.isNull(b)) {
      if ("false" == b.toLowerCase()) {
        return "false";
      }
      if ("true" == b.toLowerCase()) {
        return "true";
      }
    }
    return bot.dom.core.getProperty(a, c) + "";
  }
  d = module$contents$webdriver$atoms$element$attribute_PROPERTY_ALIASES[b] || b;
  if (goog.array.contains(module$contents$webdriver$atoms$element$attribute_BOOLEAN_PROPERTIES, c)) {
    return (b = !goog.isNull(bot.dom.core.getAttribute(a, b)) || bot.dom.core.getProperty(a, d)) ? "true" : null;
  }
  try {
    var e = bot.dom.core.getProperty(a, d);
  } catch (f) {
  }
  b = !goog.isDefAndNotNull(e) || goog.isObject(e) ? bot.dom.core.getAttribute(a, b) : e;
  return goog.isDefAndNotNull(b) ? b.toString() : null;
};
webdriver.atoms.element.isSelected = function(a) {
  return bot.dom.core.isSelectable(a) ? bot.dom.core.isSelected(a) : !1;
};
webdriver.atoms.element.getAttribute = webdriver.atoms.element.attribute.get;
webdriver.atoms.element.getLocation = function(a) {
  return bot.dom.isShown(a) ? goog.style.getBounds(a) : null;
};
webdriver.atoms.element.getLocationInView = function(a, b) {
  bot.action.scrollIntoView(a, b);
  a = bot.dom.getClientRegion(a, b);
  return new goog.math.Coordinate(a.left, a.top);
};
webdriver.atoms.element.isInHead_ = function(a) {
  for (; a;) {
    if (a.tagName && "head" == a.tagName.toLowerCase()) {
      return !0;
    }
    try {
      a = a.parentNode;
    } catch (b) {
      break;
    }
  }
  return !1;
};
webdriver.atoms.element.getText = function(a) {
  return bot.dom.getVisibleText(a);
};
webdriver.atoms.element.type = function(a, b, c, d) {
  function e() {
    return {persist:f, keys:[]};
  }
  var f = !!d, g = [], h = e();
  g.push(h);
  goog.array.forEach(b, function(a) {
    goog.array.forEach(a.split(""), function(a) {
      if ("\ue000" <= a && "\ue03d" >= a) {
        var b = webdriver.atoms.element.type.JSON_TO_KEY_MAP_[a];
        if (null === b) {
          g.push(h = e()), f && (h.persist = !1, g.push(h = e()));
        } else {
          if (goog.isDef(b)) {
            h.keys.push(b);
          } else {
            throw Error("Unsupported WebDriver key: \\u" + a.charCodeAt(0).toString(16));
          }
        }
      } else {
        switch(a) {
          case "\n":
            h.keys.push(bot.Keyboard.Keys.ENTER);
            break;
          case "\t":
            h.keys.push(bot.Keyboard.Keys.TAB);
            break;
          case "\b":
            h.keys.push(bot.Keyboard.Keys.BACKSPACE);
            break;
          default:
            h.keys.push(a);
        }
      }
    });
  });
  goog.array.forEach(g, function(b) {
    bot.action.type(a, b.keys, c, b.persist);
  });
};
webdriver.atoms.element.type.JSON_TO_KEY_MAP_ = {};
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.NULL] = null;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.BACK_SPACE] = bot.Keyboard.Keys.BACKSPACE;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.TAB] = bot.Keyboard.Keys.TAB;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.RETURN] = bot.Keyboard.Keys.ENTER;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.ENTER] = bot.Keyboard.Keys.ENTER;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.SHIFT] = bot.Keyboard.Keys.SHIFT;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.CONTROL] = bot.Keyboard.Keys.CONTROL;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.ALT] = bot.Keyboard.Keys.ALT;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.PAUSE] = bot.Keyboard.Keys.PAUSE;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.ESCAPE] = bot.Keyboard.Keys.ESC;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.SPACE] = bot.Keyboard.Keys.SPACE;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.PAGE_UP] = bot.Keyboard.Keys.PAGE_UP;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.PAGE_DOWN] = bot.Keyboard.Keys.PAGE_DOWN;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.END] = bot.Keyboard.Keys.END;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.HOME] = bot.Keyboard.Keys.HOME;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.LEFT] = bot.Keyboard.Keys.LEFT;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.UP] = bot.Keyboard.Keys.UP;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.RIGHT] = bot.Keyboard.Keys.RIGHT;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.DOWN] = bot.Keyboard.Keys.DOWN;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.INSERT] = bot.Keyboard.Keys.INSERT;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.DELETE] = bot.Keyboard.Keys.DELETE;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.SEMICOLON] = bot.Keyboard.Keys.SEMICOLON;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.EQUALS] = bot.Keyboard.Keys.EQUALS;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.NUMPAD0] = bot.Keyboard.Keys.NUM_ZERO;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.NUMPAD1] = bot.Keyboard.Keys.NUM_ONE;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.NUMPAD2] = bot.Keyboard.Keys.NUM_TWO;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.NUMPAD3] = bot.Keyboard.Keys.NUM_THREE;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.NUMPAD4] = bot.Keyboard.Keys.NUM_FOUR;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.NUMPAD5] = bot.Keyboard.Keys.NUM_FIVE;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.NUMPAD6] = bot.Keyboard.Keys.NUM_SIX;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.NUMPAD7] = bot.Keyboard.Keys.NUM_SEVEN;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.NUMPAD8] = bot.Keyboard.Keys.NUM_EIGHT;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.NUMPAD9] = bot.Keyboard.Keys.NUM_NINE;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.MULTIPLY] = bot.Keyboard.Keys.NUM_MULTIPLY;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.ADD] = bot.Keyboard.Keys.NUM_PLUS;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.SUBTRACT] = bot.Keyboard.Keys.NUM_MINUS;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.DECIMAL] = bot.Keyboard.Keys.NUM_PERIOD;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.DIVIDE] = bot.Keyboard.Keys.NUM_DIVISION;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.SEPARATOR] = bot.Keyboard.Keys.SEPARATOR;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.F1] = bot.Keyboard.Keys.F1;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.F2] = bot.Keyboard.Keys.F2;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.F3] = bot.Keyboard.Keys.F3;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.F4] = bot.Keyboard.Keys.F4;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.F5] = bot.Keyboard.Keys.F5;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.F6] = bot.Keyboard.Keys.F6;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.F7] = bot.Keyboard.Keys.F7;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.F8] = bot.Keyboard.Keys.F8;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.F9] = bot.Keyboard.Keys.F9;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.F10] = bot.Keyboard.Keys.F10;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.F11] = bot.Keyboard.Keys.F11;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.F12] = bot.Keyboard.Keys.F12;
webdriver.atoms.element.type.JSON_TO_KEY_MAP_[webdriver.Key.META] = bot.Keyboard.Keys.META;
webdriver.atoms.inputs = {};
webdriver.atoms.inputs.sendKeys = function(a, b, c, d) {
  c = new bot.Keyboard(c);
  a || (a = bot.dom.getActiveElement(document));
  if (!a) {
    throw Error("No element to send keys to");
  }
  webdriver.atoms.element.type(a, b, c, d);
  return c.getState();
};
webdriver.atoms.inputs.click = function(a, b) {
  b = new bot.Mouse(b);
  a || (a = b.getState().element);
  if (!a) {
    throw Error("No element to send keys to");
  }
  bot.action.click(a, null, b);
  return b.getState();
};
webdriver.atoms.inputs.mouseMove = function(a, b, c, d) {
  d = new bot.Mouse(d);
  var e = a || d.getState().element, f = null != b && null != c;
  b = b || 0;
  c = c || 0;
  a ? f || (c = bot.action.getInteractableSize(a), b = Math.floor(c.width / 2), c = Math.floor(c.height / 2)) : (a = goog.style.getClientPosition(e), b += d.getState().clientXY.x - a.x, c += d.getState().clientXY.y - a.y);
  a = goog.dom.getOwnerDocument(e);
  goog.dom.getWindow(a);
  bot.action.scrollIntoView(e, new goog.math.Coordinate(b, c));
  b = new goog.math.Coordinate(b, c);
  d.move(e, b);
  return d.getState();
};
webdriver.atoms.inputs.mouseButtonDown = function(a) {
  a = new bot.Mouse(a);
  a.pressButton(bot.Mouse.Button.LEFT);
  return a.getState();
};
webdriver.atoms.inputs.mouseButtonUp = function(a) {
  a = new bot.Mouse(a);
  a.releaseButton();
  return a.getState();
};
webdriver.atoms.inputs.doubleClick = function(a) {
  a = new bot.Mouse(a);
  a.pressButton(bot.Mouse.Button.LEFT);
  a.releaseButton();
  a.pressButton(bot.Mouse.Button.LEFT);
  a.releaseButton();
  return a.getState();
};
webdriver.atoms.inputs.rightClick = function(a) {
  a = new bot.Mouse(a);
  a.pressButton(bot.Mouse.Button.RIGHT);
  a.releaseButton();
  return a.getState();
};
webdriver.atoms.inputs.mouseClick = function(a, b) {
  b && b.clientXY && !b.element && document.elementFromPoint && (b.element = document.elementFromPoint(b.clientXY.x, b.clientXY.y));
  b = new bot.Mouse(b);
  b.pressButton(a);
  b.releaseButton();
  return b.getState();
};
goog.exportSymbol("webdriver.atoms.inputs.click", webdriver.atoms.inputs.click);
goog.exportSymbol("webdriver.atoms.inputs.doubleClick", webdriver.atoms.inputs.doubleClick);
goog.exportSymbol("webdriver.atoms.inputs.rightClick", webdriver.atoms.inputs.rightClick);
goog.exportSymbol("webdriver.atoms.inputs.mouseButtonDown", webdriver.atoms.inputs.mouseButtonDown);
goog.exportSymbol("webdriver.atoms.inputs.mouseButtonUp", webdriver.atoms.inputs.mouseButtonUp);
goog.exportSymbol("webdriver.atoms.inputs.mouseMove", webdriver.atoms.inputs.mouseMove);
goog.exportSymbol("webdriver.atoms.inputs.sendKeys", webdriver.atoms.inputs.sendKeys);
webdriver.atoms.inject = {};
webdriver.atoms.inject.executeScript = function(a, b, c) {
  return bot.inject.executeScript(a, b, !0, webdriver.atoms.inject.getWindow(c));
};
webdriver.atoms.inject.executeAsyncScript = function(a, b, c, d, e) {
  bot.inject.executeAsyncScript(a, b, c, d, !0, webdriver.atoms.inject.getWindow(e));
};
webdriver.atoms.inject.getWindow = function(a) {
  return a ? bot.inject.cache.getElement(a[bot.inject.WINDOW_KEY]) : window;
};
webdriver.atoms.inject.action = {};
webdriver.atoms.inject.action.type = function(a, b, c) {
  return webdriver.atoms.inject.action.executeActionFunction_(webdriver.atoms.element.type, [a, b], c);
};
webdriver.atoms.inject.action.submit = function(a, b) {
  return webdriver.atoms.inject.action.executeActionFunction_(bot.action.submit, [a], b);
};
webdriver.atoms.inject.action.clear = function(a, b) {
  return webdriver.atoms.inject.action.executeActionFunction_(bot.action.clear, [a], b);
};
webdriver.atoms.inject.action.click = function(a, b) {
  return webdriver.atoms.inject.action.executeActionFunction_(bot.action.click, [a], b);
};
webdriver.atoms.inject.action.mouseClick = function(a, b, c) {
  return webdriver.atoms.inject.action.executeActionFunction_(webdriver.atoms.inputs.mouseClick, [a, b], c);
};
webdriver.atoms.inject.action.sendKeysToActiveElement = function(a, b, c) {
  return webdriver.atoms.inject.action.executeActionFunction_(webdriver.atoms.inputs.sendKeys, [null, a, b, !0], c);
};
webdriver.atoms.inject.action.mouseMove = function(a, b, c, d, e) {
  return webdriver.atoms.inject.action.executeActionFunction_(webdriver.atoms.inputs.mouseMove, [a, b, c, d], e);
};
webdriver.atoms.inject.action.mouseButtonDown = function(a, b) {
  return webdriver.atoms.inject.action.executeActionFunction_(webdriver.atoms.inputs.mouseButtonDown, [a], b);
};
webdriver.atoms.inject.action.mouseButtonUp = function(a, b) {
  return webdriver.atoms.inject.action.executeActionFunction_(webdriver.atoms.inputs.mouseButtonUp, [a], b);
};
webdriver.atoms.inject.action.doubleClick = function(a, b) {
  return webdriver.atoms.inject.action.executeActionFunction_(webdriver.atoms.inputs.doubleClick, [a], b);
};
webdriver.atoms.inject.action.executeActionFunction_ = function(a, b, c) {
  try {
    var d = webdriver.atoms.inject.getWindow(c), e = bot.inject.unwrapValue(b, d.document), f = a.apply(null, e);
    var g = bot.inject.wrapResponse(f);
  } catch (h) {
    g = bot.inject.wrapError(h);
  }
  return goog.json.serialize(g);
};
webdriver.atoms.storage = {};
webdriver.atoms.storage.appcache = {};
webdriver.atoms.storage.appcache.getStatus = function() {
  return bot.appcache.getStatus();
};
webdriver.atoms.inject.storage = {};
webdriver.atoms.inject.storage.appcache = {};
webdriver.atoms.inject.storage.appcache.getStatus = function() {
  return bot.inject.executeScript(webdriver.atoms.storage.appcache.getStatus, [], !0);
};
webdriver.atoms.inject.dom = {};
webdriver.atoms.inject.dom.getText = function(a, b) {
  return webdriver.atoms.inject.dom.executeDomFunction_(bot.dom.getVisibleText, [a], b);
};
webdriver.atoms.inject.dom.isSelected = function(a, b) {
  return webdriver.atoms.inject.dom.executeDomFunction_(bot.dom.core.isSelected, [a], b);
};
webdriver.atoms.inject.dom.getTopLeftCoordinates = function(a, b) {
  return webdriver.atoms.inject.dom.executeDomFunction_(webdriver.atoms.element.getLocationInView, [a], b);
};
webdriver.atoms.inject.dom.getAttributeValue = function(a, b, c) {
  return webdriver.atoms.inject.dom.executeDomFunction_(webdriver.atoms.element.attribute.get, [a, b], c);
};
webdriver.atoms.inject.dom.getSize = function(a, b) {
  return webdriver.atoms.inject.dom.executeDomFunction_(function(a) {
    var b = bot.dom.getClientRect(a);
    a = b.height;
    b = b.width;
    bot.userAgent.IE_DOC_PRE10 || (b = Math.floor(b), a = Math.floor(a));
    return {width:b, height:a};
  }, [a], b);
};
webdriver.atoms.inject.dom.getValueOfCssProperty = function(a, b, c) {
  return webdriver.atoms.inject.dom.executeDomFunction_(bot.dom.getEffectiveStyle, [a, b], c);
};
webdriver.atoms.inject.dom.isEnabled = function(a, b) {
  return webdriver.atoms.inject.dom.executeDomFunction_(bot.dom.isEnabled, [a], b);
};
webdriver.atoms.inject.dom.isDisplayed = function(a, b) {
  return webdriver.atoms.inject.dom.executeDomFunction_(bot.dom.isShown, [a, !0], b);
};
webdriver.atoms.inject.dom.executeDomFunction_ = function(a, b, c) {
  try {
    var d = webdriver.atoms.inject.getWindow(c), e = bot.inject.unwrapValue(b, d.document), f = a.apply(null, e);
    var g = bot.inject.wrapResponse(f);
  } catch (h) {
    g = bot.inject.wrapError(h);
  }
  return goog.json.serialize(g);
};
webdriver.atoms.inject.locators = {};
webdriver.atoms.inject.locators.findElement = function(a, b, c, d) {
  return webdriver.atoms.inject.locators.performSearch_(a, b, bot.locators.findElement, c, d);
};
webdriver.atoms.inject.locators.findElements = function(a, b, c, d) {
  return webdriver.atoms.inject.locators.performSearch_(a, b, bot.locators.findElements, c, d);
};
webdriver.atoms.inject.locators.performSearch_ = function(a, b, c, d, e) {
  var f = {};
  f[a] = b;
  try {
    var g = webdriver.atoms.inject.getWindow(e);
    var h = d ? bot.inject.cache.getElement(d[bot.inject.ELEMENT_KEY], g.document) : g.document;
    var k = c(f, h);
    var l = bot.inject.wrapResponse(k);
  } catch (m) {
    l = bot.inject.wrapError(m);
  }
  return goog.json.serialize(l);
};
webdriver.atoms.inject.frame = {};
webdriver.atoms.inject.frame.findFrameByIdOrName = function(a, b) {
  return webdriver.atoms.inject.executeScript(bot.frame.findFrameByNameOrId, [a, b]);
};
webdriver.atoms.inject.frame.activeElement = function() {
  return webdriver.atoms.inject.executeScript(bot.frame.activeElement, []);
};
webdriver.atoms.inject.frame.parentFrame = function(a) {
  return webdriver.atoms.inject.executeScript(bot.frame.parentFrame, [a]);
};
webdriver.atoms.inject.frame.findFrameByIndex = function(a, b) {
  return webdriver.atoms.inject.executeScript(bot.frame.findFrameByIndex, [a, b]);
};
webdriver.atoms.inject.frame.defaultContent = function() {
  return webdriver.atoms.inject.executeScript(bot.frame.defaultContent, []);
};
webdriver.atoms.inject.frame.getFrameWindow = function(a) {
  return webdriver.atoms.inject.executeScript(bot.frame.getFrameWindow, [a]);
};
webdriver.atoms.storage.local = {};
webdriver.atoms.storage.local.setItem = function(a, b) {
  bot.storage.getLocalStorage().setItem(a, b);
};
webdriver.atoms.storage.local.getItem = function(a) {
  return bot.storage.getLocalStorage().getItem(a);
};
webdriver.atoms.storage.local.keySet = function() {
  return bot.storage.getLocalStorage().keySet();
};
webdriver.atoms.storage.local.removeItem = function(a) {
  return bot.storage.getLocalStorage().removeItem(a);
};
webdriver.atoms.storage.local.clear = function() {
  bot.storage.getLocalStorage().clear();
};
webdriver.atoms.storage.local.size = function() {
  return bot.storage.getLocalStorage().size();
};
webdriver.atoms.storage.local.key = function(a) {
  return bot.storage.getLocalStorage().key(a);
};
webdriver.atoms.inject.storage.local = {};
webdriver.atoms.inject.storage.local.setItem = function(a, b) {
  return webdriver.atoms.inject.executeScript(webdriver.atoms.storage.local.setItem, [a, b]);
};
webdriver.atoms.inject.storage.local.getItem = function(a) {
  return webdriver.atoms.inject.executeScript(webdriver.atoms.storage.local.getItem, [a]);
};
webdriver.atoms.inject.storage.local.keySet = function() {
  return webdriver.atoms.inject.executeScript(webdriver.atoms.storage.local.keySet, []);
};
webdriver.atoms.inject.storage.local.removeItem = function(a) {
  return webdriver.atoms.inject.executeScript(webdriver.atoms.storage.local.removeItem, [a]);
};
webdriver.atoms.inject.storage.local.clear = function() {
  return webdriver.atoms.inject.executeScript(webdriver.atoms.storage.local.clear, []);
};
webdriver.atoms.inject.storage.local.size = function() {
  return webdriver.atoms.inject.executeScript(webdriver.atoms.storage.local.size, []);
};
webdriver.atoms.storage.session = {};
webdriver.atoms.storage.session.setItem = function(a, b) {
  bot.storage.getSessionStorage().setItem(a, b);
};
webdriver.atoms.storage.session.getItem = function(a) {
  return bot.storage.getSessionStorage().getItem(a);
};
webdriver.atoms.storage.session.keySet = function() {
  return bot.storage.getSessionStorage().keySet();
};
webdriver.atoms.storage.session.removeItem = function(a) {
  return bot.storage.getSessionStorage().removeItem(a);
};
webdriver.atoms.storage.session.clear = function() {
  bot.storage.getSessionStorage().clear();
};
webdriver.atoms.storage.session.size = function() {
  return bot.storage.getSessionStorage().size();
};
webdriver.atoms.storage.session.key = function(a) {
  return bot.storage.getSessionStorage().key(a);
};
webdriver.atoms.inject.storage.session = {};
webdriver.atoms.inject.storage.session.setItem = function(a, b) {
  return webdriver.atoms.inject.executeScript(webdriver.atoms.storage.session.setItem, [a, b]);
};
webdriver.atoms.inject.storage.session.getItem = function(a) {
  return webdriver.atoms.inject.executeScript(webdriver.atoms.storage.session.getItem, [a]);
};
webdriver.atoms.inject.storage.session.keySet = function() {
  return webdriver.atoms.inject.executeScript(webdriver.atoms.storage.session.keySet, []);
};
webdriver.atoms.inject.storage.session.removeItem = function(a) {
  return webdriver.atoms.inject.executeScript(webdriver.atoms.storage.session.removeItem, [a]);
};
webdriver.atoms.inject.storage.session.clear = function() {
  return webdriver.atoms.inject.executeScript(webdriver.atoms.storage.session.clear, []);
};
webdriver.atoms.inject.storage.session.size = function() {
  return webdriver.atoms.inject.executeScript(webdriver.atoms.storage.session.size, []);
};
webdriver.atoms.inject.storage.database = {};
webdriver.atoms.inject.storage.database.executeSql = function(a, b, c, d) {
  bot.storage.database.executeSql(a, b, c, function(a, b) {
    d(webdriver.atoms.inject.executeScript(function(a) {
      return b;
    }, [b]));
  }, function(a) {
    d(webdriver.atoms.inject.executeScript(function() {
      throw new bot.Error(bot.ErrorCode.SQL_DATABASE_ERROR, "SQL Error Code: " + a.code + ". SQL Error Message: " + a.message);
    }, []));
  });
};
var core = {atoms:{}};
core.Error = function(a) {
  goog.debug.Error.call(this, a);
};
goog.inherits(core.Error, goog.debug.Error);
core.filters = {};
core.filters.name_ = function(a, b) {
  return goog.array.filter(b, function(b, d, e) {
    return bot.dom.core.getProperty(b, "name") == a;
  });
};
core.filters.value_ = function(a, b) {
  return goog.array.filter(b, function(b, d, e) {
    return bot.dom.core.getProperty(b, "value") === a;
  });
};
core.filters.index_ = function(a, b) {
  var c = Number(a);
  if (isNaN(c) || 0 > c) {
    throw new core.Error("Illegal Index: " + a);
  }
  if (b.length <= c) {
    throw new core.Error("Index out of range: " + a);
  }
  return [b[c]];
};
core.filters.Filters_ = {index:core.filters.index_, name:core.filters.name_, value:core.filters.value_};
core.filters.selectElementsBy_ = function(a, b, c) {
  var d = core.filters.Filters_[a];
  if (!d) {
    throw new core.Error("Unrecognised element-filter type: '" + a + "'");
  }
  return d(b, c);
};
core.filters.selectElements = function(a, b, c) {
  c = c || "value";
  var d = a.match(/^([A-Za-z]+)=(.+)/);
  d && (c = d[1].toLowerCase(), a = d[2]);
  return core.filters.selectElementsBy_(c, a, b);
};
core.patternMatcher = {};
core.patternMatcher.exact_ = function(a, b) {
  return -1 != b.indexOf(a);
};
core.patternMatcher.regexp_ = function(a, b) {
  return (new RegExp(a)).test(b);
};
core.patternMatcher.regexpi_ = function(a, b) {
  return (new RegExp(a, "i")).test(b);
};
core.patternMatcher.globContains_ = function(a, b) {
  return (new RegExp(core.patternMatcher.regexpFromGlobContains(a))).test(b);
};
core.patternMatcher.glob_ = function(a, b) {
  return (new RegExp(core.patternMatcher.regexpFromGlob(a))).test(b);
};
core.patternMatcher.convertGlobMetaCharsToRegexpMetaChars_ = function(a) {
  a = a.replace(/([.^$+(){}\[\]\\|])/g, "\\$1");
  a = a.replace(/\?/g, "(.|[\r\n])");
  return a = a.replace(/\*/g, "(.|[\r\n])*");
};
core.patternMatcher.regexpFromGlobContains = function(a) {
  return core.patternMatcher.convertGlobMetaCharsToRegexpMetaChars_(a);
};
core.patternMatcher.regexpFromGlob = function(a) {
  return "^" + core.patternMatcher.convertGlobMetaCharsToRegexpMetaChars_(a) + "$";
};
core.patternMatcher.KNOWN_STRATEGIES_ = {exact:core.patternMatcher.exact_, glob:core.patternMatcher.glob_, globcontains:core.patternMatcher.globContains_, regex:core.patternMatcher.regexp_, regexi:core.patternMatcher.regexpi_, regexpi:core.patternMatcher.regexpi_, regexp:core.patternMatcher.regexp_};
core.patternMatcher.against = function(a) {
  var b = "glob", c = /^([a-zA-Z-]+):(.*)/.exec(a);
  if (c) {
    var d = c[1], c = c[2];
    core.patternMatcher.KNOWN_STRATEGIES_[d.toLowerCase()] && (b = d.toLowerCase(), a = c);
  }
  d = core.patternMatcher.KNOWN_STRATEGIES_[b];
  if (!d) {
    throw new core.Error("Cannot find pattern matching strategy: " + b);
  }
  "glob" == b ? (0 == a.indexOf("glob:") && (a = a.substring(5)), d = core.patternMatcher.KNOWN_STRATEGIES_.glob) : "exact" == b && 0 == a.indexOf("exact:") && (a = a.substring(6));
  a = goog.partial(d, a);
  a.strategyName = b;
  return a;
};
core.patternMatcher.matches = function(a, b) {
  return core.patternMatcher.against(a)(b);
};
core.text = {};
var SHADOW_DOM_ENABLED = "function" === typeof ShadowRoot;
core.text.getTextContent_ = function(a, b) {
  if (a.style && ("hidden" == a.style.visibility || "none" == a.style.display)) {
    return "";
  }
  if (a.nodeType == goog.dom.NodeType.TEXT) {
    var c = a.data;
    b || (c = c.replace(/\n|\r|\t/g, " "));
    return c.replace(/&nbsp/, " ");
  }
  if (SHADOW_DOM_ENABLED && a.nodeType == goog.dom.NodeType.ELEMENT && null !== a.shadowRoot) {
    return core.text.getTextContent_(a.shadowRoot, b);
  }
  if ((a.nodeType == goog.dom.NodeType.ELEMENT || a.nodeType == goog.dom.NodeType.DOCUMENT_FRAGMENT) && "SCRIPT" != a.nodeName && "STYLE" != a.nodeName) {
    var d = b || "PRE" == a.tagName;
    c = "";
    for (var e = 0; e < a.childNodes.length; e++) {
      var f = a.childNodes.item(e);
      if (f) {
        if (!SHADOW_DOM_ENABLED || "CONTENT" != f.nodeName && "SLOT" != f.nodeName) {
          c += core.text.getTextContent_(f, d);
        } else {
          for (var f = "CONTENT" == f.nodeName ? f.getDistributedNodes() : f.assignedNodes(), g = 0; g < f.length; g++) {
            var h = f[g];
            h && (c += core.text.getTextContent_(h, b));
          }
        }
      }
    }
    if ("P" == a.tagName || "BR" == a.tagName || "HR" == a.tagName || "DIV" == a.tagName) {
      c += "\n";
    }
    c = c.replace(/&nbsp/, " ");
    bot.userAgent.IE && bot.userAgent.isProductVersion(9) && (c = c.replace(/&#100;/, " "));
    return c;
  }
  return "";
};
core.text.normalizeNewlines_ = function(a) {
  return a.replace(/\r\n|\r/g, "\n");
};
core.text.replaceAll_ = function(a, b, c) {
  for (; -1 != a.indexOf(b);) {
    a = a.replace(b, c);
  }
  return a;
};
core.text.normalizeSpaces_ = function(a) {
  a = a.replace(/\ +/g, " ");
  var b = new RegExp(String.fromCharCode(160), "g");
  return goog.userAgent.WEBKIT ? core.text.replaceAll_(a, String.fromCharCode(160), " ") : a.replace(b, " ");
};
core.text.getElementText = function(a) {
  var b = "";
  goog.userAgent.GECKO && "1.8" <= goog.userAgent.VERSION || goog.userAgent.WEBKIT || goog.userAgent.IE ? b = core.text.getTextContent_(a, !1) : a.textContent ? b = a.textContent : a.innerText && (b = a.innerText);
  b = core.text.normalizeNewlines_(b);
  b = core.text.normalizeSpaces_(b);
  return goog.string.trim(b);
};
core.text.getBodyText = function() {
  var a = bot.getWindow().document.body;
  return a ? core.text.getElementText(a) : "";
};
core.text.isTextPresent = function(a) {
  var b = core.text.getBodyText(), c = core.patternMatcher.against(a);
  "glob" == c.strategyName && (0 == a.indexOf("glob:") && (a = a.substring(5)), c = core.patternMatcher.against("globContains:" + a));
  return c(b);
};
core.text.linkLocator = function(a, b) {
  b = (b || goog.dom.getOwnerDocument(bot.getWindow())).getElementsByTagName("a");
  for (var c = 0; c < b.length; c++) {
    var d = b[c], e = core.text.getElementText(d);
    if (core.patternMatcher.matches(a, e)) {
      return d;
    }
  }
  return null;
};
core.text.setCursorPosition = function(a, b) {
  -1 == b && (b = a.value.length);
  a.setSelectionRange ? (a.focus(), a.setSelectionRange(b, b)) : a.createTextRange && (bot.events.fire(a, bot.events.EventType.FOCUS), a = a.createTextRange(), a.collapse(!0), a.moveEnd("character", b), a.moveStart("character", b), a.select());
};
core.LocatorStrategies = {};
core.LocatorStrategies.implicit_ = function(a, b) {
  return goog.string.startsWith(a, "//") ? core.LocatorStrategies.xpath_(a, b) : goog.string.startsWith(a, "document.") ? core.LocatorStrategies.dom_(a, b) : core.LocatorStrategies.identifier_(a, b);
};
core.LocatorStrategies.alt_ = function(a, b) {
  b = b || goog.dom.getOwnerDocument(bot.getWindow());
  return core.locators.elementFindFirstMatchingChild(b, function(b) {
    return b.alt == a;
  });
};
core.LocatorStrategies.class_ = function(a, b) {
  b = b || goog.dom.getOwnerDocument(bot.getWindow());
  return core.locators.elementFindFirstMatchingChild(b, function(b) {
    return b.className == a;
  });
};
core.LocatorStrategies.dom_ = function(a, b) {
  b = null;
  try {
    b = eval(a);
  } catch (c) {
    return null;
  }
  return b ? b : null;
};
core.LocatorStrategies.id_ = function(a, b) {
  return bot.locators.findElement({id:a}, b);
};
core.LocatorStrategies.identifier_ = function(a, b) {
  return core.LocatorStrategies.id(a, b) || core.LocatorStrategies.name(a, b);
};
core.LocatorStrategies.name_ = function(a, b) {
  b = b || goog.dom.getOwnerDocument(bot.getWindow());
  goog.dom.getDomHelper(b);
  b = goog.dom.getElementsByTagNameAndClass("*", null, b);
  a = a.split(" ");
  for (a[0] = "name=" + a[0]; a.length;) {
    var c = a.shift();
    b = core.filters.selectElements(c, b, "value");
  }
  return 0 < b.length ? b[0] : null;
};
core.LocatorStrategies.stored_ = function(a, b) {
  try {
    return bot.inject.cache.getElement(a, b);
  } catch (c) {
    return null;
  }
};
core.LocatorStrategies.xpath_ = function(a, b) {
  var c = goog.string.endsWith(a, "/"), d = {xpath:a};
  try {
    var e = bot.locators.findElement(d, b);
    if (e || !c) {
      return e;
    }
  } catch (f) {
    if (!c) {
      throw f;
    }
  }
  d = {xpath:a.substring(0, a.length - 1)};
  return bot.locators.findElement(d, b);
};
core.LocatorStrategies.alt = core.LocatorStrategies.alt_;
core.LocatorStrategies["class"] = core.LocatorStrategies.class_;
core.LocatorStrategies.dom = core.LocatorStrategies.dom_;
core.LocatorStrategies.id = core.LocatorStrategies.id_;
core.LocatorStrategies.identifier = core.LocatorStrategies.identifier_;
core.LocatorStrategies.implicit = core.LocatorStrategies.implicit_;
core.LocatorStrategies.link = core.text.linkLocator;
core.LocatorStrategies.name = core.LocatorStrategies.name_;
core.LocatorStrategies.stored = core.LocatorStrategies.stored_;
core.LocatorStrategies.xpath = core.LocatorStrategies.xpath_;
core.locators = {};
core.locators.parseLocator_ = function(a) {
  var b = a.match(/^([A-Za-z]+)=.+/);
  if (b) {
    return b = b[1].toLowerCase(), a = a.substring(b.length + 1), {type:b, string:a};
  }
  b = {string:"", type:""};
  b.string = a;
  goog.string.startsWith(a, "//") ? b.type = "xpath" : goog.string.startsWith(a, "document.") ? b.type = "dom" : b.type = "identifier";
  return b;
};
core.locators.addStrategy = function(a, b) {
  core.LocatorStrategies[a] = b;
};
core.locators.findElementBy_ = function(a, b, c) {
  var d = core.LocatorStrategies[a];
  if (!d) {
    throw new core.Error("Unrecognised locator type: '" + a + "'");
  }
  return d.call(null, b, c);
};
core.locators.findElementRecursive_ = function(a, b, c, d) {
  c = core.locators.findElementBy_(a, b, c);
  if (null != c) {
    return c;
  }
  if (!d) {
    return null;
  }
  for (var e = 0; e < d.frames.length; e++) {
    try {
      var f = d.frames[e].document;
    } catch (g) {
    }
    if (f && (c = core.locators.findElementRecursive_(a, b, f, d.frames[e]), null != c)) {
      return c;
    }
  }
  return null;
};
core.locators.findElementOrNull = function(a, b) {
  a = core.locators.parseLocator_(a);
  b = b || bot.getWindow();
  return core.locators.findElementRecursive_(a.type, a.string, b.document, b);
};
core.locators.findElement = function(a, b, c) {
  if (!goog.isString(a)) {
    return a;
  }
  b = c || bot.getWindow();
  b = core.locators.findElementOrNull(a, b);
  if (null == b) {
    throw new core.Error("Element " + a + " not found");
  }
  return b;
};
core.locators.isElementPresent = function(a) {
  return !!core.locators.findElementOrNull(a);
};
core.locators.elementFindFirstMatchingChild = function(a, b) {
  for (var c = a.childNodes.length, d = 0; d < c; d++) {
    var e = a.childNodes[d];
    if (e.nodeType == goog.dom.NodeType.ELEMENT && (b(e) || (e = core.locators.elementFindFirstMatchingChild(e, b)))) {
      return e;
    }
  }
  return null;
};
core.browserbot = {};
core.browserbot.isVisible = function(a) {
  a = core.locators.findElement(a);
  return bot.dom.isShown(a);
};
core.events = {};
core.events.controlKeyDown_ = !1;
core.events.altKeyDown_ = !1;
core.events.metaKeyDown_ = !1;
core.events.shiftKeyDown_ = !1;
var XPCNativeWrapper = XPCNativeWrapper || function(a) {
};
core.events.getEventFactory_ = function(a) {
  var b = "";
  a && (b = a.toUpperCase());
  return (b = bot.events.EventType[b]) ? b : {create:function(b, d) {
    b = goog.dom.getOwnerDocument(b);
    bot.userAgent.IE_DOC_PRE9 && b.createEventObject ? b = b.createEventObject() : (b = b.createEvent("HTMLEvents"), b.initEvent(a, !0, !0));
    return b;
  }, type_:a};
};
core.events.fire = function(a, b) {
  a = core.locators.findElement(a);
  var c = core.events.getEventFactory_(b);
  if (!c) {
    throw Error("Unable to find type for: " + b);
  }
  bot.events.fire(a, c);
};
core.events.parseCoordinates_ = function(a) {
  if (goog.isString(a)) {
    var b = a.split(/,/);
    a = parseInt(b[0], 0);
    b = parseInt(b[1], 0);
    return {x:a, y:b};
  }
  return {x:0, y:0};
};
core.events.fireAt = function(a, b, c) {
  a = core.locators.findElement(a);
  c = core.events.parseCoordinates_(c || "0,0");
  if (goog.userAgent.IE || goog.userAgent.product.CHROME || goog.userAgent.product.FIREFOX && goog.userAgent.product.isVersion(27)) {
    var d = goog.style.getBounds(a);
    c.x += d.left;
    c.y += d.top;
  }
  b = core.events.getEventFactory_(b);
  bot.events.fire(a, b, {clientX:c.x, clientY:c.y, button:0, altKey:!1, ctrlKey:!1, shiftKey:!1, metaKey:!1, relatedTarget:null});
};
core.events.replaceText_ = function(a, b) {
  bot.events.fire(a, bot.events.EventType.FOCUS);
  bot.events.fire(a, bot.events.EventType.SELECT);
  var c = bot.dom.core.getAttribute(a, "maxlength"), d = b;
  null != c && (c = parseInt(c, 0), b.length > c && (d = b.substr(0, c)));
  bot.dom.core.isElement(a, "BODY") ? a.ownerDocument && a.ownerDocument.designMode && "on" == (new String(a.ownerDocument.designMode)).toLowerCase() && (a.innerHTML = d) : goog.userAgent.GECKO && bot.userAgent.FIREFOX_EXTENSION && bot.userAgent.isEngineVersion(8) ? XPCNativeWrapper(a).value = d : a.value = d;
  try {
    bot.events.fire(a, bot.events.EventType.CHANGE);
  } catch (e) {
  }
};
core.events.setValue = function(a, b) {
  if (core.events.controlKeyDown_ || core.events.altKeyDown_ || core.events.metaKeyDown_) {
    throw new core.Error("type not supported immediately after call to controlKeyDown() or altKeyDown() or metaKeyDown()");
  }
  a = core.locators.findElement(a);
  b = core.events.shiftKeyDown_ ? (new String(b)).toUpperCase() : b;
  core.events.replaceText_(a, b);
};
core.firefox = {};
core.firefox.isUsingUnwrapping_ = function() {
  try {
    var a = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULAppInfo);
    return 0 <= Components.classes["@mozilla.org/xpcom/version-comparator;1"].getService(Components.interfaces.nsIVersionComparator).compare(a.version, "4.0");
  } catch (b) {
    return !1;
  }
};
core.firefox.isUsingUnwrapping_ = core.firefox.isUsingUnwrapping_();
core.firefox.unwrap = function(a) {
  if (!core.firefox.isUsingUnwrapping_ || !goog.isDefAndNotNull(a)) {
    return a;
  }
  try {
    if (a.__fxdriver_unwrapped) {
      return a;
    }
  } catch (c) {
    return a;
  }
  if (a.wrappedJSObject) {
    return a.wrappedJSObject.__fxdriver_unwrapped = !0, a.wrappedJSObject;
  }
  try {
    if (a == XPCNativeWrapper(a)) {
      var b = XPCNativeWrapper.unwrap(a), b = b ? b : a;
      b.__fxdriver_unwrapped = !0;
      return b;
    }
  } catch (c) {
  }
  return a;
};
core.text.getText = function(a) {
  a = core.locators.findElement(a);
  return core.text.getElementText(a);
};
core.inject = {};
core.inject.executeScript = function(a, b) {
  a = bot.inject.executeScript(a.script, core.inject.removeElementIdPrefix_(a.args), !1, b || window);
  a = core.inject.addElementIdPrefix_(a);
  return goog.json.serialize(a);
};
core.inject.executeAsyncScript = function(a) {
  var b = !1, c, d = core.inject.removeElementIdPrefix_(a.args);
  d.push(a.script, function(a, b) {
    a = core.inject.unwrapResultValue_(a);
    b(a);
  });
  bot.inject.executeAsyncScript(function() {
    (new Function(arguments[arguments.length - 3])).apply(null, function(a) {
      var b = a[a.length - 1], c = a[a.length - 2];
      Array.prototype.splice.apply(a, [a.length - 3, 3]);
      a.push(function(a) {
        c(a, b);
      });
      return a;
    }(Array.prototype.slice.apply(arguments, [0])));
  }, d, a.timeout, function(a) {
    b = !0;
    c = core.inject.addElementIdPrefix_(a);
    c = goog.json.serialize(c);
  }, !1, selenium.browserbot.getCurrentWindow());
  return {terminationCondition:function() {
    b && (this.result = c);
    return b;
  }};
};
core.inject.unwrapResultValue_ = function(a) {
  switch(goog.typeOf(a)) {
    case "array":
      return goog.array.map(a, core.inject.unwrapResultValue_);
    case "object":
      return bot.dom.core.isElement(a) ? core.firefox.unwrap(a) : goog.object.map(a, core.inject.unwrapResultValue_);
    default:
      return core.firefox.unwrap(a);
  }
};
core.inject.ELEMENT_ID_PREFIX = "stored=";
core.inject.removeElementIdPrefix_ = function(a) {
  if (goog.isArray(a)) {
    return goog.array.map(a, core.inject.removeElementIdPrefix_);
  }
  if (a && goog.isObject(a) && !goog.isFunction(a) && goog.object.containsKey(a, bot.inject.ELEMENT_KEY)) {
    var b = a[bot.inject.ELEMENT_KEY];
    return b.substring(0, core.inject.ELEMENT_ID_PREFIX.length) === core.inject.ELEMENT_ID_PREFIX ? (a[bot.inject.ELEMENT_KEY] = b.substring(core.inject.ELEMENT_ID_PREFIX.length), a) : goog.object.map(a, core.inject.removeElementIdPrefix_);
  }
  return a;
};
core.inject.addElementIdPrefix_ = function(a) {
  return goog.isArray(a) ? goog.array.map(a, core.inject.addElementIdPrefix_) : a && goog.isObject(a) && !goog.isFunction(a) ? goog.object.containsKey(a, bot.inject.ELEMENT_KEY) ? (a[bot.inject.ELEMENT_KEY] = core.inject.ELEMENT_ID_PREFIX + a[bot.inject.ELEMENT_KEY], a) : goog.object.map(a, core.inject.addElementIdPrefix_) : a;
};
core.element = {};
core.element.findAttribute_ = function(a) {
  var b = a.lastIndexOf("@"), c = a.slice(0, b);
  a = a.slice(b + 1);
  c = core.locators.findElement(c);
  return bot.dom.core.getAttribute(c, a);
};
core.element.getAttribute = function(a) {
  var b = core.element.findAttribute_(a);
  if (null == b) {
    throw new core.Error("Could not find element attribute: " + a);
  }
  return b;
};
core.select = {};
core.select.option = {};
core.select.option.createIndexLocator_ = function(a) {
  var b = Number(a);
  if (isNaN(b) || 0 > b) {
    throw new core.Error("Illegal Index: " + a);
  }
  return {findOption:function(a) {
    if (a.options.length <= b) {
      throw new core.Error("Index out of range.  Only " + a.options.length + " options available");
    }
    return a.options[b];
  }, assertSelected:function(a) {
    if (b != a.selectedIndex) {
      throw new core.Error("Selected index (" + a.selectedIndex + ") does not match expected index: " + b);
    }
  }};
};
core.select.option.createTextLocator_ = function(a) {
  var b = core.patternMatcher.against(a);
  return {findOption:function(c) {
    for (var d = 0; d < c.options.length; d++) {
      if (b(c.options[d].text)) {
        return c.options[d];
      }
    }
    throw new core.Error("Option with label '" + a + "' not found");
  }, assertSelected:function(c) {
    c = c.options[c.selectedIndex].text;
    if (!b(c)) {
      throw new core.Error("Expected text (" + a + ") did not match: " + c);
    }
  }};
};
core.select.option.createValueLocator_ = function(a) {
  var b = core.patternMatcher.against(a);
  return {findOption:function(c) {
    for (var d = 0; d < c.options.length; d++) {
      if (b(c.options[d].value)) {
        return c.options[d];
      }
    }
    throw new core.Error("Option with value '" + a + "' not found");
  }, assertSelected:function(c) {
    c = c.options[c.selectedIndex].value;
    if (!b(c)) {
      throw new core.Error("Expected value (" + a + ") did not match: " + c);
    }
  }};
};
core.select.option.createIdLocator_ = function(a) {
  var b = core.patternMatcher.against(a);
  return {findOption:function(c) {
    for (var d = 0; d < c.options.length; d++) {
      if (b(c.options[d].id)) {
        return c.options[d];
      }
    }
    throw new core.Error("Option with id '" + a + "' not found");
  }, assertSelected:function(c) {
    c = c.options[c.selectedIndex].id;
    if (!b(c)) {
      throw new core.Error("Expected id (" + a + ") did not match: " + c);
    }
  }};
};
core.select.option.Locators_ = {id:core.select.option.createIdLocator_, index:core.select.option.createIndexLocator_, label:core.select.option.createTextLocator_, text:core.select.option.createTextLocator_, value:core.select.option.createValueLocator_};
core.select.option.getOptionLocator_ = function(a) {
  var b = "label", c = a;
  if (a = a.match(/^([a-zA-Z]+)=(.*)/)) {
    b = a[1], c = a[2];
  }
  if (a = core.select.option.Locators_[b]) {
    return a(c);
  }
  throw new core.Error("Unknown option locator type: " + b);
};
core.select.findSelect = function(a) {
  a = goog.isString(a) ? core.locators.findElement(a) : a;
  if (goog.isDef(a.options)) {
    return a;
  }
  throw new core.Error("Specified element is not a Select (has no options)");
};
core.select.option.findOption = function(a, b) {
  a = core.select.findSelect(a);
  return core.select.option.getOptionLocator_(b).findOption(a);
};
core.select.findSelectedOptionProperties_ = function(a, b) {
  a = core.select.findSelect(a);
  for (var c = [], d = 0; d < a.options.length; d++) {
    a.options[d].selected && c.push(a.options[d][b]);
  }
  if (0 == c.length) {
    throw new core.Error("No option selected");
  }
  return c;
};
core.select.findSelectedOptionProperty_ = function(a, b) {
  a = core.select.findSelectedOptionProperties_(a, b);
  if (1 < a.length) {
    throw new core.Error("More than one selected option!");
  }
  return a[0];
};
core.select.isSomethingSelected = function(a) {
  a = core.select.findSelect(a);
  for (var b = 0; b < a.options.length; b++) {
    if (a.options[b].selected) {
      return !0;
    }
  }
  return !1;
};
core.select.getSelectedText = function(a) {
  return core.select.findSelectedOptionProperty_(a, "text");
};
core.select.setSelected = function(a, b) {
  a = core.select.findSelect(a);
  b = core.select.option.getOptionLocator_(b).findOption(a);
  bot.dom.core.isSelected(b) || bot.action.click(b);
};

