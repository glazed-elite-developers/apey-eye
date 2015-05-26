/**
 * Created by Filipe on 12/05/2015.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _apeyEye = require("../../apey-eye");

var _apeyEye2 = _interopRequireDefault(_apeyEye);

var Annotations = _apeyEye2["default"].Annotations;
var Input = _apeyEye2["default"].Input;
var RethinkDBModel = _apeyEye2["default"].RethinkDBModel;

var phonesInput = new Input({
  phone: { type: "string", required: true }
});

var PhoneModel = (function (_RethinkDBModel) {
  function PhoneModel() {
    _classCallCheck(this, _PhoneModel);

    if (_RethinkDBModel != null) {
      _RethinkDBModel.apply(this, arguments);
    }
  }

  _inherits(PhoneModel, _RethinkDBModel);

  var _PhoneModel = PhoneModel;
  PhoneModel = Annotations.Name("phone")(PhoneModel) || PhoneModel;
  PhoneModel = Annotations.Input(phonesInput)(PhoneModel) || PhoneModel;
  return PhoneModel;
})(RethinkDBModel);

exports["default"] = PhoneModel;
module.exports = exports["default"];