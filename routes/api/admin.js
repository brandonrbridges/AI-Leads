const express = require('express')
const router = express.Router()

const User = require('../../database/models/user')

/**
 * Update Credits
 * 
 * @access admin
 * @type route
 */
router.post('/admin/update-credits', (req, res) => {
  let update = {
    credits: req.body.credits
  }
  
  User.findOneAndUpdate({ _id: req.query._id }, { $set: update }, { new: true }, (err, updated_user) => {
    if(err) throw err

    req.flash('administratorMessage', `${ updated_user.email } has had their credits updated.`)
    res.redirect('back')
  })
})

/**
 * Create Admin
 * 
 * @access admin
 * @type route
 */
router.post('/admin/create-admin', (req, res) => {
  let update = {
    admin: true
  }

  User.findOneAndUpdate({ _id: req.query._id }, { $set: update }, { new: true }, (err, updated_user) => {
    if(err) throw err

    req.flash('administratorMessage', `${ updated_user.email } has been granted Administrator privileges.`)
    res.redirect('back')
  })
})

/**
 * Revoke Admin
 * 
 * @access admin
 * @type route
 */
router.post('/admin/revoke-admin', (req, res) => {
  let update = {
    admin: false
  }

  User.findOneAndUpdate({ _id: req.query._id }, { $set: update }, { new: true }, (err, updated_user) => {
    if(err) throw err

    req.flash('administratorMessage', `Administrator privileges have been revoked from ${ updated_user.email }.`)
    res.redirect('back')
  })
})

/**
 * Delete User
 * 
 * @access admin
 * @type route
 */
router.post('/admin/delete-user', (req, res) => {
  User.findOneAndDelete({ _id: req.query._id })
  .then(deletedUser => {
    req.flash('administratorMessage', `User ${ deletedUser.email } has been deleted.`)
    res.redirect('back')
  })
})

module.exports = router