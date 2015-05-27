/**
 * Created by Filipe on 12/05/2015.
 */

import ApeyEye from '../../apey-eye';

let Annotations = ApeyEye.Annotations;
let Formatters = ApeyEye.Formatters;
let GenericResource = ApeyEye.GenericResource;
let Input = ApeyEye.Input;

import RestaurantModel from '../models/RestaurantModel.js';

@Annotations.Model(RestaurantModel)
@Annotations.Name("Restaurant")
//@Annotations.Format(Formatters.JSONFormat2)
//@Annotations.Authentication('local')
//@Annotations.Roles(['cliente'])
//@Annotations.Methods(["constructor"])
@Annotations.Documentation({
    title: "Restaurant Resource",
    description: "a big description"
})
class RestaurantResource extends GenericResource {
    @Annotations.Authentication('basic')
    @Annotations.Output({
        _fields: ['id', 'name', 'address', 'phone', 'date'],
        _embedded: ['schedule', 'products']
    })
    async delete(){
        return await super.delete();
    }
    @Annotations.Documentation({
        title: "Delete",
        description: "a litte description"
    })
    @Annotations.Format(Formatters.JSONFormat)
    static async delete(options) {
        let obj = {asdasD:12};
        return GenericResource._serialize(undefined, obj);
    }


    @Annotations.Action()
    static async get_options() {
        return this.options();
    }
    @Annotations.Action()
    async get_options() {
        return super.options();
    }
    @Annotations.Action()
    async get_name() {
        let obj = this.obj;
        this.obj = {name: obj.name};
        return this;
    }
    @Annotations.Action()
    static async get_name() {
        let obj = {name:'aeasasd'};
        return this._serialize(undefined, obj);
    }
}

export default RestaurantResource;