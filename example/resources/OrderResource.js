/**
 * Created by GlazedSolutions on 12/05/2015.
 */

import ApeyEye from '../../apey-eye';

let Decorators = ApeyEye.Decorators;
let GenericResource = ApeyEye.GenericResource;
let Input = ApeyEye.Input;

import OrderModel from '../models/OrderModel.js';

@Decorators.Model(OrderModel)
@Decorators.Name("order")
@Decorators.Authentication("basic")
@Decorators.Roles(["client", "courier"])
class OrderResource extends GenericResource {
}

export default OrderResource;