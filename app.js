require('dotenv').config()

const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const flash = require('connect-flash')
const moment = require('moment')
const mongoose = require('mongoose')
const passport = require('passport')
const sass = require('node-sass-middleware')
const session = require('express-session')
// const stripe = require('stripe')(process.env.STRIPE_SECRET_TOKEN)

/**
 * Set View Engine
 */
app.set('view engine', 'ejs')

/**
 * Configure Flash
 */
app.use(flash())

/**
 * Configure SASS
 */
app.use(sass({
  src: __dirname + '/public/scss',
  dest: __dirname + '/public/css',
  debug: false,
  outputStyle: 'compressed',
  prefix: '/css'
}))

/**
 * Set /public as the Public Directory
 */
app.use(express.static('public'))

/**
 * Configure Body Parser
 */
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/**
 * Configure Session
 */
app.use(session({
  cookie: {
    expires: 600000
  },
  resave: false,
  saveUninitialized: false,
  secret: process.env.SECRET
}))

/**
 * Initialise and Configure Passport
 */
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')(passport)

// Allow req.user to be Global
app.use((req, res, next) => {
  res.locals.currentURL = req.url
  res.locals.logoURL = '/images/logo.png'
  res.locals.moment = moment
  res.locals.user = req.user
  next()
})

/**
 * Routes
 */
require('./routes/routes')(app, passport)
app.use('/api', require('./routes/api'))
app.use('/api', require('./routes/api/admin'))

/**
 * Connect to Database with Mongoose
 */
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.log(`MONGOOSE: Connected Successfully`)
}).then(() => {
  /**
   * Launch! 🚀
   */
  app.listen(process.env.PORT, () => {
    console.log(`APPLICATION: Launched Successfully - Listening on ${process.env.PORT}`)
  })
})