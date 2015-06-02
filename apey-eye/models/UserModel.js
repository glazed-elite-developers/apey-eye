/**
 * Created by Filipe on 19/04/2015.
 */
import RethinkDBModel from './../RethinkDBModel.js'
import * as Decorators from './../Decorators.js';
import Input from './../Input.js';
import RoleModel from './RoleModel.js';

let userInput = new Input({
    username: {type: 'string'},
    password: {type: 'string'},
    role: {type:"reference", model:"role"}
});

@Decorators.Input(userInput)
@Decorators.Name('user')
class UserModel extends RethinkDBModel {
}

export default UserModel;