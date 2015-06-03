/**
 * Created by GlazedSolutions on 19/03/2015.
 */

class NotFound extends Error{
    constructor(id){
        super();
        if(id){
            this.message = `${id} not found`;
        }
        else{
            this.message = "Not Found";
        }
    }
}
class ModelNotFound extends Error{
    constructor(resourceName){
        super();
        if(resourceName){
            this.message = `Model not found for resource '${resourceName}'.`;
        }
        else{
            this.message = `Model not found for this resource.'`;
        }
    }
}
class MethodNotAllowed extends Error{
    constructor(){
        super();
        this.message = `Method not allowed`;
    }
}
class NotImplemented extends Error{
    constructor(){
        super();
        this.message = `Method not implemented`;
    }
}
class BadRequest extends Error{
    constructor(message){
        super();
        this.message = `Bad Request: ${message}`;
    }
}
class Unauthorized extends Error{
    constructor(){
        super();
    }
}

class Forbidden extends Error{
    constructor(){
        super();
    }
}

export {NotFound, ModelNotFound,MethodNotAllowed, NotImplemented, BadRequest, Unauthorized,Forbidden}