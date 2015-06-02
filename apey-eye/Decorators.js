/**
 * Created by Filipe on 03/03/2015.
 */
import BaseClass from './BaseClass.js';
import _ from 'underscore';

function Annotation(type, properties) {
    return function decorator(target, key, descriptor) {
        if (descriptor) {
            descriptor.value.annotations = descriptor.value.annotations || {};
            descriptor.value.annotations[type] = properties;
        }
        else {
            target.annotations = target.annotations || {};
            target.annotations[type] = properties;
        }
        return descriptor;
    };
}

function InputAnnotation(properties) {
    let Input = require('./Input');

    if (!(properties instanceof Input)) {
        throw new Error("Decorators: @Input constructor must receive an Input instance.");
    }
    return Annotation('input', properties);
}
export {InputAnnotation as Input}

function NameAnnotation(properties) {
    if (typeof properties != 'string') {
        throw new Error("Decorators: @Name property value must be a string.")
    }
    return function decorator(target, key, descriptor) {
        if (descriptor) {
            descriptor.value.annotations = descriptor.value.annotations || {};
            descriptor.value.annotations[type] = properties;
        }
        else {
            target.annotations = target.annotations || {};
            target.annotations['name'] = properties;

            var Model = require('./Model');
            if(target.prototype instanceof Model){
                var ModelRegister = require('./ModelRegister');
                ModelRegister.register(properties, target);
            }
        }
        return descriptor;
    };
}
export {NameAnnotation as Name}

function QueryAnnotation(properties) {

    if (properties != undefined && typeof properties === "object" && !Array.isArray(properties)) {
        Object.keys(properties).forEach(property => {
            if (QueryAnnotation.AllowedProperties.indexOf(property) === -1) {
                throw new Error(`Annotations: @Query property '${property}' aren't allowed. Use one of ${QueryAnnotation.AllowedProperties}`);
            }
        });

        if (properties._sort != undefined) {
            properties._sort = parseSort(properties._sort);
        }
        if (properties._page_size != undefined) {
            parsePageSize(properties._page_size);
        }
        if (properties._filter != undefined) {
            parseFilters(properties._filter);
        }
    }
    else{
        throw new Error("Decorators: @Query must receive an object.");
    }

    return Annotation('query', properties);
}
QueryAnnotation.AllowedProperties = ['_sort', '_filter', '_page_size'];
export {QueryAnnotation as Query}

function parseSort(sortProperties) {
    var sortingArray = [];

    if (Array.isArray(sortProperties)) {
        sortProperties.forEach(s => {
            if (typeof s !== 'string') {
                throw new Error("Decorators: All elements in @Query._sort array must be strings.");
            }
            let order, field, sortObj = {};

            if (s.charAt(0) === '-') {
                order = -1;
                field = s.substr(1);
            }
            else {
                order = 1;
                field = s;
            }
            sortObj[field] = order;
            sortingArray.push(sortObj);
        });
        sortProperties = sortingArray;
        return sortProperties;
    }
    else {
        throw new Error("Decorators: Argument received in @Query._sort must be an array.");
    }
}
function parsePageSize(pageSizeProperties) {

    if (typeof pageSizeProperties != 'number') {
        throw new Error("Decorators: @Query._page_size property value must be a number.");
    }
    else if (pageSizeProperties % 1 !== 0 || pageSizeProperties <= 0) {
        throw new Error("Decorators: @Query._page_size property value must be a positive integer.")
    }
}
function parseFilters(filterProperties) {

    if (typeof filterProperties != "object" || Array.isArray(filterProperties)) {
        throw new Error("Decorators: @Query._filter must receive an object with filter properties.");
    }
}

function OutputAnnotation(properties) {
    if (properties != undefined && typeof properties === "object" && !Array.isArray(properties)) {
        Object.keys(properties).forEach(property => {
            if (OutputAnnotation.AllowedProperties.indexOf(property) === -1) {
                throw new Error(`Annotations: @Output property '${property}' aren't allowed. Use one of ${OutputAnnotation.AllowedProperties}`);
            }
        });

        if (properties._embedded != undefined) {
            parseEmbedded(properties._embedded);
        }
        if (properties._fields != undefined) {
            parseFields(properties._fields);
        }
        return Annotation('output', properties);
    }
    else if (properties != undefined) {
        throw new Error("Decorators: @Query must receive an object.");
    }
}
OutputAnnotation.AllowedProperties = ['_fields', '_embedded'];
export {OutputAnnotation as Output}

function parseEmbedded(embeddedProperties) {
    if (Array.isArray(embeddedProperties)) {
        embeddedProperties.forEach(s => {
            if (typeof s !== 'string') {
                throw new Error("Decorators: All elements in @Output._embedded array must be strings.");
            }
        });
    }
    else {
        throw new Error("Decorators: Argument received in @Output._embedded must be an array.");
    }
}
function parseFields(fieldsProperties) {
    if (Array.isArray(fieldsProperties)) {
        fieldsProperties.forEach(s => {
            if (typeof s !== 'string') {
                throw new Error("Decorators: All elements in @Output._fields array must be strings.");
            }
        });
    }
    else {
        throw new Error("Decorators: Argument received in @Output._fields must be an array.");
    }
}

function ModelAnnotation(modelClass) {
    var Model = require('./Model');

    if (!(modelClass.prototype instanceof Model )) {
        throw new Error("Decorators: @Model must receive an instance of Model class as argument");
    }
    return Annotation('model', modelClass);
}
export {ModelAnnotation as Model}

function MethodsAnnotation(properties) {

    if (properties === undefined) {
        this.properties = undefined;
    }
    else if (properties && !Array.isArray(properties)) {
        throw new Error("Decorators: Argument received in @Methods must be an array.");
    }
    else{
        properties.forEach(s => {
            if (typeof s !== 'string') {
                throw new Error("Decorators: All elements in @Roles array must be strings.");
            }
        });
    }
    return Annotation('methods', properties);

}
export {MethodsAnnotation as Methods}

function FormatAnnotation(formatClass) {
    var BaseFormatter = require('./Formatters').BaseFormatter;

    if (!(formatClass.prototype instanceof BaseFormatter )) {
        throw new Error("Decorators: @Format must receive a class with base class BaseFormatter.");
    }
    return Annotation('format', formatClass);
}
export {FormatAnnotation as Format}

function MediaTypeAnnotation(mediaType) {
    if (typeof mediaType != 'string') {
        throw new Error("Decorators: @MediaType property value must be a string.")
    }
    return Annotation('mediaType', mediaType);


}
export {MediaTypeAnnotation as MediaType}

function AuthenticationAnnotation(authenticationType) {
    if (authenticationType != undefined && typeof authenticationType != 'string') {
        throw new Error("Decorators: @Authentication property value must be a string.")
    }
    return Annotation('authentication', authenticationType);
}
export {AuthenticationAnnotation as Authentication}

function RolesAnnotation(properties) {
    if (properties === undefined) {
        this.properties = undefined;
    }
    else if (properties && !Array.isArray(properties)) {
        throw new Error("Decorators: Argument received in @Roles must be an array.");
    }
    else{
        properties.forEach(s => {
            if (typeof s !== 'string') {
                throw new Error("Decorators: All elements in @Roles array must be strings.");
            }
        });
    }

    return Annotation('roles', properties);

}
export {RolesAnnotation as Roles}

function ActionAnnotation() {
    return function decorator(target, key, descriptor) {
        if (descriptor) {
            let actions,
                ResourceClass;

            if(target.prototype instanceof BaseClass){
                ResourceClass = target;
                if(!ResourceClass.actions){
                    target.actions = {instance:{},collection:{}};
                }
                actions = ResourceClass.actions.collection;
            }
            else if(target.constructor.prototype instanceof BaseClass){
                ResourceClass = target.constructor;
                if(!ResourceClass.actions){
                    ResourceClass.actions = {instance:{},collection:{}};
                }
                actions = ResourceClass.actions.instance;
            }
            if (!actions[key]) {
                actions[key] = descriptor.value;
                return wrapActionDescriptor(ResourceClass, descriptor);
            } else {
                throw new Error('Action \'' + key + ' already exists.');
            }
        }
    }
}
export {ActionAnnotation as Action}

function wrapActionDescriptor(ResourceClass, descriptor){
    let oldDescritor = _.clone(descriptor);

    descriptor.value =  async function() {
        let result = await oldDescritor.value.call(this, arguments)
        return ResourceClass._serialize(undefined, result);
    };
    return descriptor;
}

function DocumentationAnnotation(documentation) {
    if (documentation != undefined && typeof documentation === "object" && !Array.isArray(documentation)) {
        return Annotation('documentation', documentation);
    }
    else{
        throw new Error("Decorators: @Documentation must receive an object.");
    }
}
export {DocumentationAnnotation as Documentation}

function getProperty(source, type, method) {
    let property,
        annotation;

    let getAnnotation = function (annotations, annotationType) {
        return annotations[annotationType];
    };
    if (method) {
        let annotations = method.annotations;

        if (annotations) {
            annotation = getAnnotation(annotations, type);

            if (annotation) {
                property = annotation;
                if (property) {
                    return property;
                }
            }
        }
    }
    if (source && source.annotations) {
        annotation = getAnnotation(source.annotations, type);
        if (annotation) {
            return annotation;
        }
        else {
            return
        }
    }
};
export {getProperty}