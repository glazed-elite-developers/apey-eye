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

var categoryInput = new Input({
  name: { type: "string", required: true },
  restaurants: { type: "manyToMany", model: "restaurant", inverse: "categories", through: "categoryRestaurant" }
});

var CategoryModel = (function (_RethinkDBModel) {
  function CategoryModel() {
    _classCallCheck(this, _CategoryModel);

    if (_RethinkDBModel != null) {
      _RethinkDBModel.apply(this, arguments);
    }
  }

  _inherits(CategoryModel, _RethinkDBModel);

  var _CategoryModel = CategoryModel;
  CategoryModel = Annotations.Name("category")(CategoryModel) || CategoryModel;
  CategoryModel = Annotations.Input(categoryInput)(CategoryModel) || CategoryModel;
  return CategoryModel;
})(RethinkDBModel);

exports["default"] = CategoryModel;
module.exports = exports["default"];