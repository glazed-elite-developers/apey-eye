'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
    value: true
});
/**
 * Created by Filipe on 03/03/2015.
 */

var _BaseClass = require('./BaseClass.js');

var _BaseClass2 = _interopRequireWildcard(_BaseClass);

function Annotation(type, properties) {
    return function decorator(target, key, descriptor) {
        if (descriptor) {
            descriptor.value.annotations = descriptor.value.annotations || {};
            descriptor.value.annotations[type] = properties;
        } else {
            target.annotations = target.annotations || {};
            target.annotations[type] = properties;
        }
        return descriptor;
    };
}

function InputAnnotation(properties) {
    var Input = require('./Input');

    if (!(properties instanceof Input)) {
        throw new Error('Annotations: @Input constructor must receive an Input instance.');
    }
    return Annotation('input', properties);
}
exports.Input = InputAnnotation;

function NameAnnotation(properties) {
    if (typeof properties != 'string') {
        throw new Error('Annotations: @Name property value must be a string.');
    }
    return function decorator(target, key, descriptor) {
        if (descriptor) {
            descriptor.value.annotations = descriptor.value.annotations || {};
            descriptor.value.annotations[type] = properties;
        } else {
            target.annotations = target.annotations || {};
            target.annotations.name = properties;

            var Model = require('./Model');
            if (target.prototype instanceof Model) {
                var ModelRegister = require('./ModelRegister');
                ModelRegister.register(properties, target);
            }
        }
        return descriptor;
    };
}
exports.Name = NameAnnotation;

function QueryAnnotation(properties) {

    if (properties != undefined && typeof properties === 'object' && !Array.isArray(properties)) {
        Object.keys(properties).forEach(function (property) {
            if (QueryAnnotation.AllowedProperties.indexOf(property) === -1) {
                throw new Error('Annotations: @Query property \'' + property + '\' aren\'t allowed. Use one of ' + QueryAnnotation.AllowedProperties);
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
    } else {
        throw new Error('Annotations: @Query must receive an object.');
    }

    return Annotation('query', properties);
}
QueryAnnotation.AllowedProperties = ['_sort', '_filter', '_page_size'];
exports.Query = QueryAnnotation;

function parseSort(sortProperties) {
    var sortingArray = [];

    if (Array.isArray(sortProperties)) {
        sortProperties.forEach(function (s) {
            if (typeof s !== 'string') {
                throw new Error('Annotations: All elements in @Query._sort array must be strings.');
            }
            var order = undefined,
                field = undefined,
                sortObj = {};

            if (s.charAt(0) === '-') {
                order = -1;
                field = s.substr(1);
            } else {
                order = 1;
                field = s;
            }
            sortObj[field] = order;
            sortingArray.push(sortObj);
        });
        sortProperties = sortingArray;
        return sortProperties;
    } else {
        throw new Error('Annotations: Argument received in @Query._sort must be an array.');
    }
}
function parsePageSize(pageSizeProperties) {

    if (typeof pageSizeProperties != 'number') {
        throw new Error('Annotations: @Query._page_size property value must be a number.');
    } else if (pageSizeProperties % 1 !== 0 || pageSizeProperties <= 0) {
        throw new Error('Annotations: @Query._page_size property value must be a positive integer.');
    }
}
function parseFilters(filterProperties) {

    if (typeof filterProperties != 'object' || Array.isArray(filterProperties)) {
        throw new Error('Annotations: @Query._filter must receive an object with filter properties.');
    }
}

function OutputAnnotation(properties) {
    if (properties != undefined && typeof properties === 'object' && !Array.isArray(properties)) {
        Object.keys(properties).forEach(function (property) {
            if (OutputAnnotation.AllowedProperties.indexOf(property) === -1) {
                throw new Error('Annotations: @Output property \'' + property + '\' aren\'t allowed. Use one of ' + OutputAnnotation.AllowedProperties);
            }
        });

        if (properties._embedded != undefined) {
            parseEmbedded(properties._embedded);
        }
        if (properties._fields != undefined) {
            parseFields(properties._fields);
        }
        return Annotation('output', properties);
    } else if (properties != undefined) {
        throw new Error('Annotations: @Query must receive an object.');
    }
}
OutputAnnotation.AllowedProperties = ['_fields', '_embedded'];
exports.Output = OutputAnnotation;

function parseEmbedded(embeddedProperties) {
    if (Array.isArray(embeddedProperties)) {
        embeddedProperties.forEach(function (s) {
            if (typeof s !== 'string') {
                throw new Error('Annotations: All elements in @Output._embedded array must be strings.');
            }
        });
    } else {
        throw new Error('Annotations: Argument received in @Output._embedded must be an array.');
    }
}
function parseFields(fieldsProperties) {
    if (Array.isArray(fieldsProperties)) {
        fieldsProperties.forEach(function (s) {
            if (typeof s !== 'string') {
                throw new Error('Annotations: All elements in @Output._fields array must be strings.');
            }
        });
    } else {
        throw new Error('Annotations: Argument received in @Output._fields must be an array.');
    }
}

function ModelAnnotation(modelClass) {
    var Model = require('./Model');

    if (!(modelClass.prototype instanceof Model)) {
        throw new Error('Annotations: @Model must receive an instance of Model class as argument');
    }
    return Annotation('model', modelClass);
}
exports.Model = ModelAnnotation;

function MethodsAnnotation(properties) {

    if (properties === undefined) {
        this.properties = undefined;
    } else if (properties && !Array.isArray(properties)) {
        throw new Error('Annotations: Argument received in @Methods must be an array.');
    } else {
        properties.forEach(function (s) {
            if (typeof s !== 'string') {
                throw new Error('Annotations: All elements in @Roles array must be strings.');
            }
        });
    }
    //else {
    //    properties.forEach(method => {
    //
    //
    //        ////TODO replace array with list of methods allowed for this annotation
    //        //if ([].indexOf(method) === -1) {
    //        //    throw  new Error(`Annotations: @Methods values must be contained in following set: ${MethodsAnnotation.methods()}`)
    //        //}
    //    })
    //}
    return Annotation('methods', properties);
}
exports.Methods = MethodsAnnotation;

function FormatAnnotation(formatClass) {
    var BaseFormatter = require('./Formatters').BaseFormatter;

    if (!(formatClass.prototype instanceof BaseFormatter)) {
        throw new Error('Annotations: @Format must receive a class with base class BaseFormatter.');
    }
    return Annotation('format', formatClass);
}
exports.Format = FormatAnnotation;

function MediaTypeAnnotation(mediaType) {
    if (typeof mediaType != 'string') {
        throw new Error('Annotations: @MediaType property value must be a string.');
    }
    return Annotation('mediaType', mediaType);
}
exports.MediaType = MediaTypeAnnotation;

function AuthenticationAnnotation(authenticationType) {
    if (authenticationType != undefined && typeof authenticationType != 'string') {
        throw new Error('Annotations: @Authentication property value must be a string.');
    }
    return Annotation('authentication', authenticationType);
}
exports.Authentication = AuthenticationAnnotation;

function RolesAnnotation(properties) {
    if (properties === undefined) {
        this.properties = undefined;
    } else if (properties && !Array.isArray(properties)) {
        throw new Error('Annotations: Argument received in @Roles must be an array.');
    } else {
        properties.forEach(function (s) {
            if (typeof s !== 'string') {
                throw new Error('Annotations: All elements in @Roles array must be strings.');
            }
        });
    }

    return Annotation('roles', properties);
}
exports.Roles = RolesAnnotation;

function ActionAnnotation() {
    return function decorator(target, key, descriptor) {
        if (descriptor) {
            var actions = undefined;

            if (target.prototype instanceof _BaseClass2['default']) {
                if (!target.actions) {
                    target.actions = { instance: {}, collection: {} };
                }
                actions = target.actions.collection;
            } else if (target.constructor.prototype instanceof _BaseClass2['default']) {
                var ResourceClass = target.constructor;
                if (!ResourceClass.actions) {
                    ResourceClass.actions = { instance: {}, collection: {} };
                }
                actions = ResourceClass.actions.instance;
            }
            if (!actions[key]) {
                actions[key] = descriptor.value;
                return descriptor;
            } else {
                throw new Error('Action \'' + key + ' already exists.');
            }
        }
    };
}
exports.Action = ActionAnnotation;

function DocumentationAnnotation(documentation) {
    if (documentation != undefined && typeof documentation === 'object' && !Array.isArray(documentation)) {
        return Annotation('documentation', documentation);
    } else {
        throw new Error('Annotations: @Documentation must receive an object.');
    }
}
exports.Documentation = DocumentationAnnotation;

function getProperty(source, type, method) {
    var property = undefined,
        annotation = undefined;

    var getAnnotation = function getAnnotation(annotations, annotationType) {
        return annotations[annotationType];
    };
    if (method) {
        var annotations = method.annotations;

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
        } else {
            return;
        }
    }
};
exports.getProperty = getProperty;