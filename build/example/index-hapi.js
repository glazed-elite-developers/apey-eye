/**
 * Created by Filipe on 02/03/2015.
 */

'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _apeyEye = require('../apey-eye');

var _apeyEye2 = _interopRequireDefault(_apeyEye);

var _resourcesRestaurantResourceJs = require('./resources/RestaurantResource.js');

var _resourcesRestaurantResourceJs2 = _interopRequireDefault(_resourcesRestaurantResourceJs);

var _modelsAddressModelJs = require('./models/AddressModel.js');

var _modelsAddressModelJs2 = _interopRequireDefault(_modelsAddressModelJs);

var _modelsCategoryModelJs = require('./models/CategoryModel.js');

var _modelsCategoryModelJs2 = _interopRequireDefault(_modelsCategoryModelJs);

var _modelsCategoryRestaurantModelJs = require('./models/CategoryRestaurantModel.js');

var _modelsCategoryRestaurantModelJs2 = _interopRequireDefault(_modelsCategoryRestaurantModelJs);

var _modelsPhoneModelJs = require('./models/PhoneModel.js');

var _modelsPhoneModelJs2 = _interopRequireDefault(_modelsPhoneModelJs);

var HapiGenericRouter = _apeyEye2['default'].HapiGenericRouter;

var router = new HapiGenericRouter();
router.register([{
    path: 'restaurant',
    resource: _resourcesRestaurantResourceJs2['default']
}]);

router.start({ port: 3000 }, function (err, server) {
    if (!err) {
        console.log('Server running at', server.info.uri);
    } else {
        console.log('Error starting server');
    }
});