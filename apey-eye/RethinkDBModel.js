/**
 * Created by GlazedSolutions on 03/03/2015.
 */


import Model from './Model';
import RethinkDBAdapter from './RethinkDBAdapter';
import * as Exceptions from './Exceptions';
import _  from "underscore";

class RethinkDBModel extends Model {
    constructor(options = {}) {
        super();
        super(async () => {
            let ModelClass = this.constructor;

            await ModelClass._checkDataTable(true);
            await ModelClass.valid(options.data);

            let tableName = ModelClass.getName(),
                properties = ModelClass.joinProperties(options.resourceProperties, ModelClass.post),
                db = new RethinkDBAdapter(tableName);

            let obj = await db.insertObject(options.data, properties);

            obj = ModelClass._serialize(obj.id, obj);
            await ModelClass.processRelatedData(obj, options.data);
            await ModelClass.processOutput(obj, properties);
            return obj;
        });
    }

    static async fetch(options = {}) {

        let ModelClass = this,
            tableName = ModelClass.getName(ModelClass.fetch),
            properties = ModelClass.joinProperties(options.resourceProperties, ModelClass.fetch),
            db = new RethinkDBAdapter(tableName);

        await ModelClass._checkDataTable(false);
        let list = await db.getCollection(properties);
        return await ModelClass._serializeArray(list, properties);
    }

    static async fetchOne(options = {}) {
        let ModelClass = this,
            tableName = ModelClass.getName(ModelClass.fetchOne),
            properties = ModelClass.joinProperties(options.resourceProperties, ModelClass.fetchOne),
            db = new RethinkDBAdapter(tableName);
        await ModelClass._checkDataTable(false);
        let obj = await db.getObject(options.id, properties);
        if (!obj) {
            throw new Exceptions.NotFound(options.id);
        }
        else {
            obj = ModelClass._serialize(options.id, obj);
            await ModelClass.processOutput(obj, properties);

            return obj;
        }
    }

    async put(options = {}) {
        let ModelClass = this.constructor,
            tableName = ModelClass.getName(ModelClass.prototype.put),
            properties = ModelClass.joinProperties(options.resourceProperties, ModelClass.prototype.put),
            db = new RethinkDBAdapter(tableName);

        await ModelClass.valid(options.data);

        let newObj = await db.replaceObject(this.id, options.data, properties);

        this.oldObj = _.clone(newObj);
        this.obj = newObj;

        await ModelClass.processRelatedData(this, options.data, true);
        await ModelClass.processOutput(this, properties);

        return this;

    }

    async patch(options = {}) {
        let ModelClass = this.constructor,
            tableName = ModelClass.getName(ModelClass.prototype.patch),
            properties = ModelClass.joinProperties(options.resourceProperties, ModelClass.prototype.patch),
            db = new RethinkDBAdapter(tableName);


        let obj = await db.getObject(this.id, properties);
        if (!obj) {
            throw new Exceptions.NotFound(this.id);
        }
        else {

            let futureData = _.extend(obj, options.data);

            await ModelClass.valid(futureData);
            let newObj = await db.updateObject(this.id, options.data, properties);

            this.oldObj = _.clone(this.obj);
            this.obj = newObj;
            await ModelClass.processRelatedData(this, options.data, true);
            await ModelClass.processOutput(this, properties);

            return this;
        }
    }
    async delete() {
        let ModelClass = this.constructor,
            tableName = ModelClass.getName(ModelClass.prototype.patch),
            db = new RethinkDBAdapter(tableName);

        return await db.deleteObject(this.id);
    }

    static async _checkDataTable(create) {
        let ModelClass = this;

        if (!ModelClass.noBackend && !ModelClass.tableCreated) {
            let tableCreated = await RethinkDBAdapter.checkTableExists(this.getName());
            if (!tableCreated) {
                await RethinkDBAdapter.createTable(this.getName());
            }
            ModelClass.tableCreated = true;
        }
        else if (ModelClass.noBackend && !ModelClass.tableCreated && create) {
            let tableCreated = await RethinkDBAdapter.checkTableExists(this.getName());
            if (!tableCreated) {
                await RethinkDBAdapter.createTable(this.getName());
            }
            ModelClass.tableCreated = true;
        }
        else if (!ModelClass.tableCreated && !create && ModelClass.noBackend) {
            let tableCreated = await RethinkDBAdapter.checkTableExists(this.getName());
            if (!tableCreated) {
                throw new Exceptions.NotFound();
            }
        }
    }
}

export default RethinkDBModel;
