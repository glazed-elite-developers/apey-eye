/**
 * Created by Filipe on 02/03/2015.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _BaseClass2 = require('./BaseClass');

var _BaseClass3 = _interopRequireDefault(_BaseClass2);

var _Annotations = require('./Annotations');

var Annotations = _interopRequireWildcard(_Annotations);

var _ExceptionsJs = require('./Exceptions.js');

var Exceptions = _interopRequireWildcard(_ExceptionsJs);

var _DefaultPropertiesJs = require('./DefaultProperties.js');

var DefaultProperties = _interopRequireWildcard(_DefaultPropertiesJs);

var _FormattersJs = require('./Formatters.js');

var Formatters = _interopRequireWildcard(_FormattersJs);

var _RethinkDBModel3 = require('./RethinkDBModel');

var _RethinkDBModel4 = _interopRequireDefault(_RethinkDBModel3);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _ModelRegisterJs = require('./ModelRegister.js');

var _ModelRegisterJs2 = _interopRequireDefault(_ModelRegisterJs);

var Resource = (function (_BaseClass) {
    function Resource() {
        _classCallCheck(this, Resource);

        if (_BaseClass != null) {
            _BaseClass.apply(this, arguments);
        }
    }

    _inherits(Resource, _BaseClass);

    _createClass(Resource, [{
        key: 'options',
        value: function options() {

            var ResourceClass = this.constructor,
                options = ResourceClass._options('instance');

            return ResourceClass._serialize(undefined, options);
        }
    }, {
        key: 'render',
        value: function render() {
            var requestProperties = arguments[0] === undefined ? {} : arguments[0];

            var ResourceClass = this.constructor,
                FormatNegotiator = require('./FormatNegotiator'),
                ResourceFormatter = ResourceClass.getFormat(),
                FormatClass;

            if (ResourceFormatter) {
                FormatClass = ResourceFormatter;
            } else {
                FormatClass = FormatNegotiator.selectFormatter(requestProperties);
            }

            return {
                type: FormatClass.getMediaType(),
                data: FormatClass.format(this.obj)
            };
        }
    }], [{
        key: 'HTTPResourceMethods',
        value: {
            collection: {
                post: { method: 'constructor', 'static': true },
                get: { method: 'fetch', 'static': true },
                put: { method: 'put', 'static': true },
                patch: { method: 'patch', 'static': true },
                'delete': { method: 'delete', 'static': true },
                options: { method: 'options', 'static': true }
            },
            instance: {
                post: { method: 'post' },
                get: { method: 'fetchOne', 'static': true },
                put: { method: 'put' },
                patch: { method: 'patch' },
                'delete': { method: 'delete' },
                options: { method: 'options' }
            }
        },
        enumerable: true
    }, {
        key: 'options',
        value: function options() {

            var ResourceClass = this,
                options = ResourceClass._options('collection');

            return ResourceClass._serialize(undefined, options);
        }
    }, {
        key: '_options',
        value: function _options(pathType) {
            var _this = this;

            var ResourceClass = this,
                httpMethods = DefaultProperties.HTTPMethods,
                options = {
                collection: {
                    query: ResourceClass.getQuery(),
                    output: ResourceClass.getOutput(),
                    input: ResourceClass.getInput(),
                    allowed_roles: ResourceClass.getAllowedRoles(),
                    auth: ResourceClass.getAuthentication(),
                    documentation: ResourceClass.getDocumentation(),
                    formatters: ResourceClass.getFormat() && [ResourceClass.getFormat().getMediaType()] || _underscore2['default'].reduce(Formatters.FormattersList, function (memo, elem) {
                        return memo.concat(elem.getMediaType());
                    }, [])
                },
                methods: [],
                actions: {}
            };

            httpMethods.forEach(function (httpMethod) {
                var resourceMethod = ResourceClass.getResourceMethod(pathType, httpMethod);
                if (resourceMethod) {

                    var resourceMethodProperties = Resource.HTTPResourceMethods[pathType][httpMethod.toLowerCase()];
                    try {
                        if (Resource.allowedMethod.call(_this, resourceMethodProperties)) {
                            var methodOptions = {
                                http_method: httpMethod.toUpperCase(),
                                query: ResourceClass.getQuery.call(resourceMethod),
                                output: ResourceClass.getOutput.call(resourceMethod),
                                input: ResourceClass.getInput.call(resourceMethod),
                                allowed_roles: ResourceClass.getAllowedRoles.call(resourceMethod),
                                auth: ResourceClass.getAuthentication.call(resourceMethod),
                                documentation: ResourceClass.getDocumentation.call(resourceMethod),
                                formatters: ResourceClass.getFormat.call(resourceMethod) && [ResourceClass.getFormat.call(resourceMethod).getMediaType()]
                            };
                            options.methods.push(methodOptions);
                        }
                    } catch (e) {}
                }
            });

            Object.keys(ResourceClass.actions[pathType]).forEach(function (action) {

                var i = action.indexOf('_');
                var method = action.substr(0, i);
                var actionName = action.substr(i + 1);

                if (method && actionName) {
                    options.actions[actionName] = {
                        http_method: method.toUpperCase(),
                        path: '/' + actionName
                    };
                }
            });

            return options;
        }
    }, {
        key: '_serialize',
        value: function _serialize(id, data) {
            var _arguments = arguments;

            var ResourceClass = this;
            var obj = {
                id: id,
                obj: data,
                constructor: ResourceClass,
                put: function put(options) {
                    var method = ResourceClass.prototype.put.bind(this);
                    return method(options);
                },
                patch: function patch(options) {
                    var method = ResourceClass.prototype.patch.bind(this);
                    return method(options);
                },
                post: function post(options) {
                    var method = ResourceClass.prototype.post.bind(this);
                    return method(options);
                },
                options: function options(_options) {
                    var method = ResourceClass.prototype.options.bind(this);
                    return method(_options);
                },
                'delete': function _delete() {
                    var method = ResourceClass.prototype['delete'].bind(this);
                    return method();
                },
                render: function render() {
                    var method = ResourceClass.prototype.render.bind(this);
                    return method();
                }
            };
            if (ResourceClass.actions) {
                Object.keys(ResourceClass.actions.instance).forEach(function (action) {
                    obj[action] = _asyncToGenerator(function* () {
                        return ResourceClass.prototype[action].apply(obj, _arguments);
                    });
                });
            }

            return obj;
        }
    }, {
        key: '_serializeArray',
        value: function _serializeArray(listObj) {
            var ResourceClass = this;

            var serializedArray = [];
            listObj.forEach(function (item) {
                item = ResourceClass._serialize(item.id, item.obj);
                //item.obj = ResourceClass.selectFields(item.obj, properties._fields);
                serializedArray.push(item);
            });

            var renderMethod = ResourceClass.prototype.render.bind(serializedArray);
            var listData = _underscore2['default'].reduce(listObj, function (memo, elem) {
                return memo.concat(elem.obj);
            }, []);

            Object.defineProperty(serializedArray, 'obj', { value: listData, enumerable: false });
            Object.defineProperty(serializedArray, 'render', { value: renderMethod, enumerable: false });
            Object.defineProperty(serializedArray, 'constructor', { value: ResourceClass, enumerable: false });

            return serializedArray;
        }
    }, {
        key: 'getMethods',
        value: function getMethods() {
            return Annotations.getProperty(this, 'methods');
        }
    }, {
        key: 'getFormat',
        value: function getFormat() {
            return Annotations.getProperty(this, 'format');
        }
    }, {
        key: 'getAuthentication',
        value: function getAuthentication(method) {
            return Annotations.getProperty(this, 'authentication', method);
        }
    }, {
        key: 'getAllowedRoles',
        value: function getAllowedRoles(method) {
            return Annotations.getProperty(this, 'roles', method);
        }
    }, {
        key: 'getModel',
        value: function getModel(method) {
            return Annotations.getProperty(this, 'model', method);
        }
    }, {
        key: 'getDocumentation',
        value: function getDocumentation(method) {
            return Annotations.getProperty(this, 'documentation', method);
        }
    }, {
        key: '_getActionMethod',
        value: function _getActionMethod(options) {
            var ResourceClass = this;
            if (ResourceClass.actions) {
                if (options.pathType === 'instance_action') {
                    var actionMethod = '' + options.method + '_' + options.action;

                    for (var key in ResourceClass.actions.instance) {
                        if (typeof ResourceClass.prototype[key] === 'function') {
                            if (key.toLowerCase() === actionMethod.toLowerCase()) {
                                return key;
                            }
                        }
                    }
                    throw new Exceptions.NotFound(options.action);
                } else if (options.pathType === 'instance') {
                    var actionMethod = '' + options.method + '_' + options.id;
                    for (var key in ResourceClass.actions.collection) {
                        if (typeof ResourceClass[key] === 'function') {
                            if (key.toLowerCase() === actionMethod.toLowerCase()) {
                                options.action = options.id;
                                delete options.id;
                                return key;
                            }
                        }
                    }
                }
                return false;
            } else {
                return false;
            }
        }
    }, {
        key: 'getResourceMethod',
        value: function getResourceMethod(pathType, httpMethod) {
            var methodProperties = Resource.HTTPResourceMethods[pathType][httpMethod.toLowerCase()],
                resourceMethod;
            if (methodProperties) {
                if (methodProperties['static']) {
                    if (methodProperties.method === 'constructor') {
                        resourceMethod = this;
                    } else {
                        resourceMethod = this[methodProperties.method];
                    }
                } else {
                    resourceMethod = this.prototype[methodProperties.method];
                }
            }
            return resourceMethod;
        }
    }, {
        key: 'allowedMethod',
        value: function allowedMethod(resourceMethodProperties) {
            var allowedMethods = this.getMethods();
            if (resourceMethodProperties.method === 'options') {
                return true;
            } else {
                if (resourceMethodProperties) {
                    var methodDescriptor = undefined;
                    if (resourceMethodProperties.method === 'constructor') {
                        methodDescriptor = resourceMethodProperties.method;
                    } else {
                        methodDescriptor = '';
                        if (resourceMethodProperties['static']) {
                            methodDescriptor = methodDescriptor.concat('static.');
                        }
                        methodDescriptor = methodDescriptor.concat(resourceMethodProperties.method);
                    }

                    if (!allowedMethods || allowedMethods && allowedMethods.indexOf(methodDescriptor) > -1) {
                        if (resourceMethodProperties['static']) {
                            if (resourceMethodProperties.method === 'constructor') {
                                return true;
                            } else {
                                if (this[resourceMethodProperties.method]) {
                                    return true;
                                }
                            }
                        } else {
                            if (this.prototype[resourceMethodProperties.method]) {
                                return true;
                            }
                        }
                        throw new Exceptions.NotImplemented();
                    } else {
                        throw new Exceptions.MethodNotAllowed();
                    }
                } else {
                    throw new Exceptions.MethodNotAllowed();
                }
            }
        }
    }, {
        key: '_handleRequest',
        value: _asyncToGenerator(function* (options) {
            var ResourceClass = this,
                actionMethod = ResourceClass._getActionMethod(options);
            if (actionMethod) {
                if (options.pathType === 'instance_action') {
                    var obj = yield ResourceClass.fetchOne({ id: options.id });
                    return obj[actionMethod]({ data: options.data, requestProperties: options.requestProperties });
                } else if (options.pathType === 'instance') {
                    return ResourceClass[actionMethod]({ data: options.data, requestProperties: options.requestProperties });
                }
            }

            var resourceMethodProperties = Resource.HTTPResourceMethods[options.pathType][options.method.toLowerCase()];
            if (this.allowedMethod(resourceMethodProperties)) {

                if (resourceMethodProperties['static']) {
                    if (resourceMethodProperties.method === 'constructor') {
                        return new ResourceClass({ data: options.data, requestProperties: options.requestProperties });
                    } else {
                        if (ResourceClass[resourceMethodProperties.method]) {
                            return ResourceClass[resourceMethodProperties.method]({
                                id: options.id,
                                requestProperties: options.requestProperties
                            });
                        }
                    }
                } else {
                    if (ResourceClass.prototype[resourceMethodProperties.method]) {
                        var obj = yield ResourceClass.fetchOne({ id: options.id });
                        return obj[resourceMethodProperties.method]({
                            data: options.data,
                            requestProperties: options.requestProperties
                        });
                    }
                }
                throw new Exceptions.NotImplemented();
            } else {
                throw new Exceptions.MethodNotAllowed();
            }
        })
    }, {
        key: 'checkModel',
        value: function checkModel(method) {
            var ResourceClass = this;
            var ModelClass = ResourceClass.getModel(method);

            if (!ModelClass) {
                var resourceName = ResourceClass.getName();
                if (resourceName) {
                    ResourceClass._appendNewModel(resourceName, ResourceClass.noBackend);
                } else {
                    throw new Error('GenericResource: Resource must have a name to allow automatic creation of a Model class.');
                }
            }
        }
    }, {
        key: '_appendNewModel',
        value: function _appendNewModel(resourceName, noBackend) {
            var ResourceClass = this;

            var ModelRegistered = _ModelRegisterJs2['default'].model(resourceName);
            if (ModelRegistered) {
                ResourceClass.annotations.model = ModelRegistered;
            } else {
                (function () {
                    var input = ResourceClass.getInput(),
                        generatedModel = undefined;

                    if (input) {
                        (function () {
                            var GeneratedModel = (function (_RethinkDBModel) {
                                function GeneratedModel() {
                                    _classCallCheck(this, _GeneratedModel);

                                    if (_RethinkDBModel != null) {
                                        _RethinkDBModel.apply(this, arguments);
                                    }
                                }

                                _inherits(GeneratedModel, _RethinkDBModel);

                                var _GeneratedModel = GeneratedModel;
                                GeneratedModel = Annotations.Input(input)(GeneratedModel) || GeneratedModel;
                                GeneratedModel = Annotations.Name(resourceName)(GeneratedModel) || GeneratedModel;
                                return GeneratedModel;
                            })(_RethinkDBModel4['default']);

                            generatedModel = GeneratedModel;
                        })();
                    } else {
                        (function () {
                            var GeneratedModel = (function (_RethinkDBModel2) {
                                function GeneratedModel() {
                                    _classCallCheck(this, _GeneratedModel2);

                                    if (_RethinkDBModel2 != null) {
                                        _RethinkDBModel2.apply(this, arguments);
                                    }
                                }

                                _inherits(GeneratedModel, _RethinkDBModel2);

                                var _GeneratedModel2 = GeneratedModel;
                                GeneratedModel = Annotations.Name(resourceName)(GeneratedModel) || GeneratedModel;
                                return GeneratedModel;
                            })(_RethinkDBModel4['default']);

                            generatedModel = GeneratedModel;
                        })();
                    }

                    generatedModel.noBackend = noBackend;

                    ResourceClass.annotations.model = generatedModel;
                })();
            }
        }
    }]);

    return Resource;
})(_BaseClass3['default']);

exports['default'] = Resource;
module.exports = exports['default'];