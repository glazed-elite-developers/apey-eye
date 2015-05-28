/**
 * Created by Filipe on 12/05/2015.
 */

import ApeyEye from '../../apey-eye';

let Annotations = ApeyEye.Annotations;
let Formatters = ApeyEye.Formatters;
let GenericResource = ApeyEye.GenericResource;
let Input = ApeyEye.Input;

import RestaurantModel from '../models/RestaurantModel.js';

@Annotations.Model(RestaurantModel)
@Annotations.Name("Restaurant")
@Annotations.Documentation({
    title: "Restaurant Resource",
    description: "This resource is the entry point to access restaurants information"
})
@Annotations.Output({
    _embedded: ['phone']
})
@Annotations.Authentication("basic")
@Annotations.Roles(["restaurant_owner", "admin"])
class RestaurantResource extends GenericResource {
    @Annotations.Action()
    static get_schema(){
        let ResourceClass = this,
            input = RestaurantModel.getInput();
        return input;
    }
}

export default RestaurantResource;