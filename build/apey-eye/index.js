/**
 * Created by Filipe on 26/05/2015.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _Annotations = require('./Annotations');

var Annotations = _interopRequireWildcard(_Annotations);

var _ModelJs = require('./Model.js');

var _ModelJs2 = _interopRequireDefault(_ModelJs);

var _RethinkDBModelJs = require('./RethinkDBModel.js');

var _RethinkDBModelJs2 = _interopRequireDefault(_RethinkDBModelJs);

var _RethinkDBAdapterJs = require('./RethinkDBAdapter.js');

var _RethinkDBAdapterJs2 = _interopRequireDefault(_RethinkDBAdapterJs);

var _ResourceJs = require('./Resource.js');

var _ResourceJs2 = _interopRequireDefault(_ResourceJs);

var _GenericResourceJs = require('./GenericResource.js');

var _GenericResourceJs2 = _interopRequireDefault(_GenericResourceJs);

var _FormattersJs = require('./Formatters.js');

var Formatters = _interopRequireWildcard(_FormattersJs);

var _InputJs = require('./Input.js');

var _InputJs2 = _interopRequireDefault(_InputJs);

var _modelsUserModelJs = require('./models/UserModel.js');

var _modelsUserModelJs2 = _interopRequireDefault(_modelsUserModelJs);

var _modelsRoleModelJs = require('./models/RoleModel.js');

var _modelsRoleModelJs2 = _interopRequireDefault(_modelsRoleModelJs);

var _routersHapiGenericRouterJs = require('./routers/HapiGenericRouter.js');

var _routersHapiGenericRouterJs2 = _interopRequireDefault(_routersHapiGenericRouterJs);

var _routersHapiRouterJs = require('./routers/HapiRouter.js');

var _routersHapiRouterJs2 = _interopRequireDefault(_routersHapiRouterJs);

var _routersKoaGenericRouterJs = require('./routers/KoaGenericRouter.js');

var _routersKoaGenericRouterJs2 = _interopRequireDefault(_routersKoaGenericRouterJs);

var _routersKoaRouterJs = require('./routers/KoaRouter.js');

var _routersKoaRouterJs2 = _interopRequireDefault(_routersKoaRouterJs);

exports['default'] = {
    Annotations: Annotations,
    Model: _ModelJs2['default'],
    RethinkDBModel: _RethinkDBModelJs2['default'],
    RethinkDBAdapter: _RethinkDBAdapterJs2['default'],
    Resource: _ResourceJs2['default'],
    GenericResource: _GenericResourceJs2['default'],
    Formatters: Formatters,
    Input: _InputJs2['default'],
    UserModel: _modelsUserModelJs2['default'],
    RoleModel: _modelsRoleModelJs2['default'],
    HapiGenericRouter: _routersHapiGenericRouterJs2['default'],
    HapiRouter: _routersHapiRouterJs2['default'],
    KoaGenericRouter: _routersKoaGenericRouterJs2['default'],
    KoaRouter: _routersKoaRouterJs2['default']

};
module.exports = exports['default'];