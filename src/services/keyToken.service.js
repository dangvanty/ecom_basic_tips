'use strict'

const keytokenModel = require("../models/keytoken.model")

class KeyTokenService {
  static createKeyToken = async ({userId,privateKey, publicKey,refreshToken})=>{
    try {
      //lv0
      // const tokens = await keytokenModel.create({
      //   user:userId,
      //   publicKey,
      //   privateKey
      // })
      // return tokens ? tokens.publicKey : null

      //lvxx
      const filter = {user : userId}, update = {
        publicKey, privateKey, refreshTokenUsed:[],refreshToken
      }, options = {upsert:true,new:true}
      const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)
      // nếu chưa có thì insert, còn nếu có thì update
      return  tokens ? tokens.publicKey : null 
    } catch (error) {
      return error
    }
  }
}

module.exports = KeyTokenService