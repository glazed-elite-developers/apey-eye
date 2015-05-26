'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _asyncToGenerator = function (fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
    value: true
});
/**
 * Created by Filipe on 20/04/2015.
 */
/**
 * Created by Filipe on 03/03/2015.
 */

var _BaseRouter2 = require('./../BaseRouter.js');

var _BaseRouter3 = _interopRequireWildcard(_BaseRouter2);

var _Resource = require('./../Resource');

var _Resource2 = _interopRequireWildcard(_Resource);

var _import = require('./../Annotations');

var Annotations = _interopRequireWildcard(_import);

var _import2 = require('./../Exceptions');

var Exceptions = _interopRequireWildcard(_import2);

var _HTTPCodes = require('./../HTTPCodes');

var _HTTPCodes2 = _interopRequireWildcard(_HTTPCodes);

var _Auth = require('./../Auth.js');

var _Auth2 = _interopRequireWildcard(_Auth);

var _import3 = require('underscore');

var _import4 = _interopRequireWildcard(_import3);

var _passport = require('passport');

var _passport2 = _interopRequireWildcard(_passport);

var _Boom = require('Boom');

var _Boom2 = _interopRequireWildcard(_Boom);

var _Joi = require('hapi/node_modules/joi');

var _Joi2 = _interopRequireWildcard(_Joi);

var _import5 = require('./../DefaultProperties.js');

var DefaultProperties = _interopRequireWildcard(_import5);

var _RouterConfig = require('../../config/router.js');

var _RouterConfig2 = _interopRequireWildcard(_RouterConfig);

var HapiRouter = (function (_BaseRouter) {
    function HapiRouter() {
        _classCallCheck(this, HapiRouter);

        _get(Object.getPrototypeOf(HapiRouter.prototype), 'constructor', this).call(this);

        this.entries = {};
        this.routesList = [];

        this.addRootRoute();
    }

    _inherits(HapiRouter, _BaseRouter);

    _createClass(HapiRouter, [{
        key: 'addRootRoute',
        value: function addRootRoute() {
            var self = this;
            var route = {
                path: _RouterConfig2['default'].basePath || '/',
                method: 'OPTIONS',
                config: {
                    handler: {
                        async: _asyncToGenerator(function* (request, reply) {
                            reply(self.rootOptions(request.server.info.uri));
                        })
                    }
                }
            };
            this.routesList.push(route);
        }
    }, {
        key: 'routes',
        value: function routes() {
            return this.routesList;
        }
    }, {
        key: 'appendBaseMethods',
        value: function appendBaseMethods(entry) {
            var _this = this;

            var ResourceClass = entry.resource,
                pathTypes = HapiRouter.pathTypes(entry.path);

            if (ResourceClass.actions) {
                Object.keys(ResourceClass.actions.collection).forEach(function (action) {

                    var i = action.indexOf('_');
                    var method = action.substr(0, i);
                    var actionName = action.substr(i + 1);

                    if (method && actionName) {
                        _this.addRoute({
                            path: '' + pathTypes.collection + '/' + actionName,
                            httpMethod: method,
                            ResourceClass: ResourceClass,
                            pathType: 'instance',
                            action: actionName
                        });
                    }
                });
                Object.keys(ResourceClass.actions.instance).forEach(function (action) {
                    var i = action.indexOf('_');
                    var method = action.substr(0, i);
                    var actionName = action.substr(i + 1);

                    if (method && actionName) {
                        _this.addRoute({
                            path: '' + pathTypes.instance + '/' + actionName,
                            httpMethod: method,
                            ResourceClass: ResourceClass,
                            pathType: 'instance_action',
                            action: actionName
                        });
                    }
                });
            }

            var httpMethods = DefaultProperties.HTTPMethods;
            Object.keys(pathTypes).forEach(function (pathType) {
                httpMethods.forEach(function (httpMethod) {

                    var path = pathTypes[pathType];

                    if (pathType !== 'instance_action') {

                        var resourceMethod = ResourceClass.getResourceMethod(pathType, httpMethod);

                        if (resourceMethod) {
                            _this.addRoute({
                                path: path,
                                httpMethod: httpMethod,
                                ResourceClass: ResourceClass,
                                pathType: pathType,
                                resourceMethod: resourceMethod
                            });
                        }
                    }
                });
            });
        }
    }, {
        key: 'addRoute',
        value: function addRoute(options) {
            var self = this;

            var route = {
                path: options.path,
                method: options.httpMethod,
                config: {
                    pre: [{
                        method: function method(req, reply) {
                            if (options.pathType === 'instance_action') {
                                req.params.action = options.action;
                            } else if (options.pathType === 'instance' && options.action) {
                                req.params.id = options.action;
                            }
                            return self.defaultMiddlewares(req, function (error) {
                                if (error) {
                                    reply(HapiRouter.errorHandling(error)).takeover();
                                } else {
                                    reply['continue']();
                                }
                            });
                        }
                    }],
                    auth: options.httpMethod === 'OPTIONS' ? false : 'default',
                    handler: {
                        async: _asyncToGenerator(function* (request, reply) {
                            yield HapiRouter.handleRequest(options.ResourceClass, options.pathType, request, reply);
                        })
                    }
                }
            };
            this.addRouteDocumentation(options, route);
            this.routesList.push(route);
        }
    }, {
        key: 'addRouteDocumentation',
        value: function addRouteDocumentation(options, route) {
            var self = this,
                resourceDocumentation = options.ResourceClass.getDocumentation.call(options.resourceMethod),
                tags = ['api'],
                resourceName = options.ResourceClass.getName(),
                validate = {};

            if (resourceName) {
                tags.push(resourceName);
            }

            if (options.pathType === 'instance' && !options.action || options.pathType === 'instance_action') {

                validate.params = {
                    id: _Joi2['default'].string().required().description('instance ID')
                };
            }
            if (options.pathType === 'collection' && options.httpMethod.toUpperCase() === 'GET') {
                validate.query = {
                    _sort: _Joi2['default'].string(),
                    _filter: _Joi2['default'].string(),
                    _page_size: _Joi2['default'].string()
                };
            }

            if (['POST', 'PUT', 'PATCH'].indexOf(options.httpMethod) != -1) {
                validate.payload = _Joi2['default'].object().description('Payload for request');
            }

            if (!options.action) {
                validate.query = validate.query || {};
                validate.query._embedded = _Joi2['default'].string();
                validate.query._fields = _Joi2['default'].string();
            }

            route.config.description = resourceDocumentation && resourceDocumentation.title;
            route.config.notes = resourceDocumentation && resourceDocumentation.description;
            route.config.tags = tags;
            route.config.validate = validate;
        }
    }, {
        key: 'defaultMiddlewares',
        value: function defaultMiddlewares(request, done) {
            try {
                request.requestProperties = request.requestProperties || {};
                this.fetchResource(request);

                this.checkRoles(request, function (err) {
                    if (!err) {
                        HapiRouter.fetchRequestProperties(request);
                        done();
                    } else {
                        done(err);
                    }
                });
            } catch (err) {
                done(err);
            }
        }
    }, {
        key: 'fetchResource',
        value: function fetchResource(request) {
            var path = request.path.slice(_RouterConfig2['default'].basePath.length);
            var resourceName = HapiRouter.resourceName(path),
                ResourceClass = this.entries[resourceName],
                RouterClass = this.constructor;

            if (!request.resourceClass || !request.resourceMethod) {
                var resourceMethod = RouterClass.getResourceMethod(request.params.id, request.method, ResourceClass);

                if (!resourceMethod) {
                    throw new Exceptions.MethodNotAllowed();
                } else {
                    request.resourceMethod = resourceMethod;
                }
                request.resourceClass = ResourceClass;
            }
        }
    }, {
        key: 'checkAuthentication',
        value: function checkAuthentication(request, reply) {
            try {
                this.fetchResource(request);
                var authenticationMethod = request.resourceClass.getAuthentication(request.resourceMethod);

                if (authenticationMethod && authenticationMethod != 'none') {
                    var auth = new _Auth2['default'](_passport2['default']);
                    auth.authenticate(authenticationMethod, { session: false }, function (err, user) {
                        if (err) return reply(_Boom2['default'].unauthorized(err));
                        if (user === false) {
                            return reply(_Boom2['default'].unauthorized(null));
                        } else {
                            request.requestProperties = request.requestProperties || {};
                            request.requestProperties.user = user;
                        }
                        return reply['continue']({ credentials: {} });
                    })(request, reply);
                } else {
                    return reply['continue']({ credentials: {} });
                }
            } catch (error) {
                try {
                    return reply(HapiRouter.errorHandling(error));
                } catch (e) {
                    return reply(_Boom2['default'].wrap(e, 500));
                }
            }
        }
    }, {
        key: 'checkRoles',
        value: function checkRoles(request, done) {
            var allowedRoles = request.resourceClass.getAllowedRoles(request.resourceMethod);
            if (request.method.toUpperCase() !== 'OPTIONS') {
                _BaseRouter3['default'].checkUserRole(request.requestProperties.user, allowedRoles).then(function () {
                    done();
                })['catch'](function (err) {
                    done(err);
                });
            } else {
                done();
            }
        }
    }], [{
        key: 'pathTypes',
        value: function pathTypes(path) {
            var basePath = _RouterConfig2['default'].basePath || '';

            if (basePath && basePath.slice(-1) === '/') {
                throw new Error('Base path wouldn\'t end without character \'/\'');
            }

            return {
                collection: '' + basePath + '/' + path,
                instance: '' + basePath + '/' + path + '/{id}',
                instance_action: '' + basePath + '/' + path + '/{id}/{action}'
            };
        }
    }, {
        key: 'handleRequest',
        value: _asyncToGenerator(function* (resourceClass, pathType, request, reply) {
            try {
                var result = yield resourceClass._handleRequest({
                    method: request.method,
                    pathType: pathType,
                    requestProperties: request.requestProperties,
                    id: request.params.id,
                    action: request.params.action,
                    data: request.payload
                });
                if (result) {
                    if (result.obj) {
                        var resultRendered = result.render(request.requestProperties);
                        reply(resultRendered.data).type(resultRendered.type).code(_HTTPCodes2['default'].success);
                    } else {
                        reply().code(_HTTPCodes2['default'].noContent);
                    }
                }
            } catch (error) {
                try {
                    reply(HapiRouter.errorHandling(error));
                } catch (e) {
                    console.error(e.stack);
                    reply(_Boom2['default'].wrap(e, 500));
                }
            }
        })
    }, {
        key: 'errorHandling',
        value: function errorHandling(error) {
            var statusCode = undefined;
            if (error instanceof Exceptions.NotFound) {
                statusCode = _HTTPCodes2['default'].notFound;
            } else if (error instanceof Exceptions.MethodNotAllowed) {
                statusCode = _HTTPCodes2['default'].methodNotAllowed;
            } else if (error instanceof Exceptions.NotImplemented) {
                statusCode = _HTTPCodes2['default'].notImplemented;
            } else if (error instanceof Exceptions.BadRequest) {
                statusCode = _HTTPCodes2['default'].badRequest;
            } else if (error instanceof Exceptions.Unauthorized) {
                statusCode = _HTTPCodes2['default'].unauthorized;
            } else if (error instanceof Exceptions.Forbidden) {
                statusCode = _HTTPCodes2['default'].forbidden;
            } else {
                console.error(error.stack);
                statusCode = _HTTPCodes2['default'].internalServerError;
            }
            return _Boom2['default'].wrap(error, statusCode || 500);
        }
    }, {
        key: 'fetchRequestProperties',
        value: function fetchRequestProperties(request) {
            var requestProperties = {
                query: request.query,
                headers: {
                    accept: request.headers.accept
                }
            };
            request.requestProperties = _import4['default'].extend(request.requestProperties, HapiRouter.parseRequest(requestProperties));
        }
    }]);

    return HapiRouter;
})(_BaseRouter3['default']);

exports['default'] = HapiRouter;
module.exports = exports['default'];