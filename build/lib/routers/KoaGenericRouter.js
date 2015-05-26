'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
    value: true
});
/**
 * Created by Filipe on 03/03/2015.
 */

var _KoaRouter2 = require('./KoaRouter');

var _KoaRouter3 = _interopRequireWildcard(_KoaRouter2);

var _HTTPCodes = require('./../HTTPCodes');

var _HTTPCodes2 = _interopRequireWildcard(_HTTPCodes);

var _RouterConfig = require('../../config/router.js');

var _RouterConfig2 = _interopRequireWildcard(_RouterConfig);

var KoaGenericRouter = (function (_KoaRouter) {
    function KoaGenericRouter() {
        _classCallCheck(this, KoaGenericRouter);

        _get(Object.getPrototypeOf(KoaGenericRouter.prototype), 'constructor', this).call(this);
        this.appendGenericRouter();
    }

    _inherits(KoaGenericRouter, _KoaRouter);

    _createClass(KoaGenericRouter, [{
        key: 'appendGenericRouter',
        value: function appendGenericRouter() {
            var self = this;

            this.router.use(function* (next) {

                yield next;
                if (this.status === _HTTPCodes2['default'].notFound) {
                    var path = this.path.slice(_RouterConfig2['default'].basePath.length);
                    var resourceName = _KoaRouter3['default'].resourceName(path);
                    if (resourceName) {
                        var newResourceClass = _KoaRouter3['default'].createGenericResourceClass(resourceName);

                        self.register([{
                            path: '' + resourceName,
                            resource: newResourceClass
                        }]);

                        this.redirect(this.request.url);
                        this.status = _HTTPCodes2['default'].temporaryRedirect;
                    }
                }
            });
        }
    }]);

    return KoaGenericRouter;
})(_KoaRouter3['default']);

exports['default'] = KoaGenericRouter;
module.exports = exports['default'];