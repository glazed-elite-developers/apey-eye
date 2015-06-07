/**
 * Created by GlazedSolutions on 12/05/2015.
 */
import ApeyEye from '../../apey-eye';

let Decorators = ApeyEye.Decorators;
let Input = ApeyEye.Input;
let RethinkDBModel = ApeyEye.RethinkDBModel;

var courierInput = new Input({
    state: {type: "number", required: true},
    location: {type: "string", required:false},
    orders : {type: "collection", model:"order",inverse:"courier"}
});

@Decorators.Input(courierInput)
@Decorators.Name("courier")
class CourierModel extends RethinkDBModel {
}

export default CourierModel;