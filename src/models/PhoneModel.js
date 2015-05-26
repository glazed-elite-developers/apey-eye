/**
 * Created by Filipe on 12/05/2015.
 */
import * as Annotations from '../lib/Annotations.js'
import Input from '../lib/Input.js';
import RethinkDBModel from '../lib/RethinkDBModel.js';

var phonesInput = new Input({
    phone: {type: "string", required: true}
});

@Annotations.Input(phonesInput)
@Annotations.Name("phone")
class PhoneModel extends RethinkDBModel {
}

export default PhoneModel;