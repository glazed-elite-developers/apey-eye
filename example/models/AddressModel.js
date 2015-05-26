/**
 * Created by Filipe on 12/05/2015.
 */
import * as Annotations from '../apey-eye/Annotations.js'
import Input from '../apey-eye/Input.js';
import RethinkDBModel from '../apey-eye/RethinkDBModel.js';

var addressInput = new Input({
    address: {type: "string", required: true},
    restaurant: {type: "reference", model: "restaurant"}
});

@Annotations.Input(addressInput)
@Annotations.Name("address")
class AddressModel extends RethinkDBModel {
}

export default AddressModel;