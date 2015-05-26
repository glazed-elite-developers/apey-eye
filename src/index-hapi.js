/**
 * Created by Filipe on 02/03/2015.
 */
import Hapi from 'hapi';
import HapiRouter from './lib/routers/HapiRouter.js';
import HapiGenericRouter from './lib/routers/HapiGenericRouter.js';
import Boom from 'boom'

import RestaurantResource from './resources/RestaurantResource.js';
import AddressModel from './models/AddressModel.js';
import CategoryModel from './models/CategoryModel.js';
import CategoryRestaurantModel from './models/CategoryRestaurantModel.js';
import PhoneModel from './models/PhoneModel.js';

import ServerConfig from './config/server.js';
import RouterConfig from './config/router.js';


var router = new HapiGenericRouter();
router.register([{
    path: 'restaurant',
    resource: RestaurantResource
}
]);


var server = new Hapi.Server({
    connections: {
        router: {
            stripTrailingSlash: true
        }
    }
});
server.connection({port: 3000});

var scheme = function (server, options) {
    return {
        authenticate: function (request, reply) {
            return router.checkAuthentication(request, reply);
        }
    };
};

server.auth.scheme('custom', scheme);
server.auth.strategy('default', 'custom');

server.register([
        require('hapi-async-handler'),
        {
            register: require('hapi-swagger'),
            options: {
                apiVersion: ServerConfig.apiVersion,
                documentationPath: (RouterConfig.basePath || '') + ServerConfig.documentationPath,
                endpoint: (RouterConfig.basePath || '') + ServerConfig.documentationEndpoint,
                pathPrefixSize: ((RouterConfig.basePath || '').match(/\//g) || []).length+1
            }
        }

    ],
    function (err) {
        if (err) {
            throw err;
        }
        server.route(router.routes());
        server.start(function () {
            console.log('Server running at:', server.info.uri);
        });
    });
