/**
 * Created by GlazedSolutions on 12/05/2015.
 */
import ApeyEye from '../../apey-eye';

let Decorators = ApeyEye.Decorators;
let Input = ApeyEye.Input;
let RethinkDBModel = ApeyEye.RethinkDBModel;

let restaurantInput = new Input({
    name: {type: "string", required: true},
    phone: {type: "string", required: false},
    address: {type: "string", required:true},
    rating : {type: "number", default: 0},
    photo: {type:"string"},
    schedules: {type: "collection", model: "schedule", inverse: "restaurant"},
    products: {type: "collection", model: "product", inverse: "restaurant"}
});

@Decorators.Input(restaurantInput)
@Decorators.Name("restaurant")
@Decorators.Query({
    _sort: ['name', '-address'],
    _page_size: 10
})
class RestaurantModel extends RethinkDBModel {
}

export default RestaurantModel;