/**
 * Created by Filipe on 11/03/2015.
 */

import chai from 'chai';
import Input from '../apey-eye/Input';
import Model from '../apey-eye/Model';

let expect = chai.expect;
let assert = chai.assert;


describe('Input', function(){
    class TestModel extends Model{}

    var restaurantInput;
    before(function(){
        var validLocation = function(val){
            if(val !== "Rua Costa Cabral"){
                throw new Error("Invalid location.")
            }
            else{
                return true;
            }
        };

        restaurantInput = new Input({
            name: {type: "string", required:true},
            address: {type: "string", required:true, valid:validLocation},
            phone: {type: "number"},
            photo: {type: "string", regex: Input.URLPattern},
            date: {type: "date"},
            location: {type:"string"},
            language: {type:"string", choices: ["PT", "EN"]}
        });
    });


    it('should throw an expection when valid properties is not an object', function*(){
        assert.throw(function() {
            new Input();
        }, Error);
        assert.throw(function() {
            new Input([]);
        }, Error);
        assert.throw(function() {
            new Input("invalidObj");
        }, Error);
        assert.throw(function() {
            new Input(true);
        }, Error);
        assert.throw(function() {
            new Input(123);
        }, Error);
        assert.doesNotThrow(function() {
            new Input({ name: {type:"string"}});
        });
    });
    it('should throw an expection when required properties aren\'t defined', function(){
        assert.doesNotThrow(function() {
            new Input({ name: {type:"string"}});
        });
        assert.throw(function() {
            new Input({ name: {required:false}});
        });
        assert.doesNotThrow(function() {
            new Input({ name: {type:"number"}});
        });
        assert.throw(function() {
            new Input({ name: {type:"reference"}});
        });
        assert.doesNotThrow(function() {
            new Input({ name: {type:"reference", model: 'modelName'}});
        });
    });
    it('should throw an expection when required properties aren\'t defined with correct type values', function(){
        assert.doesNotThrow(function() {
            new Input({ name: {type:"string"}});
        });
        assert.doesNotThrow(function() {
            new Input({ name: {type:"reference", model: "TestModel"}});
        });
        assert.throw(function() {
            new Input({ name: {type:"strong"}});
        });
        assert.throw(function() {
            new Input({ name: {type:"string", required:"false"}});
        });
        assert.doesNotThrow(function() {
            new Input({ name: {type:"string", required:false}});
        });
        assert.doesNotThrow(function() {
            new Input({ name: {type:"string", regex:Input.ISODatePattern}});
        });
        assert.throw(function() {
            new Input({ name: {type:"string", regex:false}});
        });
        assert.throw(function() {
            new Input({ name: {type:"string", regex:"lalal"}});
        });
        assert.throw(function() {
            new Input({ name: {type:"string", valid:true}});
        });
        assert.doesNotThrow(function() {
            new Input({ name: {type:"string", valid:function(){}}});
        });
        assert.throw(function() {
            new Input({ name: {type:"string", default:123}});
        });
        assert.doesNotThrow(function() {
            new Input({ name: {type:"string", default:"stringValue"}});
         });

        assert.throw(function() {
            new Input({ name: {type:"string", choices:123}});
        });
        assert.throw(function() {
            new Input({ name: {type:"string", choices:[123, false]}});
        });
        assert.doesNotThrow(function() {
            new Input({ name: {type:"string", choices:["A","B"]}});
        });

        assert.throw(function() {
            new Input({ name: {type:"collection",model:"resourceName"}});
        });
        assert.throw(function() {
            new Input({ name: {type:"reference", model:123}});
        });
        assert.throw(function() {
            new Input({ name: {type:"reference"}});
        });
        assert.doesNotThrow(function() {
            new Input({ name: {type:"collection",model:"modelname",inverse:"inverseField",  many:false}});
        });
    });
    it('should return true if data received is valid or false if not',async function(){
        var validData = {
            name: "name",
            address:"Rua Costa Cabral",
            phone:123,
            photo:"http://google.com/",
            date: "2015-03-10T14:27:44.031Z"
        };

        expect(restaurantInput.valid(validData)).to.eventually.not.throw();

        let invalid = JSON.parse(JSON.stringify(validData));
        invalid.name=12;

        expect(restaurantInput.valid(invalid)).to.eventually.throw();

        invalid = JSON.parse(JSON.stringify(validData));
        invalid.address="Rua Dr Roberto Frias";

        expect(restaurantInput.valid(invalid)).to.eventually.throw();

        invalid = JSON.parse(JSON.stringify(validData));
        invalid.phone="93404404";

        expect(restaurantInput.valid(restaurantInput.valid(invalid))).to.eventually.throw();

        invalid = JSON.parse(JSON.stringify(validData));
        invalid.date="5th July 2015";

        expect(restaurantInput.valid(restaurantInput.valid(invalid))).to.eventually.throw();

        invalid = JSON.parse(JSON.stringify(validData));
        invalid.language="SS";

        expect(restaurantInput.valid(restaurantInput.valid(invalid))).to.eventually.throw();

        validData.language="PT";

        expect(restaurantInput.valid(restaurantInput.valid(validData))).to.eventually.not.throw();


    });
});