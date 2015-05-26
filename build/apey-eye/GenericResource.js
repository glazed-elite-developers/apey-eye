/**
 * Created by Filipe on 02/03/2015.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x6, _x7, _x8) { var _again = true; _function: while (_again) { var object = _x6, property = _x7, receiver = _x8; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x6 = parent; _x7 = property; _x8 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _Resource2 = require('./Resource');

var _Resource3 = _interopRequireDefault(_Resource2);

var _Annotations = require('./Annotations');

var Annotations = _interopRequireWildcard(_Annotations);

var _DefaultProperties = require('./DefaultProperties');

var DefaultProperties = _interopRequireWildcard(_DefaultProperties);

var _Exceptions = require('./Exceptions');

var Exceptions = _interopRequireWildcard(_Exceptions);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var GenericResource = (function (_Resource) {
    function GenericResource() {
        var _this = this;

        var options = arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, GenericResource);

        _get(Object.getPrototypeOf(GenericResource.prototype), 'constructor', this).call(this);
        _get(Object.getPrototypeOf(GenericResource.prototype), 'constructor', this).call(this, _asyncToGenerator(function* () {
            console.log('asd');
            var ResourceClass = _this.constructor;

            ResourceClass.checkModel();

            var properties = ResourceClass.joinProperties(options.requestProperties, ResourceClass.post),
                modelClass = ResourceClass.getModel(ResourceClass.post);

            if (!options.data) {
                options.data = {};
            }
            yield ResourceClass.valid(options.data);

            if (modelClass) {
                var modelObj = yield new modelClass({ data: options.data, resourceProperties: properties });
                return ResourceClass._serialize(modelObj.id, modelObj.obj);
            } else {
                throw new Exceptions.ModelNotFound(ResourceClass.name);
            }
        }));
    }

    _inherits(GenericResource, _Resource);

    _createClass(GenericResource, [{
        key: 'put',
        value: _asyncToGenerator(function* () {
            var options = arguments[0] === undefined ? {} : arguments[0];

            var self = this,
                ResourceClass = this.constructor,
                modelClass = ResourceClass.getModel(ResourceClass.fetch),
                properties = ResourceClass.joinProperties(options.requestProperties, ResourceClass.fetch);

            if (modelClass) {
                yield ResourceClass.valid(options.data, ResourceClass.prototype.put);

                var modelObj = yield modelClass.fetchOne({ id: self.id, resourceProperties: properties });
                modelObj = yield modelObj.put({ data: options.data, resourceProperties: properties });
                self.obj = modelObj.obj;
                return self;
            } else {
                throw new Exceptions.ModelNotFound(ResourceClass.name);
            }
        })
    }, {
        key: 'patch',
        value: _asyncToGenerator(function* () {
            var options = arguments[0] === undefined ? {} : arguments[0];

            var self = this,
                ResourceClass = this.constructor,
                modelClass = ResourceClass.getModel(ResourceClass.fetch),
                properties = ResourceClass.joinProperties(options.requestProperties, ResourceClass.fetch);

            if (modelClass) {
                var modelObj = yield modelClass.fetchOne({ id: self.id, resourceProperties: properties });
                var futureData = _underscore2['default'].extend(modelObj.obj, options.data);
                yield ResourceClass.valid(futureData, ResourceClass.prototype.patch);

                modelObj = yield modelObj.patch({ data: options.data, resourceProperties: properties });
                self.obj = modelObj.obj;
                return self;
            } else {
                throw new Exceptions.ModelNotFound(ResourceClass.name);
            }
        })
    }, {
        key: 'delete',
        value: _asyncToGenerator(function* () {
            var self = this,
                ResourceClass = this.constructor,
                modelClass = ResourceClass.getModel(ResourceClass.fetch);

            if (modelClass) {
                var modelObj = yield modelClass.fetchOne({ id: self.id });
                return yield modelObj['delete']();
            } else {
                throw new Exceptions.ModelNotFound(ResourceClass.name);
            }
        })
    }], [{
        key: 'fetch',
        value: _asyncToGenerator(function* () {
            var options = arguments[0] === undefined ? {} : arguments[0];

            var ResourceClass = this;

            ResourceClass.checkModel();
            var modelClass = ResourceClass.getModel(ResourceClass.fetch),
                properties = ResourceClass.joinProperties(options.requestProperties, ResourceClass.fetch);

            if (modelClass) {
                var modelObj = yield modelClass.fetch({ resourceProperties: properties });
                return ResourceClass._serializeArray(modelObj, properties);
            } else {
                throw new Exceptions.ModelNotFound(ResourceClass.name);
            }
        })
    }, {
        key: 'fetchOne',
        value: _asyncToGenerator(function* () {
            var options = arguments[0] === undefined ? {} : arguments[0];

            var ResourceClass = this;

            ResourceClass.checkModel();

            var modelClass = ResourceClass.getModel(ResourceClass.fetch),
                properties = ResourceClass.joinProperties(options.requestProperties, ResourceClass.fetch);

            if (modelClass) {
                var modelObj = yield modelClass.fetchOne({ id: options.id, resourceProperties: properties });
                return ResourceClass._serialize(modelObj.id, modelObj.obj);
            } else {
                throw new Exceptions.ModelNotFound(ResourceClass.name);
            }
        })
    }]);

    return GenericResource;
})(_Resource3['default']);

exports['default'] = GenericResource;
module.exports = exports['default'];