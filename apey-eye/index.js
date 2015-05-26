/**
 * Created by Filipe on 26/05/2015.
 */
import * as Annotations from './Annotations';

import Model from './Model.js';
import RethinkDBModel from './RethinkDBModel.js';
import RethinkDBAdapter from './RethinkDBAdapter.js';

import Resource from './Resource.js';
import GenericResource from './GenericResource.js';

import * as Formatters from './Formatters.js';

import Input from './Input.js';

import UserModel from './models/UserModel.js';
import RoleModel from './models/RoleModel.js';

import HapiGenericRouter from './routers/HapiGenericRouter.js';
import HapiRouter from './routers/HapiRouter.js';

import KoaGenericRouter from './routers/KoaGenericRouter.js';
import KoaRouter from './routers/KoaRouter.js';


export default {
    Annotations: Annotations,
    Model: Model,
    RethinkDBModel: RethinkDBModel,
    RethinkDBAdapter: RethinkDBAdapter,
    Resource: Resource,
    GenericResource: GenericResource,
    Formatters : Formatters,
    Input : Input,
    UserModel: UserModel,
    RoleModel: RoleModel,
    HapiGenericRouter: HapiGenericRouter,
    HapiRouter: HapiRouter,
    KoaGenericRouter: KoaGenericRouter,
    KoaRouter: KoaRouter

}

