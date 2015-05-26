/**
 * Created by Filipe on 05/03/2015.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _rethinkdbdash = require('rethinkdbdash');

var _rethinkdbdash2 = _interopRequireDefault(_rethinkdbdash);

var _Annotations = require('./Annotations');

var Annotations = _interopRequireWildcard(_Annotations);

var _configDatabaseJs = require('./config/database.js');

var _configDatabaseJs2 = _interopRequireDefault(_configDatabaseJs);

var r = (0, _rethinkdbdash2['default'])({
    pool: false
});

var RethinkDBAdapter = (function () {
    function RethinkDBAdapter(tableName) {
        _classCallCheck(this, RethinkDBAdapter);

        this.tableName = tableName;
    }

    _createClass(RethinkDBAdapter, [{
        key: 'initializeQuery',
        value: _asyncToGenerator(function* () {

            var table = this.tableName;

            try {
                this.connection = yield r.connect(RethinkDBAdapter.config);
                this.query = r.table(table);
            } catch (err) {
                throw new Error('Database: Error creating a new connection to database. ' + err.message);
            }
        })
    }, {
        key: 'runQuery',
        value: _asyncToGenerator(function* () {
            return yield this.query.run(this.connection);
        })
    }, {
        key: 'getCollection',
        value: _asyncToGenerator(function* () {
            var properties = arguments[0] === undefined ? {} : arguments[0];

            var self = this;
            yield self.initializeQuery();

            self.addQueryFilters(properties._filter);
            self.addQuerySort(properties._sort);
            self.addQueryPagination(properties._pagination);

            return yield self.runQuery();
        })
    }, {
        key: 'insertObject',
        value: _asyncToGenerator(function* (data) {
            if (data) {
                var self = this;
                yield self.initializeQuery();
                self.addQueryInsert(data);
                var results = yield self.runQuery();

                if (results.inserted > 0) {
                    return yield results.changes[results.changes.length - 1].new_val;
                } else {
                    if (results.errors > 0) {
                        console.error(results.first_error);
                    }
                    throw new Error('Database: object not inserted.');
                }
            } else {
                throw new Error('Database: undefined data received');
            }
        })
    }, {
        key: 'getObject',
        value: _asyncToGenerator(function* (id) {
            if (id) {
                var self = this;
                yield self.initializeQuery();
                self.addQueryGetData(id);
                return yield self.runQuery();
            } else {
                throw new Error('Database: undefined id received');
            }
        })
    }, {
        key: 'replaceObject',
        value: _asyncToGenerator(function* (id, data) {
            if (id) {
                var self = this;
                yield self.initializeQuery();
                data.id = id;
                self.addQueryGetData(id);
                self.addQueryReplace(data);
                yield self.runQuery();
                return yield self.getObject(id);
            } else {
                throw new Error('Database: undefined id received');
            }
        })
    }, {
        key: 'updateObject',
        value: _asyncToGenerator(function* (id, data) {
            if (id) {
                var self = this;
                yield self.initializeQuery();
                data.id = id;
                self.addQueryGetData(id);
                self.addQueryUpdate(data);
                yield self.runQuery();
                return yield self.getObject(id);
            } else {
                throw new Error('Database: undefined id received');
            }
        })
    }, {
        key: 'deleteObject',
        value: _asyncToGenerator(function* (id) {
            if (id) {
                var self = this;
                yield self.initializeQuery();
                self.addQueryGetData(id);
                self.addQueryDelete();
                var obj = yield self.runQuery();

                if (obj.deleted === 1) {
                    return true;
                } else {
                    throw new Error('RethinkDBAdapter: error deleting object from database.');
                }
            } else {
                throw new Error('Database: undefined id received');
            }
        })
    }, {
        key: 'addQueryFilters',
        value: function addQueryFilters(filters) {
            if (filters) {
                this.query = this.query.filter(filters);
            }
        }
    }, {
        key: 'addQuerySort',
        value: function addQuerySort(sort) {
            var _this = this;

            if (sort) {
                (function () {
                    var sortArray = [];
                    sort.forEach(function (s) {
                        var sortField = Object.keys(s)[0];
                        var sortOrder = s[sortField];

                        if (sortOrder === 1) {
                            sortArray.push(r.asc(sortField));
                        } else if (sortOrder === -1) {
                            sortArray.push(r.desc(sortField));
                        }
                    });

                    _this.query = _this.query.orderBy.apply(_this.query, sortArray);
                })();
            }
        }
    }, {
        key: 'addQueryPagination',
        value: function addQueryPagination(pagination) {

            if (pagination) {
                var page = pagination._page || 1;
                var pageSize = pagination._page_size;
            }

            if (page && pageSize) {
                var lowerBound = (page - 1) * pageSize;
                var upBound = page * pageSize;
                this.query = this.query.slice(lowerBound, upBound);
            }
        }
    }, {
        key: 'addQueryFields',
        value: function addQueryFields(fields) {

            if (fields) {
                this.query = this.query.pluck.apply(this.query, fields);
            }
        }
    }, {
        key: 'addQueryInsert',
        value: function addQueryInsert(data) {
            if (data) {
                this.query = this.query.insert(data, { returnChanges: true });
            }
        }
    }, {
        key: 'addQueryGetData',
        value: function addQueryGetData(id) {
            if (id) {
                this.query = this.query.get(id);
            }
        }
    }, {
        key: 'addQueryReplace',
        value: function addQueryReplace(data) {
            if (data) {
                this.query = this.query.replace(data);
            }
        }
    }, {
        key: 'addQueryUpdate',
        value: function addQueryUpdate(data) {
            if (data) {
                this.query = this.query.update(data);
            }
        }
    }, {
        key: 'addQueryDelete',
        value: function addQueryDelete() {
            this.query = this.query['delete']();
        }
    }], [{
        key: 'config',
        value: {
            host: _configDatabaseJs2['default'].host,
            port: _configDatabaseJs2['default'].port,
            db: _configDatabaseJs2['default'].database },
        enumerable: true
    }, {
        key: 'createDatabase',
        value: _asyncToGenerator(function* () {

            try {
                var c = yield r.connect(RethinkDBAdapter.config);
                yield r.dbCreate(_configDatabaseJs2['default'].database).run(c);
            } catch (err) {
                if (err.message.indexOf('already exists') == -1) {
                    throw err;
                }
            }
        })
    }, {
        key: 'checkTableExists',
        value: _asyncToGenerator(function* (tableName) {

            yield RethinkDBAdapter.createDatabase();
            var c = yield r.connect(RethinkDBAdapter.config);
            var list = yield r.tableList().run(c);
            return list.indexOf(tableName) > -1;
        })
    }, {
        key: 'createTable',
        value: _asyncToGenerator(function* (tableName) {
            var c = yield r.connect(RethinkDBAdapter.config);

            try {
                yield r.tableCreate(tableName).run(c);
            } catch (err) {
                if (err.message.indexOf('already exists') == -1) {
                    throw err;
                }
            }
        })
    }]);

    return RethinkDBAdapter;
})();

exports['default'] = RethinkDBAdapter;
module.exports = exports['default'];