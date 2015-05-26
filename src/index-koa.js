/**
 * Created by Filipe on 02/03/2015.
 */
import koa from 'koa';
import KoaRouter from './lib/routers/KoaRouter';
import KoaGenericRouter from './lib/routers/KoaGenericRouter';
import bodyParser from 'koa-body-parser';
import RethinkDBModel from './lib/RethinkDBModel';
import GenericResource from './lib/GenericResource.js';
import * as Annotations from './lib/Annotations';
import Input from './lib/Input';
import * as Formatters from './lib/Formatters';

import passport from 'koa-passport';

import RestaurantResource from './resources/RestaurantResource.js';
import AddressModel from './models/AddressModel.js';
import CategoryModel from './models/CategoryModel.js';
import CategoryRestaurantModel from './models/CategoryRestaurantModel.js';
import PhoneModel from './models/PhoneModel.js';


var router = new KoaGenericRouter();
router.register([{
    path: 'restaurant',
    resource: RestaurantResource
}]);

var app = koa();

app.use(bodyParser());
app.use(passport.initialize());
app.use(router.routes());

app.listen(3000);
console.log(`APP: Koa listening on port 3000.`);

