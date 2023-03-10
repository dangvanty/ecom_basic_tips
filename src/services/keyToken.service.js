'use strict'

const keytokenModel = require("../models/keytoken.model")

class KeyTokenService {
  static createKeyToken = async ({userId,privateKey, publicKey})=>{
    try {
      const tokens = await keytokenModel.create({
        user:userId,
        publicKey,
        privateKey
      })
      return tokens ? tokens.publicKey : null
    } catch (error) {
      
    }
  }
}

module.exports = KeyTokenService