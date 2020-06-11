const express = require('express')
const router = express.Router()

const passport = require('passport')

const User = require('../database/models/user')

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const GSR = require('google-search-results-nodejs')
const client = new GSR.GoogleSearchResults(process.env.GSR_API_KEY)
const searchData = require('../public/data/webdesign_search.json')
const shoppingData = require('../public/data/webdesign_shopping.json')

/**
 * Register
 * 
 * @description Handled by Passport
 */
router.post('/register', passport.authenticate('local-signup', {
  successRedirect: '/dashboard',
  failureRedirect: '/register',
  failureFlash: true
}))

/**
 * Login
 * 
 * @description Handled by Passport
 */
router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true
}))

/**
 * Editing Profile
 * 
 * @route /edit-profile
 */
router.post('/edit-profile', (req, res) => {
  let filter = { email: req.user.email }

  let update = {
    'name.first': req.body.firstName,
    'name.last': req.body.lastName,
  }

  User.findOneAndUpdate(filter, { $set: update }, { new: true }, (err, user) => {
    if(err) throw err
  })
  .then(() => {
    req.flash('settingsMessage', 'Your profile has been updated.')
    res.redirect('back')
  })
  .catch((err) => {
    req.flash('settingsMessage', 'There was an error updating your profile.')
    res.redirect('back')
  })
})

/**
 * Search the API
 */
router.get('/search/:term', (req, res) => {
  var params = {
    engine: 'google',
    q: req.params.term,
    location: 'England, United Kingdom',
    google_domain: 'google.co.uk',
    gl: 'uk',
    hl: 'en',
		no_cache: 'true',
    filter: '0',
  }

  User.findOneAndUpdate({ _id: req.user._id }, { $inc: { credits: -1 } }, { new: true }, (err, updatedUser) => {
    // client.json(params, (data) => {
    //   console.log(data)
    //   res.send(data)
    // })
    
    console.log(searchData)
    res.send(searchData)
  })
})

require('./api/admin')

module.exports = router