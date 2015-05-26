'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

/**
 * Created by Filipe on 02/03/2015.
 */

var _koa = require('koa');

var _koa2 = _interopRequireWildcard(_koa);

var _KoaRouter = require('./lib/routers/KoaRouter');

var _KoaRouter2 = _interopRequireWildcard(_KoaRouter);

var _KoaGenericRouter = require('./lib/routers/KoaGenericRouter');

var _KoaGenericRouter2 = _interopRequireWildcard(_KoaGenericRouter);

var _bodyParser = require('koa-body-parser');

var _bodyParser2 = _interopRequireWildcard(_bodyParser);

var _RethinkDBModel = require('./lib/RethinkDBModel');

var _RethinkDBModel2 = _interopRequireWildcard(_RethinkDBModel);

var _GenericResource = require('./lib/GenericResource.js');

var _GenericResource2 = _interopRequireWildcard(_GenericResource);

var _import = require('./lib/Annotations');

var Annotations = _interopRequireWildcard(_import);

var _Input = require('./lib/Input');

var _Input2 = _interopRequireWildcard(_Input);

var _import2 = require('./lib/Formatters');

var Formatters = _interopRequireWildcard(_import2);

var _passport = require('koa-passport');

var _passport2 = _interopRequireWildcard(_passport);

var _RestaurantResource = require('./resources/RestaurantResource.js');

var _RestaurantResource2 = _interopRequireWildcard(_RestaurantResource);

var _AddressModel = require('./models/AddressModel.js');

var _AddressModel2 = _interopRequireWildcard(_AddressModel);

var _CategoryModel = require('./models/CategoryModel.js');

var _CategoryModel2 = _interopRequireWildcard(_CategoryModel);

var _CategoryRestaurantModel = require('./models/CategoryRestaurantModel.js');

var _CategoryRestaurantModel2 = _interopRequireWildcard(_CategoryRestaurantModel);

var _PhoneModel = require('./models/PhoneModel.js');

var _PhoneModel2 = _interopRequireWildcard(_PhoneModel);

var router = new _KoaGenericRouter2['default']();
router.register([{
  path: 'restaurant',
  resource: _RestaurantResource2['default']
}]);

var app = _koa2['default']();

app.use(_bodyParser2['default']());
app.use(_passport2['default'].initialize());
app.use(router.routes());

app.listen(3000);
console.log('APP: Koa listening on port 3000.');