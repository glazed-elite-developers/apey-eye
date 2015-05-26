"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Created by Filipe on 04/03/2015.
 */

var _import = require("./Formatters");

var Formartters = _interopRequireWildcard(_import);

var PageSize = 10;
exports.PageSize = PageSize;
var HTTPMethods = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"];
exports.HTTPMethods = HTTPMethods;
var Formatter = Formartters.JSONFormat;
exports.Formatter = Formatter;