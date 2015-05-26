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
 * Created by Filipe on 03/03/2015.
 */

var _HapiRouter2 = require('./HapiRouter.js');

var _HapiRouter3 = _interopRequireWildcard(_HapiRouter2);

var _import = require('./../Exceptions.js');

var Exceptions = _interopRequireWildcard(_import);

var _HTTPCodes = require('./../HTTPCodes');

var _HTTPCodes2 = _interopRequireWildcard(_HTTPCodes);

var _Boom = require('Boom');

var _Boom2 = _interopRequireWildcard(_Boom);

var _Joi = require('hapi/node_modules/joi');

var _Joi2 = _interopRequireWildcard(_Joi);

var _RouterConfig = require('../../config/router.js');

var _RouterConfig2 = _interopRequireWildcard(_RouterConfig);

var _import2 = require('./../DefaultProperties.js');

var DefaultProperties = _interopRequireWildcard(_import2);

var _import3 = require('underscore');

var _import4 = _interopRequireWildcard(_import3);

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
            options.no_backend = '' + baseUri + '' + _RouterConfig2['default'].basePath + '/{path}';
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
                                        var _path = request.path.slice(_RouterConfig2['default'].basePath.length);
                                        var resourceName = _HapiRouter3['default'].resourceName(_path);
                                        var ResourceClass = undefined;
                                        if (resourceName && !self.entries[resourceName]) {
                                            ResourceClass = _HapiRouter3['default'].createGenericResourceClass(resourceName);

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
                                        reply(_HapiRouter3['default'].errorHandling(error));
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

            validate.params.path = _Joi2['default'].string().required().description('resource name');

            if (options.pathType === 'instance') {
                validate.params.id = _Joi2['default'].string().required().description('instance ID or action name');
            } else if (options.pathType === 'instance_action ') {
                validate.params.id = _Joi2['default'].string().required().description('instance ID');
                validate.params.action = _Joi2['default'].string().required().description('action name');
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

            if (options.pathType !== 'instance_action') {
                validate.query = validate.query || {};
                validate.query._embedded = _Joi2['default'].string();
                validate.query._fields = _Joi2['default'].string();
            }

            route.config.description = 'No Backend';
            route.config.notes = 'This route allows to add a new resource to API in runtime, if no match route exists a new one will be added to server.';
            route.config.tags = ['api', 'nobackend'];
            route.config.validate = validate;
        }
    }], [{
        key: 'pathTypes',
        value: function pathTypes() {
            var basePath = _RouterConfig2['default'].basePath || '';

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
})(_HapiRouter3['default']);

exports['default'] = HapiGenericRouter;
module.exports = exports['default'];