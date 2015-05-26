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

var restaurantInput = new Input({
    name: { type: "string", required: true },
    dateCreated: { type: "date", "default": "now" },
    phone: { type: "reference", model: "phone" },
    addresses: { type: "collection", model: "address", inverse: "restaurant" },
    categories: { type: "manyToMany", model: "category", inverse: "restaurants", through: "categoryRestaurant" }
});

var RestaurantModel = (function (_RethinkDBModel) {
    function RestaurantModel() {
        _classCallCheck(this, _RestaurantModel);

        if (_RethinkDBModel != null) {
            _RethinkDBModel.apply(this, arguments);
        }
    }

    _inherits(RestaurantModel, _RethinkDBModel);

    var _RestaurantModel = RestaurantModel;
    RestaurantModel = Annotations.Query({
        _sort: ["name", "-address"],
        _page_size: 10
    })(RestaurantModel) || RestaurantModel;
    RestaurantModel = Annotations.Name("restaurant")(RestaurantModel) || RestaurantModel;
    RestaurantModel = Annotations.Input(restaurantInput)(RestaurantModel) || RestaurantModel;
    return RestaurantModel;
})(RethinkDBModel);

exports["default"] = RestaurantModel;
module.exports = exports["default"];