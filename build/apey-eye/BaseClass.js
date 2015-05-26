/**
 * Created by Filipe on 26/03/2015.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x4, _x5, _x6) { var _again = true; _function: while (_again) { var object = _x4, property = _x5, receiver = _x6; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x4 = parent; _x5 = property; _x6 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _Annotations = require('./Annotations');

var Annotations = _interopRequireWildcard(_Annotations);

var _bluebirdExtended = require('./bluebird-extended');

var _bluebirdExtended2 = _interopRequireDefault(_bluebirdExtended);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _ModelRegisterJs = require('./ModelRegister.js');

var _ModelRegisterJs2 = _interopRequireDefault(_ModelRegisterJs);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var asyncEach = _bluebird2['default'].promisify(_async2['default'].each);

var BaseClass = (function (_BluebirdExtended) {
    function BaseClass(executor) {
        _classCallCheck(this, BaseClass);

        _get(Object.getPrototypeOf(BaseClass.prototype), 'constructor', this).call(this);
        var Class = this;
        _get(Object.getPrototypeOf(BaseClass.prototype), 'constructor', this).call(this, function () {
            try {
                var method = executor.bind(Class);
                return method().then(function (obj) {
                    return Promise.resolve(obj);
                })['catch'](function (error) {
                    return Promise.reject(error);
                });
            } catch (err) {
                return Promise.reject(err);
            }
        });
    }

    _inherits(BaseClass, _BluebirdExtended);

    _createClass(BaseClass, null, [{
        key: 'getProperties',
        value: function getProperties() {
            var method = arguments[0] === undefined ? undefined : arguments[0];

            var outputProperties = this.getOutput(method) || {};
            var queryProperties = this.getQuery(method) || {};

            return _underscore2['default'].clone(_underscore2['default'].extend(outputProperties, queryProperties));
        }
    }, {
        key: 'joinProperties',
        value: function joinProperties() {
            var resourceProperties = arguments[0] === undefined ? {} : arguments[0];
            var method = arguments[1] === undefined ? undefined : arguments[1];

            var outputProperties = this.getOutput(method) || {};
            var queryProperties = this.getQuery(method) || {};

            var resultProperties = _underscore2['default'].clone(_underscore2['default'].extend(outputProperties, queryProperties));

            if (resourceProperties._sort) {
                resultProperties._sort = resourceProperties._sort;
            }

            if (resultProperties._filter != undefined && resourceProperties._filter != undefined) {
                resultProperties._filter = _underscore2['default'].extend(resourceProperties._filter, resultProperties._filter);
            } else if (resourceProperties._filter != undefined) {
                resultProperties._filter = resourceProperties._filter;
            }

            if (resultProperties._page_size != undefined && resourceProperties._pagination && resourceProperties._pagination._page_size != undefined) {
                resultProperties._pagination = { _page_size: _underscore2['default'].min([resultProperties._page_size, resourceProperties._pagination.page_size]) };
            } else if (resourceProperties._pagination != undefined && resourceProperties._pagination._page_size != undefined) {
                resultProperties._pagination = { _page_size: resourceProperties._pagination._page_size };
            } else {
                resultProperties._pagination = { _page_size: resultProperties._page_size };
            }

            if (resourceProperties._pagination && resourceProperties._pagination._page) {
                resultProperties._pagination._page = resourceProperties._pagination._page;
            } else {
                resultProperties._pagination._page = 1;
            }

            if (resultProperties._fields != undefined && resourceProperties._fields != undefined) {
                resultProperties._fields = _underscore2['default'].intersection(resultProperties._fields, resourceProperties._fields);
            } else if (resourceProperties._fields != undefined) {
                resultProperties._fields = resourceProperties._fields;
            }

            if (resultProperties._embedded != undefined && resourceProperties._embedded != undefined) {
                resultProperties._embedded = _underscore2['default'].intersection(resultProperties._embedded, resourceProperties._embedded);
            } else if (resourceProperties._embedded != undefined) {
                resultProperties._embedded = resourceProperties._embedded;
            }

            return resultProperties;
        }
    }, {
        key: 'getName',
        value: function getName(method) {
            return Annotations.getProperty(this, 'name', method);
        }
    }, {
        key: 'getInput',
        value: function getInput(method) {
            return Annotations.getProperty(this, 'input', method);
        }
    }, {
        key: 'getOutput',
        value: function getOutput(method) {
            return Annotations.getProperty(this, 'output', method);
        }
    }, {
        key: 'getQuery',
        value: function getQuery(method) {
            return Annotations.getProperty(this, 'query', method);
        }
    }, {
        key: 'valid',
        value: _asyncToGenerator(function* (data, method) {
            var input = this.getInput(method);
            if (input) {
                return yield input.valid(data);
            } else {
                return true;
            }
        })
    }, {
        key: 'processOutput',
        value: _asyncToGenerator(function* (obj, properties) {
            obj = this.selectFields(obj, properties._fields);
            obj = yield this.processRelations(obj, properties._embedded, properties._fields);

            return obj;
        })
    }, {
        key: 'selectFields',
        value: function selectFields(serializedObj, fields) {
            if (fields) {
                serializedObj.obj = _underscore2['default'].pick(serializedObj.obj, fields);
            }
            return serializedObj;
        }
    }, {
        key: 'processRelations',
        value: _asyncToGenerator(function* (serializedObj, embeddedFields, showFields) {
            var self = this,
                input = self.getInput();

            if (!input) {
                return serializedObj;
            }
            var keys = Object.keys(input.properties);
            if (showFields && showFields.length > 0) {
                keys = _underscore2['default'].intersection(keys, showFields);
            }

            yield asyncEach(keys, function (field, callback) {
                self.processRelationsAux(input, field, serializedObj, embeddedFields).then(function (item) {
                    callback();
                })['catch'](function (error) {
                    console.error(error.stack);
                    callback();
                });
            });

            return serializedObj;
        })
    }, {
        key: 'processRelationsAux',
        value: _asyncToGenerator(function* (input, field, serializedObj, embeddedFields) {
            var _this = this;

            var property = input.properties[field];
            if (property.type === 'reference') {
                if (serializedObj.obj[field]) {

                    if (embeddedFields && embeddedFields.indexOf(field) > -1) {
                        var RelatedModelClass = _ModelRegisterJs2['default'].model(property.model),
                            embeddedObj = yield RelatedModelClass.fetchOne({ id: serializedObj.obj[field] });

                        serializedObj.obj[field] = embeddedObj.obj;
                    }
                }
            } else if (property.type === 'collection') {
                var RelatedModelClass = _ModelRegisterJs2['default'].model(property.model),
                    _filter = {};
                _filter[property.inverse] = serializedObj.id;
                var embeddedObj = yield RelatedModelClass.fetch({
                    resourceProperties: {
                        _filter: _filter
                    }
                });

                if (embeddedFields && embeddedFields.indexOf(field) > -1) {
                    serializedObj.obj[field] = embeddedObj.obj;
                } else {
                    serializedObj.obj[field] = _underscore2['default'].reduce(embeddedObj, function (memo, elem) {
                        return memo.concat(elem.id);
                    }, []);
                }
            } else if (property.type === 'manyToMany') {
                var ThroughModelClass = _ModelRegisterJs2['default'].model(property.through);

                if (!ThroughModelClass) {
                    throw new Error('BaseClass: through model \'' + property.through + '\' class for field \'' + field + '\' not exists.');
                } else {
                    yield* (function* () {
                        var throughInput = ThroughModelClass.getInput();

                        var sourceModelName = _this.getName();
                        var sourceField = _underscore2['default'].findKey(throughInput.properties, function (obj) {
                            return obj.model === sourceModelName;
                        });

                        var targetField = _underscore2['default'].findKey(throughInput.properties, function (obj) {
                            return obj.model === property.model;
                        });

                        var _filter = {},
                            _embedded = [targetField];
                        _filter[sourceField] = serializedObj.id;

                        var embeddedObjList = undefined;
                        if (embeddedFields && embeddedFields.indexOf(field) > -1) {
                            embeddedObjList = yield ThroughModelClass.fetch({
                                resourceProperties: {
                                    _filter: _filter,
                                    _embedded: _embedded
                                }
                            });
                        } else {
                            embeddedObjList = yield ThroughModelClass.fetch({
                                resourceProperties: {
                                    _filter: _filter
                                }
                            });
                        }
                        if (embeddedObjList) {
                            serializedObj.obj[field] = _underscore2['default'].uniq(_underscore2['default'].reduce(embeddedObjList, function (memo, elem) {
                                return memo.concat(elem.obj[targetField]);
                            }, []));
                        } else {
                            serializedObj.obj[field] = undefined;
                        }
                    })();
                }
            }
        })
    }]);

    return BaseClass;
})(_bluebirdExtended2['default']);

exports['default'] = BaseClass;
module.exports = exports['default'];