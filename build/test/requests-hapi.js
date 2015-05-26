'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _asyncToGenerator = function (fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; };

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (initializers) initializers[key] = descriptor.initializer; } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/**
 * Created by Filipe on 11/03/2015.
 */

var _chai = require('chai');

var _chai2 = _interopRequireWildcard(_chai);

var _chaiAsPromised = require('chai-as-promised');

var _chaiAsPromised2 = _interopRequireWildcard(_chaiAsPromised);

var _chaiThings = require('chai-things');

var _chaiThings2 = _interopRequireWildcard(_chaiThings);

var _Hapi = require('hapi');

var _Hapi2 = _interopRequireWildcard(_Hapi);

var _request = require('request-promise');

var _request2 = _interopRequireWildcard(_request);

var _HapiRouter = require('../lib/routers/HapiRouter.js');

var _HapiRouter2 = _interopRequireWildcard(_HapiRouter);

var _HapiGenericRouter = require('../lib/routers/HapiGenericRouter.js');

var _HapiGenericRouter2 = _interopRequireWildcard(_HapiGenericRouter);

var _KoaRouter = require('../lib/routers/KoaRouter.js');

var _KoaRouter2 = _interopRequireWildcard(_KoaRouter);

var _BaseRouter = require('../lib/BaseRouter.js');

var _BaseRouter2 = _interopRequireWildcard(_BaseRouter);

var _import = require('../lib/Annotations.js');

var Annotations = _interopRequireWildcard(_import);

var _GenericResource2 = require('../lib/GenericResource.js');

var _GenericResource3 = _interopRequireWildcard(_GenericResource2);

var _RethinkDBModel2 = require('../lib/RethinkDBModel.js');

var _RethinkDBModel3 = _interopRequireWildcard(_RethinkDBModel2);

var _Input = require('../lib/Input.js');

var _Input2 = _interopRequireWildcard(_Input);

var _ModelRegister = require('../lib/ModelRegister.js');

var _ModelRegister2 = _interopRequireWildcard(_ModelRegister);

var _RoleModel = require('../lib/models/RoleModel.js');

var _RoleModel2 = _interopRequireWildcard(_RoleModel);

var _UserModel = require('../lib/models/UserModel.js');

var _UserModel2 = _interopRequireWildcard(_UserModel);

var _shortid = require('shortid');

var _shortid2 = _interopRequireWildcard(_shortid);

require('mochawait');

_shortid2['default'].characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_');

_chai2['default'].use(_chaiAsPromised2['default']);
_chai2['default'].should();
_chai2['default'].use(_chaiThings2['default']);

var expect = _chai2['default'].expect,
    assert = _chai2['default'].assert,
    should = _chai2['default'].should;

var server = undefined,
    userData = undefined;

describe('hapi', function () {
    before(function (done) {
        _ModelRegister2['default'].empty();

        var restaurantInput = new _Input2['default']({
            name: { type: 'string', required: true },
            dateCreated: { type: 'date', 'default': 'now' },
            phone: { type: 'number' }
        });

        var RestaurantModel = (function (_RethinkDBModel) {
            function RestaurantModel() {
                _classCallCheck(this, _RestaurantModel);

                if (_RethinkDBModel != null) {
                    _RethinkDBModel.apply(this, arguments);
                }
            }

            _inherits(RestaurantModel, _RethinkDBModel);

            var _RestaurantModel = RestaurantModel;
            RestaurantModel = Annotations.Query({
                _sort: ['name', '-address'],
                _page_size: 10
            })(RestaurantModel) || RestaurantModel;
            RestaurantModel = Annotations.Name('restaurant')(RestaurantModel) || RestaurantModel;
            RestaurantModel = Annotations.Input(restaurantInput)(RestaurantModel) || RestaurantModel;
            return RestaurantModel;
        })(_RethinkDBModel3['default']);

        var RestaurantResource = (function (_GenericResource) {
            function RestaurantResource() {
                _classCallCheck(this, _RestaurantResource);

                if (_GenericResource != null) {
                    _GenericResource.apply(this, arguments);
                }
            }

            _inherits(RestaurantResource, _GenericResource);

            var _RestaurantResource = RestaurantResource;

            _createDecoratedClass(_RestaurantResource, [{
                key: 'get_name',
                decorators: [Annotations.Action()],
                value: _asyncToGenerator(function* () {
                    var obj = this.obj;
                    this.obj = { name: obj.name };
                    return this;
                })
            }, {
                key: 'delete',
                decorators: [Annotations.Authentication('basic')],
                value: _asyncToGenerator(function* (options) {
                    return yield _get(Object.getPrototypeOf(_RestaurantResource.prototype), 'delete', this).call(this, options);
                })
            }], [{
                key: 'get_first',
                decorators: [Annotations.Action()],
                value: _asyncToGenerator(function* () {
                    var data = { name: 'First Restaurant' };
                    return RestaurantResource._serialize(undefined, data);
                })
            }, {
                key: 'delete',
                decorators: [Annotations.Authentication('local')],
                value: _asyncToGenerator(function* (options) {
                    return true;
                })
            }]);

            RestaurantResource = Annotations.Methods(['static.fetch', 'constructor', 'static.fetchOne', 'delete'])(RestaurantResource) || RestaurantResource;
            RestaurantResource = Annotations.Model(RestaurantModel)(RestaurantResource) || RestaurantResource;
            return RestaurantResource;
        })(_GenericResource3['default']);

        var router = new _HapiGenericRouter2['default']();
        router.register([{
            path: 'restaurant',
            resource: RestaurantResource
        }]);

        server = new _Hapi2['default'].Server({
            connections: {
                router: {
                    stripTrailingSlash: true
                }
            }
        });
        server.connection({ port: 3001 });

        var scheme = function scheme(server, options) {
            return {
                authenticate: function authenticate(request, reply) {
                    return router.checkAuthentication(request, reply);
                }
            };
        };

        server.auth.scheme('custom', scheme);
        server.auth.strategy('default', 'custom');

        server.register([require('hapi-async-handler')], function (err) {
            if (err) {
                throw err;
            }
            server.route(router.routes());
            server.start(function () {
                //console.log('Server running at:', server.info.uri);
                done();
            });
        });
    });
    after(function (done) {
        server.stop({ timeout: 60 * 1000 }, function () {
            //console.log('Server stopped');
            done();
        });
    });
    describe('server', function () {
        describe('Basic', function () {
            before(_asyncToGenerator(function* () {
                _ModelRegister2['default'].register('role', _RoleModel2['default']);
                _ModelRegister2['default'].register('user', _UserModel2['default']);
                try {
                    var role = yield _RoleModel2['default'].fetchOne({ id: 'admin' });
                } catch (e) {
                    var role = yield new _RoleModel2['default']({ data: { id: 'admin' } });
                }
                userData = {
                    username: 'userTest' + _shortid2['default'].generate(),
                    password: 'userPassword',
                    role: 'admin'
                };
                yield new _UserModel2['default']({ data: userData });
            }));
            it('Fetch', _asyncToGenerator(function* () {
                var list = yield _request2['default']({ url: server.info.uri + '/classes/restaurant/', json: true });
                expect(list).to.not.be.undefined;
                expect(list).to.be['instanceof'](Array);
            }));
            it('POST and Fetch', _asyncToGenerator(function* () {
                var restaurantData = { name: 'restaurantName' };

                var obj = yield _request2['default'].post({
                    url: server.info.uri + '/classes/restaurant/',
                    json: true,
                    body: restaurantData
                });

                expect(obj).to.not.be.undefined;
                expect(obj.id).to.not.be.undefined;
                expect(obj.name).to.equal(restaurantData.name);

                var obj2 = yield _request2['default'].get({
                    url: server.info.uri + '/classes/restaurant/' + obj.id,
                    json: true
                });

                expect(obj).to.deep.equal(obj2);

                expect(_request2['default'].patch({
                    url: server.info.uri + '/classes/restaurant/' + obj.id,
                    json: true
                })).to.be.rejected;
            }));
            it('Test instance action', _asyncToGenerator(function* () {
                var restaurantData = { name: 'restaurantName', phone: 123123 };

                var obj = yield _request2['default'].post({
                    url: server.info.uri + '/classes/restaurant/',
                    json: true,
                    body: restaurantData
                });

                var resultAction = yield _request2['default'].get({
                    url: server.info.uri + '/classes/restaurant/' + obj.id + '/name/',
                    json: true,
                    body: restaurantData
                });
                expect(resultAction).to.deep.equal({ name: restaurantData.name });
            }));
            it('Test autentication basic fails', _asyncToGenerator(function* () {
                var restaurantData = { name: 'restaurantName', phone: 123123 };

                var obj = yield _request2['default'].post({
                    url: server.info.uri + '/classes/restaurant/',
                    json: true,
                    body: restaurantData
                });

                expect(_request2['default'].del({
                    url: server.info.uri + '/classes/restaurant/' + obj.id
                })).to.be.rejected;
            }));
            it('Test autentication basic succeeds ', _asyncToGenerator(function* () {

                var restaurantData = { name: 'restaurantName', phone: 123123 };

                var obj = yield _request2['default'].post({
                    url: server.info.uri + '/classes/restaurant/',
                    json: true,
                    body: restaurantData
                });

                expect(_request2['default'].del(server.info.uri + '/classes/restaurant/' + obj.id)).to.be.rejected;
                expect(_request2['default'].del(server.info.uri + '/classes/restaurant/' + obj.id).auth(userData.username, 'invalidPassword' + _shortid2['default'].generate(), true)).to.be.rejected;
                expect(_request2['default'].del(server.info.uri + '/classes/restaurant/' + obj.id).auth('invalidUsername' + _shortid2['default'].generate(), userData.password, true)).to.be.rejected;
                expect(_request2['default'].del(server.info.uri + '/classes/restaurant/' + obj.id).auth(userData.username, userData.password, true)).to.be.fulfilled;
            }));

            it('Test autentication local fails', _asyncToGenerator(function* () {
                var restaurantData = { name: 'restaurantName', phone: 123123 };

                var obj = yield _request2['default'].post({
                    url: server.info.uri + '/classes/restaurant/',
                    json: true,
                    body: restaurantData
                });

                expect(_request2['default'].del({
                    url: server.info.uri + '/classes/restaurant/'
                })).to.be.rejected;
            }));
            it('Test autentication local succeeds ', _asyncToGenerator(function* () {

                var restaurantData = { name: 'restaurantName', phone: 123123 };

                var obj = yield _request2['default'].post({
                    url: server.info.uri + '/classes/restaurant/',
                    json: true,
                    body: restaurantData
                });

                expect(_request2['default'].del({
                    uri: server.info.uri + '/classes/restaurant/' })).to.be.rejected;

                expect(_request2['default'].del({
                    uri: server.info.uri + '/classes/restaurant/',
                    qs: {
                        username: _shortid2['default'].generate(),
                        password: userData.password
                    }
                })).to.be.rejected;

                expect(_request2['default'].del({
                    uri: server.info.uri + '/classes/restaurant/',
                    qs: {
                        username: userData.username,
                        password: _shortid2['default'].generate()
                    }
                })).to.be.rejected;

                expect(_request2['default'].del({
                    uri: server.info.uri + '/classes/restaurant/',
                    qs: {
                        username: userData.username,
                        password: userData.password
                    }
                })).to.be.fulfilled;
            }));
        });

        describe('No Backend', function () {

            it('Fetch', _asyncToGenerator(function* () {
                var resourceName = _shortid2['default'].generate();
                expect(_request2['default']({ url: server.info.uri + ('/classes/' + resourceName + '/'), json: true })).to.be.rejected;
            }));
            it('POST and Fetch', _asyncToGenerator(function* () {
                var resourceName = _shortid2['default'].generate();
                expect(_request2['default']({ url: server.info.uri + ('/classes/' + resourceName + '/'), json: true })).to.be.rejected;

                var restaurantData = { name: 'restaurantName' };

                var obj = yield _request2['default'].post({
                    url: server.info.uri + ('/classes/' + resourceName + '/'),
                    json: true,
                    body: restaurantData
                });

                expect(obj).to.not.be.undefined;
                expect(obj.id).to.not.be.undefined;
                expect(obj.name).to.equal(restaurantData.name);

                var obj2 = yield _request2['default'].get({
                    url: server.info.uri + ('/classes/' + resourceName + '/') + obj.id,
                    json: true
                });

                expect(obj).to.deep.equal(obj2);

                expect(_request2['default']({ url: server.info.uri + ('/classes/' + resourceName + '/'), json: true })).to.be.fulfilled;
            }));
        });
    });
});