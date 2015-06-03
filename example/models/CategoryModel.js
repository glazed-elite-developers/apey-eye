/**
 * Created by GlazedSolutions on 12/05/2015.
 */

import ApeyEye from '../../apey-eye';

let Annotations = ApeyEye.Annotations;
let Input = ApeyEye.Input;
let RethinkDBModel = ApeyEye.RethinkDBModel;

var categoryInput = new Input({
    name: {type: "string", required: true},
    restaurants: {type: "manyToMany", model: "restaurant", inverse: "categories", through: "categoryRestaurant"}
});

@Annotations.Input(categoryInput)
@Annotations.Name("category")
class CategoryModel extends RethinkDBModel {
}

export default CategoryModel;