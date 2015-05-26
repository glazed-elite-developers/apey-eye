/**
 * Created by Filipe on 16/03/2015.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _Annotations = require("./Annotations");

var Annotations = _interopRequireWildcard(_Annotations);

var MediaType = Annotations.MediaType;

var BaseFormatter = (function () {
    function BaseFormatter() {
        _classCallCheck(this, BaseFormatter);
    }

    _createClass(BaseFormatter, null, [{
        key: "format",
        value: function format(data) {
            throw new Error("Formatters:  .format() must be implemented.");
        }
    }, {
        key: "getMediaType",
        value: function getMediaType() {
            return Annotations.getProperty(this, "mediaType");
        }
    }]);

    return BaseFormatter;
})();

exports.BaseFormatter = BaseFormatter;

var JSONFormat = (function (_BaseFormatter) {
    function JSONFormat() {
        _classCallCheck(this, _JSONFormat);

        if (_BaseFormatter != null) {
            _BaseFormatter.apply(this, arguments);
        }
    }

    _inherits(JSONFormat, _BaseFormatter);

    var _JSONFormat = JSONFormat;

    _createClass(_JSONFormat, null, [{
        key: "format",
        value: function format(data) {
            return JSON.stringify(data);
        }
    }]);

    JSONFormat = MediaType("application/json")(JSONFormat) || JSONFormat;
    return JSONFormat;
})(BaseFormatter);

exports.JSONFormat = JSONFormat;
var FormattersList = [JSONFormat];
exports.FormattersList = FormattersList;