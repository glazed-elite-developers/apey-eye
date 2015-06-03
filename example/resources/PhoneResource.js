/**
 * Created by GlazedSolutions on 12/05/2015.
 */

import ApeyEye from '../../apey-eye';

let Annotations = ApeyEye.Annotations;
let Formatters = ApeyEye.Formatters;
let GenericResource = ApeyEye.GenericResource;
let Input = ApeyEye.Input;

import PhoneModel from '../models/PhoneModel.js';

@Annotations.Model(PhoneModel)
@Annotations.Name("phone")
@Annotations.Methods(["static.fetch", "static.fetchOne"])
class PhoneResource extends GenericResource {
    @Annotations.Action()
    async post_register(options){
        //DO SOME STUFF
        return "Registered"
    }
    @Annotations.Action()
    static async post_register(options){
    //DO SOME STUFF
    return "Registered static"
}
}

export default PhoneResource;