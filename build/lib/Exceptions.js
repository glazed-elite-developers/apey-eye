"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Created by Filipe on 19/03/2015.
 */

var NotFound = (function (_Error) {
    function NotFound(id) {
        _classCallCheck(this, NotFound);

        var _this = new _Error();

        _this.__proto__ = NotFound.prototype;

        if (id) {
            _this.message = "" + id + " not found";
        } else {
            _this.message = "Not Found";
        }
        return _this;
    }

    _inherits(NotFound, _Error);

    return NotFound;
})(Error);

var ModelNotFound = (function (_Error2) {
    function ModelNotFound(resourceName) {
        _classCallCheck(this, ModelNotFound);

        var _this2 = new _Error2();

        _this2.__proto__ = ModelNotFound.prototype;

        if (resourceName) {
            _this2.message = "Model not found for resource '" + resourceName + "'.";
        } else {
            _this2.message = "Model not found for this resource.'";
        }
        return _this2;
    }

    _inherits(ModelNotFound, _Error2);

    return ModelNotFound;
})(Error);

var MethodNotAllowed = (function (_Error3) {
    function MethodNotAllowed() {
        _classCallCheck(this, MethodNotAllowed);

        var _this3 = new _Error3();

        _this3.__proto__ = MethodNotAllowed.prototype;

        _this3.message = "Method not allowed";
        return _this3;
    }

    _inherits(MethodNotAllowed, _Error3);

    return MethodNotAllowed;
})(Error);

var NotImplemented = (function (_Error4) {
    function NotImplemented() {
        _classCallCheck(this, NotImplemented);

        var _this4 = new _Error4();

        _this4.__proto__ = NotImplemented.prototype;

        _this4.message = "Method not implemented";
        return _this4;
    }

    _inherits(NotImplemented, _Error4);

    return NotImplemented;
})(Error);

var BadRequest = (function (_Error5) {
    function BadRequest(message) {
        _classCallCheck(this, BadRequest);

        var _this5 = new _Error5();

        _this5.__proto__ = BadRequest.prototype;

        _this5.message = "Bad Request: " + message;
        return _this5;
    }

    _inherits(BadRequest, _Error5);

    return BadRequest;
})(Error);

var Unauthorized = (function (_Error6) {
    function Unauthorized() {
        _classCallCheck(this, Unauthorized);

        var _this6 = new _Error6();

        _this6.__proto__ = Unauthorized.prototype;
        _this6;
        return _this6;
    }

    _inherits(Unauthorized, _Error6);

    return Unauthorized;
})(Error);

var Forbidden = (function (_Error7) {
    function Forbidden() {
        _classCallCheck(this, Forbidden);

        var _this7 = new _Error7();

        _this7.__proto__ = Forbidden.prototype;
        _this7;
        return _this7;
    }

    _inherits(Forbidden, _Error7);

    return Forbidden;
})(Error);

exports.NotFound = NotFound;
exports.ModelNotFound = ModelNotFound;
exports.MethodNotAllowed = MethodNotAllowed;
exports.NotImplemented = NotImplemented;
exports.BadRequest = BadRequest;
exports.Unauthorized = Unauthorized;
exports.Forbidden = Forbidden;