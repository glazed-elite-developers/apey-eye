/**
 * Created by Filipe on 12/05/2015.
 */

import ApeyEye from '../../apey-eye';

let Annotations = ApeyEye.Annotations;
let GenericResource = ApeyEye.GenericResource;
let Input = ApeyEye.Input;

import CategoryModel from '../models/CategoryModel.js';

@Annotations.Model(CategoryModel)
@Annotations.Name("category")
@Annotations.Authentication("basic")
@Annotations.Roles(["restaurant_owner"])
class CategoryResource extends GenericResource {
}

export default CategoryResource;