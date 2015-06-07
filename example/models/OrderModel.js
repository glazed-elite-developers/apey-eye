/**
 * Created by GlazedSolutions on 12/05/2015.
 */
import ApeyEye from '../../apey-eye';

let Decorators = ApeyEye.Decorators;
let Input = ApeyEye.Input;
let RethinkDBModel = ApeyEye.RethinkDBModel;

let orderInput = new Input({
    code : {type: "number", required:true},
    orderDate : {type: "date", default : "now"},
    deliveryDate : {type: "date", required:false},
    state : {type: "number", required:true},
    invoice : {type: "string", required:false},
    deliveryAddress : {type: "string", required:true},
    payed : {type: "boolean", required:true},
    products: {type: "manyToMany", model: "product", inverse: "orders", through:"orderProduct"},

    courier : {type: "reference", model:"courier"}
});

@Decorators.Input(orderInput)
@Decorators.Name("order")
@Decorators.Query({
    _sort: ['code'],
    _page_size: 10
})
class OrderModel extends RethinkDBModel {
}

export default OrderModel;