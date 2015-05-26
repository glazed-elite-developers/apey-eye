'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _asyncToGenerator = function (fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (initializers) initializers[key] = descriptor.initializer; } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/**
 * Created by Filipe on 11/03/2015.
 */

var _chai = require('chai');

var _chai2 = _interopRequireWildcard(_chai);

var _chaiAsPromised = require('chai-as-promised');

var _chaiAsPromised2 = _interopRequireWildcard(_chaiAsPromised);

var _import = require('underscore');

var _import2 = _interopRequireWildcard(_import);

var _DefaultProperties = require('../lib/DefaultProperties.js');

var _DefaultProperties2 = _interopRequireWildcard(_DefaultProperties);

var _Model4 = require('../lib/Model.js');

var _Model5 = _interopRequireWildcard(_Model4);

var _RethinkDBModel2 = require('../lib/RethinkDBModel.js');

var _RethinkDBModel3 = _interopRequireWildcard(_RethinkDBModel2);

var _import3 = require('../lib/Annotations.js');

var Annotations = _interopRequireWildcard(_import3);

var _Input = require('../lib/Input.js');

var _Input2 = _interopRequireWildcard(_Input);

var _ModelRegister = require('../lib/ModelRegister.js');

var _ModelRegister2 = _interopRequireWildcard(_ModelRegister);

require('mochawait');

_chai2['default'].use(_chaiAsPromised2['default']);

var expect = _chai2['default'].expect,
    assert = _chai2['default'].assert,
    should = _chai2['default'].should;

describe('Models', function () {

            var restaurantInput, restaurantInput2;

            before(function () {
                        restaurantInput = new _Input2['default']({
                                    name: { type: 'string', required: true },
                                    address: { type: 'string', required: true },
                                    phone: { type: 'number' },
                                    photo: { type: 'string', regex: _Input2['default'].URLPattern },
                                    date: { type: 'date' },
                                    location: { type: 'string' },
                                    language: { type: 'string', choices: ['PT', 'EN'] }
                        });

                        restaurantInput2 = new _Input2['default']({
                                    name: { type: 'string', required: true },
                                    address: { type: 'string', required: true },
                                    phone: { type: 'number' }
                        });
            });

            beforeEach(function () {
                        _ModelRegister2['default'].empty();
            });

            describe('Model Declaration', function () {
                        it('should access annotations properties from models', function () {
                                    var TestModel = (function (_Model) {
                                                function TestModel() {
                                                            _classCallCheck(this, _TestModel);

                                                            if (_Model != null) {
                                                                        _Model.apply(this, arguments);
                                                            }
                                                }

                                                _inherits(TestModel, _Model);

                                                var _TestModel = TestModel;
                                                TestModel = Annotations.Name('dataTableName')(TestModel) || TestModel;
                                                TestModel = Annotations.Input(restaurantInput)(TestModel) || TestModel;
                                                return TestModel;
                                    })(_Model5['default']);

                                    assert.isDefined(TestModel.annotations);
                                    assert.isObject(TestModel.annotations);

                                    expect(Object.keys(TestModel.annotations).length).to.equal(2);
                                    assert.isDefined(TestModel.getInput());
                                    assert.isDefined(TestModel.getInput());

                                    expect(TestModel.getInput().properties).to.have.property('address');
                                    expect(TestModel.getInput().properties).to.have.deep.property('address.type', 'string');
                                    expect(TestModel.getInput().properties).to.have.deep.property('phone.type', 'number');
                        });
                        it('shouln\'t have the same properties in methods and in class', function () {
                                    var TestModel = (function (_Model2) {
                                                function TestModel() {
                                                            _classCallCheck(this, _TestModel2);

                                                            if (_Model2 != null) {
                                                                        _Model2.apply(this, arguments);
                                                            }
                                                }

                                                _inherits(TestModel, _Model2);

                                                var _TestModel2 = TestModel;

                                                _createDecoratedClass(_TestModel2, null, [{
                                                            key: 'list',
                                                            decorators: [Annotations.Input(restaurantInput2)],
                                                            value: function list() {}
                                                }, {
                                                            key: 'post',
                                                            value: function post() {}
                                                }, {
                                                            key: 'get',
                                                            decorators: [Annotations.Input(restaurantInput)],
                                                            value: function get() {}
                                                }]);

                                                TestModel = Annotations.Name('dataTableName')(TestModel) || TestModel;
                                                TestModel = Annotations.Input(restaurantInput)(TestModel) || TestModel;
                                                return TestModel;
                                    })(_Model5['default']);

                                    assert.isDefined(TestModel.annotations);
                                    assert.isObject(TestModel.annotations);

                                    expect(Object.keys(TestModel.annotations).length).to.equal(2);

                                    assert.isDefined(TestModel.list.annotations);
                                    assert.isUndefined(TestModel.post.annotations);

                                    expect(TestModel.getInput()).to.deep.equal(TestModel.getInput(TestModel.post));
                                    expect(TestModel.getInput()).to.not.deep.equal(TestModel.getInput(TestModel.list));
                        });
            });
            describe('Model properties', function () {

                        var TestModel;
                        before(function (done) {
                                    var TestModelClass = (function (_RethinkDBModel) {
                                                function TestModelClass() {
                                                            _classCallCheck(this, _TestModelClass);

                                                            if (_RethinkDBModel != null) {
                                                                        _RethinkDBModel.apply(this, arguments);
                                                            }
                                                }

                                                _inherits(TestModelClass, _RethinkDBModel);

                                                var _TestModelClass = TestModelClass;
                                                TestModelClass = Annotations.Output({
                                                            _fields: ['id', 'name', 'address', 'phone', 'date'],
                                                            _embedded: ['schedule', 'products']
                                                })(TestModelClass) || TestModelClass;
                                                TestModelClass = Annotations.Query({
                                                            _sort: ['name', '-address'],
                                                            _filter: { name: 'name', phone: 20 },
                                                            _page_size: 10
                                                })(TestModelClass) || TestModelClass;
                                                TestModelClass = Annotations.Name('restaurant')(TestModelClass) || TestModelClass;
                                                TestModelClass = Annotations.Input(restaurantInput)(TestModelClass) || TestModelClass;
                                                return TestModelClass;
                                    })(_RethinkDBModel3['default']);

                                    TestModel = TestModelClass;

                                    //done();
                        });

                        it('Model.joinRequest properties should join model properties with request properties', function () {

                                    var resourceProperties = {
                                                _sort: ['name'],
                                                _filter: { address: 'Rua Costa Cabral' },
                                                _pagination: { _page_size: 12 },
                                                _fields: ['name', 'language', 'phone'],
                                                _embedded: ['schedule']
                                    };
                                    var modelProperties = _import2['default'].extend(TestModel.getOutput(), TestModel.getQuery());

                                    var joinedProperties = TestModel.joinProperties(resourceProperties);
                                    expect(modelProperties).to.not.deep.equal(joinedProperties);
                                    expect(joinedProperties._sort).to.deep.equal(['name']);
                                    expect(joinedProperties._filter).to.deep.equal({ name: 'name', phone: 20, address: 'Rua Costa Cabral' });
                                    expect(joinedProperties._pagination._page_size).to.deep.equal(10);
                                    expect(joinedProperties._fields).to.deep.equal(['name', 'phone']);
                                    expect(joinedProperties._embedded).to.deep.equal(['schedule']);
                        });
                        it('Model.joinRequest properties should join model properties with request properties', function () {
                                    var TestModel = (function (_Model3) {
                                                function TestModel(executor) {
                                                            _classCallCheck(this, _TestModel3);

                                                            _get(Object.getPrototypeOf(_TestModel3.prototype), 'constructor', this).call(this, executor);
                                                }

                                                _inherits(TestModel, _Model3);

                                                var _TestModel3 = TestModel;
                                                TestModel = Annotations.Output({
                                                            _embedded: ['schedule', 'products']
                                                })(TestModel) || TestModel;
                                                TestModel = Annotations.Query({
                                                            _filter: { address: 'Rua Sousa Aroso' },
                                                            _sort: ['name', '-address']
                                                })(TestModel) || TestModel;
                                                TestModel = Annotations.Name('restaurant')(TestModel) || TestModel;
                                                TestModel = Annotations.Input(restaurantInput)(TestModel) || TestModel;
                                                return TestModel;
                                    })(_Model5['default']);

                                    var resourceProperties = {
                                                _filter: { address: 'Rua Costa Cabral' },
                                                _pagination: { _page_size: 12 },
                                                _fields: ['name', 'language', 'phone']
                                    };
                                    var modelProperties = _import2['default'].extend(TestModel.getOutput(), TestModel.getQuery());

                                    var joinedProperties = TestModel.joinProperties(resourceProperties);

                                    expect(modelProperties).to.not.deep.equal(joinedProperties);
                                    expect(joinedProperties._sort).to.deep.equal([{ name: 1 }, { address: -1 }]);
                                    expect(joinedProperties._filter).to.deep.equal({ address: 'Rua Sousa Aroso' });
                                    expect(joinedProperties._pagination._page_size).to.deep.equal(12);
                                    expect(joinedProperties._pagination._page).to.deep.equal(1);
                                    expect(joinedProperties._fields).to.deep.equal(['name', 'language', 'phone']);
                                    expect(joinedProperties._embedded).to.deep.equal(['schedule', 'products']);
                        });

                        it('Model.fetch returns an array', function () {

                                    return TestModel.fetch().then(function (list) {
                                                expect(list).to.be.instanceOf(Array);
                                                expect(list).to.have.length.below(11);
                                    });
                        });
                        it('Model.fetch returns a serialized array ', function () {
                                    return TestModel.fetch().then(function (list) {
                                                list.should.all.contain.keys('id', 'obj', 'oldObj', 'put', 'patch', 'delete');
                                    });
                        });
                        it('Model.post returns an object', function () {

                                    var data = {
                                                name: 'restaurantName',
                                                address: 'restaurantAddress',
                                                phone: 9492123
                                    };

                                    return new TestModel({ data: data }).then(function (obj) {
                                                expect(obj.obj).to.be.instanceOf(Object);
                                                expect(obj.obj).to.have.property('address');
                                                expect(obj.obj).to.have.property('phone');
                                                expect(obj.obj).to.have.property('name');
                                    });
                        });
                        it('Model.post invalid data may return an exception', _asyncToGenerator(function* () {

                                    var data = {
                                                name: 'restaurantName',
                                                address: 'restaurantAddress',
                                                phone: 9492123
                                    };

                                    var invalidData1 = {
                                                name: 123,
                                                address: 'restaurantAddress',
                                                phone: 9492123
                                    };

                                    var invalidData2 = {
                                                name: 'restaurantName',
                                                address: 'restaurantAddress',
                                                phone: 'invalidPhone'
                                    };

                                    expect(new TestModel({ data: data })).to.be.fulfilled;
                                    expect(new TestModel({ data: invalidData1 })).to.be.rejected;
                                    expect(new TestModel({ data: invalidData2 })).to.be.rejected;
                        }));
                        it('Model.fetchOne for a before inserted object returns the same object', _asyncToGenerator(function* () {

                                    var data = {
                                                name: 'restaurantName',
                                                address: 'restaurantAddress',
                                                phone: 9492123
                                    };
                                    var postedObject = yield new TestModel({ data: data });
                                    var obj = yield TestModel.fetchOne({ id: postedObject.obj.id });

                                    expect(obj.obj).to.deep.equal(postedObject.obj);
                        }));
                        it('Model.put replace an object inserted before', _asyncToGenerator(function* () {

                                    var data = {
                                                name: 'restaurantName',
                                                address: 'restaurantAddress',
                                                phone: 9492123
                                    };

                                    var obj = yield new TestModel({ data: data });
                                    yield obj.put({ data: { name: 'restaurantName2', address: 'Rua Costa Cabral' } });

                                    expect(obj.obj).to.not.have.property('phone');
                                    expect(obj.obj).to.have.property('name', 'restaurantName2');
                                    expect(obj.obj).to.have.property('address', 'Rua Costa Cabral');
                        }));
                        it('Model.patch update an object inserted before', _asyncToGenerator(function* () {

                                    var data = {
                                                name: 'restaurantName',
                                                address: 'restaurantAddress',
                                                phone: 9492123
                                    };

                                    var obj = yield new TestModel({ data: data });
                                    yield obj.patch({ data: { name: 'restaurantName2', address: 'Rua Costa Cabral' } });

                                    expect(obj.obj).to.have.property('phone', 9492123);
                                    expect(obj.obj).to.have.property('name', 'restaurantName2');
                                    expect(obj.obj).to.have.property('address', 'Rua Costa Cabral');
                        }));
                        it('Model.delete delete an object from database, so it is impossible to access him again', _asyncToGenerator(function* () {

                                    var data = {
                                                name: 'restaurantName',
                                                address: 'restaurantAddress',
                                                phone: 9492123
                                    };
                                    var obj = yield new TestModel({ data: data });
                                    var res = yield obj['delete']();

                                    expect(res).to.be['true'];
                                    expect(TestModel.fetchOne({ id: obj.id })).to.eventually['throw']();
                        }));
                        it('Model.save  makes a patch with object .obj data', _asyncToGenerator(function* () {

                                    var data = {
                                                name: 'restaurantName',
                                                address: 'restaurantAddress',
                                                phone: 9492123
                                    };

                                    var obj = yield new TestModel({ data: data });

                                    obj.obj.name = 'restaurantName2';
                                    obj.obj.address = 'Rua Costa Cabral';

                                    expect(obj.oldObj).to.have.property('name', 'restaurantName');
                                    expect(obj.oldObj).to.have.property('address', 'restaurantAddress');

                                    yield obj.save();

                                    expect(obj.obj).to.have.property('phone', 9492123);
                                    expect(obj.obj).to.have.property('name', 'restaurantName2');
                                    expect(obj.obj).to.have.property('address', 'Rua Costa Cabral');

                                    expect(obj.oldObj).to.have.property('name', 'restaurantName2');
                                    expect(obj.oldObj).to.have.property('address', 'Rua Costa Cabral');
                        }));

                        it('Model.save  with invalid data may throw exceptions', _asyncToGenerator(function* () {

                                    var data = {
                                                name: 'restaurantName',
                                                address: 'restaurantAddress',
                                                phone: 9492123
                                    };

                                    var obj = yield new TestModel({ data: data });
                                    obj.obj.name = 'restaurantName2';
                                    obj.obj.address = 123123;

                                    expect(obj.save()).to.eventually['throw']();

                                    obj.obj.address = 'restaurantAddress';

                                    expect(obj.save()).to.eventually.not['throw']();
                        }));
                        it('Operations that returns the object may receive object with only a set of fields', _asyncToGenerator(function* () {

                                    var data = {
                                                name: 'restaurantName',
                                                address: 'restaurantAddress',
                                                phone: 9492123
                                    };

                                    var obj = yield new TestModel({ data: data });

                                    expect(obj.obj).to.have.keys('id', 'name', 'address', 'phone');

                                    obj = yield new TestModel({ data: data, resourceProperties: { _fields: ['id', 'name'] } });

                                    expect(obj.obj).to.have.keys('id', 'name');

                                    yield obj.patch({
                                                data: { name: 'restaurantName2', address: 'Rua Costa Cabral' },
                                                resourceProperties: { _fields: ['id'] }
                                    });

                                    expect(obj.obj).to.not.have.keys('id', 'name', 'address', 'phone');
                                    expect(obj.obj).to.have.keys('id');
                        }));
            });
});