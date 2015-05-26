/**
 * Created by Filipe on 04/03/2015.
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _Formatters = require("./Formatters");

var Formartters = _interopRequireWildcard(_Formatters);

var PageSize = 10;
exports.PageSize = PageSize;
var HTTPMethods = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"];
exports.HTTPMethods = HTTPMethods;
var Formatter = Formartters.JSONFormat;
exports.Formatter = Formatter;