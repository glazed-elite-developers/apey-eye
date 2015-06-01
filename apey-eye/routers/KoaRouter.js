/**
 * Created by Filipe on 03/03/2015.
 */
import BaseRouter from './../BaseRouter.js';
import Resource from './../Resource';
import * as Annotations from './../Annotations';
import * as Exceptions from './../Exceptions';
import HTTPCodes from './../HTTPCodes';
import Auth from './../Auth.js';
import RouterConfig from '../config/router.js';

import koa from 'koa';
import _ from 'underscore';
import router from 'koa-router';
import compose from 'koa-compose';
import bodyParser from 'koa-body-parser';
import http from 'http';

class KoaRouter extends BaseRouter {
    constructor() {
        super();
        this.router = router();
        this.router.use(this.errorHandling);
        this.entries = {};

        KoaRouter.passport = require('koa-passport');
    }
    start(options, callback){
        var app = koa();

        app.use(bodyParser());
        app.use(KoaRouter.passport.initialize());
        app.use(this.routes());

        app.listen(options.port);

        callback(false, app);
    }
    routes() {
        return this.router.routes();
    }
    static pathTypes(path) {
        let basePath = RouterConfig.basePath || '';

        if (basePath && basePath.slice(-1) === '/') {
            throw new Error("Base path wouldn't end without character '/'");
        }

        return {
            collection: `${basePath}/${path}`,
            instance: `${basePath}/${path}/:id`,
            instance_action: `${basePath}/${path}/:id/:action`
        };
    }
    appendBaseMethods(entry) {

        var resourceClass = entry.resource;


        Object.keys(KoaRouter.pathTypes(entry.path)).forEach(pathType => {
            var path = KoaRouter.pathTypes(entry.path)[pathType];

            this.router.all(path,
                this.defaultMiddlewares(resourceClass),
                function*(next) {
                    var result = yield resourceClass._handleRequest({
                        method: this.method,
                        pathType: pathType,
                        requestProperties: this.requestProperties,
                        id: this.params.id,
                        action: this.params.action,
                        data: this.request.body
                    });

                    if (result) {
                        if (result.obj) {
                            this.status = 200;
                            var resultRendered = result.render(this.requestProperties);

                            this.body = resultRendered.data;
                            this.type = resultRendered.type;
                        }
                        else {
                            this.status = 204;
                        }
                    }

                    yield next;
                }
            );

        });
    }

    defaultMiddlewares(resourceClass) {
        var RouterClass = this.constructor;
        var stack = [];

        stack.push(function*(next) {
            let resourceMethod = RouterClass.getResourceMethod(this, resourceClass);
            if (!resourceMethod) {
                throw new Exceptions.NotImplemented();
            }
            else {
                this.resourceMethod = resourceMethod;
            }
            this.resourceClass = resourceClass;
            this.requestProperties = {};
            yield next;
        });
        stack.push(RouterClass.checkAuthentication);
        stack.push(RouterClass.checkRoles);
        stack.push(function*(next) {
            yield KoaRouter.fetchRequestProperties.call(this, next, RouterClass);
            yield next;
        });

        return compose(stack);
    }

    * errorHandling(next) {
        try {
            yield next;
        }
        catch (err) {
            if (err instanceof Exceptions.NotFound) {
                this.status = HTTPCodes.notFound;
            }
            else if (err instanceof Exceptions.MethodNotAllowed) {
                this.status = HTTPCodes.methodNotAllowed;
            }
            else if (err instanceof Exceptions.NotImplemented) {
                this.status = HTTPCodes.notImplemented;
            }
            else if (err instanceof Exceptions.BadRequest) {
                this.status = HTTPCodes.badRequest;
            }
            else if (err instanceof Exceptions.Unauthorized) {
                this.status = HTTPCodes.unauthorized;
            }
            else if (err instanceof Exceptions.Forbidden) {
                this.status = HTTPCodes.forbidden;
            }
            else {
                console.error(err.stack);
                this.status = HTTPCodes.internalServerError;
            }
            this.body = err.message;
        }
    }

    static *fetchRequestProperties(next, RouterClass) {

        let koaObj = this;
        let request = {
            query: koaObj.request.query,
            headers: {
                accept: koaObj.get('Accept')
            }
        };
        this.requestProperties = _.extend(this.requestProperties, RouterClass.parseRequest(request));

        yield next;
    }

    static *checkAuthentication(next) {
        let ctx = this;

        let authenticationMethod = this.resourceClass.getAuthentication(this.resourceMethod);

        if(authenticationMethod && authenticationMethod != 'none'){
            let auth = new Auth(KoaRouter.passport);
            yield* auth.authenticate(authenticationMethod, {session: false}, function*(err, user, info) {
                if (err) throw new Exceptions.BadRequest(err);
                if (user === false) {
                    throw new Exceptions.Unauthorized();
                } else {
                    ctx.requestProperties.user = user;
                    yield next;
                }
            }).call(this, next)
        }
        else{
            yield next;
        }
    }

    static *checkRoles(next) {
        let allowedRoles = this.resourceClass.getAllowedRoles(this.resourceMethod);

        yield BaseRouter.checkUserRole(this.requestProperties.user, allowedRoles);

        yield  next;
    }
}
export default KoaRouter;