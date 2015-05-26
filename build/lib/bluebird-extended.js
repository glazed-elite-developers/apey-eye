'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
    value: true
});
/**
 * Created by Filipe on 29/03/2015.
 */

var _Bluebird = require('bluebird');

var _Bluebird2 = _interopRequireWildcard(_Bluebird);

var _util = require('util');

var _util2 = _interopRequireWildcard(_util);

exports['default'] = Promise;

function Promise(factory) {
    if (!factory) {
        return false;
    }if (!(this instanceof Promise)) {
        return new Promise(factory);
    }this.factory = factory;
    var defer = this.defer = _Bluebird2['default'].defer();

    // copy pasted from Bluebird because Bluebird is fascist miserable adamntitely awful software which throws an error if you
    // try to innovate with it in the slightest. what the fuck bluebird? who died and made you the only permissible promise implementation?
    // https://github.com/petkaantonov/bluebird/blob/3e3a96aaa8586b0b6aa3b7ca432c03f58c295613/src/promise.js#L51
    this._bitField = 0;
    this._fulfillmentHandler0 = void 0;
    this._rejectionHandler0 = void 0;
    this._promise0 = void 0;
    this._receiver0 = void 0;
    this._settledValue = void 0;
    this._boundTo = void 0;
    this._resolveFromResolver(function (resolve, reject) {
        defer.promise.then(function (val) {
            resolve(val);
        }, function (err) {
            reject(err);
        });
    });
}
_util2['default'].inherits(Promise, _Bluebird2['default']);

Promise.prototype._then = function _then(didFulfill, didReject, didProgress, received, internalDate) {
    if (this.factory) {
        // run the factory
        var underlying = this.factory();
        this.factory = null;

        // set our own value
        if (underlying instanceof Error) // it's bad
            this.defer.reject(underlying);else // simple case
            this.defer.resolve(underlying);

        // call any thenevers
        for (var i = this.thenevers ? this.thenevers.length : 0; i > 0;) {
            this.defer.then.apply(this.defer, this.thenevers[--i]);
        }
    }
    return _Bluebird2['default'].prototype._then.call(this, didFulfill, didReject, didProgress, received, internalDate);
};
module.exports = exports['default'];