/**
 * Created by Filipe on 17/03/2015.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Formatters = require('./Formatters');

var Formatters = _interopRequireWildcard(_Formatters);

var _DefaultProperties = require('./DefaultProperties');

var DefaultProperties = _interopRequireWildcard(_DefaultProperties);

var _negotiator = require('negotiator');

var _negotiator2 = _interopRequireDefault(_negotiator);

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

                var negotiator = new _negotiator2['default']({
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