/**
 * Created by Filipe on 11/03/2015.
 */
'use strict';

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

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

require('mochawait');

var _buildApeyEyeDefaultPropertiesJs = require('../build/apey-eye/DefaultProperties.js');

var _buildApeyEyeDefaultPropertiesJs2 = _interopRequireDefault(_buildApeyEyeDefaultPropertiesJs);

var _buildApeyEyeModelJs = require('../build/apey-eye/Model.js');

var _buildApeyEyeModelJs2 = _interopRequireDefault(_buildApeyEyeModelJs);

var _buildApeyEyeRethinkDBModelJs = require('../build/apey-eye/RethinkDBModel.js');

var _buildApeyEyeRethinkDBModelJs2 = _interopRequireDefault(_buildApeyEyeRethinkDBModelJs);

var _buildApeyEyeResourceJs = require('../build/apey-eye/Resource.js');

var _buildApeyEyeResourceJs2 = _interopRequireDefault(_buildApeyEyeResourceJs);

var _buildApeyEyeGenericResourceJs = require('../build/apey-eye/GenericResource.js');

var _buildApeyEyeGenericResourceJs2 = _interopRequireDefault(_buildApeyEyeGenericResourceJs);

var _buildApeyEyeInputJs = require('../build/apey-eye/Input.js');

var _buildApeyEyeInputJs2 = _interopRequireDefault(_buildApeyEyeInputJs);

var _buildApeyEyeAnnotationsJs = require('../build/apey-eye/Annotations.js');

var Annotations = _interopRequireWildcard(_buildApeyEyeAnnotationsJs);

var _buildApeyEyeFormattersJs = require('../build/apey-eye/Formatters.js');

var Formatters = _interopRequireWildcard(_buildApeyEyeFormattersJs);

var _buildApeyEyeModelRegisterJs = require('../build/apey-eye/ModelRegister.js');

var _buildApeyEyeModelRegisterJs2 = _interopRequireDefault(_buildApeyEyeModelRegisterJs);

_chai2['default'].use(_chaiAsPromised2['default']);
_chai2['default'].should();
_chai2['default'].use(_chaiThings2['default']);

var expect = _chai2['default'].expect,
    assert = _chai2['default'].assert,
    should = _chai2['default'].should;

describe('Resources', function () {

    describe('Resource Declaration', function () {
        var restaurantInput, RestaurantModel;

        before(function (done) {
            restaurantInput = new _buildApeyEyeInputJs2['default']({
                name: { type: 'string', required: true },
                address: { type: 'string', required: true },
                phone: { type: 'number' },
                photo: { type: 'string', regex: _buildApeyEyeInputJs2['default'].URLPattern },
                date: { type: 'date' },
                location: { type: 'string' },
                language: { type: 'string', choices: ['PT', 'EN'] }
            });

            var RestaurantModelClass = (function (_Model) {
                function RestaurantModelClass() {
                    _classCallCheck(this, _RestaurantModelClass);

                    if (_Model != null) {
                        _Model.apply(this, arguments);
                    }
                }

                _inherits(RestaurantModelClass, _Model);

                var _RestaurantModelClass = RestaurantModelClass;
                RestaurantModelClass = Annotations.Input(restaurantInput)(RestaurantModelClass) || RestaurantModelClass;
                return RestaurantModelClass;
            })(_buildApeyEyeModelJs2['default']);

            ;
            RestaurantModel = RestaurantModelClass;
            done();
        });
        beforeEach(function (done) {
            _buildApeyEyeModelRegisterJs2['default'].empty();
            done();
        });

        it('Test Valid Input Resource declaration', function () {
            expect(function () {
                var MyResource = (function (_Resource) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource);

                        if (_Resource != null) {
                            _Resource.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource);

                    var _MyResource = MyResource;
                    MyResource = Annotations.Input()(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to['throw'](Error);
            expect(function () {
                var MyResource = (function (_Resource2) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource2);

                        if (_Resource2 != null) {
                            _Resource2.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource2);

                    var _MyResource2 = MyResource;
                    MyResource = Annotations.Input(123)(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to['throw'](Error);
            expect(function () {
                var MyResource = (function (_Resource3) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource3);

                        if (_Resource3 != null) {
                            _Resource3.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource3);

                    var _MyResource3 = MyResource;
                    MyResource = Annotations.Input('inputString')(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to['throw'](Error);
            expect(function () {
                var MyResource = (function (_Resource4) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource4);

                        if (_Resource4 != null) {
                            _Resource4.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource4);

                    var _MyResource4 = MyResource;
                    MyResource = Annotations.Input({ name: { type: 'string' } })(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to['throw'](Error);
            expect(function () {
                var MyResource = (function (_Resource5) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource5);

                        if (_Resource5 != null) {
                            _Resource5.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource5);

                    var _MyResource5 = MyResource;
                    MyResource = Annotations.Input(restaurantInput)(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to.not['throw']();
        });
        it('Test Valid Name Resource declaration', function () {
            expect(function () {
                var MyResource = (function (_Resource6) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource6);

                        if (_Resource6 != null) {
                            _Resource6.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource6);

                    var _MyResource6 = MyResource;
                    MyResource = Annotations.Name()(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to['throw'](Error);
            expect(function () {
                var MyResource = (function (_Resource7) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource7);

                        if (_Resource7 != null) {
                            _Resource7.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource7);

                    var _MyResource7 = MyResource;
                    MyResource = Annotations.Name(123)(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to['throw'](Error);
            expect(function () {
                var MyResource = (function (_Resource8) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource8);

                        if (_Resource8 != null) {
                            _Resource8.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource8);

                    var _MyResource8 = MyResource;
                    MyResource = Annotations.Name('inputString')(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to.not['throw'](Error);
            expect(function () {
                var MyResource = (function (_Resource9) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource9);

                        if (_Resource9 != null) {
                            _Resource9.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource9);

                    var _MyResource9 = MyResource;
                    MyResource = Annotations.Name({ name: 'ResourceName' })(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to['throw'](Error);
        });
        it('Test Valid Query Resource declaration', function () {
            expect(function () {
                var MyResource = (function (_Resource10) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource10);

                        if (_Resource10 != null) {
                            _Resource10.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource10);

                    var _MyResource10 = MyResource;
                    MyResource = Annotations.Query()(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to['throw'](Error);
            expect(function () {
                var MyResource = (function (_Resource11) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource11);

                        if (_Resource11 != null) {
                            _Resource11.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource11);

                    var _MyResource11 = MyResource;
                    MyResource = Annotations.Query(123)(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to['throw'](Error);
            expect(function () {
                var MyResource = (function (_Resource12) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource12);

                        if (_Resource12 != null) {
                            _Resource12.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource12);

                    var _MyResource12 = MyResource;
                    MyResource = Annotations.Query('inputString')(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to['throw'](Error);
            expect(function () {
                var MyResource = (function (_Resource13) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource13);

                        if (_Resource13 != null) {
                            _Resource13.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource13);

                    var _MyResource13 = MyResource;
                    MyResource = Annotations.Query({ name: 'ResourceName' })(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to['throw'](Error);

            expect(function () {
                var MyResource = (function (_Resource14) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource14);

                        if (_Resource14 != null) {
                            _Resource14.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource14);

                    var _MyResource14 = MyResource;
                    MyResource = Annotations.Query({ _sort: ['name', 123] })(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to['throw'](Error);

            expect(function () {
                var MyResource = (function (_Resource15) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource15);

                        if (_Resource15 != null) {
                            _Resource15.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource15);

                    var _MyResource15 = MyResource;
                    MyResource = Annotations.Query({ _sort: 'name' })(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to['throw'](Error);

            expect(function () {
                var MyResource = (function (_Resource16) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource16);

                        if (_Resource16 != null) {
                            _Resource16.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource16);

                    var _MyResource16 = MyResource;
                    MyResource = Annotations.Query({ _sort: ['-name'] })(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to.not['throw'](Error);
            expect(function () {
                var MyResource = (function (_Resource17) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource17);

                        if (_Resource17 != null) {
                            _Resource17.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource17);

                    var _MyResource17 = MyResource;
                    MyResource = Annotations.Query({ _page_size: ['-name'] })(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to['throw'](Error);
            expect(function () {
                var MyResource = (function (_Resource18) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource18);

                        if (_Resource18 != null) {
                            _Resource18.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource18);

                    var _MyResource18 = MyResource;
                    MyResource = Annotations.Query({ _page_size: '1' })(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to['throw'](Error);
            expect(function () {
                var MyResource = (function (_Resource19) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource19);

                        if (_Resource19 != null) {
                            _Resource19.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource19);

                    var _MyResource19 = MyResource;
                    MyResource = Annotations.Query({ _page_size: 1.1 })(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to['throw'](Error);
            expect(function () {
                var MyResource = (function (_Resource20) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource20);

                        if (_Resource20 != null) {
                            _Resource20.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource20);

                    var _MyResource20 = MyResource;
                    MyResource = Annotations.Query({ _page_size: 1 })(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to.not['throw'](Error);

            expect(function () {
                var MyResource = (function (_Resource21) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource21);

                        if (_Resource21 != null) {
                            _Resource21.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource21);

                    var _MyResource21 = MyResource;
                    MyResource = Annotations.Query({ _filter: 1 })(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to['throw'](Error);

            expect(function () {
                var MyResource = (function (_Resource22) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource22);

                        if (_Resource22 != null) {
                            _Resource22.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource22);

                    var _MyResource22 = MyResource;
                    MyResource = Annotations.Query({ _filter: 'string' })(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to['throw'](Error);

            expect(function () {
                var MyResource = (function (_Resource23) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource23);

                        if (_Resource23 != null) {
                            _Resource23.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource23);

                    var _MyResource23 = MyResource;
                    MyResource = Annotations.Query({ _filter: ['name'] })(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to['throw'](Error);
            expect(function () {
                var MyResource = (function (_Resource24) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource24);

                        if (_Resource24 != null) {
                            _Resource24.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource24);

                    var _MyResource24 = MyResource;
                    MyResource = Annotations.Query({ _filter: { name: '123' } })(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to.not['throw'](Error);
        });
        it('Test Valid Output Resource declaration', function () {
            expect(function () {
                var MyResource = (function (_Resource25) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource25);

                        if (_Resource25 != null) {
                            _Resource25.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource25);

                    var _MyResource25 = MyResource;
                    MyResource = Annotations.Output()(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to['throw'](Error);
            expect(function () {
                var MyResource = (function (_Resource26) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource26);

                        if (_Resource26 != null) {
                            _Resource26.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource26);

                    var _MyResource26 = MyResource;
                    MyResource = Annotations.Output(123)(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to['throw'](Error);
            expect(function () {
                var MyResource = (function (_Resource27) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource27);

                        if (_Resource27 != null) {
                            _Resource27.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource27);

                    var _MyResource27 = MyResource;
                    MyResource = Annotations.Output('invalidoutput')(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to['throw'](Error);
            expect(function () {
                var MyResource = (function (_Resource28) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource28);

                        if (_Resource28 != null) {
                            _Resource28.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource28);

                    var _MyResource28 = MyResource;
                    MyResource = Annotations.Output({ name: '123' })(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to['throw'](Error);
            expect(function () {
                var MyResource = (function (_Resource29) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource29);

                        if (_Resource29 != null) {
                            _Resource29.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource29);

                    var _MyResource29 = MyResource;
                    MyResource = Annotations.Output(['name', 'categories'])(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to['throw'](Error);
            expect(function () {
                var MyResource = (function (_Resource30) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource30);

                        if (_Resource30 != null) {
                            _Resource30.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource30);

                    var _MyResource30 = MyResource;
                    MyResource = Annotations.Output({
                        _fields: 'name'
                    })(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to['throw'](Error);
            expect(function () {
                var MyResource = (function (_Resource31) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource31);

                        if (_Resource31 != null) {
                            _Resource31.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource31);

                    var _MyResource31 = MyResource;
                    MyResource = Annotations.Output({
                        _fields: ['name', 123]
                    })(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to['throw'](Error);
            expect(function () {
                var MyResource = (function (_Resource32) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource32);

                        if (_Resource32 != null) {
                            _Resource32.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource32);

                    var _MyResource32 = MyResource;
                    MyResource = Annotations.Output({
                        _fields: ['name', 'categories']
                    })(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to.not['throw'](Error);
            expect(function () {
                var MyResource = (function (_Resource33) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource33);

                        if (_Resource33 != null) {
                            _Resource33.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource33);

                    var _MyResource33 = MyResource;
                    MyResource = Annotations.Output({
                        _embedded: ['name', 123]
                    })(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to['throw'](Error);
            expect(function () {
                var MyResource = (function (_Resource34) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource34);

                        if (_Resource34 != null) {
                            _Resource34.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource34);

                    var _MyResource34 = MyResource;
                    MyResource = Annotations.Output({
                        _embedded: 'name'
                    })(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to['throw'](Error);
            expect(function () {
                var MyResource = (function (_Resource35) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource35);

                        if (_Resource35 != null) {
                            _Resource35.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource35);

                    var _MyResource35 = MyResource;
                    MyResource = Annotations.Output({
                        _embedded: ['name', 'categories']
                    })(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to.not['throw'](Error);
        });
        it('Test Valid Output Resource declaration', function () {
            expect(function () {
                var MyResource = (function (_Resource36) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource36);

                        if (_Resource36 != null) {
                            _Resource36.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource36);

                    var _MyResource36 = MyResource;
                    MyResource = Annotations.Format()(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to['throw'](Error);
            expect(function () {
                var MyResource = (function (_Resource37) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource37);

                        if (_Resource37 != null) {
                            _Resource37.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource37);

                    var _MyResource37 = MyResource;
                    MyResource = Annotations.Format(123)(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to['throw'](Error);
            expect(function () {
                var MyResource = (function (_Resource38) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource38);

                        if (_Resource38 != null) {
                            _Resource38.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource38);

                    var _MyResource38 = MyResource;
                    MyResource = Annotations.Format('123')(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to['throw'](Error);
            expect(function () {
                var MyResource = (function (_Resource39) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource39);

                        if (_Resource39 != null) {
                            _Resource39.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource39);

                    var _MyResource39 = MyResource;
                    MyResource = Annotations.Format([Formatters.JSONFormat])(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to['throw'](Error);
            expect(function () {
                var MyResource = (function (_Resource40) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource40);

                        if (_Resource40 != null) {
                            _Resource40.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource40);

                    var _MyResource40 = MyResource;
                    MyResource = Annotations.Format(Formatters.JSONFormat)(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to.not['throw'](Error);
        });
        it('Test Valid Authentication Resource declaration', function () {
            expect(function () {
                var MyResource = (function (_Resource41) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource41);

                        if (_Resource41 != null) {
                            _Resource41.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource41);

                    var _MyResource41 = MyResource;
                    MyResource = Annotations.Authentication()(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to.not['throw'](Error);
            expect(function () {
                var MyResource = (function (_Resource42) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource42);

                        if (_Resource42 != null) {
                            _Resource42.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource42);

                    var _MyResource42 = MyResource;
                    MyResource = Annotations.Authentication(123)(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to['throw'](Error);
            expect(function () {
                var MyResource = (function (_Resource43) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource43);

                        if (_Resource43 != null) {
                            _Resource43.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource43);

                    var _MyResource43 = MyResource;
                    MyResource = Annotations.Authentication('123')(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to.not['throw'](Error);
        });
        it('Test Valid  Roles Resource declaration', function () {
            expect(function () {
                var MyResource = (function (_Resource44) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource44);

                        if (_Resource44 != null) {
                            _Resource44.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource44);

                    var _MyResource44 = MyResource;
                    MyResource = Annotations.Roles()(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to.not['throw'](Error);
            expect(function () {
                var MyResource = (function (_Resource45) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource45);

                        if (_Resource45 != null) {
                            _Resource45.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource45);

                    var _MyResource45 = MyResource;
                    MyResource = Annotations.Roles(123)(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to['throw'](Error);
            expect(function () {
                var MyResource = (function (_Resource46) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource46);

                        if (_Resource46 != null) {
                            _Resource46.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource46);

                    var _MyResource46 = MyResource;
                    MyResource = Annotations.Roles('123')(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to['throw'](Error);
            expect(function () {
                var MyResource = (function (_Resource47) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource47);

                        if (_Resource47 != null) {
                            _Resource47.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource47);

                    var _MyResource47 = MyResource;
                    MyResource = Annotations.Roles({ role: 'client' })(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to['throw'](Error);
            expect(function () {
                var MyResource = (function (_Resource48) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource48);

                        if (_Resource48 != null) {
                            _Resource48.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource48);

                    var _MyResource48 = MyResource;
                    MyResource = Annotations.Roles([])(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to.not['throw'](Error);
            expect(function () {
                var MyResource = (function (_Resource49) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource49);

                        if (_Resource49 != null) {
                            _Resource49.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource49);

                    var _MyResource49 = MyResource;
                    MyResource = Annotations.Roles(['client', 'admin'])(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to.not['throw'](Error);
            expect(function () {
                var MyResource = (function (_Resource50) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource50);

                        if (_Resource50 != null) {
                            _Resource50.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _Resource50);

                    var _MyResource50 = MyResource;
                    MyResource = Annotations.Roles(['client', 123])(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeResourceJs2['default']);
            }).to['throw'](Error);
        });
        it('Test Valid  Model Resource declaration', function () {
            expect(function () {
                var MyResource = (function (_GenericResource) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource51);

                        if (_GenericResource != null) {
                            _GenericResource.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _GenericResource);

                    var _MyResource51 = MyResource;
                    MyResource = Annotations.Model()(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeGenericResourceJs2['default']);
            }).to['throw'](Error);
            expect(function () {
                var MyResource = (function (_GenericResource2) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource52);

                        if (_GenericResource2 != null) {
                            _GenericResource2.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _GenericResource2);

                    var _MyResource52 = MyResource;
                    MyResource = Annotations.Model(123)(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeGenericResourceJs2['default']);
            }).to['throw'](Error);
            expect(function () {
                var MyResource = (function (_GenericResource3) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource53);

                        if (_GenericResource3 != null) {
                            _GenericResource3.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _GenericResource3);

                    var _MyResource53 = MyResource;
                    MyResource = Annotations.Model('modelString')(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeGenericResourceJs2['default']);
            }).to['throw'](Error);
            expect(function () {
                var MyResource = (function (_GenericResource4) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource54);

                        if (_GenericResource4 != null) {
                            _GenericResource4.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _GenericResource4);

                    var _MyResource54 = MyResource;
                    MyResource = Annotations.Model({ model: RestaurantModel })(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeGenericResourceJs2['default']);
            }).to['throw'](Error);
            expect(function () {
                var MyResource = (function (_GenericResource5) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource55);

                        if (_GenericResource5 != null) {
                            _GenericResource5.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _GenericResource5);

                    var _MyResource55 = MyResource;
                    MyResource = Annotations.Model(RestaurantModel)(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeGenericResourceJs2['default']);
            }).to.not['throw'](Error);
        });
        it('Test Valid  Methods Resource declaration', function () {
            expect(function () {
                var MyResource = (function (_GenericResource6) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource56);

                        if (_GenericResource6 != null) {
                            _GenericResource6.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _GenericResource6);

                    var _MyResource56 = MyResource;
                    MyResource = Annotations.Methods()(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeGenericResourceJs2['default']);
            }).to.not['throw'](Error);
            expect(function () {
                var MyResource = (function (_GenericResource7) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource57);

                        if (_GenericResource7 != null) {
                            _GenericResource7.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _GenericResource7);

                    var _MyResource57 = MyResource;
                    MyResource = Annotations.Methods(123)(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeGenericResourceJs2['default']);
            }).to['throw'](Error);
            expect(function () {
                var MyResource = (function (_GenericResource8) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource58);

                        if (_GenericResource8 != null) {
                            _GenericResource8.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _GenericResource8);

                    var _MyResource58 = MyResource;
                    MyResource = Annotations.Methods('123')(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeGenericResourceJs2['default']);
            }).to['throw'](Error);
            expect(function () {
                var MyResource = (function (_GenericResource9) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource59);

                        if (_GenericResource9 != null) {
                            _GenericResource9.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _GenericResource9);

                    var _MyResource59 = MyResource;
                    MyResource = Annotations.Methods({ methods: ['get', 'fetch'] })(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeGenericResourceJs2['default']);
            }).to['throw'](Error);
            expect(function () {
                var MyResource = (function (_GenericResource10) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource60);

                        if (_GenericResource10 != null) {
                            _GenericResource10.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _GenericResource10);

                    var _MyResource60 = MyResource;
                    MyResource = Annotations.Methods(['get', 123])(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeGenericResourceJs2['default']);
            }).to['throw'](Error);
            expect(function () {
                var MyResource = (function (_GenericResource11) {
                    function MyResource() {
                        _classCallCheck(this, _MyResource61);

                        if (_GenericResource11 != null) {
                            _GenericResource11.apply(this, arguments);
                        }
                    }

                    _inherits(MyResource, _GenericResource11);

                    var _MyResource61 = MyResource;
                    MyResource = Annotations.Methods(['constructor', 'static.fetch'])(MyResource) || MyResource;
                    return MyResource;
                })(_buildApeyEyeGenericResourceJs2['default']);
            }).to.not['throw'](Error);
        });
    });
    describe('Resource methods basic test', function () {

        var restaurantInput, TestModel, TestResource;

        before(function (done) {
            restaurantInput = new _buildApeyEyeInputJs2['default']({
                name: { type: 'string', required: true },
                address: { type: 'string', required: true },
                phone: { type: 'number' },
                photo: { type: 'string', regex: _buildApeyEyeInputJs2['default'].URLPattern },
                date: { type: 'date' },
                location: { type: 'string' },
                language: { type: 'string', choices: ['PT', 'EN'] }
            });

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
            })(_buildApeyEyeRethinkDBModelJs2['default']);

            TestModel = TestModelClass;

            var TestResourceClass = (function (_GenericResource12) {
                function TestResourceClass() {
                    _classCallCheck(this, _TestResourceClass);

                    if (_GenericResource12 != null) {
                        _GenericResource12.apply(this, arguments);
                    }
                }

                _inherits(TestResourceClass, _GenericResource12);

                var _TestResourceClass = TestResourceClass;
                TestResourceClass = Annotations.Format(Formatters.JSONFormat)(TestResourceClass) || TestResourceClass;
                TestResourceClass = Annotations.Model(TestModel)(TestResourceClass) || TestResourceClass;
                return TestResourceClass;
            })(_buildApeyEyeGenericResourceJs2['default']);

            TestResource = TestResourceClass;
            done();
        });

        beforeEach(function (done) {
            _buildApeyEyeModelRegisterJs2['default'].empty();
            done();
        });

        it('Resource.fetch ', _asyncToGenerator(function* () {

            var list = yield TestResource.fetch();
            expect(list).to.be.instanceOf(Array);
        }));
        it('Resource.fetch returns a serialized array ', _asyncToGenerator(function* () {

            var list = yield TestResource.fetch();
            list.should.all.contain.keys('id', 'obj', 'put', 'patch', 'delete');
        }));
        it('Resource.post returns an object', _asyncToGenerator(function* () {

            var data = {
                name: 'restaurantName',
                address: 'restaurantAddress',
                phone: 9492123
            };

            var result = yield new TestResource({ data: data });

            expect(result.obj).to.be.instanceOf(Object);
            expect(result.obj).to.have.property('address');
            expect(result.obj).to.have.property('phone');
            expect(result.obj).to.have.property('name');
        }));
        it('Resource.post invalid data may return an exception', _asyncToGenerator(function* () {

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

            expect(new TestResource({ data: data })).to.be.fulfilled;
            expect(new TestResource({ data: invalidData1 })).to.be.rejected;
            expect(new TestResource({ data: invalidData2 })).to.be.rejected;
        }));
        it('Resource.fetchOne for a before inserted object returns the same object', _asyncToGenerator(function* () {

            var data = {
                name: 'restaurantName',
                address: 'restaurantAddress',
                phone: 9492123
            };

            var postedObject = yield new TestResource({ data: data });
            var obj = yield TestResource.fetchOne({ id: postedObject.obj.id });

            expect(obj.obj).to.deep.equal(postedObject.obj);
        }));
        it('Resource.put replace an object inserted before', _asyncToGenerator(function* () {

            var data = {
                name: 'restaurantName',
                address: 'restaurantAddress',
                phone: 9492123
            };

            var obj = yield new TestResource({ data: data });
            yield obj.put({ data: { name: 'restaurantName2', address: 'Rua Costa Cabral' } });

            expect(obj.obj).to.not.have.property('phone');
            expect(obj.obj).to.have.property('name', 'restaurantName2');
            expect(obj.obj).to.have.property('address', 'Rua Costa Cabral');
        }));
        it('Resource.patch update an object inserted before', _asyncToGenerator(function* () {

            var data = {
                name: 'restaurantName',
                address: 'restaurantAddress',
                phone: 9492123
            };

            var obj = yield new TestResource({ data: data });
            yield obj.patch({ data: { name: 'restaurantName2', address: 'Rua Costa Cabral' } });

            expect(obj.obj).to.have.property('phone', 9492123);
            expect(obj.obj).to.have.property('name', 'restaurantName2');
            expect(obj.obj).to.have.property('address', 'Rua Costa Cabral');
        }));
        it('Resource.delete delete an object from database, so it is impossible to access him again', _asyncToGenerator(function* () {

            var data = {
                name: 'restaurantName',
                address: 'restaurantAddress',
                phone: 9492123
            };

            var obj = yield new TestResource({ data: data });
            var res = yield obj['delete']();

            expect(res).to.be['true'];
            expect(TestResource.fetchOne({ id: obj.id })).to.eventually['throw']();
        }));
        it('Operations that returns the object may receive object with only a set of fields', _asyncToGenerator(function* () {

            var data = {
                name: 'restaurantName',
                address: 'restaurantAddress',
                phone: 9492123
            };

            var obj = yield new TestResource({ data: data });

            expect(obj.obj).to.have.keys('id', 'name', 'address', 'phone');

            obj = yield new TestResource({ data: data, requestProperties: { _fields: ['id', 'name'] } });

            expect(obj.obj).to.have.keys('id', 'name');

            yield obj.patch({
                data: { name: 'restaurantName2', address: 'Rua Costa Cabral' },
                requestProperties: { _fields: ['id'] }
            });

            expect(obj.obj).to.not.have.keys('id', 'name', 'address', 'phone');
            expect(obj.obj).to.have.keys('id');
        }));
        it('Resource render', _asyncToGenerator(function* () {

            var restaurantData = {
                name: 'restaurantName',
                address: 'restaurantAddress'
            };

            var restObj = yield new TestResource({ data: restaurantData });
            var resultRender = restObj.render();

            expect(resultRender.data).to.be.a('string');
            expect(resultRender.data).to.equal(JSON.stringify(restObj.obj));
            expect(resultRender.type).to.equal(Formatters.JSONFormat.getMediaType());
        }));
    });
    describe('Resource methods with relations test', function () {

        var RestaurantResource, CategoryResource, PhoneResource, AddressResource;

        before(function (done) {
            var phonesInput = new _buildApeyEyeInputJs2['default']({
                phone: { type: 'string', required: true }
            });

            var PhonesModel = (function (_RethinkDBModel2) {
                function PhonesModel() {
                    _classCallCheck(this, _PhonesModel);

                    if (_RethinkDBModel2 != null) {
                        _RethinkDBModel2.apply(this, arguments);
                    }
                }

                _inherits(PhonesModel, _RethinkDBModel2);

                var _PhonesModel = PhonesModel;
                PhonesModel = Annotations.Name('phone')(PhonesModel) || PhonesModel;
                PhonesModel = Annotations.Input(phonesInput)(PhonesModel) || PhonesModel;
                return PhonesModel;
            })(_buildApeyEyeRethinkDBModelJs2['default']);

            var PhoneResourceClass = (function (_GenericResource13) {
                function PhoneResourceClass() {
                    _classCallCheck(this, _PhoneResourceClass);

                    if (_GenericResource13 != null) {
                        _GenericResource13.apply(this, arguments);
                    }
                }

                _inherits(PhoneResourceClass, _GenericResource13);

                var _PhoneResourceClass = PhoneResourceClass;
                PhoneResourceClass = Annotations.Model(PhonesModel)(PhoneResourceClass) || PhoneResourceClass;
                return PhoneResourceClass;
            })(_buildApeyEyeGenericResourceJs2['default']);

            PhoneResource = PhoneResourceClass;

            var addressInput = new _buildApeyEyeInputJs2['default']({
                address: { type: 'string', required: true },
                restaurant: { type: 'reference', model: 'restaurant' }
            });

            var AddressModel = (function (_RethinkDBModel3) {
                function AddressModel() {
                    _classCallCheck(this, _AddressModel);

                    if (_RethinkDBModel3 != null) {
                        _RethinkDBModel3.apply(this, arguments);
                    }
                }

                _inherits(AddressModel, _RethinkDBModel3);

                var _AddressModel = AddressModel;
                AddressModel = Annotations.Name('address')(AddressModel) || AddressModel;
                AddressModel = Annotations.Input(addressInput)(AddressModel) || AddressModel;
                return AddressModel;
            })(_buildApeyEyeRethinkDBModelJs2['default']);

            var AddressResourceClass = (function (_GenericResource14) {
                function AddressResourceClass() {
                    _classCallCheck(this, _AddressResourceClass);

                    if (_GenericResource14 != null) {
                        _GenericResource14.apply(this, arguments);
                    }
                }

                _inherits(AddressResourceClass, _GenericResource14);

                var _AddressResourceClass = AddressResourceClass;
                AddressResourceClass = Annotations.Model(AddressModel)(AddressResourceClass) || AddressResourceClass;
                return AddressResourceClass;
            })(_buildApeyEyeGenericResourceJs2['default']);

            AddressResource = AddressResourceClass;

            var categoryInput = new _buildApeyEyeInputJs2['default']({
                name: { type: 'string', required: true },
                restaurants: {
                    type: 'manyToMany',
                    model: 'restaurant',
                    inverse: 'categories',
                    through: 'categoryRestaurant'
                }
            });

            var CategoryModel = (function (_RethinkDBModel4) {
                function CategoryModel() {
                    _classCallCheck(this, _CategoryModel);

                    if (_RethinkDBModel4 != null) {
                        _RethinkDBModel4.apply(this, arguments);
                    }
                }

                _inherits(CategoryModel, _RethinkDBModel4);

                var _CategoryModel = CategoryModel;
                CategoryModel = Annotations.Name('category')(CategoryModel) || CategoryModel;
                CategoryModel = Annotations.Input(categoryInput)(CategoryModel) || CategoryModel;
                return CategoryModel;
            })(_buildApeyEyeRethinkDBModelJs2['default']);

            var CategoryResourceClass = (function (_GenericResource15) {
                function CategoryResourceClass() {
                    _classCallCheck(this, _CategoryResourceClass);

                    if (_GenericResource15 != null) {
                        _GenericResource15.apply(this, arguments);
                    }
                }

                _inherits(CategoryResourceClass, _GenericResource15);

                var _CategoryResourceClass = CategoryResourceClass;
                CategoryResourceClass = Annotations.Model(CategoryModel)(CategoryResourceClass) || CategoryResourceClass;
                return CategoryResourceClass;
            })(_buildApeyEyeGenericResourceJs2['default']);

            CategoryResource = CategoryResourceClass;

            var categoryRestaurantInput = new _buildApeyEyeInputJs2['default']({
                category: { type: 'reference', model: 'category' },
                restaurant: { type: 'reference', model: 'restaurant' }
            });

            var CategoryRestaurantModel = (function (_RethinkDBModel5) {
                function CategoryRestaurantModel() {
                    _classCallCheck(this, _CategoryRestaurantModel);

                    if (_RethinkDBModel5 != null) {
                        _RethinkDBModel5.apply(this, arguments);
                    }
                }

                _inherits(CategoryRestaurantModel, _RethinkDBModel5);

                var _CategoryRestaurantModel = CategoryRestaurantModel;
                CategoryRestaurantModel = Annotations.Name('categoryRestaurant')(CategoryRestaurantModel) || CategoryRestaurantModel;
                CategoryRestaurantModel = Annotations.Input(categoryRestaurantInput)(CategoryRestaurantModel) || CategoryRestaurantModel;
                return CategoryRestaurantModel;
            })(_buildApeyEyeRethinkDBModelJs2['default']);

            var restaurantInput = new _buildApeyEyeInputJs2['default']({
                name: { type: 'string', required: true },
                phone: { type: 'reference', model: 'phone' },
                addresses: { type: 'collection', model: 'address', inverse: 'restaurant' },
                categories: {
                    type: 'manyToMany',
                    model: 'category',
                    inverse: 'restaurants',
                    through: 'categoryRestaurant'
                }
            });

            var RestaurantModel = (function (_RethinkDBModel6) {
                function RestaurantModel() {
                    _classCallCheck(this, _RestaurantModel);

                    if (_RethinkDBModel6 != null) {
                        _RethinkDBModel6.apply(this, arguments);
                    }
                }

                _inherits(RestaurantModel, _RethinkDBModel6);

                var _RestaurantModel = RestaurantModel;
                RestaurantModel = Annotations.Name('restaurant')(RestaurantModel) || RestaurantModel;
                RestaurantModel = Annotations.Input(restaurantInput)(RestaurantModel) || RestaurantModel;
                return RestaurantModel;
            })(_buildApeyEyeRethinkDBModelJs2['default']);

            var RestaurantResourceClass = (function (_GenericResource16) {
                function RestaurantResourceClass() {
                    _classCallCheck(this, _RestaurantResourceClass);

                    if (_GenericResource16 != null) {
                        _GenericResource16.apply(this, arguments);
                    }
                }

                _inherits(RestaurantResourceClass, _GenericResource16);

                var _RestaurantResourceClass = RestaurantResourceClass;
                RestaurantResourceClass = Annotations.Model(RestaurantModel)(RestaurantResourceClass) || RestaurantResourceClass;
                return RestaurantResourceClass;
            })(_buildApeyEyeGenericResourceJs2['default']);

            RestaurantResource = RestaurantResourceClass;
            done();
        });
        it('Resource insert an embedded reference', _asyncToGenerator(function* () {

            var data = {
                name: 'restaurantName',
                phone: { phone: '93333' }
            };

            var obj = yield new RestaurantResource({ data: data });
            expect(obj.obj.phone).to.be.a('string');

            obj = yield RestaurantResource.fetchOne({ id: obj.id, requestProperties: { _embedded: ['phone'] } });
            expect(obj.obj.phone).to.be.a('object');

            var phoneObj = yield PhoneResource.fetchOne({ id: obj.obj.phone.id });
            expect(obj.obj.phone).to.deep.equal(phoneObj.obj);
        }));
        it('Resource insert an reference to an existing object', _asyncToGenerator(function* () {

            var phoneData = {
                phone: '939393'
            };

            var restaurantData = {
                name: 'restaurantName'
            };

            var phoneObj = yield new PhoneResource({ data: phoneData });

            restaurantData.phone = phoneObj.id;
            var restObj = yield new RestaurantResource({ data: restaurantData });
            expect(restObj.obj.phone).to.equal(phoneObj.id);

            restObj = yield RestaurantResource.fetchOne({ id: restObj.id, requestProperties: { _embedded: ['phone'] } });
            expect(restObj.obj.phone).to.deep.equal(phoneObj.obj);
        }));
        it('Resource insert an embedded collection', _asyncToGenerator(function* () {

            var restaurantData = {
                name: 'restaurantName',
                addresses: [{ address: 'address' }]
            };

            var restObj = yield new RestaurantResource({ data: restaurantData });
            expect(restObj.obj.addresses).to.be['instanceof'](Array);
            expect(restObj.obj.addresses[0]).to.be.a('string');

            restObj = yield RestaurantResource.fetchOne({
                id: restObj.id,
                requestProperties: { _embedded: ['addresses'] }
            });
            expect(restObj.obj.addresses).to.be['instanceof'](Array);
            expect(restObj.obj.addresses[0]).to.be.a('object');

            var addressObj = yield AddressResource.fetchOne({ id: restObj.obj.addresses[0].id });
            expect(addressObj.obj.restaurant).to.equal(restObj.id);

            yield restObj.patch({ data: { addresses: [] } });
            expect(restObj.obj.addresses.length).to.equal(0);

            expect(AddressResource.fetchOne({ id: addressObj.id })).to.be.rejected;
        }));
        it('Resource insert an collection with reference id', _asyncToGenerator(function* () {

            var addressData = {
                address: 'address'
            };

            var restaurantData = {
                name: 'restaurantName'
            };

            var addressObj = yield new AddressResource({ data: addressData });

            restaurantData.addresses = [addressObj.id];
            var restObj = yield new RestaurantResource({ data: restaurantData });
            expect(restObj.obj.addresses).to.be['instanceof'](Array);
            expect(restObj.obj.addresses[0]).to.equal(addressObj.id);

            restObj = yield RestaurantResource.fetchOne({
                id: restObj.id,
                requestProperties: { _embedded: ['addresses'] }
            });
            addressObj = yield AddressResource.fetchOne({ id: addressObj.id });
            expect(restObj.obj.addresses[0]).to.deep.equal(addressObj.obj);
        }));
        it('Resource insert an embedded manyToMany', _asyncToGenerator(function* () {

            var restaurantData = {
                name: 'restaurantName',
                categories: [{ name: 'category1' }]
            };

            var restObj = yield new RestaurantResource({ data: restaurantData });
            expect(restObj.obj.categories).to.be['instanceof'](Array);
            expect(restObj.obj.categories[0]).to.be.a('string');

            restObj = yield RestaurantResource.fetchOne({
                id: restObj.id,
                requestProperties: { _embedded: ['categories'] }
            });
            expect(restObj.obj.categories).to.be['instanceof'](Array);
            expect(restObj.obj.categories[0]).to.be.a('object');

            var categoryObj = yield CategoryResource.fetchOne({ id: restObj.obj.categories[0].id });
            expect(categoryObj.obj.restaurants).to.be['instanceof'](Array);
            expect(categoryObj.obj.restaurants[0]).to.equal(restObj.id);

            yield categoryObj.patch({ data: { restaurants: [] } });
            expect(categoryObj.obj.restaurants.length).to.equal(0);

            expect(RestaurantResource.fetchOne({ id: restObj.id })).to.be.rejected;
        }));
    });
    describe('Generic Resource', function () {
        var ValidResource = undefined,
            InvalidResource = undefined;

        before(function (done) {
            var InvalidResourceClass = (function (_GenericResource17) {
                function InvalidResourceClass() {
                    _classCallCheck(this, InvalidResourceClass);

                    if (_GenericResource17 != null) {
                        _GenericResource17.apply(this, arguments);
                    }
                }

                _inherits(InvalidResourceClass, _GenericResource17);

                return InvalidResourceClass;
            })(_buildApeyEyeGenericResourceJs2['default']);

            InvalidResource = InvalidResourceClass;

            var ValidResourceClass = (function (_GenericResource18) {
                function ValidResourceClass() {
                    _classCallCheck(this, _ValidResourceClass);

                    if (_GenericResource18 != null) {
                        _GenericResource18.apply(this, arguments);
                    }
                }

                _inherits(ValidResourceClass, _GenericResource18);

                var _ValidResourceClass = ValidResourceClass;
                ValidResourceClass = Annotations.Name('validResourceName')(ValidResourceClass) || ValidResourceClass;
                return ValidResourceClass;
            })(_buildApeyEyeGenericResourceJs2['default']);

            ValidResource = ValidResourceClass;

            done();
        });

        beforeEach(function (done) {
            _buildApeyEyeModelRegisterJs2['default'].empty();
            done();
        });

        it('Automatic creation of model', _asyncToGenerator(function* () {
            var data = { name: 'a name', address: 'an address' };

            expect(new InvalidResource({ data: data })).to.be.rejected;
            expect(InvalidResource.getModel()).to.equal(undefined);

            expect(new ValidResource({ data: data })).to.be.fulfilled;
            expect(ValidResource.getModel().prototype).to.be.an['instanceof'](_buildApeyEyeModelJs2['default']);
            expect(ValidResource.getModel().getName()).to.equal(ValidResource.getName());
        }));
    });
});