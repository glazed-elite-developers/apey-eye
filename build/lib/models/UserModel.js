'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
    value: true
});
/**
 * Created by Filipe on 19/04/2015.
 */

var _RethinkDBModel2 = require('./../RethinkDBModel.js');

var _RethinkDBModel3 = _interopRequireWildcard(_RethinkDBModel2);

var _import = require('./../Annotations.js');

var Annotations = _interopRequireWildcard(_import);

var _Input = require('./../Input.js');

var _Input2 = _interopRequireWildcard(_Input);

var _RoleModel = require('./RoleModel.js');

var _RoleModel2 = _interopRequireWildcard(_RoleModel);

var userInput = new _Input2['default']({
    username: { type: 'string' },
    password: { type: 'string' },
    role: { type: 'reference', model: 'role' }
});

var UserModel = (function (_RethinkDBModel) {
    function UserModel() {
        _classCallCheck(this, _UserModel);

        if (_RethinkDBModel != null) {
            _RethinkDBModel.apply(this, arguments);
        }
    }

    _inherits(UserModel, _RethinkDBModel);

    var _UserModel = UserModel;
    UserModel = Annotations.Name('user')(UserModel) || UserModel;
    UserModel = Annotations.Input(userInput)(UserModel) || UserModel;
    return UserModel;
})(_RethinkDBModel3['default']);

exports['default'] = UserModel;
module.exports = exports['default'];