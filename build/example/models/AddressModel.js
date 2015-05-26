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

var addressInput = new Input({
  address: { type: "string", required: true },
  restaurant: { type: "reference", model: "restaurant" }
});

var AddressModel = (function (_RethinkDBModel) {
  function AddressModel() {
    _classCallCheck(this, _AddressModel);

    if (_RethinkDBModel != null) {
      _RethinkDBModel.apply(this, arguments);
    }
  }

  _inherits(AddressModel, _RethinkDBModel);

  var _AddressModel = AddressModel;
  AddressModel = Annotations.Name("address")(AddressModel) || AddressModel;
  AddressModel = Annotations.Input(addressInput)(AddressModel) || AddressModel;
  return AddressModel;
})(RethinkDBModel);

exports["default"] = AddressModel;
module.exports = exports["default"];