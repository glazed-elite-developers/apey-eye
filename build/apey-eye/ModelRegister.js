/**
 * Created by Filipe on 10/04/2015.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var singleton = Symbol();
var singletonEnforcer = Symbol();

var ModelRegister = (function () {
    function ModelRegister(enforcer) {
        _classCallCheck(this, ModelRegister);

        if (enforcer !== singletonEnforcer) {
            throw 'Cannot construct ModelRegister';
        }
        this.models = {};
    }

    _createClass(ModelRegister, [{
        key: 'register',
        value: function register(modelName, ModelClass) {
            var Model = require('./Model');

            if (!(ModelClass.prototype instanceof Model)) {
                throw new Error('ModelRegister: ' + ModelClass.name + ' class must be subclass of Model class');
            }

            if (this.models[modelName] === undefined) {
                this.models[modelName] = ModelClass;
            } else {
                throw new Error('ModelRegister: already exists a model with name \'' + modelName + '\'');
            }
        }
    }, {
        key: 'model',
        value: function model(modelName) {
            return this.models[modelName];
        }
    }, {
        key: 'empty',
        value: function empty() {
            this.models = {};
        }
    }], [{
        key: 'instance',
        value: function instance() {
            if (!this[singleton]) {
                this[singleton] = new ModelRegister(singletonEnforcer);
            }
            return this[singleton];
        }
    }]);

    return ModelRegister;
})();

exports['default'] = ModelRegister.instance();
module.exports = exports['default'];