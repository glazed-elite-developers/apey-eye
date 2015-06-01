/**
 * Created by Filipe on 20/04/2015.
 */
/**
 * Created by Filipe on 03/03/2015.
 */

import BaseRouter from './../BaseRouter.js';
import Resource from './../Resource';
import HTTPCodes from './../HTTPCodes';
import Auth from './../Auth.js';
import * as Annotations from './../Annotations';
import * as Exceptions from './../Exceptions';
import * as DefaultProperties from './../DefaultProperties.js';

import Joi from 'hapi/node_modules/joi';
import Hapi from 'hapi';
import _ from 'underscore';
import Boom from 'Boom';


import ServerConfig from '../config/server.js';
import RouterConfig from '../config/router.js';


class HapiRouter extends BaseRouter {

    constructor() {
        super();

        this.entries = {};
        this.routesList = [];

        this.addRootRoute();

        this.passport = require("passport");

    }
    start(options, callback){
        let self = this;
        let server = new Hapi.Server({
            connections: {
                router: {
                    stripTrailingSlash: true
                }
            }
        });
        server.connection({
            port: options.port
        });

        let authenticationScheme = function () {
            return {
                authenticate: function (request, reply) {
                    return self.checkAuthentication(request, reply);
                }
            };
        };

        server.auth.scheme('custom', authenticationScheme);
        server.auth.strategy('default', 'custom');

        server.register([
                require('hapi-async-handler'),
                {
                    register: require('hapi-swagger'),
                    options: {
                        apiVersion: ServerConfig.apiVersion,
                        documentationPath: (RouterConfig.basePath || '') + ServerConfig.documentationPath,
                        endpoint: (RouterConfig.basePath || '') + ServerConfig.documentationEndpoint,
                        pathPrefixSize: ((RouterConfig.basePath || '').match(/\//g) || []).length+1
                    }
                }

            ],
            function (err) {
                if (err) {
                    throw err;
                }
                server.route(self.routes());
                server.start(function(err){
                    callback(err, server);
                });
            });
    }
    static pathTypes(path) {
        let basePath = RouterConfig.basePath || '';

        if (basePath && basePath.slice(-1) === '/') {
            throw new Error("Base path wouldn't end without character '/'");
        }

        return {
            collection: `${basePath}/${path}`,
            instance: `${basePath}/${path}/{id}`,
            instance_action: `${basePath}/${path}/{id}/{action}`
        };
    }

    addRootRoute() {
        let self = this;
        let route = {
            path: RouterConfig.basePath || '/',
            method: 'OPTIONS',
            config: {
                handler: {
                    async: async function (request, reply) {
                        reply(self.rootOptions(request.server.info.uri));
                    }
                }
            }
        };
        this.routesList.push(route);
    }

    routes() {
        return this.routesList;
    }


    appendBaseMethods(entry) {

        let ResourceClass = entry.resource,
            pathTypes = HapiRouter.pathTypes(entry.path);

        if (ResourceClass.actions) {
            Object.keys(ResourceClass.actions.collection).forEach(action => {

                let i = action.indexOf("_");
                let method = action.substr(0, i);
                let actionName = action.substr(i + 1);
                if (method && actionName) {
                    this.addRoute({
                        path: `${pathTypes.collection}/${actionName}`,
                        httpMethod: method,
                        ResourceClass: ResourceClass,
                        pathType: 'instance',
                        action: actionName
                    });
                }
            });
            Object.keys(ResourceClass.actions.instance).forEach(action => {
                let i = action.indexOf("_");
                let method = action.substr(0, i);
                let actionName = action.substr(i + 1);

                if (method && actionName) {
                    this.addRoute({
                        path: `${pathTypes.instance}/${actionName}`,
                        httpMethod: method,
                        ResourceClass: ResourceClass,
                        pathType: 'instance_action',
                        action: actionName
                    });
                }
            });
        }

        let httpMethods = DefaultProperties.HTTPMethods;
        Object.keys(pathTypes).forEach(pathType => {
            httpMethods.forEach(httpMethod => {

                let path = pathTypes[pathType];

                if (pathType !== 'instance_action') {

                    let resourceMethod = ResourceClass.getResourceMethod({
                        pathType: pathType,
                        method : httpMethod
                    });

                    if (resourceMethod) {
                        this.addRoute({
                            path: path,
                            httpMethod: httpMethod,
                            ResourceClass: ResourceClass,
                            pathType: pathType,
                            resourceMethod: resourceMethod
                        });
                    }
                }
            });
        });
    }

    addRoute(options) {
        let self = this;

        let route = {
            path: options.path,
            method: options.httpMethod,
            config: {
                pre: [{
                    method: function (req, reply) {
                        if (options.pathType === 'instance_action') {
                            req.params.action = options.action;
                        }
                        else if (options.pathType === 'instance' && options.action) {
                            req.params.id = options.action;
                        }
                        return self.defaultMiddlewares(req, function (error) {
                            if (error) {
                                reply(HapiRouter.errorHandling(error)).takeover();
                            }
                            else {
                                reply.continue();
                            }
                        });
                    }
                }],
                auth: ((options.httpMethod === 'OPTIONS') ? false : 'default'),
                handler: {
                    async: async function (request, reply) {
                        await HapiRouter.handleRequest(options.ResourceClass, options.pathType, request, reply);
                    }
                }
            }
        };
        this.addRouteDocumentation(options, route);
        this.routesList.push(route);
    }
    addRouteDocumentation(options, route){
        let self = this,
            resourceDocumentation = options.ResourceClass.getDocumentation.call(options.resourceMethod),
            tags = ['api'],
            resourceName = options.ResourceClass.getName(),
            validate = {
                params: {}
            };


        if (resourceName) {
            tags.push(resourceName);
        }

        if ((options.pathType === 'instance' && !options.action) || options.pathType === 'instance_action') {

            validate.params.id = Joi.string()
                    .required()
                    .description('instance ID');

        }
        if ( options.pathType === 'instance_action') {

            validate.params.action = Joi.string()
                    .required()
                    .description('instance ID');

        }
        if(options.pathType === 'collection' && options.httpMethod.toUpperCase() === 'GET'){
            validate.query = {
                _sort : Joi.string(),
                _filter: Joi.string(),
                _page_size: Joi.string()
            }
        }

        if (['POST', 'PUT', 'PATCH'].indexOf(options.httpMethod) != -1){
            validate.payload = Joi.object().description('Payload for request');
        }

        if(!options.action){
            validate.query = validate.query || {};
            validate.query._embedded = Joi.string();
            validate.query._fields = Joi.string();
        }

        route.config.description = resourceDocumentation && resourceDocumentation.title;
        route.config.notes = resourceDocumentation && resourceDocumentation.description;
        route.config.tags = tags;
        route.config.validate = validate;
    }

    static async handleRequest(resourceClass, pathType, request, reply) {
        try {
            let result = await resourceClass._handleRequest({
                method: request.method,
                pathType: pathType,
                requestProperties: request.requestProperties,
                id: request.params.id,
                action: request.params.action,
                data: request.payload
            });
            if (result) {
                if (result.obj) {
                    let resultRendered = result.render(request.requestProperties);
                    reply(resultRendered.data).type(resultRendered.type).code(HTTPCodes.success);
                }
                else {
                    reply().code(HTTPCodes.noContent);
                }
            }
        }
        catch (error) {
            try {
                reply(HapiRouter.errorHandling(error));
            }
            catch (e) {
                console.error(e.stack);
                reply(Boom.wrap(e, 500))
            }
        }
    }

    defaultMiddlewares(request, done) {
        try {
            request.requestProperties = request.requestProperties || {};
            this.fetchResource(request);
            this.checkRoles(request, err => {
                if (!err) {
                    HapiRouter.fetchRequestProperties(request);
                    done();
                } else {
                    done(err);
                }
            });

        } catch (err) {
            done(err);
        }

    }

    static errorHandling(error) {
        let statusCode;
        if (error instanceof Exceptions.NotFound) {
            statusCode = HTTPCodes.notFound;
        }
        else if (error instanceof Exceptions.MethodNotAllowed) {
            statusCode = HTTPCodes.methodNotAllowed;
        }
        else if (error instanceof Exceptions.NotImplemented) {
            statusCode = HTTPCodes.notImplemented;
        }
        else if (error instanceof Exceptions.BadRequest) {
            statusCode = HTTPCodes.badRequest;
        }
        else if (error instanceof Exceptions.Unauthorized) {
            statusCode = HTTPCodes.unauthorized;
        }
        else if (error instanceof Exceptions.Forbidden) {
            statusCode = HTTPCodes.forbidden;
        }
        else {
            console.error(error.stack);
            statusCode = HTTPCodes.internalServerError;
        }
        return Boom.wrap(error, statusCode || 500);
    }

    fetchResource(request) {
        let path = request.path.slice(RouterConfig.basePath.length);
        let resourceName = HapiRouter.resourceName(path),
            ResourceClass = this.entries[resourceName],
            RouterClass = this.constructor;

        if(request.params.id){
            let pathRegEx = /[^\/]+(?=\/$|$)/;
            let match = request.route.path.match(pathRegEx);
            if(match && match[0] != "{id}"){
                request.params.action = match[0];
            }
        }

        if (!request.resourceClass || !request.resourceMethod) {
            let resourceMethod = RouterClass.getResourceMethod(request, ResourceClass);
            if (!resourceMethod) {
                throw new Exceptions.NotImplemented();
            }
            else {
                request.resourceMethod = resourceMethod;
            }
            request.resourceClass = ResourceClass;
        }
    }

    static fetchRequestProperties(request) {
        let requestProperties = {
            query: request.query,
            headers: {
                accept: request.headers.accept
            }
        };
        request.requestProperties = _.extend(request.requestProperties, HapiRouter.parseRequest(requestProperties));
    }

    checkAuthentication(request, reply) {
        try {
            this.fetchResource(request);
            let authenticationMethod = request.resourceClass.getAuthentication(request.resourceMethod);

            if (authenticationMethod && authenticationMethod != 'none') {
                let auth = new Auth(this.passport);
                auth.authenticate(authenticationMethod, {session: false}, function (err, user) {
                    if (err) return reply(Boom.unauthorized(err));
                    if (user === false) {
                        return reply(Boom.unauthorized(null));
                    } else {
                        request.requestProperties = request.requestProperties || {};
                        request.requestProperties.user = user;
                    }
                    return reply.continue({credentials: {}});
                })(request, reply);
            }
            else {
                return reply.continue({credentials: {}});
            }
        }
        catch (error) {
            try {
                return reply(HapiRouter.errorHandling(error));
            }
            catch (e) {
                return reply(Boom.wrap(e, 500));
            }
        }
    }

    checkRoles(request, done) {
        let allowedRoles = request.resourceClass.getAllowedRoles(request.resourceMethod);
        if (request.method.toUpperCase() !== 'OPTIONS') {
            BaseRouter.checkUserRole(request.requestProperties.user, allowedRoles).then(function () {
                done();
            }).catch(function (err) {
                done(err);
            });
        }
        else {
            done();
        }

    }
}
export default HapiRouter;