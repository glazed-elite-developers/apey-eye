/**
 * Created by Filipe on 12/05/2015.
 */
import * as Annotations from '../lib/Annotations.js'
import Input from '../lib/Input.js';
import RethinkDBModel from '../lib/RethinkDBModel.js';

var addressInput = new Input({
    address: {type: "string", required: true},
    restaurant: {type: "reference", model: "restaurant"}
});

@Annotations.Input(addressInput)
@Annotations.Name("address")
class AddressModel extends RethinkDBModel {
}

export default AddressModel;