'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
    value: true
});
/**
 * Created by Filipe on 17/04/2015.
 */

var _passportLocal = require('passport-local');

var _passportLocal2 = _interopRequireWildcard(_passportLocal);

var _passportHTTP = require('passport-http');

var _passportHTTP2 = _interopRequireWildcard(_passportHTTP);

var _co = require('co');

var _co2 = _interopRequireWildcard(_co);

var _ModelRegister = require('./ModelRegister.js');

var _ModelRegister2 = _interopRequireWildcard(_ModelRegister);

var _UserModel = require('./models/UserModel');

var _UserModel2 = _interopRequireWildcard(_UserModel);

var LocalStrategy = _passportLocal2['default'].Strategy;
var BasicStrategy = _passportHTTP2['default'].BasicStrategy;

var Auth = (function () {
    function Auth(passport) {
        _classCallCheck(this, Auth);

        passport.serializeUser(function (user, done) {
            done(null, user.id);
        });

        passport.deserializeUser(function (id, done) {
            var UserModel = _ModelRegister2['default'].model('user');
            UserModel.fetchOne({ id: id }).then(function (user) {
                done(null, user);
            })['catch'](function (err) {
                done(err, null);
            });
        });

        passport.use('local', new LocalStrategy({
            passReqToCallback: true // allows us to pass back the entire request to the callback
        }, function (req, username, password, done) {
            _UserModel2['default'].fetch({ resourceProperties: { _filter: { username: username } } }).then(function (usersList) {
                if (usersList.length == 0) {
                    done('User not found');
                } else if (usersList.length > 1) {
                    done('Error finding user with username equals to \'' + username + '\'');
                } else {
                    var user = usersList[0];
                    if (user.obj.password === password) {
                        done(null, user);
                    } else {
                        done('Invalid password');
                    }
                }
            });
        }));

        passport.use('basic', new BasicStrategy({
            passReqToCallback: true // allows us to pass back the entire request to the callback
        }, function (req, username, password, done) {
            _UserModel2['default'].fetch({ resourceProperties: { _filter: { username: username } } }).then(function (usersList) {
                if (usersList.length == 0) {
                    done('User not found');
                } else if (usersList.length > 1) {
                    done('Error finding user with username equals to \'' + username + '\'');
                } else {
                    var user = usersList[0];
                    if (user.obj.password === password) {
                        done(null, user);
                    } else {
                        done('Invalid password');
                    }
                }
            })['catch'](function (error) {
                console.error(error.stack);
                done('Error finding user');
            });
        }));
        this.passport = passport;
    }

    _createClass(Auth, [{
        key: 'authenticate',
        value: function authenticate() {
            return this.passport.authenticate.apply(this.passport, arguments);
        }
    }]);

    return Auth;
})();

exports['default'] = Auth;
module.exports = exports['default'];