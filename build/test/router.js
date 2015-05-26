'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

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

var _HapiRouter = require('../lib/routers/HapiRouter.js');

var _HapiRouter2 = _interopRequireWildcard(_HapiRouter);

var _KoaRouter = require('../lib/routers/KoaRouter.js');

var _KoaRouter2 = _interopRequireWildcard(_KoaRouter);

var _BaseRouter = require('../lib/BaseRouter.js');

var _BaseRouter2 = _interopRequireWildcard(_BaseRouter);

var _import = require('../lib/Annotations.js');

var Annotations = _interopRequireWildcard(_import);

var _GenericResource4 = require('../lib/GenericResource.js');

var _GenericResource5 = _interopRequireWildcard(_GenericResource4);

var _RethinkDBModel4 = require('../lib/RethinkDBModel.js');

var _RethinkDBModel5 = _interopRequireWildcard(_RethinkDBModel4);

var _Input = require('../lib/Input.js');

var _Input2 = _interopRequireWildcard(_Input);

var _ModelRegister = require('../lib/ModelRegister.js');

var _ModelRegister2 = _interopRequireWildcard(_ModelRegister);

require('mochawait');

_chai2['default'].use(_chaiAsPromised2['default']);
_chai2['default'].should();
_chai2['default'].use(_chaiThings2['default']);

var expect = _chai2['default'].expect,
    assert = _chai2['default'].assert,
    should = _chai2['default'].should;

describe('Router', function () {

    describe('Base Router', function () {
        var TestResource = undefined;

        before(function (done) {
            _ModelRegister2['default'].empty();

            var restaurantInput = new _Input2['default']({
                name: { type: 'string', required: true },
                address: { type: 'string', required: true },
                phone: { type: 'number' },
                photo: { type: 'string', regex: _Input2['default'].URLPattern },
                date: { type: 'date' },
                location: { type: 'string' },
                language: { type: 'string', choices: ['PT', 'EN'] }
            });

            var TestModel = (function (_RethinkDBModel) {
                function TestModel() {
                    _classCallCheck(this, _TestModel);

                    if (_RethinkDBModel != null) {
                        _RethinkDBModel.apply(this, arguments);
                    }
                }

                _inherits(TestModel, _RethinkDBModel);

                var _TestModel = TestModel;
                TestModel = Annotations.Output({
                    _fields: ['id', 'name', 'address', 'phone', 'date'],
                    _embedded: ['schedule', 'products']
                })(TestModel) || TestModel;
                TestModel = Annotations.Query({
                    _sort: ['name', '-address'],
                    _filter: { name: 'name', phone: 20 },
                    _page_size: 10
                })(TestModel) || TestModel;
                TestModel = Annotations.Name('restaurant')(TestModel) || TestModel;
                TestModel = Annotations.Input(restaurantInput)(TestModel) || TestModel;
                return TestModel;
            })(_RethinkDBModel5['default']);

            var TestResourceClass = (function (_GenericResource) {
                function TestResourceClass() {
                    _classCallCheck(this, _TestResourceClass);

                    if (_GenericResource != null) {
                        _GenericResource.apply(this, arguments);
                    }
                }

                _inherits(TestResourceClass, _GenericResource);

                var _TestResourceClass = TestResourceClass;
                TestResourceClass = Annotations.Name('testResourceName')(TestResourceClass) || TestResourceClass;
                TestResourceClass = Annotations.Model(TestModel)(TestResourceClass) || TestResourceClass;
                return TestResourceClass;
            })(_GenericResource5['default']);

            TestResource = TestResourceClass;

            done();
        });

        it('Get Resource Method', function () {
            expect(_BaseRouter2['default'].getResourceMethod(false, 'POST', TestResource)).to.deep.equal(TestResource);
            expect(_BaseRouter2['default'].getResourceMethod(true, 'GET', TestResource)).to.deep.equal(TestResource.fetchOne);
            expect(_BaseRouter2['default'].getResourceMethod(false, 'GET', TestResource)).to.deep.equal(TestResource.fetch);
            expect(_BaseRouter2['default'].getResourceMethod(true, 'DELETE', TestResource)).to.deep.equal(TestResource.prototype['delete']);
            expect(_BaseRouter2['default'].getResourceMethod(true, 'PATCH', TestResource)).to.deep.equal(TestResource.prototype.patch);
        });
        it('Parse Request', function () {
            var request = {
                query: {},
                headers: {}
            };

            expect(_BaseRouter2['default'].parseRequest(request)).to.deep.equal({
                _filter: undefined,
                _sort: undefined,
                _pagination: undefined,
                _fields: undefined,
                _embedded: undefined,
                _format: undefined,
                _mediaType: undefined
            });
        });
        it('Parse Filters', function () {
            var validFilters = '{"name":"restaurantName"}',
                invalidFilters = '{name: "restaurantName"}';

            expect(_BaseRouter2['default'].parseFilters(validFilters)).to.deep.equal({ name: 'restaurantName' });
            expect(_BaseRouter2['default'].parseFilters(invalidFilters)).to.equal(undefined);
        });
        it('Parse Sort', function () {
            var validSort = '["-name","address"]',
                invalidSort = '[123,"address"]',
                invalidSort2 = '[123,{name: "restaurantName"}]',
                invalidSort3 = '{"name": "restaurantName"}';

            expect(_BaseRouter2['default'].parseSort(validSort)).to.deep.equal([{ name: -1 }, { address: 1 }]);
            expect(_BaseRouter2['default'].parseSort(invalidSort)).to.equal(undefined);
            expect(_BaseRouter2['default'].parseSort(invalidSort2)).to.equal(undefined);
            expect(_BaseRouter2['default'].parseSort(invalidSort3)).to.equal(undefined);
        });
        it('Parse Pagination', function () {
            var validPage = '1',
                invalidPage = '{"page": 1}',
                validPageSize = '10',
                invalidPageSize = '{"pageSize": 10}';

            expect(_BaseRouter2['default'].parsePagination(validPage, validPageSize)).to.deep.equal({ _page: 1, _page_size: 10 });
            expect(_BaseRouter2['default'].parsePagination(invalidPage, invalidPageSize)).to.equal(undefined);
            expect(_BaseRouter2['default'].parsePagination(undefined, undefined)).to.equal(undefined);
            expect(_BaseRouter2['default'].parsePagination(validPage, undefined)).to.deep.equal({ _page: 1, _page_size: undefined });
            expect(_BaseRouter2['default'].parsePagination(undefined, validPageSize)).to.deep.equal({ _page: undefined, _page_size: 10 });
        });
        it('Parse Fields', function () {
            var validFields = '["name","address"]',
                invalidFields = '[123,"address"]',
                invalidFields2 = '[123,{name: "restaurantName"}]',
                invalidFields3 = '{"name": "restaurantName"}';

            expect(_BaseRouter2['default'].parseFields(validFields)).to.deep.equal(['name', 'address']);
            expect(_BaseRouter2['default'].parseFields(invalidFields)).to.equal(undefined);
            expect(_BaseRouter2['default'].parseFields(invalidFields2)).to.equal(undefined);
            expect(_BaseRouter2['default'].parseFields(invalidFields3)).to.equal(undefined);
        });
        it('Parse Embedded', function () {
            var validEmbedded = '["name","address"]',
                invalidEmbedded = '[123,"address"]',
                invalidEmbedded2 = '[123,{name: "restaurantName"}]',
                invalidEmbedded3 = '{"name": "restaurantName"}';

            expect(_BaseRouter2['default'].parseEmbedded(validEmbedded)).to.deep.equal(['name', 'address']);
            expect(_BaseRouter2['default'].parseEmbedded(invalidEmbedded)).to.equal(undefined);
            expect(_BaseRouter2['default'].parseEmbedded(invalidEmbedded2)).to.equal(undefined);
            expect(_BaseRouter2['default'].parseEmbedded(invalidEmbedded3)).to.equal(undefined);
        });
        it('Parse Format', function () {
            var validFormat = 'application/json',
                invalidFormat = { format: 'application/json' };

            expect(_BaseRouter2['default'].parseFormat(validFormat)).to.equal('application/json');
            expect(_BaseRouter2['default'].parseFormat(invalidFormat)).to.equal(undefined);
        });
    });
    describe('Router Hapi', function () {
        var TestResource = undefined,
            router = undefined;
        before(function (done) {
            _ModelRegister2['default'].empty();

            router = new _HapiRouter2['default']();

            var restaurantInput = new _Input2['default']({
                name: { type: 'string', required: true },
                address: { type: 'string', required: true },
                phone: { type: 'number' },
                photo: { type: 'string', regex: _Input2['default'].URLPattern },
                date: { type: 'date' },
                location: { type: 'string' },
                language: { type: 'string', choices: ['PT', 'EN'] }
            });

            var TestModel = (function (_RethinkDBModel2) {
                function TestModel() {
                    _classCallCheck(this, _TestModel2);

                    if (_RethinkDBModel2 != null) {
                        _RethinkDBModel2.apply(this, arguments);
                    }
                }

                _inherits(TestModel, _RethinkDBModel2);

                var _TestModel2 = TestModel;
                TestModel = Annotations.Output({
                    _fields: ['id', 'name', 'address', 'phone', 'date'],
                    _embedded: ['schedule', 'products']
                })(TestModel) || TestModel;
                TestModel = Annotations.Query({
                    _sort: ['name', '-address'],
                    _filter: { name: 'name', phone: 20 },
                    _page_size: 10
                })(TestModel) || TestModel;
                TestModel = Annotations.Name('restaurant')(TestModel) || TestModel;
                TestModel = Annotations.Input(restaurantInput)(TestModel) || TestModel;
                return TestModel;
            })(_RethinkDBModel5['default']);

            var TestResourceClass = (function (_GenericResource2) {
                function TestResourceClass() {
                    _classCallCheck(this, _TestResourceClass2);

                    if (_GenericResource2 != null) {
                        _GenericResource2.apply(this, arguments);
                    }
                }

                _inherits(TestResourceClass, _GenericResource2);

                var _TestResourceClass2 = TestResourceClass;
                TestResourceClass = Annotations.Name('testResourceName')(TestResourceClass) || TestResourceClass;
                TestResourceClass = Annotations.Model(TestModel)(TestResourceClass) || TestResourceClass;
                return TestResourceClass;
            })(_GenericResource5['default']);

            TestResource = TestResourceClass;

            done();
        });
        beforeEach(function (done) {
            router.entries = {};
            done();
        });

        it('Router register errors', function () {

            expect(function () {
                router.register();
            }).to['throw'](Error);

            expect(function () {
                router.register([]);
            }).to.not['throw'](Error);

            expect(function () {
                router.register(TestResource);
            }).to['throw'](Error);

            expect(function () {
                router.register('TestResource');
            }).to['throw'](Error);

            expect(function () {
                router.register([{
                    path: 'path',
                    resource: 'TestResource'
                }]);
            }).to['throw'](Error);

            expect(function () {
                router.register([{
                    path: 'path',
                    resource: TestResource
                }]);
            }).to.not['throw'](Error);
            expect(function () {
                router.register([{
                    resource: TestResource
                }]);
            }).to.not['throw'](Error);

            expect(function () {
                router.register([{
                    path: 123,
                    resource: TestResource
                }]);
            }).to['throw'](Error);
            expect(function () {
                router.register([{
                    path: { path: 'pathInvalid' },
                    resource: TestResource
                }]);
            }).to['throw'](Error);
        });
        it('Router register resources', function () {
            router.register([{
                resource: TestResource
            }]);

            expect(Object.keys(router.entries).length).to.equal(1);
            expect(TestResource.getName()).to.equal('testResourceName');
            expect(Object.keys(router.entries)[0]).to.equal('testResourceName');
            expect(router.entries.testResourceName).to.deep.equal(TestResource);
        });
    });
    describe('Router Koa', function () {
        var TestResource = undefined,
            router = undefined;
        before(function (done) {
            _ModelRegister2['default'].empty();

            router = new _KoaRouter2['default']();

            var restaurantInput = new _Input2['default']({
                name: { type: 'string', required: true },
                address: { type: 'string', required: true },
                phone: { type: 'number' },
                photo: { type: 'string', regex: _Input2['default'].URLPattern },
                date: { type: 'date' },
                location: { type: 'string' },
                language: { type: 'string', choices: ['PT', 'EN'] }
            });

            var TestModel = (function (_RethinkDBModel3) {
                function TestModel() {
                    _classCallCheck(this, _TestModel3);

                    if (_RethinkDBModel3 != null) {
                        _RethinkDBModel3.apply(this, arguments);
                    }
                }

                _inherits(TestModel, _RethinkDBModel3);

                var _TestModel3 = TestModel;
                TestModel = Annotations.Output({
                    _fields: ['id', 'name', 'address', 'phone', 'date'],
                    _embedded: ['schedule', 'products']
                })(TestModel) || TestModel;
                TestModel = Annotations.Query({
                    _sort: ['name', '-address'],
                    _filter: { name: 'name', phone: 20 },
                    _page_size: 10
                })(TestModel) || TestModel;
                TestModel = Annotations.Name('restaurant')(TestModel) || TestModel;
                TestModel = Annotations.Input(restaurantInput)(TestModel) || TestModel;
                return TestModel;
            })(_RethinkDBModel5['default']);

            var TestResourceClass = (function (_GenericResource3) {
                function TestResourceClass() {
                    _classCallCheck(this, _TestResourceClass3);

                    if (_GenericResource3 != null) {
                        _GenericResource3.apply(this, arguments);
                    }
                }

                _inherits(TestResourceClass, _GenericResource3);

                var _TestResourceClass3 = TestResourceClass;
                TestResourceClass = Annotations.Name('testResourceName')(TestResourceClass) || TestResourceClass;
                TestResourceClass = Annotations.Model(TestModel)(TestResourceClass) || TestResourceClass;
                return TestResourceClass;
            })(_GenericResource5['default']);

            TestResource = TestResourceClass;

            done();
        });
        beforeEach(function (done) {
            router.entries = {};
            done();
        });

        it('Router register errors', function () {

            expect(function () {
                router.register();
            }).to['throw'](Error);

            expect(function () {
                router.register([]);
            }).to.not['throw'](Error);

            expect(function () {
                router.register(TestResource);
            }).to['throw'](Error);

            expect(function () {
                router.register('TestResource');
            }).to['throw'](Error);

            expect(function () {
                router.register([{
                    path: 'path',
                    resource: 'TestResource'
                }]);
            }).to['throw'](Error);

            expect(function () {
                router.register([{
                    path: 'path',
                    resource: TestResource
                }]);
            }).to.not['throw'](Error);
            expect(function () {
                router.register([{
                    resource: TestResource
                }]);
            }).to.not['throw'](Error);

            expect(function () {
                router.register([{
                    path: 123,
                    resource: TestResource
                }]);
            }).to['throw'](Error);
            expect(function () {
                router.register([{
                    path: { path: 'pathInvalid' },
                    resource: TestResource
                }]);
            }).to['throw'](Error);
        });
        it('Router register resources', function () {
            router.register([{
                resource: TestResource
            }]);

            expect(Object.keys(router.entries).length).to.equal(1);
            expect(TestResource.getName()).to.equal('testResourceName');
            expect(Object.keys(router.entries)[0]).to.equal('testResourceName');
            expect(router.entries.testResourceName).to.deep.equal(TestResource);
        });
    });
});