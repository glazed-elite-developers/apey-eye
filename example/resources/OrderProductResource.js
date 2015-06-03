/**
 * Created by GlazedSolutions on 12/05/2015.
 */

import ApeyEye from '../../apey-eye';

let Decorators = ApeyEye.Decorators;
let Resource = ApeyEye.Resource;
let Input = ApeyEye.Input;

import OrderProductModel from '../models/OrderProductModel.js';

@Decorators.Name("orderProduct")
@Decorators.Output({
    _fields: ["product", "order"]
})
class OrderProductResource extends Resource {
    static async fetch(options = {}) {
        let ResourceClass = this,
            properties = ResourceClass.joinProperties(options.requestProperties, ResourceClass.fetch);

        let modelObj = await CategoryRestaurantModel.fetch({resourceProperties:properties});
        return ResourceClass._serializeArray(modelObj, properties);
    }
}

export default OrderProductResource;