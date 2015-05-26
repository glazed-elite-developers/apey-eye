/**
 * Created by Filipe on 03/03/2015.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _HapiRouterJs = require('./HapiRouter.js');

var _HapiRouterJs2 = _interopRequireDefault(_HapiRouterJs);

var _ExceptionsJs = require('./../Exceptions.js');

var Exceptions = _interopRequireWildcard(_ExceptionsJs);

var _HTTPCodes = require('./../HTTPCodes');

var _HTTPCodes2 = _interopRequireDefault(_HTTPCodes);

var _Boom = require('Boom');

var _Boom2 = _interopRequireDefault(_Boom);

var _hapiNode_modulesJoi = require('hapi/node_modules/joi');

var _hapiNode_modulesJoi2 = _interopRequireDefault(_hapiNode_modulesJoi);

var _configRouterJs = require('../config/router.js');

var _configRouterJs2 = _interopRequireDefault(_configRouterJs);

var _DefaultPropertiesJs = require('./../DefaultProperties.js');

var DefaultProperties = _interopRequireWildcard(_DefaultPropertiesJs);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var HapiGenericRouter = (function (_HapiRouter) {
    function HapiGenericRouter() {
        _classCallCheck(this, HapiGenericRouter);

        _get(Object.getPrototypeOf(HapiGenericRouter.prototype), 'constructor', this).call(this);
        this.appendGenericRouter();
    }

    _inherits(HapiGenericRouter, _HapiRouter);

    _createClass(HapiGenericRouter, [{
        key: 'rootOptions',
        value: function rootOptions(baseUri) {
            var options = _get(Object.getPrototypeOf(HapiGenericRouter.prototype), 'rootOptions', this).call(this, baseUri);
            options.no_backend = '' + baseUri + '' + _configRouterJs2['default'].basePath + '/{path}';
            return options;
        }
    }, {
        key: 'appendGenericRouter',
        value: function appendGenericRouter() {
            var _this = this;

            var self = this;

            var httpMethods = DefaultProperties.HTTPMethods;

            Object.keys(HapiGenericRouter.pathTypes()).forEach(function (pathType) {
                httpMethods.forEach(function (httpMethod) {

                    var path = HapiGenericRouter.pathTypes()[pathType];
                    var route = {
                        path: path,
                        method: httpMethod,
                        config: {
                            handler: {
                                async: _asyncToGenerator(function* (request, reply) {
                                    try {
                                        var _path = request.path.slice(_configRouterJs2['default'].basePath.length);
                                        var resourceName = _HapiRouterJs2['default'].resourceName(_path);
                                        var ResourceClass = undefined;
                                        if (resourceName && !self.entries[resourceName]) {
                                            ResourceClass = _HapiRouterJs2['default'].createGenericResourceClass(resourceName);

                                            var oldListLength = self.routesList.length;

                                            self.register([{
                                                path: '' + resourceName,
                                                resource: ResourceClass
                                            }]);

                                            var newRoutesList = self.routesList.slice(oldListLength);
                                            request.server.route(newRoutesList);

                                            reply().redirect(request.url.path).rewritable(false).temporary(true);
                                        } else {
                                            throw new Exceptions.NotFound();
                                        }
                                    } catch (error) {
                                        reply(_HapiRouterJs2['default'].errorHandling(error));
                                    }
                                })
                            }
                        }
                    };
                    _this.addGenericRouteDocumentation({
                        pathType: pathType,
                        httpMethod: httpMethod

                    }, route);
                    _this.routesList.push(route);
                });
            });
        }
    }, {
        key: 'addGenericRouteDocumentation',
        value: function addGenericRouteDocumentation(options, route) {
            var validate = { params: {} };

            validate.params.path = _hapiNode_modulesJoi2['default'].string().required().description('resource name');

            if (options.pathType === 'instance') {
                validate.params.id = _hapiNode_modulesJoi2['default'].string().required().description('instance ID or action name');
            } else if (options.pathType === 'instance_action ') {
                validate.params.id = _hapiNode_modulesJoi2['default'].string().required().description('instance ID');
                validate.params.action = _hapiNode_modulesJoi2['default'].string().required().description('action name');
            }

            if (options.pathType === 'collection' && options.httpMethod.toUpperCase() === 'GET') {
                validate.query = {
                    _sort: _hapiNode_modulesJoi2['default'].string(),
                    _filter: _hapiNode_modulesJoi2['default'].string(),
                    _page_size: _hapiNode_modulesJoi2['default'].string()
                };
            }

            if (['POST', 'PUT', 'PATCH'].indexOf(options.httpMethod) != -1) {
                validate.payload = _hapiNode_modulesJoi2['default'].object().description('Payload for request');
            }

            if (options.pathType !== 'instance_action') {
                validate.query = validate.query || {};
                validate.query._embedded = _hapiNode_modulesJoi2['default'].string();
                validate.query._fields = _hapiNode_modulesJoi2['default'].string();
            }

            route.config.description = 'No Backend';
            route.config.notes = 'This route allows to add a new resource to API in runtime, if no match route exists a new one will be added to server.';
            route.config.tags = ['api', 'nobackend'];
            route.config.validate = validate;
        }
    }], [{
        key: 'pathTypes',
        value: function pathTypes() {
            var basePath = _configRouterJs2['default'].basePath || '';

            if (basePath && basePath.slice(-1) === '/') {
                throw new Error('Base path wouldn\'t end without character \'/\'');
            }

            return {
                collection: '' + basePath + '/{path}',
                instance: '' + basePath + '/{path}/{id}',
                instance_action: '' + basePath + '/{path}/{id}/{action}'
            };
        }
    }]);

    return HapiGenericRouter;
})(_HapiRouterJs2['default']);

exports['default'] = HapiGenericRouter;
module.exports = exports['default'];