/**
 * Created by Filipe on 16/03/2015.
 */
import * as Decorators from './Decorators';
let MediaType = Decorators.MediaType;

class BaseFormatter{
    static format(data){
        throw new Error("Formatters:  .format() must be implemented.")
    }
    static getMediaType(){
        return Decorators.getProperty(this, "mediaType")
    }
}

export {BaseFormatter}

@MediaType('application/json')
class JSONFormat extends BaseFormatter{
    static format(data){
        return JSON.stringify(data);
    }
}
export {JSONFormat};

export let FormattersList = [JSONFormat];