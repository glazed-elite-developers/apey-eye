/**
 * Created by Filipe on 12/05/2015.
 */
import * as Annotations from '../lib/Annotations.js'
import Input from '../lib/Input.js';
import RethinkDBModel from '../lib/RethinkDBModel.js';

let restaurantInput = new Input({
    name: {type: "string", required: true},
    dateCreated: {type: "date", default: "now"},
    phone: {type: "reference", model: "phone"},
    addresses: {type: "collection", model: "address", inverse: "restaurant"},
    categories: {type: "manyToMany", model: "category", inverse: "restaurants", through: "categoryRestaurant"}
});

@Annotations.Input(restaurantInput)
@Annotations.Name("restaurant")
@Annotations.Query({
    _sort: ['name', '-address'],
    _page_size: 10
})
class RestaurantModel extends RethinkDBModel {
}

export default RestaurantModel;