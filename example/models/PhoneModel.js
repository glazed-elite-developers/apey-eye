/**
 * Created by Filipe on 12/05/2015.
 */
import ApeyEye from '../../apey-eye';

let Annotations = ApeyEye.Annotations;
let Input = ApeyEye.Input;
let RethinkDBModel = ApeyEye.RethinkDBModel;

var phonesInput = new Input({
    phone: {type: "string", required: true}
});

@Annotations.Input(phonesInput)
@Annotations.Name("phone")
class PhoneModel extends RethinkDBModel {
}

export default PhoneModel;