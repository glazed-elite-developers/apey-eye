/**
 * Created by GlazedSolutions on 12/05/2015.
 */
import ApeyEye from '../../apey-eye';

let Decorators = ApeyEye.Decorators;
let Input = ApeyEye.Input;
let RethinkDBModel = ApeyEye.RethinkDBModel;

var orderProductInput = new Input({
    product: {type: "reference", model: "product"},
    order: {type: "reference", model: "order"}
});

@Decorators.Input(orderProductInput)
@Decorators.Name("orderProduct")
class OrderProductModel extends RethinkDBModel {
}
export default OrderProductModel;