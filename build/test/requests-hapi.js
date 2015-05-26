/**
 * Created by Filipe on 11/03/2015.
 */

'use strict';

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiAsPromised = require('chai-as-promised');

var _chaiAsPromised2 = _interopRequireDefault(_chaiAsPromised);

var _chaiThings = require('chai-things');

var _chaiThings2 = _interopRequireDefault(_chaiThings);

var _hapi = require('hapi');

var _hapi2 = _interopRequireDefault(_hapi);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

require('mochawait');

var _buildApeyEyeRoutersHapiRouterJs = require('../build/apey-eye/routers/HapiRouter.js');

var _buildApeyEyeRoutersHapiRouterJs2 = _interopRequireDefault(_buildApeyEyeRoutersHapiRouterJs);

var _buildApeyEyeRoutersHapiGenericRouterJs = require('../build/apey-eye/routers/HapiGenericRouter.js');

var _buildApeyEyeRoutersHapiGenericRouterJs2 = _interopRequireDefault(_buildApeyEyeRoutersHapiGenericRouterJs);

var _buildApeyEyeRoutersKoaRouterJs = require('../build/apey-eye/routers/KoaRouter.js');

var _buildApeyEyeRoutersKoaRouterJs2 = _interopRequireDefault(_buildApeyEyeRoutersKoaRouterJs);

var _buildApeyEyeBaseRouterJs = require('../build/apey-eye/BaseRouter.js');

var _buildApeyEyeBaseRouterJs2 = _interopRequireDefault(_buildApeyEyeBaseRouterJs);

var _buildApeyEyeAnnotationsJs = require('../build/apey-eye/Annotations.js');

var Annotations = _interopRequireWildcard(_buildApeyEyeAnnotationsJs);

var _buildApeyEyeGenericResourceJs = require('../build/apey-eye/GenericResource.js');

var _buildApeyEyeGenericResourceJs2 = _interopRequireDefault(_buildApeyEyeGenericResourceJs);

var _buildApeyEyeRethinkDBModelJs = require('../build/apey-eye/RethinkDBModel.js');

var _buildApeyEyeRethinkDBModelJs2 = _interopRequireDefault(_buildApeyEyeRethinkDBModelJs);

var _buildApeyEyeInputJs = require('../build/apey-eye/Input.js');

var _buildApeyEyeInputJs2 = _interopRequireDefault(_buildApeyEyeInputJs);

var _buildApeyEyeModelRegisterJs = require('../build/apey-eye/ModelRegister.js');

var _buildApeyEyeModelRegisterJs2 = _interopRequireDefault(_buildApeyEyeModelRegisterJs);

var _buildApeyEyeModelsRoleModelJs = require('../build/apey-eye/models/RoleModel.js');

var _buildApeyEyeModelsRoleModelJs2 = _interopRequireDefault(_buildApeyEyeModelsRoleModelJs);

var _buildApeyEyeModelsUserModelJs = require('../build/apey-eye/models/UserModel.js');

var _buildApeyEyeModelsUserModelJs2 = _interopRequireDefault(_buildApeyEyeModelsUserModelJs);

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
        _buildApeyEyeModelRegisterJs2['default'].empty();

        var restaurantInput = new _buildApeyEyeInputJs2['default']({
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
        })(_buildApeyEyeRethinkDBModelJs2['default']);

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
        })(_buildApeyEyeGenericResourceJs2['default']);

        var router = new _buildApeyEyeRoutersHapiGenericRouterJs2['default']();
        router.register([{
            path: 'restaurant',
            resource: RestaurantResource
        }]);

        server = new _hapi2['default'].Server({
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
                _buildApeyEyeModelRegisterJs2['default'].register('role', _buildApeyEyeModelsRoleModelJs2['default']);
                _buildApeyEyeModelRegisterJs2['default'].register('user', _buildApeyEyeModelsUserModelJs2['default']);
                try {
                    var role = yield _buildApeyEyeModelsRoleModelJs2['default'].fetchOne({ id: 'admin' });
                } catch (e) {
                    var role = yield new _buildApeyEyeModelsRoleModelJs2['default']({ data: { id: 'admin' } });
                }
                userData = {
                    username: 'userTest' + _shortid2['default'].generate(),
                    password: 'userPassword',
                    role: 'admin'
                };
                yield new _buildApeyEyeModelsUserModelJs2['default']({ data: userData });
            }));
            it('Fetch', _asyncToGenerator(function* () {
                var list = yield (0, _requestPromise2['default'])({ url: server.info.uri + '/classes/restaurant/', json: true });
                expect(list).to.not.be.undefined;
                expect(list).to.be['instanceof'](Array);
            }));
            it('POST and Fetch', _asyncToGenerator(function* () {
                var restaurantData = { name: 'restaurantName' };

                var obj = yield _requestPromise2['default'].post({
                    url: server.info.uri + '/classes/restaurant/',
                    json: true,
                    body: restaurantData
                });

                expect(obj).to.not.be.undefined;
                expect(obj.id).to.not.be.undefined;
                expect(obj.name).to.equal(restaurantData.name);

                var obj2 = yield _requestPromise2['default'].get({
                    url: server.info.uri + '/classes/restaurant/' + obj.id,
                    json: true
                });

                expect(obj).to.deep.equal(obj2);

                expect(_requestPromise2['default'].patch({
                    url: server.info.uri + '/classes/restaurant/' + obj.id,
                    json: true
                })).to.be.rejected;
            }));
            it('Test instance action', _asyncToGenerator(function* () {
                var restaurantData = { name: 'restaurantName', phone: 123123 };

                var obj = yield _requestPromise2['default'].post({
                    url: server.info.uri + '/classes/restaurant/',
                    json: true,
                    body: restaurantData
                });

                var resultAction = yield _requestPromise2['default'].get({
                    url: server.info.uri + '/classes/restaurant/' + obj.id + '/name/',
                    json: true,
                    body: restaurantData
                });
                expect(resultAction).to.deep.equal({ name: restaurantData.name });
            }));
            it('Test autentication basic fails', _asyncToGenerator(function* () {
                var restaurantData = { name: 'restaurantName', phone: 123123 };

                var obj = yield _requestPromise2['default'].post({
                    url: server.info.uri + '/classes/restaurant/',
                    json: true,
                    body: restaurantData
                });

                expect(_requestPromise2['default'].del({
                    url: server.info.uri + '/classes/restaurant/' + obj.id
                })).to.be.rejected;
            }));
            it('Test autentication basic succeeds ', _asyncToGenerator(function* () {

                var restaurantData = { name: 'restaurantName', phone: 123123 };

                var obj = yield _requestPromise2['default'].post({
                    url: server.info.uri + '/classes/restaurant/',
                    json: true,
                    body: restaurantData
                });

                expect(_requestPromise2['default'].del(server.info.uri + '/classes/restaurant/' + obj.id)).to.be.rejected;
                expect(_requestPromise2['default'].del(server.info.uri + '/classes/restaurant/' + obj.id).auth(userData.username, 'invalidPassword' + _shortid2['default'].generate(), true)).to.be.rejected;
                expect(_requestPromise2['default'].del(server.info.uri + '/classes/restaurant/' + obj.id).auth('invalidUsername' + _shortid2['default'].generate(), userData.password, true)).to.be.rejected;
                expect(_requestPromise2['default'].del(server.info.uri + '/classes/restaurant/' + obj.id).auth(userData.username, userData.password, true)).to.be.fulfilled;
            }));

            it('Test autentication local fails', _asyncToGenerator(function* () {
                var restaurantData = { name: 'restaurantName', phone: 123123 };

                var obj = yield _requestPromise2['default'].post({
                    url: server.info.uri + '/classes/restaurant/',
                    json: true,
                    body: restaurantData
                });

                expect(_requestPromise2['default'].del({
                    url: server.info.uri + '/classes/restaurant/'
                })).to.be.rejected;
            }));
            it('Test autentication local succeeds ', _asyncToGenerator(function* () {

                var restaurantData = { name: 'restaurantName', phone: 123123 };

                var obj = yield _requestPromise2['default'].post({
                    url: server.info.uri + '/classes/restaurant/',
                    json: true,
                    body: restaurantData
                });

                expect(_requestPromise2['default'].del({
                    uri: server.info.uri + '/classes/restaurant/' })).to.be.rejected;

                expect(_requestPromise2['default'].del({
                    uri: server.info.uri + '/classes/restaurant/',
                    qs: {
                        username: _shortid2['default'].generate(),
                        password: userData.password
                    }
                })).to.be.rejected;

                expect(_requestPromise2['default'].del({
                    uri: server.info.uri + '/classes/restaurant/',
                    qs: {
                        username: userData.username,
                        password: _shortid2['default'].generate()
                    }
                })).to.be.rejected;

                expect(_requestPromise2['default'].del({
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
                expect((0, _requestPromise2['default'])({ url: server.info.uri + ('/classes/' + resourceName + '/'), json: true })).to.be.rejected;
            }));
            it('POST and Fetch', _asyncToGenerator(function* () {
                var resourceName = _shortid2['default'].generate();
                expect((0, _requestPromise2['default'])({ url: server.info.uri + ('/classes/' + resourceName + '/'), json: true })).to.be.rejected;

                var restaurantData = { name: 'restaurantName' };

                var obj = yield _requestPromise2['default'].post({
                    url: server.info.uri + ('/classes/' + resourceName + '/'),
                    json: true,
                    body: restaurantData
                });

                expect(obj).to.not.be.undefined;
                expect(obj.id).to.not.be.undefined;
                expect(obj.name).to.equal(restaurantData.name);

                var obj2 = yield _requestPromise2['default'].get({
                    url: server.info.uri + ('/classes/' + resourceName + '/') + obj.id,
                    json: true
                });

                expect(obj).to.deep.equal(obj2);

                expect((0, _requestPromise2['default'])({ url: server.info.uri + ('/classes/' + resourceName + '/'), json: true })).to.be.fulfilled;
            }));
        });
    });
});