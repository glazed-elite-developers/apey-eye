/**
 * Created by Filipe on 26/03/2015.
 */
import * as Decorators from './Decorators';
import BluebirdExtended from './bluebird-extended';
import _ from 'underscore';
import ModelRegister from './ModelRegister.js';
import bluebird from 'bluebird';
import async from 'async';

let asyncEach = bluebird.promisify(async.each);


class BaseClass extends BluebirdExtended {
    constructor(executor) {
        super();
        let Class = this;
        super(function () {
            try {
                var method = executor.bind(Class);
                return method().then(function (obj) {
                    return Promise.resolve(obj);
                }).catch(function (error) {
                    return Promise.reject(error);
                })
            }
            catch (err) {
                return Promise.reject(err);
            }
        })
    }
    static getProperties(method = undefined){
        var outputProperties = this.getOutput(method) || {};
        var queryProperties = this.getQuery(method) || {};

        return _.clone(_.extend(outputProperties, queryProperties));
    }
    static joinProperties(resourceProperties = {}, method = undefined) {
        var outputProperties = this.getOutput(method) || {};
        var queryProperties = this.getQuery(method) || {};

        var resultProperties = _.clone(_.extend(outputProperties, queryProperties));

        if (resourceProperties._sort) {
            resultProperties._sort = resourceProperties._sort;
        }

        if (resultProperties._filter != undefined && resourceProperties._filter != undefined) {
            resultProperties._filter = _.extend(resourceProperties._filter, resultProperties._filter);
        }
        else if (resourceProperties._filter != undefined) {
            resultProperties._filter = resourceProperties._filter;
        }

        if (resultProperties._page_size != undefined && resourceProperties._pagination && resourceProperties._pagination._page_size != undefined) {
            resultProperties._pagination = {_page_size: _.min([resultProperties._page_size, resourceProperties._pagination.page_size])};
        }
        else if (resourceProperties._pagination != undefined && resourceProperties._pagination._page_size != undefined) {
            resultProperties._pagination = {_page_size: resourceProperties._pagination._page_size};
        }
        else {
            resultProperties._pagination = {_page_size: resultProperties._page_size};
        }


        if (resourceProperties._pagination && resourceProperties._pagination._page) {
            resultProperties._pagination._page = resourceProperties._pagination._page;
        }
        else {
            resultProperties._pagination._page = 1;
        }

        if (resultProperties._fields != undefined && resourceProperties._fields != undefined) {
            resultProperties._fields = _.intersection(resultProperties._fields, resourceProperties._fields);
        }
        else if (resourceProperties._fields != undefined) {
            resultProperties._fields = resourceProperties._fields;
        }

        if (resultProperties._embedded != undefined && resourceProperties._embedded != undefined) {
            resultProperties._embedded = _.intersection(resultProperties._embedded, resourceProperties._embedded);
        }
        else if (resourceProperties._embedded != undefined) {
            resultProperties._embedded = resourceProperties._embedded;
        }

        return resultProperties;

    }

    static getName(method) {
        return Decorators.getProperty(this, "name", method)
    }

    static getInput(method) {
        return Decorators.getProperty(this, "input", method)
    }

    static getOutput(method) {
        return Decorators.getProperty(this, "output", method)
    }

    static getQuery(method) {
        return Decorators.getProperty(this, "query", method)
    }

    static async valid(data, method) {
        let input = this.getInput(method);
        if (input) {
            return await input.valid(data);
        }
        else {
            return true;
        }
    }

    static async processOutput(obj, properties) {
        obj = this.selectFields(obj, properties._fields);
        obj = await this.processRelations(obj, properties._embedded, properties._fields);

        return obj;
    }

    static selectFields(serializedObj, fields) {
        if (fields) {
            serializedObj.obj = _.pick(serializedObj.obj, fields)
        }
        return serializedObj;
    }

    static async processRelations(serializedObj, embeddedFields, showFields) {
        let self = this,
            input = self.getInput();

        if (!input) {
            return serializedObj;
        }
        let keys = Object.keys(input.properties);
        if (showFields && showFields.length > 0) {
            keys = _.intersection(keys, showFields);
        }

        await asyncEach(keys, function (field, callback) {
            self.processRelationsAux(input, field, serializedObj, embeddedFields)
                .then(item => {
                    callback();
                })
                .catch(error => {
                    console.error(error.stack);
                    callback();
                });
        });

        return serializedObj;
    }

    static async processRelationsAux(input, field, serializedObj, embeddedFields) {
        let property = input.properties[field];
        if (property.type === 'reference') {
            if (serializedObj.obj[field]) {

                if (embeddedFields && embeddedFields.indexOf(field) > -1) {
                    let RelatedModelClass = ModelRegister.model(property.model),
                        embeddedObj = await RelatedModelClass.fetchOne({id: serializedObj.obj[field]});

                    serializedObj.obj[field] = embeddedObj.obj;
                }
            }
        }
        else if (property.type === "collection") {
            let RelatedModelClass = ModelRegister.model(property.model),
                _filter = {};
            _filter[property.inverse] = serializedObj.id;
            let embeddedObj = await RelatedModelClass.fetch({
                resourceProperties: {
                    _filter: _filter
                }
            });

            if (embeddedFields && embeddedFields.indexOf(field) > -1) {
                serializedObj.obj[field] = embeddedObj.obj;
            }
            else {
                serializedObj.obj[field] = _.reduce(embeddedObj, function (memo, elem) {
                    return memo.concat(elem.id)
                }, []);
            }
        }
        else if (property.type === "manyToMany") {
            let ThroughModelClass = ModelRegister.model(property.through);

            if (!ThroughModelClass) {
                throw  new Error(`BaseClass: through model '${property.through}' class for field '${field}' not exists.`);
            }
            else {
                let throughInput = ThroughModelClass.getInput();

                let sourceModelName = this.getName();
                let sourceField = _.findKey(throughInput.properties, function (obj) {
                    return obj.model === sourceModelName;
                });

                let targetField = _.findKey(throughInput.properties, function (obj) {
                    return obj.model === property.model;
                });

                let _filter = {},
                    _embedded = [targetField];
                _filter[sourceField] = serializedObj.id;

                let embeddedObjList;
                if (embeddedFields && embeddedFields.indexOf(field) > -1) {
                    embeddedObjList = await ThroughModelClass.fetch({
                        resourceProperties: {
                            _filter: _filter,
                            _embedded: _embedded
                        }
                    });
                }
                else {
                    embeddedObjList = await ThroughModelClass.fetch({
                        resourceProperties: {
                            _filter: _filter
                        }
                    });
                }
                if (embeddedObjList) {
                    serializedObj.obj[field] = _.uniq(_.reduce(embeddedObjList, function (memo, elem) {
                        return memo.concat(elem.obj[targetField])
                    }, []));
                }
                else {
                    serializedObj.obj[field] = undefined;
                }

            }
        }
    }
}

export default BaseClass;