/**
 * Created by Filipe on 20/04/2015.
 */
import Database from './../RethinkDBAdapter.js'
import RethinkDBModel from './../RethinkDBModel.js'
import * as Annotations from './../Annotations.js';
import Input from './../Input.js';

let roleInput = new Input({
    id: {type: 'string', required:true},
    childRoles: {type: "collection", model: "role", inverse: "parentRole"},
    parentRole: {type: "reference", model: "role"}
});

@Annotations.Input(roleInput)
@Annotations.Name('role')
class RoleModel extends RethinkDBModel {
}

export default RoleModel;