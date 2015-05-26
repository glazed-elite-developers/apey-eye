'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

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

var _BaseRouter2 = require('./../BaseRouter.js');

var _BaseRouter3 = _interopRequireWildcard(_BaseRouter2);

var _router = require('koa-router');

var _router2 = _interopRequireWildcard(_router);

var _compose = require('koa-compose');

var _compose2 = _interopRequireWildcard(_compose);

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

var _passport = require('koa-passport');

var _passport2 = _interopRequireWildcard(_passport);

var _RouterConfig = require('../../config/router.js');

var _RouterConfig2 = _interopRequireWildcard(_RouterConfig);

var KoaRouter = (function (_BaseRouter) {
    function KoaRouter() {
        _classCallCheck(this, KoaRouter);

        _get(Object.getPrototypeOf(KoaRouter.prototype), 'constructor', this).call(this);

        this.router = _router2['default']();
        this.router.use(this.errorHandling);
        this.entries = {};
    }

    _inherits(KoaRouter, _BaseRouter);

    _createClass(KoaRouter, [{
        key: 'routes',
        value: function routes() {
            return this.router.routes();
        }
    }, {
        key: 'appendBaseMethods',
        value: function appendBaseMethods(entry) {
            var _this = this;

            var resourceClass = entry.resource;

            Object.keys(KoaRouter.pathTypes(entry.path)).forEach(function (pathType) {
                var path = KoaRouter.pathTypes(entry.path)[pathType];

                _this.router.all(path, _this.defaultMiddlewares(resourceClass), function* (next) {
                    var result = yield resourceClass._handleRequest({
                        method: this.method,
                        pathType: pathType,
                        requestProperties: this.requestProperties,
                        id: this.params.id,
                        action: this.params.action,
                        data: this.request.body
                    });

                    if (result) {
                        if (result.obj) {
                            this.status = 200;
                            var resultRendered = result.render(this.requestProperties);

                            this.body = resultRendered.data;
                            this.type = resultRendered.type;
                        } else {
                            this.status = 204;
                        }
                    }

                    yield next;
                });
            });
        }
    }, {
        key: 'defaultMiddlewares',
        value: function defaultMiddlewares(resourceClass) {
            var RouterClass = this.constructor;
            var stack = [];

            stack.push(function* (next) {
                var resourceMethod = RouterClass.getResourceMethod(this.params.id, this.method, resourceClass);
                if (!resourceMethod) {
                    throw new Exceptions.MethodNotAllowed();
                } else {
                    this.resourceMethod = resourceMethod;
                }
                this.resourceClass = resourceClass;
                this.requestProperties = {};
                yield next;
            });
            stack.push(RouterClass.checkAuthentication);
            stack.push(RouterClass.checkRoles);
            stack.push(function* (next) {
                yield KoaRouter.fetchRequestProperties.call(this, next, RouterClass);
                yield next;
            });

            return _compose2['default'](stack);
        }
    }, {
        key: 'errorHandling',
        value: function* errorHandling(next) {
            try {
                yield next;
            } catch (err) {
                if (err instanceof Exceptions.NotFound) {
                    this.status = _HTTPCodes2['default'].notFound;
                } else if (err instanceof Exceptions.MethodNotAllowed) {
                    this.status = _HTTPCodes2['default'].methodNotAllowed;
                } else if (err instanceof Exceptions.NotImplemented) {
                    this.status = _HTTPCodes2['default'].notImplemented;
                } else if (err instanceof Exceptions.BadRequest) {
                    this.status = _HTTPCodes2['default'].badRequest;
                } else if (err instanceof Exceptions.Unauthorized) {
                    this.status = _HTTPCodes2['default'].unauthorized;
                } else if (err instanceof Exceptions.Forbidden) {
                    this.status = _HTTPCodes2['default'].forbidden;
                } else {
                    console.error(err.stack);
                    this.status = _HTTPCodes2['default'].internalServerError;
                }
                this.body = err.message;
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
                instance: '' + basePath + '/' + path + '/:id',
                instance_action: '' + basePath + '/' + path + '/:id/:action'
            };
        }
    }, {
        key: 'fetchRequestProperties',
        value: function* fetchRequestProperties(next, RouterClass) {

            var koaObj = this;
            var request = {
                query: koaObj.request.query,
                headers: {
                    accept: koaObj.get('Accept')
                }
            };
            this.requestProperties = _import4['default'].extend(this.requestProperties, RouterClass.parseRequest(request));

            yield next;
        }
    }, {
        key: 'checkAuthentication',
        value: function* checkAuthentication(next) {
            var ctx = this;

            var authenticationMethod = this.resourceClass.getAuthentication(this.resourceMethod);

            if (authenticationMethod && authenticationMethod != 'none') {
                var auth = new _Auth2['default'](_passport2['default']);
                yield* auth.authenticate(authenticationMethod, { session: false }, function* (err, user, info) {
                    if (err) throw new Exceptions.BadRequest(err);
                    if (user === false) {
                        throw new Exceptions.Unauthorized();
                    } else {
                        ctx.requestProperties.user = user;
                        yield next;
                    }
                }).call(this, next);
            } else {
                yield next;
            }
        }
    }, {
        key: 'checkRoles',
        value: function* checkRoles(next) {
            var allowedRoles = this.resourceClass.getAllowedRoles(this.resourceMethod);

            yield _BaseRouter3['default'].checkUserRole(this.requestProperties.user, allowedRoles);

            yield next;
        }
    }]);

    return KoaRouter;
})(_BaseRouter3['default']);

exports['default'] = KoaRouter;
module.exports = exports['default'];