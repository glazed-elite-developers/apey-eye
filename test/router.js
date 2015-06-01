/**
 * Created by Filipe on 11/03/2015.
 */

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiThings from 'chai-things';

import ModelRegister from '../apey-eye/ModelRegister.js';
import 'mochawait';

import ApeyEye from '../apey-eye';

let HapiRouter = ApeyEye.HapiRouter;
let KoaRouter = ApeyEye.KoaRouter;
let BaseRouter = ApeyEye.BaseRouter;
let Annotations = ApeyEye.Annotations;
let GenericResource = ApeyEye.GenericResource;
let RethinkDBModel = ApeyEye.RethinkDBModel;
let Input = ApeyEye.Input;

chai.use(chaiAsPromised);
chai.should();
chai.use(chaiThings);

let expect = chai.expect,
    assert = chai.assert,
    should = chai.should;

describe("Router",() => {


    describe('Base Router', ()=>{
        let TestResource;

        before(function (done) {
            ModelRegister.empty();

            let restaurantInput = new Input({
                name: {type: "string", required: true},
                address: {type: "string", required: true},
                phone: {type: "number"},
                photo: {type: "string", regex: Input.URLPattern},
                date: {type: "date"},
                location: {type: "string"},
                language: {type: "string", choices: ["PT", "EN"]}
            });

            @Annotations.Input(restaurantInput)
            @Annotations.Name("restaurant")
            @Annotations.Query({
                _sort: ['name', '-address'],
                _filter: {name: "name", phone: 20},
                _page_size: 10
            })
            @Annotations.Output({
                _fields: ['id', 'name', 'address', 'phone', 'date'],
                _embedded: ['schedule', 'products']
            })
            class TestModel extends RethinkDBModel {
            }

            @Annotations.Model(TestModel)
            @Annotations.Name('testResourceName')
            class TestResourceClass extends GenericResource {
            }

            TestResource = TestResourceClass;

            done();
        });

        it("Get Resource Method",()=>{
            expect(BaseRouter.getResourceMethod({params: {id : false}, method: 'POST'}, TestResource)).to.deep.equal(TestResource);
            expect(BaseRouter.getResourceMethod({params: {id : true}, method: 'GET'}, TestResource)).to.deep.equal(TestResource.fetchOne);
            expect(BaseRouter.getResourceMethod({params: {id : false},method:  'GET'}, TestResource)).to.deep.equal(TestResource.fetch);
            expect(BaseRouter.getResourceMethod({params: {id : true}, method: 'DELETE'}, TestResource)).to.deep.equal(TestResource.prototype['delete']);
            expect(BaseRouter.getResourceMethod({params: {id : true}, method: 'PATCH'}, TestResource)).to.deep.equal(TestResource.prototype.patch);
        });
        it('Parse Request', () => {
            let request = {
                query: {},
                headers: {}
            };

            expect(BaseRouter.parseRequest(request)).to.deep.equal({
                _filter:undefined,
                _sort:undefined,
                _pagination: undefined,
                _fields: undefined,
                _embedded: undefined,
                _format:undefined,
                _mediaType:undefined
            });

        });
        it('Parse Filters', () => {
            let validFilters = "{\"name\":\"restaurantName\"}",
                invalidFilters = "{name: \"restaurantName\"}";

            expect(BaseRouter.parseFilters(validFilters)).to.deep.equal({name:"restaurantName"});
            expect(BaseRouter.parseFilters(invalidFilters)).to.equal(undefined);

        });
        it('Parse Sort', () => {
            let validSort = "[\"-name\",\"address\"]",
                invalidSort = "[123,\"address\"]",
                invalidSort2 = "[123,{name: \"restaurantName\"}]",
                invalidSort3 = "{\"name\": \"restaurantName\"}";


            expect(BaseRouter.parseSort(validSort)).to.deep.equal([{name:-1},{address:1}]);
            expect(BaseRouter.parseSort(invalidSort)).to.equal(undefined);
            expect(BaseRouter.parseSort(invalidSort2)).to.equal(undefined);
            expect(BaseRouter.parseSort(invalidSort3)).to.equal(undefined);

        });
        it('Parse Pagination', () => {
            let validPage = "1",
                invalidPage = "{\"page\": 1}",
                validPageSize = "10",
                invalidPageSize = "{\"pageSize\": 10}";


            expect(BaseRouter.parsePagination(validPage,validPageSize)).to.deep.equal({_page:1, _page_size:10});
            expect(BaseRouter.parsePagination(invalidPage,invalidPageSize)).to.equal(undefined);
            expect(BaseRouter.parsePagination(undefined,undefined)).to.equal(undefined);
            expect(BaseRouter.parsePagination(validPage,undefined)).to.deep.equal({_page:1, _page_size:undefined});
            expect(BaseRouter.parsePagination(undefined,validPageSize)).to.deep.equal({_page:undefined,_page_size:10});

        });
        it('Parse Fields', () => {
            let validFields = "[\"name\",\"address\"]",
                invalidFields = "[123,\"address\"]",
                invalidFields2 = "[123,{name: \"restaurantName\"}]",
                invalidFields3 = "{\"name\": \"restaurantName\"}";


            expect(BaseRouter.parseFields(validFields)).to.deep.equal(["name","address"]);
            expect(BaseRouter.parseFields(invalidFields)).to.equal(undefined);
            expect(BaseRouter.parseFields(invalidFields2)).to.equal(undefined);
            expect(BaseRouter.parseFields(invalidFields3)).to.equal(undefined);

        });
        it('Parse Embedded', () => {
            let validEmbedded = "[\"name\",\"address\"]",
                invalidEmbedded = "[123,\"address\"]",
                invalidEmbedded2 = "[123,{name: \"restaurantName\"}]",
                invalidEmbedded3 = "{\"name\": \"restaurantName\"}";

            expect(BaseRouter.parseEmbedded(validEmbedded)).to.deep.equal(["name","address"]);
            expect(BaseRouter.parseEmbedded(invalidEmbedded)).to.equal(undefined);
            expect(BaseRouter.parseEmbedded(invalidEmbedded2)).to.equal(undefined);
            expect(BaseRouter.parseEmbedded(invalidEmbedded3)).to.equal(undefined);

        });
        it('Parse Format', () => {
            let validFormat = "application/json",
                invalidFormat = {format: "application/json"};

            expect(BaseRouter.parseFormat(validFormat)).to.equal("application/json");
            expect(BaseRouter.parseFormat(invalidFormat)).to.equal(undefined);
        });
    });
    describe('Router Hapi', () =>{
        let TestResource,
            router;
        before((done) => {
            ModelRegister.empty();

            router = new HapiRouter();

            let restaurantInput = new Input({
                name: {type: "string", required: true},
                address: {type: "string", required: true},
                phone: {type: "number"},
                photo: {type: "string", regex: Input.URLPattern},
                date: {type: "date"},
                location: {type: "string"},
                language: {type: "string", choices: ["PT", "EN"]}
            });

            @Annotations.Input(restaurantInput)
            @Annotations.Name("restaurant")
            @Annotations.Query({
                _sort: ['name', '-address'],
                _filter: {name: "name", phone: 20},
                _page_size: 10
            })
            @Annotations.Output({
                _fields: ['id', 'name', 'address', 'phone', 'date'],
                _embedded: ['schedule', 'products']
            })
            class TestModel extends RethinkDBModel {
            }

            @Annotations.Model(TestModel)
            @Annotations.Name('testResourceName')
            class TestResourceClass extends GenericResource {
            }

            TestResource = TestResourceClass;

            done();
        });
        beforeEach((done) => {
            router.entries = {};
            done()

        });

        it('Router register errors', ()=>{

            expect(function () {
                router.register();
            }).to.throw(Error);

            expect(function () {
                router.register([]);
            }).to.not.throw(Error);

            expect(function () {
                router.register(TestResource);
            }).to.throw(Error);

            expect(function () {
                router.register("TestResource");
            }).to.throw(Error);

            expect(function () {
                router.register([{
                    path: "path",
                    resource: "TestResource"
                }]);
            }).to.throw(Error);

            expect(function () {
                router.register([{
                    path: "path",
                    resource: TestResource
                }]);
            }).to.not.throw(Error);
            expect(function () {
                router.register([{
                    resource: TestResource
                }]);
            }).to.not.throw(Error);

            expect(function () {
                router.register([{
                    path: 123,
                    resource: TestResource
                }]);
            }).to.throw(Error);
            expect(function () {
                router.register([{
                    path: {path: "pathInvalid"},
                    resource: TestResource
                }]);
            }).to.throw(Error);
        });
        it('Router register resources', () => {
            router.register([{
                resource: TestResource
            }]);

            expect(Object.keys(router.entries).length).to.equal(1);
            expect(TestResource.getName()).to.equal("testResourceName");
            expect(Object.keys(router.entries)[0]).to.equal('testResourceName');
            expect(router.entries["testResourceName"]).to.deep.equal(TestResource);
        });
    });
    describe('Router Koa', () =>{
        let TestResource,
            router;
        before(function (done) {
            ModelRegister.empty();

            router = new KoaRouter();

            let restaurantInput = new Input({
                name: {type: "string", required: true},
                address: {type: "string", required: true},
                phone: {type: "number"},
                photo: {type: "string", regex: Input.URLPattern},
                date: {type: "date"},
                location: {type: "string"},
                language: {type: "string", choices: ["PT", "EN"]}
            });

            @Annotations.Input(restaurantInput)
            @Annotations.Name("restaurant")
            @Annotations.Query({
                _sort: ['name', '-address'],
                _filter: {name: "name", phone: 20},
                _page_size: 10
            })
            @Annotations.Output({
                _fields: ['id', 'name', 'address', 'phone', 'date'],
                _embedded: ['schedule', 'products']
            })
            class TestModel extends RethinkDBModel {
            }

            @Annotations.Model(TestModel)
            @Annotations.Name('testResourceName')
            class TestResourceClass extends GenericResource {
            }

            TestResource = TestResourceClass;

            done();
        });
        beforeEach(function (done) {
            router.entries = {};
            done()

        });

        it('Router register errors', function(){

            expect(function () {
                router.register();
            }).to.throw(Error);

            expect(function () {
                router.register([]);
            }).to.not.throw(Error);

            expect(function () {
                router.register(TestResource);
            }).to.throw(Error);

            expect(function () {
                router.register("TestResource");
            }).to.throw(Error);

            expect(function () {
                router.register([{
                    path: "path",
                    resource: "TestResource"
                }]);
            }).to.throw(Error);

            expect(function () {
                router.register([{
                    path: "path",
                    resource: TestResource
                }]);
            }).to.not.throw(Error);
            expect(function () {
                router.register([{
                    resource: TestResource
                }]);
            }).to.not.throw(Error);

            expect(function () {
                router.register([{
                    path: 123,
                    resource: TestResource
                }]);
            }).to.throw(Error);
            expect(function () {
                router.register([{
                    path: {path: "pathInvalid"},
                    resource: TestResource
                }]);
            }).to.throw(Error);
        });
        it('Router register resources', function(){
            router.register([{
                resource: TestResource
            }]);

            expect(Object.keys(router.entries).length).to.equal(1);
            expect(TestResource.getName()).to.equal("testResourceName");
            expect(Object.keys(router.entries)[0]).to.equal('testResourceName');
            expect(router.entries["testResourceName"]).to.deep.equal(TestResource);
        });
    });
});
