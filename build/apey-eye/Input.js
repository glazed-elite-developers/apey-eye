/**
 * Created by Filipe on 23/03/2015.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ModelJs = require('./Model.js');

var _ModelJs2 = _interopRequireDefault(_ModelJs);

var _ModelRegisterJs = require('./ModelRegister.js');

var _ModelRegisterJs2 = _interopRequireDefault(_ModelRegisterJs);

var _ExceptionsJs = require('./Exceptions.js');

var Exceptions = _interopRequireWildcard(_ExceptionsJs);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var Input = (function () {
    function Input(properties) {
        _classCallCheck(this, Input);

        if (Input.validProperties(properties)) {
            this.properties = properties;
        }
    }

    _createClass(Input, [{
        key: 'valid',
        value: _asyncToGenerator(function* () {
            var data = arguments[0] === undefined ? {} : arguments[0];

            var fieldsArray = [];
            fieldsArray = fieldsArray.concat(Object.keys(data));
            fieldsArray = fieldsArray.concat(Object.keys(this.properties));
            fieldsArray = _underscore2['default'].without(fieldsArray, 'id');

            //TODO fields duplicados

            if (typeof data === 'object' && !Array.isArray(data)) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = fieldsArray[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var field = _step.value;

                        var dataField = data[field];
                        //CHECK IF FIELD RECEIVED IS INCLUDED IN INPUT PROPERTIES
                        if (!this.properties[field]) {
                            throw new Exceptions.BadRequest('Field \'' + field + '\' is not allowed');
                        } else {
                            data[field] = yield this.validField(field, dataField);
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator['return']) {
                            _iterator['return']();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                return true;
            } else {
                throw new Exceptions.BadRequest('Data received must be an object, received \'' + data + '\'');
            }
        })
    }, {
        key: 'validField',
        value: _asyncToGenerator(function* (field, dataField) {
            var fieldProperties = this.properties[field];

            //ASSIGN DEFAULT VALUE
            if (dataField === undefined && fieldProperties['default']) {
                if (fieldProperties.type === 'date' && fieldProperties['default'] === 'now') {
                    dataField = new Date().toISOString();
                } else {
                    dataField = fieldProperties['default'];
                }
            }
            //CHECK REQUIRED
            if (fieldProperties.required === true && dataField === undefined) {
                throw new Exceptions.BadRequest('Field \'' + field + '\' is required and its value is ' + dataField);
            } else if (!fieldProperties.required && dataField == undefined) {
                return;
            }
            //CHECK DATA TYPE
            switch (fieldProperties.type) {
                case 'string':
                    {
                        Input.validString(field, dataField);
                        break;
                    }
                case 'number':
                    {
                        Input.validNumber(field, dataField);
                        break;
                    }
                case 'boolean':
                    {
                        Input.validBoolean(field, dataField);
                        break;
                    }
                case 'date':
                    {
                        Input.validDate(field, dataField);
                        break;
                    }
                case 'reference':
                    {
                        dataField = yield Input.validReference(field, dataField, fieldProperties.model);
                        break;
                    }
                case 'collection':
                    {
                        dataField = yield Input.validCollection(field, dataField, fieldProperties.model);
                        break;
                    }
                case 'manyToMany':
                    {
                        dataField = yield Input.validManyToMany(field, dataField, fieldProperties.model);
                        break;
                    }
                default:
                    {
                        throw new Exceptions.BadRequest('Invalid input type');
                    }
            }

            //TEST REGEX
            if (fieldProperties.regex && fieldProperties.regex instanceof RegExp) {
                if (!fieldProperties.regex.test(dataField)) {
                    throw new Exceptions.BadRequest('Field \'' + field + '\' value does not match with its regular expression \'' + fieldProperties.regex + '\'');
                }
            }

            //TEST VALID FUNCTION
            if (fieldProperties.valid && typeof fieldProperties.valid === 'function') {
                fieldProperties.valid(dataField);
            }

            //CHECK CHOICES
            if (fieldProperties.choices && typeof Array.isArray(fieldProperties.choices)) {
                if (fieldProperties.choices.indexOf(dataField) === -1) {
                    throw new Exceptions.BadRequest('Field \'' + field + ' value don\'t match to choices property, ' + fieldProperties.choices + '.\'');
                }
            }
            return dataField;
        })
    }], [{
        key: 'URLPattern',
        value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
        enumerable: true
    }, {
        key: 'ISODatePattern',
        value: /^(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z$))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z$))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z$))/,
        enumerable: true
    }, {
        key: 'DefaultDateNow',
        value: 'now',
        enumerable: true
    }, {
        key: 'validProperties',
        value: function validProperties(properties) {
            if (!properties) {
                throw new Error('Input: Input must receive properties as argument.');
            } else if (!(properties instanceof Object) || properties instanceof Array) {
                throw new Error('Input: Input must receive an object as properties.');
            } else {
                Object.keys(properties).forEach(function (field) {
                    var fieldProperties = properties[field];

                    //TYPE MUST BE DEFINED
                    if (fieldProperties.type === undefined) {
                        throw new Error('Input: type of field ' + field + ' must be indicated in properties.');
                    }
                    //IF RELATION MUST HAVE A MODEL
                    if (allowedRelations.indexOf(fieldProperties.type) > -1 && fieldProperties.model === undefined) {
                        throw new Error('Input: model of relation ' + field + ' must be indicated in properties.');
                    }
                    //IF RELATION IS COLLECTION MUST HAVE INVERSE
                    if (fieldProperties.type === 'collection' && fieldProperties.inverse === undefined) {
                        throw new Error('Input: inverse of relation ' + field + ' must be indicated in properties.');
                    }
                    //IF RELATION IS MANYTOMANY MUST HAVE INVERSE AND THROUGH
                    if (fieldProperties.type === 'manyToMany') {
                        if (fieldProperties.inverse === undefined) {
                            throw new Error('Input: inverse of relation ' + field + ' must be indicated in properties.');
                        }
                        if (fieldProperties.through === undefined) {
                            throw new Error('Input: through model of relation ' + field + ' must be indicated in properties.');
                        }
                    }
                    //TYPE PROPERTY MUST BE A STRING
                    if (typeof fieldProperties.type != 'string') {
                        throw new Error('Input: value of type property must be a string.');
                    }
                    //TYPE OS PROPERTY MUST BE ALLOWED
                    if (allowedTypes.indexOf(fieldProperties.type) === -1) {
                        throw new Error('Input: value of type property must be one of the following values ' + allowedTypes + ', received \'' + fieldProperties.type + '\'.');
                    }
                    //REQUIRED PROPERTY MUST BE BOOLEAN
                    if (fieldProperties.required != undefined && typeof fieldProperties.required != 'boolean') {
                        throw new Error('Input: value of required property must be a boolean.');
                    }
                    //REGEX MUST BE INSTANCE OF RegExp
                    if (fieldProperties.regex != undefined && !(fieldProperties.regex instanceof RegExp)) {
                        throw new Error('Input: value of regex property must be a RegExp.');
                    }
                    //VALID MUST BE A FUNCTION
                    if (fieldProperties.valid != undefined && typeof fieldProperties.valid !== 'function') {
                        throw new Error('Input: value of valid property must be a function.');
                    }
                    //CHOICES MUST BE AN ARRAY AND THE TYPE OF ITS VALUS MUST BE EQUAL TO TYPE PROPERTY
                    if (fieldProperties.choices != undefined) {
                        if (!(fieldProperties.choices instanceof Array)) {
                            throw new Error('Input: value of choices property must be an array.');
                        }
                        fieldProperties.choices.forEach(function (choice) {
                            if (typeof choice !== fieldProperties.type) {
                                throw new Error('Input: value of choices property must be an array of ' + fieldProperties.type);
                            }
                        });
                    }
                    //MODEL PROPERTY MUST BE A STRING WITH NAME OF MODEL
                    if (fieldProperties.model != undefined && typeof fieldProperties.model !== 'string') {
                        throw new Error('Input: value of model property must be a string.');
                    }
                    //THROUGH PROPERTY MUST BE A STRING WITH NAME OF MODEL
                    if (fieldProperties.model != undefined && typeof fieldProperties.model !== 'string') {
                        throw new Error('Input: value of model property must be a string.');
                    }
                    //DEFAULT PROPERTY MUST HAVE THE SAME TYPE OF TYPE PROPERTY
                    if (fieldProperties['default'] != undefined && typeof fieldProperties['default'] != typeof fieldProperties.type) {
                        throw new Error('Input: value of model property must be a string.');
                    }
                });

                return true;
            }
        }
    }, {
        key: 'validString',
        value: function validString(field, dataField) {
            if (typeof dataField === 'string') {
                return true;
            } else {
                throw new Exceptions.BadRequest('Invalid string value in field \'' + field + '\'.');
            }
        }
    }, {
        key: 'validNumber',
        value: function validNumber(field, dataField) {
            if (typeof dataField === 'number') {
                return true;
            } else {
                throw new Exceptions.BadRequest('Invalid number value in field \'' + field + '\'.');
            }
        }
    }, {
        key: 'validBoolean',
        value: function validBoolean(field, dataField) {
            if (typeof dataField === 'boolean') {
                return true;
            } else {
                throw new Exceptions.BadRequest('Invalid boolean value in field \'' + field + '\'.');
            }
        }
    }, {
        key: 'validDate',
        value: function validDate(field, dataField) {
            if (typeof dataField === 'string') {
                if (Input.ISODatePattern.test(dataField)) {
                    return true;
                } else {
                    throw new Exceptions.BadRequest('Date in field \'' + field + '\' must follow ISO8601 format.');
                }
            } else {
                throw new Exceptions.BadRequest('Invalid date value in field ' + field + '.');
            }
        }
    }, {
        key: 'validReference',
        value: _asyncToGenerator(function* (field, dataField, modelName) {

            var ModelClass = _ModelRegisterJs2['default'].model(modelName);

            try {
                dataField = JSON.parse(dataField);
            } catch (e) {}

            if (typeof dataField === 'object' && !Array.isArray(dataField)) {
                if (yield ModelClass.valid(dataField)) {
                    return dataField;
                }
            } else {
                try {
                    yield ModelClass.fetchOne({ id: dataField });
                    return dataField;
                } catch (err) {
                    if (err instanceof Exceptions.NotFound) {
                        throw new Exceptions.BadRequest('Referenced value \'' + dataField + '\' in field \'' + field + '\' not found');
                    } else {
                        throw err;
                    }
                }
            }
        })
    }, {
        key: 'validCollection',
        value: _asyncToGenerator(function* (field, dataField, modelName) {

            if (dataField) {
                var collectionParsed = undefined;
                try {
                    if (typeof dataField === 'string') {
                        collectionParsed = JSON.parse(dataField);
                    } else {
                        collectionParsed = dataField;
                    }
                } catch (e) {
                    throw new Exceptions.BadRequest('Value in field \'' + field + '\' must be an array of references');
                }
                if (Array.isArray(collectionParsed)) {
                    var ModelClass = _ModelRegisterJs2['default'].model(modelName);

                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = collectionParsed[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var reference = _step2.value;

                            if (typeof reference === 'string') {
                                try {
                                    var obj = yield ModelClass.fetchOne({ id: reference });
                                } catch (err) {
                                    if (err instanceof Exceptions.NotFound) {
                                        throw new Exceptions.BadRequest(' Value \'' + reference + '\' referenced in field \'' + field + '\' not found');
                                    } else {
                                        throw err;
                                    }
                                }
                            } else if (typeof reference !== 'object') {
                                throw new Exceptions.BadRequest('Value in collection field must be a reference or an object, received ' + reference);
                            }
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                                _iterator2['return']();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }

                    return collectionParsed;
                } else {
                    throw new Exceptions.BadRequest('Value in collection field must be an array, received ' + dataField);
                }
            }
        })
    }, {
        key: 'validManyToMany',
        value: _asyncToGenerator(function* (field, dataField, modelName) {
            if (dataField) {
                var collectionParsed = undefined;
                try {
                    if (typeof dataField === 'string') {
                        collectionParsed = JSON.parse(dataField);
                    } else {
                        collectionParsed = dataField;
                    }
                } catch (e) {
                    throw new Exceptions.BadRequest('Value in field \'' + field + '\' must be a json array of references');
                }
                if (Array.isArray(collectionParsed)) {
                    var ModelClass = _ModelRegisterJs2['default'].model(modelName);
                    for (var i in collectionParsed) {
                        var reference = collectionParsed[i];

                        if (typeof reference === 'string') {
                            try {
                                var obj = yield ModelClass.fetchOne({ id: reference });
                            } catch (err) {
                                if (err instanceof Exceptions.NotFound) {
                                    throw new Exceptions.BadRequest(' Value \'' + reference + '\' referenced in field \'' + field + '\' not found');
                                } else {
                                    throw err;
                                }
                            }
                        }
                    }
                    return collectionParsed;
                } else {
                    throw new Exceptions.BadRequest('Value in manyToMany field must be an array, received ' + dataField);
                }
            }
        })
    }]);

    return Input;
})();

exports['default'] = Input;

var allowedTypes = ['string', 'number', 'date', 'boolean', 'reference', 'collection', 'manyToMany'];
var allowedRelations = ['reference', 'collection', 'manyToMany'];
module.exports = exports['default'];