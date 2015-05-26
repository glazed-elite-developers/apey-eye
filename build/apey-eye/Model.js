/**
 * Created by Filipe on 11/03/2015.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _ModelRegisterJs = require('./ModelRegister.js');

var _ModelRegisterJs2 = _interopRequireDefault(_ModelRegisterJs);

var _BaseClassJs = require('./BaseClass.js');

var _BaseClassJs2 = _interopRequireDefault(_BaseClassJs);

var asyncEach = _bluebird2['default'].promisify(_async2['default'].each);

var Model = (function (_BaseClass) {
    function Model() {
        _classCallCheck(this, Model);

        if (_BaseClass != null) {
            _BaseClass.apply(this, arguments);
        }
    }

    _inherits(Model, _BaseClass);

    _createClass(Model, [{
        key: 'save',
        value: _asyncToGenerator(function* (properties) {
            if (yield this.valid()) {
                return yield this.put({ data: this.obj, resourceProperties: properties });
            }
        })
    }], [{
        key: '_serialize',
        value: function _serialize(id, data) {
            var _arguments = arguments;

            var ModelClass = this;

            //let obj = Object.create(ModelClass.prototype);
            //let obj = ModelClass.prototype;
            //let obj;
            //obj = Object.create(ModelClass && ModelClass.prototype, {
            //    constructor: {
            //        value: obj,
            //        enumerable: false,
            //        writable: true,
            //        configurable: true
            //    }
            //});
            ////obj.__proto__ = ModelClass;
            //
            //let asd = function(obj){
            //    if(obj.__proto__.constructor.name === "BaseClass"){
            //        obj.__proto__.__proto__ = undefined;
            //    }
            //    else{
            //        console.log(1)
            //        asd(obj.__proto__);
            //    }
            //
            //};
            //asd(obj);
            //
            //obj.id = id;
            //obj.obj = data;
            //obj.oldObj = _.clone(data);
            //obj.valid = async function (method) {
            //    return await ModelClass.valid(this.obj, method);
            //};
            var obj = {
                id: id,
                obj: data,
                constructor: ModelClass,
                oldObj: _underscore2['default'].clone(data),
                valid: function valid(method) {
                    return ModelClass.valid(this.obj, method);
                },
                save: function save(options) {
                    var method = ModelClass.prototype.save.bind(this);
                    return method(options);
                },
                post: function post(options) {
                    var method = ModelClass.prototype.put.bind(this);
                    return method(options);
                },
                put: function put(options) {
                    var method = ModelClass.prototype.put.bind(this);
                    return method(options);
                },
                patch: function patch(options) {
                    var method = ModelClass.prototype.patch.bind(this);
                    return method(options);
                },
                'delete': function _delete() {
                    var method = ModelClass.prototype['delete'].bind(this);
                    return method();
                }
            };
            if (ModelClass.actions) {
                Object.keys(ModelClass.actions.instance).forEach(function (action) {
                    obj[action] = _asyncToGenerator(function* () {
                        return ModelClass.prototype[action].apply(obj, _arguments);
                    });
                });
            }

            return obj;
        }
    }, {
        key: '_serializeArray',
        value: _asyncToGenerator(function* (listObj, properties) {
            var ModelClass = this,
                serializedArray = [];

            yield asyncEach(listObj, function (item, callback) {
                item = ModelClass._serialize(item.id, item);
                item = ModelClass.processOutput(item, properties).then(function (item) {
                    serializedArray.push(item);
                    callback();
                });
            });

            Object.defineProperty(serializedArray, 'obj', { value: listObj, enumerable: false });
            return serializedArray;
        })
    }, {
        key: 'processRelatedData',
        value: _asyncToGenerator(function* (serializedObj, data, update) {
            var self = this,
                input = this.getInput();

            if (!data || !input) {
                return serializedObj;
            }
            yield asyncEach(Object.keys(input.properties), function (field, callback) {
                self._processRelatedDataAux(input, data, _ModelRegisterJs2['default'], serializedObj, update, field).then(function (item) {
                    callback();
                });
            });
            return serializedObj;
        })
    }, {
        key: '_processRelatedDataAux',
        value: _asyncToGenerator(function* (input, data, ModelRegister, serializedObj, update, field) {
            var _this = this;

            var self = this,
                property = input.properties[field];

            try {
                data[field] = JSON.parse(data[field]);
            } catch (e) {}

            if (property.type === 'reference') {
                if (typeof data[field] === 'object') {
                    var RelatedModelClass = ModelRegister.model(property.model),
                        embeddedObj = yield new RelatedModelClass({ data: data[field] }),
                        _data = {};

                    _data[field] = embeddedObj.id;
                    yield serializedObj.patch({ data: _data });
                }
            } else if (property.type === 'collection') {
                var _iteratorNormalCompletion;

                var _didIteratorError;

                var _iteratorError;

                var _iterator, _step;

                yield* (function* () {
                    var RelatedModelClass = ModelRegister.model(property.model);

                    if (data[field]) {
                        if (update) {
                            var _filter = {};
                            _filter[property.inverse] = serializedObj.id;

                            var relatedList = yield RelatedModelClass.fetch({
                                resourceProperties: {
                                    _filter: _filter
                                }
                            });

                            _iteratorNormalCompletion = true;
                            _didIteratorError = false;
                            _iteratorError = undefined;

                            try {
                                for (_iterator = relatedList[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                    var relatedObj = _step.value;

                                    if (data[field].indexOf(relatedObj.id) === -1) {
                                        relatedObj['delete']();
                                    }
                                }
                            } catch (err) {
                                _didIteratorError = true;
                                _iteratorError = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion && _iterator['return']) {
                                        _iterator['return']();
                                    }
                                } finally {
                                    if (_didIteratorError) {
                                        throw _iteratorError;
                                    }
                                }
                            }
                        }

                        yield asyncEach(data[field], function (related, callback) {
                            self.processCollectionData(related, property, serializedObj, RelatedModelClass).then(function (item) {
                                callback();
                            });
                        });
                    }
                })();
            } else if (property.type === 'manyToMany') {
                if (data[field]) {
                    var _iteratorNormalCompletion2;

                    var _didIteratorError2;

                    var _iteratorError2;

                    var _iterator2, _step2;

                    yield* (function* () {
                        var ThroughModelClass = ModelRegister.model(property.through);

                        if (!ThroughModelClass) {
                            throw new Error('BaseClass: through model \'' + property.through + '\' class for field \'' + field + '\' not exists.');
                        } else {
                            var throughInput = ThroughModelClass.getInput();

                            if (throughInput) {
                                yield* (function* () {

                                    var sourceModelName = _this.getName();
                                    var sourceField = _underscore2['default'].findKey(throughInput.properties, function (obj) {
                                        return obj.model === sourceModelName;
                                    });
                                    var targetField = _underscore2['default'].findKey(throughInput.properties, function (obj) {
                                        return obj.model === property.model;
                                    });

                                    if (update) {
                                        var _filter = {};
                                        _filter[sourceField] = serializedObj.id;
                                        var relationList = yield ThroughModelClass.fetch({
                                            resourceProperties: {
                                                _filter: _filter
                                            }
                                        });
                                        _iteratorNormalCompletion2 = true;
                                        _didIteratorError2 = false;
                                        _iteratorError2 = undefined;

                                        try {
                                            for (_iterator2 = relationList[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                                var elem = _step2.value;

                                                if (data[field].indexOf(elem[targetField]) === -1) {
                                                    elem['delete']();
                                                }
                                            }
                                        } catch (err) {
                                            _didIteratorError2 = true;
                                            _iteratorError2 = err;
                                        } finally {
                                            try {
                                                if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                                                    _iterator2['return']();
                                                }
                                            } finally {
                                                if (_didIteratorError2) {
                                                    throw _iteratorError2;
                                                }
                                            }
                                        }
                                    }

                                    if (data[field]) {
                                        yield asyncEach(data[field], function (target, callback) {
                                            self.PostManyManyData(target, ModelRegister, property, targetField, sourceField, serializedObj, ThroughModelClass).then(function (item) {
                                                callback();
                                            });
                                        });
                                    }
                                })();
                            }
                        }
                    })();
                }
            }
        })
    }, {
        key: 'processCollectionData',
        value: _asyncToGenerator(function* (related, property, serializedObj, RelatedModelClass) {
            if (typeof related === 'object') {
                related[property.inverse] = serializedObj.id;
                yield new RelatedModelClass({ data: related });
            } else if (typeof related === 'string') {

                var relatedObj = yield RelatedModelClass.fetchOne({ id: related });
                if (relatedObj[property.inverse] != serializedObj.id) {
                    var updateData = {};
                    updateData[property.inverse] = serializedObj.id;
                    yield relatedObj.patch({ data: updateData });
                }
            }
        })
    }, {
        key: 'PostManyManyData',
        value: _asyncToGenerator(function* (target, ModelRegister, property, targetField, sourceField, serializedObj, ThroughModelClass) {
            if (typeof target === 'object') {
                var TargetModelClass = ModelRegister.model(property.model);
                var targetObj = yield new TargetModelClass({ data: target });
                target = targetObj.id;

                var newData = {};
                newData[targetField] = target;
                newData[sourceField] = serializedObj.id;

                yield new ThroughModelClass({ data: newData });
            }
        })
    }]);

    return Model;
})(_BaseClassJs2['default']);

exports['default'] = Model;
module.exports = exports['default'];