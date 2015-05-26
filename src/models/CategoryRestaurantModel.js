/**
 * Created by Filipe on 12/05/2015.
 */
import * as Annotations from '../lib/Annotations.js'
import Input from '../lib/Input.js';
import RethinkDBModel from '../lib/RethinkDBModel.js';

var categoryRestaurantInput = new Input({
    category: {type: "reference", model: "category"},
    restaurant: {type: "reference", model: "restaurant"}
});

@Annotations.Input(categoryRestaurantInput)
@Annotations.Name("categoryRestaurant")
class CategoryRestaurantModel extends RethinkDBModel {
}
export default CategoryRestaurantModel;