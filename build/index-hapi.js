'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

/**
 * Created by Filipe on 02/03/2015.
 */

var _Hapi = require('hapi');

var _Hapi2 = _interopRequireWildcard(_Hapi);

var _HapiRouter = require('./lib/routers/HapiRouter.js');

var _HapiRouter2 = _interopRequireWildcard(_HapiRouter);

var _HapiGenericRouter = require('./lib/routers/HapiGenericRouter.js');

var _HapiGenericRouter2 = _interopRequireWildcard(_HapiGenericRouter);

var _Boom = require('boom');

var _Boom2 = _interopRequireWildcard(_Boom);

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

var _ServerConfig = require('./config/server.js');

var _ServerConfig2 = _interopRequireWildcard(_ServerConfig);

var _RouterConfig = require('./config/router.js');

var _RouterConfig2 = _interopRequireWildcard(_RouterConfig);

var router = new _HapiGenericRouter2['default']();
router.register([{
    path: 'restaurant',
    resource: _RestaurantResource2['default']
}]);

var server = new _Hapi2['default'].Server({
    connections: {
        router: {
            stripTrailingSlash: true
        }
    }
});
server.connection({ port: 3000 });

var scheme = function scheme(server, options) {
    return {
        authenticate: function authenticate(request, reply) {
            return router.checkAuthentication(request, reply);
        }
    };
};

server.auth.scheme('custom', scheme);
server.auth.strategy('default', 'custom');

server.register([require('hapi-async-handler'), {
    register: require('hapi-swagger'),
    options: {
        apiVersion: _ServerConfig2['default'].apiVersion,
        documentationPath: (_RouterConfig2['default'].basePath || '') + _ServerConfig2['default'].documentationPath,
        endpoint: (_RouterConfig2['default'].basePath || '') + _ServerConfig2['default'].documentationEndpoint,
        pathPrefixSize: ((_RouterConfig2['default'].basePath || '').match(/\//g) || []).length + 1
    }
}], function (err) {
    if (err) {
        throw err;
    }
    server.route(router.routes());
    server.start(function () {
        console.log('Server running at:', server.info.uri);
    });
});