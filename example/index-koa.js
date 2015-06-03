/**
 * Created by GlazedSolutions on 02/03/2015.
 */

import ApeyEye from '../apey-eye';

let KoaRouter = ApeyEye.KoaRouter;
let KoaGenericRouter = ApeyEye.KoaGenericRouter;

import CategoryResource from './resources/CategoryResource.js';
import ClientResource from './resources/ClientResource.js';
import CourierResource from './resources/CourierResource.js';
import OrderProductResource from './resources/OrderProductResource.js';
import OrderResource from './resources/OrderResource.js';
import ProductResource from './resources/ProductResource.js';
import RestaurantResource from './resources/RestaurantResource.js';
import ScheduleResource from './resources/ScheduleResource.js';

let router = new KoaGenericRouter();
router.register([
    {
        path: 'restaurant',
        resource: RestaurantResource
    },
    {
        path: "orders",
        resource: OrderResource
    },
    {
        resource: ProductResource
    },
    {
        resource: ScheduleResource
    },
    {
        resource: CategoryResource
    },
    {
        path: "couriers",
        resource: CourierResource
    },
    {
        path: "clients",
        resource: CourierResource
    },
    {
        resource: OrderProductResource
    }
]);


router.start({port:3000},function (err, server) {
    if(!err){
        console.log('Server running at');
    }
    else{
        console.log('Error starting server');
    }
});

