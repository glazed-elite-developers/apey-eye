/**
 * Created by Filipe on 12/05/2015.
 */
import * as Annotations from '../lib/Annotations.js'
import Input from '../lib/Input.js';
import RethinkDBModel from '../lib/RethinkDBModel.js';

var categoryInput = new Input({
    name: {type: "string", required: true},
    restaurants: {type: "manyToMany", model: "restaurant", inverse: "categories", through: "categoryRestaurant"}
});

@Annotations.Input(categoryInput)
@Annotations.Name("category")
class CategoryModel extends RethinkDBModel {
}

export default CategoryModel;