/**
 * Created by GlazedSolutions on 23/03/2015.
 */
import Model from './Model.js';
import ModelRegister from './ModelRegister.js';
import * as Exceptions from './Exceptions.js';
import _ from 'underscore';

class Input {

    static URLPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    static ISODatePattern = /^(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z$))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z$))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z$))/;
    static DefaultDateNow = 'now';

    constructor(properties) {
        if (Input.validProperties(properties)) {
            this.properties = properties;
        }
    }

    static validProperties(properties) {
        if (!properties) {
            throw new Error("Input: Input must receive properties as argument.");
        }
        else if (!(properties instanceof Object) || properties instanceof Array) {
            throw new Error("Input: Input must receive an object as properties.");
        }
        else {
            Object.keys(properties).forEach(field => {
                var fieldProperties = properties[field];

                //TYPE MUST BE DEFINED
                if (fieldProperties.type === undefined) {
                    throw new Error(`Input: type of field ${field} must be indicated in properties.`);
                }
                //IF RELATION MUST HAVE A MODEL
                if (allowedRelations.indexOf(fieldProperties.type) > -1 && fieldProperties.model === undefined) {
                    throw new Error(`Input: model of relation ${field} must be indicated in properties.`);
                }
                //IF RELATION IS COLLECTION MUST HAVE INVERSE
                if (fieldProperties.type === 'collection' && fieldProperties.inverse === undefined) {
                    throw new Error(`Input: inverse of relation ${field} must be indicated in properties.`);
                }
                //IF RELATION IS MANYTOMANY MUST HAVE INVERSE AND THROUGH
                if (fieldProperties.type === 'manyToMany') {
                    if (fieldProperties.inverse === undefined) {
                        throw new Error(`Input: inverse of relation ${field} must be indicated in properties.`);
                    }
                    if (fieldProperties.through === undefined) {
                        throw new Error(`Input: through model of relation ${field} must be indicated in properties.`);
                    }
                }
                //TYPE PROPERTY MUST BE A STRING
                if (typeof fieldProperties.type != "string") {
                    throw new Error("Input: value of type property must be a string.");
                }
                //TYPE OS PROPERTY MUST BE ALLOWED
                if (allowedTypes.indexOf(fieldProperties.type) === -1) {
                    throw new Error(`Input: value of type property must be one of the following values ${allowedTypes}, received '${fieldProperties.type}'.`)
                }
                //REQUIRED PROPERTY MUST BE BOOLEAN
                if (fieldProperties.required != undefined && typeof fieldProperties.required != "boolean") {
                    throw new Error("Input: value of required property must be a boolean.");
                }
                //REGEX MUST BE INSTANCE OF RegExp
                if (fieldProperties.regex != undefined && !(fieldProperties.regex instanceof RegExp)) {
                    throw new Error("Input: value of regex property must be a RegExp.");
                }
                //VALID MUST BE A FUNCTION
                if (fieldProperties.valid != undefined && (typeof fieldProperties.valid !== "function")) {
                    throw new Error("Input: value of valid property must be a function.");
                }
                //CHOICES MUST BE AN ARRAY AND THE TYPE OF ITS VALUS MUST BE EQUAL TO TYPE PROPERTY
                if (fieldProperties.choices != undefined) {
                    if (!(fieldProperties.choices instanceof Array)) {
                        throw new Error("Input: value of choices property must be an array.");
                    }
                    fieldProperties.choices.forEach(choice => {
                        if (typeof choice !== fieldProperties.type) {
                            throw new Error(`Input: value of choices property must be an array of ${fieldProperties.type}`);
                        }
                    });
                }
                //MODEL PROPERTY MUST BE A STRING WITH NAME OF MODEL
                if (fieldProperties.model != undefined && typeof fieldProperties.model !== "string") {
                    throw new Error("Input: value of model property must be a string.");
                }
                //THROUGH PROPERTY MUST BE A STRING WITH NAME OF MODEL
                if (fieldProperties.model != undefined && typeof fieldProperties.model !== "string") {
                    throw new Error("Input: value of model property must be a string.");
                }
                //DEFAULT PROPERTY MUST HAVE THE SAME TYPE OF TYPE PROPERTY
                if (fieldProperties.default != undefined && typeof fieldProperties.default != fieldProperties.type) {
                    if (!(fieldProperties.type === "date" && fieldProperties.default === "now")) {
                        throw new Error(`Input: value of model property must be a ${fieldProperties.type}`);
                    }
                }
            });

            return true;
        }
    }

    async valid(data = {}) {

        let fieldsArray = [];
        fieldsArray = fieldsArray.concat(Object.keys(data));
        fieldsArray = fieldsArray.concat(Object.keys(this.properties));
        fieldsArray = _.without(fieldsArray, "id");


        //TODO fields duplicados

        if (typeof data === 'object' && !Array.isArray(data)) {
            for (let field of fieldsArray) {
                let dataField = data[field];
                //CHECK IF FIELD RECEIVED IS INCLUDED IN INPUT PROPERTIES
                if (!this.properties[field]) {
                    throw new Exceptions.BadRequest(`Field '${field}' is not allowed`);
                }
                else {
                    data[field] = await this.validField(field, dataField);
                }
            }
            return true;
        }
        else {
            throw new Exceptions.BadRequest(`Data received must be an object, received '${data}'`);
        }


    }

    async validField(field, dataField) {
        let fieldProperties = this.properties[field];

        //ASSIGN DEFAULT VALUE
        if (dataField === undefined && fieldProperties.default) {
            if (fieldProperties.type === 'date' && fieldProperties.default === 'now') {
                dataField = new Date().toISOString();
            }
            else{
                dataField = fieldProperties.default;
            }
        }
        //CHECK REQUIRED
        if (fieldProperties.required === true && dataField === undefined) {
            throw new Exceptions.BadRequest(`Field '${field}' is required and its value is ${dataField}`)
        }
        else if (!fieldProperties.required && dataField == undefined) {
            return;
        }
        //CHECK DATA TYPE
        switch (fieldProperties.type) {
            case "string":
            {
                Input.validString(field, dataField);
                break;
            }
            case "number":
            {
                Input.validNumber(field, dataField);
                break;
            }
            case "boolean":
            {
                Input.validBoolean(field, dataField);
                break;
            }
            case "date":
            {
                Input.validDate(field, dataField);
                break;
            }
            case "reference":
            {
                dataField = await Input.validReference(field, dataField, fieldProperties.model);
                break;
            }
            case "collection":
            {
                dataField = await Input.validCollection(field, dataField, fieldProperties.model);
                break;
            }
            case "manyToMany":
            {
                dataField = await Input.validManyToMany(field, dataField, fieldProperties.model);
                break;
            }
            default :
            {
                throw new Exceptions.BadRequest("Invalid input type");
            }
        }

        //TEST REGEX
        if (fieldProperties.regex && fieldProperties.regex instanceof RegExp) {
            if (!fieldProperties.regex.test(dataField)) {
                throw new Exceptions.BadRequest(`Field '${field}' value does not match with its regular expression '${fieldProperties.regex}'`);
            }
        }

        //TEST VALID FUNCTION
        if (fieldProperties.valid && typeof fieldProperties.valid === 'function') {
            fieldProperties.valid(dataField);
        }

        //CHECK CHOICES
        if (fieldProperties.choices && typeof Array.isArray(fieldProperties.choices)) {
            if (fieldProperties.choices.indexOf(dataField) === -1) {
                throw new Exceptions.BadRequest(`Field '${field} value don't match to choices property, ${fieldProperties.choices}.'`);
            }
        }
        return dataField;
    }

    static validString(field, dataField) {
        if (typeof dataField === "string") {
            return true;
        }
        else {
            throw new Exceptions.BadRequest(`Invalid string value in field '${field}'.`);
        }
    }

    static validNumber(field, dataField) {
        if (typeof dataField === "number") {
            return true;
        }
        else {
            throw new Exceptions.BadRequest(`Invalid number value in field '${field}'.`);
        }
    }

    static validBoolean(field, dataField) {

        if (typeof dataField === "boolean") {
            return true;
        }
        else {
            throw new Exceptions.BadRequest(`Invalid boolean value in field '${field}'.`);
        }
    }

    static validDate(field, dataField) {
        if (typeof dataField === "string") {
            if (Input.ISODatePattern.test(dataField)) {
                return true;
            }
            else {
                throw new Exceptions.BadRequest(`Date in field '${field}' must follow ISO8601 format.`);
            }
        }
        else {
            throw new Exceptions.BadRequest(`Invalid date value in field ${field}.`);
        }
    }

    static async validReference(field, dataField, modelName) {

        let ModelClass = ModelRegister.model(modelName);

        try {
            dataField = JSON.parse(dataField);
        } catch (e) {
        }

        if (typeof dataField === 'object' && !Array.isArray(dataField)) {
            if (await ModelClass.valid(dataField)) {
                return dataField;
            }
        }
        else {
            try {
                await ModelClass.fetchOne({id: dataField})
                return dataField;
            }
            catch (err) {
                if (err instanceof Exceptions.NotFound) {
                    throw new Exceptions.BadRequest(`Referenced value '${dataField}' in field '${field}' not found`);
                }
                else {
                    throw err;
                }
            }
        }
    }

    static async validCollection(field, dataField, modelName) {

        if (dataField) {
            let collectionParsed;
            try {
                if (typeof dataField === 'string') {
                    collectionParsed = JSON.parse(dataField);
                }
                else {
                    collectionParsed = dataField;
                }
            } catch (e) {
                throw new Exceptions.BadRequest(`Value in field '${field}' must be an array of references`);
            }
            if (Array.isArray(collectionParsed)) {
                let ModelClass = ModelRegister.model(modelName);

                for (let reference of collectionParsed) {

                    if (typeof reference === 'string') {
                        try {
                            var obj = await ModelClass.fetchOne({id: reference})
                        }
                        catch (err) {
                            if (err instanceof Exceptions.NotFound) {
                                throw new Exceptions.BadRequest(` Value '${reference}' referenced in field '${field}' not found`);
                            }
                            else {
                                throw err;
                            }
                        }
                    }
                    else if (typeof reference !== 'object') {
                        throw new Exceptions.BadRequest(`Value in collection field must be a reference or an object, received ${reference}`);

                    }
                }
                return collectionParsed;
            }
            else {
                throw new Exceptions.BadRequest(`Value in collection field must be an array, received ${dataField}`);
            }
        }
    }

    static async validManyToMany(field, dataField, modelName) {
        if (dataField) {
            let collectionParsed;
            try {
                if (typeof dataField === 'string') {
                    collectionParsed = JSON.parse(dataField);
                }
                else {
                    collectionParsed = dataField;
                }
            } catch (e) {
                throw new Exceptions.BadRequest(`Value in field '${field}' must be a json array of references`);
            }
            if (Array.isArray(collectionParsed)) {
                let ModelClass = ModelRegister.model(modelName);
                for (let i in collectionParsed) {
                    let reference = collectionParsed[i];

                    if (typeof reference === 'string') {
                        try {
                            var obj = await ModelClass.fetchOne({id: reference})
                        }
                        catch (err) {
                            if (err instanceof Exceptions.NotFound) {
                                throw new Exceptions.BadRequest(` Value '${reference}' referenced in field '${field}' not found`);
                            }
                            else {
                                throw err;
                            }
                        }
                    }
                }
                return collectionParsed;
            }
            else {
                throw new Exceptions.BadRequest(`Value in manyToMany field must be an array, received ${dataField}`);
            }
        }
    }
}

export default Input;

const allowedTypes = ["string", "number", "date", "boolean", "reference", "collection", "manyToMany"];
const allowedRelations = ["reference", "collection", "manyToMany"];

