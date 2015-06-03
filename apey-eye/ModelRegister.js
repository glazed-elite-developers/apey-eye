/**
 * Created by GlazedSolutions on 10/04/2015.
 */
'use strict';

let singleton = Symbol();
let singletonEnforcer = Symbol();

class ModelRegister {
    constructor(enforcer) {
        if (enforcer !== singletonEnforcer) {
            throw "Cannot construct ModelRegister";
        }
        this.models = {};
    }
    static instance() {
        if (!this[singleton]) {
            this[singleton] = new ModelRegister(singletonEnforcer);
        }
        return this[singleton];
    }
    register(modelName, ModelClass){
        let Model = require('./Model');

        if(!(ModelClass.prototype instanceof Model)){
            throw new Error(`ModelRegister: ${ModelClass.name} class must be subclass of Model class`);
        }

        if(this.models[modelName] === undefined){
            this.models[modelName] = ModelClass;
        }
        else{
            throw new Error(`ModelRegister: already exists a model with name '${modelName}'`);
        }
    }
    model(modelName){
        return this.models[modelName];
    }
    empty(){
        this.models = {};
    }

}
export default ModelRegister.instance();

