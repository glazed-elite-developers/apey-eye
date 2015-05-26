'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _asyncToGenerator = function (fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
    value: true
});
/**
 * Created by Filipe on 16/04/2015.
 */

var _import = require('./Exceptions.js');

var Exceptions = _interopRequireWildcard(_import);

var _Resource = require('./Resource.js');

var _Resource2 = _interopRequireWildcard(_Resource);

var _GenericResource2 = require('./GenericResource.js');

var _GenericResource3 = _interopRequireWildcard(_GenericResource2);

var _import2 = require('./Annotations.js');

var Annotations = _interopRequireWildcard(_import2);

var _RoleModel = require('./models/RoleModel.js');

var _RoleModel2 = _interopRequireWildcard(_RoleModel);

var _RouterConfig = require('../config/router.js');

var _RouterConfig2 = _interopRequireWildcard(_RouterConfig);

var BaseRouter = (function () {
    function BaseRouter() {
        _classCallCheck(this, BaseRouter);
    }

    _createClass(BaseRouter, [{
        key: 'register',
        value: function register(entries) {
            var _this = this;

            if (entries) {
                entries.forEach(function (entry) {
                    if (entry.resource && entry.resource.prototype instanceof _Resource2['default']) {

                        var obj = {
                            path: entry.path || entry.resource.getName(),
                            resource: entry.resource
                        };
                        var resourceName = BaseRouter.resourceName(obj.path);
                        if (resourceName) {
                            if (!_this.entries[resourceName]) {
                                _this.entries[resourceName] = obj.resource;
                                _this.appendBaseMethods(obj);
                            } else {
                                throw new Error('BaseRouter: path \'' + resourceName + '\' already in use.');
                            }
                        } else {
                            throw new Error('BaseRouter: invalid resource path "' + obj.path + '"');
                        }
                    } else {
                        throw new Error('BaseRouter: received invalid entries, must receive objects with one path and one resource class.');
                    }
                });
            } else {
                throw new Error('BaseRouter: register must receive an array of routing properties.');
            }
        }
    }, {
        key: 'rootOptions',
        value: function rootOptions(baseUri) {
            var options = {},
                resources = {},
                basePath = _RouterConfig2['default'].basePath || '/';

            Object.keys(this.entries).forEach(function (entry) {
                resources[entry] = '' + baseUri + '' + _RouterConfig2['default'].basePath + '/' + entry;
            });
            options.resources = resources;
            return options;
        }
    }, {
        key: 'appendBaseMethods',
        value: function appendBaseMethods() {
            throw new Error('BaseRouter: Method not implemented. Must be overridden by subclass');
        }
    }], [{
        key: 'checkUserRole',
        value: _asyncToGenerator(function* (user, allowedRoles) {
            if (!allowedRoles) {
                return true;
            } else {
                if (allowedRoles.length === 0) {
                    throw new Exceptions.Forbidden();
                } else {
                    if (!user || !user.obj.role) {
                        throw new Exceptions.Forbidden();
                    }
                    if (allowedRoles.indexOf(user.role) > -1) {
                        return true;
                    } else {
                        var childRoles = yield _RoleModel2['default'].fetch({
                            resourceProperties: {
                                _filter: {
                                    parentRole: user.obj.role
                                },
                                _fields: ['id']
                            }
                        });
                        while (childRoles.length > 0) {
                            var role = childRoles.shift();
                            if (allowedRoles.indexOf(role.id) > -1) {
                                return true;
                            } else {
                                var newChilds = yield _RoleModel2['default'].fetch({
                                    resourceProperties: {
                                        _filter: {
                                            parentRole: role.id
                                        },
                                        _fields: ['id']
                                    }
                                });
                                childRoles = childRoles.concat(newChilds);
                            }
                        }
                        throw new Exceptions.Forbidden();
                    }
                }
            }
        })
    }, {
        key: 'getResourceMethod',
        value: function getResourceMethod(id, httpMethod, resourceClass) {
            var pathType;

            if (id) {
                pathType = 'instance';
            } else {
                pathType = 'collection';
            }
            return resourceClass.getResourceMethod(pathType, httpMethod);
            //var methodProperties = Resource.HTTPResourceMethods[pathType][httpMethod.toLowerCase()],
            //    resourceMethod;
            //if (methodProperties) {
            //    if (methodProperties.static) {
            //        if (methodProperties.method === 'constructor') {
            //            resourceMethod = resourceClass;
            //        }
            //        else {
            //            resourceMethod = resourceClass[methodProperties.method];
            //        }
            //    }
            //    else {
            //        resourceMethod = resourceClass.prototype[methodProperties.method];
            //    }
            //}
            //return resourceMethod;
        }
    }, {
        key: 'parseRequest',
        value: function parseRequest(request) {
            var requestProperties = {};
            requestProperties._filter = BaseRouter.parseFilters(request.query._filter);
            requestProperties._sort = BaseRouter.parseSort(request.query._sort);
            requestProperties._pagination = BaseRouter.parsePagination(request.query._page, request.query._page_size);
            requestProperties._fields = BaseRouter.parseFields(request.query._fields);
            requestProperties._embedded = BaseRouter.parseEmbedded(request.query._embedded);
            requestProperties._format = BaseRouter.parseFormat(request.query._format);
            requestProperties._mediaType = request.headers.accept;

            return requestProperties;
        }
    }, {
        key: 'parseFilters',
        value: function parseFilters(_filter) {
            if (_filter) {
                try {
                    var filters = JSON.parse(_filter);
                } catch (e) {
                    //console.error(`BaseRouter: Cannot parse filters JSON.`);
                    return;
                }
                if (filters) {
                    return filters;
                }
            }
        }
    }, {
        key: 'parseSort',
        value: function parseSort(_sort) {

            if (_sort) {
                try {
                    var sortParsed = JSON.parse(_sort);
                } catch (e) {
                    //console.error("BaseRouter: Cannot parse _sort JSON.");
                    return;
                }
                if (Array.isArray(sortParsed)) {
                    var sortArray = [];
                    try {
                        sortParsed.some(function (s) {
                            var order = undefined,
                                field = undefined,
                                sortObj = {};

                            if (typeof s != 'string') {
                                sortArray = undefined;
                                throw new Error();
                            }

                            if (s.charAt(0) === '-') {
                                order = -1;
                                field = s.substr(1);
                            } else {
                                order = 1;
                                field = s;
                            }

                            sortObj[field] = order;
                            sortArray.push(sortObj);
                        });
                    } catch (e) {}

                    if (sortArray && sortArray.length > 0) {
                        return sortArray;
                    }
                } else {}
            }
        }
    }, {
        key: 'parsePagination',
        value: function parsePagination(_page, _page_size) {
            if (_page) {
                var page = parseInt(_page);

                if (isNaN(page)) {}
            }
            if (_page_size) {
                var pageSize = parseInt(_page_size);

                if (isNaN(pageSize)) {}
            }

            if (page || pageSize) {
                return {
                    _page: page,
                    _page_size: pageSize
                };
            }
        }
    }, {
        key: 'parseFields',
        value: function parseFields(_fields) {

            if (_fields) {
                try {
                    var fieldsParsed = JSON.parse(_fields);
                } catch (e) {
                    //console.error("BaseRouter: Cannot parse _fields JSON.");
                    return;
                }
                if (Array.isArray(fieldsParsed)) {
                    var fieldsArray = [];
                    try {
                        fieldsParsed.forEach(function (s) {
                            if (typeof s !== 'string') {
                                fieldsArray = undefined;
                                throw new Error();
                            } else {
                                fieldsArray.push(s);
                            }
                        });
                    } catch (e) {}

                    if (fieldsArray && fieldsArray.length > 0) {
                        return fieldsArray;
                    }
                } else {}
            }
        }
    }, {
        key: 'parseEmbedded',
        value: function parseEmbedded(_embedded) {

            if (_embedded) {
                try {
                    var embeddedParsed = JSON.parse(_embedded);
                } catch (e) {
                    //console.error("BaseRouter: Cannot parse _embedded JSON.");
                    return;
                }
                if (Array.isArray(embeddedParsed)) {
                    var embeddedArray = [];
                    try {
                        embeddedParsed.forEach(function (s) {
                            if (typeof s !== 'string') {
                                embeddedArray = false;
                            } else {
                                embeddedArray.push(s);
                            }
                        });
                    } catch (e) {}

                    if (embeddedArray && embeddedArray.length > 0) {
                        return embeddedArray;
                    }
                } else {}
            }
        }
    }, {
        key: 'parseFormat',
        value: function parseFormat(_format) {
            if (typeof _format === 'string') {
                return _format;
            }
        }
    }, {
        key: 'resourceName',
        value: (function (_resourceName) {
            function resourceName(_x) {
                return _resourceName.apply(this, arguments);
            }

            resourceName.toString = function () {
                return _resourceName.toString();
            };

            return resourceName;
        })(function (resourcePath) {
            var pathRegEx = /^\/?[^\/][a-z0-9\-_]+/i;

            var match = resourcePath.match(pathRegEx);
            if (match) {
                var resourceName;
                if (match[0].charAt(0) === '/') {
                    resourceName = match[0].substring(1);
                } else {
                    resourceName = match[0];
                }
                return resourceName;
            } else {
                return false;
            }
        })
    }, {
        key: 'createGenericResourceClass',
        value: function createGenericResourceClass(resourceName) {
            var NoBackendResource = (function (_GenericResource) {
                function NoBackendResource() {
                    _classCallCheck(this, _NoBackendResource);

                    if (_GenericResource != null) {
                        _GenericResource.apply(this, arguments);
                    }
                }

                _inherits(NoBackendResource, _GenericResource);

                var _NoBackendResource = NoBackendResource;
                NoBackendResource = Annotations.Name(resourceName)(NoBackendResource) || NoBackendResource;
                return NoBackendResource;
            })(_GenericResource3['default']);

            NoBackendResource.noBackend = true;

            return NoBackendResource;
        }
    }]);

    return BaseRouter;
})();

exports['default'] = BaseRouter;
module.exports = exports['default'];

//console.error("BaseRouter: _sort properties must be an array of strings.")

//console.error("BaseRouter: _sort properties must be an array.");

//console.error("BaseRouter: Cannot parse '_page' value. Must receive an integer.");

//console.error("BaseRouter: Cannot parse '_page_size' value. Must receive an integer.");

//console.error("BaseRouter: _fields properties must be an array of strings.")

//console.error("BaseRouter: _fields properties must be an array.");

//console.error("BaseRouter: _embedded properties must be an array of strings.")

//console.error("BaseRouter: _embedded properties must be an array.");