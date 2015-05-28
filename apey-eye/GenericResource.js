/**
 * Created by Filipe on 02/03/2015.
 */
import Resource from './Resource';
import * as Annotations from './Annotations';
import * as DefaultProperties from './DefaultProperties';
import * as Exceptions from './Exceptions';
import _ from 'underscore';

class GenericResource extends Resource {

    constructor(options = {}) {
        super();
        super(async () =>  {
            console.log("asd")
            let ResourceClass = this.constructor;

            ResourceClass.checkModel();

            let properties = ResourceClass.joinProperties(options.requestProperties, ResourceClass.post),
                modelClass = ResourceClass.getModel(ResourceClass.post);

            if (!options.data) {
                options.data={};
            }
            await ResourceClass.valid(options.data);

            if (modelClass) {
                let modelObj = await new modelClass({data: options.data, resourceProperties: properties});
                return ResourceClass._serialize(modelObj.id, modelObj.obj)
            }
            else {
                throw new Exceptions.ModelNotFound(ResourceClass.name);
            }
        });
    }

    static async fetch(options = {}) {
        let ResourceClass = this;

        ResourceClass.checkModel();
        let modelClass = ResourceClass.getModel(ResourceClass.fetch),
            properties = ResourceClass.joinProperties(options.requestProperties, ResourceClass.fetch);

        if (modelClass) {
            let modelObj = await modelClass.fetch({resourceProperties:properties});
            return ResourceClass._serializeArray(modelObj, properties);
        }
        else {
            throw new Exceptions.ModelNotFound(ResourceClass.name);
        }
    }

    static async fetchOne(options = {}) {
        let ResourceClass = this;

        ResourceClass.checkModel();

        let modelClass = ResourceClass.getModel(ResourceClass.fetch),
            properties = ResourceClass.joinProperties(options.requestProperties, ResourceClass.fetch);

        if (modelClass) {
            let modelObj = await modelClass.fetchOne({id: options.id, resourceProperties: properties});
            return ResourceClass._serialize(modelObj.id, modelObj.obj)
        }
        else {
            throw new Exceptions.ModelNotFound(ResourceClass.name);
        }
    }

    async put(options = {}) {
        let self = this,
            ResourceClass = this.constructor,
            modelClass = ResourceClass.getModel(ResourceClass.fetch),
            properties = ResourceClass.joinProperties(options.requestProperties, ResourceClass.fetch);

        if (modelClass) {
            await ResourceClass.valid(options.data, ResourceClass.prototype.put);

            let modelObj = await modelClass.fetchOne({id: self.id, resourceProperties: properties});
            modelObj = await modelObj.put({data: options.data, resourceProperties: properties});
            self.obj = modelObj.obj;
            return self;
        }
        else {
            throw new Exceptions.ModelNotFound(ResourceClass.name);
        }
    }

    async patch(options = {}) {
        let self = this,
            ResourceClass = this.constructor,
            modelClass = ResourceClass.getModel(ResourceClass.fetch),
            properties = ResourceClass.joinProperties(options.requestProperties, ResourceClass.fetch);

        if (modelClass) {
            let modelObj = await modelClass.fetchOne({id: self.id, resourceProperties: properties});
            let futureData = _.extend(modelObj.obj, options.data);
            await ResourceClass.valid(futureData, ResourceClass.prototype.patch);

            modelObj = await modelObj.patch({data: options.data, resourceProperties: properties});
            self.obj = modelObj.obj;
            return self;
        }
        else {
            throw new Exceptions.ModelNotFound(ResourceClass.name);
        }
    }

    async delete() {
        let self = this,
            ResourceClass = this.constructor,
            modelClass = ResourceClass.getModel(ResourceClass.fetch);

        if (modelClass) {
            let modelObj = await modelClass.fetchOne({id: self.id});
            return await modelObj.delete();
        }
        else {
            throw new Exceptions.ModelNotFound(ResourceClass.name);
        }
    }

}
export default GenericResource;