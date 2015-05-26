'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
    value: true
});
/**
 * Created by Filipe on 17/03/2015.
 */

var _import = require('./Formatters');

var Formatters = _interopRequireWildcard(_import);

var _import2 = require('./DefaultProperties');

var DefaultProperties = _interopRequireWildcard(_import2);

var _Negotiator = require('negotiator');

var _Negotiator2 = _interopRequireWildcard(_Negotiator);

var FormatNegotiator = (function () {
    function FormatNegotiator() {
        _classCallCheck(this, FormatNegotiator);
    }

    _createClass(FormatNegotiator, null, [{
        key: 'selectFormatter',
        value: function selectFormatter(requestProperties) {
            var formatters = Formatters.FormattersList,
                mediaTypeFormatters = {};

            if (formatters && formatters.length > 0) {
                formatters.forEach(function (formatter) {
                    var mediaType = formatter.getMediaType();
                    mediaTypeFormatters[mediaType] = formatter;
                });

                var negotiator = new _Negotiator2['default']({
                    headers: {
                        accept: requestProperties._format || requestProperties._mediaType
                    }
                });

                var mediaTypeAccepted = negotiator.mediaType(Object.keys(mediaTypeFormatters));
                var formatterAccepted = mediaTypeFormatters[mediaTypeAccepted];

                if (mediaTypeAccepted && formatterAccepted && formatterAccepted.prototype instanceof Formatters.BaseFormatter) {
                    return formatterAccepted;
                } else {
                    return DefaultProperties.Formatter;
                }
            } else {
                return DefaultProperties.Formatter;
                return DefaultProperties.Formatter;
            }
        }
    }]);

    return FormatNegotiator;
})();

exports['default'] = FormatNegotiator;
module.exports = exports['default'];