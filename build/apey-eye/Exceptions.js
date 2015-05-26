/**
 * Created by Filipe on 19/03/2015.
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var NotFound = (function (_Error) {
    function NotFound(id) {
        _classCallCheck(this, NotFound);

        _get(Object.getPrototypeOf(NotFound.prototype), "constructor", this).call(this);
        if (id) {
            this.message = "" + id + " not found";
        } else {
            this.message = "Not Found";
        }
    }

    _inherits(NotFound, _Error);

    return NotFound;
})(Error);

var ModelNotFound = (function (_Error2) {
    function ModelNotFound(resourceName) {
        _classCallCheck(this, ModelNotFound);

        _get(Object.getPrototypeOf(ModelNotFound.prototype), "constructor", this).call(this);
        if (resourceName) {
            this.message = "Model not found for resource '" + resourceName + "'.";
        } else {
            this.message = "Model not found for this resource.'";
        }
    }

    _inherits(ModelNotFound, _Error2);

    return ModelNotFound;
})(Error);

var MethodNotAllowed = (function (_Error3) {
    function MethodNotAllowed() {
        _classCallCheck(this, MethodNotAllowed);

        _get(Object.getPrototypeOf(MethodNotAllowed.prototype), "constructor", this).call(this);
        this.message = "Method not allowed";
    }

    _inherits(MethodNotAllowed, _Error3);

    return MethodNotAllowed;
})(Error);

var NotImplemented = (function (_Error4) {
    function NotImplemented() {
        _classCallCheck(this, NotImplemented);

        _get(Object.getPrototypeOf(NotImplemented.prototype), "constructor", this).call(this);
        this.message = "Method not implemented";
    }

    _inherits(NotImplemented, _Error4);

    return NotImplemented;
})(Error);

var BadRequest = (function (_Error5) {
    function BadRequest(message) {
        _classCallCheck(this, BadRequest);

        _get(Object.getPrototypeOf(BadRequest.prototype), "constructor", this).call(this);
        this.message = "Bad Request: " + message;
    }

    _inherits(BadRequest, _Error5);

    return BadRequest;
})(Error);

var Unauthorized = (function (_Error6) {
    function Unauthorized() {
        _classCallCheck(this, Unauthorized);

        _get(Object.getPrototypeOf(Unauthorized.prototype), "constructor", this).call(this);
    }

    _inherits(Unauthorized, _Error6);

    return Unauthorized;
})(Error);

var Forbidden = (function (_Error7) {
    function Forbidden() {
        _classCallCheck(this, Forbidden);

        _get(Object.getPrototypeOf(Forbidden.prototype), "constructor", this).call(this);
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