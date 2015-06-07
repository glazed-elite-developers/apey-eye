/**
 * Created by GlazedSolutions on 12/05/2015.
 */
import ApeyEye from '../../apey-eye';

let Decorators = ApeyEye.Decorators;
let Input = ApeyEye.Input;
let RethinkDBModel = ApeyEye.RethinkDBModel;

var productInput = new Input({
    name: {type: "string", required: true},
    price: {type: "number", required: true},
    VAT: {type: "number", required: true},
    restaurant: {type : "reference", model:"restaurant", required:true},
    category: {type: "reference", model: "category"},
    orders: {type: "manyToMany", model: "order", inverse: "products", through:"orderProduct"}

});

@Decorators.Input(productInput)
@Decorators.Name("product")
class ProductModel extends RethinkDBModel {
}

export default ProductModel;