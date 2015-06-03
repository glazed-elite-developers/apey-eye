/**
 * Created by GlazedSolutions on 12/05/2015.
 */

import ApeyEye from '../../apey-eye';

let Decorators = ApeyEye.Decorators;
let Formatters = ApeyEye.Formatters;
let GenericResource = ApeyEye.GenericResource;
let Input = ApeyEye.Input;

import ClientModel from '../models/ClientModel.js';

@Decorators.Model(ClientModel)
@Decorators.Name("client")
@Decorators.Methods(["constructor", "static.fetchOne"])
class ClientResource extends GenericResource {
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

export default ClientResource;