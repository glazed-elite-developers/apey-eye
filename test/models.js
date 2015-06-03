/**
 * Created by GlazedSolutions on 11/03/2015.
 */
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import _ from 'underscore';
import 'mochawait';
import ModelRegister from '../apey-eye/ModelRegister.js';

import ApeyEye from '../apey-eye';

let Model = ApeyEye.Model;
let RethinkDBModel = ApeyEye.RethinkDBModel;
let Decorators = ApeyEye.Decorators;
let Input = ApeyEye.Input;

chai.use(chaiAsPromised);

let expect = chai.expect,
    assert = chai.assert,
    should = chai.should;

describe('Models', function () {


    var restaurantInput,
        restaurantInput2;

    before(function () {
        restaurantInput = new Input({
            name: {type: "string", required: true},
            address: {type: "string", required: true},
            phone: {type: "number"},
            photo: {type: "string", regex: Input.URLPattern},
            date: {type: "date"},
            location: {type: "string"},
            language: {type: "string", choices: ["PT", "EN"]}
        });

        restaurantInput2 = new Input({
            name: {type: "string", required: true},
            address: {type: "string", required: true},
            phone: {type: "number"}
        });
    });

    beforeEach(function () {
        ModelRegister.empty();
    });

    describe('Model Declaration', function () {
        it('should access annotations properties from models', function () {

            @Decorators.Input(restaurantInput)
            @Decorators.Name("dataTableName")
            class TestModel extends Model {
            }

            assert.isDefined(TestModel.annotations);
            assert.isObject(TestModel.annotations);

            expect(Object.keys(TestModel.annotations).length).to.equal(2);
            assert.isDefined(TestModel.getInput());
            assert.isDefined(TestModel.getInput());

            expect(TestModel.getInput().properties).to.have.property("address");
            expect(TestModel.getInput().properties).to.have.deep.property("address.type", "string");
            expect(TestModel.getInput().properties).to.have.deep.property("phone.type", "number");


        });
        it('shouln\'t have the same properties in methods and in class', function () {

            @Decorators.Input(restaurantInput)
            @Decorators.Name("dataTableName")
            class TestModel extends Model {
                @Decorators.Input(restaurantInput2)
                    static

                list() {
                }

                static post() {
                }

                @Decorators.Input(restaurantInput)
                    static

                get() {
                }
            }

            assert.isDefined(TestModel.annotations);
            assert.isObject(TestModel.annotations);

            expect(Object.keys(TestModel.annotations).length).to.equal(2);

            assert.isDefined(TestModel.list.annotations);
            assert.isUndefined(TestModel.post.annotations);

            expect(TestModel.getInput()).to.deep.equal(TestModel.getInput(TestModel.post));
            expect(TestModel.getInput()).to.not.deep.equal(TestModel.getInput(TestModel.list));
        });
    });
    describe('Model properties', function () {

        var TestModel;
        before(function (done) {
            @Decorators.Input(restaurantInput)
            @Decorators.Name("restaurant")
            @Decorators.Query({
                _sort: ['name', '-address'],
                _filter: {name: "name", phone: 20},
                _page_size: 10
            })
            @Decorators.Output({
                _fields: ['id', 'name', 'address', 'phone', 'date'],
                _embedded: ['schedule', 'products']
            })
            class TestModelClass extends RethinkDBModel {
            }

            TestModel = TestModelClass;

            //done();
        });


        it('Model.joinRequest properties should join model properties with request properties', function () {

            var resourceProperties = {
                _sort: ['name'],
                _filter: {address: "Rua Costa Cabral"},
                _pagination: {_page_size: 12},
                _fields: ['name', 'language', 'phone'],
                _embedded: ['schedule']
            };
            var modelProperties = _.extend(TestModel.getOutput(), TestModel.getQuery());


            var joinedProperties = TestModel.joinProperties(resourceProperties);
            expect(modelProperties).to.not.deep.equal(joinedProperties);
            expect(joinedProperties._sort).to.deep.equal(['name']);
            expect(joinedProperties._filter).to.deep.equal({name: "name", phone: 20, address: "Rua Costa Cabral"});
            expect(joinedProperties._pagination._page_size).to.deep.equal(10);
            expect(joinedProperties._fields).to.deep.equal(['name', 'phone']);
            expect(joinedProperties._embedded).to.deep.equal(['schedule']);

        });
        it('Model.joinRequest properties should join model properties with request properties', function () {

            @Decorators.Input(restaurantInput)
            @Decorators.Name("restaurant")
            @Decorators.Query({
                _filter: {address: "Rua Sousa Aroso"},
                _sort: ['name', '-address']
            })
            @Decorators.Output({
                _embedded: ['schedule', 'products']
            })
            class TestModel extends Model {
                constructor(executor) {
                    super(executor)
                }
            }

            var resourceProperties = {
                _filter: {address: "Rua Costa Cabral"},
                _pagination: {_page_size: 12},
                _fields: ['name', 'language', 'phone']
            };
            var modelProperties = _.extend(TestModel.getOutput(), TestModel.getQuery());


            var joinedProperties = TestModel.joinProperties(resourceProperties);

            expect(modelProperties).to.not.deep.equal(joinedProperties);
            expect(joinedProperties._sort).to.deep.equal([{'name': 1}, {'address': -1}]);
            expect(joinedProperties._filter).to.deep.equal({address: "Rua Sousa Aroso"});
            expect(joinedProperties._pagination._page_size).to.deep.equal(12);
            expect(joinedProperties._pagination._page).to.deep.equal(1);
            expect(joinedProperties._fields).to.deep.equal(['name', 'language', 'phone']);
            expect(joinedProperties._embedded).to.deep.equal(['schedule', 'products']);
        });

        it('Model.fetch returns an array', function () {

            return TestModel.fetch().then(function (list) {
                expect(list).to.be.instanceOf(Array);
                expect(list).to.have.length.below(11);
            });
        });
        it('Model.fetch returns a serialized array ', function () {
            return TestModel.fetch().then(function (list) {
                list.should.all.contain.keys('id', 'obj', 'oldObj', 'put', 'patch', 'delete');
            });
        });
        it('Model.post returns an object', function () {

            var data = {
                name: "restaurantName",
                address: "restaurantAddress",
                phone: 9492123
            };

            return (new TestModel({data: data})).then(function (obj) {
                expect(obj.obj).to.be.instanceOf(Object);
                expect(obj.obj).to.have.property('address');
                expect(obj.obj).to.have.property('phone');
                expect(obj.obj).to.have.property('name');
            });
        });
        it('Model.post invalid data may return an exception', async function () {

            var data = {
                name: "restaurantName",
                address: "restaurantAddress",
                phone: 9492123
            };

            var invalidData1 = {
                name: 123,
                address: "restaurantAddress",
                phone: 9492123
            };

            var invalidData2 = {
                name: "restaurantName",
                address: "restaurantAddress",
                phone: "invalidPhone"
            };


            expect(new TestModel({data: data})).to.be.fulfilled;
            expect(new TestModel({data: invalidData1})).to.be.rejected;
            expect(new TestModel({data: invalidData2})).to.be.rejected;


        });
        it('Model.fetchOne for a before inserted object returns the same object', async function () {

            var data = {
                name: "restaurantName",
                address: "restaurantAddress",
                phone: 9492123
            };
            let postedObject = await new TestModel({data: data});
            let obj = await TestModel.fetchOne({id: postedObject.obj.id});

            expect(obj.obj).to.deep.equal(postedObject.obj);
        });
        it('Model.put replace an object inserted before', async function () {

            var data = {
                name: "restaurantName",
                address: "restaurantAddress",
                phone: 9492123
            };

            let obj = await new TestModel({data: data});
            await obj.put({data: {name: "restaurantName2", address: "Rua Costa Cabral"}});

            expect(obj.obj).to.not.have.property("phone");
            expect(obj.obj).to.have.property("name", "restaurantName2");
            expect(obj.obj).to.have.property("address", "Rua Costa Cabral");

        });
        it('Model.patch update an object inserted before', async function () {

            var data = {
                name: "restaurantName",
                address: "restaurantAddress",
                phone: 9492123
            };

            let obj = await new TestModel({data: data});
            await obj.patch({data: {name: "restaurantName2", address: "Rua Costa Cabral"}});

            expect(obj.obj).to.have.property("phone", 9492123);
            expect(obj.obj).to.have.property("name", "restaurantName2");
            expect(obj.obj).to.have.property("address", "Rua Costa Cabral");

        });
        it('Model.delete delete an object from database, so it is impossible to access him again', async function () {

            var data = {
                name: "restaurantName",
                address: "restaurantAddress",
                phone: 9492123
            };
            let obj = await new TestModel({data: data});
            let res = await obj.delete();

            expect(res).to.be.true;
            expect(TestModel.fetchOne({id: obj.id})).to.eventually.throw();

        });
        it('Model.save  makes a patch with object .obj data', async function () {

            var data = {
                name: "restaurantName",
                address: "restaurantAddress",
                phone: 9492123
            };

            let obj = await new TestModel({data: data});

            obj.obj.name = "restaurantName2";
            obj.obj.address = "Rua Costa Cabral";

            expect(obj.oldObj).to.have.property("name", "restaurantName");
            expect(obj.oldObj).to.have.property("address", "restaurantAddress");

            await obj.save();

            expect(obj.obj).to.have.property("phone", 9492123);
            expect(obj.obj).to.have.property("name", "restaurantName2");
            expect(obj.obj).to.have.property("address", "Rua Costa Cabral");

            expect(obj.oldObj).to.have.property("name", "restaurantName2");
            expect(obj.oldObj).to.have.property("address", "Rua Costa Cabral");

        });

        it('Model.save  with invalid data may throw exceptions', async function () {

            var data = {
                name: "restaurantName",
                address: "restaurantAddress",
                phone: 9492123
            };

            let obj = await new TestModel({data: data});
            obj.obj.name = "restaurantName2";
            obj.obj.address = 123123;

            expect(obj.save()).to.eventually.throw();

            obj.obj.address = "restaurantAddress";

            expect(obj.save()).to.eventually.not.throw();
        });
        it('Operations that returns the object may receive object with only a set of fields', async function () {

            var data = {
                name: "restaurantName",
                address: "restaurantAddress",
                phone: 9492123
            };

            let obj = await new TestModel({data: data});

            expect(obj.obj).to.have.keys("id", "name", "address", "phone");

            obj = await new TestModel({data: data, resourceProperties: {_fields: ['id', 'name']}});

            expect(obj.obj).to.have.keys("id", "name");

            await obj.patch({
                data: {name: "restaurantName2", address: "Rua Costa Cabral"},
                resourceProperties: {_fields: ['id']}
            });

            expect(obj.obj).to.not.have.keys("id", "name", "address", "phone");
            expect(obj.obj).to.have.keys("id");
        });
    });
});