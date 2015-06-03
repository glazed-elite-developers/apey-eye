/**
 * Created by GlazedSolutions on 12/05/2015.
 */

import ApeyEye from '../../apey-eye';

let Decorators = ApeyEye.Decorators;
let Input = ApeyEye.Input;
let RethinkDBModel = ApeyEye.RethinkDBModel;

var categoryInput = new Input({
    name: {type: "string", required: true},
    products: {type: "collection", model: "product", inverse: "categories"}
});

@Decorators.Input(categoryInput)
@Decorators.Name("category")
class CategoryModel extends RethinkDBModel {
}

export default CategoryModel;