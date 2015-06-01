/**
 * Created by Filipe on 16/04/2015.
 */
import * as Exceptions from './Exceptions.js';
import Resource from './Resource.js';
import GenericResource from './GenericResource.js';
import * as Annotations from './Annotations.js';
import RoleModel from './models/RoleModel.js';
import RouterConfig from './config/router.js';

class BaseRouter {

    register(entries) {
        if (entries) {
            entries.forEach(entry => {
                if (entry.resource && entry.resource.prototype instanceof Resource) {

                    let obj = {
                        path: entry.path || entry.resource.getName(),
                        resource: entry.resource
                    };
                    let resourceName = BaseRouter.resourceName(obj.path);
                    if (resourceName) {
                        if (!this.entries[resourceName]) {
                            this.entries[resourceName] = obj.resource;
                            this.appendBaseMethods(obj);
                        }
                        else {
                            throw new Error(`BaseRouter: path '${resourceName}' already in use.`);
                        }
                    }
                    else {
                        throw new Error(`BaseRouter: invalid resource path "${obj.path}"`);
                    }
                }
                else {
                    throw new Error('BaseRouter: received invalid entries, must receive objects with one path and one resource class.');
                }
            });
        }
        else {
            throw new Error("BaseRouter: register must receive an array of routing properties.");
        }
    }
    rootOptions(baseUri){
        let options = {},
            resources = {},
            basePath = RouterConfig.basePath||'/';

        Object.keys(this.entries).forEach( entry => {
            resources[entry] = `${baseUri}${RouterConfig.basePath}/${entry}` ;
        });
        options.resources = resources;
        return options;
    }
    appendBaseMethods() {
        throw new Error("BaseRouter: Method not implemented. Must be overridden by subclass");
    }

    static async checkUserRole(user, allowedRoles) {
        if (!allowedRoles) {
            return true;
        }
        else {
            if (allowedRoles.length === 0) {
                throw new Exceptions.Forbidden();
            }
            else {

                if (!user || !user.obj.role) {
                    throw new Exceptions.Forbidden();
                }
                if (allowedRoles.indexOf(user.obj.role) > -1) {
                    return true;
                }
                else {
                    let childRoles = await RoleModel.fetch({
                        resourceProperties: {
                            _filter: {
                                parentRole: user.obj.role
                            },
                            _fields: ["id"]
                        }
                    });
                    while (childRoles.length > 0) {
                        let role = childRoles.shift();
                        if (allowedRoles.indexOf(role.id) > -1) {
                            return true;
                        }
                        else {
                            let newChilds = await RoleModel.fetch({
                                resourceProperties: {
                                    _filter: {
                                        parentRole: role.id
                                    },
                                    _fields: ["id"]
                                }
                            });
                            childRoles = childRoles.concat(newChilds);
                        }
                    }
                    throw new Exceptions.Forbidden();
                }
            }
        }
    }

    static getResourceMethod(request, resourceClass) {
        let pathType;
        if (request.params.action && request.params.id) {
            pathType = 'instance_action';
        }
        else if(request.params.id) {
            pathType = 'instance';
        }
        else {
            pathType = 'collection';
        }
        return resourceClass.getResourceMethod({
            method : request.method,
            pathType : pathType,
            id : request.params.id,
            action : request.params.action
        });
    }

    static parseRequest(request) {
        var requestProperties = {};
        requestProperties._filter = BaseRouter.parseFilters(request.query._filter);
        requestProperties._sort = BaseRouter.parseSort(request.query._sort);
        requestProperties._pagination = BaseRouter.parsePagination(request.query._page, request.query._page_size);
        requestProperties._fields = BaseRouter.parseFields(request.query._fields);
        requestProperties._embedded = BaseRouter.parseEmbedded(request.query._embedded);
        requestProperties._format = BaseRouter.parseFormat(request.query._format);
        requestProperties._mediaType = request.headers.accept;

        return requestProperties;
    }

    static parseFilters(_filter) {
        if (_filter) {
            try {
                var filters = JSON.parse(_filter);
            } catch (e) {
                //console.error(`BaseRouter: Cannot parse filters JSON.`);
                return;
            }
            if (filters) {
                return filters;
            }
        }
    }

    static parseSort(_sort) {

        if (_sort) {
            try {
                var sortParsed = JSON.parse(_sort);
            } catch (e) {
                //console.error("BaseRouter: Cannot parse _sort JSON.");
                return;
            }
            if (Array.isArray(sortParsed)) {
                var sortArray = [];
                try {
                    sortParsed.some(s => {
                        let order,
                            field,
                            sortObj = {};

                        if (typeof s != 'string') {
                            sortArray = undefined;
                            throw new Error();
                        }

                        if (s.charAt(0) === '-') {
                            order = -1;
                            field = s.substr(1);

                        }
                        else {
                            order = 1;
                            field = s;
                        }

                        sortObj[field] = order;
                        sortArray.push(sortObj);
                    });
                }
                catch (e) {
                    //console.error("BaseRouter: _sort properties must be an array of strings.")
                }

                if (sortArray && sortArray.length > 0) {
                    return sortArray;
                }
            }
            else {
                //console.error("BaseRouter: _sort properties must be an array.");
            }

        }

    }

    static parsePagination(_page, _page_size) {
        if (_page) {
            var page = parseInt(_page);

            if (isNaN(page)) {
                //console.error("BaseRouter: Cannot parse '_page' value. Must receive an integer.");
            }
        }
        if (_page_size) {
            var pageSize = parseInt(_page_size);

            if (isNaN(pageSize)) {
                //console.error("BaseRouter: Cannot parse '_page_size' value. Must receive an integer.");
            }
        }

        if (page || pageSize) {
            return {
                _page: page,
                _page_size: pageSize
            };
        }
    }

    static parseFields(_fields) {

        if (_fields) {
            try {
                var fieldsParsed = JSON.parse(_fields);
            } catch (e) {
                //console.error("BaseRouter: Cannot parse _fields JSON.");
                return;
            }
            if (Array.isArray(fieldsParsed)) {
                var fieldsArray = [];
                try {
                    fieldsParsed.forEach(s => {
                        if (typeof s !== 'string') {
                            fieldsArray = undefined;
                            throw new Error();
                        } else {
                            fieldsArray.push(s);
                        }
                    });
                } catch (e) {
                    //console.error("BaseRouter: _fields properties must be an array of strings.")
                }

                if (fieldsArray && fieldsArray.length > 0) {
                    return fieldsArray;
                }
            } else {
                //console.error("BaseRouter: _fields properties must be an array.");
            }
        }
    }

    static parseEmbedded(_embedded) {

        if (_embedded) {
            try {
                var embeddedParsed = JSON.parse(_embedded);
            } catch (e) {
                //console.error("BaseRouter: Cannot parse _embedded JSON.");
                return;
            }
            if (Array.isArray(embeddedParsed)) {
                var embeddedArray = [];
                try {
                    embeddedParsed.forEach(s => {
                        if (typeof s !== 'string') {
                            embeddedArray = false;
                        }
                        else {
                            embeddedArray.push(s);
                        }
                    });
                } catch (e) {
                    //console.error("BaseRouter: _embedded properties must be an array of strings.")
                }

                if (embeddedArray && embeddedArray.length > 0) {
                    return embeddedArray;
                }
            }
            else {
                //console.error("BaseRouter: _embedded properties must be an array.");
            }
        }
    }

    static parseFormat(_format) {
        if (typeof _format === 'string') {
            return _format;
        }
    }

    static resourceName(resourcePath) {
        var pathRegEx = /^\/?[^\/][a-z0-9\-_]+/i;

        var match = resourcePath.match(pathRegEx);
        if (match) {
            var resourceName;
            if (match[0].charAt(0) === '/') {
                resourceName = match[0].substring(1);
            }
            else {
                resourceName = match[0];
            }
            return resourceName;
        }
        else {
            return false;
        }
    }

    static createGenericResourceClass(resourceName) {
        @Annotations.Name(resourceName)
        class NoBackendResource extends GenericResource {
        }
        NoBackendResource.noBackend = true;

        return NoBackendResource;
    }
}
export default BaseRouter;