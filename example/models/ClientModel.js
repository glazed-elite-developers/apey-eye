/**
 * Created by GlazedSolutions on 12/05/2015.
 */
import ApeyEye from '../../apey-eye';

let Decorators = ApeyEye.Decorators;
let Input = ApeyEye.Input;
let RethinkDBModel = ApeyEye.RethinkDBModel;

var clientInput = new Input({
    state: {type: "number", required: true},
    location: {type: "string", required:false}
});

@Decorators.Input(clientInput)
@Decorators.Name("client")
class ClientModel extends RethinkDBModel {
}

export default ClientModel;