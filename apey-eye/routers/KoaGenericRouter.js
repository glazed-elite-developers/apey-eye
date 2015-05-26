/**
 * Created by Filipe on 03/03/2015.
 */
import KoaRouter from './KoaRouter';
import HTTPCodes from './../HTTPCodes';
import RouterConfig from '../config/router.js';

class KoaGenericRouter extends KoaRouter{
    constructor() {
        super();
        this.appendGenericRouter();
    }

    appendGenericRouter() {
        var self = this;

        this.router.use(function*(next) {

            yield next;
            if (this.status === HTTPCodes.notFound) {
                let path = this.path.slice(RouterConfig.basePath.length);
                var resourceName = KoaRouter.resourceName(path);
                if(resourceName){
                    var newResourceClass = KoaRouter.createGenericResourceClass(resourceName);

                    self.register([{
                        path: `${resourceName}`,
                        resource: newResourceClass
                    }]);

                    this.redirect(this.request.url);
                    this.status = HTTPCodes.temporaryRedirect;
                }

            }
        });
    }
}
export default KoaGenericRouter;