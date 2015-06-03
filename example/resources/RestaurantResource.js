/**
 * Created by GlazedSolutions on 12/05/2015.
 */

import ApeyEye from '../../apey-eye';

let Decorators = ApeyEye.Decorators;
let Formatters = ApeyEye.Formatters;
let GenericResource = ApeyEye.GenericResource;
let Input = ApeyEye.Input;

import RestaurantModel from '../models/RestaurantModel.js';

@Decorators.Model(RestaurantModel)
@Decorators.Name("Restaurant")
@Decorators.Documentation({
    title: "Restaurant Resource",
    description: "This resource is the entry point to access restaurants information"
})
@Decorators.Output({
    _embedded: ['schedules','products']
})
@Decorators.Authentication("basic")
@Decorators.Roles(["restaurant_owner", "admin"])
class RestaurantResource extends GenericResource {
    @Decorators.Action()
    static get_schema(){
        let ResourceClass = this,
            input = RestaurantModel.getInput();
        return input;
    }
}

export default RestaurantResource;