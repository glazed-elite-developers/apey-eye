/**
 * Created by Filipe on 12/05/2015.
 */
import * as Annotations from '../apey-eye/Annotations.js'
import Input from '../apey-eye/Input.js';
import RethinkDBModel from '../apey-eye/RethinkDBModel.js';

var phonesInput = new Input({
    phone: {type: "string", required: true}
});

@Annotations.Input(phonesInput)
@Annotations.Name("phone")
class PhoneModel extends RethinkDBModel {
}

export default PhoneModel;