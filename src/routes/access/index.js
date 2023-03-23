const express = require('express')
const { authentication } = require('../../auth/authUtils')
const accessController = require('../../controllers/access.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const router = express.Router()


router.post('/shop/signup',asyncHandler(accessController.signUp) )
router.post('/shop/login',asyncHandler(accessController.login) )


// Authentication:
router.use(authentication)
/////////////////
router.post('/shop/logout',asyncHandler(accessController.logout) )


module.exports = router