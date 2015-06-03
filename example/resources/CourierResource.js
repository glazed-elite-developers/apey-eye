/**
 * Created by GlazedSolutions on 12/05/2015.
 */

import ApeyEye from '../../apey-eye';

let Decorators = ApeyEye.Decorators;
let Formatters = ApeyEye.Formatters;
let GenericResource = ApeyEye.GenericResource;
let Input = ApeyEye.Input;

import CourierModel from '../models/CourierModel.js';

@Decorators.Model(CourierModel)
@Decorators.Name("courier")
@Decorators.Methods(["constructor", "static.fetchOne","static.fetch"])
class CourierResource extends GenericResource {
    @Decorators.Action()
    async post_register(options){
        //DO SOME STUFF
        return "Registered"
    }
    @Decorators.Action()
    static async post_register(options){
    //DO SOME STUFF
    return "Registered static"
}
}

export default CourierResource;