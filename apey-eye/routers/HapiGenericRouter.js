/**
 * Created by Filipe on 03/03/2015.
 */
import HapiRouter from './HapiRouter.js';
import * as Exceptions from './../Exceptions.js';
import HTTPCodes from './../HTTPCodes';
import Boom from 'Boom';
import Joi from 'hapi/node_modules/joi';
import RouterConfig from '../config/router.js';
import * as DefaultProperties from './../DefaultProperties.js';

import _ from 'underscore';

class HapiGenericRouter extends HapiRouter {
    constructor() {
        super();
        this.appendGenericRouter();
    }

    static pathTypes() {
        let basePath = RouterConfig.basePath || '';

        if (basePath && basePath.slice(-1) === '/') {
            throw new Error("Base path wouldn't end without character '/'");
        }

        return {
            collection: `${basePath}/{path}`,
            instance: `${basePath}/{path}/{id}`,
            instance_action: `${basePath}/{path}/{id}/{action}`
        };
    }
    rootOptions(baseUri){
        let options = super.rootOptions(baseUri);
        options.no_backend = `${baseUri}${RouterConfig.basePath}/{path}`;
        return options;
    }
    appendGenericRouter() {
        let self = this;

        let httpMethods = DefaultProperties.HTTPMethods;

        Object.keys(HapiGenericRouter.pathTypes()).forEach(pathType => {
            httpMethods.forEach(httpMethod => {

                var path = HapiGenericRouter.pathTypes()[pathType];
                let route = {
                    path: path,
                    method: httpMethod,
                    config: {
                        handler: {
                            async: async function (request, reply) {
                                try {
                                    let path = request.path.slice(RouterConfig.basePath.length);
                                    let resourceName = HapiRouter.resourceName(path);
                                    let ResourceClass;
                                    if (resourceName && !self.entries[resourceName]) {
                                        ResourceClass = HapiRouter.createGenericResourceClass(resourceName);

                                        let oldListLength = self.routesList.length;

                                        self.register([{
                                            path: `${resourceName}`,
                                            resource: ResourceClass
                                        }]);

                                        let newRoutesList = self.routesList.slice(oldListLength);
                                        request.server.route(newRoutesList);

                                        reply().redirect(request.url.path).rewritable(false).temporary(true);
                                    }
                                    else {
                                        throw new Exceptions.NotFound();
                                    }
                                }
                                catch (error) {
                                    reply(HapiRouter.errorHandling(error));
                                }

                            }
                        }
                    }
                };
                this.addGenericRouteDocumentation({
                    pathType: pathType,
                    httpMethod: httpMethod

                }, route);
                this.routesList.push(route);
            });
        });
    }

    addGenericRouteDocumentation(options, route) {
        let validate = {params: {}};

        validate.params.path = Joi.string().required().description("resource name");

        if (options.pathType === 'instance') {
            validate.params.id = Joi.string().required().description('instance ID or action name');
        }
        else if (options.pathType === 'instance_action ') {
            validate.params.id = Joi.string().required().description('instance ID');
            validate.params.action = Joi.string().required().description('action name');
        }

        if (options.pathType === 'collection' && options.httpMethod.toUpperCase() === 'GET') {
            validate.query = {
                _sort: Joi.string(),
                _filter: Joi.string(),
                _page_size: Joi.string()
            }
        }

        if (['POST', 'PUT', 'PATCH'].indexOf(options.httpMethod) != -1) {
            validate.payload = Joi.object().description('Payload for request');
        }

        if (options.pathType !== 'instance_action') {
            validate.query = validate.query || {};
            validate.query._embedded = Joi.string();
            validate.query._fields = Joi.string();
        }

        route.config.description = "No Backend";
        route.config.notes = "This route allows to add a new resource to API in runtime, if no match route exists a new one will be added to server.";
        route.config.tags = ['api', 'nobackend'];
        route.config.validate = validate;
    }

}
export default HapiGenericRouter;