'use strict'

const accessService = require("../services/access.service")

class AccessController {
  signUp = async (req, res, next) => {
      const signUp=await accessService.signUp(req.body)
      return res.status(201).json(signUp)
  }
}

module.exports = new AccessController