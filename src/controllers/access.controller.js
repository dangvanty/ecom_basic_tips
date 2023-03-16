'use strict'

const accessService = require("../services/access.service")
const {OK,CREATED} =require('../core/success.response')
class AccessController {
  signUp = async (req, res, next) => {
      const signUpData = await accessService.signUp(req.body)
      new CREATED({
        message:"Registerted OK!",
        metadata: signUpData,
        options: {
          limit: 10 // test với option - mục đích để mô tả api
        }
      }).send(res)
  }
}

module.exports = new AccessController