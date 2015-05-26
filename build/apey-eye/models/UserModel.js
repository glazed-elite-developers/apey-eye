/**
 * Created by Filipe on 19/04/2015.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _RethinkDBModelJs = require('./../RethinkDBModel.js');

var _RethinkDBModelJs2 = _interopRequireDefault(_RethinkDBModelJs);

var _AnnotationsJs = require('./../Annotations.js');

var Annotations = _interopRequireWildcard(_AnnotationsJs);

var _InputJs = require('./../Input.js');

var _InputJs2 = _interopRequireDefault(_InputJs);

var _RoleModelJs = require('./RoleModel.js');

var _RoleModelJs2 = _interopRequireDefault(_RoleModelJs);

var userInput = new _InputJs2['default']({
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
})(_RethinkDBModelJs2['default']);

exports['default'] = UserModel;
module.exports = exports['default'];