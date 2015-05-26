'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
    value: true
});
/**
 * Created by Filipe on 12/05/2015.
 */

var _import = require('../lib/Annotations.js');

var Annotations = _interopRequireWildcard(_import);

var _Input = require('../lib/Input.js');

var _Input2 = _interopRequireWildcard(_Input);

var _RethinkDBModel2 = require('../lib/RethinkDBModel.js');

var _RethinkDBModel3 = _interopRequireWildcard(_RethinkDBModel2);

var restaurantInput = new _Input2['default']({
    name: { type: 'string', required: true },
    dateCreated: { type: 'date', 'default': 'now' },
    phone: { type: 'reference', model: 'phone' },
    addresses: { type: 'collection', model: 'address', inverse: 'restaurant' },
    categories: { type: 'manyToMany', model: 'category', inverse: 'restaurants', through: 'categoryRestaurant' }
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
        _sort: ['name', '-address'],
        _page_size: 10
    })(RestaurantModel) || RestaurantModel;
    RestaurantModel = Annotations.Name('restaurant')(RestaurantModel) || RestaurantModel;
    RestaurantModel = Annotations.Input(restaurantInput)(RestaurantModel) || RestaurantModel;
    return RestaurantModel;
})(_RethinkDBModel3['default']);

exports['default'] = RestaurantModel;
module.exports = exports['default'];