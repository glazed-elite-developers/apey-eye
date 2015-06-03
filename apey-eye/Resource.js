/**
 * Created by GlazedSolutions on 02/03/2015.
 */

import BaseClass from './BaseClass';
import * as Decorators from './Decorators';
import * as Exceptions from './Exceptions.js';
import * as DefaultProperties from './DefaultProperties.js';
import * as Formatters from './Formatters.js';
import RethinkDBModel from './RethinkDBModel';
import _ from 'underscore';
import ModelRegister from './ModelRegister.js';

class Resource extends BaseClass {
    static HTTPResourceMethods = {
        collection: {
            post: {method: "constructor", static: true},
            get: {method: "fetch", static: true},
            put: {method: "put", static: true},
            patch: {method: "patch", static: true},
            delete: {method: "delete", static: true},
            options: {method: "options", static: true}
        },
        instance: {
            post: {method: "post"},
            get: {method: "fetchOne", static: true},
            put: {method: "put"},
            patch: {method: "patch"},
            delete: {method: "delete"},
            options: {method: "options"}
        }
    };

    static options() {

        let ResourceClass = this,
            options = ResourceClass._options('collection');

        return ResourceClass._serialize(undefined, options);
    }

    options() {

        let ResourceClass = this.constructor,
            options = ResourceClass._options('instance');

        return ResourceClass._serialize(undefined, options);
    }

    static _options(pathType) {
        let ResourceClass = this,
            httpMethods = DefaultProperties.HTTPMethods,
            options = {
                collection: {
                    query: ResourceClass.getQuery(),
                    output: ResourceClass.getOutput(),
                    input: ResourceClass.getInput(),
                    allowed_roles: ResourceClass.getAllowedRoles(),
                    auth: ResourceClass.getAuthentication(),
                    documentation: ResourceClass.getDocumentation(),
                    formatters: (ResourceClass.getFormat() && [ResourceClass.getFormat().getMediaType()]) || _.reduce(Formatters.FormattersList, function (memo, elem) {
                        return memo.concat(elem.getMediaType())
                    }, [])
                },
                methods: [],
                actions: {}
            };

        httpMethods.forEach(httpMethod => {
            let resourceMethod = ResourceClass.getResourceMethod(pathType, httpMethod);
            if (resourceMethod) {

                let resourceMethodProperties = Resource.HTTPResourceMethods[pathType][httpMethod.toLowerCase()];
                try{
                    if (Resource.allowedMethod.call(this, resourceMethodProperties)) {
                        let methodOptions = {
                            http_method: httpMethod.toUpperCase(),
                            query: ResourceClass.getQuery.call(resourceMethod),
                            output: ResourceClass.getOutput.call(resourceMethod),
                            input: ResourceClass.getInput.call(resourceMethod),
                            allowed_roles: ResourceClass.getAllowedRoles.call(resourceMethod),
                            auth: ResourceClass.getAuthentication.call(resourceMethod),
                            documentation: ResourceClass.getDocumentation.call(resourceMethod),
                            formatters: ResourceClass.getFormat.call(resourceMethod) && [ResourceClass.getFormat.call(resourceMethod).getMediaType()]
                        };
                        options.methods.push(methodOptions);
                    }
                }catch(e){}
            }
        });
        if(ResourceClass.actions) {

            Object.keys(ResourceClass.actions[pathType]).forEach(action => {

                let i = action.indexOf("_");
                let method = action.substr(0, i);
                let actionName = action.substr(i + 1);

                if (method && actionName) {
                    options.actions[actionName] = {
                        http_method: method.toUpperCase(),
                        path: `/${actionName}`
                    };
                }
            });
        }
        return options;
    }

    render(requestProperties = {}) {

        var ResourceClass = this.constructor,
            FormatNegotiator = require('./FormatNegotiator'),
            ResourceFormatter = ResourceClass.getFormat(),
            FormatClass;

        if (ResourceFormatter) {
            FormatClass = ResourceFormatter;
        }
        else {
            FormatClass = FormatNegotiator.selectFormatter(requestProperties)
        }

        return {
            type: FormatClass.getMediaType(),
            data: FormatClass.format(this.obj)
        }
    }

    static _serialize(id, data) {
        let ResourceClass = this;
        let obj = {
            id: id,
            obj: data,
            constructor: ResourceClass,
            put(options) {
                let method = ResourceClass.prototype.put.bind(this);
                return method(options);
            },
            patch(options){
                let method = ResourceClass.prototype.patch.bind(this);
                return method(options);
            },
            post(options){
                let method = ResourceClass.prototype.post.bind(this);
                return method(options);
            },
            options(options){
                let method = ResourceClass.prototype.options.bind(this);
                return method(options);
            },
            delete(){
                let method = ResourceClass.prototype.delete.bind(this);
                return method();
            },
            render(){
                let method = ResourceClass.prototype.render.bind(this);
                return method();
            }
        };
        if(ResourceClass.actions){
            Object.keys(ResourceClass.actions.instance).forEach(action => {
                obj[action] = async () => {
                    return ResourceClass.prototype[action].apply(obj, arguments);
                };
            });
        }

        return obj;
    }

    static _serializeArray(listObj) {
        let ResourceClass = this;

        let serializedArray = [];
        listObj.forEach(item=> {
            item = ResourceClass._serialize(item.id, item.obj);
            //item.obj = ResourceClass.selectFields(item.obj, properties._fields);
            serializedArray.push(item);
        });

        let renderMethod = ResourceClass.prototype.render.bind(serializedArray);
        let listData = _.reduce(listObj, function (memo, elem) {
            return memo.concat(elem.obj)
        }, []);

        Object.defineProperty(serializedArray, 'obj', {value: listData, enumerable: false});
        Object.defineProperty(serializedArray, 'render', {value: renderMethod, enumerable: false});
        Object.defineProperty(serializedArray, 'constructor', {value: ResourceClass, enumerable: false});

        return serializedArray;
    }

    static getMethods() {
        return Decorators.getProperty(this, "methods");
    }

    static getFormat() {
        return Decorators.getProperty(this, "format");
    }

    static getAuthentication(method) {
        return Decorators.getProperty(this, "authentication", method);
    }

    static getAllowedRoles(method) {
        return Decorators.getProperty(this, "roles", method);
    }

    static getModel(method) {
        return Decorators.getProperty(this, "model", method);
    }
    static getDocumentation(method) {
        return Decorators.getProperty(this, "documentation", method);
    }

    static _getActionMethod(options) {
        let ResourceClass = this;
        if(ResourceClass.actions){
            if (options.pathType === 'instance_action') {
                let actionMethod = `${options.method}_${options.action}`;

                for (let key in ResourceClass.actions.instance) {
                    if (typeof ResourceClass.prototype[key] === "function") {
                        if (key.toLowerCase() === actionMethod.toLowerCase()) {
                            return key;
                        }
                    }
                }
                throw new Exceptions.NotFound(options.action);
            }
            else if (options.pathType === 'instance') {

                let actionMethod = `${options.method}_${options.id}`;

                for (let key in ResourceClass.actions.collection) {
                    if (typeof ResourceClass[key] === "function") {
                        if (key.toLowerCase() === actionMethod.toLowerCase()) {
                            options.action = options.id;
                            delete options.id;
                            return key;
                        }
                    }
                }
            }
            return false;
        }
        else{
            return false;
        }
    }

    static getResourceMethod(options) {

        let ResourceClass = this,
            actionMethod = ResourceClass._getActionMethod(options);
        if (actionMethod) {
            if (options.pathType === 'instance_action') {
                return ResourceClass.prototype[actionMethod];
            }
            else if (options.pathType === 'instance') {
                return ResourceClass[actionMethod];
            }
        }

        var methodProperties = Resource.HTTPResourceMethods[options.pathType][options.method.toLowerCase()],
            resourceMethod;
        if (methodProperties) {
            if (methodProperties.static) {
                if (methodProperties.method === 'constructor') {
                    resourceMethod = this;
                }
                else {
                    resourceMethod = this[methodProperties.method];
                }
            }
            else {
                resourceMethod = this.prototype[methodProperties.method];
            }
        }
        return resourceMethod;
    }

    static allowedMethod(resourceMethodProperties) {
        let allowedMethods = this.getMethods();
        if(resourceMethodProperties.method === 'options'){
            return true;
        }
        else {
            if (resourceMethodProperties) {
                let methodDescriptor;
                if (resourceMethodProperties.method === 'constructor') {
                    methodDescriptor = resourceMethodProperties.method;
                }
                else {
                    methodDescriptor = "";
                    if (resourceMethodProperties.static) {
                        methodDescriptor = methodDescriptor.concat("static.");
                    }
                    methodDescriptor = methodDescriptor.concat(resourceMethodProperties.method);
                }

                if (!allowedMethods || (allowedMethods && allowedMethods.indexOf(methodDescriptor) > -1)) {
                    if (resourceMethodProperties.static) {
                        if (resourceMethodProperties.method === 'constructor') {
                            return true;
                        }
                        else {
                            if (this[resourceMethodProperties.method]) {
                                return true;
                            }
                        }
                    }
                    else {
                        if (this.prototype[resourceMethodProperties.method]) {
                            return true;
                        }
                    }
                    throw new Exceptions.NotImplemented();
                }
                else {
                    throw new Exceptions.MethodNotAllowed();
                }
            }
            else {
                throw new Exceptions.MethodNotAllowed();
            }
        }
    }

    static async _handleRequest(options) {
        let ResourceClass = this,
            actionMethod = ResourceClass._getActionMethod(options);

        if (actionMethod) {
            if (options.pathType === 'instance_action') {
                let obj = await ResourceClass.fetchOne({id: options.id});
                return obj[actionMethod]({data: options.data, requestProperties: options.requestProperties});
            }
            else if (options.pathType === 'instance') {
                return ResourceClass[actionMethod]({data: options.data, requestProperties: options.requestProperties});
            }
        }

        let resourceMethodProperties = Resource.HTTPResourceMethods[options.pathType][options.method.toLowerCase()];
        if (this.allowedMethod(resourceMethodProperties)) {

            if (resourceMethodProperties.static) {
                if (resourceMethodProperties.method === 'constructor') {
                    return new ResourceClass({data: options.data, requestProperties: options.requestProperties});
                }
                else {
                    if (ResourceClass[resourceMethodProperties.method]) {
                        return ResourceClass[resourceMethodProperties.method]({
                            id: options.id,
                            requestProperties: options.requestProperties
                        });
                    }
                }
            }
            else {
                if (ResourceClass.prototype[resourceMethodProperties.method]) {
                    let obj = await ResourceClass.fetchOne({id: options.id});
                    return obj[resourceMethodProperties.method]({
                        data: options.data,
                        requestProperties: options.requestProperties
                    });
                }
            }
            throw new Exceptions.NotImplemented();
        }
        else {
            throw new Exceptions.MethodNotAllowed();
        }
    }

    static checkModel(method) {
        let ResourceClass = this;
        let ModelClass = ResourceClass.getModel(method);

        if (!ModelClass) {
            let resourceName = ResourceClass.getName();
            if (resourceName) {
                ResourceClass._appendNewModel(resourceName, ResourceClass.noBackend);
            }
            else {
                throw new Error("GenericResource: Resource must have a name to allow automatic creation of a Model class.");
            }
        }
    }

    static _appendNewModel(resourceName, noBackend) {
        let ResourceClass = this;

        let ModelRegistered = ModelRegister.model(resourceName);
        if (ModelRegistered) {
            ResourceClass.annotations.model = ModelRegistered;
        }
        else {
            let input = ResourceClass.getInput(),
                generatedModel;

            if (input) {
                @Decorators.Name(resourceName)
                @Decorators.Input(input)
                class GeneratedModel extends RethinkDBModel {
                }

                generatedModel = GeneratedModel;
            }
            else {
                @Decorators.Name(resourceName)
                class GeneratedModel extends RethinkDBModel {
                }
                generatedModel = GeneratedModel;
            }

            generatedModel.noBackend = noBackend;

            ResourceClass.annotations.model = generatedModel;
        }


    }

}
export default Resource;