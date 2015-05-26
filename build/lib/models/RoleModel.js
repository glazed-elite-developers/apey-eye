'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
    value: true
});
/**
 * Created by Filipe on 20/04/2015.
 */

var _Database = require('./../RethinkDBAdapter.js');

var _Database2 = _interopRequireWildcard(_Database);

var _RethinkDBModel2 = require('./../RethinkDBModel.js');

var _RethinkDBModel3 = _interopRequireWildcard(_RethinkDBModel2);

var _import = require('./../Annotations.js');

var Annotations = _interopRequireWildcard(_import);

var _Input = require('./../Input.js');

var _Input2 = _interopRequireWildcard(_Input);

var roleInput = new _Input2['default']({
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
})(_RethinkDBModel3['default']);

exports['default'] = RoleModel;
module.exports = exports['default'];