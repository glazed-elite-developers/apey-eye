# Apey Eye

## Installation
### Installation

```
$ npm install apey-eye
```

### Start Example

```
$ npm run-script start-koa
$ npm run-script start-hapi
```

### Run Tests

```
$ npm test
$ npm run-script test-cov
```

Creation of a REST / HATEOAS Framework Open Source to develop APIs in NodeJS

Apey Eye is a REST framework for Node.js that pretends to offer to developers a simple and intuitive way to develop their web services, needing only to understand a small set of concepts.

Epey Eye is based essentially in following concepts:

* **Model:**
It is the unique entity in framework able to connect to database, may be implemented in a specific way according to the database that will be used.
It is a kind of ORM that allows to represent database data through JavaScript objects.

* **Resource:**
For Apey Eye, the meaning of Resource is almost the same that are presented in the REST architectural style.
It is the entity responsible to make the data processing and use _Models_ to access data from databases.

* **Router:**
It is the entity responsible for mapping HTTP requests received and the _Resources_ in charge for its processing.

As it is already common to have an __object-relational mapping__ for represent relational database content through an object oriented way, that allows handling data in an easier and intuitive way, also **Apey Eye** makes an __object-resource mapping__ where _Resources_ make an direct connection to _Model_ objects.

In addiction to make the source code and their usage by developers mode simpler, this perspective was also adopted in order to allow development of REST services in a more organized and simpler way, offering an easy separation of responsibilities between the different entities included in **Apey Eye** framework.

Furthermore, this object oriented approach allow entities like _Model_ and _Resource_ to be used in a imperative way by developer, facilitating their use independently of structures such as the _Router_. 
Thus, this still allows them to be more easily testable programmatically.

## Resources

### Class-based

Resources are implemented through __classes__, existing direct correspondence between class methods and each type of methods of HTTP requests. So, there are one class method representing each of HTTP request that one resource can handle.

```javascript
class MyResource extends Resource{
	constructor(){
		super(async function () {
	            (...)
	        });
	}
	static async fetch(){
		(...)
	}
	static async fetchOne(){
		(...)
	}
	async put(){
		(...)
	}
	async patch(){
		(...)
	}
	async delete(){
		(...)
	}
}
```

### Static vs Instance 

Attending to an object oriented aproach, there are a difference between the meaning of static methods and instance methods.

#### Static Methods

* Responsible for handle request that access a kind of factory where it is possible to access or insert data.
* Each one of static methods has a direct correspondence with all HTTP methods that can be applied to urls that match with __/(_resource_name_)/__ pattern.
* Insertion of data can be done using class constructor.
* Although access to only one element of collection must be done through a GET HTTP request to url __/(_resource_name_)/:id/__, this request is also mapped to a static method, because it is also considered an access to the collection, with the difference that parameter ID allow to filter the results and return only the object that match with the value of it.

* **Creating Objects**

```javascript
let obj = new RestaurantResource({data:{name:"restaurantName", address:"restaurantAddress"}});
 
curl -X POST \
  -d '{"name":"restaurantName","address":"restaurantAddress"}'\
  https://api.apey-eye.com/restaurant
```

* **List Objects**

```javascript
let list = RestaurantResource.fetch();
 
curl -X GET \
  https://api.apey-eye.com/restaurant
```

* **Access one object**

```javascript
let list = RestaurantResource.fetchOne({id:"6507da1f954a"});
 
curl -X GET \
  https://api.apey-eye.com/restaurant/6507da1f954a/
```

#### Instance Methods

* Responsible for operations that act directly in the objects such as object state update or delete objects.

* **Replace object**

```javascript
let obj = RestaurantResource.fetchOne({id:"6507da1f954a"});
obj.put({data: {name:"anotherRestaurantName",address:"anotherRestaurantAddress"});
 
curl -X PUT \
  -d '{"name":"anotherRestaurantName","address":"anotherRestaurantAddress"}'\
  https://api.apey-eye.com/restaurant/6507da1f954a/
```

* **Object state update**

```javascript
let obj = RestaurantResource.fetchOne({id:"6507da1f954a"});
obj.patch({data: {name:"anotherRestaurantName"});
 
curl -X PATCH \
  -d '{"name":"anotherRestaurantName"}'\
  https://api.apey-eye.com/restaurant/6507da1f954a/
```

* **Delete object**

```javascript
let obj = RestaurantResource.fetchOne({id:"6507da1f954a"});
obj.delete();
 
curl -X DELETE \
  https://api.apey-eye.com/restaurant/6507da1f954a/
```

### Decorators

There are several types of decorators that can be used in order to annotate or modify _Resource_ class.
Decorators allow to assign properties such as schemas to validate data, query parameters, output properties and also other properties related to access control like authentication and permissions.

####@Name

It receives a string representing an identifier for target _Resource_ in API.
This identifier is used when the _Resource_ is added to _Router_, if no path is specified then the identifier will be used to build the path where Resource will be available.
In a **NoBackend** approach, the Model that will be associated to the _Resource_ also will have this identifier.

```javascript
@Name("myResourceIdentifier")
class MyResource extends Resource{}
```

####@Input

It receives an _Input_ entity, where is presented the data schema that will be used to validate data received in API.

```javascript
@Input(inputObject)
class MyResource extends Resource{}
```

**Defining an _Input_**

```javascript
let restaurantInput = new Input({
	name:       {type: "string", required: true},
	year:       {type: "number", valid: yearValidator},
    created:    {type: "date", default: "now"},
    type:       {type: "string", choices: ["grill", "vegetarian", "fast-food", "japanese", (...) ]},
    phone:      {type: "string", regex: /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/}
});

let yearValidator = function(value){
  if(value <= 2015)
    return true;
  else
    throw new Error("Invalid year.");  
};
```

For the definition of each field of Input can be used the following properties:

* **type**: a string with type of data, "string", "number", "date", "boolean", "reference", "collection", "manyToMany".
* **required:** mandatory existence of data for the field
* **regex:** regular expression that value of the field may match
* **valid:** a function that will validate the value of field
* **choices:** a set of possible values for the field
* **default:** a default value for the field

If the value of the field represents a relation then there are other properties that should be used:

* **model**: a string with the identifier of the related _Model_.
* **inverse**: a string with the name of the field responsible for relationship in related _Model_.
* **through**: a string with the name of the intermediate _Model_ used to make possíble a _ManyToMany_ relationship.

####@Query

It receives an object with properties that will be used to query database like sort, filter and pagination.

* **_sort**: an array with field names that will be included in sorting and its order.
**example:** ["name", "-description"], sort by name ascending and by description in descending order.
* **_filter**: an object with values to filter results.
* **_page_size**: maximum number of results that will be included in response.

####@Output

It receives an object with properties that responses must follow like the set of fields and related objects that would be included.

* **_fields**: an array with fields names that will be included in response.
* **_embedded**: an array with fields that must include related object.

```javascript
@Output({
	_fields: ["name","categories"],
	_embedded: ["categories"],
})
class MyResource extends Resource{}
```

####@Format

It receives a render class that will be used to render all responses produced by Resource or its methods.

```javascript
@Format(JSONFormat)
class MyResource extends Resource{}
```

**Definition of render class**

It is necessary to create a new render class that inherits **BaseFormatter** and must implement **.format()** method responsible by render received data with target format.

It must be assigned through **@MediaType** decorator the content-type that will be included in response headers.

```javascript
@MediaType('application/text')
class TextFormat extends BaseFormatter{
    static format(data){
        return data.toString();
    }
}
```

####@Authentication

It receives a string indicating which mechanism of authentication will be used to authenticate requests to target *Resource*.

**Note:** There are some mechanisms of authentication already defined in framework like *Basic* and *Local*, however it is possible to define more custom mechanisms to use to validate requests.

```javascript
@Authentication('basic')
class MyResource extends Resource{}
```

####@Roles

It receives an array with identifiers of roles of users that are allowed to perform request to Resource.

```javascript
@Roles(['client', 'editor'])
class MyResource extends Resource{}
```

In framework there are models that represents both roles and users and allow to make a connection between users and which roles are related to them in the system.

By default, there are an hierarchical schema for roles that allow an user to access resources that are limited to other roles that are directly or indirectly related with user's role and have also an lower hierarchical level.

**Exemple:**

```javascript
let roleA = {
    id: "client",
    parentRole : "admin"
}
```
An user that are related to *"admin"* role also has access to *Resources* that are limited to *"client"* role.

## Router

In Apey Eye, the *Router* is the entity responsible to connect received HTTP requests *Resources** that exists in API and will handle them.

The framework was designed with the purpose to be independent of the type of Router that are in use allowing to be used different kinds of *Routers* according to developer preferences.
Thus it is possible to implement a *Router* through frameworks like Hapi, Koa, Express or others.

**Note:** There are just implemented and available *Routers* based on Hapi and Koa.

### Router.register

The entity *Router* has an method **.register()** that allows developers to connect *Resources* to API making them available to clients.

```javascript
router.register([{
        path: 'restaurant',
        resource: RestaurantResource
    },
    {
        path: 'address',
        resource: AddressResource
    }
]);
```


## Models

With regard to syntax, the *Models* are similar to *Resources*, promoting greater ease of assimilation of concepts by developer. Offering a similar interface, the progression in learning to use the framework is greater.

The *Models* are the entities responsible by communication between framework and database and thus the implementation of each *Model* must follow the type of database that it will connect.

This is one of the components that is implemented in an independent way, allowing framework to be agnostic from type of database, so it can implement *Models* for any database system.

### Class Based

Also *Models* are implemented through classes, and there exists direct connection between method of this class and *Resource* methods.

```javascript
class MyModel extends Model{
	constructor(){
		super(async function () {
	            (...)
	        });
	}
	static async fetch(){
		(...)
	}
	static async fetchOne(){
		(...)
	}
	async put(){
		(...)
	}
	async patch(){
		(...)
	}
	async delete(){
		(...)
	}
}
```

### Static vs Instance

Such as in *Resources** also in *Models* is applied an object oriented approach, and thus it exists a distinction between static and instance methods according the type of access that they want to do.

**Static Methods** intend to be the responsible methods for access and manipulation of data in a collection level, providing methods to insert new data or access data that exists in database.

**Instance Methods** intend to be the responsible for operations that change the internal state of one single object in database or even for operations that deletes the objects. 


### Decorators

Such as in *Resources* also in *Models* can be applied some decorators:

* **@Query**
* **@Output**
* **@Input**
* **@Name**

Almost all decorators have the same behavior in *Models* and in *Resources* with the exception of the **@Name**.
Although this decorator has a similar meaning than in *Resources*, in addiction to assign an identifier to the entity has one other goal.
It represents also the name used in database to represent the table that the *Model* will interact.


## Relations

Relations can be designed through the properties of *Input* entity.
If the value assigned to type of the *Input* fields represents a relation there are some properties that are mandatory depending of type of relation.

* **model:** a string with name of related model. **Mandatory for all kinds of relations**

### Reference

```javascript
var restaurantInput = new Input({
    (...),
    phone:{type: "reference", model:"phone"}
});
 
var phonesInput = new Input({
    phone: {type: "string", required: true}
});
```

**Creating objects with 'manyToMany'**

```javascript
curl -X POST \
  -d '{ "phone":"phoneID", (...) }'\
  https://api.apey-eye.com/restaurant
 
curl -X POST \
  -d '{ "phone" : "{"phone": "+351 222 222 222"}", (...) }'\
  https://api.apey-eye.com/restaurant
```

### Collection

* **inverse:** a string with name of field that ensure relationship in related model. 

```javascript
var restaurantInput = new Input({
    (...),
    addresses:{type: "collection", model:"address", inverse:"restaurant"}
});
 
var addressesInput = new Input({
    (...),
    restaurant: {type:"reference", model:"restaurant"}
});
```

**Creating objects with 'manyToMany'**

```javascript
//RESTAURANT
 
curl -X POST \
  -d '{ "addresses": ["addressID", ... ], (...) }'\
  https://api.apey-eye.com/restaurant
 
curl -X POST \
  -d '{ "addresses": [ { "address": "restaurantAddress" }, ... ], (...) }'\
  https://api.apey-eye.com/restaurant
 
//ADDRESS
 
curl -X POST \
  -d '{ "restaurant":"restaurantID", (...) }'\
  https://api.apey-eye.com/address
 
curl -X POST \
  -d '{ "restaurant":"{"name": "restaurantName"}", (...) }'\
  https://api.apey-eye.com/address
```

### ManyToMany

* **inverse:** a string with name of field that ensure relationship in related model. 
* **through:**  a string with the name of the intermediate *Model* used to make possíble a ManyToMany relationship.

```javascript
var restaurantInput = new Input({
    (...)
    categories:{type: "manyToMany", model:"category", inverse:"restaurant", through:"categoryRestaurant"}
});
var categoryInput = new Input({
    name: {type: "string", required: true},
    restaurants: {type: "manyToMany", model: "restaurant", inverse: "categories", through: "categoryRestaurant"}
});
 
var categoryRestaurantInput = new Input({
    category: {type:"reference", model:"category"},
    restaurant: {type:"reference", model:"restaurant"}
});
```

**Creating objects with 'manyToMany'**

```javascript
//RESTAURANT
 
curl -X POST \
  -d '{ "categories": ["categoryID", ... ],  (...) }'\
  https://api.apey-eye.com/restaurant
 
curl -X POST \
  -d '{ "categories": [ { "name": "category1" }, ... ], (...) }'\
  https://api.apey-eye.com/restaurant
 
//CATEGORY
 
curl -X POST \
  -d '{ "restaurants": ["restaurantID", ... ], (...) }'\
  https://api.apey-eye.com/category
 
curl -X POST \
  -d '{ "restaurants": [ { "name": "restaurantName" } ], (...) }'\
  https://api.apey-eye.com/category
```

## GenericResource

Besides the possibility of defining a *Resource* class in which the developer needs to build its own implementation, the developer can also use a Generic Resource class where are adopted the default implementation for each method.

```javascript
@Annotations.Model(MyModel)
class MyResource extends GenericResource {}
```

Simply through mentioned code it is possible to obtain a connection between *Resource* and the *Model* using the default implementation of Resource methods.

### Decorators

With GenericResource can be used all decorators already mentioned in this documentation but in addiction should be used others that are more appropriate in this context.

#### @Model

It receives a class that must inherit from *Model* and represents the entity through defined *Resource* will access database.
It will exists a direct connection between *GenericResource* methods and *Model* methods.

* new GenericResource → new Model
* GenericResource.fetch → Model.fetch
* GenericResource.fetchOne → Model.fetchOne
* (…)

```javascript
@Annotations.Model(MyModel)
class MyResource extends GenericResource {}
```

#### @Methods

It receives an array with identifiers of the methods that are allowed to use by clients of API.

```javascript
@Methods(['constructor', 'static.fetch'])
class MyResource extends GenericResource{}
```

## GenericRouter

Instead of use a common *Router*, in which is necessary to register all *Resources* that will be available by API, the framework still offer the possibility of use a *GenericRouter* 

This kind of *Router*, besides to allow the registration of Resources in a programmatic way also admits the development of applications following a **NoBackend** approach.

So, it is possible that Resources are created dynamically when the clients of API make requests to one endpoint that has no *Resource* allocated.

For the same request, these two approaches have different behaviors, for example:

```javascript
curl -X POST \
  -d '{ "phone": "+351 222 222 222"} }'\
  https://api.apey-eye.com/phone/
```

If you use a *Router* and haven't been registered no *Resources* for the path _"phone"_ the answer would be **Status: 404 Not Found**.

If you use a *GenericRouter* would be **Status: 200 OK**, and a new object would be created.

## Requests

```
http://api.path/


http://api.path/?_filter={"name":"Filipe"}

http://api.path/?_sort=["-name","age"]

http://api.path/?_fields=["_id", "name", "age", "BI"] NA RESPOSTA

http://api.path/?_embedded=["photos", "posts"]

http://api.path/?_page=1&_page_size=15         
                                              
http://api.path/?_format=json 
```
