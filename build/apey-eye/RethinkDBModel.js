/**
 * Created by Filipe on 03/03/2015.
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

var _Model2 = require('./Model');

var _Model3 = _interopRequireDefault(_Model2);

var _RethinkDBAdapter = require('./RethinkDBAdapter');

var _RethinkDBAdapter2 = _interopRequireDefault(_RethinkDBAdapter);

var _DefaultProperties = require('./DefaultProperties');

var DefaultProperties = _interopRequireWildcard(_DefaultProperties);

var _Exceptions = require('./Exceptions');

var Exceptions = _interopRequireWildcard(_Exceptions);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var RethinkDBModel = (function (_Model) {
    function RethinkDBModel() {
        var _this = this;

        var options = arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, RethinkDBModel);

        _get(Object.getPrototypeOf(RethinkDBModel.prototype), 'constructor', this).call(this);
        _get(Object.getPrototypeOf(RethinkDBModel.prototype), 'constructor', this).call(this, _asyncToGenerator(function* () {
            var ModelClass = _this.constructor;

            yield ModelClass._checkDataTable(true);
            yield ModelClass.valid(options.data);

            var tableName = ModelClass.getName(),
                properties = ModelClass.joinProperties(options.resourceProperties, ModelClass.post),
                db = new _RethinkDBAdapter2['default'](tableName);

            var obj = yield db.insertObject(options.data, properties);

            obj = ModelClass._serialize(obj.id, obj);
            yield ModelClass.processRelatedData(obj, options.data);
            yield ModelClass.processOutput(obj, properties);
            return obj;
        }));
    }

    _inherits(RethinkDBModel, _Model);

    _createClass(RethinkDBModel, [{
        key: 'put',
        value: _asyncToGenerator(function* () {
            var options = arguments[0] === undefined ? {} : arguments[0];

            var ModelClass = this.constructor,
                tableName = ModelClass.getName(ModelClass.prototype.put),
                properties = ModelClass.joinProperties(options.resourceProperties, ModelClass.prototype.put),
                db = new _RethinkDBAdapter2['default'](tableName);

            yield ModelClass.valid(options.data);

            var newObj = yield db.replaceObject(this.id, options.data, properties);

            this.oldObj = _underscore2['default'].clone(newObj);
            this.obj = newObj;

            yield ModelClass.processRelatedData(this, options.data, true);
            yield ModelClass.processOutput(this, properties);

            return this;
        })
    }, {
        key: 'patch',
        value: _asyncToGenerator(function* () {
            var options = arguments[0] === undefined ? {} : arguments[0];

            var ModelClass = this.constructor,
                tableName = ModelClass.getName(ModelClass.prototype.patch),
                properties = ModelClass.joinProperties(options.resourceProperties, ModelClass.prototype.patch),
                db = new _RethinkDBAdapter2['default'](tableName);

            var obj = yield db.getObject(this.id, properties);
            if (!obj) {
                throw new Exceptions.NotFound(this.id);
            } else {

                var futureData = _underscore2['default'].extend(obj, options.data);

                yield ModelClass.valid(futureData);
                var newObj = yield db.updateObject(this.id, options.data, properties);

                this.oldObj = _underscore2['default'].clone(this.obj);
                this.obj = newObj;
                yield ModelClass.processRelatedData(this, options.data, true);
                yield ModelClass.processOutput(this, properties);

                return this;
            }
        })
    }, {
        key: 'delete',
        value: _asyncToGenerator(function* () {
            var ModelClass = this.constructor,
                tableName = ModelClass.getName(ModelClass.prototype.patch),
                db = new _RethinkDBAdapter2['default'](tableName);

            return yield db.deleteObject(this.id);
        })
    }], [{
        key: 'fetch',
        value: _asyncToGenerator(function* () {
            var options = arguments[0] === undefined ? {} : arguments[0];

            var ModelClass = this,
                tableName = ModelClass.getName(ModelClass.fetch),
                properties = ModelClass.joinProperties(options.resourceProperties, ModelClass.fetch),
                db = new _RethinkDBAdapter2['default'](tableName);

            yield ModelClass._checkDataTable(false);
            var list = yield db.getCollection(properties);

            return yield ModelClass._serializeArray(list, properties);
        })
    }, {
        key: 'fetchOne',
        value: _asyncToGenerator(function* () {
            var options = arguments[0] === undefined ? {} : arguments[0];

            var ModelClass = this,
                tableName = ModelClass.getName(ModelClass.fetchOne),
                properties = ModelClass.joinProperties(options.resourceProperties, ModelClass.fetchOne),
                db = new _RethinkDBAdapter2['default'](tableName);

            yield ModelClass._checkDataTable(false);

            var obj = yield db.getObject(options.id, properties);
            if (!obj) {
                throw new Exceptions.NotFound(options.id);
            } else {
                obj = ModelClass._serialize(options.id, obj);
                yield ModelClass.processOutput(obj, properties);

                return obj;
            }
        })
    }, {
        key: '_checkDataTable',
        value: _asyncToGenerator(function* (create) {
            var ModelClass = this;

            if (!ModelClass.noBackend && !ModelClass.tableCreated) {
                var tableCreated = yield _RethinkDBAdapter2['default'].checkTableExists(this.getName());
                if (!tableCreated) {
                    yield _RethinkDBAdapter2['default'].createTable(this.getName());
                }
                ModelClass.tableCreated = true;
            } else if (ModelClass.noBackend && !ModelClass.tableCreated && create) {
                var tableCreated = yield _RethinkDBAdapter2['default'].checkTableExists(this.getName());
                if (!tableCreated) {
                    yield _RethinkDBAdapter2['default'].createTable(this.getName());
                }
                ModelClass.tableCreated = true;
            } else if (!ModelClass.tableCreated && !create && ModelClass.noBackend) {
                var tableCreated = yield _RethinkDBAdapter2['default'].checkTableExists(this.getName());
                if (!tableCreated) {
                    throw new Exceptions.NotFound();
                }
            }
        })
    }]);

    return RethinkDBModel;
})(_Model3['default']);

exports['default'] = RethinkDBModel;
module.exports = exports['default'];