"use strict";

///**
// * Created by Filipe on 11/03/2015.
// */
//var assert = require('assert'),
//    chai = require('chai'),
//    expect = chai.expect,
//    assert = chai.assert,
//    Model = require('../framework/Model'),
//    Input = require('../framework/Input'),
//    Annotations = require('../framework/Annotations'),
//    Name = Annotations.Name,
//    Sort = Annotations.Sort,
//    PageSize = Annotations.PageSize,
//    Methods = Annotations.Methods,
//    Types = require('../framework/Types');
//
//describe('Annotations', function() {
//    var validSchema;
//    var invalidSchema;
//    var invalidSchema2;
//    var restaurantInput;
//
//
//    before(function(){
//        restaurantInput = new Input({
//            name: {type: "string", required:true},
//            address: {type: "string", required:true},
//            phone: {type: "number"},
//            photo: {type: "string", regex: Input.URLPattern},
//            date: {type: "date"},
//            location: {type:"string"},
//            language: {type:"string", choices: ["PT", "EN"]}
//        });
//
//        validSchema = {
//            name: Types._String(),
//            address: Types._String(),
//            phone: Types._Number(),
//            active: Types._Boolean()
//        };
//
//        invalidSchema = "invalidSchemaValue";
//
//        invalidSchema2 = {
//            name: "nameField",
//            address: Types._String(),
//            phone: 123,
//            active: true
//        };
//    });
//    describe('Input', function () {
//        it('should receive an Input object', function () {
//
//            assert.doesNotThrow(function() {
//                new Annotations.Input(restaurantInput);
//            });
//            assert.throw(function() {
//                new Annotations.Input("restaurantInput");
//            },Error);
//            assert.throw(function() {
//                new Annotations.Input(Input);
//            },Error);
//            assert.throw(function() {
//                new Annotations.Input();
//            },Error);
//            assert.throw(function() {
//                new Annotations.Input(false);
//            },Error);
//
//        });
//
//    });
//    describe('Name', function () {
//        it('should receive a string', function () {
//
//            assert.doesNotThrow(function() {
//                new Name("dataTableName");
//            });
//
//            assert.throw(function() {
//                new Name({key:"value"});
//            }, Error);
//
//            assert.throw(function() {
//                new Name(1123);
//            }, Error);
//
//            assert.throw(function() {
//                new Name(false);
//            }, Error);
//        });
//    });
//    describe('Query', function () {
//        it('Query should receive an object with properties, being limited only _sort, _filter, _page_size', function () {
//            assert.doesNotThrow(function() {
//                new Annotations.Query();
//            });
//            assert.doesNotThrow(function() {
//                new Annotations.Query({});
//            });
//            assert.doesNotThrow(function() {
//                new Annotations.Query({_sort:[]});
//            });
//
//            assert.throw(function() {
//                new Annotations.Query(false);
//            },Error);
//
//            assert.throw(function() {
//                new Annotations.Query([]);
//            },Error);
//
//            assert.throw(function() {
//                new Annotations.Query({sort:[]});
//            },Error);
//            assert.throw(function() {
//                new Annotations.Query({_sort:[], filter:{}});
//            },Error);
//            assert.throw(function() {
//                new Annotations.Query({_sort:[], _filter:{}, pageSize: 15});
//            },Error);
//            assert.throw(function() {
//                new Annotations.Query({_sort:[], _filter:{}, page_size: 15, embedded:[]});
//            },Error);
//        });
//
//        it('Query._sort should receive an array of strings or nothing', function () {
//
//            assert.throw(function() {
//                new Annotations.Query({_sort:"sortField"});
//            },Error);
//
//            assert.throw(function() {
//                new Annotations.Query({_sort:false});
//            },Error);
//
//            assert.throw(function() {
//                new Annotations.Query({_sort:[1,2,3,4]});
//            },Error);
//
//            assert.throw(function() {
//                new Annotations.Query({_sort:["1","2","3",4]});
//            },Error);
//
//            assert.doesNotThrow(function() {
//                new Annotations.Query({_sort:undefined});
//            });
//
//            assert.doesNotThrow(function() {
//                new Annotations.Query({_sort:["1","2","3","4"]});
//            },Error);
//
//            assert.doesNotThrow(function() {
//                new Annotations.Query({_sort:[]});
//            },Error);
//
//        });
//        it('Query._sort must be parsed', function () {
//
//            var query = new Annotations.Query({_sort:["-1","2","-3","4"]});
//
//            assert.isArray(query.properties._sort);
//            assert.deepEqual(query.properties._sort[0], {"1":-1});
//            assert.deepEqual(query.properties._sort[1], {"2":1});
//            assert.deepEqual(query.properties._sort[2], {"3":-1});
//            assert.deepEqual(query.properties._sort[3], {"4":1});
//
//        });
//        it('Query._page_size should receive a positive integer', function () {
//
//            assert.throw(function() {
//                new Annotations.Query({_page_size:"sortField"});
//            },Error);
//            assert.throw(function() {
//                new Annotations.Query({_page_size:false});
//            },Error);
//            assert.throw(function() {
//                new Annotations.Query({_page_size:[1,2,3,4]});
//            },Error);
//
//            assert.throw(function() {
//                new Annotations.Query({_page_size:0.2});
//            },Error);
//
//            assert.throw(function() {
//                new Annotations.Query({_page_size:-10});
//            },Error);
//
//            assert.doesNotThrow(function() {
//                new Annotations.Query({_page_size:undefined});
//            });
//            assert.doesNotThrow(function() {
//                new Annotations.Query({_page_size:15});
//            });
//        });
//
//        it('Query._filter should receive an object or nothing', function () {
//
//            assert.throw(function() {
//                new Annotations.Query({_filter:"sortField"});
//            },Error);
//
//            assert.throw(function() {
//                new Annotations.Query({_filter:false});
//            },Error);
//
//            assert.throw(function() {
//                new Annotations.Query({_filter:[1,2,3,4]});
//            },Error);
//
//            assert.throw(function() {
//                new Annotations.Query({_filter:["1","2","3",4]});
//            },Error);
//
//            assert.doesNotThrow(function() {
//                new Annotations.Query({_filter:undefined});
//            });
//            assert.doesNotThrow(function() {
//                new Annotations.Query({_filter:{}});
//            });
//            assert.doesNotThrow(function() {
//                new Annotations.Query({_filter:{name:"valueRequired"}});
//            });
//
//
//
//        });
//    });
//    describe('Output', function () {
//        it('Query should receive an object with properties, being limited only _fields, _embedded', function () {
//            assert.doesNotThrow(function() {
//                new Annotations.Output();
//            });
//            assert.doesNotThrow(function() {
//                new Annotations.Output({});
//            });
//            assert.doesNotThrow(function() {
//                new Annotations.Output({_embedded:[]});
//            });
//
//            assert.throw(function() {
//                new Annotations.Output(false);
//            },Error);
//
//            assert.throw(function() {
//                new Annotations.Output([]);
//            },Error);
//
//            assert.throw(function() {
//                new Annotations.Output({embedded:[]});
//            },Error);
//            assert.throw(function() {
//                new Annotations.Output({_embedded:[], fields:{}});
//            },Error);
//
//            assert.throw(function() {
//                new Annotations.Output({_sort:[], _filter:{}, _page_size:15});
//            },Error);
//
//            assert.doesNotThrow(function() {
//                new Annotations.Output({_embedded:[], _fields:[]});
//            },Error);
//        });
//        it('Output._embedded should receive an array of strings or nothing', function () {
//
//            assert.throw(function() {
//                new Annotations.Output({_embedded:"sortField"});
//            },Error);
//
//            assert.throw(function() {
//                new Annotations.Output({_embedded:false});
//            },Error);
//
//            assert.throw(function() {
//                new Annotations.Output({_embedded:[1,2,3,4]});
//            },Error);
//
//            assert.throw(function() {
//                new Annotations.Output({_embedded:["1","2","3",4]});
//            },Error);
//
//            assert.doesNotThrow(function() {
//                new Annotations.Output({_embedded:undefined});
//            });
//
//            assert.doesNotThrow(function() {
//                new Annotations.Output({_embedded:["1","2","3","4"]});
//            },Error);
//
//            assert.doesNotThrow(function() {
//                new Annotations.Output({_embedded:[]});
//            },Error);
//
//        });
//        it('Output._fields should receive an array of strings or nothing', function () {
//
//            assert.throw(function() {
//                new Annotations.Output({_fields:"sortField"});
//            },Error);
//
//            assert.throw(function() {
//                new Annotations.Output({_fields:false});
//            },Error);
//
//            assert.throw(function() {
//                new Annotations.Output({_fields:[1,2,3,4]});
//            },Error);
//
//            assert.throw(function() {
//                new Annotations.Output({_fields:["1","2","3",4]});
//            },Error);
//
//            assert.doesNotThrow(function() {
//                new Annotations.Output({_fields:undefined});
//            });
//
//            assert.doesNotThrow(function() {
//                new Annotations.Output({_fields:["1","2","3","4"]});
//            },Error);
//
//            assert.doesNotThrow(function() {
//                new Annotations.Output({_fields:[]});
//            },Error);
//
//        });
//    });
//    describe('Model', function () {
//        it('should receive a model class', function () {
//
//            @Schema(validSchema)
//            @Name("dataTableName")
//            @PageSize(10)
//            @Sort(["field2"])
//            class TestModel extends Model{}
//
//            assert.doesNotThrow(function() {
//                new Annotations.Model(TestModel);
//            });
//
//
//
//        });
//    });
//    describe('Methods', function () {
//        it('should receive an array of string and value of each element is limited', function () {
//
//
//            assert.throw(function() {
//                new Methods(1);
//            },Error);
//            assert.throw(function() {
//                new Methods(false);
//            },Error);
//            assert.throw(function() {
//                new Methods([1,2,3,4]);
//            },Error);
//
//            assert.throw(function() {
//                new Methods(["list", "get","post", 12,false]);
//            },Error);
//
//            assert.throw(function() {
//                new Methods(["list", "retrieve","create", "delete"]);
//            },Error);
//
//            assert.doesNotThrow(function() {
//                new Methods([]);
//            });
//            assert.doesNotThrow(function() {
//                new Methods();
//            });
//            assert.doesNotThrow(function() {
//                new Methods(["fetch"]);
//            });
//            assert.doesNotThrow(function() {
//                new Methods(["fetch","fetchOne", "constructor", "put","delete"]);
//            });
//        });
//    });
//});