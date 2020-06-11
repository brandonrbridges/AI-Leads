const isLoggedIn = require('./middleware/isLoggedIn')

const Users = require('../database/models/user')

module.exports = (app, passport) => {
  app.get('/', (req, res) => {
    res.render('index')
  })

  app.get('/administrator', isLoggedIn, (req, res) => {
    Users.find({ email: req.user.email }, {}, (err, user) => {
      if(req.user.admin) {
        Users.find({}, (err, users) => {
          if(err) throw err
    
          res.render('administrator', { message: req.flash('administratorMessage'), users: users })
        })
      } else {
        req.flash('dashboardMessage', 'You aren\'t allowed there. The Administrators have been notified.')
        res.redirect('/dashboard')
      }
    })
  })

  app.get('/contact-us', (req, res) => {
    res.render('contact-us')
  })

  app.get('/dashboard', isLoggedIn, (req, res) => {
    res.render('dashboard', { message: req.flash('dashboardMessage') })
  })

  app.get('/how-it-works', (req, res) => {
    res.render('how-it-works')
  })

  app.get('/login', (req, res) => {
    res.render('login', { message: req.flash('loginMessage') })
  })

  app.get('/logout', (req, res) => {
    req.logout()
    req.flash('loginMessage', 'You have been successfully logged out.')
    res.redirect('/login')
  })

  app.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile', { message: req.flash('profileMessage') })
  })

  app.get('/profile/settings', isLoggedIn, (req, res) => {
    res.render('settings', { message: req.flash('settingsMessage') })
  })

  app.get('/register', (req, res) => {
    res.render('register', { message: req.flash('registerMessage') })
  })

  app.get('/pricing', (req, res) => {
    res.render('pricing')
  })

  /**
   * Purchase Cancelled
   * 
   * @type route
   * @referrer stripe
   */
  app.get('/profile/purchase-cancelled', isLoggedIn, (req, res) => {
    res.render('stripe/purchase-cancelled')
  })

  /**
   * Purchase Successful
   * 
   * @type route
   * @referrer stripe
   */
  app.get('/profile/purchase-successful', isLoggedIn, (req, res) => {
    res.render('stripe/purchase-successful')
  })
}