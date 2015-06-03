/**
 * Created by GlazedSolutions on 12/05/2015.
 */
import ApeyEye from '../../apey-eye';

let Annotations = ApeyEye.Annotations;
let Input = ApeyEye.Input;
let RethinkDBModel = ApeyEye.RethinkDBModel;

var categoryRestaurantInput = new Input({
    category: {type: "reference", model: "category"},
    restaurant: {type: "reference", model: "restaurant"}
});

@Annotations.Input(categoryRestaurantInput)
@Annotations.Name("categoryRestaurant")
class CategoryRestaurantModel extends RethinkDBModel {
}
export default CategoryRestaurantModel;