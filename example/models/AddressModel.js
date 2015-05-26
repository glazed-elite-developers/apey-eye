/**
 * Created by Filipe on 12/05/2015.
 */

import ApeyEye from '../../apey-eye';

let Annotations = ApeyEye.Annotations;
let Input = ApeyEye.Input;
let RethinkDBModel = ApeyEye.RethinkDBModel;

var addressInput = new Input({
    address: {type: "string", required: true},
    restaurant: {type: "reference", model: "restaurant"}
});

@Annotations.Input(addressInput)
@Annotations.Name("address")
class AddressModel extends RethinkDBModel {
}

export default AddressModel;