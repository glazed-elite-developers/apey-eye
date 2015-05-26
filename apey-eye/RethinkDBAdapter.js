/**
 * Created by Filipe on 05/03/2015.
 */
import rethink from 'rethinkdbdash';
import * as Annotations from './Annotations';
import DatabaseConfig from './config/database.js';

var r = rethink({
    pool: false
});


class RethinkDBAdapter {
    static config = {
        host: DatabaseConfig.host,
        port: DatabaseConfig.port,
        db: DatabaseConfig.database,
    };
    constructor(tableName) {
        this.tableName = tableName;
    }
    static async createDatabase() {

        try {
            let c = await r.connect(RethinkDBAdapter.config);
            await r.dbCreate(DatabaseConfig.database).run(c);
        }
        catch (err) {
            if (err.message.indexOf("already exists") == -1) {
                throw err;
            }
        }
    }
    static async checkTableExists(tableName) {

        await RethinkDBAdapter.createDatabase();
        let c = await r.connect(RethinkDBAdapter.config);
        let list = await r.tableList().run(c);
        return list.indexOf(tableName) > -1;
    }

    static async createTable(tableName) {
        let c = await r.connect(RethinkDBAdapter.config);

        try {
            await r.tableCreate(tableName).run(c);
        }
        catch (err) {
            if (err.message.indexOf("already exists") == -1) {
                throw err;
            }
        }
    }

    async initializeQuery() {

        var table = this.tableName;

        try{
            this.connection = await r.connect(RethinkDBAdapter.config);
            this.query = r.table(table);
        }
        catch(err){
            throw new Error(`Database: Error creating a new connection to database. ${err.message}`);
        }
    }

    async runQuery() {
        return await this.query.run(this.connection)
    }

    async getCollection(properties = {}) {
        var self = this;
        await self.initializeQuery();

        self.addQueryFilters(properties._filter);
        self.addQuerySort(properties._sort);
        self.addQueryPagination(properties._pagination);

        return await self.runQuery();
    }

    async insertObject(data) {
        if (data) {
            var self = this;
            await self.initializeQuery();
            self.addQueryInsert(data);
            var results = await self.runQuery();

            if (results.inserted > 0) {
                return await results.changes[results.changes.length - 1].new_val;
            }
            else {
                if (results.errors > 0) {
                    console.error(results.first_error)
                }
                throw new Error(`Database: object not inserted.`);
            }
        }
        else {
            throw new Error(`Database: undefined data received`);
        }
    }

;
    async getObject(id) {
        if (id) {
            var self = this;
            await self.initializeQuery();
            self.addQueryGetData(id);
            return await self.runQuery();
        }
        else {
            throw new Error(`Database: undefined id received`);
        }
    }

    async replaceObject(id, data) {
        if (id) {
            var self = this;
            await self.initializeQuery();
            data.id = id;
            self.addQueryGetData(id);
            self.addQueryReplace(data);
            await self.runQuery();
            return await self.getObject(id);
        }
        else {
            throw new Error(`Database: undefined id received`);
        }
    }

    async updateObject(id, data) {
        if (id) {
            var self = this;
            await self.initializeQuery();
            data.id = id;
            self.addQueryGetData(id);
            self.addQueryUpdate(data);
            await self.runQuery();
            return await self.getObject(id);
        }
        else {
            throw new Error(`Database: undefined id received`);
        }
    }

    async deleteObject(id) {
        if (id) {
            var self = this;
            await self.initializeQuery();
            self.addQueryGetData(id);
            self.addQueryDelete();
            let obj = await self.runQuery();

            if (obj.deleted === 1) {
                return true;
            }
            else {
                throw new Error("RethinkDBAdapter: error deleting object from database.");
            }
        }
        else {
            throw new Error(`Database: undefined id received`);
        }
    }

    addQueryFilters(filters) {
        if (filters) {
            this.query = this.query.filter(filters);
        }
    }

    addQuerySort(sort) {
        if (sort) {
            let sortArray = [];
            sort.forEach(s => {
                let sortField = Object.keys(s)[0];
                let sortOrder = s[sortField];

                if (sortOrder === 1) {
                    sortArray.push(r.asc(sortField))
                }
                else if (sortOrder === -1) {
                    sortArray.push(r.desc(sortField))
                }
            });

            this.query = this.query.orderBy.apply(this.query, sortArray);
        }
    }

    addQueryPagination(pagination) {

        if (pagination) {
            var page = pagination._page || 1;
            var pageSize = pagination._page_size;
        }

        if (page && pageSize) {
            let lowerBound = (page - 1) * pageSize;
            let upBound = page * pageSize;
            this.query = this.query.slice(lowerBound, upBound);

        }
    }

    addQueryFields(fields) {

        if (fields) {
            this.query = this.query.pluck.apply(this.query, fields);
        }
    }

    addQueryInsert(data) {
        if (data) {
            this.query = this.query.insert(data, {returnChanges: true});
        }
    }

    addQueryGetData(id) {
        if (id) {
            this.query = this.query.get(id);
        }
    }

    addQueryReplace(data) {
        if (data) {
            this.query = this.query.replace(data);
        }
    }

    addQueryUpdate(data) {
        if (data) {
            this.query = this.query.update(data);
        }
    }

    addQueryDelete() {
        this.query = this.query.delete();
    }
}

export default RethinkDBAdapter;



