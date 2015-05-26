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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _BaseRouterJs = require('./../BaseRouter.js');

var _BaseRouterJs2 = _interopRequireDefault(_BaseRouterJs);

var _Resource = require('./../Resource');

var _Resource2 = _interopRequireDefault(_Resource);

var _Annotations = require('./../Annotations');

var Annotations = _interopRequireWildcard(_Annotations);

var _Exceptions = require('./../Exceptions');

var Exceptions = _interopRequireWildcard(_Exceptions);

var _HTTPCodes = require('./../HTTPCodes');

var _HTTPCodes2 = _interopRequireDefault(_HTTPCodes);

var _AuthJs = require('./../Auth.js');

var _AuthJs2 = _interopRequireDefault(_AuthJs);

var _configRouterJs = require('../config/router.js');

var _configRouterJs2 = _interopRequireDefault(_configRouterJs);

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaPassport = require('koa-passport');

var _koaPassport2 = _interopRequireDefault(_koaPassport);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _koaCompose = require('koa-compose');

var _koaCompose2 = _interopRequireDefault(_koaCompose);

var _koaBodyParser = require('koa-body-parser');

var _koaBodyParser2 = _interopRequireDefault(_koaBodyParser);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var KoaRouter = (function (_BaseRouter) {
    function KoaRouter() {
        _classCallCheck(this, KoaRouter);

        _get(Object.getPrototypeOf(KoaRouter.prototype), 'constructor', this).call(this);

        this.router = (0, _koaRouter2['default'])();
        this.router.use(this.errorHandling);
        this.entries = {};
    }

    _inherits(KoaRouter, _BaseRouter);

    _createClass(KoaRouter, [{
        key: 'start',
        value: function start(options, callback) {
            var app = (0, _koa2['default'])();

            app.use((0, _koaBodyParser2['default'])());
            app.use(_koaPassport2['default'].initialize());
            app.use(this.routes());

            app.listen(options.port);

            callback(false, app);
        }
    }, {
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

            return (0, _koaCompose2['default'])(stack);
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
            var basePath = _configRouterJs2['default'].basePath || '';

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
            this.requestProperties = _underscore2['default'].extend(this.requestProperties, RouterClass.parseRequest(request));

            yield next;
        }
    }, {
        key: 'checkAuthentication',
        value: function* checkAuthentication(next) {
            var ctx = this;

            var authenticationMethod = this.resourceClass.getAuthentication(this.resourceMethod);

            if (authenticationMethod && authenticationMethod != 'none') {
                var auth = new _AuthJs2['default'](_koaPassport2['default']);
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

            yield _BaseRouterJs2['default'].checkUserRole(this.requestProperties.user, allowedRoles);

            yield next;
        }
    }]);

    return KoaRouter;
})(_BaseRouterJs2['default']);

exports['default'] = KoaRouter;
module.exports = exports['default'];