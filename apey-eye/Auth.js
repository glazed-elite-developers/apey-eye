/**
 * Created by GlazedSolutions on 17/04/2015.
 */
import passportLocal from 'passport-local';
import passportHTTP from 'passport-http';
import co from 'co';
import ModelRegister from './ModelRegister.js';
import UserModel from './models/UserModel';

let LocalStrategy = passportLocal.Strategy;
let BasicStrategy = passportHTTP.BasicStrategy;

class Auth{
    constructor(passport){

        passport.serializeUser(function (user, done) {
            done(null, user.id);
        });

        passport.deserializeUser(function (id, done) {
            let UserModel = ModelRegister.model('user');
            UserModel.fetchOne({id: id})
                .then(user => {
                    done(null, user);
                })
                .catch(err=> {
                    done(err, null);
                });
        });

        passport.use('local', new LocalStrategy({
                passReqToCallback: true // allows us to pass back the entire request to the callback
            }, function (req, username, password, done) {
                UserModel.fetch({resourceProperties: {_filter: {username: username}}}).then(usersList => {
                    if (usersList.length == 0) {
                        done("User not found")
                    }
                    else if (usersList.length > 1) {
                        done(`Error finding user with username equals to '${username}'`)
                    }
                    else {
                        let user = usersList[0];
                        if (user.obj.password === password) {
                            done(null, user)
                        }
                        else {
                            done("Invalid password");
                        }
                    }
                });
            }
        ));

        passport.use('basic', new BasicStrategy({
                passReqToCallback: true // allows us to pass back the entire request to the callback
            }, function (req, username, password, done) {
                UserModel.fetch({resourceProperties: {_filter: {username: username}}}).then(usersList => {
                    if (usersList.length == 0) {
                        done("User not found")
                    }
                    else if (usersList.length > 1) {
                        done(`Error finding user with username equals to '${username}'`)
                    }
                    else {
                        let user = usersList[0];
                        if (user.obj.password === password) {
                            done(null, user)
                        }
                        else {
                            done("Invalid password");
                        }
                    }
                })
                .catch( error => {
                        console.error(error.stack)
                        done("Error finding user");
                    });
            }
        ));
        this.passport = passport;

    }
    authenticate(){
        return this.passport.authenticate.apply(this.passport, arguments);
    }
}

export default Auth;
