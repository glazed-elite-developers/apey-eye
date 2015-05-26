/**
 * Created by Filipe on 11/03/2015.
 */

'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _buildApeyEyeInput = require('../build/apey-eye/Input');

var _buildApeyEyeInput2 = _interopRequireDefault(_buildApeyEyeInput);

var _buildApeyEyeModel = require('../build/apey-eye/Model');

var _buildApeyEyeModel2 = _interopRequireDefault(_buildApeyEyeModel);

var expect = _chai2['default'].expect;
var assert = _chai2['default'].assert;

describe('Input', function () {
    var TestModel = (function (_Model) {
        function TestModel() {
            _classCallCheck(this, TestModel);

            if (_Model != null) {
                _Model.apply(this, arguments);
            }
        }

        _inherits(TestModel, _Model);

        return TestModel;
    })(_buildApeyEyeModel2['default']);

    var restaurantInput;
    before(function () {
        var validLocation = function validLocation(val) {
            if (val !== 'Rua Costa Cabral') {
                throw new Error('Invalid location.');
            } else {
                return true;
            }
        };

        restaurantInput = new _buildApeyEyeInput2['default']({
            name: { type: 'string', required: true },
            address: { type: 'string', required: true, valid: validLocation },
            phone: { type: 'number' },
            photo: { type: 'string', regex: _buildApeyEyeInput2['default'].URLPattern },
            date: { type: 'date' },
            location: { type: 'string' },
            language: { type: 'string', choices: ['PT', 'EN'] }
        });
    });

    it('should throw an expection when valid properties is not an object', function* () {
        assert['throw'](function () {
            new _buildApeyEyeInput2['default']();
        }, Error);
        assert['throw'](function () {
            new _buildApeyEyeInput2['default']([]);
        }, Error);
        assert['throw'](function () {
            new _buildApeyEyeInput2['default']('invalidObj');
        }, Error);
        assert['throw'](function () {
            new _buildApeyEyeInput2['default'](true);
        }, Error);
        assert['throw'](function () {
            new _buildApeyEyeInput2['default'](123);
        }, Error);
        assert.doesNotThrow(function () {
            new _buildApeyEyeInput2['default']({ name: { type: 'string' } });
        });
    });
    it('should throw an expection when required properties aren\'t defined', function () {
        assert.doesNotThrow(function () {
            new _buildApeyEyeInput2['default']({ name: { type: 'string' } });
        });
        assert['throw'](function () {
            new _buildApeyEyeInput2['default']({ name: { required: false } });
        });
        assert.doesNotThrow(function () {
            new _buildApeyEyeInput2['default']({ name: { type: 'number' } });
        });
        assert['throw'](function () {
            new _buildApeyEyeInput2['default']({ name: { type: 'reference' } });
        });
        assert.doesNotThrow(function () {
            new _buildApeyEyeInput2['default']({ name: { type: 'reference', model: 'modelName' } });
        });
    });
    it('should throw an expection when required properties aren\'t defined with correct type values', function () {
        assert.doesNotThrow(function () {
            new _buildApeyEyeInput2['default']({ name: { type: 'string' } });
        });
        assert.doesNotThrow(function () {
            new _buildApeyEyeInput2['default']({ name: { type: 'reference', model: 'TestModel' } });
        });
        assert['throw'](function () {
            new _buildApeyEyeInput2['default']({ name: { type: 'strong' } });
        });
        assert['throw'](function () {
            new _buildApeyEyeInput2['default']({ name: { type: 'string', required: 'false' } });
        });
        assert.doesNotThrow(function () {
            new _buildApeyEyeInput2['default']({ name: { type: 'string', required: false } });
        });
        assert.doesNotThrow(function () {
            new _buildApeyEyeInput2['default']({ name: { type: 'string', regex: _buildApeyEyeInput2['default'].ISODatePattern } });
        });
        assert['throw'](function () {
            new _buildApeyEyeInput2['default']({ name: { type: 'string', regex: false } });
        });
        assert['throw'](function () {
            new _buildApeyEyeInput2['default']({ name: { type: 'string', regex: 'lalal' } });
        });
        assert['throw'](function () {
            new _buildApeyEyeInput2['default']({ name: { type: 'string', valid: true } });
        });
        assert.doesNotThrow(function () {
            new _buildApeyEyeInput2['default']({ name: { type: 'string', valid: function valid() {} } });
        });
        assert['throw'](function () {
            new _buildApeyEyeInput2['default']({ name: { type: 'string', 'default': 123 } });
        });
        assert.doesNotThrow(function () {
            new _buildApeyEyeInput2['default']({ name: { type: 'string', 'default': 'stringValue' } });
        });

        assert['throw'](function () {
            new _buildApeyEyeInput2['default']({ name: { type: 'string', choices: 123 } });
        });
        assert['throw'](function () {
            new _buildApeyEyeInput2['default']({ name: { type: 'string', choices: [123, false] } });
        });
        assert.doesNotThrow(function () {
            new _buildApeyEyeInput2['default']({ name: { type: 'string', choices: ['A', 'B'] } });
        });

        assert['throw'](function () {
            new _buildApeyEyeInput2['default']({ name: { type: 'collection', model: 'resourceName' } });
        });
        assert['throw'](function () {
            new _buildApeyEyeInput2['default']({ name: { type: 'reference', model: 123 } });
        });
        assert['throw'](function () {
            new _buildApeyEyeInput2['default']({ name: { type: 'reference' } });
        });
        assert.doesNotThrow(function () {
            new _buildApeyEyeInput2['default']({ name: { type: 'collection', model: 'modelname', inverse: 'inverseField', many: false } });
        });
    });
    it('should return true if data received is valid or false if not', _asyncToGenerator(function* () {
        var validData = {
            name: 'name',
            address: 'Rua Costa Cabral',
            phone: 123,
            photo: 'http://google.com/',
            date: '2015-03-10T14:27:44.031Z'
        };

        expect(restaurantInput.valid(validData)).to.eventually.not['throw']();

        var invalid = JSON.parse(JSON.stringify(validData));
        invalid.name = 12;

        expect(restaurantInput.valid(invalid)).to.eventually['throw']();

        invalid = JSON.parse(JSON.stringify(validData));
        invalid.address = 'Rua Dr Roberto Frias';

        expect(restaurantInput.valid(invalid)).to.eventually['throw']();

        invalid = JSON.parse(JSON.stringify(validData));
        invalid.phone = '93404404';

        expect(restaurantInput.valid(restaurantInput.valid(invalid))).to.eventually['throw']();

        invalid = JSON.parse(JSON.stringify(validData));
        invalid.date = '5th July 2015';

        expect(restaurantInput.valid(restaurantInput.valid(invalid))).to.eventually['throw']();

        invalid = JSON.parse(JSON.stringify(validData));
        invalid.language = 'SS';

        expect(restaurantInput.valid(restaurantInput.valid(invalid))).to.eventually['throw']();

        validData.language = 'PT';

        expect(restaurantInput.valid(restaurantInput.valid(validData))).to.eventually.not['throw']();
    }));
});