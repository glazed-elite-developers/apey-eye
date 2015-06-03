/**
 * Created by GlazedSolutions on 03/06/2015.
 */
import ApeyEye from '../../apey-eye';

let Decorators = ApeyEye.Decorators;
let Input = ApeyEye.Input;
let RethinkDBModel = ApeyEye.RethinkDBModel;

var scheduleInput = new Input({
    startTime: {type: "string", required: true},
    endTime: {type: "string", required: true},
    restaurant : {type: "reference", model:"restaurant", required:true}
});

@Decorators.Input(scheduleInput)
@Decorators.Name("schedule")
class ScheduleModel extends RethinkDBModel {
}

export default ScheduleModel;