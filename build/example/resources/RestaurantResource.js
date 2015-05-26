/**
 * Created by Filipe on 12/05/2015.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _apeyEye = require('../../apey-eye');

var _apeyEye2 = _interopRequireDefault(_apeyEye);

var _modelsRestaurantModelJs = require('../models/RestaurantModel.js');

var _modelsRestaurantModelJs2 = _interopRequireDefault(_modelsRestaurantModelJs);

var Annotations = _apeyEye2['default'].Annotations;
var Formatters = _apeyEye2['default'].Formatters;
var GenericResource = _apeyEye2['default'].GenericResource;
var Input = _apeyEye2['default'].Input;

var RestaurantResource = (function (_GenericResource) {
    function RestaurantResource() {
        _classCallCheck(this, _RestaurantResource);

        if (_GenericResource != null) {
            _GenericResource.apply(this, arguments);
        }
    }

    _inherits(RestaurantResource, _GenericResource);

    var _RestaurantResource = RestaurantResource;

    _createDecoratedClass(_RestaurantResource, [{
        key: 'delete',
        decorators: [Annotations.Output({
            _fields: ['id', 'name', 'address', 'phone', 'date'],
            _embedded: ['schedule', 'products']
        }), Annotations.Authentication('basic')],
        value: _asyncToGenerator(function* () {
            return yield _get(Object.getPrototypeOf(_RestaurantResource.prototype), 'delete', this).call(this);
        })
    }, {
        key: 'get_options',
        decorators: [Annotations.Action()],
        value: _asyncToGenerator(function* () {
            return _get(Object.getPrototypeOf(_RestaurantResource.prototype), 'options', this).call(this);
        })
    }, {
        key: 'get_name',
        decorators: [Annotations.Action()],
        value: _asyncToGenerator(function* () {
            var obj = this.obj;
            this.obj = { name: obj.name };
            return this;
        })
    }], [{
        key: 'delete',
        decorators: [Annotations.Format(Formatters.JSONFormat), Annotations.Documentation({
            title: 'Delete',
            description: 'a litte description'
        })],
        value: _asyncToGenerator(function* (options) {
            var obj = { asdasD: 12 };
            return GenericResource._serialize(undefined, obj);
        })
    }, {
        key: 'get_options',
        decorators: [Annotations.Action()],
        value: _asyncToGenerator(function* () {
            return this.options();
        })
    }, {
        key: 'get_name',
        decorators: [Annotations.Action()],
        value: _asyncToGenerator(function* () {
            var obj = { name: 'aeasasd' };
            return this._serialize(undefined, obj);
        })
    }]);

    RestaurantResource = Annotations.Documentation({
        title: 'Restaurant Resource',
        description: 'a big description'
    })(RestaurantResource) || RestaurantResource;
    RestaurantResource = Annotations.Name('Restaurant')(RestaurantResource) || RestaurantResource;
    RestaurantResource = Annotations.Model(_modelsRestaurantModelJs2['default'])(RestaurantResource) || RestaurantResource;
    return RestaurantResource;
})(GenericResource);

exports['default'] = RestaurantResource;
module.exports = exports['default'];

//@Annotations.Format(Formatters.JSONFormat2)
//@Annotations.Authentication('local')
//@Annotations.Roles(['cliente'])
//@Annotations.Methods(["constructor"])