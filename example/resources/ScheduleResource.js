/**
 * Created by GlazedSolutions on 12/05/2015.
 */

import ApeyEye from '../../apey-eye';

let Decorators = ApeyEye.Decorators;
let GenericResource = ApeyEye.GenericResource;
let Input = ApeyEye.Input;

import ScheduleModel from '../models/ScheduleModel.js';

@Decorators.Model(ScheduleModel)
@Decorators.Name("schedule")
@Decorators.Authentication("basic")
@Decorators.Roles(["restaurant_owner"])
class ScheduleResource extends GenericResource {
}

export default ScheduleResource;