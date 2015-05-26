/**
 * Created by Filipe on 03/03/2015.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _KoaRouter2 = require('./KoaRouter');

var _KoaRouter3 = _interopRequireDefault(_KoaRouter2);

var _HTTPCodes = require('./../HTTPCodes');

var _HTTPCodes2 = _interopRequireDefault(_HTTPCodes);

var _configRouterJs = require('../config/router.js');

var _configRouterJs2 = _interopRequireDefault(_configRouterJs);

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
                    var path = this.path.slice(_configRouterJs2['default'].basePath.length);
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