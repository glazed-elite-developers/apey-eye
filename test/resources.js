/**
 * Created by Filipe on 11/03/2015.
 */
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiThings from 'chai-things';
import _ from 'underscore';
import 'mochawait';

import ModelRegister from '../apey-eye/ModelRegister.js';
import ApeyEye from '../apey-eye';

let Model = ApeyEye.Model;
let RethinkDBModel = ApeyEye.RethinkDBModel;
let Resource = ApeyEye.Resource;
let GenericResource = ApeyEye.GenericResource;
let Input = ApeyEye.Input;
let Annotations = ApeyEye.Annotations;
let Formatters = ApeyEye.Formatters;

chai.use(chaiAsPromised);
chai.should();
chai.use(chaiThings);

let expect = chai.expect,
    assert = chai.assert,
    should = chai.should;

describe('Resources', function () {

    describe('Resource Declaration', function () {
        var restaurantInput,
            RestaurantModel;

        before(function (done) {
            restaurantInput = new Input({
                name: {type: "string", required: true},
                address: {type: "string", required: true},
                phone: {type: "number"},
                photo: {type: "string", regex: Input.URLPattern},
                date: {type: "date"},
                location: {type: "string"},
                language: {type: "string", choices: ["PT", "EN"]}
            });

            @Annotations.Input(restaurantInput)
            class RestaurantModelClass extends Model {
            }
            ;
            RestaurantModel = RestaurantModelClass;
            done();
        });
        beforeEach((done) => {
            ModelRegister.empty();
            done()

        });

        it('Test Valid Input Resource declaration', function () {
            expect(function () {
                @Annotations.Input()
                class MyResource extends Resource {
                }
            }).to.throw(Error);
            expect(function () {
                @Annotations.Input(123)
                class MyResource extends Resource {
                }
            }).to.throw(Error);
            expect(function () {
                @Annotations.Input("inputString")
                class MyResource extends Resource {
                }
            }).to.throw(Error);
            expect(function () {
                @Annotations.Input({name: {type: "string"}})
                class MyResource extends Resource {
                }
            }).to.throw(Error);
            expect(function () {
                @Annotations.Input(restaurantInput)
                class MyResource extends Resource {
                }
            }).to.not.throw();

        })
        it('Test Valid Name Resource declaration', function () {
            expect(function () {
                @Annotations.Name()
                class MyResource extends Resource {
                }
            }).to.throw(Error);
            expect(function () {
                @Annotations.Name(123)
                class MyResource extends Resource {
                }
            }).to.throw(Error);
            expect(function () {
                @Annotations.Name("inputString")
                class MyResource extends Resource {
                }
            }).to.not.throw(Error);
            expect(function () {
                @Annotations.Name({name: "ResourceName"})
                class MyResource extends Resource {
                }
            }).to.throw(Error);
        })
        it('Test Valid Query Resource declaration', function () {
            expect(function () {
                @Annotations.Query()
                class MyResource extends Resource {
                }
            }).to.throw(Error);
            expect(function () {
                @Annotations.Query(123)
                class MyResource extends Resource {
                }
            }).to.throw(Error);
            expect(function () {
                @Annotations.Query("inputString")
                class MyResource extends Resource {
                }
            }).to.throw(Error);
            expect(function () {
                @Annotations.Query({name: "ResourceName"})
                class MyResource extends Resource {
                }
            }).to.throw(Error);

            expect(function () {
                @Annotations.Query({_sort: ["name", 123]})
                class MyResource extends Resource {
                }
            }).to.throw(Error);

            expect(function () {
                @Annotations.Query({_sort: "name"})
                class MyResource extends Resource {
                }
            }).to.throw(Error);

            expect(function () {
                @Annotations.Query({_sort: ["-name"]})
                class MyResource extends Resource {
                }
            }).to.not.throw(Error);
            expect(function () {
                @Annotations.Query({_page_size: ["-name"]})
                class MyResource extends Resource {
                }
            }).to.throw(Error);
            expect(function () {
                @Annotations.Query({_page_size: "1"})
                class MyResource extends Resource {
                }
            }).to.throw(Error);
            expect(function () {
                @Annotations.Query({_page_size: 1.1})
                class MyResource extends Resource {
                }
            }).to.throw(Error);
            expect(function () {
                @Annotations.Query({_page_size: 1})
                class MyResource extends Resource {
                }
            }).to.not.throw(Error);

            expect(function () {
                @Annotations.Query({_filter: 1})
                class MyResource extends Resource {
                }
            }).to.throw(Error);

            expect(function () {
                @Annotations.Query({_filter: "string"})
                class MyResource extends Resource {
                }
            }).to.throw(Error);

            expect(function () {
                @Annotations.Query({_filter: ["name"]})
                class MyResource extends Resource {
                }
            }).to.throw(Error);
            expect(function () {
                @Annotations.Query({_filter: {name: "123"}})
                class MyResource extends Resource {
                }
            }).to.not.throw(Error);
        });
        it('Test Valid Output Resource declaration', function () {
            expect(function () {
                @Annotations.Output()
                class MyResource extends Resource {
                }
            }).to.throw(Error);
            expect(function () {
                @Annotations.Output(123)
                class MyResource extends Resource {
                }
            }).to.throw(Error);
            expect(function () {
                @Annotations.Output("invalidoutput")
                class MyResource extends Resource {
                }
            }).to.throw(Error);
            expect(function () {
                @Annotations.Output({name: "123"})
                class MyResource extends Resource {
                }
            }).to.throw(Error);
            expect(function () {
                @Annotations.Output(["name", "categories"])
                class MyResource extends Resource {
                }
            }).to.throw(Error);
            expect(function () {
                @Annotations.Output({
                    _fields: "name"
                })
                class MyResource extends Resource {
                }
            }).to.throw(Error);
            expect(function () {
                @Annotations.Output({
                    _fields: ["name", 123]
                })
                class MyResource extends Resource {
                }
            }).to.throw(Error);
            expect(function () {
                @Annotations.Output({
                    _fields: ["name", "categories"]
                })
                class MyResource extends Resource {
                }
            }).to.not.throw(Error);
            expect(function () {
                @Annotations.Output({
                    _embedded: ["name", 123]
                })
                class MyResource extends Resource {
                }
            }).to.throw(Error);
            expect(function () {
                @Annotations.Output({
                    _embedded: "name"
                })
                class MyResource extends Resource {
                }
            }).to.throw(Error);
            expect(function () {
                @Annotations.Output({
                    _embedded: ["name", "categories"]
                })
                class MyResource extends Resource {
                }
            }).to.not.throw(Error);
        });
        it('Test Valid Output Resource declaration', function () {
            expect(function () {
                @Annotations.Format()
                class MyResource extends Resource {
                }
            }).to.throw(Error);
            expect(function () {
                @Annotations.Format(123)
                class MyResource extends Resource {
                }
            }).to.throw(Error);
            expect(function () {
                @Annotations.Format("123")
                class MyResource extends Resource {
                }
            }).to.throw(Error);
            expect(function () {
                @Annotations.Format([Formatters.JSONFormat])
                class MyResource extends Resource {
                }
            }).to.throw(Error);
            expect(function () {
                @Annotations.Format(Formatters.JSONFormat)
                class MyResource extends Resource {
                }
            }).to.not.throw(Error);
        });
        it('Test Valid Authentication Resource declaration', function () {
            expect(function () {
                @Annotations.Authentication()
                class MyResource extends Resource {
                }
            }).to.not.throw(Error);
            expect(function () {
                @Annotations.Authentication(123)
                class MyResource extends Resource {
                }
            }).to.throw(Error);
            expect(function () {
                @Annotations.Authentication("123")
                class MyResource extends Resource {
                }
            }).to.not.throw(Error);
        });
        it('Test Valid  Roles Resource declaration', function () {
            expect(function () {
                @Annotations.Roles()
                class MyResource extends Resource {
                }
            }).to.not.throw(Error);
            expect(function () {
                @Annotations.Roles(123)
                class MyResource extends Resource {
                }
            }).to.throw(Error);
            expect(function () {
                @Annotations.Roles("123")
                class MyResource extends Resource {
                }
            }).to.throw(Error);
            expect(function () {
                @Annotations.Roles({role: "client"})
                class MyResource extends Resource {
                }
            }).to.throw(Error);
            expect(function () {
                @Annotations.Roles([])
                class MyResource extends Resource {
                }
            }).to.not.throw(Error);
            expect(function () {
                @Annotations.Roles(['client', 'admin'])
                class MyResource extends Resource {
                }
            }).to.not.throw(Error);
            expect(function () {
                @Annotations.Roles(['client', 123])
                class MyResource extends Resource {
                }
            }).to.throw(Error);
        });
        it('Test Valid  Model Resource declaration', function () {
            expect(function () {
                @Annotations.Model()
                class MyResource extends GenericResource {
                }
            }).to.throw(Error);
            expect(function () {
                @Annotations.Model(123)
                class MyResource extends GenericResource {
                }
            }).to.throw(Error);
            expect(function () {
                @Annotations.Model("modelString")
                class MyResource extends GenericResource {
                }
            }).to.throw(Error);
            expect(function () {
                @Annotations.Model({model: RestaurantModel})
                class MyResource extends GenericResource {
                }
            }).to.throw(Error);
            expect(function () {
                @Annotations.Model(RestaurantModel)
                class MyResource extends GenericResource {
                }
            }).to.not.throw(Error);
        });
        it('Test Valid  Methods Resource declaration', function () {
            expect(function () {
                @Annotations.Methods()
                class MyResource extends GenericResource {
                }
            }).to.not.throw(Error);
            expect(function () {
                @Annotations.Methods(123)
                class MyResource extends GenericResource {
                }
            }).to.throw(Error);
            expect(function () {
                @Annotations.Methods("123")
                class MyResource extends GenericResource {
                }
            }).to.throw(Error);
            expect(function () {
                @Annotations.Methods({methods: ["get", "fetch"]})
                class MyResource extends GenericResource {
                }
            }).to.throw(Error);
            expect(function () {
                @Annotations.Methods(["get", 123])
                class MyResource extends GenericResource {
                }
            }).to.throw(Error);
            expect(function () {
                @Annotations.Methods(["constructor", "static.fetch"])
                class MyResource extends GenericResource {
                }
            }).to.not.throw(Error);
        });
    });
    describe('Resource methods basic test', () => {

        var restaurantInput,
            TestModel,
            TestResource;

        before((done) => {
            restaurantInput = new Input({
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
            class TestModelClass extends RethinkDBModel {
            }

            TestModel = TestModelClass;

            @Annotations.Model(TestModel)
            @Annotations.Format(Formatters.JSONFormat)
            class TestResourceClass extends GenericResource {
            }

            TestResource = TestResourceClass;
            done();


        });

        beforeEach((done) => {
            ModelRegister.empty();
            done()

        });

        it('Resource.fetch ', async () => {

            let list = await TestResource.fetch();
            expect(list).to.be.instanceOf(Array);

        });
        it('Resource.fetch returns a serialized array ', async () => {

            let list = await TestResource.fetch();
            list.should.all.contain.keys('id', 'obj', 'put', 'patch', 'delete');
        });
        it('Resource.post returns an object', async () => {

            var data = {
                name: "restaurantName",
                address: "restaurantAddress",
                phone: 9492123
            };

            let result = await new TestResource({data: data});

            expect(result.obj).to.be.instanceOf(Object);
            expect(result.obj).to.have.property('address');
            expect(result.obj).to.have.property('phone');
            expect(result.obj).to.have.property('name');

        });
        it('Resource.post invalid data may return an exception', async () => {

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

            expect(new TestResource({data: data})).to.be.fulfilled;
            expect(new TestResource({data: invalidData1})).to.be.rejected;
            expect(new TestResource({data: invalidData2})).to.be.rejected;
        });
        it('Resource.fetchOne for a before inserted object returns the same object', async () => {

            var data = {
                name: "restaurantName",
                address: "restaurantAddress",
                phone: 9492123
            };

            let postedObject = await new TestResource({data: data});
            let obj = await TestResource.fetchOne({id: postedObject.obj.id});

            expect(obj.obj).to.deep.equal(postedObject.obj);
        });
        it('Resource.put replace an object inserted before', async () => {

            var data = {
                name: "restaurantName",
                address: "restaurantAddress",
                phone: 9492123
            };

            let obj = await new TestResource({data: data});
            await obj.put({data: {name: "restaurantName2", address: "Rua Costa Cabral"}});

            expect(obj.obj).to.not.have.property("phone");
            expect(obj.obj).to.have.property("name", "restaurantName2");
            expect(obj.obj).to.have.property("address", "Rua Costa Cabral");
        });
        it('Resource.patch update an object inserted before', async () => {

            var data = {
                name: "restaurantName",
                address: "restaurantAddress",
                phone: 9492123
            };

            let obj = await new TestResource({data: data});
            await obj.patch({data: {name: "restaurantName2", address: "Rua Costa Cabral"}});

            expect(obj.obj).to.have.property("phone", 9492123);
            expect(obj.obj).to.have.property("name", "restaurantName2");
            expect(obj.obj).to.have.property("address", "Rua Costa Cabral");
        });
        it('Resource.delete delete an object from database, so it is impossible to access him again', async () => {

            var data = {
                name: "restaurantName",
                address: "restaurantAddress",
                phone: 9492123
            };

            let obj = await new TestResource({data: data});
            let res = await obj.delete();

            expect(res).to.be.true;
            expect(TestResource.fetchOne({id: obj.id})).to.eventually.throw();
        });
        it('Operations that returns the object may receive object with only a set of fields', async () => {

            var data = {
                name: "restaurantName",
                address: "restaurantAddress",
                phone: 9492123
            };

            let obj = await new TestResource({data: data});

            expect(obj.obj).to.have.keys("id", "name", "address", "phone");

            obj = await new TestResource({data: data, requestProperties: {_fields: ['id', 'name']}});

            expect(obj.obj).to.have.keys("id", "name");

            await obj.patch({
                data: {name: "restaurantName2", address: "Rua Costa Cabral"},
                requestProperties: {_fields: ['id']}
            });

            expect(obj.obj).to.not.have.keys("id", "name", "address", "phone");
            expect(obj.obj).to.have.keys("id");

        });
        it('Resource render', async () => {

            var restaurantData = {
                name: "restaurantName",
                address: "restaurantAddress"
            };

            let restObj = await new TestResource({data: restaurantData});
            let resultRender = restObj.render();

            expect(resultRender.data).to.be.a('string');
            expect(resultRender.data).to.equal(JSON.stringify(restObj.obj));
            expect(resultRender.type).to.equal(Formatters.JSONFormat.getMediaType());
        });
    });
    describe('Resource methods with relations test', () => {

        var RestaurantResource,
            CategoryResource,
            PhoneResource,
            AddressResource;

        before((done) => {
            let phonesInput = new Input({
                phone: {type: "string", required: true}
            });

            @Annotations.Input(phonesInput)
            @Annotations.Name("phone")
            class PhonesModel extends RethinkDBModel {
            }

            @Annotations.Model(PhonesModel)
            class PhoneResourceClass extends GenericResource {
            }
            PhoneResource = PhoneResourceClass;

            let addressInput = new Input({
                address: {type: "string", required: true},
                restaurant: {type: "reference", model: "restaurant"}
            });

            @Annotations.Input(addressInput)
            @Annotations.Name("address")
            class AddressModel extends RethinkDBModel {
            }

            @Annotations.Model(AddressModel)
            class AddressResourceClass extends GenericResource {
            }
            AddressResource = AddressResourceClass;

            let categoryInput = new Input({
                name: {type: "string", required: true},
                restaurants: {
                    type: "manyToMany",
                    model: "restaurant",
                    inverse: "categories",
                    through: "categoryRestaurant"
                }
            });

            @Annotations.Input(categoryInput)
            @Annotations.Name("category")
            class CategoryModel extends RethinkDBModel {
            }

            @Annotations.Model(CategoryModel)
            class CategoryResourceClass extends GenericResource {
            }

            CategoryResource = CategoryResourceClass;

            var categoryRestaurantInput = new Input({
                category: {type: "reference", model: "category"},
                restaurant: {type: "reference", model: "restaurant"}
            });

            @Annotations.Input(categoryRestaurantInput)
            @Annotations.Name("categoryRestaurant")
            class CategoryRestaurantModel extends RethinkDBModel {
            }

            let restaurantInput = new Input({
                name: {type: "string", required: true},
                phone: {type: "reference", model: "phone"},
                addresses: {type: "collection", model: "address", inverse: "restaurant"},
                categories: {
                    type: "manyToMany",
                    model: "category",
                    inverse: "restaurants",
                    through: "categoryRestaurant"
                }
            });

            @Annotations.Input(restaurantInput)
            @Annotations.Name("restaurant")
            class RestaurantModel extends RethinkDBModel {
            }

            @Annotations.Model(RestaurantModel)
            class RestaurantResourceClass extends GenericResource {
            }

            RestaurantResource = RestaurantResourceClass;
            done();
        });
        it('Resource insert an embedded reference', async () => {

            var data = {
                name: "restaurantName",
                phone: {phone: "93333"}
            };

            let obj = await new RestaurantResource({data: data});
            expect(obj.obj.phone).to.be.a('string');

            obj = await RestaurantResource.fetchOne({id: obj.id, requestProperties: {_embedded: ["phone"]}});
            expect(obj.obj.phone).to.be.a('object');

            let phoneObj = await PhoneResource.fetchOne({id: obj.obj.phone.id});
            expect(obj.obj.phone).to.deep.equal(phoneObj.obj);
        });
        it('Resource insert an reference to an existing object', async () => {

            let phoneData = {
                phone: "939393"
            };

            let restaurantData = {
                name: "restaurantName"
            };

            let phoneObj = await new PhoneResource({data: phoneData});

            restaurantData.phone = phoneObj.id;
            let restObj = await new RestaurantResource({data: restaurantData});
            expect(restObj.obj.phone).to.equal(phoneObj.id);


            restObj = await RestaurantResource.fetchOne({id: restObj.id, requestProperties: {_embedded: ["phone"]}});
            expect(restObj.obj.phone).to.deep.equal(phoneObj.obj);
        });
        it('Resource insert an embedded collection', async () => {

            var restaurantData = {
                name: "restaurantName",
                addresses: [{address: "address"}]
            };

            let restObj = await new RestaurantResource({data: restaurantData});
            expect(restObj.obj.addresses).to.be.instanceof(Array);
            expect(restObj.obj.addresses[0]).to.be.a('string');

            restObj = await RestaurantResource.fetchOne({
                id: restObj.id,
                requestProperties: {_embedded: ["addresses"]}
            });
            expect(restObj.obj.addresses).to.be.instanceof(Array);
            expect(restObj.obj.addresses[0]).to.be.a('object');

            let addressObj = await AddressResource.fetchOne({id: restObj.obj.addresses[0].id});
            expect(addressObj.obj.restaurant).to.equal(restObj.id);

            await restObj.patch({data: {addresses: []}})
            expect(restObj.obj.addresses.length).to.equal(0);

            expect(AddressResource.fetchOne({id: addressObj.id})).to.be.rejected;
        });
        it('Resource insert an collection with reference id', async () => {

            let addressData = {
                address: "address"
            };

            let restaurantData = {
                name: "restaurantName"
            };

            let addressObj = await new AddressResource({data: addressData});

            restaurantData.addresses = [addressObj.id];
            let restObj = await new RestaurantResource({data: restaurantData});
            expect(restObj.obj.addresses).to.be.instanceof(Array);
            expect(restObj.obj.addresses[0]).to.equal(addressObj.id);


            restObj = await RestaurantResource.fetchOne({
                id: restObj.id,
                requestProperties: {_embedded: ["addresses"]}
            });
            addressObj = await AddressResource.fetchOne({id: addressObj.id});
            expect(restObj.obj.addresses[0]).to.deep.equal(addressObj.obj);
        });
        it('Resource insert an embedded manyToMany', async () => {

            var restaurantData = {
                name: "restaurantName",
                categories: [{name: "category1"}]
            };


            let restObj = await new RestaurantResource({data: restaurantData});
            expect(restObj.obj.categories).to.be.instanceof(Array);
            expect(restObj.obj.categories[0]).to.be.a('string');

            restObj = await RestaurantResource.fetchOne({
                id: restObj.id,
                requestProperties: {_embedded: ["categories"]}
            });
            expect(restObj.obj.categories).to.be.instanceof(Array);
            expect(restObj.obj.categories[0]).to.be.a('object');

            let categoryObj = await CategoryResource.fetchOne({id: restObj.obj.categories[0].id});
            expect(categoryObj.obj.restaurants).to.be.instanceof(Array);
            expect(categoryObj.obj.restaurants[0]).to.equal(restObj.id);

            await categoryObj.patch({data: {restaurants: []}})
            expect(categoryObj.obj.restaurants.length).to.equal(0);

            expect(RestaurantResource.fetchOne({id: restObj.id})).to.be.rejected;
        });


    });
    describe('Generic Resource', () => {
        let ValidResource,
            InvalidResource;

        before((done) => {
            class InvalidResourceClass extends GenericResource {
            }
            InvalidResource = InvalidResourceClass;

            @Annotations.Name("validResourceName")
            class ValidResourceClass extends GenericResource {
            }
            ValidResource = ValidResourceClass;

            done();
        });

        beforeEach((done) => {
            ModelRegister.empty();
            done();
        });

        it("Automatic creation of model", async () => {
            let data = {name:"a name", address:"an address"};

            expect(new InvalidResource({data:data})).to.be.rejected;
            expect(InvalidResource.getModel()).to.equal(undefined);

            expect(new ValidResource({data:data})).to.be.fulfilled;
            expect(ValidResource.getModel().prototype).to.be.an.instanceof(Model);
            expect(ValidResource.getModel().getName()).to.equal(ValidResource.getName());
        })
    });
});