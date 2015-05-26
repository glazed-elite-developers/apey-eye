/**
 * Created by Filipe on 20/04/2015.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _RethinkDBAdapterJs = require('./../RethinkDBAdapter.js');

var _RethinkDBAdapterJs2 = _interopRequireDefault(_RethinkDBAdapterJs);

var _RethinkDBModelJs = require('./../RethinkDBModel.js');

var _RethinkDBModelJs2 = _interopRequireDefault(_RethinkDBModelJs);

var _AnnotationsJs = require('./../Annotations.js');

var Annotations = _interopRequireWildcard(_AnnotationsJs);

var _InputJs = require('./../Input.js');

var _InputJs2 = _interopRequireDefault(_InputJs);

var roleInput = new _InputJs2['default']({
    id: { type: 'string', required: true },
    childRoles: { type: 'collection', model: 'role', inverse: 'parentRole' },
    parentRole: { type: 'reference', model: 'role' }
});

var RoleModel = (function (_RethinkDBModel) {
    function RoleModel() {
        _classCallCheck(this, _RoleModel);

        if (_RethinkDBModel != null) {
            _RethinkDBModel.apply(this, arguments);
        }
    }

    _inherits(RoleModel, _RethinkDBModel);

    var _RoleModel = RoleModel;
    RoleModel = Annotations.Name('role')(RoleModel) || RoleModel;
    RoleModel = Annotations.Input(roleInput)(RoleModel) || RoleModel;
    return RoleModel;
})(_RethinkDBModelJs2['default']);

exports['default'] = RoleModel;
module.exports = exports['default'];