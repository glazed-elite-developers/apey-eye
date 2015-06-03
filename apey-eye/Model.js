/**
 * Created by GlazedSolutions on 11/03/2015.
 */

import _ from 'underscore';
import async from 'async';
import bluebird from 'bluebird';
import ModelRegister from './ModelRegister.js';
import BaseClass from './BaseClass.js';

let asyncEach = bluebird.promisify(async.each);

class Model extends BaseClass {

    static _serialize(id, data) {
        var ModelClass = this;

        let obj = {
            id: id,
            obj: data,
            constructor: ModelClass,
            oldObj: _.clone(data),
            valid(method) {
                return ModelClass.valid(this.obj, method);
            },
            save(options) {
                var method = ModelClass.prototype.save.bind(this);
                return method(options);
            },
            post(options){
                var method = ModelClass.prototype.put.bind(this);
                return method(options);
            },
            put(options) {
                var method = ModelClass.prototype.put.bind(this);
                return method(options);
            },
            patch(options){
                var method = ModelClass.prototype.patch.bind(this);
                return method(options);
            },
            delete (){
                var method = ModelClass.prototype.delete.bind(this);
                return method();
            }
        };
        if(ModelClass.actions){
            Object.keys(ModelClass.actions.instance).forEach(action => {
                obj[action] = async () => {
                    return ModelClass.prototype[action].apply(obj,arguments);
                };
            });
        }


        return obj;
    }

    static async _serializeArray(listObj, properties) {
        let ModelClass = this,
            serializedArray = [];

        await asyncEach(listObj, function (item, callback) {
            item = ModelClass._serialize(item.id, item);
            item = ModelClass.processOutput(item, properties)
                .then(item => {
                    serializedArray.push(item);
                    callback();
                });
        });

        Object.defineProperty(serializedArray, 'obj', {value: listObj, enumerable: false});
        return serializedArray;

    }

    async save(properties) {
        if (await this.valid()) {
            return await this.put({data: this.obj, resourceProperties: properties})
        }
    }

    static async processRelatedData(serializedObj, data, update) {
        let self = this,
            input = this.getInput();

        if (!data || !input) {
            return serializedObj;
        }
        await asyncEach(Object.keys(input.properties), function (field, callback) {
            self._processRelatedDataAux(input, data, ModelRegister, serializedObj, update, field)
                .then(item => {
                    callback();
                });
        });
        return serializedObj;
    }

    static async _processRelatedDataAux(input, data, ModelRegister, serializedObj, update, field) {
        let self = this,
            property = input.properties[field];

        try {
            data[field] = JSON.parse(data[field]);
        } catch (e) {
        }

        if (property.type === 'reference') {
            if (typeof data[field] === 'object') {
                let RelatedModelClass = ModelRegister.model(property.model),
                    embeddedObj = await new RelatedModelClass({data: data[field]}),
                    _data = {};

                _data[field] = embeddedObj.id;
                await serializedObj.patch({data: _data});
            }
        }
        else if (property.type === 'collection') {
            let RelatedModelClass = ModelRegister.model(property.model);

            if (data[field]) {
                if (update) {
                    let _filter = {};
                    _filter[property.inverse] = serializedObj.id;

                    let relatedList = await RelatedModelClass.fetch({
                        resourceProperties: {
                            _filter: _filter
                        }
                    });

                    for (let relatedObj of relatedList) {
                        if (data[field].indexOf(relatedObj.id) === -1) {
                            relatedObj.delete();
                        }
                    }
                }

                await asyncEach(data[field], function (related, callback) {
                    self.processCollectionData(related, property, serializedObj, RelatedModelClass)
                        .then(item => {
                            callback();
                        });
                });
            }
        }
        else if (property.type === 'manyToMany') {
            if (data[field]) {
                let ThroughModelClass = ModelRegister.model(property.through);

                if (!ThroughModelClass) {
                    throw  new Error(`BaseClass: through model '${property.through}' class for field '${field}' not exists.`);
                }
                else {
                    let throughInput = ThroughModelClass.getInput();

                    if (throughInput) {

                        let sourceModelName = this.getName();
                        let sourceField = _.findKey(throughInput.properties, function (obj) {
                            return obj.model === sourceModelName;
                        });
                        let targetField = _.findKey(throughInput.properties, function (obj) {
                            return obj.model === property.model;
                        });

                        if (update) {
                            let _filter = {};
                            _filter[sourceField] = serializedObj.id;
                            let relationList = await ThroughModelClass.fetch({
                                resourceProperties: {
                                    _filter: _filter
                                }
                            });
                            for (let elem of relationList) {
                                if (data[field].indexOf(elem[targetField]) === -1) {
                                    elem.delete();
                                }
                            }
                        }

                        if (data[field]) {
                            await asyncEach(data[field], function (target, callback) {
                                self.PostManyManyData(target, ModelRegister, property, targetField, sourceField, serializedObj, ThroughModelClass)
                                    .then(item => {
                                        callback();
                                    });
                            });
                        }
                    }
                }
            }

        }
    }

    static async processCollectionData(related, property, serializedObj, RelatedModelClass) {
        if (typeof related === 'object') {
            related[property.inverse] = serializedObj.id;
            await new RelatedModelClass({data: related});
        }
        else if (typeof related === 'string') {

            let relatedObj = await RelatedModelClass.fetchOne({id: related});
            if (relatedObj[property.inverse] != serializedObj.id) {
                let updateData = {};
                updateData[property.inverse] = serializedObj.id;
                await relatedObj.patch({data: updateData});
            }
        }
    }

    static async PostManyManyData(target, ModelRegister, property, targetField, sourceField, serializedObj, ThroughModelClass) {
        if (typeof target === 'object') {
            let TargetModelClass = ModelRegister.model(property.model);
            var targetObj = await new TargetModelClass({data: target});
            target = targetObj.id;

            let newData = {};
            newData[targetField] = target;
            newData[sourceField] = serializedObj.id;

            await new ThroughModelClass({data: newData});
        }
    }
}

export default Model;