import Bluebird from 'bluebird';
import util from 'util';

export default Promise;

function Promise(factory) {
    if (!factory)
        return false;
    if (!(this instanceof Promise))
        return new Promise(factory)

    this.factory = factory
    var defer = this.defer = Bluebird.defer()

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
            resolve(val)
        }, function (err) {
            reject(err)
        })
    })
}
util.inherits(Promise, Bluebird)

Promise.prototype._then = (function _then(didFulfill, didReject, didProgress, received, internalDate) {
    if (this.factory) {
        // run the factory
        var underlying = this.factory()
        this.factory = null

        // set our own value
        if (underlying instanceof Error) // it's bad
            this.defer.reject(underlying)
        else // simple case
            this.defer.resolve(underlying)

        // call any thenevers
        for (var i = this.thenevers ? this.thenevers.length : 0; i > 0;) {
            this.defer.then.apply(this.defer, this.thenevers[--i])
        }
    }
    return Bluebird.prototype._then.call(this, didFulfill, didReject, didProgress, received, internalDate)
})