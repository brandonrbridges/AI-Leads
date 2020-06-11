const mongoose = require('mongoose')

const LocalStrategy = require('passport-local').Strategy

const User = require('../database/models/user')

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, 
  (req, email, password, done) => {
    process.nextTick(() => {
      User.findOne({ email: email }, (err, user) => {
        if(err) throw err

        if(user) {
          return done(null, false, req.flash('registerMessage', 'An account already exists with that email address.'))
        } else {
          var newUser = new User()

          newUser.email = req.body.email
          newUser.password = newUser.generateHash(req.body.password)
          newUser.name.first = req.body.firstName
          newUser.name.last = req.body.lastName

          newUser.save((err) => {
            if(err)
              throw err

            return done(null, newUser)
          })
        }
      })
    })
  }))

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, 
  (req, email, password, done) => {
    User.findOne({ email: email }, (err, user) => {
      if(err)
        throw err

      if(!user || !user.validPassword(password)) 
        return done(null, false, req.flash('loginMessage', `The information you entered does not match any account in our system. <a href="/register">Sign up for an account</a>.`))

      return done(null, user)
    })
  }))
}