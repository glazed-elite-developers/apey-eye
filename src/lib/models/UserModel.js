/**
 * Created by Filipe on 19/04/2015.
 */
import RethinkDBModel from './../RethinkDBModel.js'
import * as Annotations from './../Annotations.js';
import Input from './../Input.js';
import RoleModel from './RoleModel.js';

let userInput = new Input({
    username: {type: 'string'},
    password: {type: 'string'},
    role: {type:"reference", model:"role"}
});

@Annotations.Input(userInput)
@Annotations.Name('user')
class UserModel extends RethinkDBModel {
}

export default UserModel;