'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
  value: true
});
/**
 * Created by Filipe on 12/05/2015.
 */

var _import = require('../lib/Annotations.js');

var Annotations = _interopRequireWildcard(_import);

var _Input = require('../lib/Input.js');

var _Input2 = _interopRequireWildcard(_Input);

var _RethinkDBModel2 = require('../lib/RethinkDBModel.js');

var _RethinkDBModel3 = _interopRequireWildcard(_RethinkDBModel2);

var addressInput = new _Input2['default']({
  address: { type: 'string', required: true },
  restaurant: { type: 'reference', model: 'restaurant' }
});

var AddressModel = (function (_RethinkDBModel) {
  function AddressModel() {
    _classCallCheck(this, _AddressModel);

    if (_RethinkDBModel != null) {
      _RethinkDBModel.apply(this, arguments);
    }
  }

  _inherits(AddressModel, _RethinkDBModel);

  var _AddressModel = AddressModel;
  AddressModel = Annotations.Name('address')(AddressModel) || AddressModel;
  AddressModel = Annotations.Input(addressInput)(AddressModel) || AddressModel;
  return AddressModel;
})(_RethinkDBModel3['default']);

exports['default'] = AddressModel;
module.exports = exports['default'];