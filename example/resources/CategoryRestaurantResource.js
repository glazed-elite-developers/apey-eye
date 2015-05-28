/**
 * Created by Filipe on 12/05/2015.
 */

import ApeyEye from '../../apey-eye';

let Annotations = ApeyEye.Annotations;
let Resource = ApeyEye.Resource;
let Input = ApeyEye.Input;

import CategoryRestaurantModel from '../models/CategoryRestaurantModel.js';

@Annotations.Name("categoryrestaurant")
@Annotations.Output({
    _fields: ["category", "restaurant"]
})
class CategoryRestaurantResource extends Resource {
    static async fetch(options = {}) {
        let ResourceClass = this,
            properties = ResourceClass.joinProperties(options.requestProperties, ResourceClass.fetch);

        let modelObj = await CategoryRestaurantModel.fetch({resourceProperties:properties});
        return ResourceClass._serializeArray(modelObj, properties);
    }
}

export default CategoryRestaurantResource;