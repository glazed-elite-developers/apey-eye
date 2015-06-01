/**
 * Created by Filipe on 02/03/2015.
 */

import ApeyEye from '../apey-eye';

let HapiRouter = ApeyEye.HapiRouter;
let HapiGenericRouter = ApeyEye.HapiGenericRouter;

import RestaurantResource from './resources/RestaurantResource.js';
import PhoneResource from './resources/PhoneResource.js';
import CategoryResource from './resources/CategoryResource.js';
import AddressResource from './resources/AddressResource.js';
import CategoryRestaurantResource from './resources/CategoryRestaurantResource.js';


let router = new HapiGenericRouter();
router.register([{
        path: 'restaurant',
        resource: RestaurantResource
    },
    {
        resource: PhoneResource
    },
    {
        resource: CategoryResource
    },
    {
        path:"addresses",
        resource: AddressResource
    },
    {
        resource: CategoryRestaurantResource
    }
]);

router.start({port:3000},function (err, server) {
    if(!err){
        console.log('Server running at', server.info.uri);
    }
    else{
        console.log('Error starting server');
    }
});