/**
 * Created by Filipe on 02/03/2015.
 */
import HapiGenericRouter from './../src/apey-eye/routers/HapiGenericRouter.js';

import RestaurantResource from 'resources/RestaurantResource.js';
import AddressModel from 'models/AddressModel.js';
import CategoryModel from 'models/CategoryModel.js';
import CategoryRestaurantModel from 'models/CategoryRestaurantModel.js';
import PhoneModel from 'models/PhoneModel.js';

let router = new HapiGenericRouter();
router.register([{
    path: 'restaurant',
    resource: RestaurantResource
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