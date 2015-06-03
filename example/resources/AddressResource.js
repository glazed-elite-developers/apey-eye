/**
 * Created by GlazedSolutions on 12/05/2015.
 */

import ApeyEye from '../../apey-eye';

let Annotations = ApeyEye.Annotations;
let GenericResource = ApeyEye.GenericResource;
let Input = ApeyEye.Input;

import AddressModel from '../models/AddressModel.js';

@Annotations.Model(AddressModel)
@Annotations.Name("address")
class AddressResource extends GenericResource {
}

export default AddressResource;